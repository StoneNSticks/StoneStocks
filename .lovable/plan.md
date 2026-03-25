## Plan: Polymarket Intelligence Overhaul + Fixes

### 1. Polymarket-Seite komplett neu als Statistik-Dashboard (`src/pages/PolymarketIntelligencePage.tsx`)

Aktuell zeigt die Seite nur eine Liste von Events/Markets. Kompletter Umbau zu einem Analytics-Dashboard:

**Neue Struktur:**

- **Aggregierte Statistiken oben**: Sentiment-Gauge (Politik vs. Finanzen), Gesamtvolumen, Trend-Richtung
- **Politik-Sektion**: Top politische Märkte mit Wahrscheinlichkeits-Trends, Heatmap der Kategorien (Wahlen, Geopolitik, Regulierung)
- **Finanz-Sektion**: Fed/Inflation/Rezession-Wahrscheinlichkeiten als Karten mit Mini-Sparklines
- **Trend-Analyse**: Biggest movers (24h Δ), Confidence-Meter (basierend auf Volumen+Liquidität), Kategorie-Verteilung als Donut-Chart
- **Responsive**: Mobile = gestackte Cards, Desktop = Multi-Column-Grid mit Sidebar-Detail

**Desktop-Layout:** 

- Volle Breite nutzen, 3-Spalten-Grid für Statistiken
- Sidebar für Detail-Panel bei Klick
- Charts größer (h-60 statt h-40)

**Mobile-Layout:**

- Kompakte Cards, swipeable Kategorien
- Detail als Bottom-Sheet statt Sidebar

### 2. Prediction Market Sentiment im Fear & Greed verbessern (`src/pages/MarketSentimentPage.tsx` + `src/lib/polymarketApi.ts`)

**Problem:** `computePolymarketSentiment()` macht einen generischen volumengewichteten Durchschnitt aller "Yes"-Preise — das ist inhaltlich sinnlos, weil "Yes" bei "Wird es eine Rezession geben?" Angst bedeutet, aber bei "Wird S&P steigen?" Gier.

**Fix — Neuer smarter Algorithmus:**

- Finanz-Märkte mit Sentiment-Polarität klassifizieren:
  - Negative Events (Rezession, Crash, Rate Hike) → hoher Yes-Preis = FEAR
  - Positive Events (Rally, Rate Cut, Growth) → hoher Yes-Preis = GREED
- Politik-Märkte einbeziehen: geopolitische Stabilität/Instabilität als Signal
- Keywords-basierte Polaritätsbestimmung: `FEAR_KEYWORDS` (recession, crash, war, default, impeach) vs `GREED_KEYWORDS` (growth, cut, rally, peace, deal)
- Score = gewichteter Mix aus invertierten Fear-Markets + normalen Greed-Markets

### 3. Backend migration-ready machen (`supabase/functions/polymarket-proxy/index.ts`)

Die Edge Function ist bereits ein einfacher HTTP-Proxy. Für Migration:

- Keine Supabase-spezifischen Imports verwenden (nur Standard Deno `serve`)
- Den Client (`polymarketApi.ts`) so umbauen, dass die Base-URL konfigurierbar ist (ENV-Variable `VITE_POLYMARKET_PROXY_URL` mit Fallback auf aktuelle Supabase-URL)
- Proxy-Logik dokumentieren, sodass sie als Express/Fastify-Route oder Cloudflare Worker 1:1 portierbar ist

**Änderung in `src/lib/polymarketApi.ts`:**

```typescript
const BASE = import.meta.env.VITE_POLYMARKET_PROXY_URL 
  || `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/polymarket-proxy`;
```

Der gante rest soll auch fertig oder zumindest für eine zukünftige mögliche migration angeoasst werdne (cache, storage, secrets, api keys und alles im backend)

&nbsp;

### 4. Glossar Buchstabenfilter auf PC fixen (`src/pages/GlossaryPage.tsx`)

Die Logik sieht korrekt aus im Code, aber das 2-Spalten-Grid (`md:grid md:grid-cols-2`) zeigt Ergebnisse korrekt. Mögliches Problem: Die Ergebnisliste wird bei Letterfilter nicht korrekt neu gerendert weil `filtered` sowohl `isLetterMode` als auch `isSearchMode` prüft. 

**Fix:** `isLetterMode` Bedingung robuster machen — aktuell ist `isLetterMode = letter !== null && !isSearchMode`. Das stimmt. Aber `filtered` wird über `useMemo` mit `[glossary, debouncedSearch, letter, isSearchMode, isLetterMode, lang]` berechnet — das sollte funktionieren. 

Trotzdem: Die letter-Buttons werden korrekt gehandhabt. Falls es ein visuelles Problem ist, prüfe ich das Grid-Layout und stelle sicher, dass die Ergebnisse korrekt angezeigt werden. Außerdem: auf dem Handy fehlt das `md:grid` → nur `space-y-2`. Das ist korrekt. Auf PC sollte 2-Spalten aktiv sein.

**Sicherheits-Fix:** Alle Ergebnisse im Grid rendern, auch bei Letter-Filter. Falls `filtered` leer ist bei Letter-Klick, könnte das Problem sein dass `glossary` noch leer ist → unwahrscheinlich. Werde die Komponente testen und ggf. die Filterlogik vereinfachen.

### 5. Dateien


| Datei                                      | Änderung                                                 |
| ------------------------------------------ | -------------------------------------------------------- |
| `src/pages/PolymarketIntelligencePage.tsx` | Komplett neuschreiben als Analytics-Dashboard            |
| `src/lib/polymarketApi.ts`                 | Smarter Sentiment-Algorithmus + konfigurierbare Base-URL |
| `src/hooks/usePolymarket.ts`               | Neue Hooks für Kategorie-Stats, Trend-Analyse            |
| `src/pages/MarketSentimentPage.tsx`        | Prediction-Indikator-Beschreibung aktualisieren          |
| `src/pages/GlossaryPage.tsx`               | Letter-Filter Desktop-Verhalten verifizieren/fixen       |
