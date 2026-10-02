import { ProjectData, EvaluationResult } from '../types';
import { fetchGitHubRepoData, GitHubAnalysisResult } from './githubFetcher';
import { runFullProjectAnalysis } from './projectAnalyzer';

export interface QuickAnalysisResult {
  project: ProjectData;
  evaluation: EvaluationResult;
  repoMeta: GitHubAnalysisResult;
}

// Convert kebab-case or snake_case or PascalCase to readable Title Case
function formatRepoName(raw: string): string {
  if (!raw) return 'Hackathon Project';
  const clean = raw.replace(/\.git$/, '');
  return clean
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

// Extract a dedicated section from README if present
function extractReadmeSection(readme: string, keywords: string[]): string | null {
  if (!readme) return null;
  const lines = readme.split('\n');
  let capturing = false;
  const capturedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeader = line.startsWith('#');

    if (isHeader) {
      const lower = line.toLowerCase();
      if (keywords.some((k) => lower.includes(k))) {
        capturing = true;
        continue;
      } else if (capturing) {
        break;
      }
    } else if (capturing) {
      if (line.trim()) {
        capturedLines.push(line.trim());
      }
      if (capturedLines.length >= 6) break;
    }
  }

  if (capturedLines.length > 0) {
    return capturedLines.join(' ');
  }
  return null;
}

// Detect category based on languages, dependencies, and text
function inferCategory(
  languages: Record<string, number>,
  text: string,
  manifest?: GitHubAnalysisResult['manifest']
): string {
  const allDeps = {
    ...manifest?.production,
    ...manifest?.dev,
  };
  const depsString = Object.keys(allDeps).join(' ').toLowerCase();
  const lower = (text + ' ' + depsString).toLowerCase();

  if (
    lower.includes('llm') ||
    lower.includes('openai') ||
    lower.includes('gpt') ||
    lower.includes('langchain') ||
    lower.includes('generative-ai') ||
    lower.includes('anthropic') ||
    lower.includes('huggingface') ||
    lower.includes('pytorch') ||
    lower.includes('tensorflow')
  ) {
    return 'AI & Machine Learning';
  }

  if (
    lower.includes('solidity') ||
    lower.includes('web3') ||
    lower.includes('blockchain') ||
    lower.includes('ethers') ||
    lower.includes('wagmi') ||
    lower.includes('smart contract')
  ) {
    return 'Web3 & Blockchain';
  }

  if (
    lower.includes('health') ||
    lower.includes('medical') ||
    lower.includes('patient') ||
    lower.includes('doctor') ||
    lower.includes('clinical') ||
    lower.includes('ehr')
  ) {
    return 'Healthcare & MedTech';
  }

  if (
    lower.includes('climate') ||
    lower.includes('carbon') ||
    lower.includes('sustainab') ||
    lower.includes('solar') ||
    lower.includes('waste') ||
    lower.includes('energy')
  ) {
    return 'Climate & Sustainability';
  }

  if (
    lower.includes('finance') ||
    lower.includes('payment') ||
    lower.includes('stripe') ||
    lower.includes('banking') ||
    lower.includes('stock') ||
    lower.includes('trading')
  ) {
    return 'FinTech & Payments';
  }

  if (
    lower.includes('cli') ||
    lower.includes('linter') ||
    lower.includes('compiler') ||
    lower.includes('sdk') ||
    lower.includes('devtools') ||
    lower.includes('scorer') ||
    lower.includes('judge')
  ) {
    return 'Developer Tools';
  }

  return 'Web Application';
}

