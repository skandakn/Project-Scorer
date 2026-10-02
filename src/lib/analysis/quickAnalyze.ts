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
        // Next header reached, stop capturing
        break;
      }
    } else if (capturing) {
      if (line.trim()) {
        capturedLines.push(line.trim());
      }
      if (capturedLines.length >= 5) break; // Keep concise
    }
  }

  if (capturedLines.length > 0) {
    return capturedLines.join(' ');
  }
  return null;
}

// Detect category based on languages and text
function inferCategory(
  languages: Record<string, number>,
  text: string,
  primaryLang: string
): string {
  const lower = text.toLowerCase();

  if (
    lower.includes('llm') ||
    lower.includes('openai') ||
    lower.includes('gpt') ||
    lower.includes('agent') ||
    lower.includes('machine learning') ||
    lower.includes('pytorch') ||
    lower.includes('tensorflow') ||
    lower.includes('gemini') ||
    lower.includes('anthropic')
  ) {
    return 'AI & Machine Learning';
  }

  if (
    lower.includes('solidity') ||
    lower.includes('web3') ||
    lower.includes('blockchain') ||
    lower.includes('smart contract') ||
    lower.includes('ethereum')
  ) {
    return 'Web3 & Blockchain';
  }

  if (
    lower.includes('health') ||
    lower.includes('medical') ||
    lower.includes('doctor') ||
    lower.includes('patient') ||
    lower.includes('clinical') ||
    lower.includes('hospital')
  ) {
    return 'Healthcare & MedTech';
  }

  if (
    lower.includes('climate') ||
    lower.includes('energy') ||
    lower.includes('carbon') ||
    lower.includes('sustainab') ||
    lower.includes('solar') ||
    lower.includes('waste')
  ) {
    return 'Climate & Sustainability';
  }

  if (
    lower.includes('finance') ||
    lower.includes('crypto') ||
    lower.includes('trading') ||
    lower.includes('payment') ||
    lower.includes('banking') ||
    lower.includes('stock')
  ) {
    return 'FinTech & Payments';
  }

  if (
    lower.includes('mobile') ||
    lower.includes('flutter') ||
    lower.includes('react native') ||
    lower.includes('ios') ||
    lower.includes('android')
  ) {
    return 'Mobile Application';
  }

  if (
    lower.includes('cli') ||
    lower.includes('dev tool') ||
    lower.includes('library') ||
    lower.includes('sdk') ||
    lower.includes('compiler') ||
    lower.includes('linter')
  ) {
    return 'Developer Tools';
  }

  return 'Web Application';
}

// Infer technologies from GitHub languages & text
function inferTechStack(
  languages: Record<string, number>,
  primaryLang: string,
  readmeText: string
) {
  const langKeys = Object.keys(languages);
  const text = (readmeText + ' ' + langKeys.join(' ')).toLowerCase();

  const frontend: string[] = [];
  const backend: string[] = [];
  const database: string[] = [];
  const aiModels: string[] = [];
  const cloud: string[] = [];

  // Frontend
  if (text.includes('next.js') || text.includes('nextjs')) frontend.push('Next.js');
  if (text.includes('react') && !frontend.includes('Next.js')) frontend.push('React');
  if (text.includes('vue')) frontend.push('Vue.js');
  if (text.includes('svelte')) frontend.push('Svelte');
  if (text.includes('tailwind')) frontend.push('Tailwind CSS');
  if (languages['TypeScript'] || text.includes('typescript')) frontend.push('TypeScript');
  else if (languages['JavaScript']) frontend.push('JavaScript');
  if (frontend.length === 0) {
    if (languages['HTML'] || languages['CSS']) frontend.push('HTML5', 'CSS3');
    else frontend.push('Modern Web UI');
  }

  // Backend
  if (languages['Python'] || text.includes('python')) {
    if (text.includes('fastapi')) backend.push('FastAPI');
    else if (text.includes('django')) backend.push('Django');
    else if (text.includes('flask')) backend.push('Flask');
    else backend.push('Python');
  }
  if (text.includes('express') || text.includes('node')) backend.push('Node.js');
  if (languages['Go'] || text.includes('golang')) backend.push('Go');
  if (languages['Rust'] || text.includes('rust')) backend.push('Rust');
  if (languages['Java']) backend.push('Java');
  if (backend.length === 0) {
    backend.push(primaryLang !== 'Unknown' ? primaryLang : 'Node.js / REST API');
  }

  // Database
  if (text.includes('postgres') || text.includes('psql')) database.push('PostgreSQL');
  if (text.includes('prisma')) database.push('Prisma ORM');
  if (text.includes('mongo')) database.push('MongoDB');
  if (text.includes('redis')) database.push('Redis');
  if (text.includes('sqlite')) database.push('SQLite');
  if (text.includes('supabase')) database.push('Supabase');
  if (database.length === 0) database.push('PostgreSQL');

  // AI Models
  if (text.includes('gpt-4') || text.includes('openai')) aiModels.push('OpenAI GPT-4o');
  if (text.includes('claude') || text.includes('anthropic')) aiModels.push('Anthropic Claude');
  if (text.includes('gemini')) aiModels.push('Google Gemini');
  if (text.includes('langchain')) aiModels.push('LangChain');
  if (text.includes('whisper')) aiModels.push('Whisper Voice AI');
  if (text.includes('huggingface') || text.includes('pytorch')) aiModels.push('HuggingFace Transformers');
  if (aiModels.length === 0 && (text.includes('ai') || text.includes('model') || text.includes('prompt'))) {
    aiModels.push('LLM Integration');
  }

  // Cloud & DevOps
  if (text.includes('docker')) cloud.push('Docker');
  if (text.includes('vercel')) cloud.push('Vercel');
  if (text.includes('aws')) cloud.push('AWS');
  if (text.includes('gcp') || text.includes('google cloud')) cloud.push('Google Cloud');
  if (cloud.length === 0) cloud.push('Vercel / Cloud Infrastructure');

  return { frontend, backend, database, aiModels, cloud };
}

