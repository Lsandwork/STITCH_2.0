export type SubscriptionTier = "free" | "stitch_plus" | "stitch_vision";

export type ProjectStatus =
  | "Idea"
  | "Ready to Start"
  | "In Progress"
  | "Paused"
  | "Needs Fixing"
  | "Completed"
  | "Frogged"
  | "Archived";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          skill_level: SkillLevel | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          skill_level?: SkillLevel | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          skill_level?: SkillLevel | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: "light" | "dark" | "system";
          reduced_motion: boolean;
          voice_enabled: boolean;
          default_units: "us" | "metric";
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: "light" | "dark" | "system";
          reduced_motion?: boolean;
          voice_enabled?: boolean;
          default_units?: "us" | "metric";
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: "light" | "dark" | "system";
          reduced_motion?: boolean;
          voice_enabled?: boolean;
          default_units?: "us" | "metric";
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: SubscriptionTier;
          status: "active" | "trialing" | "past_due" | "canceled";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier?: SubscriptionTier;
          status?: "active" | "trialing" | "past_due" | "canceled";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier?: SubscriptionTier;
          status?: "active" | "trialing" | "past_due" | "canceled";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: ProjectStatus;
          progress_percent: number;
          current_row: number;
          total_rows: number | null;
          cover_image_url: string | null;
          pattern_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: ProjectStatus;
          progress_percent?: number;
          current_row?: number;
          total_rows?: number | null;
          cover_image_url?: string | null;
          pattern_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: ProjectStatus;
          progress_percent?: number;
          current_row?: number;
          total_rows?: number | null;
          cover_image_url?: string | null;
          pattern_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_pattern_id_fkey";
            columns: ["pattern_id"];
            isOneToOne: false;
            referencedRelation: "patterns";
            referencedColumns: ["id"];
          },
        ];
      };
      project_yarns: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          yarn_inventory_id: string | null;
          color_name: string | null;
          weight: string | null;
          quantity_grams: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          yarn_inventory_id?: string | null;
          color_name?: string | null;
          weight?: string | null;
          quantity_grams?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          yarn_inventory_id?: string | null;
          color_name?: string | null;
          weight?: string | null;
          quantity_grams?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_yarns_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_yarns_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_yarns_yarn_inventory_id_fkey";
            columns: ["yarn_inventory_id"];
            isOneToOne: false;
            referencedRelation: "yarn_inventory";
            referencedColumns: ["id"];
          },
        ];
      };
      project_notes: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_notes_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_notes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      project_photos: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          storage_path: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          storage_path: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          storage_path?: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_photos_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_photos_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      project_timers: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          started_at: string;
          ended_at: string | null;
          duration_seconds: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          started_at: string;
          ended_at?: string | null;
          duration_seconds?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          started_at?: string;
          ended_at?: string | null;
          duration_seconds?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_timers_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_timers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      project_events: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          event_type: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          event_type: string;
          payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          event_type?: string;
          payload?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_events_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      patterns: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          source: "ai_generated" | "uploaded" | "photo" | "manual" | null;
          is_public: boolean;
          current_version_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          source?: "ai_generated" | "uploaded" | "photo" | "manual" | null;
          is_public?: boolean;
          current_version_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          source?: "ai_generated" | "uploaded" | "photo" | "manual" | null;
          is_public?: boolean;
          current_version_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "patterns_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "patterns_current_version_id_fkey";
            columns: ["current_version_id"];
            isOneToOne: false;
            referencedRelation: "pattern_versions";
            referencedColumns: ["id"];
          },
        ];
      };
      pattern_versions: {
        Row: {
          id: string;
          pattern_id: string;
          user_id: string;
          version_number: number;
          title: string | null;
          notes: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pattern_id: string;
          user_id: string;
          version_number?: number;
          title?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pattern_id?: string;
          user_id?: string;
          version_number?: number;
          title?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pattern_versions_pattern_id_fkey";
            columns: ["pattern_id"];
            isOneToOne: false;
            referencedRelation: "patterns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pattern_versions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pattern_sections: {
        Row: {
          id: string;
          pattern_version_id: string;
          user_id: string;
          name: string;
          sort_order: number;
          instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pattern_version_id: string;
          user_id: string;
          name: string;
          sort_order?: number;
          instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pattern_version_id?: string;
          user_id?: string;
          name?: string;
          sort_order?: number;
          instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pattern_sections_pattern_version_id_fkey";
            columns: ["pattern_version_id"];
            isOneToOne: false;
            referencedRelation: "pattern_versions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pattern_sections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pattern_rows: {
        Row: {
          id: string;
          section_id: string;
          user_id: string;
          row_number: number;
          instruction: string;
          expected_stitch_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          user_id: string;
          row_number: number;
          instruction: string;
          expected_stitch_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          user_id?: string;
          row_number?: number;
          instruction?: string;
          expected_stitch_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pattern_rows_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "pattern_sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pattern_rows_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pattern_translations: {
        Row: {
          id: string;
          pattern_id: string;
          user_id: string;
          source_language: string;
          target_language: string;
          translated_content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pattern_id: string;
          user_id: string;
          source_language: string;
          target_language: string;
          translated_content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pattern_id?: string;
          user_id?: string;
          source_language?: string;
          target_language?: string;
          translated_content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pattern_translations_pattern_id_fkey";
            columns: ["pattern_id"];
            isOneToOne: false;
            referencedRelation: "patterns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pattern_translations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pattern_collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pattern_collections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      saved_patterns: {
        Row: {
          id: string;
          user_id: string;
          pattern_id: string;
          collection_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pattern_id: string;
          collection_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pattern_id?: string;
          collection_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_patterns_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_patterns_pattern_id_fkey";
            columns: ["pattern_id"];
            isOneToOne: false;
            referencedRelation: "patterns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_patterns_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "pattern_collections";
            referencedColumns: ["id"];
          },
        ];
      };
      yarn_inventory: {
        Row: {
          id: string;
          user_id: string;
          brand: string | null;
          name: string;
          color_name: string | null;
          color_hex: string | null;
          weight: string | null;
          fiber_content: string | null;
          yardage: number | null;
          weight_grams: number | null;
          quantity_skeins: number;
          image_url: string | null;
          storage_path: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          brand?: string | null;
          name: string;
          color_name?: string | null;
          color_hex?: string | null;
          weight?: string | null;
          fiber_content?: string | null;
          yardage?: number | null;
          weight_grams?: number | null;
          quantity_skeins?: number;
          image_url?: string | null;
          storage_path?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          brand?: string | null;
          name?: string;
          color_name?: string | null;
          color_hex?: string | null;
          weight?: string | null;
          fiber_content?: string | null;
          yardage?: number | null;
          weight_grams?: number | null;
          quantity_skeins?: number;
          image_url?: string | null;
          storage_path?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "yarn_inventory_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      yarn_usage: {
        Row: {
          id: string;
          user_id: string;
          yarn_inventory_id: string;
          project_id: string | null;
          amount_grams: number | null;
          amount_yards: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          yarn_inventory_id: string;
          project_id?: string | null;
          amount_grams?: number | null;
          amount_yards?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          yarn_inventory_id?: string;
          project_id?: string | null;
          amount_grams?: number | null;
          amount_yards?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "yarn_usage_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "yarn_usage_yarn_inventory_id_fkey";
            columns: ["yarn_inventory_id"];
            isOneToOne: false;
            referencedRelation: "yarn_inventory";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "yarn_usage_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      yarn_substitutions: {
        Row: {
          id: string;
          user_id: string;
          source_yarn_id: string | null;
          target_yarn_id: string | null;
          source_yarn_name: string | null;
          target_yarn_name: string | null;
          match_score: number | null;
          notes: string | null;
          ai_recommendation: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_yarn_id?: string | null;
          target_yarn_id?: string | null;
          source_yarn_name?: string | null;
          target_yarn_name?: string | null;
          match_score?: number | null;
          notes?: string | null;
          ai_recommendation?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_yarn_id?: string | null;
          target_yarn_id?: string | null;
          source_yarn_name?: string | null;
          target_yarn_name?: string | null;
          match_score?: number | null;
          notes?: string | null;
          ai_recommendation?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "yarn_substitutions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "yarn_substitutions_source_yarn_id_fkey";
            columns: ["source_yarn_id"];
            isOneToOne: false;
            referencedRelation: "yarn_inventory";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "yarn_substitutions_target_yarn_id_fkey";
            columns: ["target_yarn_id"];
            isOneToOne: false;
            referencedRelation: "yarn_inventory";
            referencedColumns: ["id"];
          },
        ];
      };
      color_palettes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          source_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          source_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          source_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "color_palettes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      color_palette_items: {
        Row: {
          id: string;
          palette_id: string;
          user_id: string;
          color_hex: string;
          color_name: string | null;
          sort_order: number;
          yarn_inventory_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          palette_id: string;
          user_id: string;
          color_hex: string;
          color_name?: string | null;
          sort_order?: number;
          yarn_inventory_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          palette_id?: string;
          user_id?: string;
          color_hex?: string;
          color_name?: string | null;
          sort_order?: number;
          yarn_inventory_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "color_palette_items_palette_id_fkey";
            columns: ["palette_id"];
            isOneToOne: false;
            referencedRelation: "color_palettes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "color_palette_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "color_palette_items_yarn_inventory_id_fkey";
            columns: ["yarn_inventory_id"];
            isOneToOne: false;
            referencedRelation: "yarn_inventory";
            referencedColumns: ["id"];
          },
        ];
      };
      vision_scans: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          storage_path: string | null;
          scan_type:
            | "row_counter"
            | "stitch_check"
            | "pattern_read"
            | "general"
            | null;
          confidence: number | null;
          results: Json;
          status: "pending" | "processing" | "completed" | "failed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          storage_path?: string | null;
          scan_type?:
            | "row_counter"
            | "stitch_check"
            | "pattern_read"
            | "general"
            | null;
          confidence?: number | null;
          results?: Json;
          status?: "pending" | "processing" | "completed" | "failed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          storage_path?: string | null;
          scan_type?:
            | "row_counter"
            | "stitch_check"
            | "pattern_read"
            | "general"
            | null;
          confidence?: number | null;
          results?: Json;
          status?: "pending" | "processing" | "completed" | "failed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vision_scans_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vision_scans_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      vision_scan_findings: {
        Row: {
          id: string;
          scan_id: string;
          user_id: string;
          finding_type: string;
          description: string | null;
          severity: "info" | "warning" | "error" | null;
          confidence: number | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scan_id: string;
          user_id: string;
          finding_type: string;
          description?: string | null;
          severity?: "info" | "warning" | "error" | null;
          confidence?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          scan_id?: string;
          user_id?: string;
          finding_type?: string;
          description?: string | null;
          severity?: "info" | "warning" | "error" | null;
          confidence?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vision_scan_findings_scan_id_fkey";
            columns: ["scan_id"];
            isOneToOne: false;
            referencedRelation: "vision_scans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vision_scan_findings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tutor_conversations: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tutor_conversations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tutor_conversations_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      tutor_messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          user_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tutor_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "tutor_conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tutor_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      voice_settings: {
        Row: {
          id: string;
          user_id: string;
          voice_id: string | null;
          speed: number;
          pitch: number;
          auto_read_patterns: boolean;
          auto_read_tutor: boolean;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          voice_id?: string | null;
          speed?: number;
          pitch?: number;
          auto_read_patterns?: boolean;
          auto_read_tutor?: boolean;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          voice_id?: string | null;
          speed?: number;
          pitch?: number;
          auto_read_patterns?: boolean;
          auto_read_tutor?: boolean;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "voice_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          link: string | null;
          read_at: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          link?: string | null;
          read_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          link?: string | null;
          read_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          description: string | null;
          content: string | null;
          difficulty: SkillLevel | null;
          duration_minutes: number | null;
          sort_order: number;
          illustration_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category: string;
          description?: string | null;
          content?: string | null;
          difficulty?: SkillLevel | null;
          duration_minutes?: number | null;
          sort_order?: number;
          illustration_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: string;
          description?: string | null;
          content?: string | null;
          difficulty?: SkillLevel | null;
          duration_minutes?: number | null;
          sort_order?: number;
          illustration_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: "not_started" | "in_progress" | "completed";
          progress_percent: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: "not_started" | "in_progress" | "completed";
          progress_percent?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          status?: "not_started" | "in_progress" | "completed";
          progress_percent?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      subscription_tier: SubscriptionTier;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Profile = Tables<"profiles">;
export type Project = Tables<"projects">;
export type Pattern = Tables<"patterns">;
export type YarnInventory = Tables<"yarn_inventory">;
export type VisionScan = Tables<"vision_scans">;
export type TutorConversation = Tables<"tutor_conversations">;
export type TutorMessage = Tables<"tutor_messages">;
export type Lesson = Tables<"lessons">;
export type LessonProgress = Tables<"lesson_progress">;
export type Subscription = Tables<"subscriptions">;
