import React from 'react';
import { motion } from 'framer-motion';

export default function CTASection({ onSearchFocus }) {
  return (
    <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow backdrop */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: '580px', margin: '0 auto', textAlign: 'center',
          background: 'rgba(15,15,28,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          padding: '56px 44px',
          boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '5px 14px', marginBottom: '24px',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '99px',
        }}>
          <span className="live-dot" />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '9px',
            color: 'var(--color-accent-bright)', letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            READY TO DEPLOY
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800,
          color: 'var(--color-text-primary)', marginBottom: '14px', letterSpacing: '-1px', lineHeight: 1.1,
        }}>
          Start analyzing any stock now
        </h2>

        <p style={{
          fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7,
          marginBottom: '36px', fontFamily: 'var(--font-body)', maxWidth: '380px', margin: '0 auto 36px',
        }}>
          AI geopolitical analysis in seconds. No signup, no API key required.
        </p>

        <motion.button
          whileHover={{ y: -3, boxShadow: '0 20px 60px rgba(99,102,241,0.45)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onSearchFocus}
          className="btn-primary"
          style={{ fontSize: '15px', padding: '14px 44px', borderRadius: '14px' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="#fff" strokeWidth="1.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Open Terminal
        </motion.button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
          {['No signup', 'Free to use', 'PSX + Global'].map(t => (
            <span key={t} style={{
              fontSize: '12px', color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
