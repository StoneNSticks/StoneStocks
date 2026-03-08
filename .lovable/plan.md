

# Vier Aenderungen umsetzen

## 1. Auth-Seite auf Englisch umstellen

Alle deutschen Texte in `src/pages/AuthPage.tsx` werden ins Englische uebersetzt:
- "Einloggen" -> "Sign In"
- "Registrieren" -> "Sign Up"
- "Passwort zuruecksetzen" -> "Reset Password"
- "Benutzername" -> "Username"
- "Anzeigename" -> "Display Name"
- "Laden..." -> "Loading..."
- Toast-Meldungen, Platzhalter, Labels, Links

## 2. ETFs/Leveraged Products aus Listen filtern

Das Problem: Produkte wie NVD, CRCG, MSTX, TSLS, COHX, IONZ, LUNL sind Leveraged/Inverse ETFs, die den `isCommonStock`-Filter passieren, weil sie kurze Ticker haben und nicht in der Blacklist stehen.

Loesung in `supabase/functions/stock-data/index.ts`:
- Blacklist erweitern um bekannte Ticker: NVD, CRCG, MSTX, TSLS, COHX, IONZ, LUNL, NVD, NVDL, NVDS, CONL, MSTZ, MSTU
- Zusaetzlichen **Name-basierten Filter** nach dem Enrichment einbauen: Eintraege deren Name Begriffe wie "ETF", "2x", "2X", "3x", "3X", "Leveraged", "Short", "Long Daily", "Direxion", "Defiance", "GraniteShares", "Tradr", "ProShares", "Trust" + "ETF" enthaelt, werden entfernt
- Diesen Filter auf `handleGainersLosers` und `handleMostActive` anwenden (nach `enrichWithProfileData`)

## 3. User-Datenbank leeren

Per SQL alle bestehenden Eintraege aus der `profiles`-Tabelle loeschen. Da `profiles.id` per `ON DELETE CASCADE` an `auth.users` haengt, muss zuerst der Eintrag in `auth.users` (ueber Lovable Cloud) oder die `profiles`-Tabelle direkt geleert werden.

Konkret: `DELETE FROM profiles;` und `DELETE FROM watchlist;` ausfuehren.

## 4. Waehrungsumrechnung auf Stock-Detail-Seiten

Folgende Komponenten zeigen Preise aktuell immer in USD (`$`) an und muessen die Waehrungsumrechnung nutzen:

### StockChart.tsx
- `useCurrency` importieren
- Y-Achse: `$` durch `symbol` ersetzen und Werte konvertieren
- Tooltip: Konvertierte Werte mit korrektem Waehrungssymbol anzeigen
- Chartdaten: `close`-Werte bei der Anzeige konvertieren

### FinancialChart.tsx
- `useCurrency` importieren
- `formatLargeNumber` dynamisch mit Waehrungssymbol versehen
- Y-Achse und Tooltip nutzen konvertierte Werte

### MetricsGrid.tsx
- `useFormattedCurrency` und `useCurrency` importieren
- Alle `formatCurrency`-Aufrufe durch die Hook-basierte Version ersetzen

### KeyMetrics.tsx
- `useFormattedCurrency` importieren
- Alle Waehrungswerte (Market Cap, EPS, 52W High/Low, Revenue, Gross Profit) konvertieren

### StockDetail.tsx
- `formatDividendValue` mit dem Waehrungssymbol versehen
- Preis-Header-Anzeige mit Konvertierung

---

## Technische Details

### Betroffene Dateien
- `src/pages/AuthPage.tsx` (Texte uebersetzen)
- `supabase/functions/stock-data/index.ts` (ETF-Filter erweitern)
- `src/components/StockChart.tsx` (Waehrung)
- `src/components/FinancialChart.tsx` (Waehrung)
- `src/components/MetricsGrid.tsx` (Waehrung)
- `src/components/KeyMetrics.tsx` (Waehrung)
- `src/pages/StockDetail.tsx` (Waehrung)

### Name-basierter ETF-Filter (Pseudocode)
```text
function isETFByName(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.includes(" etf") ||
    /\b[23]x\b/.test(lower) ||
    lower.includes("leveraged") ||
    lower.includes("direxion") ||
    lower.includes("proshares") ||
    lower.includes("graniteshares") ||
    lower.includes("defiance") ||
    lower.includes("tradr") ||
    (lower.includes("daily") && (lower.includes("short") || lower.includes("long")));
}
```

### Reihenfolge
1. Auth-Seite uebersetzen
2. ETF-Filter in Edge Function erweitern + deployen
3. User-Daten loeschen
4. Waehrungsumrechnung in alle Stock-Detail-Komponenten einbauen

