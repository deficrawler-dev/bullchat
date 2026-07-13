# BullChat Database Specification

Version: 2.4

Status: Production Architecture (Approved)

---

# Changelog from v2.0

This revision reconciles the v2.0 specification with what is already
implemented and live in the BullChat Supabase project, per the
Milestone 1 Phase 1 audit and the approved decisions that followed it.

- **`users.id` remains the Supabase Auth ID directly** (`id references
  auth.users(id)`). The `auth_id`-as-a-separate-column design proposed
  in v2.0 is **not** adopted — every RLS policy, trigger, and
  `SECURITY DEFINER` function already built compares `auth.uid()` to
  `id`, and that continues to work unchanged under this revision.
- `users` gains the new v2.0 fields that don't conflict with the above:
  `role`, `status`, `reputation_score`, `spam_score`, `deleted_at`, and
  a `wallet_address` uniqueness constraint. `auth_provider` and
  `username_changed_at` — present in the live schema but missing from
  v2.0 — are retained, since nothing in v2.0 called for their removal.
- **Recovery Passcode** (Anonymous account recovery) is restored as an
  official, documented feature. Its omission from v2.0 was accidental.
  The full existing implementation — bcrypt verification, HMAC-indexed
  O(1) lookup, key-versioning schema — is documented in Part 1A.
- **Reserved Usernames** is restored as an official, documented
  feature, in Part 1A.
- **Username format validation stays entirely in the application
  layer** (`src/services/users/validation.ts`), not the database
  schema — `users.username` has no `CHECK` constraint on format, only
  a `citext` uniqueness constraint. This is an explicit, deliberate
  choice, not an oversight.
- Every other table, enum, function, trigger, view, storage bucket, and
  standard from v2.0 is carried forward as specified. Part 4
  (Moderation & Anti-Spam) in particular is unchanged from v2.0 and
  should be implemented exactly as written there.

**v2.2 addendum:** the open RLS flag from v2.1 is now resolved.
`users` is internal-only (owner/admin read), matching v2.0's original
intent. `profiles` — the table plus two new `SECURITY DEFINER`
functions introduced in this revision (Part 1B) — is the public-facing
surface for username, display name, avatar, bio, badges, and
reputation. This was the one piece of v2.1 left unresolved pending
explicit confirmation; it's now final.

**v2.3 addendum:** verified the v2.2 design against current
Postgres/Supabase guidance, as requested. The original `public_profiles`
**view** has been replaced with two `SECURITY DEFINER` **functions**
(`get_public_profile`, `list_public_profiles`) — a plain view bypassing
RLS by default is exactly what Supabase's Security Advisor flags as a
"Security Definer View" warning, and the documented fix
(`security_invoker = true`) doesn't work for this use case, since it
would make the view enforce `users`' owner/admin RLS for the caller and
return nothing for other users' profiles. Functions are the correct,
Supabase-recommended pattern for this — see Part 1B for the full
reasoning.

**v2.4 addendum:** added a third `SECURITY DEFINER` function,
`search_public_profiles`, to Part 1B — same column allowlist as
`list_public_profiles`, plus a text query matched against username,
display name, headline, and skills. This is the single backend for
Global Search, Member Search, and @mention autocomplete, so those three
features share one implementation and one exposed column set rather
than three separately-maintained queries.
- **Resolved: `users` is internal-only.** `users` now holds RLS
  restricting SELECT/UPDATE to the row's owner and administrators —
  the public-read policy live in production (`"Profiles are publicly
  readable" using (true)`) is explicitly **replaced**, not preserved,
  per this final decision. **`profiles` is the public-facing surface**
  for user-identity information: username, display name, avatar, bio,
  badges, and reputation (where exposed publicly) are all readable
  through `profiles` and the `get_public_profile` /
  `list_public_profiles` functions (Part 1B),
  never by querying `users` directly. See Part 1B for the mechanism —
  the identity fields that must stay authoritative on `users` (for the
  reserved-username and cooldown triggers already built in Part 1A)
  are exposed publicly through a dedicated view rather than by
  loosening `users`' own RLS.

---

# Purpose

This document defines the complete database architecture for BullChat.

It serves as the single source of truth for:

- Database design
- Relationships
- Constraints
- Security
- Row Level Security (RLS)
- Performance
- Realtime architecture
- Future scalability

This document should be followed exactly when implementing BullChat in
Supabase.

---

# Database Philosophy

BullChat is designed to scale from:

One Community

↓

Many Communities

↓

Large Web3 Ecosystem

The database must never assume there is only one community.

Although Version 1 launches exclusively for the $ANSEM community, the
schema must support multiple communities without requiring structural
redesign.

Every table should prioritize:

- Performance
- Simplicity
- Security
- Scalability
- Reusability

---

# Database Engine

Provider

Supabase

Engine

PostgreSQL

Features Used

- Row Level Security
- Realtime
- Storage
- Functions
- Triggers
- Views
- Full Text Search
- Extensions

---

# UUID Standard

Every primary key uses UUID.

Example

id UUID PRIMARY KEY

Never use integer IDs.

UUIDs improve security and simplify distributed systems.

**Exception, by design:** `users.id` is not a freshly generated UUID —
it is set equal to `auth.users.id` at row creation, so the BullChat
profile and the Supabase Auth identity share one id. This is the one
place in the schema where the id is inherited rather than generated,
and it is intentional (see Part 1A).

---

# Timestamp Standard

Every table should include:

created_at

updated_at

Type

TIMESTAMPTZ

Timezone

UTC

Never store local time.

---

# Soft Delete Standard

Never permanently delete user-generated content.

Instead use:

deleted_at

If NULL

Record is active.

If populated

Record is soft deleted.

Admins may permanently purge data later.

---

# Naming Convention

Tables

snake_case

Examples

users

profiles

community_rooms

messages

spam_events

Columns

snake_case

Examples

display_name

wallet_address

created_at

Foreign Keys

Always end with "_id"

Examples

user_id

room_id

message_id

community_id

---

# Core Enums

## User Role

```sql
user_role

anonymous

member

verified

moderator

admin

owner
```

---

## User Status

```sql
active

restricted

muted

suspended

banned
```

---

## Community Visibility

```sql
public

private

invite_only
```

---

## Room Type

```sql
general

alpha

support

announcements

memes

voice

admin
```

---

## Message Status

```sql
visible

edited

hidden

deleted

flagged
```

---

## Notification Type

```sql
mention

reply

reaction

follow

system

moderation

announcement
```

---

## Moderation Status

```sql
pending

approved

rejected

resolved
```

---

## Spam Severity

```sql
low

medium

high

critical
```

---

# Entity Relationship Overview

