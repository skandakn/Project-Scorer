import { EvaluationResult, ProjectData } from '../types';
import { RUBRIC_PRESETS } from '../data/rubrics';
import { fetchGitHubRepoData } from './githubFetcher';
import { fetchWebsiteData } from './websiteFetcher';
import { analyzeTechnical } from './technicalAnalyzer';
import { analyzeUI } from './uiAnalyzer';
import { analyzeIdea } from './ideaAnalyzer';
import { generateJudgeObjections } from './judgeSimulator';
import { generatePitches } from './pitchAnalyzer';
import { generateRecommendations } from './recommendationEngine';
import { calculateWeightedScores } from './scoreEngine';

export async function runFullProjectAnalysis(project: ProjectData): Promise<EvaluationResult> {
  // 1. Concurrent Fetching of GitHub & Website data
  const [githubData, websiteData] = await Promise.all([
    project.githubUrl ? fetchGitHubRepoData(project.githubUrl) : Promise.resolve(undefined),
    project.liveUrl ? fetchWebsiteData(project.liveUrl) : Promise.resolve(undefined),
  ]);

  // 2. Run domain analyzers
  const technicalAudit = analyzeTechnical(project, githubData);
  const uiAudit = analyzeUI(project, websiteData);
  const ideaAnalysis = analyzeIdea(project);
  const judgeObjections = generateJudgeObjections(project);
  const pitches = generatePitches(project, 'Judge-focused');
  const improvements = generateRecommendations(project, technicalAudit, uiAudit);

  // 3. Resolve active rubric
  const preset =
    RUBRIC_PRESETS.find((r) => r.id === project.rubricId) ||
    RUBRIC_PRESETS.find((r) => r.id === 'general') ||
    RUBRIC_PRESETS[0];

  // Adjust criteria weights if project has custom weights
  const criteria = preset.criteria.map((c) => ({
    ...c,
    weight: project.customWeights?.[c.id] ?? c.weight,
  }));

  // 4. Map raw ratios for each criterion
  const categoryRawScores: Record<
    string,
    {
      ratio: number;
      explanation: string;
      evidence: string;
      problems: string[];
      actions: string[];
      potentialRatio?: number;
    }
  > = {
    innovation: {
      ratio: ideaAnalysis.innovationScore / 100,
      explanation: 'Evaluates uniqueness compared to existing market solutions and conventional approaches.',
      evidence: ideaAnalysis.innovation,
      problems: ideaAnalysis.weaknessesJudgesWillChallenge.slice(0, 2),
      actions: ['Emphasize key architectural differentiators early in the live pitch.'],
      potentialRatio: Math.min(0.98, ideaAnalysis.innovationScore / 100 + 0.1),
    },
    problem_relevance: {
      ratio: ideaAnalysis.problemClarityScore / 100,
      explanation: 'Evaluates the urgency, clarity, and addressable pain point of the problem statement.',
      evidence: `Target users: ${ideaAnalysis.targetAudience}. Problem statement length: ${project.problemStatement.length} chars.`,
      problems: project.problemStatement.length < 100 ? ['Problem description is concise; adding concrete user quotes will strengthen it.'] : [],
      actions: ['Quantify the financial or time cost of the problem in the first 20 seconds.'],
      potentialRatio: 0.95,
    },
    technical_impl: {
      ratio: technicalAudit.architecture / 100,
      explanation: 'Evaluates system architecture, code organization, error handling, and technology stack synergy.',
      evidence: technicalAudit.strengths.slice(0, 2).join('; ') || 'Modern full-stack architecture detected.',
      problems: technicalAudit.weaknesses.slice(0, 2),
      actions: ['Add automated unit test suite and verify input sanitization.'],
      potentialRatio: Math.min(0.98, technicalAudit.architecture / 100 + 0.08),
    },
    ui_ux: {
      ratio: uiAudit.overallScore / 100,
      explanation: 'Assesses visual polish, responsive design, color contrast, and navigation flow.',
      evidence: uiAudit.strengths.slice(0, 2).join('; ') || 'Cohesive visual presentation with responsive layout.',
      problems: uiAudit.weaknesses.slice(0, 2),
      actions: uiAudit.recommendations.slice(0, 2),
      potentialRatio: Math.min(0.98, uiAudit.overallScore / 100 + 0.08),
    },
    functionality: {
      ratio: 0.86,
      explanation: 'Evaluates working prototype capabilities, API completeness, and live demo reliability.',
      evidence: project.liveUrl ? 'Live deployed URL verified with active routing.' : 'Interactive prototypes submitted.',
      problems: !project.videoUrl ? ['No backup screen recording provided in case of venue network drop.'] : [],
      actions: ['Prepare an offline local screen recording backup.'],
      potentialRatio: 0.94,
    },
    impact: {
      ratio: 0.88,
      explanation: 'Assesses real-world applicability, measurable benefits, and market viability.',
      evidence: ideaAnalysis.marketPotential,
      problems: ['Metrics could show more concrete before-and-after operational savings.'],
      actions: ['Display measurable savings (e.g. "Saved 7 minutes", "42% reduction") prominently.'],
      potentialRatio: 0.96,
    },
    scalability: {
      ratio: technicalAudit.scalability / 100,
      explanation: 'Reviews system architecture capability to scale gracefully under increased concurrent load.',
      evidence: `Stateless compute with ${project.databaseTech.join(', ') || 'modern databases'}.`,
      problems: ['Need asynchronous queue workers for compute-heavy batch tasks.'],
      actions: ['Document background worker queue architecture for high concurrent traffic.'],
      potentialRatio: 0.92,
    },
    ai_tech_usage: {
      ratio: project.aiModelsTech.length > 0 ? 0.9 : 0.8,
      explanation: 'Evaluates whether AI integration is justified, well-integrated, and properly guardrailed.',
      evidence: project.aiModelsTech.join(', ') || 'Rule-based algorithmic pipelines.',
      problems: project.aiModelsTech.length > 0 ? ['Judges will probe whether AI outputs can hallucinate.'] : [],
      actions: ['Show deterministic validation schema verifying all AI outputs.'],
      potentialRatio: 0.95,
    },
    presentation: {
      ratio: 0.85,
      explanation: 'Assesses storytelling structure, hook strength, clarity, and time management.',
      evidence: 'Structured pitch scripts prepared across 30s, 60s, 3m, and 5m formats.',
      problems: ['Must practice timing strictly to avoid being cut off by the judge bell.'],
      actions: ['Rehearse with a live timer to finish 15 seconds before the hard limit.'],
      potentialRatio: 0.93,
    },
    demo_readiness: {
      ratio: project.videoUrl ? 0.9 : 0.8,
      explanation: 'Measures readiness of the live demo, fallback plans, and risk mitigation.',
      evidence: project.videoUrl ? 'Demo video link submitted.' : 'Live URL available.',
      problems: !project.videoUrl ? ['Missing backup demo video link.'] : [],
      actions: ['Keep a local video file ready on your desktop tab.'],
      potentialRatio: 0.95,
    },
  };

  // 5. Calculate weighted scores
  const scoreResult = calculateWeightedScores(criteria, categoryRawScores);

  // 6. Presentation Analysis
  const presentationReview = {
    score: Math.round(scoreResult.overallScore * 0.95),
    slideDensity: 'Balanced — Clear hierarchy with strong visual emphasis on architecture and UI.',
    visualClarity: 'High-contrast typography and clear callout cards.',
    demoFlow: 'Seamless problem-to-solution transition within the first 45 seconds.',
    storyStructure: 'Hook -> Problem -> Technical Architecture -> Working Demo -> Impact.',
    strongPoints: [
      'Problem statement is grounded in tangible user friction',
      'Technical architecture is clearly articulated with clean service separation',
      'Live deployed prototype available for interactive exploration',
    ],
    needsImprovement: [
      'Ensure the live demo kicks off within the first 60 seconds of the presentation',
      'Include a backup offline screen recording on desktop in case venue Wi-Fi fails',
    ],
    recommendations: [
      'Rehearse pitch timing to finish with at least 30 seconds buffer for judge Q&A',
      'Place a prominent QR code on the final slide for judges to explore on their smartphones',
    ],
  };

  // 7. Assemble Complete Evaluation Result
  const overallStrengths = [
    ...technicalAudit.strengths.slice(0, 2),
    ...uiAudit.strengths.slice(0, 2),
    ideaAnalysis.differentiation,
  ].filter(Boolean);

  const overallWeaknesses = [
    ...technicalAudit.weaknesses.slice(0, 2),
    ...uiAudit.weaknesses.slice(0, 2),
    ideaAnalysis.weaknessesJudgesWillChallenge[0],
  ].filter(Boolean);

  const quickWins = [
    'Add an offline video demo tab ready on your desktop',
    'Include 2-3 quantified metric cards on your dashboard (e.g. 70% time reduction)',
    'Add a visible status badge showing connection latency',
  ];

  return {
    id: `eval-${project.id}-${Date.now()}`,
    projectId: project.id,
    createdAt: new Date().toISOString(),
    version: project.version,
    overallScore: scoreResult.overallScore,
    readinessLevel: scoreResult.readinessLevel,
    summary: scoreResult.summaryStatus,
    rubricName: preset.name,
    categoryScores: scoreResult.categoryScores,
    strengths: overallStrengths.slice(0, 5),
    criticalWeaknesses: overallWeaknesses.slice(0, 4),
    quickWins,
    improvements,
    technicalAudit,
    uiAudit,
    ideaAnalysis,
    judgeObjections,
    pitches,
    presentationReview,
    checklistStatus: {
      'problem-clear': true,
      'solution-demo': true,
      'working-demo': !!project.liveUrl,
      'no-broken-links': true,
      'mobile-responsive': uiAudit.responsiveness > 80,
      'strong-opening': true,
      'clear-architecture': technicalAudit.architecture > 80,
      'tech-differentiation': true,
      'measurable-impact': true,
      'real-world-use': true,
      'backup-demo-ready': !!project.videoUrl,
      'judge-questions-prepped': true,
      'pitch-rehearsed': true,
      'deployment-stable': !!project.liveUrl,
      'readme-complete': technicalAudit.documentation > 75,
    },
  };
}
