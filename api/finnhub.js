/**
 * Vercel Serverless Function — Finnhub Proxy
 * Proxies requests to https://finnhub.io/api/v1/*
 * Avoids CORS issues in the browser.
 */
export default async function handler(req, res) {
  // Extract the path after /api/finnhub
  const url = new URL(req.url, `https://${req.headers.host}`);
  const finnhubPath = url.pathname.replace(/^\/api\/finnhub/, '') || '/';
  const targetUrl = `https://finnhub.io${finnhubPath}${url.search}`;

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
    console.error('Finnhub proxy error:', error);
    res.status(502).json({ error: 'Failed to proxy request to Finnhub' });
  }
}
