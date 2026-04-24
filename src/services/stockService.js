import axios from 'axios';

const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';
const PSX_TERMINAL_BASE = 'https://psxterminal.com/api';
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
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

// ===== Alpha Vantage (Global Stocks) =====

/**
 * Fetch current quote for a global stock
 */
export async function getGlobalQuote(ticker) {
  const cacheKey = `geostock_quote_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(ALPHA_VANTAGE_BASE, {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol: ticker,
      apikey: API_KEY,
    },
  });

  const q = data['Global Quote'];
  if (!q || !q['05. price']) {
    throw new Error(`No quote data found for ${ticker}`);
  }

  const result = {
    price: parseFloat(q['05. price']),
    change: parseFloat(q['09. change']),
    changePercent: parseFloat(q['10. change percent']?.replace('%', '')),
    high: parseFloat(q['03. high']),
    low: parseFloat(q['04. low']),
    volume: parseInt(q['06. volume']),
    previousClose: parseFloat(q['08. previous close']),
  };

  setCache(cacheKey, result);
  return result;
}

/**
 * Fetch 30-day daily price history for a global stock
 */
export async function getGlobalDailyHistory(ticker) {
  const cacheKey = `geostock_history_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(ALPHA_VANTAGE_BASE, {
    params: {
      function: 'TIME_SERIES_DAILY',
      symbol: ticker,
      outputsize: 'compact',
      apikey: API_KEY,
    },
  });

  const timeSeries = data['Time Series (Daily)'];
  if (!timeSeries) {
    throw new Error(`No historical data found for ${ticker}`);
  }

  const result = Object.entries(timeSeries)
    .slice(0, 30)
    .map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));

  setCache(cacheKey, result);
  return result;
}

/**
 * Fetch company overview for a global stock
 */
export async function getCompanyOverview(ticker) {
  const cacheKey = `geostock_overview_${ticker}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(ALPHA_VANTAGE_BASE, {
    params: {
      function: 'OVERVIEW',
      symbol: ticker,
      apikey: API_KEY,
    },
  });

  if (!data || !data.Symbol) {
    return null; // Overview not available for all tickers
  }

  const result = {
    name: data.Name,
    sector: data.Sector,
    industry: data.Industry,
    marketCap: data.MarketCapitalization,
    exchange: data.Exchange,
    description: data.Description,
    peRatio: data.PERatio,
    dividendYield: data.DividendYield,
    '52WeekHigh': data['52WeekHigh'],
    '52WeekLow': data['52WeekLow'],
  };

  setCache(cacheKey, result);
  return result;
}

// ===== PSX Terminal API =====

/**
 * Fetch current tick data for a PSX stock
 */
export async function getPSXQuote(ticker) {
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
    return result;
  } catch (err) {
    console.warn('PSX Terminal API error:', err.message);
    throw err;
  }
}

/**
 * Fetch candlestick history for a PSX stock (30 daily candles)
 */
export async function getPSXDailyHistory(ticker) {
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
    return result;
  } catch (err) {
    console.warn('PSX kline API error:', err.message);
    throw err;
  }
}

/**
 * Fetch company fundamentals for a PSX stock
 */
export async function getPSXFundamentals(ticker) {
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
    return result;
  } catch (err) {
    console.warn('PSX fundamentals error:', err.message);
    return null;
  }
}

/**
 * Fetch KSE-100 index data
 */
export async function getKSE100() {
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
      return result;
    }
  } catch {
    // silently fail
  }
  return null;
}
