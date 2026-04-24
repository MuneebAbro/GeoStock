<p align="center">
  <img src="https://img.shields.io/badge/GeoStock-AI%20Powered-00FF94?style=for-the-badge&labelColor=0A0A0F" alt="GeoStock Badge" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&labelColor=0A0A0F" alt="React" />
  <img src="https://img.shields.io/badge/Groq-LLaMA%203.3-FF6B35?style=for-the-badge&labelColor=0A0A0F" alt="Groq" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&labelColor=0A0A0F" alt="Vite" />
</p>

<h1 align="center">📊 GeoStock</h1>

<p align="center">
  <strong>Understand <em>Why</em> Stocks Move — Not Just That They Move</strong>
</p>

<p align="center">
  AI-powered geopolitical stock analysis platform that connects world events<br/>
  with stock price movements — giving you insights that go beyond the numbers.
</p>

---

## 🌟 What is GeoStock?

GeoStock is a real-time stock analysis platform that uses **AI (Groq LLaMA 3.3 70B)** to analyze how **geopolitical events** — sanctions, trade wars, elections, policy changes — affect stock prices across **global and Pakistan markets**.

Unlike traditional stock screeners that show *what* happened, GeoStock explains **why** it happened using geopolitical context.

### 🎯 The Problem

> Investors see stock prices move but rarely understand the *geopolitical forces* driving those movements. Traditional tools show charts and numbers — they don't connect global events to price action.

### 💡 The Solution

GeoStock bridges this gap by:
1. **Fetching real-time stock data** from Yahoo Finance & Pakistan Stock Exchange
2. **Aggregating geopolitical news** from NewsAPI
3. **Using AI to analyze** how world events affect specific stocks
4. **Presenting insights** through an intuitive Bloomberg Terminal-inspired UI

---

## ✨ Key Features

### 🎯 AI Potential Meter
A circular gauge (0–100) showing AI-calculated upside probability across **1-Day, 1-Week, and 1-Month** timeframes. Powered by real-time sentiment analysis of geopolitical news.

### ⚔️ Bull vs Bear Debate
Automated AI-generated debate presenting **bullish and bearish arguments** with typewriter animation, culminating in a final **AI Verdict** with confidence level.

### 🌍 Geopolitical Impact Report
News headlines tagged with geopolitical categories — **Sanctions, Trade War, Regulation, Conflict, Election, Policy, Supply Chain, Currency** — with impact direction and magnitude analysis.

### 🔗 Sector Ripple Effect
AI identifies **4 related stocks** affected by the same geopolitical events, showing cross-market contagion and opportunity.

### 📈 30-Day Price Chart
Interactive price chart with **Line and OHLC** views, pulled from real market data via Yahoo Finance.

### 🤖 AI Chatbot Assistant
Context-aware chatbot that has access to **all analysis data on the page** and can answer any question about the stock. Powered by a separate Groq API key to avoid rate limits.

### 🇵🇰 Pakistan Stock Exchange (PSX) Support
Full support for **KSE-100 Index** stocks including OGDC, HBL, PSO, and more — a unique differentiator with local market relevance.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Framer Motion, Recharts |
| **Styling** | Tailwind CSS 4, Custom Bloomberg Terminal Theme |
| **Build Tool** | Vite 8 |
| **AI Engine** | Groq Cloud (LLaMA 3.3 70B Versatile) |
| **Stock Data** | Yahoo Finance API, Finnhub API |
| **PSX Data** | PSX Terminal API |
| **News** | NewsAPI.org |
| **Fonts** | JetBrains Mono (monospace), Inter (body) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- API keys (see below)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/GeoStock.git
cd GeoStock
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# AI Engine (Required)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Chatbot — separate key to avoid rate limits (Optional, falls back to above)
VITE_GROQ_CHAT_API_KEY=your_second_groq_api_key_here

# News Data (Required)
VITE_NEWS_API_KEY=your_newsapi_key_here

