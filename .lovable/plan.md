

# StoneStocks — Comprehensive Improvement Plan

## A. Bugs & Issues to Fix

### A1. Screener only uses Top Companies data
The `ScreenerPage` fetches from `useTopCompanies()` which returns only ~10 stocks. The screener should query a broader dataset (e.g. S&P 500 constituents or a dedicated screener endpoint) to be actually useful.

### A2. AdminPage comment says "no admin role check" but does use `useIsAdmin`
The JSDoc is outdated — harmless but misleading. Update the comment.

### A3. Sector Performance relies on top_companies sector field
Only 10 companies means only 2-3 sectors shown. Either expand the top_companies response to 30+ stocks or create a dedicated `sector_performance` edge function action that groups more tickers by sector.

### A4. Price alerts are stored but never checked
`price_alerts` table exists with user-set targets, but there's no background job or realtime check that triggers notifications when a stock hits the target price.

### A5. Portfolio P&L doesn't account for currency conversion consistently
`PortfolioPage` uses `formatCurrency` directly in some places instead of always going through `useCurrency().convert()`.

---

## B. Missing i18n / Translations

### B1. Hardcoded English strings throughout
Many components have inline English text not wrapped in `t()`:
- `Index.tsx`: "Quick Actions", "Market Pulse", "Stock Compare", "Rankings"
- `MetricsGrid.tsx`: metric labels ("Market Cap", "P/E Ratio", etc.)
- `KeyMetrics.tsx`: all labels hardcoded English
- `ComparePage.tsx`: metric labels
- `AnalystTargets.tsx`: some labels
- `MetricBars.tsx`: labels

### B2. OnboardingModal has separate DE/EN arrays instead of using `t()`
Should use translation keys for consistency.

---

## C. Data Quality Improvements

### C1. Expand ETF blacklist further
Add more leveraged/inverse tickers that slip through (e.g. BITX, BITU, SOXL, SOXS, TQQQ, SQQQ are in the list but continuously new products appear).

### C2. Sector mapping for Top Companies
Currently relies on `finnhubIndustry` which returns granular industry names ("Semiconductors") not standard GICS sectors ("Technology"). Add a mapping from industry to sector for cleaner grouping.

### C3. News deduplication improvements
Market news from 4 sources likely has duplicates. Check if dedup logic covers all sources.

### C4. Commodity history period handling
The `getCommodityHistory` action's cache TTL varies but isn't documented in the TTL map — verify correctness.

---

## D. UX / UI Enhancements

### D1. Loading states — replace Skeleton with shimmer animations
Current skeleton loading is functional but basic. Add pulse/shimmer for a more polished feel.

### D2. Empty states
Several pages show nothing when data is missing (e.g. empty watchlist for logged-out users, empty portfolio). Add illustrated empty states with CTAs.

### D3. Mobile bottom nav padding
Pages need `pb-16` on mobile to avoid content being hidden behind the fixed `BottomNav`.

### D4. Compare page — add chart comparison
Currently only shows metric cards side-by-side. Add an overlay price chart comparing normalized performance of selected stocks.

### D5. Watchlist — drag-and-drop reordering
Allow users to manually reorder their watchlist items.

### D6. Dark/Light mode — verify all custom colors
Ensure `text-gain`, `text-loss`, `text-chart-2`, etc. have proper dark/light mode values defined in `index.css`.

### D7. Search results — show recent searches
Store last 5 search queries in localStorage and show them as suggestions when the search bar is focused.

---

## E. Performance & Technical Debt

### E1. Edge function is 1567 lines
Split `stock-data/index.ts` into smaller modules if Deno supports it, or at least organize with clearer section comments.

### E2. `any` types everywhere
Components like `MetricsGrid`, `KeyMetrics`, `ComparePage` use `any` for props. Define proper TypeScript interfaces for API response shapes.

### E3. QueryClient has no default config
`new QueryClient()` uses defaults. Add global `staleTime`, `retry`, and `refetchOnWindowFocus` settings.

### E4. No error boundaries per section
Only one global `ErrorBoundary` exists. Individual sections (chart, metrics, news) should fail gracefully without crashing the whole page.

### E5. Bundle size — verify tree-shaking
`lucide-react` imports individual icons (good), but `recharts` and `framer-motion` are heavy. Consider lazy-loading chart components.

---

## F. Security & Auth

### F1. Admin page protection
`useIsAdmin` checks the `user_roles` table via RLS — verify the RLS policy is correct and not bypassable.

### F2. Rate limiting on edge function
No rate limiting on the edge function. Heavy users or scrapers could exhaust API quotas quickly.

### F3. Username uniqueness not enforced at DB level
The `profiles` table doesn't have a UNIQUE constraint on `username`. Two users could potentially register with the same username.

### F4. Account deletion
Settings page has a delete account UI (`showDelete` state) — verify it actually deletes from `auth.users` and cascades properly.

---

## G. New Features to Add

### G1. Email notifications for price alerts
Create a scheduled edge function (cron) that checks active `price_alerts` against current quotes and sends email notifications via the auth system's email provider.

### G2. Earnings calendar
Show upcoming earnings dates for watchlisted stocks. Data available via Finnhub's earnings calendar endpoint.

### G3. Stock comparison chart overlay
On `/compare`, add a normalized price chart (rebased to 100) showing all selected stocks overlaid.

### G4. Social features — follow other users' public watchlists
Allow users to make their watchlist public and follow other users' lists.

### G5. PWA push notifications
Leverage the existing `manifest.json` to add service worker + push notifications for price alerts.

### G6. Export portfolio to PDF
Generate a portfolio summary PDF with allocation chart, P&L table, and performance metrics.

### G7. Historical portfolio value tracking
Track daily portfolio value snapshots to show performance over time as a line chart.

### G8. Dividend calendar
Show upcoming ex-dividend dates for watchlisted/portfolio stocks using the existing `massive_dividends` data.

### G9. Stock screener with real data
Replace the current top-10-based screener with a proper screener using Polygon's screener API or a pre-built list of 500+ stocks with fundamental data cached daily.

### G10. Multi-currency support beyond USD/EUR
Add GBP, CHF, JPY, CAD to the currency toggle. The edge function already fetches 150+ rates.

---

## H. Remaining Items from Original Plan

### H1. User database cleanup
Run `DELETE FROM profiles;` and `DELETE FROM watchlist;` via migration to clear test data.

### H2. Auth page already translated
Auth page uses `t()` keys and translations exist in `LanguageContext.tsx` for all auth strings. This item from the original plan is already complete.

---

## Recommended Priority Order

1. **F3** — Username uniqueness constraint (security)
2. **A3/C2** — Sector performance data quality
3. **B1** — i18n coverage for metric labels
4. **D2** — Empty states for better UX
5. **A1/G9** — Real screener with broader data
6. **E3** — QueryClient defaults
7. **G1** — Price alert notifications
8. **G2/G8** — Earnings & dividend calendars
9. **D4/G3** — Compare chart overlay
10. **G10** — Additional currencies

