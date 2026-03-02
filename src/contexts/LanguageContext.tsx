import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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

  // ── 404 ──
  "notfound.title": { de: "Seite nicht gefunden", en: "Page not found" },
  "notfound.back": { de: "Zurück zur Startseite", en: "Return to Home" },
};
