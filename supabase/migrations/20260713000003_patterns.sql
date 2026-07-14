-- Stitch by Nuvio: pattern authoring and collections

create table public.patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  source text check (source in ('ai_generated', 'uploaded', 'photo', 'manual')),
  is_public boolean not null default false,
  current_version_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.pattern_versions (
  id uuid primary key default gen_random_uuid(),
  pattern_id uuid not null references public.patterns (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  version_number integer not null default 1,
  title text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (pattern_id, version_number)
);

alter table public.patterns
  add constraint patterns_current_version_id_fkey
  foreign key (current_version_id) references public.pattern_versions (id) on delete set null;

alter table public.projects
  add constraint projects_pattern_id_fkey
  foreign key (pattern_id) references public.patterns (id) on delete set null;

create table public.pattern_sections (
  id uuid primary key default gen_random_uuid(),
  pattern_version_id uuid not null references public.pattern_versions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  instructions text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.pattern_rows (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.pattern_sections (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  row_number integer not null,
  instruction text not null,
  expected_stitch_count integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (section_id, row_number)
);

create table public.pattern_translations (
  id uuid primary key default gen_random_uuid(),
  pattern_id uuid not null references public.patterns (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  source_language text not null,
  target_language text not null,
  translated_content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.pattern_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.saved_patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  pattern_id uuid not null references public.patterns (id) on delete cascade,
  collection_id uuid references public.pattern_collections (id) on delete set null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, pattern_id)
);

select public.attach_updated_at_trigger('public.patterns'::regclass);
select public.attach_updated_at_trigger('public.pattern_versions'::regclass);
select public.attach_updated_at_trigger('public.pattern_sections'::regclass);
select public.attach_updated_at_trigger('public.pattern_rows'::regclass);
select public.attach_updated_at_trigger('public.pattern_translations'::regclass);
select public.attach_updated_at_trigger('public.pattern_collections'::regclass);
select public.attach_updated_at_trigger('public.saved_patterns'::regclass);
