import axios from 'axios';
import { PSX_NEWS_KEYWORDS } from '../constants/geopoliticalTags';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GDELT_BASE = 'https://api.gdeltproject.org/api/v2/doc/doc';

/**
 * Build a search query string for news APIs
 */
function buildQuery(ticker, companyName, sector, isPSX) {
  const parts = [companyName];
  if (sector && sector !== 'Unknown') parts.push(sector);
  parts.push('geopolitics');

  if (isPSX) {
    parts.push('Pakistan');
  }

  return parts.join(' ');
}

/**
 * Fetch news from GDELT (free, no key, no CORS issues)
 * Primary news source
 */
export async function fetchGDELTNews(query, maxRecords = 20) {
  try {
    const { data } = await axios.get(GDELT_BASE, {
      params: {
        query: query,
        mode: 'ArtList',
        format: 'json',
        maxrecords: maxRecords,
        timespan: '7d',
      },
    });

    if (!data || !data.articles) return [];

    return data.articles.map(article => ({
      title: article.title || '',
      url: article.url || '',
      source: article.domain || article.source?.domain || 'Unknown',
      date: article.seendate
        ? new Date(
            article.seendate.replace(
              /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
              '$1-$2-$3T$4:$5:$6Z'
            )
          ).toISOString()
        : new Date().toISOString(),
      snippet: article.title || '',
      sourceAPI: 'GDELT',
    })).filter(a => a.title.length > 10);
  } catch (err) {
    console.warn('GDELT API error:', err.message);
    return [];
  }
}

/**
 * Fetch news from NewsAPI (secondary source)
 * Uses Vite dev proxy in development, CORS proxy in production
 */
export async function fetchNewsAPIArticles(query, pageSize = 15) {
  if (!NEWS_API_KEY) return [];

  try {
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev
      ? '/newsapi/v2/everything'
      : `https://api.allorigins.win/raw?url=${encodeURIComponent(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
        )}`;

    const params = isDev
      ? {
          q: query,
          sortBy: 'publishedAt',
          pageSize,
          apiKey: NEWS_API_KEY,
        }
      : {};

    const { data } = await axios.get(baseUrl, { params });
    const responseData = typeof data === 'string' ? JSON.parse(data) : data;

    if (!responseData.articles) return [];

    return responseData.articles.map(article => ({
      title: article.title || '',
      url: article.url || '',
      source: article.source?.name || 'Unknown',
      date: article.publishedAt || new Date().toISOString(),
      snippet: article.description || '',
      sourceAPI: 'NewsAPI',
    })).filter(a => a.title && a.title !== '[Removed]');
  } catch (err) {
    console.warn('NewsAPI error:', err.message);
    return [];
  }
}

/**
 * Fetch all news from both sources, merged and deduplicated
 */
export async function fetchAllNews(ticker, companyName, sector, isPSX = false) {
  const query = buildQuery(ticker, companyName, sector, isPSX);

  // Also search for PSX-specific news if applicable
  const queries = [query];
  if (isPSX) {
    queries.push(`${ticker} Pakistan stock market`);
  }

  const results = await Promise.all([
    // Primary: GDELT
    ...queries.map(q => fetchGDELTNews(q, 15)),
    // Secondary: NewsAPI
    fetchNewsAPIArticles(query, 15),
  ]);

  // Flatten and deduplicate
  const allArticles = results.flat();
  
  // Simple dedup by title similarity
  const seen = new Set();
  const deduped = allArticles.filter(article => {
    const key = article.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date, newest first
  return deduped.sort((a, b) => new Date(b.date) - new Date(a.date));
}
