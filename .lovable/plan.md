

## Plan: Glossar Desktop-Anpassung & Learn-Page Fixes

### 1. Glossar Highlight Bug — Fix `regex.test()` mit `g`-Flag

**Problem:** Die `Highlight`-Komponente (Zeile 257) nutzt `regex.test(part)` mit dem `gi`-Flag. Das `g`-Flag lässt `lastIndex` hochzählen, wodurch jeder zweite Treffer übersprungen wird.

**Fix:** `regex.test(part)` durch `part.toLowerCase() === query.toLowerCase()` ersetzen — einfacher String-Vergleich statt Regex.

### 2. Glossar Desktop-Layout optimieren

**Problem:** Auf dem Handy sieht das Glossar gut aus, auf dem Desktop ist das Layout nicht optimal (zu schmal, Buchstaben-Bar kompakt, Ergebnisse nicht ausgenutzt).

**Änderungen in `GlossaryPage.tsx`:**
- `max-w-4xl` auf `max-w-5xl` erweitern
- Buchstaben-Bar: auf Desktop größere Buttons (`md:px-3 md:py-1.5 md:text-sm`)
- Ergebnisse: auf Desktop 2-Spalten-Grid (`md:grid md:grid-cols-2 md:gap-3`)
- Suchfeld: auf Desktop größer (`md:h-12 md:text-base`)
- Suggestions-Dropdown: auf Desktop breitere Vorschau mit längerer Definition

### 3. Learn-Page Nummerierung verifizieren

**Aktueller Code-Stand:** Die `SectionHeader num={}`-Werte sind bereits sequentiell 1–31. Falls der User "30" sieht, liegt das an einem Build-Cache. Die Werte werden erneut bestätigt und ggf. nachgebessert:

```text
A: 1-5 ✓  |  B: 6-10 ✓  |  C: 11-13 → aktuell num={11,12,13}
D: 14-17 → aktuell num={14,15,16,17}
E: 18-24 → aktuell num={18,19,20,21,22,23,24}
F: 25-31 → aktuell num={25,26,27,28,29,30,31}
```

**Problem:** Section C startet mit `num={11}` statt `num={11}` — Moment, das IST korrekt. ABER: Die Comments sagen z.B. "Section 10: Technical Analysis" mit `num={11}`. Die Kommentare verwirren, aber die Nummern stimmen.

Trotzdem nochmal alle `num={}` Werte explizit durchgehen und bestätigen.

### 4. Übersetzungs-Keys für Sektionen 7 & 8

Die Keys existieren bereits in `learnTranslations.ts` (Zeilen 448–508). Falls der User noch rohe Keys sieht, könnte es am Build-Cache liegen. Zur Sicherheit prüfe ich, ob alle genutzten Keys auch definiert sind, und ergänze fehlende.

### Dateien

1. **`src/pages/GlossaryPage.tsx`** — Highlight-Fix + Desktop-Layout-Optimierung
2. **`src/pages/LearnPage.tsx`** — Nummerierung verifizieren, ggf. Kommentare korrigieren

