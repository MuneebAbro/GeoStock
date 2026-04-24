import { detectMarket } from '../utils/marketDetector';
import { formatNewsForPrompt, formatPriceHistory, mergeNewsSources } from '../utils/newsFormatter';
import { calculate7DayChange } from '../utils/scoreCalculator';
import {
  getGlobalQuote, getGlobalDailyHistory, getCompanyOverview,
  getPSXQuote, getPSXDailyHistory, getPSXFundamentals, getKSE100,
} from './stockService';
import { fetchAllNews } from './newsService';
import {
  generatePotentialScore,
  generateBullBearDebate,
  generateGeopoliticalReport,
  generateSectorRipple,
} from './groqService';
import { moduleLoaded, logError, logInfo } from '../utils/logger';

moduleLoaded('analysisOrchestrator');

/**
 * Run the full analysis pipeline for a given ticker
 * @param {string} ticker - Stock ticker symbol
 * @param {string} timeframe - '1 day', '1 week', or '1 month'
 * @returns {Object} Complete analysis result
 */
export async function runFullAnalysis(ticker, timeframe = '1 week') {
  logInfo('analysisOrchestrator', 'full analysis started', { ticker, timeframe });
  const market = detectMarket(ticker);
  const { isPSX, companyName, sector, exchange } = market;

  // Step 1: Fetch stock data + news in parallel
  let quote, history, overview, news, kse100;

  try {
    if (isPSX) {
      [quote, history, overview, news, kse100] = await Promise.all([
        getPSXQuote(ticker),
        getPSXDailyHistory(ticker),
        getPSXFundamentals(ticker),
        fetchAllNews(ticker, companyName, sector, true),
        getKSE100(),
      ]);
    } else {
      [quote, history, overview, news] = await Promise.all([
        getGlobalQuote(ticker),
        getGlobalDailyHistory(ticker),
        getCompanyOverview(ticker),
        fetchAllNews(ticker, companyName, sector, false),
      ]);
    }
  } catch (err) {
    logError('analysisOrchestrator', 'data fetching failed', err);
    throw new Error(`Failed to fetch data for ${ticker}. ${err.message}`);
  }

  // Step 2: Prepare data for AI prompts
  const resolvedName = overview?.name || companyName;
  const resolvedSector = overview?.sector || sector;
  const changePercent = quote?.changePercent || calculate7DayChange(history || []);

  const stockData = {
    ticker,
    companyName: resolvedName,
    sector: resolvedSector,
    exchange: isPSX ? 'PSX' : (overview?.exchange || exchange),
    price: quote?.price || 0,
    changePercent,
    priceHistory: formatPriceHistory(history || []),
    isPSX,
  };

  const newsFormatted = formatNewsForPrompt(news || []);

  // Step 3: Run Groq calls sequentially to avoid rate limits
  // (Groq free tier has strict TPM limits — parallel calls cause "Failed to fetch")
  let potentialScore, debate, geoReport, sectorRipple;
  try {
    potentialScore = await generatePotentialScore(stockData, newsFormatted, timeframe);
    debate = await generateBullBearDebate(stockData, newsFormatted, timeframe, potentialScore?.potential_score || 50);
    geoReport = await generateGeopoliticalReport(stockData, newsFormatted);
    sectorRipple = await generateSectorRipple(stockData, resolvedSector);
  } catch (err) {
    logError('analysisOrchestrator', 'ai analysis failed', err);
    throw new Error('AI analysis failed. Please try again.');
  }

  logInfo('analysisOrchestrator', 'full analysis completed', { ticker, timeframe });
  return {
    market,
    quote,
    history: history || [],
    overview: {
      name: resolvedName,
      sector: resolvedSector,
      marketCap: overview?.marketCap || 'N/A',
      exchange: isPSX ? 'PSX' : (overview?.exchange || exchange),
      description: overview?.description || '',
    },
    news: news || [],
    potentialScore,
    debate,
    geoReport,
    sectorRipple,
    kse100: kse100 || null,
    timeframe,
  };
}

/**
 * Re-run only the potential score for a different timeframe
 * Reuses existing data to avoid hitting API limits
 */
export async function runTimeframeAnalysis(stockData, newsFormatted, timeframe) {
  logInfo('analysisOrchestrator', 'timeframe-only analysis started', { ticker: stockData?.ticker, timeframe });
  return generatePotentialScore(stockData, newsFormatted, timeframe);
}
