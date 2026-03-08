## Plan: Enhanced Heatmap, Analyst Ratings Redesign & Deep Company Intelligence

### 1. Enhanced Market Heatmap (`MarketHeatmap.tsx`)

**Current state:** Simple treemap with 30 stocks, colored by daily change.

**Changes:**

- Add sector grouping — nest stocks within sector categories so the treemap shows sector blocks
- Add interactive click-to-navigate (click stock → go to `/stock/:symbol`)
- Add sector filter tabs (All, Tech, Finance, Healthcare, etc.)
- Add toggle between "Daily Change" and "Market Cap" coloring modes
- Improve labels: show market cap in compact format (e.g. "2.1T") alongside percentage
- Better responsive sizing and hover tooltips with more detail

### 2. Redesigned Analyst Ratings Section (Stock Detail Page)

**Current state:** `AnalystTargets` shows a simple price target bar. `RecommendationChart` shows stacked bar chart history.

**Changes — new `AnalystConsensus` component replacing both:**

- **Gauge visualization:** Semi-circle/donut gauge showing consensus (Strong Buy → Strong Sell) with needle indicator
- **Current vs 12-month history:** Side-by-side comparison showing how consensus shifted over time (mini sparkline or trend arrow)
- **Price target section:** Low / Median / High target prices displayed as a horizontal range with current price marker, plus upside/downside percentage
- **Analyst count breakdown:** Horizontal segmented bar with counts for each rating category
- **Trend indicator:** Arrow showing if consensus improved or worsened vs 3 months ago
- Combine data from both `recommendation` and `overview` (AnalystTargetPrice) into one unified card

### 3. Deep Company Intelligence (`CompanyIntelligence.tsx`)

**Current state:** `CompanyInfoCard` shows basic info (sector, industry, country, employees, description).

**New component with rich company data, sourced from existing API data + enhanced overview parsing:**

- **Products & Services:** Extract from company description using keyword parsing, show as tagged chips
- **Geographic Revenue Breakdown:** Show primary market (country of incorporation, exchange location) with a simple geographic indicator
- **Supply Chain / Key Relationships:** Use `peers` data + `massive_related` to show key business relationships as a visual network/list
- **Market Position:** Show market cap rank within sector (from `top_companies` data), competitive positioning vs peers
- **Key Customers/Segments:** Parse from description and industry classification
- **Revenue segments visualization:** If available from financials data, show revenue by segment

### 4. Additional Data Enhancements on Stock Detail

- **Institutional Ownership indicator:** Parse from overview data (InstitutionPercent if available)
- **Short Interest / Float data:** Display if available from overview
- **Competitive Comparison mini-table:** Show 3-4 peers side by side with key metrics (P/E, Market Cap, Revenue Growth)
- **Risk Score:** Computed from Beta, volatility, debt-to-equity ratio — displayed as a colored badge

### Technical Approach

**Files to create:**

- `src/components/AnalystConsensus.tsx` — unified analyst view replacing separate AnalystTargets + RecommendationChart layout
- `src/components/CompanyIntelligence.tsx` — deep company info section
- `src/components/PeerComparison.tsx` — competitive comparison mini-table

**Files to modify:**

- `src/components/MarketHeatmap.tsx` — sector grouping, filters, interactivity
- `src/pages/StockDetail.tsx` — integrate new components, reorder layout
- `src/contexts/LanguageContext.tsx` — add translation keys for new labels

**No backend/database changes needed** — all data comes from existing API endpoints (overview, profile, massiveTicker, recommendation, peers, massiveRelated, topCompanies).

Zudem noch beiderivaten american call und put und european call und out options erklären. Und generell alles nochmal schauen, ob man was ergänzen/verbessern und hinzufügen kann