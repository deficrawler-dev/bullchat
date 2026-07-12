# BullChat Database Specification

Version: 2.0

Status: Production Architecture

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

This document should be followed exactly when implementing BullChat in Supabase.

---

# Database Philosophy

BullChat is designed to scale from:

One Community

↓

Many Communities

↓

Large Web3 Ecosystem

The database must never assume there is only one community.

Although Version 1 launches exclusively for the $ANSEM community, the schema must support multiple communities without requiring structural redesign.

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
users
 │
 ├── profiles
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

Stores authentication-related user data.

Supabase Auth remains the authentication provider.

This table stores BullChat-specific information.

Columns

| Column | Type | Notes |
|---------|------|------|
| id | UUID | Primary Key |
| auth_id | UUID | Supabase Auth ID |
| username | VARCHAR(30) | Unique |
| display_name | VARCHAR(60) | |
| email | TEXT | Nullable |
| avatar_url | TEXT | |
| cover_url | TEXT | Nullable |
| bio | TEXT | Nullable |
| wallet_address | TEXT | Nullable |
| country | TEXT | Nullable |
| role | user_role | Default member |
| status | user_status | Default active |
| reputation_score | INTEGER | Default 0 |
| spam_score | INTEGER | Default 0 |
| last_seen | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| deleted_at | TIMESTAMPTZ | Nullable |

Indexes

- username
- auth_id
- wallet_address
- status
- reputation_score

Constraints

username UNIQUE

wallet_address UNIQUE NULLS DISTINCT

Relationships

users

↓

profiles

messages

notifications

followers

spam_events

moderation_actions

---

# TABLE: profiles

Purpose

Stores extended public profile information.

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
| badges | JSONB |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Indexes

- user_id

Relationship

1 User

↓

1 Profile

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
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Indexes

slug

owner_id

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
| created_at | TIMESTAMPTZ |

Indexes

community_id

slug

position

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

This hierarchy forms the foundation of BullChat.

Every future feature builds upon this structure.

---

# Part 1 Complete

The database foundation is now established.

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

- reply_message_id

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

message_id

+

user_id

+

emoji

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

Direct Messages (DMs) are private conversations between two or more users.

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

- Excessive Caps
- Flood Messages
- Duplicate Messages
- Scam Keywords
- Contract Address
- Fake Giveaway
- Mass Mentions
- External Invite Links

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
- Flagged
- Escalated

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

Only the official $ANSEM token and its registered contract address are approved.

Behavior

Approved Token

✅ Allowed

Approved Contract

✅ Allowed

Unknown Token Mention

⚠️ Flag for Review

Unknown Contract Address

🚫 Hidden Pending Review

Repeat Offender

Increase Spam Score

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

Verified

Builder

Moderator

Early Supporter

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
| awarded_at | TIMESTAMPTZ |

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

All privileged operations should execute through secure server-side code.

Every admin action must create an audit log.

---

# Row Level Security Matrix

| Table | Read | Write | Update | Delete |
|--------|------|-------|--------|--------|
| users | Owner/Admin | Owner | Owner | Admin |
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

- UUID Primary Key
- created_at
- updated_at
- Appropriate Foreign Keys
- Indexes
- Row Level Security
- Audit Support (where applicable)

Soft deletes should be preferred over hard deletes for user-generated content.

---

# Production Readiness Checklist

✅ UUID-based schema

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

---

# DATABASE.md Complete

This document defines the complete production database architecture for BullChat and serves as the authoritative specification for backend implementation.

Any schema changes should be reflected in this document before implementation.
