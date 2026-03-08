# Verbesserungs- und Erweiterungsplan

Basierend auf der Code-Analyse gibt es folgende konkrete Verbesserungen und fehlende Punkte:

---

## 1. Fehlende Features vervollstaendigen

### 1.1 StockDetail: Key Metrics currency-Anzeige (KeyMetrics.tsx)

`KeyMetrics.tsx` nutzt `useFormattedCurrency` bereits korrekt — fertig. Aber `StockDetail.tsx` Zeile 36 hat noch `formatDividendValue` mit hardcoded `$`. Fix: Currency-Symbol aus `useCurrency()` dort durchreichen.

### 1.2 AdminPage: Rollenbasierter Zugang

Aktuell kann jeder eingeloggte User `/admin` sehen. Fix: `useUserRole` Hook nutzen und nur Admins Zugang gewaehren.

### 1.3 PortfolioPage: Currency-Konvertierung fehlt

Preise und P&L werden in USD angezeigt, obwohl `useCurrency` importiert ist. Fix: Alle Preisanzeigen durch `convert()` + `cSym` ersetzen.

### 1.4 Index Detail: Performance-Werte sind fake-multipliziert

Die Performance-Tabelle (1W, 1M, 3M, YTD, 1Y) multipliziert einfach den 1D-Wert. Das ist irreführend. Fix: Entweder als "geschaetzt" kennzeichnen oder die Werte entfernen und nur den 1D-Wert zeigen, da keine echten historischen Daten vorliegen.

---

## 2. Visuelle Verbesserungen & Responsiveness

### 2.1 Footer auf allen Seiten vereinheitlichen

`RankingsPage`, `CalculatorPage`, `ScreenerPage`, `GlossaryPage`, `LearnPage`, `NewsPage`, `WatchlistPage`, `PortfolioPage`, `SettingsPage`, `ProfilePage` haben keinen oder unterschiedlichen Footer. Fix: Einheitlichen Footer mit Copyright-Zeile auf allen Seiten.

### 2.2 CalculatorPage: 12 Tabs — zu viele fuer mobile Bildschirme

Die TabsList hat jetzt 12 Eintraege, die auf Mobilgeraeten nicht gut darstellbar sind. Fix: TabsList mit `flex-wrap` und scrollbar machen, oder in Kategorien gruppieren.

### 2.3 CommodityDetail: `Zap` Icon ist nicht importiert

Der neue Supply/Demand-Factors-Abschnitt nutzt `<Zap>`, das muss im Import ergaenzt werden.

---

## 3. Datenqualitaet & Robustheit

### 3.1 WatchlistPage: `useMemo` Callback-Pattern ist falsch

Zeile `const handleQuoteLoaded = useMemo(...)` gibt eine Closure zurueck, die bei jedem Render ein neues Objekt erzeugt. Fix: `useCallback` mit stabilem Pattern nutzen.

### 3.2 Glossary: Mehr natuerliche Definitionen

Nur die ersten 4-5 Eintraege wurden umformuliert. Der Rest klingt noch nach Woerterbuch. Fix: Alle Definitionen durchgehen und natuerlicher formulieren.

---

## 4. Code-Dokumentation

### 4.1 JSDoc-Kommentare ergaenzen

Folgende Dateien haben keine oder minimale Kommentare:

- `CurrencyContext.tsx`, `useWatchlist.ts`, `MetricsGrid.tsx`, `KeyMetrics.tsx`, `FinancialChart.tsx`, `StockChart.tsx`, `PortfolioPage.tsx`, `WatchlistPage.tsx`, `SettingsPage.tsx`, `ProfilePage.tsx`

Fix: Jeden File-Header mit kurzem JSDoc (Zweck, Datenquellen, Hauptfunktionen) versehen.

### 4.2 DEVELOPER_GUIDE.md aktualisieren

Der Guide muss die neuen Features dokumentieren: Portfolio, Watchlist Groups/Notes, Price Alerts, Quiz, Sentiment, Admin, alle Rechner-Tabs.

---

## 5. Weitere Verbesserungen

### 5.1 NewsPage: Bilder fehlen bei vielen Artikeln

Wenn `image` null ist, wird ein leerer Container angezeigt. Fix: Fallback-Placeholder-Bild einbauen.

### 5.2 SentimentPage: Heatmap Daten

`MarketHeatmap` nutzt Top Companies, aber wenn die API langsam ist, sieht man lange Loading-States. Fix: Skeleton fuer Heatmap verbessern.

### 5.3 Learn Page: Section-Bookmark/Share Buttons

Noch nicht implementiert. Fix: Kleinen Link-Button neben jedem `SectionHeader` einbauen, der die URL mit Anker kopiert.

### 5.4 StockDetail: Kein DividendGrowth-Chart

`DividendGrowth.tsx` existiert, wird aber nirgends eingebunden. Fix: Wenn Dividenden-Daten vorhanden sind, unterhalb der Financial Charts anzeigen.

---

## Zusammenfassung der Aenderungen

**Dateien die geaendert werden:**

- `src/pages/StockDetail.tsx` — Currency im Dividend-Format, DividendGrowth einbinden
- `src/pages/PortfolioPage.tsx` — Currency-Konvertierung durchgaengig
- `src/pages/IndexDetail.tsx` — Performance-Werte als Schaetzung kennzeichnen
- `src/pages/AdminPage.tsx` — Rollencheck mit `useUserRole`
- `src/pages/CalculatorPage.tsx` — Tabs responsive machen (flex-wrap/scroll)
- `src/pages/CommodityDetail.tsx` — Zap Import fixen
- `src/pages/WatchlistPage.tsx` — handleQuoteLoaded Fix, Footer
- `src/pages/GlossaryPage.tsx` — Restliche Definitionen natuerlicher
- `src/pages/NewsPage.tsx` — Bild-Fallback
- `src/pages/LearnPage.tsx` — Section Share Buttons
- `src/pages/RankingsPage.tsx` — Footer
- `src/pages/ScreenerPage.tsx` — Footer
- `src/pages/SettingsPage.tsx` — Footer
- `src/pages/ProfilePage.tsx` — Footer
- `DEVELOPER_GUIDE.md` — Aktualisieren
- Diverse Dateien: JSDoc-Header ergaenzen

Und für news noch mehr sources/apis finden damit es mehr gibt