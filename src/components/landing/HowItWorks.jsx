import React from 'react';
import { motion } from 'framer-motion';
import { HOW_IT_WORKS } from './demoData';

const STEP_ICONS = ['[01]', '[02]', '[03]'];

export default function HowItWorks() {
  return (
    <section style={{
      padding: '80px 20px',
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
    }}>
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
          OPERATIONAL SEQUENCE
        </div>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
          color: 'var(--color-text-primary)', letterSpacing: '-0.5px',
        }}>
          Three Steps to Smarter Investing
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
        {/* Vertical connecting line */}
        <div style={{
          position: 'absolute',
          left: '28px',
          top: '40px',
          bottom: '40px',
          width: '1px',
          background: 'linear-gradient(180deg, var(--color-accent), rgba(99,102,241,0.1))',
          zIndex: 0,
        }} />

        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.18 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '24px',
              padding: '24px 0',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Step badge */}
            <div style={{
              width: '56px', height: '56px',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-active)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(99,102,241,0.08)',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
                color: 'var(--color-accent)', letterSpacing: '0.5px',
              }}>
                {STEP_ICONS[i]}
              </span>
            </div>

            <div style={{ paddingTop: '8px', borderBottom: i < HOW_IT_WORKS.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: '24px', flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 600,
                color: 'var(--color-accent)', letterSpacing: '3px', marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                STEP {step.step}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700,
                color: 'var(--color-text-primary)', marginBottom: '6px', letterSpacing: '-0.3px',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '14px', color: 'var(--color-text-secondary)',
                lineHeight: 1.65, fontFamily: 'var(--font-body)',
              }}>
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
