---
name: stonestocks-financial-domain
description: Use when working on StoneStocks market data, sentiment, rankings, heatmap, currency, or learn/glossary features. Triggers on finance, stock, market, fear & greed, heatmap, glossary, learn.
---

# StoneStocks Financial Domain

## When to use
- Adding or modifying market data, rankings, indices, or stock-detail features.
- Working on Fear & Greed, sentiment indicators, or market heatmap.
- Handling currency conversion, multi-language finance content, or glossary/learn.
- Debugging market data accuracy, cache behavior, or ranking order.

## Market data conventions
- Primary price source: Yahoo Finance (avoids Finnhub rate limits).
- Primary metadata source (logos, sectors): Finnhub, 7-day TTL.
- Top Companies / Gainers / Losers / Most Active: cache v11; minimum market cap $1B USD.
- Outside US trading hours (Mon–Fri 9:30–16:00 ET) and weekends: serve stale cache from last session with 12h TTL.
- Indices (S&P 500, DAX, Nikkei, etc.) use Yahoo Finance tickers like `^GDAXI` and link to `/index/:symbol`.
- News is aggregated and deduplicated; stock-detail news filters for symbol relevance in headline/summary and excludes market summaries.

## Market cap sanity
- Reject any market cap > $5T USD as invalid.
- ADR symbols (TSM, BABA, ASML, SAP, TCEHY, etc.) use Finnhub for market cap, not Yahoo, because Yahoo returns the parent listing cap in local currency.
- Client-side sort must always enforce descending market cap as a safety net.

## Fear & Greed index
- Ten-indicator model: Momentum, Volatility, Regional Divergence, Sector Breadth, Safe Haven, Risk-On/Off.
- Sector Breadth has 7% weight redistributed from Risk-On/Off (5%) and Safe Haven (2%).
- Normalization formula must be exposed via transparency toggle: `Score = ((avg index change + 3%) / 6%) × 100`.
- No winner/loser lists on the sentiment page.
- All Polymarket signals and indicators are permanently forbidden.

## Stock curation
- Rankings (Gainers, Losers, Volume) must show only real common stocks.
- Strictly exclude: ETFs, leveraged/inverse products (2x/3x, Short), warrants, units, rights.
- Use ticker blacklists and name-based filters (search for "ETF", "Leveraged", etc. after enrichment).
- "Hidden Gems" requires Analyst Consensus > 0.5.

## Market heatmap
- Visualizes ~100–130 companies with dynamic sector extraction (Consumer Defensive, Utilities, Real Estate, etc.).
- Static grid layout; no animations.
- All cells must respect the global USD/EUR currency toggle.

## Currency conversion
- Global USD/EUR toggle in the header applies to ALL prices, market caps, charts (Y-axis and tooltips), metrics, and calculators.
- Use real-time exchange rates; conversions happen at display time, not storage time.

## Learn & Glossary
- Learn page: 35 chapters numbered 1–35 sequentially; TOC must stay synchronized.
- Glossary: fuzzy/tolerant search with Levenshtein distance, substring ranking, and synonym recognition.
- Desktop glossary uses a two-column grid; letter buttons without matching terms are disabled/dimmed.
- Mobile glossary letter bar is horizontally scrollable.
- Missing translations fall back to German automatically.

## Tone rules
- Project tone is strict: no em dashes, no repetitive AI phrases, no overly formal language.
- German and English supported via `useT` hook and localStorage `app_lang`.

## Security
- API keys live only as Supabase Edge Function secrets. Never put Finnhub, Alpha Vantage, Twelve Data, FRED, or service-role keys in the repo or in skill files.
- Only the Supabase publishable URL + anon key may appear in client config.
