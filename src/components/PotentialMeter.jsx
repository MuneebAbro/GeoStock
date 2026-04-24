import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getScoreZone, getGaugeColor } from '../utils/scoreCalculator';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('PotentialMeter');

const TIMEFRAMES = [
  { key: '1 day', label: '1D' },
  { key: '1 week', label: '1W' },
  { key: '1 month', label: '1M' },
];

const THREAT_SEGMENTS = [
  { label: 'CRITICAL', min: 81, max: 100, color: '#10B981' },
  { label: 'HIGH',     min: 61, max: 80,  color: '#34D399' },
  { label: 'MODERATE', min: 41, max: 60,  color: '#F59E0B' },
  { label: 'LOW',      min: 21, max: 40,  color: '#F97316' },
  { label: 'MINIMAL',  min: 0,  max: 20,  color: '#EF4444' },
];

function getActiveSegment(score) {
  return THREAT_SEGMENTS.find(s => score >= s.min && score <= s.max) || THREAT_SEGMENTS[4];
}

export default function PotentialMeter({ potentialScore, timeframe, timeframeLoading, onTimeframeChange }) {
  const score = potentialScore?.potential_score ?? 50;
  const [animatedScore, setAnimatedScore] = useState(0);
  const frameRef = useRef(null);

  // Animate score (original logic)
  useEffect(() => {
    const startTime = performance.now();
    const startVal = 0;
    const duration = 1500;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimatedScore(startVal + (score - startVal) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [score]);

  const zone = getScoreZone(score);
  const gaugeColor = getGaugeColor(score);
  const activeSegment = getActiveSegment(score);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* Header label */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px',
        color: 'var(--color-text-muted)', textTransform: 'uppercase',
      }}>
        MARKET POTENTIAL SCORE
      </div>

      {/* Main layout: vertical bar + score + info */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>

        {/* Threat Level Vertical Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '44px', flexShrink: 0 }}>
          {THREAT_SEGMENTS.map((seg) => {
            const isActive = score >= seg.min && score <= seg.max;
            const segFill = animatedScore >= seg.min;
            return (
              <div
                key={seg.label}
                className={isActive ? 'threat-segment-active' : ''}
                style={{
                  flex: 1,
                  minHeight: '28px',
                  background: segFill
                    ? (isActive ? seg.color : `${seg.color}55`)
                    : 'var(--color-bg-elevated)',
                  border: `1px solid ${isActive ? seg.color : 'var(--color-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? `0 0 12px ${seg.color}60` : 'none',
                  transition: 'background 0.3s, box-shadow 0.3s',
                  position: 'relative',
                }}
              />
            );
          })}
        </div>

        {/* Labels column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flexShrink: 0 }}>
          {THREAT_SEGMENTS.map((seg) => {
            const isActive = score >= seg.min && score <= seg.max;
            return (
              <div
                key={seg.label}
                style={{
                  flex: 1,
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? seg.color : 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                }}>
                  {seg.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Score + summary */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
          {/* Big number */}
          <motion.div key={score} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '56px',
                fontWeight: 700,
                lineHeight: 1,
                color: gaugeColor,
                textShadow: `0 0 20px ${gaugeColor}40`,
              }}>
                {Math.round(animatedScore)}
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                color: 'var(--color-text-muted)',
              }}>
                /100
              </span>
            </div>

            <div style={{ marginTop: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                fontWeight: 700,
                color: gaugeColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {activeSegment.label}
              </span>
            </div>

            <div style={{
              fontSize: '12px', color: 'var(--color-text-secondary)',
              lineHeight: '1.5', marginTop: '8px', fontFamily: 'var(--font-body)',
            }}>
              {potentialScore?.one_line_summary || ''}
            </div>

            {/* Stance + confidence pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px',
              padding: '4px 10px', border: '1px solid var(--color-border)',
              background: 'var(--color-bg-elevated)',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '10px',
                fontWeight: 700, color: zone.color,
              }}>
                {potentialScore?.stance || zone.label}
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '10px',
                color: 'var(--color-text-secondary)',
              }}>
                {potentialScore?.confidence || 'Medium'} CONF
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Loading overlay */}
      {timeframeLoading && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(5,5,10,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="skeleton" style={{ width: '80px', height: '80px' }} />
        </div>
      )}

      {/* Timeframe Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        border: '1px solid var(--color-border)',
        alignSelf: 'flex-start',
      }}>
        {TIMEFRAMES.map((tf, i) => (
          <button
            key={tf.key}
            onClick={() => onTimeframeChange(tf.key)}
            disabled={timeframeLoading}
            style={{
              padding: '7px 18px',
              border: 'none',
              borderRight: i < TIMEFRAMES.length - 1 ? '1px solid var(--color-border)' : 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              cursor: timeframeLoading ? 'wait' : 'pointer',
              transition: 'all 0.15s',
              background: timeframe === tf.key ? 'var(--color-accent)' : 'transparent',
              color: timeframe === tf.key ? '#fff' : 'var(--color-text-muted)',
            }}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{
        fontSize: '9px', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-display)', letterSpacing: '0.5px',
      }}>
        GEOSTOCK AI SENTIMENT SCORE — NOT FINANCIAL ADVICE
      </p>
    </motion.div>
  );
}
