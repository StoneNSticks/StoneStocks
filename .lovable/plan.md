## Plan: Glossar auf 200+ Begriffe erweitern und KI-Schreibstil entfernen

### 1. Glossar massiv erweitern (GlossaryPage.tsx)

Das aktuelle Glossar hat ~58 Begriffe (EN) und ~57 (DE). Erweiterung auf **200+ Begriffe** pro Sprache. Neue Kategorien:

- **Buchhaltung/Bilanz**: Goodwill, Working Capital, Current Ratio, Quick Ratio, Debt-to-Equity, Book Value, Retained Earnings, Depreciation, Amortization, Net Income, Gross Margin, Operating Margin, Net Margin, Revenue, COGS, SG&A, Capex, ROIC, ROCE, Tangible Assets, Intangible Assets
- **Bewertung**: PEG Ratio, EV/Revenue, EV/EBITDA, Forward P/E, Trailing P/E, Intrinsic Value, Margin of Safety, Terminal Value, Gordon Growth Model, Comparable Analysis, Precedent Transactions
- **Handelsformen**: Market Order, Fill or Kill, GTC Order, Day Order, OCO Order, Bracket Order, Market on Close, Market on Open, Block Trade, Odd Lot, Round Lot, Tape Reading
- **Derivate/Optionen**: Greeks (Delta, Gamma, Theta, Vega, Rho), Straddle, Strangle, Iron Condor, Covered Call, Protective Put, Naked Option, Strike Price, Expiration Date, In the Money, Out of the Money, At the Money, Implied Volatility, Historical Volatility, Open Interest, Warrant, Convertible Bond
- **Makro/Wirtschaft**: GDP, Inflation, Deflation, Stagflation, QE, Tapering, Fed Funds Rate, CPI, PPI, PMI, Fiscal Policy, Monetary Policy, Trade Balance, Current Account, Sovereign Debt, Credit Rating, Basis Point
- **Marktstruktur**: Circuit Breaker, Halting, Market Maker, Specialist, ECN, ATS, Order Book, Level 2 Data, Tick Size, Lot Size, Settlement, T+1, T+2, Clearing House, Custody
- **Anlagestile**: Value Investing, Growth Investing, Momentum Investing, Contrarian, Buy and Hold, Sector Rotation, Pairs Trading, Swing Trading, Day Trading, Position Trading, Scalping, Income Investing
- **Risiko/Statistik**: Standard Deviation, Correlation, Covariance, R-Squared, Tracking Error, Information Ratio, Sortino Ratio, Max Drawdown, Value at Risk, Tail Risk, Systematic Risk, Unsystematic Risk, Diversification
- **Unternehmensaktionen**: Stock Split, Reverse Split, Buyback, Spin-off, Merger, Acquisition, Tender Offer, Proxy Vote, Rights Issue, Dilution, Delisting, Going Private
- **Sonstiges**: ESG, Fiduciary, AUM, NAV, Expense Ratio, Load, No-Load, 12b-1 Fee, Benchmark, Index Fund, Passive Investing, Active Management, Front Running, Insider Trading (legal vs illegal), SEC, FINRA, BaFin, Prospectus, Underwriter, Book Building, Greenshoe Option

### 2. KI-Schreibstil überarbeiten

Alle user-facing Texte in folgenden Dateien durchgehen und natürlicher formulieren:

**Muster die entfernt/ersetzt werden:**

- `—` (Em-Dash) durch `.` oder `:` oder Umformulierung ersetzen (in Glossar-Definitionen und UI-Texten)
- `–` (En-Dash) nur bei Zahlenbereichen behalten (z.B. "0-100"), sonst ersetzen
- Gleichförmige Satzstrukturen aufbrechen (nicht jede Definition mit dem gleichen Schema)
- Aufzählende Muster wie "X — Y" durch natürlichere Formulierungen ersetzen
- Übertrieben formale Formulierungen lockerer machen

**Betroffene Dateien:**

- `src/pages/GlossaryPage.tsx` (alle ~200 Definitionen, beide Sprachen)
- `src/components/OnboardingModal.tsx` (Schritttexte)
- `src/i18n/learnTranslations.ts` (Learn-Seite Texte durchgehen)
- `src/pages/MarketSentimentPage.tsx` (Indikator-Beschreibungen)
- `src/CODE_GUIDE.ts` (Kommentare)
- Code-Kommentare in allen Komponenten-Headern (die `Component — Description` Pattern)

**Nicht geändert** werden technische Werte wie `"—"` als Fallback-Platzhalter in der UI (z.B. in KeyMetrics, InsiderTrades) und Finnhub-Industrie-Strings mit `—` (z.B. `"software—infrastructure"`) da diese von der API kommen.

### 3. Umfang der Änderungen


| Datei                     | Änderung                                                     |
| ------------------------- | ------------------------------------------------------------ |
| `GlossaryPage.tsx`        | Komplett neu: 200+ Begriffe DE + EN, natürlicher Schreibstil |
| `OnboardingModal.tsx`     | Texte umformuliert                                           |
| `learnTranslations.ts`    | Em-Dashes und repetitive Muster überarbeitet                 |
| `MarketSentimentPage.tsx` | Indikator-Labels/Beschreibungen natürlicher                  |
| `CODE_GUIDE.ts`           | Kommentar-Headers ohne Em-Dashes                             |
| Diverse Komponenten       | `/** Component — desc */` Kommentare anpassen                |


Die Glossar-Datei wird deutlich größer (ca. 800-1000 Zeilen für die Term-Arrays). Die UI und Filter-Logik bleibt unverändert.  
  
außerdem struktureire das allgemien navigationssystem neu, da bestimmte pages zu versteckt sind, die leiste oben zu voll wird und man die suchleiste nurnoch kaum sehen kann. überlege dir ein gutes navigationssystem, wo man tortzdem noch auf die wichtigsten poages schnell kommt.

&nbsp;