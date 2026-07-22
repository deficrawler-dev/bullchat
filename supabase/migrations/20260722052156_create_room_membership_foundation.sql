-- BullChat room membership foundation
-- Creates communities, rooms, and their membership systems.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- Shared updated_at trigger
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- Communities
-- =========================================================

create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  avatar_url text,
  cover_image_url text,
  is_active boolean not null default true,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint communities_name_not_blank
    check (length(trim(name)) > 0),

  constraint communities_slug_not_blank
    check (length(trim(slug)) > 0),

  constraint communities_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  constraint communities_slug_unique
    unique (slug)
);

create trigger communities_set_updated_at
before update on public.communities
for each row
execute function public.set_updated_at();

-- =========================================================
-- Community members
-- =========================================================

create table public.community_members (
  community_id uuid not null
    references public.communities(id) on delete cascade,

  user_id uuid not null
    references public.users(id) on delete cascade,

  role text not null default 'member',
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (community_id, user_id),

  constraint community_members_role_valid
    check (role in ('owner', 'admin', 'moderator', 'member')),

  constraint community_members_status_valid
    check (status in ('active', 'muted', 'banned', 'left'))
);

create index community_members_user_id_idx
  on public.community_members (user_id);

create index community_members_active_idx
  on public.community_members (community_id, status)
  where status = 'active';

create trigger community_members_set_updated_at
before update on public.community_members
for each row
execute function public.set_updated_at();

-- =========================================================
-- Rooms
-- =========================================================

create table public.rooms (
  id uuid primary key default gen_random_uuid(),

  community_id uuid not null
    references public.communities(id) on delete cascade,

  name text not null,
  slug text not null,
  description text not null default '',

  avatar_url text,
  background_pattern_url text,
  hero_cover_desktop_url text,
  hero_cover_mobile_url text,
  thumbnail_url text,

  room_type text not null default 'standard',
  visibility text not null default 'public',

  is_flagship boolean not null default false,
  is_pinned boolean not null default false,
  is_active boolean not null default true,

  sort_order integer not null default 0,

  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint rooms_name_not_blank
    check (length(trim(name)) > 0),

  constraint rooms_slug_not_blank
    check (length(trim(slug)) > 0),

  constraint rooms_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  constraint rooms_room_type_valid
    check (
      room_type in (
        'standard',
        'flagship',
        'jobs',
        'market',
        'support',
        'social'
      )
    ),

  constraint rooms_visibility_valid
    check (visibility in ('public', 'members', 'private')),

  constraint rooms_sort_order_non_negative
    check (sort_order >= 0),

  constraint rooms_community_slug_unique
    unique (community_id, slug)
);

create index rooms_community_id_idx
  on public.rooms (community_id);

create index rooms_active_sort_idx
  on public.rooms (community_id, sort_order)
  where is_active = true;

create trigger rooms_set_updated_at
before update on public.rooms
for each row
execute function public.set_updated_at();

-- =========================================================
-- Room members
-- =========================================================

create table public.room_members (
  room_id uuid not null
    references public.rooms(id) on delete cascade,

  user_id uuid not null
    references public.users(id) on delete cascade,

  role text not null default 'member',
  status text not null default 'active',

  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  notifications_enabled boolean not null default true,
  updated_at timestamptz not null default now(),

  primary key (room_id, user_id),

  constraint room_members_role_valid
    check (role in ('owner', 'admin', 'moderator', 'member')),

  constraint room_members_status_valid
    check (status in ('active', 'muted', 'banned', 'left'))
);

create index room_members_user_id_idx
  on public.room_members (user_id);

create index room_members_active_idx
  on public.room_members (room_id, status)
  where status = 'active';

create trigger room_members_set_updated_at
before update on public.room_members
for each row
execute function public.set_updated_at();

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;

-- Anyone may read active communities.
create policy "Active communities are publicly readable"
on public.communities
for select
using (is_active = true);

-- Anyone may read active public rooms.
create policy "Active public rooms are publicly readable"
on public.rooms
for select
using (
  is_active = true
  and visibility = 'public'
);

-- Authenticated community members may read members of their communities.
create policy "Community members can read community membership"
on public.community_members
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.community_members viewer_membership
    where viewer_membership.community_id =
      community_members.community_id
      and viewer_membership.user_id = auth.uid()
      and viewer_membership.status = 'active'
  )
);

-- Users may join a community as themselves.
create policy "Users can join communities"
on public.community_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'member'
  and status = 'active'
);

-- Users may update only their own ordinary membership state.
create policy "Users can update their community membership"
on public.community_members
for update
to authenticated
using (
  user_id = auth.uid()
  and role = 'member'
)
with check (
  user_id = auth.uid()
  and role = 'member'
  and status in ('active', 'left')
);