// Extract REAL tech stack directly from package.json manifest, prisma, and languages
function extractRealTechStack(
  repoMeta: GitHubAnalysisResult
): {
  frontend: string[];
  backend: string[];
  database: string[];
  aiModels: string[];
  cloud: string[];
  auth: string[];
  integrations: string[];
} {
  const frontend: string[] = [];
  const backend: string[] = [];
  const database: string[] = [];
  const aiModels: string[] = [];
  const cloud: string[] = [];
  const auth: string[] = [];
  const integrations: string[] = [];

  const prod = repoMeta.manifest?.production || {};
  const dev = repoMeta.manifest?.dev || {};
  const allDeps = { ...prod, ...dev };
  const allKeys = Object.keys(allDeps).map((k) => k.toLowerCase());

  // 1. Frontend extraction
  if (allKeys.includes('next')) frontend.push(`Next.js (${prod['next'] || '16'})`);
  else if (allKeys.includes('react')) frontend.push(`React (${prod['react'] || '19'})`);
  else if (allKeys.includes('vue')) frontend.push('Vue.js');
  else if (allKeys.includes('svelte')) frontend.push('Svelte');

  if (allKeys.includes('tailwindcss') || allKeys.includes('@tailwindcss/postcss')) {
    frontend.push('Tailwind CSS');
  }
  if (allKeys.includes('framer-motion')) frontend.push('Framer Motion');
  if (allKeys.includes('lucide-react')) frontend.push('Lucide React');
  if (allKeys.includes('recharts')) frontend.push('Recharts');
  if (allKeys.includes('canvas-confetti')) frontend.push('Canvas Confetti');
  if (repoMeta.languages['TypeScript']) frontend.push('TypeScript');
  else if (repoMeta.languages['JavaScript']) frontend.push('JavaScript');

  if (frontend.length === 0) {
    if (repoMeta.languages['HTML'] || repoMeta.languages['CSS']) frontend.push('HTML5 / CSS3');
    else frontend.push(repoMeta.primaryLanguage !== 'Unknown' ? repoMeta.primaryLanguage : 'Standard UI');
  }

  // 2. Backend extraction
  if (allKeys.includes('next')) {
    backend.push('Next.js API Routes / App Router');
  } else if (allKeys.includes('express')) {
    backend.push('Express.js / Node');
  } else if (allKeys.includes('fastify')) {
    backend.push('Fastify');
  } else if (repoMeta.languages['Python']) {
    backend.push('Python REST API');
  } else if (repoMeta.languages['Go']) {
    backend.push('Go HTTP API');
  } else if (repoMeta.languages['Rust']) {
    backend.push('Rust backend');
  } else {
    backend.push(repoMeta.primaryLanguage !== 'Unknown' ? `${repoMeta.primaryLanguage} Runtime` : 'REST API');
  }

  // 3. Database extraction (REAL schema evidence)
  if (repoMeta.database) {
    database.push(`${repoMeta.database.orm || 'ORM'} (${repoMeta.database.provider || 'Relational'})`);
  } else if (allKeys.includes('@prisma/client') || allKeys.includes('prisma')) {
    database.push('Prisma ORM');
  } else if (allKeys.includes('mongoose') || allKeys.includes('mongodb')) {
    database.push('MongoDB');
  } else if (allKeys.includes('pg') || allKeys.includes('postgres')) {
    database.push('PostgreSQL');
  } else if (allKeys.includes('sqlite3') || allKeys.includes('better-sqlite3')) {
    database.push('SQLite');
  } else {
    database.push('None detected in dependencies');
  }

  // 4. AI Models & SDKs (REAL evidence)
  if (allKeys.includes('openai')) aiModels.push('OpenAI API SDK');
  if (allKeys.includes('@google/generative-ai') || allKeys.includes('@google/genai')) {
    aiModels.push('Google Gemini SDK');
  }
  if (allKeys.includes('@anthropic-ai/sdk')) aiModels.push('Anthropic Claude SDK');
  if (allKeys.includes('langchain')) aiModels.push('LangChain');
  if (aiModels.length === 0) {
    const textLower = ((repoMeta.description || '') + ' ' + (repoMeta.readmePreview || '')).toLowerCase();
    if (textLower.includes('ai') || textLower.includes('llm') || textLower.includes('gpt')) {
      aiModels.push('AI Integration Architecture');
    }
  }

  // 5. Auth extraction
  if (allKeys.includes('@clerk/nextjs') || allKeys.includes('@clerk/clerk-react')) {
    auth.push('Clerk Authentication');
  } else if (allKeys.includes('next-auth') || allKeys.includes('@auth/core')) {
    auth.push('NextAuth.js');
  } else if (allKeys.includes('firebase')) {
    auth.push('Firebase Auth');
  } else if (allKeys.includes('jsonwebtoken') || allKeys.includes('jose')) {
    auth.push('JWT Token Auth');
  } else {
    auth.push('None detected');
  }

  // 6. Cloud & Hosting signals
  const configNames = repoMeta.fileStats.configFiles.map((c) => c.toLowerCase());
  if (configNames.some((c) => c.includes('netlify'))) cloud.push('Netlify');
  if (configNames.some((c) => c.includes('vercel'))) cloud.push('Vercel');
  if (configNames.some((c) => c.includes('docker'))) cloud.push('Docker');
  if (repoMeta.hasCiCd) cloud.push('GitHub Actions CI/CD');
  if (cloud.length === 0) cloud.push('Cloud Hosting');

  return { frontend, backend, database, aiModels, cloud, auth, integrations };
}

