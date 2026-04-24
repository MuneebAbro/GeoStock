import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedGrid from './AnimatedGrid';
import { DEMO_ANALYSIS_CARD } from './demoData';

function TypingText({ text, speed = 40 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <>{displayed}<span className="typewriter-cursor">&nbsp;</span></>;
}

function DemoAnalysisCard() {
  const d = DEMO_ANALYSIS_CARD;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      style={{
        background: 'rgba(17,17,24,0.85)',
        border: '1px solid rgba(0,255,148,0.2)',
        borderRadius: '14px',
        padding: '20px 24px',
        maxWidth: '420px',
        width: '100%',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 40px rgba(0,255,148,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="live-dot" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--color-accent)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            LIVE ANALYSIS
          </span>
        </div>
        <span className="badge badge-nasdaq">{d.ticker}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800,
          color: 'var(--color-accent)',
          boxShadow: '0 0 15px rgba(0,255,148,0.2)',
        }}>
          {d.score}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {d.stance} — {d.confidence} Confidence
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>
            Potential Score
          </div>
        </div>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>
        {d.summary}
      </p>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {d.tags.map(tag => (
          <span key={tag} style={{
            fontSize: '10px', fontFamily: 'var(--font-display)', fontWeight: 600,
            padding: '3px 10px', borderRadius: '999px',
            background: 'rgba(0,255,148,0.08)', color: 'var(--color-accent)',
            border: '1px solid rgba(0,255,148,0.15)', letterSpacing: '0.5px',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function HeroSection({ onSearchFocus }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '700px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '60px 20px 40px',
    }}>
      <AnimatedGrid />

      {/* Radial gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(0,255,148,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px' }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px', marginBottom: '28px',
            background: 'rgba(0,255,148,0.06)', border: '1px solid rgba(0,255,148,0.15)',
          }}
        >
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--color-accent)', letterSpacing: '2px' }}>
            AI-POWERED ANALYSIS
          </span>
        </motion.div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800,
          lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '20px',
          color: 'var(--color-text-primary)',
        }}>
          Understand <span style={{ color: 'var(--color-accent)', textShadow: '0 0 30px rgba(0,255,148,0.3)' }}>Why</span> Stocks Move
          <br />
          — Not Just <span style={{ color: 'var(--color-text-muted)' }}>That</span> They Move
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '550px',
          margin: '0 auto 36px', lineHeight: 1.7,
        }}>
          GeoStock connects <strong style={{ color: 'var(--color-text-primary)' }}>geopolitical events</strong> with{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>stock price movements</strong> using AI — giving you
          insights that go beyond the numbers.
        </p>

        {/* Search CTA */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0,255,148,0.25)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onSearchFocus}
          style={{
            fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
            background: 'var(--color-accent)', color: '#0A0A0F',
            border: 'none', padding: '14px 36px', borderRadius: '10px',
            cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase',
            boxShadow: '0 0 20px rgba(0,255,148,0.15)',
            marginBottom: '12px',
          }}
        >
          ⌕ Search Any Stock
        </motion.button>
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', marginBottom: '40px' }}>
          Try NVDA, AAPL, TSLA, OGDC, HBL...
        </div>
      </motion.div>

      {/* Demo card */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <DemoAnalysisCard />
      </div>
    </section>
  );
}
