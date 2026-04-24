import { moduleLoaded } from './logger';

moduleLoaded('scoreCalculator');

/**
 * Get color zone classification from a potential score
 * @param {number} score - Score between 0-100
 * @returns {{ zone: string, color: string, label: string }}
 */
export function getScoreZone(score) {
  if (score <= 30) {
    return { zone: 'bearish', color: '#FF3B5C', label: 'Bearish' };
  }
  if (score <= 60) {
    return { zone: 'neutral', color: '#FFD700', label: 'Neutral' };
  }
  return { zone: 'bullish', color: '#00FF94', label: 'Bullish' };
}

/**
 * Format a percentage with + or - prefix and color coding
 * @param {number} value - Percentage value
 * @returns {{ text: string, color: string }}
 */
export function formatPercentage(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return { text: '0.00%', color: '#A0A0B0' };

  const prefix = num > 0 ? '+' : '';
  const color = num > 0 ? '#00FF94' : num < 0 ? '#FF3B5C' : '#A0A0B0';
  return { text: `${prefix}${num.toFixed(2)}%`, color };
}

/**
 * Format large numbers (market cap, volume)
 * @param {number} num - Number to format
 * @returns {string} Formatted string (e.g., "2.8T", "45.3B")
 */
export function formatLargeNumber(num) {
  if (!num || isNaN(num)) return 'N/A';
  const n = parseFloat(num);
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

/**
 * Format price with appropriate decimal places
 * @param {number} price 
 * @param {boolean} isPSX - PSX prices are in PKR
 * @returns {string}
 */
export function formatPrice(price, isPSX = false) {
  if (!price || isNaN(price)) return isPSX ? 'PKR 0.00' : '$0.00';
  const prefix = isPSX ? 'PKR ' : '$';
  return `${prefix}${parseFloat(price).toFixed(2)}`;
}

/**
 * Interpolate gauge color based on score (0-100)
 * Returns a gradient stop color
 * @param {number} score
 * @returns {string} hex color
 */
export function getGaugeColor(score) {
  if (score <= 30) return '#FF3B5C';
  if (score <= 45) return '#FF6B35';
  if (score <= 55) return '#FFD700';
  if (score <= 70) return '#7CFC00';
  return '#00FF94';
}

/**
 * Calculate the 7-day price change percentage
 * @param {Array} history - Array of { date, close } sorted newest first
 * @returns {number} percentage change
 */
export function calculate7DayChange(history) {
  if (!history || history.length < 2) return 0;
  const latest = history[0].close;
  const weekAgo = history[Math.min(6, history.length - 1)].close;
  return ((latest - weekAgo) / weekAgo) * 100;
}
