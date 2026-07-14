-- Stitch by Nuvio: row-level security policies

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.subscriptions enable row level security;
alter table public.projects enable row level security;
alter table public.project_yarns enable row level security;
alter table public.project_notes enable row level security;
alter table public.project_photos enable row level security;
alter table public.project_timers enable row level security;
alter table public.project_events enable row level security;
alter table public.patterns enable row level security;
alter table public.pattern_versions enable row level security;
alter table public.pattern_sections enable row level security;
alter table public.pattern_rows enable row level security;
alter table public.pattern_translations enable row level security;
alter table public.saved_patterns enable row level security;
alter table public.pattern_collections enable row level security;
alter table public.yarn_inventory enable row level security;
alter table public.yarn_usage enable row level security;
alter table public.yarn_substitutions enable row level security;
alter table public.color_palettes enable row level security;
alter table public.color_palette_items enable row level security;
alter table public.vision_scans enable row level security;
alter table public.vision_scan_findings enable row level security;
alter table public.tutor_conversations enable row level security;
alter table public.tutor_messages enable row level security;
alter table public.voice_settings enable row level security;
alter table public.notifications enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;

-- profiles
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_preferences
create policy "user_preferences_select_own"
  on public.user_preferences for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_preferences_insert_own"
  on public.user_preferences for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_preferences_update_own"
  on public.user_preferences for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_preferences_delete_own"
  on public.user_preferences for delete
  to authenticated
  using (auth.uid() = user_id);

-- subscriptions
create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "subscriptions_insert_own"
  on public.subscriptions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "subscriptions_update_own"
  on public.subscriptions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- projects
create policy "projects_select_own"
  on public.projects for select
  to authenticated
  using (auth.uid() = user_id);

create policy "projects_insert_own"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "projects_update_own"
  on public.projects for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "projects_delete_own"
  on public.projects for delete
  to authenticated
  using (auth.uid() = user_id);

-- project_yarns
create policy "project_yarns_select_own"
  on public.project_yarns for select
  to authenticated
  using (auth.uid() = user_id);

create policy "project_yarns_insert_own"
  on public.project_yarns for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "project_yarns_update_own"
  on public.project_yarns for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "project_yarns_delete_own"
  on public.project_yarns for delete
  to authenticated
  using (auth.uid() = user_id);

-- project_notes
create policy "project_notes_select_own"
  on public.project_notes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "project_notes_insert_own"
  on public.project_notes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "project_notes_update_own"
  on public.project_notes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "project_notes_delete_own"
  on public.project_notes for delete
  to authenticated
  using (auth.uid() = user_id);

-- project_photos
create policy "project_photos_select_own"
  on public.project_photos for select
  to authenticated
  using (auth.uid() = user_id);

create policy "project_photos_insert_own"
  on public.project_photos for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "project_photos_update_own"
  on public.project_photos for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "project_photos_delete_own"
  on public.project_photos for delete
  to authenticated
  using (auth.uid() = user_id);

-- project_timers
create policy "project_timers_select_own"
  on public.project_timers for select
  to authenticated
  using (auth.uid() = user_id);

create policy "project_timers_insert_own"
  on public.project_timers for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "project_timers_update_own"
  on public.project_timers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "project_timers_delete_own"
  on public.project_timers for delete
  to authenticated
  using (auth.uid() = user_id);

-- project_events
create policy "project_events_select_own"
  on public.project_events for select
  to authenticated
  using (auth.uid() = user_id);

create policy "project_events_insert_own"
  on public.project_events for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "project_events_delete_own"
  on public.project_events for delete
  to authenticated
  using (auth.uid() = user_id);

-- patterns
create policy "patterns_select_own"
  on public.patterns for select
  to authenticated
  using (auth.uid() = user_id);

create policy "patterns_insert_own"
  on public.patterns for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "patterns_update_own"
  on public.patterns for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "patterns_delete_own"
  on public.patterns for delete
  to authenticated
  using (auth.uid() = user_id);

-- pattern_versions
create policy "pattern_versions_select_own"
  on public.pattern_versions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "pattern_versions_insert_own"
  on public.pattern_versions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "pattern_versions_update_own"
  on public.pattern_versions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "pattern_versions_delete_own"
  on public.pattern_versions for delete
  to authenticated
  using (auth.uid() = user_id);

-- pattern_sections
create policy "pattern_sections_select_own"
  on public.pattern_sections for select
  to authenticated
  using (auth.uid() = user_id);

create policy "pattern_sections_insert_own"
  on public.pattern_sections for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "pattern_sections_update_own"
  on public.pattern_sections for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "pattern_sections_delete_own"
  on public.pattern_sections for delete
  to authenticated
  using (auth.uid() = user_id);

-- pattern_rows
create policy "pattern_rows_select_own"
  on public.pattern_rows for select
  to authenticated
  using (auth.uid() = user_id);

create policy "pattern_rows_insert_own"
  on public.pattern_rows for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "pattern_rows_update_own"
  on public.pattern_rows for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "pattern_rows_delete_own"
  on public.pattern_rows for delete
  to authenticated
  using (auth.uid() = user_id);

-- pattern_translations
create policy "pattern_translations_select_own"
  on public.pattern_translations for select
  to authenticated
  using (auth.uid() = user_id);

