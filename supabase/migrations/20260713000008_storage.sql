-- Stitch by Nuvio: storage buckets and policies

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('stitch-project-images', 'stitch-project-images', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('stitch-pattern-files', 'stitch-pattern-files', false, 20971520, array['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'image/webp']),
  ('stitch-yarn-images', 'stitch-yarn-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('stitch-vision-scans', 'stitch-vision-scans', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('stitch-profile-images', 'stitch-profile-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('stitch-generated-assets', 'stitch-generated-assets', false, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'])
on conflict (id) do nothing;

create or replace function public.storage_user_owns_path(object_name text)
returns boolean
language sql
stable
as $$
  select (storage.foldername(object_name))[1] = auth.uid()::text;
$$;

-- stitch-project-images
create policy "stitch_project_images_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'stitch-project-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_project_images_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'stitch-project-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_project_images_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'stitch-project-images'
    and public.storage_user_owns_path(name)
  )
  with check (
    bucket_id = 'stitch-project-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_project_images_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'stitch-project-images'
    and public.storage_user_owns_path(name)
  );

-- stitch-pattern-files
create policy "stitch_pattern_files_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'stitch-pattern-files'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_pattern_files_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'stitch-pattern-files'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_pattern_files_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'stitch-pattern-files'
    and public.storage_user_owns_path(name)
  )
  with check (
    bucket_id = 'stitch-pattern-files'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_pattern_files_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'stitch-pattern-files'
    and public.storage_user_owns_path(name)
  );

-- stitch-yarn-images
create policy "stitch_yarn_images_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'stitch-yarn-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_yarn_images_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'stitch-yarn-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_yarn_images_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'stitch-yarn-images'
    and public.storage_user_owns_path(name)
  )
  with check (
    bucket_id = 'stitch-yarn-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_yarn_images_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'stitch-yarn-images'
    and public.storage_user_owns_path(name)
  );

-- stitch-vision-scans
create policy "stitch_vision_scans_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'stitch-vision-scans'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_vision_scans_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'stitch-vision-scans'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_vision_scans_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'stitch-vision-scans'
    and public.storage_user_owns_path(name)
  )
  with check (
    bucket_id = 'stitch-vision-scans'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_vision_scans_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'stitch-vision-scans'
    and public.storage_user_owns_path(name)
  );

-- stitch-profile-images
create policy "stitch_profile_images_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'stitch-profile-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_profile_images_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'stitch-profile-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_profile_images_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'stitch-profile-images'
    and public.storage_user_owns_path(name)
  )
  with check (
    bucket_id = 'stitch-profile-images'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_profile_images_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'stitch-profile-images'
    and public.storage_user_owns_path(name)
  );

-- stitch-generated-assets
create policy "stitch_generated_assets_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'stitch-generated-assets'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_generated_assets_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'stitch-generated-assets'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_generated_assets_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'stitch-generated-assets'
    and public.storage_user_owns_path(name)
  )
  with check (
    bucket_id = 'stitch-generated-assets'
    and public.storage_user_owns_path(name)
  );

create policy "stitch_generated_assets_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'stitch-generated-assets'
    and public.storage_user_owns_path(name)
  );
