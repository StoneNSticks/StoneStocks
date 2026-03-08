import type { Language } from "@/contexts/LanguageContext";

const t = (de: string, en: string): Record<Language, string> => ({ de, en });

export const learnTranslationsExtended: Record<string, Record<Language, string>> = {
  // ── Super-Section Headers ──
  "learn.superE": t("Akademisch", "Academic"),
  "learn.superF": t("Meisterklasse", "Master Class"),
  "learn.levelAcademic": t("🔵 Akademisch", "🔵 Academic"),
  "learn.levelMaster": t("⚫ Meisterklasse", "⚫ Master Class"),

  // ── TOC entries ──
  "learn.toc17": t("17. Corporate Finance", "17. Corporate Finance"),
  "learn.toc18": t("18. Rechnungswesen & Bilanzanalyse", "18. Accounting & Financial Statements"),
  "learn.toc19": t("19. Internationale Finanzmärkte", "19. International Finance"),
  "learn.toc20": t("20. Fixed Income Advanced", "20. Fixed Income Advanced"),
  "learn.toc21": t("21. ESG & Nachhaltiges Investieren", "21. ESG & Sustainable Investing"),
  "learn.toc22": t("22. Finanzregulierung & Compliance", "22. Financial Regulation & Compliance"),
  "learn.toc23": t("23. Bewertungsmethoden", "23. Valuation Methods"),
  "learn.toc24": t("24. Alternative Investments Advanced", "24. Alternative Investments Advanced"),
  "learn.toc25": t("25. Marktgeschichte & Krisen", "25. Market History & Crises"),
  "learn.toc26": t("26. Personal Finance & Altersvorsorge", "26. Personal Finance & Retirement"),
  "learn.toc27": t("27. Ökonometrie & Financial Modeling", "27. Econometrics & Financial Modeling"),
  "learn.toc28": t("28. Geldpolitik & Bankensystem", "28. Monetary Policy & Banking"),

  // ══════════════════════════════════════════════════════════════
  // SECTION 17: CORPORATE FINANCE
  // ══════════════════════════════════════════════════════════════
  "learn.section17Title": t("Corporate Finance", "Corporate Finance"),

  "learn.capitalStructureTitle": t("Kapitalstruktur", "Capital Structure"),
  "learn.capitalStructureP1": t(
    "Die <strong>Kapitalstruktur</strong> beschreibt das Verhältnis von Eigen- zu Fremdkapital eines Unternehmens. Das <strong>Modigliani-Miller-Theorem</strong> (1958) postuliert, dass in einem perfekten Markt die Kapitalstruktur irrelevant für den Unternehmenswert ist. In der Realität gibt es aber steuerliche Vorteile von Fremdkapital (Tax Shield) und Insolvenzkosten, die eine optimale Kapitalstruktur nahelegen.",
    "The <strong>capital structure</strong> describes the ratio of equity to debt of a company. The <strong>Modigliani-Miller theorem</strong> (1958) postulates that in a perfect market, capital structure is irrelevant to firm value. In reality, there are tax advantages of debt (tax shield) and bankruptcy costs that suggest an optimal capital structure."
  ),
  "learn.capitalStructureP2": t(
    "Der <strong>Debt-to-Equity Ratio</strong> (Verschuldungsgrad) zeigt, wie viel Fremdkapital im Verhältnis zum Eigenkapital eingesetzt wird. Ein hoher Verschuldungsgrad erhöht sowohl Rendite als auch Risiko durch den <strong>Leverage-Effekt</strong>.",
    "The <strong>Debt-to-Equity Ratio</strong> shows how much debt is used relative to equity. A high leverage ratio increases both returns and risk through the <strong>leverage effect</strong>."
  ),

  "learn.maTitle": t("Fusionen & Übernahmen (M&A)", "Mergers & Acquisitions (M&A)"),
  "learn.maP1": t(
    "<strong>M&A</strong> umfasst den Kauf, Verkauf und die Zusammenlegung von Unternehmen. Motivationen: Synergien (Kostenreduktion), Marktzugang, Diversifikation oder Eliminierung von Wettbewerbern. Man unterscheidet <strong>horizontale Fusionen</strong> (gleiche Branche), <strong>vertikale Fusionen</strong> (Lieferkette) und <strong>konglomerate Fusionen</strong> (verschiedene Branchen).",
    "<strong>M&A</strong> encompasses buying, selling, and combining companies. Motivations: synergies (cost reduction), market access, diversification, or eliminating competitors. Types: <strong>horizontal mergers</strong> (same industry), <strong>vertical mergers</strong> (supply chain), and <strong>conglomerate mergers</strong> (different industries)."
  ),
  "learn.maP2": t(
    "Der <strong>Aufschlag (Premium)</strong> über den Aktienkurs liegt typischerweise bei 20-40%. Studien zeigen, dass Übernahmen häufig den Aktionären des Zielunternehmens nützen, aber oft den Aktionären des Käufers schaden.",
    "The <strong>premium</strong> over the stock price is typically 20-40%. Studies show that acquisitions often benefit target shareholders but frequently harm acquirer shareholders."
  ),

  "learn.ipoTitle": t("Börsengänge (IPO)", "Initial Public Offerings (IPO)"),
  "learn.ipoP1": t(
    "Ein <strong>IPO</strong> (Initial Public Offering) ist der erstmalige Verkauf von Aktien an der Börse. Das Unternehmen wählt eine Investmentbank als <strong>Underwriter</strong>, die den Ausgabepreis festlegt, Investoren findet und das Risiko übernimmt. Der Prozess umfasst <strong>Due Diligence</strong>, Erstellung des Prospekts (S-1 in den USA), <strong>Roadshow</strong> und <strong>Bookbuilding</strong>.",
    "An <strong>IPO</strong> (Initial Public Offering) is the first sale of shares on the stock exchange. The company selects an investment bank as <strong>underwriter</strong>, who sets the offering price, finds investors, and assumes risk. The process includes <strong>due diligence</strong>, prospectus preparation (S-1 in the US), <strong>roadshow</strong>, and <strong>bookbuilding</strong>."
  ),
  "learn.ipoP2": t(
    "Alternativen zum klassischen IPO: <strong>SPAC</strong> (Special Purpose Acquisition Company), <strong>Direct Listing</strong> (ohne Underwriter) und <strong>Dutch Auction</strong> (Google, 2004). IPO-Aktien sind in den ersten Monaten oft sehr volatil.",
    "Alternatives to traditional IPOs: <strong>SPAC</strong> (Special Purpose Acquisition Company), <strong>Direct Listing</strong> (without underwriter), and <strong>Dutch Auction</strong> (Google, 2004). IPO stocks are often very volatile in the first months."
  ),

  "learn.corpGovTitle": t("Corporate Governance", "Corporate Governance"),
  "learn.corpGovP1": t(
    "<strong>Corporate Governance</strong> umfasst die Regeln und Praktiken, nach denen ein Unternehmen geführt wird. Kernthemen: <strong>Agency-Problem</strong> (Interessen des Managements vs. Aktionäre), <strong>Board of Directors</strong> (Aufsichtsrat), <strong>Vergütungssysteme</strong> und <strong>Aktionärsrechte</strong>. Gute Governance korreliert mit besserer langfristiger Performance.",
    "<strong>Corporate Governance</strong> encompasses the rules and practices by which a company is directed. Core topics: <strong>agency problem</strong> (management vs. shareholder interests), <strong>board of directors</strong>, <strong>compensation systems</strong>, and <strong>shareholder rights</strong>. Good governance correlates with better long-term performance."
  ),

  "learn.dividendPolicyTitle": t("Dividendenpolitik", "Dividend Policy"),
  "learn.dividendPolicyP1": t(
    "Die <strong>Dividendenpolitik</strong> bestimmt, wie viel vom Gewinn ausgeschüttet vs. reinvestiert wird. <strong>Irrelevanztheorie</strong> (Modigliani-Miller): In perfekten Märkten ist Dividendenpolitik irrelevant. <strong>Bird-in-the-Hand-Theorie</strong>: Anleger bevorzugen sichere Dividenden. <strong>Signaling-Theorie</strong>: Dividendenerhöhungen signalisieren Vertrauen des Managements. <strong>Payout Ratio</strong> = Dividende / Gewinn. Nachhaltiger Bereich: 30-60%.",
    "The <strong>dividend policy</strong> determines how much profit is distributed vs. reinvested. <strong>Irrelevance theory</strong> (Modigliani-Miller): In perfect markets, dividend policy is irrelevant. <strong>Bird-in-the-hand theory</strong>: Investors prefer certain dividends. <strong>Signaling theory</strong>: Dividend increases signal management confidence. <strong>Payout Ratio</strong> = Dividend / Earnings. Sustainable range: 30-60%."
  ),

  "learn.shareRepurchaseTitle": t("Aktienrückkäufe", "Share Buybacks"),
  "learn.shareRepurchaseP1": t(
    "<strong>Aktienrückkäufe</strong> sind eine Alternative zur Dividende. Das Unternehmen kauft eigene Aktien am Markt zurück, wodurch der Gewinn pro Aktie (EPS) steigt. Steuerlich oft effizienter als Dividenden. Kritik: Rückkäufe können kurzfristiges EPS-Wachstum vortäuschen und werden oft zu überhöhten Kursen durchgeführt.",
    "<strong>Share buybacks</strong> are an alternative to dividends. The company repurchases its own shares on the market, increasing earnings per share (EPS). Often more tax-efficient than dividends. Criticism: Buybacks can artificially inflate short-term EPS and are often executed at inflated prices."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 18: ACCOUNTING & FINANCIAL STATEMENTS
  // ══════════════════════════════════════════════════════════════
  "learn.section18Title": t("Rechnungswesen & Bilanzanalyse", "Accounting & Financial Statements"),

  "learn.threeStatementsTitle": t("Die drei Abschlüsse", "The Three Financial Statements"),
  "learn.threeStatementsP1": t(
    "Jedes börsennotierte Unternehmen veröffentlicht drei zentrale Abschlüsse: <strong>1) Gewinn- und Verlustrechnung</strong> (Income Statement): Zeigt Umsatz, Kosten und Gewinn über einen Zeitraum. <strong>2) Bilanz</strong> (Balance Sheet): Momentaufnahme aller Vermögenswerte und Schulden. <strong>3) Kapitalflussrechnung</strong> (Cash Flow Statement): Zeigt die tatsächlichen Geldbewegungen.",
    "Every publicly traded company publishes three key statements: <strong>1) Income Statement</strong>: Shows revenue, costs, and profit over a period. <strong>2) Balance Sheet</strong>: Snapshot of all assets and liabilities. <strong>3) Cash Flow Statement</strong>: Shows actual cash movements."
  ),

  "learn.incomeStatementTitle": t("Gewinn- und Verlustrechnung (GuV)", "Income Statement (P&L)"),
  "learn.incomeStatementP1": t(
    "Die <strong>GuV</strong> zeigt die Ertragskraft: <strong>Umsatz</strong> → minus COGS = <strong>Bruttogewinn</strong> → minus OpEx = <strong>EBIT</strong> (operativer Gewinn) → minus Zinsen = <strong>EBT</strong> → minus Steuern = <strong>Nettogewinn</strong>. Wichtige Margen: <strong>Bruttomarge</strong> (Bruttogewinn/Umsatz), <strong>EBIT-Marge</strong>, <strong>Nettomarge</strong>. Steigende Margen über Zeit sind ein positives Zeichen.",
    "The <strong>P&L</strong> shows earning power: <strong>Revenue</strong> → minus COGS = <strong>Gross Profit</strong> → minus OpEx = <strong>EBIT</strong> (operating income) → minus Interest = <strong>EBT</strong> → minus Taxes = <strong>Net Income</strong>. Key margins: <strong>Gross Margin</strong> (Gross Profit/Revenue), <strong>EBIT Margin</strong>, <strong>Net Margin</strong>. Rising margins over time are a positive sign."
  ),

  "learn.cashFlowStatementTitle": t("Kapitalflussrechnung", "Cash Flow Statement"),
  "learn.cashFlowStatementP1": t(
    "Die <strong>Kapitalflussrechnung</strong> gliedert sich in: <strong>Operativer Cashflow</strong> (OCF): Geld aus dem Tagesgeschäft. <strong>Investitions-Cashflow</strong>: Käufe/Verkäufe von Anlagen (CapEx). <strong>Finanzierungs-Cashflow</strong>: Aufnahme/Tilgung von Schulden, Dividenden, Aktienrückkäufe. <strong>Free Cash Flow = OCF - CapEx</strong> ist die wichtigste Kennzahl für Investoren.",
    "The <strong>Cash Flow Statement</strong> is divided into: <strong>Operating Cash Flow</strong> (OCF): Cash from daily operations. <strong>Investing Cash Flow</strong>: Purchases/sales of assets (CapEx). <strong>Financing Cash Flow</strong>: Debt issuance/repayment, dividends, buybacks. <strong>Free Cash Flow = OCF - CapEx</strong> is the most important metric for investors."
  ),

  "learn.ratioAnalysisTitle": t("Kennzahlenanalyse", "Financial Ratio Analysis"),
  "learn.ratioAnalysisP1": t(
    "Wichtige Kennzahlengruppen: <strong>Liquidität</strong>: Current Ratio (Umlaufvermögen/kurzfristige Verbindlichkeiten >1,5), Quick Ratio (ohne Vorräte). <strong>Profitabilität</strong>: ROE, ROA, ROIC (Return on Invested Capital). <strong>Verschuldung</strong>: D/E Ratio, Interest Coverage (EBIT/Zinsaufwand >3x). <strong>Effizienz</strong>: Lagerumschlag, Forderungslaufzeit, Asset Turnover.",
    "Key ratio groups: <strong>Liquidity</strong>: Current Ratio (current assets/current liabilities >1.5), Quick Ratio (excluding inventory). <strong>Profitability</strong>: ROE, ROA, ROIC (Return on Invested Capital). <strong>Leverage</strong>: D/E Ratio, Interest Coverage (EBIT/Interest expense >3x). <strong>Efficiency</strong>: Inventory Turnover, Days Sales Outstanding, Asset Turnover."
  ),

  "learn.duPontTitle": t("DuPont-Analyse", "DuPont Analysis"),
  "learn.duPontP1": t(
    "Die <strong>DuPont-Analyse</strong> zerlegt den ROE in drei Komponenten: <strong>ROE = Nettomarge × Kapitalumschlag × Leverage</strong>. So wird sichtbar, ob hohe Eigenkapitalrendite durch Profitabilität, Effizienz oder Verschuldung entsteht. Ein ROE von 20% durch hohe Marge ist nachhaltiger als einer durch hohen Leverage.",
    "The <strong>DuPont Analysis</strong> breaks ROE into three components: <strong>ROE = Net Margin × Asset Turnover × Leverage</strong>. This reveals whether high return on equity comes from profitability, efficiency, or leverage. An ROE of 20% from high margins is more sustainable than one from high leverage."
  ),

  "learn.accrualVsCashTitle": t("Accrual vs. Cash Accounting", "Accrual vs. Cash Accounting"),
  "learn.accrualVsCashP1": t(
    "<strong>Accrual Accounting</strong> (periodengerechte Buchführung) erfasst Einnahmen und Ausgaben, wenn sie wirtschaftlich anfallen, nicht wenn Geld fließt. <strong>Cash Accounting</strong> erfasst nur tatsächliche Zahlungsströme. Börsennotierten Unternehmen nutzen Accrual. Deshalb kann ein profitables Unternehmen trotzdem Liquiditätsprobleme haben – der Cashflow ist entscheidend!",
    "<strong>Accrual Accounting</strong> records income and expenses when they're economically incurred, not when cash flows. <strong>Cash Accounting</strong> records only actual cash movements. Public companies use accrual. That's why a profitable company can still have liquidity problems – cash flow is what matters!"
  ),

  "learn.goodwillTitle": t("Goodwill & Immaterielle Vermögenswerte", "Goodwill & Intangible Assets"),
  "learn.goodwillP1": t(
    "<strong>Goodwill</strong> entsteht bei Übernahmen, wenn der Kaufpreis den Buchwert der Vermögenswerte übersteigt. Er repräsentiert Marke, Kundenstamm, Know-how. Goodwill wird jährlich auf Wertminderung geprüft (Impairment Test). Große Goodwill-Abschreibungen sind oft ein Zeichen, dass eine Akquisition gescheitert ist.",
    "<strong>Goodwill</strong> arises in acquisitions when the purchase price exceeds the book value of assets. It represents brand, customer base, know-how. Goodwill is tested annually for impairment. Large goodwill write-downs often signal a failed acquisition."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 19: INTERNATIONAL FINANCE
  // ══════════════════════════════════════════════════════════════
  "learn.section19Title": t("Internationale Finanzmärkte", "International Finance"),

  "learn.forexMarketsTitle": t("Devisenmärkte (Forex)", "Foreign Exchange Markets (Forex)"),
  "learn.forexMarketsP1": t(
    "Der <strong>Devisenmarkt</strong> (Forex) ist mit $7,5 Billionen täglichem Handelsvolumen der größte Finanzmarkt der Welt. Währungspaare werden in <strong>Majors</strong> (EUR/USD, GBP/USD, USD/JPY), <strong>Minors</strong> und <strong>Exotics</strong> unterteilt. Der Markt ist 24/5 geöffnet und wird von Zentralbanken, Geschäftsbanken, Hedgefonds und Unternehmen dominiert.",
    "The <strong>foreign exchange market</strong> (Forex) with $7.5 trillion in daily volume is the world's largest financial market. Currency pairs are divided into <strong>majors</strong> (EUR/USD, GBP/USD, USD/JPY), <strong>minors</strong>, and <strong>exotics</strong>. The market is open 24/5 and dominated by central banks, commercial banks, hedge funds, and corporations."
  ),

  "learn.pppTitle": t("Kaufkraftparität (PPP)", "Purchasing Power Parity (PPP)"),
  "learn.pppP1": t(
    "Die <strong>Kaufkraftparität</strong> besagt, dass identische Güter in verschiedenen Ländern nach Umrechnung den gleichen Preis haben sollten. Der <strong>Big Mac Index</strong> (The Economist) nutzt dieses Prinzip, um Über-/Unterbewertungen von Währungen zu identifizieren. Langfristig tendieren Wechselkurse zur PPP, kurzfristig dominieren Zinsunterschiede und Kapitalströme.",
    "<strong>Purchasing Power Parity</strong> states that identical goods should cost the same across countries when converted. The <strong>Big Mac Index</strong> (The Economist) uses this principle to identify currency over-/undervaluation. Long-term, exchange rates tend toward PPP; short-term, interest rate differentials and capital flows dominate."
  ),

  "learn.irpTitle": t("Zinsparität (IRP)", "Interest Rate Parity (IRP)"),
  "learn.irpP1": t(
    "Die <strong>Zinsparität</strong> verknüpft Zinsdifferenzen zwischen Ländern mit erwarteten Wechselkursänderungen. <strong>Covered Interest Rate Parity</strong>: Die Terminprämie/-abschlag einer Währung entspricht dem Zinsunterschied. <strong>Uncovered IRP</strong>: Erwartete Wechselkursänderung = Zinsdifferenz. In der Praxis wird UIP oft verletzt, was die Grundlage für <strong>Carry Trades</strong> bildet.",
    "<strong>Interest Rate Parity</strong> links interest rate differentials between countries with expected exchange rate changes. <strong>Covered IRP</strong>: The forward premium/discount equals the interest rate differential. <strong>Uncovered IRP</strong>: Expected exchange rate change = interest differential. In practice, UIP is often violated, forming the basis for <strong>carry trades</strong>."
  ),

  "learn.carryTradeTitle": t("Carry Trade", "Carry Trade"),
  "learn.carryTradeP1": t(
    "Ein <strong>Carry Trade</strong> borgt in einer Niedrigzinswährung (z.B. JPY, CHF) und investiert in einer Hochzinswährung (z.B. AUD, BRL). Der Gewinn ist die Zinsdifferenz, solange der Wechselkurs stabil bleibt. Risiko: Bei plötzlicher Umkehr (Risk-off Events) können massive Verluste entstehen, wie 2008 oder beim JPY-Crash 2024.",
    "A <strong>carry trade</strong> borrows in a low-interest currency (e.g., JPY, CHF) and invests in a high-interest currency (e.g., AUD, BRL). Profit comes from the interest rate differential as long as the exchange rate remains stable. Risk: Sudden reversals (risk-off events) can cause massive losses, as in 2008 or the JPY crash of 2024."
  ),

  "learn.emergingMarketsTitle": t("Emerging Markets", "Emerging Markets"),
  "learn.emergingMarketsP1": t(
    "<strong>Emerging Markets</strong> (Schwellenländer) bieten höheres Wachstumspotenzial, aber auch höhere Risiken: politische Instabilität, Währungsabwertung, geringere Transparenz und Liquidität. Wichtige Indizes: <strong>MSCI Emerging Markets</strong> (China, Indien, Brasilien, Taiwan, Südkorea). Die Korrelation zu Industrieländern ist gestiegen, was Diversifikationsvorteile schmälert.",
    "<strong>Emerging Markets</strong> offer higher growth potential but also higher risks: political instability, currency depreciation, lower transparency and liquidity. Key indices: <strong>MSCI Emerging Markets</strong> (China, India, Brazil, Taiwan, South Korea). Correlation with developed markets has increased, reducing diversification benefits."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 20: FIXED INCOME ADVANCED
  // ══════════════════════════════════════════════════════════════
  "learn.section20Title": t("Fixed Income Advanced", "Fixed Income Advanced"),

  "learn.durationTitle": t("Duration & Zinssensitivität", "Duration & Interest Rate Sensitivity"),
  "learn.durationP1": t(
    "<strong>Duration</strong> misst die Zinssensitivität einer Anleihe. <strong>Macaulay Duration</strong>: gewichtete durchschnittliche Laufzeit der Cashflows. <strong>Modified Duration</strong>: prozentuale Kursänderung bei 1% Zinsänderung. Beispiel: Eine Anleihe mit Modified Duration von 5 fällt ~5% bei 1% Zinsanstieg. Längere Laufzeit und niedrigerer Kupon = höhere Duration = höheres Zinsrisiko.",
    "<strong>Duration</strong> measures a bond's interest rate sensitivity. <strong>Macaulay Duration</strong>: weighted average time to receive cash flows. <strong>Modified Duration</strong>: percentage price change for a 1% interest rate change. Example: A bond with modified duration of 5 drops ~5% for a 1% rate increase. Longer maturity and lower coupon = higher duration = higher interest rate risk."
  ),

  "learn.convexityTitle": t("Konvexität", "Convexity"),
  "learn.convexityP1": t(
    "<strong>Konvexität</strong> misst, wie sich die Duration selbst bei Zinsänderungen verändert. Anleihen mit positiver Konvexität profitieren überproportional von Zinssenkungen und verlieren unterproportional bei Zinserhöhungen. Die Preisänderung wird genauer geschätzt durch: <strong>ΔP ≈ -Duration × Δy + ½ × Convexity × (Δy)²</strong>.",
    "<strong>Convexity</strong> measures how duration itself changes with interest rate movements. Bonds with positive convexity benefit disproportionately from rate decreases and lose less from rate increases. Price change is more accurately estimated by: <strong>ΔP ≈ -Duration × Δy + ½ × Convexity × (Δy)²</strong>."
  ),

  "learn.creditAnalysisTitle": t("Kreditanalyse & Ratings", "Credit Analysis & Ratings"),
  "learn.creditAnalysisP1": t(
    "Die drei großen <strong>Ratingagenturen</strong> (S&P, Moody's, Fitch) bewerten die Kreditwürdigkeit. <strong>Investment Grade</strong>: BBB-/Baa3 oder besser. <strong>High Yield/Junk</strong>: BB+/Ba1 oder schlechter. Ratingänderungen (Upgrades/Downgrades) haben direkte Auswirkungen auf Anleihepreise und Finanzierungskosten. Der <strong>Credit Spread</strong> ist die Renditedifferenz zur risikofreien Staatsanleihe.",
    "The three major <strong>rating agencies</strong> (S&P, Moody's, Fitch) assess creditworthiness. <strong>Investment Grade</strong>: BBB-/Baa3 or better. <strong>High Yield/Junk</strong>: BB+/Ba1 or worse. Rating changes (upgrades/downgrades) directly impact bond prices and financing costs. The <strong>credit spread</strong> is the yield difference to risk-free government bonds."
  ),

  "learn.bondValuationTitle": t("Anleihenbewertung", "Bond Valuation"),
  "learn.bondValuationP1": t(
    "Der <strong>Preis einer Anleihe</strong> = Barwert aller zukünftigen Cashflows: <strong>P = Σ C/(1+r)^t + FV/(1+r)^n</strong>, wobei C = Kupon, r = Marktzins, FV = Nennwert, n = Restlaufzeit. Wenn Marktzins > Kupon handelt die Anleihe unter par (Discount), bei Marktzins < Kupon über par (Premium).",
    "The <strong>price of a bond</strong> = present value of all future cash flows: <strong>P = Σ C/(1+r)^t + FV/(1+r)^n</strong>, where C = coupon, r = market rate, FV = face value, n = remaining term. When market rate > coupon, the bond trades below par (discount); when market rate < coupon, above par (premium)."
  ),

  "learn.yieldMeasuresTitle": t("Renditekennzahlen", "Yield Measures"),
  "learn.yieldMeasuresP1": t(
    "Verschiedene Renditekonzepte: <strong>Current Yield</strong> = Kupon/Kurs (einfachste Messung). <strong>YTM</strong> (Yield to Maturity) = interner Zinsfuß bei Haltung bis Fälligkeit. <strong>YTC</strong> (Yield to Call) = für kündbare Anleihen. <strong>Real Yield</strong> = Nominalrendite minus Inflation. <strong>TIPS</strong> (Treasury Inflation-Protected Securities) bieten inflationsgeschützte Realrendite.",
    "Different yield concepts: <strong>Current Yield</strong> = Coupon/Price (simplest measure). <strong>YTM</strong> (Yield to Maturity) = internal rate of return when held to maturity. <strong>YTC</strong> (Yield to Call) = for callable bonds. <strong>Real Yield</strong> = nominal yield minus inflation. <strong>TIPS</strong> (Treasury Inflation-Protected Securities) offer inflation-protected real yields."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 21: ESG & SUSTAINABLE INVESTING
  // ══════════════════════════════════════════════════════════════
  "learn.section21Title": t("ESG & Nachhaltiges Investieren", "ESG & Sustainable Investing"),

  "learn.esgOverviewTitle": t("Was ist ESG?", "What is ESG?"),
  "learn.esgOverviewP1": t(
    "<strong>ESG</strong> steht für <strong>Environmental</strong> (Umwelt: CO₂-Emissionen, Wasserverbrauch, Abfallmanagement), <strong>Social</strong> (Soziales: Arbeitnehmerrechte, Diversität, Lieferkette) und <strong>Governance</strong> (Unternehmensführung: Vorstandsunabhängigkeit, Vergütung, Transparenz). ESG-Kriterien werden zunehmend in Investmententscheidungen integriert.",
    "<strong>ESG</strong> stands for <strong>Environmental</strong> (CO₂ emissions, water usage, waste management), <strong>Social</strong> (employee rights, diversity, supply chain), and <strong>Governance</strong> (board independence, compensation, transparency). ESG criteria are increasingly integrated into investment decisions."
  ),

  "learn.esgStrategiesTitle": t("ESG-Anlagestrategien", "ESG Investment Strategies"),
  "learn.negativeScreening": t("Negative Screening", "Negative Screening"),
  "learn.negativeScreeningDesc": t("Ausschluss bestimmter Branchen (Waffen, Tabak, fossile Brennstoffe). Einfachste ESG-Strategie.", "Excluding certain industries (weapons, tobacco, fossil fuels). Simplest ESG strategy."),
  "learn.bestInClass": t("Best-in-Class", "Best-in-Class"),
  "learn.bestInClassDesc": t("Investition in ESG-Vorreiter jeder Branche, auch in kontroversen Sektoren.", "Investing in ESG leaders within each sector, even in controversial industries."),
  "learn.impactInvesting": t("Impact Investing", "Impact Investing"),
  "learn.impactInvestingDesc": t("Gezielte Investitionen mit messbarer sozialer/ökologischer Wirkung neben finanzieller Rendite.", "Targeted investments with measurable social/environmental impact alongside financial returns."),
  "learn.thematicESG": t("Thematisches ESG", "Thematic ESG"),
  "learn.thematicESGDesc": t("Fokus auf spezifische Themen wie Clean Energy, Wasser, Bildung oder Gesundheit.", "Focus on specific themes like clean energy, water, education, or healthcare."),

  "learn.greenwashingTitle": t("Greenwashing erkennen", "Recognizing Greenwashing"),
  "learn.greenwashingP1": t(
    "<strong>Greenwashing</strong> liegt vor, wenn Unternehmen oder Fonds sich nachhaltiger darstellen, als sie sind. Warnsignale: vage ESG-Claims ohne Daten, fehlende Drittanbieter-Ratings, hoher Anteil fossiler Brennstoffe trotz 'grünem' Label. Prüfe: <strong>MSCI ESG Rating</strong>, <strong>Sustainalytics Score</strong>, <strong>CDP-Ratings</strong> und die tatsächlichen Top-Holdings des Fonds.",
    "<strong>Greenwashing</strong> occurs when companies or funds portray themselves as more sustainable than they are. Warning signs: vague ESG claims without data, missing third-party ratings, high fossil fuel exposure despite 'green' label. Check: <strong>MSCI ESG Rating</strong>, <strong>Sustainalytics Score</strong>, <strong>CDP Ratings</strong>, and the fund's actual top holdings."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 22: FINANCIAL REGULATION & COMPLIANCE
  // ══════════════════════════════════════════════════════════════
  "learn.section22Title": t("Finanzregulierung & Compliance", "Financial Regulation & Compliance"),

  "learn.regulatorsTitle": t("Wichtige Regulierungsbehörden", "Key Regulatory Bodies"),
  "learn.sec": t("SEC (USA)", "SEC (USA)"),
  "learn.secDesc": t("Securities and Exchange Commission. Überwacht Wertpapiermärkte, erzwingt Offenlegungspflichten, verfolgt Insiderhandel.", "Securities and Exchange Commission. Oversees securities markets, enforces disclosure requirements, prosecutes insider trading."),
  "learn.bafin": t("BaFin (Deutschland)", "BaFin (Germany)"),
  "learn.bafinDesc": t("Bundesanstalt für Finanzdienstleistungsaufsicht. Reguliert Banken, Versicherungen und den Wertpapierhandel in Deutschland.", "Federal Financial Supervisory Authority. Regulates banks, insurance, and securities trading in Germany."),
  "learn.ecb": t("EZB (Europa)", "ECB (Europe)"),
  "learn.ecbDesc": t("Europäische Zentralbank. Verantwortlich für Geldpolitik im Euroraum und Bankenaufsicht (SSM).", "European Central Bank. Responsible for monetary policy in the eurozone and bank supervision (SSM)."),
  "learn.esma": t("ESMA (Europa)", "ESMA (Europe)"),
  "learn.esmaDesc": t("European Securities and Markets Authority. Harmonisiert Finanzmarktregulierung in der EU.", "European Securities and Markets Authority. Harmonizes financial market regulation in the EU."),

  "learn.mifidTitle": t("MiFID II & Anlegerschutz", "MiFID II & Investor Protection"),
  "learn.mifidP1": t(
    "<strong>MiFID II</strong> (Markets in Financial Instruments Directive) ist das zentrale EU-Regelwerk für Finanzmärkte. Kernelemente: <strong>Transparenzpflichten</strong> für Handelsdaten, <strong>Best Execution</strong> (Broker müssen den besten Preis bieten), <strong>Produktinformationsblätter</strong> (KIIDs), Verbot bestimmter Provisionen und Kostentransparenz für Anleger.",
    "<strong>MiFID II</strong> (Markets in Financial Instruments Directive) is the central EU framework for financial markets. Core elements: <strong>transparency requirements</strong> for trading data, <strong>best execution</strong> (brokers must offer the best price), <strong>key information documents</strong> (KIIDs), ban on certain commissions, and cost transparency for investors."
  ),

  "learn.insiderTradingTitle": t("Insiderhandel & Marktmanipulation", "Insider Trading & Market Manipulation"),
  "learn.insiderTradingP1": t(
    "<strong>Insiderhandel</strong> ist der Kauf/Verkauf von Wertpapieren auf Basis nicht-öffentlicher, kursrelevanter Informationen. Strafen: In den USA bis zu 20 Jahre Haft, in Deutschland bis zu 5 Jahre. <strong>Marktmanipulation</strong> umfasst: Pump & Dump, Wash Trading (Scheinhandel), Spoofing (Fake-Orders) und Verbreitung falscher Informationen.",
    "<strong>Insider trading</strong> is buying/selling securities based on non-public, price-sensitive information. Penalties: In the US up to 20 years imprisonment, in Germany up to 5 years. <strong>Market manipulation</strong> includes: Pump & Dump, wash trading, spoofing (fake orders), and spreading false information."
  ),

  "learn.baselTitle": t("Basel III & Bankenregulierung", "Basel III & Banking Regulation"),
  "learn.baselP1": t(
    "<strong>Basel III</strong> ist das internationale Regelwerk für Banken. Kernpunkte: <strong>Eigenkapitalquote</strong> (CET1 mindestens 4,5%), <strong>Leverage Ratio</strong> (mindestens 3%), <strong>Liquidity Coverage Ratio</strong> (LCR: genug kurzfristige Liquidität für 30 Tage), <strong>Net Stable Funding Ratio</strong> (NSFR: langfristige Finanzierungsstabilität). Diese Regeln sollen Bankenkrisen wie 2008 verhindern.",
    "<strong>Basel III</strong> is the international framework for banks. Core points: <strong>capital ratio</strong> (CET1 at least 4.5%), <strong>leverage ratio</strong> (at least 3%), <strong>Liquidity Coverage Ratio</strong> (LCR: enough short-term liquidity for 30 days), <strong>Net Stable Funding Ratio</strong> (NSFR: long-term funding stability). These rules aim to prevent banking crises like 2008."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 23: VALUATION METHODS
  // ══════════════════════════════════════════════════════════════
  "learn.section23Title": t("Bewertungsmethoden", "Valuation Methods"),

  "learn.multiples Title": t("Multiplikatorenbewertung", "Multiples Valuation"),
  "learn.multiplesP1": t(
    "<strong>Multiplikatoren</strong> vergleichen den Preis mit einer Finanzkennzahl: <strong>P/E</strong> (Kurs/Gewinn): Bewertung relativ zum Gewinn. <strong>EV/EBITDA</strong>: Enterprise Value relativ zum operativen Ergebnis, kapitalstruktur-neutral. <strong>P/S</strong> (Kurs/Umsatz): Für verlustbringende Wachstumsunternehmen. <strong>P/B</strong> (Kurs/Buchwert): Für kapitalintensive Branchen (Banken, Versicherungen). <strong>PEG Ratio</strong> (P/E ÷ Wachstumsrate): Berücksichtigt Wachstum.",
    "<strong>Multiples</strong> compare price with a financial metric: <strong>P/E</strong> (Price/Earnings): Valuation relative to earnings. <strong>EV/EBITDA</strong>: Enterprise value relative to operating result, capital structure neutral. <strong>P/S</strong> (Price/Sales): For unprofitable growth companies. <strong>P/B</strong> (Price/Book): For capital-intensive industries (banks, insurance). <strong>PEG Ratio</strong> (P/E ÷ Growth Rate): Accounts for growth."
  ),

  "learn.comparablesTitle": t("Comparable Company Analysis", "Comparable Company Analysis"),
  "learn.comparablesP1": t(
    "Die <strong>Comps-Analyse</strong> bewertet ein Unternehmen anhand vergleichbarer börsennotierter Unternehmen. Schritte: 1) Peer-Group auswählen (ähnliche Branche, Größe, Wachstum). 2) Multiplikatoren berechnen (EV/EBITDA, P/E). 3) Median/Durchschnitt der Peers ermitteln. 4) Auf das Zielunternehmen anwenden. Vorteil: Marktbasiert und aktuell. Nachteil: Setzt effiziente Märkte voraus.",
    "The <strong>comps analysis</strong> values a company based on comparable public companies. Steps: 1) Select peer group (similar industry, size, growth). 2) Calculate multiples (EV/EBITDA, P/E). 3) Determine median/average of peers. 4) Apply to target company. Advantage: Market-based and current. Disadvantage: Assumes efficient markets."
  ),

  "learn.precedentTitle": t("Precedent Transactions", "Precedent Transactions"),
  "learn.precedentP1": t(
    "Die <strong>Precedent Transactions Analyse</strong> bewertet anhand vergangener M&A-Deals in derselben Branche. Die gezahlten Multiples (EV/EBITDA, EV/Revenue) werden als Benchmark verwendet. Diese Methode liefert typischerweise höhere Bewertungen als Comps, da M&A-Premiums (20-40%) eingepreist sind.",
    "The <strong>precedent transactions analysis</strong> values based on past M&A deals in the same industry. The paid multiples (EV/EBITDA, EV/Revenue) are used as benchmarks. This method typically yields higher valuations than comps, as M&A premiums (20-40%) are included."
  ),

  "learn.dcfDeepTitle": t("DCF-Bewertung im Detail", "DCF Valuation in Detail"),
  "learn.dcfDeepP1": t(
    "Die <strong>DCF-Bewertung</strong> (Discounted Cash Flow) ermittelt den inneren Wert durch Abzinsung zukünftiger Free Cash Flows. <strong>Schritte</strong>: 1) Free Cash Flows projizieren (5-10 Jahre). 2) <strong>Terminal Value</strong> berechnen (Gordon Growth: FCF × (1+g)/(WACC-g) oder Exit Multiple). 3) Alle Cashflows auf heute abzinsen mit dem <strong>WACC</strong>. 4) Enterprise Value → minus Schulden + Cash = Equity Value ÷ Aktienanzahl = Fair Value pro Aktie.",
    "The <strong>DCF valuation</strong> (Discounted Cash Flow) determines intrinsic value by discounting future free cash flows. <strong>Steps</strong>: 1) Project free cash flows (5-10 years). 2) Calculate <strong>Terminal Value</strong> (Gordon Growth: FCF × (1+g)/(WACC-g) or Exit Multiple). 3) Discount all cash flows to present using <strong>WACC</strong>. 4) Enterprise Value → minus debt + cash = Equity Value ÷ share count = fair value per share."
  ),

  "learn.lboTitle": t("LBO-Modell", "LBO Model"),
  "learn.lboP1": t(
    "Ein <strong>Leveraged Buyout</strong> (LBO) nutzt hauptsächlich Fremdkapital (60-80%) zum Kauf eines Unternehmens. Die Private-Equity-Firma maximiert die Rendite durch: <strong>Leverage</strong> (Fremdkapitaleinsatz), <strong>operative Verbesserungen</strong>, <strong>Multiple Expansion</strong> (Verkauf zu höherem Multiplikator) und <strong>Schuldenabbau</strong> durch Cashflows. Typische Zielrendite: 20-25% IRR über 3-7 Jahre.",
    "A <strong>Leveraged Buyout</strong> (LBO) uses primarily debt (60-80%) to acquire a company. The PE firm maximizes returns through: <strong>leverage</strong>, <strong>operational improvements</strong>, <strong>multiple expansion</strong> (selling at higher multiple), and <strong>debt paydown</strong> from cash flows. Typical target return: 20-25% IRR over 3-7 years."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 24: ALTERNATIVE INVESTMENTS ADVANCED
  // ══════════════════════════════════════════════════════════════
  "learn.section24Title": t("Alternative Investments Advanced", "Alternative Investments Advanced"),

  "learn.hedgeFundsTitle": t("Hedge Funds", "Hedge Funds"),
  "learn.hedgeFundsP1": t(
    "<strong>Hedge Funds</strong> sind aktiv verwaltete Investmentfonds für vermögende Anleger (typisch: $1M+ Minimum). Strategien: <strong>Long/Short Equity</strong>, <strong>Global Macro</strong> (Wetten auf makroökonomische Trends), <strong>Event-Driven</strong> (M&A, Restrukturierung), <strong>Relative Value/Arbitrage</strong>. Gebührenstruktur: '2 and 20' (2% Managementgebühr + 20% Performance Fee). Historisch haben die meisten Hedge Funds nach Gebühren den S&P 500 nicht geschlagen.",
    "<strong>Hedge Funds</strong> are actively managed investment funds for wealthy investors (typical: $1M+ minimum). Strategies: <strong>Long/Short Equity</strong>, <strong>Global Macro</strong> (betting on macroeconomic trends), <strong>Event-Driven</strong> (M&A, restructuring), <strong>Relative Value/Arbitrage</strong>. Fee structure: '2 and 20' (2% management fee + 20% performance fee). Historically, most hedge funds have not beaten the S&P 500 after fees."
  ),

  "learn.privateEquityTitle": t("Private Equity (PE)", "Private Equity (PE)"),
  "learn.privateEquityP1": t(
    "<strong>Private Equity</strong> investiert in nicht-börsennotierte Unternehmen. Phasen: <strong>Venture Capital</strong> (Frühphase: Seed, Series A-C), <strong>Growth Equity</strong> (Wachstumsphase), <strong>Buyout</strong> (Übernahme etablierter Unternehmen), <strong>Distressed</strong> (Unternehmen in Schwierigkeiten). PE-Fonds haben typischerweise eine Laufzeit von 10-12 Jahren mit einer <strong>J-Curve</strong>: negative Renditen in den ersten Jahren, dann steigende Returns.",
    "<strong>Private Equity</strong> invests in non-publicly traded companies. Phases: <strong>Venture Capital</strong> (early stage: Seed, Series A-C), <strong>Growth Equity</strong> (growth phase), <strong>Buyout</strong> (acquisition of established companies), <strong>Distressed</strong> (companies in difficulty). PE funds typically have a 10-12 year lifespan with a <strong>J-Curve</strong>: negative returns in early years, then rising returns."
  ),

  "learn.ventureCapitalTitle": t("Venture Capital (VC)", "Venture Capital (VC)"),
  "learn.ventureCapitalP1": t(
    "<strong>Venture Capital</strong> finanziert innovative Startups mit hohem Wachstumspotenzial. VC-Fonds folgen dem <strong>Power Law</strong>: Wenige Investments generieren den Großteil der Rendite. Typisch: Von 20-30 Investments schaffen 1-2 den 'Home Run' (100x+), mehrere scheitern komplett. Bewertungsmethoden: Pre-Money/Post-Money Valuation, Convertible Notes, SAFEs.",
    "<strong>Venture Capital</strong> finances innovative startups with high growth potential. VC funds follow the <strong>Power Law</strong>: Few investments generate most returns. Typical: Of 20-30 investments, 1-2 achieve a 'home run' (100x+), several fail completely. Valuation methods: Pre-Money/Post-Money Valuation, Convertible Notes, SAFEs."
  ),

  "learn.infrastructureTitle": t("Infrastruktur-Investments", "Infrastructure Investments"),
  "learn.infrastructureP1": t(
    "<strong>Infrastruktur</strong> umfasst Investitionen in physische Assets: Straßen, Brücken, Flughäfen, Pipelines, Stromnetze, Rechenzentren. Merkmale: Stabile, inflationsgeschützte Cashflows, lange Laufzeiten (20-50 Jahre), regulierte Renditen. Zugang für Privatanleger über <strong>Infrastruktur-ETFs</strong> oder <strong>geschlossene Fonds</strong>.",
    "<strong>Infrastructure</strong> encompasses investments in physical assets: roads, bridges, airports, pipelines, power grids, data centers. Characteristics: Stable, inflation-protected cash flows, long durations (20-50 years), regulated returns. Access for retail investors through <strong>infrastructure ETFs</strong> or <strong>closed-end funds</strong>."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 25: MARKET HISTORY & CRISES
  // ══════════════════════════════════════════════════════════════
  "learn.section25Title": t("Marktgeschichte & Krisen", "Market History & Crises"),

  "learn.tulipManiaTitle": t("Tulpenmanie (1637)", "Tulip Mania (1637)"),
  "learn.tulipManiaP1": t(
    "Die <strong>Tulpenmanie</strong> in den Niederlanden gilt als erste dokumentierte Spekulationsblase. Auf dem Höhepunkt kostete eine einzelne Tulpenzwiebel so viel wie ein Haus am Kanal in Amsterdam. Der Crash kam abrupt – innerhalb weniger Tage fielen die Preise um 99%. Lektion: <strong>Wenn ein Asset nur steigt, weil alle glauben, dass es weiter steigt, ist es eine Blase.</strong>",
    "The <strong>Tulip Mania</strong> in the Netherlands is considered the first documented speculative bubble. At its peak, a single tulip bulb cost as much as a canal house in Amsterdam. The crash came abruptly – prices fell 99% within days. Lesson: <strong>When an asset only rises because everyone believes it will keep rising, it's a bubble.</strong>"
  ),

  "learn.crash1929Title": t("Der Schwarze Freitag (1929)", "The Great Crash (1929)"),
  "learn.crash1929P1": t(
    "Der <strong>Börsencrash von 1929</strong> leitete die Große Depression ein. Der Dow Jones fiel von seinem Hoch um 89% und erreichte den Tiefpunkt erst 1932. Es dauerte <strong>25 Jahre</strong> (bis 1954), bis das Vorkrisenniveau wieder erreicht wurde. Ursachen: Exzessiver Margin-Handel, Überproduktion, Bankenpanik. Folge: Gründung der SEC und moderne Finanzmarktregulierung.",
    "The <strong>1929 stock market crash</strong> triggered the Great Depression. The Dow Jones fell 89% from its peak, not reaching bottom until 1932. It took <strong>25 years</strong> (until 1954) to recover to pre-crash levels. Causes: Excessive margin trading, overproduction, bank panics. Result: Creation of the SEC and modern financial regulation."
  ),

  "learn.dotcomTitle": t("Dotcom-Blase (1999-2001)", "Dot-com Bubble (1999-2001)"),
  "learn.dotcomP1": t(
    "Die <strong>Dotcom-Blase</strong> trieb Internet-Aktien auf absurde Bewertungen. Der NASDAQ stieg von 1.000 (1996) auf 5.048 (März 2000) und fiel dann auf 1.114 (Oktober 2002) – ein Verlust von 78%. Viele Unternehmen (Pets.com, Webvan) gingen pleite. Überlebende wie Amazon und eBay brauchten Jahre zur Erholung. Lektion: <strong>Umsatz und Gewinn zählen, nicht nur 'Clicks' und 'Eyeballs'.</strong>",
    "The <strong>dot-com bubble</strong> drove internet stocks to absurd valuations. The NASDAQ rose from 1,000 (1996) to 5,048 (March 2000) then fell to 1,114 (October 2002) – a 78% loss. Many companies (Pets.com, Webvan) went bankrupt. Survivors like Amazon and eBay took years to recover. Lesson: <strong>Revenue and profit matter, not just 'clicks' and 'eyeballs'.</strong>"
  ),

  "learn.gfc2008Title": t("Finanzkrise (2007-2009)", "Global Financial Crisis (2007-2009)"),
  "learn.gfc2008P1": t(
    "Die <strong>Globale Finanzkrise</strong> wurde durch den US-Immobilienmarkt ausgelöst. <strong>Subprime-Hypotheken</strong> wurden zu <strong>MBS</strong> (Mortgage-Backed Securities) und <strong>CDOs</strong> gebündelt und mit AAA-Ratings versehen. Als die Immobilienpreise fielen, kollabierte das System. Lehman Brothers ging pleite (September 2008), der S&P 500 fiel 57%. Die Fed senkte Zinsen auf 0% und startete <strong>QE</strong> (Quantitative Easing). Folge: Dodd-Frank Act, Basel III, zu-groß-zum-Scheitern-Debatte.",
    "The <strong>Global Financial Crisis</strong> was triggered by the US housing market. <strong>Subprime mortgages</strong> were bundled into <strong>MBS</strong> (Mortgage-Backed Securities) and <strong>CDOs</strong> with AAA ratings. When housing prices fell, the system collapsed. Lehman Brothers went bankrupt (September 2008), the S&P 500 fell 57%. The Fed cut rates to 0% and started <strong>QE</strong> (Quantitative Easing). Result: Dodd-Frank Act, Basel III, too-big-to-fail debate."
  ),

  "learn.covidCrashTitle": t("COVID-Crash (2020)", "COVID Crash (2020)"),
  "learn.covidCrashP1": t(
    "Der <strong>COVID-19-Crash</strong> (Februar-März 2020) war der schnellste 30%-Einbruch der Geschichte. Der S&P 500 fiel in nur 22 Handelstagen um 34%. Dann folgte eine der schnellsten Erholungen: Bereits im August 2020 wurden neue Allzeithochs erreicht. Treiber: Massive Fiskal- und Geldpolitik (Zinssenkungen, $5+ Billionen Stimuluspakete). Lektion: <strong>Panikverkäufe sind fast immer falsch. Der Markt erholt sich schneller, als man denkt.</strong>",
    "The <strong>COVID-19 crash</strong> (February-March 2020) was the fastest 30% drop in history. The S&P 500 fell 34% in just 22 trading days. Then came one of the fastest recoveries: New all-time highs were reached by August 2020. Drivers: Massive fiscal and monetary policy (rate cuts, $5+ trillion stimulus packages). Lesson: <strong>Panic selling is almost always wrong. The market recovers faster than you think.</strong>"
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 26: PERSONAL FINANCE & RETIREMENT
  // ══════════════════════════════════════════════════════════════
  "learn.section26Title": t("Personal Finance & Altersvorsorge", "Personal Finance & Retirement"),

  "learn.budgetingTitle": t("Budgetierung & Sparquote", "Budgeting & Savings Rate"),
  "learn.budgetingP1": t(
    "Die <strong>50/30/20-Regel</strong> ist ein bewährtes Budgetierungssystem: 50% des Nettoeinkommens für Fixkosten (Miete, Versicherungen), 30% für Wünsche (Freizeit, Shopping), 20% für Sparen und Investieren. Ambitionierte Sparer streben eine Sparquote von 30-50% an (FIRE-Bewegung: Financial Independence, Retire Early).",
    "The <strong>50/30/20 rule</strong> is a proven budgeting system: 50% of net income for fixed costs (rent, insurance), 30% for wants (leisure, shopping), 20% for saving and investing. Ambitious savers aim for a 30-50% savings rate (FIRE movement: Financial Independence, Retire Early)."
  ),

  "learn.retirementPlanningTitle": t("Altersvorsorge", "Retirement Planning"),
  "learn.retirementPlanningP1": t(
    "Altersvorsorge basiert auf drei Säulen: <strong>1. Säule</strong>: Gesetzliche Rente (in DE) / Social Security (in USA). <strong>2. Säule</strong>: Betriebliche Altersvorsorge / 401(k). <strong>3. Säule</strong>: Private Vorsorge / IRA, Riester, Rürup. Die <strong>4%-Regel</strong> (Trinity Study): Man kann jährlich 4% seines Portfolios entnehmen, ohne es über 30 Jahre aufzubrauchen. Benötigtes Kapital = Jährliche Ausgaben × 25.",
    "Retirement planning is based on three pillars: <strong>1st Pillar</strong>: State pension (in DE) / Social Security (in USA). <strong>2nd Pillar</strong>: Occupational pension / 401(k). <strong>3rd Pillar</strong>: Private provision / IRA, Riester, Rürup. The <strong>4% rule</strong> (Trinity Study): You can withdraw 4% of your portfolio annually without depleting it over 30 years. Required capital = Annual expenses × 25."
  ),

  "learn.insuranceTitle": t("Versicherungen für Anleger", "Insurance for Investors"),
  "learn.insuranceP1": t(
    "Unverzichtbare Versicherungen: <strong>Privathaftpflicht</strong> (schützt vor existenzbedrohenden Schadenersatzansprüchen), <strong>Berufsunfähigkeitsversicherung</strong> (schützt dein Humankapital – deine zukünftige Arbeitskraft), <strong>Krankenversicherung</strong>. Für Anleger relevant: <strong>Einlagensicherung</strong> (100.000€ pro Bank in der EU), <strong>Sondervermögen</strong> (ETFs/Fonds sind bei Broker-Insolvenz geschützt).",
    "Essential insurance: <strong>Personal liability</strong> (protects against existential damage claims), <strong>Disability insurance</strong> (protects your human capital – your future earning power), <strong>Health insurance</strong>. Relevant for investors: <strong>Deposit protection</strong> (€100,000 per bank in the EU), <strong>Segregated assets</strong> (ETFs/funds are protected in case of broker insolvency)."
  ),

  "learn.debtManagementTitle": t("Schuldenmanagement", "Debt Management"),
  "learn.debtManagementP1": t(
    "Bevor du investierst, tilge hochverzinsliche Schulden! <strong>Reihenfolge</strong>: 1) Kreditkartenschulden (15-25% Zinsen) – sofort tilgen. 2) Konsumentenkredite (5-12%) – schnell tilgen. 3) Studienkredit (2-6%) – parallel investieren möglich. 4) Immobilienkredit (2-4%) – niedrige Zinsen, Steuervorteile. Die <strong>Schneeball-Methode</strong> (kleinste Schuld zuerst) motiviert, die <strong>Lawinen-Methode</strong> (höchster Zinssatz zuerst) spart am meisten.",
    "Before investing, pay off high-interest debt! <strong>Order</strong>: 1) Credit card debt (15-25% interest) – pay immediately. 2) Consumer loans (5-12%) – pay quickly. 3) Student loans (2-6%) – can invest in parallel. 4) Mortgage (2-4%) – low rates, tax benefits. The <strong>snowball method</strong> (smallest debt first) motivates, the <strong>avalanche method</strong> (highest interest first) saves the most."
  ),

  "learn.humanCapitalTitle": t("Humankapital", "Human Capital"),
  "learn.humanCapitalP1": t(
    "Dein <strong>Humankapital</strong> – der Barwert aller zukünftigen Einkünfte – ist für junge Menschen oft das wertvollste Asset (oft $1M+). Ein 25-Jähriger mit stabilem Einkommen kann aggressiver investieren (mehr Aktien), da sein Humankapital wie eine Anleihe wirkt. Mit dem Alter sinkt das Humankapital, und man sollte konservativer werden.",
    "Your <strong>human capital</strong> – the present value of all future earnings – is often the most valuable asset for young people (often $1M+). A 25-year-old with stable income can invest more aggressively (more stocks), as human capital acts like a bond. As you age, human capital decreases, and you should become more conservative."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 27: ECONOMETRICS & FINANCIAL MODELING
  // ══════════════════════════════════════════════════════════════
  "learn.section27Title": t("Ökonometrie & Financial Modeling", "Econometrics & Financial Modeling"),

  "learn.regressionTitle": t("Regressionsanalyse", "Regression Analysis"),
  "learn.regressionP1": t(
    "Die <strong>lineare Regression</strong> modelliert die Beziehung zwischen abhängigen und unabhängigen Variablen: <strong>Y = α + βX + ε</strong>. Im CAPM ist Y die Aktienrendite, X die Marktrendite, α das Alpha und β das Beta. <strong>R²</strong> zeigt den Anteil der erklärten Varianz (0-1). Wichtige Tests: <strong>t-Test</strong> (Signifikanz einzelner Koeffizienten), <strong>F-Test</strong> (Gesamtmodell), <strong>Durbin-Watson</strong> (Autokorrelation).",
    "<strong>Linear regression</strong> models the relationship between dependent and independent variables: <strong>Y = α + βX + ε</strong>. In CAPM, Y is stock return, X is market return, α is alpha, and β is beta. <strong>R²</strong> shows the proportion of explained variance (0-1). Key tests: <strong>t-test</strong> (significance of individual coefficients), <strong>F-test</strong> (overall model), <strong>Durbin-Watson</strong> (autocorrelation)."
  ),

  "learn.timeSeriesTitle": t("Zeitreihenanalyse", "Time Series Analysis"),
  "learn.timeSeriesP1": t(
    "<strong>Zeitreihenanalyse</strong> untersucht zeitlich geordnete Datenpunkte. Wichtige Konzepte: <strong>Stationarität</strong> (statistische Eigenschaften ändern sich nicht über Zeit), <strong>Autokorrelation</strong> (Korrelation mit eigenen vergangenen Werten), <strong>Random Walk</strong> (Kursbewegungen sind zufällig). Modelle: <strong>AR</strong> (autoregressiv), <strong>MA</strong> (Moving Average), <strong>ARIMA</strong> (kombiniert), <strong>GARCH</strong> (für Volatilitätsmodellierung).",
    "<strong>Time series analysis</strong> examines data points ordered in time. Key concepts: <strong>stationarity</strong> (statistical properties don't change over time), <strong>autocorrelation</strong> (correlation with own past values), <strong>random walk</strong> (price movements are random). Models: <strong>AR</strong> (autoregressive), <strong>MA</strong> (moving average), <strong>ARIMA</strong> (combined), <strong>GARCH</strong> (for volatility modeling)."
  ),

  "learn.varModelTitle": t("Value at Risk (VaR)", "Value at Risk (VaR)"),
  "learn.varModelP1": t(
    "<strong>Value at Risk</strong> quantifiziert den maximalen erwarteten Verlust über einen Zeitraum mit einer bestimmten Wahrscheinlichkeit. Beispiel: VaR(95%, 1 Tag) = $1M bedeutet: Mit 95% Wahrscheinlichkeit verlierst du nicht mehr als $1M an einem Tag. Methoden: <strong>Historisch</strong> (vergangene Daten), <strong>Parametrisch</strong> (Normalverteilung annehmen), <strong>Monte Carlo</strong> (Simulation). Kritik: VaR sagt nichts über die Verlusthöhe jenseits des VaR (dafür: <strong>CVaR/Expected Shortfall</strong>).",
    "<strong>Value at Risk</strong> quantifies the maximum expected loss over a period at a given probability. Example: VaR(95%, 1 day) = $1M means: With 95% probability, you won't lose more than $1M in a day. Methods: <strong>Historical</strong> (past data), <strong>Parametric</strong> (assume normal distribution), <strong>Monte Carlo</strong> (simulation). Criticism: VaR says nothing about loss magnitude beyond VaR (for that: <strong>CVaR/Expected Shortfall</strong>)."
  ),

  "learn.financialModelingTitle": t("Financial Modeling in Excel/Python", "Financial Modeling in Excel/Python"),
  "learn.financialModelingP1": t(
    "<strong>Financial Modeling</strong> ist das Erstellen mathematischer Abbilder eines Unternehmens. Standardmodelle: <strong>3-Statement Model</strong> (GuV, Bilanz, Cashflow verbunden), <strong>DCF Model</strong>, <strong>LBO Model</strong>, <strong>M&A/Merger Model</strong>. Best Practices: Klare Struktur (Inputs/Annahmen oben, Berechnungen darunter), Farbcodierung (blau = Input, schwarz = Formel), Szenarioanalyse (Base/Bull/Bear Case).",
    "<strong>Financial Modeling</strong> creates mathematical representations of a company. Standard models: <strong>3-Statement Model</strong> (P&L, Balance Sheet, Cash Flow linked), <strong>DCF Model</strong>, <strong>LBO Model</strong>, <strong>M&A/Merger Model</strong>. Best practices: Clear structure (inputs/assumptions at top, calculations below), color coding (blue = input, black = formula), scenario analysis (Base/Bull/Bear Case)."
  ),

  "learn.correlationTitle": t("Korrelation & Kovarianz", "Correlation & Covariance"),
  "learn.correlationP1": t(
    "<strong>Korrelation</strong> misst die lineare Beziehung zwischen zwei Variablen (-1 bis +1). <strong>+1</strong>: Perfekt gleichgerichtet. <strong>0</strong>: Keine lineare Beziehung. <strong>-1</strong>: Perfekt gegenläufig. <strong>Kovarianz</strong> = nicht-normalisierte Version. In der Portfoliotheorie: Niedrig korrelierte Assets reduzieren das Gesamtrisiko. Achtung: Korrelation ≠ Kausalität, und Korrelationen können sich in Krisen dramatisch ändern!",
    "<strong>Correlation</strong> measures the linear relationship between two variables (-1 to +1). <strong>+1</strong>: Perfectly aligned. <strong>0</strong>: No linear relationship. <strong>-1</strong>: Perfectly inverse. <strong>Covariance</strong> = non-normalized version. In portfolio theory: Low-correlated assets reduce overall risk. Caution: Correlation ≠ causation, and correlations can change dramatically in crises!"
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 28: MONETARY POLICY & BANKING
  // ══════════════════════════════════════════════════════════════
  "learn.section28Title": t("Geldpolitik & Bankensystem", "Monetary Policy & Banking"),

  "learn.moneyCreationTitle": t("Geldschöpfung", "Money Creation"),
  "learn.moneyCreationP1": t(
    "Die meiste <strong>Geldschöpfung</strong> erfolgt durch Geschäftsbanken, nicht durch Zentralbanken. Wenn eine Bank einen Kredit vergibt, schafft sie neues Giralgeld (Buchgeld). Die Zentralbank kontrolliert diesen Prozess über <strong>Mindestreserveanforderungen</strong>, <strong>Zinssätze</strong> und <strong>Offenmarktgeschäfte</strong>. <strong>Geldmengenaggregate</strong>: M0 (Bargeld), M1 (+Sichteinlagen), M2 (+Termineinlagen), M3 (+Großanleger).",
    "Most <strong>money creation</strong> happens through commercial banks, not central banks. When a bank issues a loan, it creates new deposit money. The central bank controls this process via <strong>reserve requirements</strong>, <strong>interest rates</strong>, and <strong>open market operations</strong>. <strong>Money supply aggregates</strong>: M0 (cash), M1 (+demand deposits), M2 (+time deposits), M3 (+large deposits)."
  ),

  "learn.centralBankToolsTitle": t("Instrumente der Zentralbanken", "Central Bank Instruments"),
  "learn.centralBankToolsP1": t(
    "Zentralbanken steuern die Wirtschaft mit: <strong>Leitzins</strong> (Fed Funds Rate, EZB-Hauptrefinanzierungssatz): Beeinflusst alle Zinsen. <strong>Offenmarktgeschäfte</strong>: Kauf/Verkauf von Staatsanleihen zur Liquiditätssteuerung. <strong>QE</strong> (Quantitative Easing): Aufkauf von Anleihen zur Senkung langfristiger Zinsen. <strong>QT</strong> (Quantitative Tightening): Abbau der Bilanz. <strong>Forward Guidance</strong>: Kommunikation zukünftiger Geldpolitik zur Erwartungssteuerung.",
    "Central banks steer the economy with: <strong>Policy rate</strong> (Fed Funds Rate, ECB main refinancing rate): Influences all interest rates. <strong>Open market operations</strong>: Buying/selling government bonds to manage liquidity. <strong>QE</strong> (Quantitative Easing): Purchasing bonds to lower long-term rates. <strong>QT</strong> (Quantitative Tightening): Balance sheet reduction. <strong>Forward Guidance</strong>: Communicating future monetary policy to manage expectations."
  ),

  "learn.bankingSystemTitle": t("Das Bankensystem", "The Banking System"),
  "learn.bankingSystemP1": t(
    "Banken operieren mit <strong>Fristentransformation</strong>: Sie nehmen kurzfristige Einlagen (Girokonten) und vergeben langfristige Kredite (Hypotheken). Das schafft Gewinne, aber auch Risiken (<strong>Bank Run</strong>: Wenn alle Einleger gleichzeitig abheben wollen). Moderne Sicherungssysteme: <strong>Einlagensicherung</strong> (FDIC: $250k in USA, €100k in EU), <strong>Lender of Last Resort</strong> (Zentralbank als letzte Rettung).",
    "Banks operate through <strong>maturity transformation</strong>: They take short-term deposits (checking accounts) and make long-term loans (mortgages). This creates profits but also risks (<strong>bank run</strong>: when all depositors want to withdraw simultaneously). Modern safety nets: <strong>deposit insurance</strong> (FDIC: $250k in USA, €100k in EU), <strong>lender of last resort</strong> (central bank as ultimate backstop)."
  ),

  "learn.transmissionTitle": t("Transmissionsmechanismus", "Transmission Mechanism"),
  "learn.transmissionP1": t(
    "Der <strong>Transmissionsmechanismus</strong> beschreibt, wie Geldpolitik die Realwirtschaft beeinflusst: <strong>Zinskanal</strong>: Niedrigere Zinsen → günstigere Kredite → mehr Investition und Konsum. <strong>Vermögenskanal</strong>: Niedrige Zinsen → höhere Aktien-/Immobilienpreise → Wealth Effect. <strong>Kreditkanal</strong>: Banken vergeben mehr Kredite. <strong>Wechselkurskanal</strong>: Niedrigere Zinsen → schwächere Währung → Exportvorteil. Die Wirkung tritt mit Verzögerung ein (6-18 Monate).",
    "The <strong>transmission mechanism</strong> describes how monetary policy affects the real economy: <strong>Interest rate channel</strong>: Lower rates → cheaper credit → more investment and consumption. <strong>Wealth channel</strong>: Low rates → higher stock/real estate prices → wealth effect. <strong>Credit channel</strong>: Banks issue more loans. <strong>Exchange rate channel</strong>: Lower rates → weaker currency → export advantage. Effects occur with a delay (6-18 months)."
  ),

  "learn.modernMonetaryTitle": t("Moderne Geldtheorie (MMT)", "Modern Monetary Theory (MMT)"),
  "learn.modernMonetaryP1": t(
    "<strong>MMT</strong> argumentiert, dass Staaten mit eigener Währung nicht 'pleite gehen' können, da sie ihr eigenes Geld drucken. Staatsausgaben sollten sich an der Vollbeschäftigung orientieren, nicht an Defizitgrenzen. Inflation, nicht Verschuldung, ist die relevante Grenze. MMT ist hochkontrovers: Befürworter sehen es als Paradigmenwechsel, Kritiker warnen vor Inflation und Vertrauensverlust.",
    "<strong>MMT</strong> argues that states with their own currency cannot 'go bankrupt' since they can print their own money. Government spending should target full employment, not deficit limits. Inflation, not debt, is the relevant constraint. MMT is highly controversial: Supporters see it as a paradigm shift, critics warn of inflation and loss of confidence."
  ),

  // ── Quizzes ──
  "learn.quizCorporateFinance": t("Quiz: Corporate Finance", "Quiz: Corporate Finance"),
  "learn.quizAccounting": t("Quiz: Rechnungswesen", "Quiz: Accounting"),
  "learn.quizValuation": t("Quiz: Bewertung", "Quiz: Valuation"),
  "learn.quizMarketHistory": t("Quiz: Marktgeschichte", "Quiz: Market History"),
};
