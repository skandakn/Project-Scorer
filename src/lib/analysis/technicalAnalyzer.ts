import { ProjectData, TechnicalAudit } from '../types';
import { GitHubAnalysisResult } from './githubFetcher';

export function analyzeTechnical(project: ProjectData, githubData?: GitHubAnalysisResult): TechnicalAudit {
  const hasFrontend = project.frontendTech && project.frontendTech.length > 0;
  const hasBackend = project.backendTech && project.backendTech.length > 0;
  const hasDb = project.databaseTech && project.databaseTech.length > 0 && !project.databaseTech.includes('None detected');
  const hasAuth = project.authTech && project.authTech.length > 0 && !project.authTech.includes('None detected');
  const hasAi = project.aiModelsTech && project.aiModelsTech.length > 0 && !project.aiModelsTech.includes('None detected');

  // Base scores
  let architecture = 75;
  let security = 70;
  let scalability = 72;
  let codeQuality = 74;
  let testing = 50;
  let documentation = 70;
  let deployment = 75;
  let envHandling = 80;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const keyFindings: TechnicalAudit['keyFindings'] = [];

  // Evaluate Stack Synergy
  if (hasFrontend && hasBackend) {
    architecture += 8;
    strengths.push('Decoupled client-server architecture with dedicated API route boundaries');
  }
  if (hasDb) {
    scalability += 6;
  }
  if (hasAuth) {
    security += 10;
    strengths.push(`Identified authentication layer (${project.authTech.join(', ')})`);
  } else {
    security -= 10;
    weaknesses.push('No explicit authentication or session security layer detected');
    keyFindings.push({
      title: 'Missing Authentication Layer',
      description: 'Project lacks dedicated identity verification or role-based access control.',
      severity: 'critical',
    });
  }

  if (hasAi) {
    strengths.push(`Integrated AI/ML capabilities (${project.aiModelsTech.join(', ')})`);
  }

  // Incorporate REAL GitHub empirical data if available
  if (githubData && githubData.isAccessible) {
    // 1. Dependencies and Framework Verification
    if (githubData.manifest) {
      const prodKeys = Object.keys(githubData.manifest.production);
      const devKeys = Object.keys(githubData.manifest.dev);
      strengths.push(
        `Verified manifest (${githubData.manifest.type}) with ${prodKeys.length} production packages and ${devKeys.length} dev tools`
      );

      keyFindings.push({
        title: 'Manifest Verified',
        description: `Verified ${prodKeys.length} dependencies including ${prodKeys.slice(0, 4).join(', ')}.`,
        severity: 'good',
      });
    }

    // 2. Database & Schema Verification
    if (githubData.database && githubData.database.models.length > 0) {
      scalability += 10;
      architecture += 8;
      strengths.push(
        `Configured ${githubData.database.orm || 'ORM'} with ${githubData.database.provider || 'relational'} datasource (${githubData.database.models.length} models: ${githubData.database.models.slice(0, 4).join(', ')})`
      );
      keyFindings.push({
        title: 'Structured Database Schema',
        description: `Verified schema with ${githubData.database.models.length} models defining data relationships.`,
        severity: 'good',
      });
    }

    // 3. Documentation & README Quality
    if (githubData.hasReadme) {
      if (githubData.isDefaultReadme) {
        documentation -= 25;
        weaknesses.push('README consists of boilerplate template without custom project explanation or architecture diagram');
        keyFindings.push({
          title: 'Boilerplate Documentation Alert',
          description: `README is standard scaffolding text (${githubData.readmeLength || 0} bytes). Add real setup steps, demo flow, and architecture notes.`,
          severity: 'warning',
        });
      } else {
        documentation += 15;
        strengths.push(`Custom repository README detected (${githubData.readmeHeadings?.length || 0} sections documented)`);
        keyFindings.push({
          title: 'Custom Project Documentation',
          description: `Repository includes structured documentation with sections: ${githubData.readmeHeadings?.slice(0, 3).join(', ') || 'overview'}.`,
          severity: 'good',
        });
      }
    } else {
      documentation -= 30;
      weaknesses.push('No README found in repository root; judges cannot verify installation steps');
      keyFindings.push({
        title: 'Missing README',
        description: 'Judges will penalize projects without basic local execution guides.',
        severity: 'critical',
      });
    }

    // 4. Automated Tests
    if (githubData.hasTests) {
      testing += 28;
      codeQuality += 10;
      const tfNames = githubData.testFrameworks.length > 0 ? githubData.testFrameworks.join(', ') : 'Test files';
      strengths.push(`Automated test verification detected (${tfNames})`);
      keyFindings.push({
        title: 'Automated Testing Detected',
        description: `Test files/runners identified (${tfNames}); demonstrates engineering rigor.`,
        severity: 'good',
      });
    } else {
      testing -= 20;
      weaknesses.push('Zero automated unit or integration tests detected in the repository');
      keyFindings.push({
        title: 'Zero Automated Tests',
        description: 'No test runner scripts (Jest, Vitest, Playwright) or test suites (*.test.*) detected. Code relies purely on manual checks.',
        severity: 'warning',
      });
    }

    // 5. CI/CD Pipeline
    if (githubData.hasCiCd) {
      deployment += 12;
      strengths.push(`Continuous Integration configured (${githubData.ciCdWorkflows.join(', ') || 'GitHub Actions'})`);
      keyFindings.push({
        title: 'Active CI/CD Pipeline',
        description: 'Automated workflows ensure consistent builds and deployments.',
        severity: 'good',
      });
    } else {
      deployment -= 8;
      weaknesses.push('No automated CI/CD pipeline configured (.github/workflows is absent)');
    }

    // 6. Commit History & Velocity
    if (githubData.commitCountEstimate > 20) {
      codeQuality += 8;
      strengths.push(`Active commit history (${githubData.commitCountEstimate}+ commits across project lifecycle)`);
    } else if (githubData.commits.length > 0) {
      strengths.push(
        `Commit history tracked (${githubData.commitCountEstimate} commits; latest: "${githubData.commits[0]?.message.slice(0, 45)}")`
      );
    }

    // 7. Contributors
    if (githubData.contributors.length > 1) {
      strengths.push(`Multi-developer collaboration verified (${githubData.contributors.length} contributors)`);
    }

    // 8. License
    if (githubData.license) {
      strengths.push(`Open-source license verified (${githubData.license})`);
    } else {
      weaknesses.push('No open-source license specified in repository');
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
    architecture: Math.min(98, Math.max(40, architecture)),
    security: Math.min(98, Math.max(35, security)),
    scalability: Math.min(98, Math.max(40, scalability)),
    codeQuality: Math.min(98, Math.max(35, codeQuality)),
    testing: Math.min(98, Math.max(20, testing)),
    documentation: Math.min(98, Math.max(25, documentation)),
    deployment: Math.min(98, Math.max(35, deployment)),
    envHandling: Math.min(98, Math.max(40, envHandling)),
    strengths: strengths.slice(0, 6),
    weaknesses: weaknesses.slice(0, 6),
    keyFindings,
    gitHubData: githubData?.isAccessible
      ? {
          stars: githubData.stars,
          forks: githubData.forks,
          openIssues: githubData.openIssues,
          primaryLanguage: githubData.primaryLanguage,
          languages: githubData.languages,
          languagesDetailed: githubData.languagesDetailed,
          hasReadme: githubData.hasReadme,
          readmePreview: githubData.readmePreview,
          readmeLength: githubData.readmeLength,
          readmeHeadings: githubData.readmeHeadings,
          isDefaultReadme: githubData.isDefaultReadme,
          hasTests: githubData.hasTests,
          testFrameworks: githubData.testFrameworks,
          hasCiCd: githubData.hasCiCd,
          ciCdWorkflows: githubData.ciCdWorkflows,
          commitCount: githubData.commitCountEstimate,
          repoName: githubData.repoName,
          owner: githubData.owner,
          ownerAvatar: githubData.ownerAvatar,
          description: githubData.description,
          license: githubData.license,
          defaultBranch: githubData.defaultBranch,
          createdAt: githubData.createdAt,
          pushedAt: githubData.pushedAt,
          sizeKb: githubData.sizeKb,
          homepage: githubData.homepage,
          topics: githubData.topics,
          commits: githubData.commits,
          contributors: githubData.contributors,
          dependencies: githubData.manifest
            ? {
                production: githubData.manifest.production,
                dev: githubData.manifest.dev,
                scripts: githubData.manifest.scripts,
              }
            : undefined,
          database: githubData.database
            ? {
                orm: githubData.database.orm,
                provider: githubData.database.provider,
                models: githubData.database.models,
              }
            : undefined,
          fileStats: {
            totalFiles: githubData.fileStats.totalFiles,
            codeFiles: githubData.fileStats.codeFiles,
            routesCount: githubData.fileStats.routes.length,
            componentsCount: githubData.fileStats.components.length,
          },
        }
      : undefined,
  };
}
