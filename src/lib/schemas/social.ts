import { z } from "zod";

export const socialCommentSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userAvatarUrl: z.string().optional(),
  content: z.string().min(1).max(500),
  createdAt: z.string().datetime(),
});

export const socialPostSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userAvatarUrl: z.string().optional(),
  userHandle: z.string().min(1),
  content: z.string().min(1).max(2000),
  imageUrl: z.string().optional(),
  projectTitle: z.string().optional(),
  patternRef: z.string().optional(),
  likes: z.array(z.string()).default([]),
  comments: z.array(socialCommentSchema).default([]),
  createdAt: z.string().datetime(),
});

export const socialGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  memberCount: z.number().int().min(0),
  imageUrl: z.string().optional(),
  isJoined: z.boolean().default(false),
});

export const socialMakerSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  handle: z.string().min(1),
  avatarUrl: z.string(),
  bio: z.string(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  projectCount: z.number().int().min(0),
  followerCount: z.number().int().min(0),
  specialties: z.array(z.string()),
  isFollowing: z.boolean().default(false),
  matchScore: z.number().min(0).max(100).optional(),
  matchReason: z.string().optional(),
});

export const socialCreatePostInputSchema = z.object({
  content: z.string().min(1).max(2000),
  imageUrl: z.string().optional(),
  projectTitle: z.string().optional(),
});

export const socialAiRecommendationsInputSchema = z.object({
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  interests: z.array(z.string()).default([]),
  recentProjects: z.array(z.string()).default([]),
  followingCount: z.number().int().min(0).default(0),
});

export const socialAiRecommendationsResultSchema = z.object({
  projectSuggestions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      reason: z.string(),
      skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
      href: z.string(),
    }),
  ),
  makerMatches: z.array(
    z.object({
      makerId: z.string(),
      displayName: z.string(),
      handle: z.string(),
      matchScore: z.number().min(0).max(100),
      matchReason: z.string(),
      specialties: z.array(z.string()),
    }),
  ),
  patternFinds: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      href: z.string(),
      reason: z.string(),
    }),
  ),
  groupRecommendations: z.array(
    z.object({
      groupId: z.string(),
      name: z.string(),
      reason: z.string(),
    }),
  ),
});

export type SocialPost = z.infer<typeof socialPostSchema>;
export type SocialComment = z.infer<typeof socialCommentSchema>;
export type SocialGroup = z.infer<typeof socialGroupSchema>;
export type SocialMaker = z.infer<typeof socialMakerSchema>;
export type SocialAiRecommendationsResult = z.infer<
  typeof socialAiRecommendationsResultSchema
>;
