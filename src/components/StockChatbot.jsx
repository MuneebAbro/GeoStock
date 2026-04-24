import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../services/chatService';
import { moduleLoaded, logInfo } from '../utils/logger';

moduleLoaded('StockChatbot');

const SUGGESTED_QUESTIONS = [
  'Should I invest in this stock?',
  'What are the biggest risks?',
  'Explain the geopolitical impact',
  'Summarize the bull vs bear case',
  'What does the potential score mean?',
];

/**
 * Lightweight markdown renderer — handles bold, italic, inline code,
 * code blocks, headers, bullet/numbered lists, and line breaks.
 */
function MarkdownText({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <pre key={elements.length} style={{
          background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
          padding: '10px 12px', margin: '6px 0', fontSize: '11px',
          fontFamily: 'var(--font-display)', overflowX: 'auto',
          whiteSpace: 'pre-wrap', color: 'var(--color-accent)',
        }}>
          {codeLines.join('\n')}
        </pre>
      );
      continue;
    }

    const headerMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const sizes = { 1: '14px', 2: '13px', 3: '12px' };
      elements.push(
        <div key={elements.length} style={{
          fontFamily: 'var(--font-display)', fontSize: sizes[level],
          fontWeight: 700, color: 'var(--color-accent-bright)', margin: '8px 0 4px',
          letterSpacing: '0.5px',
        }}>
          {renderInline(headerMatch[2])}
        </div>
      );
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={elements.length} style={{ margin: '4px 0', paddingLeft: '18px', listStyleType: 'none' }}>
          {listItems.map((item, j) => (
            <li key={j} style={{ position: 'relative', paddingLeft: '4px', marginBottom: '3px' }}>
              <span style={{ position: 'absolute', left: '-14px', color: 'var(--color-accent)', fontWeight: 700 }}>›</span>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={elements.length} style={{ margin: '4px 0', paddingLeft: '20px', listStyleType: 'none', counterReset: 'ol-counter' }}>
          {listItems.map((item, j) => (
            <li key={j} style={{ position: 'relative', paddingLeft: '4px', marginBottom: '3px', counterIncrement: 'ol-counter' }}>
              <span style={{ position: 'absolute', left: '-18px', color: 'var(--color-accent)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700 }}>{j + 1}.</span>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={elements.length} style={{ height: '6px' }} />);
      i++;
      continue;
    }

    elements.push(
      <div key={elements.length} style={{ marginBottom: '4px' }}>
        {renderInline(line)}
      </div>
    );
    i++;
  }

  return <>{elements}</>;
}

function renderInline(text) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const patterns = [
      { regex: /\*\*(.+?)\*\*/, type: 'bold' },
      { regex: /\*(.+?)\*/, type: 'italic' },
      { regex: /`(.+?)`/, type: 'code' },
    ];
    let earliest = null;
    let earliestIdx = Infinity;

    for (const p of patterns) {
      const match = remaining.match(p.regex);
      if (match && match.index < earliestIdx) {
        earliest = { ...p, match };
        earliestIdx = match.index;
      }
    }

    if (!earliest) { parts.push(remaining); break; }
    if (earliestIdx > 0) parts.push(remaining.slice(0, earliestIdx));

    const inner = earliest.match[1];
    if (earliest.type === 'bold') {
      parts.push(<strong key={key++} style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{inner}</strong>);
    } else if (earliest.type === 'italic') {
      parts.push(<em key={key++} style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>{inner}</em>);
    } else if (earliest.type === 'code') {
      parts.push(
        <code key={key++} style={{
          background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
          padding: '1px 5px', fontSize: '11px',
          fontFamily: 'var(--font-display)', color: 'var(--color-accent)',
        }}>
          {inner}
        </code>
      );
    }
    remaining = remaining.slice(earliestIdx + earliest.match[0].length);
  }
  return <>{parts}</>;
}

function ChatMessage({ message, isLatest }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '12px' }}
    >
      <div style={{
        maxWidth: '88%',
        padding: '10px 14px',
        background: isUser ? 'var(--color-accent)' : 'transparent',
        borderLeft: isUser ? 'none' : '2px solid var(--color-accent)',
        fontSize: '13px',
        lineHeight: '1.6',
        color: isUser ? '#fff' : 'var(--color-text-primary)',
        wordBreak: 'break-word',
        fontFamily: isUser ? 'var(--font-display)' : 'var(--font-body)',
      }}>
        {!isUser && (
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '8px', fontWeight: 700,
            color: 'var(--color-accent)', letterSpacing: '2px', marginBottom: '6px', textTransform: 'uppercase',
          }}>
            GEOSTOCK AI
          </div>
        )}
        {isUser ? <div>{message.content}</div> : <MarkdownText text={message.content} />}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
      <div style={{
        padding: '12px 16px',
        borderLeft: '2px solid var(--color-accent)',
        display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            style={{ width: '5px', height: '5px', background: 'var(--color-accent)' }}
          />
        ))}
      </div>
    </div>
  );
}

// Terminal floating button (sharp square)
function ChatToggleButton({ onClick }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        position: 'fixed', bottom: '28px', right: '28px', zIndex: 1000,
        width: '64px', height: '64px',
        background: 'var(--color-accent)',
        border: '1px solid var(--color-accent-bright)',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '3px',
        boxShadow: '0 0 20px rgba(99,102,241,0.3), 0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Terminal icon lines */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5l4 4-4 4M9 13h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: '7px', fontWeight: 700,
        color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase',
      }}>
        AI ANALYST
      </span>
    </motion.button>
  );
}

