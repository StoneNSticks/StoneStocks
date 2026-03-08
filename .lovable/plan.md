

# 100-Phasen-Plan: StoneStocks Next Level

## TEIL 1: FEHLERBEHEBUNG & STABILISIERUNG (Phase 1-15)

**Phase 1** — Sprachaudit: Alle Komponenten auf fehlende i18n-Keys pruefen, hardcodierte Strings in LanguageContext uebertragen

**Phase 2** — KI-Texthinweise entfernen: Alle Beschreibungen (CompanyIntelligence, LearnPage, GlossaryPage) auf typische KI-Formulierungen pruefen und natuerlicher umschreiben

**Phase 3** — ETF/Leveraged-Filter haerten: Blacklist in stock-data erweitern, Name-basierte Erkennung fuer Gainers/Losers/MostActive/HiddenGems

**Phase 4** — Waehrungsumrechnung lueckenlos: StockChart, FinancialChart, MetricsGrid, KeyMetrics, StockDetail — alle USD-Anzeigen durch useCurrency ersetzen

**Phase 5** — Error-Handling verbessern: Alle API-Aufrufe mit spezifischen Fehlermeldungen statt generischem "API error", Retry-UI fuer jeden Abschnitt

**Phase 6** — Mobile Responsiveness Audit: Alle Seiten auf kleinen Bildschirmen (320px-375px) pruefen, Overflow-Probleme beheben

**Phase 7** — Console-Warnings bereinigen: React key-Warnings, missing dependency-Warnings in useEffect/useMemo beseitigen

**Phase 8** — Ladezeiten optimieren: Unnoetige Re-Renders in StockDetail identifizieren, React.memo fuer teure Komponenten

**Phase 9** — Null/Undefined-Absicherung: Alle Komponenten gegen fehlende Datenfelder absichern (z.B. overview ohne EPS)

**Phase 10** — Sektorperformance stabilisieren: Alle 11 GICS-Sektoren immer anzeigen, Duplikat-Akkumulation verhindern

**Phase 11** — ADR-Preiskorrektur erweitern: Weitere ADRs (BABA, PDD, JD) in Korrektur-Logik aufnehmen

**Phase 12** — Cache-Invalidierung testen: Sicherstellen dass abgelaufene Cache-Eintraege korrekt erneuert werden

**Phase 13** — Auth-Flow testen: Registrierung, Login, Passwort-Reset, E-Mail-Verifizierung End-to-End pruefen

**Phase 14** — RLS-Policies auditieren: Watchlist, Portfolio, Comments, Price Alerts — Zugriffskontrolle verifizieren

**Phase 15** — PWA-Funktionalitaet testen: Offline-Seite, Service Worker, Install-Prompt auf verschiedenen Geraeten

---

## TEIL 2: DATENQUELLEN ERWEITERN (Phase 16-30)

**Phase 16** — Yahoo Finance Scraping erweitern: Zusaetzlich zu RSS auch Key-Stats-Seite parsen fuer fehlende Metriken

**Phase 17** — FRED API integrieren (kostenlos): Makrodaten wie GDP, Inflation, Arbeitslosenquote, Zinssaetze

**Phase 18** — SEC EDGAR API (kostenlos): 10-K/10-Q Filings direkt verlinken, Insider-Transaktionen als Zweitquelle

**Phase 19** — IEX Cloud Alternative: Open-Source-kompatible Datenquellen fuer Echtzeit-Kurse evaluieren

**Phase 20** — OpenFIGI API (kostenlos): ISIN/FIGI-Mapping fuer internationale Aktien automatisieren

**Phase 21** — World Bank API (kostenlos): Laender-Wirtschaftsdaten fuer internationale Unternehmensanalyse

**Phase 22** — Financial Modeling Prep (Free Tier): Zusaetzliche Fundamental-Daten als Fallback

**Phase 23** — Newsdata.io (Free Tier): Weitere Nachrichtenquelle fuer breitere Abdeckung

**Phase 24** — Exchange Rates API (kostenlos): Echtzeit-Wechselkurse fuer Waehrungsumrechnung statt statischer Raten

**Phase 25** — CoinGecko API (kostenlos): Krypto-Daten als optionale Erweiterung

**Phase 26** — Stockanalysis.com Scraping: Analyst-Ratings und Price-Targets als Zusatzquelle

**Phase 27** — Wikipedia API: Firmen-Logos und Basisdaten als ultimativer Fallback

**Phase 28** — US Treasury API (kostenlos): Anleihenrenditen fuer Vergleichsmetriken

**Phase 29** — BLS API (kostenlos): Arbeitsmarktdaten fuer makrooekonomische Indikatoren

**Phase 30** — Fallback-Kette priorisieren: tryInOrder fuer alle Handler nach Zuverlaessigkeit und Geschwindigkeit neu ordnen

---