export async function quickAnalyzeGitHubRepo(
  rawUrl: string,
  overrides?: Partial<ProjectData>
): Promise<QuickAnalysisResult> {
  let cleanUrl = rawUrl.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    if (cleanUrl.startsWith('github.com/')) {
      cleanUrl = `https://${cleanUrl}`;
    } else if (cleanUrl.includes('/')) {
      cleanUrl = `https://github.com/${cleanUrl}`;
    } else {
      cleanUrl = `https://github.com/${cleanUrl}`;
    }
  }

  // 1. Fetch REAL GitHub data
  const repoMeta = await fetchGitHubRepoData(cleanUrl);

  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  const owner = repoMeta.owner || (match ? match[1] : 'Developer');
  const rawRepo = match ? match[2].replace(/\.git$/, '') : 'Project';
  const formattedName = repoMeta.manifest?.name
    ? formatRepoName(repoMeta.manifest.name)
    : formatRepoName(rawRepo);

  const combinedText = `${repoMeta.description || ''} ${repoMeta.readmePreview || ''}`;

  // Real problem statement extraction
  let extractedProblem: string;
  if (repoMeta.isDefaultReadme) {
    extractedProblem =
      repoMeta.description ||
      `Public ${repoMeta.primaryLanguage} repository with standard template README. No custom problem statement or user pain points documented in root README.`;
  } else {
    extractedProblem =
      extractReadmeSection(repoMeta.readmePreview || '', [
        'problem',
        'motivation',
        'why',
        'background',
        'challenge',
      ]) ||
      (repoMeta.description
        ? `${repoMeta.description}`
        : `Repository provides an open-source ${repoMeta.primaryLanguage} solution built by @${owner}.`);
  }

  // Real description extraction
  let extractedDescription: string;
  if (repoMeta.isDefaultReadme) {
    extractedDescription =
      repoMeta.description ||
      `Application built with ${repoMeta.primaryLanguage} containing ${repoMeta.fileStats.totalFiles} files (${repoMeta.fileStats.codeFiles} code files) and ${repoMeta.commits.length} commits.`;
  } else {
    extractedDescription =
      extractReadmeSection(repoMeta.readmePreview || '', [
        'about',
        'overview',
        'features',
        'introduction',
        'what is',
      ]) ||
      (repoMeta.description
        ? `${repoMeta.description}. Verified repository architecture with ${repoMeta.fileStats.totalFiles} files.`
        : `Repository by @${owner} built with ${repoMeta.primaryLanguage}.`);
  }

  // Infer category & extract REAL tech stack
  const category = inferCategory(repoMeta.languages, combinedText, repoMeta.manifest);
  const tech = extractRealTechStack(repoMeta);

  // Target users
  const targetUsers =
    category === 'Developer Tools'
      ? 'Software engineers, DevOps teams, and hackathon builders'
      : category === 'Healthcare & MedTech'
      ? 'Healthcare practitioners, clinicians, and medical teams'
      : category === 'FinTech & Payments'
      ? 'Fintech developers, traders, and payment processors'
      : 'Developers, collaborators, and hackathon judging panels';

  // Use the REAL official GitHub dynamic social preview image for this repo
  const realGithubSocialImage = `https://opengraph.githubassets.com/1/${owner}/${rawRepo}`;

  const contributorsList = repoMeta.contributors.length > 0
    ? repoMeta.contributors.map((c) => c.login)
    : [owner];

  const synthesizedProject: ProjectData = {
    id: `proj-${Date.now()}`,
    name: overrides?.name || formattedName,
    tagline:
      overrides?.tagline ||
      repoMeta.description ||
      `${formattedName} — ${repoMeta.primaryLanguage} repository by @${owner} (${repoMeta.stars} stars, ${repoMeta.fileStats.totalFiles} files).`,
    category: overrides?.category || category,
    hackathonName: overrides?.hackathonName || 'Hackathon 2026',
    hackathonTheme: overrides?.hackathonTheme || category,
    problemStatement: overrides?.problemStatement || extractedProblem,
    targetUsers: overrides?.targetUsers || targetUsers,
    description: overrides?.description || extractedDescription,
    teamName: overrides?.teamName || `Team @${owner}`,
    teamMembers: overrides?.teamMembers?.length ? overrides.teamMembers : contributorsList,
    githubUrl: cleanUrl,
    liveUrl: overrides?.liveUrl || repoMeta.homepage || '',
    videoUrl: overrides?.videoUrl || '',
    figmaUrl: overrides?.figmaUrl || '',
    presentationUrl: overrides?.presentationUrl || '',
    frontendTech: overrides?.frontendTech?.length ? overrides.frontendTech : tech.frontend,
    backendTech: overrides?.backendTech?.length ? overrides.backendTech : tech.backend,
    databaseTech: overrides?.databaseTech?.length ? overrides.databaseTech : tech.database,
    apisTech: overrides?.apisTech?.length ? overrides.apisTech : ['REST API', 'JSON'],
    aiModelsTech: overrides?.aiModelsTech?.length ? overrides.aiModelsTech : tech.aiModels,
    cloudTech: overrides?.cloudTech?.length ? overrides.cloudTech : tech.cloud,
    authTech: overrides?.authTech?.length ? overrides.authTech : tech.auth,
    integrationsTech: overrides?.integrationsTech?.length ? overrides.integrationsTech : tech.integrations,
    screenshots: overrides?.screenshots?.length
      ? overrides.screenshots
      : [realGithubSocialImage],
    rubricId: overrides?.rubricId || 'general',
    customWeights: overrides?.customWeights || {},
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'EVALUATED',
  };

  // Run full evaluation
  const evaluation = await runFullProjectAnalysis(synthesizedProject);

  return {
    project: synthesizedProject,
    evaluation,
    repoMeta,
  };
}
