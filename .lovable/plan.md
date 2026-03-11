## Plan: Replace Breadth & Price Strength Indicators

### Problem

"Market Breadth" and "Price Strength" both derive from the same gainers/losers data with similar logic (cumulative magnitude vs average magnitude). They're redundant and don't add independent signal.

### Replace With

**1. Advance/Decline Ratio (replaces Market Breadth, 15%)**
Simple but distinct: ratio of number of advancing stocks to total stocks. Unlike the old breadth (which summed magnitudes), this measures *participation* — how many stocks are rising regardless of how much. High participation = broad rally = greed.

- `adRatio = advancingCount / (advancingCount + decliningCount)`
- `score = adRatio × 100`

**2. Extreme Movers (replaces Price Strength, 10%)**
Counts stocks with moves > ±3% and checks which side dominates. Many extreme gainers = euphoria/greed; many extreme losers = panic/fear. This captures *tail behavior* which is fundamentally different from averages.

- `extremeGainers = stocks with change > +3%`
- `extremeLosers = stocks with change < -3%`
- `score = extremeGainers / (extremeGainers + extremeLosers) × 100` (default 50 if none)

### Weight Redistribution


| Indicator                                  | Old Weight | New Weight |
| ------------------------------------------ | ---------- | ---------- |
| Market Momentum                            | 25%        | 25%        |
| Market Breadth → **Advance/Decline Ratio** | 20%        | 15%        |
| Volatility                                 | 15%        | 15%        |
| Safe Haven Demand                          | 12%        | 12%        |
| Price Strength → **Extreme Movers**        | 5%         | 10%        |
| Junk Bond Demand                           | 5%         | 5%         |
| Commodity Risk Appetite                    | 10%        | 10%        |
| Index Correlation                          | 8%         | 8%         |
| **Total**                                  | 100%       | 100%       |


### File Changes

- `src/pages/MarketSentimentPage.tsx`: Replace indicators #2 (lines 88-110) and #5 (lines 169-193) with the two new indicators, update weights and descriptions. (DE+EN).

Ggf füge noch einen weiteren Indikator hinzu und nehme die 5% von Extreme movers