## TEIL 3: NEUE FEATURES — AKTIENANALYSE (Phase 31-50)

**Phase 31** — DCF-Rechner: Discounted Cash Flow Bewertung mit einstellbaren Annahmen (Wachstumsrate, WACC)

**Phase 32** — Fair-Value-Schaetzung: Automatische Bewertung basierend auf KGV, KBV, DCF kombiniert

**Phase 33** — Technische Analyse erweitern: Bollinger Bands, Stochastic, Williams %R, ADX als neue Indikatoren

**Phase 34** — Chart-Zeichentools: Trendlinien, Unterstuetzung/Widerstand direkt im StockChart einzeichnen

**Phase 35** — Mehrere Zeitrahmen im Chart: 1T, 5T, 1M, 3M, 6M, 1J, 5J, MAX als klickbare Buttons

**Phase 36** — Volumen-Overlay im Chart: Volumenbalken unter dem Preischart als optionale Ebene

**Phase 37** — Candlestick-Chart: Alternative zum Linien-Chart mit OHLC-Kerzen

**Phase 38** — Options-Chain Viewer: Put/Call-Daten anzeigen wenn verfuegbar (via CBOE/Yahoo)

**Phase 39** — Short Interest Anzeige: Leerverkaufsquote und Days-to-Cover

**Phase 40** — Institutional Ownership: Top-Institutionelle Halter aus 13-F Filings

**Phase 41** — Supply Chain Map: Kunden und Zulieferer eines Unternehmens visualisieren

**Phase 42** — Dividenden-Kalender: Uebersicht aller Ex-Dividend-Daten im Watchlist-Universum

**Phase 43** — Splits-Historie: Historische Aktiensplits anzeigen und im Chart markieren

**Phase 44** — ESG-Score: Nachhaltigkeits-Bewertung wenn verfuegbar

**Phase 45** — Guru-Portfolio-Tracker: Positionen von Warren Buffett, Cathie Wood etc. aus 13-F Daten

**Phase 46** — Saisonalitaets-Analyse: Historische Performance nach Monat/Quartal

**Phase 47** — Korrelations-Matrix: Wie stark korrelieren Watchlist-Aktien untereinander

**Phase 48** — Risiko-Metriken: Sharpe Ratio, Sortino Ratio, Max Drawdown berechnen

**Phase 49** — Gewinn-Ueberraschungen: Earnings Beat/Miss Historien prominent anzeigen

**Phase 50** — Finanzkennzahlen-Vergleich: Branchendurchschnitte fuer jede Metrik anzeigen

---

## TEIL 4: NEUE FEATURES — PLATTFORM (Phase 51-70)

**Phase 51** — Echtzeit-Kursstreaming: WebSocket-basierte Live-Kurse ueber Finnhub WebSocket

**Phase 52** — Push-Benachrichtigungen: Web Push API fuer Preisalarme und Earnings-Erinnerungen

**Phase 53** — Portfolio-Performance-Chart: Historische Wertentwicklung des Gesamtportfolios als Linie

**Phase 54** — Portfolio-Import/Export: CSV-Upload und Download fuer Positionen

**Phase 55** — Watchlist-Gruppen: Drag-and-Drop Sortierung innerhalb von Gruppen

**Phase 56** — Screener erweitern: Mehr Filter (RSI, Dividende, Gewinnwachstum, Sektor, Land)

**Phase 57** — Screener Presets: Vorgefertigte Filter wie "Dividenden-Aristokraten", "Growth Stocks"

**Phase 58** — Heatmap-Seite: Treemap-Visualisierung aller S&P 500 Aktien nach Tagesperformance

**Phase 59** — Wirtschaftskalender: Zinsentscheide, NFP, CPI-Termine als eigene Seite

**Phase 60** — Forex-Sektion: Wichtige Waehrungspaare (EUR/USD, GBP/USD) mit Charts

**Phase 61** — ETF-Sektion: Top-ETFs mit Zusammensetzung und Performance

**Phase 62** — IPO-Kalender: Kommende Boersengaenge anzeigen

**Phase 63** — Social Feed: Nutzer koennen kurze Posts/Analysen teilen (wie StockTwits)

**Phase 64** — Benachrichtigungs-Zentrale: Alle Alerts (Preis, Earnings, News) in einem Panel

**Phase 65** — PDF-Export: Aktienanalyse als PDF-Report generieren

**Phase 66** — Darkmode-Farben verfeinern: Charts und Indikatoren im Dark Mode besser lesbar machen

**Phase 67** — Tastaturnavigation: Alle interaktiven Elemente per Tab/Enter bedienbar, Skip-Links

**Phase 68** — Breadcrumb-Navigation: Auf allen Unterseiten zur Orientierung

**Phase 69** — Suchverlauf persistent: Letzte Suchen in der Datenbank statt nur localStorage

