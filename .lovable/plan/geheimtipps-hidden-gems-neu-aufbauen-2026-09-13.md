# Geheimtipps (Hidden Gems) neu aufbauen

Aktuell werden 16 fest verdrahtete, bereits sehr bekannte Aktien (Palantir, Coinbase, Snowflake usw.) nur danach sortiert, wie viele Analysten "Kaufen" sagen. Das sind keine Geheimtipps und es sagt nichts über Aufwärtspotenzial aus.

## Neue Auswahl

Universum: alle Aktien unter 200 Mrd. USD Marktkapitalisierung, Mindestgröße 1 Mrd. USD, keine ETFs, Hebelprodukte, Optionsscheine oder Zertifikate. Grundlage ist eine breite Kandidatenliste (rund 200 Titel aus allen Sektoren, USA und Europa), die aus den bestehenden Ranglisten und Heatmap-Listen aufgebaut wird.

Jede Aktie bekommt eine Punktzahl von 0 bis 100 aus fünf Bausteinen:

| Baustein | Gewicht | Inhalt |
| --- | --- | --- |
| Unterbewertung | 30 % | KGV, KUV, EV/EBITDA, Free-Cashflow-Rendite im Vergleich zum Sektor |
| Wachstum | 30 % | Umsatz- und Gewinnwachstum, Gewinnmargen-Trend |
| Analysten-Aufwärtspotenzial | 20 % | Abstand Kurs zu durchschnittlichem Kursziel, Kaufkonsens |
| Bilanzqualität | 10 % | Verschuldung zu EBITDA, Eigenkapitalrendite, positiver Cashflow |
| Momentum | 10 % | Kursentwicklung 3 und 6 Monate, Abstand zum 52-Wochen-Hoch |

Ausschlusskriterien: negativer Free Cashflow bei gleichzeitig hoher Verschuldung, Kurs unter 3 USD, weniger als 3 Analysten, Kurssturz über 60 % in 12 Monaten ohne Gewinnwachstum. Angezeigt werden die 12 besten Titel, maximal 2 pro Sektor, damit die Liste gemischt bleibt.

## Neue Darstellung

Jede Karte zeigt zusätzlich:
- Gesamtpunktzahl als Kennzeichnung (zum Beispiel 84/100)
- Aufwärtspotenzial in Prozent bis zum Analysten-Kursziel
- Kurzbegründung in einem Satz, etwa "Günstig bewertet bei 22 % Umsatzwachstum"
- Drei Kennzahlen: KGV, Umsatzwachstum, Free-Cashflow-Rendite
- Aufklappbare Erklärung der Punktzahl mit allen fünf Bausteinen und ihren Gewichten

Alle Texte auf Deutsch und Englisch, Preise folgen dem USD/EUR-Umschalter. Untertitel wird zu "Unterbewertet mit Wachstumspotenzial".

## Technische Umsetzung

- Neue Scoring-Logik in `supabase/functions/stock-data/index.ts` (`handleHiddenGems`), Cache-Schlüssel auf `market:hidden_gems:v2`, TTL 6 Stunden, außerhalb der Handelszeiten Stale-Cache wie bei den Top-Unternehmen.
- Kennzahlen über die vorhandene Anbieter-Kaskade: Yahoo-Bulk-Quotes für Kurs und Marktkapitalisierung, Finnhub für Kursziele, Empfehlungen und Kennzahlen, SimFin/Twelve Data als Rückfallebene. Batchweise Verarbeitung mit Zeitbudget, damit die Funktion nicht ins Timeout läuft.
- Scoring in eine eigene Datei `supabase/functions/stock-data/hiddenGems.ts` auslagern, damit sie testbar bleibt.
- `src/components/HiddenGems.tsx` auf die neuen Felder umbauen (score, upside, reasons, Kennzahlen), neue Übersetzungsschlüssel in `src/contexts/LanguageContext.tsx`.
- Nach dem Bauen live prüfen: Antwortzeit, Anzahl Treffer, plausible Punktzahlen und Kursziele.
