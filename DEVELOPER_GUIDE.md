# StoneStocks — Developer Guide

> Auto-updated reference for navigating the codebase. Last updated: 2026-03-08.

## Architecture Overview

```
src/
├── pages/           # Route-level page components (lazy-loaded)
├── components/      # Reusable UI components
│   ├── ui/          # shadcn/ui base components (do not edit directly)
│   └── learn/       # Learn page sub-components
├── contexts/        # React contexts (Auth, Currency, Language)
├── hooks/           # Custom hooks (data fetching, utilities)
├── integrations/    # Supabase client + auto-generated types (DO NOT EDIT)
├── lib/             # Utilities, formatters, API client
├── i18n/            # Learn page translation strings
└── test/            # Test setup + example tests

supabase/
├── functions/
│   └── stock-data/  # Edge function: ALL backend API calls
│       └── index.ts # ~1500 lines, handles 20+ actions
├── migrations/      # Database schema migrations (DO NOT EDIT)
└── config.toml      # Supabase config (DO NOT EDIT)
```

## Data Flow

```
User Action → React Component → useStockData hook → stockApi.ts → Edge Function → External APIs → Supabase Cache → Response
```

### External API Sources (in priority order):
1. **Finnhub** — Quotes, profiles, recommendations, earnings, peers, technicals
2. **Polygon.io** (Massive API) — Financials, ticker details, dividends, splits, aggregates, news
3. **Twelve Data** — Time series, search
4. **Alpha Vantage** — Fallback for time series
5. **Yahoo Finance** — Index values (no API key needed)
6. **Eulerpool** — Company profiles (EU data)
7. **SimFin** — Financial statements
8. **MoneyConvert** — Currency exchange rates

### Caching Strategy
All API responses are cached in the `api_cache` table with configurable TTLs (5 min for quotes, 7 days for profiles). Cache key format: `{source}:{action}:{symbol}`.

## Key Files Reference

### Pages
| File | Route | Description |
|------|-------|-------------|
| `Index.tsx` | `/` | Homepage: search, indices ticker, news, top companies, sentiment gauge |
| `MarketSentimentPage.tsx` | `/sentiment` | Fear & Greed gauge, market breadth, indices grid, market heatmap, top movers |
| `StockDetail.tsx` | `/stock/:symbol` | Full stock analysis: chart, metrics, financials, dividend growth, news, peers, alerts |
| `IndexDetail.tsx` | `/index/:symbol` | Market index details with ETF-proxy chart, constituents, performance table |
| `CommodityDetail.tsx` | `/commodity/:symbol` | Commodity price chart, info, supply/demand factors |
| `NewsPage.tsx` | `/news` | Market news feed (Finnhub + Polygon + Alpha Vantage + Twelve Data) |
| `RankingsPage.tsx` | `/rankings` | Top companies, gainers/losers, most active |
| `WatchlistPage.tsx` | `/watchlist` | User's saved stocks with live quotes, groups, notes, CSV export |
| `PortfolioPage.tsx` | `/portfolio` | Portfolio tracker with P&L, allocation pie chart |
| `CalculatorPage.tsx` | `/calculators` | 12 calculators: Portfolio Growth, Compound Interest, Dividend, FIRE, Position Size, Options, DCA, Loan, Risk/Reward, Currency, Tax-Loss Harvesting, Dividend Projector |
| `LearnPage.tsx` | `/learn` | Financial education (13 sections, beginner→expert, quizzes, reading progress) |
| `ProfilePage.tsx` | `/profile` | User profile with avatar |
| `SettingsPage.tsx` | `/settings` | Password, language, theme, notifications, active price alerts management |
| `AdminPage.tsx` | `/admin` | Admin dashboard: platform stats, popular stocks (admin role required) |
| `GlossaryPage.tsx` | `/glossary` | A-Z financial terms dictionary (bilingual) |
| `AuthPage.tsx` | `/auth` | Login/signup forms |

### Components
| Component | Used In | Data Source |
|-----------|---------|-------------|
| `Header.tsx` | All pages | — |
| `BottomNav.tsx` | All pages (mobile) | — |
| `SearchBar.tsx` | Header, Index | `search` action |
| `MarketOverview.tsx` | Index, News, Rankings | `indices` action |
| `SentimentGauge.tsx` | Index | `indices` action (computed) |
| `MarketHeatmap.tsx` | MarketSentimentPage | `top_companies` action (Treemap) |
| `TopCompanies.tsx` | Index, Rankings | `top_companies` action |
| `GainersLosers.tsx` | Index, Rankings | `gainers_losers` action |
| `MostActive.tsx` | Index, Rankings | `most_active` action |
| `HiddenGems.tsx` | Index | `hidden_gems` action |
| `CommoditiesSection.tsx` | Index | `commodities` action |
| `MarketNewsSection.tsx` | Index | `market_news` action |
| `StockChart.tsx` | StockDetail, IndexDetail | `series` action |
| `MetricsGrid.tsx` | StockDetail | `full` action (derived) |
| `KeyMetrics.tsx` | StockDetail | `full` action |
| `FinancialChart.tsx` | StockDetail | `massive_financials` action |
| `CompanyInfoCard.tsx` | StockDetail | `full` action (profile) |
| `WeekRangeBar.tsx` | StockDetail | `full` action (derived) |
| `AnalystTargets.tsx` | StockDetail | `full` action (recommendation) |
| `TechnicalIndicators.tsx` | StockDetail | `technicals` action |
| `EarningsCard.tsx` | StockDetail | `earnings` action |
| `RecommendationChart.tsx` | StockDetail | `full` action (recommendation) |
| `PeersList.tsx` | StockDetail | `full` action (peers) |
| `NewsList.tsx` | StockDetail | `full` action (news) |
| `DividendGrowth.tsx` | StockDetail | `massive_dividends` action |
| `StockPerformance.tsx` | StockDetail | `full` action (quote) |
| `SentimentVote.tsx` | StockDetail | Supabase `stock_votes` table |
| `StockComments.tsx` | StockDetail | Supabase `stock_comments` table |
| `WatchlistStar.tsx` | StockDetail | Supabase `watchlist` table |
| `PriceAlertForm.tsx` | StockDetail | Supabase `price_alerts` table |
| `OnboardingModal.tsx` | App (first visit) | localStorage |
| `learn/QuizSection.tsx` | LearnPage | localStorage (progress) |
| `learn/ReadingProgress.tsx` | LearnPage | Scroll position |
| `learn/LearnComponents.tsx` | LearnPage | Shared UI components with section share buttons |

