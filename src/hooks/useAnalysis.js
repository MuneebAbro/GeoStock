import { useState, useEffect, useCallback, useRef } from 'react';
import { runFullAnalysis, runTimeframeAnalysis } from '../services/analysisOrchestrator';
import { formatNewsForPrompt } from '../utils/newsFormatter';
import { moduleLoaded, logError, logInfo } from '../utils/logger';

moduleLoaded('useAnalysis');

/**
 * Main hook that orchestrates the entire analysis flow
 */
export function useAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeframeLoading, setTimeframeLoading] = useState(false);
  const abortRef = useRef(null);

  const analyze = useCallback(async (ticker, timeframe = '1 week') => {
    if (!ticker) return;
    logInfo('useAnalysis', 'analysis started', { ticker, timeframe });

    // Abort previous analysis
    if (abortRef.current) {
      abortRef.current.aborted = true;
    }
    const thisRequest = { aborted: false };
    abortRef.current = thisRequest;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await runFullAnalysis(ticker, timeframe);
      if (!thisRequest.aborted) {
        logInfo('useAnalysis', 'analysis completed', { ticker, timeframe });
        setAnalysis(result);
      }
    } catch (err) {
      if (!thisRequest.aborted) {
        logError('useAnalysis', 'analysis failed', err);
        setError(err.message || 'Analysis failed');
      }
    } finally {
      if (!thisRequest.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const changeTimeframe = useCallback(async (timeframe) => {
    if (!analysis) return;
    logInfo('useAnalysis', 'timeframe change started', { timeframe, ticker: analysis.market?.ticker });

    setTimeframeLoading(true);
    try {
      const stockData = {
        ticker: analysis.market.ticker,
        companyName: analysis.overview.name,
        sector: analysis.overview.sector,
        exchange: analysis.overview.exchange,
        price: analysis.quote?.price || 0,
        changePercent: analysis.quote?.changePercent || 0,
        priceHistory: '',
        isPSX: analysis.market.isPSX,
      };
      const newsFormatted = formatNewsForPrompt(analysis.news);
      const newScore = await runTimeframeAnalysis(stockData, newsFormatted, timeframe);

      setAnalysis(prev => ({
        ...prev,
        potentialScore: newScore,
        timeframe,
      }));
      logInfo('useAnalysis', 'timeframe change completed', { timeframe });
    } catch (err) {
      logError('useAnalysis', 'timeframe change failed', err);
    } finally {
      setTimeframeLoading(false);
    }
  }, [analysis]);

  return {
    analysis,
    loading,
    error,
    timeframeLoading,
    analyze,
    changeTimeframe,
  };
}
