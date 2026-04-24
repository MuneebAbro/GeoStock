import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LiveDot from './LiveDot';
import { formatPercentage, formatLargeNumber, formatPrice } from '../utils/scoreCalculator';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('StockHeader');

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 2, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const target = parseFloat(value) || 0;
    const start = 0;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (target - start) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span className="count-up">{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

function DataPill({ label, value, valueColor }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      padding: '6px 12px',
      border: '1px solid var(--color-border)',
      background: 'var(--color-bg-elevated)',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '8px',
        letterSpacing: '2px',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '13px',
        fontWeight: 600,
        color: valueColor || 'var(--color-text-primary)',
        letterSpacing: '0.5px',
      }}>
        {value}
      </span>
    </div>
  );
}

export default function StockHeader({ quote, overview, market, kse100 }) {
  const { isPSX, exchange, ticker } = market;
  const pctData = formatPercentage(quote?.changePercent);
  const isPositive = (quote?.change || 0) >= 0;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '0', overflow: 'visible' }}
    >
      {/* Top accent line */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, var(--color-accent), transparent)',
        borderRadius: '0',
      }} />

      <div style={{ padding: '24px 28px' }}>
        {/* Row 1: Exchange badge + Ticker + Company + Sector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span className={`badge badge-${exchange.toLowerCase()}`}>{exchange}</span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '42px',
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-1px',
            lineHeight: 1,
            color: 'var(--color-text-primary)',
          }}>
            {ticker}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
            }}>
              {overview?.name || market.companyName}
            </span>
            {overview?.sector && overview.sector !== 'Unknown' && (
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '1.5px',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
              }}>
                {overview.sector}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Price + Change */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: 'var(--color-text-primary)',
            }}>
              <AnimatedNumber value={quote?.price || 0} prefix={isPSX ? 'PKR ' : '$'} decimals={2} />
            </span>
            <LiveDot />
          </div>

          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 700,
            padding: '4px 10px',
            background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: isPositive ? 'var(--color-bullish)' : 'var(--color-bearish)',
            border: `1px solid ${isPositive ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            letterSpacing: '0.5px',
          }}>
            {isPositive ? '▲' : '▼'} {quote?.change > 0 ? '+' : ''}{(quote?.change || 0).toFixed(2)} ({pctData.text})
          </span>
        </div>

        {/* Row 3: Data pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'stretch' }}>
          {quote?.high && (
            <DataPill label="DAY HIGH" value={formatPrice(quote.high, isPSX)} valueColor="var(--color-bullish)" />
          )}
          {quote?.low && (
            <DataPill label="DAY LOW" value={formatPrice(quote.low, isPSX)} valueColor="var(--color-bearish)" />
          )}
          {overview?.marketCap && overview.marketCap !== 'N/A' && (
            <DataPill label="MKT CAP" value={
              typeof overview.marketCap === 'string' && overview.marketCap.includes('B')
                ? overview.marketCap
                : formatLargeNumber(overview.marketCap)
            } />
          )}
          {quote?.volume && (
            <DataPill label="VOLUME" value={`${(quote.volume / 1e6).toFixed(1)}M`} />
          )}
          {isPSX && kse100 && (
            <div style={{
              marginLeft: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              padding: '6px 14px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-elevated)',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '8px',
                letterSpacing: '2px', color: 'var(--color-text-muted)', textTransform: 'uppercase',
              }}>KSE-100</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px' }}>
                  {kse100.value?.toLocaleString()}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '11px',
                  color: kse100.changePercent >= 0 ? 'var(--color-bullish)' : 'var(--color-bearish)',
                }}>
                  {kse100.changePercent >= 0 ? '+' : ''}{kse100.changePercent?.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
