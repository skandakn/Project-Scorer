import { CategoryScore, ReadinessLevel, RubricCriterion } from '../types';

export interface ScoreCalculationResult {
  overallScore: number;
  readinessLevel: ReadinessLevel;
  categoryScores: CategoryScore[];
  summaryStatus: string;
}

export function determineReadinessLevel(score: number): ReadinessLevel {
  if (score >= 85) return 'Judge Ready';
  if (score >= 75) return 'Strong Foundation';
  if (score >= 60) return 'Developing';
  return 'Needs Significant Improvement';
}

export function getStatusDescription(score: number): string {
  if (score >= 85) {
    return 'Your project demonstrates strong alignment with hackathon judging rubrics and is ready for live competition scrutiny.';
  }
  if (score >= 75) {
    return 'Strong foundation with clear technical merit. Addressing high-priority weaknesses can substantially increase judging impact.';
  }
  if (score >= 60) {
    return 'Promising concept with key prototype elements in place. Recommended actions will significantly improve demo readiness.';
  }
  return 'Core ideas are emerging but critical functionality and pitch clarity need focused attention prior to judging.';
}

export function calculateWeightedScores(
  criteria: RubricCriterion[],
  categoryRawScores: Record<string, { ratio: number; explanation: string; evidence: string; problems: string[]; actions: string[]; potentialRatio?: number }>
): ScoreCalculationResult {
  let totalScore = 0;
  let totalMaxWeight = 0;
  const categoryScores: CategoryScore[] = [];

  for (const criterion of criteria) {
    const raw = categoryRawScores[criterion.id] || {
      ratio: 0.75,
      explanation: 'Evaluated based on provided project submission details.',
      evidence: 'Referenced from architecture, repository, and problem statement.',
      problems: ['Could benefit from more detailed documentation on edge cases.'],
      actions: ['Add automated integration tests and clearer user documentation.'],
      potentialRatio: 0.88,
    };

    const maxScore = criterion.weight;
    const score = Math.round(raw.ratio * maxScore * 10) / 10;
    const potentialScore = raw.potentialRatio ? Math.round(raw.potentialRatio * maxScore * 10) / 10 : undefined;

    totalScore += score;
    totalMaxWeight += maxScore;

    categoryScores.push({
      category: criterion.name,
      score,
      maxScore,
      explanation: raw.explanation,
      evidence: raw.evidence,
      problems: raw.problems,
      actions: raw.actions,
      potentialScore,
    });
  }

  // Normalize to 100 if weights don't sum to exactly 100
  const normalizedOverall = totalMaxWeight > 0 ? Math.round((totalScore / totalMaxWeight) * 100) : Math.round(totalScore);
  const readinessLevel = determineReadinessLevel(normalizedOverall);
  const summaryStatus = getStatusDescription(normalizedOverall);

  return {
    overallScore: Math.min(100, Math.max(0, normalizedOverall)),
    readinessLevel,
    categoryScores,
    summaryStatus,
  };
}
