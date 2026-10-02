import { ProjectData, TechnicalAudit } from '../types';
import { GitHubAnalysisResult } from './githubFetcher';

export function analyzeTechnical(project: ProjectData, githubData?: GitHubAnalysisResult): TechnicalAudit {
  const hasFrontend = project.frontendTech && project.frontendTech.length > 0;
  const hasBackend = project.backendTech && project.backendTech.length > 0;
  const hasDb = project.databaseTech && project.databaseTech.length > 0;
  const hasAuth = project.authTech && project.authTech.length > 0;
  const hasAi = project.aiModelsTech && project.aiModelsTech.length > 0;

  // Base scores
  let architecture = 75;
  let security = 70;
  let scalability = 72;
  let codeQuality = 74;
  let testing = 60;
  let documentation = 72;
  let deployment = 75;
  let envHandling = 80;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const keyFindings: TechnicalAudit['keyFindings'] = [];

  // Evaluate Stack Synergy
  if (hasFrontend && hasBackend) {
    architecture += 8;
    strengths.push('Decoupled client-server architecture enables independent scalability');
  }
  if (hasDb) {
    scalability += 6;
  }
  if (hasAuth) {
    security += 10;
    strengths.push(`Identified authentication layer (${project.authTech.join(', ')})`);
  } else {
    security -= 10;
    weaknesses.push('No explicit authentication or session security layer defined');
    keyFindings.push({
      title: 'Missing Authentication Layer',
      description: 'Project lacks dedicated identity verification or role-based access control.',
      severity: 'critical',
    });
  }

  if (hasAi) {
    strengths.push(`Integrated AI/ML capabilities (${project.aiModelsTech.join(', ')})`);
  }

  // Incorporate real GitHub data if available
  if (githubData && githubData.isAccessible) {
    if (githubData.hasReadme) {
      documentation += 12;
      strengths.push('Repository includes comprehensive README with setup instructions');
      keyFindings.push({
        title: 'Documented Repository',
        description: 'README found with clear project onboarding instructions.',
        severity: 'good',
      });
    } else {
      documentation -= 15;
      weaknesses.push('No README found in repository root; judges cannot verify installation steps');
      keyFindings.push({
        title: 'Missing README',
        description: 'Judges will penalize projects without basic local execution guides.',
        severity: 'critical',
      });
    }

    if (githubData.hasTests) {
      testing += 24;
      codeQuality += 10;
      strengths.push('Automated test suite detected in repository');
      keyFindings.push({
        title: 'Automated Testing Present',
        description: 'Test files detected; demonstrates engineering rigor.',
        severity: 'good',
      });
    } else {
      testing -= 12;
      weaknesses.push('No automated unit or integration tests detected in the repository');
      keyFindings.push({
        title: 'Zero Automated Tests',
        description: 'Code quality relies purely on manual testing; high risk of regression.',
        severity: 'warning',
      });
    }

    if (githubData.hasCiCd) {
      deployment += 12;
      strengths.push('Continuous Integration / Deployment workflow configured');
      keyFindings.push({
        title: 'CI/CD Pipeline Active',
        description: 'Automated build and deploy actions ensure consistent releases.',
        severity: 'good',
      });
    }

    if (githubData.commitCountEstimate > 30) {
      codeQuality += 6;
      strengths.push(`Active commit history (${githubData.commitCountEstimate}+ commits during development)`);
    }
  } else if (project.githubUrl) {
    weaknesses.push('Provided GitHub repository was unreachable or private; evaluation is based on submitted stack descriptions');
    keyFindings.push({
      title: 'Repository Access Notice',
      description: 'Repository could not be verified via public API; ensure repository is public during judging.',
      severity: 'warning',
    });
  }

  if (project.liveUrl && project.liveUrl.startsWith('https://')) {
    deployment += 8;
    security += 5;
    strengths.push('Live deployed environment running over secure HTTPS');
  }

  return {
    architecture: Math.min(98, Math.max(45, architecture)),
    security: Math.min(98, Math.max(40, security)),
    scalability: Math.min(98, Math.max(45, scalability)),
    codeQuality: Math.min(98, Math.max(40, codeQuality)),
    testing: Math.min(98, Math.max(30, testing)),
    documentation: Math.min(98, Math.max(40, documentation)),
    deployment: Math.min(98, Math.max(45, deployment)),
    envHandling: Math.min(98, Math.max(50, envHandling)),
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    keyFindings,
    gitHubData: githubData?.isAccessible
      ? {
          stars: githubData.stars,
          forks: githubData.forks,
          openIssues: githubData.openIssues,
          primaryLanguage: githubData.primaryLanguage,
          languages: githubData.languages,
          hasReadme: githubData.hasReadme,
          hasTests: githubData.hasTests,
          hasCiCd: githubData.hasCiCd,
          commitCount: githubData.commitCountEstimate,
          repoName: githubData.repoName,
        }
      : undefined,
  };
}
