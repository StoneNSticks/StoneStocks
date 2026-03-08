

# Comprehensive Upgrade Plan: StoneStocks to Top-Level

## Critical Bug Fixes

### 1. TSMC Market Cap Fix (the real root cause)
The `MAX_REASONABLE_MCAP` check at line 1047 only applies to Polygon data. Finnhub's `marketCapitalization` for TSM returns ~49T (TWD-denominated ADR cap), and since `finnhubMarketCap > 0` is checked first without any cap, it passes through unchecked.

**Fix in `supabase/functions/stock-data/index.ts`**: Apply the $8T sanity cap to ALL sources including Finnhub:
```
if (finnhubMarketCap > 0 && finnhubMarketCap < MAX_REASONABLE_MCAP) {
  marketCap = finnhubMarketCap;
} else if (polygonMarketCap > 0 && polygonMarketCap < MAX_REASONABLE_MCAP) {
  marketCap = polygonMarketCap;
} else {
  marketCap = computedMarketCap;
}
```
Also clear the `api_cache` for key `market:top_companies:v2` via SQL migration.

### 2. ETF Leak in Most Active / Gainers-Losers
SPDN, PLTD, TSLG still appear in most_active results. Add these to the `ETF_BLACKLIST` set and add more name-based filter keywords: "inverse", "single stock", "roundhill", "tuttle".

## Feature Additions & Improvements

### 3. Watchlist: Real Company Logos + Names
Currently watchlist items show generic 2-letter avatars. Fetch company profile (name + logo) alongside the quote for each watchlist item, displaying the actual company logo and full name instead of just the ticker symbol.

### 4. Watchlist: Performance Sorting
The `sortMode` includes "performance" as a type but never implements it. Wire up actual sorting by `quote.dp` (daily percent change) so users can rank their watchlist by today's performance.

### 5. Watchlist: Daily P&L Summary Card
Add a summary card at the top showing aggregate daily change across all watched positions (sum of individual dp values, average performance), making it feel more like a real portfolio dashboard.

### 6. Homepage: "Fear & Greed" Style Market Sentiment Indicator
Add a visual gauge/meter showing overall market sentiment based on the indices data already fetched (average change of S&P, Nasdaq, Dow). Display as a colored arc gauge with labels like "Extreme Fear" to "Extreme Greed".

### 7. Stock Detail: Add 52-Week Range Visual Bar
In `MetricsGrid.tsx` or `StockDetail.tsx`, render the 52-week high/low as a visual progress bar showing where the current price sits within the range — a common feature on professional stock sites.

### 8. Calculator: Currency Converter Tool
Add a new calculator tab that uses the already-fetched `currency_rates` data to let users convert between currencies. Simple two-dropdown + amount input design.

### 9. Profile Page: Avatar Upload with Initials Fallback
Show a large avatar circle with user initials on the profile page. Use a gradient based on the username hash for visual distinction.

### 10. Settings: Export Watchlist as CSV
Add a button in Settings or Watchlist that exports the current watchlist symbols (and dates added) as a downloadable CSV file.

### 11. Improve Mobile Navigation
The header nav items can overflow on small screens. Ensure the mobile sheet menu includes all nav items with proper icons and active state indicators.

### 12. Learn Page: Add Visual Diagrams
Add simple SVG/CSS-based visual diagrams for key concepts:
- Candlestick chart anatomy diagram (body, wick, open/close)
- Risk/return scatter plot illustration
- Options payoff diagrams (call/put P&L curves)
These would be built as React components with Tailwind styling, no external images needed.

### 13. NotFound Page Enhancement
Currently a basic 404. Make it visually consistent with the app, include a search bar and links to popular pages.

### 14. Commodity Detail: Related Commodities Section
Show links to other commodities at the bottom of each commodity detail page for easy navigation between assets.

### 15. Loading States & Error Boundaries
Add a global error boundary component and improve loading skeletons across pages for a more polished feel.

## Technical Details

### Files to modify:
- `supabase/functions/stock-data/index.ts` — TSMC cap fix (line 1047), ETF blacklist expansion (line 718), redeploy
- SQL migration — clear stale cache: `DELETE FROM api_cache WHERE cache_key = 'market:top_companies:v2';`
- `src/pages/WatchlistPage.tsx` — company logos/names, performance sort, P&L summary
- `src/components/MetricsGrid.tsx` or `src/pages/StockDetail.tsx` — 52-week range bar
- `src/pages/Index.tsx` — sentiment gauge component
- `src/pages/CalculatorPage.tsx` — currency converter tab
- `src/pages/ProfilePage.tsx` — avatar with initials
- `src/pages/SettingsPage.tsx` — CSV export button
- `src/pages/LearnPage.tsx` + `src/components/learn/LearnComponents.tsx` — visual diagrams
- `src/pages/NotFound.tsx` — redesign
- `src/pages/CommodityDetail.tsx` — related commodities
- `src/components/Header.tsx` — mobile nav polish

### Execution order:
1. TSMC bug fix + cache clear + ETF blacklist (critical bugs first)
2. Watchlist upgrades (logos, performance sort, P&L summary)
3. Stock detail 52-week bar + market sentiment gauge
4. Calculator currency converter + settings CSV export
5. Learn page diagrams + NotFound redesign + commodity related section
6. Mobile nav + loading polish

