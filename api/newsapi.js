/**
 * Vercel Serverless Function — NewsAPI Proxy
 * Proxies requests to https://newsapi.org/*
 * Avoids CORS issues in the browser.
 */
export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const newsPath = url.pathname.replace(/^\/api\/newsapi/, '') || '/';
  const targetUrl = `https://newsapi.org${newsPath}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.status(response.status).send(data);
  } catch (error) {
    console.error('NewsAPI proxy error:', error);
    res.status(502).json({ error: 'Failed to proxy request to NewsAPI' });
  }
}
