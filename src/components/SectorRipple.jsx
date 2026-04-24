import React from 'react';
import { motion } from 'framer-motion';
import { IMPACT_DIRECTIONS } from '../constants/geopoliticalTags';
import { moduleLoaded, logInfo } from '../utils/logger';

moduleLoaded('SectorRipple');

// Signal strength bars (like WiFi indicator)
function SignalBars({ strength, color }) {
  // strength: 'High' = 5 bars, 'Medium' = 3 bars, 'Low' = 2 bars
  const levels = strength === 'High' ? 5 : strength === 'Medium' ? 3 : 2;
  const total = 5;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '3px',
            height: `${(i + 1) * (14 / total)}px`,
            background: i < levels ? color : 'var(--color-border)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

export default function SectorRipple({ sectorRipple, onStockSelect }) {
  const stocks = sectorRipple?.ripple_stocks || [];
  if (stocks.length === 0) return null;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      style={{ padding: '24px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, margin: 0,
          letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-primary)',
        }}>
          SECTOR CONTAGION ANALYSIS
        </h2>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '2px',
          color: 'var(--color-text-muted)', textTransform: 'uppercase',
          border: '1px solid var(--color-border)', padding: '2px 8px',
        }}>
          {stocks.length} NODES
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {stocks.map((stock, i) => {
          const dir = IMPACT_DIRECTIONS[stock.direction] || IMPACT_DIRECTIONS.Neutral;
          const isBull = stock.direction === 'Positive';
          const edgeColor = isBull ? 'var(--color-bullish)' : stock.direction === 'Negative' ? 'var(--color-bearish)' : 'var(--color-neutral)';
          const signalColor = stock.impact_level === 'High' ? 'var(--color-bearish)'
            : stock.impact_level === 'Medium' ? 'var(--color-geo)' : 'var(--color-neutral)';
          const isCorrelated = stock.direction === 'Positive' || stock.direction === 'Correlated';

          return (
            <motion.div
              key={i}
              whileHover={{ borderColor: 'var(--color-accent)', x: 2 }}
              onClick={() => {
                logInfo('SectorRipple', 'ripple stock clicked', { ticker: stock.ticker });
                onStockSelect?.(stock.ticker);
              }}
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderLeft: `3px solid ${edgeColor}`,
                padding: '14px',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
            >
              {/* Top row: ticker + signal bars */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px',
                  color: 'var(--color-text-primary)', letterSpacing: '0.5px',
                }}>
                  {stock.ticker}
                </span>
                <SignalBars strength={stock.impact_level} color={signalColor} />
              </div>

              {/* Company */}
              <div style={{
                fontSize: '11px', color: 'var(--color-text-secondary)',
                marginBottom: '6px', lineHeight: '1.3', fontFamily: 'var(--font-body)',
              }}>
                {stock.company}
              </div>

              {/* Relationship */}
              <div style={{
                fontSize: '11px', color: 'var(--color-text-muted)',
                lineHeight: '1.4', marginBottom: '10px', fontFamily: 'var(--font-body)',
              }}>
                {stock.relationship}
              </div>

              {/* Bottom: direction + correlation type */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '11px',
                  fontWeight: 700, color: dir.color,
                }}>
                  {dir.symbol} {stock.direction}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '8px', fontWeight: 700,
                  color: isCorrelated ? 'var(--color-bullish)' : 'var(--color-bearish)',
                  letterSpacing: '2px', textTransform: 'uppercase',
                  border: `1px solid ${isCorrelated ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  padding: '2px 6px',
                }}>
                  {isCorrelated ? 'CORRELATED' : 'INVERSE'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
