import React from 'react';
import { motion } from 'framer-motion';
import { PSX_STOCKS } from './demoData';

export default function PSXSection({ onStockSearch }) {
  return (
    <section style={{
      padding: '80px 20px',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px',
            color: '#FFD700', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            🇵🇰 PAKISTAN STOCK EXCHANGE
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800,
            color: 'var(--color-text-primary)', marginBottom: '8px',
          }}>
            Local Market Intelligence
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Full support for Pakistan Stock Exchange — KSE-100 Index tracking with AI-powered geopolitical analysis
          </p>
        </div>

        {/* KSE-100 Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.06), rgba(0,255,148,0.03))',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '14px',
            padding: '24px 28px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600,
              color: '#FFD700', letterSpacing: '1px', marginBottom: '4px',
            }}>
              KSE-100 INDEX
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800,
              color: 'var(--color-text-primary)',
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {PSX_STOCKS.map((stock, i) => {
            const isPositive = stock.change.startsWith('+');
            return (
              <motion.div
                key={stock.ticker}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ borderColor: 'rgba(255,215,0,0.3)', y: -3 }}
                onClick={() => onStockSearch && onStockSearch(stock.ticker)}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-psx">{stock.ticker}</span>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{stock.name}</span>
                  </div>
                  <span style={{
                    fontSize: '10px', fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-muted)', letterSpacing: '0.5px',
                  }}>
                    {stock.sector}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}>
                    PKR {stock.price}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
                    color: isPositive ? 'var(--color-bullish)' : 'var(--color-bearish)',
                  }}>
                    {isPositive ? '▲' : '▼'} {stock.change}
                  </div>
                </div>
                <div style={{
                  marginTop: '10px', display: 'inline-block',
                  fontSize: '10px', fontFamily: 'var(--font-display)', fontWeight: 600,
                  padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px',
                  background: 'rgba(0,255,148,0.08)', color: 'var(--color-accent)',
                  border: '1px solid rgba(0,255,148,0.15)',
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
