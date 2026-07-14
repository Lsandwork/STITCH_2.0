export type PatternSource = "ai_generated" | "uploaded" | "photo" | "manual";

export type PatternTerminology = "us" | "uk";

export type PatternDifficulty = "beginner" | "intermediate" | "advanced";

export type PatternValidationStatus =
  | "ai_generated"
  | "ai_validated"
  | "user_tested"
  | "not_physically_tested";

export type PatternRow = {
  rowNumber: number;
  instruction: string;
  stitchCount: number | null;
  notes?: string;
};

export type PatternSection = {
  name: string;
  sortOrder: number;
  instructions?: string;
  rows: PatternRow[];
};

export type YarnRequirement = {
  colorName: string;
  weight: string;
  fiber?: string;
  yardage?: number;
  skeins?: number;
  notes?: string;
};

export type GeneratedPatternMaterials = {
  yarns: YarnRequirement[];
  hookSize: string;
  notions?: string[];
  safetyNotes?: string[];
};

export type GeneratedPatternGauge = {
  stitches: number;
  rows: number;
  measurement: string;
  notes?: string;
};

export type GeneratedPatternMeasurements = {
  width?: string;
  height?: string;
  depth?: string;
  circumference?: string;
  notes?: string;
};

export type PatternValidationIssue = {
  code: string;
  severity: "error" | "warning" | "info";
  message: string;
  rowNumber?: number;
  section?: string;
};

export type PatternValidationResult = {
  status: PatternValidationStatus;
  isValid: boolean;
  score: number;
  issues: PatternValidationIssue[];
  checkedAt: string;
};

export type GeneratedPattern = {
  title: string;
  description?: string;
  projectType: string;
  skillLevel: PatternDifficulty;
  terminology: PatternTerminology;
  difficulty: PatternDifficulty;
  estimatedTimeMinutes?: number;
  previewImageUrl?: string;
  materials: GeneratedPatternMaterials;
  gauge: GeneratedPatternGauge;
  finishedMeasurements: GeneratedPatternMeasurements;
  abbreviations: Record<string, string>;
  sections: PatternSection[];
  assemblyInstructions?: string[];
  finishingInstructions?: string[];
  safetyNotes?: string[];
  validation: PatternValidationResult;
  metadata?: {
    handedness?: "left" | "right";
    construction?: "sewn" | "low_sew" | "seamless";
    eyeType?: "safety" | "embroidered";
    chartPreference?: "written" | "chart" | "both";
    source?: PatternSource;
  };
};

export type PatternGenerationInput = {
  description: string;
  projectType: string;
  skillLevel: PatternDifficulty;
  finishedDimensions?: string;
  yarnWeight?: string;
  yarnFiber?: string;
  hookSize?: string;
  preferredColors?: string[];
  terminology?: PatternTerminology;
  instructionFormat?: "written" | "chart" | "both";
  handedness?: "left" | "right";
  construction?: "sewn" | "low_sew" | "seamless";
  eyeType?: "safety" | "embroidered";
};

export type PatternGenerationResult = {
  pattern: GeneratedPattern;
  rawModelOutput?: string;
  model?: string;
  generatedAt: string;
};
