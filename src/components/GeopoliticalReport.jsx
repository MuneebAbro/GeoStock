import React from 'react';
import { motion } from 'framer-motion';
import { GEOPOLITICAL_TAGS, IMPACT_DIRECTIONS, IMPACT_MAGNITUDES } from '../constants/geopoliticalTags';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('GeopoliticalReport');

function NewsTag({ tag }) {
  const tagInfo = GEOPOLITICAL_TAGS[tag] || { color: '#A0A0B0', icon: '📰' };
  return (
    <span className="tag-pill" style={{ background: `${tagInfo.color}15`, color: tagInfo.color, border: `1px solid ${tagInfo.color}30` }}>
      {tagInfo.icon} {tag}
    </span>
  );
}

function DirectionBadge({ direction }) {
  const d = IMPACT_DIRECTIONS[direction] || IMPACT_DIRECTIONS.Neutral;
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: d.color }}>
      {d.symbol} {direction}
    </span>
  );
}

function MagnitudeBadge({ magnitude }) {
  const m = IMPACT_MAGNITUDES[magnitude] || IMPACT_MAGNITUDES.Low;
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, color: m.color,
      padding: '2px 6px', borderRadius: '3px', background: `${m.color}12`, border: `1px solid ${m.color}25` }}>
      {magnitude}
    </span>
  );
}

export default function GeopoliticalReport({ geoReport }) {
  const taggedNews = geoReport?.tagged_news || [];
  const paragraphs = geoReport?.analysis_paragraphs || [];

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }} style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '18px' }}>🌍</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, margin: 0,
          letterSpacing: '1.5px', textTransform: 'uppercase' }}>Geopolitical Impact Report</h2>
      </div>

      {/* Tagged Headlines */}
      {taggedNews.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          {taggedNews.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0',
                borderBottom: i < taggedNews.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: '1.4', marginBottom: '6px' }}>
                  {item.headline}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <NewsTag tag={item.tag} />
                  <DirectionBadge direction={item.impact_direction} />
                  <MagnitudeBadge magnitude={item.impact_magnitude} />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                    {item.source} • {item.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Analysis */}
      {paragraphs.length > 0 && (
        <div style={{ background: 'var(--color-bg-elevated)', borderRadius: '10px', padding: '20px',
          border: '1px solid var(--color-border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px',
            color: 'var(--color-text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
            AI ANALYSIS
          </div>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.7',
              marginBottom: i < paragraphs.length - 1 ? '12px' : 0 }}>
              {p}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
