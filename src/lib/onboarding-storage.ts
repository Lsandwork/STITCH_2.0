export type OnboardingProfile = {
  displayName: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  terminology: "us" | "uk";
  measurement: "imperial" | "metric";
  handedness: "left" | "right";
  projectTypes: string[];
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    voiceEnabled: boolean;
  };
  yarnWeights: string[];
  completedAt: string;
};

export const ONBOARDING_STORAGE_KEY = "stitch-onboarding-profile";

export const PROJECT_TYPE_OPTIONS = [
  "Amigurumi",
  "Blankets",
  "Wearables",
  "Home decor",
  "Accessories",
  "Toys",
] as const;

export const YARN_WEIGHT_OPTIONS = [
  "lace",
  "fingering",
  "sport",
  "dk",
  "worsted",
  "aran",
  "bulky",
] as const;

export function getOnboardingProfile(): OnboardingProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingProfile;
  } catch {
    return null;
  }
}

export function saveOnboardingProfile(profile: OnboardingProfile): void {
  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
}

export function hasCompletedOnboarding(): boolean {
  return getOnboardingProfile() !== null;
}
