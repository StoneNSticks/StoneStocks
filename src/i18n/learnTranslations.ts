import type { Language } from "@/contexts/LanguageContext";

const t = (de: string, en: string): Record<Language, string> => ({ de, en });

export const learnTranslations: Record<string, Record<Language, string>> = {
  // ── Badge & Header ──
  "learn.badge": t("Finanzwissen", "Financial Knowledge"),
  "learn.title": t("Dein Weg zum informierten Investor", "Your Path to Becoming an Informed Investor"),
  "learn.subtitle": t(
    "Von den absoluten Grundlagen bis hin zu fortgeschrittenen Strategien und Derivaten – ein umfassender Leitfaden für jedes Wissenslevel.",
    "From absolute basics to advanced strategies and derivatives – a comprehensive guide for every knowledge level."
  ),
  "learn.toc": t("Inhaltsverzeichnis", "Table of Contents"),
  "learn.disclaimer": t(
    "⚠️ Diese Informationen dienen ausschließlich zu Bildungszwecken und stellen keine Anlageberatung dar. Investieren birgt Risiken – informiere dich gründlich und ziehe bei Bedarf einen Finanzberater hinzu.",
    "⚠️ This information is for educational purposes only and does not constitute investment advice. Investing involves risks – do thorough research and consult a financial advisor if needed."
  ),
  "learn.goodToKnow": t("Gut zu wissen", "Good to Know"),
  "learn.goldenRule": t("Goldene Regel", "Golden Rule"),
  "learn.warning": t("⚠️ Warnung", "⚠️ Warning"),
  "learn.tipTitle": t("💡 Tipp", "💡 Tip"),
  "learn.example": t("📌 Beispiel", "📌 Example"),
  "learn.levelBeginner": t("🟢 Einsteiger", "🟢 Beginner"),
  "learn.levelIntermediate": t("🟡 Fortgeschritten", "🟡 Intermediate"),
  "learn.levelAdvanced": t("🔴 Experte", "🔴 Expert"),

  // ── TOC ──
  "learn.toc1": t("1. Grundlagen der Finanzen", "1. Financial Basics"),
  "learn.toc2": t("2. Aktien & ETFs", "2. Stocks & ETFs"),
  "learn.toc3": t("3. Anleihen & Fonds", "3. Bonds & Funds"),
  "learn.toc4": t("4. Derivate im Detail", "4. Derivatives in Detail"),
  "learn.toc5": t("5. Krypto & Alternative Anlagen", "5. Crypto & Alternative Assets"),
  "learn.toc6": t("6. Anlagestrategien", "6. Investment Strategies"),
  "learn.toc7": t("7. Technische Analyse", "7. Technical Analysis"),
  "learn.toc8": t("8. Portfoliomanagement", "8. Portfolio Management"),
  "learn.toc9": t("9. Steuern & Kosten", "9. Taxes & Costs"),

  // ══════════════════════════════════════════════════════════════
  // SECTION 1: BASICS
  // ══════════════════════════════════════════════════════════════
  "learn.section1Title": t("Grundlagen der Finanzen", "Financial Basics"),

  "learn.marketsTitle": t("Was sind Finanzmärkte?", "What Are Financial Markets?"),
  "learn.marketsP1": t(
    "Finanzmärkte sind Orte – physisch oder digital –, an denen Käufer und Verkäufer Finanzinstrumente handeln. Sie sind das Herzstück der modernen Wirtschaft und ermöglichen es Unternehmen, Kapital aufzunehmen, und Investoren, ihr Vermögen zu vermehren.",
    "Financial markets are places – physical or digital – where buyers and sellers trade financial instruments. They are the heart of the modern economy, enabling companies to raise capital and investors to grow their wealth."
  ),
  "learn.marketsP2": t(
    "Die wichtigsten Finanzmärkte sind: <strong>Aktienmärkte</strong> (NYSE, NASDAQ, XETRA, Tokioter Börse), <strong>Anleihemärkte</strong> (der größte Markt der Welt nach Volumen), <strong>Devisenmärkte</strong> (Forex – $7,5 Billionen tägliches Handelsvolumen) und <strong>Rohstoffmärkte</strong> (Gold, Öl, Weizen etc.).",
    "The most important financial markets are: <strong>stock markets</strong> (NYSE, NASDAQ, XETRA, Tokyo Stock Exchange), <strong>bond markets</strong> (the largest market in the world by volume), <strong>foreign exchange markets</strong> (Forex – $7.5 trillion daily trading volume), and <strong>commodity markets</strong> (gold, oil, wheat, etc.)."
  ),
  "learn.marketsP3": t(
    "Märkte werden in <strong>Primärmarkt</strong> (Erstausgabe von Wertpapieren, z. B. IPO) und <strong>Sekundärmarkt</strong> (Handel bereits ausgegebener Wertpapiere) unterteilt.",
    "Markets are divided into <strong>primary markets</strong> (initial issuance of securities, e.g. IPO) and <strong>secondary markets</strong> (trading of already-issued securities)."
  ),
  "learn.marketsInfo": t(
    "Die weltweiten Aktienmärkte haben zusammen eine Marktkapitalisierung von über $109 Billionen (2024). Der Forex-Markt bewegt täglich $7,5 Billionen – mehr als alle Aktienmärkte zusammen in einer Woche.",
    "The world's stock markets have a combined market cap of over $109 trillion (2024). The Forex market moves $7.5 trillion daily – more than all stock markets combined in a week."
  ),

  "learn.basicsTitle": t("Grundbegriffe", "Key Terms"),
  "learn.term.marketCap": t("Marktkapitalisierung", "Market Capitalization"),
  "learn.term.marketCapDesc": t("Der Gesamtwert aller ausgegebenen Aktien eines Unternehmens (Aktienkurs × Anzahl Aktien). Mega Cap: >$200 Mrd., Large Cap: $10–200 Mrd., Mid Cap: $2–10 Mrd., Small Cap: <$2 Mrd.", "The total value of all outstanding shares of a company (share price × number of shares). Mega Cap: >$200B, Large Cap: $10–200B, Mid Cap: $2–10B, Small Cap: <$2B."),
  "learn.term.dividend": t("Dividende", "Dividend"),
  "learn.term.dividendDesc": t("Eine regelmäßige Gewinnausschüttung eines Unternehmens an seine Aktionäre. Die Dividendenrendite = Dividende/Kurs × 100%.", "A regular profit distribution from a company to its shareholders. Dividend yield = Dividend/Price × 100%."),
  "learn.term.pe": t("KGV (Kurs-Gewinn-Verhältnis)", "P/E Ratio (Price-to-Earnings)"),
  "learn.term.peDesc": t("Zeigt, wie viel Investoren bereit sind, pro Euro Gewinn zu zahlen. KGV = Kurs / Gewinn pro Aktie. Ein niedriges KGV deutet auf eine günstigere Bewertung hin, kann aber auch Probleme signalisieren.", "Shows how much investors pay per dollar of earnings. P/E = Price / Earnings per Share. A low P/E suggests cheaper valuation but may also signal problems."),
  "learn.term.volatility": t("Volatilität", "Volatility"),
  "learn.term.volatilityDesc": t("Maß für die Schwankungsbreite eines Kurses. Wird oft als Standardabweichung gemessen. Der VIX ('Angstindex') misst die erwartete Volatilität des S&P 500.", "A measure of price fluctuation. Often measured as standard deviation. The VIX ('fear index') measures expected S&P 500 volatility."),
  "learn.term.liquidity": t("Liquidität", "Liquidity"),
  "learn.term.liquidityDesc": t("Wie leicht ein Wertpapier gekauft oder verkauft werden kann, ohne den Preis stark zu beeinflussen. Apple-Aktien: sehr liquide. Immobilien: wenig liquide.", "How easily a security can be bought or sold without significantly affecting its price. Apple stock: very liquid. Real estate: illiquid."),
  "learn.term.bullBear": t("Bull Market / Bear Market", "Bull Market / Bear Market"),
  "learn.term.bullBearDesc": t("Bull Market = Kurse steigen >20% vom Tief. Bear Market = Kurse fallen >20% vom Hoch. Historisch dauern Bull Markets im Durchschnitt 5,5 Jahre, Bear Markets 1,3 Jahre.", "Bull Market = prices rise >20% from low. Bear Market = prices fall >20% from high. Historically, bull markets last 5.5 years on average, bear markets 1.3 years."),
  "learn.term.roe": t("Eigenkapitalrendite (ROE)", "Return on Equity (ROE)"),
  "learn.term.roeDesc": t("Zeigt, wie effizient ein Unternehmen das Eigenkapital einsetzt. ROE = Nettogewinn / Eigenkapital × 100%. Ein ROE über 15% gilt als überdurchschnittlich.", "Shows how efficiently a company uses shareholder equity. ROE = Net Income / Equity × 100%. An ROE above 15% is considered above average."),
  "learn.term.freeCashFlow": t("Freier Cashflow (FCF)", "Free Cash Flow (FCF)"),
  "learn.term.freeCashFlowDesc": t("Geld, das nach allen operativen Ausgaben und Investitionen übrig bleibt. FCF = Operativer Cashflow − Investitionsausgaben. Wichtiger als Gewinn für die Bewertung.", "Cash remaining after operating expenses and capital expenditures. FCF = Operating Cash Flow − CapEx. More important than earnings for valuation."),
  "learn.term.eps": t("Gewinn pro Aktie (EPS)", "Earnings Per Share (EPS)"),
  "learn.term.epsDesc": t("Nettogewinn geteilt durch die Anzahl ausstehender Aktien. Der wichtigste Indikator für die Profitabilität eines Unternehmens pro Aktie.", "Net income divided by outstanding shares. The most important indicator of a company's per-share profitability."),
  "learn.term.beta": t("Beta", "Beta"),
  "learn.term.betaDesc": t("Misst die Schwankung einer Aktie im Vergleich zum Gesamtmarkt. Beta 1,0 = gleich wie Markt. Beta 1,5 = 50% volatiler. Beta 0,5 = 50% weniger volatil.", "Measures a stock's volatility compared to the overall market. Beta 1.0 = same as market. Beta 1.5 = 50% more volatile. Beta 0.5 = 50% less volatile."),
  "learn.term.spread": t("Spread (Geld-Brief-Spanne)", "Spread (Bid-Ask)"),
  "learn.term.spreadDesc": t("Differenz zwischen Kauf- und Verkaufskurs. Ein enger Spread zeigt hohe Liquidität an. Bei illiquiden Aktien kann der Spread mehrere Prozent betragen.", "Difference between buy and sell price. A narrow spread indicates high liquidity. For illiquid stocks, the spread can be several percent."),

  "learn.riskTitle": t("Risiko & Diversifikation", "Risk & Diversification"),
  "learn.riskP1": t(
    "<strong>Risiko</strong> beschreibt die Möglichkeit, Geld zu verlieren. Es gibt verschiedene Risikoarten: <strong>Marktrisiko</strong> (der ganze Markt fällt), <strong>Einzeltitelrisiko</strong> (ein Unternehmen gerät in Schwierigkeiten), <strong>Währungsrisiko</strong> (Wechselkursschwankungen), <strong>Inflationsrisiko</strong> (Kaufkraftverlust) und <strong>Liquiditätsrisiko</strong> (schwer verkäufliche Anlage).",
    "<strong>Risk</strong> describes the possibility of losing money. There are different risk types: <strong>market risk</strong> (whole market falls), <strong>individual stock risk</strong> (one company struggles), <strong>currency risk</strong> (exchange rate fluctuations), <strong>inflation risk</strong> (loss of purchasing power), and <strong>liquidity risk</strong> (hard-to-sell investment)."
  ),
  "learn.riskP2": t(
    "<strong>Diversifikation</strong> ist die wichtigste Strategie zur Risikominimierung: Verteile dein Geld auf verschiedene Anlageklassen (Aktien, Anleihen, Immobilien), Branchen (Tech, Gesundheit, Energie), Regionen (USA, Europa, Asien) und Zeitpunkte (regelmäßig investieren).",
    "<strong>Diversification</strong> is the most important risk-reduction strategy: spread your money across different asset classes (stocks, bonds, real estate), sectors (tech, healthcare, energy), regions (US, Europe, Asia), and time (invest regularly)."
  ),
  "learn.riskP3": t(
    "Die <strong>Korrelation</strong> zwischen Anlagen bestimmt, wie effektiv Diversifikation wirkt. Anlagen mit niedriger oder negativer Korrelation (z. B. Aktien und Staatsanleihen) bieten den besten Schutz.",
    "<strong>Correlation</strong> between assets determines how effective diversification is. Assets with low or negative correlation (e.g. stocks and government bonds) provide the best protection."
  ),
  "learn.riskInfo": t(
    "\"Lege nie alle Eier in einen Korb.\" – Eine breite Streuung über mindestens 20–30 verschiedene Positionen reduziert das Einzeltitelrisiko um über 90%.",
    "\"Don't put all your eggs in one basket.\" – Broad diversification across at least 20-30 positions reduces individual stock risk by over 90%."
  ),

  "learn.orderTypesTitle": t("Ordertypen verstehen", "Understanding Order Types"),
  "learn.orderTypesP1": t(
    "Beim Kauf und Verkauf von Wertpapieren gibt es verschiedene Ordertypen, die du kennen solltest:",
    "When buying and selling securities, there are various order types you should know:"
  ),
  "learn.orderMarket": t("Market Order", "Market Order"),
  "learn.orderMarketDesc": t("Sofortige Ausführung zum aktuellen Marktpreis. Schnell, aber der genaue Preis ist nicht garantiert.", "Immediate execution at current market price. Fast, but exact price not guaranteed."),
  "learn.orderLimit": t("Limit Order", "Limit Order"),
  "learn.orderLimitDesc": t("Kauf/Verkauf nur zu einem bestimmten Preis oder besser. Mehr Kontrolle, aber Ausführung nicht garantiert.", "Buy/sell only at a specific price or better. More control, but execution not guaranteed."),
  "learn.orderStopLoss": t("Stop-Loss Order", "Stop-Loss Order"),
  "learn.orderStopLossDesc": t("Automatischer Verkauf wenn der Kurs unter ein Limit fällt. Schützt vor großen Verlusten.", "Automatic sell when price falls below a threshold. Protects against large losses."),
  "learn.orderTrailingStop": t("Trailing Stop", "Trailing Stop"),
  "learn.orderTrailingStopDesc": t("Ein Stop-Loss, der dem Kurs nach oben folgt. Sichert Gewinne ab, ohne Aufwärtspotenzial zu limitieren.", "A stop-loss that follows the price upward. Locks in profits without limiting upside potential."),

  // ══════════════════════════════════════════════════════════════
  // SECTION 2: STOCKS & ETFs
  // ══════════════════════════════════════════════════════════════
  "learn.section2Title": t("Aktien & ETFs", "Stocks & ETFs"),

  "learn.stocksTitle": t("Was sind Aktien?", "What Are Stocks?"),
  "learn.stocksP1": t(
    "Eine <strong>Aktie</strong> ist ein Anteil an einem Unternehmen. Wenn du eine Aktie kaufst, wirst du Miteigentümer und profitierst von Kursgewinnen und Dividenden. Es gibt <strong>Stammaktien</strong> (mit Stimmrecht) und <strong>Vorzugsaktien</strong> (ohne Stimmrecht, aber mit Dividendenvorzug).",
    "A <strong>stock</strong> is a share of ownership in a company. When you buy a stock, you become a co-owner and benefit from price gains and dividends. There are <strong>common stocks</strong> (with voting rights) and <strong>preferred stocks</strong> (no voting rights, but dividend preference)."
  ),
  "learn.stocksP2": t(
    "Aktien werden an Börsen gehandelt. Der Preis wird durch Angebot und Nachfrage bestimmt und spiegelt die Erwartungen der Investoren an die Zukunft des Unternehmens wider.",
    "Stocks are traded on exchanges. The price is determined by supply and demand and reflects investors' expectations about the company's future."
  ),
  "learn.stocksPros": t("Vorteile", "Advantages"),
  "learn.stocksPro1": t("Historisch höchste Renditen aller Anlageklassen (Ø 7–10% p.a.)", "Historically highest returns of all asset classes (avg. 7–10% p.a.)"),
  "learn.stocksPro2": t("Passives Einkommen durch Dividenden", "Passive income through dividends"),
  "learn.stocksPro3": t("Mitspracherecht auf Hauptversammlungen", "Voting rights at shareholder meetings"),
  "learn.stocksPro4": t("Langfristiger Inflationsschutz", "Long-term inflation protection"),
  "learn.stocksCons": t("Risiken", "Risks"),
  "learn.stocksCon1": t("Kursverluste bis hin zum Totalverlust möglich", "Price losses up to total loss possible"),
  "learn.stocksCon2": t("Keine garantierte Rendite oder Dividende", "No guaranteed returns or dividends"),
  "learn.stocksCon3": t("Hohe kurzfristige Volatilität", "High short-term volatility"),
  "learn.stocksCon4": t("Emotionale Belastung bei Kurseinbrüchen", "Emotional stress during market crashes"),

  "learn.stockTypesTitle": t("Aktientypen", "Stock Types"),
  "learn.blueChip": t("Blue-Chip Aktien", "Blue-Chip Stocks"),
  "learn.blueChipDesc": t("Große, etablierte Unternehmen mit stabilen Gewinnen (z. B. Apple, Microsoft, Nestlé). Geringeres Risiko, moderate Rendite.", "Large, established companies with stable earnings (e.g. Apple, Microsoft, Nestlé). Lower risk, moderate returns."),
  "learn.growthStocks": t("Wachstumsaktien", "Growth Stocks"),
  "learn.growthStocksDesc": t("Unternehmen mit hohem Umsatz-/Gewinnwachstum (z. B. Nvidia, Tesla). Hohes KGV, hohe Volatilität, hohes Potenzial.", "Companies with high revenue/earnings growth (e.g. Nvidia, Tesla). High P/E, high volatility, high potential."),
  "learn.dividendStocks": t("Dividendenaktien", "Dividend Stocks"),
  "learn.dividendStocksDesc": t("Unternehmen, die regelmäßig hohe Dividenden ausschütten (z. B. Coca-Cola, P&G). Stetiges Einkommen, oft defensive Sektoren.", "Companies that regularly pay high dividends (e.g. Coca-Cola, P&G). Steady income, often defensive sectors."),
  "learn.pennyStocks": t("Penny Stocks", "Penny Stocks"),
  "learn.pennyStocksDesc": t("Aktien mit sehr niedrigem Kurs (<$5). Extrem spekulativ, hohe Volatilität, Gefahr von Manipulation. Nur für erfahrene Trader!", "Stocks with very low prices (<$5). Extremely speculative, high volatility, risk of manipulation. Only for experienced traders!"),

  "learn.etfTitle": t("Was sind ETFs?", "What Are ETFs?"),
  "learn.etfP1": t(
    "Ein <strong>ETF (Exchange Traded Fund)</strong> ist ein börsengehandelter Fonds, der einen Index nachbildet. Mit einem einzigen Kauf investierst du in hunderte oder tausende Unternehmen gleichzeitig – maximale Diversifikation mit minimalem Aufwand.",
    "An <strong>ETF (Exchange Traded Fund)</strong> is a fund traded on stock exchanges that tracks an index. With a single purchase, you invest in hundreds or thousands of companies – maximum diversification with minimal effort."
  ),
  "learn.etfP2": t(
    "ETFs kombinieren die Diversifikation eines Fonds mit der einfachen Handelbarkeit einer Aktie. Die jährlichen Kosten (TER) liegen typischerweise bei 0,05–0,5%, verglichen mit 1–2% bei aktiven Fonds.",
    "ETFs combine the diversification of a fund with the easy tradability of a stock. Annual costs (TER) are typically 0.05–0.5%, compared to 1–2% for active funds."
  ),
  "learn.etfTypes": t("ETF-Typen", "ETF Types"),
  "learn.etfIndex": t("Index-ETFs", "Index ETFs"),
  "learn.etfIndexDesc": t("Bilden einen Aktienindex nach (S&P 500, MSCI World, DAX). Die beliebteste und empfehlenswerteste Variante.", "Track a stock index (S&P 500, MSCI World, DAX). The most popular and recommended type."),
  "learn.etfSector": t("Sektor-ETFs", "Sector ETFs"),
  "learn.etfSectorDesc": t("Fokussiert auf eine Branche: Technologie, Gesundheit, Energie, Finanzen, etc.", "Focused on an industry: technology, healthcare, energy, financials, etc."),
  "learn.etfBond": t("Anleihen-ETFs", "Bond ETFs"),
  "learn.etfBondDesc": t("Investieren in Staats- oder Unternehmensanleihen. Stabilisieren das Portfolio in Krisen.", "Invest in government or corporate bonds. Stabilize portfolio during crises."),
  "learn.etfThematic": t("Themen-ETFs", "Thematic ETFs"),
  "learn.etfThematicDesc": t("Nische wie KI, Clean Energy, Blockchain, Cybersecurity. Höheres Risiko, aber Potenzial bei Trendthemen.", "Niches like AI, clean energy, blockchain, cybersecurity. Higher risk but potential with trending topics."),
  "learn.etfInfo": t(
    "Die 3 beliebtesten ETFs: iShares Core MSCI World (weltweite Streuung), Vanguard S&P 500 (Top-500 US), iShares MSCI EM (Schwellenländer). Ein MSCI World ETF reicht für die meisten Einsteiger völlig aus!",
    "The 3 most popular ETFs: iShares Core MSCI World (global), Vanguard S&P 500 (top 500 US), iShares MSCI EM (emerging markets). An MSCI World ETF is sufficient for most beginners!"
  ),

  "learn.analysisTitle": t("Aktien analysieren", "Analyzing Stocks"),
  "learn.analysisIntro": t("Es gibt zwei Hauptansätze zur Aktienanalyse:", "There are two main approaches to stock analysis:"),
  "learn.fundamentalTitle": t("📊 Fundamentalanalyse", "📊 Fundamental Analysis"),
  "learn.fundamentalDesc": t("Bewertet den inneren Wert eines Unternehmens anhand von Kennzahlen wie KGV, KBV, Umsatz, Gewinn, Verschuldung und Wachstum. Ziel: Unterbewertete Unternehmen finden.", "Evaluates a company's intrinsic value using metrics like P/E, P/B, revenue, earnings, debt, and growth. Goal: Find undervalued companies."),
  "learn.technicalTitle": t("📈 Technische Analyse", "📈 Technical Analysis"),
  "learn.technicalDesc": t("Analysiert Kurscharts und Muster, um Trends und Einstiegspunkte zu identifizieren. Nutzt Indikatoren wie gleitende Durchschnitte, RSI, MACD und Bollinger Bänder.", "Analyzes price charts and patterns to identify trends and entry points. Uses indicators like moving averages, RSI, MACD, and Bollinger Bands."),

  // ══════════════════════════════════════════════════════════════
  // SECTION 3: BONDS & FUNDS
  // ══════════════════════════════════════════════════════════════
  "learn.section3Title": t("Anleihen & Fonds", "Bonds & Funds"),

  "learn.bondsTitle": t("Anleihen (Bonds)", "Bonds"),
  "learn.bondsP1": t(
    "<strong>Anleihen</strong> sind Schuldverschreibungen – du leihst einem Unternehmen oder Staat Geld und bekommst dafür regelmäßige Zinszahlungen (Kupon). Am Ende der Laufzeit erhältst du dein Kapital zurück (Nominalwert).",
    "<strong>Bonds</strong> are debt securities – you lend money to a company or government and receive regular interest payments (coupon). At maturity, you get your principal back (face value)."
  ),
  "learn.bondsP2": t(
    "Anleihen gelten als sicherer als Aktien, bieten aber niedrigere Renditen. Wichtige Kennzahlen: <strong>Kupon</strong> (Zinssatz), <strong>Laufzeit</strong> (Duration), <strong>Rating</strong> (Bonität des Emittenten, z. B. AAA bis D) und <strong>Rendite bis Fälligkeit</strong> (Yield to Maturity).",
    "Bonds are generally considered safer than stocks but offer lower returns. Key metrics: <strong>coupon</strong> (interest rate), <strong>duration</strong> (maturity), <strong>rating</strong> (issuer creditworthiness, e.g. AAA to D), and <strong>yield to maturity</strong> (YTM)."
  ),
  "learn.bondsTypes": t("Anleihetypen", "Bond Types"),
  "learn.govBonds": t("Staatsanleihen", "Government Bonds"),
  "learn.govBondsDesc": t("Von Staaten ausgegeben (US Treasuries, deutsche Bundesanleihen). Gelten als sehr sicher.", "Issued by governments (US Treasuries, German Bunds). Considered very safe."),
  "learn.corpBonds": t("Unternehmensanleihen", "Corporate Bonds"),
  "learn.corpBondsDesc": t("Von Unternehmen ausgegeben. Höhere Rendite, aber auch höheres Ausfallrisiko als Staatsanleihen.", "Issued by companies. Higher yield but also higher default risk than government bonds."),
  "learn.highYield": t("High-Yield / Junk Bonds", "High-Yield / Junk Bonds"),
  "learn.highYieldDesc": t("Anleihen mit niedrigem Rating (BB und darunter). Hohe Renditen, aber erhebliches Ausfallrisiko.", "Bonds with low ratings (BB and below). High yields but significant default risk."),
  "learn.bondsInfo": t(
    "Wenn die Zinsen steigen, fallen die Kurse bestehender Anleihen – und umgekehrt. Je länger die Laufzeit, desto stärker der Effekt. Dies nennt man Zinsänderungsrisiko.",
    "When interest rates rise, existing bond prices fall – and vice versa. The longer the duration, the stronger the effect. This is called interest rate risk."
  ),

  "learn.fundsTitle": t("Investmentfonds", "Mutual Funds"),
  "learn.fundsP1": t(
    "<strong>Investmentfonds</strong> sammeln Geld von vielen Anlegern und investieren es nach einer bestimmten Strategie. Im Gegensatz zu ETFs werden sie von einem <strong>Fondsmanager</strong> aktiv verwaltet, der versucht, den Markt zu schlagen.",
    "<strong>Mutual funds</strong> pool money from many investors and invest it according to a specific strategy. Unlike ETFs, they are actively managed by a <strong>fund manager</strong> who tries to beat the market."
  ),
  "learn.fundsComparison": t("ETF vs. aktiver Fonds", "ETF vs. Active Fund"),
  "learn.fundsComparisonDesc": t(
    "Über 90% aller aktiven Fonds schaffen es langfristig nicht, ihren Vergleichsindex nach Kosten zu schlagen (SPIVA-Studie). Der Hauptgrund: Die höheren Gebühren (1,5–2% TER) fressen die Mehrrendite auf. ETFs sind daher für die meisten Anleger die bessere und günstigere Wahl.",
    "Over 90% of active funds fail to beat their benchmark index after fees over the long term (SPIVA study). The main reason: higher fees (1.5–2% TER) eat up any excess returns. ETFs are therefore the better and cheaper choice for most investors."
  ),
  "learn.reitsTitle": t("REITs (Immobilienfonds)", "REITs (Real Estate Investment Trusts)"),
  "learn.reitsP1": t(
    "<strong>REITs</strong> sind börsengehandelte Unternehmen, die in Immobilien investieren und mindestens 90% ihrer Gewinne als Dividende ausschütten müssen. Sie bieten eine einfache Möglichkeit, in Immobilien zu investieren, ohne selbst ein Gebäude kaufen zu müssen.",
    "<strong>REITs</strong> are publicly traded companies that invest in real estate and must distribute at least 90% of their profits as dividends. They offer an easy way to invest in real estate without buying a building yourself."
  ),
  "learn.reitsP2": t(
    "REITs gibt es für Wohnimmobilien, Bürogebäude, Einkaufszentren, Datenzentren, Logistik und mehr. Bekannte REITs: Realty Income, Prologis, Digital Realty.",
    "REITs exist for residential properties, office buildings, shopping centers, data centers, logistics, and more. Well-known REITs: Realty Income, Prologis, Digital Realty."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 4: DERIVATIVES IN DETAIL
  // ══════════════════════════════════════════════════════════════
  "learn.section4Title": t("Derivate im Detail", "Derivatives in Detail"),

  "learn.derivativesIntro": t(
    "<strong>Derivate</strong> sind Finanzinstrumente, deren Wert von einem Basiswert (Underlying) abgeleitet wird – das kann eine Aktie, ein Index, ein Rohstoff oder eine Währung sein. Sie werden zur Spekulation, Absicherung (Hedging) und Arbitrage eingesetzt.",
    "<strong>Derivatives</strong> are financial instruments whose value is derived from an underlying asset – this can be a stock, an index, a commodity, or a currency. They are used for speculation, hedging, and arbitrage."
  ),

  "learn.optionsTitle": t("Optionen", "Options"),
  "learn.optionsP1": t(
    "Eine <strong>Option</strong> gibt dir das <em>Recht</em> (nicht die Pflicht), einen Basiswert zu einem festgelegten Preis (Strike) bis zu einem bestimmten Datum zu kaufen (Call) oder zu verkaufen (Put). Dafür zahlst du eine Prämie.",
    "An <strong>option</strong> gives you the <em>right</em> (not the obligation) to buy (call) or sell (put) an underlying asset at a fixed price (strike) by a certain date. You pay a premium for this right."
  ),
  "learn.optionsCall": t("Call-Option", "Call Option"),
  "learn.optionsCallDesc": t("Recht, einen Basiswert zu kaufen. Du profitierst, wenn der Kurs steigt. Maximaler Verlust: gezahlte Prämie.", "Right to buy an underlying asset. You profit when the price rises. Maximum loss: premium paid."),
  "learn.optionsPut": t("Put-Option", "Put Option"),
  "learn.optionsPutDesc": t("Recht, einen Basiswert zu verkaufen. Du profitierst, wenn der Kurs fällt. Kann als 'Versicherung' gegen Kursverluste genutzt werden.", "Right to sell an underlying asset. You profit when the price falls. Can be used as 'insurance' against price drops."),
  "learn.optionsGreeks": t("Die Griechen (Greeks)", "The Greeks"),
  "learn.optionsGreeksDesc": t(
    "<strong>Delta</strong>: Preisänderung der Option bei $1 Bewegung des Basiswerts. <strong>Gamma</strong>: Änderungsrate von Delta. <strong>Theta</strong>: Zeitwertverfall pro Tag. <strong>Vega</strong>: Sensitivität gegenüber Volatilität. <strong>Rho</strong>: Sensitivität gegenüber Zinsen.",
    "<strong>Delta</strong>: Option price change per $1 move in underlying. <strong>Gamma</strong>: Rate of change of delta. <strong>Theta</strong>: Time decay per day. <strong>Vega</strong>: Sensitivity to volatility. <strong>Rho</strong>: Sensitivity to interest rates."
  ),
  "learn.optionsStrategies": t("Optionsstrategien", "Options Strategies"),
  "learn.coveredCall": t("Covered Call", "Covered Call"),
  "learn.coveredCallDesc": t("Du besitzt die Aktie und verkaufst eine Call-Option darauf. Generiert Prämieneinnahmen, begrenzt aber das Aufwärtspotenzial.", "You own the stock and sell a call option on it. Generates premium income but caps upside potential."),
  "learn.protectivePut": t("Protective Put", "Protective Put"),
  "learn.protectivePutDesc": t("Du kaufst eine Put-Option auf eine Aktie, die du besitzt. Wie eine Versicherung – kostet Prämie, schützt vor starken Verlusten.", "You buy a put option on a stock you own. Like insurance – costs premium but protects against major losses."),
  "learn.straddle": t("Straddle", "Straddle"),
  "learn.straddleDesc": t("Gleichzeitiger Kauf von Call und Put mit gleichem Strike/Datum. Profitiert von starken Bewegungen in beide Richtungen.", "Simultaneous purchase of call and put with same strike/date. Profits from strong moves in either direction."),
  "learn.ironCondor": t("Iron Condor", "Iron Condor"),
  "learn.ironCondorDesc": t("Vier Optionen gleichzeitig – profitiert von Seitwärtsbewegung. Begrenztes Risiko und begrenzter Gewinn. Fortgeschrittene Strategie.", "Four options simultaneously – profits from sideways movement. Limited risk and limited profit. Advanced strategy."),

  "learn.futuresTitle": t("Futures", "Futures"),
  "learn.futuresP1": t(
    "<strong>Futures</strong> sind verbindliche Verträge, einen Basiswert zu einem festgelegten Preis an einem bestimmten Datum in der Zukunft zu kaufen oder zu verkaufen. Im Gegensatz zu Optionen gibt es hier eine <em>Pflicht</em>, nicht nur ein Recht.",
    "<strong>Futures</strong> are binding contracts to buy or sell an underlying asset at a fixed price on a specific future date. Unlike options, there is an <em>obligation</em>, not just a right."
  ),
  "learn.futuresP2": t(
    "Futures werden häufig für Rohstoffe (Öl, Gold, Weizen), Indizes (S&P 500 E-mini) und Währungen gehandelt. Sie nutzen <strong>Hebel (Leverage)</strong> – du hinterlegst nur eine Margin (Sicherheitsleistung), kontrollierst aber einen viel größeren Vertragswert.",
    "Futures are commonly traded for commodities (oil, gold, wheat), indices (S&P 500 E-mini), and currencies. They use <strong>leverage</strong> – you deposit only a margin, but control a much larger contract value."
  ),
  "learn.futuresWarning": t(
    "Futures sind hochriskant! Durch den Hebel kannst du mehr verlieren als dein eingesetztes Kapital. Sie sind kein geeignetes Instrument für Privatanleger ohne Erfahrung.",
    "Futures are high-risk! Due to leverage, you can lose more than your invested capital. They are not suitable for retail investors without experience."
  ),

  "learn.cfdsTitle": t("CFDs (Contracts for Difference)", "CFDs (Contracts for Difference)"),
  "learn.cfdsP1": t(
    "<strong>CFDs</strong> sind Differenzkontrakte – du spekulierst auf die Kursbewegung eines Basiswerts, ohne ihn tatsächlich zu besitzen. Du kannst long (auf steigende Kurse) oder short (auf fallende Kurse) gehen.",
    "<strong>CFDs</strong> are contracts for difference – you speculate on the price movement of an underlying asset without actually owning it. You can go long (betting on rising prices) or short (betting on falling prices)."
  ),
  "learn.cfdsP2": t(
    "CFDs bieten hohe Hebel (z. B. 1:30 für Aktien in der EU), was sowohl Gewinne als auch Verluste vervielfacht. Über 70% der Privatanleger verlieren Geld mit CFDs!",
    "CFDs offer high leverage (e.g. 1:30 for stocks in the EU), which multiplies both profits and losses. Over 70% of retail investors lose money with CFDs!"
  ),
  "learn.cfdsWarning": t(
    "CFDs sind das riskanteste Finanzprodukt für Privatanleger. In einigen Ländern sind sie verboten (USA). Die EU hat zum Schutz Hebelbeschränkungen eingeführt. Niemals ohne fundiertes Wissen und striktes Risikomanagement handeln!",
    "CFDs are the riskiest financial product for retail investors. They are banned in some countries (US). The EU has introduced leverage limits for protection. Never trade without solid knowledge and strict risk management!"
  ),

  "learn.warrantsTitle": t("Optionsscheine (Warrants)", "Warrants"),
  "learn.warrantsP1": t(
    "<strong>Optionsscheine</strong> sind von Banken emittierte Derivate, die ähnlich wie Optionen funktionieren, aber einige wichtige Unterschiede haben: Sie haben ein Emittentenrisiko (die Bank kann ausfallen), sind oft weniger transparent bei der Preisbildung und haben in der Regel eine längere Laufzeit.",
    "<strong>Warrants</strong> are bank-issued derivatives that work similarly to options but with key differences: they carry issuer risk (the bank can default), pricing is often less transparent, and they typically have longer maturities."
  ),
  "learn.warrantsP2": t(
    "Besonders in Deutschland und der Schweiz sind Optionsscheine sehr beliebt, obwohl echte börsengehandelte Optionen oft fairer gepreist sind.",
    "Warrants are particularly popular in Germany and Switzerland, although exchange-traded options are often more fairly priced."
  ),

  "learn.certificatesTitle": t("Zertifikate", "Structured Products / Certificates"),
  "learn.certificatesP1": t(
    "<strong>Zertifikate</strong> sind strukturierte Produkte, die von Banken ausgegeben werden. Sie kombinieren verschiedene Finanzinstrumente und können nahezu jede Auszahlungsstruktur abbilden: Bonus-Zertifikate, Discount-Zertifikate, Knock-out-Zertifikate, Faktor-Zertifikate etc.",
    "<strong>Certificates</strong> (structured products) are bank-issued instruments that combine various financial products and can replicate almost any payoff structure: bonus certificates, discount certificates, knock-out certificates, factor certificates, etc."
  ),
  "learn.certificatesP2": t(
    "Zertifikate tragen immer ein <strong>Emittentenrisiko</strong>: Wenn die ausgebende Bank insolvent wird, kann dein gesamtes Investment verloren gehen (Lehman Brothers 2008!). Zudem sind die eingebetteten Kosten oft intransparent.",
    "Certificates always carry <strong>issuer risk</strong>: if the issuing bank goes bankrupt, your entire investment can be lost (Lehman Brothers 2008!). Also, embedded costs are often not transparent."
  ),

  "learn.derivativesSummary": t(
    "Derivate sind mächtige Werkzeuge, aber sie erfordern tiefes Verständnis. Für die meisten Privatanleger sind sie unnötig und gefährlich. Lerne erst gründlich die Grundlagen, bevor du dich an Derivate wagst.",
    "Derivatives are powerful tools, but they require deep understanding. For most retail investors, they are unnecessary and dangerous. Master the basics thoroughly before venturing into derivatives."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 5: CRYPTO & ALTERNATIVES
  // ══════════════════════════════════════════════════════════════
  "learn.section5Title": t("Krypto & Alternative Anlagen", "Crypto & Alternative Assets"),

  "learn.cryptoTitle": t("Kryptowährungen", "Cryptocurrencies"),
  "learn.cryptoP1": t(
    "<strong>Kryptowährungen</strong> sind digitale Währungen auf Blockchain-Basis. <strong>Bitcoin</strong> (2009) war die erste und ist die wertvollste. <strong>Ethereum</strong> ermöglicht Smart Contracts und dezentrale Anwendungen (DeFi, NFTs).",
    "<strong>Cryptocurrencies</strong> are digital currencies based on blockchain technology. <strong>Bitcoin</strong> (2009) was the first and remains the most valuable. <strong>Ethereum</strong> enables smart contracts and decentralized applications (DeFi, NFTs)."
  ),
  "learn.cryptoP2": t(
    "Krypto ist hochvolatil: Bitcoin schwankte historisch um 60–80% pro Jahr. Die Anlageklasse ist noch jung und weitgehend unreguliert. Als Beimischung (max. 5–10% des Portfolios) können Kryptowährungen zur Diversifikation beitragen.",
    "Crypto is highly volatile: Bitcoin has historically fluctuated 60–80% per year. The asset class is still young and largely unregulated. As a portfolio addition (max 5–10%), cryptocurrencies can contribute to diversification."
  ),
  "learn.cryptoTypes": t("Krypto-Kategorien", "Crypto Categories"),
  "learn.cryptoBtc": t("Bitcoin (BTC)", "Bitcoin (BTC)"),
  "learn.cryptoBtcDesc": t("Digitales Gold / Wertaufbewahrungsmittel. Begrenzt auf 21 Millionen Coins. Größte und bekannteste Kryptowährung.", "Digital gold / store of value. Limited to 21 million coins. Largest and most well-known cryptocurrency."),
  "learn.cryptoEth": t("Ethereum (ETH)", "Ethereum (ETH)"),
  "learn.cryptoEthDesc": t("Plattform für Smart Contracts und dApps. Basis für DeFi, NFTs und Layer-2-Lösungen.", "Platform for smart contracts and dApps. Foundation for DeFi, NFTs, and Layer-2 solutions."),
  "learn.cryptoAlt": t("Altcoins", "Altcoins"),
  "learn.cryptoAltDesc": t("Alle anderen Kryptos: Solana, Cardano, Polkadot etc. Höheres Risiko, höheres Potenzial. Viele scheitern langfristig.", "All other cryptos: Solana, Cardano, Polkadot etc. Higher risk, higher potential. Many fail long-term."),
  "learn.cryptoStable": t("Stablecoins", "Stablecoins"),
  "learn.cryptoStableDesc": t("An Fiat-Währungen gebunden (USDT, USDC). Stabil im Wert, genutzt für Trading und DeFi. Kein Investment, eher Zahlungsmittel.", "Pegged to fiat currencies (USDT, USDC). Stable in value, used for trading and DeFi. Not an investment, more a payment method."),

  "learn.commoditiesTitle": t("Rohstoffe", "Commodities"),
  "learn.commoditiesP1": t(
    "<strong>Rohstoffe</strong> umfassen Edelmetalle (Gold, Silber), Energieträger (Öl, Gas), Industriemetalle (Kupfer, Lithium) und Agrarprodukte (Weizen, Kaffee). Gold gilt traditionell als sicherer Hafen in Krisenzeiten.",
    "<strong>Commodities</strong> include precious metals (gold, silver), energy (oil, gas), industrial metals (copper, lithium), and agricultural products (wheat, coffee). Gold is traditionally considered a safe haven during crises."
  ),
  "learn.commoditiesP2": t(
    "Du kannst in Rohstoffe investieren über: physischen Kauf (Goldbarren), Rohstoff-ETFs/ETCs, Aktien von Rohstoffunternehmen oder Futures-Kontrakte (für Fortgeschrittene).",
    "You can invest in commodities through: physical purchase (gold bars), commodity ETFs/ETCs, shares of commodity companies, or futures contracts (for advanced investors)."
  ),

  "learn.altInvestTitle": t("Weitere Alternative Anlagen", "Other Alternative Investments"),
  "learn.altP2P": t("P2P-Kredite", "P2P Lending"),
  "learn.altP2PDesc": t("Direktkredite an Privatpersonen/Unternehmen über Plattformen. Renditen von 5–12%, aber hohes Ausfallrisiko.", "Direct loans to individuals/businesses via platforms. Returns of 5–12% but high default risk."),
  "learn.altPE": t("Private Equity", "Private Equity"),
  "learn.altPEDesc": t("Beteiligungen an nicht-börsennotierten Unternehmen. Meist nur für institutionelle Investoren oder über spezielle Fonds zugänglich.", "Stakes in private companies. Usually only accessible to institutional investors or through special funds."),
  "learn.altCollectibles": t("Sammlerwerte", "Collectibles"),
  "learn.altCollectiblesDesc": t("Kunst, Uhren, Wein, seltene Sneaker, Oldtimer. Illiquide, schwer zu bewerten, aber potenziell hohe Renditen.", "Art, watches, wine, rare sneakers, vintage cars. Illiquid, hard to value, but potentially high returns."),

  // ══════════════════════════════════════════════════════════════
  // SECTION 6: STRATEGIES
  // ══════════════════════════════════════════════════════════════
  "learn.section6Title": t("Anlagestrategien", "Investment Strategies"),

  "learn.buyHoldTitle": t("Buy & Hold – Langfristiges Investieren", "Buy & Hold – Long-Term Investing"),
  "learn.buyHoldP1": t("Die <strong>Buy & Hold</strong>-Strategie bedeutet, Aktien zu kaufen und über viele Jahre zu halten, unabhängig von kurzfristigen Schwankungen. Historisch hat der Aktienmarkt langfristig im Durchschnitt 7–10% pro Jahr zugelegt.", "The <strong>Buy & Hold</strong> strategy means buying stocks and holding them for many years, regardless of short-term fluctuations. Historically, the stock market has averaged 7–10% annual returns over the long term."),
  "learn.buyHoldP2": t('Warren Buffett: \u201EUnsere bevorzugte Haltedauer ist: f\u00FCr immer.\u201C', 'Warren Buffett: "Our favorite holding period is forever."'),
  "learn.buyHoldInfo": t("Wer 1980 $10.000 in den S&P 500 investiert hätte, hätte heute über $1 Million – allein durch Halten und Reinvestieren der Dividenden.", "If you had invested $10,000 in the S&P 500 in 1980, you would have over $1 million today – just by holding and reinvesting dividends."),

  "learn.dcaTitle": t("Cost-Average-Effekt (Sparplan)", "Dollar-Cost Averaging (DCA)"),
  "learn.dcaP1": t("Beim <strong>Cost-Average-Effekt</strong> investierst du regelmäßig einen festen Betrag. Bei niedrigen Kursen kaufst du mehr Anteile, bei hohen weniger. So glättest du den Einstiegspreis über die Zeit.", "With <strong>Dollar-Cost Averaging</strong>, you invest a fixed amount regularly. When prices are low, you buy more shares; when high, fewer. This smooths your entry price over time."),
  "learn.dcaP2": t("Sparpläne ab 25€/Monat sind bei den meisten Brokern möglich – eine der besten Strategien für Einsteiger.", "Savings plans starting at $25/month are available at most brokers – one of the best strategies for beginners."),
  "learn.dcaInfo": t("Ein monatlicher Sparplan von 200€ in einen MSCI World ETF hätte in den letzten 20 Jahren ein Vermögen von über 100.000€ aufgebaut.", "A monthly savings plan of $200 into an MSCI World ETF would have built a portfolio of over $100,000 in the last 20 years."),

  "learn.valueTitle": t("Value Investing", "Value Investing"),
  "learn.valueP1": t("<strong>Value Investing</strong> bedeutet, unterbewertete Aktien zu finden – Unternehmen, deren Aktienkurs unter ihrem inneren Wert liegt. Man analysiert KGV, KBV, Cashflow und Substanzwert.", "<strong>Value Investing</strong> means finding undervalued stocks – companies whose stock price is below their intrinsic value. You analyze P/E, P/B, cash flow, and book value."),
  "learn.valueP2": t("Berühmte Value-Investoren: Benjamin Graham (\"Der intelligente Investor\"), Warren Buffett, Charlie Munger, Seth Klarman.", "Famous value investors: Benjamin Graham (\"The Intelligent Investor\"), Warren Buffett, Charlie Munger, Seth Klarman."),

  "learn.growthTitle": t("Growth Investing", "Growth Investing"),
  "learn.growthP1": t("<strong>Growth Investing</strong> fokussiert sich auf Unternehmen mit überdurchschnittlichem Wachstum. Diese Aktien haben oft hohe Bewertungen (hohes KGV), aber das Potenzial für starke Kurssteigerungen.", "<strong>Growth Investing</strong> focuses on companies with above-average growth. These stocks often have high valuations (high P/E ratios), but potential for strong price appreciation."),
  "learn.growthP2": t("Beispiele: Apple, Amazon, Nvidia, Tesla – alle waren einmal kleine Growth-Aktien.", "Examples: Apple, Amazon, Nvidia, Tesla – all were once small growth stocks."),

  "learn.dividendStratTitle": t("Dividendenstrategie", "Dividend Strategy"),
  "learn.dividendStratP1": t(
    "Fokus auf Unternehmen mit stabilen, wachsenden Dividenden. <strong>Dividendenaristokraten</strong> haben ihre Dividende mindestens 25 Jahre in Folge erhöht (z. B. Coca-Cola, Johnson & Johnson, P&G).",
    "Focus on companies with stable, growing dividends. <strong>Dividend Aristocrats</strong> have increased their dividend for at least 25 consecutive years (e.g. Coca-Cola, Johnson & Johnson, P&G)."
  ),
  "learn.dividendStratP2": t(
    "Vorteile: Regelmäßiges passives Einkommen, tendenziell geringere Volatilität, Zinseszins-Effekt durch Reinvestition. Ideal für den langfristigen Vermögensaufbau und die Altersvorsorge.",
    "Advantages: Regular passive income, generally lower volatility, compound effect through reinvestment. Ideal for long-term wealth building and retirement planning."
  ),

  "learn.momentumTitle": t("Momentum Investing", "Momentum Investing"),
  "learn.momentumP1": t(
    "<strong>Momentum Investing</strong> kauft Aktien, die bereits steigen, und verkauft fallende. Das Prinzip: \"The trend is your friend.\" Wissenschaftliche Studien bestätigen den Momentum-Effekt als eine der robustesten Marktanomalien.",
    "<strong>Momentum Investing</strong> buys stocks that are already rising and sells falling ones. The principle: \"The trend is your friend.\" Scientific studies confirm the momentum effect as one of the most robust market anomalies."
  ),

  "learn.psychTitle": t("Börsenpsychologie", "Market Psychology"),
  "learn.psychP1": t("Emotionen sind der größte Feind des Investors. <strong>Angst</strong> führt zu Panikverkäufen, <strong>Gier</strong> zu überhöhten Einstiegen bei Hypes.", "Emotions are the investor's greatest enemy. <strong>Fear</strong> leads to panic selling, <strong>greed</strong> leads to buying at inflated prices during hypes."),
  "learn.psychP2": t("Warren Buffett: „Sei ängstlich, wenn andere gierig sind, und gierig, wenn andere ängstlich sind."", "Warren Buffett: \"Be fearful when others are greedy, and greedy when others are fearful.\""),
  "learn.psychBiases": t("Kognitive Verzerrungen (Biases)", "Cognitive Biases"),
  "learn.biasConfirmation": t("Bestätigungsfehler", "Confirmation Bias"),
  "learn.biasConfirmationDesc": t("Du suchst nur nach Informationen, die deine Meinung bestätigen, und ignorierst Gegenargumente.", "You only seek information that confirms your opinion and ignore counterarguments."),
  "learn.biasLossAversion": t("Verlustaversion", "Loss Aversion"),
  "learn.biasLossAversionDesc": t("Verluste schmerzen psychologisch doppelt so stark wie Gewinne gleicher Höhe erfreuen. Führt zu zu langem Halten von Verlustpositionen.", "Losses hurt psychologically twice as much as equivalent gains please. Leads to holding losing positions too long."),
  "learn.biasRecency": t("Recency Bias", "Recency Bias"),
  "learn.biasRecencyDesc": t("Jüngste Ereignisse werden überbewertet. Nach einem Crash glaubt man, es gehe nur noch abwärts; nach einem Boom, nur noch aufwärts.", "Recent events are overweighted. After a crash, you believe it only goes down; after a boom, only up."),
  "learn.biasHerd": t("Herdenverhalten", "Herd Behavior"),
  "learn.biasHerdDesc": t("Man kauft, was alle kaufen (FOMO), und verkauft, wenn alle verkaufen. Oft das Gegenteil der richtigen Strategie.", "You buy what everyone buys (FOMO) and sell when everyone sells. Often the opposite of the right strategy."),
  "learn.psychInfo": t("Die meisten Privatanleger erzielen unterdurchschnittliche Renditen durch emotionale Entscheidungen. Disziplin und ein klarer Plan schlagen Market Timing.", "Most retail investors achieve below-average returns due to emotional decisions. Discipline and a clear plan beat market timing."),

  // ══════════════════════════════════════════════════════════════
  // SECTION 7: TECHNICAL ANALYSIS
  // ══════════════════════════════════════════════════════════════
  "learn.section7Title": t("Technische Analyse", "Technical Analysis"),

  "learn.taIntro": t(
    "Die <strong>Technische Analyse</strong> untersucht historische Kurs- und Volumendaten, um Muster zu erkennen und zukünftige Kursbewegungen vorherzusagen. Im Gegensatz zur Fundamentalanalyse schaut sie nicht auf Unternehmenskennzahlen, sondern ausschließlich auf Charts.",
    "<strong>Technical Analysis</strong> studies historical price and volume data to identify patterns and predict future price movements. Unlike fundamental analysis, it doesn't look at company metrics but exclusively at charts."
  ),

  "learn.chartPatternsTitle": t("Chartmuster", "Chart Patterns"),
  "learn.headShoulders": t("Kopf-Schulter (Head & Shoulders)", "Head & Shoulders"),
  "learn.headShouldersDesc": t("Umkehrmuster: Drei Gipfel, wobei der mittlere (Kopf) der höchste ist. Signalisiert eine Trendwende nach unten.", "Reversal pattern: Three peaks, the middle one (head) being the highest. Signals a trend reversal downward."),
  "learn.doubleTop": t("Doppelter Boden / Doppelte Spitze", "Double Bottom / Double Top"),
  "learn.doubleTopDesc": t("Zwei ähnliche Tiefs/Hochs auf gleicher Höhe. Signalisiert Unterstützung (Boden) oder Widerstand (Spitze).", "Two similar lows/highs at the same level. Signals support (bottom) or resistance (top)."),
  "learn.triangles": t("Dreiecke (Triangles)", "Triangles"),
  "learn.trianglesDesc": t("Aufsteigend (bullisch), absteigend (bärisch) oder symmetrisch. Zeigen Konsolidierung vor einem Ausbruch an.", "Ascending (bullish), descending (bearish), or symmetrical. Indicate consolidation before a breakout."),
  "learn.flagsPennants": t("Flaggen & Wimpel", "Flags & Pennants"),
  "learn.flagsPennantsDesc": t("Kurzfristige Konsolidierungsmuster in einem starken Trend. Signalisieren Trendfortsetzung.", "Short-term consolidation patterns in a strong trend. Signal trend continuation."),

  "learn.indicatorsTitle": t("Technische Indikatoren", "Technical Indicators"),
  "learn.smaEma": t("Gleitende Durchschnitte (SMA/EMA)", "Moving Averages (SMA/EMA)"),
  "learn.smaEmaDesc": t("SMA = einfacher Durchschnitt über X Tage. EMA = exponentiell gewichtet (neuere Daten stärker). 50-Tage und 200-Tage sind die wichtigsten. Golden Cross (50 > 200) = bullisch, Death Cross (50 < 200) = bärisch.", "SMA = simple average over X days. EMA = exponentially weighted (more weight on recent data). 50-day and 200-day are most important. Golden Cross (50 > 200) = bullish, Death Cross (50 < 200) = bearish."),
  "learn.rsi": t("RSI (Relative Strength Index)", "RSI (Relative Strength Index)"),
  "learn.rsiDesc": t("Oszillator von 0–100. Über 70 = überkauft (möglicher Rücksetzer), unter 30 = überverkauft (mögliche Erholung). Standard: 14-Tage-RSI.", "Oscillator from 0–100. Above 70 = overbought (possible pullback), below 30 = oversold (possible recovery). Standard: 14-day RSI."),
  "learn.macd": t("MACD", "MACD"),
  "learn.macdDesc": t("Moving Average Convergence Divergence: Differenz zweier EMAs (12 und 26 Tage). Signallinie = 9-Tage-EMA des MACD. Kreuzungen generieren Kauf-/Verkaufssignale.", "Moving Average Convergence Divergence: difference between two EMAs (12 and 26 days). Signal line = 9-day EMA of MACD. Crossovers generate buy/sell signals."),
  "learn.bollinger": t("Bollinger Bänder", "Bollinger Bands"),
  "learn.bollingerDesc": t("20-Tage-SMA ± 2 Standardabweichungen. Enge Bänder = niedrige Volatilität (Ausbruch erwartet). Kurs am oberen Band = potenziell überkauft.", "20-day SMA ± 2 standard deviations. Narrow bands = low volatility (breakout expected). Price at upper band = potentially overbought."),
  "learn.volume": t("Volumen-Analyse", "Volume Analysis"),
  "learn.volumeDesc": t("Hohes Volumen bestätigt Kursbewegungen. Steigender Kurs bei hohem Volumen = starker Trend. Steigender Kurs bei niedrigem Volumen = schwacher Trend, mögliche Umkehr.", "High volume confirms price movements. Rising price on high volume = strong trend. Rising price on low volume = weak trend, possible reversal."),

  "learn.supportResistance": t("Unterstützung & Widerstand", "Support & Resistance"),
  "learn.supportResistanceP1": t(
    "<strong>Unterstützung</strong> ist ein Kursniveau, bei dem genügend Nachfrage besteht, um den Kursfall zu stoppen. <strong>Widerstand</strong> ist ein Niveau, bei dem genügend Angebot besteht, um den Kursanstieg zu stoppen. Durchbrochene Widerstände werden oft zu Unterstützungen – und umgekehrt.",
    "<strong>Support</strong> is a price level where enough demand exists to stop a price decline. <strong>Resistance</strong> is a level where enough supply exists to stop a price increase. Broken resistance often becomes support – and vice versa."
  ),
  "learn.taWarning": t(
    "Technische Analyse ist keine Kristallkugel! Kein Indikator funktioniert immer. Kombiniere immer mehrere Signale (Konfluenz) und nutze striktes Risikomanagement. Backtesting hilft, Strategien zu validieren.",
    "Technical analysis is not a crystal ball! No indicator works all the time. Always combine multiple signals (confluence) and use strict risk management. Backtesting helps validate strategies."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 8: PORTFOLIO MANAGEMENT
  // ══════════════════════════════════════════════════════════════
  "learn.section8Title": t("Portfoliomanagement", "Portfolio Management"),

  "learn.assetAllocTitle": t("Asset Allocation", "Asset Allocation"),
  "learn.assetAllocP1": t(
    "<strong>Asset Allocation</strong> ist die Verteilung deines Vermögens auf verschiedene Anlageklassen. Sie ist der wichtigste Faktor für deine langfristige Rendite – wichtiger als die Auswahl einzelner Aktien!",
    "<strong>Asset allocation</strong> is the distribution of your wealth across different asset classes. It is the most important factor for your long-term returns – more important than individual stock selection!"
  ),
  "learn.assetAllocModels": t("Klassische Modelle", "Classic Models"),
  "learn.model6040": t("60/40 Portfolio", "60/40 Portfolio"),
  "learn.model6040Desc": t("60% Aktien, 40% Anleihen. Der Klassiker für ausgewogene Risiko-Rendite. In Niedrigzinsphasen weniger attraktiv.", "60% stocks, 40% bonds. The classic balanced risk-return allocation. Less attractive in low-interest environments."),
  "learn.modelAge": t("Altersregel", "Age Rule"),
  "learn.modelAgeDesc": t("100 minus Alter = Aktienanteil in %. Mit 30: 70% Aktien. Mit 60: 40% Aktien. Einfache Faustregel, die mit dem Alter konservativer wird.", "100 minus age = stock percentage. At 30: 70% stocks. At 60: 40% stocks. Simple rule that becomes more conservative with age."),
  "learn.modelAllWeather": t("All-Weather Portfolio (Ray Dalio)", "All-Weather Portfolio (Ray Dalio)"),
  "learn.modelAllWeatherDesc": t("30% Aktien, 40% langfristige Anleihen, 15% mittelfristige Anleihen, 7,5% Gold, 7,5% Rohstoffe. Designed für jede Marktphase.", "30% stocks, 40% long-term bonds, 15% intermediate bonds, 7.5% gold, 7.5% commodities. Designed for every market condition."),

  "learn.rebalancingTitle": t("Rebalancing", "Rebalancing"),
  "learn.rebalancingP1": t(
    "<strong>Rebalancing</strong> bedeutet, dein Portfolio regelmäßig auf die Ziel-Allokation zurückzusetzen. Wenn Aktien stark gestiegen sind, verkaufst du einen Teil und kaufst Anleihen nach (und umgekehrt). Das erzwingt ein systematisches \"Buy Low, Sell High\".",
    "<strong>Rebalancing</strong> means regularly resetting your portfolio to the target allocation. If stocks have risen significantly, you sell some and buy bonds (and vice versa). This enforces a systematic \"buy low, sell high.\""
  ),
  "learn.rebalancingP2": t(
    "Empfohlene Frequenz: jährlich oder bei Abweichungen von >5% von der Ziel-Allokation. Zu häufiges Rebalancing erhöht Transaktionskosten.",
    "Recommended frequency: annually or when deviations exceed >5% from target allocation. Too frequent rebalancing increases transaction costs."
  ),

  "learn.riskMgmtTitle": t("Risikomanagement", "Risk Management"),
  "learn.riskMgmtP1": t(
    "Professionelles Risikomanagement beinhaltet: <strong>Position Sizing</strong> (nie mehr als 5% in eine einzelne Aktie), <strong>Stop-Loss-Orders</strong> (maximalen Verlust pro Position begrenzen), <strong>Korrelationsanalyse</strong> (nicht alle Positionen sollen gleichzeitig fallen) und einen <strong>Notgroschen</strong> (3–6 Monatsgehälter in Cash behalten).",
    "Professional risk management includes: <strong>position sizing</strong> (never more than 5% in a single stock), <strong>stop-loss orders</strong> (limit maximum loss per position), <strong>correlation analysis</strong> (not all positions should fall simultaneously), and an <strong>emergency fund</strong> (keep 3–6 months expenses in cash)."
  ),

  "learn.emergencyFundTitle": t("Notgroschen – Bevor du investierst!", "Emergency Fund – Before You Invest!"),
  "learn.emergencyFundP1": t(
    "Bevor du auch nur einen Euro investierst, solltest du einen <strong>Notgroschen</strong> von 3–6 Netto-Monatsgehältern auf einem Tagesgeldkonto haben. Dieser schützt dich davor, in einer Notlage Investments mit Verlust verkaufen zu müssen.",
    "Before investing a single dollar, you should have an <strong>emergency fund</strong> of 3–6 months' net salary in a savings account. This protects you from having to sell investments at a loss during emergencies."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 9: TAXES & COSTS
  // ══════════════════════════════════════════════════════════════
  "learn.section9Title": t("Steuern & Kosten", "Taxes & Costs"),

  "learn.taxTitle": t("Kapitalertragsteuer", "Capital Gains Tax"),
  "learn.taxP1": t(
    "In Deutschland werden Kapitalerträge mit der <strong>Abgeltungsteuer</strong> von 25% + Solidaritätszuschlag + ggf. Kirchensteuer besteuert. Der effektive Steuersatz liegt bei ca. 26,375%.",
    "Capital gains are subject to tax. In the US, long-term capital gains (held >1 year) are taxed at 0%, 15%, or 20% depending on income. Short-term gains are taxed as ordinary income."
  ),
  "learn.taxP2": t(
    "Jeder Bürger hat einen <strong>Sparerpauschbetrag</strong> von 1.000€ (2.000€ für Ehepaare). Stelle sicher, dass du einen Freistellungsauftrag bei deinem Broker einrichtest!",
    "Tax-advantaged accounts like <strong>401(k)s, IRAs, and Roth IRAs</strong> (or ISAs in the UK) can significantly reduce your tax burden. Make sure to utilize them!"
  ),
  "learn.taxLossHarvesting": t("Tax-Loss Harvesting", "Tax-Loss Harvesting"),
  "learn.taxLossHarvestingDesc": t(
    "Durch den gezielten Verkauf von Verlustpositionen kannst du Gewinne steuerlich verrechnen. In Deutschland werden Verluste aus Aktien mit Gewinnen aus Aktien verrechnet (Verlustverrechnungstopf).",
    "By strategically selling losing positions, you can offset gains for tax purposes. This can reduce your tax bill significantly, especially at year-end."
  ),
  "learn.taxInfo": t("Vergiss nicht den Freistellungsauftrag! Ohne ihn werden sofort Steuern auf alle Erträge abgezogen.", "Don't forget tax-loss harvesting! Selling investments at a loss to offset gains can reduce your tax bill significantly."),

  "learn.costsTitle": t("Gebühren & Kosten", "Fees & Costs"),
  "learn.costsP1": t(
    "Gebühren fressen Rendite – besonders langfristig. Die wichtigsten: <strong>Ordergebühren</strong> (je Trade), <strong>Depotgebühren</strong> (jährlich), <strong>Spread</strong> (Geld-Brief-Spanne), <strong>TER</strong> (Total Expense Ratio bei ETFs/Fonds) und <strong>Performance Fee</strong> (bei Hedgefonds).",
    "Fees eat into returns – especially long-term. The most important: <strong>trading commissions</strong> (per trade), <strong>account fees</strong> (annual), <strong>spread</strong> (bid-ask), <strong>TER</strong> (Total Expense Ratio for ETFs/funds), and <strong>performance fee</strong> (for hedge funds)."
  ),
  "learn.costsP2": t("Vergleiche Broker: Neobroker (Trade Republic, Scalable Capital) bieten oft 0–1€ pro Trade. Traditionelle Banken: 5–20€ pro Trade.", "Compare brokers: discount brokers (Fidelity, Schwab, IBKR) often offer $0 commissions. Traditional banks: $5–20 per trade."),
  "learn.costsInfo": t(
    "Ein ETF mit 0,2% TER kostet bei 100.000€ nur 200€/Jahr. Ein aktiver Fonds mit 1,5% TER: 1.500€/Jahr. Über 30 Jahre summiert sich das zu zehntausenden Euro Unterschied!",
    "An ETF with 0.2% TER costs only $200/year on $100,000. An active fund with 1.5% TER: $1,500/year. Over 30 years, this difference amounts to tens of thousands of dollars!"
  ),

  "learn.compoundTitle": t("Die Macht des Zinseszins", "The Power of Compound Interest"),
  "learn.compoundP1": t("Albert Einstein nannte den Zinseszins das \"achte Weltwunder\". Wenn du Gewinne reinvestierst, wächst dein Vermögen exponentiell.", "Albert Einstein called compound interest the \"eighth wonder of the world.\" When you reinvest your gains, your wealth grows exponentially."),
  "learn.compoundP2": t("Beispiel: 10.000€ mit 8% Rendite → 21.600€ (10 J.) → 46.600€ (20 J.) → 100.600€ (30 J.). Ohne zusätzliche Einzahlung!", "Example: $10,000 at 8% → $21,600 (10y) → $46,600 (20y) → $100,600 (30y). Without any additional contributions!"),
  "learn.compoundInfo": t("Nutze unseren Zinseszins-Rechner unter \"Rechner\" um dein persönliches Wachstum zu simulieren!", "Use our compound interest calculator under \"Tools\" to simulate your personal growth!"),

  "learn.brokerTitle": t("Den richtigen Broker wählen", "Choosing the Right Broker"),
  "learn.brokerP1": t("Ein Broker ist der Vermittler, über den du Wertpapiere kaufst und verkaufst. Die richtige Wahl kann langfristig tausende Euro sparen.", "A broker is the intermediary through which you buy and sell securities. The right choice can save you thousands in the long run."),
  "learn.brokerP2": t("Achte auf: Ordergebühren, Sparplan-Konditionen, Handelsplätze, Benutzerfreundlichkeit, Einlagensicherung und verfügbare Produkte.", "Pay attention to: trading fees, savings plan options, exchanges, user-friendliness, deposit protection, and available products."),
  "learn.brokerTypes": t("Broker-Typen", "Broker Types"),
  "learn.neobroker": t("Neobroker", "Discount/App Brokers"),
  "learn.neobrokerDesc": t("Trade Republic, Scalable Capital, Smartbroker. Günstig (0–1€/Trade), gute Apps, aber limitierte Handelsplätze.", "Trade Republic, Robinhood, Webull. Cheap ($0/trade), good apps, but limited exchanges."),
  "learn.onlinebroker": t("Online-Broker", "Online Brokers"),
  "learn.onlinebrokerDesc": t("ING, Comdirect, Consorsbank. Mehr Handelsplätze, höhere Gebühren, besserer Service.", "Fidelity, Schwab, E*Trade. More exchanges, moderate fees, better service."),
  "learn.probroker": t("Profi-Broker", "Professional Brokers"),
  "learn.probrokerDesc": t("Interactive Brokers, DEGIRO. Niedrige Gebühren, weltweiter Zugang, komplexe Plattform. Für aktive Trader und Fortgeschrittene.", "Interactive Brokers, DEGIRO. Low fees, global access, complex platform. For active traders and advanced investors."),

  "learn.popularEtfs": t("Beliebte ETFs", "Popular ETFs"),
  "learn.quoteTitle": t("📌 Zitat", "📌 Quote"),
};
