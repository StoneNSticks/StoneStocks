

# Fehlende, unvollstaendige und uebergangene Features

## Analyse: Was wurde NICHT implementiert

Aus dem 14-Phasen-Plan fehlen folgende Punkte komplett oder wurden nur teilweise umgesetzt:

---

### 1. Phase 1: Currency Conversion auf Stock Detail Seiten
**Status: Nicht implementiert**
`StockChart.tsx`, `FinancialChart.tsx`, `MetricsGrid.tsx`, `KeyMetrics.tsx` zeigen alle Preise nur in USD. `useCurrency()` ist dort nicht eingebunden.

**Fix:** `useCurrency()` Hook in alle genannten Komponenten einbauen, `convert()` und `symbol` auf alle Preisanzeigen anwenden.

---

### 2. Phase 3.2: Insider Trading Sektion
**Status: Nicht implementiert**
Kein `InsiderTrades.tsx` erstellt, kein Edge-Function-Handler fuer `insider-transactions`.

**Fix:** Neuen Handler `handleInsiderTransactions` in Edge Function (Finnhub `insider-transactions` Endpoint), neue Komponente `InsiderTrades.tsx` mit Tabelle (Datum, Name, Titel, Transaktion, Aktien, Wert), einbinden in `StockDetail.tsx`.

---

### 3. Phase 3.6: Stock Compare Mode
**Status: Nicht implementiert**
Kein `StockCompare.tsx`, kein "Vergleichen"-Button auf StockDetail.

**Fix:** Neuer Button "Vergleichen" im Header der Stock-Detailseite, oeffnet Dialog/Sheet mit Suchfeld fuer zweite Aktie, zeigt Metriken nebeneinander + ueberlagerte Preischarts.

---

### 4. Phase 4.1: Market Heatmap
**Status: Nicht implementiert**
Kein `MarketHeatmap.tsx` mit Treemap-Visualisierung.

**Fix:** Recharts `Treemap` Komponente, gruppiert nach Sektor, Groesse = Marktkapitalisierung, Farbe = Tagesperformance. Einbinden auf Homepage oder Sentiment-Seite.

---

### 5. Phase 6.1: Watchlist Groups/Folders
**Status: Nicht implementiert**
Keine `watchlist_groups` Tabelle, kein `group_name` Feld.

**Fix:** `group_name` Spalte zur `watchlist` Tabelle hinzufuegen (nullable, default null), UI zum Erstellen/Zuweisen von Gruppen, Filterbar in Watchlist.

---

### 6. Phase 6.2: Price Alerts (funktional)
**Status: Tabelle existiert, aber kein UI**
Die `price_alerts` Tabelle wurde erstellt, aber es gibt keinen UI zum Anlegen/Verwalten von Kursalarmen und keinen Check-Mechanismus.

**Fix:** Alert-Button auf StockDetail ("Alarm setzen"), Formular (Kurs, Richtung oben/unten), Anzeige aktiver Alerts auf Settings-Seite, Check beim Laden der Quote-Daten.

---

### 7. Phase 6.3: Watchlist Notes
**Status: Nicht implementiert**
Kein `note`-Feld in der Watchlist-Tabelle.

**Fix:** `note` Spalte (text, nullable) zur `watchlist` Tabelle, kleines Notiz-Icon pro Eintrag, editierbar inline oder per Popover.

---

### 8. Phase 7.2: Retirement/Withdrawal Calculator
**Status: Teilweise (FIRE-Rechner existiert, aber kein dedizierter Withdrawal-Simulator)**
Der FIRE-Rechner deckt aehnliches ab, aber kein Monte-Carlo-Chart.

---

### 9. Phase 7.4: Dividend Income Projector
**Status: Nicht implementiert**
Kein Rechner, der aus dem eigenen Portfolio die jaehrliche Dividendeneinnahme projiziert.

**Fix:** Neuer Tab im Calculator, der Portfolio-Positionen laedt und mit Dividenden-Daten kombiniert.

---

### 10. Phase 7.5: Tax-Loss Harvesting Tool
**Status: Nicht implementiert**

**Fix:** Neuer Tab, laedt Portfolio-Positionen, vergleicht avg_cost mit aktuellem Kurs, zeigt Verlustpositionen und geschaetzte Steuerersparnis.

---

### 11. Phase 8.1: Onboarding Flow
**Status: Nicht implementiert**
Keine Begruessung fuer neue Nutzer.

**Fix:** Modaler 3-4-Schritt-Guide bei erstem Login, erklaert Suche/Watchlist/Portfolio/Learn. `localStorage.getItem("onboarding_done")` als Check.

---

### 12. Phase 8.5: PWA Support
**Status: Nicht implementiert**
Kein Web-Manifest, kein Service Worker.

**Fix:** `public/manifest.json` erstellen, Link in `index.html`, Icons bereitstellen.

---

### 13. Phase 8.6: Breadcrumb Navigation
**Status: Nur auf StockDetail**
Fehlt auf CommodityDetail, IndexDetail.

**Fix:** Breadcrumbs auf CommodityDetail und IndexDetail hinzufuegen.

---

### 14. Phase 9.1: Interactive Quizzes auf Learn Page
**Status: Nicht implementiert**
Keine Quizzes, kein Fortschrittsbalken.

**Fix:** Am Ende jeder Sektion 3-5 Multiple-Choice-Fragen. Fortschritt in localStorage. Completion-Badge pro Sektion.

---

### 15. Phase 9.4: Reading Progress Indicator
**Status: Nicht implementiert**

**Fix:** Sticky Progress-Bar oben auf der Learn-Seite, zeigt Scrollfortschritt.

---

