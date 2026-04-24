import React from 'react';
import { moduleLoaded } from '../utils/logger';

moduleLoaded('SkeletonLoader');

export default function SkeletonLoader({ type = 'text', width, height, className = '' }) {
  const styles = {
    text:   { width: width || '100%', height: height || '16px' },
    title:  { width: width || '60%',  height: height || '24px' },
    circle: { width: width || '200px', height: height || '200px', borderRadius: '50%' },
    card:   { width: width || '100%', height: height || '120px' },
    chart:  { width: width || '100%', height: height || '300px' },
    badge:  { width: width || '60px', height: height || '20px' },
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
    <div className={`card ${className}`} style={{ opacity: 0.6 }}>
      {children}
    </div>
  );
}

export function StockHeaderSkeleton() {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <SkeletonLoader type="badge" width="50px" />
        <SkeletonLoader type="title" width="200px" height="40px" />
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <SkeletonLoader type="text" width="120px" height="36px" />
        <SkeletonLoader type="text" width="80px" height="24px" />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
        <SkeletonLoader type="text" width="80px" height="48px" />
        <SkeletonLoader type="text" width="80px" height="48px" />
        <SkeletonLoader type="text" width="100px" height="48px" />
        <SkeletonLoader type="text" width="80px" height="48px" />
      </div>
    </div>
  );
}

export function MeterSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '24px', gap: '16px' }}>
      <SkeletonLoader type="text" width="160px" height="12px" />
      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
        <SkeletonLoader type="text" width="44px" height="160px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <SkeletonLoader type="text" width="80px" height="56px" />
          <SkeletonLoader type="text" width="120px" height="14px" />
          <SkeletonLoader type="text" width="180px" height="14px" />
        </div>
      </div>
      <SkeletonLoader type="text" width="130px" height="32px" />
    </div>
  );
}

export function DebateSkeleton() {
  return (
    <div className="card" style={{ padding: '28px' }}>
      <SkeletonLoader type="title" width="260px" height="20px" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonLoader type="text" width="100%" height="3px" />
          <SkeletonLoader type="card" height="70px" />
          <SkeletonLoader type="card" height="70px" />
          <SkeletonLoader type="card" height="70px" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonLoader type="text" width="100%" height="3px" />
          <SkeletonLoader type="card" height="70px" />
          <SkeletonLoader type="card" height="70px" />
          <SkeletonLoader type="card" height="70px" />
        </div>
      </div>
    </div>
  );
}
