

# StoneStocks Comprehensive Upgrade Plan

This is a large-scale plan covering bug fixes, new features, UX improvements, and professional-grade additions across the entire platform.

---

## Phase 1: Critical Bug Fixes & Data Quality

### 1.1 Auth Page — Translate remaining German text to English
Some toast messages and labels in `AuthPage.tsx` may still be hardcoded in German. Audit and ensure all strings go through the `t()` translation system.

### 1.2 Currency conversion on Stock Detail pages
`StockChart.tsx`, `FinancialChart.tsx`, `MetricsGrid.tsx`, `KeyMetrics.tsx`, and `StockDetail.tsx` still show prices in USD only. Wire up `useCurrency()` to convert and display values in the user's selected currency with the correct symbol.

### 1.3 ETF/Leveraged product leak cleanup
Expand the ETF blacklist in the edge function with additional tickers (NVD, NVDL, NVDS, MSTX, TSLS, CONL, MSTZ, MSTU, SPDN, PLTD, TSLG) and add name-based filtering keywords ("inverse", "single stock", "roundhill", "tuttle", "tradr", "2x", "3x", "leveraged", "direxion", "proshares", "graniteshares", "defiance") applied post-enrichment to `handleGainersLosers` and `handleMostActive`.

### 1.4 Clear stale cache
SQL migration: `DELETE FROM api_cache WHERE cache_key LIKE 'market:%';` to flush any cached incorrect data.

---

## Phase 2: Portfolio Tracker (New Major Feature)

### 2.1 Database: Create `portfolio_positions` table
Columns: `id`, `user_id`, `symbol`, `shares`, `avg_cost`, `created_at`, `updated_at`. RLS: users CRUD own rows only.

### 2.2 Portfolio Page (`/portfolio`)
- Add position form: ticker search, shares, average cost
- Live valuation per position using `getQuote` (current price x shares)
- Total portfolio value, total cost basis, total P&L (absolute + percentage)
- Pie chart showing allocation by position
- Performance sparklines per holding
- Daily P&L summary card

### 2.3 Portfolio in Header nav
Add Portfolio link with `Briefcase` icon to nav items in `Header.tsx`.

---

## Phase 3: Stock Detail Page Enhancements

### 3.1 Analyst Price Targets section
Display consensus target price, high/low/median targets as a visual range bar (similar to 52-week bar). Data available from Finnhub's `price-target` endpoint — add handler in edge function.

### 3.2 Insider Trading section
Show recent insider transactions (buys/sells) in a table. Data from Finnhub `insider-transactions` — add edge function handler + new component `InsiderTrades.tsx`.

### 3.3 Earnings Calendar card
Show next earnings date, estimated vs actual EPS for past quarters in a mini bar chart. Data already partially available via `getEarnings`.

### 3.4 Technical Indicators card
Display RSI, MACD, SMA(50), SMA(200) as badges with bull/bear coloring. Data from existing `getTechnicals` endpoint.

### 3.5 Shareholder Structure
Display institutional ownership percentage and top holders if available from the Massive API.

### 3.6 Compare Mode
Add a "Compare" button that lets users search for a second stock and shows side-by-side metrics and overlaid price charts. New component `StockCompare.tsx`.

---

## Phase 4: Homepage & Market Data Improvements

### 4.1 Market Heatmap component
A treemap visualization showing S&P 500 sectors colored by daily performance (green = up, red = down), sized by market cap. New component `MarketHeatmap.tsx` using recharts `Treemap`.

### 4.2 Economic Calendar widget
Show upcoming key events (FOMC meetings, CPI releases, jobs reports) in a compact timeline. Can be sourced from a public API or hardcoded schedule for major events.

### 4.3 Sector Performance bars
Horizontal bar chart showing daily performance of each sector (Technology, Healthcare, Finance, Energy, etc.). Data derivable from existing top companies data grouped by sector.

### 4.4 IPO Calendar
List upcoming and recent IPOs with date, company name, price range. New edge function handler fetching from Finnhub's IPO calendar endpoint.

### 4.5 Trending Searches
Track and display most-searched tickers on the platform. Store search counts in a new `search_trends` table, display as a "Trending" section on homepage.

---

## Phase 5: News & Social Features

### 5.1 News Page redesign
- Add category filters (All, Technology, Energy, Finance, Crypto, etc.)
- Add search within news
- Infinite scroll / "Load more" pagination instead of fixed limit
- Thumbnail images for each article (already in API data)
- Reading time estimate

### 5.2 Social Sentiment Widget
For each stock, show a "community sentiment" meter. Users can vote bullish/bearish. New table `stock_votes` (user_id, symbol, vote, created_at). Display aggregate on StockDetail page.

### 5.3 Stock Comments / Discussion
Per-stock comment section where logged-in users can post short takes. New table `stock_comments` (id, user_id, symbol, content, created_at). Display below news on StockDetail. Realtime via Supabase subscription.

