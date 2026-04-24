import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Bar, BarChart, Cell, ReferenceLine } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '12px', fontFamily: 'var(--font-display)' }}>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
      {d?.open !== undefined ? (
        <>
          <div>O: <span style={{ color: 'var(--color-text-primary)' }}>${d.open?.toFixed(2)}</span></div>
          <div>H: <span style={{ color: 'var(--color-bullish)' }}>${d.high?.toFixed(2)}</span></div>
          <div>L: <span style={{ color: 'var(--color-bearish)' }}>${d.low?.toFixed(2)}</span></div>
          <div>C: <span style={{ color: 'var(--color-text-primary)' }}>${d.close?.toFixed(2)}</span></div>
        </>
      ) : (
        <div style={{ color: 'var(--color-text-primary)' }}>${payload[0]?.value?.toFixed(2)}</div>
      )}
    </div>
  );
}

function CandlestickBar(props) {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;
  const { open, close, high, low } = payload;
  const isBullish = close >= open;
  const color = isBullish ? '#00FF94' : '#FF3B5C';
  const bodyTop = Math.min(open, close);
  const bodyBottom = Math.max(open, close);
  const chartHeight = props.background?.height || 200;
  const yScale = chartHeight / (props.yDomain?.[1] - props.yDomain?.[0] || 1);

  return (
    <g>
      <rect x={x} y={y} width={width} height={Math.max(height, 1)} fill={color} rx={1} opacity={0.9} />
    </g>
  );
}

export default function PriceChart({ history, isPSX }) {
  const [chartType, setChartType] = useState('line');

  if (!history || history.length === 0) return null;

  const data = [...history].reverse().map(d => ({
    ...d,
    date: d.date?.slice(5) || '', // MM-DD format
  }));

  const minPrice = Math.min(...data.map(d => d.low || d.close)) * 0.995;
  const maxPrice = Math.max(...data.map(d => d.high || d.close)) * 1.005;
  const pricePrefix = isPSX ? 'PKR ' : '$';

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }} style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📈</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, margin: 0,
            letterSpacing: '1px', textTransform: 'uppercase' }}>30-Day Price</h2>
        </div>
        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-primary)', borderRadius: '6px',
          padding: '2px', border: '1px solid var(--color-border)' }}>
          {['line', 'candle'].map(t => (
            <button key={t} onClick={() => setChartType(t)}
              style={{ padding: '5px 12px', borderRadius: '4px', border: 'none', fontFamily: 'var(--font-display)',
                fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                background: chartType === t ? 'var(--color-bg-elevated)' : 'transparent',
                color: chartType === t ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
              {t === 'line' ? 'Line' : 'OHLC'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'line' ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF94" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00FF94" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
              axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} interval={Math.floor(data.length / 6)} />
            <YAxis domain={[minPrice, maxPrice]} tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
              axisLine={false} tickLine={false} tickFormatter={v => `${pricePrefix}${v.toFixed(0)}`} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="close" stroke="#00FF94" strokeWidth={2} fill="url(#priceGradient)"
              dot={false} activeDot={{ r: 4, fill: '#00FF94', stroke: 'var(--color-bg-surface)', strokeWidth: 2 }} />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
              axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} interval={Math.floor(data.length / 6)} />
            <YAxis domain={[minPrice, maxPrice]} tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
              axisLine={false} tickLine={false} tickFormatter={v => `${pricePrefix}${v.toFixed(0)}`} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="close" barSize={6} radius={[2, 2, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.close >= entry.open ? '#00FF94' : '#FF3B5C'} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}
