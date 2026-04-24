import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from './demoData';

function GaugePreview() {
  return (
    <svg width="100" height="65" viewBox="0 0 100 65">
      <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="rgba(255,59,92,0.3)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 38 18 A 40 40 0 0 1 90 55" fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="6" />
      <path d="M 66 10 A 40 40 0 0 1 90 55" fill="none" stroke="rgba(0,255,148,0.3)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 10 55 A 40 40 0 0 1 74 14" fill="none" stroke="#00FF94" strokeWidth="6" strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,148,0.5))' }} />
      <text x="50" y="48" textAnchor="middle" fill="#00FF94" fontSize="18" fontWeight="800" fontFamily="var(--font-display)">78</text>
    </svg>
  );
}

function DebatePreview() {
  return (
    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
      <div style={{
        flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '10px',
        background: 'rgba(0,255,148,0.05)', borderLeft: '2px solid var(--color-bullish)',
        color: 'var(--color-bullish)', fontFamily: 'var(--font-display)', fontWeight: 600,
      }}>
        🐂 BULL
        <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 400, fontFamily: 'var(--font-body)' }}>
          AI demand surge...
        </div>
      </div>
      <div style={{
        flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '10px',
        background: 'rgba(255,59,92,0.05)', borderLeft: '2px solid var(--color-bearish)',
        color: 'var(--color-bearish)', fontFamily: 'var(--font-display)', fontWeight: 600,
      }}>
        🐻 BEAR
        <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 400, fontFamily: 'var(--font-body)' }}>
          Overvaluation risk...
        </div>
      </div>
    </div>
  );
}

function GeoPreview() {
  const tags = [
    { label: 'SANCTIONS', color: '#FF3B5C' },
    { label: 'TRADE WAR', color: '#FF6B35' },
    { label: 'POLICY', color: '#00BCD4' },
  ];
  return (
    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
      {tags.map(t => (
        <span key={t.label} style={{
          fontSize: '9px', fontFamily: 'var(--font-display)', fontWeight: 600,
          padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.5px',
          background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30`,
        }}>
          {t.label}
        </span>
      ))}
    </div>
  );
}

const PREVIEWS = { gauge: GaugePreview, debate: DebatePreview, geo: GeoPreview };

export default function FeaturesSection() {
  return (
    <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '50px' }}
      >
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px',
          color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '12px',
        }}>
          CORE FEATURES
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          What Makes GeoStock Different
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
          AI-powered tools that connect world events to stock performance
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {FEATURES.map((f, i) => {
          const Preview = PREVIEWS[f.preview];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ borderColor: 'rgba(0,255,148,0.3)', y: -4 }}
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '28px',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700,
                color: 'var(--color-text-primary)', marginBottom: '8px',
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                {f.desc}
              </p>
              <div style={{
                background: 'var(--color-bg-primary)',
                borderRadius: '8px',
                padding: '14px',
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {Preview && <Preview />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