---

## Phase 6: Watchlist & Alerts

### 6.1 Watchlist Groups/Folders
Let users organize watchlist items into named groups (e.g., "Tech", "Dividends", "Speculative"). Add `group_name` column to watchlist table or create a `watchlist_groups` table.

### 6.2 Price Alerts
Users set target prices (above/below) for watched stocks. New table `price_alerts` (id, user_id, symbol, target_price, direction, triggered, created_at). A scheduled edge function checks and triggers (in-app notification via toast on next visit, or email if configured).

### 6.3 Watchlist Notes
Allow users to add a personal note/thesis to each watchlist item. Add `note` column to watchlist table.

### 6.4 Watchlist Sharing
Generate a shareable read-only link for a watchlist. New edge function that creates a public snapshot.

---

## Phase 7: Calculator & Tools Expansion

### 7.1 Options Profit Calculator
Input: stock price, strike, premium, expiry, option type (call/put). Output: P&L at various price points as a chart. Breakeven point visualization.

### 7.2 Retirement / Withdrawal Calculator
Input: portfolio size, annual withdrawal rate, expected return, inflation. Output: how many years the money lasts, Monte Carlo simulation chart.

### 7.3 Dollar-Cost-Averaging Simulator
Input: ticker, start date, monthly amount, end date. Shows what the portfolio would be worth if DCA'd into a specific stock over time. Uses historical price data.

### 7.4 Dividend Income Projector
Input: portfolio of dividend stocks with shares held. Output: projected annual dividend income, monthly breakdown, dividend calendar.

### 7.5 Tax-Loss Harvesting Tool
Input: positions with buy prices. Shows which positions are at a loss and calculates potential tax savings from selling.

---

## Phase 8: User Experience & Polish

### 8.1 Onboarding Flow
First-time users see a guided tour (3-4 step modal) explaining key features: search, watchlist, portfolio, learn. Store `onboarding_complete` in localStorage.

### 8.2 Keyboard Shortcuts
- `/` to focus search bar
- `w` to go to watchlist
- `p` to go to portfolio
- `Esc` to close modals
- Display shortcut hints in a help modal (`?` key)

### 8.3 Skeleton loading improvements
Every page/component should have proper skeleton states matching the final layout. Audit and fix any missing or mismatched skeletons.

### 8.4 Error Boundary component
Global error boundary with a friendly UI, retry button, and link to homepage. Wrap around routes in `App.tsx`.

### 8.5 PWA Support
Add a web manifest and service worker for installability. Users can "Add to Home Screen" on mobile for an app-like experience.

### 8.6 Breadcrumb navigation
On detail pages (StockDetail, CommodityDetail, IndexDetail), show breadcrumb trail: Home > Markets > AAPL.

### 8.7 Back to Top button
Floating button that appears after scrolling 500px, smooth-scrolls to top.

### 8.8 Print/Export Stock Report
On StockDetail, add "Export as PDF" button that generates a one-page summary of key metrics, chart screenshot, and company info.

---

## Phase 9: Learn Page Expansion

### 9.1 Interactive Quizzes
At the end of each section, 3-5 multiple-choice questions testing comprehension. Track progress in localStorage. Show completion badges.

### 9.2 SVG Visual Diagrams
- Candlestick anatomy diagram (body, wick, open/close/high/low labeled)
- Options payoff curves (call/put P&L at expiry)
- Risk/return scatter plot
- Yield curve shapes (normal, inverted, flat)
- Order book depth visualization

### 9.3 Glossary Page
Separate `/glossary` route with A-Z filterable financial terms dictionary. ~100+ terms with definitions. Search within glossary.

### 9.4 Reading Progress indicator
Sticky progress bar at the top showing how far the user has scrolled through the Learn page.

### 9.5 Bookmarkable sections
Each section gets its own anchor link. "Share this section" copy-link button.

---

## Phase 10: Index & Commodity Detail Improvements

### 10.1 Index Detail: Constituents list
Show top holdings/companies in each index with their weights. For S&P 500, Nasdaq, etc.

### 10.2 Index Detail: Historical performance table
Table showing 1D, 1W, 1M, 3M, 6M, YTD, 1Y, 5Y returns.

### 10.3 Commodity Detail: Related commodities sidebar
Links to other commodities at the bottom for easy navigation.

### 10.4 Commodity Detail: Supply/demand factors
Expandable section explaining key factors affecting each commodity's price.

---

## Phase 11: Rankings Page Overhaul

### 11.1 Sector-based rankings
Filter top companies by sector (Technology, Healthcare, Finance, etc.).

### 11.2 Custom ranking criteria
Let users sort by P/E, dividend yield, market cap, daily change, volume. Add dropdown selectors.

