-- Stitch by Nuvio: vision scans, tutor, voice, and notifications

create table public.vision_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  storage_path text,
  scan_type text check (scan_type in ('row_counter', 'stitch_check', 'pattern_read', 'general')),
  confidence numeric(5, 4),
  results jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.vision_scan_findings (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.vision_scans (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  finding_type text not null,
  description text,
  severity text check (severity in ('info', 'warning', 'error')),
  confidence numeric(5, 4),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tutor_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.tutor_conversations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.voice_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  voice_id text,
  speed numeric(4, 2) not null default 1.0,
  pitch numeric(4, 2) not null default 1.0,
  auto_read_patterns boolean not null default false,
  auto_read_tutor boolean not null default true,
  language text not null default 'en-US',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user_voice_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.voice_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_profile_created_voice_settings
after insert on public.profiles
for each row
execute function public.handle_new_user_voice_settings();

select public.attach_updated_at_trigger('public.vision_scans'::regclass);
select public.attach_updated_at_trigger('public.vision_scan_findings'::regclass);
select public.attach_updated_at_trigger('public.tutor_conversations'::regclass);
select public.attach_updated_at_trigger('public.voice_settings'::regclass);
