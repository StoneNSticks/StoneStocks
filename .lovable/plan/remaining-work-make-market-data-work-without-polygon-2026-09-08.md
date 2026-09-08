# Remaining work: make market data work without Polygon

## What I checked (live, just now)

- The stock data service is healthy again: top companies, gainers/losers and indices all answer in under a second, 127 of 127 companies with correct market caps. The per-request timeout added earlier stopped the crashes that produced the 502 errors.
- The earnings alert schedule is real and running: two daily jobs (07:00 and 13:00 UTC) exist and call the notification service with the required secret. Calls with the secret succeed, calls without it are rejected. Nothing more is needed there.
- One thing is still broken: the Polygon/Massive data keys are being rejected. A live request for company details came back empty. Everything that depends only on that provider silently returns nothing.

## What is affected today

These parts of a stock page get no data at all: detailed company profile, financial statements, dividend history, stock splits, snapshot, related companies, and provider news. The chart and quote paths are fine because they already fall back to Yahoo.

## Proposed fixes

1. Stop calling a provider that is refusing us. Track rejections during a request; after a couple of failures, skip that provider for the rest of the run. This removes wasted waiting time, which was the second cause of the earlier crashes.
2. Add substitutes so those page sections fill up again without Polygon:
   - Company profile and related companies from the existing secondary provider we already pay for.
   - Dividends, splits and financial figures from the free Yahoo endpoints already used elsewhere in the service.
   - Company news from the existing news provider.
   - Snapshot from the existing quote path.
3. Cap the cold-start work for the top companies list with a time budget: if the list is not fully built in time, serve the previous list and finish the refresh in the background, so a first visitor after a cache expiry never waits.
4. Optional and up to you: if you can get fresh Polygon keys from your dashboard, I can store them and the original source comes back as the preferred one. The fallbacks above make the site work either way.

## Technical notes

- `supabase/functions/stock-data/index.ts`: add a module-level failure counter in `fetchMassive`, throwing a short-circuit error once tripped; rewrite `handleMassiveTickerDetails`, `handleMassiveDividends`, `handleMassiveSplits`, `handleMassiveSnapshot`, `handleMassiveRelated`, `handleMassiveNews`, `handleMassiveFinancials` and `handleMassiveAggregates` to fall through to Finnhub/Yahoo instead of returning `null`.
- `handleTopCompanies`: wrap the batch loop in a deadline check (about 20s), return sanitized stale data when exceeded and continue the refresh via `EdgeRuntime.waitUntil`.
- No frontend changes needed; the existing helpers in `src/lib/stockApi.ts` keep their shapes.
