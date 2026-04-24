/**
 * Vercel Serverless Function — PSX Terminal Proxy
 * Proxies requests to https://psxterminal.com/api/*
 * Avoids CORS issues in the browser.
 */
export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const psxPath = url.pathname.replace(/^\/api\/psx/, '') || '/';
  const targetUrl = `https://psxterminal.com${psxPath}${url.search}`;

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
    console.error('PSX proxy error:', error);
    res.status(502).json({ error: 'Failed to proxy request to PSX Terminal' });
  }
}
