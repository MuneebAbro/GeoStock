import { moduleLoaded, logInfo } from './logger';

moduleLoaded('marketDetector');

// Top 50 PSX tickers with company names and sectors
const PSX_TICKERS = {
  OGDC: { name: 'Oil & Gas Development Company', sector: 'Oil & Gas' },
  HBL: { name: 'Habib Bank Limited', sector: 'Banking' },
  LUCK: { name: 'Lucky Cement', sector: 'Cement' },
  ENGRO: { name: 'Engro Corporation', sector: 'Chemicals' },
  PPL: { name: 'Pakistan Petroleum Limited', sector: 'Oil & Gas' },
  MCB: { name: 'MCB Bank Limited', sector: 'Banking' },
  FFC: { name: 'Fauji Fertilizer Company', sector: 'Fertilizer' },
  PSO: { name: 'Pakistan State Oil', sector: 'Oil & Gas' },
  UBL: { name: 'United Bank Limited', sector: 'Banking' },
  HUBC: { name: 'Hub Power Company', sector: 'Power Generation' },
  MARI: { name: 'Mari Petroleum Company', sector: 'Oil & Gas' },
  POL: { name: 'Pakistan Oilfields Limited', sector: 'Oil & Gas' },
  EFERT: { name: 'Engro Fertilizers', sector: 'Fertilizer' },
  BAHL: { name: 'Bank Al Habib', sector: 'Banking' },
  MEBL: { name: 'Meezan Bank Limited', sector: 'Banking' },
  SYS: { name: 'Systems Limited', sector: 'Technology' },
  TRG: { name: 'TRG Pakistan', sector: 'Technology' },
  BAFL: { name: 'Bank Alfalah Limited', sector: 'Banking' },
  DGKC: { name: 'DG Khan Cement', sector: 'Cement' },
  NML: { name: 'Nishat Mills Limited', sector: 'Textile' },
  MLCF: { name: 'Maple Leaf Cement', sector: 'Cement' },
  KAPCO: { name: 'Kot Addu Power Company', sector: 'Power Generation' },
  KEL: { name: 'K-Electric Limited', sector: 'Power Generation' },
  ABL: { name: 'Allied Bank Limited', sector: 'Banking' },
  FCCL: { name: 'Fauji Cement Company', sector: 'Cement' },
  PIOC: { name: 'Pioneer Cement', sector: 'Cement' },
  ABOT: { name: 'Abbott Laboratories Pakistan', sector: 'Pharmaceuticals' },
  SEARL: { name: 'The Searle Company', sector: 'Pharmaceuticals' },
  COLG: { name: 'Colgate Palmolive Pakistan', sector: 'Consumer' },
  NESTLE: { name: 'Nestle Pakistan', sector: 'Consumer' },
  ISL: { name: 'Islamabad Stock Exchange', sector: 'Financial Services' },
  ATRL: { name: 'Attock Refinery Limited', sector: 'Oil & Gas' },
  NRL: { name: 'National Refinery Limited', sector: 'Oil & Gas' },
  CHCC: { name: 'Cherat Cement', sector: 'Cement' },
  KOHC: { name: 'Kohat Cement', sector: 'Cement' },
  PAEL: { name: 'Pak Elektron', sector: 'Electronics' },
  MUGHAL: { name: 'Mughal Iron & Steel', sector: 'Steel' },
  ASC: { name: 'Askari Cement', sector: 'Cement' },
  ACPL: { name: 'Attock Cement', sector: 'Cement' },
  GWLC: { name: 'Gul Ahmed Textile', sector: 'Textile' },
  ILP: { name: 'Interloop Limited', sector: 'Textile' },
  MTL: { name: 'Millat Tractors', sector: 'Automobile' },
  HCAR: { name: 'Honda Atlas Cars', sector: 'Automobile' },
  PSMC: { name: 'Pak Suzuki Motor', sector: 'Automobile' },
  INDU: { name: 'Indus Motor Company', sector: 'Automobile' },
  ASTL: { name: 'Amreli Steels', sector: 'Steel' },
  UNITY: { name: 'Unity Foods Limited', sector: 'Food' },
  AIRLINK: { name: 'Air Link Communication', sector: 'Technology' },
  AVN: { name: 'Avanceon Limited', sector: 'Technology' },
  LOTCHEM: { name: 'Lotte Chemical Pakistan', sector: 'Chemicals' },
};

