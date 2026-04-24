import React from 'react';
import { motion } from 'framer-motion';
import { GEOPOLITICAL_TAGS, IMPACT_DIRECTIONS, IMPACT_MAGNITUDES } from '../constants/geopoliticalTags';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('GeopoliticalReport');

function NewsTag({ tag }) {
  const tagInfo = GEOPOLITICAL_TAGS[tag] || { color: '#8B8BA8', icon: null };
  return (
    <span className="tag-pill" style={{
      background: `${tagInfo.color}12`,
      color: tagInfo.color,
      border: `1px solid ${tagInfo.color}30`,
    }}>
      {tag}
    </span>
  );
}

function DirectionBadge({ direction }) {
  const d = IMPACT_DIRECTIONS[direction] || IMPACT_DIRECTIONS.Neutral;
  return (
    <span style={{
      fontFamily: 'var(--font-display)', fontSize: '11px',
      fontWeight: 700, color: d.color, letterSpacing: '0.5px',
    }}>
      {d.symbol} {direction}
    </span>
  );
}

function MagnitudeBadge({ magnitude }) {
  const m = IMPACT_MAGNITUDES[magnitude] || IMPACT_MAGNITUDES.Low;
  return (
    <span style={{
      fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 600, color: m.color,
      padding: '2px 6px', background: `${m.color}12`, border: `1px solid ${m.color}25`,
      letterSpacing: '1px', textTransform: 'uppercase',
    }}>
      {magnitude}
    </span>
  );
}

// Decorative redacted lines
function RedactedLines() {
  return (
    <div style={{ marginTop: '20px', opacity: 0.25 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '2px', marginBottom: '4px' }}>
        █████ ███████ ████ ██████ ██ ████ ████████ ███
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '2px', marginBottom: '4px' }}>
        ██████ ██ ███ ████ ████████ █████████ █████
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '2px' }}>
        ██ ███████ █████ ██████████ ███ ████ ████
      </div>
    </div>
  );
}

export default function GeopoliticalReport({ geoReport }) {
  const taggedNews = geoReport?.tagged_news || [];
  const paragraphs = geoReport?.analysis_paragraphs || [];

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{ padding: '0', overflow: 'visible' }}
    >
      {/* Amber left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '3px', background: 'var(--color-geo)',
        zIndex: 2,
      }} />

      <div style={{ padding: '24px 28px 24px 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, margin: 0,
            letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-primary)',
          }}>
            GEOPOLITICAL INTELLIGENCE REPORT
          </h2>
          {/* CLASSIFIED stamp */}
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700,
            padding: '3px 8px',
            background: 'rgba(245,158,11,0.08)',
            color: 'var(--color-geo)',
            border: '1px solid rgba(245,158,11,0.3)',
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            [CLASSIFIED]
          </span>
        </div>

        {/* Tagged Headlines */}
        {taggedNews.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            {taggedNews.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '14px 0',
                  borderBottom: i < taggedNews.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                {/* REF number */}
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600,
                  color: 'var(--color-text-muted)', letterSpacing: '1px',
                  flexShrink: 0, paddingTop: '1px',
                  minWidth: '52px',
                }}>
                  REF-{String(i + 1).padStart(3, '0')}
                </span>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)',
                    lineHeight: '1.45', marginBottom: '8px', fontFamily: 'var(--font-body)',
                  }}>
                    {item.headline}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <NewsTag tag={item.tag} />
                    <DirectionBadge direction={item.impact_direction} />
                    <MagnitudeBadge magnitude={item.impact_magnitude} />
                    <span style={{
                      fontSize: '10px', color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-display)', marginLeft: 'auto', letterSpacing: '0.5px',
                    }}>
                      {item.source} · {item.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* AI Analysis */}
        {paragraphs.length > 0 && (
          <div style={{
            background: 'var(--color-bg-elevated)',
            padding: '20px',
            border: '1px solid var(--color-border)',
            borderLeft: '2px solid var(--color-geo)',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px',
              color: 'var(--color-geo)', marginBottom: '14px', textTransform: 'uppercase',
            }}>
              AI ANALYSIS — CONFIDENTIAL
            </div>
            {paragraphs.map((p, i) => (
              <p key={i} style={{
                fontSize: '13px', color: 'var(--color-text-secondary)',
                lineHeight: '1.75', marginBottom: i < paragraphs.length - 1 ? '12px' : 0,
                fontFamily: 'var(--font-body)',
              }}>
                {p}
              </p>
            ))}
            <RedactedLines />
          </div>
        )}
      </div>
    </motion.div>
  );
}
