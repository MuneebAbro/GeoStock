import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchTickers } from '../utils/marketDetector';
import { moduleLoaded, logInfo } from '../utils/logger';

moduleLoaded('SearchBar');

const RECENT_SEARCHES_KEY = 'geostock_recent_searches';
const MAX_RECENT = 8;

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
  } catch { return []; }
}

function addRecentSearch(item) {
  const recent = getRecentSearches().filter(r => r.ticker !== item.ticker);
  recent.unshift(item);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

// Magnifier SVG
function SearchIcon({ color = 'currentColor' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5" cy="6.5" r="5" stroke={color} strokeWidth="1.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (query.length > 0) {
      const results = searchTickers(query);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setSelectedIndex(-1);
    } else {
      const recent = getRecentSearches();
      setSuggestions(recent.map(r => ({ ...r, isRecent: true })));
      setShowDropdown(false);
    }
  }, [query]);

  const handleSelect = useCallback((item) => {
    logInfo('SearchBar', 'ticker selected', { ticker: item?.ticker });
    setQuery(item.ticker);
    setShowDropdown(false);
    addRecentSearch(item);
    onSearch(item.ticker);
  }, [onSearch]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
    } else if (query.trim()) {
      const ticker = query.trim().toUpperCase();
      const results = searchTickers(ticker);
      const item = results[0] || { ticker, name: ticker, exchange: 'NASDAQ', sector: 'Unknown' };
      handleSelect(item);
    }
  }, [query, selectedIndex, suggestions, handleSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }, [suggestions.length]);

  const handleFocus = () => {
    setFocused(true);
    if (query.length === 0) {
      const recent = getRecentSearches();
      if (recent.length > 0) {
        setSuggestions(recent.map(r => ({ ...r, isRecent: true })));
        setShowDropdown(true);
      }
    } else if (suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = focused || showDropdown;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{
            boxShadow: isActive
              ? '0 0 0 2px rgba(99,102,241,0.35), 0 8px 32px rgba(99,102,241,0.12)'
              : '0 2px 12px rgba(0,0,0,0.25)',
          }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: isActive
              ? 'rgba(18,18,32,0.92)'
              : 'rgba(14,14,24,0.80)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${isActive ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.14)'}`,
            borderRadius: showDropdown ? '16px 16px 0 0' : '16px',
            transition: 'background 0.2s, border-color 0.2s, border-radius 0.15s',
            overflow: 'hidden',
          }}
        >
          {/* Search icon */}
          <div style={{
            padding: '0 4px 0 18px', flexShrink: 0, display: 'flex', alignItems: 'center',
            color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
            transition: 'color 0.2s',
          }}>
            {loading ? (
              <div style={{
                width: '16px', height: '16px',
                border: '2px solid rgba(99,102,241,0.25)',
                borderTopColor: 'var(--color-accent)',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }} />
            ) : (
              <SearchIcon color="currentColor" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search ticker or company — e.g. NVDA, Apple, OGDC…"
            disabled={loading}
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 400,
              padding: '14px 12px',
              letterSpacing: '0.1px',
              minWidth: 0,
            }}
          />

          {/* Clear button */}
          <AnimatePresence>
            {query && !loading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                type="button"
                onClick={() => { setQuery(''); setSuggestions([]); setShowDropdown(false); inputRef.current?.focus(); }}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none',
                  color: 'var(--color-text-muted)', cursor: 'pointer',
                  width: '22px', height: '22px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', marginRight: '10px', flexShrink: 0,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div style={{
            width: '1px', height: '26px',
            background: 'rgba(99,102,241,0.2)',
            flexShrink: 0, marginRight: '8px',
          }} />

          {/* ANALYZE button — gradient pill */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.03 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            style={{
              background: loading
                ? 'rgba(99,102,241,0.4)'
                : 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #A78BFA 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.3px',
              padding: '9px 22px',
              margin: '5px 6px',
              cursor: loading ? 'wait' : 'pointer',
              flexShrink: 0,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'background 0.2s, box-shadow 0.2s',
              display: 'flex', alignItems: 'center', gap: '7px',
            }}
          >
            {/* Arrow icon */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Analyze
          </motion.button>
        </motion.div>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(14,14,26,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(99,102,241,0.5)',
              borderTop: '1px solid rgba(99,102,241,0.15)',
              borderRadius: '0 0 16px 16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              zIndex: 100,
              overflow: 'hidden',
            }}
          >
            {suggestions[0]?.isRecent && (
              <div style={{
                padding: '8px 18px 5px',
                fontSize: '9px', fontFamily: 'var(--font-display)',
                color: 'var(--color-text-muted)', letterSpacing: '2px', textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="var(--color-text-muted)" strokeWidth="1" />
                  <path d="M5 3v2l1.5 1.5" stroke="var(--color-text-muted)" strokeWidth="1" strokeLinecap="round" />
                </svg>
                RECENT SEARCHES
              </div>
            )}
            {suggestions.map((item, index) => (
              <motion.div
                key={item.ticker}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  background: selectedIndex === index
                    ? 'rgba(99,102,241,0.1)'
                    : 'transparent',
                  borderLeft: selectedIndex === index
                    ? '2px solid var(--color-accent)'
                    : '2px solid transparent',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Ticker symbol */}
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
                    color: selectedIndex === index ? 'var(--color-accent-bright)' : 'var(--color-text-primary)',
                    minWidth: '64px', letterSpacing: '0.5px',
                  }}>
                    {item.ticker}
                  </div>
                  {/* Name */}
                  <div style={{
                    fontSize: '12px', color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-body)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px',
                  }}>
                    {item.name}
                  </div>
                </div>
                <span className={`badge badge-${(item.exchange || 'nasdaq').toLowerCase()}`}>
                  {item.exchange || 'NASDAQ'}
                </span>
              </motion.div>
            ))}

            {/* Bottom hint */}
            <div style={{
              padding: '6px 18px',
              fontSize: '9px', color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-display)', letterSpacing: '0.5px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', gap: '14px',
            }}>
              <span><kbd style={{ padding: '1px 4px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>↑↓</kbd> navigate</span>
              <span><kbd style={{ padding: '1px 4px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>↵</kbd> select</span>
              <span><kbd style={{ padding: '1px 4px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>Esc</kbd> close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
