
Ziel: Polymarket-Daten zentral sammeln, auswerten und in mehreren Bereichen sichtbar machen (eigene Seite neben Backtest, Sentiment/Fear&Greed, Aktien-Earnings, optional Makro), plus die Learn-Probleme auf Desktop endgültig beheben (Nummerierung + kaputte Keys in Abschnitt 7/8).

1) Learn/Finanzwissen stabilisieren (Nummerierung + kaputte 7/8 Inhalte)
- `src/pages/LearnPage.tsx`
  - Nummerierung vollständig von einer zentralen Reihenfolge ableiten (kein manuelles Durcheinander zwischen `sectionXXTitle` und `num`).
  - TOC-Labels vor Ausgabe säubern (falls alte Übersetzungen noch numerische Präfixe tragen), z. B. `30. ...` entfernen.
  - Für Learn-Seiten einen sicheren Übersetzungs-Wrapper nutzen: Wenn `t(key) === key`, sofort lokaler Fallback-Text (DE/EN) statt Key anzeigen.
  - Besonders Abschnitt 7/8 absichern (Crypto/Portfolio-Titel, Unterkarten, TermCards), damit niemals `learn.xyz`-Keys sichtbar sind.
- `src/i18n/learnTranslations.ts` + `src/i18n/learnTranslationsExtended.ts`
  - Key-Audit für alle in Learn genutzten Keys (inkl. 7/8) und fehlende Einträge ergänzen.
- Caching-Fix (Desktop-Stale-Bundle)
  - `vite.config.ts`: Workbox härter auf neue Deploys ausrichten (`cleanupOutdatedCaches`, `clientsClaim`, `skipWaiting`), damit Desktop nicht auf alter Übersetzungsdatei hängen bleibt.

2) Polymarket-Datenschicht auf “alles Relevante” erweitern
- `supabase/functions/polymarket-proxy/index.ts`
  - Proxy von “ein paar Endpunkten” auf eine klar allowlist-basierte Multi-API-Routing-Schicht erweitern:
    - Gamma: events, markets, tags, series, comments, sports, search, profiles
    - Data: positions, trades/activity, holder/open-interest, leaderboard, builder analytics/timeseries
    - CLOB: book/books, prices, midpoint, spread, last trade, prices history
  - GET + POST Unterstützung für Read-Endpoints; Trading-/Order-Write-Endpunkte bewusst nicht im UI aktivieren.
  - Einheitliches Fehlerformat + Timeouts + CORS auf allen Antworten.
- `src/lib/polymarketApi.ts`
  - Typed Funktionen pro Endpoint-Gruppe + Normalizer (politisch/finanziell, Liquidität, Volatilität, Trend).
- `src/hooks/usePolymarket.ts`
  - Hooks für Discovery, Preis-/Orderbook-Daten, Marktbreite, Open Interest, Aktivität, “political vs financial sentiment”.

3) Neue Seite neben Backtest (umbenannt von Predictions)
- Neue Hauptseite (z. B. `src/pages/PolymarketIntelligencePage.tsx`) mit Route `/polymarket` (Alias `/predictions` bleibt für Rückwärtskompatibilität).
- `src/App.tsx` + `src/components/Header.tsx`
  - Menüpunkt direkt neben Backtest platzieren.
  - Name von “Predictions” auf klaren Produktnamen (z. B. “Polymarket Intel” / “Prognose-Intelligence”) umstellen.
- Seiteninhalt:
  - Politische Märkte (Top-Trends, größte Wahrscheinlichkeitsänderung, Event-Heat)
  - Finanz-/Makro-Märkte (Fed, Inflation, Rezession, BTC/ETF etc.)
  - “Was ist neu” (24h-Delta, Volumen, Liquidität, Open Interest)
  - Detailpanel mit Preisverlauf + Orderbook-/Spread-Snapshot + Signalbewertung

4) Polymarket in relevante Bereiche integrieren
- Fear & Greed (`src/pages/MarketSentimentPage.tsx`)
  - Gewichte anpassen:
    - Risk-On/Risk-Off: auf 5–7% (Vorschlag: 6%)
    - Sichere Häfen: auf 5–7% (Vorschlag: 6%)
  - Neues Subsignal “Prediction Market Sentiment” hinzufügen (aus politischen + finanziellen Polymarket-Events), Gewicht aus frei werdendem Anteil.
  - Fallback neutral (50), wenn Polymarket temporär keine Daten liefert.
- Aktienseiten / Quartalszahlen (`src/pages/StockDetail.tsx` + neue Komponente)
  - Neue Karte “Polymarket Earnings Signal”:
    - Sucht earnings-relevante Märkte (Ticker + Firmenname + “earnings/beat/miss” Muster)
    - Zeigt implizite Wahrscheinlichkeit, jüngste Veränderung, Liquidität/Confidence
  - Karte im Earnings-Bereich neben bestehender Earnings-Analyse einhängen.
- Makroseite (`src/pages/MacroDashboard.tsx`)
  - Optionales Modul “Market-Implied Macro Expectations”:
    - z. B. Wahrscheinlichkeit für Rate Cuts/Inflation-/Rezessions-Events
    - Nur anzeigen, wenn genügend valide Polymarket-Märkte gefunden werden.

5) Technische Details (kompakt)
- Keine DB-Migration nötig.
- Fokus auf read-only Marktdaten; keine Trading-Automation.
- API-Qualitätsschicht:
  - Score/Confidence aus Volumen, Liquidität, Spread, Datenfrische
  - Deduplizierung ähnlicher Märkte
  - Kategorienormalisierung (politics/finance/macro/crypto)
- Performance:
  - React Query StaleTimes je Datentyp (Orderbook kürzer, Event-Metadaten länger)
  - Serverseitiger Proxy reduziert CORS-Probleme und standardisiert Fehler.

6) Abnahme/QA
- Desktop zuerst (dein gemeldetes Problem), dann iPad/Phone:
  - `/learn`: keine sichtbaren `learn.*`-Keys in Abschnitt 7/8, Nummerierung 1–35 konsistent
  - `/polymarket`: Daten laden stabil, Filter + Detailpanel + Auswertungen funktionieren
  - `/sentiment`: neue Gewichte/Indikator korrekt im Composite
  - `/stock/:symbol`: Earnings-Prediction-Karte erscheint mit sinnvollen Daten/Fallback
  - `/macro`: neues Polymarket-Makro-Modul nur bei verfügbarer Datenlage
