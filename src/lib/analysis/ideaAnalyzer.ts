import { IdeaAnalysis, ProjectData } from '../types';

export function analyzeIdea(project: ProjectData): IdeaAnalysis {
  const desc = project.description.toLowerCase();
  const prob = project.problemStatement.toLowerCase();

  const isAI = project.aiModelsTech.length > 0 || desc.includes('ai') || desc.includes('machine learning');
  const isHardware = desc.includes('hardware') || desc.includes('sensor') || desc.includes('iot') || desc.includes('edge');
  const isHealthcare = project.category.toLowerCase().includes('health') || desc.includes('patient') || desc.includes('doctor');
  const isClimate = project.category.toLowerCase().includes('sustain') || desc.includes('carbon') || desc.includes('flood') || desc.includes('waste');

  let problemClarityScore = 85;
  let solutionAlignmentScore = 86;
  let innovationScore = 84;

  if (project.problemStatement.length > 100) problemClarityScore += 7;
  if (project.description.length > 250) solutionAlignmentScore += 6;
  if (isHardware || (isAI && desc.includes('fine-tune'))) innovationScore += 8;

  const existingAlternatives: string[] = [];
  if (isHealthcare) {
    existingAlternatives.push('Manual clinical scribes', 'Legacy hospital EHR templates', 'Nuance DAX / general transcription tools');
  } else if (isClimate) {
    existingAlternatives.push('Traditional manual labor / inspections', 'Coarse regional forecasting tools', 'Expensive enterprise sensor networks');
  } else if (isAI) {
    existingAlternatives.push('Generic off-the-shelf chatbots (ChatGPT/Claude wrappers)', 'Rule-based automation scripts', 'Manual human review');
  } else {
    existingAlternatives.push('Spreadsheets and manual processes', 'Complex enterprise SaaS with high onboarding friction', 'Fragmented point solutions');
  }

  const weaknessesJudgesWillChallenge: string[] = [
    `Why can't a large incumbent (Google, Microsoft, or an established domain player) copy this in two weeks?`,
    `What happens when your primary third-party API or foundational AI model experiences an outage or pricing surge?`,
    `How did your team validate that target users (${project.targetUsers || 'intended audience'}) actually want this solution over their current status quo?`,
    `What is the most vulnerable security or privacy assumption in your architecture?`,
  ];

  return {
    problemSeverity:
      project.problemStatement.length > 80
        ? `High severity: Directly addresses acute operational friction for ${project.targetUsers || 'target users'}.`
        : 'Moderate severity: Problem is identifiable, but quantifying the financial or time cost will make the pitch more persuasive.',
    targetAudience: project.targetUsers || 'Identified hackathon demographic / end users',
    existingAlternatives,
    differentiation: `Combines ${project.frontendTech.slice(0, 2).join(' & ')} with ${
      project.aiModelsTech.length > 0 ? project.aiModelsTech.join(', ') : 'targeted algorithmic workflows'
    } to deliver lower latency and an intuitive workflow.`,
    innovation: isAI
      ? 'Context-aware intelligence that shifts from passive user input to proactive workflow acceleration.'
      : 'Streamlined integration architecture cutting down multi-step user flows into a unified experience.',
    feasibility: 'High: Demonstrated functioning prototype with measurable MVP endpoints.',
    defensibility:
      'Domain-specific workflow integrations, proprietary prompt pipelines/heuristic datasets, and network effects from early user adoption.',
    marketPotential: 'High growth potential within target vertical with low initial capital deployment requirements.',
    weaknessesJudgesWillChallenge,
    problemClarityScore: Math.min(98, Math.max(50, problemClarityScore)),
    solutionAlignmentScore: Math.min(98, Math.max(50, solutionAlignmentScore)),
    innovationScore: Math.min(98, Math.max(50, innovationScore)),
  };
}
