## Plan: Polymarket verstecken + Top Companies Sortierung fixen + Website-weite Verbesserungen

### 1. Polymarket komplett verstecken

Alle Polymarket-Inhalte werden aus der UI entfernt (Code bleibt erhalten für spätere Reaktivierung):

`**src/components/Header.tsx**` — Polymarket-Eintrag aus `navItems` entfernen (Zeile 44)

`**src/App.tsx**` — Routes entfernen:

- Zeile 52: `PredictionsPage` lazy import
- Zeile 53: `PolymarketIntelligencePage` lazy import  
- Zeile 110: `/predictions` Route
- Zeile 111: `/polymarket` Route

`**src/pages/StockDetail.tsx**` — PolymarketEarningsSignal entfernen:

- Zeile 38: Import entfernen
- Zeile 329: `<PolymarketEarningsSignal>` aus dem Grid entfernen

`**src/pages/MacroDashboard.tsx**` — PolymarketMacroModule entfernen:

- Zeile 18: Import entfernen
- Verwendung der Komponente entfernen

---

### 2. Top Companies nach Market Cap — Sortierung fixen

**Problem:** Die Sortierung `b.marketCap - a.marketCap` funktioniert korrekt im Backend, aber wenn Finnhub für einige Unternehmen falsche/fehlende Market Cap Werte liefert (z.B. `0` oder unrealistisch hoch), stimmt die Reihenfolge nicht.

`**supabase/functions/stock-data/index.ts**` — Verbesserungen:

- Bessere Market Cap Validierung: Minimum-Grenze einführen (z.B. > 1 Milliarde für Top Companies)
- ADR-Ratio Korrektur verbessern — einige ADRs haben falsche Multiplikatoren
- Fallback-Logik: Wenn Finnhub marketCap = 0, aber Polygon liefert einen Wert, diesen priorisieren
- Sortierung nach dem Merge mit Stale-Daten nochmals explizit sicherstellen
- Cache-Key auf `v9` bumpen um alten fehlerhaften Cache zu invalidieren

`**src/components/TopCompanies.tsx**` — Client-seitige Absicherung:

- Zusätzliche Sortierung `companies.sort((a,b) => b.marketCap - a.marketCap)` vor dem Rendern als Safety-Net

---

### 3. Website-weite Verbesserungen

Nach Durchsicht des Codes fallen folgende Verbesserungspunkte auf:

**Glossar (`src/pages/GlossaryPage.tsx`):**

- Buchstabenfilter auf Mobile verbessern: Buttons scrollbar machen statt Umbruch
- Letter-Filter-Reset-Button deutlicher gestalten

**MarketSentimentPage — Gewichte nach Polymarket-Entfernung:**

- 10 Indikatoren, Gewichte müssen sich auf 100% summieren
- Vorschlag: Momentum 25%, Volatility 17%, Safe Haven 8%, Regional 10%, Commodity Risk 12%, Index Correlation 10%, Sector Breadth 8%, Risk-On/Off 5%, Trend Strength 5%

**Allgemeine UI-Verbesserungen:**

- `RankingsPage.tsx`: TopCompanies Sortierungshinweis verbessern
- Footer/Header: Tote Links aufräumen (keine Polymarket-Referenzen mehr)  
  
  
  
  
und bei SEC-filings es so machen, dass es nichtmehr so abgehackt ist zum scrollen sondern der platz besser genutzt wird (es soll nicht nur der halbe platz genutzt werden und dann so ein hässliches scroll fenster

---

### Dateien


| Datei                                    | Änderung                                          |
| ---------------------------------------- | ------------------------------------------------- |
| `src/App.tsx`                            | Polymarket-Routes + Imports entfernen             |
| `src/components/Header.tsx`              | Polymarket aus Navigation entfernen               |
| `src/pages/StockDetail.tsx`              | PolymarketEarningsSignal entfernen                |
| `src/pages/MacroDashboard.tsx`           | PolymarketMacroModule entfernen                   |
| `src/pages/MarketSentimentPage.tsx`      | Polymarket-Indikator entfernen, Gewichte anpassen |
| `supabase/functions/stock-data/index.ts` | Top Companies Sortierung/Validierung verbessern   |
| `src/components/TopCompanies.tsx`        | Client-seitige Sortierungsabsicherung             |
| `src/pages/GlossaryPage.tsx`             | Buchstabenfilter Mobile-UX verbessern             |
