-- Stitch by Nuvio: application settings (admin-managed)

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

alter table public.app_settings enable row level security;

insert into public.app_settings (key, value)
values
  ('require_email_confirmation', 'false'::jsonb),
  ('allow_public_signup', 'true'::jsonb)
on conflict (key) do nothing;