```
users (internal — owner/admin read only)
 │
 ├── reserved_usernames (lookup — not a per-user FK, see Part 1A)
 │
 ├── recovery_passcodes
 │
 ├── get_public_profile() / list_public_profiles() /
 │     search_public_profiles() (SECURITY DEFINER
 │     functions — public read of an explicit column allowlist from
 │     users + profiles, see Part 1B)
 │
 ├── profiles (public-facing extended data)
 │
 ├── follows
 │
 ├── notifications
 │
 ├── messages
 │
 ├── reactions
 │
 ├── direct_messages
 │
 ├── spam_events
 │
 └── moderation_actions

communities
 │
 ├── rooms
 │
 ├── community_members
 │
 ├── approved_tokens
 │
 └── announcements

rooms
 │
 ├── messages
 │
 ├── pinned_messages
 │
 └── room_members
```

---

# TABLE: users

Purpose

Stores BullChat's core account record. Supabase Auth remains the
authentication provider; this table is the BullChat-specific profile
and account-state record for that identity.

**`id` is the Supabase Auth ID, not a separately generated UUID** —
`id references auth.users(id) on delete cascade`. This is the
foundation every existing RLS policy, trigger, and function is built
on, and it is retained unchanged from the live implementation.

Columns

| Column | Type | Notes |
|---------|------|------|
| id | UUID | Primary Key. `references auth.users(id)`. Equals the Supabase Auth identity's own id — not independently generated. |
| username | CITEXT | Unique, case-insensitive. Format rules (length, allowed characters) are enforced in the application layer, not here — see Part 1A. |
| username_changed_at | TIMESTAMPTZ | Backs the 30-day username-change cooldown (Part 1A). Not present in the v2.0 draft; retained from the live schema. |
| display_name | TEXT | |
| email | TEXT | Nullable — Anonymous accounts have no email until upgraded. |
| auth_provider | TEXT | `x`, `google`, or `anonymous`. Not present in the v2.0 draft; retained from the live schema, since Supabase Auth's own provider metadata isn't always convenient to query from RLS/trigger contexts, and this column makes provider-specific logic (e.g. Anonymous-only features) simple. |
| avatar_url | TEXT | Nullable |
| cover_image_url | TEXT | Nullable |
| bio | TEXT | Nullable |
| wallet_address | TEXT | Nullable, unique when present (`UNIQUE NULLS DISTINCT` — new in this revision, from v2.0) |
| country | TEXT | Nullable |
| role | user_role | Default `member`. New in this revision, from v2.0. |
| status | user_status | Default `active`. New in this revision, from v2.0. |
| reputation_score | INTEGER | Default 0. New in this revision, from v2.0. |
| spam_score | INTEGER | Default 0. New in this revision, from v2.0. |
| last_seen | TIMESTAMPTZ | Nullable |
| is_online | BOOLEAN | Default false. Retained from the live schema (v2.0 omitted this in favor of the separate `user_presence` table in Part 3 — both are kept: `is_online` for a cheap denormalized flag, `user_presence` for richer realtime state). |
| deleted_at | TIMESTAMPTZ | Nullable — soft delete. New in this revision, from v2.0. |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

Indexes

- username
- wallet_address
- status
- reputation_score
- role

Constraints

- username UNIQUE (via `citext`)
- wallet_address UNIQUE NULLS DISTINCT
- auth_provider CHECK (`x`, `google`, `anonymous`)

Row Level Security

- **SELECT:** owner or administrator only (`auth.uid() = id OR
  auth.uid() in (select user_id from admin_users)` — or equivalently,
  checking `role in ('admin', 'owner')` on the caller's own row; exact
  predicate to be finalized during implementation). This **replaces**
  the public-read policy live in production today — see Changelog.
  Public-facing identity data is served through `profiles` and the
  `get_public_profile` / `list_public_profiles` functions instead
  (Part 1B).
- **INSERT:** owner only (`auth.uid() = id`)
- **UPDATE:** owner only (`auth.uid() = id`); administrators may update
  moderation-relevant fields (`role`, `status`, `spam_score`) through a
  separate, more restrictive policy or a `SECURITY DEFINER` function —
  not a blanket admin UPDATE grant on the whole row.
- **DELETE:** no client policy — account deletion is a future,
  confirmation-gated Settings flow, not a bare RLS grant.

Relationships

users

↓

reserved_usernames (lookup table, not a foreign key relationship)

recovery_passcodes

profiles

messages

notifications

followers

spam_events

moderation_actions

---

# Part 1A — Authentication Extensions

Two features live entirely under `public.users` and its supporting
tables, and are official parts of BullChat even though they don't
appear in the general entity relationship diagram above as
community-facing features. Both are already implemented and in
production use; this section documents them as the authoritative
specification.

---

## Username Format Validation

Username format (length, character set, underscore placement) is
**application-layer validation only** — there is no `CHECK` constraint
on `users.username` enforcing it. The database enforces uniqueness
(via `citext`) and the rules below (reservation, cooldown); everything
about what a valid username *looks like* lives in
`src/services/users/validation.ts`.

Rules (enforced in application code):

- 3–20 characters
- lowercase only
- numbers allowed
- underscores allowed
- no spaces
- no consecutive underscores
- cannot begin or end with an underscore

Username Policy (mixed enforcement — see below):

- Usernames are unique (database, via `citext`)
- Usernames are case-insensitive (database, via `citext`)
- Usernames can be changed once every 30 days (database, via trigger —
  see below)
- Display names can be changed at any time (no restriction, either
  layer)

---

## Reserved Usernames

### TABLE: reserved_usernames

Purpose

Usernames blocked from public signup until explicitly unlocked for a
specific verified account.

| Column | Type | Notes |
|---------|------|------|
| username | CITEXT | Primary Key |
| reserved_type | TEXT | `system`, `founder`, or `community` |
| note | TEXT | Nullable |
| unlocked_for | UUID | Nullable, `references auth.users(id)`. NULL means nobody may claim it yet. |
| created_at | TIMESTAMPTZ | |

Seed Data

System reserved: `admin`, `support`, `bullchat`, `bullchatapp`, `team`,
`system`, `moderator`, `staff`, `security`, `help`, `official`,
`notifications`, `jobs`, `news`, `market`, `verify`

Founder reserved: `deficrawler` (reserved exclusively for BullChat's
creator)

Community reserved: `ansem` (reserved until ownership can be verified)

Enforcement

A `BEFORE INSERT OR UPDATE OF username` trigger on `users`
(`check_reserved_username`) blocks any insert/update where the new
username matches a `reserved_usernames` row whose `unlocked_for` is
either `NULL` or a different user than the one making the change.

Row Level Security

- **SELECT:** public (needed for client-side username-availability
  checks)
- **INSERT / UPDATE / DELETE:** no client policy — managed only via
  the Supabase dashboard or a service-role script when unlocking a
  reservation for a verified account.

---

## Username Change Cooldown

Enforced by a `BEFORE UPDATE OF username` trigger
(`enforce_username_cooldown`) on `users`: if the new username differs
from the old one and fewer than 30 days have passed since
`username_changed_at`, the update is rejected. On a successful change,
`username_changed_at` is reset to `now()`.

---

## Recovery Passcode

