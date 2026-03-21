

## Plan: Finanzwissen & Glossar erweitern

### Übersicht

Das Finanzwissen hat aktuell 31 Lektionen und das Glossar ~660 DE / ~1000 EN Begriffe. Beides wird substanziell erweitert.

### 1. Neue Lektionen für Finanzwissen (4 neue Kapitel → 35 total)

Neue Kapitel einfügen, TOC-Gruppen anpassen, SectionHeader-Nummern aktualisieren:

**Kapitel 32: Trading-Psychologie & Mindset** (Gruppe D — Experte)
- Emotionskontrolle beim Trading, FOMO & Panikverkäufe, Journaling, Routinen

**Kapitel 33: Dividendenstrategien** (Gruppe B — Aufbau)
- Dividendenwachstum vs. hohe Dividendenrendite, Dividend Kings & Aristocrats, DRIP, Steueraspekte

**Kapitel 34: Faktor-Investing & Smart Beta** (Gruppe D — Experte)
- Value-, Growth-, Momentum-, Quality-, Size-Faktor, Smart-Beta-ETFs, Multi-Faktor-Strategien

**Kapitel 35: Altersvorsorge im Detail** (Gruppe E — Akademisch)
- Riester/Rürup/bAV (DE), 401k/IRA (EN), Entnahmepläne, Leibrenten, Rente mit Dividenden

**Dateien:**
- `src/pages/LearnPage.tsx` — 4 neue `<motion.section>` Blöcke + TOC-Gruppen erweitern + `num={}`-Werte von 31 auf 35 anpassen
- `src/i18n/learnTranslations.ts` — ~60 neue Übersetzungs-Keys (DE/EN) für alle 4 Kapitel
- `src/i18n/learnTranslationsExtended.ts` — TOC-Labels `toc32`–`toc35` ergänzen

### 2. Glossar erweitern (~80 neue Begriffe pro Sprache)

Neue Begriffe in Kategorien die aktuell unterrepräsentiert sind:

**Deutsch (`src/data/glossaryDE.ts`):**
- Trading-Begriffe: Scalping, Swing-Trading, Day-Trading, Paper-Trading, Breakout, Pullback, Gap, Squeeze, Momentum-Trading
- Verhaltensökonomie: FOMO, Herdentrieb, Recency Bias, Survivorship Bias, Confirmation Bias
- Moderne Finanzen: Tokenisierung, Fractional Shares, Copy-Trading, Social Trading, Robo-Advisor, Neobroker
- Makroökonomie: Stagflation, Quantitative Easing, Tapering, Forward Guidance, Fiskaldefizit
- Steuer/Recht: Sparerpauschbetrag, Freistellungsauftrag, Quellensteuer, Doppelbesteuerungsabkommen, Verlustverrechnungstopf
- Kennzahlen: PEG-Ratio, Enterprise Value, EBITDA-Marge, Current Ratio, Quick Ratio, Debt-to-Equity
- Dividenden: Dividendenrendite, Ausschüttungsquote, Ex-Dividende-Tag, Dividenden-Aristokrat, DRIP
- ~80 Begriffe total

**Englisch (`src/data/glossaryEN.ts`):**
- Entsprechende englische Begriffe + zusätzliche US-spezifische (401k, IRA, SPAC, Regulation, Fiduciary Duty, etc.)
- ~80 Begriffe total

### 3. Glossar Synonym-Map erweitern

In `src/pages/GlossaryPage.tsx` die Synonym-Maps `SYNONYMS_DE` und `SYNONYMS_EN` um die neuen Begriffe ergänzen (z.B. EBITDA ↔ "Gewinn vor Zinsen, Steuern, Abschreibungen").

### Dateien-Übersicht

| Datei | Änderung |
|---|---|
| `src/pages/LearnPage.tsx` | 4 neue Sektionen + TOC + Nummern |
| `src/i18n/learnTranslations.ts` | ~60 neue Keys |
| `src/i18n/learnTranslationsExtended.ts` | 4 neue TOC-Labels |
| `src/data/glossaryDE.ts` | ~80 neue Begriffe |
| `src/data/glossaryEN.ts` | ~80 neue Begriffe |
| `src/pages/GlossaryPage.tsx` | Synonym-Maps erweitern |

