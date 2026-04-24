import { useState, useEffect, useCallback, useRef } from 'react';
import { runFullAnalysis, runTimeframeAnalysis } from '../services/analysisOrchestrator';
import { formatNewsForPrompt } from '../utils/newsFormatter';

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
        setAnalysis(result);
      }
    } catch (err) {
      if (!thisRequest.aborted) {
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
    } catch (err) {
      console.error('Timeframe change failed:', err);
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
