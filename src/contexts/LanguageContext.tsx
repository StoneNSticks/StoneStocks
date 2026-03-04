import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import { learnTranslations } from "@/i18n/learnTranslations";

export type Language = "de" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}

export function useT() {
  return useLanguage().t;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved === "en" || saved === "de") ? saved : "de";
  });

  const handleSetLang = useCallback((l: Language) => {
    setLang(l);
    localStorage.setItem("app_lang", l);
  }, []);

  const t = useCallback((key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry["en"] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── All translations ───────────────────────────────────────────────
const translations: Record<string, Record<Language, string>> = {
  // ── Nav & Header ──
  "nav.markets": { de: "Märkte", en: "Markets" },
  "nav.news": { de: "Nachrichten", en: "News" },
  "nav.rankings": { de: "Rankings", en: "Rankings" },
  "nav.tools": { de: "Rechner", en: "Tools" },
  "nav.watchlist": { de: "Watchlist", en: "Watchlist" },
  "nav.learn": { de: "Finanzwissen", en: "Financial Knowledge" },
  "nav.login": { de: "Anmelden", en: "Login" },
  "nav.logout": { de: "Abmelden", en: "Logout" },
  "nav.profile": { de: "Profil", en: "Profile" },
  "nav.settings": { de: "Einstellungen", en: "Settings" },

  // ── Index / Main Page ──
  "index.title": { de: "Aktienmarkt", en: "Stock Market" },
  "index.titleHighlight": { de: "Überblick", en: "Overview" },
  "index.subtitle": { de: "Echtzeitkurse, Nachrichten und Marktdaten", en: "Real-time quotes, news, and market data" },
  "index.footer": { de: "Daten: Finnhub, Alpha Vantage, Twelve Data, Polygon, Eulerpool, SimFin", en: "Data: Finnhub, Alpha Vantage, Twelve Data, Polygon, Eulerpool, SimFin" },

  // ── TopCompanies ──
  "top.title": { de: "Top Unternehmen", en: "Top Companies" },
  "top.byMarketCap": { de: "nach Marktkapitalisierung", en: "by market cap" },

  // ── GainersLosers ──
  "gl.title": { de: "Gewinner & Verlierer", en: "Winners & Losers" },
  "gl.winners": { de: "Gewinner", en: "Winners" },
  "gl.losers": { de: "Verlierer", en: "Losers" },
  "gl.loading": { de: "Marktdaten werden geladen…", en: "Market data loading…" },

  // ── MostActive ──
  "active.title": { de: "Meistgehandelt", en: "Most Traded" },
  "active.loading": { de: "Volumendaten werden geladen…", en: "Volume data loading…" },

  // ── HiddenGems ──
  "gems.title": { de: "Geheimtipps", en: "Hidden Gems" },
  "gems.subtitle": { de: "Starke Kaufempfehlung mit Momentum", en: "Strong buy consensus with momentum" },

  // ── MarketNewsSection ──
  "news.title": { de: "Marktnachrichten", en: "Market News" },
  "news.viewAll": { de: "Alle anzeigen →", en: "View all →" },

  // ── SearchBar ──
  "search.placeholder": { de: "Aktien suchen…", en: "Search stocks..." },
  "search.placeholderFull": { de: "Aktien, ETFs, Indizes suchen…", en: "Search stocks, ETFs, indices..." },
  "search.recent": { de: "Letzte Suchen", en: "Recent searches" },
  "search.clear": { de: "Löschen", en: "Clear" },
  "search.searching": { de: "Suche…", en: "Searching..." },
  "search.noResults": { de: "Keine Ergebnisse gefunden", en: "No results found" },

  // ── CompanyInfoCard ──
  "info.sector": { de: "Sektor", en: "Sector" },
  "info.industry": { de: "Branche", en: "Industry" },
  "info.country": { de: "Land", en: "Country" },
  "info.employees": { de: "Mitarbeiter", en: "Employees" },
  "info.ipoDate": { de: "IPO-Datum", en: "IPO Date" },
  "info.currency": { de: "Währung", en: "Currency" },
  "info.exchange": { de: "Börse", en: "Stock Exchange" },
  "info.description": { de: "Beschreibung", en: "Description" },
  "info.us": { de: "Vereinigte Staaten", en: "United States" },
  "info.de": { de: "Deutschland", en: "Germany" },
  "info.jp": { de: "Japan", en: "Japan" },
  "info.cn": { de: "China", en: "China" },
  "info.gb": { de: "Vereinigtes Königreich", en: "United Kingdom" },
  "info.tw": { de: "Taiwan", en: "Taiwan" },
  "info.kr": { de: "Südkorea", en: "South Korea" },
  "info.fr": { de: "Frankreich", en: "France" },
  "info.ca": { de: "Kanada", en: "Canada" },
  "info.nl": { de: "Niederlande", en: "Netherlands" },
  "info.ch": { de: "Schweiz", en: "Switzerland" },

  // ── StockPerformance ──
  "perf.title": { de: "Performance & Spanne", en: "Performance & Range" },
  "perf.dayRange": { de: "Tagesspanne", en: "Day Range" },
  "perf.weekRange": { de: "52-Wochen-Spanne", en: "52-Week Range" },
  "perf.fromLow": { de: "vom Tief", en: "from low" },
  "perf.fromHigh": { de: "vom Hoch", en: "from high" },
  "perf.dayChange": { de: "Tagesänderung", en: "Day Change" },
  "perf.beta": { de: "Beta", en: "Beta" },
  "perf.targetPrice": { de: "Kursziel", en: "Target Price" },
  "perf.upside": { de: "Potenzial", en: "Upside" },

  // ── RecommendationChart ──
  "rec.title": { de: "Analysten-Konsens", en: "Analyst Consensus" },
  "rec.strongBuy": { de: "Starker Kauf", en: "Strong Buy" },
  "rec.buy": { de: "Kauf", en: "Buy" },
  "rec.hold": { de: "Halten", en: "Hold" },
  "rec.sell": { de: "Verkauf", en: "Sell" },
  "rec.strongSell": { de: "Starker Verkauf", en: "Strong Sell" },
  "rec.score": { de: "Bewertung", en: "Score" },
  "rec.analysts": { de: "Analysten", en: "analysts" },
  "rec.bullish": { de: "Bullisch", en: "Bullish" },
  "rec.bearish": { de: "Bärisch", en: "Bearish" },
  "rec.history": { de: "12-Monats-Verlauf", en: "12-Month History" },
  "rec.showBreakdown": { de: "Monatliche Aufschlüsselung anzeigen", en: "Show monthly breakdown" },
  "rec.hideBreakdown": { de: "Monatliche Aufschlüsselung ausblenden", en: "Hide monthly breakdown" },

  // ── NewsList ──
  "newsList.title": { de: "Nachrichten", en: "News" },
  "newsList.latest": { de: "Aktuelle Nachrichten", en: "Latest News" },
  "newsList.none": { de: "Keine aktuellen Nachrichten verfügbar.", en: "No recent news available." },

  // ── PeersList ──
  "peers.title": { de: "Ähnliche Aktien", en: "Similar Stocks" },

  // ── MarketClock ──
  "clock.title": { de: "Börsenzeiten", en: "Market Hours" },
  "clock.yourTime": { de: "Deine Zeit", en: "Your time" },
  "clock.open": { de: "Offen", en: "Open" },
  "clock.closed": { de: "Geschlossen", en: "Closed" },
  "clock.closesIn": { de: "schließt in", en: "closes in" },
  "clock.opensIn": { de: "öffnet in", en: "opens in" },
  "clock.local": { de: "Ortszeit", en: "local" },

  // ── StockChart ──
  "chart.title": { de: "Kursverlauf", en: "Price Chart" },
  "chart.noData": { de: "Keine Chartdaten verfügbar", en: "No chart data available" },
  "chart.close": { de: "Schluss", en: "Close" },

  // ── FinancialChart ──
  "fc.noData": { de: "Keine Daten verfügbar", en: "No data available" },

  // ── MetricsGrid ──
  "m.price": { de: "Kurs", en: "Price" },
  "m.megaCap": { de: "Mega Cap", en: "Mega Cap" },
  "m.largeCap": { de: "Large Cap", en: "Large Cap" },
  "m.midCap": { de: "Mid Cap", en: "Mid Cap" },
  "m.smallCap": { de: "Small Cap", en: "Small Cap" },
  "m.employees": { de: "Mitarbeiter", en: "Employees" },
  "m.eps": { de: "EPS", en: "EPS" },
  "m.beta": { de: "Beta", en: "Beta" },
  "m.pe": { de: "KGV", en: "P/E" },
  "m.pb": { de: "KBV", en: "P/B" },
  "m.ps": { de: "KUV", en: "P/S" },
  "m.pfcf": { de: "K/FCF", en: "P/FCF" },
  "m.evEbitda": { de: "EV/EBITDA", en: "EV/EBITDA" },
  "m.earningsYield": { de: "Gewinnrendite", en: "Earnings Yield" },
  "m.dividendYield": { de: "Dividendenrendite", en: "Dividend Yield" },
  "m.payoutRatio": { de: "Ausschüttungsquote", en: "Payout Ratio" },
  "m.fcfYield": { de: "FCF-Rendite", en: "FCF Yield" },
  "m.freeCashFlow": { de: "Freier Cashflow", en: "Free Cash Flow" },
  "m.revGrowth": { de: "Umsatzwachstum YoY", en: "Rev Growth YoY" },
  "m.operatingMargin": { de: "Operative Marge", en: "Operating Margin" },
  "m.profitMargin": { de: "Gewinnmarge", en: "Profit Margin" },
  "m.roe": { de: "EKR", en: "ROE" },
  "m.roa": { de: "GKR", en: "ROA" },
  "m.revenueTTM": { de: "Umsatz TTM", en: "Revenue TTM" },

  // ── StockDetail ──
  "sd.website": { de: "Webseite", en: "Website" },
  "sd.failedToLoad": { de: "Daten konnten nicht geladen werden für", en: "Failed to load data for" },
  "sd.revenue": { de: "Umsatz", en: "Revenue" },
  "sd.grossProfit": { de: "Bruttogewinn", en: "Gross Profit" },
  "sd.netIncome": { de: "Nettogewinn", en: "Net Income" },
  "sd.operatingIncome": { de: "Betriebsergebnis", en: "Operating Income" },
  "sd.ebitda": { de: "EBITDA", en: "EBITDA" },
  "sd.freeCashFlow": { de: "Freier Cashflow", en: "Free Cash Flow" },
  "sd.operatingCashFlow": { de: "Operativer Cashflow", en: "Operating Cash Flow" },
  "sd.epsDiluted": { de: "EPS (verwässert)", en: "EPS (Diluted)" },
  "sd.dividendPerShare": { de: "Dividende je Aktie", en: "Dividend per Share" },
  "sd.assetsLiabilities": { de: "Vermögen & Verbindlichkeiten", en: "Assets & Liabilities" },
  "sd.liabilities": { de: "Verbindlichkeiten", en: "Liabilities" },

  // ── IndexDetail ──
  "idx.back": { de: "Zurück zur Übersicht", en: "Back to Overview" },
  "idx.marketIndex": { de: "Marktindex", en: "Market Index" },
  "idx.pts": { de: "Pkt.", en: "pts" },
  "idx.chartProxy": { de: "Chart zeigt {etf} ETF als Proxy für {name}", en: "Chart shows {etf} ETF as proxy for {name} performance" },
  "idx.otherIndices": { de: "Weitere Marktindizes", en: "Other Market Indices" },
  "idx.notFound": { de: "Index {symbol} nicht gefunden.", en: "Index {symbol} not found." },

  // ── DividendGrowth ──
  "div.title": { de: "Dividendenwachstum", en: "Dividend Growth" },
  "div.yield": { de: "Rendite", en: "Yield" },
  "div.annualDividend": { de: "Jährl. Dividende", en: "Annual Dividend" },
  "div.growthForecast": { de: "Bei aktuellem Wachstum von {rate}% könnte die Dividende bis {year} ~${amount}/Aktie erreichen", en: "At current {rate}% growth rate, dividend could reach ~${amount}/share by {year}" },

  // ── Watchlist ──
  "watchlist.title": { de: "Meine Watchlist", en: "My Watchlist" },
  "watchlist.empty": { de: "Deine Watchlist ist leer", en: "Your watchlist is empty" },
  "watchlist.emptyHint": { de: "Klicke auf das ★-Symbol auf einer Aktienseite, um sie zu verfolgen.", en: "Click the ★ icon on any stock page to start tracking it." },
  "watchlist.tracking": { de: "Verfolge {count} Aktie(n)", en: "Tracking {count} stock(s)" },
  "watchlist.startTracking": { de: "Beginne deine Lieblingsaktien zu verfolgen", en: "Start tracking your favorite stocks" },
  "watchlist.signInTitle": { de: "Anmelden um Aktien zu verfolgen", en: "Sign in to track stocks" },
  "watchlist.signInDesc": { de: "Erstelle ein kostenloses Konto, um deine persönliche Watchlist zu erstellen.", en: "Create a free account to build your personal watchlist and never miss a move." },
  "watchlist.exploreMarkets": { de: "Märkte erkunden", en: "Explore Markets" },
  "watchlist.addToWatchlist": { de: "Zur Watchlist hinzufügen", en: "Add to Watchlist" },
  "watchlist.removeFromWatchlist": { de: "Aus Watchlist entfernen", en: "Remove from Watchlist" },
  "watchlist.loginForWatchlist": { de: "Einloggen für Watchlist", en: "Login for Watchlist" },

  // ── Auth ──
  "auth.signIn": { de: "Anmelden", en: "Sign In" },
  "auth.signUp": { de: "Registrieren", en: "Sign Up" },
  "auth.resetPassword": { de: "Passwort zurücksetzen", en: "Reset Password" },
  "auth.signInDesc": { de: "Melde dich an, um auf deine Watchlist zuzugreifen.", en: "Sign in to access your watchlist." },
  "auth.signUpDesc": { de: "Erstelle ein Konto für deine persönliche Watchlist.", en: "Create an account for your personal watchlist." },
  "auth.resetDesc": { de: "Gib deine E-Mail ein, um einen Reset-Link zu erhalten.", en: "Enter your email to receive a reset link." },
  "auth.emailOrUsername": { de: "E-Mail oder Benutzername", en: "Email or Username" },
  "auth.email": { de: "E-Mail", en: "Email" },
  "auth.emailOptional": { de: "E-Mail (optional)", en: "Email (optional)" },
  "auth.password": { de: "Passwort", en: "Password" },
  "auth.username": { de: "Benutzername", en: "Username" },
  "auth.usernameHint": { de: "Nur Buchstaben und Zahlen, max. 15 Zeichen.", en: "Letters and numbers only, max 15 characters." },
  "auth.forgotPassword": { de: "Passwort vergessen?", en: "Forgot password?" },
  "auth.noAccount": { de: "Noch kein Konto? Registrieren", en: "Don't have an account? Sign Up" },
  "auth.hasAccount": { de: "Bereits ein Konto? Anmelden", en: "Already have an account? Sign In" },
  "auth.backToSignIn": { de: "Zurück zur Anmeldung", en: "Back to Sign In" },
  "auth.sendLink": { de: "Link senden", en: "Send Link" },
  "auth.loading": { de: "Laden...", en: "Loading..." },
  "auth.resetSuccess": { de: "Passwort-Reset-E-Mail gesendet. Prüfe deinen Posteingang.", en: "Password reset email sent. Check your inbox." },
  "auth.signInSuccess": { de: "Erfolgreich angemeldet!", en: "Successfully signed in!" },
  "auth.signUpSuccess": { de: "Konto erfolgreich erstellt!", en: "Account created successfully!" },
  "auth.usernameRequired": { de: "Benutzername ist erforderlich.", en: "Username is required." },
  "auth.usernameTooShort": { de: "Benutzername muss mindestens 3 Zeichen lang sein.", en: "Username must be at least 3 characters." },

  // ── Reset Password Page ──
  "reset.title": { de: "Neues Passwort", en: "New Password" },
  "reset.desc": { de: "Gib dein neues Passwort ein.", en: "Enter your new password." },
  "reset.newPassword": { de: "Neues Passwort", en: "New Password" },
  "reset.submit": { de: "Passwort ändern", en: "Change Password" },
  "reset.success": { de: "Passwort erfolgreich geändert!", en: "Password changed successfully!" },
  "reset.invalidLink": { de: "Ungültiger Link", en: "Invalid Link" },
  "reset.invalidLinkDesc": { de: "Dieser Reset-Link ist ungültig oder abgelaufen.", en: "This reset link is invalid or expired." },

  // ── Calculator Page ──
  "calc.title": { de: "Finanzrechner", en: "Financial Calculators" },
  "calc.subtitle": { de: "Wichtige Werkzeuge für Investitionsplanung & Analyse", en: "Essential tools for investment planning & analysis" },
  "calc.portfolioGrowth": { de: "Portfolio-Wachstum", en: "Portfolio Growth" },
  "calc.compoundInterest": { de: "Zinseszins", en: "Compound Interest" },
  "calc.dividendGrowth": { de: "Dividendenwachstum", en: "Dividend Growth" },
  "calc.fireCalc": { de: "FIRE-Rechner", en: "FIRE Calculator" },
  "calc.positionSize": { de: "Positionsgröße", en: "Position Size" },
  "calc.initialInvestment": { de: "Anfangsinvestition", en: "Initial Investment" },
  "calc.monthlyContribution": { de: "Monatliche Einzahlung", en: "Monthly Contribution" },
  "calc.annualReturn": { de: "Jährliche Rendite (%)", en: "Annual Return (%)" },
  "calc.timeHorizon": { de: "Zeitraum (Jahre)", en: "Time Horizon (years)" },
  "calc.totalInvested": { de: "Gesamteinzahlung", en: "Total Invested" },
  "calc.portfolioValue": { de: "Portfoliowert", en: "Portfolio Value" },
  "calc.totalReturns": { de: "Gesamtrendite", en: "Total Returns" },
  "calc.principal": { de: "Kapital", en: "Principal" },
  "calc.annualRate": { de: "Jährlicher Zinssatz (%)", en: "Annual Rate (%)" },
  "calc.compoundingYear": { de: "Verzinsung/Jahr", en: "Compounding/year" },
  "calc.years": { de: "Jahre", en: "Years" },
  "calc.finalAmount": { de: "Endbetrag", en: "Final Amount" },
  "calc.totalInterest": { de: "Gesamtzinsen", en: "Total Interest" },
  "calc.sharePrice": { de: "Aktienkurs", en: "Share Price" },
  "calc.annualDividendShare": { de: "Jährl. Dividende/Aktie", en: "Annual Dividend/Share" },
  "calc.dividendGrowthRate": { de: "Dividendenwachstum (%)", en: "Dividend Growth (%)" },
  "calc.shares": { de: "Aktien", en: "Shares" },
  "calc.yieldOnCost": { de: "Rendite auf Kosten", en: "Yield on Cost" },
  "calc.annualIncome": { de: "Jährl. Einkommen", en: "Annual Income" },
  "calc.totalDividends": { de: "Gesamtdividenden", en: "Total Dividends" },
  "calc.annualExpenses": { de: "Jährliche Ausgaben", en: "Annual Expenses" },
  "calc.currentSavings": { de: "Aktuelles Erspartes", en: "Current Savings" },
  "calc.expectedReturn": { de: "Erwartete Rendite (%)", en: "Expected Return (%)" },
  "calc.withdrawalRate": { de: "Entnahmerate (%)", en: "Withdrawal Rate (%)" },
  "calc.fireNumber": { de: "FIRE-Zahl", en: "FIRE Number" },
  "calc.gap": { de: "Lücke", en: "Gap" },
  "calc.yearsToFire": { de: "Jahre bis FIRE", en: "Years to FIRE" },
  "calc.portfolioValueLabel": { de: "Portfoliowert", en: "Portfolio Value" },
  "calc.riskPerTrade": { de: "Risiko pro Trade (%)", en: "Risk per Trade (%)" },
  "calc.entryPrice": { de: "Einstiegskurs", en: "Entry Price" },
  "calc.stopLoss": { de: "Stop-Loss", en: "Stop Loss" },
  "calc.riskAmount": { de: "Risikobetrag", en: "Risk Amount" },
  "calc.sharesToBuy": { de: "Aktien kaufen", en: "Shares to Buy" },
  "calc.positionValue": { de: "Positionswert", en: "Position Value" },
  "calc.ofPortfolio": { de: "% des Portfolios", en: "% of Portfolio" },

  // ── Learn Page ──
  "learn.badge": { de: "Finanzwissen", en: "Financial Knowledge" },
  "learn.title": { de: "Alles über Finanzen & Investieren", en: "All About Finance & Investing" },
  "learn.subtitle": { de: "Vom Anfänger zum informierten Investor – hier findest du alles Wichtige über Finanzmärkte, Aktien, ETFs und Finanzprodukte.", en: "From beginner to informed investor – everything you need to know about financial markets, stocks, ETFs, and financial products." },
  "learn.toc": { de: "Inhaltsverzeichnis", en: "Table of Contents" },
  "learn.toc1": { de: "1. Grundlagen", en: "1. Basics" },
  "learn.toc2": { de: "2. Aktien & ETFs", en: "2. Stocks & ETFs" },
  "learn.toc3": { de: "3. Finanzprodukte", en: "3. Financial Products" },
  "learn.toc4": { de: "4. Strategien & Tipps", en: "4. Strategies & Tips" },
  "learn.toc5": { de: "5. Steuern & Kosten", en: "5. Taxes & Costs" },
  "learn.section1Title": { de: "Grundlagen der Finanzen", en: "Financial Basics" },
  "learn.marketsTitle": { de: "Was sind Finanzmärkte?", en: "What Are Financial Markets?" },
  "learn.marketsP1": { de: "Finanzmärkte sind Orte, an denen Käufer und Verkäufer Finanzinstrumente wie Aktien, Anleihen, Währungen und Rohstoffe handeln. Sie ermöglichen Unternehmen, Kapital aufzunehmen, und Investoren, ihr Vermögen zu vermehren.", en: "Financial markets are places where buyers and sellers trade financial instruments such as stocks, bonds, currencies, and commodities. They enable companies to raise capital and investors to grow their wealth." },
  "learn.marketsP2": { de: "Die wichtigsten Finanzmärkte sind <strong>Aktienmärkte</strong> (z. B. NYSE, NASDAQ, XETRA), <strong>Anleihemärkte</strong>, <strong>Devisenmärkte</strong> (Forex) und <strong>Rohstoffmärkte</strong>.", en: "The most important financial markets are <strong>stock markets</strong> (e.g. NYSE, NASDAQ, XETRA), <strong>bond markets</strong>, <strong>foreign exchange markets</strong> (Forex), and <strong>commodity markets</strong>." },
  "learn.marketsInfo": { de: "Die weltweiten Aktienmärkte haben zusammen eine Marktkapitalisierung von über 100 Billionen US-Dollar.", en: "The world's stock markets have a combined market capitalization of over $100 trillion." },
  "learn.basicsTitle": { de: "Grundbegriffe", en: "Key Terms" },
  "learn.term.marketCap": { de: "Marktkapitalisierung", en: "Market Capitalization" },
  "learn.term.marketCapDesc": { de: "Der Gesamtwert aller ausgegebenen Aktien eines Unternehmens (Aktienkurs × Anzahl Aktien).", en: "The total value of all outstanding shares of a company (share price × number of shares)." },
  "learn.term.dividend": { de: "Dividende", en: "Dividend" },
  "learn.term.dividendDesc": { de: "Eine regelmäßige Gewinnausschüttung eines Unternehmens an seine Aktionäre.", en: "A regular profit distribution from a company to its shareholders." },
  "learn.term.pe": { de: "KGV (Kurs-Gewinn-Verhältnis)", en: "P/E Ratio (Price-to-Earnings)" },
  "learn.term.peDesc": { de: "Zeigt, wie viel Investoren bereit sind, pro Euro Gewinn zu zahlen. Ein niedrigeres KGV kann auf eine günstigere Bewertung hindeuten.", en: "Shows how much investors are willing to pay per dollar of earnings. A lower P/E may indicate a cheaper valuation." },
  "learn.term.volatility": { de: "Volatilität", en: "Volatility" },
  "learn.term.volatilityDesc": { de: "Maß für die Schwankungsbreite eines Kurses. Hohe Volatilität = höheres Risiko, aber auch höhere Chancen.", en: "A measure of price fluctuation. High volatility = higher risk, but also higher potential returns." },
  "learn.term.liquidity": { de: "Liquidität", en: "Liquidity" },
  "learn.term.liquidityDesc": { de: "Wie leicht ein Wertpapier gekauft oder verkauft werden kann, ohne den Preis stark zu beeinflussen.", en: "How easily a security can be bought or sold without significantly affecting its price." },
  "learn.term.bullBear": { de: "Bull Market / Bear Market", en: "Bull Market / Bear Market" },
  "learn.term.bullBearDesc": { de: "Bull Market = steigende Kurse, Bear Market = fallende Kurse über einen längeren Zeitraum.", en: "Bull market = rising prices, bear market = falling prices over an extended period." },
  "learn.term.roe": { de: "Eigenkapitalrendite (ROE)", en: "Return on Equity (ROE)" },
  "learn.term.roeDesc": { de: "Zeigt, wie effizient ein Unternehmen das Eigenkapital der Aktionäre einsetzt, um Gewinne zu erzielen.", en: "Shows how efficiently a company uses shareholder equity to generate profits." },
  "learn.term.freeCashFlow": { de: "Freier Cashflow (FCF)", en: "Free Cash Flow (FCF)" },
  "learn.term.freeCashFlowDesc": { de: "Das Geld, das einem Unternehmen nach Abzug aller operativen Ausgaben und Investitionen zur Verfügung steht.", en: "The cash available to a company after deducting all operating expenses and capital expenditures." },
  "learn.riskTitle": { de: "Risiko & Diversifikation", en: "Risk & Diversification" },
  "learn.riskP1": { de: "<strong>Risiko</strong> beschreibt die Möglichkeit, dass eine Investition an Wert verliert. Verschiedene Anlagen haben unterschiedliche Risikoprofile.", en: "<strong>Risk</strong> describes the possibility that an investment loses value. Different assets have different risk profiles." },
  "learn.riskP2": { de: "<strong>Diversifikation</strong> ist die wichtigste Strategie zur Risikominimierung: Verteile dein Geld auf verschiedene Anlageklassen, Branchen und Regionen. So können Verluste in einem Bereich durch Gewinne in einem anderen ausgeglichen werden.", en: "<strong>Diversification</strong> is the most important strategy for minimizing risk: spread your money across different asset classes, sectors, and regions. Losses in one area can be offset by gains in another." },
  "learn.riskInfo": { de: "\"Lege nie alle Eier in einen Korb.\" – Eine breite Streuung reduziert das Gesamtrisiko deines Portfolios erheblich.", en: "\"Don't put all your eggs in one basket.\" – Broad diversification significantly reduces your portfolio's overall risk." },
  "learn.section2Title": { de: "Aktien & ETFs", en: "Stocks & ETFs" },
  "learn.stocksTitle": { de: "Was sind Aktien?", en: "What Are Stocks?" },
  "learn.stocksP1": { de: "Eine <strong>Aktie</strong> ist ein Anteil an einem Unternehmen. Wenn du eine Aktie kaufst, wirst du Miteigentümer und profitierst von Kursgewinnen und Dividenden.", en: "A <strong>stock</strong> is a share of ownership in a company. When you buy a stock, you become a co-owner and benefit from price gains and dividends." },
  "learn.stocksP2": { de: "Aktien werden an Börsen gehandelt. Der Preis wird durch Angebot und Nachfrage bestimmt und spiegelt die Erwartungen der Investoren an die zukünftige Entwicklung des Unternehmens wider.", en: "Stocks are traded on exchanges. The price is determined by supply and demand and reflects investors' expectations about the company's future performance." },
  "learn.stocksPros": { de: "Vorteile", en: "Advantages" },
  "learn.stocksPro1": { de: "Hohe potenzielle Renditen", en: "High potential returns" },
  "learn.stocksPro2": { de: "Dividendeneinkommen", en: "Dividend income" },
  "learn.stocksPro3": { de: "Mitspracherecht (Stimmrecht)", en: "Voting rights" },
  "learn.stocksPro4": { de: "Inflationsschutz", en: "Inflation protection" },
  "learn.stocksCons": { de: "Risiken", en: "Risks" },
  "learn.stocksCon1": { de: "Kursverluste möglich", en: "Price losses possible" },
  "learn.stocksCon2": { de: "Keine garantierte Rendite", en: "No guaranteed returns" },
  "learn.stocksCon3": { de: "Hohe Volatilität", en: "High volatility" },
  "learn.stocksCon4": { de: "Totalverlust bei Insolvenz", en: "Total loss in bankruptcy" },
  "learn.etfTitle": { de: "Was sind ETFs?", en: "What Are ETFs?" },
  "learn.etfP1": { de: "Ein <strong>ETF (Exchange Traded Fund)</strong> ist ein börsengehandelter Fonds, der einen Index wie den S&P 500 oder den DAX nachbildet. Du investierst mit einem einzigen Kauf in hunderte oder tausende Unternehmen gleichzeitig.", en: "An <strong>ETF (Exchange Traded Fund)</strong> is a fund traded on stock exchanges that tracks an index like the S&P 500 or DAX. With a single purchase, you invest in hundreds or thousands of companies at once." },
  "learn.etfP2": { de: "ETFs kombinieren die Diversifikation eines Fonds mit der einfachen Handelbarkeit einer Aktie. Sie haben in der Regel niedrige Gebühren und eignen sich hervorragend für langfristiges Investieren.", en: "ETFs combine the diversification of a fund with the easy tradability of a stock. They typically have low fees and are excellent for long-term investing." },
  "learn.etfInfo": { de: "MSCI World ETF (weltweite Streuung), S&P 500 ETF (Top-500 US-Unternehmen), MSCI Emerging Markets (Schwellenländer).", en: "MSCI World ETF (global diversification), S&P 500 ETF (top 500 US companies), MSCI Emerging Markets (developing countries)." },
  "learn.analysisTitle": { de: "Aktien analysieren", en: "Analyzing Stocks" },
  "learn.analysisIntro": { de: "Es gibt zwei Hauptansätze zur Aktienanalyse:", en: "There are two main approaches to stock analysis:" },
  "learn.fundamentalTitle": { de: "📊 Fundamentalanalyse", en: "📊 Fundamental Analysis" },
  "learn.fundamentalDesc": { de: "Bewertet den inneren Wert eines Unternehmens anhand von Kennzahlen wie KGV, Umsatz, Gewinn, Verschuldung und Wachstum.", en: "Evaluates a company's intrinsic value using metrics like P/E ratio, revenue, earnings, debt, and growth." },
  "learn.technicalTitle": { de: "📈 Technische Analyse", en: "📈 Technical Analysis" },
  "learn.technicalDesc": { de: "Analysiert Kurscharts und Muster, um zukünftige Preisbewegungen vorherzusagen. Nutzt Indikatoren wie gleitende Durchschnitte und RSI.", en: "Analyzes price charts and patterns to predict future price movements. Uses indicators like moving averages and RSI." },
  "learn.section3Title": { de: "Finanzprodukte", en: "Financial Products" },
  "learn.bondsTitle": { de: "Anleihen (Bonds)", en: "Bonds" },
  "learn.bondsP1": { de: "<strong>Anleihen</strong> sind Schuldverschreibungen – du leihst einem Unternehmen oder Staat Geld und bekommst dafür regelmäßige Zinszahlungen. Am Ende der Laufzeit erhältst du dein Kapital zurück.", en: "<strong>Bonds</strong> are debt securities – you lend money to a company or government and receive regular interest payments. At maturity, you get your principal back." },
  "learn.bondsP2": { de: "Anleihen gelten als sicherer als Aktien, bieten aber in der Regel niedrigere Renditen. Sie eignen sich gut zur Stabilisierung eines Portfolios.", en: "Bonds are generally considered safer than stocks but typically offer lower returns. They're good for stabilizing a portfolio." },
  "learn.fundsTitle": { de: "Fonds & Investmentfonds", en: "Funds & Mutual Funds" },
  "learn.fundsP1": { de: "<strong>Investmentfonds</strong> sammeln Geld von vielen Anlegern und investieren es breit gestreut. Im Gegensatz zu ETFs werden sie aktiv von Fondsmanagern verwaltet, was zu höheren Gebühren führt.", en: "<strong>Mutual funds</strong> pool money from many investors and invest it broadly. Unlike ETFs, they are actively managed by fund managers, leading to higher fees." },
  "learn.fundsComparison": { de: "ETF vs. aktiver Fonds", en: "ETF vs. Active Fund" },
  "learn.fundsComparisonDesc": { de: "Studien zeigen, dass die meisten aktiven Fonds langfristig ihren Vergleichsindex nicht schlagen. ETFs sind daher für die meisten Privatanleger die bessere Wahl.", en: "Studies show that most active funds fail to beat their benchmark index over the long term. ETFs are therefore the better choice for most retail investors." },
  "learn.derivativesTitle": { de: "Derivate (Optionen, Futures, etc.)", en: "Derivatives (Options, Futures, etc.)" },
  "learn.derivativesP1": { de: "<strong>Derivate</strong> sind Finanzinstrumente, deren Wert von einem Basiswert (z. B. Aktie, Index, Rohstoff) abgeleitet wird. Dazu gehören Optionen, Futures, Zertifikate und CFDs.", en: "<strong>Derivatives</strong> are financial instruments whose value is derived from an underlying asset (e.g. stock, index, commodity). These include options, futures, certificates, and CFDs." },
  "learn.derivativesWarning": { de: "Derivate sind komplexe Finanzprodukte mit hohem Risiko. Sie eignen sich nicht für Anfänger und können zu Verlusten führen, die über das eingesetzte Kapital hinausgehen.", en: "Derivatives are complex financial products with high risk. They are not suitable for beginners and can lead to losses exceeding the invested capital." },
  "learn.cryptoTitle": { de: "Kryptowährungen", en: "Cryptocurrencies" },
  "learn.cryptoP1": { de: "<strong>Kryptowährungen</strong> wie Bitcoin und Ethereum sind digitale Währungen, die auf Blockchain-Technologie basieren. Sie sind hochvolatil und gelten als spekulative Anlage.", en: "<strong>Cryptocurrencies</strong> like Bitcoin and Ethereum are digital currencies based on blockchain technology. They are highly volatile and considered speculative investments." },
  "learn.cryptoP2": { de: "Als Beimischung in einem diversifizierten Portfolio können sie interessant sein, sollten aber nur einen kleinen Anteil ausmachen.", en: "As an addition to a diversified portfolio they can be interesting, but should only make up a small portion." },
  "learn.disclaimer": { de: "⚠️ Diese Informationen dienen ausschließlich zu Bildungszwecken und stellen keine Anlageberatung dar. Investieren birgt Risiken – informiere dich gründlich und ziehe bei Bedarf einen Finanzberater hinzu.", en: "⚠️ This information is for educational purposes only and does not constitute investment advice. Investing involves risks – do thorough research and consult a financial advisor if needed." },
  "learn.goodToKnow": { de: "Gut zu wissen", en: "Good to Know" },
  "learn.goldenRule": { de: "Goldene Regel", en: "Golden Rule" },
  "learn.popularEtfs": { de: "Beliebte ETFs", en: "Popular ETFs" },
  "learn.warning": { de: "⚠️ Warnung", en: "⚠️ Warning" },

  // ── Learn Page - Section 4: Strategies ──
  "learn.section4Title": { de: "Strategien & Tipps", en: "Strategies & Tips" },
  "learn.buyHoldTitle": { de: "Buy & Hold – Langfristiges Investieren", en: "Buy & Hold – Long-Term Investing" },
  "learn.buyHoldP1": { de: "Die <strong>Buy & Hold</strong>-Strategie bedeutet, Aktien zu kaufen und über viele Jahre zu halten, unabhängig von kurzfristigen Schwankungen. Historisch gesehen hat der Aktienmarkt langfristig im Durchschnitt 7–10% pro Jahr zugelegt.", en: "The <strong>Buy & Hold</strong> strategy means buying stocks and holding them for many years, regardless of short-term fluctuations. Historically, the stock market has averaged 7–10% annual returns over the long term." },
  "learn.buyHoldP2": { de: 'Warren Buffett, einer der erfolgreichsten Investoren aller Zeiten, ist ein berühmter Verfechter dieser Strategie: „Unsere bevorzugte Haltedauer ist: für immer."', en: 'Warren Buffett, one of the most successful investors of all time, is a famous proponent of this strategy: "Our favorite holding period is forever."' },
  "learn.buyHoldInfo": { de: "Wer 1980 $10.000 in den S&P 500 investiert hätte, hätte heute über $1 Million – allein durch Halten und Reinvestieren der Dividenden.", en: "If you had invested $10,000 in the S&P 500 in 1980, you would have over $1 million today – just by holding and reinvesting dividends." },
  "learn.dcaTitle": { de: "Cost-Average-Effekt (Sparplan)", en: "Dollar-Cost Averaging (DCA)" },
  "learn.dcaP1": { de: "Beim <strong>Cost-Average-Effekt</strong> investierst du regelmäßig einen festen Betrag, z. B. monatlich per ETF-Sparplan. Bei niedrigen Kursen kaufst du mehr Anteile, bei hohen Kursen weniger. So glättest du deinen Einstiegspreis über die Zeit.", en: "With <strong>Dollar-Cost Averaging</strong>, you invest a fixed amount regularly, e.g. monthly into an ETF savings plan. When prices are low, you buy more shares; when high, fewer. This smooths your entry price over time." },
  "learn.dcaP2": { de: "Sparpläne ab 25€/Monat sind bei den meisten Brokern möglich und eine der besten Strategien für Einsteiger.", en: "Savings plans starting at $25/month are available at most brokers and are one of the best strategies for beginners." },
  "learn.dcaInfo": { de: "Ein monatlicher Sparplan von 200€ in einen MSCI World ETF hätte in den letzten 20 Jahren ein Vermögen von über 100.000€ aufgebaut.", en: "A monthly savings plan of $200 into an MSCI World ETF would have built a portfolio of over $100,000 in the last 20 years." },
  "learn.valueTitle": { de: "Value Investing", en: "Value Investing" },
  "learn.valueP1": { de: "<strong>Value Investing</strong> bedeutet, unterbewertete Aktien zu finden – Unternehmen, deren Aktienkurs unter ihrem eigentlichen Wert liegt. Man analysiert Kennzahlen wie KGV, KBV und den Substanzwert eines Unternehmens.", en: "<strong>Value Investing</strong> means finding undervalued stocks – companies whose stock price is below their intrinsic value. You analyze metrics like P/E ratio, P/B ratio, and a company's book value." },
  "learn.valueP2": { de: 'Berühmte Value-Investoren: Benjamin Graham ("Der intelligente Investor"), Warren Buffett, Charlie Munger.', en: 'Famous value investors: Benjamin Graham ("The Intelligent Investor"), Warren Buffett, Charlie Munger.' },
  "learn.growthTitle": { de: "Growth Investing", en: "Growth Investing" },
  "learn.growthP1": { de: "<strong>Growth Investing</strong> fokussiert sich auf Unternehmen mit überdurchschnittlichem Umsatz- und Gewinnwachstum. Diese Aktien haben oft hohe Bewertungen (hohes KGV), aber das Potenzial für starke Kurssteigerungen.", en: "<strong>Growth Investing</strong> focuses on companies with above-average revenue and earnings growth. These stocks often have high valuations (high P/E ratios), but potential for strong price appreciation." },
  "learn.growthP2": { de: "Beispiele für historisch erfolgreiche Growth-Aktien: Apple, Amazon, Nvidia, Tesla.", en: "Examples of historically successful growth stocks: Apple, Amazon, Nvidia, Tesla." },
  "learn.psychTitle": { de: "Börsenpsychologie", en: "Market Psychology" },
  "learn.psychP1": { de: "Emotionen sind der größte Feind des Investors. <strong>Angst</strong> führt zu Panikverkäufen bei fallenden Kursen, <strong>Gier</strong> zu überhöhten Einstiegen bei Hypes.", en: "Emotions are the investor's greatest enemy. <strong>Fear</strong> leads to panic selling during market drops, <strong>greed</strong> leads to buying at inflated prices during hypes." },
  "learn.psychP2": { de: 'Warren Buffett: „Sei ängstlich, wenn andere gierig sind, und gierig, wenn andere ängstlich sind."', en: 'Warren Buffett: "Be fearful when others are greedy, and greedy when others are fearful."' },
  "learn.psychInfo": { de: "Die meisten Privatanleger erzielen unterdurchschnittliche Renditen, weil sie in Panik verkaufen und bei Euphorie kaufen. Disziplin schlägt Timing.", en: "Most retail investors achieve below-average returns because they sell in panic and buy during euphoria. Discipline beats timing." },

  // ── Learn Page - Section 5: Taxes & Costs ──
  "learn.section5Title": { de: "Steuern & Kosten", en: "Taxes & Costs" },
  "learn.taxTitle": { de: "Kapitalertragsteuer", en: "Capital Gains Tax" },
  "learn.taxP1": { de: "In Deutschland werden Kapitalerträge (Dividenden, Kursgewinne) mit der <strong>Abgeltungsteuer</strong> von 25% + Solidaritätszuschlag + ggf. Kirchensteuer besteuert. Der effektive Steuersatz liegt bei ca. 26,375%.", en: "Capital gains (dividends, price gains) are subject to tax. In the US, long-term capital gains are taxed at 0%, 15%, or 20% depending on your income bracket. Short-term gains are taxed as ordinary income." },
  "learn.taxP2": { de: "Jeder Bürger hat einen <strong>Sparerpauschbetrag</strong> von 1.000€ (2.000€ für Ehepaare), bis zu dem Kapitalerträge steuerfrei sind. Stelle sicher, dass du einen Freistellungsauftrag bei deinem Broker einrichtest!", en: "Tax-advantaged accounts like <strong>401(k)s, IRAs, and Roth IRAs</strong> in the US (or ISAs in the UK, Depotkonten in Germany with Sparerpauschbetrag) can significantly reduce your tax burden. Make sure to utilize them!" },
  "learn.taxInfo": { de: "Vergiss nicht den Freistellungsauftrag! Ohne ihn werden dir sofort Steuern auf alle Erträge abgezogen, auch unterhalb des Pauschbetrags.", en: "Don't forget to set up tax-loss harvesting! Selling investments at a loss to offset gains can reduce your tax bill significantly." },
  "learn.costsTitle": { de: "Gebühren & Kosten", en: "Fees & Costs" },
  "learn.costsP1": { de: "Gebühren fressen Rendite – besonders bei langfristigem Investieren. Achte auf: <strong>Ordergebühren</strong> (je Trade), <strong>Depotgebühren</strong> (jährlich), <strong>Spread</strong> (Differenz Kauf-/Verkaufskurs) und <strong>TER</strong> (Total Expense Ratio bei ETFs/Fonds).", en: "Fees eat into returns – especially with long-term investing. Watch out for: <strong>Trading commissions</strong> (per trade), <strong>Account fees</strong> (annual), <strong>Spread</strong> (bid-ask difference), and <strong>TER</strong> (Total Expense Ratio for ETFs/funds)." },
  "learn.costsP2": { de: "Vergleiche Broker sorgfältig: Neobroker wie Trade Republic oder Scalable Capital bieten oft günstigere Konditionen als traditionelle Banken.", en: "Compare brokers carefully: discount brokers like Fidelity, Schwab, or interactive platforms like Robinhood and IBKR often offer lower fees than traditional banks." },
  "learn.costsInfo": { de: "Ein ETF mit 0,2% TER kostet dich bei 100.000€ Investition nur 200€/Jahr. Ein aktiver Fonds mit 1,5% TER: 1.500€/Jahr. Über 30 Jahre summiert sich das zu zehntausenden Euro Unterschied!", en: "An ETF with 0.2% TER costs you only $200/year on a $100,000 investment. An active fund with 1.5% TER: $1,500/year. Over 30 years, this difference amounts to tens of thousands of dollars!" },
  "learn.compoundTitle": { de: "Die Macht des Zinseszins", en: "The Power of Compound Interest" },
  "learn.compoundP1": { de: "Albert Einstein nannte den Zinseszins das \"achte Weltwunder\". Wenn du Gewinne reinvestierst, wächst dein Vermögen exponentiell – nicht linear.", en: "Albert Einstein called compound interest the \"eighth wonder of the world.\" When you reinvest your gains, your wealth grows exponentially – not linearly." },
  "learn.compoundP2": { de: "Beispiel: 10.000€ mit 8% Rendite werden nach 10 Jahren zu ~21.600€, nach 20 Jahren zu ~46.600€, nach 30 Jahren zu ~100.600€. Ohne zusätzliche Einzahlung!", en: "Example: $10,000 at 8% return grows to ~$21,600 after 10 years, ~$46,600 after 20 years, ~$100,600 after 30 years. Without any additional contributions!" },
  "learn.compoundInfo": { de: "Nutze unseren Zinseszins-Rechner unter \"Rechner\" um dein persönliches Wachstum zu simulieren!", en: "Use our compound interest calculator under \"Tools\" to simulate your personal growth!" },
  "learn.brokerTitle": { de: "Den richtigen Broker wählen", en: "Choosing the Right Broker" },
  "learn.brokerP1": { de: "Ein Broker ist der Vermittler, über den du Aktien, ETFs und andere Wertpapiere kaufst und verkaufst. Die Wahl des richtigen Brokers kann langfristig tausende Euro sparen.", en: "A broker is the intermediary through which you buy and sell stocks, ETFs, and other securities. Choosing the right broker can save you thousands of dollars in the long run." },
  "learn.brokerP2": { de: "Achte auf: Ordergebühren, Sparplan-Konditionen, verfügbare Handelsplätze, Benutzerfreundlichkeit und Sicherheit (Einlagensicherung).", en: "Pay attention to: trading fees, savings plan options, available exchanges, user-friendliness, and security (deposit protection)." },
  "learn.tipTitle": { de: "💡 Tipp", en: "💡 Tip" },
  "learn.quoteTitle": { de: "📌 Zitat", en: "📌 Quote" },

  // ── 404 ──
  "notfound.title": { de: "Seite nicht gefunden", en: "Page not found" },
  "notfound.back": { de: "Zurück zur Startseite", en: "Return to Home" },
};
