import React from 'react';
import { motion } from 'framer-motion';
import { PSX_STOCKS } from './demoData';

export default function PSXSection({ onStockSearch }) {
  return (
    <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px',
            color: 'var(--color-geo)', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            PAKISTAN STOCK EXCHANGE — PSX
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
            color: 'var(--color-text-primary)', marginBottom: '8px', letterSpacing: '-0.5px',
          }}>
            Local Market Intelligence
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
            Full support for Pakistan Stock Exchange — KSE-100 Index tracking with AI-powered geopolitical analysis
          </p>
        </div>

        {/* KSE-100 Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderLeft: '3px solid var(--color-geo)',
            padding: '20px 24px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 600,
              color: 'var(--color-geo)', letterSpacing: '3px', marginBottom: '4px',
            }}>
              KSE-100 INDEX
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800,
              color: 'var(--color-text-primary)', letterSpacing: '-1px',
            }}>
              72,341.28
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700,
              color: 'var(--color-bullish)',
            }}>
              ▲ +1.42%
            </div>
            <span className="badge badge-psx">PSX LIVE</span>
          </div>
        </motion.div>

        {/* Stock Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {PSX_STOCKS.map((stock, i) => {
            const isPositive = stock.change.startsWith('+');
            return (
              <motion.div
                key={stock.ticker}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ borderColor: 'var(--color-border-active)', x: 2 }}
                onClick={() => onStockSearch && onStockSearch(stock.ticker)}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderLeft: `3px solid ${isPositive ? 'var(--color-bullish)' : 'var(--color-bearish)'}`,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-psx">{stock.ticker}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>{stock.name}</span>
                  </div>
                  <span style={{
                    fontSize: '9px', fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-muted)', letterSpacing: '1px', textTransform: 'uppercase',
                  }}>
                    {stock.sector}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700,
                    color: 'var(--color-text-primary)', letterSpacing: '-0.5px',
                  }}>
                    PKR {stock.price}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
                    color: isPositive ? 'var(--color-bullish)' : 'var(--color-bearish)',
                  }}>
                    {isPositive ? '▲' : '▼'} {stock.change}
                  </div>
                </div>
                <div style={{
                  marginTop: '10px', display: 'inline-block',
                  fontSize: '9px', fontFamily: 'var(--font-display)', fontWeight: 600,
                  padding: '2px 8px', letterSpacing: '1px',
                  background: 'rgba(99,102,241,0.08)', color: 'var(--color-accent-bright)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}>
                  AI: {stock.sentiment}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
