## Plan: Fix Glossary Search & Expand Learn Content

### 1. Glossary Search Fixes

**Bug identified:** When a letter filter is active (e.g. "A") and you type a search term (e.g. "Bond"), the letter filter stays active, so results are filtered by BOTH letter AND search — returning 0 results unexpectedly. The search should auto-clear the letter filter when the user starts typing.

**Additional improvements:**

- Auto-clear letter filter when user types (not just on empty)
- When clicking a letter while search is active, clear the search
- Add result highlighting: bold the matched portion of term/definition
- Add debounced search for smoother UX with 1000+ terms
- Show "no results" state with a suggestion to clear filters

**File:** `src/pages/GlossaryPage.tsx`

### 2. Learn Page Expansion

Currently 28 sections in 6 super-sections (A-F). Add new sections and expand existing ones:

**New sections to add:**

- **Section 29: Fintech & Digital Finance** (Master) — Robo-advisors, neobanks, blockchain in finance, tokenization, DeFi basics, payment systems
- **Section 30: Real Estate Investing** (Intermediate, add to Section B) — Direct vs indirect real estate, REITs deep dive, crowdfunding, real estate valuation, location analysis, financing
- **Section 31: Tax Optimization Strategies** (Academic) — International tax planning, holding structures, tax-loss harvesting advanced, estate planning, capital gains strategies

**Expand existing sections:**

- Section 3 (Strategies): Add Contrarian Investing, Sector Rotation, Core-Satellite strategy
- Section 8 (Portfolio): Add Modern Portfolio Theory practical application, risk parity
- Section 14 (Behavioral): Add framing effect, mental accounting, sunk cost fallacy
- Section 25 (Market History): Add 2022 crypto crash, Asian financial crisis 1997

**Files:**

- `src/pages/LearnPage.tsx` — Add new sections, expand existing
- `src/i18n/learnTranslations.ts` — Add DE/EN translations for new content
- `src/i18n/learnTranslationsExtended.ts` — Additional translations
- Update TOC to include new sections (renumber as needed)