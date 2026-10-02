// TypeScript Definitions for HackScore AI

export type ReadinessLevel =
  | 'Needs Significant Improvement'
  | 'Developing'
  | 'Strong Foundation'
  | 'Judge Ready';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'QUICK_WIN';

export type PitchDuration = '30s' | '60s' | '3m' | '5m';

export type PitchTone =
  | 'Professional'
  | 'Emotional'
  | 'Technical'
  | 'Startup-style'
  | 'Storytelling'
  | 'Judge-focused';

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number; // e.g. 15 for 15% or 15 points
  description: string;
}

export interface RubricPreset {
  id: string;
  name: string;
  description: string;
  criteria: RubricCriterion[];
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  explanation: string;
  evidence: string;
  problems: string[];
  actions: string[];
  potentialScore?: number;
}

export interface ImprovementItem {
  id: string;
  title: string;
  priority: PriorityLevel;
  problem: string;
  action: string;
  expectedImpact: 'High' | 'Medium-High' | 'Medium' | 'Low';
  estimatedPointGain: number;
  category: string;
  completed?: boolean;
}

export interface TechnicalAudit {
  architecture: number;
  security: number;
  scalability: number;
  codeQuality: number;
  testing: number;
  documentation: number;
  deployment: number;
  envHandling: number;
  strengths: string[];
  weaknesses: string[];
  keyFindings: {
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info' | 'good';
  }[];
  gitHubData?: {
    stars: number;
    forks: number;
    openIssues: number;
    primaryLanguage: string;
    languages: Record<string, number>;
    languagesDetailed?: { name: string; bytes: number; percentage: number }[];
    hasReadme: boolean;
    readmePreview?: string;
    readmeLength?: number;
    readmeHeadings?: string[];
    isDefaultReadme?: boolean;
    hasTests: boolean;
    testFrameworks?: string[];
    hasCiCd: boolean;
    ciCdWorkflows?: string[];
    commitCount?: number;
    repoName?: string;
    owner?: string;
    ownerAvatar?: string;
    description?: string;
    license?: string;
    defaultBranch?: string;
    createdAt?: string;
    pushedAt?: string;
    sizeKb?: number;
    homepage?: string;
    topics?: string[];
    commits?: {
      sha: string;
      message: string;
      author: string;
      avatar?: string;
      date: string;
      url?: string;
    }[];
    contributors?: {
      login: string;
      avatar: string;
      contributions: number;
      url: string;
    }[];
    dependencies?: {
      production: Record<string, string>;
      dev: Record<string, string>;
      scripts: Record<string, string>;
    };
    database?: {
      orm?: string;
      provider?: string;
      models?: string[];
    };
    fileStats?: {
      totalFiles: number;
      codeFiles: number;
      routesCount: number;
      componentsCount: number;
    };
  };
}

export interface UIAudit {
  visualDesign: number;
  navigation: number;
  accessibility: number;
  responsiveness: number;
  consistency: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  checklist: {
    item: string;
    passed: boolean;
    notes?: string;
  }[];
  websiteData?: {
    statusCode?: number;
    responseTimeMs?: number;
    title?: string;
    description?: string;
    hasHttps?: boolean;
    hasOgTags?: boolean;
    hasViewport?: boolean;
  };
}

export interface IdeaAnalysis {
  problemSeverity: string;
  targetAudience?: string;
  targetUsers?: string;
  existingAlternatives: string[];
  differentiation: string;
  innovation: string;
  feasibility: string;
  defensibility: string;
  marketPotential: string;
  weaknessesJudgesWillChallenge: string[];
  problemClarityScore: number;
  solutionAlignmentScore: number;
  innovationScore: number;
}

export interface JudgeObjection {
  id: string;
  question: string;
  whyJudgesAsk: string;
  suggestedAnswer: string;
  evidenceToBring: string;
  category: 'Technical' | 'Business' | 'Product' | 'Security' | 'Scale' | 'AI';
  userAnswer?: string;
  feedback?: string;
  readinessRating?: 'Poor' | 'Adequate' | 'Strong' | 'Outstanding';
}

export interface PitchSection {
  title: string;
  content: string;
  durationSeconds: number;
  tips: string;
}

export interface PitchScript {
  duration: PitchDuration;
  tone: PitchTone;
  hook: string;
  problem: string;
  whyItMatters: string;
  solution: string;
  howItWorks: string;
  technology: string;
  innovation: string;
  impact: string;
  liveDemoGuide: string;
  futureScope: string;
  closingStatement: string;
  fullScript: string;
  breakdown: PitchSection[];
}

export interface PresentationAnalysis {
  score: number;
  slideDensity: string;
  visualClarity: string;
  demoFlow: string;
  storyStructure: string;
  strongPoints: string[];
  needsImprovement: string[];
  recommendations: string[];
}

export interface ProjectData {
  id: string;
  name: string;
  tagline: string;
  category: string;
  hackathonName: string;
  hackathonTheme: string;
  problemStatement: string;
  targetUsers: string;
  description: string;
  teamName: string;
  teamMembers: string[];
  
  // Links
  githubUrl: string;
  liveUrl: string;
  videoUrl: string;
  figmaUrl: string;
  presentationUrl: string;
  
  // Technical Information
  frontendTech: string[];
  backendTech: string[];
  databaseTech: string[];
  apisTech: string[];
  aiModelsTech: string[];
  cloudTech: string[];
  authTech: string[];
  integrationsTech: string[];
  
  // Uploads & Artifacts
  screenshots: string[];
  architectureDiagram?: string;
  pitchDoc?: string;
  presentationFile?: string;
  
  // Criteria & Rubric
  rubricId: string;
  customWeights?: Record<string, number>;
  
  // Versioning
  version: number;
  createdAt: string;
  updatedAt: string;
  status: 'DRAFT' | 'ANALYZING' | 'EVALUATED';
}

export interface EvaluationResult {
  id: string;
  projectId: string;
  createdAt: string;
  version: number;
  overallScore: number;
  readinessLevel: ReadinessLevel;
  summary: string;
  rubricName: string;
  categoryScores: CategoryScore[];
  strengths: string[];
  criticalWeaknesses: string[];
  quickWins: string[];
  improvements: ImprovementItem[];
  technicalAudit: TechnicalAudit;
  uiAudit: UIAudit;
  ideaAnalysis: IdeaAnalysis;
  judgeObjections: JudgeObjection[];
  pitches: Record<PitchDuration, PitchScript>;
  presentationReview: PresentationAnalysis;
  checklistStatus: Record<string, boolean>;
}

export interface JudgeTeamFeedback {
  teamId: string;
  projectId: string;
  teamName: string;
  projectName: string;
  aiScore: number;
  judgeScoreOverride?: number;
  privateNotes: string;
  strengths: string[];
  weaknesses: string[];
  questions: string[];
  feedback: string;
  evaluatedAt: string;
}

export interface WinChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'Presentation' | 'Technical' | 'Product' | 'Demo';
  isCompleted: boolean;
}