Official BullChat feature (DATABASE.md v1's "Anonymous Accounts"
section): the only recovery method for an Anonymous account.
**BullChat cannot recover a lost Recovery Passcode.**

### TABLE: recovery_passcodes

Purpose

Stores a hashed 6-digit numeric Recovery Passcode per user, plus the
infrastructure needed to look one up in O(1) without ever exposing the
hash.

| Column | Type | Notes |
|---------|------|------|
| user_id | UUID | Primary Key, `references auth.users(id) on delete cascade` |
| passcode_hash | TEXT | bcrypt hash (`pgcrypto`'s `crypt()` / `gen_salt('bf', 10)`). Verification source of truth. |
| passcode_lookup_hash | TEXT | Nullable, **UNIQUE**. `HMAC-SHA256(secret, passcode)`, computed in the application layer only — see below. Enables O(1) lookup and, as a side effect, guarantees no two accounts can share an active passcode. |
| lookup_key_version | SMALLINT | Default 1. Which HMAC key produced `passcode_lookup_hash` — supports future key rotation without forcing a passcode reset. |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

Row Level Security

**Enabled, with zero policies of any kind** — not even the owning user
may `SELECT` this table directly. Every read/write happens through the
`SECURITY DEFINER` functions below, none of which ever return a hash,
a lookup value, or a secret to the caller.

### Functions

`set_recovery_passcode(user_id, passcode, lookup_hash, lookup_key_version)`
— hashes and stores (or replaces) a passcode. Requires
`auth.uid() = user_id`.

`verify_recovery_passcode(user_id, passcode) returns boolean` —
compares against the stored bcrypt hash. Callable while unauthenticated
(`anon` role) — this is the actual identity-proving step during
account recovery.

`find_user_by_passcode_lookup(lookup_hash) returns uuid` — O(1) indexed
lookup by pre-computed HMAC digest. Callable by `anon`.

`find_user_by_recovery_passcode_legacy(passcode) returns uuid` —
bounded fallback for rows with no lookup hash (predate the HMAC
migration); scoped to `WHERE passcode_lookup_hash IS NULL` only, never
a full-table scan. Callable by `anon`.

### HMAC Key Management

The HMAC secret (`RECOVERY_PASSCODE_HMAC_SECRET`, and any future
versioned successor) lives **only** in the application server's
environment variables — never in Postgres, in any form (no GUC, no
Supabase Vault, no hardcoded function body). Postgres only ever
receives an already-computed HMAC digest as an opaque string. This
means a full database compromise reveals bcrypt hashes (safe: salted,
slow, one-way) and HMAC digests (safe: unforgeable without a key that
was never stored alongside them) — it does not reveal any plaintext
passcode or a way to forge one.

`lookup_key_version` exists so a future key rotation can be
implemented as a bounded, self-healing fallback (structurally identical
to the legacy-row fallback above) rather than forcing every user to
reset their passcode. Rotation itself is not yet implemented — only the
schema and application-layer key registry
(`src/lib/recoveryPasscodeHmac.ts`) needed to support it later.

### Known Operational Gap

Rate limiting on `verify_recovery_passcode`,
`find_user_by_passcode_lookup`, and
`find_user_by_recovery_passcode_legacy` is **not yet implemented**. A
6-digit passcode has only 1,000,000 possible values — bcrypt protects
against a raw database leak, not an online brute-force loop. This must
be addressed before Recovery Passcode is exposed to real users.

---

# Part 1B — Public Profile Surface

`users` (Part 1) is internal: only the row's owner and administrators
may read or write it. Nothing about a user is publicly visible by
querying `users` directly — not even a username.

The public-facing surface is `profiles`, in two pieces:

1. **The `profiles` table itself** — extended information that only
   ever lived here: headline, location, website, social links, skills,
   and projects. Badges are managed through the user_badges table.
2. **Two `SECURITY DEFINER` functions** — expose the specific
   *identity* fields that must remain authoritative on `users`
   (because the reserved-username and 30-day-cooldown triggers in
   Part 1A are built against `users.username`) without granting any
   read access to `users` itself.

### Why functions, not a view (verified against current guidance)

An earlier revision of this document specified a `public_profiles`
**view** for this purpose. That design has been replaced after
verifying it against current Postgres/Supabase guidance:

- A plain Postgres view is owned by the creating role (typically
  `postgres`, which has `BYPASSRLS`), so **by default it bypasses the
  underlying table's RLS entirely** — not just for the intended public
  columns, but structurally. Supabase's own Security Advisor lints
  this exact pattern as a **"Security Definer View"** warning, because
  it's easy to accidentally over-expose a table through a view that
  looks safe at a glance.
- The documented fix for that warning — setting `security_invoker =
  true` on the view (Postgres 15+) — does **not** work for this
  specific use case. `security_invoker = true` makes the view enforce
  `users`' RLS *as the querying user*, which means a caller viewing
  someone else's profile would hit `users`' owner/admin-only policy
  and get **zero rows back**. The view would only ever return data for
  the caller's own row, defeating the entire purpose of a public
  profile surface.
- The pattern Supabase's own documentation recommends for exactly this
  situation — deliberately exposing a controlled, column-limited
  subset of an RLS-restricted table to everyone — is a `SECURITY
  DEFINER` **function**, not a view. This is also the same pattern
  already used throughout Part 1A (`verify_recovery_passcode`,
  `find_user_by_passcode_lookup`, etc.), so it's consistent with the
  rest of this schema, not a one-off exception.

### FUNCTION: get_public_profile

Purpose

Returns the public-safe identity fields for a single user, joined with
their `profiles` row. The only way client code should read another
user's identity fields — never by querying `users` directly.

Signature

`get_public_profile(p_user_id uuid) returns table (...)`

`language sql`, `security definer`, `set search_path = public`,
`stable`.

Returned columns (explicit allowlist — the function's `SELECT` list
itself, not a table grant, is what limits exposure)

From `users`: `id`, `username`, `display_name`, `avatar_url`,
`cover_image_url`, `bio`, `is_online`, `reputation_score` *(publicly
exposed by product decision — see Milestone 7/Reputation System; if a
future decision makes reputation private, remove it from this
function's `SELECT` list only, not from `users`)*, `created_at`.

From `profiles` (left-joined on `user_id = users.id`): `headline`,
`location`, `website`, `twitter_url`, `github_url`, `telegram_url`,
`discord_url`, `skills`, `projects`, `badges`.

**Never included, under any circumstances:** `email`,
`wallet_address`, `auth_provider`, `role`, `status`, `spam_score`,
`deleted_at`, `username_changed_at`, or anything else not explicitly
listed above.

Grants

`EXECUTE` granted to `anon` and `authenticated`. This function is
*intentionally* exposed via the client API (called as
`supabase.rpc('get_public_profile', { p_user_id })`) — the general
guidance to avoid exposing `SECURITY DEFINER` functions unnecessarily
applies to internal helper functions never meant for client use (like
ones only called from inside another function or a trigger), not to
this one, whose entire purpose is to be called by clients.

### FUNCTION: list_public_profiles

Purpose

Cursor-paginated browsing of public profiles (e.g. a member directory
or search results) — same column allowlist as `get_public_profile`,
extended to many rows at once rather than requiring one RPC call per
profile.

Signature

`list_public_profiles(p_limit integer default 50, p_cursor timestamptz
default null) returns table (...)`

Same `language sql`, `security definer`, `set search_path = public`,
`stable` as above. Orders by `users.created_at desc`, filters to
`created_at < p_cursor` when a cursor is provided — cursor pagination,
not `OFFSET`, per the Performance Strategy standard elsewhere in this
document. `deleted_at is null` is applied inside the function so soft-
deleted accounts never appear in public listings.

Grants

`EXECUTE` granted to `anon` and `authenticated`, same reasoning as
`get_public_profile`.

### FUNCTION: search_public_profiles

Purpose

The single backend for **Global Search, Member Search, and @mention
autocomplete** — one function, not three separate implementations, so
search behavior and the exposed column set stay identical everywhere
it's used.

Signature

`search_public_profiles(p_query text, p_limit integer default 50,
p_cursor timestamptz default null) returns table (...)`

Same `language sql`, `security definer`, `set search_path = public`,
`stable`, same return shape (and therefore the same column allowlist)
as `list_public_profiles`.

Search behavior

Matches `p_query` (case-insensitive) against:

- `users.username`
- `users.display_name`
- `profiles.headline`
- `profiles.skills` — a JSONB array of strings; matched via
  `jsonb_array_elements_text(profiles.skills)` so a query like
  `"solidity"` matches a user whose skills array contains that string,
  not just a literal substring of the JSONB column's raw text.

`deleted_at is null` is applied the same as `list_public_profiles`, and
results are cursor-paginated the same way (`created_at < p_cursor`),
so callers can treat this exactly like `list_public_profiles` with an
added query term — including `@mention` autocomplete, which calls this
with a short `p_limit` and no cursor on every keystroke.

Performance note

For anything beyond Milestone 1 scale, a plain `ILIKE '%query%'` scan
across `username`/`display_name`/`headline` won't stay fast — add a
`pg_trgm` (trigram) index on those three columns once query volume
justifies it (`create extension if not exists pg_trgm;` +
`create index ... using gin (username gin_trgm_ops)` per column). Not
required for Milestone 1's launch scale, but the query shape above
(`ILIKE` on indexed-friendly columns) is chosen specifically so that
optimization is a pure index addition later, not a function rewrite.

Grants

`EXECUTE` granted to `anon` and `authenticated`, same reasoning as
`get_public_profile`.

### Security Note

All three functions are the *only* sanctioned, deliberate exception to
`users`' owner/admin-only RLS. The safety property that matters is
**column-level, enforced in each function body's `SELECT` list** — not
row-level, since all three intentionally return rows regardless of who's
asking. `email`, `wallet_address`, `auth_provider`, `role`, `status`,
`spam_score`, `deleted_at`, and `username_changed_at` must never be
added to any of their return columns — this applies equally to
`search_public_profiles`, including its search predicate: the search
`WHERE` clause may reference internal columns like `role`/`status`
server-side (e.g. excluding banned accounts from search results is
reasonable), but the `SELECT`/`RETURNS TABLE` list must never surface
them. `search_path` is pinned (`set search_path = public`) on all
three, consistent with every other `SECURITY DEFINER` function in this
document, to close the function-search-path-injection vector
Supabase's linter also checks for.

---

# TABLE: profiles

Purpose

Stores extended public profile information, separate from the core
`users` account record. Together with `get_public_profile` /
`list_public_profiles` above, this is what public/community-facing UI
should query — never `users` directly.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| headline | TEXT |
| location | TEXT |
| website | TEXT |
| twitter_url | TEXT |
| github_url | TEXT |
| telegram_url | TEXT |
| discord_url | TEXT |
| skills | JSONB |
| projects | JSONB |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Indexes

- user_id

Relationship

1 User

↓

1 Profile

Row Level Security

- **SELECT:** public
- **INSERT / UPDATE:** owner only
- **DELETE:** admin only

(For identity fields sourced from `users` — username, display name,
avatar, bio — public read happens through the `get_public_profile` /
`list_public_profiles` functions in Part 1B, not through `profiles`
directly, since those columns don't live on this table.)

---

# TABLE: communities

Purpose

Supports multiple communities.

Version 1 contains only

$ANSEM

Future releases simply insert more rows.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| slug | TEXT UNIQUE |
| description | TEXT |
| logo_url | TEXT |
| banner_url | TEXT |
| visibility | community_visibility |
| owner_id | UUID FK |
| verified | BOOLEAN |
| member_count | INTEGER |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Indexes

slug

owner_id

Row Level Security

- **SELECT:** public
- **INSERT / UPDATE:** admin
- **DELETE:** owner

---

# TABLE: community_members

Purpose

Tracks which users belong to which communities.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| community_id | UUID FK |
| user_id | UUID FK |
| joined_at | TIMESTAMPTZ |
| notifications_enabled | BOOLEAN |

Unique

community_id + user_id

---

# TABLE: rooms

Purpose

Chat rooms inside communities.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| community_id | UUID FK |
| name | TEXT |
| slug | TEXT |
| description | TEXT |
| room_type | room_type |
| position | INTEGER |
| is_archived | BOOLEAN |
| message_count | INTEGER |
| created_at | TIMESTAMPTZ |

Indexes

community_id

slug

position

Row Level Security

- **SELECT:** members
- **INSERT / UPDATE / DELETE:** admin

---

# TABLE: room_members

Purpose

Stores room membership for private or restricted rooms.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| room_id | UUID |
| user_id | UUID |
| joined_at | TIMESTAMPTZ |

Unique

room_id + user_id

---

# Relationships

users

↓

community_members

↓

communities

↓

rooms

↓

messages

This hierarchy forms the foundation of BullChat. Every future feature
builds upon this structure.

---

## Part 1 Complete

The database foundation — including the retained Authentication
Extensions in Part 1A and the public/internal split for user data in
Part 1B — is now established.

Next section:

## Part 2 — Messaging System

---

# Messaging Philosophy

Messaging is the heart of BullChat.

Requirements:

- Real-time
- Highly scalable
- Editable
- Searchable
- Thread-ready
- Moderated
- Soft deletable
- Mobile optimized

Every message belongs to:

User

↓

Community

↓

Room

---

# TABLE: messages

Purpose

Stores every public message.

| Column | Type | Notes |
|---------|------|------|
| id | UUID | Primary Key |
| community_id | UUID FK | |
| room_id | UUID FK | |
| user_id | UUID FK | |
| parent_message_id | UUID FK | Nullable (reply support) |
| content | TEXT | Max 4000 characters |
| message_type | TEXT | text, image, file, system, announcement |
| status | message_status | visible by default |
| edited | BOOLEAN | Default false |
| edited_at | TIMESTAMPTZ | Nullable |
| reply_count | INTEGER | Default 0 |
| reaction_count | INTEGER | Default 0 |
| attachment_count | INTEGER | Default 0 |
| mention_count | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| deleted_at | TIMESTAMPTZ | Nullable |

Indexes

- room_id
- community_id
- user_id
- created_at DESC
- parent_message_id
- status

Full Text Search

Create searchable index on:

content

---

# Relationships

Community

↓

Room

↓

Messages

↓

Replies

↓

Reactions

↓

Mentions

↓

Attachments

---

# TABLE: message_replies

Purpose

Optimized reply lookup.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| reply_message_id | UUID FK |
| created_at | TIMESTAMPTZ |

Indexes

- message_id

---

# TABLE: message_reactions

Purpose

Stores emoji reactions.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| user_id | UUID FK |
| emoji | VARCHAR(30) |
| created_at | TIMESTAMPTZ |

Unique Constraint

message_id + user_id + emoji

Indexes

- message_id
- user_id

---

# TABLE: message_mentions

Purpose

Tracks user mentions.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| mentioned_user_id | UUID FK |
| created_at | TIMESTAMPTZ |

Indexes

- mentioned_user_id
- message_id

Automatically creates notification.

---

# TABLE: message_attachments

Purpose

Stores uploaded files.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| uploader_id | UUID FK |
| storage_path | TEXT |
| file_name | TEXT |
| mime_type | TEXT |
| file_size | BIGINT |
| created_at | TIMESTAMPTZ |

Indexes

- message_id
- uploader_id

Supported

Images

Videos

Documents

Future

Audio

GIFs

---

# TABLE: pinned_messages

Purpose

Stores pinned room messages.

| Column | Type |
|---------|------|
| id | UUID |
| room_id | UUID FK |
| message_id | UUID FK |
| pinned_by | UUID FK |
| pinned_at | TIMESTAMPTZ |

Unique

message_id

Indexes

room_id

---

# TABLE: typing_sessions

Purpose

Realtime typing indicators.

| Column | Type |
|---------|------|
| id | UUID |
| room_id | UUID FK |
| user_id | UUID FK |
| started_at | TIMESTAMPTZ |
| expires_at | TIMESTAMPTZ |

Rows expire automatically after a few seconds.

Never stored permanently.

---

# Message Limits

Maximum message length

4000 characters

Maximum attachments

10

Maximum attachment size

Configurable

Maximum reactions

Unlimited

Maximum reply depth

10

---

# Message Editing

Allowed

Author

Moderator

Admin

Owner

Store

edited = true

edited_at timestamp

Never overwrite

created_at

---

# Message Deletion

Normal Users

Soft delete only.

Moderators

Hide message.

Admins

Permanent purge available.

---

# Message Status Flow

visible

↓

edited

↓

flagged

↓

hidden

↓

deleted

Messages never disappear instantly.

Every action is auditable.

---

# Search

Support

Message text

Username

Mentions

Room

Community

Date Range

Future

Semantic Search

AI Search

---

# Realtime Events

message.created

message.updated

message.deleted

message.hidden

message.edited

reaction.added

reaction.removed

reply.created

mention.created

typing.started

typing.stopped

pin.created

pin.removed

---

# Recommended Indexes

messages

(room_id, created_at DESC)

messages

(user_id)

messages

(status)

message_mentions

(mentioned_user_id)

message_reactions

(message_id)

message_attachments

(message_id)

typing_sessions

(room_id)

---

# Row Level Security

Messages

SELECT

Authenticated users can read messages in communities they belong to.

INSERT

Authenticated members only.

UPDATE

Author

Moderator

Admin

DELETE

Soft delete by author.

Permanent delete by Admin.

Reactions

Users can only create or remove their own reactions.

Mentions

System generated.

Users cannot manually edit mention records.

Attachments

Only uploader or Admin may delete.

Pinned Messages

Moderator

Admin

Owner

Only.

---

# Performance Notes

Never load an entire room.

Use cursor pagination.

Default page size

50 messages

Lazy load older messages.

Realtime only loads new events.

Use indexes for every foreign key.

Never perform full table scans.

---

# End of Part 2

Next:

## Part 3 — Direct Messages, Notifications & User Presence

---

# Private Messaging Philosophy

Direct Messages (DMs) are private conversations between two or more
users.

Requirements

- Secure
- End-to-End Ready (future)
- Realtime
- Searchable
- Attachment Support
- Moderatable
- Soft Delete
- Read Receipts

---

# TABLE: conversations

Purpose

Stores private conversations.

| Column | Type | Notes |
|---------|------|------|
| id | UUID | Primary Key |
| conversation_type | TEXT | direct, group |
| created_by | UUID FK | |
| title | TEXT | Nullable |
| last_message_id | UUID FK | Nullable |
| last_message_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

Indexes

- last_message_at DESC

---

# TABLE: conversation_members

Purpose

Stores conversation participants.

| Column | Type |
|---------|------|
| id | UUID |
| conversation_id | UUID FK |
| user_id | UUID FK |
| joined_at | TIMESTAMPTZ |
| last_read_message_id | UUID FK |
| muted | BOOLEAN |
| archived | BOOLEAN |

Unique

conversation_id + user_id

Indexes

- user_id
- conversation_id

---

# TABLE: direct_messages

Purpose

Stores all DM messages.

| Column | Type |
|---------|------|
| id | UUID |
| conversation_id | UUID FK |
| sender_id | UUID FK |
| parent_message_id | UUID FK |
| content | TEXT |
| message_type | TEXT |
| edited | BOOLEAN |
| edited_at | TIMESTAMPTZ |
| attachment_count | INTEGER |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |
| deleted_at | TIMESTAMPTZ |

Indexes

- conversation_id
- sender_id
- created_at DESC

---

# TABLE: direct_message_attachments

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| uploader_id | UUID FK |
| storage_path | TEXT |
| mime_type | TEXT |
| file_size | BIGINT |
| created_at | TIMESTAMPTZ |

Indexes

- message_id

---

# TABLE: direct_message_reactions

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| user_id | UUID FK |
| emoji | VARCHAR(30) |
| created_at | TIMESTAMPTZ |

Unique

message_id + user_id + emoji

---

# Notifications

Every important event creates a notification.

---

# TABLE: notifications

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| actor_id | UUID FK |
| notification_type | notification_type |
| reference_id | UUID |
| title | TEXT |
| body | TEXT |
| read | BOOLEAN |
| created_at | TIMESTAMPTZ |

Indexes

- user_id
- read
- created_at DESC

---

Supported Types

- Mention
- Reply
- Reaction
- Follow
- Moderator Alert
- Room Invite
- Community Invite
- Announcement
- System Message
- Reputation
- Spam Warning

---

# TABLE: notification_preferences

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| mentions | BOOLEAN |
| replies | BOOLEAN |
| reactions | BOOLEAN |
| follows | BOOLEAN |
| announcements | BOOLEAN |
| moderation | BOOLEAN |
| marketing | BOOLEAN |
| email_enabled | BOOLEAN |
| push_enabled | BOOLEAN |
| created_at | TIMESTAMPTZ |

One row per user.

---

# Followers

---

# TABLE: follows

Purpose

Professional networking.

| Column | Type |
|---------|------|
| id | UUID |
| follower_id | UUID FK |
| following_id | UUID FK |
| created_at | TIMESTAMPTZ |

Unique

follower_id + following_id

Indexes

- follower_id
- following_id

---

# User Presence

Realtime online status.

---

# TABLE: user_presence

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| status | TEXT |
| current_room_id | UUID FK |
| last_seen | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Status Values

- online
- idle
- away
- offline

Indexes

- user_id

Note: `users.is_online` (Part 1) remains as a cheap denormalized flag
for quick reads; `user_presence` provides richer realtime state
(current room, idle/away distinction). Both are retained — see Part 1's
`users` table notes.

---

# User Sessions

---

# TABLE: user_sessions

Purpose

Track active sessions.

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| device_name | TEXT |
| platform | TEXT |
| browser | TEXT |
| ip_address | INET |
| location | TEXT |
| last_activity | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

Indexes

- user_id
- last_activity DESC

---

# Read Receipts

---

# TABLE: message_reads

Purpose

Track message read state.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| user_id | UUID FK |
| read_at | TIMESTAMPTZ |

Unique

message_id + user_id

Indexes

- user_id
- message_id

---

# User Activity

Purpose

Activity feed.

---

# TABLE: user_activity

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| activity_type | TEXT |
| reference_id | UUID |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

Examples

- Joined Room
- Created Message
- Updated Profile
- Followed User
- Earned Badge
- Received Reputation
- Moderator Action

Indexes

- user_id
- activity_type
- created_at DESC

---

# Realtime Events

conversation.created

conversation.updated

conversation.deleted

dm.created

dm.updated

dm.deleted

notification.created

notification.read

presence.updated

user.online

user.offline

follow.created

follow.removed

message.read

---

# Row Level Security

Conversations

Only members may view.

Conversation Members

Only conversation participants.

Direct Messages

Visible only to conversation members.

Notifications

Users may only view their own notifications.

Notification Preferences

Users may update only their own settings.

Presence

Authenticated users may read.

Only the owner may update their own presence.

User Sessions

Users may view only their own sessions.

Admins may view all.

Message Reads

Users may insert only their own read receipts.

User Activity

Users may view their own activity.

Admins may view all activity.

---

# Performance Recommendations

Cursor pagination for DMs.

Maximum initial DM load

50 messages.

Archive inactive conversations.

Use realtime only for active conversations.

Cache notification counts.

Automatically expire inactive presence records.

---

# End of Part 3

Next:

## Part 4 — Moderation & Anti-Spam Engine

---

# Moderation Philosophy

BullChat is built for high-quality crypto discussions.

Moderation should be:

- Fast
- Fair
- Transparent
- Auditable
- Mostly automated
- Human overridable

Every moderation action must leave an audit trail.

Nothing should happen silently.

---

# Moderation Pipeline

User submits message

↓

Spam Engine Analysis

↓

Risk Score Generated

↓

If Safe

Publish Immediately

↓

If Suspicious

Hide Message

↓

Create Moderation Queue Item

↓

Moderator Review

↓

Approve

Reject

Warn User

Mute User

Ban User

---

# TABLE: moderation_queue

Purpose

Stores every message awaiting moderation.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| user_id | UUID FK |
| community_id | UUID FK |
| room_id | UUID FK |
| reason | TEXT |
| severity | spam_severity |
| confidence | NUMERIC(5,2) |
| status | moderation_status |
| assigned_to | UUID FK |
| reviewed_at | TIMESTAMPTZ |
| review_notes | TEXT |
| review_action | TEXT |
| resolved_by | UUID FK |
| resolved_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

Indexes

- status
- severity
- created_at DESC
- assigned_to

---

# TABLE: spam_events

Purpose

Stores every spam detection event.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| user_id | UUID FK |
| spam_score | INTEGER |
| severity | spam_severity |
| rule_triggered | TEXT |
| metadata | JSONB |
Stores structured evidence including:

- detected_token
- detected_contract
- matched_rule
- confidence_score
- extracted_symbols
- extracted_addresses
| created_at | TIMESTAMPTZ |

Indexes

- user_id
- spam_score
- created_at DESC

---

# TABLE: spam_rules

Purpose

Defines automated moderation rules.

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| rule_type | TEXT |
| score | INTEGER |
| enabled | BOOLEAN |
| created_at | TIMESTAMPTZ |

Examples

Examples

- Excessive Caps
- Flood Messages
- Duplicate Messages
- Scam Keywords
- Unauthorized Token Mention
- Unauthorized Contract Address
- Fake Giveaway
- Mass Mentions
- External Invite Links
- Repeated Shilling
- Wallet Drainer Keywords
- Phishing Links

---

# TABLE: user_spam_scores

Purpose

Tracks cumulative spam behavior.

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| total_score | INTEGER |
| warning_count | INTEGER |
| mute_count | INTEGER |
| suspension_count | INTEGER |
| last_event_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Indexes

- user_id
- total_score DESC

Note: `users.spam_score` (Part 1) is a fast denormalized current-value
column; `user_spam_scores` retains the fuller history/counters. Both
are retained.

---

# TABLE: approved_tokens

Purpose

Registry of approved community tokens.

Version 1

Only one record:

$ANSEM

Future versions simply add more rows.

| Column | Type |
|---------|------|
| id | UUID |
| community_id | UUID FK |
| token_name | TEXT |
| token_symbol | TEXT |
| contract_address | TEXT |
| chain | TEXT |
| verified | BOOLEAN |
| active | BOOLEAN |
| created_at | TIMESTAMPTZ |

Indexes

- contract_address UNIQUE
- token_symbol
- community_id

---

# TABLE: token_detection_events

Purpose

Logs token mentions detected by the spam engine.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| detected_token | TEXT |
| contract_address | TEXT |
| approved | BOOLEAN |
| action_taken | TEXT |
| created_at | TIMESTAMPTZ |

Actions

- Allowed
- Hidden
- Hidden Pending Review
- Escalated
- Restored by Moderator
- Permanently Removed

---

# TABLE: contract_detection_events

Purpose

Tracks every blockchain contract detected.

| Column | Type |
|---------|------|
| id | UUID |
| message_id | UUID FK |
| contract_address | TEXT |
| blockchain | TEXT |
| approved | BOOLEAN |
| created_at | TIMESTAMPTZ |

Indexes

- contract_address
- approved

---

# TABLE: reports

Purpose

User-generated reports.

| Column | Type |
|---------|------|
| id | UUID |
| reporter_id | UUID FK |
| reported_user_id | UUID FK |
| message_id | UUID FK |
| report_reason | TEXT |
| description | TEXT |
| status | moderation_status |
| reviewed_by | UUID FK |
| reviewed_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

Indexes

- status
- reported_user_id
- reporter_id

---

# TABLE: moderation_actions

Purpose

Every moderator action.

| Column | Type |
|---------|------|
| id | UUID |
| moderator_id | UUID FK |
| target_user_id | UUID FK |
| message_id | UUID FK |
| action | TEXT |
| reason | TEXT |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

Examples

- Warning
- Hide Message
- Delete Message
- Mute
- Suspend
- Ban
- Approve Message
- Reject Appeal

---

# TABLE: audit_logs

Purpose

Immutable system audit log.

| Column | Type |
|---------|------|
| id | UUID |
| actor_id | UUID FK |
| action | TEXT |
| entity_type | TEXT |
| entity_id | UUID |
| old_values | JSONB |
| new_values | JSONB |
| ip_address | INET |
| user_agent | TEXT |
| created_at | TIMESTAMPTZ |

Indexes

- actor_id
- entity_type
- created_at DESC

Audit logs should never be editable.

---

# TABLE: user_restrictions

Purpose

Stores active enforcement actions.

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| restriction_type | TEXT |
| expires_at | TIMESTAMPTZ |
| active | BOOLEAN |
| created_by | UUID FK |
| created_at | TIMESTAMPTZ |

Restriction Types

- Read Only
- Muted
- Room Restricted
- Community Restricted
- Suspended
- Banned

---

# Automatic Enforcement

Suggested Thresholds

Spam Score ≥ 25

Warning

Spam Score ≥ 50

Temporary Mute

Spam Score ≥ 100

Moderator Review Required

Spam Score ≥ 200

Temporary Suspension

Spam Score ≥ 500

Permanent Ban Review

Thresholds should be configurable by administrators.

---

# Approved Token Logic

BullChat Version 1

Only the official $ANSEM token and its registered contract address are
approved.

Behavior

Approved Token

✅ Allowed

Approved Contract

✅ Allowed

Unknown Token Mention

🚫 Hidden immediately.

Unknown Contract Address

🚫 Hidden immediately.

The message is never published to other users.

Instead it enters the moderation pipeline where moderators may:

- Approve
- Restore
- Reject
- Increase spam score
- Restrict user

Only tokens and contract addresses registered inside
approved_tokens are allowed inside public chat rooms.

For BullChat Version 1 this means only the official
$ANSEM token and its verified contract address are allowed.

Future communities will inherit the same rule using
their own approved token registry.

Future versions will support community-specific approved token lists.

---

# Moderator Permissions

Moderator

- Hide Messages
- Restore Messages
- Warn Users
- Review Reports
- Pin Messages

Admin

Everything Moderator can do

Plus

- Suspend Users
- Ban Users
- Configure Spam Rules
- Manage Approved Tokens
- View Audit Logs
- Assign Moderators

Owner

Full system access.

---

# Realtime Events

moderation.created

moderation.updated

report.created

report.resolved

spam.detected

restriction.created

restriction.removed

audit.created

token.detected

contract.detected

---

# Row Level Security

Moderation Queue

Visible only to Moderators, Admins and Owners.

Spam Events

Admins only.

Spam Rules

Admins only.

Approved Tokens

Readable by everyone.

Editable by Admins and Owners.

Reports

Reporter may view their own reports.

Moderators may view all.

Audit Logs

Admins and Owners only.

User Restrictions

Users may view their own active restrictions.

Admins may manage all.

---

# Performance Recommendations

Partition audit_logs when volume becomes high.

Archive resolved moderation_queue items.

Retain spam_events for analytics.

Index every foreign key.

Run spam analysis asynchronously where possible.

Cache approved token list in memory for fast validation.

---

# End of Part 4

Next:

## Part 5 — Admin Platform, Reputation, Storage, Functions & Production Infrastructure

---

# Admin Dashboard Philosophy

The Admin Dashboard is the control center of BullChat.

It should provide:

- Community Management
- User Management
- Moderation
- Analytics
- Security
- Audit Trail
- Spam Monitoring
- Platform Configuration

Every administrative action must be logged.

---

# TABLE: admin_roles

Purpose

Defines platform administrative roles.

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| created_at | TIMESTAMPTZ |

Examples

- Owner
- Super Admin
- Community Admin
- Moderator
- Support

---

# TABLE: admin_permissions

Purpose

Granular permission system.

| Column | Type |
|---------|------|
| id | UUID |
| permission | TEXT |
| description | TEXT |

Examples

users.view

users.edit

users.ban

messages.delete

messages.restore

rooms.manage

communities.manage

analytics.view

tokens.manage

spam.manage

settings.manage

audit.view

roles.manage

---

# TABLE: role_permissions

| Column | Type |
|---------|------|
| id | UUID |
| role_id | UUID FK |
| permission_id | UUID FK |

Unique

role_id + permission_id

---

# TABLE: admin_users

Purpose

Maps users to administrative roles.

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| role_id | UUID FK |
| assigned_by | UUID FK |
| assigned_at | TIMESTAMPTZ |

Note: this table governs *platform admin* roles/permissions
(fine-grained, Admin-Dashboard-facing). `users.role` (Part 1) is the
coarser, always-present role used by ordinary RLS checks
(anonymous/member/verified/moderator/admin/owner). Both are retained —
`users.role` for everyday access checks, `admin_users` +
`role_permissions` for the Admin Dashboard's granular permission
system.

---

# Reputation System

Every action contributes to user reputation.

Positive actions

- Helpful replies
- Receiving reactions
- Community participation
- Verified profile
- Account age

Negative actions

- Spam
- Hidden messages
- Moderator warnings
- Reports confirmed
- Suspensions

---

# TABLE: reputation_events

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| points | INTEGER |
| event_type | TEXT |
| reference_id | UUID |
| created_at | TIMESTAMPTZ |

Examples

+10 Helpful Reply

+20 Community Contribution

+50 Verified Builder

-25 Spam

-50 Moderator Warning

-100 Suspension

Indexes

- user_id
- created_at DESC

Note: `users.reputation_score` (Part 1) is the fast denormalized
current total; `reputation_events` is the full history it's computed
from. Both are retained.

---

# TABLE: badges

Purpose

Available achievement badges.

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| icon | TEXT |
| color | TEXT |
| created_at | TIMESTAMPTZ |

Examples

Founder

OG Member

Verified

Builder

Moderator

Top Contributor

Bug Hunter

---

# TABLE: user_badges

| Column | Type |
|---------|------|
| id | UUID |
| badge_id | UUID FK |
| user_id | UUID FK |
| awarded_by | UUID FK |
| awarded_reason | TEXT |
| awarded_at | TIMESTAMPTZ |

Award Source

Badges may be awarded:

- Automatically (system)
- Manually (admin)
- Through milestone achievements

For BullChat Version 1, the **OG Member** badge is automatically awarded
to every account created before the official public launch date.

This badge is permanent and cannot be removed except by the Owner.

Future badges may have different award criteria.

Examples of awarded_reason

Genesis Launch

Manual Award

Community Achievement

Event Reward

---

# Analytics

Purpose

Aggregated platform metrics.

---

# TABLE: analytics_daily

| Column | Type |
|---------|------|
| id | UUID |
| date | DATE |
| active_users | INTEGER |
| new_users | INTEGER |
| messages_sent | INTEGER |
| reports_created | INTEGER |
| spam_detected | INTEGER |
| communities | INTEGER |
| rooms | INTEGER |

Indexes

date UNIQUE

---

# TABLE: analytics_hourly

| Column | Type |
|---------|------|
| id | UUID |
| hour | TIMESTAMPTZ |
| active_users | INTEGER |
| messages | INTEGER |
| online_users | INTEGER |

---

# Storage Buckets

Supabase Storage

---

avatars/

Stores profile images.

Public

Maximum

5MB

---

covers/

Stores profile covers.

Public

Maximum

10MB

---

attachments/

Chat uploads.

Private

Signed URLs only.

---

community-assets/

Community logos

Community banners

Public

---

system/

Application assets.

Private

---

exports/

Generated reports.

Admin only.

Private

---

# Storage Policies

Avatar

Owner upload

Public read

Owner update

Admin delete

Attachments

Uploader read

Conversation members read

Admin read

Uploader delete

Community Assets

Admin upload

Public read

---

# Database Functions

Recommended PostgreSQL Functions

create_notification()

Automatically inserts notifications.

---

calculate_spam_score()

Returns spam score for a message.

---

update_reputation()

Updates reputation after events.

---

update_last_seen()

Updates user presence.

---

create_audit_log()

Automatically records admin actions.

---

pin_message()

Pins room message.

---

unpin_message()

Removes pin.

---

join_room()

Creates room membership.

---

leave_room()

Removes membership.

---

follow_user()

Creates follow relationship.

---

unfollow_user()

Removes follow.

---

Already implemented (Part 1A), not new:

set_recovery_passcode() / verify_recovery_passcode() /
find_user_by_passcode_lookup() / find_user_by_recovery_passcode_legacy()
/ check_reserved_username() / enforce_username_cooldown() /
set_updated_at()

---

# Database Triggers

After Message Insert

Update room activity.

Update analytics.

Trigger spam engine.

Generate mentions.

Create notifications.

---

After Reaction Insert

Increase reaction count.

Update reputation.

---

After Reply Insert

Increase reply count.

Notify author.

---

After Follow

Generate notification.

Update follower count.

---

After Report

Create moderation item.

---

After Ban

Terminate active sessions.

---

After Username Change

Update search index.

Already implemented (Part 1A): `enforce_username_cooldown`,
`check_reserved_username`.

---

# Views

Recommended Views

---

active_users_view

Currently online users.

---

community_statistics_view

Community metrics.

---

room_statistics_view

Room metrics.

---

moderation_overview_view

Pending moderation summary.

---

leaderboard_view

Highest reputation users.

---

market_summary_view

Future market statistics.

---

# Materialized Views

Future

message_search_index

Daily analytics

Community leaderboard

Spam statistics

Refresh periodically.

---

# Full Text Search

Searchable Entities

Messages

Profiles

Communities

Rooms

Announcements

Projects

Future

AI Semantic Search

---

# Database Backups

Daily

Automatic backup.

Weekly

Snapshot backup.

Monthly

Archive backup.

Retain according to deployment policy.

---

# Performance Strategy

Use UUID primary keys.

Index every foreign key.

Cursor pagination.

Avoid OFFSET pagination.

Archive inactive records.

Partition audit logs.

Partition analytics.

Cache approved token registry.

Cache user permissions.

Use JSONB only when flexibility is required.

Normalize relational data.

Avoid unnecessary joins.

---

# Security Standards

Enable Row Level Security on every table.

Never disable RLS.

Never expose service role keys to clients.

All privileged operations should execute through secure server-side
code.

Every admin action must create an audit log.

---

# Row Level Security Matrix

| Table | Read | Write | Update | Delete |
|--------|------|-------|--------|--------|
| users | **Owner/Admin only** (public read removed — see Changelog) | Owner | Owner (+ restricted admin path for role/status/spam_score) | Admin |
| get_public_profile / list_public_profiles / search_public_profiles (functions) | **Public** (EXECUTE granted to anon/authenticated) — explicit column allowlist enforced in each function body, see Part 1B | — (read-only) | — | — |
| reserved_usernames | Public | System only | System only | System only |
| recovery_passcodes | **None** (not even Owner — SECURITY DEFINER functions only) | System only | System only | System only |
| profiles | Public | Owner | Owner | Admin |
| communities | Public | Admin | Admin | Owner |
| rooms | Members | Admin | Admin | Admin |
| messages | Members | Members | Author | Admin |
| reactions | Members | Owner | Owner | Owner |
| notifications | Owner | System | Owner | Owner |
| reports | Reporter/Admin | Members | Moderator | Admin |
| moderation_queue | Moderator | System | Moderator | Admin |
| spam_events | Admin | System | System | Admin |
| audit_logs | Admin | System | None | None |
| reputation_events | Owner/Admin | System | None | None |
| analytics | Admin | System | System | None |

---

# Future Expansion

Database is designed to support:

- Multiple Communities
- Multiple Official Tokens
- DAO Governance
- AI Moderation
- AI Search
- Voice Channels
- Video Channels
- Livestreams
- NFT Verification
- Wallet Authentication
- Jobs Marketplace
- Project Collaboration
- Plugin System
- API Platform
- Mobile Applications

No schema redesign should be required for these additions.

---

# Database Standards

Every new table must include:

- UUID Primary Key (except `users`, which inherits its id from
  `auth.users` by design — see Part 1)
- created_at
- updated_at
- Appropriate Foreign Keys
- Indexes
- Row Level Security
- Audit Support (where applicable)

Soft deletes should be preferred over hard deletes for user-generated
content.

---

# Production Readiness Checklist

✅ UUID-based schema (with the one documented `users.id` exception)

✅ Normalized relational model

✅ Multi-community ready

✅ Multi-token ready

✅ Real-time compatible

✅ Supabase compatible

✅ Mobile-ready

✅ Full audit logging

✅ Spam engine integration

✅ Reputation system

✅ Analytics support

✅ Storage architecture

✅ Row Level Security

✅ Trigger strategy

✅ Performance optimization

✅ Future-proof design

✅ Recovery Passcode (Anonymous account recovery)

✅ Reserved Usernames

---

# DATABASE.md Complete

This document defines the complete production database architecture
for BullChat and serves as the authoritative specification for backend
implementation. It reconciles the v2.0 draft with what is already
implemented and live, per the approved audit decisions recorded in the
Changelog above.

Any schema changes should be reflected in this document before
implementation.
