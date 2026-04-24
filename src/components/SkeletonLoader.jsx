import React from 'react';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('SkeletonLoader');

export default function SkeletonLoader({ type = 'text', width, height, className = '' }) {
  const styles = {
    text: { width: width || '100%', height: height || '16px' },
    title: { width: width || '60%', height: height || '24px' },
    circle: { width: width || '200px', height: height || '200px', borderRadius: '50%' },
    card: { width: width || '100%', height: height || '120px' },
    chart: { width: width || '100%', height: height || '300px' },
    badge: { width: width || '60px', height: height || '20px', borderRadius: '4px' },
  };

  return (
    <div
      className={`skeleton ${className}`}
      style={styles[type] || styles.text}
    />
  );
}

export function SkeletonCard({ children, className = '' }) {
  return (
    <div className={`card ${className}`} style={{ opacity: 0.7 }}>
      {children}
    </div>
  );
}

export function StockHeaderSkeleton() {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <SkeletonLoader type="badge" width="50px" />
        <SkeletonLoader type="title" width="200px" />
      </div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <SkeletonLoader type="text" width="120px" height="36px" />
        <SkeletonLoader type="text" width="80px" height="20px" />
        <SkeletonLoader type="text" width="80px" height="20px" />
        <SkeletonLoader type="text" width="100px" height="20px" />
      </div>
    </div>
  );
}

export function MeterSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px' }}>
      <SkeletonLoader type="circle" width="220px" height="220px" />
      <SkeletonLoader type="text" width="180px" height="20px" className="mt-4" style={{ marginTop: '20px' }} />
    </div>
  );
}

export function DebateSkeleton() {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <SkeletonLoader type="title" width="200px" className="mb-4" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SkeletonLoader type="card" height="80px" />
          <SkeletonLoader type="card" height="80px" />
          <SkeletonLoader type="card" height="80px" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SkeletonLoader type="card" height="80px" />
          <SkeletonLoader type="card" height="80px" />
          <SkeletonLoader type="card" height="80px" />
        </div>
      </div>
    </div>
  );
}
