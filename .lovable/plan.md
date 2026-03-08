## Plan: Guarantee 10+ Sectors & Fix Accumulation

**Problem:** The component only shows sectors/industries present in the API data, which may yield fewer than 10 entries. Also, stocks can be double-counted across data sources.

**Solution:**

1. **Always show all 11 GICS sectors** in "Sectors" view — even those with no data get displayed as 0.00%. This guarantees 11 entries minimum:
  - Technology, Healthcare, Financials, Consumer Discretionary, Consumer Staples, Industrials, Energy, Utilities, Real Estate, Materials, Communication Services
2. **Fix accumulation** — the `allStocks` dedup by symbol is correct, but `mapToSector` can map the same stock's raw `sector` field inconsistently. Normalize the sector resolution so each stock maps to exactly one canonical sector.
3. **Industries view** — keep showing all unique industries from the data (already works), but also add a minimum: if fewer than 10 industries exist, pad with the missing GICS sectors as fallback entries.
4. **Visual:** Sectors with no data shown as gray/neutral 0.00% bars so the full market landscape is always visible.

**Files changed:** `src/components/SectorPerformance.tsx` only.  
  
wenn es ncith geht, dann nciht, ich hatte es in einer der vorherigen versionen aber gesehen. zudem mache noch einen indikator hinzu auf der mainpage unter dem fear/greed ainduikator

&nbsp;