

## Problem Analysis

The "Top Companies by Market Cap" list is unreliable because:

1. **Single data source dependency**: All 128 companies are fetched exclusively from Finnhub. If Finnhub rate-limits or errors on a batch, those companies get `marketCap: 0` and are filtered out entirely (line 1441).
2. **No retry logic**: Failed fetches silently return zeros — no retries, no fallback providers.
3. **Batch racing**: 15 parallel requests per batch can hit Finnhub's rate limit, causing random companies to drop.
4. **Short cache TTL (30 min)**: Frequent re-fetches increase the chance of hitting rate limits.

## Plan

### 1. Add retry + fallback per company in `handleTopCompanies` (edge function)

- Wrap each company fetch in a retry (1 retry on failure).
- If Finnhub fails after retry, fall back to **Polygon snapshot** (`/v3/reference/tickers/{symbol}`) or **Twelve Data quote** to get price + market cap.
- This ensures individual company failures don't silently drop entries.

### 2. Use cached data as fallback for missing companies

- Before returning, compare the result set against the full `TOP_COMPANIES` list.
- For any company that's still missing (marketCap=0), attempt to load the **previous cached result** and merge in stale data for those symbols, marking them with a `stale: true` flag.
- This way the list never randomly loses companies — worst case it shows slightly outdated data.

### 3. Increase cache TTL and add stale-while-revalidate pattern

- Increase `top_companies` TTL from 30 minutes to 60 minutes to reduce API pressure.
- Implement a soft-expiry: serve cached data immediately while triggering a background refresh, so users always see a full list.

### 4. Add PE and dividend yield to the response

- Currently `handleTopCompanies` doesn't return `pe` or `dividendYield`, which the Screener page needs (it filters on these but they're always undefined from this endpoint).
- Fetch basic metrics from the Finnhub profile response where available, improving screener functionality as a side benefit.

### Files Changed

- `supabase/functions/stock-data/index.ts`: Modify `handleTopCompanies()` — add retry logic, Polygon/TwelveData fallback per company, stale cache merging, increased TTL, and PE/yield fields.