### Edge Function Actions (`supabase/functions/stock-data/index.ts`)
| Action | Description | Cache TTL |
|--------|-------------|-----------|
| `search` | Ticker/company search | 30 days |
| `quote` | Real-time stock quote | 5 min |
| `profile` | Company profile & logo | 7 days |
| `overview` | Company overview/fundamentals | 7 days |
| `series` | Price time series | 4 hours |
| `news` | Stock-specific news (relevance-filtered) | 30 min |
| `peers` | Similar companies | 7 days |
| `recommendation` | Analyst consensus | 24 hours |
| `earnings` | EPS history | 7 days |
| `indices` | Market indices (Yahoo Finance) | 10 min |
| `technicals` | RSI, MACD indicators | 4 hours |
| `full` | Combined profile+quote+overview | 3 min |
| `massive_financials` | Quarterly financial statements | 24 hours |
| `massive_ticker` | Polygon ticker details | 7 days |
| `massive_dividends` | Dividend history | 7 days |
| `massive_splits` | Stock split history | 7 days |
| `massive_aggs` | Price aggregates | 4 hours |
| `massive_snapshot` | Real-time snapshot | 5 min |
| `massive_related` | Related companies | 7 days |
| `massive_news` | Polygon news feed | 30 min |
| `market_news` | General market news (4 sources) | 15 min |
| `gainers_losers` | Daily top movers | 30 min |
| `most_active` | Highest volume stocks | 10 min |
| `top_companies` | Top 10 by market cap | 15 min |
| `currency_rates` | FX rates (150+ currencies) | 60 min |
| `hidden_gems` | Analyst-favored underdogs | 30 min |
| `commodities` | Commodity prices (Yahoo) | 10 min |
| `commodity_history` | Commodity price history | varies |
| `simfin_statements` | SimFin financial data | 7 days |
| `eulerpool_profile` | Eulerpool company data | 7 days |

### Database Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `api_cache` | Backend API response cache | Public read, service write |
| `watchlist` | User's saved stocks (with groups & notes) | User-scoped CRUD |
| `portfolio_positions` | User's stock holdings | User-scoped CRUD |
| `price_alerts` | User's price target alerts | User-scoped CRUD |
| `stock_votes` | Community sentiment votes | Public read, user insert/update |
| `stock_comments` | Community stock comments | Public read, user insert/delete |
| `profiles` | User profile data | Public read, user update |
| `user_roles` | Role-based access control | User read own, service manage |

### Known Quirks & ADR Handling
- **TSMC (TSM)**: ADR with 5:1 ratio. Finnhub returns total ordinary shares, causing inflated computed market cap. Fixed with `ADR_RATIOS` map in edge function.
- **ETF Filtering**: `isCommonStock()` blacklist + `isETFByName()` post-enrichment filter removes ETFs/leveraged products from rankings.
- **Index Charts**: Real indices don't have intraday data via our APIs, so ETF proxies (SPY for S&P 500, etc.) are used for chart visualization.
- **Index Performance**: Longer period values (1W, 1M, etc.) are estimated from 1D change — marked with asterisk.

## i18n System
All user-facing text uses `t("key")` from `LanguageContext`. Translations are in:
- `src/contexts/LanguageContext.tsx` → Main app translations
- `src/i18n/learnTranslations.ts` → Learn page translations

Supported languages: German (de, default), English (en).

## Styling
- Tailwind CSS with semantic tokens from `index.css`
- shadcn/ui components in `src/components/ui/`
- Font: Space Grotesk (display), system sans-serif (body)
- Theme: Dark/Light mode via `next-themes`
- All colors use HSL CSS variables: `--primary`, `--background`, `--foreground`, etc.

## Features Overview
- **Currency Toggle**: Global USD/EUR conversion via CurrencyContext
- **Watchlist**: Groups, notes, CSV export, sparklines, performance sorting
- **Portfolio**: Position tracking, P&L calculation, allocation pie chart
- **Price Alerts**: Set above/below targets on stock detail pages, manage in settings
- **Market Heatmap**: Treemap visualization on sentiment page
- **Calculators**: 12 financial calculators including FIRE, DCA, Options, Tax-Loss Harvesting
- **Learn Center**: 13 sections, interactive quizzes, reading progress bar, section share buttons
- **Admin Dashboard**: Platform statistics (admin role required via user_roles table)
- **Onboarding**: 4-step guide for first-time users
- **PWA**: Web manifest for installable app