-- Authenticated users may read their own room memberships.
create policy "Users can read their room memberships"
on public.room_members
for select
to authenticated
using (user_id = auth.uid());

-- Users may join active public rooms as themselves.
create policy "Users can join active public rooms"
on public.room_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'member'
  and status = 'active'
  and exists (
    select 1
    from public.rooms
    where rooms.id = room_members.room_id
      and rooms.is_active = true
      and rooms.visibility = 'public'
  )
);

-- Users may leave, rejoin, or update notification settings
-- for their own ordinary memberships.
create policy "Users can update their room memberships"
on public.room_members
for update
to authenticated
using (
  user_id = auth.uid()
  and role = 'member'
)
with check (
  user_id = auth.uid()
  and role = 'member'
  and status in ('active', 'left')
);

-- Users may remove only their own ordinary room memberships.
create policy "Users can delete their room memberships"
on public.room_members
for delete
to authenticated
using (
  user_id = auth.uid()
  and role = 'member'
);

-- =========================================================
-- Seed BullChat and its official rooms
-- =========================================================

insert into public.communities (
  name,
  slug,
  description,
  is_active
)
values (
  'BullChat',
  'bullchat',
  'A rooms-based community platform for connection, collaboration and building.',
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  updated_at = now();

with bullchat_community as (
  select id
  from public.communities
  where slug = 'bullchat'
)
insert into public.rooms (
  community_id,
  name,
  slug,
  description,
  avatar_url,
  background_pattern_url,
  hero_cover_desktop_url,
  hero_cover_mobile_url,
  thumbnail_url,
  room_type,
  visibility,
  is_flagship,
  is_pinned,
  sort_order
)
select
  bullchat_community.id,
  room_data.name,
  room_data.slug,
  room_data.description,
  '/rooms/' || room_data.slug || '/avatar.webp',
  '/rooms/' || room_data.slug || '/background-pattern.webp',
  '/rooms/' || room_data.slug || '/hero-cover-desktop.webp',
  '/rooms/' || room_data.slug || '/hero-cover-mobile.webp',
  '/rooms/' || room_data.slug || '/thumbnail.webp',
  room_data.room_type,
  'public',
  room_data.is_flagship,
  room_data.is_pinned,
  room_data.sort_order
from bullchat_community
cross join (
  values
    (
      'Ansem Community',
      'ansem-community',
      'The flagship home for the Ansem community — announcements, discussion and connection.',
      'flagship',
      true,
      true,
      1
    ),
    (
      'Bull Community',
      'bull-community',
      'Where the wider Bull community gathers to connect, contribute and grow together.',
      'standard',
      false,
      false,
      2
    ),
    (
      'Builders',
      'builders',
      'A room for developers, designers and founders building products across Web3.',
      'standard',
      false,
      false,
      3
    ),
    (
      'Job Board',
      'job-board',
      'Discover and share legitimate Web3 jobs, freelance work and collaboration opportunities.',
      'jobs',
      false,
      false,
      4
    ),
    (
      'Market Talk',
      'market-talk',
      'Discuss market movements, analysis and trading ideas without micro-token shilling.',
      'market',
      false,
      false,
      5
    ),
    (
      'Meme Studio',
      'meme-studio',
      'Create, share and improve memes for the community.',
      'social',
      false,
      false,
      6
    ),
    (
      'Launchpad Hub',
      'launchpad-hub',
      'Discuss major token launch platforms including Bags.fm, Pump.fun, BONK.fun and Four.meme.',
      'market',
      false,
      false,
      7
    ),
    (
      'Community Support',
      'community-support',
      'Get help with BullChat, report problems and support other community members.',
      'support',
      false,
      false,
      8
    ),
    (
      'Wins & Losses',
      'wins-losses',
      'Share your best and worst crypto experiences and the lessons you learned.',
      'social',
      false,
      false,
      9
    ),
    (
      'Off Topic',
      'off-topic',
      'Relax and discuss life, entertainment and anything outside the main BullChat topics.',
      'social',
      false,
      false,
      10
    )
) as room_data (
  name,
  slug,
  description,
  room_type,
  is_flagship,
  is_pinned,
  sort_order
)
on conflict (community_id, slug) do update
set
  name = excluded.name,
  description = excluded.description,
  avatar_url = excluded.avatar_url,
  background_pattern_url = excluded.background_pattern_url,
  hero_cover_desktop_url = excluded.hero_cover_desktop_url,
  hero_cover_mobile_url = excluded.hero_cover_mobile_url,
  thumbnail_url = excluded.thumbnail_url,
  room_type = excluded.room_type,
  visibility = excluded.visibility,
  is_flagship = excluded.is_flagship,
  is_pinned = excluded.is_pinned,
  is_active = true,
  sort_order = excluded.sort_order,
  updated_at = now();

commit;