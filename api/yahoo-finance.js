/**
 * Vercel Serverless Function — Yahoo Finance Proxy
 * Proxies requests to https://query1.finance.yahoo.com/*
 * Avoids CORS issues in the browser.
 */
export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const yahooPath = url.pathname.replace(/^\/api\/yahoo-finance/, '') || '/';
  const targetUrl = `https://query1.finance.yahoo.com${yahooPath}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const data = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Yahoo Finance proxy error:', error);
    res.status(502).json({ error: 'Failed to proxy request to Yahoo Finance' });
  }
}
