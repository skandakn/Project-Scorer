// Real GitHub Public Repository Analyzer
// Queries public GitHub REST API to extract genuine empirical signals,
// file manifests, commit histories, contributors, and dependencies.

export interface GitHubAnalysisResult {
  isAccessible: boolean;
  repoName?: string;
  owner?: string;
  ownerAvatar?: string;
  description?: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  primaryLanguage: string;
  languages: Record<string, number>;
  languagesDetailed: { name: string; bytes: number; percentage: number }[];
  defaultBranch?: string;
  license?: string;
  hasLicense?: boolean;
  createdAt?: string;
  updatedAt?: string;
  pushedAt?: string;
  sizeKb: number;
  homepage?: string;
  topics: string[];

  // README signals
  hasReadme: boolean;
  readmePreview?: string;
  readmeLength?: number;
  readmeHeadings?: string[];
  isDefaultReadme?: boolean;

  // Codebase structure & manifests
  hasTests: boolean;
  testFrameworks: string[];
  hasCiCd: boolean;
  ciCdWorkflows: string[];
  commitCountEstimate: number;

  // Real commits
  commits: {
    sha: string;
    message: string;
    author: string;
    avatar?: string;
    date: string;
    url?: string;
  }[];

  // Real contributors
  contributors: {
    login: string;
    avatar: string;
    contributions: number;
    url: string;
  }[];

  // Real package dependencies
  manifest?: {
    type: 'package.json' | 'requirements.txt' | 'Cargo.toml' | 'go.mod' | 'other';
    name?: string;
    production: Record<string, string>;
    dev: Record<string, string>;
    scripts: Record<string, string>;
  };

  // Real database / schema signals
  database?: {
    orm?: string;
    provider?: string;
    models: string[];
  };

  // Real file statistics
  fileStats: {
    totalFiles: number;
    codeFiles: number;
    routes: string[];
    components: string[];
    configFiles: string[];
  };

  error?: string;
}

