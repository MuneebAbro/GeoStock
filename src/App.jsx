import React, { useState, useCallback } from 'react';
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
import { useAnalysis } from './hooks/useAnalysis';
import { moduleLoaded, logInfo } from './utils/logger';

moduleLoaded('App');

function LandingHero() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ textAlign: 'center', padding: '80px 20px 40px', maxWidth: '600px', margin: '0 auto' }}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800,
          marginBottom: '8px', letterSpacing: '-1px',
          background: 'linear-gradient(135deg, var(--color-accent), #448AFF)', WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent' }}>GeoStock</h1>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--color-text-muted)',
          letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '32px' }}>
          Geopolitical AI Stock Analysis
        </p>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '450px',
        margin: '0 auto 40px' }}>
        {[
          { icon: '🎯', title: 'Potential Meter', desc: 'AI-powered upside probability' },
          { icon: '⚔️', title: 'Bull vs Bear', desc: 'Debate with AI verdict' },
          { icon: '🌍', title: 'Geo Impact', desc: 'World events analysis' },
          { icon: '🔗', title: 'Sector Ripple', desc: 'Related stocks affected' },
        ].map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)',
              borderRadius: '10px', padding: '16px', textAlign: 'left' }}>
            <span style={{ fontSize: '20px' }}>{f.icon}</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700,
              color: 'var(--color-text-primary)', marginTop: '8px' }}>{f.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{f.desc}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['NVDA', 'AAPL', 'TSLA', 'OGDC', 'HBL', 'MSFT'].map(t => (
          <span key={t} style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--color-text-muted)',
            background: 'var(--color-bg-surface)', padding: '4px 10px', borderRadius: '6px',
            border: '1px solid var(--color-border)' }}>
            {t}
          </span>
        ))}
      </div>
      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '16px', fontFamily: 'var(--font-display)' }}>
        Search any ticker above to begin analysis
      </p>
    </motion.div>
  );
}

function ErrorDisplay({ error, onRetry }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto', padding: '30px' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
          Analysis Error
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
          {error}
        </p>
        <button onClick={onRetry}
          style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600,
            background: 'var(--color-accent)', color: 'var(--color-bg-primary)', border: 'none',
            padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', letterSpacing: '0.5px' }}>
          Try Again
        </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  const { analysis, loading, error, timeframeLoading, analyze, changeTimeframe } = useAnalysis();
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

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '16px 20px',
        background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800,
                background: 'linear-gradient(135deg, var(--color-accent), #448AFF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                GeoStock
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px',
              color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Geopolitical AI Analysis
            </span>
          </div>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        <AnimatePresence mode="wait">
          {!currentTicker && !loading && (
            <LandingHero key="landing" />
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            <ErrorDisplay key="error" error={error} onRetry={() => analyze(currentTicker)} />
          )}

          {analysis && !loading && (
            <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Stock Header */}
              <StockHeader quote={analysis.quote} overview={analysis.overview}
                market={analysis.market} kse100={analysis.kse100} />

              {/* Meter + Chart Row */}
              <div className="grid-meter-chart">
                <PotentialMeter potentialScore={analysis.potentialScore}
                  timeframe={analysis.timeframe} timeframeLoading={timeframeLoading}
                  onTimeframeChange={changeTimeframe} />
                <PriceChart history={analysis.history} isPSX={analysis.market.isPSX} />
              </div>

              {/* Bull vs Bear Debate */}
              <BullBearDebate debate={analysis.debate} />

              {/* Geopolitical Report */}
              <GeopoliticalReport geoReport={analysis.geoReport} />

              {/* Sector Ripple */}
              <SectorRipple sectorRipple={analysis.sectorRipple} onStockSelect={handleRippleSelect} />

              {/* Footer */}
              <div style={{ textAlign: 'center', padding: '20px', fontSize: '11px',
                color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>
                GeoStock — AI-Powered Geopolitical Stock Analysis • Not Financial Advice
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
