import React from 'react';
import { motion } from 'framer-motion';
import { DEMO_STOCKS } from './demoData';

function MiniSparkline({ up }) {
  const d = up
    ? 'M0,24 C10,22 20,18 30,16 C40,14 50,17 60,11 C70,9 80,7 90,4'
    : 'M0,4 C10,6 20,10 30,12 C40,15 50,11 60,17 C70,20 80,21 90,24';
  const color = up ? '#10B981' : '#F43F5E';
  return (
    <svg width="90" height="28" viewBox="0 0 90 28" fill="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sg-${up ? 'u' : 'd'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d + ' L90,28 L0,28 Z'} fill={`url(#sg-${up ? 'u' : 'd'})`} />
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function StockCard({ stock, index, onStockSearch }) {
  const isUp = stock.change.startsWith('+');
  const changeColor = isUp ? 'var(--color-bullish)' : 'var(--color-bearish)';
  const sentimentColor = stock.sentiment === 'Bullish' ? 'var(--color-bullish)'
    : stock.sentiment === 'Bearish' ? 'var(--color-bearish)' : 'var(--color-geo)';
  const exchangeClass = stock.exchange === 'PSX' ? 'badge-psx'
    : stock.exchange === 'NYSE' ? 'badge-nyse' : 'badge-nasdaq';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onStockSearch?.(stock.ticker)}
      className="card"
      style={{
        cursor: 'pointer',
        padding: '18px 20px',
        borderRadius: '14px',
        willChange: 'transform',
      }}
    >
      {/* Top: ticker + exchange + sparkline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
            color: 'var(--color-text-primary)', letterSpacing: '0.5px',
          }}>
            {stock.ticker}
          </div>
          <div style={{
            fontSize: '11px', color: 'var(--color-text-secondary)',
            marginTop: '3px', fontFamily: 'var(--font-body)',
            maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {stock.name}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span className={`badge ${exchangeClass}`}>{stock.exchange}</span>
          <MiniSparkline up={isUp} />
        </div>
      </div>

      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700,
          color: 'var(--color-text-primary)', letterSpacing: '-0.5px',
        }}>
          {stock.exchange === 'PSX' ? 'PKR ' : '$'}{stock.price}
        </span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700,
          color: changeColor,
        }}>
          {isUp ? '▲' : '▼'} {stock.change}
        </span>
      </div>

      {/* Sentiment pill */}
      <div style={{
        marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px',
        background: `${sentimentColor}10`,
        border: `1px solid ${sentimentColor}25`,
        borderRadius: '99px',
      }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: sentimentColor }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500,
          color: sentimentColor, letterSpacing: '0.2px',
        }}>
          {stock.sentiment}
        </span>
      </div>
    </motion.div>
  );
}

export default function StocksShowcase({ onStockSearch }) {
  return (
    <section style={{ padding: '56px 24px 40px', maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px',
          color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '8px',
        }}>
          LIVE MARKET FEED
        </div>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700,
          color: 'var(--color-text-primary)', letterSpacing: '-0.5px', marginBottom: '6px',
        }}>
          Global &amp; Pakistan Markets
        </h2>
        <p style={{
          fontSize: '14px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)',
          maxWidth: '480px',
        }}>
          Click any card to run AI geopolitical analysis instantly.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: '12px',
      }}>
        {DEMO_STOCKS.map((stock, i) => (
          <StockCard key={stock.ticker} stock={stock} index={i} onStockSearch={onStockSearch} />
        ))}
      </div>
    </section>
  );
}
