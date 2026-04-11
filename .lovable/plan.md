## Plan: Top Companies Fix + Heatmap Expansion + Backend-Portabilität + Website-Audit

### Kernproblem: ~40 der 130 Top Companies fehlen komplett

Die API-Antwort enthält nur ~80 Unternehmen. Fehlend: Amazon ($2T), Tesla ($1T), Berkshire ($1T), Walmart, JPMorgan, Visa, Mastercard, Netflix, Costco, Home Depot, Disney, u.v.m.

**Ursache:** 130 Unternehmen × 2 Finnhub-Calls pro Batch = 260+ API-Calls. Finnhub rate-limitet bei ~30 calls/sec (Free Tier). Die `fetchWithBackoff` retried bei 429, aber nach max 3 Retries schlägt es fehl → Polygon-Fallback schlägt oft auch fehl → `marketCap = 0` → wird von `MIN_MCAP_TOP` gefiltert.

---

### 1. Top Companies Datenqualität reparieren (`stock-data/index.ts`)

**Fix-Strategie: Yahoo Finance als primäre Quelle für Market Cap**

- Yahoo Finance hat kein Rate-Limit für Chart-Daten und liefert zuverlässig `marketCap` im Meta-Feld
- Neue Funktion `fetchYahooMarketCap(symbol)` die aus dem bestehenden `fetchYahooQuote` erweitert wird
- Pro Unternehmen: Yahoo zuerst (price + marketCap), Finnhub nur noch für Logo/Sector/Profile
- Batch-Größe für Finnhub-Profile-Calls erhöhen, aber Yahoo parallel für Preise nutzen

**Konkrete Änderungen:**

- `fetchYahooQuote()` erweitern → auch `meta.marketCap` zurückgeben (Yahoo liefert das)
- `fetchCompanyData()` umbauen: Yahoo für Preis/MarketCap, Finnhub nur für Logo/Sector
- Profile-Daten (Logo, Sector) aggressiver cachen (7 Tage TTL) und separat von Preisdaten fetchen
- Cache-Key auf `v10` bumpen
- Logos und Sectors in separatem Cache speichern, damit sie nicht bei jedem Price-Update neu gefetcht werden müssen

### 2. Heatmap mit mehr Unternehmen (`ScreenerHeatmap.tsx`)

- Von 50 auf 100 Unternehmen erhöhen (`.slice(0, 100)`)
- Mehr Sektor-Filter: "Consumer Defensive", "Utilities", "Basic Materials", "Real Estate" hinzufügen
- Sektoren aus den tatsächlichen API-Daten dynamisch extrahieren statt hardcoded
- Minimum-Größe für Tiles anpassen damit kleine Unternehmen noch lesbar sind

### 3. Backend-Portabilität (`stock-data/index.ts` + `stockApi.ts`)

`**src/lib/stockApi.ts` — Konfigurierbare Base-URL:**

```typescript
const BASE = import.meta.env.VITE_STOCK_API_URL 
  || `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/stock-data`;
```

`**stock-data/index.ts` — Supabase-Abhängigkeiten isolieren:**

- Cache-Layer als austauschbare Schicht: `getCached/setCache` hinter einem Interface, das entweder Supabase-DB oder Redis/Memory nutzt
- Secrets über `Deno.env.get()` (bereits portabel)
- CORS-Headers bereits Standard
- Kommentar-Block am Anfang mit Migrations-Anleitung: "Um auf Express/Cloudflare zu migrieren: 1. Cache-Layer ersetzen, 2. `Deno.serve` durch Express-Handler ersetzen, 3. Env-Vars mappen"

### 4. Website-weite Verbesserungen

**Footer (`Footer.tsx`):**

- "Glossar" durch `t("nav.glossary")` ersetzen (i18n)
- Impressum/Datenschutz-Links hinzufügen (placeholder)

**SEC Filings (`SecFilings.tsx`):**

- Bereits gefixt (kein scroll container mehr) — verifizieren, aber nur so lange machen wie insider trades kachel daneben, danach cleaner scroll

**GlossaryPage:**

- Letter-Filter Desktop: `md:flex-wrap md:overflow-x-visible` — bereits implementiert, verifizieren
- Leere Letter-Buttons dimmen wenn keine Begriffe mit diesem Buchstaben existieren aber jetzt system cleaner machen

**MarketSentimentPage:**

- Die Gewichts-Summe der 10 Indikatoren verifizieren (muss exakt 1.0 sein)
- Indikatoren-Beschreibungen auf Deutsch prüfen

**TopCompanies.tsx:**

- Ranking-Nummer prominenter anzeigen (aktuell `{i + 1}. {c.symbol}` — besser als Badge)

### 5. Dateien


| Datei                                    | Änderung                                                          |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `supabase/functions/stock-data/index.ts` | Yahoo als primäre MarketCap-Quelle, Profile-Cache separieren, v10 |
| `src/lib/stockApi.ts`                    | Konfigurierbare Base-URL für Portabilität                         |
| `src/components/ScreenerHeatmap.tsx`     | 100 Unternehmen, dynamische Sektoren                              |
| `src/components/TopCompanies.tsx`        | Ranking-Badge verbessern                                          |
| `src/components/Footer.tsx`              | i18n für "Glossar"                                                |
| `src/pages/GlossaryPage.tsx`             | Leere Letter dimmen                                               |
| `src/pages/MarketSentimentPage.tsx`      | Gewichte verifizieren                                             |
