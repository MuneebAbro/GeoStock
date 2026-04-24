import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import StocksShowcase from './StocksShowcase';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import DemoChart from './DemoChart';
import PSXSection from './PSXSection';
import CTASection from './CTASection';

function SectionDivider({ label }) {
  return (
    <div style={{
      maxWidth: '1100px', margin: '0 auto',
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '0 24px',
    }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
      {label && (
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '3px',
          color: 'var(--color-text-muted)', textTransform: 'uppercase', flexShrink: 0,
        }}>
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
    </div>
  );
}

export default function LandingPage({ onSearchFocus, onStockSearch }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      <HeroSection onSearchFocus={onSearchFocus} />

      <SectionDivider label="MARKETS" />
      <StocksShowcase onStockSearch={onStockSearch} />

      <SectionDivider label="CAPABILITIES" />
      <FeaturesSection />

      <SectionDivider label="HOW IT WORKS" />
      <HowItWorks />

      <SectionDivider label="CHART PREVIEW" />
      <DemoChart />

      <SectionDivider label="PSX" />
      <PSXSection onStockSearch={onStockSearch} />

      <SectionDivider />
      <CTASection onSearchFocus={onSearchFocus} />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '32px 20px',
        borderTop: '1px solid var(--color-border)',
        marginTop: '20px',
      }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '13px',
          color: 'var(--color-text-muted)', letterSpacing: '0.2px',
        }}>
          GeoStock — AI-powered geopolitical stock analysis &nbsp;·&nbsp; Not financial advice
        </div>
        <div style={{
          fontSize: '11px', color: 'var(--color-text-muted)',
          marginTop: '6px', opacity: 0.5, fontFamily: 'var(--font-display)',
          letterSpacing: '1px', fontSize: '9px',
        }}>
          BUILT WITH REACT · GROQ AI · REAL-TIME MARKET DATA
        </div>
      </footer>
    </motion.div>
  );
}
