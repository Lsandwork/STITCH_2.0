-- Stitch by Nuvio: learning center

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text,
  content text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer,
  sort_order integer not null default 0,
  illustration_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed')
  ),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, lesson_id)
);

select public.attach_updated_at_trigger('public.lessons'::regclass);
select public.attach_updated_at_trigger('public.lesson_progress'::regclass);
