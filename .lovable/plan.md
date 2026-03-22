

## Plan: Polymarket Page + Learn/Glossar Desktop-Fixes

### Teil 1: Learn-Page Nummerierung reparieren

**Problem:** Die `SectionHeader num={}`-Werte sind völlig durcheinander. Die TOC nummeriert automatisch korrekt (1-35), aber die Section-Nummern springen wild:
- Section "Real Estate": `num={10}` ✓ aber nutzt `t("learn.section30Title")`
- Section "Dividendenstrategien": `num={32}` statt `num={11}`
- Section "Trading-Psychologie": `num={33}` statt `num={18}`
- Section "Faktor-Investing": `num={34}` statt `num={19}`
- Section "Geldpolitik": `num={30}` statt `num={30}` (zufällig richtig)
- Section "Fintech": `num={31}` statt `num={31}` (zufällig richtig)
- Section "Altersvorsorge": `num={35}` statt `num={25}`

**Fix:** Alle `num={}`-Werte strikt sequentiell 1-35 durchnummerieren, passend zur TOC-Reihenfolge:
- A (Beginner): 1-5
- B (Intermediate): 6-11 (inkl. Immobilien + Dividenden)
- C (Advanced): 12-14
- D (Expert): 15-20 (inkl. Trading-Psychologie + Faktor-Investing)
- E (Academic): 21-28 (inkl. Steueroptimierung + Altersvorsorge)
- F (Master): 29-35

**Datei:** `src/pages/LearnPage.tsx`

---

### Teil 2: Polymarket Prediction Markets Page

**Neue Seite** `/predictions` mit Live-Daten von den öffentlichen Polymarket APIs.

#### APIs die genutzt werden (alle kostenlos, kein API-Key nötig):

| API | Base URL | Endpoints |
|-----|----------|-----------|
| Gamma | gamma-api.polymarket.com | `/events`, `/markets`, `/tags`, `/public-search` |
| Data | data-api.polymarket.com | `/activity`, `/time-series/{token_id}` |
| CLOB | clob.polymarket.com | `/book` (orderbook), `/prices` |

#### Edge Function (CORS-Proxy)

Da die Polymarket APIs kein CORS erlauben, wird ein Edge Function als Proxy erstellt:
- `supabase/functions/polymarket-proxy/index.ts`
- Unterstützt: `/events`, `/markets`, `/tags`, `/public-search`, `/book`, `/prices`, `/time-series`
- Leitet Anfragen an die richtige Base-URL weiter (Gamma, CLOB, Data)

#### Frontend-Seite Features

**`src/pages/PredictionsPage.tsx`:**
1. **Trending Markets** — Top-Events nach 24h-Volumen, mit Live-Preisen (Ja/Nein-Wahrscheinlichkeiten)
2. **Kategoriefilter** — Politik, Crypto, Sport, Wirtschaft, etc. via Tags-API
3. **Suchfunktion** — Direkte Suche über `/public-search`
4. **Marktdetail-Cards** — Frage, aktuelle Wahrscheinlichkeit (Preis), Volumen, Liquidität, End-Datum
5. **Preis-History-Chart** — Zeitreihe über Data-API `/time-series/{token_id}`
6. **Event-Gruppierung** — Zusammengehörige Märkte unter einem Event gruppiert
7. **Orderbook-Tiefe** — Bid/Ask-Spread-Anzeige via CLOB `/book`

**`src/hooks/usePolymarket.ts`:**
- Custom hooks: `usePolymarketEvents`, `usePolymarketSearch`, `usePolymarketTimeSeries`, `usePolymarketBook`
- React Query mit 60s staleTime

**`src/lib/polymarketApi.ts`:**
- API-Client der alle Requests über die Edge Function routet

#### Routing
- Neue Route `/predictions` in `App.tsx`
- Link in Navigation/Header hinzufügen

### Dateien

| Datei | Aktion |
|-------|--------|
| `src/pages/LearnPage.tsx` | Nummerierung fixen (alle num={} sequentiell) |
| `supabase/functions/polymarket-proxy/index.ts` | Neuer CORS-Proxy für alle 3 Polymarket APIs |
| `supabase/config.toml` | Function-Config für polymarket-proxy |
| `src/lib/polymarketApi.ts` | API-Client |
| `src/hooks/usePolymarket.ts` | React Query hooks |
| `src/pages/PredictionsPage.tsx` | Hauptseite mit allen Features |
| `src/App.tsx` | Route `/predictions` hinzufügen |

