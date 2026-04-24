import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ── Lightweight animated orbs (CSS only, GPU-accelerated) ── */
function BackgroundOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Large indigo orb */}
      <div style={{
        position: 'absolute', top: '-20%', left: '20%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'float-orb 12s ease-in-out infinite',
        willChange: 'transform',
      }} />
      {/* Amber orb */}
      <div style={{
        position: 'absolute', bottom: '0%', right: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'float-orb 16s ease-in-out infinite reverse',
        willChange: 'transform',
      }} />
      {/* Small bright accent */}
      <div style={{
        position: 'absolute', top: '40%', right: '30%',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)',
        filter: 'blur(30px)',
        animation: 'float-orb 9s ease-in-out infinite 2s',
        willChange: 'transform',
      }} />
      <style>{`
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33%       { transform: translateY(-30px) translateX(15px); }
          66%       { transform: translateY(15px) translateX(-20px); }
        }
      `}</style>
    </div>
  );
}

/* ── Animated global market nodes ── */
function MarketNodes() {
  const nodes = [
    { x: '8%',  y: '35%', city: 'NEW YORK',  color: '#818CF8', delay: 0 },
    { x: '38%', y: '22%', city: 'LONDON',    color: '#818CF8', delay: 0.5 },
    { x: '56%', y: '30%', city: 'DUBAI',     color: '#FCD34D', delay: 1.0 },
    { x: '65%', y: '38%', city: 'MUMBAI',    color: '#FCD34D', delay: 1.5 },
    { x: '84%', y: '28%', city: 'TOKYO',     color: '#818CF8', delay: 2.0 },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '80px', marginTop: '24px' }}>
      {/* Connection line */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(99,102,241,0)" />
            <stop offset="20%" stopColor="rgba(99,102,241,0.3)" />
            <stop offset="80%" stopColor="rgba(245,158,11,0.3)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0)" />
          </linearGradient>
        </defs>
        <line x1="8%" y1="50%" x2="92%" y2="50%"
          stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="6 4" />
      </svg>

      {nodes.map((n, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: n.delay + 0.8, duration: 0.4, type: 'spring' }}
          style={{
            position: 'absolute', left: n.x, top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: n.delay }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px', height: '24px', borderRadius: '50%',
              border: `1px solid ${n.color}`,
              willChange: 'transform, opacity',
            }}
          />
          {/* Core dot */}
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: n.color,
            boxShadow: `0 0 10px ${n.color}`,
            position: 'relative', zIndex: 1,
          }} />
          {/* City label */}
          <div style={{
            position: 'absolute', top: '16px', left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-display)', fontSize: '8px',
            color: n.color, letterSpacing: '1px', whiteSpace: 'nowrap',
            opacity: 0.8,
          }}>
            {n.city}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Stat counter ── */
function StatCounter({ end, suffix = '', label, delay = 0 }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const duration = 1600;
      const startTime = performance.now();
      const tick = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * end));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [end, delay]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        letterSpacing: '-1px',
      }}>
        <span style={{
          background: 'linear-gradient(135deg, #818CF8, #FCD34D)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {val.toLocaleString()}{suffix}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: '12px',
        color: 'var(--color-text-secondary)', marginTop: '4px', letterSpacing: '0.3px',
      }}>
        {label}
      </div>
    </div>
  );
}

/* ── Trending chip ── */
function TrendingChip({ ticker, sentiment, onClick }) {
  const color = sentiment === 'Bullish' ? 'var(--color-bullish)'
    : sentiment === 'Bearish' ? 'var(--color-bearish)' : 'var(--color-geo)';

  return (
    <motion.button
      whileHover={{ y: -3, boxShadow: `0 8px 24px rgba(0,0,0,0.3)` }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(255,255,255,0.08)`,
        backdropFilter: 'blur(8px)',
        borderRadius: '10px',
        padding: '8px 14px',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        willChange: 'transform',
        textAlign: 'left',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px',
        color: 'var(--color-text-primary)', letterSpacing: '0.5px',
      }}>
        {ticker}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color, fontWeight: 500 }}>
          {sentiment}
        </span>
      </div>
    </motion.button>
  );
}

const TRENDING = [
  { ticker: 'NVDA', sentiment: 'Bullish' },
  { ticker: 'AAPL', sentiment: 'Neutral' },
  { ticker: 'TSLA', sentiment: 'Bullish' },
  { ticker: 'MSFT', sentiment: 'Bullish' },
  { ticker: 'AMZN', sentiment: 'Neutral' },
  { ticker: 'OGDC', sentiment: 'Bullish' },
  { ticker: 'HBL',  sentiment: 'Bearish' },
  { ticker: 'META', sentiment: 'Bullish' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroSection({ onSearchFocus }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '92vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px 60px',
      overflow: 'hidden',
    }}>
      <BackgroundOrbs />

      {/* Grid overlay — very subtle */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '860px', textAlign: 'center' }}>

        {/* Status badge */}
        <motion.div {...fadeUp(0)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', marginBottom: '36px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '99px',
        }}>
          <span className="live-dot" />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '10px',
            color: 'var(--color-accent-bright)', letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            AI-Powered Geopolitical Analysis
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1 {...fadeUp(0.08)} style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(38px, 6.5vw, 76px)',
          fontWeight: 800,
          lineHeight: 1.06,
          letterSpacing: '-2.5px',
          marginBottom: '24px',
        }}>
          <span style={{ color: 'var(--color-text-primary)' }}>Geopolitical intel</span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 40%, #FCD34D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            for modern markets.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p {...fadeUp(0.16)} style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--color-text-secondary)',
          maxWidth: '520px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
          fontWeight: 400,
        }}>
          AI that connects global conflicts, sanctions, and elections to stock prices — in seconds.
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.22)} style={{ marginBottom: '48px' }}>
          <motion.button
            onClick={onSearchFocus}
            whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(99,102,241,0.45)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ fontSize: '15px', padding: '14px 36px', borderRadius: '14px', margin: '0 auto' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="#fff" strokeWidth="1.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Start Analyzing
          </motion.button>
          <div style={{
            marginTop: '12px', fontFamily: 'var(--font-body)', fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}>
            Try NVDA · AAPL · TSLA · OGDC · HBL — no signup needed
          </div>
        </motion.div>

        {/* Market nodes visualization */}
        <motion.div {...fadeUp(0.3)}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px',
            color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px',
          }}>
            LIVE COVERAGE
          </div>
          <MarketNodes />
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.45)}
          style={{
            display: 'flex', gap: '0', justifyContent: 'center', flexWrap: 'wrap',
            margin: '48px auto 0',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            maxWidth: '560px',
          }}
        >
          {[
            { end: 50, suffix: '+', label: 'Markets Covered' },
            { end: 120, suffix: '+', label: 'Geopolitical Factors' },
            { end: 3, suffix: '', label: 'AI Models Active' },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ flex: 1, padding: '24px 12px', minWidth: '120px' }}>
                <StatCounter {...s} delay={0.6 + i * 0.15} />
              </div>
              {i < 2 && (
                <div style={{ width: '1px', background: 'var(--color-border)', alignSelf: 'stretch' }} />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Trending chips */}
        <motion.div {...fadeUp(0.55)} style={{ marginTop: '40px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px',
            color: 'var(--color-text-muted)', textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            TRENDING
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {TRENDING.map(t => (
              <TrendingChip key={t.ticker} {...t} onClick={onSearchFocus} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
