# Health Check: Fixes and Improvements

A pass over the whole app looking at security, cost/abuse risk, dead code, and UI quality. Findings below are grouped by priority; each item is small and independent, so you can drop any of them.

## 1. Backend abuse and cost protection (highest value)

The AI-backed backend functions (`ai-recommendations`, `ai-stock-summary`, `news-sentiment`, `stock-chat`) are reachable without any authentication and have no per-user throttling. Anyone who finds the endpoint can burn AI credits and third-party API quota.

Planned:
- Require a signed-in user for the AI functions (read the caller's token, reject anonymous calls). `stock-data` stays public since the homepage needs it before login.
- Add a lightweight per-user/per-IP rate limit (in-memory sliding window per function instance) with a clear 429 response, and surface a friendly message in the UI instead of a generic error.
- Restrict CORS from `*` to the app's own origins.

## 2. Profile privacy

The remaining scanner warning: any signed-in user can read every row of `profiles`, including the `email` column. Planned fix: keep row access but stop exposing emails to other users — a public-safe view/policy that returns only username, display name, and avatar to other users, while a user can still read their own full row. Login by username keeps working through the existing lookup function.

## 3. Dead code removal

These pages are no longer routed but still ship in the repo and confuse future work: `PolymarketIntelligencePage`, `PredictionsPage`, `CryptoPage`, `ForexPage`, `BondsPage`, `CustomDashboard`, `ScreenerPage`, `FloatingChat`, plus `usePolymarket` / `polymarketApi` / the `polymarket-proxy` function. Planned: delete them (Polymarket stays gone per your earlier decision). If you would rather keep them parked, say so and I will skip this section.

## 4. UI and layout quality

- Company logos across watchlist, portfolio, screener, news, and stock detail have no reserved dimensions, so rows shift as logos load. Add explicit sizing/aspect ratio and a consistent fallback placeholder instead of `display:none` on error.
- Unify the image error handling into one small `CompanyLogo` component so every list looks the same.
- Accessibility pass on the most-used screens: labels on icon-only buttons, focus-visible rings, and heading order.

## 5. Maintainability

`LearnPage.tsx` (80K) and `CalculatorPage.tsx` (70K) are single files holding all sections. Planned: split the lesson sections and calculator tabs into per-section modules under `src/components/learn/` and `src/components/calculators/`, with no behaviour change. This also removes the recurring class of numbering/translation bugs by keeping each lesson self-contained.

## Technical notes

- Auth check pattern in functions: read `Authorization`, call `auth.getUser()` with the caller token, 401 on failure; keep `verify_jwt = false` only where the function does its own check or is intentionally public.
- Rate limiting: `Map<key, timestamps[]>` per isolate, 429 with `Retry-After`; not perfect across isolates but stops casual abuse.
- Profiles: replace the broad authenticated SELECT policy with an owner-only policy plus a restricted public-facing view exposing non-email columns, and grant on the view.
- Dead-code removal touches only files with no inbound imports; verified against current routes in `src/App.tsx`.

## Suggested order

1 → 2 → 3 → 4 → 5. Sections 1 and 2 are the ones that actually matter for a public repo and live app.
