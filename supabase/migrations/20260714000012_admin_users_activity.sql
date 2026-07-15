-- Admin roles, lifetime access, and user activity tracking

create type public.admin_role as enum ('user', 'admin');

alter table public.profiles
  add column if not exists admin_role public.admin_role not null default 'user';

alter table public.subscriptions
  add column if not exists lifetime_access boolean not null default false,
  add column if not exists access_granted_by uuid references public.profiles (id) on delete set null,
  add column if not exists access_granted_at timestamptz,
  add column if not exists access_notes text;

create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_type text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_user_activity_user_created
  on public.user_activity (user_id, created_at desc);

create index if not exists idx_user_activity_type_created
  on public.user_activity (activity_type, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and admin_role = 'admin'
  );
$$;

-- Prevent non-admins from changing their own admin_role
create or replace function public.protect_admin_role()
returns trigger
language plpgsql
as $$
begin
  if new.admin_role is distinct from old.admin_role and not public.is_admin() then
    new.admin_role := old.admin_role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_admin_role on public.profiles;
create trigger profiles_protect_admin_role
  before update on public.profiles
  for each row
  execute function public.protect_admin_role();

alter table public.user_activity enable row level security;

create policy "user_activity_select_own"
  on public.user_activity for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_activity_select_admin"
  on public.user_activity for select
  to authenticated
  using (public.is_admin());

create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "subscriptions_select_admin"
  on public.subscriptions for select
  to authenticated
  using (public.is_admin());

-- Profile avatars: public read for display
update storage.buckets
set public = true
where id = 'stitch-profile-images';

create policy "stitch_profile_images_public_select"
  on storage.objects for select
  to public
  using (bucket_id = 'stitch-profile-images');