// Well-known global tickers for autocomplete
const POPULAR_GLOBAL_TICKERS = {
  NVDA: { name: 'NVIDIA Corporation', sector: 'Semiconductors', exchange: 'NASDAQ' },
  AAPL: { name: 'Apple Inc.', sector: 'Technology', exchange: 'NASDAQ' },
  TSLA: { name: 'Tesla Inc.', sector: 'Automobiles', exchange: 'NASDAQ' },
  MSFT: { name: 'Microsoft Corporation', sector: 'Technology', exchange: 'NASDAQ' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', exchange: 'NASDAQ' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'E-Commerce', exchange: 'NASDAQ' },
  META: { name: 'Meta Platforms Inc.', sector: 'Technology', exchange: 'NASDAQ' },
  AMD: { name: 'Advanced Micro Devices', sector: 'Semiconductors', exchange: 'NASDAQ' },
  INTC: { name: 'Intel Corporation', sector: 'Semiconductors', exchange: 'NASDAQ' },
  AVGO: { name: 'Broadcom Inc.', sector: 'Semiconductors', exchange: 'NASDAQ' },
  TSM: { name: 'Taiwan Semiconductor', sector: 'Semiconductors', exchange: 'NYSE' },
  QCOM: { name: 'Qualcomm Inc.', sector: 'Semiconductors', exchange: 'NASDAQ' },
  NFLX: { name: 'Netflix Inc.', sector: 'Entertainment', exchange: 'NASDAQ' },
  JPM: { name: 'JPMorgan Chase', sector: 'Banking', exchange: 'NYSE' },
  V: { name: 'Visa Inc.', sector: 'Financial Services', exchange: 'NYSE' },
  MA: { name: 'Mastercard Inc.', sector: 'Financial Services', exchange: 'NYSE' },
  BAC: { name: 'Bank of America', sector: 'Banking', exchange: 'NYSE' },
  WMT: { name: 'Walmart Inc.', sector: 'Retail', exchange: 'NYSE' },
  DIS: { name: 'Walt Disney Company', sector: 'Entertainment', exchange: 'NYSE' },
  PYPL: { name: 'PayPal Holdings', sector: 'FinTech', exchange: 'NASDAQ' },
  CRM: { name: 'Salesforce Inc.', sector: 'Cloud Computing', exchange: 'NYSE' },
  BA: { name: 'Boeing Company', sector: 'Aerospace', exchange: 'NYSE' },
  XOM: { name: 'Exxon Mobil', sector: 'Oil & Gas', exchange: 'NYSE' },
  CVX: { name: 'Chevron Corporation', sector: 'Oil & Gas', exchange: 'NYSE' },
  PFE: { name: 'Pfizer Inc.', sector: 'Pharmaceuticals', exchange: 'NYSE' },
  UNH: { name: 'UnitedHealth Group', sector: 'Healthcare', exchange: 'NYSE' },
  KO: { name: 'Coca-Cola Company', sector: 'Beverages', exchange: 'NYSE' },
  PEP: { name: 'PepsiCo Inc.', sector: 'Beverages', exchange: 'NASDAQ' },
  COST: { name: 'Costco Wholesale', sector: 'Retail', exchange: 'NASDAQ' },
  LMT: { name: 'Lockheed Martin', sector: 'Defense', exchange: 'NYSE' },
};

/**
 * Detect which market a ticker belongs to
 * @param {string} ticker - Stock ticker symbol
 * @returns {{ exchange: string, isPSX: boolean, companyName: string, sector: string }}
 */
export function detectMarket(ticker) {
  const normalized = ticker.toUpperCase().trim();
  logInfo('marketDetector', 'detectMarket called', { ticker: normalized });

  if (PSX_TICKERS[normalized]) {
    return {
      exchange: 'PSX',
      isPSX: true,
      companyName: PSX_TICKERS[normalized].name,
      sector: PSX_TICKERS[normalized].sector,
      ticker: normalized,
    };
  }

  if (POPULAR_GLOBAL_TICKERS[normalized]) {
    return {
      exchange: POPULAR_GLOBAL_TICKERS[normalized].exchange,
      isPSX: false,
      companyName: POPULAR_GLOBAL_TICKERS[normalized].name,
      sector: POPULAR_GLOBAL_TICKERS[normalized].sector,
      ticker: normalized,
    };
  }

  // Default: assume NASDAQ for unknown tickers
  return {
    exchange: 'NASDAQ',
    isPSX: false,
    companyName: normalized,
    sector: 'Unknown',
    ticker: normalized,
  };
}

/**
 * Search tickers by partial match
 * @param {string} query - Search query
 * @returns {Array} Matching tickers with metadata
 */
export function searchTickers(query) {
  if (!query || query.length < 1) return [];
  logInfo('marketDetector', 'searchTickers called', { query });
  const q = query.toUpperCase().trim();
  const results = [];

  // Search PSX tickers
  for (const [ticker, data] of Object.entries(PSX_TICKERS)) {
    if (ticker.startsWith(q) || data.name.toUpperCase().includes(q)) {
      results.push({ ticker, ...data, exchange: 'PSX', isPSX: true });
    }
  }

  // Search global tickers
  for (const [ticker, data] of Object.entries(POPULAR_GLOBAL_TICKERS)) {
    if (ticker.startsWith(q) || data.name.toUpperCase().includes(q)) {
      results.push({ ticker, ...data, isPSX: false });
    }
  }

  return results.slice(0, 8);
}

export { PSX_TICKERS, POPULAR_GLOBAL_TICKERS };
