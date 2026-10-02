// Real GitHub Public Repository Analyzer
// Safely queries public GitHub REST API without executing any user code

export interface GitHubAnalysisResult {
  isAccessible: boolean;
  repoName?: string;
  owner?: string;
  description?: string;
  stars: number;
  forks: number;
  openIssues: number;
  primaryLanguage: string;
  languages: Record<string, number>;
  hasReadme: boolean;
  readmePreview?: string;
  hasTests: boolean;
  hasCiCd: boolean;
  hasLicense: boolean;
  commitCountEstimate: number;
  defaultBranch?: string;
  error?: string;
}

export async function fetchGitHubRepoData(repoUrl: string): Promise<GitHubAnalysisResult> {
  const result: GitHubAnalysisResult = {
    isAccessible: false,
    stars: 0,
    forks: 0,
    openIssues: 0,
    primaryLanguage: 'Unknown',
    languages: {},
    hasReadme: false,
    hasTests: false,
    hasCiCd: false,
    hasLicense: false,
    commitCountEstimate: 0,
  };

  if (!repoUrl || !repoUrl.includes('github.com')) {
    result.error = 'Invalid or non-GitHub URL provided';
    return result;
  }

  try {
    // Parse owner and repo name from URL (e.g., https://github.com/owner/repo)
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
      'User-Agent': 'HackScore-AI-Judge-Bot',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch Repository Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 60 },
    });

    if (!repoRes.ok) {
      result.error = `GitHub API returned ${repoRes.status}: ${repoRes.statusText}`;
      return result;
    }

    const repoData = await repoRes.json();
    result.isAccessible = true;
    result.stars = repoData.stargazers_count ?? 0;
    result.forks = repoData.forks_count ?? 0;
    result.openIssues = repoData.open_issues_count ?? 0;
    result.primaryLanguage = repoData.language ?? 'Unknown';
    result.hasLicense = !!repoData.license;
    result.description = repoData.description ?? '';
    result.defaultBranch = repoData.default_branch ?? 'main';

    // 2. Fetch Languages
    try {
      const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
      if (langRes.ok) {
        result.languages = await langRes.json();
      }
    } catch {
      // Continue even if languages fail
    }

    // 3. Check README
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      if (readmeRes.ok) {
        result.hasReadme = true;
        const readmeData = await readmeRes.json();
        if (readmeData.content) {
          const decoded = Buffer.from(readmeData.content, 'base64').toString('utf-8');
          result.readmePreview = decoded.slice(0, 1000);
        }
      }
    } catch {
      // Continue
    }

    // 4. Inspect Root Tree / Files for Tests & CI/CD
    try {
      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${result.defaultBranch}?recursive=1`,
        { headers }
      );
      if (treeRes.ok) {
        const treeData = await treeRes.json();
        if (Array.isArray(treeData.tree)) {
          const paths = treeData.tree.map((item: { path: string }) => item.path.toLowerCase());

          result.hasTests = paths.some(
            (p: string) =>
              p.includes('test') ||
              p.includes('spec') ||
              p.includes('__tests__') ||
              p.endsWith('.test.ts') ||
              p.endsWith('.spec.ts') ||
              p.endsWith('.test.js')
          );

          result.hasCiCd = paths.some(
            (p: string) =>
              p.includes('.github/workflows') ||
              p.includes('.gitlab-ci.yml') ||
              p.includes('circleci') ||
              p.includes('travis.yml')
          );
        }
      }
    } catch {
      // Tree inspection is optional
    }

    // 5. Estimate Commit Activity
    try {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
        { headers }
      );
      if (commitsRes.ok) {
        const linkHeader = commitsRes.headers.get('link');
        if (linkHeader) {
          const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (lastPageMatch) {
            result.commitCountEstimate = parseInt(lastPageMatch[1], 10);
          } else {
            result.commitCountEstimate = 1;
          }
        } else {
          result.commitCountEstimate = 1;
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
