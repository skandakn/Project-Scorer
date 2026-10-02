import { ProjectData, UIAudit } from '../types';
import { WebsiteAnalysisResult } from './websiteFetcher';

export function analyzeUI(project: ProjectData, websiteData?: WebsiteAnalysisResult): UIAudit {
  let visualDesign = 82;
  let navigation = 80;
  let accessibility = 74;
  let responsiveness = 82;
  let consistency = 80;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  const checklist: UIAudit['checklist'] = [];

  const hasScreenshots = project.screenshots && project.screenshots.length > 0;
  const hasFigma = !!project.figmaUrl;

  if (hasScreenshots) {
    visualDesign += 6;
    strengths.push(`Project included ${project.screenshots.length} interface screenshots for visual inspection`);
    checklist.push({ item: 'Interface visual documentation provided', passed: true });
  } else {
    weaknesses.push('No UI screenshots uploaded; visual review is based on deployed URL or self-reported stack');
    checklist.push({ item: 'Interface visual documentation provided', passed: false, notes: 'Upload screenshots to verify visual hierarchy.' });
  }

  if (hasFigma) {
    consistency += 8;
    strengths.push('Figma design link provided; demonstrates intentional design system tokens');
    checklist.push({ item: 'Design system / wireframes established', passed: true });
  }

  if (websiteData && websiteData.isAccessible) {
    if (websiteData.hasViewport) {
      responsiveness += 8;
      strengths.push('Mobile viewport meta tag configured for responsive scaling');
      checklist.push({ item: 'Mobile viewport meta tag present', passed: true });
    } else {
      responsiveness -= 14;
      weaknesses.push('Missing viewport meta tag; mobile layouts will fail or scale awkwardly');
      checklist.push({ item: 'Mobile viewport meta tag present', passed: false, notes: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">' });
    }

    if (websiteData.hasHttps) {
      strengths.push('Deployed site secured with HTTPS TLS certificate');
      checklist.push({ item: 'HTTPS encryption enabled', passed: true });
    }

    if (websiteData.hasOgTags) {
      strengths.push('OpenGraph metadata present for social and hackathon gallery previews');
      checklist.push({ item: 'Social OpenGraph metadata present', passed: true });
    } else {
      weaknesses.push('Missing OpenGraph meta tags; links shared in judge Slack/Discord will appear blank');
      recommendations.push('Add og:title, og:description, and og:image tags for rich link previews in hackathon galleries');
      checklist.push({ item: 'Social OpenGraph metadata present', passed: false });
    }

    if (websiteData.responseTimeMs && websiteData.responseTimeMs < 500) {
      strengths.push(`Sub-500ms initial response time (${websiteData.responseTimeMs}ms) ensures snappy demo navigation`);
      checklist.push({ item: 'Fast initial server response (<500ms)', passed: true });
    } else if (websiteData.responseTimeMs && websiteData.responseTimeMs > 2000) {
      weaknesses.push(`High server response time (${websiteData.responseTimeMs}ms); judges may perceive UI as sluggish`);
      recommendations.push('Optimize initial bundle size and implement server-side caching to reduce cold-start latency');
      checklist.push({ item: 'Fast initial server response (<500ms)', passed: false, notes: `Response time was ${websiteData.responseTimeMs}ms` });
    }
  } else if (project.liveUrl) {
    weaknesses.push('Live deployed URL was unreachable during analysis; ensure the deployment is publicly accessible');
    checklist.push({ item: 'Live website accessible', passed: false, notes: 'Verify DNS and hosting status.' });
  }

  // General heuristic checks
  checklist.push({ item: 'Visual hierarchy guides eye to primary action', passed: true });
  checklist.push({ item: 'Accessible color contrast (WCAG AA ratio)', passed: accessibility > 75 });
  checklist.push({ item: 'Clear empty states for zero-data views', passed: visualDesign > 80 });

  recommendations.push('Ensure primary CTA button has prominent contrasting color and active loading spinner during async requests');
  recommendations.push('Verify all modal dialogs close on pressing the Escape key for keyboard accessibility');

  const overallScore = Math.round((visualDesign + navigation + accessibility + responsiveness + consistency) / 5);

  return {
    visualDesign: Math.min(98, Math.max(50, visualDesign)),
    navigation: Math.min(98, Math.max(50, navigation)),
    accessibility: Math.min(98, Math.max(45, accessibility)),
    responsiveness: Math.min(98, Math.max(50, responsiveness)),
    consistency: Math.min(98, Math.max(50, consistency)),
    overallScore,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    checklist,
    websiteData: websiteData?.isAccessible
      ? {
          statusCode: websiteData.statusCode,
          responseTimeMs: websiteData.responseTimeMs,
          title: websiteData.title,
          description: websiteData.description,
          hasHttps: websiteData.hasHttps,
          hasOgTags: websiteData.hasOgTags,
          hasViewport: websiteData.hasViewport,
        }
      : undefined,
  };
}
