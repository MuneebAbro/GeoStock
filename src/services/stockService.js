import axios from 'axios';
import { moduleLoaded, logInfo, logWarn } from '../utils/logger';

moduleLoaded('stockService');

const isDev = import.meta.env.DEV;
const FINNHUB_BASE = isDev ? '/finnhub/api/v1' : '/api/finnhub/api/v1';
const PSX_TERMINAL_BASE = isDev ? '/psx-api/api' : '/api/psx/api';
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// ===== Caching Layer =====
function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage might be full — silently ignore
  }
}

// ===== Finnhub (Global Stocks) =====

/**
 * Fetch current quote for a global stock via Finnhub
 * Endpoint: /quote?symbol=AAPL
 * Response: { c: current, d: change, dp: changePercent, h: high, l: low, o: open, pc: previousClose, t: timestamp }
 */
export async function getGlobalQuote(ticker) {
  logInfo('stockService', 'getGlobalQuote started', { ticker });
  const cacheKey = `geostock_quote_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${FINNHUB_BASE}/quote`, {
    params: {
      symbol: ticker,
      token: FINNHUB_KEY,
    },
  });

  // Finnhub returns { c, d, dp, h, l, o, pc, t } — c=0 means no data
  if (!data || data.c === 0) {
    throw new Error(`No quote data found for ${ticker}`);
  }

  const result = {
    price: data.c,
    change: data.d,
    changePercent: data.dp,
    high: data.h,
    low: data.l,
    volume: 0, // Finnhub quote doesn't include volume; we get it from candles
    previousClose: data.pc,
    open: data.o,
  };

  setCache(cacheKey, result);
  logInfo('stockService', 'getGlobalQuote completed', { ticker });
  return result;
}

/**
 * Fetch 30-day daily price history for a global stock via Yahoo Finance
 * Endpoint: /v8/finance/chart/AAPL?interval=1d&period1=UNIX&period2=UNIX
 * Free, no API key needed, accurate OHLCV data
 */
