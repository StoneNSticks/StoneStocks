

## Plan: Rebuild Glossary Search & Fix Learn Page

### 1. Completely New Glossary Search System (`src/pages/GlossaryPage.tsx`)

Rewrite from scratch with these features:

**Fuzzy/Tolerant Search Engine:**
- Implement Levenshtein distance-based fuzzy matching (tolerate 1-2 typos)
- Substring matching across term + definition
- Score-based ranking: exact match > starts-with > substring in term > substring in definition > fuzzy match
- Synonym awareness: map common abbreviations (KGV <-> P/E, EPS <-> Gewinn pro Aktie, etc.)

**Letter Filter (fixed):**
- Completely separate state management: letter filter and search are independent modes
- Clicking a letter always clears search and filters to that letter
- Typing in search always clears the letter filter
- "All" button resets both

**Search Suggestions/Autocomplete:**
- Show top 5 matching terms as dropdown suggestions while typing
- Click suggestion to scroll to that term

**Highlight:**
- Simple string split approach (no regex `g` flag issues)

**UI:**
- Result count display
- Clear filters button
- Debounced search input (300ms)

### 2. Fix Learn Page Missing Translations (`src/i18n/learnTranslations.ts`)

Add all missing translation keys with proper DE/EN content:

**Section 7 (Crypto & Alternatives) -- ~20 missing keys:**
- `learn.cryptoTypes`, `learn.cryptoBtc`, `learn.cryptoBtcDesc`, `learn.cryptoEth`, `learn.cryptoEthDesc`, `learn.cryptoAlt`, `learn.cryptoAltDesc`, `learn.cryptoStable`, `learn.cryptoStableDesc`
- `learn.commoditiesTitle`, `learn.commoditiesP1`, `learn.commoditiesP2`
- `learn.altInvestTitle`, `learn.altP2P`, `learn.altP2PDesc`, `learn.altPE`, `learn.altPEDesc`, `learn.altCollectibles`, `learn.altCollectiblesDesc`

**Section 8 (Portfolio Management) -- ~12 missing keys:**
- `learn.assetAllocTitle`, `learn.assetAllocP1`, `learn.assetAllocModels`
- `learn.model6040`, `learn.model6040Desc`, `learn.modelAge`, `learn.modelAgeDesc`, `learn.modelAllWeather`, `learn.modelAllWeatherDesc`
- `learn.rebalancingP2`, `learn.mptPracticalTitle`, `learn.mptPracticalP1`, `learn.riskParityTitle`, `learn.riskParityP1`

### 3. Fix Learn Page Section Numbering (`src/pages/LearnPage.tsx`)

Current `SectionHeader num=` values are off by 1 starting from Section C:

```text
Current → Correct (matching TOC):
Section C:  num={11} → 11, num={12} → 12, num={13} → 13  (OK - these are correct!)
Section D:  num={14} → 14, num={15} → 15, num={16} → 16, num={17} → 17  (OK)
Section E:  num={18} → 18, num={19} → 19, num={20} → 20, num={21} → 21, num={22} → 22, num={23} → 23, num={24} → 24  (OK)
Section F:  num={25} → 25, num={26} → 26, num={27} → 27, num={28} → 28, num={29} → 29, num={30} → 30, num={31} → 31  (OK)
```

Wait -- the actual issue is: the SectionHeader nums ARE sequential (1-31), but the **TOC labels** use `learn.toc30` which contains "30. Immobilien-Investing" as hardcoded text. The TOC auto-numbers via `globalOffset + ii + 1`, so position 5 in group B shows "10" but the label text itself says "30.". Fix: update `learn.toc30` to say "10. Immobilien-Investing" and `learn.toc31` to say "24. Steueroptimierung" and `learn.toc29` to say "31. Fintech".

Actually the TOC rendering shows `globalOffset + ii + 1` as the number prefix, but the label ALSO contains a number like "30.". So either remove numbers from labels or fix them.

### 4. Fix TOC Label Numbers (`src/i18n/learnTranslationsExtended.ts`)

The TOC labels contain hardcoded numbers that conflict with the auto-numbering:
- `learn.toc29`: "29. Fintech..." should be "Fintech & Digitale Finanzen" (no number)  
- `learn.toc30`: "30. Immobilien..." should be "Immobilien-Investing" (no number)
- `learn.toc31`: "31. Steueroptimierung" should be "Steueroptimierung" (no number)

Actually, looking at the base translations, ALL toc entries have numbers ("1. Grundlagen", "2. Aktien & ETFs", etc.). So the numbers in the labels match the original section numbering, not the repositioned numbering. Since sections 29/30/31 were moved to positions 10/24/31 respectively, the label numbers are wrong.

**Fix:** Update toc30 to "Immobilien-Investing" (position 10), toc31 to "Steueroptimierung" (position 24), toc29 to "Fintech & Digitale Finanzen" (position 31) -- but remove all hardcoded numbers from ALL toc labels since the TOC auto-numbers them.

### Files to Change

1. **`src/pages/GlossaryPage.tsx`** -- Complete rewrite of search system
2. **`src/i18n/learnTranslations.ts`** -- Add ~30 missing translation keys for sections 7 & 8
3. **`src/i18n/learnTranslationsExtended.ts`** -- Fix toc29/30/31 label numbers
4. **`src/pages/LearnPage.tsx`** -- Verify SectionHeader nums are correct (may need no changes if already sequential)

