## Plan: Replace 3 Gainers/Losers-Based Indicators

### Problem

Three indicators (Advance/Decline Ratio 15%, Extreme Movers 5%, Market Participation 5%) all rely on gainers/losers data. The Junk Bond Demand proxy also uses gainers/losers (`topGainerAvg`, `topLoserAvg`). All four need to be replaced or refactored 

### New Indicators (replacing 25% total weight)

&nbsp;

### Also Fix: Junk Bond Demand (5%)

Currently uses `gainers.slice(0,5)` and `losers.slice(0,5)`. Replace with a pure commodity-based proxy: compare silver (industrial+safe hybrid) vs copper (pure cyclical). Or simplify to gold-oil spread.

- `spread = gold% - oil%` (positive = flight to safety = fear)
- `score = ((3 - spread) / 6) × 100`

### New Weight Distribution


| Indicator                  | Weight   |
| -------------------------- | -------- |
| Market Momentum            | 25%      |
| &nbsp;                     | &nbsp;   |
| Volatility (Proxy)         | 15%      |
| Safe Haven Demand          | 12%      |
| &nbsp;                     | &nbsp;   |
| Junk Bond Demand *(fixed)* | 5%       |
| Commodity Risk Appetite    | 10%      |
| &nbsp;                     | &nbsp;   |
| Index Correlation          | 8%       |
| **Total**                  | **100%** |


### File Changes

- `src/pages/MarketSentimentPage.tsx`: Remove indicators #2 (AD Ratio), #5a (Extreme Movers), #5b (Participation). Add 3 new indicators using only `indices` and `commodities` data. Fix Junk Bond to remove gainers/losers usage. Remove `gainers`/`losers` params from `computeSubIndicators` if no longer needed. Update header comment.