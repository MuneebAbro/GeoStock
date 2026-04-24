import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('BullBearDebate');

function useTypewriter(text, speed = 30, delay = 0, enabled = false) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text || '');
      setDone(!enabled);
      return;
    }
    setDisplayed('');
    setDone(false);
    const words = text.split(' ');
    let i = 0;
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        i++;
        setDisplayed(words.slice(0, i).join(' '));
        if (i >= words.length) {
          clearInterval(intervalRef.current);
          setDone(true);
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [text, speed, delay, enabled]);
  return { displayed, done };
}

function ArgCard({ title, argument, side, index, active, onDone }) {
  const { displayed, done } = useTypewriter(argument, 30, index * 200, active);
  const calledRef = useRef(false);

  useEffect(() => {
    if (done && !calledRef.current && onDone) {
      calledRef.current = true;
      onDone();
    }
  }, [done]);

  const bc = side === 'bull' ? 'var(--color-bullish)' : 'var(--color-bearish)';
  const bg = side === 'bull' ? 'rgba(16,185,129,0.02)' : 'rgba(239,68,68,0.02)';
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'bull' ? -16 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.12 }}
      style={{
        background: bg,
        borderLeft: `3px solid ${bc}`,
        padding: '12px 14px',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
          color: bc, flexShrink: 0, letterSpacing: '0.5px', paddingTop: '1px',
        }}>
          {num}
        </span>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700,
            color: bc, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '13px', color: 'var(--color-text-primary)',
            lineHeight: '1.55', minHeight: '36px', fontFamily: 'var(--font-body)',
          }}>
            {active ? (
              <span>{displayed}{!done && <span className="typewriter-cursor">&nbsp;</span>}</span>
            ) : argument}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ConfidenceBar({ side, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const color = side === 'bull' ? 'var(--color-bullish)' : 'var(--color-bearish)';
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '8px',
          letterSpacing: '2px', color: 'var(--color-text-muted)', textTransform: 'uppercase',
        }}>
          AI CONFIDENCE
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color, fontWeight: 700 }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div style={{ height: '2px', background: 'var(--color-border)', position: 'relative' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ height: '100%', background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    </div>
  );
}

export default function BullBearDebate({ debate }) {
  const [phase, setPhase] = useState('bull');
  const [bullDone, setBullDone] = useState(0);
  const [bearDone, setBearDone] = useState(0);
  const [showVerdict, setShowVerdict] = useState(false);
  const bullArgs = debate?.bull_arguments || [];
  const bearArgs = debate?.bear_arguments || [];
  const verdict = debate?.verdict || {};
  const phaseTransitioned = useRef({ bull: false, bear: false });

  useEffect(() => {
    if (bullDone >= bullArgs.length && bullArgs.length > 0 && phase === 'bull' && !phaseTransitioned.current.bull) {
      phaseTransitioned.current.bull = true;
      const t = setTimeout(() => setPhase('bear'), 400);
      return () => clearTimeout(t);
    }
  }, [bullDone, bullArgs.length, phase]);

  useEffect(() => {
    if (bearDone >= bearArgs.length && bearArgs.length > 0 && phase === 'bear' && !phaseTransitioned.current.bear) {
      phaseTransitioned.current.bear = true;
      const t = setTimeout(() => { setPhase('verdict'); setShowVerdict(true); }, 600);
      return () => clearTimeout(t);
    }
  }, [bearDone, bearArgs.length, phase]);

  const vc = verdict.stance === 'Bullish' ? 'var(--color-bullish)'
    : verdict.stance === 'Bearish' ? 'var(--color-bearish)' : 'var(--color-geo)';

  const totalArgs = bullArgs.length + bearArgs.length;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{ padding: '28px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase', margin: 0,
          color: 'var(--color-text-primary)',
        }}>
          BULL / BEAR INTELLIGENCE BRIEF
        </h2>
        {phase !== 'verdict' && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '2px',
            color: phase === 'bull' ? 'var(--color-bullish)' : 'var(--color-bearish)',
            textTransform: 'uppercase',
          }}>
            {phase === 'bull' ? '▲ BULL CASE LOADING' : '▼ BEAR CASE LOADING'}
          </span>
        )}
      </div>

      {/* Phase progress bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {['bull', 'bear', 'verdict'].map(p => (
          <div key={p} style={{
            flex: 1, height: '2px', transition: 'background 0.5s',
            background: phase === p || (p === 'bull' && phase !== 'bull') || (p === 'bear' && phase === 'verdict')
              ? (p === 'bull' ? 'var(--color-bullish)' : p === 'bear' ? 'var(--color-bearish)' : vc)
              : 'var(--color-border)',
          }} />
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Bull */}
        <div>
          <div style={{
            borderTop: '3px solid var(--color-bullish)',
            paddingTop: '12px', marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700,
                color: 'var(--color-bullish)', letterSpacing: '2px', textTransform: 'uppercase',
              }}>
                ▲ BULL CASE
              </span>
              {phase === 'bull' && <span className="live-dot" style={{ background: 'var(--color-bullish)' }} />}
            </div>
          </div>
          <ConfidenceBar side="bull" count={bullArgs.length} total={totalArgs} />
          {bullArgs.map((a, i) => (
            <ArgCard key={i} title={a.title} argument={a.argument} side="bull" index={i}
              active={phase === 'bull'} onDone={() => setBullDone(p => p + 1)} />
          ))}
        </div>

        {/* Bear */}
        <div>
          <div style={{
            borderTop: '3px solid var(--color-bearish)',
            paddingTop: '12px', marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700,
                color: 'var(--color-bearish)', letterSpacing: '2px', textTransform: 'uppercase',
              }}>
                ▼ BEAR CASE
              </span>
              {phase === 'bear' && <span className="live-dot" style={{ background: 'var(--color-bearish)' }} />}
            </div>
          </div>
          <ConfidenceBar side="bear" count={bearArgs.length} total={totalArgs} />
          {bearArgs.map((a, i) => (
            <ArgCard key={i} title={a.title} argument={a.argument} side="bear" index={i}
              active={phase === 'bear'} onDone={() => setBearDone(p => p + 1)} />
          ))}
        </div>
      </div>

      {/* Verdict */}
      <AnimatePresence>
        {showVerdict && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            style={{
              marginTop: '24px', background: 'var(--color-bg-elevated)',
              border: `1px solid ${vc}40`, padding: '20px 24px',
              borderLeft: `4px solid ${vc}`,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px',
              color: 'var(--color-text-muted)', marginBottom: '10px', textTransform: 'uppercase',
            }}>
              AI VERDICT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800,
                color: vc, textTransform: 'uppercase',
              }}>
                {verdict.stance || 'Neutral'}
              </span>
              <span style={{
                padding: '3px 10px', background: `${vc}15`, border: `1px solid ${vc}30`,
                fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600,
                color: vc, letterSpacing: '1px',
              }}>
                {verdict.confidence || 'Medium'} CONFIDENCE
              </span>
            </div>
            <p style={{
              fontSize: '13px', color: 'var(--color-text-secondary)',
              lineHeight: '1.7', margin: 0, fontFamily: 'var(--font-body)',
            }}>
              {verdict.summary || ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
