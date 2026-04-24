import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DEMO_CHART_DATA } from './demoData';

export default function DemoChart() {
  const svgRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 320 });
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const pad = { top: 30, right: 30, bottom: 50, left: 55 };
  const data = DEMO_CHART_DATA;
  const prices = data.map(d => d.price);
  const minP = Math.min(...prices) - 5;
  const maxP = Math.max(...prices) + 10;
  const chartW = dims.w - pad.left - pad.right;
  const chartH = dims.h - pad.top - pad.bottom;

  function x(i) { return pad.left + (i / (data.length - 1)) * chartW; }
  function y(p) { return pad.top + (1 - (p - minP) / (maxP - minP)) * chartH; }

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.price)}`).join(' ');
  const areaPath = linePath + ` L ${x(data.length - 1)} ${pad.top + chartH} L ${x(0)} ${pad.top + chartH} Z`;

  const events = data.map((d, i) => d.event ? { ...d, idx: i } : null).filter(Boolean);

  return (
    <section style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
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
          DEMO CHART
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800,
          color: 'var(--color-text-primary)', marginBottom: '8px',
        }}>
          See Events Move Markets
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
          Geopolitical events mapped directly onto price action
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px',
          overflow: 'hidden',
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height={dims.h}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,255,148,0.15)" />
              <stop offset="100%" stopColor="rgba(0,255,148,0)" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00FF94" />
              <stop offset="100%" stopColor="#448AFF" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const yPos = pad.top + pct * chartH;
            const price = Math.round(maxP - pct * (maxP - minP));
            return (
              <g key={i}>
                <line x1={pad.left} y1={yPos} x2={dims.w - pad.right} y2={yPos}
                  stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4,4" />
                <text x={pad.left - 10} y={yPos + 4} textAnchor="end"
                  fill="var(--color-text-muted)" fontSize="10" fontFamily="var(--font-display)">
                  ${price}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.filter((_, i) => i % 3 === 0).map((d, i) => {
            const idx = data.indexOf(d);
            return (
              <text key={i} x={x(idx)} y={dims.h - 10} textAnchor="middle"
                fill="var(--color-text-muted)" fontSize="10" fontFamily="var(--font-display)">
                {d.date}
              </text>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#chartGrad)" />

          {/* Price line */}
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,148,0.3))' }} />

          {/* Data points */}
          {data.map((d, i) => (
            <circle key={i} cx={x(i)} cy={y(d.price)} r={hoveredIdx === i ? 5 : 2.5}
              fill={d.event ? '#FFD700' : '#00FF94'}
              stroke={d.event ? '#FFD700' : 'none'} strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'r 0.2s' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}

          {/* Event markers */}
          {events.map((ev, i) => (
            <g key={i}>
              <line x1={x(ev.idx)} y1={y(ev.price) - 12} x2={x(ev.idx)} y2={pad.top}
                stroke="rgba(255,215,0,0.3)" strokeWidth="1" strokeDasharray="3,3" />
              <rect
                x={x(ev.idx) - 55} y={pad.top - 2}
                width="110" height="22" rx="4"
                fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.3)" strokeWidth="1"
              />
              <text x={x(ev.idx)} y={pad.top + 12} textAnchor="middle"
                fill="#FFD700" fontSize="9" fontFamily="var(--font-display)" fontWeight="600">
                ⚡ {ev.event}
              </text>
            </g>
          ))}

          {/* Hover tooltip */}
          {hoveredIdx !== null && (
            <g>
              <rect x={x(hoveredIdx) - 35} y={y(data[hoveredIdx].price) - 28}
                width="70" height="22" rx="4"
                fill="var(--color-bg-elevated)" stroke="var(--color-accent)" strokeWidth="1" />
              <text x={x(hoveredIdx)} y={y(data[hoveredIdx].price) - 14} textAnchor="middle"
                fill="var(--color-accent)" fontSize="11" fontFamily="var(--font-display)" fontWeight="700">
                ${data[hoveredIdx].price}
              </text>
            </g>
          )}
        </svg>
      </motion.div>
    </section>
  );
}
