-- Stitch by Nuvio: yarn inventory and color palettes

create table public.yarn_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  brand text,
  name text not null,
  color_name text,
  color_hex text,
  weight text,
  fiber_content text,
  yardage numeric(10, 2),
  weight_grams numeric(10, 2),
  quantity_skeins numeric(10, 2) not null default 1,
  image_url text,
  storage_path text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.project_yarns
  add constraint project_yarns_yarn_inventory_id_fkey
  foreign key (yarn_inventory_id) references public.yarn_inventory (id) on delete set null;

create table public.yarn_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  yarn_inventory_id uuid not null references public.yarn_inventory (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  amount_grams numeric(10, 2),
  amount_yards numeric(10, 2),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.yarn_substitutions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  source_yarn_id uuid references public.yarn_inventory (id) on delete set null,
  target_yarn_id uuid references public.yarn_inventory (id) on delete set null,
  source_yarn_name text,
  target_yarn_name text,
  match_score numeric(5, 2),
  notes text,
  ai_recommendation jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.color_palettes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  source_image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.color_palette_items (
  id uuid primary key default gen_random_uuid(),
  palette_id uuid not null references public.color_palettes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  color_hex text not null,
  color_name text,
  sort_order integer not null default 0,
  yarn_inventory_id uuid references public.yarn_inventory (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

select public.attach_updated_at_trigger('public.yarn_inventory'::regclass);
select public.attach_updated_at_trigger('public.yarn_usage'::regclass);
select public.attach_updated_at_trigger('public.yarn_substitutions'::regclass);
select public.attach_updated_at_trigger('public.color_palettes'::regclass);
select public.attach_updated_at_trigger('public.color_palette_items'::regclass);
