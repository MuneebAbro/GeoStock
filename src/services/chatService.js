import { logInfo, logError, logWarn, moduleLoaded } from '../utils/logger';

moduleLoaded('chatService');

const CHAT_API_KEY = import.meta.env.VITE_GROQ_CHAT_API_KEY || import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const CHAT_MODEL = 'llama-3.3-70b-versatile';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build a system prompt that includes all the stock analysis data
 * currently visible on the page, so the bot can answer contextually.
 */
function buildSystemPrompt(stockContext) {
  const { ticker, companyName, sector, exchange, price, changePercent,
    potentialScore, debate, geoReport, sectorRipple, isPSX, kse100 } = stockContext;

  const bullArgs = debate?.bull_arguments?.map(a => `• ${a.title}: ${a.argument}`).join('\n') || 'N/A';
  const bearArgs = debate?.bear_arguments?.map(a => `• ${a.title}: ${a.argument}`).join('\n') || 'N/A';
  const verdict = debate?.verdict
    ? `Stance: ${debate.verdict.stance}, Confidence: ${debate.verdict.confidence}. ${debate.verdict.summary}`
    : 'N/A';

  const geoNews = geoReport?.tagged_news?.map(n =>
    `• [${n.tag}] ${n.headline} (${n.impact_direction}, ${n.impact_magnitude})`
  ).join('\n') || 'N/A';

  const geoParagraphs = geoReport?.analysis_paragraphs?.join('\n\n') || 'N/A';

  const ripple = sectorRipple?.ripple_stocks?.map(s =>
    `• ${s.ticker} (${s.company}) — ${s.direction}: ${s.relationship}`
  ).join('\n') || 'N/A';

  return `You are GeoStock AI Assistant — an expert financial and geopolitical analyst chatbot embedded in the GeoStock platform.

You are currently viewing the analysis page for: ${ticker} (${companyName})
Sector: ${sector}
Exchange: ${exchange}${isPSX ? ' (Pakistan Stock Exchange)' : ''}
Current Price: ${price}
Change: ${changePercent}%
${isPSX && kse100 ? `KSE-100 Index: ${kse100}` : ''}

=== AI POTENTIAL SCORE ===
Score: ${potentialScore?.potential_score ?? 'N/A'}/100
Timeframe: ${potentialScore?.timeframe || 'N/A'}
Stance: ${potentialScore?.stance || 'N/A'}
Confidence: ${potentialScore?.confidence || 'N/A'}
Summary: ${potentialScore?.one_line_summary || 'N/A'}

=== BULL CASE ===
${bullArgs}

=== BEAR CASE ===
${bearArgs}

=== AI VERDICT ===
${verdict}

=== GEOPOLITICAL NEWS ===
${geoNews}

=== GEOPOLITICAL ANALYSIS ===
${geoParagraphs}

=== SECTOR RIPPLE EFFECT ===
${ripple}

RULES:
- Answer questions about this stock using the data above.
- Be concise, clear, and insightful. Use the terminal-style tone — professional, data-driven.
- If the user asks something outside the data you have, say so honestly.
- Never make up numbers — only use the data provided above.
- Keep answers short (2-4 sentences) unless the user asks for detail.
- You may offer your own analysis opinion based on the data you see.
- Format with markdown when helpful.`;
}

/**
 * Send a chat message with full conversation history
 */
export async function sendChatMessage(messages, stockContext, retries = 2) {
  if (!CHAT_API_KEY) {
    throw new Error('Missing VITE_GROQ_CHAT_API_KEY in environment');
  }

  const systemPrompt = buildSystemPrompt(stockContext);

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logInfo('chatService', `chat request attempt ${attempt}/${retries}`);

      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHAT_API_KEY}`,
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (response.status === 429) {
        const waitMs = 2000 * attempt;
        logWarn('chatService', `rate limited, waiting ${waitMs}ms`);
        lastError = new Error('Rate limited — too many requests. Please wait a moment and try again.');
        await delay(waitMs);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        logError('chatService', 'chat response error', { status: response.status, errText });
        throw new Error(`Chat API error ${response.status}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error('No response from chat API');

      logInfo('chatService', 'chat response received');
      return text;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await delay(1000 * attempt);
      }
    }
  }

  throw lastError;
}
