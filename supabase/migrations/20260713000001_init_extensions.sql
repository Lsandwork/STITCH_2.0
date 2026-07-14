-- Stitch by Nuvio: extensions and shared utilities

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.attach_updated_at_trigger(target_table regclass)
returns void
language plpgsql
as $$
declare
  trigger_name text := format('set_%s_updated_at', target_table::text);
begin
  execute format(
    'drop trigger if exists %I on %s',
    trigger_name,
    target_table
  );

  execute format(
    'create trigger %I before update on %s for each row execute function public.set_updated_at()',
    trigger_name,
    target_table
  );
end;
$$;
