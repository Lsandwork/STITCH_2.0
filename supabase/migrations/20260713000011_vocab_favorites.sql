-- Stitch by Nuvio: user vocabulary favorites

create table if not exists public.user_vocab_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  term_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, term_id)
);

create index if not exists user_vocab_favorites_user_id_idx
  on public.user_vocab_favorites (user_id);

alter table public.user_vocab_favorites enable row level security;

create policy "user_vocab_favorites_select_own"
  on public.user_vocab_favorites for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_vocab_favorites_insert_own"
  on public.user_vocab_favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_vocab_favorites_delete_own"
  on public.user_vocab_favorites for delete
  to authenticated
  using (auth.uid() = user_id);
