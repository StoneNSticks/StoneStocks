# Rechtliches und Barrierefreiheit für StoneStocks

Ziel: die Seite rechtlich absichern (deutsche Privatperson, kostenloses Angebot, DE/EN) und typische Risiken einer Finanz-Website entschärfen.

## Was ich gefunden habe

- Es gibt bisher **keine** Rechtstexte: kein Impressum, keine Datenschutzerklärung, keine Nutzungsbedingungen, kein Cookie-Hinweis.
- Es laufen **keine** Tracker, keine Werbung, keine fremden Einbettungen (kein Google Analytics, kein Tag Manager, keine iFrames). Gespeichert werden nur Sprache, Währung, Theme, Onboarding- und Lernfortschritt sowie die Anmeldung.
- Gespeicherte Nutzerdaten: Profil, Watchlist, Portfolio, Kursalarme, Kommentare und Bewertungen, Lernfortschritt, Benachrichtigungen. E-Mail ist bei der Registrierung freiwillig.
- Es gibt **keine** erfundenen Bewertungen oder Testimonials auf der Seite.
- Haftungshinweise ("keine Anlageberatung") stehen nur auf einzelnen Seiten, nicht überall.
- Nachrichtenbilder und Firmenlogos kommen von externen Anbietern und werden ohne Quellenangabe angezeigt.
- Barrierefreiheit: Nachrichtenbilder haben leeren Alt-Text, das Auge-Symbol zum Passwort-Einblenden hat keine Beschriftung, die Seitensprache steht fest auf Englisch, obwohl Deutsch angezeigt wird.

## Rechtliche Einschätzung

- **Cookie-Banner: nicht nötig.** Es werden nur technisch notwendige Daten im Browser gespeichert (Anmeldung, Sprache, Währung, Theme). Erst wenn Werbung, Analyse oder Partnerlinks dazukommen, braucht es eine Einwilligung. Das halte ich im Cookie-Hinweis ausdrücklich fest.
- **Rückerstattung: nicht anwendbar**, da nichts verkauft wird. Statt einer Rückerstattungsrichtlinie kommt ein klarer Abschnitt "kostenloses Angebot, keine Zahlungen, kein Widerrufsfall" in die Nutzungsbedingungen. Sobald bezahlte Funktionen kommen, braucht es Widerrufsbelehrung und Rückerstattungsregeln.
- **Impressum:** für eine rein private, kostenlose Seite ist ein vollständiges Impressum nicht zwingend, eine erreichbare Kontaktmöglichkeit und die Angabe des Verantwortlichen aber sehr wohl (Datenschutzrecht). Ich lege die Seite mit deinem Namen an und setze für die Kontakt-E-Mail einen deutlich markierten Platzhalter, den du ersetzen musst.
- **Finanzinhalte:** Kursdaten, Scores, Geheimtipps und KI-Texte dürfen nicht wie Empfehlungen wirken. Deshalb ein durchgängiger Hinweis und eine Datenherkunft-Seite.
- **Community:** Kommentare brauchen Regeln und eine Meldemöglichkeit für rechtswidrige Inhalte.

## Was ich baue

### 1. Rechtsseiten (DE/EN, über die bestehende Sprachumschaltung)

Vier neue Seiten, jeweils im Footer verlinkt:

- `/impressum` – Anbieterkennzeichnung, Kontakt, Verantwortlicher für den Inhalt, Haftungsausschluss für Links und fremde Inhalte, Hinweis zur EU-Streitschlichtung.
- `/datenschutz` – Verantwortlicher, welche Daten wofür, Rechtsgrundlagen, Speicherdauer, Auftragsverarbeiter (Hosting und Datenbank, Kursdaten- und Nachrichtenanbieter, KI-Dienst, Push-Zustellung), Drittlandübermittlung, alle Betroffenenrechte, Beschwerderecht bei der Aufsichtsbehörde, Hinweis auf die freiwillige E-Mail-Angabe.
- `/agb` – Nutzungsbedingungen: kostenloses Angebot, kein Anspruch auf Verfügbarkeit, keine Anlageberatung, Haftungsbegrenzung, Pflichten bei Community-Beiträgen, Kündigung und Kontolöschung, anwendbares Recht.
- `/cookies` – Tabelle aller gespeicherten Einträge mit Zweck und Dauer, Begründung, warum kein Einwilligungsbanner nötig ist.

Ergänzend eine `/datenquellen`-Sektion innerhalb des Impressums: Kursdaten, Nachrichten und Logos mit Anbieternennung und Hinweis, dass Marken den jeweiligen Inhabern gehören.