# Stock Data (Required)
VITE_FINNHUB_KEY=your_finnhub_key_here
```

#### Where to Get API Keys

| API | URL | Free Tier |
|-----|-----|-----------|
| **Groq** | [console.groq.com](https://console.groq.com) | ✅ Free — 30 req/min |
| **NewsAPI** | [newsapi.org](https://newsapi.org) | ✅ Free — 100 req/day |
| **Finnhub** | [finnhub.io](https://finnhub.io) | ✅ Free — 60 req/min |

> **💡 Tip:** Use two separate Groq API keys — one for stock analysis, one for the chatbot — to maximize throughput within rate limits.

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## 📖 How to Use

### Searching a Stock

1. **From the landing page:** Click any stock card in the Top Stocks or PSX section
2. **From the search bar:** Type a ticker symbol (e.g., `NVDA`, `AAPL`, `OGDC`) and press Enter
3. **From autocomplete:** Start typing and select from the dropdown suggestions

### Reading the Analysis

Once a stock is loaded, you'll see:

| Section | What It Shows |
|---------|--------------|
| **Stock Header** | Current price, change %, high/low, market cap, exchange badge |
| **Potential Meter** | AI upside probability gauge (switch between 1D / 1W / 1M) |
| **Price Chart** | 30-day historical price with Line / OHLC toggle |
| **Bull vs Bear** | Animated AI debate with final verdict |
| **Geopolitical Report** | Tagged news with impact analysis |
| **Sector Ripple** | Related stocks affected — click any to analyze |

### Using the AI Chatbot

1. Click the floating 🤖 button (bottom-right) on any analysis page
2. Choose a suggested question or type your own
3. The bot sees all data on the page and answers contextually

### Navigating Back

Click the **GeoStock** logo in the header to return to the landing page.

---

## 🏗️ Architecture

```
src/
├── App.jsx                    # Main app — routing, layout, state
├── main.jsx                   # React entry point
├── index.css                  # Bloomberg Terminal theme & design system
│
├── components/
│   ├── SearchBar.jsx          # Autocomplete search with recent history
│   ├── StockHeader.jsx        # Price display, exchange badge, market info
│   ├── PotentialMeter.jsx     # SVG gauge with animated needle
│   ├── PriceChart.jsx         # Recharts line/OHLC chart
│   ├── BullBearDebate.jsx     # Typewriter animated debate UI
│   ├── GeopoliticalReport.jsx # Tagged news + analysis paragraphs
│   ├── SectorRipple.jsx       # Related stocks grid
│   ├── StockChatbot.jsx       # AI chatbot with markdown rendering
│   ├── SkeletonLoader.jsx     # Shimmer loading states
│   ├── LiveDot.jsx            # Pulsing status indicator
│   └── landing/               # Landing page sections
│       ├── LandingPage.jsx    # Main landing composition
│       ├── HeroSection.jsx    # Hero with animated grid
│       ├── AnimatedGrid.jsx   # Canvas background animation
│       ├── StocksShowcase.jsx # Clickable stock cards
│       ├── FeaturesSection.jsx# Feature previews
│       ├── HowItWorks.jsx     # 3-step flow
│       ├── DemoChart.jsx      # SVG chart with event markers
│       ├── PSXSection.jsx     # Pakistan market highlight
│       ├── CTASection.jsx     # Call-to-action
│       └── demoData.js        # Static/cached demo data
│
├── services/
│   ├── groqService.js         # Groq AI prompts (4 analysis prompts)
│   ├── chatService.js         # Chatbot AI with context injection
│   ├── stockService.js        # Yahoo Finance + PSX data fetching
│   ├── newsService.js         # NewsAPI integration
│   └── analysisOrchestrator.js# Orchestrates the full analysis pipeline
│
├── hooks/
│   └── useAnalysis.js         # Main analysis state management hook
│
├── utils/
│   ├── marketDetector.js      # Ticker search + PSX/Global detection
│   ├── newsFormatter.js       # News formatting for AI prompts
│   ├── scoreCalculator.js     # Score zones and gauge colors
│   └── logger.js              # Structured logging utility
│
└── constants/
    └── geopoliticalTags.js    # Tag definitions and colors
```

---

## 🎨 Design Philosophy

GeoStock uses a **Bloomberg Terminal-inspired dark theme** designed to convey professionalism and data density:

- **Dark background** (`#0A0A0F`) with subtle scanline overlay
- **Neon green accent** (`#00FF94`) for bullish signals and primary actions
- **Red accent** (`#FF3B5C`) for bearish signals
- **JetBrains Mono** for data display (monospace, tabular numbers)
- **Inter** for body text (clean, readable)
- **Glassmorphism** headers with backdrop blur
- **Framer Motion** for smooth micro-animations throughout
- **Skeleton loaders** instead of spinners for premium loading states

---

## ⚠️ Rate Limits & Performance

GeoStock is designed to be **API-efficient**:

| Constraint | Solution |
|-----------|----------|
| Groq: ~30 req/min | Separate API keys for analysis vs chatbot |
| NewsAPI: 100 req/day | Cached/static data on landing page |
| Finnhub: 60 req/min | Single fetch per stock analysis |
| Landing page | 100% static — zero API calls |
| Retry logic | Exponential backoff on rate limits |
| JSON repair | Auto-fixes truncated AI responses |

---

## 🌐 Supported Markets

### Global
| Exchange | Examples |
|----------|---------|
| NASDAQ | NVDA, AAPL, TSLA, MSFT, GOOGL, AMZN, META |
| NYSE | JPM, BAC, WMT, DIS, KO |

### Pakistan (PSX)
| Sector | Stocks |
|--------|--------|
| Energy | OGDC, PSO, PPL |
| Banking | HBL, MCB, UBL, BAHL |
| Telecom | PTC |
| Cement | LUCK, DGKC |

---

## 📝 Disclaimer

> **GeoStock is for educational and demonstration purposes only.** AI-generated analysis is not financial advice. Always consult a qualified financial advisor before making investment decisions. Stock data may be delayed.

---

## 👥 Team

Built with ❤️ for the hackathon.

---

<p align="center">
  <strong>📊 GeoStock — Geopolitical AI Stock Analysis</strong><br/>
  <em>See the world behind the numbers.</em>
</p>
