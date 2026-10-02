import { NextRequest, NextResponse } from 'next/server';
import { fetchWebsiteData } from '@/lib/analysis/websiteFetcher';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const siteUrl = searchParams.get('url');

  if (!siteUrl) {
    return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
  }

  const result = await fetchWebsiteData(siteUrl);
  return NextResponse.json(result);
}
