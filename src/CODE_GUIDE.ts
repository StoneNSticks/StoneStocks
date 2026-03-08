/**
 * ╔════════════════════════════════════════════════════════════════════════╗
 * ║                    STONESTOCKS — CODE GUIDE                          ║
 * ║            A Complete Map of Every Component & File                  ║
 * ╚════════════════════════════════════════════════════════════════════════╝
 * 
 * This file explains WHERE everything is and WHAT it does.
 * If you don't understand code, this is your starting point.
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * 1. PROJECT STRUCTURE — How folders are organized
 * 2. PAGES — Each screen/view the user sees
 * 3. COMPONENTS — Reusable building blocks
 * 4. HOOKS — Shared logic (data fetching, state management)
 * 5. CONTEXTS — Global state shared across the entire app
 * 6. BACKEND — Server-side functions and database
 * 7. STYLING — How colors, fonts, and themes work
 * 8. DATA FLOW — How data moves from API → Screen
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * 1. PROJECT STRUCTURE
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * src/                        → All frontend source code lives here
 * ├── pages/                  → Full-page screens (each URL = one file here)
 * ├── components/             → Smaller reusable pieces that pages use
 * │   ├── ui/                 → Basic UI elements (buttons, cards, inputs)
 * │   └── learn/              → Educational content components
 * ├── hooks/                  → Shared logic functions (data fetching, etc.)
 * ├── contexts/               → Global state (language, currency, auth)
 * ├── lib/                    → Utility functions (formatting, API calls)
 * ├── i18n/                   → Translation files for multiple languages
 * └── integrations/supabase/  → Database connection (auto-generated, don't edit!)
 * 
 * supabase/                   → Backend code
 * ├── functions/              → Server-side functions (API proxy, notifications)
 * └── config.toml             → Backend configuration (auto-generated)
 * 
 * public/                     → Static files (icons, offline page, manifest)
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * 2. PAGES — Each screen the user can visit
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * File: src/pages/Index.tsx
 * URL: / (homepage)
 * WHAT: Main dashboard showing market overview, top stocks, gainers/losers,
 *       market news, hidden gems, sector performance, and commodities.
 * 
 * File: src/pages/StockDetail.tsx
 * URL: /stock/:symbol (e.g., /stock/AAPL)
 * WHAT: Everything about one stock — price chart, financial charts (revenue,
 *       profit, etc.), analyst consensus gauge, company intelligence,
 *       peer comparison, insider trades, earnings calendar, comments.
 * 
 * File: src/pages/AuthPage.tsx
 * URL: /auth
 * WHAT: Login and registration page. Supports username or email login.
 * 
 * File: src/pages/WatchlistPage.tsx
 * URL: /watchlist
 * WHAT: User's saved stocks with live prices, sparkline charts, groups,
 *       notes, export to CSV, and earnings calendar for watchlist stocks.
 * 
 * File: src/pages/PortfolioPage.tsx
 * URL: /portfolio
 * WHAT: Track actual stock positions (shares owned, average cost, P&L).
 * 
 * File: src/pages/NewsPage.tsx
 * URL: /news
 * WHAT: Full-page market news feed from multiple sources.
 * 
 * File: src/pages/RankingsPage.tsx
 * URL: /rankings
 * WHAT: Stock rankings by various criteria.
 * 
 * File: src/pages/CalculatorPage.tsx
 * URL: /calculators
 * WHAT: Financial calculators (compound interest, portfolio growth,
 *       dividend growth, FIRE calculator, position sizing).
 * 
 * File: src/pages/LearnPage.tsx
 * URL: /learn
 * WHAT: Educational content about investing — stocks, bonds, options,
 *       derivatives, risk management. Includes quizzes.
 * 
 * File: src/pages/MarketSentimentPage.tsx
 * URL: /sentiment
 * WHAT: Market sentiment/pulse overview.
 * 
 * File: src/pages/ScreenerPage.tsx
 * URL: /screener
 * WHAT: Stock screener with filters.
 * 
 * File: src/pages/ComparePage.tsx
 * URL: /compare
 * WHAT: Compare multiple stocks side by side.
 * 
 * File: src/pages/GlossaryPage.tsx
 * URL: /glossary
 * WHAT: Financial terms dictionary.
 * 
 * File: src/pages/ProfilePage.tsx
 * URL: /profile
 * WHAT: User profile management.
 * 
 * File: src/pages/SettingsPage.tsx
 * URL: /settings
 * WHAT: App settings (theme, notifications, etc.).
 * 
 * File: src/pages/AdminPage.tsx
 * URL: /admin
 * WHAT: Admin dashboard (only for admin role users).
 * 
 * File: src/pages/IndexDetail.tsx
 * URL: /index/:symbol
 * WHAT: Detail page for market indices (S&P 500, NASDAQ, etc.).
 * 
 * File: src/pages/CommodityDetail.tsx
 * URL: /commodity/:symbol
 * WHAT: Detail page for commodities (Gold, Oil, etc.).
 * 
 * File: src/pages/SharedWatchlistPage.tsx
 * URL: /shared-watchlist
 * WHAT: Public read-only view of a shared watchlist.
 * 
 * File: src/pages/ResetPasswordPage.tsx
 * URL: /reset-password
 * WHAT: Password reset form.
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * 3. COMPONENTS — Building blocks used by pages
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * ── NAVIGATION & LAYOUT ──
 * 
 * Header.tsx          → Top navigation bar (logo, menu, search, toggles, user dropdown)
 * BottomNav.tsx       → Mobile bottom tab bar for quick navigation
 * Footer.tsx          → Page footer with links and credits
 * SearchBar.tsx       → Stock search input with autocomplete results
 * NavLink.tsx         → Individual navigation link component
 * BackToTop.tsx       → Floating button to scroll back to top
 * 
 * ── STOCK DATA DISPLAY ──
 * 
 * StockChart.tsx      → Interactive price chart with time period selector (1D-5Y)
 * MetricsGrid.tsx     → Grid of key financial metrics (P/E, Market Cap, EPS, etc.)
 * MetricBars.tsx      → Visual range bars for metrics (P/E range, RSI, margins)
 * WeekRangeBar.tsx    → 52-week price range indicator with current position
 * StockPerformance.tsx → Performance summary (day/52-week ranges, beta, target price)
 * KeyMetrics.tsx      → Detailed key metrics list
 * FinancialChart.tsx  → Reusable bar/area chart for financial data (revenue, income, etc.)
 * NormalizedChart.tsx → Normalized comparison chart
 * 
 * ── ANALYST & SENTIMENT ──
 * 
 * AnalystConsensus.tsx → Unified analyst view: consensus gauge + price targets +
 *                        rating breakdown + 12-month trend chart
 * RecommendationChart.tsx → (Legacy) Stacked bar chart of analyst recommendations
 * AnalystTargets.tsx   → (Legacy) Price target bar
 * SentimentGauge.tsx   → Visual gauge for sentiment scores
 * SentimentVote.tsx    → Community voting (bullish/bearish) for individual stocks
 * 
 * ── COMPANY INFORMATION ──
 * 
 * CompanyInfoCard.tsx     → Basic company info (sector, industry, description)
 * CompanyIntelligence.tsx → Deep company analysis: products, risk score,
 *                           market position, key relationships
 * PeerComparison.tsx      → Side-by-side comparison table vs peer companies
 * PeersList.tsx           → List of similar/related stocks
 * InsiderTrades.tsx       → Recent insider buy/sell transactions
 * 
 * ── EARNINGS & DIVIDENDS ──
 * 
 * EarningsCalendar.tsx → Upcoming earnings dates for watchlist stocks
 * EarningsCard.tsx     → Historical earnings (actual vs estimated EPS)
 * DividendGrowth.tsx   → Annual dividend chart with CAGR and growth forecast
 * 
 * ── MARKET OVERVIEW (Homepage) ──
 * 
 * MarketOverview.tsx      → Market indices overview (S&P 500, NASDAQ, etc.)
 * MarketHeatmap.tsx       → Interactive treemap of stocks by sector & performance
 * TopCompanies.tsx        → Largest companies by market cap
 * GainersLosers.tsx       → Daily top winners and losers
 * MostActive.tsx          → Most traded stocks by volume
 * HiddenGems.tsx          → Undervalued stocks with strong buy ratings
 * SectorPerformance.tsx   → Performance by sector
 * CommoditiesSection.tsx  → Commodity prices overview
 * MarketNewsSection.tsx   → Latest market news preview
 * MarketClock.tsx         → Live market hours display (NYSE, LSE, JPX)
 * 
 * ── USER FEATURES ──
 * 
 * WatchlistStar.tsx      → Star icon to add/remove stocks from watchlist
 * PriceAlertForm.tsx     → Set price alerts for stocks
 * AlertNotifications.tsx → Check and display triggered price alerts
 * StockComments.tsx      → User comments/discussion on stock pages
 * NotificationBell.tsx   → Push notification toggle in header
 * EarningsNotificationProvider.tsx → Checks for upcoming earnings on app load
 * 
 * ── SETTINGS & TOGGLES ──
 * 
 * ThemeToggle.tsx    → Dark/light mode switch
 * CurrencyToggle.tsx → USD/EUR currency selector
 * LanguageToggle.tsx → German/English language selector
 * 
 * ── ONBOARDING & PWA ──
 * 
 * OnboardingModal.tsx → First-time user guide/walkthrough
 * InstallPrompt.tsx   → PWA install prompt for mobile users
 * ErrorBoundary.tsx   → Catches errors and shows fallback UI
 * 
 * ── EDUCATIONAL ──
 * 
 * learn/LearnComponents.tsx → Educational content blocks (articles, examples)
 * learn/QuizSection.tsx     → Interactive finance quizzes
 * learn/ReadingProgress.tsx  → Reading progress indicator
 * 
 * ── UI COMPONENTS (src/components/ui/) ──
 * These are basic, reusable UI elements from the shadcn/ui library:
 * button, card, input, dialog, dropdown-menu, tabs, badge, skeleton,
 * toast, tooltip, accordion, select, popover, etc.
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * 4. HOOKS — Shared logic (in src/hooks/)
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * useStockData.ts           → All data fetching hooks (useQuote, useProfile,
 *                              useFullStock, useMarketNews, etc.)
 *                              Each hook wraps a React Query call to the API.
 * 
 * useWatchlist.ts            → CRUD operations for the user's watchlist
 *                              (add/remove/update stocks, stored in database)
 * 
 * useEarningsNotifications.ts → Push notification subscription + in-app
 *                               earnings reminder checks
 * 
 * useAlertChecker.ts         → Checks if price alerts have been triggered
 * 
 * useKeyboardShortcuts.ts    → Global keyboard shortcuts (/ for search, etc.)
 * 
 * useUserRole.ts             → Check user's role (admin, moderator, user)
 * 
 * use-mobile.tsx             → Detect if user is on mobile device
 * 
 * use-toast.ts               → Toast notification system
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * 5. CONTEXTS — Global state (in src/contexts/)
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * AuthContext.tsx     → User authentication state (logged in/out, user data)
 *                       Provides: user, signIn, signUp, signOut, resetPassword
 *                       Used everywhere that needs to know if user is logged in.
 * 
 * CurrencyContext.tsx → Currency selection (USD or EUR) with live exchange rates
 *                       Provides: currency, convert(usdAmount), symbol ($|€), rate
 *                       Used by all components that display prices.
 * 
 * LanguageContext.tsx → Language selection (German or English) with all translations
 *                       Provides: lang, t(translationKey)
 *                       Contains 300+ translation entries for the entire app.
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * 6. BACKEND — Server-side code
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * supabase/functions/stock-data/index.ts
 *   → THE MAIN API PROXY. All stock data flows through here.
 *   → Receives requests from the frontend with an "action" parameter
 *   → Fetches data from external APIs (Finnhub, Alpha Vantage, Polygon, etc.)
 *   → Caches responses in the database to avoid hitting API rate limits
 *   → Implements fallback chains: if one API fails, tries the next
 *   → Actions include: quote, profile, overview, news, peers, earnings,
 *     market_news, gainers_losers, most_active, top_companies, etc.
 * 
 * supabase/functions/notifications/index.ts
 *   → PUSH NOTIFICATION SYSTEM
 *   → Generates VAPID keys for Web Push
 *   → Manages push subscriptions (subscribe/unsubscribe)
 *   → Sends earnings reminder notifications via cron job
 *   → Runs daily at 18:00 UTC to check for tomorrow's earnings
 * 
 * DATABASE TABLES:
 *   → watchlist:              User's saved stocks
 *   → portfolio_positions:    User's actual stock holdings
 *   → price_alerts:           Price target alerts
 *   → stock_comments:         User comments on stock pages
 *   → stock_votes:            Bullish/bearish sentiment votes
 *   → profiles:               User profile data (username, display name)
 *   → user_roles:             Role-based access (admin, moderator, user)
 *   → api_cache:              Cached API responses to save API calls
 *   → push_subscriptions:     Web Push notification subscriptions
 *   → earnings_notifications: Tracks which earnings reminders were sent
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * 7. STYLING — Colors, fonts, themes
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * src/index.css        → Defines all color tokens (--background, --primary, etc.)
 *                         Contains both light and dark theme colors.
 *                         Uses HSL color format for flexibility.
 * 
 * tailwind.config.ts   → Maps CSS tokens to Tailwind classes
 *                         (e.g., bg-primary, text-foreground, border-border)
 * 
 * RULE: Never hardcode colors in components. Always use semantic tokens
 *       like "text-primary", "bg-card", "border-border".
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * 8. DATA FLOW — How stock data gets from API to your screen
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Step 1: User opens /stock/AAPL
 * Step 2: StockDetail.tsx calls useFullStock("AAPL")
 * Step 3: useFullStock (in useStockData.ts) calls getFullStock("AAPL")
 * Step 4: getFullStock (in stockApi.ts) makes HTTP request to:
 *          https://[project].supabase.co/functions/v1/stock-data?action=full&symbol=AAPL
 * Step 5: Edge function (stock-data/index.ts) receives request
 * Step 6: Checks cache → if cached data exists and isn't expired, returns it
 * Step 7: If not cached, calls external APIs (Finnhub, Polygon, Alpha Vantage)
 * Step 8: Combines data from multiple sources, caches it, returns JSON
 * Step 9: Frontend receives data, components render it with currency conversion
 * 
 * CACHING:
 * - Quote data: cached 5 minutes (changes often)
 * - Profile data: cached 7 days (rarely changes)
 * - News: cached 30 minutes
 * - Financial data: cached 24 hours to 7 days
 * 
 * API SOURCES:
 * - Finnhub:        Real-time quotes, recommendations, earnings, news, peers
 * - Alpha Vantage:  Company overview, fundamentals, search
 * - Polygon.io:     Financials, ticker details, dividends, splits, aggregates
 * - Twelve Data:    Time series data, technicals
 * - Eulerpool:      European company data
 * - SimFin:         Financial statements
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * KEY FILES TO KNOW
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * src/App.tsx              → The app's entry point. Defines all routes and
 *                             wraps everything in providers (auth, language, etc.)
 * 
 * src/lib/stockApi.ts      → All API call functions. Each function makes one
 *                             type of request to the backend.
 * 
 * src/lib/formatters.ts    → Number/currency/percent formatting utilities.
 * 
 * src/lib/utils.ts         → General utility functions (cn for class merging).
 * 
 * src/main.tsx             → React app bootstrap (renders App into the page).
 * 
 * index.html               → The HTML shell that loads the React app.
 * 
 * vite.config.ts           → Build tool configuration (PWA, aliases, dev server).
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * DO NOT EDIT THESE FILES (auto-generated):
 * ═══════════════════════════════════════════════════════════════════════
 * - src/integrations/supabase/client.ts (database connection)
 * - src/integrations/supabase/types.ts  (database type definitions)
 * - supabase/config.toml                (backend configuration)
 * - .env                                (environment variables)
 */

// This file is documentation only — it is not imported anywhere.
// It exists as a reference guide for understanding the codebase.
export {};
