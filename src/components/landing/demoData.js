// All static/cached data for landing page — ZERO API calls
export const DEMO_STOCKS = [
  { ticker: 'NVDA', name: 'NVIDIA Corp', price: '875.28', change: '+4.32%', sentiment: 'Bullish', exchange: 'NASDAQ', color: '#00FF94' },
  { ticker: 'AAPL', name: 'Apple Inc', price: '198.11', change: '+1.18%', sentiment: 'Bullish', exchange: 'NASDAQ', color: '#00FF94' },
  { ticker: 'TSLA', name: 'Tesla Inc', price: '241.37', change: '-2.15%', sentiment: 'Bearish', exchange: 'NASDAQ', color: '#FF3B5C' },
  { ticker: 'MSFT', name: 'Microsoft', price: '425.52', change: '+0.87%', sentiment: 'Bullish', exchange: 'NASDAQ', color: '#00FF94' },
  { ticker: 'OGDC', name: 'Oil & Gas Dev Co', price: '128.45', change: '+3.21%', sentiment: 'Bullish', exchange: 'PSX', color: '#00FF94' },
  { ticker: 'HBL', name: 'Habib Bank Ltd', price: '92.30', change: '+1.55%', sentiment: 'Neutral', exchange: 'PSX', color: '#FFD700' },
  { ticker: 'GOOGL', name: 'Alphabet Inc', price: '164.78', change: '+0.93%', sentiment: 'Bullish', exchange: 'NASDAQ', color: '#00FF94' },
  { ticker: 'AMZN', name: 'Amazon.com', price: '186.54', change: '-0.42%', sentiment: 'Neutral', exchange: 'NASDAQ', color: '#FFD700' },
];

export const PSX_STOCKS = [
  { ticker: 'OGDC', name: 'Oil & Gas Dev Co', price: '128.45', change: '+3.21%', sentiment: 'Bullish', sector: 'Energy' },
  { ticker: 'HBL', name: 'Habib Bank Ltd', price: '92.30', change: '+1.55%', sentiment: 'Neutral', sector: 'Banking' },
  { ticker: 'PSO', name: 'Pakistan State Oil', price: '215.70', change: '+2.08%', sentiment: 'Bullish', sector: 'Energy' },
];

export const DEMO_CHART_DATA = [
  { date: 'Jan 1', price: 132, event: null },
  { date: 'Jan 15', price: 138, event: null },
  { date: 'Feb 1', price: 141, event: null },
  { date: 'Feb 14', price: 136, event: 'Sanctions Announced' },
  { date: 'Mar 1', price: 128, event: null },
  { date: 'Mar 15', price: 125, event: null },
  { date: 'Apr 1', price: 134, event: 'Policy Change' },
  { date: 'Apr 15', price: 145, event: null },
  { date: 'May 1', price: 152, event: null },
  { date: 'May 15', price: 148, event: 'Trade Deal Signed' },
  { date: 'Jun 1', price: 158, event: null },
  { date: 'Jun 15', price: 165, event: null },
  { date: 'Jul 1', price: 171, event: null },
  { date: 'Jul 15', price: 168, event: 'Election Results' },
  { date: 'Aug 1', price: 175, event: null },
];

export const DEMO_ANALYSIS_CARD = {
  ticker: 'NVDA',
  score: 82,
  stance: 'Bullish',
  confidence: 'High',
  summary: 'AI chip demand surge driven by global AI infrastructure expansion. US-China tech restrictions create short-term supply uncertainty but long-term market dominance.',
  tags: ['AI Boom', 'Export Controls', 'Supply Chain'],
};

export const FEATURES = [
  {
    icon: '🎯',
    title: 'Potential Meter',
    desc: 'AI-powered circular gauge showing upside probability with real-time sentiment scoring across 1D, 1W, 1M timeframes.',
    preview: 'gauge',
  },
  {
    icon: '⚔️',
    title: 'Bull vs Bear Debate',
    desc: 'Automated AI debate with typewriter animation presenting bullish and bearish arguments, ending with a final verdict.',
    preview: 'debate',
  },
  {
    icon: '🌍',
    title: 'Geopolitical Impact',
    desc: 'Real-time news analysis tagged with geopolitical categories — sanctions, trade wars, elections, policy changes.',
    preview: 'geo',
  },
];

export const HOW_IT_WORKS = [
  { step: '01', title: 'Search Any Stock', desc: 'Enter a ticker — NVDA, AAPL, or PSX stocks like OGDC, HBL', icon: '🔍' },
  { step: '02', title: 'AI Analyzes Events', desc: 'Our AI cross-references global news, sanctions, policy shifts & market signals', icon: '🧠' },
  { step: '03', title: 'Get Clear Insights', desc: 'Receive potential scores, bull/bear debates, and geopolitical impact reports', icon: '📊' },
];
