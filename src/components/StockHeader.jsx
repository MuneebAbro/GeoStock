import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LiveDot from './LiveDot';
import { formatPercentage, formatLargeNumber, formatPrice } from '../utils/scoreCalculator';

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
      // Ease out cubic
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

export default function StockHeader({ quote, overview, market, kse100 }) {
  const { isPSX, exchange, ticker } = market;
  const pctData = formatPercentage(quote?.changePercent);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '24px 28px' }}
    >
      {/* Top row: Company + Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <span className={`badge badge-${exchange.toLowerCase()}`}>{exchange}</span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          fontWeight: 700,
          margin: 0,
          letterSpacing: '-0.5px',
        }}>
          {ticker}
        </h1>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          {overview?.name || market.companyName}
        </span>
        {overview?.sector && overview.sector !== 'Unknown' && (
          <span style={{
            background: 'var(--color-bg-elevated)',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-display)',
            border: '1px solid var(--color-border)',
          }}>
            {overview.sector}
          </span>
        )}
      </div>

      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '36px',
            fontWeight: 800,
            letterSpacing: '-1px',
          }}>
            <AnimatedNumber value={quote?.price || 0} prefix={isPSX ? 'PKR ' : '$'} decimals={2} />
          </span>
          <LiveDot />
        </div>

        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          fontWeight: 600,
          color: pctData.color,
        }}>
          {quote?.change > 0 ? '+' : ''}{(quote?.change || 0).toFixed(2)} ({pctData.text})
        </span>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
      }}>
        {quote?.high && (
          <div>
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '1px' }}>HIGH </span>
            <span style={{ color: 'var(--color-bullish)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              {formatPrice(quote.high, isPSX)}
            </span>
          </div>
        )}
        {quote?.low && (
          <div>
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '1px' }}>LOW </span>
            <span style={{ color: 'var(--color-bearish)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              {formatPrice(quote.low, isPSX)}
            </span>
          </div>
        )}
        {overview?.marketCap && overview.marketCap !== 'N/A' && (
          <div>
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '1px' }}>MCAP </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              {typeof overview.marketCap === 'string' && overview.marketCap.includes('B')
                ? overview.marketCap
                : formatLargeNumber(overview.marketCap)}
            </span>
          </div>
        )}
        {quote?.volume && (
          <div>
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '1px' }}>VOL </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              {(quote.volume / 1e6).toFixed(1)}M
            </span>
          </div>
        )}
        {isPSX && kse100 && (
          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-bg-elevated)',
            padding: '4px 12px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '1px', color: 'var(--color-text-muted)' }}>KSE-100</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px' }}>
              {kse100.value?.toLocaleString()}
            </span>
            <span style={{
              color: kse100.changePercent >= 0 ? 'var(--color-bullish)' : 'var(--color-bearish)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '12px',
            }}>
              {kse100.changePercent >= 0 ? '+' : ''}{kse100.changePercent?.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
