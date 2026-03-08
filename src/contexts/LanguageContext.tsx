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

  const allTranslations = useMemo(() => ({ ...translations, ...learnTranslations }), []);

  const t = useCallback((key: string): string => {
    const entry = allTranslations[key];
    if (!entry) return key;
    return entry[lang] || entry["en"] || key;
  }, [lang, allTranslations]);

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
  // Learn page translations are in src/i18n/learnTranslations.ts

  // ── Profile ──
  "profile.displayName": { de: "Anzeigename", en: "Display Name" },
  "profile.edit": { de: "Bearbeiten", en: "Edit" },
  "profile.cancel": { de: "Abbrechen", en: "Cancel" },
  "profile.saveChanges": { de: "Änderungen speichern", en: "Save Changes" },
  "profile.saved": { de: "Profil gespeichert!", en: "Profile saved!" },
  "profile.errorSaving": { de: "Fehler beim Speichern", en: "Error saving profile" },
  "profile.emailHint": { de: "E-Mail kann nicht direkt geändert werden.", en: "Email cannot be changed directly." },
  "profile.watchlistCount": { de: "Watchlist", en: "Watchlist" },
  "profile.memberSince": { de: "Mitglied seit", en: "Member since" },
  "profile.freeAccount": { de: "Free", en: "Free" },
  "profile.plan": { de: "Plan", en: "Plan" },

  // ── Settings ──
  "settings.title": { de: "Einstellungen", en: "Settings" },
  "settings.subtitle": { de: "App-Einstellungen und Sicherheit", en: "App preferences & security" },
  "settings.appearance": { de: "Darstellung", en: "Appearance" },
  "settings.darkMode": { de: "Dark Mode", en: "Dark Mode" },
  "settings.darkModeDesc": { de: "Dunkles Farbschema aktivieren", en: "Enable dark color scheme" },
  "settings.language": { de: "Sprache", en: "Language" },
  "settings.appLanguage": { de: "App-Sprache", en: "App Language" },
  "settings.languageDesc": { de: "Sprache der Benutzeroberfläche", en: "Interface language" },
  "settings.notifications": { de: "Benachrichtigungen", en: "Notifications" },
  "settings.priceAlerts": { de: "Kursalarme", en: "Price Alerts" },
  "settings.priceAlertsDesc": { de: "Benachrichtigung bei großen Kursbewegungen", en: "Notify on significant price moves" },
  "settings.newsAlerts": { de: "News-Benachrichtigungen", en: "News Alerts" },
  "settings.newsAlertsDesc": { de: "Benachrichtigung bei Marktnachrichten", en: "Notify on market news" },
  "settings.security": { de: "Sicherheit", en: "Security" },
  "settings.newPassword": { de: "Neues Passwort", en: "New Password" },
  "settings.confirmPassword": { de: "Passwort bestätigen", en: "Confirm Password" },
  "settings.changePassword": { de: "Passwort ändern", en: "Change Password" },
  "settings.pwTooShort": { de: "Passwort muss mind. 6 Zeichen haben.", en: "Password must be at least 6 characters." },
  "settings.pwMismatch": { de: "Passwörter stimmen nicht überein.", en: "Passwords do not match." },
  "settings.pwChanged": { de: "Passwort erfolgreich geändert!", en: "Password changed successfully!" },
  "settings.dangerZone": { de: "Gefahrenzone", en: "Danger Zone" },
  "settings.deleteAccount": { de: "Konto löschen", en: "Delete Account" },
  "settings.deleteAccountDesc": { de: "Konto und alle Daten dauerhaft löschen", en: "Permanently delete account and all data" },
  "settings.delete": { de: "Löschen", en: "Delete" },
  "settings.deleteWarning": { de: "Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden dauerhaft gelöscht.", en: "This action cannot be undone. All your data will be permanently deleted." },
  "settings.confirmDelete": { de: "Ja, Konto löschen", en: "Yes, delete account" },
  "settings.deleteNotAvailable": { de: "Kontaktiere den Support, um dein Konto zu löschen.", en: "Contact support to delete your account." },

  // ── Watchlist extras ──
  "watchlist.search": { de: "Watchlist durchsuchen…", en: "Search watchlist…" },
  "watchlist.sortNewest": { de: "Neueste zuerst", en: "Newest first" },
  "watchlist.sortOldest": { de: "Älteste zuerst", en: "Oldest first" },
  "watchlist.sortAlpha": { de: "Alphabetisch", en: "Alphabetical" },
  "watchlist.noSearchResults": { de: "Keine Treffer in deiner Watchlist", en: "No matches in your watchlist" },

  // ── Calculator extras ──
  "calc.loanCalc": { de: "Kreditrechner", en: "Loan Calculator" },
  "calc.breakEven": { de: "Break-Even", en: "Break-Even" },
  "calc.riskReward": { de: "Risiko/Rendite", en: "Risk/Reward" },
  "calc.loanAmount": { de: "Kreditbetrag", en: "Loan Amount" },
  "calc.interestRate": { de: "Zinssatz (%)", en: "Interest Rate (%)" },
  "calc.loanTerm": { de: "Laufzeit (Jahre)", en: "Loan Term (years)" },
  "calc.monthlyPayment": { de: "Monatliche Rate", en: "Monthly Payment" },
  "calc.totalPayment": { de: "Gesamtzahlung", en: "Total Payment" },
  "calc.totalInterestPaid": { de: "Gesamtzinsen", en: "Total Interest" },
  "calc.fixedCosts": { de: "Fixkosten", en: "Fixed Costs" },
  "calc.pricePerUnit": { de: "Preis pro Einheit", en: "Price per Unit" },
  "calc.costPerUnit": { de: "Kosten pro Einheit", en: "Cost per Unit" },
  "calc.breakEvenUnits": { de: "Break-Even Einheiten", en: "Break-Even Units" },
  "calc.breakEvenRevenue": { de: "Break-Even Umsatz", en: "Break-Even Revenue" },
  "calc.targetPrice": { de: "Kursziel", en: "Target Price" },
  "calc.riskRewardRatio": { de: "Risiko/Rendite-Verhältnis", en: "Risk/Reward Ratio" },
  "calc.potentialProfit": { de: "Möglicher Gewinn", en: "Potential Profit" },
  "calc.potentialLoss": { de: "Möglicher Verlust", en: "Potential Loss" },
  "calc.verdict": { de: "Bewertung", en: "Verdict" },
  "calc.favorable": { de: "Günstig", en: "Favorable" },
  "calc.neutral": { de: "Neutral", en: "Neutral" },
  "calc.unfavorable": { de: "Ungünstig", en: "Unfavorable" },

  // ── 404 ──
  "notfound.title": { de: "Seite nicht gefunden", en: "Page not found" },
  "notfound.back": { de: "Zurück zur Startseite", en: "Return to Home" },

  // ── Portfolio ──
  "nav.portfolio": { de: "Portfolio", en: "Portfolio" },

  // ── Analyst Targets ──
  "at.title": { de: "Kursziel der Analysten", en: "Analyst Price Target" },
  "at.consensus": { de: "Konsens-Kursziel", en: "Consensus Target" },
  "at.current": { de: "Aktuell", en: "Current" },
  "at.upside": { de: "Potenzial", en: "upside" },

  // ── Technical Indicators ──
  "ti.title": { de: "Technische Indikatoren", en: "Technical Indicators" },
  "ti.bullish": { de: "Bullisch", en: "Bullish" },
  "ti.bearish": { de: "Bärisch", en: "Bearish" },
  "ti.overbought": { de: "Überkauft", en: "Overbought" },
  "ti.oversold": { de: "Überverkauft", en: "Oversold" },
  "ti.neutral": { de: "Neutral", en: "Neutral" },

  // ── Earnings Card ──
  "ec.title": { de: "Gewinnentwicklung (EPS)", en: "Earnings History (EPS)" },
  "ec.reported": { de: "Gemeldet", en: "Reported" },
  "ec.estimated": { de: "Geschätzt", en: "Estimated" },
  "ec.beat": { de: "Übertroffen", en: "Beat" },
  "ec.miss": { de: "Verfehlt", en: "Missed" },
};
