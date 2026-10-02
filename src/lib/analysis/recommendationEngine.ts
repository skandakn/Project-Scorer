import { ImprovementItem, ProjectData, TechnicalAudit, UIAudit } from '../types';

export function generateRecommendations(
  project: ProjectData,
  techAudit: TechnicalAudit,
  uiAudit: UIAudit
): ImprovementItem[] {
  const items: ImprovementItem[] = [];

  // 1. Critical Priority items
  if (techAudit.testing < 65) {
    items.push({
      id: 'rec-automated-tests',
      title: 'Add Automated Smoke & Unit Tests',
      priority: 'CRITICAL',
      problem: 'Repository has zero or negligible automated test coverage; judges will doubt edge-case stability.',
      action: 'Add 3 to 5 core unit tests for critical business logic or API endpoints using Vitest or Jest.',
      expectedImpact: 'High',
      estimatedPointGain: 4,
      category: 'Technical',
      completed: false,
    });
  }

  if (!project.videoUrl) {
    items.push({
      id: 'rec-backup-demo',
      title: 'Record a 60-Second Backup Demo Video',
      priority: 'CRITICAL',
      problem: 'Live hackathon Wi-Fi frequently fails; presenting without an offline backup video is a massive risk.',
      action: 'Record a crisp 60-second screen capture demonstrating the core 3-step value proposition.',
      expectedImpact: 'High',
      estimatedPointGain: 4,
      category: 'Demo',
      completed: false,
    });
  }

  // 2. High Priority items
  if (uiAudit.accessibility < 80) {
    items.push({
      id: 'rec-ui-contrast',
      title: 'Improve Visual Hierarchy & Contrast',
      priority: 'HIGH',
      problem: 'Some secondary labels or CTA buttons have low contrast or compete for visual attention.',
      action: 'Enforce WCAG AA compliant 4.5:1 contrast ratio on primary buttons and increase headline weight.',
      expectedImpact: 'Medium-High',
      estimatedPointGain: 3,
      category: 'UI/UX',
      completed: false,
    });
  }

  if (techAudit.documentation < 80) {
    items.push({
      id: 'rec-readme-architecture',
      title: 'Include Visual Architecture Diagram in README',
      priority: 'HIGH',
      problem: 'Judges skimming your repository may not understand how services connect in 30 seconds.',
      action: 'Add an ASCII or Mermaid architecture diagram and clear 3-step local setup instructions in README.',
      expectedImpact: 'Medium-High',
      estimatedPointGain: 3,
      category: 'Technical',
      completed: false,
    });
  }

  // 3. Quick Wins
  items.push({
    id: 'rec-quantified-metrics',
    title: 'Show Quantified Impact Metrics on Dashboard',
    priority: 'QUICK_WIN',
    problem: 'Judges respond strongly to measurable data (e.g. "Saved 7 mins", "Processed in 120ms", "94% Accuracy").',
    action: 'Add 2 or 3 prominent stat callout cards to your homepage showing concrete time or cost savings.',
    expectedImpact: 'Medium',
    estimatedPointGain: 3,
    category: 'Product',
    completed: false,
  });

  items.push({
    id: 'rec-keyboard-shortcut',
    title: 'Add Keyboard Shortcuts / Quick Action',
    priority: 'QUICK_WIN',
    problem: 'Fumbling for tiny click targets during a live pitch looks clumsy.',
    action: 'Add Cmd+K / Ctrl+K search or single-key hotkey for the primary demo trigger.',
    expectedImpact: 'Medium',
    estimatedPointGain: 2,
    category: 'UI/UX',
    completed: false,
  });

  return items;
}