**Phase 70** — Multi-Waehrung: Neben USD/EUR auch GBP, CHF, JPY, CAD als Optionen

---

## TEIL 5: UI/UX VERBESSERUNGEN (Phase 71-85)

**Phase 71** — Skeleton-Loading verbessern: Realistische Platzhalter die der finalen Struktur entsprechen

**Phase 72** — Animationen verfeinern: Sanfte Uebergaenge bei Tab-Wechseln, Seitennavigation

**Phase 73** — Daten-Sparklines: Mini-Charts in Tabellen (Watchlist, Rankings, Screener)

**Phase 74** — Responsive Tabellen: Horizontales Scrollen oder Card-Layout auf Mobile

**Phase 75** — Favoriten-Schnellzugriff: Watchlist-Aktien als Chips unter der Suchleiste auf der Startseite

**Phase 76** — Tooltip-System: Erklaerungen fuer jede Finanzkennzahl per Hover

**Phase 77** — Keyboard Shortcuts erweitern: / fuer Suche, W fuer Watchlist, P fuer Portfolio

**Phase 78** — Infinite Scroll: News-Seite und Rankings mit Lazy-Loading statt Pagination

**Phase 79** — Vergleichs-Seite UX: Drag-and-Drop Aktien hinzufuegen, Side-by-Side Layout

**Phase 80** — Print-Stylesheet: Aktienanalyse druckfreundlich formatiert

**Phase 81** — Onboarding verbessern: Interaktive Tour fuer neue Nutzer mit Highlight-Spots

**Phase 82** — Farbsystem ueberarbeiten: Konsistente Gain/Loss-Farben in allen Kontexten

**Phase 83** — Footer mit Datenquellen-Badges: Transparenz ueber verwendete APIs

**Phase 84** — 404-Seite verbessern: Aktiensuche direkt auf der Not-Found-Seite einbetten

**Phase 85** — Ladezustand-Feedback: Progress-Bars fuer lange API-Aufrufe statt nur Spinner

---

## TEIL 6: PERFORMANCE & INFRASTRUKTUR (Phase 86-95)

**Phase 86** — Bundle-Splitting optimieren: Schwere Bibliotheken (recharts, framer-motion) nur bei Bedarf laden

**Phase 87** — Image-Optimierung: Firmenlogos lazy-laden, WebP-Fallbacks, Platzhalter-Blur

**Phase 88** — API-Rate-Limiting: Edge Function mit Token-Bucket pro Client-IP schuetzen

**Phase 89** — Cache-Warming: Beliebte Aktien (AAPL, MSFT, NVDA) proaktiv cachen via Cron

**Phase 90** — Edge Function aufteilen: stock-data in Module splitten (quotes, news, financials) fuer schnellere Cold-Starts

**Phase 91** — Datenbankindizes: api_cache-Tabelle mit Index auf expires_at fuer schnellere Cleanup-Queries

**Phase 92** — Lighthouse-Score optimieren: Core Web Vitals (LCP, CLS, FID) auf gruenes Level bringen

**Phase 93** — SEO-Meta-Tags: Dynamische Open-Graph-Tags fuer jede Aktien-Detailseite

**Phase 94** — Sitemap generieren: Automatische Sitemap mit allen bekannten Aktien-URLs

**Phase 95** — Error-Tracking: Globales Error-Logging in die Datenbank fuer Produktions-Debugging

---

## TEIL 7: QUALITAETSSICHERUNG (Phase 96-100)

**Phase 96** — End-to-End Tests: Kritische User-Flows (Suche → Detail → Watchlist → Portfolio) automatisiert testen

**Phase 97** — Sprachtest komplett: Jede Seite in DE und EN durchklicken, fehlende/falsche Uebersetzungen finden

**Phase 98** — Datenqualitaets-Audit: 20 verschiedene Aktien (Large/Mid/Small Cap, international) auf korrekte Metriken pruefen

**Phase 99** — Cross-Browser-Test: Chrome, Firefox, Safari, Edge — Layout und Funktionalitaet verifizieren

**Phase 100** — Produktions-Stresstest: Mehrere gleichzeitige Nutzer simulieren, API-Limits und Cache-Verhalten unter Last pruefen

---

## Umsetzungsempfehlung

Die Phasen sind grob nach Prioritaet sortiert. Empfohlene Reihenfolge:
1. **Phase 1-15 zuerst** — Stabilitaet und Fehlerfreiheit als Basis
2. **Phase 16-30 parallel** — Mehr Datenquellen = bessere Abdeckung
3. **Phase 31-50 und 51-70** — Features nach Nutzerrelevanz priorisieren
4. **Phase 71-95** — UX und Performance iterativ verbessern
5. **Phase 96-100** — Qualitaetssicherung als fortlaufender Prozess

Soll ich mit einer bestimmten Phase oder einem Block beginnen?

