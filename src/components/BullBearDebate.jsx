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
  }, [done]); // intentionally omit onDone — it's stable enough via parent

  const bc = side === 'bull' ? 'var(--color-bullish)' : 'var(--color-bearish)';
  const bg = side === 'bull' ? 'rgba(0,255,148,0.03)' : 'rgba(255,59,92,0.03)';
  return (
    <motion.div initial={{ opacity: 0, x: side === 'bull' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.15 }}
      style={{ background: bg, border: `1px solid ${side === 'bull' ? 'rgba(0,255,148,0.15)' : 'rgba(255,59,92,0.15)'}`,
        borderLeft: `3px solid ${bc}`, borderRadius: '8px', padding: '14px 16px', marginBottom: '10px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: bc,
        marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.5', minHeight: '40px' }}>
        {active ? <span>{displayed}{!done && <span className="typewriter-cursor">&nbsp;</span>}</span> : argument}
      </div>
    </motion.div>
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

  const vc = verdict.stance === 'Bullish' ? 'var(--color-bullish)' : verdict.stance === 'Bearish' ? 'var(--color-bearish)' : 'var(--color-yellow)';

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }} style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <span style={{ fontSize: '20px' }}>🐂</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, letterSpacing: '2px',
          textTransform: 'uppercase', margin: 0, background: 'linear-gradient(90deg, var(--color-bullish), var(--color-bearish))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BULL vs BEAR</h2>
        <span style={{ fontSize: '20px' }}>🐻</span>
      </div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {['bull', 'bear', 'verdict'].map(p => (
          <div key={p} style={{ flex: 1, height: '3px', borderRadius: '2px', transition: 'background 0.5s',
            background: phase === p || (p === 'bull' && phase !== 'bull') || (p === 'bear' && phase === 'verdict')
              ? (p === 'bull' ? 'var(--color-bullish)' : p === 'bear' ? 'var(--color-bearish)' : vc) : 'var(--color-border)' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--color-bullish)',
            marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '1px' }}>
            <span>🐂</span> BULL CASE
            {phase === 'bull' && <span className="live-dot" style={{ width: 6, height: 6 }} />}
          </div>
          {bullArgs.map((a, i) => <ArgCard key={i} title={a.title} argument={a.argument} side="bull" index={i}
            active={phase === 'bull'} onDone={() => setBullDone(p => p + 1)} />)}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--color-bearish)',
            marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '1px' }}>
            <span>🐻</span> BEAR CASE
            {phase === 'bear' && <span className="live-dot" style={{ width: 6, height: 6, background: 'var(--color-bearish)' }} />}
          </div>
          {bearArgs.map((a, i) => <ArgCard key={i} title={a.title} argument={a.argument} side="bear" index={i}
            active={phase === 'bear'} onDone={() => setBearDone(p => p + 1)} />)}
        </div>
      </div>
      <AnimatePresence>
        {showVerdict && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            style={{ marginTop: '24px', background: 'var(--color-bg-elevated)', border: `1px solid ${vc}40`,
              borderRadius: '12px', padding: '20px 24px', textAlign: 'center', boxShadow: `0 0 30px ${vc}10` }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '3px',
              color: 'var(--color-text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>AI VERDICT</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: vc,
                textTransform: 'uppercase' }}>{verdict.stance || 'Neutral'}</span>
              <span style={{ padding: '3px 10px', borderRadius: '4px', background: `${vc}15`, border: `1px solid ${vc}30`,
                fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, color: vc }}>
                {verdict.confidence || 'Medium'} Confidence</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0,
              maxWidth: '500px', marginInline: 'auto' }}>{verdict.summary || ''}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