### 16. Phase 9.5: Bookmarkable Sections
**Status: Teilweise (Anker-IDs existieren)**
Kein "Link kopieren"-Button pro Sektion.

**Fix:** Kleiner Link-Icon-Button neben jedem Section-Header.

---

### 17. Phase 10.1-10.2: Index Detail Erweiterungen
**Status: Nicht implementiert**
Keine Constituents-Liste, keine historische Performance-Tabelle.

**Fix:** Constituents-Liste (Top-Holdings mit Gewichtung), Performance-Tabelle (1D, 1W, 1M, 3M, YTD, 1Y).

---

### 18. Phase 10.4: Commodity Supply/Demand Factors
**Status: Nicht implementiert**
Beschreibungen existieren, aber keine Einflussfaktoren-Sektion.

**Fix:** Ausklappbare "Was beeinflusst den Preis?"-Sektion pro Rohstoff.

---

### 19. Phase 12.4: Accessibility Audit
**Status: Nicht durchgefuehrt**
ARIA-Labels, Fokus-States, Keyboard-Navigation nicht auditiert.

---

### 20. Phase 13.2-13.3: Mobile Swipe/Pull-to-Refresh
**Status: Nicht implementiert**

---

### 21. Phase 14: Admin Dashboard
**Status: Nicht implementiert**
Keine `/admin` Seite.

---

## KI-klingender Text fixen

Mehrere Stellen haben typische KI-Formulierungen (Bindestrich-Listen, uebermaessig erklaerend):

- **GlossaryPage.tsx**: Definitionen klingen teilweise wie Woerterbucheintraege statt natuerliche Erklaerungen. Z.B. "Handelbare Zertifikate fuer auslaendische Aktien an US-Boersen" → besser: "Ueber ADRs koennen Anleger auslaendische Aktien direkt an US-Boersen handeln."
- **CommodityDetail.tsx**: Beschreibungen wie "It is traded globally and serves as a hedge against inflation" → natuerlicher formulieren
- **MarketSentimentPage.tsx**: Labels natuerlicher gestalten
- **SettingsPage.tsx**: "Benachrichtigung bei grossen Kursbewegungen" klingt ok
- **LearnPage translations**: Muessen auf KI-typische Muster geprueft und ueberarbeitet werden

---

## Implementierungsplan

### Batch 1 — Bug Fixes & Currency (kritisch)
1. `useCurrency()` in `MetricsGrid.tsx`, `StockChart.tsx`, `FinancialChart.tsx`, `KeyMetrics.tsx` einbauen
2. Breadcrumbs auf IndexDetail + CommodityDetail
3. KI-klingenden Text in GlossaryPage, CommodityDetail, LearnTranslations ueberarbeiten

### Batch 2 — Missing Stock Detail Features
4. Insider Trades Handler + Komponente + Einbindung
5. Stock Compare Mode (Dialog mit Side-by-Side Metriken)
6. Price Alerts UI (Button auf StockDetail + Verwaltung in Settings)

### Batch 3 — Watchlist & Portfolio Erweiterungen
7. Watchlist Notes (`note` Spalte + UI)
8. Watchlist Groups (`group_name` Spalte + Filter-UI)
9. Tax-Loss Harvesting Tool (Portfolio-basiert)
10. Dividend Income Projector (Portfolio-basiert)

### Batch 4 — Homepage & Visualization
11. Market Heatmap (Treemap auf Sentiment-Seite)
12. Index Detail: Constituents + Performance-Tabelle
13. Commodity: Supply/Demand Factors

### Batch 5 — Learn Page & UX
14. Interactive Quizzes (3-5 Fragen pro Sektion)
15. Reading Progress Indicator
16. Section Share/Bookmark Buttons
17. Onboarding Flow (3-4 Steps Modal)

### Batch 6 — Infrastruktur
18. PWA Manifest
19. Accessibility (ARIA-Labels, Focus-States)
20. Admin Dashboard (User-Count, beliebte Aktien, Cache-Stats)

### Dateien die erstellt werden:
- `src/components/InsiderTrades.tsx`
- `src/components/StockCompare.tsx`
- `src/components/MarketHeatmap.tsx`
- `src/components/PriceAlertForm.tsx`
- `src/components/OnboardingModal.tsx`
- `src/components/learn/QuizSection.tsx`
- `src/components/learn/ReadingProgress.tsx`
- `src/pages/AdminPage.tsx`
- `public/manifest.json`

### Dateien die geaendert werden:
- `src/components/MetricsGrid.tsx` — Currency
- `src/components/StockChart.tsx` — Currency
- `src/components/FinancialChart.tsx` — Currency
- `src/pages/StockDetail.tsx` — InsiderTrades, Compare, Alerts
- `src/pages/IndexDetail.tsx` — Breadcrumb, Constituents, Performance
- `src/pages/CommodityDetail.tsx` — Breadcrumb, Supply/Demand
- `src/pages/WatchlistPage.tsx` — Groups, Notes
- `src/pages/CalculatorPage.tsx` — Tax-Loss, Dividend Projector
- `src/pages/LearnPage.tsx` — Quizzes, Progress, Bookmarks
- `src/pages/SettingsPage.tsx` — Price Alerts Verwaltung
- `src/pages/GlossaryPage.tsx` — Text ueberarbeiten
- `src/contexts/LanguageContext.tsx` — neue Keys
- `src/i18n/learnTranslations.ts` — Text ueberarbeiten
- `src/App.tsx` — Admin Route, Onboarding
- `supabase/functions/stock-data/index.ts` — Insider Trading Handler
- `index.html` — Manifest Link

### DB Migrationen:
- `watchlist` Tabelle: `note` und `group_name` Spalten hinzufuegen
- Cache flush falls noetig

