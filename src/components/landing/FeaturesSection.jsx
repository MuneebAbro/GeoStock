import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from './demoData';

function GaugePreview() {
  const colors = ['#10B981','#34D399','#F59E0B','#F97316','#EF4444'];
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '50px' }}>
      {['CRITICAL','HIGH','MODERATE','LOW','MINIMAL'].map((seg, i) => (
        <div key={seg} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '22px', height: `${(5 - i) * 8 + 10}px`,
            background: i === 1 ? colors[i] : `${colors[i]}44`,
            border: `1px solid ${colors[i]}`,
            boxShadow: i === 1 ? `0 0 8px ${colors[i]}` : 'none',
          }} />
        </div>
      ))}
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#34D399', marginLeft: '8px' }}>78</span>
    </div>
  );
}

function DebatePreview() {
  return (
    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
      <div style={{
        flex: 1, padding: '8px 10px', fontSize: '10px',
        background: 'rgba(16,185,129,0.05)', borderLeft: '2px solid var(--color-bullish)',
        color: 'var(--color-bullish)', fontFamily: 'var(--font-display)', fontWeight: 700,
        letterSpacing: '0.5px',
      }}>
        ▲ BULL
        <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 400, fontFamily: 'var(--font-body)' }}>
          AI demand surge...
        </div>
      </div>
      <div style={{
        flex: 1, padding: '8px 10px', fontSize: '10px',
        background: 'rgba(239,68,68,0.05)', borderLeft: '2px solid var(--color-bearish)',
        color: 'var(--color-bearish)', fontFamily: 'var(--font-display)', fontWeight: 700,
        letterSpacing: '0.5px',
      }}>
        ▼ BEAR
        <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 400, fontFamily: 'var(--font-body)' }}>
          Overvaluation risk...
        </div>
      </div>
    </div>
  );
}

function GeoPreview() {
  const tags = [
    { label: 'SANCTIONS', color: '#EF4444' },
    { label: 'TRADE WAR', color: '#F97316' },
    { label: 'POLICY',    color: '#06B6D4' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      {tags.map((t, i) => (
        <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', color: 'var(--color-text-muted)' }}>REF-00{i+1}</span>
          <span style={{
            fontSize: '9px', fontFamily: 'var(--font-display)', fontWeight: 600,
            padding: '2px 8px', letterSpacing: '1px',
            background: `${t.color}12`, color: t.color, border: `1px solid ${t.color}30`,
          }}>
            {t.label}
          </span>
        </div>
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
          CORE CAPABILITIES
        </div>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
          color: 'var(--color-text-primary)', marginBottom: '8px', letterSpacing: '-0.5px',
        }}>
          What Makes GeoStock Different
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '450px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
          AI-powered tools that connect world events to stock performance
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {FEATURES.map((f, i) => {
          const Preview = PREVIEWS[f.preview];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ borderColor: 'var(--color-border-active)', y: -3 }}
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                position: 'relative',
                padding: '28px',
                transition: 'border-color 0.2s, transform 0.2s',
                overflow: 'hidden',
              }}
            >
              {/* Corner bracket */}
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: '16px', height: '16px',
                borderTop: '2px solid var(--color-accent)',
                borderLeft: '2px solid var(--color-accent)',
              }} />
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '2px',
                color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '12px',
              }}>
                MODULE-0{i+1}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700,
                color: 'var(--color-text-primary)', marginBottom: '8px', letterSpacing: '-0.5px',
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '18px', fontFamily: 'var(--font-body)' }}>
                {f.desc}
              </p>
              <div style={{
                background: 'var(--color-bg-primary)',
                padding: '14px',
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px',
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
