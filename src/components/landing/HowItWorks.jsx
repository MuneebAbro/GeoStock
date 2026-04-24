import React from 'react';
import { motion } from 'framer-motion';
import { HOW_IT_WORKS } from './demoData';

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
          HOW IT WORKS
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800,
          color: 'var(--color-text-primary)',
        }}>
          Three Steps to Smarter Investing
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
        {/* Vertical connecting line */}
        <div style={{
          position: 'absolute',
          left: '35px',
          top: '40px',
          bottom: '40px',
          width: '2px',
          background: 'linear-gradient(180deg, var(--color-accent), rgba(0,255,148,0.1))',
          zIndex: 0,
        }} />

        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '24px',
              padding: '24px 0',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Step number circle */}
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'var(--color-bg-surface)',
              border: '2px solid rgba(0,255,148,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(0,255,148,0.08)',
            }}>
              {step.icon}
            </div>

            <div style={{ paddingTop: '8px' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600,
                color: 'var(--color-accent)', letterSpacing: '2px', marginBottom: '6px',
              }}>
                STEP {step.step}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700,
                color: 'var(--color-text-primary)', marginBottom: '6px',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6,
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
