-- Stitch by Nuvio: performance indexes

create index if not exists idx_profiles_created_at
  on public.profiles (created_at desc);

create index if not exists idx_user_preferences_user_id
  on public.user_preferences (user_id);

create index if not exists idx_subscriptions_user_id
  on public.subscriptions (user_id);

create index if not exists idx_subscriptions_status
  on public.subscriptions (status);

create index if not exists idx_projects_user_id
  on public.projects (user_id);

create index if not exists idx_projects_status
  on public.projects (status);

create index if not exists idx_projects_created_at
  on public.projects (created_at desc);

create index if not exists idx_project_yarns_project_id
  on public.project_yarns (project_id);

create index if not exists idx_project_yarns_user_id
  on public.project_yarns (user_id);

create index if not exists idx_project_notes_project_id
  on public.project_notes (project_id);

create index if not exists idx_project_notes_user_id
  on public.project_notes (user_id);

create index if not exists idx_project_photos_project_id
  on public.project_photos (project_id);

create index if not exists idx_project_photos_user_id
  on public.project_photos (user_id);

create index if not exists idx_project_timers_project_id
  on public.project_timers (project_id);

create index if not exists idx_project_timers_user_id
  on public.project_timers (user_id);

create index if not exists idx_project_events_project_id
  on public.project_events (project_id);

create index if not exists idx_project_events_user_id
  on public.project_events (user_id);

create index if not exists idx_project_events_created_at
  on public.project_events (created_at desc);

create index if not exists idx_patterns_user_id
  on public.patterns (user_id);

create index if not exists idx_patterns_created_at
  on public.patterns (created_at desc);

create index if not exists idx_pattern_versions_pattern_id
  on public.pattern_versions (pattern_id);

create index if not exists idx_pattern_versions_user_id
  on public.pattern_versions (user_id);

create index if not exists idx_pattern_sections_pattern_version_id
  on public.pattern_sections (pattern_version_id);

create index if not exists idx_pattern_sections_user_id
  on public.pattern_sections (user_id);

create index if not exists idx_pattern_rows_section_id
  on public.pattern_rows (section_id);

create index if not exists idx_pattern_rows_user_id
  on public.pattern_rows (user_id);

create index if not exists idx_pattern_translations_pattern_id
  on public.pattern_translations (pattern_id);

create index if not exists idx_pattern_translations_user_id
  on public.pattern_translations (user_id);

create index if not exists idx_saved_patterns_user_id
  on public.saved_patterns (user_id);

create index if not exists idx_saved_patterns_pattern_id
  on public.saved_patterns (pattern_id);

create index if not exists idx_pattern_collections_user_id
  on public.pattern_collections (user_id);

create index if not exists idx_yarn_inventory_user_id
  on public.yarn_inventory (user_id);

create index if not exists idx_yarn_inventory_created_at
  on public.yarn_inventory (created_at desc);

create index if not exists idx_yarn_usage_user_id
  on public.yarn_usage (user_id);

create index if not exists idx_yarn_usage_project_id
  on public.yarn_usage (project_id);

create index if not exists idx_yarn_usage_yarn_inventory_id
  on public.yarn_usage (yarn_inventory_id);

create index if not exists idx_yarn_substitutions_user_id
  on public.yarn_substitutions (user_id);

create index if not exists idx_color_palettes_user_id
  on public.color_palettes (user_id);

create index if not exists idx_color_palette_items_palette_id
  on public.color_palette_items (palette_id);

create index if not exists idx_color_palette_items_user_id
  on public.color_palette_items (user_id);

create index if not exists idx_vision_scans_user_id
  on public.vision_scans (user_id);

create index if not exists idx_vision_scans_project_id
  on public.vision_scans (project_id);

create index if not exists idx_vision_scans_status
  on public.vision_scans (status);

create index if not exists idx_vision_scans_created_at
  on public.vision_scans (created_at desc);

create index if not exists idx_vision_scan_findings_scan_id
  on public.vision_scan_findings (scan_id);

create index if not exists idx_vision_scan_findings_user_id
  on public.vision_scan_findings (user_id);

create index if not exists idx_tutor_conversations_user_id
  on public.tutor_conversations (user_id);

create index if not exists idx_tutor_conversations_project_id
  on public.tutor_conversations (project_id);

create index if not exists idx_tutor_conversations_created_at
  on public.tutor_conversations (created_at desc);

create index if not exists idx_tutor_messages_conversation_id
  on public.tutor_messages (conversation_id);

create index if not exists idx_tutor_messages_user_id
  on public.tutor_messages (user_id);

create index if not exists idx_tutor_messages_created_at
  on public.tutor_messages (created_at desc);

create index if not exists idx_voice_settings_user_id
  on public.voice_settings (user_id);

create index if not exists idx_notifications_user_id
  on public.notifications (user_id);

create index if not exists idx_notifications_created_at
  on public.notifications (created_at desc);

create index if not exists idx_lessons_category
  on public.lessons (category);

create index if not exists idx_lessons_created_at
  on public.lessons (created_at desc);

create index if not exists idx_lesson_progress_user_id
  on public.lesson_progress (user_id);

create index if not exists idx_lesson_progress_lesson_id
  on public.lesson_progress (lesson_id);

create index if not exists idx_lesson_progress_status
  on public.lesson_progress (status);
