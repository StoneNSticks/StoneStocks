# Top-Unternehmen neu aufbauen (plus zwei gemeldete Probleme)

## Was ich geprüft habe

Du hast recht: SpaceX ist inzwischen an der Nasdaq gelistet (Kürzel SPCX) und steht nach Börsenwert aktuell auf Platz 8 in den USA, mit rund 2.000 Milliarden Dollar. Auf deiner Seite taucht die Firma trotzdem nicht auf.

Der Grund: Die Rangliste zieht ihre Firmen nicht aus dem Markt, sondern aus einer von Hand gepflegten Liste mit 127 US-Firmen im Code. Kurse und Börsenwerte darin sind live und korrekt, aber es kann grundsätzlich nur erscheinen, wer in dieser Liste steht. Jeder Börsengang, jeder Aufsteiger und jede Umbenennung fehlt, bis jemand die Liste von Hand nachpflegt. Auch SK hynix, aktuell Platz 12 in den USA, fehlt deshalb.

Ich habe live getestet, dass es eine automatische Quelle gibt: Yahoo liefert eine nach Börsenwert sortierte Rangliste aller rund 20.000 US-Titel, in der SpaceX korrekt auf Platz 8 steht. Damit lässt sich die Handpflege komplett abschaffen.

## Was ich ändern will

**Rangliste kommt künftig aus dem Markt, nicht aus dem Code.** Bei jeder Aktualisierung werden die nach Börsenwert größten US-Unternehmen abgefragt und daraus die Top 100 gebildet. Neue Börsengänge wie SpaceX erscheinen automatisch am richtigen Platz, ohne dass jemand etwas nachträgt.

**Saubere Liste.** Damit die Rangliste nicht durch Dubletten verfälscht wird:
- Von mehreren Aktiengattungen derselben Firma bleibt nur eine übrig, die mit dem höheren Handelsvolumen. Alphabet steht also einmal da, nicht zweimal, Berkshire ebenso.
- Nur echte Aktien an den großen US-Börsen. Fonds, gehebelte Produkte, Zertifikate und Nebenlistings am Freiverkehr fliegen raus.
- Unplausible Börsenwerte werden verworfen statt angezeigt. Fehlt bei einer Firma der Börsenwert, wird er aus Kurs und Aktienzahl berechnet und nur übernommen, wenn er zum Rest passt.

**Verlässlich auch bei Störungen.** Fällt die automatische Quelle aus, greift die bisherige Firmenliste als Notnagel, damit nie eine leere Rangliste erscheint. Außerhalb der Handelszeiten bleibt es wie bisher beim Stand vom letzten Börsentag.

**Sichtbar frisch.** Über der Liste steht künftig, von wann die Zahlen sind, und ob der Markt gerade offen oder geschlossen ist. Ein kleiner Hinweis erklärt, dass nach Börsenwert sortiert wird und was beim Börsenwert zählt.

**Wo es überall wirkt.** Startseite, Rankings-Seite, Heatmap und Marktstimmung greifen auf dieselbe Quelle zu und werden damit automatisch mit aktuell.

## Zwei gemeldete Probleme, die ich mitnehmen will

**Rechtsseiten zeigen einen Platzhalter.** Impressum, Datenschutz, AGB und Cookies zeigen aktuell jedem Besucher "TODO@example.com" und den roten Entwicklerhinweis. Bis deine echte Adresse feststeht, entferne ich den roten Kasten für Besucher und ersetze die Platzhalter-Adresse durch den neutralen Satz, dass die Kontaktangabe nachgereicht wird. Sobald du mir die Adresse nennst, trage ich sie ein und das Thema ist erledigt.

**Zwei Datenanbieter lehnen uns ab.** In den Serverprotokollen weisen die Polygon/Massive-Schlüssel dauerhaft mit "403 Zugriff verweigert" ab, und TwelveData meldet "429 Kontingent aufgebraucht". Die Seite fängt das über Ersatzquellen ab, jeder Versuch kostet aber Ladezeit. Ich schalte einen Anbieter, der uns innerhalb eines Aufrufs zweimal abgewiesen hat, für den Rest dieses Aufrufs ab, statt weiter gegen die Wand zu laufen. Neue Zugangsschlüssel kannst nur du besorgen, die Seite funktioniert aber auch ohne sie.

## Technische Umsetzung

- `supabase/functions/stock-data/index.ts`, `handleTopCompanies`: neue Funktion `fetchTopByMarketCap()` gegen `query1.finance.yahoo.com/v1/finance/screener` mit `sortField: intradaymarketcap`, `quoteType: EQUITY`, `region: us`, Seiten à 100 bis 150 Treffer. Cookie- und Crumb-Beschaffung über die vorhandene Helferfunktion aus `yahooBulkQuotes`, Crumb 6 Stunden im `api_cache`.
- Filter: `fullExchangeName` auf NasdaqGS/NasdaqGM/NYSE/NYSEArca/NYSEAmerican beschränken, `quoteType !== EQUITY` verwerfen, bestehende `isETFByName`/`isCommonStock`-Prüfungen anwenden, `MAX_REASONABLE_MCAP` beibehalten.
- Dubletten: Gruppierung über `shortName`, normalisiert um Rechtsformzusätze, bei gleichem Börsenwert innerhalb von 2 Prozent bleibt das Papier mit höherem `regularMarketVolume`.
- Anreicherung: Logos und Sektoren weiter aus dem 7-Tage-Profilcache (`market:top_profiles`), nur für Symbole ohne Treffer nachladen. Cachekey auf `market:top_companies:v13`, damit die alte Liste nicht weiterlebt. `TOP_COMPANIES` bleibt als Fallback-Konstante erhalten.
- Antwort erhält `asOf` und `marketOpen`; `src/components/TopCompanies.tsx` zeigt beides an und behält die clientseitige Sortierung als Sicherheitsnetz.
- `fetchMassive` und `fetchTwelveData` bekommen einen Zähler pro Aufruf, der nach zwei Ablehnungen sofort abbricht.
- `src/i18n/legalContent.ts`: Platzhalterinterpolation auf einen Nachreichsatz umstellen; `src/pages/LegalPage.tsx`: Warnkasten entfernen.
- Neue Tests in `src/lib/` für Dubletten- und Filterlogik, ausgelagert in eine reine Hilfsdatei, damit sie ohne Netzwerk testbar ist.
