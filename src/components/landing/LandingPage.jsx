import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import StocksShowcase from './StocksShowcase';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import DemoChart from './DemoChart';
import PSXSection from './PSXSection';
import CTASection from './CTASection';

export default function LandingPage({ onSearchFocus, onStockSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection onSearchFocus={onSearchFocus} />

      {/* Divider */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-border-glow), transparent)',
      }} />

      <StocksShowcase onStockSearch={onStockSearch} />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-border-glow), transparent)',
      }} />

      <FeaturesSection />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-border-glow), transparent)',
      }} />

      <HowItWorks />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-border-glow), transparent)',
      }} />

      <DemoChart />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-border-glow), transparent)',
      }} />

      <PSXSection onStockSearch={onStockSearch} />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-border-glow), transparent)',
      }} />

      <CTASection onSearchFocus={onSearchFocus} />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 20px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '11px',
          color: 'var(--color-text-muted)', letterSpacing: '0.5px',
        }}>
          GeoStock — AI-Powered Geopolitical Stock Analysis • Not Financial Advice
        </div>
        <div style={{
          fontSize: '10px', color: 'var(--color-text-muted)',
          marginTop: '6px', opacity: 0.6,
        }}>
          Built with React, Groq AI, and real-time market data
        </div>
      </footer>
    </motion.div>
  );
}
