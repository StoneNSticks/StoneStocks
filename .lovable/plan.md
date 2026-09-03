# Glossary Page Rework

Goal: make the glossary fast, easy to scan, and maintainable. Today it is one 610-line page component that renders every term at once, with duplicate entries in the data and no way to link to a single term.

## What is wrong today (verified)

- Duplicate entries: 23 duplicated terms in the German list, 74 in the English list (e.g. Breakout, EBITDA, Current Ratio, Dividend Yield). They show up twice in results.
- Coverage gap: German has 702 terms, English 1021. The page still advertises "500+".
- Everything renders at once: up to ~1000 cards mount on load, plus a `ref` map that grows unbounded. Scrolling and typing feel heavy.
- Search matches against the debounced query but highlights using the raw input, so highlighting lags/mismatches while typing.
- No categories, no per-term deep links, no copy/share, no "related terms".
- Whole scoring engine, synonym maps and UI live in one file; no tests.

## Plan

### 1. Clean and restructure the data
- De-duplicate both language files (keep the longer/better definition), sort alphabetically, and add a build-time guard so duplicates cannot come back.
- Extend the `GlossaryTerm` type with optional `category` (e.g. Basics, Analysis, Trading, Derivatives, Macro, Taxes & Regulation, Crypto) and optional `related` term names.
- Assign categories across all terms; fill the German list up to parity with English for terms that are missing.

### 2. Extract the search engine
- Move Levenshtein, synonym maps and scoring out of the page into `src/lib/glossarySearch.ts`.
- Build a normalized index once per language (lowercased term, umlaut/accent folding so "volatilitaet" finds "Volatilität", token list) instead of re-lowercasing every term on every keystroke.
- Add unit tests for: exact match, prefix, typo tolerance, synonym hit, umlaut folding, no-match.

### 3. Rework the UI
- Sticky search bar with a result counter, autocomplete kept, plus keyboard support already present.
- Filters row: A-Z letters and category chips, combinable with search (currently letter and search cancel each other out).
- Results grouped under sticky letter headers when unfiltered; flat relevance-ordered list when searching.
- Virtualized/incremental rendering so only visible cards mount; large lists stay smooth.
- Each term card gets: category badge, copy-link button, and clickable related terms. Deep links via `/glossary#term-slug` scroll to and highlight the term.
- Empty state with the top fuzzy near-misses ("Did you mean ...") and a reset action.
- Fix highlighting to use the same debounced query the results were scored with, and highlight matched synonyms too.
- Skeleton placeholders and correct term count in the page heading and meta description.

### 4. SEO and accessibility
- Update the page title/description to the real term count; add `DefinedTermSet` JSON-LD.
- Combobox roles/`aria-activedescendant` for the autocomplete, `aria-live` on the result counter, visible focus rings on filter chips.

## Technical notes

- New files: `src/lib/glossarySearch.ts`, `src/lib/glossarySearch.test.ts`, `src/components/glossary/GlossarySearchBar.tsx`, `GlossaryFilters.tsx`, `GlossaryTermCard.tsx`, `GlossaryResults.tsx`.
- `src/pages/GlossaryPage.tsx` shrinks to layout plus state wiring (~150 lines).
- Virtualization via a small windowing hook (no new dependency) or `@tanstack/react-virtual` if already available.
- Styling stays on existing semantic tokens; no color literals.
- No backend changes; the glossary stays static data.