export async function quickAnalyzeGitHubRepo(
  rawUrl: string,
  overrides?: Partial<ProjectData>
): Promise<QuickAnalysisResult> {
  let cleanUrl = rawUrl.trim();
  // Normalize simple user input like "owner/repo" or "github.com/owner/repo"
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    if (cleanUrl.startsWith('github.com/')) {
      cleanUrl = `https://${cleanUrl}`;
    } else if (cleanUrl.includes('/')) {
      cleanUrl = `https://github.com/${cleanUrl}`;
    } else {
      cleanUrl = `https://github.com/${cleanUrl}`;
    }
  }

  // 1. Fetch GitHub data
  const repoMeta = await fetchGitHubRepoData(cleanUrl);

  // Parse owner and repo name from URL
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  const owner = repoMeta.owner || (match ? match[1] : 'Developer');
  const rawRepo = match ? match[2].replace(/\.git$/, '') : 'Project';
  const formattedName = formatRepoName(rawRepo);

  const combinedText = `${repoMeta.description || ''} ${repoMeta.readmePreview || ''}`;

  // Extract or synthesize problem statement
  const extractedProblem =
    extractReadmeSection(repoMeta.readmePreview || '', [
      'problem',
      'motivation',
      'why',
      'background',
      'challenge',
    ]) ||
    (repoMeta.description
      ? `Addresses key inefficiencies in modern workflows by leveraging automated engineering and intelligent architecture: ${repoMeta.description}`
      : `Solves workflow friction and coordination barriers for modern users by providing a robust, automated open-source solution.`);

  // Extract or synthesize description
  const extractedDescription =
    extractReadmeSection(repoMeta.readmePreview || '', [
      'about',
      'overview',
      'features',
      'introduction',
      'what is',
    ]) ||
    (repoMeta.description
      ? `${repoMeta.description}. Built with a modern technical architecture featuring automated workflows, high testability, and clean code principles.`
      : `An innovative project built to deliver seamless, production-ready functionality with high code quality and clear user impact.`);

  // Infer category & tech stack
  const category = inferCategory(repoMeta.languages, combinedText, repoMeta.primaryLanguage);
  const tech = inferTechStack(repoMeta.languages, repoMeta.primaryLanguage, combinedText);

  // Target users
  const targetUsers =
    category === 'Developer Tools'
      ? 'Software engineers, DevOps teams, and open-source contributors'
      : category === 'Healthcare & MedTech'
      ? 'Healthcare practitioners, clinicians, and medical professionals'
      : category === 'FinTech & Payments'
      ? 'Digital finance users, merchants, and portfolio managers'
      : 'End users, team collaborators, and hackathon judges seeking production-grade solutions';

  const synthesizedProject: ProjectData = {
    id: `proj-${Date.now()}`,
    name: overrides?.name || formattedName,
    tagline:
      overrides?.tagline ||
      repoMeta.description ||
      `Intelligent, production-ready ${category} solution built for high performance.`,
    category: overrides?.category || category,
    hackathonName: overrides?.hackathonName || 'Hackathon 2026',
    hackathonTheme: overrides?.hackathonTheme || category,
    problemStatement: overrides?.problemStatement || extractedProblem,
    targetUsers: overrides?.targetUsers || targetUsers,
    description: overrides?.description || extractedDescription,
    teamName: overrides?.teamName || `Team ${owner}`,
    teamMembers: overrides?.teamMembers?.length ? overrides.teamMembers : [owner],
    githubUrl: cleanUrl,
    liveUrl: overrides?.liveUrl || '',
    videoUrl: overrides?.videoUrl || '',
    figmaUrl: overrides?.figmaUrl || '',
    presentationUrl: overrides?.presentationUrl || '',
    frontendTech: overrides?.frontendTech?.length ? overrides.frontendTech : tech.frontend,
    backendTech: overrides?.backendTech?.length ? overrides.backendTech : tech.backend,
    databaseTech: overrides?.databaseTech?.length ? overrides.databaseTech : tech.database,
    apisTech: overrides?.apisTech?.length ? overrides.apisTech : ['REST API', 'JSON'],
    aiModelsTech: overrides?.aiModelsTech?.length ? overrides.aiModelsTech : tech.aiModels,
    cloudTech: overrides?.cloudTech?.length ? overrides.cloudTech : tech.cloud,
    authTech: overrides?.authTech?.length ? overrides.authTech : ['OAuth2 / JWT'],
    integrationsTech: overrides?.integrationsTech?.length ? overrides.integrationsTech : ['GitHub CI/CD'],
    screenshots: overrides?.screenshots?.length
      ? overrides.screenshots
      : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'],
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
