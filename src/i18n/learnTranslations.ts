import type { Language } from "@/contexts/LanguageContext";
import { learnTranslationsExtended } from "./learnTranslationsExtended";

const t = (de: string, en: string): Record<Language, string> => ({ de, en });

const baseTranslations: Record<string, Record<Language, string>> = {
  // ── Badge & Header ──
  "learn.badge": t("Finanzwissen", "Financial Knowledge"),
  "learn.title": t("Dein Weg zum informierten Investor", "Your Path to Becoming an Informed Investor"),
  "learn.subtitle": t(
    "Von den absoluten Grundlagen bis hin zu fortgeschrittenen Strategien und Derivaten. Ein umfassender Leitfaden für jedes Wissenslevel.",
    "From absolute basics to advanced strategies and derivatives. A comprehensive guide for every knowledge level."
  ),
  "learn.toc": t("Inhaltsverzeichnis", "Table of Contents"),
  "learn.disclaimer": t(
    "⚠️ Diese Informationen dienen ausschließlich zu Bildungszwecken und stellen keine Anlageberatung dar. Investieren birgt Risiken. Informiere dich gründlich und ziehe bei Bedarf einen Finanzberater hinzu.",
    "⚠️ This information is for educational purposes only and does not constitute investment advice. Investing involves risks. Do thorough research and consult a financial advisor if needed."
  ),
  "learn.goodToKnow": t("Gut zu wissen", "Good to Know"),
  "learn.goldenRule": t("Goldene Regel", "Golden Rule"),
  "learn.warning": t("⚠️ Warnung", "⚠️ Warning"),
  "learn.tipTitle": t("💡 Tipp", "💡 Tip"),
  "learn.example": t("📌 Beispiel", "📌 Example"),
  "learn.levelBeginner": t("🟢 Einsteiger", "🟢 Beginner"),
  "learn.levelIntermediate": t("🟡 Fortgeschritten", "🟡 Intermediate"),
  "learn.levelAdvanced": t("🔴 Experte", "🔴 Expert"),
  "learn.levelExpert": t("🟣 Profi", "🟣 Expert+"),

  // ── Obersektion Headers ──
  "learn.superA": t("Einstieg", "Getting Started"),
  "learn.superB": t("Aufbau", "Building Knowledge"),
  "learn.superC": t("Fortgeschritten", "Advanced"),
  "learn.superD": t("Experte", "Expert"),

  // ── TOC ──
  "learn.toc1": t("Grundlagen der Finanzen", "Financial Basics"),
  "learn.toc2": t("Aktien & ETFs", "Stocks & ETFs"),
  "learn.toc3": t("Anlagestrategien", "Investment Strategies"),
  "learn.toc4": t("Steuern & Kosten", "Taxes & Costs"),
  "learn.toc5": t("Dein erstes Investment", "Your First Investment"),
  "learn.toc6": t("Anleihen & Fonds", "Bonds & Funds"),
  "learn.toc7": t("Krypto & Alternative Anlagen", "Crypto & Alternatives"),
  "learn.toc8": t("Portfoliomanagement", "Portfolio Management"),
  "learn.toc9": t("Aktienanalyse in der Praxis", "Stock Analysis in Practice"),
  "learn.toc10": t("Technische Analyse", "Technical Analysis"),
  "learn.toc11": t("Derivate im Detail", "Derivatives in Detail"),
  "learn.toc12": t("Formeln & Expertenwissen", "Formulas & Expert Knowledge"),
  "learn.toc13": t("Marktmikrostruktur & Trading", "Market Microstructure & Trading"),
  "learn.toc14": t("Verhaltensökonomie & Marktanomalien", "Behavioral Finance & Anomalies"),
  "learn.toc15": t("Globale Märkte & Makroökonomie", "Global Markets & Macro"),
  "learn.toc16": t("Quantitative Analyse", "Quantitative Analysis"),

  // ── Calculator cross-links ──
  "learn.relatedCalc": t("🧮 Passender Rechner", "🧮 Related Calculator"),
  "learn.tryCalculator": t("Jetzt ausprobieren →", "Try it now →"),

  // ══════════════════════════════════════════════════════════════
  // SECTION 1: BASICS
  // ══════════════════════════════════════════════════════════════
  "learn.section1Title": t("Grundlagen der Finanzen", "Financial Basics"),

  "learn.marketsTitle": t("Was sind Finanzmärkte?", "What Are Financial Markets?"),
  "learn.marketsP1": t(
    "Finanzmärkte sind Orte, ob physisch oder digital, an denen Käufer und Verkäufer Finanzinstrumente handeln. Sie bilden das Herzstück der modernen Wirtschaft und ermöglichen es Unternehmen, Kapital aufzunehmen, während Investoren ihr Vermögen vermehren können.",
    "Financial markets are places, whether physical or digital, where buyers and sellers trade financial instruments. They form the heart of the modern economy, enabling companies to raise capital while investors grow their wealth."
  ),
  "learn.marketsP2": t(
    "Die wichtigsten Finanzmärkte sind: <strong>Aktienmärkte</strong> (NYSE, NASDAQ, XETRA, Tokioter Börse), <strong>Anleihemärkte</strong> (der größte Markt der Welt nach Volumen), <strong>Devisenmärkte</strong> (Forex, mit $7,5 Billionen täglichem Handelsvolumen) und <strong>Rohstoffmärkte</strong> (Gold, Öl, Weizen etc.).",
    "The most important financial markets are: <strong>stock markets</strong> (NYSE, NASDAQ, XETRA, Tokyo Stock Exchange), <strong>bond markets</strong> (the largest market in the world by volume), <strong>foreign exchange markets</strong> (Forex, with $7.5 trillion in daily trading volume), and <strong>commodity markets</strong> (gold, oil, wheat, etc.)."
  ),
  "learn.marketsP3": t(
    "Die <strong>Marktkapitalisierung</strong> aller börsennotierten Unternehmen weltweit beträgt über <strong>$100 Billionen</strong>. Die größten Börsen: NYSE ($25T), NASDAQ ($22T), Shanghai ($7T), Euronext ($7T).",
    "The <strong>market capitalization</strong> of all publicly listed companies worldwide exceeds <strong>$100 trillion</strong>. Largest exchanges: NYSE ($25T), NASDAQ ($22T), Shanghai ($7T), Euronext ($7T)."
  ),
  "learn.marketsInfo": t(
    "Die Börse hat historisch eine durchschnittliche jährliche Rendite von ~10% erzielt (S&P 500 seit 1926). Nach Abzug der Inflation bleiben ~7% reale Rendite.",
    "The stock market has historically returned ~10% annually (S&P 500 since 1926). After adjusting for inflation, that's ~7% in real returns."
  ),

  "learn.basicsTitle": t("Wichtige Grundbegriffe", "Essential Terms"),
  "learn.term.marketCap": t("Marktkapitalisierung", "Market Capitalization"),
  "learn.term.marketCapDesc": t("Gesamtwert aller ausgegebenen Aktien (Aktienpreis × Anzahl der Aktien)", "Total value of all issued shares (share price × number of shares)"),
  "learn.term.dividend": t("Dividende", "Dividend"),
  "learn.term.dividendDesc": t("Gewinnausschüttung an Aktionäre, meist quartalsweise", "Profit distribution to shareholders, usually quarterly"),
  "learn.term.pe": t("KGV (Kurs-Gewinn-Verhältnis)", "P/E Ratio"),
  "learn.term.peDesc": t("Aktienkurs geteilt durch Gewinn pro Aktie. Dient als zentraler Bewertungsmaßstab.", "Share price divided by earnings per share. Serves as a key valuation metric."),
  "learn.term.eps": t("EPS (Gewinn pro Aktie)", "EPS (Earnings Per Share)"),
  "learn.term.epsDesc": t("Nettogewinn geteilt durch die Anzahl ausstehender Aktien", "Net income divided by the number of outstanding shares"),
  "learn.term.beta": t("Beta", "Beta"),
  "learn.term.betaDesc": t("Misst die Volatilität einer Aktie im Vergleich zum Gesamtmarkt", "Measures a stock's volatility compared to the overall market"),
  "learn.term.volatility": t("Volatilität", "Volatility"),
  "learn.term.volatilityDesc": t("Schwankungsbreite eines Kurses. Höhere Volatilität bedeutet mehr Risiko.", "Range of price fluctuations. Higher volatility means more risk."),
  "learn.term.liquidity": t("Liquidität", "Liquidity"),
  "learn.term.liquidityDesc": t("Wie einfach ein Wertpapier gehandelt werden kann, ohne den Preis zu beeinflussen", "How easily a security can be traded without affecting the price"),
  "learn.term.bullBear": t("Bulle & Bär", "Bull & Bear"),
  "learn.term.bullBearDesc": t("Bulle steht für steigende Märkte, Bär für fallende Märkte", "Bull represents rising markets, Bear represents falling markets"),
  "learn.term.roe": t("ROE (Eigenkapitalrendite)", "ROE (Return on Equity)"),
  "learn.term.roeDesc": t("Nettogewinn geteilt durch Eigenkapital. Zeigt die Profitabilität für Aktionäre.", "Net income divided by equity. Shows profitability for shareholders."),
  "learn.term.freeCashFlow": t("Freier Cashflow", "Free Cash Flow"),
  "learn.term.freeCashFlowDesc": t("Operativer Cashflow minus Investitionen. Das ist das Geld, das einem Unternehmen wirklich übrig bleibt.", "Operating cash flow minus capital expenditures. This is the money that's truly left over for a company."),
  "learn.term.spread": t("Spread (Geld-Brief-Spanne)", "Spread (Bid-Ask)"),
  "learn.term.spreadDesc": t("Differenz zwischen Kauf- und Verkaufskurs eines Wertpapiers", "Difference between buy and sell price of a security"),

  "learn.riskTitle": t("Risiko verstehen", "Understanding Risk"),
  "learn.riskP1": t(
    "<strong>Risiko und Rendite</strong> sind untrennbar verbunden. Höhere potenzielle Renditen gehen immer mit höherem Risiko einher. Das wichtigste Prinzip: <strong>Nie mehr investieren, als man bereit ist zu verlieren.</strong>",
    "<strong>Risk and return</strong> are inseparable. Higher potential returns always come with higher risk. The most important principle: <strong>Never invest more than you're willing to lose.</strong>"
  ),
  "learn.riskP2": t(
    "Es gibt verschiedene <strong>Risikokategorien</strong>: <strong>Marktrisiko</strong> (der Gesamtmarkt fällt), <strong>Unternehmensrisiko</strong> (ein einzelnes Unternehmen scheitert), <strong>Liquiditätsrisiko</strong> (man kann nicht zum gewünschten Preis verkaufen), <strong>Währungsrisiko</strong> (bei ausländischen Investments) und <strong>Inflationsrisiko</strong> (die Kaufkraft sinkt).",
    "There are different <strong>risk categories</strong>: <strong>market risk</strong> (overall market declines), <strong>company risk</strong> (individual company fails), <strong>liquidity risk</strong> (can't sell at desired price), <strong>currency risk</strong> (with foreign investments), and <strong>inflation risk</strong> (purchasing power decreases)."
  ),
  "learn.riskP3": t(
    "<strong>Diversifikation</strong> ist der Schlüssel zur Risikominimierung: Verteile dein Investment über verschiedene Anlageklassen, Sektoren und Regionen. Als Faustregel gelten mindestens 15 bis 20 verschiedene Aktien aus verschiedenen Branchen, oder noch einfacher: breit gestreute ETFs.",
    "<strong>Diversification</strong> is the key to risk reduction: Spread your investment across different asset classes, sectors, and regions. A good rule of thumb is at least 15 to 20 different stocks from various industries, or even simpler: broadly diversified ETFs."
  ),
  "learn.riskInfo": t(
    "Investiere nie Geld, das du in den nächsten 3 bis 5 Jahren brauchst. Baue zuerst einen Notfallfonds (3 bis 6 Monatsausgaben) auf, bevor du investierst.",
    "Never invest money you'll need in the next 3 to 5 years. Build an emergency fund (3 to 6 months of expenses) before investing."
  ),

  "learn.orderTypesTitle": t("Ordertypen im Überblick", "Order Types Overview"),
  "learn.orderTypesP1": t(
    "Wenn du eine Aktie kaufen oder verkaufen willst, musst du eine Order aufgeben. Es gibt verschiedene Typen:",
    "When you want to buy or sell a stock, you need to place an order. There are different types:"
  ),
  "learn.orderMarket": t("Market Order", "Market Order"),
  "learn.orderMarketDesc": t("Sofortige Ausführung zum aktuellen Marktpreis. Der einfachste Ordertyp.", "Immediate execution at current market price. The simplest order type."),
  "learn.orderLimit": t("Limit Order", "Limit Order"),
  "learn.orderLimitDesc": t("Wird nur zum festgelegten Preis oder besser ausgeführt. Du behältst die Kontrolle über den Preis.", "Only executed at the set price or better. You keep control over the price."),
  "learn.orderStopLoss": t("Stop-Loss Order", "Stop-Loss Order"),
  "learn.orderStopLossDesc": t("Automatischer Verkauf bei Erreichen eines festgelegten Kurses. Schützt vor großen Verlusten.", "Automatic sell when price reaches set level. Protects against large losses."),
  "learn.orderTrailingStop": t("Trailing Stop", "Trailing Stop"),
  "learn.orderTrailingStopDesc": t("Der Stop-Preis bewegt sich mit dem Kurs nach oben und sichert so Gewinne ab.", "The stop price moves up with the price, locking in gains along the way."),

  // ══════════════════════════════════════════════════════════════
  // SECTION 2: STOCKS & ETFs
  // ══════════════════════════════════════════════════════════════
  "learn.section2Title": t("Aktien & ETFs", "Stocks & ETFs"),

  "learn.stocksTitle": t("Aktien verstehen", "Understanding Stocks"),
  "learn.stocksP1": t(
    "Eine <strong>Aktie</strong> repräsentiert einen Eigentumsanteil an einem Unternehmen. Wenn du eine Apple-Aktie kaufst, gehört dir ein winziger Teil von Apple. Als Aktionär profitierst du von <strong>Kurssteigerungen</strong> und <strong>Dividenden</strong>.",
    "A <strong>stock</strong> represents an ownership share in a company. When you buy an Apple stock, you own a tiny part of Apple. As a shareholder, you benefit from <strong>price appreciation</strong> and <strong>dividends</strong>."
  ),
  "learn.stocksP2": t(
    "Aktien werden an Börsen gehandelt. Die wichtigsten sind NYSE, NASDAQ (USA), XETRA (Deutschland), LSE (London) und TSE (Tokio).",
    "Stocks are traded on exchanges. The most important ones are NYSE, NASDAQ (USA), XETRA (Germany), LSE (London), and TSE (Tokyo)."
  ),
  "learn.stocksPros": t("Vorteile", "Advantages"),
  "learn.stocksCons": t("Nachteile", "Disadvantages"),
  "learn.stocksPro1": t("Langfristig höchste Rendite aller Anlageklassen (~10%/Jahr)", "Highest long-term returns of all asset classes (~10%/year)"),
  "learn.stocksPro2": t("Hohe Liquidität, jederzeit kauf- und verkaufbar", "High liquidity, can buy and sell anytime"),
  "learn.stocksPro3": t("Inflationsschutz durch Sachwertbeteiligung", "Inflation protection through real asset ownership"),
  "learn.stocksPro4": t("Dividenden als passives Einkommen", "Dividends as passive income"),
  "learn.stocksCon1": t("Kurzfristig hohe Volatilität möglich", "Short-term high volatility possible"),
  "learn.stocksCon2": t("Totalverlust bei Unternehmensinsolvenz", "Total loss in case of company bankruptcy"),
  "learn.stocksCon3": t("Emotionale Fallstricke wie Panikverkäufe", "Emotional pitfalls like panic selling"),
  "learn.stocksCon4": t("Zeitaufwand für Research und Überwachung", "Time required for research and monitoring"),

  "learn.stockTypesTitle": t("Aktientypen", "Stock Types"),
  "learn.blueChip": t("Blue-Chip Aktien", "Blue-Chip Stocks"),
  "learn.blueChipDesc": t("Große, etablierte Unternehmen mit stabilen Gewinnen (Apple, Microsoft, J&J)", "Large, established companies with stable earnings (Apple, Microsoft, J&J)"),
  "learn.growthStocks": t("Wachstumsaktien", "Growth Stocks"),
  "learn.growthStocksDesc": t("Unternehmen mit hohem Umsatzwachstum, oft ohne Dividende (NVIDIA, Tesla)", "Companies with high revenue growth, often no dividend (NVIDIA, Tesla)"),
  "learn.dividendStocks": t("Dividendenaktien", "Dividend Stocks"),
  "learn.dividendStocksDesc": t("Unternehmen mit regelmäßiger, steigender Dividende (Coca-Cola, P&G)", "Companies with regular, growing dividends (Coca-Cola, P&G)"),
  "learn.pennyStocks": t("Penny Stocks", "Penny Stocks"),
  "learn.pennyStocksDesc": t("Aktien unter $5, sehr spekulativ mit hohem Manipulationsrisiko und oft illiquide", "Stocks under $5, very speculative with high manipulation risk and often illiquid"),

  "learn.etfTitle": t("ETFs – Exchange Traded Funds", "ETFs – Exchange Traded Funds"),
  "learn.etfP1": t(
    "Ein <strong>ETF</strong> ist ein Fonds, der an der Börse gehandelt wird und einen Index, Sektor oder eine Anlageklasse abbildet. Mit einem einzigen Kauf investierst du in hunderte oder tausende Wertpapiere gleichzeitig.",
    "An <strong>ETF</strong> is a fund traded on exchanges that tracks an index, sector, or asset class. With a single purchase, you invest in hundreds or thousands of securities at once."
  ),
  "learn.etfP2": t(
    "ETFs haben typischerweise sehr niedrige Kosten (TER: 0,03% bis 0,5% pro Jahr) im Vergleich zu aktiv verwalteten Fonds (1% bis 2%).",
    "ETFs typically have very low costs (TER: 0.03% to 0.5% per year) compared to actively managed funds (1% to 2%)."
  ),
  "learn.etfTypes": t("ETF-Typen:", "ETF Types:"),
  "learn.etfIndex": t("Index-ETFs", "Index ETFs"),
  "learn.etfIndexDesc": t("Bilden einen Marktindex ab (z.B. S&P 500, MSCI World)", "Track a market index (e.g. S&P 500, MSCI World)"),
  "learn.etfSector": t("Sektor-ETFs", "Sector ETFs"),
  "learn.etfSectorDesc": t("Fokus auf bestimmte Branchen (Tech, Healthcare, Energy)", "Focus on specific industries (Tech, Healthcare, Energy)"),
  "learn.etfBond": t("Anleihen-ETFs", "Bond ETFs"),
  "learn.etfBondDesc": t("Investieren in Staats- oder Unternehmensanleihen", "Invest in government or corporate bonds"),
  "learn.etfThematic": t("Themen-ETFs", "Thematic ETFs"),
  "learn.etfThematicDesc": t("Spezielle Trends wie KI, Clean Energy oder Blockchain", "Specific trends like AI, Clean Energy, or Blockchain"),
  "learn.popularEtfs": t("Beliebte ETFs", "Popular ETFs"),
  "learn.etfInfo": t(
    "MSCI World (weltweite Streuung), S&P 500 (500 größte US-Unternehmen), MSCI Emerging Markets (Schwellenländer), Euro Stoxx 50 (Europa)",
    "MSCI World (global diversification), S&P 500 (500 largest US companies), MSCI Emerging Markets (developing countries), Euro Stoxx 50 (Europe)"
  ),

  "learn.analysisTitle": t("Fundamentale vs. Technische Analyse", "Fundamental vs. Technical Analysis"),
  "learn.analysisIntro": t(
    "Es gibt zwei Hauptansätze zur Aktienbewertung:",
    "There are two main approaches to stock valuation:"
  ),
  "learn.fundamentalTitle": t("Fundamentalanalyse", "Fundamental Analysis"),
  "learn.fundamentalDesc": t("Bewertet den inneren Wert anhand von Finanzdaten (KGV, Umsatz, Gewinn)", "Evaluates intrinsic value based on financial data (P/E, revenue, profit)"),
  "learn.technicalTitle": t("Technische Analyse", "Technical Analysis"),
  "learn.technicalDesc": t("Analysiert Kursmuster und Indikatoren, um zukünftige Preise vorherzusagen", "Analyzes price patterns and indicators to predict future prices"),

  // ══════════════════════════════════════════════════════════════
  // SECTION 3: STRATEGIES
  // ══════════════════════════════════════════════════════════════
  "learn.section3Title": t("Anlagestrategien", "Investment Strategies"),

  "learn.buyHoldTitle": t("Buy & Hold", "Buy & Hold"),
  "learn.buyHoldP1": t(
    "<strong>Buy & Hold</strong> ist die einfachste und für die meisten Anleger effektivste Strategie: Kaufe qualitativ hochwertige Aktien oder ETFs und halte sie langfristig (10+ Jahre). Historisch hat der S&P 500 über jeden 20-Jahres-Zeitraum eine positive Rendite erzielt.",
    "<strong>Buy & Hold</strong> is the simplest and most effective strategy for most investors: Buy quality stocks or ETFs and hold them long-term (10+ years). Historically, the S&P 500 has delivered positive returns over every 20-year period."
  ),
  "learn.buyHoldP2": t(
    "\"Die Börse ist ein Instrument, um Geld von den Ungeduldigen zu den Geduldigen zu transferieren.\" (Warren Buffett)",
    "\"The stock market is a device for transferring money from the impatient to the patient.\" (Warren Buffett)"
  ),
  "learn.buyHoldInfo": t(
    "Wer seit 2000 monatlich $500 in den S&P 500 investiert hätte, hätte trotz Dotcom-Crash und Finanzkrise bis 2024 über $500.000 angesammelt.",
    "Someone investing $500 monthly in the S&P 500 since 2000 would have accumulated over $500,000 by 2024, despite the dotcom crash and financial crisis."
  ),

  "learn.dcaTitle": t("Dollar-Cost Averaging (DCA)", "Dollar-Cost Averaging (DCA)"),
  "learn.dcaP1": t(
    "<strong>DCA</strong> bedeutet, regelmäßig einen festen Betrag zu investieren, unabhängig vom aktuellen Kurs. Bei hohen Kursen kaufst du weniger Anteile, bei niedrigen Kursen mehr. Dadurch erzielst du einen günstigen <strong>Durchschnittskosteneffekt</strong>.",
    "<strong>DCA</strong> means investing a fixed amount regularly, regardless of the current price. At high prices you buy fewer shares, at low prices more. This creates a favorable <strong>average cost effect</strong>."
  ),
  "learn.dcaP2": t(
    "DCA eliminiert das Timing-Problem. Studien zeigen, dass selbst professionelle Fondsmanager es selten schaffen, den Markt konsistent zu timen.",
    "DCA eliminates the timing problem. Studies show that even professional fund managers rarely succeed at consistently timing the market."
  ),
  "learn.dcaInfo": t(
    "Richte einen automatischen Sparplan ein (z.B. monatlich $500 in einen MSCI World ETF). Das ist die stressfreiste Art zu investieren.",
    "Set up an automatic savings plan (e.g. $500 monthly into an MSCI World ETF). This is the most stress-free way to invest."
  ),

  "learn.valueTitle": t("Value Investing", "Value Investing"),
  "learn.valueP1": t(
    "<strong>Value Investing</strong> (geprägt von Benjamin Graham, perfektioniert von Warren Buffett) sucht nach Aktien, die unter ihrem inneren Wert handeln. Typische Kennzahlen: niedriges KGV, niedriges KBV, hohe Dividendenrendite und starker Free Cashflow.",
    "<strong>Value Investing</strong> (pioneered by Benjamin Graham, perfected by Warren Buffett) seeks stocks trading below their intrinsic value. Typical metrics: low P/E, low P/B, high dividend yield, and strong free cash flow."
  ),
  "learn.valueP2": t(
    "Der Schlüssel ist die sogenannte \"Margin of Safety\". Kaufe nur, wenn der Preis deutlich unter dem geschätzten fairen Wert liegt.",
    "The key is the so-called \"margin of safety.\" Only buy when the price is significantly below estimated fair value."
  ),

  "learn.growthTitle": t("Growth Investing", "Growth Investing"),
  "learn.growthP1": t(
    "<strong>Growth Investing</strong> fokussiert sich auf Unternehmen mit überdurchschnittlichem Umsatz- und Gewinnwachstum. Diese Aktien haben oft hohe Bewertungen (hohes KGV), da der Markt zukünftiges Wachstum einpreist. Bekannte Beispiele: NVIDIA, Amazon in den Anfangsjahren.",
    "<strong>Growth Investing</strong> focuses on companies with above-average revenue and earnings growth. These stocks often have high valuations (high P/E) as the market prices in future growth. Well-known examples: NVIDIA, Amazon in its early years."
  ),
  "learn.growthP2": t(
    "Das Risiko: Wenn das erwartete Wachstum nicht eintritt, kann der Kurs dramatisch fallen.",
    "The risk: If expected growth doesn't materialize, the price can drop dramatically."
  ),

  "learn.dividendStratTitle": t("Dividendenstrategie", "Dividend Strategy"),
  "learn.dividendStratP1": t(
    "Die <strong>Dividendenstrategie</strong> setzt auf Unternehmen mit konstanter und steigender Dividende. Besonders beliebt sind <strong>Dividend Aristocrats</strong>, also S&P 500-Unternehmen, die ihre Dividende mindestens 25 Jahre in Folge erhöht haben.",
    "The <strong>dividend strategy</strong> focuses on companies with consistent and growing dividends. Especially popular are <strong>Dividend Aristocrats</strong>, S&P 500 companies that have increased their dividend for at least 25 consecutive years."
  ),
  "learn.dividendStratP2": t(
    "Durch den Zinseszinseffekt der Wiederanlage können Dividenden langfristig einen erheblichen Teil der Gesamtrendite ausmachen.",
    "Through the compound interest effect of reinvestment, dividends can account for a significant portion of total returns over time."
  ),

  "learn.momentumTitle": t("Momentum-Strategie", "Momentum Strategy"),
  "learn.momentumP1": t(
    "<strong>Momentum Investing</strong> setzt auf Aktien, die in den letzten 3 bis 12 Monaten stark gestiegen sind, in der Erwartung, dass der Trend anhält. Akademische Studien (Jegadeesh & Titman, 1993) bestätigen den Momentum-Effekt. Das Risiko liegt darin, dass Trendwenden abrupt sein können.",
    "<strong>Momentum Investing</strong> bets on stocks that have risen strongly over the past 3 to 12 months, expecting the trend to continue. Academic studies (Jegadeesh & Titman, 1993) confirm the momentum effect. The risk is that trend reversals can be abrupt."
  ),

  "learn.psychTitle": t("Investmentpsychologie", "Investment Psychology"),
  "learn.psychP1": t(
    "Die größte Hürde beim Investieren sind nicht die Märkte, sondern <strong>deine Emotionen</strong>. Gier lässt dich zu teuer kaufen, Angst lässt dich am Tiefpunkt verkaufen. Die erfolgreichsten Investoren sind diszipliniert und folgen ihrem Plan.",
    "The biggest hurdle in investing isn't the markets, it's <strong>your emotions</strong>. Greed makes you buy too high, fear makes you sell at the bottom. The most successful investors are disciplined and follow their plan."
  ),
  "learn.psychP2": t(
    "\"Sei ängstlich, wenn andere gierig sind, und gierig, wenn andere ängstlich sind.\" (Warren Buffett)",
    "\"Be fearful when others are greedy, and greedy when others are fearful.\" (Warren Buffett)"
  ),
  "learn.psychBiases": t("Kognitive Verzerrungen:", "Cognitive Biases:"),
  "learn.biasConfirmation": t("Bestätigungsfehler", "Confirmation Bias"),
  "learn.biasConfirmationDesc": t("Du suchst nur nach Infos, die deine Meinung bestätigen", "You only seek information that confirms your opinion"),
  "learn.biasLossAversion": t("Verlustaversion", "Loss Aversion"),
  "learn.biasLossAversionDesc": t("Verluste schmerzen etwa 2x stärker als gleichgroße Gewinne freuen", "Losses hurt about 2x more than equal gains bring joy"),
  "learn.biasRecency": t("Aktualitätsfehler", "Recency Bias"),
  "learn.biasRecencyDesc": t("Jüngste Ereignisse werden überbewertet", "Recent events are overweighted"),
  "learn.biasHerd": t("Herdenverhalten", "Herd Behavior"),
  "learn.biasHerdDesc": t("Der Masse folgen statt eigener Analyse", "Following the crowd instead of own analysis"),
  "learn.psychInfo": t(
    "Führe ein Investmenttagebuch! Schreibe bei jedem Kauf und Verkauf auf, warum du die Entscheidung triffst. Das hilft, emotionale Muster zu erkennen.",
    "Keep an investment journal! Write down why you make each buy/sell decision. This helps identify emotional patterns."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 4: TAXES & COSTS
  // ══════════════════════════════════════════════════════════════
  "learn.section4Title": t("Steuern & Kosten", "Taxes & Costs"),

  "learn.taxTitle": t("Steuern auf Kapitalerträge", "Taxes on Capital Gains"),
  "learn.taxP1": t(
    "In Deutschland werden Kapitalerträge mit der <strong>Abgeltungsteuer</strong> von 25% plus Solidaritätszuschlag besteuert (effektiv ~26,375%). Es gibt einen <strong>Sparerpauschbetrag</strong> von 1.000€ pro Person (2.000€ für Paare).",
    "In Germany, capital gains are taxed at the <strong>flat tax rate</strong> of 25% plus solidarity surcharge (effective ~26.375%). There is a <strong>saver's allowance</strong> of €1,000 per person (€2,000 for couples)."
  ),
  "learn.taxP2": t(
    "In den USA gelten <strong>Short-term Capital Gains</strong> (Haltedauer unter 1 Jahr) als reguläres Einkommen (bis 37%). <strong>Long-term Capital Gains</strong> (über 1 Jahr) werden mit 0%, 15% oder 20% besteuert. Das ist ein starker Anreiz für langfristiges Halten.",
    "In the US, <strong>short-term capital gains</strong> (held under 1 year) are taxed as ordinary income (up to 37%). <strong>Long-term capital gains</strong> (over 1 year) are taxed at 0%, 15%, or 20%. This creates a strong incentive for long-term holding."
  ),
  "learn.taxLossHarvesting": t("Tax-Loss Harvesting", "Tax-Loss Harvesting"),
  "learn.taxLossHarvestingDesc": t("Verlustpositionen strategisch verkaufen, um Gewinne steuerlich zu verrechnen", "Strategically selling losing positions to offset gains for tax purposes"),
  "learn.taxInfo": t(
    "Richte deinen Freistellungsauftrag bei deinem Broker ein, um den Sparerpauschbetrag automatisch zu nutzen!",
    "Set up your tax exemption order with your broker to automatically use the saver's allowance!"
  ),

  "learn.costsTitle": t("Handelskosten verstehen", "Understanding Trading Costs"),
  "learn.costsP1": t(
    "Jeder Trade hat Kosten, die deine Rendite schmälern: <strong>Ordergebühren</strong> (0€ bei Neobrokern bis 10€+ bei Filialbanken), <strong>Spread</strong> (Differenz zwischen Kauf- und Verkaufskurs) und <strong>TER</strong> (Total Expense Ratio bei ETFs und Fonds).",
    "Every trade has costs that reduce your returns: <strong>order fees</strong> (€0 at neobrokers to €10+ at traditional banks), <strong>spread</strong> (difference between buy and sell price), and <strong>TER</strong> (Total Expense Ratio for ETFs and funds)."
  ),
  "learn.costsP2": t(
    "Ein Unterschied von 1% p.a. in den Kosten kann über 30 Jahre ~25% der Gesamtrendite ausmachen!",
    "A 1% p.a. difference in costs can amount to ~25% of total returns over 30 years!"
  ),
  "learn.costsInfo": t(
    "Bei einem Sparplan sind die Kosten besonders wichtig. Ein ETF mit 0,07% TER (z.B. Vanguard S&P 500) spart dir über 30 Jahre tausende Euro im Vergleich zu einem Fonds mit 1,5% TER.",
    "For a savings plan, costs are especially important. An ETF with 0.07% TER (e.g. Vanguard S&P 500) saves you thousands over 30 years compared to a fund with 1.5% TER."
  ),

  "learn.compoundTitle": t("Die Macht des Zinseszins", "The Power of Compound Interest"),
  "learn.compoundP1": t(
    "Albert Einstein soll den Zinseszins als 'achtes Weltwunder' bezeichnet haben. Tatsächlich ist der Zinseszinseffekt das wichtigste Konzept für langfristigen Vermögensaufbau.",
    "Albert Einstein allegedly called compound interest the 'eighth wonder of the world.' Indeed, the compound interest effect is the most important concept for long-term wealth building."
  ),
  "learn.compoundP2": t(
    "Beispiel: $10.000 bei 8% Rendite werden nach 30 Jahren zu $100.627. Fängst du 10 Jahre früher an, werden daraus $217.245. Das ist mehr als doppelt so viel!",
    "Example: $10,000 at 8% return becomes $100,627 after 30 years. Start 10 years earlier, and it becomes $217,245. That's more than double!"
  ),
  "learn.compoundInfo": t(
    "Nutze den Zinseszins-Rechner auf unserer Rechner-Seite, um dein persönliches Wachstum zu berechnen!",
    "Use the compound interest calculator on our tools page to calculate your personal growth!"
  ),

  "learn.brokerTitle": t("Den richtigen Broker wählen", "Choosing the Right Broker"),
  "learn.brokerP1": t(
    "Dein Broker ist dein Tor zur Börse. Die Wahl des richtigen Brokers beeinflusst deine Kosten und damit deine Rendite erheblich.",
    "Your broker is your gateway to the stock market. Choosing the right broker significantly impacts your costs and therefore your returns."
  ),
  "learn.brokerP2": t(
    "Wichtige Kriterien: Ordergebühren, Auswahl an handelbaren Wertpapieren, Sparplan-Angebot, Einlagensicherung und Benutzerfreundlichkeit.",
    "Important criteria: Order fees, range of tradeable securities, savings plan options, deposit protection, and user-friendliness."
  ),
  "learn.brokerTypes": t("Broker-Typen:", "Broker Types:"),
  "learn.neobroker": t("Neobroker", "Neobrokers"),
  "learn.neobrokerDesc": t("Günstig (oft 0€ pro Order), App-basiert, eingeschränkte Auswahl (Trade Republic, Scalable Capital)", "Cheap (often €0 per order), app-based, limited selection (Trade Republic, Scalable Capital)"),
  "learn.onlinebroker": t("Online-Broker", "Online Brokers"),
  "learn.onlinebrokerDesc": t("Breite Auswahl, moderate Kosten (ING, comdirect, Consorsbank)", "Wide selection, moderate costs (ING, comdirect, Consorsbank)"),
  "learn.probroker": t("Profi-Broker", "Professional Brokers"),
  "learn.probrokerDesc": t("Niedrigste Kosten für Vieltrader, komplexe Plattformen (Interactive Brokers, DEGIRO)", "Lowest costs for frequent traders, complex platforms (Interactive Brokers, DEGIRO)"),

  // ══════════════════════════════════════════════════════════════
  // SECTION 5: YOUR FIRST INVESTMENT
  // ══════════════════════════════════════════════════════════════
  "learn.section5Title": t("Dein erstes Investment", "Your First Investment"),

  "learn.firstStepsTitle": t("Schritt für Schritt zum ersten Kauf", "Step by Step to Your First Purchase"),
  "learn.firstStep1": t("Notfallfonds aufbauen: 3 bis 6 Monatsausgaben auf einem Tagesgeldkonto ansparen, bevor du investierst.", "Build an emergency fund: Save 3 to 6 months of expenses in a savings account before investing."),
  "learn.firstStep2": t("Broker auswählen: Vergleiche Gebühren, Sparplan-Angebot und Benutzerfreundlichkeit. Für Anfänger sind Neobroker ideal.", "Choose a broker: Compare fees, savings plan offerings, and user-friendliness. Neobrokers are ideal for beginners."),
  "learn.firstStep3": t("Depot eröffnen: Identifizierung per VideoIdent oder PostIdent. Dauert meist 1 bis 3 Werktage.", "Open a brokerage account: Identity verification via VideoIdent or PostIdent. Usually takes 1 to 3 business days."),
  "learn.firstStep4": t("Sparplan einrichten: Starte mit einem breit gestreuten ETF (z.B. MSCI World), bereits ab 25€ pro Monat möglich.", "Set up a savings plan: Start with a broadly diversified ETF (e.g. MSCI World), possible from as little as $25 per month."),
  "learn.firstStep5": t("Geduld haben: Nicht täglich ins Depot schauen. Langfristig denken. Der Markt schwankt und das ist normal.", "Be patient: Don't check your portfolio daily. Think long-term. The market fluctuates and that's normal."),

  "learn.firstMistakesTitle": t("Häufige Anfängerfehler", "Common Beginner Mistakes"),
  "learn.firstMistake1": t("Einzelaktien-Wetten statt breiter Streuung: setze nicht alles auf eine Karte", "Betting on single stocks instead of diversifying: don't put all eggs in one basket"),
  "learn.firstMistake2": t("Market Timing versuchen: Zeit im Markt schlägt Timing des Markts", "Trying to time the market: time in the market beats timing the market"),
  "learn.firstMistake3": t("Panikverkäufe bei Kursrückgängen: Crashs sind Kaufgelegenheiten für langfristige Anleger", "Panic selling during drops: crashes are buying opportunities for long-term investors"),
  "learn.firstMistake4": t("Zu hohe Kosten durch häufiges Handeln: jeder Trade kostet Geld und Steuern", "Too high costs from frequent trading: each trade costs money and taxes"),
  "learn.firstMistake5": t("Investieren ohne Notfallfonds: du brauchst einen finanziellen Puffer für Unerwartetes", "Investing without an emergency fund: you need a financial buffer for the unexpected"),

  "learn.firstPortfolioTitle": t("Einfache Starter-Portfolios", "Simple Starter Portfolios"),
  "learn.starterSimple": t("1-ETF-Portfolio", "1-ETF Portfolio"),
  "learn.starterSimpleDesc": t("100% MSCI World oder FTSE All-World ETF. Maximale Einfachheit mit globaler Streuung über 1.500+ Unternehmen.", "100% MSCI World or FTSE All-World ETF. Maximum simplicity with global diversification across 1,500+ companies."),
  "learn.starterBalanced": t("2-ETF-Portfolio", "2-ETF Portfolio"),
  "learn.starterBalancedDesc": t("70% MSCI World + 30% MSCI Emerging Markets. Breitere Abdeckung inklusive Schwellenländer.", "70% MSCI World + 30% MSCI Emerging Markets. Broader coverage including developing markets."),
  "learn.starterConservative": t("Konservatives Portfolio", "Conservative Portfolio"),
  "learn.starterConservativeDesc": t("60% Aktien-ETF + 40% Anleihen-ETF. Weniger Schwankungen, geeignet für kürzere Anlagezeiträume.", "60% Stock ETF + 40% Bond ETF. Less volatility, suitable for shorter investment horizons."),

  // ══════════════════════════════════════════════════════════════
  // SECTION 6: BONDS & FUNDS
  // ══════════════════════════════════════════════════════════════
  "learn.section6Title": t("Anleihen & Fonds", "Bonds & Funds"),

  "learn.bondsTitle": t("Anleihen verstehen", "Understanding Bonds"),
  "learn.bondsP1": t(
    "Eine <strong>Anleihe</strong> (Bond) ist ein festverzinsliches Wertpapier. Du leihst einem Staat oder Unternehmen Geld und erhältst dafür regelmäßige Zinszahlungen (<strong>Kupon</strong>) plus die Rückzahlung des Nennwerts am Ende der Laufzeit.",
    "A <strong>bond</strong> is a fixed-income security. You lend money to a government or company and receive regular interest payments (<strong>coupon</strong>) plus repayment of face value at maturity."
  ),
  "learn.bondsP2": t(
    "Anleihenpreise und Zinsen bewegen sich <strong>gegenläufig</strong>: Steigen die Zinsen, fallen bestehende Anleihenpreise (und umgekehrt). Die <strong>Rendite bis Fälligkeit</strong> (Yield to Maturity) berücksichtigt Kupon, Kaufpreis und Restlaufzeit.",
    "Bond prices and interest rates move <strong>inversely</strong>: When rates rise, existing bond prices fall (and vice versa). <strong>Yield to Maturity</strong> accounts for coupon, purchase price, and remaining term."
  ),
  "learn.bondsTypes": t("Anleihe-Typen:", "Bond Types:"),
  "learn.govBonds": t("Staatsanleihen", "Government Bonds"),
  "learn.govBondsDesc": t("Gelten als sicherste Anlage. US Treasuries sind der weltweite Benchmark.", "Considered the safest investment. US Treasuries are the global benchmark."),
  "learn.corpBonds": t("Unternehmensanleihen", "Corporate Bonds"),
  "learn.corpBondsDesc": t("Höhere Rendite als Staatsanleihen, aber höheres Ausfallrisiko", "Higher yield than government bonds, but higher default risk"),
  "learn.highYield": t("High-Yield (Junk) Bonds", "High-Yield (Junk) Bonds"),
  "learn.highYieldDesc": t("Anleihen von Unternehmen mit schlechter Bonität. Hohe Rendite bei hohem Risiko.", "Bonds from companies with poor credit. High yield with high risk."),
  "learn.bondsInfo": t(
    "Die 10-jährige US-Staatsanleihe (10Y Treasury) ist der wichtigste Referenzzinssatz der Welt und beeinflusst Hypothekenzinsen, Unternehmenskredite und Aktienbewertungen.",
    "The 10-year US Treasury is the most important reference rate in the world and affects mortgage rates, corporate loans, and stock valuations."
  ),

  "learn.fundsTitle": t("Investmentfonds", "Investment Funds"),
  "learn.fundsP1": t(
    "Ein <strong>Investmentfonds</strong> bündelt das Geld vieler Anleger und investiert es in ein diversifiziertes Portfolio. <strong>Aktiv verwaltete Fonds</strong> haben einen Fondsmanager, der versucht, den Markt zu schlagen. <strong>Passiv verwaltete Fonds</strong> (meist ETFs) bilden einfach einen Index ab.",
    "An <strong>investment fund</strong> pools money from many investors and invests it in a diversified portfolio. <strong>Actively managed funds</strong> have a fund manager trying to beat the market. <strong>Passively managed funds</strong> (mostly ETFs) simply track an index."
  ),
  "learn.fundsComparison": t("Aktiv vs. Passiv", "Active vs. Passive"),
  "learn.fundsComparisonDesc": t("Über 90% der aktiven Fonds schlagen ihren Vergleichsindex nicht über 15 Jahre (SPIVA-Studie). Passiv investieren ist für die meisten Anleger die bessere Wahl.", "Over 90% of active funds fail to beat their benchmark over 15 years (SPIVA study). Passive investing is the better choice for most investors."),

  "learn.reitsTitle": t("REITs – Immobilienaktien", "REITs – Real Estate Stocks"),
  "learn.reitsP1": t(
    "<strong>REITs</strong> (Real Estate Investment Trusts) sind börsennotierte Unternehmen, die in Immobilien investieren. Sie müssen mindestens 90% ihrer Gewinne als Dividende ausschütten, was sie zu attraktiven Einkommensquellen macht.",
    "<strong>REITs</strong> (Real Estate Investment Trusts) are publicly traded companies that invest in real estate. They must distribute at least 90% of profits as dividends, making them attractive income sources."
  ),
  "learn.reitsP2": t(
    "Typen: Residential (Wohnimmobilien), Commercial (Büros und Einzelhandel), Industrial (Lagerhäuser und Rechenzentren), Healthcare (Krankenhäuser und Pflegeheime).",
    "Types: Residential, Commercial (offices and retail), Industrial (warehouses and data centers), Healthcare (hospitals and nursing homes)."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 7: CRYPTO & ALTERNATIVES
  // ══════════════════════════════════════════════════════════════
  "learn.section7Title": t("Krypto & Alternative Anlagen", "Crypto & Alternative Investments"),

  "learn.cryptoTitle": t("Kryptowährungen", "Cryptocurrencies"),
  "learn.cryptoP1": t(
    "<strong>Kryptowährungen</strong> sind digitale Vermögenswerte auf Basis von Blockchain-Technologie. Bitcoin (2009) war die erste und bleibt die größte. Ethereum ermöglicht Smart Contracts und dezentrale Anwendungen (DeFi). Der Kryptomarkt ist extrem volatil: Bitcoin hat in einzelnen Jahren sowohl +300% als auch -70% erzielt.",
    "<strong>Cryptocurrencies</strong> are digital assets based on blockchain technology. Bitcoin (2009) was the first and remains the largest. Ethereum enables smart contracts and decentralized applications (DeFi). The crypto market is extremely volatile: Bitcoin has seen both +300% and -70% in individual years."
  ),
  "learn.cryptoP2": t(
    "Wichtig: Krypto ist hochspekulativ. Experten empfehlen maximal 5 bis 10% des Portfolios in Krypto zu allokieren. Verwahre deine Coins sicher (Hardware Wallet) und investiere nur, was du komplett verlieren kannst.",
    "Important: Crypto is highly speculative. Experts recommend allocating at most 5 to 10% of your portfolio to crypto. Store your coins securely (hardware wallet) and only invest what you can completely afford to lose."
  ),
  "learn.cryptoTypes": t("Wichtige Kryptowährungen:", "Major Cryptocurrencies:"),
  "learn.cryptoBtc": t("Bitcoin (BTC)", "Bitcoin (BTC)"),
  "learn.cryptoBtcDesc": t("Die erste und größte Kryptowährung. Begrenztes Angebot von 21 Millionen Coins. Wird oft als 'digitales Gold' bezeichnet und dient als Wertaufbewahrungsmittel.", "The first and largest cryptocurrency. Limited supply of 21 million coins. Often called 'digital gold' and serves as a store of value."),
  "learn.cryptoEth": t("Ethereum (ETH)", "Ethereum (ETH)"),
  "learn.cryptoEthDesc": t("Zweitgrößte Kryptowährung. Ermöglicht Smart Contracts und dezentrale Anwendungen (DeFi, NFTs). Seit 2022 auf Proof-of-Stake umgestellt.", "Second largest cryptocurrency. Enables smart contracts and decentralized applications (DeFi, NFTs). Switched to Proof-of-Stake in 2022."),
  "learn.cryptoAlt": t("Altcoins", "Altcoins"),
  "learn.cryptoAltDesc": t("Alle Kryptowährungen außer Bitcoin. Darunter Solana, Cardano, Polkadot und viele weitere. Deutlich höheres Risiko, aber auch höheres Renditepotenzial.", "All cryptocurrencies besides Bitcoin. Including Solana, Cardano, Polkadot and many more. Significantly higher risk but also higher return potential."),
  "learn.cryptoStable": t("Stablecoins", "Stablecoins"),
  "learn.cryptoStableDesc": t("An Fiat-Währungen gebundene Kryptos (z.B. USDT, USDC). Sollen den Wert von $1 halten. Nützlich als Zahlungsmittel im Krypto-Ökosystem, aber nicht risikofrei (Terra/LUNA Crash 2022).", "Cryptocurrencies pegged to fiat currencies (e.g. USDT, USDC). Designed to maintain $1 value. Useful as payment in the crypto ecosystem, but not risk-free (Terra/LUNA crash 2022)."),

  "learn.alternativesTitle": t("Alternative Anlagen", "Alternative Investments"),
  "learn.commoditiesTitle": t("Rohstoffe als Anlageklasse", "Commodities as an Asset Class"),
  "learn.commoditiesP1": t(
    "<strong>Rohstoffe</strong> umfassen Edelmetalle (Gold, Silber), Energierohstoffe (Öl, Gas), Industriemetalle (Kupfer, Lithium) und Agrarrohstoffe (Weizen, Kaffee). Sie bieten <strong>Inflationsschutz</strong> und geringe Korrelation zu Aktien.",
    "<strong>Commodities</strong> include precious metals (gold, silver), energy (oil, gas), industrial metals (copper, lithium), and agricultural products (wheat, coffee). They offer <strong>inflation protection</strong> and low correlation to stocks."
  ),
  "learn.commoditiesP2": t(
    "Gold gilt als 'sicherer Hafen' in Krisenzeiten. Am einfachsten investierst du über Rohstoff-ETFs oder ETCs. Direkte Futures-Investments sind für Privatanleger meist zu komplex und riskant.",
    "Gold is considered a 'safe haven' during crises. The easiest way to invest is through commodity ETFs or ETCs. Direct futures investments are usually too complex and risky for individual investors."
  ),
  "learn.commodities": t("Rohstoffe", "Commodities"),
  "learn.commoditiesDesc": t("Gold, Silber, Öl, Weizen. Bieten Inflationsschutz und Portfolio-Diversifikation. Am einfachsten über ETFs zugänglich.", "Gold, silver, oil, wheat. Provide inflation protection and portfolio diversification. Most easily accessible through ETFs."),
  "learn.altInvestTitle": t("Alternative Anlageklassen", "Alternative Asset Classes"),
  "learn.altP2P": t("P2P-Kredite", "P2P Lending"),
  "learn.altP2PDesc": t("Direktkredite an Privatpersonen über Plattformen wie Bondora oder Mintos. Renditen von 5 bis 12%, aber erhebliches Ausfallrisiko. Keine Einlagensicherung.", "Direct loans to individuals via platforms like Bondora or Mintos. Returns of 5 to 12%, but significant default risk. No deposit protection."),
  "learn.altPE": t("Private Equity", "Private Equity"),
  "learn.altPEDesc": t("Investitionen in nicht-börsennotierte Unternehmen. Hohe Einstiegshürden (oft $250.000+), lange Bindungsfristen (7-10 Jahre), aber historisch überdurchschnittliche Renditen.", "Investments in non-public companies. High entry barriers (often $250,000+), long lock-up periods (7-10 years), but historically above-average returns."),
  "learn.altCollectibles": t("Sammlerstücke", "Collectibles"),
  "learn.altCollectiblesDesc": t("Kunst, Wein, Uhren, Sneaker, Oldtimer. Illiquide und schwer zu bewerten, aber potenziell hohe Renditen für Kenner. Keine laufenden Erträge.", "Art, wine, watches, sneakers, vintage cars. Illiquid and hard to value, but potentially high returns for experts. No ongoing income."),
  "learn.p2p": t("P2P-Kredite", "P2P Lending"),
  "learn.p2pDesc": t("Direktkredite an Privatpersonen über Plattformen. Hohe Renditen (5 bis 12%), aber erhebliches Ausfallrisiko.", "Direct loans to individuals via platforms. High returns (5 to 12%), but significant default risk."),
  "learn.collectibles": t("Sammlerstücke", "Collectibles"),
  "learn.collectiblesDesc": t("Kunst, Wein, Uhren, Sneaker. Illiquide, schwer zu bewerten, aber potenziell hohe Renditen für Kenner.", "Art, wine, watches, sneakers. Illiquid, hard to value, but potentially high returns for experts."),

  // ══════════════════════════════════════════════════════════════
  // SECTION 8: PORTFOLIO MANAGEMENT
  // ══════════════════════════════════════════════════════════════
  "learn.section8Title": t("Portfoliomanagement", "Portfolio Management"),

  "learn.portfolioTitle": t("Portfolio-Konstruktion", "Portfolio Construction"),
  "learn.portfolioP1": t(
    "Ein gut konstruiertes Portfolio berücksichtigt <strong>Diversifikation</strong> über Anlageklassen (Aktien, Anleihen, Immobilien, Rohstoffe), <strong>geografische Streuung</strong> (USA, Europa, Emerging Markets) und <strong>Risikotoleranz</strong> (abhängig von Alter, Einkommen, Anlagezielen).",
    "A well-constructed portfolio considers <strong>diversification</strong> across asset classes (stocks, bonds, real estate, commodities), <strong>geographic spread</strong> (USA, Europe, Emerging Markets), and <strong>risk tolerance</strong> (depending on age, income, investment goals)."
  ),
  "learn.portfolioP2": t(
    "Die klassische Faustregel '100 minus Alter = Aktienquote' ist ein Startpunkt: Ein 30-Jähriger hätte 70% Aktien, ein 60-Jähriger 40%. Moderne Ansätze sind flexibler und berücksichtigen individuelle Umstände.",
    "The classic rule '100 minus age = stock allocation' is a starting point: A 30-year-old would have 70% stocks, a 60-year-old 40%. Modern approaches are more flexible and consider individual circumstances."
  ),

  "learn.assetAllocTitle": t("Asset Allocation", "Asset Allocation"),
  "learn.assetAllocP1": t(
    "Die <strong>Asset Allocation</strong> bestimmt, wie dein Vermögen auf verschiedene Anlageklassen verteilt wird. Studien zeigen, dass die Asset Allocation für über <strong>90% der Renditeunterschiede</strong> zwischen Portfolios verantwortlich ist – wichtiger als die Auswahl einzelner Aktien.",
    "<strong>Asset allocation</strong> determines how your wealth is distributed across different asset classes. Studies show that asset allocation accounts for over <strong>90% of return differences</strong> between portfolios – more important than individual stock selection."
  ),
  "learn.assetAllocModels": t("Beliebte Allokationsmodelle:", "Popular Allocation Models:"),
  "learn.model6040": t("60/40 Portfolio", "60/40 Portfolio"),
  "learn.model6040Desc": t("60% Aktien, 40% Anleihen. Klassisches ausgewogenes Portfolio. Bietet gute Rendite bei moderatem Risiko. Funktioniert besonders gut bei negativer Korrelation zwischen Aktien und Anleihen.", "60% stocks, 40% bonds. Classic balanced portfolio. Offers good returns with moderate risk. Works especially well when stocks and bonds are negatively correlated."),
  "learn.modelAge": t("Altersbasierte Regel", "Age-Based Rule"),
  "learn.modelAgeDesc": t("100 minus Alter = Aktienquote. Ein 30-Jähriger hätte 70% Aktien. Moderne Variante: 120 minus Alter, da Menschen länger leben und investieren.", "100 minus age = stock allocation. A 30-year-old would have 70% stocks. Modern variant: 120 minus age, as people live and invest longer."),
  "learn.modelAllWeather": t("All-Weather Portfolio (Ray Dalio)", "All-Weather Portfolio (Ray Dalio)"),
  "learn.modelAllWeatherDesc": t("30% Aktien, 40% langfristige Anleihen, 15% mittelfristige Anleihen, 7,5% Gold, 7,5% Rohstoffe. Designed für jede Wirtschaftslage. Geringere Schwankungen, aber auch geringere Maximalrendite.", "30% stocks, 40% long-term bonds, 15% intermediate bonds, 7.5% gold, 7.5% commodities. Designed for every economic environment. Lower volatility but also lower maximum returns."),

  "learn.rebalancingTitle": t("Rebalancing", "Rebalancing"),
  "learn.rebalancingP1": t(
    "<strong>Rebalancing</strong> bedeutet, dein Portfolio regelmäßig auf die Zielgewichtung zurückzuführen. Wenn Aktien stark gestiegen sind (z.B. von 70% auf 80%), verkaufst du einen Teil und kaufst Anleihen nach. Das erzwingt systematisch \"billig kaufen, teuer verkaufen\".",
    "<strong>Rebalancing</strong> means regularly restoring your portfolio to its target allocation. If stocks have risen strongly (e.g. from 70% to 80%), you sell some and buy bonds. This systematically forces \"buy low, sell high.\""
  ),
  "learn.rebalancingP2": t(
    "Methoden: <strong>Kalenderbasiert</strong> (z.B. einmal pro Quartal oder Jahr) oder <strong>schwellenbasiert</strong> (wenn eine Anlageklasse um mehr als 5% von der Zielgewichtung abweicht). Tipp: Nutze frisches Kapital für Rebalancing, um Transaktionskosten zu minimieren.",
    "Methods: <strong>Calendar-based</strong> (e.g. once per quarter or year) or <strong>threshold-based</strong> (when an asset class deviates by more than 5% from target allocation). Tip: Use fresh capital for rebalancing to minimize transaction costs."
  ),
  "learn.rebalancingInfo": t(
    "Häufigkeit: Einmal pro Jahr oder wenn Abweichungen größer als 5% von der Zielallokation werden.",
    "Frequency: Once per year or when deviations exceed >5% from target allocation."
  ),

  "learn.riskMgmtTitle": t("Risikomanagement", "Risk Management"),
  "learn.riskMgmtP1": t(
    "Professionelles Risikomanagement umfasst: <strong>Diversifikation</strong> über Anlageklassen und Regionen, <strong>Positionsgrößenlimitierung</strong> (maximal 5 bis 10% in eine einzelne Position), <strong>Stop-Loss Orders</strong> für spekulative Positionen und <strong>Korrelationsanalyse</strong> (nicht in stark korrelierten Assets übergewichten).",
    "Professional risk management includes: <strong>diversification</strong> across asset classes and regions, <strong>position size limits</strong> (maximum 5 to 10% in a single position), <strong>stop-loss orders</strong> for speculative positions, and <strong>correlation analysis</strong> (don't overweight in highly correlated assets)."
  ),

  "learn.emergencyFundTitle": t("Notfallfonds & Liquiditätsplanung", "Emergency Fund & Liquidity Planning"),
  "learn.emergencyFundP1": t(
    "Bevor du investierst, baue einen <strong>Notfallfonds</strong> auf: 3 bis 6 Monatsausgaben auf einem sofort verfügbaren Konto. Investiere nie Geld, das du für Miete, Versicherungen oder andere fixe Kosten brauchst. Halte immer 5 bis 10% deines Portfolios in Cash oder kurzfristigen Anleihen für Kaufgelegenheiten.",
    "Before investing, build an <strong>emergency fund</strong>: 3 to 6 months of expenses in an immediately accessible account. Never invest money needed for rent, insurance, or other fixed costs. Always keep 5 to 10% of your portfolio in cash or short-term bonds for buying opportunities."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 9: STOCK ANALYSIS IN PRACTICE
  // ══════════════════════════════════════════════════════════════
  "learn.section9Title": t("Aktienanalyse in der Praxis", "Stock Analysis in Practice"),

  "learn.annualReportsTitle": t("Geschäftsberichte lesen", "Reading Annual Reports"),
  "learn.annualReportsP1": t(
    "Der <strong>Geschäftsbericht</strong> (Annual Report / 10-K) ist die wichtigste Informationsquelle für Investoren. Er enthält geprüfte Finanzdaten, Risikofaktoren und die Strategie des Managements. Die <strong>10-Q</strong> (Quartalsberichte) liefern unterjährige Updates.",
    "The <strong>annual report</strong> (10-K) is the most important information source for investors. It contains audited financial data, risk factors, and management strategy. <strong>10-Q</strong> (quarterly reports) provide interim updates."
  ),
  "learn.annualReportsP2": t(
    "Achte besonders auf: Umsatzwachstum, Margenentwicklung, Free Cashflow-Trend, Verschuldungsgrad und die Aussagen des Managements zu Risiken und Chancen.",
    "Pay special attention to: Revenue growth, margin trends, free cash flow trajectory, leverage ratios, and management's discussion of risks and opportunities."
  ),

  "learn.balanceSheetTitle": t("Bilanzen verstehen", "Understanding Balance Sheets"),
  "learn.balanceSheetP1": t(
    "Die <strong>Bilanz</strong> zeigt die finanzielle Gesundheit eines Unternehmens: <strong>Aktiva</strong> (was das Unternehmen besitzt) = <strong>Passiva</strong> (Schulden) + <strong>Eigenkapital</strong>. Gesunde Unternehmen haben mehr Eigenkapital als Schulden und wachsende Cashbestände.",
    "The <strong>balance sheet</strong> shows a company's financial health: <strong>Assets</strong> (what the company owns) = <strong>Liabilities</strong> (debts) + <strong>Equity</strong>. Healthy companies have more equity than debt and growing cash reserves."
  ),

  "learn.evaluateMgmtTitle": t("Management bewerten", "Evaluating Management"),
  "learn.evaluateMgmtP1": t(
    "Gutes Management zeigt sich durch: konstantes Umsatz- und Gewinnwachstum, hohe Insider-Beteiligung (Skin in the Game), klare und ehrliche Kommunikation sowie Kapitalallokation im Aktionärsinteresse (Dividenden, Rückkäufe, kluge Akquisitionen). Vermeide Unternehmen mit exzessiver Verwässerung oder CEO-Gehältern, die nicht an Performance gebunden sind.",
    "Good management shows through: consistent revenue and earnings growth, high insider ownership (skin in the game), clear and honest communication, and capital allocation in shareholder interest (dividends, buybacks, smart acquisitions). Avoid companies with excessive dilution or CEO compensation not tied to performance."
  ),

  "learn.industryCompareTitle": t("Branchenvergleich", "Industry Comparison"),
  "learn.industryCompareP1": t(
    "Vergleiche Unternehmen immer innerhalb ihrer Branche. Ein KGV von 25 ist für einen Tech-Konzern normal, für einen Versorger eher teuer. Nutze Peer-Vergleiche für KGV, Gewinnmarge, Verschuldungsgrad und Wachstumsrate, um relative Bewertungen einzuschätzen.",
    "Always compare companies within their industry. A P/E of 25 is normal for a tech company but rather expensive for a utility. Use peer comparisons for P/E, profit margin, leverage, and growth rate to assess relative valuations."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 10: TECHNICAL ANALYSIS
  // ══════════════════════════════════════════════════════════════
  "learn.section10Title": t("Technische Analyse", "Technical Analysis"),

  "learn.taIntro": t(
    "Die <strong>Technische Analyse</strong> (TA) untersucht historische Kursdaten und Handelsvolumen, um zukünftige Preisbewegungen vorherzusagen. Im Gegensatz zur Fundamentalanalyse ignoriert sie den inneren Wert und konzentriert sich auf <strong>Muster, Trends und Indikatoren</strong>.",
    "<strong>Technical Analysis</strong> (TA) studies historical price data and trading volume to predict future price movements. Unlike fundamental analysis, it ignores intrinsic value and focuses on <strong>patterns, trends, and indicators</strong>."
  ),

  "learn.chartPatternsTitle": t("Chart-Muster", "Chart Patterns"),
  "learn.headShoulders": t("Kopf-Schulter-Formation", "Head and Shoulders"),
  "learn.headShouldersDesc": t("Umkehrmuster mit drei Hochs, wobei das mittlere (Kopf) am höchsten ist. Signal für eine Trendwende von bullisch zu bärisch.", "Reversal pattern with three highs, the middle (head) being highest. Signal for trend change from bullish to bearish."),
  "learn.doubleTop": t("Doppel-Top/Bottom", "Double Top/Bottom"),
  "learn.doubleTopDesc": t("Der Kurs testet zweimal denselben Widerstand oder Support und dreht um. Ein starkes Umkehrsignal.", "Price tests the same resistance or support twice and reverses. A strong reversal signal."),
  "learn.triangles": t("Dreiecke", "Triangles"),
  "learn.trianglesDesc": t("Symmetrisch, aufsteigend oder absteigend. Konsolidierungsmuster, die auf einen Ausbruch in eine Richtung hindeuten.", "Symmetric, ascending, or descending. Consolidation patterns indicating a breakout in one direction."),
  "learn.flagsPennants": t("Flaggen & Wimpel", "Flags & Pennants"),
  "learn.flagsPennantsDesc": t("Kurzfristige Konsolidierung in einem starken Trend. Signal für eine Trendfortsetzung.", "Short-term consolidation in a strong trend. Signal for trend continuation."),

  "learn.indicatorsTitle": t("Technische Indikatoren", "Technical Indicators"),
  "learn.smaEma": t("Gleitende Durchschnitte (SMA/EMA)", "Moving Averages (SMA/EMA)"),
  "learn.smaEmaDesc": t("SMA (Simple) ist ein gleichgewichteter Durchschnitt, EMA (Exponential) gewichtet neuere Kurse stärker. Die 50-Tage und 200-Tage Linien sind die wichtigsten. Golden Cross (50 über 200) gilt als bullisch, Death Cross (50 unter 200) als bärisch.", "SMA (Simple) is an equally weighted average, EMA (Exponential) weights recent prices more heavily. The 50-day and 200-day lines are most important. Golden Cross (50 above 200) is considered bullish, Death Cross (50 below 200) bearish."),
  "learn.rsi": t("RSI (Relative Strength Index)", "RSI (Relative Strength Index)"),
  "learn.rsiDesc": t("Oszillator von 0 bis 100. Über 70 gilt als überkauft (potenzielle Verkaufsgelegenheit), unter 30 als überverkauft (potenzielle Kaufgelegenheit). RSI-Divergenzen sind besonders starke Signale.", "Oscillator from 0 to 100. Above 70 is considered overbought (potential sell), below 30 oversold (potential buy). RSI divergences are particularly strong signals."),
  "learn.macd": t("MACD", "MACD"),
  "learn.macdDesc": t("Moving Average Convergence Divergence zeigt Trend und Momentum. Signallinie-Kreuzungen und Histogramm-Divergenzen liefern Handelssignale.", "Moving Average Convergence Divergence shows trend and momentum. Signal line crossovers and histogram divergences provide trading signals."),
  "learn.bollinger": t("Bollinger Bänder", "Bollinger Bands"),
  "learn.bollingerDesc": t("Mittlerer SMA plus/minus 2 Standardabweichungen. Kurs am oberen Band deutet auf Überkauft hin, am unteren auf Überverkauft. Ein Band-Squeeze kündigt oft einen Ausbruch an.", "Middle SMA plus/minus 2 standard deviations. Price at upper band suggests overbought, at lower band oversold. A band squeeze often signals an upcoming breakout."),
  "learn.volume": t("Volumenanalyse", "Volume Analysis"),
  "learn.volumeDesc": t("Hohes Volumen bestätigt Trends. Steigender Kurs bei fallendem Volumen deutet auf einen schwachen Trend hin. OBV (On-Balance Volume) summiert Volumen an steigenden und fallenden Tagen.", "High volume confirms trends. Rising price with falling volume suggests a weak trend. OBV (On-Balance Volume) sums volume on up and down days."),

  "learn.supportResistance": t("Support & Resistance", "Support & Resistance"),
  "learn.supportResistanceP1": t(
    "<strong>Support</strong> ist ein Preisniveau, an dem eine Aktie historisch Käufer findet und der Kurs sich stabilisiert. <strong>Resistance</strong> ist das Gegenstück, hier trifft der Kurs auf Verkaufsdruck. Wenn Support gebrochen wird, wird er oft zu Resistance (und umgekehrt). Runde Zahlen ($100, $50) wirken häufig als psychologische Support- oder Resistance-Level.",
    "<strong>Support</strong> is a price level where a stock historically finds buyers and stabilizes. <strong>Resistance</strong> is the opposite, where the price meets selling pressure. When support is broken, it often becomes resistance (and vice versa). Round numbers ($100, $50) often act as psychological support or resistance levels."
  ),
  "learn.taWarning": t(
    "Technische Analyse ist keine exakte Wissenschaft. Kein Indikator funktioniert immer. Verwende TA immer in Kombination mit Fundamentalanalyse und Risikomanagement.",
    "Technical analysis is not an exact science. No indicator works all the time. Always use TA in combination with fundamental analysis and risk management."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 11: DERIVATIVES
  // ══════════════════════════════════════════════════════════════
  "learn.section11Title": t("Derivate im Detail", "Derivatives in Detail"),

  "learn.derivativesIntro": t(
    "<strong>Derivate</strong> sind Finanzinstrumente, deren Wert von einem zugrunde liegenden Basiswert (Aktie, Index, Rohstoff, Währung) abgeleitet wird. Sie werden sowohl zur <strong>Absicherung</strong> (Hedging) als auch zur <strong>Spekulation</strong> mit Hebelwirkung eingesetzt.",
    "<strong>Derivatives</strong> are financial instruments whose value is derived from an underlying asset (stock, index, commodity, currency). They are used for both <strong>hedging</strong> and <strong>speculation</strong> with leverage."
  ),

  "learn.optionsTitle": t("Optionen", "Options"),
  "learn.optionsP1": t(
    "<strong>Optionen</strong> geben dir das <strong>Recht, aber nicht die Pflicht</strong>, einen Basiswert zu einem festgelegten Preis (Strike) bis zu einem bestimmten Datum zu kaufen (Call) oder verkaufen (Put).",
    "<strong>Options</strong> give you the <strong>right, but not the obligation</strong>, to buy (call) or sell (put) an underlying asset at a set price (strike) by a certain date."
  ),
  "learn.optionsCall": t("Call-Option", "Call Option"),
  "learn.optionsCallDesc": t("Recht zum KAUF. Profitiert von steigenden Kursen. Maximaler Verlust ist die gezahlte Prämie.", "Right to BUY. Profits from rising prices. Maximum loss is the premium paid."),
  "learn.optionsPut": t("Put-Option", "Put Option"),
  "learn.optionsPutDesc": t("Recht zum VERKAUF. Profitiert von fallenden Kursen. Maximaler Verlust ist die gezahlte Prämie.", "Right to SELL. Profits from falling prices. Maximum loss is the premium paid."),
  "learn.optionsGreeks": t("Die Griechen (Options-Greeks):", "The Greeks (Options Greeks):"),
  "learn.optionsGreeksDesc": t(
    "<strong>Delta</strong> (Δ): Preisänderung der Option pro $1 Änderung im Basiswert. <strong>Gamma</strong> (Γ): Änderungsrate von Delta. <strong>Theta</strong> (Θ): Zeitwertverfall pro Tag, denn Optionen verlieren täglich an Wert! <strong>Vega</strong> (ν): Sensitivität gegenüber Volatilitätsänderungen. <strong>Rho</strong> (ρ): Zinssensitivität.",
    "<strong>Delta</strong> (Δ): Option price change per $1 move in underlying. <strong>Gamma</strong> (Γ): Rate of change of Delta. <strong>Theta</strong> (Θ): Time decay per day, as options lose value daily! <strong>Vega</strong> (ν): Sensitivity to volatility changes. <strong>Rho</strong> (ρ): Interest rate sensitivity."
  ),
  "learn.optionStylesTitle": t("Amerikanische vs. Europäische Optionen", "American vs. European Options"),
  "learn.optionStylesIntro": t(
    "Optionen unterscheiden sich nicht nur in Call und Put, sondern auch in ihrem <strong>Ausübungsstil</strong>. Diese Unterscheidung hat nichts mit Geografie zu tun, beide Typen werden weltweit gehandelt.",
    "Options differ not only in call and put but also in their <strong>exercise style</strong>. This distinction has nothing to do with geography, both types are traded worldwide."
  ),
  "learn.americanOption": t("Amerikanische Option", "American Option"),
  "learn.americanOptionDesc": t(
    "Kann <strong>jederzeit</strong> bis zum Verfallsdatum ausgeübt werden. Bietet maximale Flexibilität. Die meisten Aktienoptionen in den USA sind amerikanisch. Durch die frühe Ausübungsmöglichkeit ist die Prämie tendenziell höher als bei europäischen Optionen.",
    "Can be exercised <strong>at any time</strong> until expiration. Offers maximum flexibility. Most stock options in the US are American style. Due to early exercise possibility, premiums tend to be higher than European options."
  ),
  "learn.europeanOption": t("Europäische Option", "European Option"),
  "learn.europeanOptionDesc": t(
    "Kann <strong>nur am Verfallstag</strong> ausgeübt werden. Index-Optionen (z.B. auf den S&P 500, DAX) sind meist europäisch. Sie sind einfacher zu bewerten (Black-Scholes-Modell) und oft leicht günstiger.",
    "Can <strong>only be exercised on expiration day</strong>. Index options (e.g., on S&P 500, DAX) are mostly European style. They are easier to price (Black-Scholes model) and often slightly cheaper."
  ),
  "learn.americanCallTitle": t("American Call", "American Call"),
  "learn.americanCallDesc": t(
    "Recht, den Basiswert jederzeit bis zum Verfall zum Strike-Preis zu <strong>kaufen</strong>. Beispiel: Du kaufst einen American Call auf Apple mit Strike $150, Verfall in 3 Monaten. Steigt Apple auf $180, kannst du sofort ausüben und 100 Aktien für $150 kaufen (Gewinn: $30 pro Aktie minus Prämie). Besonders wertvoll bei Dividendenzahlungen, denn du kannst vor dem Ex-Datum ausüben.",
    "Right to <strong>buy</strong> the underlying at the strike price at any time until expiration. Example: You buy an American Call on Apple with $150 strike, expiring in 3 months. If Apple rises to $180, you can exercise immediately and buy 100 shares at $150 (profit: $30 per share minus premium). Especially valuable around dividend dates, as you can exercise before ex-date."
  ),
  "learn.americanPutTitle": t("American Put", "American Put"),
  "learn.americanPutDesc": t(
    "Recht, den Basiswert jederzeit bis zum Verfall zum Strike-Preis zu <strong>verkaufen</strong>. Beispiel: Du besitzt 100 Tesla-Aktien und kaufst einen American Put mit Strike $200. Fällt Tesla auf $150, kannst du sofort ausüben und für $200 verkaufen (Verlust begrenzt). Die frühe Ausübung ist besonders sinnvoll bei stark gefallenen Aktien, so sicherst du dir den Gewinn sofort.",
    "Right to <strong>sell</strong> the underlying at the strike price at any time until expiration. Example: You own 100 Tesla shares and buy an American Put with $200 strike. If Tesla drops to $150, you can exercise immediately and sell at $200 (loss limited). Early exercise is especially useful for deeply fallen stocks, as you lock in the profit immediately."
  ),
  "learn.europeanCallTitle": t("European Call", "European Call"),
  "learn.europeanCallDesc": t(
    "Recht, den Basiswert <strong>nur am Verfallstag</strong> zum Strike-Preis zu kaufen. Beispiel: European Call auf den DAX-Index mit Strike 18.000, Verfall Dezember. Am Verfallstag steht der DAX bei 18.500, du erhältst die Differenz (500 Punkte mal Multiplikator) als Barabrechnung. Keine physische Lieferung.",
    "Right to buy the underlying <strong>only on expiration day</strong> at the strike price. Example: European Call on DAX index with 18,000 strike, December expiry. On expiration day, DAX is at 18,500, you receive the difference (500 points times multiplier) as cash settlement. No physical delivery."
  ),
  "learn.europeanPutTitle": t("European Put", "European Put"),
  "learn.europeanPutDesc": t(
    "Recht, den Basiswert <strong>nur am Verfallstag</strong> zum Strike-Preis zu verkaufen. Beispiel: European Put auf den S&P 500 mit Strike 5.000. Am Verfallstag steht der Index bei 4.800, du erhältst 200 mal Multiplikator als Gewinn. Wird oft zur Portfolio-Absicherung verwendet, da Index-Puts günstiger sind als viele Einzel-Puts.",
    "Right to sell the underlying <strong>only on expiration day</strong> at the strike price. Example: European Put on S&P 500 with 5,000 strike. On expiration, index is at 4,800, you receive 200 times multiplier as profit. Often used for portfolio hedging, as index puts are cheaper than many individual puts."
  ),
  "learn.optionStyleComparison": t(
    "Zusammenfassung: Amerikanische Optionen sind flexibler (jederzeit ausübbar) und daher teurer. Europäische Optionen sind nur am Verfall ausübbar, aber oft günstiger und einfacher zu bewerten. Für Einsteiger gilt: Die meisten Broker-Plattformen handhaben die Ausübung automatisch, du musst dich selten manuell entscheiden.",
    "Summary: American options are more flexible (exercisable anytime) and therefore more expensive. European options are only exercisable at expiration, but often cheaper and easier to value. For beginners: Most broker platforms handle exercise automatically, you rarely need to decide manually."
  ),

  "learn.futuresTitle": t("Futures (Termingeschäfte)", "Futures"),
  "learn.futuresP1": t(
    "Ein <strong>Future</strong> ist ein standardisierter Vertrag, einen Basiswert zu einem festgelegten Preis an einem bestimmten Datum zu kaufen oder verkaufen. Anders als Optionen besteht hier eine <strong>Pflicht</strong> zur Erfüllung. Futures werden für Rohstoffe (Öl, Gold), Indizes (S&P 500 E-mini) und Währungen gehandelt.",
    "A <strong>future</strong> is a standardized contract to buy or sell an underlying asset at a set price on a specific date. Unlike options, there is an <strong>obligation</strong> to fulfill. Futures are traded for commodities (oil, gold), indices (S&P 500 E-mini), and currencies."
  ),
  "learn.futuresWarning": t(
    "Futures erfordern Margin und können zu Verlusten über das eingesetzte Kapital hinaus führen. Nur für erfahrene Trader geeignet!",
    "Futures require margin and can lead to losses exceeding invested capital. Only suitable for experienced traders!"
  ),

  "learn.warrantsTitle": t("Optionsscheine & Zertifikate", "Warrants & Certificates"),
  "learn.warrantsP1": t(
    "<strong>Optionsscheine</strong> sind von Banken emittierte Derivate (besonders in Deutschland verbreitet). Sie funktionieren ähnlich wie Optionen, werden aber nicht an einer Terminbörse, sondern direkt mit dem Emittenten gehandelt. Das bedeutet: Du trägst zusätzlich ein <strong>Emittentenrisiko</strong>. Beliebte Varianten: Knock-Out-Zertifikate (mit Barriere, an der das Produkt wertlos verfällt) und Faktor-Zertifikate (konstanter Hebel).",
    "<strong>Warrants</strong> are bank-issued derivatives (especially common in Germany). They function similarly to options but are traded directly with the issuer rather than on a derivatives exchange. This means you also carry <strong>issuer risk</strong>. Popular variants: knock-out certificates (with a barrier where the product expires worthless) and factor certificates (constant leverage)."
  ),

  "learn.hedgingTitle": t("Absicherungsstrategien (Hedging)", "Hedging Strategies"),
  "learn.hedgingP1": t(
    "<strong>Protective Put</strong>: Kaufe Put-Optionen auf Aktien, die du hältst. Begrenzt Verluste, kostet aber Prämie (wie eine Versicherung). <strong>Covered Call</strong>: Verkaufe Call-Optionen auf Aktien, die du besitzt. Generiert Prämieneinnahmen, begrenzt aber das Aufwärtspotenzial. <strong>Collar</strong>: Kombiniert Protective Put mit Covered Call. Die Prämien gleichen sich teilweise aus.",
    "<strong>Protective Put</strong>: Buy put options on stocks you own. Limits losses but costs premium (like insurance). <strong>Covered Call</strong>: Sell call options on stocks you own. Generates premium income but caps upside. <strong>Collar</strong>: Combines protective put with covered call. Premiums partially offset each other."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 12: FORMULAS & EXPERT KNOWLEDGE
  // ══════════════════════════════════════════════════════════════
  "learn.section12Title": t("Formeln & Expertenwissen", "Formulas & Expert Knowledge"),

  "learn.dcfTitle": t("Discounted Cash Flow (DCF)", "Discounted Cash Flow (DCF)"),
  "learn.dcfFormula": t("DCF = Σ [FCFₜ / (1 + WACC)ᵗ] + TV / (1 + WACC)ⁿ", "DCF = Σ [FCFₜ / (1 + WACC)ᵗ] + TV / (1 + WACC)ⁿ"),
  "learn.dcfExplanation": t(
    "FCFₜ = Freier Cashflow im Jahr t, WACC = gewichtete durchschnittliche Kapitalkosten, TV = Terminal Value (Restwert), n = Prognosezeitraum. DCF bewertet ein Unternehmen basierend auf seinen zukünftigen Cashflows, abgezinst auf den heutigen Wert.",
    "FCFₜ = Free cash flow in year t, WACC = Weighted Average Cost of Capital, TV = Terminal Value, n = forecast period. DCF values a company based on its future cash flows, discounted to present value."
  ),

  "learn.capmTitle": t("CAPM (Kapitalmarktmodell)", "CAPM (Capital Asset Pricing Model)"),
  "learn.capmFormula": t("E(Rᵢ) = Rf + βᵢ × (E(Rm) − Rf)", "E(Rᵢ) = Rf + βᵢ × (E(Rm) − Rf)"),
  "learn.capmExplanation": t(
    "E(Rᵢ) = erwartete Rendite der Aktie, Rf = risikofreier Zinssatz, βᵢ = Beta der Aktie, E(Rm) = erwartete Marktrendite. CAPM bestimmt, welche Rendite du für ein gegebenes Risiko erwarten solltest.",
    "E(Rᵢ) = expected return of stock, Rf = risk-free rate, βᵢ = stock beta, E(Rm) = expected market return. CAPM determines what return you should expect for a given level of risk."
  ),

  "learn.sharpeTitle": t("Sharpe Ratio", "Sharpe Ratio"),
  "learn.sharpeFormula": t("Sharpe = (Rp − Rf) / σp", "Sharpe = (Rp − Rf) / σp"),
  "learn.sharpeExplanation": t(
    "Rp = Portfolio-Rendite, Rf = risikofreier Zinssatz, σp = Standardabweichung. Die Sharpe Ratio misst die risikoadjustierte Rendite. Über 1,0 gilt als gut, über 2,0 als sehr gut. Ermöglicht den Vergleich verschiedener Investments auf gleicher Risikobasis.",
    "Rp = Portfolio return, Rf = risk-free rate, σp = standard deviation. Sharpe Ratio measures risk-adjusted return. Above 1.0 is considered good, above 2.0 very good. Enables comparing different investments on the same risk basis."
  ),

  "learn.blackScholesTitle": t("Black-Scholes Modell", "Black-Scholes Model"),
  "learn.blackScholesFormula": t("C = S·N(d₁) − K·e⁻ʳᵗ·N(d₂)", "C = S·N(d₁) − K·e⁻ʳᵗ·N(d₂)"),
  "learn.blackScholesExplanation": t(
    "C = Call-Preis, S = aktueller Aktienkurs, K = Strike-Preis, r = risikofreier Zinssatz, t = Zeit bis Verfall, N() = kumulative Normalverteilung. Das Modell revolutionierte den Optionshandel (Nobelpreis 1997). Annahmen: konstante Volatilität, keine Dividenden, europäische Option.",
    "C = Call price, S = current stock price, K = strike price, r = risk-free rate, t = time to expiration, N() = cumulative normal distribution. The model revolutionized options trading (Nobel Prize 1997). Assumptions: constant volatility, no dividends, European option."
  ),

  "learn.gordonTitle": t("Gordon Growth Model", "Gordon Growth Model"),
  "learn.gordonFormula": t("P₀ = D₁ / (r - g)", "P₀ = D₁ / (r - g)"),
  "learn.gordonExplanation": t(
    "P₀ = fairer Aktienkurs, D₁ = erwartete Dividende nächstes Jahr, r = geforderte Rendite, g = Dividendenwachstumsrate. Einfaches Modell für Dividendenaktien. Funktioniert nur wenn r größer als g ist.",
    "P₀ = fair stock price, D₁ = expected dividend next year, r = required return, g = dividend growth rate. Simple model for dividend stocks. Only works when r is greater than g."
  ),

  "learn.kellyTitle": t("Kelly Criterion", "Kelly Criterion"),
  "learn.kellyFormula": t("f* = (bp - q) / b", "f* = (bp - q) / b"),
  "learn.kellyExplanation": t(
    "f* = optimaler Einsatz (Anteil des Kapitals), b = Gewinnquote (Gewinn/Einsatz), p = Gewinnwahrscheinlichkeit, q = Verlustwahrscheinlichkeit (1-p). Bestimmt die optimale Positionsgröße, um langfristiges Wachstum zu maximieren. In der Praxis empfiehlt sich 'Half Kelly' (f*/2) für konservativere Positionsgrößen.",
    "f* = optimal bet size (fraction of capital), b = win ratio (profit/stake), p = probability of winning, q = probability of losing (1-p). Determines optimal position size to maximize long-term growth. In practice, 'Half Kelly' (f*/2) is recommended for more conservative position sizes."
  ),

  "learn.waccTitle": t("WACC (Kapitalkosten)", "WACC (Cost of Capital)"),
  "learn.waccFormula": t("WACC = (E/V)×Re + (D/V)×Rd×(1-Tc)", "WACC = (E/V)×Re + (D/V)×Rd×(1-Tc)"),
  "learn.waccExplanation": t(
    "E = Marktwert des Eigenkapitals, D = Marktwert der Schulden, V = E+D, Re = Eigenkapitalkosten, Rd = Fremdkapitalkosten, Tc = Steuersatz. WACC ist der Diskontierungssatz für DCF-Bewertungen und repräsentiert die durchschnittlichen Kapitalkosten eines Unternehmens.",
    "E = Market value of equity, D = Market value of debt, V = E+D, Re = Cost of equity, Rd = Cost of debt, Tc = Tax rate. WACC is the discount rate for DCF valuations and represents a company's average cost of capital."
  ),

  "learn.evFormulaTitle": t("Enterprise Value (EV)", "Enterprise Value (EV)"),
  "learn.evFormula": t("EV = Market Cap + Total Debt - Cash", "EV = Market Cap + Total Debt - Cash"),
  "learn.evExplanation": t(
    "Der Enterprise Value gibt den theoretischen Übernahmepreis eines Unternehmens an. EV/EBITDA ist ein beliebtes Bewertungsmaß, da es kapitalstruktur-neutral ist. EV/EBITDA unter 10 gilt oft als günstig, über 20 als teuer (branchenabhängig).",
    "Enterprise Value represents the theoretical acquisition price of a company. EV/EBITDA is a popular valuation metric because it's capital structure-neutral. EV/EBITDA below 10 is often considered cheap, above 20 expensive (industry-dependent)."
  ),

  "learn.mptTitle": t("Moderne Portfoliotheorie (MPT)", "Modern Portfolio Theory (MPT)"),
  "learn.mptP1": t(
    "Harry Markowitz' <strong>MPT</strong> (Nobelpreis 1990) zeigt, wie man durch optimale Diversifikation die <strong>Efficient Frontier</strong> erreicht, also das beste Verhältnis von Rendite zu Risiko.",
    "Harry Markowitz's <strong>MPT</strong> (Nobel Prize 1990) shows how optimal diversification reaches the <strong>Efficient Frontier</strong>, the best ratio of return to risk."
  ),
  "learn.mptFormula": t("σp² = ΣΣ wᵢwⱼσᵢⱼ", "σp² = ΣΣ wᵢwⱼσᵢⱼ"),
  "learn.mptExplanation": t(
    "σp² = Portfolio-Varianz, wᵢ = Gewichtung der Anlage i, σᵢⱼ = Kovarianz zwischen Anlage i und j. Je niedriger die Korrelation zwischen Anlagen, desto stärker der Diversifikationseffekt. Bei perfekt negativ korrellierten Anlagen (ρ = -1) kann das Risiko theoretisch auf null reduziert werden.",
    "σp² = Portfolio variance, wᵢ = Weight of asset i, σᵢⱼ = Covariance between asset i and j. The lower the correlation between assets, the stronger the diversification effect. With perfectly negatively correlated assets (ρ = -1), risk can theoretically be reduced to zero."
  ),

  "learn.fibonacciTitle": t("Fibonacci-Retracements", "Fibonacci Retracements"),
  "learn.fibonacciP1": t(
    "<strong>Fibonacci-Retracements</strong> basieren auf der mathematischen Fibonacci-Folge. Die Schlüssel-Level (23,6%, 38,2%, 50%, 61,8%, 78,6%) werden als potenzielle Support- und Resistance-Zonen genutzt. Besonders das 61,8%-Level ('Goldener Schnitt') gilt als starkes Korrekturziel.",
    "<strong>Fibonacci Retracements</strong> are based on the mathematical Fibonacci sequence. Key levels (23.6%, 38.2%, 50%, 61.8%, 78.6%) are used as potential support and resistance zones. The 61.8% level ('Golden Ratio') is considered a particularly strong correction target."
  ),

  "learn.elliottTitle": t("Elliott-Wellen-Theorie", "Elliott Wave Theory"),
  "learn.elliottP1": t(
    "Die <strong>Elliott-Wellen-Theorie</strong> beschreibt wiederkehrende Kursmuster in 5 Impulswellen (in Trendrichtung) und 3 Korrekturwellen (gegen den Trend). Jede Welle lässt sich in kleinere Subwellen unterteilen (fraktale Struktur).",
    "<strong>Elliott Wave Theory</strong> describes recurring price patterns in 5 impulse waves (with the trend) and 3 corrective waves (against the trend). Each wave can be subdivided into smaller sub-waves (fractal structure)."
  ),

  "learn.monteCarloTitle": t("Monte-Carlo-Simulation", "Monte Carlo Simulation"),
  "learn.monteCarloP1": t(
    "<strong>Monte-Carlo-Simulationen</strong> verwenden tausende Zufalls-Szenarien, um die Wahrscheinlichkeitsverteilung von Portfolio-Ergebnissen zu modellieren. Statt eines einzigen erwarteten Ergebnisses erhältst du eine Bandbreite: 'In 95% der Fälle liegt dein Portfolio nach 20 Jahren zwischen $X und $Y.'",
    "<strong>Monte Carlo simulations</strong> use thousands of random scenarios to model the probability distribution of portfolio outcomes. Instead of a single expected result, you get a range: 'In 95% of cases, your portfolio will be between $X and $Y after 20 years.'"
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 13: MARKET MICROSTRUCTURE
  // ══════════════════════════════════════════════════════════════
  "learn.section13Title": t("Marktmikrostruktur & Advanced Trading", "Market Microstructure & Advanced Trading"),

  "learn.orderBookTitle": t("Das Orderbuch verstehen", "Understanding the Order Book"),
  "learn.orderBookP1": t(
    "Das <strong>Orderbuch</strong> zeigt alle offenen Kauf- (Bid) und Verkaufsorders (Ask) für ein Wertpapier. <strong>Level 1</strong>-Daten zeigen nur den besten Bid und Ask. <strong>Level 2</strong> (Market Depth) zeigt alle Orders nach Preis gestaffelt. Die <strong>Bid-Ask-Spanne</strong> (Spread) ist ein direktes Maß für Liquidität: enge Spreads bedeuten hohe Liquidität.",
    "The <strong>order book</strong> shows all open buy (bid) and sell (ask) orders for a security. <strong>Level 1</strong> data shows only the best bid and ask. <strong>Level 2</strong> (market depth) shows all orders stacked by price. The <strong>bid-ask spread</strong> is a direct measure of liquidity: tight spreads mean high liquidity."
  ),
  "learn.orderBookP2": t(
    "Große institutionelle Orders werden oft in <strong>Iceberg Orders</strong> aufgeteilt, um den wahren Umfang zu verbergen. <strong>Dark Pools</strong> sind alternative Handelsplätze, auf denen große Blöcke gehandelt werden, ohne den öffentlichen Markt zu beeinflussen.",
    "Large institutional orders are often split into <strong>iceberg orders</strong> to hide their true size. <strong>Dark pools</strong> are alternative trading venues where large blocks are traded without affecting the public market."
  ),

  "learn.marketMakersTitle": t("Market Maker & Liquidität", "Market Makers & Liquidity"),
  "learn.marketMakersP1": t(
    "<strong>Market Maker</strong> stellen kontinuierlich Kauf- und Verkaufskurse und verdienen am Spread. Sie sind essenziell für die Marktliquidität. Bekannte Market Maker sind Citadel Securities, Virtu Financial und Jane Street. In Krisenzeiten können Market Maker ihre Spreads deutlich ausweiten, was die Handelskosten erhöht.",
    "<strong>Market makers</strong> continuously provide buy and sell quotes, earning the spread. They are essential for market liquidity. Notable market makers include Citadel Securities, Virtu Financial, and Jane Street. During crises, market makers may significantly widen their spreads, increasing trading costs."
  ),

  "learn.hftTitle": t("Hochfrequenzhandel (HFT)", "High-Frequency Trading (HFT)"),
  "learn.hftP1": t(
    "<strong>HFT</strong> nutzt Algorithmen und extrem schnelle Verbindungen (Mikrosekunden), um tausende Trades pro Sekunde auszuführen. HFT macht ~50% des US-Aktienhandelsvolumens aus. Strategien umfassen <strong>Latenz-Arbitrage</strong> (Preisunterschiede zwischen Börsen), <strong>Statistical Arbitrage</strong> (korrelierte Wertpapiere) und <strong>Market Making</strong> (automatisiertes Spread-Earning).",
    "<strong>HFT</strong> uses algorithms and extremely fast connections (microseconds) to execute thousands of trades per second. HFT accounts for ~50% of US stock trading volume. Strategies include <strong>latency arbitrage</strong> (price differences between exchanges), <strong>statistical arbitrage</strong> (correlated securities), and <strong>market making</strong> (automated spread earning)."
  ),

  "learn.shortSellingTitle": t("Leerverkäufe (Short Selling)", "Short Selling"),
  "learn.shortSellingP1": t(
    "Beim <strong>Leerverkauf</strong> leihst du dir Aktien und verkaufst sie sofort, in der Hoffnung, sie später günstiger zurückzukaufen. Gewinn = Verkaufspreis minus Rückkaufpreis minus Leihgebühren. Das <strong>Risiko ist theoretisch unbegrenzt</strong>, da der Kurs unendlich steigen kann. Ein <strong>Short Squeeze</strong> entsteht, wenn viele Shorts gleichzeitig eindecken müssen und der Kurs explodiert (GameStop 2021: +1.500% in 2 Wochen).",
    "In <strong>short selling</strong>, you borrow shares and sell them immediately, hoping to buy them back cheaper later. Profit = selling price minus buyback price minus borrowing fees. <strong>Risk is theoretically unlimited</strong>, as the price can rise infinitely. A <strong>short squeeze</strong> occurs when many shorts must cover simultaneously and prices explode (GameStop 2021: +1,500% in 2 weeks)."
  ),

  "learn.slippageTitle": t("Slippage & Execution", "Slippage & Execution"),
  "learn.slippageP1": t(
    "<strong>Slippage</strong> ist die Differenz zwischen erwartetem und tatsächlichem Ausführungspreis. Bei Market Orders in illiquiden Aktien kann Slippage mehrere Prozent betragen. <strong>VWAP</strong> (Volume Weighted Average Price) und <strong>TWAP</strong> (Time Weighted Average Price) sind Algorithmen, die institutionelle Investoren nutzen, um große Orders mit minimalem Marktimpact auszuführen.",
    "<strong>Slippage</strong> is the difference between expected and actual execution price. With market orders in illiquid stocks, slippage can be several percent. <strong>VWAP</strong> (Volume Weighted Average Price) and <strong>TWAP</strong> (Time Weighted Average Price) are algorithms institutional investors use to execute large orders with minimal market impact."
  ),

  "learn.marginTitle": t("Margin-Handel & Hebel", "Margin Trading & Leverage"),
  "learn.marginP1": t(
    "Beim <strong>Margin-Handel</strong> leihst du dir Geld vom Broker, um größere Positionen einzugehen. <strong>Initial Margin</strong> ist der Mindesteinschuss (z.B. 50% bei US-Aktien). <strong>Maintenance Margin</strong> ist die Mindestdeckung (~25 bis 30%). Fällt dein Kontostand darunter, erfolgt ein <strong>Margin Call</strong>: du musst nachschießen oder Positionen werden zwangsliquidiert.",
    "In <strong>margin trading</strong>, you borrow money from your broker to take larger positions. <strong>Initial margin</strong> is the minimum deposit (e.g. 50% for US stocks). <strong>Maintenance margin</strong> is the minimum equity (~25 to 30%). If your account falls below this, you get a <strong>margin call</strong>: you must deposit more or positions are force-liquidated."
  ),
  "learn.marginWarning": t(
    "Margin-Handel kann deine Verluste vervielfachen! Ein 2x Hebel bedeutet: 10% Kursverlust führt zu 20% Kontoverlust. Bei 5x Hebel reicht ein 20% Kursverlust, um dein gesamtes Kapital zu verlieren.",
    "Margin trading can multiply your losses! 2x leverage means: 10% price drop leads to 20% account loss. With 5x leverage, a 20% price drop wipes out your entire capital."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 14: BEHAVIORAL FINANCE
  // ══════════════════════════════════════════════════════════════
  "learn.section14Title": t("Verhaltensökonomie & Marktanomalien", "Behavioral Finance & Market Anomalies"),

  "learn.behavioralIntro": t(
    "Die <strong>Verhaltensökonomie</strong> (Behavioral Finance) untersucht, wie psychologische Faktoren und kognitive Verzerrungen Anlageentscheidungen beeinflussen. Daniel Kahneman erhielt 2002 den Nobelpreis für seine Arbeit zu Entscheidungen unter Unsicherheit.",
    "<strong>Behavioral Finance</strong> studies how psychological factors and cognitive biases influence investment decisions. Daniel Kahneman received the 2002 Nobel Prize for his work on decision-making under uncertainty."
  ),

  "learn.prospectTheoryTitle": t("Prospect Theory (Verlustaversion)", "Prospect Theory (Loss Aversion)"),
  "learn.prospectTheoryP1": t(
    "Menschen empfinden Verluste <strong>2 bis 2,5x stärker</strong> als gleichgroße Gewinne. Das führt dazu, dass Anleger Verlustpositionen zu lange halten (\"es wird schon wieder\"), Gewinnpositionen zu früh verkaufen (\"lieber den Spatz in der Hand\") und übermäßig risikoscheu bei Gewinnen, aber risikofreudig bei Verlusten werden.",
    "People feel losses <strong>2 to 2.5x more strongly</strong> than equal gains. This leads investors to hold losing positions too long (\"it'll come back\"), sell winning positions too early (\"a bird in the hand\"), and become overly risk-averse with gains while risk-seeking with losses."
  ),

  "learn.anchoring": t("Anchoring (Ankereffekt)", "Anchoring Effect"),
  "learn.anchoringDesc": t(
    "Investoren fixieren sich auf einen Referenzpunkt (z.B. den Kaufkurs) und bewerten neue Informationen relativ dazu. Eine Aktie, die von $100 auf $50 gefallen ist, erscheint 'billig', obwohl der faire Wert vielleicht nur $30 beträgt. Der Kaufkurs hat keinen Einfluss auf den zukünftigen Wert!",
    "Investors fixate on a reference point (e.g. purchase price) and evaluate new information relative to it. A stock that dropped from $100 to $50 seems 'cheap', even though fair value might be $30. Your purchase price has no effect on future value!"
  ),

  "learn.overconfidence": t("Overconfidence (Selbstüberschätzung)", "Overconfidence Bias"),
  "learn.overconfidenceDesc": t(
    "Die meisten Anleger überschätzen ihre Fähigkeiten. Studien zeigen: Je häufiger Anleger handeln, desto schlechter ihre Rendite (Barber & Odean, 2000). Männer handeln 45% mehr als Frauen und erzielen durchschnittlich 1% weniger Rendite pro Jahr.",
    "Most investors overestimate their abilities. Studies show: The more frequently investors trade, the worse their returns (Barber & Odean, 2000). Men trade 45% more than women and earn on average 1% less return per year."
  ),

  "learn.dispositionEffect": t("Dispositionseffekt", "Disposition Effect"),
  "learn.dispositionEffectDesc": t(
    "Die Tendenz, Gewinnaktien zu früh zu verkaufen und Verlustaktien zu lange zu halten. Lösung: Setze vor dem Kauf klare Verkaufsregeln (z.B. 15% Stop-Loss, 30% Take-Profit) und halte dich konsequent daran.",
    "The tendency to sell winners too early and hold losers too long. Solution: Set clear selling rules before buying (e.g. 15% stop-loss, 30% take-profit) and stick to them consistently."
  ),

  "learn.anomaliesTitle": t("Marktanomalien", "Market Anomalies"),
  "learn.januaryEffect": t("Januar-Effekt", "January Effect"),
  "learn.januaryEffectDesc": t("Aktien, besonders Small Caps, tendieren dazu, im Januar besser abzuschneiden. Mögliche Ursache: Tax-Loss Harvesting im Dezember mit anschließender Reinvestition im Januar.", "Stocks, especially small caps, tend to outperform in January. Possible cause: tax-loss harvesting in December followed by reinvestment in January."),
  "learn.momentumAnomaly": t("Momentum-Anomalie", "Momentum Anomaly"),
  "learn.momentumAnomalyDesc": t("Aktien, die in den letzten 3 bis 12 Monaten gestiegen sind, tendieren dazu, weiter zu steigen (und umgekehrt). Das widerspricht der Effizienzmarkthypothese.", "Stocks that have risen over the last 3 to 12 months tend to continue rising (and vice versa). This contradicts the efficient market hypothesis."),
  "learn.valueAnomaly": t("Value-Prämie", "Value Premium"),
  "learn.valueAnomalyDesc": t("Aktien mit niedrigem KGV und KBV haben historisch besser abgeschnitten als teure Wachstumsaktien (Fama & French, 1992). Eine mögliche Erklärung ist das höhere fundamentale Risiko.", "Stocks with low P/E and P/B have historically outperformed expensive growth stocks (Fama & French, 1992). A possible explanation is higher fundamental risk."),
  "learn.sizeAnomaly": t("Size-Effekt", "Size Effect"),
  "learn.sizeAnomalyDesc": t("Small-Cap-Aktien haben langfristig höhere Renditen als Large Caps erzielt, allerdings bei deutlich höherer Volatilität und höherem Risiko.", "Small-cap stocks have earned higher returns than large caps long-term, though with significantly higher volatility and risk."),

  "learn.emhTitle": t("Effizienzmarkthypothese (EMH)", "Efficient Market Hypothesis (EMH)"),
  "learn.emhP1": t(
    "Eugene Fama's <strong>EMH</strong> besagt, dass alle verfügbaren Informationen bereits im Kurs eingepreist sind. <strong>Schwache Form</strong>: Historische Kurse enthalten keine nützliche Information (Technische Analyse wäre sinnlos). <strong>Mittelstarke Form</strong>: Alle öffentlichen Infos sind eingepreist (Fundamentalanalyse wäre sinnlos). <strong>Starke Form</strong>: Auch Insiderwissen ist eingepreist (empirisch widerlegt). Die Realität liegt zwischen schwacher und mittelstarker Form. Märkte sind größtenteils, aber nicht perfekt effizient.",
    "Eugene Fama's <strong>EMH</strong> states that all available information is already priced in. <strong>Weak form</strong>: Historical prices contain no useful info (technical analysis would be useless). <strong>Semi-strong form</strong>: All public info is priced in (fundamental analysis would be useless). <strong>Strong form</strong>: Even insider info is priced in (empirically refuted). Reality lies between weak and semi-strong. Markets are mostly, but not perfectly, efficient."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 15: GLOBAL MARKETS & MACRO
  // ══════════════════════════════════════════════════════════════
  "learn.section15Title": t("Globale Märkte & Makroökonomie", "Global Markets & Macroeconomics"),

  "learn.centralBanksTitle": t("Zentralbanken & Geldpolitik", "Central Banks & Monetary Policy"),
  "learn.centralBanksP1": t(
    "Zentralbanken (Fed, EZB, BoJ, BoE) steuern die Wirtschaft über <strong>Leitzinsen</strong> und <strong>Quantitative Easing/Tightening</strong>. Zinssenkungen bedeuten billiges Geld und tendieren zu steigenden Aktienkursen. Zinserhöhungen verteuern Geld und setzen Aktien unter Druck. Die <strong>Fed Funds Rate</strong> ist der wichtigste Zinssatz der Welt und beeinflusst alle Assetklassen.",
    "Central banks (Fed, ECB, BoJ, BoE) steer the economy via <strong>interest rates</strong> and <strong>quantitative easing/tightening</strong>. Rate cuts mean cheap money and tend to push stocks higher. Rate hikes make money expensive and put stocks under pressure. The <strong>Fed Funds Rate</strong> is the most important interest rate in the world and affects all asset classes."
  ),

  "learn.inflationTitle": t("Inflation & Deflation", "Inflation & Deflation"),
  "learn.inflationP1": t(
    "<strong>Inflation</strong> entwertet Bargeld, daher ist Investieren langfristig wichtiger als Sparen. Bei 3% Inflation verliert dein Geld in 24 Jahren die Hälfte seiner Kaufkraft. Aktien und Immobilien bieten historisch den besten Inflationsschutz. <strong>Deflation</strong> (fallende Preise) ist seltener, aber gefährlicher: Konsumenten verschieben Käufe, Unternehmen senken Preise, Gewinne fallen, eine Abwärtsspirale entsteht.",
    "<strong>Inflation</strong> erodes cash, which is why investing is more important than saving long-term. At 3% inflation, your money loses half its purchasing power in 24 years. Stocks and real estate historically provide the best inflation protection. <strong>Deflation</strong> (falling prices) is rarer but more dangerous: consumers delay purchases, companies cut prices, profits fall, creating a downward spiral."
  ),

  "learn.yieldCurveTitle": t("Zinskurve (Yield Curve)", "Yield Curve"),
  "learn.yieldCurveP1": t(
    "Die <strong>Zinskurve</strong> zeigt die Renditen von Staatsanleihen verschiedener Laufzeiten. <strong>Normal</strong>: Langfristige Renditen liegen über kurzfristigen (gesundes Wachstum). <strong>Flach</strong>: Ähnliche Renditen (Unsicherheit). <strong>Invertiert</strong>: Kurzfristige liegen über langfristigen. Das ist der zuverlässigste Rezessionsindikator! Jede US-Rezession seit 1955 wurde von einer invertierten Zinskurve vorhergesagt (mit 6 bis 24 Monaten Vorlauf).",
    "The <strong>yield curve</strong> shows government bond yields across different maturities. <strong>Normal</strong>: Long-term yields above short-term (healthy growth). <strong>Flat</strong>: Similar yields (uncertainty). <strong>Inverted</strong>: Short-term above long-term. This is the most reliable recession indicator! Every US recession since 1955 was preceded by an inverted yield curve (6 to 24 months ahead)."
  ),

  "learn.businessCycleTitle": t("Konjunkturzyklen & Sektorrotation", "Business Cycles & Sector Rotation"),
  "learn.businessCycleP1": t(
    "Die Wirtschaft durchläuft regelmäßig vier Phasen: <strong>Expansion</strong> (Wachstum, Tech und Konsum stark), <strong>Boom/Überhitzung</strong> (Rohstoffe und Energie profitieren), <strong>Rezession</strong> (Gesundheit, Versorger, Basiskonsumgüter halten sich defensiv) und <strong>Erholung</strong> (Finanzen und Industrie führen). Kluge Investoren rotieren ihre Sektorgewichtung entsprechend dem Zyklus (<strong>Sektorrotation</strong>).",
    "The economy regularly cycles through four phases: <strong>Expansion</strong> (growth, tech and consumer strong), <strong>Peak/Overheating</strong> (commodities and energy benefit), <strong>Recession</strong> (healthcare, utilities, consumer staples stay defensive), and <strong>Recovery</strong> (financials and industrials lead). Smart investors rotate their sector weights according to the cycle (<strong>sector rotation</strong>)."
  ),

  "learn.geopoliticsTitle": t("Geopolitik & Black Swans", "Geopolitics & Black Swans"),
  "learn.geopoliticsP1": t(
    "<strong>Black Swans</strong> sind unvorhersehbare Ereignisse mit massivem Marktimpact: COVID-19 (minus 34% in 23 Tagen), Lehman Brothers 2008 (minus 57% vom Hoch), 9/11 (minus 12% in 1 Woche). Man kann sie nicht vorhersagen, aber man kann sich vorbereiten: Diversifikation, Cash-Reserve, keine übermäßige Hebelung und Stop-Losses bei spekulativen Positionen.",
    "<strong>Black Swans</strong> are unpredictable events with massive market impact: COVID-19 (down 34% in 23 days), Lehman Brothers 2008 (down 57% from high), 9/11 (down 12% in 1 week). You can't predict them, but you can prepare: diversification, cash reserves, no excessive leverage, and stop-losses on speculative positions."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 16: QUANTITATIVE ANALYSIS
  // ══════════════════════════════════════════════════════════════
  "learn.section16Title": t("Quantitative Analyse", "Quantitative Analysis"),

  "learn.factorModelsTitle": t("Faktormodelle", "Factor Models"),
  "learn.factorModelsP1": t(
    "<strong>Faktormodelle</strong> erklären Aktienrenditen durch systematische Risikofaktoren. Das bekannteste ist das <strong>Fama-French 3-Faktor-Modell</strong>: Marktrisiko, Size (Small vs. Large) und Value (Low vs. High P/B). Erweitert zum <strong>5-Faktor-Modell</strong> kommen Profitabilität und Investment hinzu. Smart-Beta-ETFs nutzen diese Faktoren, um systematisch Überrenditen zu erzielen.",
    "<strong>Factor models</strong> explain stock returns through systematic risk factors. The most famous is the <strong>Fama-French 3-Factor Model</strong>: market risk, size (small vs. large), and value (low vs. high P/B). Extended to the <strong>5-factor model</strong> with profitability and investment. Smart-beta ETFs use these factors to systematically generate excess returns."
  ),

  "learn.statArbTitle": t("Statistische Arbitrage", "Statistical Arbitrage"),
  "learn.statArbP1": t(
    "<strong>Statistische Arbitrage</strong> identifiziert Preisabweichungen zwischen korrelierten Wertpapieren. <strong>Pairs Trading</strong>: Kaufe die unterbewertete und shorte die überbewertete Aktie eines Paares (z.B. Coca-Cola und Pepsi). Die Strategie profitiert von der Mean-Reversion, also der Tendenz, dass Preise zu ihrem Durchschnitt zurückkehren.",
    "<strong>Statistical arbitrage</strong> identifies price deviations between correlated securities. <strong>Pairs trading</strong>: Buy the undervalued and short the overvalued stock of a pair (e.g. Coca-Cola and Pepsi). The strategy profits from mean reversion, the tendency for prices to return to their average."
  ),

  "learn.backtestingTitle": t("Backtesting-Grundlagen", "Backtesting Basics"),
  "learn.backtestingP1": t(
    "<strong>Backtesting</strong> testet eine Handelsstrategie an historischen Daten. Wichtige Fallstricke: <strong>Overfitting</strong> (Strategie funktioniert nur auf historischen Daten), <strong>Survivorship Bias</strong> (nur überlebende Aktien wurden getestet) und <strong>Look-ahead Bias</strong> (Verwendung zukünftiger Informationen). Eine robuste Strategie sollte auf verschiedenen Zeiträumen und Märkten funktionieren.",
    "<strong>Backtesting</strong> tests a trading strategy on historical data. Important pitfalls: <strong>overfitting</strong> (strategy only works on historical data), <strong>survivorship bias</strong> (only surviving stocks tested), and <strong>look-ahead bias</strong> (using future information). A robust strategy should work across different time periods and markets."
  ),

  "learn.alphaBetaTitle": t("Alpha vs. Beta", "Alpha vs. Beta"),
  "learn.alphaBetaP1": t(
    "<strong>Beta</strong> misst das systematische Marktrisiko und die damit verbundene Rendite. Jeder kann Beta durch Index-ETFs kaufen. <strong>Alpha</strong> ist die Überrendite, die über das Beta hinausgeht, also die 'Skill'-Komponente eines Fondsmanagers. Die meisten aktiven Manager erzeugen nach Kosten negatives Alpha. Echtes Alpha ist selten, teuer und wird durch Wettbewerb schnell arbitriert.",
    "<strong>Beta</strong> measures systematic market risk and the associated return. Anyone can buy beta through index ETFs. <strong>Alpha</strong> is the excess return beyond beta, the 'skill' component of a fund manager. Most active managers generate negative alpha after fees. True alpha is rare, expensive, and quickly arbitraged by competition."
  ),

  // ── Quiz translations ──
  "learn.quizStrategies": t("Quiz: Anlagestrategien", "Quiz: Investment Strategies"),
  "learn.quizPortfolio": t("Quiz: Portfoliomanagement", "Quiz: Portfolio Management"),
  "learn.quizTA": t("Quiz: Technische Analyse", "Quiz: Technical Analysis"),
};

export const learnTranslations: Record<string, Record<Language, string>> = {
  ...baseTranslations,
  ...learnTranslationsExtended,
};
