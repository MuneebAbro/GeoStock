import React from 'react';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('LiveDot');

export default function LiveDot({ size = 8, className = '' }) {
  return (
    <span
      className={`live-dot ${className}`}
      style={{ width: size, height: size }}
      title="Live data"
    />
  );
}
