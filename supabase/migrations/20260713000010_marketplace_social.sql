-- Marketplace & Social Network tables for Stitch

-- Marketplace listings (public patterns for sale/free)
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ai_description TEXT NOT NULL,
  preview_text TEXT NOT NULL,
  pattern_content TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  project_type TEXT NOT NULL,
  yarn_weight TEXT,
  hook_size TEXT,
  thumbnail_url TEXT,
  thumbnail_style JSONB,
  languages JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  downloads INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  duplicate_score INTEGER NOT NULL DEFAULT 0 CHECK (duplicate_score >= 0 AND duplicate_score <= 100),
  duplicate_of_id UUID REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  duplicate_note TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social posts
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  project_title TEXT,
  pattern_ref UUID REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  likes UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social comments
CREATE TABLE IF NOT EXISTS social_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social groups
CREATE TABLE IF NOT EXISTS social_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Group memberships
CREATE TABLE IF NOT EXISTS social_group_members (
  group_id UUID NOT NULL REFERENCES social_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- Follow relationships
CREATE TABLE IF NOT EXISTS social_follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- RLS: Marketplace listings readable by all authenticated users
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY marketplace_listings_select ON marketplace_listings
  FOR SELECT TO authenticated USING (status = 'published' OR designer_id = auth.uid());

CREATE POLICY marketplace_listings_insert ON marketplace_listings
  FOR INSERT TO authenticated WITH CHECK (designer_id = auth.uid());

CREATE POLICY marketplace_listings_update ON marketplace_listings
  FOR UPDATE TO authenticated USING (designer_id = auth.uid());

-- RLS: Social posts readable by all authenticated users
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_posts_select ON social_posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY social_posts_insert ON social_posts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY social_posts_update ON social_posts
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- RLS: Comments
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_comments_select ON social_comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY social_comments_insert ON social_comments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS: Groups (public read)
ALTER TABLE social_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_groups_select ON social_groups
  FOR SELECT TO authenticated USING (true);

-- RLS: Group members
ALTER TABLE social_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_group_members_select ON social_group_members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY social_group_members_insert ON social_group_members
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY social_group_members_delete ON social_group_members
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS: Follows
ALTER TABLE social_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_follows_select ON social_follows
  FOR SELECT TO authenticated USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY social_follows_insert ON social_follows
  FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());

CREATE POLICY social_follows_delete ON social_follows
  FOR DELETE TO authenticated USING (follower_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_designer ON marketplace_listings(designer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_user ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created ON social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_comments_post ON social_comments(post_id);
