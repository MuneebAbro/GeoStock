import React from 'react';
import { motion } from 'framer-motion';

export default function CTASection({ onSearchFocus }) {
  return (
    <section style={{
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(0,255,148,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          background: 'var(--color-bg-surface)',
          border: '1px solid rgba(0,255,148,0.15)',
          borderRadius: '20px',
          padding: '50px 40px',
          boxShadow: '0 0 60px rgba(0,255,148,0.04)',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🚀</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800,
          color: 'var(--color-text-primary)', marginBottom: '12px',
        }}>
          Try GeoStock Now
        </h2>
        <p style={{
          fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7,
          marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px',
        }}>
          Search any stock and get AI-powered geopolitical analysis in seconds. No signup required.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,255,148,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onSearchFocus}
          style={{
            fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700,
            background: 'var(--color-accent)', color: '#0A0A0F',
            border: 'none', padding: '16px 44px', borderRadius: '12px',
            cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase',
            boxShadow: '0 0 25px rgba(0,255,148,0.2)',
          }}
        >
          ⌕ Start Analyzing
        </motion.button>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '24px',
          flexWrap: 'wrap',
        }}>
          {['No API Key Needed', 'Free to Use', 'PSX + Global'].map(t => (
            <span key={t} style={{
              fontSize: '11px', color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <span style={{ color: 'var(--color-accent)' }}>✓</span> {t}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