export async function fetchGitHubRepoData(repoUrl: string): Promise<GitHubAnalysisResult> {
  const result: GitHubAnalysisResult = {
    isAccessible: false,
    stars: 0,
    forks: 0,
    watchers: 0,
    openIssues: 0,
    primaryLanguage: 'Unknown',
    languages: {},
    languagesDetailed: [],
    sizeKb: 0,
    topics: [],
    hasReadme: false,
    hasTests: false,
    testFrameworks: [],
    hasCiCd: false,
    ciCdWorkflows: [],
    commitCountEstimate: 0,
    commits: [],
    contributors: [],
    fileStats: {
      totalFiles: 0,
      codeFiles: 0,
      routes: [],
      components: [],
      configFiles: [],
    },
  };

  if (!repoUrl || !repoUrl.includes('github.com')) {
    result.error = 'Invalid or non-GitHub URL provided';
    return result;
  }

  try {
    const cleanUrl = repoUrl.replace(/\/$/, '');
    const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      result.error = 'Could not parse GitHub owner and repository name';
      return result;
    }

    const [, owner, repoRaw] = match;
    const repo = repoRaw.replace(/\.git$/, '');

    result.owner = owner;
    result.repoName = `${owner}/${repo}`;

    const headers: Record<string, string> = {
      'User-Agent': 'HackScore-AI-RealData-Fetcher',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch Repository Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 30 },
    });

    if (!repoRes.ok) {
      result.error = `GitHub API returned ${repoRes.status}: ${repoRes.statusText}`;
      return result;
    }

    const repoData = await repoRes.json();
    result.isAccessible = true;
    result.stars = repoData.stargazers_count ?? 0;
    result.forks = repoData.forks_count ?? 0;
    result.watchers = repoData.watchers_count ?? 0;
    result.openIssues = repoData.open_issues_count ?? 0;
    result.primaryLanguage = repoData.language ?? 'Unknown';
    result.license = repoData.license?.spdx_id || repoData.license?.name || undefined;
    result.hasLicense = !!repoData.license;
    result.description = repoData.description ?? '';
    result.defaultBranch = repoData.default_branch ?? 'main';
    result.ownerAvatar = repoData.owner?.avatar_url;
    result.createdAt = repoData.created_at;
    result.updatedAt = repoData.updated_at;
    result.pushedAt = repoData.pushed_at;
    result.sizeKb = repoData.size ?? 0;
    result.homepage = repoData.homepage || undefined;
    result.topics = repoData.topics || [];

    const defaultBranch = result.defaultBranch;

    // 2. Fetch Languages Breakdown
    try {
      const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
      if (langRes.ok) {
        const langData = (await langRes.json()) as Record<string, number>;
        result.languages = langData;
        const totalBytes = Object.values(langData).reduce((sum, b) => sum + b, 0);
        if (totalBytes > 0) {
          result.languagesDetailed = Object.entries(langData).map(([name, bytes]) => ({
            name,
            bytes,
            percentage: Math.round((bytes / totalBytes) * 1000) / 10,
          }));
        }
      }
    } catch {
      // Continue
    }

    // 3. Fetch Full README & Analyze
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      if (readmeRes.ok) {
        result.hasReadme = true;
        const readmeData = await readmeRes.json();
        if (readmeData.content) {
          const decoded = Buffer.from(readmeData.content, 'base64').toString('utf-8');
          result.readmePreview = decoded.slice(0, 2000);
          result.readmeLength = decoded.length;

          // Check if default boilerplate template
          const lower = decoded.toLowerCase();
          const isBoilerplate =
            lower.includes('bootstrapped with [`create-next-app`]') ||
            lower.includes('getting started with create react app') ||
            (lower.includes('vite + react') && decoded.length < 500) ||
            lower.includes('generated by create-react-app');
          result.isDefaultReadme = isBoilerplate;

          // Extract Headings
          const headings = decoded
            .split('\n')
            .filter((l) => l.startsWith('#'))
            .map((l) => l.replace(/^#+\s*/, '').trim())
            .filter(Boolean);
          result.readmeHeadings = headings.slice(0, 15);
        }
      }
    } catch {
      // Continue
    }

    // 4. Fetch File Tree (to detect tests, routes, models, CI/CD)
    try {
      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
        { headers }
      );
      if (treeRes.ok) {
        const treeData = await treeRes.json();
        if (Array.isArray(treeData.tree)) {
          const paths: string[] = treeData.tree.map((item: { path: string }) => item.path);
          result.fileStats.totalFiles = paths.length;

          const codePaths = paths.filter((p) =>
            /\.(ts|tsx|js|jsx|py|go|rs|java|cpp|c|cs|rb|php|vue|svelte)$/i.test(p)
          );
          result.fileStats.codeFiles = codePaths.length;

          // Routes
          result.fileStats.routes = paths
            .filter((p) => p.includes('app/') || p.includes('pages/') || p.includes('routes/'))
            .filter((p) => p.endsWith('page.tsx') || p.endsWith('route.ts') || p.endsWith('.py') || p.endsWith('.go'))
            .slice(0, 20);

          // Components
          result.fileStats.components = paths
            .filter((p) => p.includes('components/'))
            .slice(0, 20);

          // Config files
          result.fileStats.configFiles = paths
            .filter((p) =>
              /^(next\.config|tsconfig|tailwind|postcss|vite\.config|eslint|docker|Dockerfile|netlify\.toml|vercel\.json)/i.test(
                p.split('/').pop() || ''
              )
            )
            .slice(0, 10);

          // Tests detection
          const testPaths = paths.filter((p) => {
            const low = p.toLowerCase();
            return (
              low.includes('test') ||
              low.includes('spec') ||
              low.includes('__tests__') ||
              low.endsWith('.test.ts') ||
              low.endsWith('.spec.ts') ||
              low.endsWith('.test.js') ||
              low.endsWith('.spec.js') ||
              low.endsWith('_test.py') ||
              low.endsWith('_test.go')
            );
          });
          result.hasTests = testPaths.length > 0;

          // CI/CD workflows
          const workflowPaths = paths.filter(
            (p) => p.includes('.github/workflows/') && (p.endsWith('.yml') || p.endsWith('.yaml'))
          );
          result.hasCiCd = workflowPaths.length > 0;
          result.ciCdWorkflows = workflowPaths;
        }
      }
    } catch {
      // Continue
    }

    // 5. Fetch Real Commits (Latest 15)
    try {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=15`,
        { headers }
      );
      if (commitsRes.ok) {
        const linkHeader = commitsRes.headers.get('link');
        if (linkHeader) {
          const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (lastPageMatch) {
            result.commitCountEstimate = parseInt(lastPageMatch[1], 10);
          } else {
            result.commitCountEstimate = 15;
          }
        } else {
          result.commitCountEstimate = 1;
        }

        const commitsData = await commitsRes.json();
        if (Array.isArray(commitsData)) {
          if (!result.commitCountEstimate || result.commitCountEstimate < commitsData.length) {
            result.commitCountEstimate = commitsData.length;
          }

          result.commits = commitsData.map((c) => ({
            sha: (c.sha || '').slice(0, 7),
            message: (c.commit?.message || '').split('\n')[0].slice(0, 100),
            author: c.commit?.author?.name || c.author?.login || 'Developer',
            avatar: c.author?.avatar_url,
            date: c.commit?.author?.date || c.commit?.committer?.date || '',
            url: c.html_url,
          }));
        }
      }
    } catch {
      // Continue
    }

    // 6. Fetch Real Contributors (Top 10)
    try {
      const contribRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`,
        { headers }
      );
      if (contribRes.ok) {
        const contribData = await contribRes.json();
        if (Array.isArray(contribData)) {
          result.contributors = contribData.map((c) => ({
            login: c.login,
            avatar: c.avatar_url,
            contributions: c.contributions ?? 1,
            url: c.html_url,
          }));
        }
      }
    } catch {
      // Continue
    }

    // 7. Fetch Real Dependency Manifest (package.json)
    try {
      const pkgRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
        { headers }
      );
      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        if (pkgData.content) {
          const decoded = Buffer.from(pkgData.content, 'base64').toString('utf-8');
          const parsed = JSON.parse(decoded);

          const prod = (parsed.dependencies || {}) as Record<string, string>;
          const dev = (parsed.devDependencies || {}) as Record<string, string>;
          const scripts = (parsed.scripts || {}) as Record<string, string>;

          result.manifest = {
            type: 'package.json',
            name: parsed.name,
            production: prod,
            dev,
            scripts,
          };

          // Detect test frameworks from package.json
          const allDeps = { ...prod, ...dev };
          const tf: string[] = [];
          if (allDeps['jest']) tf.push('Jest');
          if (allDeps['vitest']) tf.push('Vitest');
          if (allDeps['@playwright/test'] || allDeps['playwright']) tf.push('Playwright');
          if (allDeps['cypress']) tf.push('Cypress');
          if (allDeps['mocha']) tf.push('Mocha');
          if (scripts['test']) tf.push('npm test script');

          if (tf.length > 0) {
            result.hasTests = true;
            result.testFrameworks = tf;
          }
        }
      }
    } catch {
      // Continue
    }

    // 8. Fetch Real Prisma Database Schema (if present)
    try {
      const prismaRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/prisma/schema.prisma`,
        { headers }
      );
      if (prismaRes.ok) {
        const prismaData = await prismaRes.json();
        if (prismaData.content) {
          const schemaText = Buffer.from(prismaData.content, 'base64').toString('utf-8');

          // Extract provider
          const providerMatch = schemaText.match(/provider\s*=\s*["']([^"']+)["']/);
          // Extract models
          const modelsMatch = Array.from(schemaText.matchAll(/model\s+(\w+)\s+\{/g)).map((m) => m[1]);

          result.database = {
            orm: 'Prisma ORM',
            provider: providerMatch ? providerMatch[1] : 'SQLite / Relational',
            models: modelsMatch,
          };
        }
      }
    } catch {
      // Continue
    }

    return result;
  } catch (err: unknown) {
    result.error = err instanceof Error ? err.message : 'Unknown network error';
    return result;
  }
}