create policy "pattern_translations_insert_own"
  on public.pattern_translations for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "pattern_translations_update_own"
  on public.pattern_translations for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "pattern_translations_delete_own"
  on public.pattern_translations for delete
  to authenticated
  using (auth.uid() = user_id);

-- saved_patterns
create policy "saved_patterns_select_own"
  on public.saved_patterns for select
  to authenticated
  using (auth.uid() = user_id);

create policy "saved_patterns_insert_own"
  on public.saved_patterns for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "saved_patterns_update_own"
  on public.saved_patterns for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "saved_patterns_delete_own"
  on public.saved_patterns for delete
  to authenticated
  using (auth.uid() = user_id);

-- pattern_collections
create policy "pattern_collections_select_own"
  on public.pattern_collections for select
  to authenticated
  using (auth.uid() = user_id);

create policy "pattern_collections_insert_own"
  on public.pattern_collections for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "pattern_collections_update_own"
  on public.pattern_collections for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "pattern_collections_delete_own"
  on public.pattern_collections for delete
  to authenticated
  using (auth.uid() = user_id);

-- yarn_inventory
create policy "yarn_inventory_select_own"
  on public.yarn_inventory for select
  to authenticated
  using (auth.uid() = user_id);

create policy "yarn_inventory_insert_own"
  on public.yarn_inventory for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "yarn_inventory_update_own"
  on public.yarn_inventory for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "yarn_inventory_delete_own"
  on public.yarn_inventory for delete
  to authenticated
  using (auth.uid() = user_id);

-- yarn_usage
create policy "yarn_usage_select_own"
  on public.yarn_usage for select
  to authenticated
  using (auth.uid() = user_id);

create policy "yarn_usage_insert_own"
  on public.yarn_usage for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "yarn_usage_update_own"
  on public.yarn_usage for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "yarn_usage_delete_own"
  on public.yarn_usage for delete
  to authenticated
  using (auth.uid() = user_id);

-- yarn_substitutions
create policy "yarn_substitutions_select_own"
  on public.yarn_substitutions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "yarn_substitutions_insert_own"
  on public.yarn_substitutions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "yarn_substitutions_update_own"
  on public.yarn_substitutions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "yarn_substitutions_delete_own"
  on public.yarn_substitutions for delete
  to authenticated
  using (auth.uid() = user_id);

-- color_palettes
create policy "color_palettes_select_own"
  on public.color_palettes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "color_palettes_insert_own"
  on public.color_palettes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "color_palettes_update_own"
  on public.color_palettes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "color_palettes_delete_own"
  on public.color_palettes for delete
  to authenticated
  using (auth.uid() = user_id);

-- color_palette_items
create policy "color_palette_items_select_own"
  on public.color_palette_items for select
  to authenticated
  using (auth.uid() = user_id);

create policy "color_palette_items_insert_own"
  on public.color_palette_items for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "color_palette_items_update_own"
  on public.color_palette_items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "color_palette_items_delete_own"
  on public.color_palette_items for delete
  to authenticated
  using (auth.uid() = user_id);

-- vision_scans
create policy "vision_scans_select_own"
  on public.vision_scans for select
  to authenticated
  using (auth.uid() = user_id);

create policy "vision_scans_insert_own"
  on public.vision_scans for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "vision_scans_update_own"
  on public.vision_scans for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "vision_scans_delete_own"
  on public.vision_scans for delete
  to authenticated
  using (auth.uid() = user_id);

-- vision_scan_findings
create policy "vision_scan_findings_select_own"
  on public.vision_scan_findings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "vision_scan_findings_insert_own"
  on public.vision_scan_findings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "vision_scan_findings_update_own"
  on public.vision_scan_findings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "vision_scan_findings_delete_own"
  on public.vision_scan_findings for delete
  to authenticated
  using (auth.uid() = user_id);

-- tutor_conversations
create policy "tutor_conversations_select_own"
  on public.tutor_conversations for select
  to authenticated
  using (auth.uid() = user_id);

create policy "tutor_conversations_insert_own"
  on public.tutor_conversations for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "tutor_conversations_update_own"
  on public.tutor_conversations for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tutor_conversations_delete_own"
  on public.tutor_conversations for delete
  to authenticated
  using (auth.uid() = user_id);

-- tutor_messages
create policy "tutor_messages_select_own"
  on public.tutor_messages for select
  to authenticated
  using (auth.uid() = user_id);

create policy "tutor_messages_insert_own"
  on public.tutor_messages for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "tutor_messages_delete_own"
  on public.tutor_messages for delete
  to authenticated
  using (auth.uid() = user_id);

-- voice_settings
create policy "voice_settings_select_own"
  on public.voice_settings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "voice_settings_insert_own"
  on public.voice_settings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "voice_settings_update_own"
  on public.voice_settings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- notifications
create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "notifications_insert_own"
  on public.notifications for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications_delete_own"
  on public.notifications for delete
  to authenticated
  using (auth.uid() = user_id);

-- lessons (readable by all authenticated users)
create policy "lessons_select_authenticated"
  on public.lessons for select
  to authenticated
  using (is_published = true);

-- lesson_progress (user-scoped)
create policy "lesson_progress_select_own"
  on public.lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "lesson_progress_insert_own"
  on public.lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "lesson_progress_update_own"
  on public.lesson_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "lesson_progress_delete_own"
  on public.lesson_progress for delete
  to authenticated
  using (auth.uid() = user_id);
