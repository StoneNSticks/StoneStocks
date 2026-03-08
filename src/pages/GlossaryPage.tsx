/**
 * GlossaryPage — A-Z filterable financial terms dictionary.
 * ~80+ terms with definitions, search, and letter filter.
 * All terms are bilingual (EN/DE) via the language context.
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Search } from "lucide-react";

interface Term { term: string; def: string; }

function getGlossary(lang: string): Term[] {
  if (lang === "de") return [
    { term: "ADR", def: "American Depositary Receipt — Über ADRs können Anleger ausländische Aktien direkt an US-Börsen kaufen und verkaufen, ohne ein Depot im Ausland zu eröffnen." },
    { term: "Aktie", def: "Ein Anteilsschein, der dich zum Miteigentümer eines Unternehmens macht. Du hast damit Stimmrecht auf der Hauptversammlung und profitierst von Dividenden und Kursgewinnen." },
    { term: "Alpha", def: "Überschussrendite einer Anlage gegenüber dem Benchmark." },
    { term: "Anleihe", def: "Quasi ein Kredit, den du einem Unternehmen oder Staat gibst. Dafür bekommst du regelmäßig Zinsen und am Ende dein Geld zurück." },
    { term: "Arbitrage", def: "Wenn ein und dasselbe Wertpapier an zwei Börsen unterschiedlich bewertet wird, können Händler die Preisdifferenz risikolos ausnutzen." },
    { term: "Ask", def: "Niedrigster Preis, zu dem ein Verkäufer bereit ist, ein Wertpapier zu verkaufen." },
    { term: "Asset Allocation", def: "Die Aufteilung deines Geldes auf verschiedene Anlageklassen — zum Beispiel Aktien, Anleihen und Rohstoffe. Ziel: das Risiko streuen." },
    { term: "ATH", def: "All-Time High — der absolute Höchstkurs, den ein Wertpapier jemals erreicht hat." },
    { term: "Bear Market", def: "Bärenmarkt — Marktphase mit fallenden Kursen (typisch: -20% vom Hoch)." },
    { term: "Beta", def: "Kennzahl für die Volatilität einer Aktie im Verhältnis zum Gesamtmarkt. Beta > 1 = volatiler als der Markt." },
    { term: "Bid", def: "Höchster Preis, den ein Käufer bereit ist für ein Wertpapier zu zahlen." },
    { term: "Blue Chip", def: "Große, etablierte und finanziell solide Unternehmen mit langjähriger Erfolgsbilanz." },
    { term: "Bollinger Bänder", def: "Technischer Indikator mit einem gleitenden Durchschnitt und zwei Standardabweichungsbändern." },
    { term: "Bull Market", def: "Bullenmarkt — Marktphase mit steigenden Kursen." },
    { term: "CAPM", def: "Capital Asset Pricing Model — Modell zur Bestimmung der erwarteten Rendite unter Berücksichtigung des systematischen Risikos." },
    { term: "CFD", def: "Contract for Difference — Differenzkontrakt, bei dem auf Kursänderungen spekuliert wird ohne den Basiswert zu besitzen." },
    { term: "Dark Pool", def: "Privater Handelsplatz, auf dem große Aufträge anonym ausgeführt werden." },
    { term: "DAX", def: "Deutscher Aktienindex — Leitindex mit den 40 größten deutschen börsennotierten Unternehmen." },
    { term: "DCF", def: "Discounted Cash Flow — Bewertungsmethode, die zukünftige Cashflows auf den heutigen Wert abzinst." },
    { term: "Derivat", def: "Finanzinstrument, dessen Wert sich von einem Basiswert (Aktie, Index, Rohstoff) ableitet." },
    { term: "Dividende", def: "Gewinnausschüttung eines Unternehmens an seine Aktionäre." },
    { term: "DCA", def: "Dollar-Cost-Averaging — Du investierst regelmäßig einen festen Betrag. So kaufst du bei niedrigen Kursen mehr Anteile und bei hohen weniger. Das glättet den Einstiegspreis über die Zeit." },
    { term: "EBITDA", def: "Gewinn vor Zinsen, Steuern und Abschreibungen — zeigt die operative Ertragskraft." },
    { term: "EPS", def: "Earnings Per Share — Gewinn pro Aktie." },
    { term: "ETF", def: "Exchange-Traded Fund — Börsengehandelter Fonds, der einen Index oder Sektor abbildet." },
    { term: "EV", def: "Enterprise Value — Gesamtwert eines Unternehmens inkl. Schulden abzügl. Barmittel." },
    { term: "FIRE", def: "Financial Independence, Retire Early — Finanzielle Unabhängigkeit und früher Ruhestand." },
    { term: "Free Cash Flow", def: "Freier Cashflow — verfügbare Barmittel nach Investitionsausgaben." },
    { term: "Future", def: "Standardisierter Terminkontrakt zum Kauf/Verkauf eines Basiswerts zu einem festgelegten Preis und Datum." },
    { term: "Hedge", def: "Absicherungsgeschäft zur Reduzierung von Risiken im Portfolio." },
    { term: "HFT", def: "High-Frequency Trading — Hochfrequenzhandel mit algorithmischen Strategien im Millisekundenbereich." },
    { term: "IPO", def: "Initial Public Offering — Börsengang eines Unternehmens." },
    { term: "KGV (P/E)", def: "Kurs-Gewinn-Verhältnis — Aktienkurs geteilt durch den Gewinn je Aktie." },
    { term: "KBV (P/B)", def: "Kurs-Buchwert-Verhältnis — Aktienkurs geteilt durch den Buchwert je Aktie." },
    { term: "Leverage", def: "Hebelwirkung — Einsatz von Fremdkapital oder Derivaten zur Vervielfachung von Gewinnen (und Verlusten)." },
    { term: "Limit Order", def: "Auftrag zum Kauf/Verkauf zu einem bestimmten Maximal-/Mindestpreis." },
    { term: "Liquidität", def: "Wie leicht ein Vermögenswert gekauft oder verkauft werden kann, ohne den Preis wesentlich zu beeinflussen." },
    { term: "MACD", def: "Moving Average Convergence Divergence — Trendfolge-Indikator basierend auf zwei gleitenden Durchschnitten." },
    { term: "Margin", def: "Sicherheitsleistung für gehebelte Positionen. Bei Unterschreitung droht ein Margin Call." },
    { term: "Marktkapitalisierung", def: "Aktienkurs × Gesamtzahl der Aktien — Maß für die Unternehmensgröße." },
    { term: "Monte Carlo", def: "Simulationsmethode mit Zufallsvariablen zur Schätzung von Wahrscheinlichkeiten und Risiken." },
    { term: "Moving Average", def: "Gleitender Durchschnitt — Durchschnittskurs über einen bestimmten Zeitraum zur Trendbestimmung." },
    { term: "Option", def: "Recht (nicht Pflicht) zum Kauf (Call) oder Verkauf (Put) eines Basiswerts zu einem bestimmten Preis." },
    { term: "P/S (KUV)", def: "Kurs-Umsatz-Verhältnis — Marktkapitalisierung geteilt durch den Umsatz." },
    { term: "Portfolio", def: "Gesamtheit aller Anlagen eines Investors." },
    { term: "REIT", def: "Real Estate Investment Trust — Immobilien-Investmentgesellschaft mit Pflicht zur hohen Dividendenausschüttung." },
    { term: "ROE", def: "Return on Equity — Eigenkapitalrendite: Gewinn im Verhältnis zum eingesetzten Eigenkapital." },
    { term: "ROA", def: "Return on Assets — Gesamtkapitalrendite: Gewinn im Verhältnis zu den Gesamtaktiva." },
    { term: "RSI", def: "Relative Strength Index — Momentum-Indikator (0–100). Über 70 = überkauft, unter 30 = überverkauft." },
    { term: "S&P 500", def: "Index der 500 größten US-Unternehmen nach Marktkapitalisierung." },
    { term: "Sharpe Ratio", def: "Risikobereinigtes Renditemaß: (Rendite - risikofreier Zinssatz) / Standardabweichung." },
    { term: "Short Selling", def: "Leerverkauf — Verkauf geliehener Aktien in der Hoffnung, sie günstiger zurückkaufen zu können." },
    { term: "Slippage", def: "Differenz zwischen erwartetem und tatsächlichem Ausführungspreis einer Order." },
    { term: "Spread", def: "Differenz zwischen Bid (Kaufangebot) und Ask (Verkaufsangebot)." },
    { term: "Stop-Loss", def: "Automatische Verkaufsorder bei Unterschreiten eines Schwellenkurses zur Verlustbegrenzung." },
    { term: "Trailing Stop", def: "Dynamischer Stop-Loss, der sich mit steigenden Kursen nach oben anpasst." },
    { term: "Volatilität", def: "Maß für die Schwankungsbreite eines Wertpapiers. Hohe Volatilität = hohes Risiko und Chance." },
    { term: "WACC", def: "Weighted Average Cost of Capital — Gewichtete durchschnittliche Kapitalkosten eines Unternehmens." },
    { term: "Yield Curve", def: "Zinskurve — Darstellung der Zinssätze von Anleihen verschiedener Laufzeiten." },
  ];
  return [
    { term: "ADR", def: "American Depositary Receipt — Tradeable certificates for foreign shares on US exchanges." },
    { term: "Alpha", def: "Excess return of an investment relative to its benchmark index." },
    { term: "Arbitrage", def: "Exploiting price differences of the same asset across different markets for risk-free profit." },
    { term: "Ask Price", def: "The lowest price at which a seller is willing to sell a security." },
    { term: "Asset Allocation", def: "Distribution of a portfolio across asset classes like stocks, bonds, and commodities." },
    { term: "ATH", def: "All-Time High — The highest price ever reached by a security." },
    { term: "Bear Market", def: "A market phase with falling prices, typically defined as a 20%+ decline from recent highs." },
    { term: "Beta", def: "Measure of a stock's volatility relative to the overall market. Beta > 1 means more volatile." },
    { term: "Bid Price", def: "The highest price a buyer is willing to pay for a security." },
    { term: "Blue Chip", def: "Large, well-established, financially sound companies with a long track record." },
    { term: "Bollinger Bands", def: "Technical indicator with a moving average and two standard deviation bands for volatility." },
    { term: "Bond", def: "Fixed-income security where the issuer pays interest and returns the face value at maturity." },
    { term: "Bull Market", def: "A market phase characterized by rising prices and investor optimism." },
    { term: "CAPM", def: "Capital Asset Pricing Model — Calculates expected return based on systematic risk (beta)." },
    { term: "CFD", def: "Contract for Difference — Speculate on price changes without owning the underlying asset." },
    { term: "Dark Pool", def: "Private exchange where large orders are executed anonymously to minimize market impact." },
    { term: "DCA", def: "Dollar-Cost Averaging — Investing a fixed amount regularly to smooth out entry prices." },
    { term: "DCF", def: "Discounted Cash Flow — Valuation method that discounts projected future cash flows to present value." },
    { term: "Derivative", def: "Financial instrument whose value is derived from an underlying asset (stock, index, commodity)." },
    { term: "Dividend", def: "A portion of a company's profits distributed to shareholders, usually quarterly." },
    { term: "EBITDA", def: "Earnings Before Interest, Taxes, Depreciation & Amortization — Shows operating profitability." },
    { term: "EPS", def: "Earnings Per Share — Net income divided by shares outstanding." },
    { term: "ETF", def: "Exchange-Traded Fund — A fund tracking an index or sector, traded like a stock." },
    { term: "Enterprise Value", def: "Total company value including debt minus cash. Used in EV/EBITDA ratio." },
    { term: "FIRE", def: "Financial Independence, Retire Early — Strategy to achieve financial freedom through aggressive saving." },
    { term: "Free Cash Flow", def: "Cash available after capital expenditures. Key indicator of financial health." },
    { term: "Futures", def: "Standardized contract to buy/sell an asset at a predetermined price and date." },
    { term: "Hedge", def: "An investment to reduce the risk of adverse price movements in another asset." },
    { term: "HFT", def: "High-Frequency Trading — Algorithmic trading at millisecond speeds." },
    { term: "IPO", def: "Initial Public Offering — When a company first sells shares to the public." },
    { term: "Leverage", def: "Using borrowed money or derivatives to amplify gains (and losses)." },
    { term: "Limit Order", def: "Order to buy/sell at a specific maximum/minimum price." },
    { term: "Liquidity", def: "How easily an asset can be bought or sold without significantly affecting its price." },
    { term: "MACD", def: "Moving Average Convergence Divergence — Trend-following momentum indicator." },
    { term: "Margin", def: "Collateral for leveraged positions. Falling below required margin triggers a margin call." },
    { term: "Market Cap", def: "Share price × total shares outstanding — Measures company size." },
    { term: "Monte Carlo", def: "Simulation method using random variables to estimate probabilities and risks." },
    { term: "Moving Average", def: "Average price over a period (e.g., SMA 50, EMA 200) used for trend identification." },
    { term: "Option", def: "Right (not obligation) to buy (call) or sell (put) an asset at a specific price." },
    { term: "P/B Ratio", def: "Price-to-Book — Share price divided by book value per share." },
    { term: "P/E Ratio", def: "Price-to-Earnings — Share price divided by earnings per share." },
    { term: "P/S Ratio", def: "Price-to-Sales — Market cap divided by total revenue." },
    { term: "Portfolio", def: "The collection of all investments held by an individual or institution." },
    { term: "REIT", def: "Real Estate Investment Trust — Company investing in real estate, required to pay high dividends." },
    { term: "ROA", def: "Return on Assets — Net income divided by total assets." },
    { term: "ROE", def: "Return on Equity — Net income divided by shareholders' equity." },
    { term: "RSI", def: "Relative Strength Index — Momentum oscillator (0–100). Above 70 = overbought, below 30 = oversold." },
    { term: "S&P 500", def: "Index of the 500 largest US companies by market capitalization." },
    { term: "Sharpe Ratio", def: "Risk-adjusted return: (Return - Risk-free rate) / Standard deviation." },
    { term: "Short Selling", def: "Selling borrowed shares hoping to buy them back cheaper later." },
    { term: "Slippage", def: "Difference between expected and actual execution price of an order." },
    { term: "Spread", def: "Difference between bid (buy) and ask (sell) price." },
    { term: "Stock", def: "An ownership share in a company that entitles the holder to voting rights and profit participation." },
    { term: "Stop-Loss", def: "Automatic sell order triggered when price falls below a threshold to limit losses." },
    { term: "Trailing Stop", def: "Dynamic stop-loss that moves up with rising prices but stays fixed when prices fall." },
    { term: "Volatility", def: "Measure of price fluctuation. High volatility = higher risk and opportunity." },
    { term: "WACC", def: "Weighted Average Cost of Capital — Blended cost of debt and equity financing." },
    { term: "Yield Curve", def: "Chart showing interest rates of bonds across different maturities." },
  ];
}

export default function GlossaryPage() {
  const t = useT();
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const glossary = useMemo(() => getGlossary(lang), [lang]);
  const letters = useMemo(() => [...new Set(glossary.map(g => g.term[0].toUpperCase()))].sort(), [glossary]);

  const filtered = useMemo(() => {
    let items = glossary;
    if (letter) items = items.filter(g => g.term[0].toUpperCase() === letter);
    if (search) items = items.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || g.def.toLowerCase().includes(search.toLowerCase()));
    return items;
  }, [glossary, letter, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-6 sm:py-10 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Finanz-Glossar" : "Financial Glossary"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? `${glossary.length}+ Begriffe von A–Z` : `${glossary.length}+ terms from A–Z`}</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={lang === "de" ? "Begriffe suchen..." : "Search terms..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          <button onClick={() => setLetter(null)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${!letter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            {lang === "de" ? "Alle" : "All"}
          </button>
          {letters.map(l => (
            <button key={l} onClick={() => setLetter(l === letter ? null : l)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${letter === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(g => (
            <div key={g.term} className="rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 transition-colors">
              <div className="font-display font-semibold text-sm text-foreground">{g.term}</div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.def}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground">{lang === "de" ? "Keine Begriffe gefunden." : "No terms found."}</div>
          )}
        </div>
      </main>
      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">© {new Date().getFullYear()} StoneStocks</div>
      </footer>
    </div>
  );
}