### 2. Haftungshinweis überall

- Dauerhafter Kurz-Hinweis im Footer: "Keine Anlageberatung. Alle Daten ohne Gewähr."
- Ergänzung bei Geheimtipps, Rankings, Fair Value, Backtest und den KI-Auswertungen, wo er noch fehlt.
- Formulierungen prüfen und entschärfen, wo etwas nach Versprechen klingt (zum Beispiel "Geheimtipps" bekommt den Zusatz, dass es sich um eine regelbasierte Auswertung handelt).

### 3. Einwilligung bei Formularen

- Registrierung: Pflicht-Checkbox mit Verlinkung auf Nutzungsbedingungen und Datenschutzerklärung, absenden erst danach möglich.
- Hinweis an der freiwilligen E-Mail-Eingabe, wofür sie verwendet wird.
- Kommentarfeld: kurzer Hinweis, dass Beiträge mit Nutzername öffentlich sichtbar sind.
- Push-Benachrichtigungen: Hinweistext vor der Aktivierung.

### 4. Datensparsamkeit

- Prüfen, ob Felder erhoben werden, die niemand braucht, und diese entfernen.
- Konto-Löschung in den Einstellungen sichtbar machen, inklusive Löschung der zugehörigen Inhalte.
- Datenexport des eigenen Profils als Download, damit das Auskunftsrecht praktisch erfüllbar ist.

### 5. Barrierefreiheit

- Sprachkennzeichnung der Seite folgt der gewählten Sprache.
- Aussagekräftige Alt-Texte für Nachrichtenbilder und Firmenlogos, rein dekorative Bilder ausdrücklich als solche kennzeichnen.
- Beschriftungen für alle Symbol-Schaltflächen (Passwort einblenden, Schließen, Menü, Favorit, Teilen).
- Tastaturbedienung der Formulare prüfen: Reihenfolge, sichtbarer Fokusrahmen, Fehlermeldungen werden vorgelesen statt nur als kurzer Hinweis eingeblendet.
- Kontraste gegen die Vorgaben prüfen und zu schwache Grautöne anheben; Statusfarben zusätzlich mit Text oder Symbol kennzeichnen, damit Rot und Grün nicht allein die Aussage tragen.
- Sprunglink "Zum Inhalt" und genau ein Hauptbereich pro Seite.
- Überschriftenreihenfolge und Mindestgröße von Tippzielen prüfen.

### 6. Risiken, die ich dir melde statt still zu lösen

- Fremde Nachrichtenbilder werden direkt vom Anbieter geladen. Sauberer wäre, nur Überschrift und Quelle zu zeigen. Ich kenne die Lizenzbedingungen deiner Datenanbieter nicht.
- Firmenlogos sind fremde Marken; zulässig zur Kennzeichnung, nicht als Werbung.
- Manche Kursdatenanbieter untersagen die öffentliche Weiterverbreitung ihrer Daten. Das muss gegen die jeweiligen Nutzungsbedingungen geprüft werden.
- Wenn später Werbung, Partnerlinks oder Statistik-Tools dazukommen, wird ein Einwilligungsbanner Pflicht.

## Technische Details

- Neue Seiten unter `src/pages/legal/` mit gemeinsamem Layout, Routen in `src/App.tsx`, Texte über `useT` in `src/contexts/LanguageContext.tsx` beziehungsweise einer eigenen Datei `src/i18n/legalTranslations.ts`, damit die Sprachdatei nicht überläuft.
- Footer in `src/components/Footer.tsx` erhält eine Rechtsspalte und den Haftungshinweis.
- Einwilligung im Formular in `src/pages/AuthPage.tsx` über die vorhandene Checkbox-Komponente.
- Seitensprache über einen Effekt im `LanguageProvider` auf `document.documentElement.lang`.
- Kontrast- und Tastaturprüfung mit einem Browser-Durchlauf über die Hauptseiten, Ergebnisse als Liste im Abschlussbericht.
- Rechtsseiten in `public/sitemap.xml` ergänzen und auf `noindex` verzichten.

## Was du danach tun musst

- Kontakt-E-Mail im Impressum und in der Datenschutzerklärung einsetzen (Platzhalter sind markiert).
- Entscheiden, ob eine Postanschrift genannt wird. Ohne Anschrift bleibt ein Restrisiko bei Abmahnungen, sobald die Seite als geschäftsmäßig gilt.
- Die Texte sind sorgfältig erstellt, ersetzen aber keine Rechtsberatung.
