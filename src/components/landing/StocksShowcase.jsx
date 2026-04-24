import React from 'react';
import { motion } from 'framer-motion';
import { DEMO_STOCKS } from './demoData';

function StockCard({ stock, index, onStockSearch }) {
  const isPositive = stock.change.startsWith('+');
  const changeColor = isPositive ? 'var(--color-bullish)' : 'var(--color-bearish)';
  const sentimentColors = {
    Bullish: { bg: 'rgba(0,255,148,0.08)', color: '#00FF94', border: 'rgba(0,255,148,0.2)' },
    Bearish: { bg: 'rgba(255,59,92,0.08)', color: '#FF3B5C', border: 'rgba(255,59,92,0.2)' },
    Neutral: { bg: 'rgba(255,215,0,0.08)', color: '#FFD700', border: 'rgba(255,215,0,0.2)' },
  };
  const sc = sentimentColors[stock.sentiment] || sentimentColors.Neutral;
  const exchangeBadge = stock.exchange === 'PSX' ? 'badge-psx' : 'badge-nasdaq';

  return (
    <motion.div
      onClick={() => onStockSearch && onStockSearch(stock.ticker)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, borderColor: 'rgba(0,255,148,0.3)', boxShadow: '0 8px 30px rgba(0,255,148,0.06)' }}
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {stock.ticker}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{stock.name}</div>
        </div>
        <span className={`badge ${exchangeBadge}`}>{stock.exchange}</span>
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
        ${stock.price}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: changeColor,
        }}>
          {isPositive ? '▲' : '▼'} {stock.change}
        </span>
        <span style={{
          fontSize: '10px', fontFamily: 'var(--font-display)', fontWeight: 600,
          padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px',
          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
        }}>
          AI: {stock.sentiment}
        </span>
      </div>

      {/* Mini sparkline */}
      <svg width="100%" height="30" viewBox="0 0 120 30" style={{ marginTop: '10px', opacity: 0.5 }}>
        <polyline
          fill="none"
          stroke={changeColor}
          strokeWidth="1.5"
          points={isPositive
            ? "0,25 15,22 30,20 45,18 60,22 75,15 90,12 105,8 120,5"
            : "0,5 15,8 30,10 45,15 60,12 75,18 90,22 105,25 120,27"
          }
        />
      </svg>
    </motion.div>
  );
}

export default function StocksShowcase({ onStockSearch }) {
  return (
    <section style={{ padding: '60px 20px 40px', maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px',
          color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '12px',
        }}>
          TOP STOCKS
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          Global & Pakistan Markets
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
          AI sentiment analysis across NASDAQ, NYSE, and Pakistan Stock Exchange
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px',
      }}>
        {DEMO_STOCKS.map((stock, i) => (
          <StockCard key={stock.ticker} stock={stock} index={i} onStockSearch={onStockSearch} />
        ))}
      </div>
    </section>
  );
}
