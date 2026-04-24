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

  // Split into blocks by double newline (paragraphs) or single newline
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block ```
    if (line.trim().startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={elements.length} style={{
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          padding: '10px 12px',
          margin: '6px 0',
          fontSize: '11px',
          fontFamily: 'var(--font-display)',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          color: 'var(--color-accent)',
        }}>
          {codeLines.join('\n')}
        </pre>
      );
      continue;
    }

    // Headers (### / ## / #)
    const headerMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const sizes = { 1: '16px', 2: '14px', 3: '13px' };
      elements.push(
        <div key={elements.length} style={{
          fontFamily: 'var(--font-display)',
          fontSize: sizes[level],
          fontWeight: 700,
          color: 'var(--color-accent)',
          margin: '8px 0 4px',
        }}>
          {renderInline(headerMatch[2])}
        </div>
      );
      i++;
      continue;
    }

    // Bullet list (- or *)
    if (/^\s*[-*]\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={elements.length} style={{
          margin: '4px 0', paddingLeft: '18px',
          listStyleType: 'none',
        }}>
          {listItems.map((item, j) => (
            <li key={j} style={{ position: 'relative', paddingLeft: '4px', marginBottom: '3px' }}>
              <span style={{
                position: 'absolute', left: '-14px',
                color: 'var(--color-accent)', fontWeight: 700,
              }}>›</span>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list (1. 2. etc)
    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={elements.length} style={{
          margin: '4px 0', paddingLeft: '20px',
          listStyleType: 'none', counterReset: 'ol-counter',
        }}>
          {listItems.map((item, j) => (
            <li key={j} style={{
              position: 'relative', paddingLeft: '4px', marginBottom: '3px',
              counterIncrement: 'ol-counter',
            }}>
              <span style={{
                position: 'absolute', left: '-18px',
                color: 'var(--color-accent)', fontFamily: 'var(--font-display)',
                fontSize: '11px', fontWeight: 700,
              }}>{j + 1}.</span>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line → spacing
    if (line.trim() === '') {
      elements.push(<div key={elements.length} style={{ height: '6px' }} />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <div key={elements.length} style={{ marginBottom: '4px' }}>
        {renderInline(line)}
      </div>
    );
    i++;
  }

  return <>{elements}</>;
}

/**
 * Render inline markdown: **bold**, *italic*, `code`
 */
function renderInline(text) {
  if (!text) return null;

  // Split by inline patterns: **bold**, *italic*, `code`
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Find earliest match
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

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    // Text before match
    if (earliestIdx > 0) {
      parts.push(remaining.slice(0, earliestIdx));
    }

    const inner = earliest.match[1];
    if (earliest.type === 'bold') {
      parts.push(
        <strong key={key++} style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {inner}
        </strong>
      );
    } else if (earliest.type === 'italic') {
      parts.push(
        <em key={key++} style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
          {inner}
        </em>
      );
    } else if (earliest.type === 'code') {
      parts.push(
        <code key={key++} style={{
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          padding: '1px 5px',
          fontSize: '11px',
          fontFamily: 'var(--font-display)',
          color: 'var(--color-accent)',
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
      initial={isLatest ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '12px',
      }}
    >
      <div style={{
        maxWidth: '85%',
        padding: '12px 16px',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser
          ? 'rgba(0, 255, 148, 0.1)'
          : 'var(--color-bg-elevated)',
        border: `1px solid ${isUser ? 'rgba(0, 255, 148, 0.2)' : 'var(--color-border)'}`,
        fontSize: '13px',
        lineHeight: '1.6',
        color: 'var(--color-text-primary)',
        wordBreak: 'break-word',
      }}>
        {!isUser && (
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700,
            color: 'var(--color-accent)', letterSpacing: '1.5px', marginBottom: '6px',
            textTransform: 'uppercase',
          }}>
            GEOSTOCK AI
          </div>
        )}
        {isUser ? (
          <div>{message.content}</div>
        ) : (
          <MarkdownText text={message.content} />
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start', marginBottom: '12px',
    }}>
      <div style={{
        padding: '12px 20px', borderRadius: '14px 14px 14px 4px',
        background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--color-accent)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function StockChatbot({ analysis, ticker }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Build context from analysis data
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

  // Reset chat when ticker changes
  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [ticker]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

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
        content: `⚠️ Sorry, I couldn't process that. ${err.message || 'Please try again.'}`,
      }]);
    } finally {
      setSending(false);
    }
  }, [input, messages, sending, stockContext, ticker]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!analysis) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 35px rgba(0, 255, 148, 0.35)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed',
              bottom: '28px',
              right: '28px',
              zIndex: 1000,
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00FF94, #00CC76)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 0 25px rgba(0, 255, 148, 0.25), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            🤖
          </motion.button>
        )}
      </AnimatePresence>

      {/* Notification Badge on Button */}
      {!isOpen && messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'fixed',
            bottom: '95px',
            right: '20px',
            zIndex: 1000,
            background: 'var(--color-bg-surface)',
            border: '1px solid rgba(0,255,148,0.2)',
            borderRadius: '12px 12px 4px 12px',
            padding: '10px 14px',
            maxWidth: '200px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{
            fontSize: '12px', color: 'var(--color-text-primary)', lineHeight: 1.4,
          }}>
            💬 Ask me anything about <strong style={{ color: 'var(--color-accent)' }}>{ticker}</strong>
          </div>
        </motion.div>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 1000,
              width: '400px',
              maxWidth: 'calc(100vw - 48px)',
              height: '560px',
              maxHeight: 'calc(100vh - 120px)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-bg-primary)',
              border: '1px solid rgba(0, 255, 148, 0.2)',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(0, 255, 148, 0.08), 0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              background: 'var(--color-bg-surface)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(0,255,148,0.15), rgba(0,255,148,0.05))',
                  border: '1px solid rgba(0,255,148,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  🤖
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}>
                    GeoStock AI
                  </div>
                  <div style={{
                    fontSize: '10px', color: 'var(--color-accent)',
                    fontFamily: 'var(--font-display)', letterSpacing: '0.5px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <span className="live-dot" style={{ width: 5, height: 5 }} />
                    Analyzing {ticker}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-muted)', fontSize: '18px',
                  padding: '4px', lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
            }}>
              {/* Welcome message */}
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🧠</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
                    color: 'var(--color-text-primary)', marginBottom: '6px',
                  }}>
                    Ask about {ticker}
                  </div>
                  <p style={{
                    fontSize: '12px', color: 'var(--color-text-secondary)',
                    lineHeight: 1.5, marginBottom: '20px', maxWidth: '280px', margin: '0 auto 20px',
                  }}>
                    I have access to all the analysis data on this page — potential score, bull/bear debate, geopolitical impact, and more.
                  </p>

                  {/* Suggested questions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ borderColor: 'rgba(0,255,148,0.4)', background: 'rgba(0,255,148,0.05)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(q)}
                        disabled={sending}
                        style={{
                          background: 'var(--color-bg-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '12px',
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-body)',
                          transition: 'border-color 0.2s, background 0.2s',
                        }}
                      >
                        <span style={{ marginRight: '8px', opacity: 0.6 }}>→</span>
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} isLatest={i === messages.length - 1} />
              ))}

              {sending && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              flexShrink: 0,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--color-bg-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '4px 4px 4px 16px',
                transition: 'border-color 0.3s',
              }}>
                <input
                  ref={inputRef}
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${ticker}...`}
                  disabled={sending}
                  autoComplete="off"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    padding: '8px 0',
                  }}
                />
                <motion.button
                  whileHover={{ background: 'var(--color-accent)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend()}
                  disabled={sending || !input.trim()}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: 'none',
                    background: input.trim() ? 'rgba(0,255,148,0.8)' : 'var(--color-bg-elevated)',
                    color: input.trim() ? '#0A0A0F' : 'var(--color-text-muted)',
                    cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  ↑
                </motion.button>
              </div>
              <div style={{
                fontSize: '9px', color: 'var(--color-text-muted)',
                textAlign: 'center', marginTop: '6px',
                fontFamily: 'var(--font-display)', letterSpacing: '0.3px',
              }}>
                AI responses are not financial advice
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