export default function StockChatbot({ analysis, ticker }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const stockContext = useMemo(() => {
    if (!analysis) return null;
    return {
      ticker: analysis.market?.ticker || ticker,
      companyName: analysis.overview?.name || ticker,
      sector: analysis.overview?.sector || 'Unknown',
      exchange: analysis.overview?.exchange || 'Unknown',
      price: analysis.quote?.price || 'N/A',
      changePercent: analysis.quote?.changePercent || 0,
      potentialScore: analysis.potentialScore,
      debate: analysis.debate,
      geoReport: analysis.geoReport,
      sectorRipple: analysis.sectorRipple,
      isPSX: analysis.market?.isPSX || false,
      kse100: analysis.kse100,
    };
  }, [analysis, ticker]);

  useEffect(() => { setMessages([]); setInput(''); }, [ticker]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  const handleSend = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || sending || !stockContext) return;

    logInfo('StockChatbot', 'sending message', { ticker });
    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setSending(true);

    try {
      const response = await sendChatMessage(newMessages, stockContext);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `[ERR] Could not process request. ${err.message || 'Please retry.'}`,
      }]);
    } finally {
      setSending(false);
    }
  }, [input, messages, sending, stockContext, ticker]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!analysis) return null;

  return (
    <>
      {/* Toggle button */}
      <AnimatePresence>
        {!isOpen && <ChatToggleButton onClick={() => setIsOpen(true)} />}
      </AnimatePresence>

      {/* Tooltip bubble */}
      {!isOpen && messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'fixed', bottom: '100px', right: '20px', zIndex: 1000,
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-active)',
            padding: '10px 14px', maxWidth: '200px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '11px',
            color: 'var(--color-text-secondary)', lineHeight: 1.5,
          }}>
            ASK ANYTHING ABOUT <strong style={{ color: 'var(--color-accent-bright)' }}>{ticker}</strong>
          </div>
        </motion.div>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            style={{
              position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
              width: '400px', maxWidth: 'calc(100vw - 48px)',
              height: '560px', maxHeight: 'calc(100vh - 120px)',
              display: 'flex', flexDirection: 'column',
              background: 'rgba(5,5,12,0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.12), 0 24px 64px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Terminal Header */}
            <div style={{
              padding: '12px 16px',
              background: 'var(--color-bg-elevated)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px', height: '28px',
                  background: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5l3 3-3 3M6.5 9.5h5.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="square" />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
                    color: 'var(--color-text-primary)', letterSpacing: '1px',
                  }}>
                    GEOSTOCK AI // ANALYST TERMINAL
                  </div>
                  <div style={{
                    fontSize: '9px', color: 'var(--color-accent)',
                    fontFamily: 'var(--font-display)', letterSpacing: '1px',
                    display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px',
                  }}>
                    <span className="live-dot" style={{ width: 4, height: 4 }} />
                    ANALYZING {ticker}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-muted)', fontSize: '14px', padding: '4px',
                  fontFamily: 'var(--font-display)', lineHeight: 1,
                }}
              >
                [X]
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {messages.length === 0 && (
                <div style={{ padding: '16px 8px' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '2px',
                    color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase',
                  }}>
                    TERMINAL READY — {ticker}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '11px',
                    color: 'var(--color-text-secondary)', lineHeight: 1.6,
                    marginBottom: '20px',
                  }}>
                    I have full access to the analysis data: potential score, bull/bear debate, geopolitical report, and sector ripple effects.
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ borderColor: 'var(--color-accent)', color: 'var(--color-text-primary)', x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(q)}
                        disabled={sending}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--color-border)',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '11px',
                          color: 'var(--color-text-secondary)',
                          fontFamily: 'var(--font-display)',
                          letterSpacing: '0.3px',
                          transition: 'border-color 0.15s, color 0.15s, transform 0.15s',
                        }}
                      >
                        <span style={{ color: 'var(--color-accent)', marginRight: '8px' }}>{'>'}</span>
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} isLatest={i === messages.length - 1} />
              ))}

              {sending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input — terminal style */}
            <div style={{
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-bg-elevated)',
              flexShrink: 0,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 12px', gap: '8px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '13px',
                  color: 'var(--color-accent)', flexShrink: 0, fontWeight: 700,
                }}>
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`query ${ticker.toLowerCase()}...`}
                  disabled={sending}
                  autoComplete="off"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    padding: '4px 0',
                    letterSpacing: '0.5px',
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend()}
                  disabled={sending || !input.trim()}
                  style={{
                    background: input.trim() ? 'var(--color-accent)' : 'transparent',
                    border: `1px solid ${input.trim() ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    color: input.trim() ? '#fff' : 'var(--color-text-muted)',
                    cursor: input.trim() ? 'pointer' : 'default',
                    padding: '5px 12px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '9px', fontWeight: 700,
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                    flexShrink: 0, transition: 'all 0.15s',
                  }}
                >
                  TRANSMIT
                </motion.button>
              </div>
              <div style={{
                fontSize: '8px', color: 'var(--color-text-muted)',
                textAlign: 'center', padding: '0 12px 8px',
                fontFamily: 'var(--font-display)', letterSpacing: '1px',
              }}>
                NOT FINANCIAL ADVICE — GEOSTOCK AI TERMINAL
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
