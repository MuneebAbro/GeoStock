import React from 'react';
import { motion } from 'framer-motion';
import { IMPACT_DIRECTIONS } from '../constants/geopoliticalTags';

export default function SectorRipple({ sectorRipple, onStockSelect }) {
  const stocks = sectorRipple?.ripple_stocks || [];
  if (stocks.length === 0) return null;

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }} style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '16px' }}>🔗</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, margin: 0,
          letterSpacing: '1px', textTransform: 'uppercase' }}>Sector Ripple Effect</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {stocks.map((stock, i) => {
          const dir = IMPACT_DIRECTIONS[stock.direction] || IMPACT_DIRECTIONS.Neutral;
          const impactColor = stock.impact_level === 'High' ? '#FF3B5C'
            : stock.impact_level === 'Medium' ? '#FFD700' : '#A0A0B0';

          return (
            <motion.div key={i}
              whileHover={{ scale: 1.02, borderColor: 'var(--color-accent)' }}
              onClick={() => onStockSelect?.(stock.ticker)}
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
                borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px',
                  color: 'var(--color-text-primary)' }}>{stock.ticker}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: dir.color }}>
                  {dir.symbol}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px', lineHeight: '1.3' }}>
                {stock.company}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4', marginBottom: '8px' }}>
                {stock.relationship}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, color: dir.color }}>
                  {stock.direction}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, color: impactColor,
                  padding: '1px 6px', borderRadius: '3px', background: `${impactColor}12`, border: `1px solid ${impactColor}25` }}>
                  {stock.impact_level}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
