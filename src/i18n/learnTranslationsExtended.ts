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
  "learn.toc29": t("29. Fintech & Digitale Finanzen", "29. Fintech & Digital Finance"),
  "learn.toc30": t("30. Immobilien-Investing", "30. Real Estate Investing"),
  "learn.toc31": t("31. Steueroptimierung", "31. Tax Optimization Strategies"),

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

  "learn.multiplesTitle": t("Multiplikatorenbewertung", "Multiples Valuation"),
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

  // NEW: Asian Crisis & Crypto Crash
  "learn.asianCrisisTitle": t("Asienkrise (1997)", "Asian Financial Crisis (1997)"),
  "learn.asianCrisisP1": t(
    "Die <strong>Asienkrise 1997</strong> begann mit dem Kollaps des thailändischen Baht und breitete sich auf Südkorea, Indonesien, Malaysia und die Philippinen aus. Ursachen: <strong>Exzessive Kreditvergabe</strong>, Währungsbindungen an den US-Dollar, kurzfristige Auslandsschulden und schwache Bankenaufsicht. Der Thai SET Index fiel um 75%, der koreanische KOSPI um 70%. Der IWF gewährte Notfallkredite über $118 Milliarden. Lektion: <strong>Fixed Exchange Rates und kurzfristige Auslandsschulden sind eine gefährliche Kombination.</strong>",
    "The <strong>Asian Financial Crisis of 1997</strong> started with the collapse of the Thai Baht and spread to South Korea, Indonesia, Malaysia, and the Philippines. Causes: <strong>Excessive lending</strong>, currency pegs to the US dollar, short-term foreign debt, and weak banking supervision. The Thai SET Index fell 75%, Korea's KOSPI 70%. The IMF granted emergency loans of $118 billion. Lesson: <strong>Fixed exchange rates and short-term foreign debt are a dangerous combination.</strong>"
  ),

  "learn.cryptoCrash2022Title": t("Krypto-Crash (2022)", "Crypto Crash (2022)"),
  "learn.cryptoCrash2022P1": t(
    "Der <strong>Krypto-Crash 2022</strong> vernichtete über $2 Billionen an Marktwert. Bitcoin fiel von $69.000 (November 2021) auf $15.500 (November 2022) – ein Verlust von 77%. Schlüsselereignisse: Zusammenbruch von <strong>Terra/LUNA</strong> (algorithmischer Stablecoin, $60 Mrd. vernichtet), Insolvenz von <strong>Three Arrows Capital</strong> (Hedgefonds), Kollaps von <strong>FTX</strong> (zweitgrößte Kryptobörse, Betrug). Lektion: <strong>Gegenparteirisiko und Leverage im unregulierten Raum können katastrophal sein. Not your keys, not your coins.</strong>",
    "The <strong>2022 Crypto Crash</strong> wiped out over $2 trillion in market value. Bitcoin fell from $69,000 (November 2021) to $15,500 (November 2022) – a 77% loss. Key events: Collapse of <strong>Terra/LUNA</strong> (algorithmic stablecoin, $60B destroyed), insolvency of <strong>Three Arrows Capital</strong> (hedge fund), collapse of <strong>FTX</strong> (second-largest crypto exchange, fraud). Lesson: <strong>Counterparty risk and leverage in unregulated spaces can be catastrophic. Not your keys, not your coins.</strong>"
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
    "<strong>Value at Risk</strong> quantifies the maximum expected loss over a period at a given probability. Example: VaR(95%, 1 day) = $1M means: With 95% probability, you won't lose more than $1M in one day. Methods: <strong>Historical</strong> (past data), <strong>Parametric</strong> (assume normal distribution), <strong>Monte Carlo</strong> (simulation). Criticism: VaR says nothing about loss magnitude beyond VaR (for that: <strong>CVaR/Expected Shortfall</strong>)."
  ),

  "learn.financialModelingTitle": t("Financial Modeling", "Financial Modeling"),
  "learn.financialModelingP1": t(
    "<strong>Financial Modeling</strong> erstellt mathematische Darstellungen der finanziellen Situation eines Unternehmens. <strong>3-Statement-Modell</strong>: Verknüpft GuV, Bilanz und Cashflow. <strong>DCF-Modell</strong>: Projiziert Free Cash Flows. <strong>LBO-Modell</strong>: Für Leveraged Buyouts. <strong>M&A-Modell</strong>: Analysiert Übernahme-Synergien. Best Practices: Klare Formatierung (blau=Input, schwarz=Berechnung), Sensitivitätsanalysen, keine Hardcoded-Zahlen.",
    "<strong>Financial Modeling</strong> creates mathematical representations of a company's financial situation. <strong>3-Statement Model</strong>: Links P&L, balance sheet, and cash flow. <strong>DCF Model</strong>: Projects free cash flows. <strong>LBO Model</strong>: For leveraged buyouts. <strong>M&A Model</strong>: Analyzes acquisition synergies. Best practices: Clear formatting (blue=input, black=calculation), sensitivity analyses, no hardcoded numbers."
  ),

  "learn.correlationTitle": t("Korrelation & Kausalität", "Correlation & Causality"),
  "learn.correlationP1": t(
    "<strong>Korrelation</strong> (ρ, von -1 bis +1) misst den linearen Zusammenhang zwischen zwei Variablen. <strong>Wichtig: Korrelation ≠ Kausalität!</strong> Beispiel: Eisverkauf und Ertrinken korrelieren (Ursache: Sommer). Im Portfolio-Kontext: Niedrige Korrelation zwischen Assets verbessert die Diversifikation. Korrelationen sind instabil und steigen in Krisen (wenn man Diversifikation am meisten braucht).",
    "<strong>Correlation</strong> (ρ, from -1 to +1) measures the linear relationship between two variables. <strong>Important: Correlation ≠ Causation!</strong> Example: Ice cream sales and drowning correlate (cause: summer). In portfolio context: Low correlation between assets improves diversification. Correlations are unstable and increase during crises (when diversification is needed most)."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 28: MONETARY POLICY & BANKING
  // ══════════════════════════════════════════════════════════════
  "learn.section28Title": t("Geldpolitik & Bankensystem", "Monetary Policy & Banking"),

  "learn.moneyCreationTitle": t("Geldschöpfung", "Money Creation"),
  "learn.moneyCreationP1": t(
    "Entgegen der populären Vorstellung schaffen <strong>Geschäftsbanken</strong> den Großteil des Geldes durch Kreditvergabe (nicht die Zentralbank). Wenn eine Bank einen Kredit vergibt, erzeugt sie neues Geld per Buchungssatz. Die <strong>Mindestreservepflicht</strong> (0% in der Eurozone seit 2012, 0% in den USA seit 2020) begrenzt dies theoretisch. Der <strong>Geldmultiplikator</strong> = 1/Reservesatz bestimmt die maximale Geldschöpfung.",
    "Contrary to popular belief, <strong>commercial banks</strong> create most money through lending (not the central bank). When a bank issues a loan, it creates new money through accounting entries. The <strong>minimum reserve requirement</strong> (0% in the Eurozone since 2012, 0% in the US since 2020) theoretically limits this. The <strong>money multiplier</strong> = 1/reserve ratio determines maximum money creation."
  ),

  "learn.centralBankToolsTitle": t("Instrumente der Zentralbank", "Central Bank Tools"),
  "learn.centralBankToolsP1": t(
    "<strong>Konventionelle Instrumente</strong>: Leitzins (Fed Funds Rate, EZB-Hauptrefinanzierungssatz), Offenmarktgeschäfte (Kauf/Verkauf von Staatsanleihen), Mindestreserve. <strong>Unkonventionelle Instrumente</strong> (seit 2008): <strong>QE</strong> (Quantitative Easing: massiver Anleihekauf), <strong>Forward Guidance</strong> (Kommunikation zukünftiger Zinspfade), <strong>TLTRO</strong> (gezielte Langfristkredite), <strong>Yield Curve Control</strong> (Japan: Kontrolle der Langfristzinsen).",
    "<strong>Conventional tools</strong>: Policy rate (Fed Funds Rate, ECB main refinancing rate), open market operations (buying/selling government bonds), reserve requirements. <strong>Unconventional tools</strong> (since 2008): <strong>QE</strong> (Quantitative Easing: massive bond purchases), <strong>forward guidance</strong> (communicating future rate paths), <strong>TLTRO</strong> (targeted long-term loans), <strong>yield curve control</strong> (Japan: controlling long-term rates)."
  ),

  "learn.bankingSystemTitle": t("Bankensystem & Stabilität", "Banking System & Stability"),
  "learn.bankingSystemP1": t(
    "Das <strong>Bankensystem</strong> basiert auf <strong>Fristentransformation</strong>: Banken nehmen kurzfristige Einlagen und vergeben langfristige Kredite. Das macht sie anfällig für <strong>Bank Runs</strong> (alle Einleger wollen gleichzeitig Geld abheben). Schutzmechanismen: <strong>Einlagensicherung</strong> (100.000€ in EU, $250.000 in USA), <strong>Lender of Last Resort</strong> (Zentralbank als letzter Kreditgeber), <strong>Systemrelevanz</strong> (SIFI: Systemically Important Financial Institutions).",
    "The <strong>banking system</strong> is based on <strong>maturity transformation</strong>: Banks take short-term deposits and make long-term loans. This makes them vulnerable to <strong>bank runs</strong> (all depositors wanting withdrawals simultaneously). Protection mechanisms: <strong>Deposit insurance</strong> (€100,000 in EU, $250,000 in US), <strong>lender of last resort</strong> (central bank as final lender), <strong>systemic importance</strong> (SIFI: Systemically Important Financial Institutions)."
  ),

  "learn.transmissionTitle": t("Transmissionsmechanismus", "Transmission Mechanism"),
  "learn.transmissionP1": t(
    "Der <strong>geldpolitische Transmissionsmechanismus</strong> beschreibt, wie Zentralbankentscheidungen die Realwirtschaft beeinflussen: <strong>Zinskanal</strong> (Leitzins → Bankzinsen → Konsum/Investitionen), <strong>Kreditkanal</strong> (Banken vergeben mehr/weniger Kredite), <strong>Vermögenskanal</strong> (Niedrige Zinsen → höhere Aktien-/Immobilienpreise → Wealth Effect), <strong>Wechselkurskanal</strong> (Zinsdifferenzen → Kapitalströme → Wechselkurs → Exporte). Zeitverzögerung: 12-24 Monate.",
    "The <strong>monetary policy transmission mechanism</strong> describes how central bank decisions affect the real economy: <strong>Interest rate channel</strong> (policy rate → bank rates → consumption/investment), <strong>credit channel</strong> (banks lend more/less), <strong>wealth channel</strong> (low rates → higher stock/real estate prices → wealth effect), <strong>exchange rate channel</strong> (interest differentials → capital flows → exchange rate → exports). Time lag: 12-24 months."
  ),

  "learn.modernMonetaryTitle": t("Modern Monetary Theory (MMT)", "Modern Monetary Theory (MMT)"),
  "learn.modernMonetaryP1": t(
    "<strong>MMT</strong> argumentiert, dass Staaten mit eigener Währung nicht 'pleite gehen' können, da sie Geld drucken können. Steuern dienen demnach nicht der Finanzierung, sondern der Inflationssteuerung. MMT befürwortet fiskalische Defizite bis zur Vollbeschäftigung. Die Inflation ist die einzige echte Beschränkung. Befürworter: Stephanie Kelton. Hauptkritik: Inflationsrisiko, Wechselkurseffekte, politische Anreize zu übermäßiger Verschuldung.",
    "<strong>MMT</strong> argues that states with their own currency cannot 'go bankrupt' as they can print money. Taxes serve not for financing but for inflation control. MMT advocates fiscal deficits up to full employment. Inflation is the only real constraint. Proponent: Stephanie Kelton. Main criticism: Inflation risk, exchange rate effects, political incentives for excessive debt."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 29: FINTECH & DIGITAL FINANCE (NEW)
  // ══════════════════════════════════════════════════════════════
  "learn.section29Title": t("Fintech & Digitale Finanzen", "Fintech & Digital Finance"),

  "learn.roboAdvisorsTitle": t("Robo-Advisors", "Robo-Advisors"),
  "learn.roboAdvisorsP1": t(
    "<strong>Robo-Advisors</strong> sind automatisierte Vermögensverwaltungen, die Portfolios basierend auf Risikofragebögen zusammenstellen und verwalten. Vorteile: Niedrige Kosten (0,25-0,75% p.a.), automatisches Rebalancing, kein Mindestanlagebetrag. Bekannte Anbieter: Scalable Capital, Quirion (DE), Betterment, Wealthfront (USA). Für die meisten Anleger bieten sie eine gute Alternative zur Selbstverwaltung, wobei ein simpler ETF-Sparplan oft noch günstiger ist.",
    "<strong>Robo-advisors</strong> are automated wealth management services that build and manage portfolios based on risk questionnaires. Advantages: Low costs (0.25-0.75% p.a.), automatic rebalancing, no minimum investment. Notable providers: Scalable Capital, Quirion (DE), Betterment, Wealthfront (US). For most investors, they offer a good alternative to self-management, though a simple ETF savings plan is often even cheaper."
  ),

  "learn.neobanksTitle": t("Neobanken & Challenger Banks", "Neobanks & Challenger Banks"),
  "learn.neobanksP1": t(
    "<strong>Neobanken</strong> sind rein digitale Banken ohne Filialnetz. Sie bieten Konten, Karten und oft auch Trading über Apps an. Vorteile: Keine Kontogebühren, schnelle Eröffnung, moderne UX, internationale Überweisungen zu Spot-Kursen. Nachteile: Oft eingeschränkte Produktpalette, keine persönliche Beratung. Bekannte Anbieter: N26, Revolut, Wise, Chime. Der Markt wächst rasant, aber Profitabilität bleibt für viele eine Herausforderung.",
    "<strong>Neobanks</strong> are purely digital banks without branch networks. They offer accounts, cards, and often trading through apps. Advantages: No account fees, fast opening, modern UX, international transfers at spot rates. Disadvantages: Often limited product range, no personal advice. Notable providers: N26, Revolut, Wise, Chime. The market is growing rapidly, but profitability remains a challenge for many."
  ),

  "learn.blockchainFinanceTitle": t("Blockchain im Finanzwesen", "Blockchain in Finance"),
  "learn.blockchainFinanceP1": t(
    "<strong>Blockchain-Technologie</strong> verändert das Finanzwesen fundamental: <strong>Tokenisierung</strong> ermöglicht den Handel mit fraktionierten Anteilen an Immobilien, Kunst oder Private Equity. <strong>Smart Contracts</strong> automatisieren Finanzverträge ohne Intermediäre. <strong>Stablecoins</strong> (USDC, USDT) werden für schnelle, günstige Überweisungen genutzt. <strong>CBDCs</strong> (Central Bank Digital Currencies) werden von über 100 Zentralbanken erforscht – der digitale Euro könnte 2027 kommen.",
    "<strong>Blockchain technology</strong> is fundamentally changing finance: <strong>Tokenization</strong> enables trading fractional shares of real estate, art, or private equity. <strong>Smart contracts</strong> automate financial agreements without intermediaries. <strong>Stablecoins</strong> (USDC, USDT) are used for fast, cheap transfers. <strong>CBDCs</strong> (Central Bank Digital Currencies) are being explored by 100+ central banks – the digital euro could arrive by 2027."
  ),

  "learn.defiTitle": t("DeFi (Decentralized Finance)", "DeFi (Decentralized Finance)"),
  "learn.defiP1": t(
    "<strong>DeFi</strong> repliziert traditionelle Finanzdienstleistungen auf der Blockchain ohne zentrale Intermediäre. <strong>Lending/Borrowing</strong> (Aave, Compound): Verleihe Krypto gegen Zinsen. <strong>DEXs</strong> (Uniswap, Curve): Dezentraler Börsenhandel über Automated Market Makers. <strong>Yield Farming</strong>: Liquidität bereitstellen für hohe Renditen (aber auch hohe Risiken: Smart Contract Bugs, Impermanent Loss, Rug Pulls). DeFi TVL schwankte von $180 Mrd. (2021) auf $40 Mrd. (2023).",
    "<strong>DeFi</strong> replicates traditional financial services on the blockchain without central intermediaries. <strong>Lending/Borrowing</strong> (Aave, Compound): Lend crypto for interest. <strong>DEXs</strong> (Uniswap, Curve): Decentralized exchange trading via Automated Market Makers. <strong>Yield Farming</strong>: Provide liquidity for high returns (but also high risks: smart contract bugs, impermanent loss, rug pulls). DeFi TVL fluctuated from $180B (2021) to $40B (2023)."
  ),

  "learn.paymentInnovationTitle": t("Zahlungsinnovationen", "Payment Innovations"),
  "learn.paymentInnovationP1": t(
    "Die <strong>Zahlungslandschaft</strong> wandelt sich rasant: <strong>Echtzeit-Zahlungen</strong> (SEPA Instant, FedNow) ermöglichen Überweisungen in Sekunden statt Tagen. <strong>Buy Now Pay Later</strong> (BNPL: Klarna, Affirm) bietet zinsfreie Ratenzahlung – birgt aber Verschuldungsrisiken. <strong>Embedded Finance</strong> integriert Finanzdienstleistungen in Nicht-Finanz-Apps. <strong>Open Banking</strong> (PSD2 in EU) ermöglicht Drittanbietern Zugriff auf Bankdaten mit Kundeneinwilligung.",
    "The <strong>payments landscape</strong> is rapidly transforming: <strong>Real-time payments</strong> (SEPA Instant, FedNow) enable transfers in seconds instead of days. <strong>Buy Now Pay Later</strong> (BNPL: Klarna, Affirm) offers interest-free installments – but carries debt risks. <strong>Embedded finance</strong> integrates financial services into non-financial apps. <strong>Open Banking</strong> (PSD2 in EU) allows third parties access to bank data with customer consent."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 30: REAL ESTATE INVESTING (NEW)
  // ══════════════════════════════════════════════════════════════
  "learn.section30Title": t("Immobilien-Investing", "Real Estate Investing"),

  "learn.realEstateOverviewTitle": t("Immobilien als Anlageklasse", "Real Estate as an Asset Class"),
  "learn.realEstateOverviewP1": t(
    "<strong>Immobilien</strong> sind mit ca. $330 Billionen die größte Anlageklasse der Welt. Vorteile: Inflationsschutz (Mieten steigen mit Inflation), stabile Cashflows, Leverage-Möglichkeit (Hypothek), Steuervorteile (Abschreibungen). Nachteile: Illiquidität, hohe Transaktionskosten (5-10%), Klumpenrisiko, Instandhaltungskosten, Mietausfallrisiko. Rendite: Historisch 8-12% p.a. (inkl. Wertsteigerung und Mieteinnahmen).",
    "<strong>Real estate</strong> at approximately $330 trillion is the world's largest asset class. Advantages: Inflation protection (rents rise with inflation), stable cash flows, leverage possibility (mortgage), tax benefits (depreciation). Disadvantages: Illiquidity, high transaction costs (5-10%), concentration risk, maintenance costs, vacancy risk. Returns: Historically 8-12% p.a. (including appreciation and rental income)."
  ),

  "learn.directVsIndirectTitle": t("Direkt vs. Indirekt investieren", "Direct vs. Indirect Investment"),
  "learn.directVsIndirectP1": t(
    "<strong>Direkte Immobilieninvestition</strong>: Kauf einer Wohnung oder eines Hauses. Volle Kontrolle, aber hoher Kapitalbedarf (20-30% Eigenkapital), Verwaltungsaufwand und Klumpenrisiko. <strong>Indirekte Investition</strong>: <strong>REITs</strong> (börsengehandelte Immobilienfonds), <strong>offene Immobilienfonds</strong> (geringere Volatilität, aber Rückgabefristen), <strong>Crowdinvesting</strong> (ab 100-500€, aber höheres Ausfallrisiko), <strong>Immobilien-ETFs</strong> (breite Streuung, hohe Liquidität).",
    "<strong>Direct real estate investment</strong>: Buying an apartment or house. Full control, but high capital requirements (20-30% equity), management effort, and concentration risk. <strong>Indirect investment</strong>: <strong>REITs</strong> (exchange-traded real estate funds), <strong>open-ended real estate funds</strong> (lower volatility but redemption periods), <strong>crowdinvesting</strong> (from €100-500, but higher default risk), <strong>real estate ETFs</strong> (broad diversification, high liquidity)."
  ),

  "learn.reitsDeepTitle": t("REITs im Detail", "REITs in Detail"),
  "learn.reitsDeepP1": t(
    "<strong>REITs</strong> (Real Estate Investment Trusts) müssen mindestens 90% ihres Gewinns als Dividende ausschütten. Typen: <strong>Equity REITs</strong> (besitzen und betreiben Immobilien – 95% aller REITs), <strong>Mortgage REITs</strong> (investieren in Hypotheken), <strong>Hybrid REITs</strong> (Kombination). Sektoren: Wohnimmobilien, Büro, Einzelhandel, Logistik, Rechenzentren, Healthcare. Durchschnittliche Dividendenrendite: 3-6%. Korrelation zu Aktien: ~0,6 (moderate Diversifikation).",
    "<strong>REITs</strong> (Real Estate Investment Trusts) must distribute at least 90% of earnings as dividends. Types: <strong>Equity REITs</strong> (own and operate properties – 95% of all REITs), <strong>Mortgage REITs</strong> (invest in mortgages), <strong>Hybrid REITs</strong> (combination). Sectors: Residential, office, retail, logistics, data centers, healthcare. Average dividend yield: 3-6%. Correlation to stocks: ~0.6 (moderate diversification)."
  ),

  "learn.realEstateValuationTitle": t("Immobilienbewertung", "Real Estate Valuation"),
  "learn.realEstateValuationP1": t(
    "Wichtige Bewertungskennzahlen: <strong>Mietrendite</strong> (Jahresnettomiete/Kaufpreis × 100). Guter Wert: über 5%. <strong>Kaufpreisfaktor</strong> (Kaufpreis/Jahresnettomiete). Unter 20 = günstig, über 30 = teuer. <strong>Cap Rate</strong> (NOI/Immobilienwert). <strong>Cash-on-Cash Return</strong> (Cashflow/eingesetztes Eigenkapital). <strong>Vergleichswertverfahren</strong>: Preise ähnlicher Objekte in der Umgebung. <strong>Ertragswertverfahren</strong>: Barwert der zukünftigen Mieteinnahmen.",
    "Key valuation metrics: <strong>Rental yield</strong> (annual net rent/purchase price × 100). Good value: above 5%. <strong>Price-to-rent ratio</strong> (purchase price/annual net rent). Below 20 = cheap, above 30 = expensive. <strong>Cap Rate</strong> (NOI/property value). <strong>Cash-on-Cash Return</strong> (cash flow/equity invested). <strong>Comparable sales approach</strong>: Prices of similar properties nearby. <strong>Income approach</strong>: Present value of future rental income."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 31: TAX OPTIMIZATION STRATEGIES (NEW)
  // ══════════════════════════════════════════════════════════════
  "learn.section31Title": t("Steueroptimierung", "Tax Optimization Strategies"),

  "learn.taxPlanningOverviewTitle": t("Steuerplanung für Anleger", "Tax Planning for Investors"),
  "learn.taxPlanningOverviewP1": t(
    "<strong>Legale Steueroptimierung</strong> ist ein zentraler Faktor für die Nettorendite. Wichtige Hebel: <strong>Sparerpauschbetrag</strong> (1.000€/Person in DE) voll ausschöpfen, <strong>Verlustverrechnung</strong> (Verluste mit Gewinnen verrechnen), <strong>Haltedauer optimieren</strong> (in den USA: Long-term Capital Gains ab 1 Jahr günstiger besteuert), <strong>Asset Location</strong> (steuereffiziente Platzierung: Anleihen in steuergeschützte Konten, Aktien in steuerpflichtige Depots).",
    "<strong>Legal tax optimization</strong> is a key factor for net returns. Important levers: <strong>Saver's allowance</strong> (€1,000/person in DE) fully utilized, <strong>loss offsetting</strong> (offset losses against gains), <strong>holding period optimization</strong> (in the US: long-term capital gains from 1 year are taxed more favorably), <strong>asset location</strong> (tax-efficient placement: bonds in tax-sheltered accounts, stocks in taxable accounts)."
  ),

  "learn.taxLossHarvestingAdvTitle": t("Tax-Loss Harvesting Advanced", "Tax-Loss Harvesting Advanced"),
  "learn.taxLossHarvestingAdvP1": t(
    "<strong>Tax-Loss Harvesting</strong> geht über einfaches Verkaufen hinaus: <strong>Wash-Sale-Regel</strong> (USA): Du darfst dasselbe Wertpapier nicht innerhalb von 30 Tagen zurückkaufen. Strategie: Verkaufe den Verlust-ETF und kaufe einen ähnlichen (z.B. S&P 500 ETF → Total Market ETF). <strong>Tax-Loss Harvesting Algorithmen</strong> der Robo-Advisors können jährlich 1-2% zusätzliche Rendite durch automatisiertes Harvesting generieren. In Deutschland: Verlustverrechnungstopf wird automatisch beim Broker geführt.",
    "<strong>Tax-Loss Harvesting</strong> goes beyond simple selling: <strong>Wash-sale rule</strong> (US): You cannot repurchase the same security within 30 days. Strategy: Sell the loss ETF and buy a similar one (e.g., S&P 500 ETF → Total Market ETF). <strong>Tax-loss harvesting algorithms</strong> of robo-advisors can generate 1-2% additional annual returns through automated harvesting. In Germany: Loss offsetting pools are automatically maintained by the broker."
  ),

  "learn.capitalGainsStrategiesTitle": t("Kapitalertragsstrategien", "Capital Gains Strategies"),
  "learn.capitalGainsStrategiesP1": t(
    "Strategien zur Minimierung der Kapitalertragssteuer: <strong>FIFO vs. Specific ID</strong>: In den USA kannst du wählen, welche Anteile du verkaufst (die teuersten zuerst = niedrigerer Gewinn). <strong>Thesaurierende vs. ausschüttende Fonds</strong>: In DE werden seit 2018 beide über die Vorabpauschale besteuert. <strong>Günstigerprüfung</strong> (DE): Bei niedrigem Einkommen kann der persönliche Steuersatz unter 25% liegen. <strong>Steuerstundung</strong>: Gewinne nicht realisieren = keine Steuer. Buy & Hold ist auch steuereffizient.",
    "Strategies to minimize capital gains tax: <strong>FIFO vs. Specific ID</strong>: In the US, you can choose which shares to sell (most expensive first = lower gain). <strong>Accumulating vs. distributing funds</strong>: In DE, both have been taxed via advance lump sum since 2018. <strong>Favorable assessment</strong> (DE): With low income, your personal tax rate may be below 25%. <strong>Tax deferral</strong>: Not realizing gains = no tax. Buy & Hold is also tax-efficient."
  ),

  "learn.estatePlanningTitle": t("Erbschaftsplanung", "Estate Planning"),
  "learn.estatePlanningP1": t(
    "<strong>Erbschaftsplanung</strong> sichert die steuereffiziente Vermögensübertragung: <strong>Freibeträge</strong> (DE: 400.000€ pro Kind alle 10 Jahre, 500.000€ für Ehepartner). <strong>Schenkungen zu Lebzeiten</strong>: Freibeträge alle 10 Jahre neu nutzen. <strong>Familiengesellschaft</strong>: Strukturierung über GmbH & Co. KG kann Steuern optimieren. <strong>Nießbrauch</strong>: Vermögen übertragen, aber Erträge behalten. <strong>Testament/Erbvertrag</strong>: Unbedingt professionell erstellen lassen! Ohne Testament gilt die gesetzliche Erbfolge, die oft nicht den Wünschen entspricht.",
    "<strong>Estate planning</strong> ensures tax-efficient wealth transfer: <strong>Exemptions</strong> (DE: €400,000 per child every 10 years, €500,000 for spouses). <strong>Lifetime gifts</strong>: Use exemptions anew every 10 years. <strong>Family company</strong>: Structuring via GmbH & Co. KG can optimize taxes. <strong>Usufruct</strong>: Transfer assets but retain income. <strong>Will/inheritance contract</strong>: Absolutely have it professionally drafted! Without a will, statutory succession applies, which often doesn't match wishes."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 3 EXPANSION: New strategy cards
  // ══════════════════════════════════════════════════════════════
  "learn.contrarianTitle": t("Contrarian Investing", "Contrarian Investing"),
  "learn.contrarianP1": t(
    "<strong>Contrarian Investing</strong> setzt bewusst gegen den vorherrschenden Markttrend. Wenn alle verkaufen, kauft der Contrarian – und umgekehrt. Die Strategie basiert auf der Überzeugung, dass Märkte zu Übertreibungen neigen und Mean Reversion eintritt. Berühmte Contrarians: Sir John Templeton ('Kaufe bei maximaler Pessimismus'), David Dreman, Howard Marks. Risiko: Der Markt kann länger irrational bleiben als du solvent.",
    "<strong>Contrarian Investing</strong> deliberately goes against the prevailing market trend. When everyone sells, the contrarian buys – and vice versa. The strategy is based on the belief that markets tend to overreact and mean reversion occurs. Famous contrarians: Sir John Templeton ('Buy at the point of maximum pessimism'), David Dreman, Howard Marks. Risk: The market can stay irrational longer than you can stay solvent."
  ),

  "learn.sectorRotationTitle": t("Sektorrotation", "Sector Rotation"),
  "learn.sectorRotationP1": t(
    "<strong>Sektorrotation</strong> verschiebt Kapital je nach Konjunkturphase in die passenden Sektoren: <strong>Frühaufschwung</strong>: Technologie, Konsumgüter (zyklisch), Finanzen. <strong>Spätaufschwung</strong>: Industrie, Grundstoffe, Energie. <strong>Frührezession</strong>: Versorger, Gesundheit, Basiskonsumgüter. <strong>Spätrezession</strong>: Zurück zu Technologie und Finanzen. Der <strong>Business Cycle</strong> dauert typischerweise 5-10 Jahre. Herausforderung: Den Zyklus korrekt zu timen ist schwierig.",
    "<strong>Sector rotation</strong> shifts capital into appropriate sectors based on the business cycle: <strong>Early expansion</strong>: Technology, consumer discretionary, financials. <strong>Late expansion</strong>: Industrials, materials, energy. <strong>Early recession</strong>: Utilities, healthcare, consumer staples. <strong>Late recession</strong>: Back to technology and financials. The <strong>business cycle</strong> typically lasts 5-10 years. Challenge: Correctly timing the cycle is difficult."
  ),

  "learn.coreSatelliteTitle": t("Core-Satellite-Strategie", "Core-Satellite Strategy"),
  "learn.coreSatelliteP1": t(
    "Die <strong>Core-Satellite-Strategie</strong> kombiniert passives und aktives Investieren: Der <strong>Core</strong> (60-80% des Portfolios) besteht aus breit diversifizierten, kostengünstigen ETFs (z.B. MSCI World). Die <strong>Satellites</strong> (20-40%) sind gezielte Wetten auf Einzelaktien, Sektoren oder Themen. Vorteile: Niedrige Gesamtkosten, solide Basis, Chance auf Outperformance durch Satellites. Diese Strategie passt für Anleger, die aktiv sein wollen, ohne ihr gesamtes Portfolio zu riskieren.",
    "The <strong>core-satellite strategy</strong> combines passive and active investing: The <strong>core</strong> (60-80% of portfolio) consists of broadly diversified, low-cost ETFs (e.g., MSCI World). The <strong>satellites</strong> (20-40%) are targeted bets on individual stocks, sectors, or themes. Advantages: Low overall costs, solid foundation, chance of outperformance through satellites. This strategy suits investors who want to be active without risking their entire portfolio."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 8 EXPANSION: MPT practical, Risk Parity
  // ══════════════════════════════════════════════════════════════
  "learn.mptPracticalTitle": t("MPT in der Praxis", "MPT in Practice"),
  "learn.mptPracticalP1": t(
    "Die <strong>Moderne Portfoliotheorie</strong> in der Praxis: <strong>Efficient Frontier</strong> berechnen mit historischen Renditen und Korrelationen. Problem: <strong>Estimation Error</strong> – historische Daten sind keine perfekten Prädiktoren. Lösungen: <strong>Black-Litterman-Modell</strong> (kombiniert Marktgleichgewicht mit subjektiven Views), <strong>Resampled Efficiency</strong> (Monte Carlo über Inputs), <strong>Minimum Variance Portfolio</strong> (weniger sensitiv gegenüber Schätzfehlern). In der Praxis nutzen viele institutionelle Investoren vereinfachte Faustregeln statt voller MPT-Optimierung.",
    "<strong>Modern Portfolio Theory</strong> in practice: Calculate <strong>Efficient Frontier</strong> with historical returns and correlations. Problem: <strong>Estimation error</strong> – historical data aren't perfect predictors. Solutions: <strong>Black-Litterman Model</strong> (combines market equilibrium with subjective views), <strong>Resampled Efficiency</strong> (Monte Carlo over inputs), <strong>Minimum Variance Portfolio</strong> (less sensitive to estimation errors). In practice, many institutional investors use simplified rules of thumb rather than full MPT optimization."
  ),

  "learn.riskParityTitle": t("Risk Parity", "Risk Parity"),
  "learn.riskParityP1": t(
    "<strong>Risk Parity</strong> gewichtet Portfoliobestandteile so, dass jede Anlageklasse den gleichen Risikobeitrag (nicht die gleiche Kapitalallokation) liefert. Da Anleihen weniger volatil sind als Aktien, erhalten sie höheres Gewicht (oft gehebelt). Bekanntes Beispiel: Bridgewater's <strong>All Weather Fund</strong> (Ray Dalio). Typische Allokation: ~30% Aktien, ~55% Anleihen, ~15% Rohstoffe/Gold (mit Hebel). Vorteil: Bessere Diversifikation über Marktregime. Nachteil: Funktioniert schlecht bei gleichzeitig steigenden Zinsen und fallenden Aktien.",
    "<strong>Risk Parity</strong> weights portfolio components so each asset class contributes equal risk (not equal capital allocation). Since bonds are less volatile than stocks, they receive higher weight (often leveraged). Famous example: Bridgewater's <strong>All Weather Fund</strong> (Ray Dalio). Typical allocation: ~30% stocks, ~55% bonds, ~15% commodities/gold (with leverage). Advantage: Better diversification across market regimes. Disadvantage: Performs poorly when rates rise and stocks fall simultaneously."
  ),

  // ══════════════════════════════════════════════════════════════
  // SECTION 14 EXPANSION: Framing, Mental Accounting, Sunk Cost
  // ══════════════════════════════════════════════════════════════
  "learn.framingEffectTitle": t("Framing-Effekt", "Framing Effect"),
  "learn.framingEffectP1": t(
    "Der <strong>Framing-Effekt</strong> zeigt, dass die Art der Darstellung die Entscheidung beeinflusst: '90% Überlebensrate' klingt besser als '10% Sterblichkeitsrate' – obwohl es dasselbe ist. Im Investmentkontext: Ein Fonds mit '8% Rendite' wird anders wahrgenommen als einer mit '-12% unter dem Benchmark'. Anleger bewerten Gewinne und Verluste relativ zum Referenzpunkt, nicht absolut. Schutz: Immer die rohen Zahlen prüfen und Vergleichsrahmen hinterfragen.",
    "The <strong>framing effect</strong> shows that presentation affects decisions: '90% survival rate' sounds better than '10% mortality rate' – though identical. In investment context: A fund with '8% return' is perceived differently than one '-12% below benchmark.' Investors evaluate gains and losses relative to reference points, not absolutely. Protection: Always check raw numbers and question the framing."
  ),

  "learn.mentalAccountingTitle": t("Mentale Buchführung", "Mental Accounting"),
  "learn.mentalAccountingP1": t(
    "<strong>Mentale Buchführung</strong> (Richard Thaler, Nobelpreis 2017) beschreibt die Tendenz, Geld in verschiedene 'mentale Konten' zu unterteilen und unterschiedlich zu behandeln. Beispiel: Dividenden werden als 'freies Geld' anders ausgegeben als Kursgewinne. Oder: Gewonnenes Geld wird riskanter investiert als erarbeitetes ('House Money Effect'). Folge: Suboptimale Portfolioentscheidungen, weil jede Position isoliert statt als Gesamtportfolio betrachtet wird.",
    "<strong>Mental accounting</strong> (Richard Thaler, Nobel Prize 2017) describes the tendency to divide money into different 'mental accounts' and treat them differently. Example: Dividends are spent differently as 'free money' than capital gains. Or: Won money is invested more riskily than earned money ('house money effect'). Consequence: Suboptimal portfolio decisions because each position is viewed in isolation rather than as a total portfolio."
  ),

  "learn.sunkCostTitle": t("Sunk-Cost-Falle", "Sunk Cost Fallacy"),
  "learn.sunkCostP1": t(
    "Die <strong>Sunk-Cost-Falle</strong> lässt uns an Verlusten festhalten, weil wir bereits 'so viel investiert' haben. Beispiel: Du hältst eine Aktie, die 50% gefallen ist, weil du 'dein Geld zurückholen' willst – obwohl die Fundamentaldaten schlecht sind. Rational betrachtet sind vergangene Kosten irrelevant; nur die zukünftige Erwartung zählt. Gegenmittel: Frage dich bei jeder Position: 'Würde ich sie heute zum aktuellen Preis kaufen?' Wenn nein, verkaufe.",
    "The <strong>sunk cost fallacy</strong> makes us hold onto losses because we've already 'invested so much.' Example: You hold a stock that's fallen 50% because you want to 'get your money back' – despite poor fundamentals. Rationally, past costs are irrelevant; only future expectations matter. Antidote: Ask yourself for each position: 'Would I buy it today at the current price?' If not, sell."
  ),
};
