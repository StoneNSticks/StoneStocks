

# Erweiterungsplan: Rechner & Learn-Seite

## Teil 1: Neue Rechner hinzufügen

### Existing (12 calculators):
Portfolio Growth, Compound Interest, Dividend Calc, FIRE, Position Size, Options P&L, DCA Simulator, Loan, Risk/Reward, Currency Converter, Tax-Loss Harvesting, Dividend Projector

### New calculators to add:
1. **Inflation Calculator** — Kaufkraftverlust über Zeit berechnen (Betrag, Inflationsrate, Jahre → realer Wert + Chart)
2. **Margin Calculator** — Margin-Anforderungen & Liquidation berechnen (Eigenkapital, Hebel, Entry → Maintenance Margin, Liquidation Price)
3. **Retirement Withdrawal** — Entnahmeplan-Simulator: Wie lange reicht das Vermögen bei monatlicher Entnahme? (Startkapital, monatl. Entnahme, Rendite → Monate bis Aufbrauch + Chart)
4. **ROI Calculator** — Einfacher Return on Investment (Kaufpreis, Verkaufspreis, Haltezeit → Gesamt-ROI, annualisierter ROI)
5. **Break-Even Calculator** — Wieviel Anstieg nötig um Verlust auszugleichen (-20% Verlust → braucht +25% Erholung, mit Tabelle)
6. **Savings Goal** — Sparziel-Rechner (Zielwert, monatl. Sparrate, Rendite → Monate bis Ziel + Fortschrittsbalken)

### Improvements to existing:
- **DCA Simulator**: Add comparison with lump-sum investment line on chart
- **Tax-Loss Harvesting**: Use `t()` keys instead of `lang === "de"` inline strings
- **Dividend Projector**: Same — replace `lang === "de"` with proper i18n keys
- **Tab organization**: Group calculators into categories (Grundlagen, Trading, Planung, Spezial) using a category filter/selector above the tabs, since 18 tabs is unwieldy

---

## Teil 2: Learn-Seite — Obersektionen & Neuanordnung

### Current structure (flat, 13 sections):
1. Grundlagen (Beginner)
2. Aktien & ETFs (Beginner)
3. Anleihen & Fonds (Intermediate)
4. Derivate (Advanced)
5. Krypto & Alternativen (Intermediate)
6. **Strategien (Intermediate)** ← should be Beginner
7. Technische Analyse (Advanced)
8. Portfolio Management (Advanced)
9. Steuern & Kosten (Beginner)
10. Formeln & Expertenwissen (Advanced)
11. Market Microstructure (Advanced)
12. Behavioral Finance (Advanced)
13. Globale Märkte & Makro (Advanced)

### New structure — grouped into 4 Obersektionen that build progressively:

```text
═══════════════════════════════════════════
OBERSEKTION A: EINSTIEG (Beginner)
═══════════════════════════════════════════
 1. Grundlagen (existing)
 2. Aktien & ETFs (existing)
 3. Investmentstrategien (existing #6, level → Beginner)
 4. Steuern & Kosten (existing #9)
 5. [NEW] Dein erstes Investment — Schritt-für-Schritt
    (Broker wählen, Konto eröffnen, erste Order,
     Sparplan einrichten, Fehler vermeiden)

═══════════════════════════════════════════
OBERSEKTION B: AUFBAU (Intermediate)
═══════════════════════════════════════════
 6. Anleihen & Fonds (existing #3)
 7. Krypto & Alternativen (existing #5)
 8. Portfolio Management (existing #8, level → Intermediate)
 9. [NEW] Aktienanalyse in der Praxis
    (Geschäftsberichte lesen, 10-K/10-Q,
     Bilanzen verstehen, Management bewerten,
     Branchenvergleich)

═══════════════════════════════════════════
OBERSEKTION C: FORTGESCHRITTEN (Advanced)
═══════════════════════════════════════════
10. Technische Analyse (existing #7)
11. Derivate (existing #4)
12. Formeln & Expertenwissen (existing #10)

═══════════════════════════════════════════
OBERSEKTION D: EXPERTE (Expert)
═══════════════════════════════════════════
13. Market Microstructure (existing #11)
14. Behavioral Finance (existing #12)
15. Globale Märkte & Makro (existing #13)
16. [NEW] Quantitative Analyse
    (Faktormodelle, statistische Arbitrage,
     Backtesting-Grundlagen, Alpha vs. Beta)
```

### Key changes:
- **Section 6 (Strategien) → level changed from "Intermediate" to "Beginner"** — Buy & Hold, DCA, Value, Growth are beginner concepts
- **Section 8 (Portfolio Mgmt) → moved from Advanced to Intermediate**
- **3 new sections added** (Dein erstes Investment, Aktienanalyse Praxis, Quantitative Analyse)
- **TOC redesigned** with collapsible Obersektion headers (A/B/C/D) so users see the progression
- **Quizzes** added for new sections + missing sections (currently only Basics, Stocks & ETFs, Derivatives have quizzes — add for Strategies, Portfolio Mgmt, Technical Analysis)

### Additional Learn improvements:
- Add a **progress tracker** showing which sections the user has scrolled through (localStorage-based checkmarks in TOC)
- Add **"Weiterführende Links"** box at end of each section pointing to relevant calculators (e.g. Strategien → DCA Simulator link)

---

## Technical approach

### Calculator changes:
- Add 6 new calculator components in `CalculatorPage.tsx`
- Add category grouping UI (horizontal category pills above tab strip)
- Add missing i18n keys for Tax-Loss and Dividend Projector
- All new translation keys in `LanguageContext.tsx`

### Learn page changes:
- Restructure `LearnPage.tsx` with Obersektion wrapper components (collapsible headers with progress dots)
- Reorder sections as described above
- Change `level` prop on Strategien from `t("learn.levelIntermediate")` to `t("learn.levelBeginner")`
- Change Portfolio Mgmt from Advanced to Intermediate
- Add 3 new content sections with full DE/EN translations
- Add quizzes for 3+ more sections
- Add cross-links to calculators

This is a large change spanning ~2000+ lines across 2 main files and `LanguageContext.tsx`. Implementation will be split into batches.

