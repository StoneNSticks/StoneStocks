
# Responsive Design: Mobile, Tablet & Desktop

## Goal
Make the app look great on phones, tablets, and desktops without changing anything about the current desktop experience. All changes use Tailwind responsive breakpoints (`sm:`, `md:`, `lg:`) so desktop stays identical.

## Changes

### 1. Mobile Hamburger Menu (Header)
- Below `md` (768px): hide nav links, MarketClock, CurrencyToggle behind a hamburger menu icon
- Tapping it opens a Sheet (slide-in panel) with all nav items and controls stacked vertically
- Above `md`: everything stays exactly as it is now
- The logo and ThemeToggle remain always visible

### 2. Stock Detail Page
- Company header card: on mobile, stack logo/name and industry/website badges vertically instead of side-by-side
- Loading skeleton grid: change fixed `grid-cols-4` to `grid-cols-2 sm:grid-cols-4` so it doesn't squish on small screens

### 3. Index Detail Page
- Price display: scale from `text-2xl` on mobile up to `text-4xl` on desktop
- Price + change row: stack vertically on mobile instead of horizontal `flex items-end gap-4`

### 4. Calculator Page
- Result summary cards (grid-cols-3): change to `grid-cols-1 sm:grid-cols-3` on mobile so cards stack

### 5. MarketClock Dropdown
- Add `right-0` positioning constraint and `max-w-[calc(100vw-2rem)]` so the dropdown doesn't overflow the viewport on small screens

### 6. Container Padding
- Reduce container side padding on mobile from `2rem` to `1rem` via Tailwind config for more breathing room

---

## Technical Details

**Files to modify:**
- `src/components/Header.tsx` -- hamburger menu using existing Sheet component, hide nav/tools on mobile with `hidden md:flex`, show hamburger with `md:hidden`
- `src/pages/StockDetail.tsx` -- responsive flex-wrap on company header, skeleton grid cols
- `src/pages/IndexDetail.tsx` -- responsive text size and flex direction for price area
- `src/pages/CalculatorPage.tsx` -- responsive grid-cols on result cards
- `src/components/MarketClock.tsx` -- dropdown max-width constraint
- `tailwind.config.ts` -- container padding `1rem` on mobile, `2rem` on desktop

**No new dependencies needed** -- uses existing Sheet component and Tailwind responsive classes.

**Desktop is completely unaffected** -- every change is gated behind `sm:`, `md:`, or `lg:` prefixes that only apply to smaller screens.
