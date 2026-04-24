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

// SVG Gauge dimensions
const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 95;
const STROKE_WIDTH = 14;
const START_ANGLE = 135; // degrees from 12 o'clock position
const END_ANGLE = 405;   // 135 + 270 degree sweep
const SWEEP = 270;

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const rad = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function Needle({ angle, color }) {
  const tip = polarToCartesian(CENTER, CENTER, RADIUS - 20, angle);
  const tail = polarToCartesian(CENTER, CENTER, 15, angle + 180);
  const left = polarToCartesian(CENTER, CENTER, 8, angle - 90);
  const right = polarToCartesian(CENTER, CENTER, 8, angle + 90);

  return (
    <g>
      <polygon
        points={`${tip.x},${tip.y} ${left.x},${left.y} ${tail.x},${tail.y} ${right.x},${right.y}`}
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <circle cx={CENTER} cy={CENTER} r={10} fill="var(--color-bg-surface)" stroke={color} strokeWidth={2} />
      <circle cx={CENTER} cy={CENTER} r={4} fill={color} />
    </g>
  );
}

export default function PotentialMeter({ potentialScore, timeframe, timeframeLoading, onTimeframeChange }) {
  const score = potentialScore?.potential_score ?? 50;
  const [animatedScore, setAnimatedScore] = useState(0);
  const frameRef = useRef(null);

  // Animate score
  useEffect(() => {
    const startTime = performance.now();
    const startVal = 0;
    const duration = 1500;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Spring-like easing
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
  const needleAngle = START_ANGLE + (animatedScore / 100) * SWEEP;
  const filledAngle = START_ANGLE + (animatedScore / 100) * SWEEP;
  const gaugeColor = getGaugeColor(score);

  // Build zone arcs
  const redEnd = START_ANGLE + 0.3 * SWEEP;
  const yellowEnd = START_ANGLE + 0.6 * SWEEP;
  const greenEnd = END_ANGLE;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 24px',
      }}
    >
      {/* Timeframe Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        background: 'var(--color-bg-primary)',
        borderRadius: '8px',
        padding: '3px',
        border: '1px solid var(--color-border)',
      }}>
        {TIMEFRAMES.map(tf => (
          <button
            key={tf.key}
            onClick={() => onTimeframeChange(tf.key)}
            disabled={timeframeLoading}
            style={{
              padding: '7px 18px',
              borderRadius: '6px',
              border: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              cursor: timeframeLoading ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              background: timeframe === tf.key ? 'var(--color-bg-elevated)' : 'transparent',
              color: timeframe === tf.key ? 'var(--color-accent)' : 'var(--color-text-muted)',
              boxShadow: timeframe === tf.key ? '0 0 10px rgba(0, 255, 148, 0.1)' : 'none',
            }}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* SVG Gauge */}
      <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF3B5C" />
              <stop offset="40%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#00FF94" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track */}
          <path
            d={describeArc(CENTER, CENTER, RADIUS, START_ANGLE, END_ANGLE)}
            fill="none"
            stroke="var(--color-bg-elevated)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />

          {/* Red zone (0-30%) */}
          <path
            d={describeArc(CENTER, CENTER, RADIUS, START_ANGLE, redEnd)}
            fill="none"
            stroke="rgba(255, 59, 92, 0.2)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />

          {/* Yellow zone (31-60%) */}
          <path
            d={describeArc(CENTER, CENTER, RADIUS, redEnd, yellowEnd)}
            fill="none"
            stroke="rgba(255, 215, 0, 0.2)"
            strokeWidth={STROKE_WIDTH}
          />

          {/* Green zone (61-100%) */}
          <path
            d={describeArc(CENTER, CENTER, RADIUS, yellowEnd, greenEnd)}
            fill="none"
            stroke="rgba(0, 255, 148, 0.2)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />

          {/* Filled arc */}
          {animatedScore > 0.5 && (
            <path
              d={describeArc(CENTER, CENTER, RADIUS, START_ANGLE, filledAngle)}
              fill="none"
              stroke={gaugeColor}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              filter="url(#glow)"
              style={{
                filter: `drop-shadow(0 0 6px ${gaugeColor})`,
              }}
            />
          )}

          {/* Tick marks */}
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(tick => {
            const angle = START_ANGLE + (tick / 100) * SWEEP;
            const outer = polarToCartesian(CENTER, CENTER, RADIUS + 12, angle);
            const inner = polarToCartesian(CENTER, CENTER, RADIUS + 6, angle);
            return (
              <line
                key={tick}
                x1={outer.x} y1={outer.y}
                x2={inner.x} y2={inner.y}
                stroke="var(--color-text-muted)"
                strokeWidth={tick % 50 === 0 ? 2 : 1}
                opacity={0.4}
              />
            );
          })}

          {/* Score labels */}
          {[0, 50, 100].map(label => {
            const angle = START_ANGLE + (label / 100) * SWEEP;
            const pos = polarToCartesian(CENTER, CENTER, RADIUS + 24, angle);
            return (
              <text
                key={label}
                x={pos.x} y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-muted)"
                fontSize="10"
                fontFamily="var(--font-display)"
              >
                {label}
              </text>
            );
          })}

          {/* Needle */}
          <Needle angle={needleAngle} color={gaugeColor} />

          {/* Center score display */}
          <text
            x={CENTER} y={CENTER + 30}
            textAnchor="middle"
            fill={gaugeColor}
            fontSize="38"
            fontWeight="800"
            fontFamily="var(--font-display)"
            style={{ filter: `drop-shadow(0 0 8px ${gaugeColor}40)` }}
          >
            {Math.round(animatedScore)}
          </text>
          <text
            x={CENTER} y={CENTER + 50}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize="10"
            fontFamily="var(--font-display)"
            letterSpacing="2"
          >
            POTENTIAL
          </text>
        </svg>

        {timeframeLoading && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10, 10, 15, 0.7)',
            borderRadius: '50%',
          }}>
            <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%' }} />
          </div>
        )}
      </div>

      {/* Summary */}
      <motion.div
        key={score}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginTop: '16px' }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          fontWeight: 700,
          color: gaugeColor,
          marginBottom: '4px',
        }}>
          {score}% Upside Potential — {potentialScore?.timeframe || timeframe}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          maxWidth: '280px',
          lineHeight: '1.4',
        }}>
          {potentialScore?.one_line_summary || ''}
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '8px',
          padding: '3px 10px',
          borderRadius: '4px',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 600,
            color: zone.color,
          }}>
            {potentialScore?.stance || zone.label}
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>•</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            color: 'var(--color-text-secondary)',
          }}>
            {potentialScore?.confidence || 'Medium'} Confidence
          </span>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <p style={{
        fontSize: '9px',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        marginTop: '16px',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.3px',
      }}>
        GeoStock AI Sentiment Score. This is not financial advice.
      </p>
    </motion.div>
  );
}
