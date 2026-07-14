-- Stitch by Nuvio: core user and project tables

create type public.subscription_tier as enum (
  'free',
  'stitch_plus',
  'stitch_vision'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  bio text,
  skill_level text check (skill_level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  reduced_motion boolean not null default false,
  voice_enabled boolean not null default true,
  default_units text not null default 'us' check (default_units in ('us', 'metric')),
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  tier public.subscription_tier not null default 'free',
  status text not null default 'active' check (status in ('active', 'trialing', 'past_due', 'canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'Idea' check (
    status in (
      'Idea',
      'Ready to Start',
      'In Progress',
      'Paused',
      'Needs Fixing',
      'Completed',
      'Frogged',
      'Archived'
    )
  ),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  current_row integer not null default 0,
  total_rows integer,
  cover_image_url text,
  pattern_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.project_yarns (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  yarn_inventory_id uuid,
  color_name text,
  weight text,
  quantity_grams numeric(10, 2),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.project_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.project_timers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  );

  insert into public.user_preferences (user_id)
  values (new.id);

  insert into public.subscriptions (user_id, tier)
  values (new.id, 'free');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

select public.attach_updated_at_trigger('public.profiles'::regclass);
select public.attach_updated_at_trigger('public.user_preferences'::regclass);
select public.attach_updated_at_trigger('public.subscriptions'::regclass);
select public.attach_updated_at_trigger('public.projects'::regclass);
select public.attach_updated_at_trigger('public.project_yarns'::regclass);
select public.attach_updated_at_trigger('public.project_notes'::regclass);
select public.attach_updated_at_trigger('public.project_photos'::regclass);
select public.attach_updated_at_trigger('public.project_timers'::regclass);
