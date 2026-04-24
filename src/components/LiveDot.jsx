import React from 'react';

export default function LiveDot({ size = 8, className = '' }) {
  return (
    <span
      className={`live-dot ${className}`}
      style={{ width: size, height: size }}
      title="Live data"
    />
  );
}
