import React, { useState, useEffect, useRef, useCallback } from 'react';
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

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '680px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '0 20px',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          ...(showDropdown ? {
            borderColor: 'var(--color-accent)',
            boxShadow: '0 0 20px rgba(0, 255, 148, 0.08)',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          } : {}),
        }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '18px', marginRight: '12px' }}>⌕</span>
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Search stocks... NVDA, AAPL, OGDC, HBL"
            disabled={loading}
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              padding: '16px 0',
              letterSpacing: '0.5px',
            }}
          />
          {loading && (
            <div style={{
              width: '18px', height: '18px',
              border: '2px solid var(--color-border)',
              borderTopColor: 'var(--color-accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          )}
          {query && !loading && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); setShowDropdown(false); }}
              style={{
                background: 'none', border: 'none', color: 'var(--color-text-muted)',
                cursor: 'pointer', fontSize: '16px', padding: '4px',
              }}
            >✕</button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-accent)',
              borderTop: 'none',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
              zIndex: 100,
              overflow: 'hidden',
            }}
          >
            {suggestions[0]?.isRecent && (
              <div style={{
                padding: '8px 16px 4px',
                fontSize: '10px',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-muted)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}>
                Recent Searches
              </div>
            )}
            {suggestions.map((item, index) => (
              <div
                key={item.ticker}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background: selectedIndex === index ? 'var(--color-bg-elevated)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    minWidth: '60px',
                  }}>
                    {item.ticker}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '300px',
                  }}>
                    {item.name}
                  </span>
                </div>
                <span className={`badge badge-${(item.exchange || 'nasdaq').toLowerCase()}`}>
                  {item.exchange || 'NASDAQ'}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