### 11.3 "Screener" feature
Basic stock screener: filter by market cap range, P/E range, dividend yield range, sector. Display matching stocks in a sortable table. New page `/screener`.

---

## Phase 12: Performance & Infrastructure

### 12.1 React.lazy + Suspense for route splitting
Lazy-load all page components to reduce initial bundle size.

### 12.2 Image optimization
Use `loading="lazy"` on all company logos. Add fallback avatars consistently.

### 12.3 Rate limiting awareness
Add graceful handling when API rate limits are hit — show cached data with a "data may be delayed" indicator instead of errors.

### 12.4 Accessibility audit
Ensure all interactive elements have proper ARIA labels, focus states, and keyboard navigation. Color contrast checks for both themes.

---

## Phase 13: Mobile-Specific Improvements

### 13.1 Bottom navigation bar (mobile)
On screens < 768px, show a fixed bottom nav bar with 5 icons (Home, Rankings, Portfolio, Watchlist, More) instead of relying solely on the hamburger menu.

### 13.2 Swipe gestures on watchlist
Swipe left to remove from watchlist with confirmation.

### 13.3 Pull-to-refresh
On mobile, pull down on data pages to manually refresh quotes.

---

## Phase 14: Admin & Analytics

### 14.1 Admin Dashboard
For admin-role users, show a `/admin` page with:
- Total registered users count
- Most-watched stocks
- API cache hit/miss statistics
- Error logs summary

### 14.2 User Activity tracking
Track page views per stock (anonymous, aggregated). Show "Most Viewed Today" on homepage.

---

## Execution Order (Estimated)

```text
Phase 1: Bug fixes & data quality          ~45 min
Phase 2: Portfolio Tracker                  ~90 min
Phase 3: Stock Detail enhancements          ~90 min
Phase 4: Homepage improvements              ~60 min
Phase 5: News & Social features             ~75 min
Phase 6: Watchlist & Alerts                 ~60 min
Phase 7: Calculator expansion               ~60 min
Phase 8: UX polish                          ~75 min
Phase 9: Learn page expansion               ~60 min
Phase 10: Index & Commodity improvements    ~30 min
Phase 11: Rankings & Screener               ~45 min
Phase 12: Performance & Infrastructure      ~30 min
Phase 13: Mobile improvements               ~45 min
Phase 14: Admin & Analytics                 ~30 min
─────────────────────────────────────────────
Total estimated:                           ~13 hours
```

### Files to create:
- `src/pages/PortfolioPage.tsx`
- `src/pages/ScreenerPage.tsx`
- `src/pages/GlossaryPage.tsx`
- `src/pages/AdminPage.tsx`
- `src/components/PortfolioSummary.tsx`
- `src/components/MarketHeatmap.tsx`
- `src/components/SectorPerformance.tsx`
- `src/components/InsiderTrades.tsx`
- `src/components/StockCompare.tsx`
- `src/components/StockComments.tsx`
- `src/components/EarningsCard.tsx`
- `src/components/TechnicalIndicators.tsx`
- `src/components/AnalystTargets.tsx`
- `src/components/BottomNav.tsx`
- `src/components/ErrorBoundary.tsx`
- `src/components/learn/QuizSection.tsx`
- `src/components/learn/SVGDiagrams.tsx`

### Files to modify:
- `supabase/functions/stock-data/index.ts` — new handlers + ETF filter fix
- `src/App.tsx` — new routes
- `src/components/Header.tsx` — Portfolio nav + keyboard shortcuts
- `src/pages/StockDetail.tsx` — new sections
- `src/pages/NewsPage.tsx` — redesign
- `src/pages/WatchlistPage.tsx` — groups, notes, alerts
- `src/pages/RankingsPage.tsx` — filters, screener link
- `src/pages/LearnPage.tsx` — quizzes, diagrams, progress
- `src/pages/IndexDetail.tsx` — constituents, performance table
- `src/pages/CommodityDetail.tsx` — related, supply/demand
- `src/pages/CalculatorPage.tsx` — new calculators
- `src/pages/ProfilePage.tsx` — activity stats
- `src/pages/SettingsPage.tsx` — alerts config, export
- `src/pages/AuthPage.tsx` — i18n fix
- `src/components/StockChart.tsx` — currency conversion
- `src/components/FinancialChart.tsx` — currency conversion
- `src/components/MetricsGrid.tsx` — currency conversion
- `src/components/KeyMetrics.tsx` — currency conversion
- `src/contexts/LanguageContext.tsx` — new translation keys
- `src/i18n/learnTranslations.ts` — quiz + glossary translations

### Database migrations needed:
- `portfolio_positions` table + RLS
- `stock_votes` table + RLS
- `stock_comments` table + RLS
- `price_alerts` table + RLS
- `search_trends` table + RLS
- `watchlist_groups` table or `group_name` column on watchlist
- `note` column on watchlist
- Cache flush migration

