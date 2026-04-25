import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FACTS = [
  { icon: '📈', fact: 'The NYSE was founded in 1792 under a buttonwood tree on Wall Street.' },
  { icon: '💡', fact: 'Warren Buffett bought his first stock at age 11 — and regretted waiting so long.' },
  { icon: '🌍', fact: 'The Pakistan Stock Exchange (PSX) was established in 1949 and is one of Asia\'s oldest.' },
  { icon: '🐂', fact: 'A "bull market" is named after the way a bull attacks — thrusting horns upward.' },
  { icon: '🐻', fact: 'A "bear market" mimics a bear\'s swipe — dragging its paws downward.' },
  { icon: '💰', fact: 'Amazon\'s IPO price in 1997 was $18 per share. Today it\'s worth over 10,000x that.' },
  { icon: '🏦', fact: 'The world\'s largest stock exchange by market cap is the NYSE at over $25 trillion.' },
  { icon: '⚡', fact: 'High-frequency trading accounts for ~50% of all US stock trades — happening in microseconds.' },
  { icon: '🎯', fact: 'The S&P 500 has returned an average of ~10% annually since its inception in 1957.' },
  { icon: '🔮', fact: 'The "January Effect" — stocks often rise in January due to tax-loss selling in December.' },
  { icon: '🧠', fact: 'Behavioral finance shows that investors feel losses 2x more intensely than equivalent gains.' },
  { icon: '🌐', fact: 'Geopolitical events can move markets by 3-5% in a single day — that\'s GeoStock\'s edge.' },
  { icon: '📊', fact: 'The Dow Jones was created in 1896 and originally tracked just 12 companies.' },
  { icon: '🚀', fact: 'Tesla stock rose over 740% in 2020 alone — the most in a single year for a major company.' },
  { icon: '💎', fact: 'Gold has been a store of value for over 5,000 years and still holds up today.' },
  { icon: '🤖', fact: 'AI-driven trading systems now manage over $1 trillion in assets globally.' },
  { icon: '🕐', fact: 'Markets are open 252 trading days a year — every second counts.' },
  { icon: '📉', fact: 'The 2008 crash wiped out $10 trillion in US wealth. Recovery took about 4 years.' },
  { icon: '🌙', fact: 'Studies show full moon phases statistically correlate with slightly lower stock returns.' },
  { icon: '🦈', fact: '"Shorting" a stock means betting it will fall — the riskiest trade since losses are unlimited.' },
];

export default function StockFactLoader({ ticker }) {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FACTS.length));
  const [visible, setVisible] = useState(true);
  const [dots, setDots] = useState('');
  const intervalRef = useRef(null);
  const dotsRef = useRef(null);

  // Cycle facts every 4 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setFactIndex(prev => (prev + 1) % FACTS.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Animated dots
  useEffect(() => {
    dotsRef.current = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(dotsRef.current);
  }, []);

  const current = FACTS[factIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100%',
        maxWidth: '620px',
        margin: '0 auto 28px auto',
        position: 'relative',
      }}
    >
      {/* Main card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(5,5,10,0.9) 100%)',
        border: '1px solid rgba(99,102,241,0.22)',
        borderRadius: '2px',
        padding: '24px 28px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Glow accent */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '120px', height: '120px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          {/* Spinner */}
          <div style={{ position: 'relative', width: '20px', height: '20px', flexShrink: 0 }}>
            <svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              style={{ animation: 'spin 1s linear infinite', display: 'block' }}
            >
              <circle cx="10" cy="10" r="8" stroke="rgba(99,102,241,0.2)" strokeWidth="2" />
              <path d="M10 2 A8 8 0 0 1 18 10" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '2.5px',
              color: '#818CF8', textTransform: 'uppercase', fontWeight: 700,
            }}>
              ANALYZING {ticker ? ticker.toUpperCase() : 'STOCK'}{dots}
            </span>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '1.5px',
              color: 'var(--color-text-muted)', textTransform: 'uppercase',
              border: '1px solid rgba(99,102,241,0.2)', padding: '2px 7px',
            }}>
              DID YOU KNOW
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '100%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)',
          marginBottom: '18px',
        }} />

        {/* Fact area */}
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={factIndex}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}
            >
              <span style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.4))' }}>
                {current.icon}
              </span>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: '1.65',
                color: 'var(--color-text-secondary)', margin: 0,
                letterSpacing: '0.2px',
              }}>
                {current.fact}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '1.5px',
              color: 'var(--color-text-muted)', textTransform: 'uppercase',
            }}>
              FETCHING MARKET DATA
            </span>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '1px',
              color: '#818CF8',
            }}>
              GEO·INTEL
            </span>
          </div>
          <div style={{
            width: '100%', height: '2px',
            background: 'rgba(99,102,241,0.12)', borderRadius: '0', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #6366F1)',
              backgroundSize: '200% 100%',
              animation: 'shimmer-bar 1.6s ease-in-out infinite',
              borderRadius: '0',
            }} />
          </div>
        </div>

        {/* Fact indicator dots */}
        <div style={{ display: 'flex', gap: '5px', marginTop: '14px', justifyContent: 'center' }}>
          {FACTS.map((_, i) => (
            <div key={i} style={{
              width: i === factIndex ? '16px' : '4px',
              height: '4px',
              borderRadius: '2px',
              background: i === factIndex ? '#6366F1' : 'rgba(99,102,241,0.2)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer-bar {
          0%   { background-position: 200% 0; width: 30%; }
          50%  { background-position: 0% 0;   width: 70%; }
          100% { background-position: -200% 0; width: 30%; }
        }
      `}</style>
    </motion.div>
  );
}
