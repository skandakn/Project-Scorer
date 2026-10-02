import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubRepoData } from '@/lib/analysis/githubFetcher';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get('url');

  if (!repoUrl) {
    return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
  }

  const result = await fetchGitHubRepoData(repoUrl);
  return NextResponse.json(result);
}
