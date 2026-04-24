import { moduleLoaded, logError, logInfo } from '../utils/logger';

moduleLoaded('groqService');
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * Attempt to repair truncated JSON
 */
function repairJSON(text) {
  let s = text.trim();
  // Strip markdown fences
  s = s.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(s);
  } catch {
    // Try to fix common truncation issues
    // Count open vs close braces/brackets
    let braces = 0;
    let brackets = 0;
    let inString = false;
    let escaped = false;
    for (const ch of s) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === '{') braces++;
      if (ch === '}') braces--;
      if (ch === '[') brackets++;
      if (ch === ']') brackets--;
    }

    // If we're inside a string, close it
    if (inString) s += '"';

    // Close open brackets and braces
    while (brackets > 0) {
      s += ']';
      brackets--;
    }
    while (braces > 0) {
      s += '}';
      braces--;
    }

    try {
      return JSON.parse(s);
    } catch (e2) {
      console.error('JSON repair failed:', e2.message, '\nRaw text:', text.slice(0, 200));
      throw e2;
    }
  }
}

/**
 * Call the Groq API with a prompt and get JSON response
 */
async function callGroq(prompt, maxTokens = 4096) {
  if (!GROQ_API_KEY) {
    throw new Error('Missing VITE_GROQ_API_KEY in environment');
  }

  logInfo('groqService', 'groq request started', { maxTokens, model: GROQ_MODEL });
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    logError('groqService', 'groq response not ok', { status: response.status, errText });
    throw new Error(`Groq API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    logError('groqService', 'missing groq text payload', JSON.stringify(data).slice(0, 500));
    throw new Error('No text response from Groq');
  }

  logInfo('groqService', 'groq request completed');
  return repairJSON(text);
}

/**
 * Prompt 1 — Generate Potential Score
 */
export async function generatePotentialScore(stockData, newsFormatted, timeframe = '1 week') {
  const prompt = `You are GeoStock's AI analysis engine. You analyze geopolitical news and stock data to generate a sentiment-based potential score.

Stock: ${stockData.ticker} (${stockData.companyName})
Sector: ${stockData.sector}
Exchange: ${stockData.exchange}
Current Price: ${stockData.price}
7-Day Price Change: ${stockData.changePercent || 0}%
Timeframe to analyze: ${timeframe}

Recent Geopolitical News Headlines (from NewsAPI + GDELT):
${newsFormatted}

Historical price context:
${stockData.priceHistory || 'Not available'}

Your task:
1. Analyze how the geopolitical news affects this specific stock and sector
2. Factor in the recent price momentum
3. Generate a Potential Score between 0 and 100 representing upside probability for the given timeframe
4. A score above 60 = bullish sentiment, 40-60 = neutral, below 40 = bearish

Respond ONLY in this exact JSON format:
{
  "potential_score": <number between 0-100>,
  "timeframe": "${timeframe}",
  "stance": "Bullish" or "Neutral" or "Bearish",
  "confidence": "High" or "Medium" or "Low",
  "one_line_summary": "one sentence explaining the score"
}`;

  try {
    return await callGroq(prompt, 2048);
  } catch (err) {
    logError('groqService', 'potential score generation failed', err);
    return {
      potential_score: 50,
      timeframe,
      stance: 'Neutral',
      confidence: 'Low',
      one_line_summary: 'Analysis temporarily unavailable. Showing neutral score.',
    };
  }
}

/**
 * Prompt 2 — Generate Bull vs Bear Debate
 */
export async function generateBullBearDebate(stockData, newsFormatted, timeframe, score) {
  const prompt = `You are GeoStock's debate engine. You generate a structured Bull vs Bear debate for a stock based on geopolitical news and market data.

Stock: ${stockData.ticker} (${stockData.companyName})
Sector: ${stockData.sector}
Current Price: ${stockData.price}
Timeframe: ${timeframe}
Potential Score already calculated: ${score}

Recent Geopolitical News:
${newsFormatted}

Generate a structured debate with exactly this JSON format:
{
  "bull_arguments": [
    { "title": "short title", "argument": "2-3 sentence bullish argument grounded in the news" },
    { "title": "short title", "argument": "2-3 sentence bullish argument grounded in the news" },
    { "title": "short title", "argument": "2-3 sentence bullish argument grounded in the news" }
  ],
  "bear_arguments": [
    { "title": "short title", "argument": "2-3 sentence bearish argument grounded in the news" },
    { "title": "short title", "argument": "2-3 sentence bearish argument grounded in the news" },
    { "title": "short title", "argument": "2-3 sentence bearish argument grounded in the news" }
  ],
  "verdict": {
    "stance": "Bullish" or "Neutral" or "Bearish",
    "confidence": "High" or "Medium" or "Low",
    "summary": "2-3 sentence final verdict synthesizing both sides"
  }
}`;

  try {
    return await callGroq(prompt, 4096);
  } catch (err) {
    logError('groqService', 'debate generation failed', err);
    return {
      bull_arguments: [
        { title: 'Market Momentum', argument: 'Analysis temporarily unavailable.' },
        { title: 'Sector Strength', argument: 'Please try again in a moment.' },
        { title: 'Growth Outlook', argument: 'AI analysis will resume shortly.' },
      ],
      bear_arguments: [
        { title: 'Market Risk', argument: 'Analysis temporarily unavailable.' },
        { title: 'Sector Headwinds', argument: 'Please try again in a moment.' },
        { title: 'Valuation Concern', argument: 'AI analysis will resume shortly.' },
      ],
      verdict: {
        stance: 'Neutral',
        confidence: 'Low',
        summary: 'Unable to generate a complete analysis at this time.',
      },
    };
  }
}

/**
 * Prompt 3 — Generate Geopolitical Impact Report
 */
export async function generateGeopoliticalReport(stockData, newsFormatted) {
  const prompt = `You are GeoStock's geopolitical analyst. Write a structured impact report for a stock based on current world events.

Stock: ${stockData.ticker} (${stockData.companyName})
Sector: ${stockData.sector}
Exchange: ${stockData.exchange}

News Headlines with dates:
${newsFormatted}

Write a geopolitical analysis report in this exact JSON format:
{
  "tagged_news": [
    {
      "headline": "original headline text",
      "source": "source name",
      "date": "date",
      "tag": one of: "Trade War", "Sanctions", "Regulation", "Conflict", "Election", "Policy", "Supply Chain", "Currency",
      "impact_direction": "Bullish" or "Bearish" or "Neutral",
      "impact_magnitude": "High" or "Medium" or "Low"
    }
  ],
  "analysis_paragraphs": [
    "Paragraph 1: Overview of geopolitical landscape affecting this stock",
    "Paragraph 2: Specific risks and headwinds from current events",
    "Paragraph 3: Opportunities and tailwinds, forward outlook"
  ]
}

Return 5-8 tagged news items and exactly 3 analysis paragraphs.`;

  try {
    return await callGroq(prompt, 4096);
  } catch (err) {
    logError('groqService', 'geo report generation failed', err);
    return {
      tagged_news: [],
      analysis_paragraphs: [
        'Geopolitical analysis is temporarily unavailable.',
        'Please check back shortly for a complete analysis.',
        'The AI engine will resume analysis when connectivity is restored.',
      ],
    };
  }
}

/**
 * Prompt 4 — Generate Sector Ripple Effect
 */
export async function generateSectorRipple(stockData, themes) {
  const prompt = `You are GeoStock's sector analyst. Given a stock and geopolitical context, identify related stocks that are affected by the same events.

Stock: ${stockData.ticker} (${stockData.companyName})
Sector: ${stockData.sector}
Exchange: ${stockData.exchange}
Key geopolitical themes identified: ${themes || 'General market conditions'}

Identify 4 related stocks that are impacted by the same geopolitical events.
${stockData.isPSX ? 'Since this is a PSX (Pakistan Stock Exchange) stock, include related Pakistani stocks.' : 'Focus on major global stocks that are related.'}

Respond ONLY in this JSON format:
{
  "ripple_stocks": [
    {
      "ticker": "TICKER",
      "company": "Company Name",
      "relationship": "one sentence explaining why this stock is affected",
      "direction": "Bullish" or "Bearish" or "Neutral",
      "impact_level": "High" or "Medium" or "Low"
    }
  ]
}

Return exactly 4 stocks.`;

  try {
    return await callGroq(prompt, 2048);
  } catch (err) {
    logError('groqService', 'sector ripple generation failed', err);
    return { ripple_stocks: [] };
  }
}
