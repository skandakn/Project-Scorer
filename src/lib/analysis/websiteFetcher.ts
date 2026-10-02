// Live Website Analyzer
// Inspects publicly accessible HTTP headers, response latency, HTML metadata, OpenGraph tags, and viewport tags

export interface WebsiteAnalysisResult {
  isAccessible: boolean;
  statusCode?: number;
  responseTimeMs?: number;
  title?: string;
  description?: string;
  hasHttps: boolean;
  hasOgTags: boolean;
  hasViewport: boolean;
  hasFavicon: boolean;
  contentLength?: number;
  serverHeader?: string;
  error?: string;
}

export async function fetchWebsiteData(url: string): Promise<WebsiteAnalysisResult> {
  const result: WebsiteAnalysisResult = {
    isAccessible: false,
    hasHttps: false,
    hasOgTags: false,
    hasViewport: false,
    hasFavicon: false,
  };

  if (!url || !url.startsWith('http')) {
    result.error = 'Invalid URL format (must begin with http:// or https://)';
    return result;
  }

  result.hasHttps = url.startsWith('https://');

  try {
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'HackScore-AI-Web-Inspector/1.0',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    clearTimeout(timeoutId);

    result.statusCode = res.status;
    result.responseTimeMs = Date.now() - startTime;
    result.isAccessible = res.ok;
    result.serverHeader = res.headers.get('server') ?? undefined;

    const html = await res.text();
    result.contentLength = html.length;

    // Parse Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      result.title = titleMatch[1].trim();
    }

    // Parse Meta Description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    if (descMatch) {
      result.description = descMatch[1].trim();
    }

    // Check OpenGraph
    result.hasOgTags = html.includes('og:title') || html.includes('og:description') || html.includes('og:image');

    // Check Mobile Viewport
    result.hasViewport = html.includes('name="viewport"') || html.includes("name='viewport'");

    // Check Favicon
    result.hasFavicon = html.includes('rel="icon"') || html.includes("rel='shortcut icon'") || html.includes('rel="shortcut icon"');

    return result;
  } catch (err: unknown) {
    result.error = err instanceof Error ? err.message : 'Website unreachable or timed out';
    return result;
  }
}
