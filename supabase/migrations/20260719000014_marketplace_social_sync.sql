-- Marketplace / social sync: likes junction, saved listings, group seeds, download RPC

-- Likes as a junction table (owner-only UPDATE on social_posts cannot support likes)
CREATE TABLE IF NOT EXISTS social_post_likes (
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE social_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_post_likes_select ON social_post_likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY social_post_likes_insert ON social_post_likes
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY social_post_likes_delete ON social_post_likes
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_social_post_likes_user ON social_post_likes(user_id);

-- Saved marketplace listings (TEXT id so seed catalog ids can be saved too)
CREATE TABLE IF NOT EXISTS saved_marketplace_listings (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

ALTER TABLE saved_marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY saved_marketplace_listings_select ON saved_marketplace_listings
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY saved_marketplace_listings_insert ON saved_marketplace_listings
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY saved_marketplace_listings_delete ON saved_marketplace_listings
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Allow comment authors to delete their comments
CREATE POLICY social_comments_delete ON social_comments
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Anyone authenticated can bump download counts
CREATE OR REPLACE FUNCTION public.increment_marketplace_downloads(p_listing_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_count INTEGER;
BEGIN
  UPDATE marketplace_listings
  SET downloads = downloads + 1,
      updated_at = now()
  WHERE id = p_listing_id
    AND status = 'published'
  RETURNING downloads INTO next_count;

  RETURN COALESCE(next_count, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.increment_marketplace_downloads(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_marketplace_downloads(UUID) TO authenticated;

-- Seed starter groups when empty
INSERT INTO social_groups (id, name, description, category, image_url, member_count)
SELECT
  gen_random_uuid(),
  seed.name,
  seed.description,
  seed.category,
  seed.image_url,
  seed.member_count
FROM (
  VALUES
    (
      'Amigurumi Club',
      'Share plushies, tips, and WIP photos with fellow amigurumi makers.',
      'amigurumi',
      '/assets/stitch/avatars/svg/avatar-2.svg',
      128
    ),
    (
      'Blanket Buddies',
      'Granny squares, temperature blankets, and cozy throws.',
      'blankets',
      '/assets/stitch/avatars/svg/avatar-4.svg',
      96
    ),
    (
      'Garment Knit & Crochet',
      'Sweaters, cardigans, and fit help across crafts.',
      'garments',
      '/assets/stitch/avatars/svg/avatar-6.svg',
      74
    ),
    (
      'Beginner Stitchers',
      'A kind space for first projects, frogging stories, and questions.',
      'beginner',
      '/assets/stitch/avatars/svg/avatar-1.svg',
      210
    )
) AS seed(name, description, category, image_url, member_count)
WHERE NOT EXISTS (SELECT 1 FROM social_groups LIMIT 1);
