

# Comprehensive Improvement Plan for StoneStocks

This plan covers feature additions, quality improvements, and bug fixes across the entire application. Organized by priority and grouped into logical work packages.

---

## Phase 1: Core Data Quality & Backend Fixes

### 1.1 ETF/Leveraged Product Filter (from existing plan)
- Extend `ETF_BLACKLIST` in `stock-data/index.ts` with additional tickers
- Apply `isETFByName()` filter after `enrichWithProfileData` in `handleGainersLosers` and `handleMostActive`
- Verify filtered results return only common stocks

### 1.2 Auth Page English Translation (from existing plan)
- Replace all German-only strings in `AuthPage.tsx` with `t()` translation keys
- Verify all auth keys exist in `LanguageContext.tsx` translations

### 1.3 Currency Conversion on Stock Detail Pages (from existing plan)
- `StockChart.tsx`: Already uses `useCurrency` -- verify Y-axis and tooltip show converted values (looks done)
- `FinancialChart.tsx`: Already uses `useCurrency` -- verify `effectiveFormat` works correctly (looks done)
- `MetricsGrid.tsx`: Already uses `useCurrency` -- verify `fmtCur` applies correctly (looks done)
- `KeyMetrics.tsx`: Already uses `useFormattedCurrency` (looks done)
- `StockDetail.tsx`: `formatDividendValue` already uses `convert` (looks done)
- **Action**: Verify these all work end-to-end; fix any remaining `$` hardcoded values

### 1.4 Clean Up User Data
- Execute `DELETE FROM watchlist;` and `DELETE FROM profiles;` via database tool
- Verify cascade behavior works correctly

---

## Phase 2: Missing Features & UX Improvements

### 2.1 Portfolio Summary Dashboard
**Current state**: Portfolio page shows individual positions but no aggregate summary (total value, total P&L, daily change).

**Add**:
- Total portfolio value card at the top
- Total unrealized P&L (absolute + percentage)
- Daily portfolio change
- Use a shared state approach where `PositionRow` reports its values up to the parent

### 2.2 Screener Enhancements
**Current state**: Screener only filters `topCompanies` data (limited dataset). No sector filter.

**Add**:
- Sector/Industry dropdown filter
- Revenue Growth filter
- Profit Margin filter
- Results count badge
- "Reset Filters" button

### 2.3 Watchlist Sharing Improvements
**Current state**: `SharedWatchlistPage` exists but the sharing flow from WatchlistPage is unclear.

**Add**:
- Copy-to-clipboard share link button on WatchlistPage
- Proper URL parameter handling for shared watchlists

### 2.4 Compare Page: Add More Metrics
**Current state**: Compare page shows basic metrics.

**Add**:
- Revenue Growth YoY
- Free Cash Flow
- Debt-to-Equity ratio
- Operating Margin comparison
- Color-coded "winner" highlighting per metric row

---

## Phase 3: New Features

### 3.1 Stock Price Ticker Tape
Add a horizontally scrolling ticker tape below the header showing real-time prices of major indices and top stocks (like Bloomberg/Yahoo Finance).

- New component `TickerTape.tsx`
- Uses `useMarketIndices` data
- CSS animation for smooth infinite scroll
- Shows: symbol, price, change%, colored arrows

### 3.2 Recent Searches / Search History
**Current state**: SearchBar has no memory of previous searches.

**Add**:
- Store last 10 searches in `localStorage`
- Show recent searches dropdown when search is focused and empty
- Clear history button

### 3.3 Watchlist Price Alerts Summary
**Current state**: Price alerts exist but there's no central dashboard view.

**Add**:
- Alerts summary section on Settings page showing all active alerts with current price vs target
- "Triggered" alerts history
- Quick-delete from the list

### 3.4 Dark/Light Mode Chart Color Optimization
**Current state**: Chart colors are hardcoded HSL values that may not look optimal in both themes.

**Fix**:
- Use CSS variable-based colors for all Recharts components
- Ensure sufficient contrast in both light and dark modes
- Test all financial charts, stock chart, and pie chart

### 3.5 404 Page Enhancement
**Current state**: NotFound page is likely basic.

**Add**:
- Search bar on 404 page
- Popular stocks quick links
- Animated illustration

---

## Phase 4: Performance & Quality

### 4.1 Image Loading Optimization
- Add `loading="lazy"` to all company logos (partially done)
- Add fallback placeholder for broken logo URLs
- Use `onError` handler on `<img>` tags to show initials fallback

### 4.2 Error Handling Improvements
- Add error states to all data-fetching components (some only show loading, not errors)
- Add retry buttons on error states
- Toast notifications for failed API calls

### 4.3 SEO & Accessibility
- Add `document.title` updates per page using `useEffect`
- Add `meta description` tags
- Ensure all interactive elements have proper `aria-labels`
- Add keyboard navigation support for custom dropdowns

### 4.4 Mobile Bottom Nav Badge
- Add notification badge on Watchlist icon showing count
- Add activity indicator on Portfolio icon

---

## Phase 5: Backend Improvements

### 5.1 API Rate Limit Protection
**Current state**: Edge function makes multiple API calls without rate limiting.

**Add**:
- Request deduplication in the edge function
- Exponential backoff on API failures
- Better error messages when rate limited

### 5.2 Cache Cleanup Job
**Current state**: Expired cache entries accumulate in `api_cache` table.

**Add**:
- SQL function to delete expired cache entries
- Call it periodically (e.g., on each edge function invocation with 1% probability)

### 5.3 User Activity Tracking Table
**Add** a `user_activity` table to track:
- Last login timestamp
- Page views (aggregate, not tracking)
- Useful for the admin dashboard

---

## Implementation Order (estimated effort)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 1 | ETF filter expansion | `stock-data/index.ts` | Small |
| 2 | Auth page English | `AuthPage.tsx`, `LanguageContext.tsx` | Small |
| 3 | Delete user data | SQL migration | Tiny |
| 4 | Portfolio summary dashboard | `PortfolioPage.tsx` | Medium |
| 5 | Ticker tape component | New `TickerTape.tsx`, `Header.tsx` | Medium |
| 6 | Search history | `SearchBar.tsx` | Small |
| 7 | Screener filters | `ScreenerPage.tsx` | Medium |
| 8 | Compare page metrics | `ComparePage.tsx` | Small |
| 9 | Page titles (SEO) | All page files | Small |
| 10 | Image error fallbacks | Multiple components | Small |
| 11 | 404 page enhancement | `NotFound.tsx` | Small |
| 12 | Error states | Multiple components | Medium |
| 13 | Chart color optimization | Multiple chart components | Small |
| 14 | Cache cleanup | `stock-data/index.ts`, SQL | Small |
| 15 | Watchlist alerts summary | `SettingsPage.tsx` | Medium |
| 16 | Mobile bottom nav badges | `BottomNav.tsx` | Small |
| 17 | Accessibility improvements | Multiple files | Medium |

---

## What Will NOT Be Changed
- Core API architecture (tryInOrder fallback chain)
- Database schema (except cleanup + optional activity table)
- Authentication flow (already working)
- Fear & Greed Index calculation (just restored to original)

