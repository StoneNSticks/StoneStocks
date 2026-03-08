

# Next Phases: Backtesting, Stock Comparison Pro, Social Sharing

## Phase 1: Social Sharing

**What:** Add share buttons and Open Graph meta tags so users can share stock pages, watchlists, and portfolios on social media.

**Changes:**
- **`src/components/ShareButton.tsx`** (new): Reusable share component using Web Share API with clipboard fallback. Supports sharing stock pages, watchlist snapshots, and compare links. Buttons for Twitter/X, WhatsApp, copy link.
- **`src/pages/StockDetail.tsx`**: Add ShareButton next to the WatchlistStar in the header area.
- **`src/pages/WatchlistPage.tsx`**: Add ShareButton that generates a shareable link with selected symbols as query params.
- **`src/pages/ComparePage.tsx`**: Add ShareButton that encodes compared symbols into a shareable URL.
- **`index.html`**: Add Open Graph meta tags (og:title, og:description, og:image) with defaults for the app.

---

## Phase 2: Stock Comparison Pro

**What:** Enhance the existing ComparePage with overlay chart, side-by-side financial charts, and exportable comparison table.

**Changes:**
- **`src/components/NormalizedChart.tsx`**: Already exists. Verify it supports 3+ stocks with distinct colors and a legend.
- **`src/pages/ComparePage.tsx`**: 
  - Add tabbed view: "Overview" (existing metrics table), "Charts" (overlay price chart + financial bars), "Financials" (side-by-side revenue/income/margins)
  - Add "Export as CSV" button that exports the comparison metrics table
  - Allow up to 5 stocks (currently appears to support multiple already)
- **`src/components/CompareFinancials.tsx`** (new): Side-by-side financial chart comparison (revenue, net income, margins) using grouped bar charts from recharts. Fetches data via `useFullStock` for each symbol.

---

## Phase 3: Backtesting / Strategy Simulator

**What:** A page where users define a simple buy/sell strategy and run it against historical data to see hypothetical returns.

**Changes:**
- **`src/pages/BacktestPage.tsx`** (new): 
  - Strategy builder form: select stock, date range, initial investment, strategy type (SMA crossover, RSI threshold, buy-and-hold)
  - Uses existing `getTimeSeries` from stockApi to fetch historical data
  - Client-side backtesting engine computes: total return, annualized return, max drawdown, Sharpe ratio, win rate
  - Results displayed as equity curve chart (recharts AreaChart) + performance summary cards
  - Compare strategy vs buy-and-hold baseline
- **`src/lib/backtestEngine.ts`** (new): Pure functions for strategy simulation:
  - `runSMACrossover(data, shortPeriod, longPeriod)` - buy when short SMA crosses above long SMA
  - `runRSIStrategy(data, oversold, overbought)` - buy when RSI < oversold, sell when > overbought
  - `runBuyAndHold(data)` - baseline comparison
  - `calculateMetrics(trades, equity)` - compute return, drawdown, Sharpe, etc.
- **`src/App.tsx`**: Add route `/backtest` with lazy import
- **`src/components/BottomNav.tsx`** or **`src/components/Header.tsx`**: Add navigation link to Backtest page

### Backtesting Flow
```text
User Input                  Processing                 Output
+-----------+     +------------------------+     +------------------+
| Symbol    | --> | Fetch historical data   | --> | Equity curve     |
| Strategy  |     | Run strategy logic      |     | Performance stats|
| Dates     |     | Calculate trades        |     | Trade log        |
| Capital   |     | Compute metrics         |     | vs Buy & Hold    |
+-----------+     +------------------------+     +------------------+
```

---

## Implementation Order

1. Social Sharing (simplest, touches existing pages lightly)
2. Stock Comparison Pro (extends existing Compare page)
3. Backtesting (new page + engine, most complex)

## Files Summary

| Action | File |
|--------|------|
| Create | `src/components/ShareButton.tsx` |
| Create | `src/components/CompareFinancials.tsx` |
| Create | `src/pages/BacktestPage.tsx` |
| Create | `src/lib/backtestEngine.ts` |
| Edit | `src/pages/StockDetail.tsx` |
| Edit | `src/pages/WatchlistPage.tsx` |
| Edit | `src/pages/ComparePage.tsx` |
| Edit | `src/App.tsx` |
| Edit | `index.html` |

No database changes required -- all features are client-side.

