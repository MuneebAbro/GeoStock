import { moduleLoaded, logInfo } from './logger';

moduleLoaded('newsFormatter');

/**
 * Format raw news articles into a prompt-ready string for Groq
 * @param {Array} articles - Array of unified article objects
 * @returns {string} Numbered list of headlines with sources and dates
 */
export function formatNewsForPrompt(articles) {
  logInfo('newsFormatter', 'formatNewsForPrompt called', { count: articles?.length || 0 });
  if (!articles || articles.length === 0) {
    return 'No recent geopolitical news available.';
  }

  return articles
    .slice(0, 15) // Limit to 15 to stay within token limits
    .map((article, i) => {
      const date = article.date ? new Date(article.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }) : 'Recent';
      return `${i + 1}. "${article.title}" — ${article.source || 'Unknown'} (${date})`;
    })
    .join('\n');
}

/**
 * Format price history for Groq prompt
 * @param {Array} history - Array of { date, close } objects
 * @returns {string} Date: price pairs
 */
export function formatPriceHistory(history) {
  logInfo('newsFormatter', 'formatPriceHistory called', { count: history?.length || 0 });
  if (!history || history.length === 0) return 'No historical data available.';

  return history
    .slice(0, 30)
    .map(day => `${day.date}: $${day.close}`)
    .join('\n');
}

/**
 * Deduplicate articles by headline similarity
 * Uses simple word overlap (Jaccard similarity)
 * @param {Array} articles - Array of article objects
 * @returns {Array} Deduplicated articles
 */
export function deduplicateArticles(articles) {
  if (!articles || articles.length === 0) return [];

  const seen = [];
  const result = [];

  for (const article of articles) {
    const words = new Set(
      article.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3)
    );

    let isDuplicate = false;
    for (const seenWords of seen) {
      const intersection = new Set([...words].filter(w => seenWords.has(w)));
      const union = new Set([...words, ...seenWords]);
      const similarity = union.size > 0 ? intersection.size / union.size : 0;
      if (similarity > 0.5) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.push(words);
      result.push(article);
    }
  }

  return result;
}

/**
 * Merge articles from multiple sources into unified format
 * @param  {...Array} sources - Arrays of articles from different APIs
 * @returns {Array} Merged and deduplicated articles
 */
export function mergeNewsSources(...sources) {
  const allArticles = sources
    .flat()
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return deduplicateArticles(allArticles);
}
