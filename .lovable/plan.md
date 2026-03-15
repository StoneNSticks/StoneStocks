

## Plan: Fix Glossary Search & Learn Page Bugs

### Issues Found

**Glossary Search — 2 bugs:**

1. **Highlight component broken**: The `Highlight` function creates a regex with the `g` (global) flag, then uses `regex.test(part)` inside a `.map()`. The `g` flag causes `regex.lastIndex` to advance between calls, so every *second* match is missed (alternating highlight/no-highlight). This is a well-known JS regex pitfall.
   - **Fix**: Remove the `g` flag from the test regex, or use a fresh regex / simple `toLowerCase().includes()` comparison instead of `regex.test()`.

2. **Highlight threshold too high**: Highlighting only activates when `query.length >= 2`, but search filters from `length >= 1`. Single-character searches show filtered results but no highlighting — inconsistent. Lower to 1 or keep at 2 but match filter threshold.

**Learn Page — 3 bugs:**

1. **Section 30 (Real Estate) is in a broken separate SuperSection** with empty title/level (`title=""`, `level=""`), rendered as a ghost container outside Super B. It should be inside the Super B `SuperSection` alongside sections 6-9.

2. **Numbering wrong**: Sections 29, 30, 31 use hardcoded out-of-sequence numbers instead of sequential 10, 11, etc. The TOC auto-numbers via `globalOffset + ii + 1`, so TOC shows correct sequential numbers (1-31) but the actual `SectionHeader num={}` values jump to 29, 30, 31. Need to renumber all sections sequentially: move Real Estate into Super B as section 10, shift everything after by 1, and renumber sections 29→last and 31→second-to-last accordingly.

3. **Duplicate scroll-to-top button**: LearnPage has its own custom scroll-to-top button (lines 1105-1118) AND the global `BackToTop` component is rendered in `App.tsx`. Remove the LearnPage-local one.

### Changes

**File: `src/pages/GlossaryPage.tsx`**
- Fix `Highlight` component: don't use `regex.test()` with `g` flag — use case-insensitive string comparison or a non-global regex for the test
- Align highlight threshold with filter threshold

**File: `src/pages/LearnPage.tsx`**
- Move section 30 (Real Estate) inside Super B's `SuperSection`, remove the empty `super-b2` wrapper
- Renumber all sections sequentially (1-31) matching TOC order: A(1-5), B(6-10), C(11-13), D(14-17), E(18-24), F(25-31)
- Remove the local scroll-to-top button (lines 63-69 state + lines 1105-1118 JSX) since `BackToTop` in App.tsx already handles this
- Update all `SectionHeader num={}` values to match the new sequential order

### Renumbering Map (TOC order → new SectionHeader num)

```text
Super B: 6=Bonds, 7=Crypto, 8=Portfolio, 9=Analysis, 10=RealEstate (was 30)
Super C: 11=TA (was 10), 12=Derivatives (was 11), 13=Formulas (was 12)
Super D: 14=Microstructure (was 13), 15=Behavioral (was 14), 16=Macro (was 15), 17=Quant (was 16)
Super E: 18=CorpFin (was 17), 19=Accounting (was 18), 20=IntlFin (was 19), 21=FixedIncome (was 20), 22=ESG (was 21), 23=Regulation (was 22), 24=TaxOpt (was 31)
Super F: 25=Valuation (was 23), 26=AltAdvanced (was 24), 27=History (was 25), 28=PersonalFin (was 26), 29=Econometrics (was 27), 30=MonetaryPolicy (was 28), 31=Fintech (was 29)
```

