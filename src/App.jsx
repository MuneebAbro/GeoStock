import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import StockHeader from './components/StockHeader';
import PotentialMeter from './components/PotentialMeter';
import BullBearDebate from './components/BullBearDebate';
import GeopoliticalReport from './components/GeopoliticalReport';
import PriceChart from './components/PriceChart';
import SectorRipple from './components/SectorRipple';
import { StockHeaderSkeleton, MeterSkeleton, DebateSkeleton } from './components/SkeletonLoader';
import SkeletonLoader from './components/SkeletonLoader';
import LandingPage from './components/landing/LandingPage';
import StockChatbot from './components/StockChatbot';
import { useAnalysis } from './hooks/useAnalysis';
import { moduleLoaded, logInfo } from './utils/logger';

moduleLoaded('App');

// ── SVG Hexagon Logo ──────────────────────────────────────────────────────────
function HexIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
        stroke="#6366F1" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(99,102,241,0.08)" />
      <path d="M12 7L16 9.5V14.5L12 17L8 14.5V9.5L12 7Z"
        fill="#6366F1" opacity="0.6" />
    </svg>
  );
}

// ── Live UTC Clock ────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(() => new Date().toUTCString().slice(17, 25));
  useEffect(() => {
    const iv = setInterval(() => {
      setTime(new Date().toUTCString().slice(17, 25));
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>
      {time} UTC
    </span>
  );
}

// ── Market Status Badge ───────────────────────────────────────────────────────
function MarketBadge() {
  const isOpen = (() => {
    const now = new Date();
    const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = est.getDay();
    const h = est.getHours();
    const m = est.getMinutes();
    const mins = h * 60 + m;
    return day >= 1 && day <= 5 && mins >= 570 && mins < 960; // 9:30–16:00 ET
  })();

  return (
    <span style={{
      fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700,
      letterSpacing: '1.5px', padding: '3px 8px', border: '1px solid',
      borderRadius: '0',
      background: isOpen ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
      color: isOpen ? '#10B981' : '#EF4444',
      borderColor: isOpen ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
    }}>
      MARKET {isOpen ? 'OPEN' : 'CLOSED'}
    </span>
  );
}

// ── Ticker Marquee Strip ──────────────────────────────────────────────────────
const TICKER_DATA = [
  { sym: 'SPY', val: '519.42', chg: '+0.84%', up: true },
  { sym: 'QQQ', val: '441.17', chg: '+1.12%', up: true },
  { sym: 'NVDA', val: '124.56', chg: '+2.31%', up: true },
  { sym: 'AAPL', val: '189.30', chg: '-0.43%', up: false },
  { sym: 'TSLA', val: '174.92', chg: '+3.07%', up: true },
  { sym: 'MSFT', val: '408.11', chg: '+0.55%', up: true },
  { sym: 'AMZN', val: '182.45', chg: '-0.22%', up: false },
  { sym: 'GOOGL', val: '172.88', chg: '+0.91%', up: true },
  { sym: 'META', val: '512.67', chg: '+1.44%', up: true },
  { sym: 'OGDC', val: 'PKR 188', chg: '+1.20%', up: true },
  { sym: 'HBL', val: 'PKR 215', chg: '-0.65%', up: false },
  { sym: 'GOLD', val: '2341.50', chg: '+0.38%', up: true },
  { sym: 'BTC', val: '67,200', chg: '+2.14%', up: true },
];

function TickerStrip() {
  const items = [...TICKER_DATA, ...TICKER_DATA]; // doubled for seamless loop
  return (
    <div className="ticker-strip">
      <div className="ticker-strip-inner">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            <span style={{ color: 'var(--color-text-muted)', fontSize: '9px' }}>LIVE</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{t.sym}</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>{t.val}</span>
            <span style={{ color: t.up ? 'var(--color-bullish)' : 'var(--color-bearish)', fontWeight: 600 }}>
              {t.chg}
            </span>
            <span className="ticker-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Error Display ─────────────────────────────────────────────────────────────
function ErrorDisplay({ error, onRetry }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '420px', margin: '0 auto', padding: '32px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px',
          color: 'var(--color-bearish)', marginBottom: '12px', textTransform: 'uppercase',
        }}>
          [!] ANALYSIS ERROR
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          Connection Interrupted
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
          {error}
        </p>
        <button onClick={onRetry}
          style={{
            fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600,
            background: 'var(--color-accent)', color: '#fff', border: 'none',
            padding: '10px 24px', borderRadius: '0', cursor: 'pointer',
            letterSpacing: '1.5px', textTransform: 'uppercase',
          }}>
          RETRY
        </button>
      </div>
    </motion.div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { analysis, loading, error, timeframeLoading, analyze, changeTimeframe, reset } = useAnalysis();
  const [currentTicker, setCurrentTicker] = useState('');

  const handleSearch = useCallback((ticker) => {
    logInfo('App', 'search triggered', { ticker });
    setCurrentTicker(ticker);
    analyze(ticker);
  }, [analyze]);

  const handleRippleSelect = useCallback((ticker) => {
    logInfo('App', 'ripple stock selected', { ticker });
    setCurrentTicker(ticker);
    analyze(ticker);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [analyze]);

  const handleSearchFocus = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) input.focus();
    }, 400);
  }, []);

  const showLanding = !currentTicker && !loading;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(5,5,10,0.78)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderBottom: '1px solid rgba(99,102,241,0.14)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(99,102,241,0.07)',
      }}>
        <div style={{ padding: '10px 24px' }}>
          <div style={{
            maxWidth: '1280px', margin: '0 auto', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '20px',
          }}>

            {/* ── Logo ── */}
            <div
              onClick={() => { reset(); setCurrentTicker(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0, userSelect: 'none' }}
            >
              <HexIcon />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                  fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800,
                  letterSpacing: '2px', textTransform: 'uppercase',
                  background: 'linear-gradient(135deg, #F1F1F8, #818CF8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  GeoStock
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '7px',
                  letterSpacing: '2.5px', color: 'var(--color-text-muted)',
                  textTransform: 'uppercase', marginTop: '1px',
                }}>
                  GEO·INTEL
                </span>
              </div>
            </div>

            {/* ── Live dot ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
              <span className="live-dot" />
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '8px',
                color: 'var(--color-accent)', letterSpacing: '2px', textTransform: 'uppercase',
              }}>
                LIVE
              </span>
            </div>

            {/* ── Search (dominant centre) ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>

            {/* ── Right cluster ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <LiveClock />
              <MarketBadge />
            </div>

          </div>
        </div>
      </header>


      {/* ── Ticker Strip ── */}
      <TickerStrip />

      {/* ── Main Content ── */}
      <AnimatePresence mode="wait">
        {showLanding && (
          <LandingPage key="landing" onSearchFocus={handleSearchFocus} onStockSearch={handleSearch} />
        )}

        {(loading || error || analysis) && (
          <main key="analysis-main" style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <StockHeaderSkeleton />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                  <MeterSkeleton />
                  <div className="card" style={{ padding: '24px' }}>
                    <SkeletonLoader type="title" width="120px" />
                    <div style={{ marginTop: '16px' }}>
                      <SkeletonLoader type="chart" height="260px" />
                    </div>
                  </div>
                </div>
                <DebateSkeleton />
                <div className="card" style={{ padding: '24px' }}>
                  <SkeletonLoader type="title" width="200px" />
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ marginTop: '12px' }}>
                      <SkeletonLoader type="text" width={`${80 - i * 10}%`} height="14px" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {error && !loading && (
              <ErrorDisplay error={error} onRetry={() => analyze(currentTicker)} />
            )}

            {analysis && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <StockHeader quote={analysis.quote} overview={analysis.overview}
                  market={analysis.market} kse100={analysis.kse100} />
                <div className="grid-meter-chart">
                  <PotentialMeter potentialScore={analysis.potentialScore}
                    timeframe={analysis.timeframe} timeframeLoading={timeframeLoading}
                    onTimeframeChange={changeTimeframe} />
                  <PriceChart history={analysis.history} isPSX={analysis.market.isPSX} />
                </div>
                <BullBearDebate debate={analysis.debate} />
                <GeopoliticalReport geoReport={analysis.geoReport} />
                <SectorRipple sectorRipple={analysis.sectorRipple} onStockSelect={handleRippleSelect} />
                <div style={{
                  textAlign: 'center', padding: '20px',
                  fontSize: '10px', color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-display)', letterSpacing: '1px',
                  borderTop: '1px solid var(--color-border)',
                }}>
                  GEOSTOCK — AI-POWERED GEOPOLITICAL STOCK ANALYSIS &nbsp;·&nbsp; NOT FINANCIAL ADVICE
                </div>
              </motion.div>
            )}
          </main>
        )}
      </AnimatePresence>

      {/* ── AI Chatbot ── */}
      {analysis && !loading && (
        <StockChatbot analysis={analysis} ticker={currentTicker} />
      )}
    </div>
  );
}
