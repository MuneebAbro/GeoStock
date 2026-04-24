import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Bar, BarChart, Cell } from 'recharts';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('PriceChart');

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border-active)',
      padding: '10px 14px',
      fontSize: '11px',
      fontFamily: 'var(--font-display)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: '6px', letterSpacing: '0.5px' }}>{label}</div>
      {d?.open !== undefined ? (
        <>
          <div style={{ color: 'var(--color-text-secondary)' }}>O: <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>${d.open?.toFixed(2)}</span></div>
          <div style={{ color: 'var(--color-text-secondary)' }}>H: <span style={{ color: 'var(--color-bullish)', fontWeight: 600 }}>${d.high?.toFixed(2)}</span></div>
          <div style={{ color: 'var(--color-text-secondary)' }}>L: <span style={{ color: 'var(--color-bearish)', fontWeight: 600 }}>${d.low?.toFixed(2)}</span></div>
          <div style={{ color: 'var(--color-text-secondary)' }}>C: <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>${d.close?.toFixed(2)}</span></div>
        </>
      ) : (
        <div style={{ color: 'var(--color-accent-bright)', fontWeight: 700 }}>
          ${payload[0]?.value?.toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default function PriceChart({ history, isPSX }) {
  const [chartType, setChartType] = useState('line');

  if (!history || history.length === 0) return null;

  const data = [...history].reverse().map(d => ({
    ...d,
    date: d.date?.slice(5) || '',
  }));

  const minPrice = Math.min(...data.map(d => d.low || d.close)) * 0.995;
  const maxPrice = Math.max(...data.map(d => d.high || d.close)) * 1.005;
  const pricePrefix = isPSX ? 'PKR ' : '$';

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{ padding: '24px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, margin: 0,
            letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-primary)',
          }}>
            30-DAY PRICE HISTORY
          </h2>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '2px',
            color: 'var(--color-text-muted)', marginTop: '2px',
          }}>
            INDIGO — PRICE MOMENTUM
          </div>
        </div>

        {/* Chart type toggle */}
        <div style={{
          display: 'flex',
          border: '1px solid var(--color-border)',
        }}>
          {['line', 'candle'].map((t, i) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRight: i === 0 ? '1px solid var(--color-border)' : 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'uppercase',
                background: chartType === t ? 'var(--color-accent)' : 'transparent',
                color: chartType === t ? '#fff' : 'var(--color-text-muted)',
              }}
            >
              {t === 'line' ? 'LINE' : 'OHLC'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'line' ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              interval={Math.floor(data.length / 6)}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${pricePrefix}${v.toFixed(0)}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#818CF8', stroke: 'var(--color-bg-surface)', strokeWidth: 2 }}
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              interval={Math.floor(data.length / 6)}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${pricePrefix}${v.toFixed(0)}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="close" barSize={6} radius={[1, 1, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.close >= entry.open ? '#10B981' : '#EF4444'}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}