export async function getGlobalDailyHistory(ticker) {
  logInfo('stockService', 'getGlobalDailyHistory started', { ticker });
  const cacheKey = `geostock_history_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60);

  const yahooBase = isDev ? '/yahoo-finance' : '/api/yahoo-finance';
  const { data } = await axios.get(`${yahooBase}/v8/finance/chart/${ticker}`, {
    params: {
      interval: '1d',
      period1: thirtyDaysAgo,
      period2: now,
    },
  });

  const chartResult = data?.chart?.result?.[0];
  if (!chartResult || !chartResult.timestamp) {
    throw new Error(`No historical data found for ${ticker}`);
  }

  const timestamps = chartResult.timestamp;
  const quote = chartResult.indicators?.quote?.[0];
  if (!quote) {
    throw new Error(`No OHLCV data found for ${ticker}`);
  }

  // Yahoo returns: timestamps[], indicators.quote[0].{open[], high[], low[], close[], volume[]}
  const result = timestamps.map((ts, i) => ({
    date: new Date(ts * 1000).toISOString().split('T')[0],
    open: quote.open[i],
    high: quote.high[i],
    low: quote.low[i],
    close: quote.close[i],
    volume: quote.volume[i],
  })).filter(d => d.close !== null).reverse(); // newest first, filter out null entries

  setCache(cacheKey, result);
  logInfo('stockService', 'getGlobalDailyHistory completed', { ticker, points: result.length });
  return result;
}

/**
 * Fetch company overview for a global stock via Finnhub
 * Endpoint: /stock/profile2?symbol=AAPL
 * Response: { name, ticker, exchange, finnhubIndustry, marketCapitalization, ... }
 */
export async function getCompanyOverview(ticker) {
  logInfo('stockService', 'getCompanyOverview started', { ticker });
  const cacheKey = `geostock_overview_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${FINNHUB_BASE}/stock/profile2`, {
    params: {
      symbol: ticker,
      token: FINNHUB_KEY,
    },
  });

  if (!data || !data.name) {
    return null; // Overview not available for all tickers
  }

  const result = {
    name: data.name,
    sector: data.finnhubIndustry || 'Unknown',
    industry: data.finnhubIndustry || 'Unknown',
    marketCap: data.marketCapitalization
      ? `${(data.marketCapitalization / 1000).toFixed(1)}B`  // Finnhub returns in millions
      : 'N/A',
    exchange: data.exchange || 'Unknown',
    description: '', // Finnhub profile2 doesn't include description
    logo: data.logo || '',
    weburl: data.weburl || '',
    country: data.country || '',
    ipo: data.ipo || '',
  };

  setCache(cacheKey, result);
  logInfo('stockService', 'getCompanyOverview completed', { ticker, hasData: Boolean(result) });
  return result;
}

// ===== PSX Terminal API =====

/**
 * Fetch current tick data for a PSX stock
 */
export async function getPSXQuote(ticker) {
  logInfo('stockService', 'getPSXQuote started', { ticker });
  const cacheKey = `geostock_psx_quote_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${PSX_TERMINAL_BASE}/ticks/REG/${ticker}`);
    if (!data.success || !data.data) {
      throw new Error('PSX API returned unsuccessful response');
    }

    const t = data.data;
    const result = {
      price: t.price,
      change: t.change,
      changePercent: t.changePercent * 100, // API returns decimal (0.019 = 1.9%)
      high: t.high,
      low: t.low,
      volume: t.volume,
      previousClose: t.price - t.change,
    };

    setCache(cacheKey, result);
    logInfo('stockService', 'getPSXQuote completed', { ticker });
    return result;
  } catch (err) {
    logWarn('stockService', 'PSX Terminal API error', err.message);
    throw err;
  }
}

/**
 * Fetch candlestick history for a PSX stock (30 daily candles)
 */
export async function getPSXDailyHistory(ticker) {
  logInfo('stockService', 'getPSXDailyHistory started', { ticker });
  const cacheKey = `geostock_psx_history_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${PSX_TERMINAL_BASE}/klines/${ticker}/1d`, {
      params: { limit: 30 },
    });

    if (!data.success || !data.data) {
      throw new Error('PSX kline API returned unsuccessful response');
    }

    const result = data.data.map(candle => ({
      date: new Date(candle.timestamp).toISOString().split('T')[0],
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
    })).reverse(); // newest first

    setCache(cacheKey, result);
    logInfo('stockService', 'getPSXDailyHistory completed', { ticker, points: result.length });
    return result;
  } catch (err) {
    logWarn('stockService', 'PSX kline API error', err.message);
    throw err;
  }
}

/**
 * Fetch company fundamentals for a PSX stock
 */
export async function getPSXFundamentals(ticker) {
  logInfo('stockService', 'getPSXFundamentals started', { ticker });
  const cacheKey = `geostock_psx_fundamentals_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const [fundResponse, companyResponse] = await Promise.all([
      axios.get(`${PSX_TERMINAL_BASE}/fundamentals/${ticker}`).catch(() => null),
      axios.get(`${PSX_TERMINAL_BASE}/companies/${ticker}`).catch(() => null),
    ]);

    const fund = fundResponse?.data?.data || {};
    const company = companyResponse?.data?.data || {};

    const result = {
      name: company.symbol || ticker,
      sector: fund.sector || 'Unknown',
      marketCap: fund.marketCap || 'N/A',
      exchange: 'PSX',
      description: company.businessDescription || '',
      peRatio: fund.peRatio,
      dividendYield: fund.dividendYield,
      listedIn: fund.listedIn || '',
    };

    setCache(cacheKey, result);
    logInfo('stockService', 'getPSXFundamentals completed', { ticker });
    return result;
  } catch (err) {
    logWarn('stockService', 'PSX fundamentals error', err.message);
    return null;
  }
}

/**
 * Fetch KSE-100 index data
 */
export async function getKSE100() {
  logInfo('stockService', 'getKSE100 started');
  const cacheKey = 'geostock_kse100';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${PSX_TERMINAL_BASE}/ticks/IDX/KSE100`);
    if (data.success && data.data) {
      const result = {
        value: data.data.price,
        change: data.data.change,
        changePercent: data.data.changePercent * 100,
      };
      setCache(cacheKey, result);
      logInfo('stockService', 'getKSE100 completed');
      return result;
    }
  } catch {
    // silently fail
  }
  return null;
}
