/**
 * GlossaryPage: A-Z filterable financial terms dictionary.
 * 200+ terms with definitions, search, and letter filter.
 * All terms are bilingual (EN/DE) via the language context.
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Search } from "lucide-react";

interface Term { term: string; def: string; }

function getGlossary(lang: string): Term[] {
  if (lang === "de") return [
    // A
    { term: "ADR", def: "American Depositary Receipt. Über ADRs können Anleger ausländische Aktien direkt an US-Börsen kaufen und verkaufen, ohne ein Depot im Ausland zu eröffnen." },
    { term: "Aktie", def: "Ein Anteilsschein, der dich zum Miteigentümer eines Unternehmens macht. Du hast damit Stimmrecht auf der Hauptversammlung und profitierst von Dividenden und Kursgewinnen." },
    { term: "Aktive Verwaltung", def: "Anlagestrategie, bei der ein Fondsmanager gezielt Wertpapiere auswählt, um den Markt zu schlagen. Kostet meist mehr als passive Ansätze." },
    { term: "Alpha", def: "Überschussrendite einer Anlage im Vergleich zum Referenzindex. Positives Alpha heißt, der Manager hat den Markt geschlagen." },
    { term: "Amortisation", def: "Planmäßige Abschreibung immaterieller Vermögenswerte wie Patente oder Software über ihre Nutzungsdauer." },
    { term: "Anleihe", def: "Quasi ein Kredit, den du einem Unternehmen oder Staat gibst. Dafür bekommst du regelmäßig Zinsen und am Ende dein Geld zurück." },
    { term: "Arbitrage", def: "Wenn ein und dasselbe Wertpapier an zwei Börsen unterschiedlich bewertet wird, können Händler die Preisdifferenz risikolos ausnutzen." },
    { term: "Ask", def: "Niedrigster Preis, zu dem ein Verkäufer bereit ist, ein Wertpapier abzugeben." },
    { term: "Asset Allocation", def: "Die Aufteilung deines Geldes auf verschiedene Anlageklassen (Aktien, Anleihen, Rohstoffe usw.), um das Risiko zu streuen." },
    { term: "At the Money", def: "Eine Option, deren Strike-Preis genau dem aktuellen Kurs des Basiswerts entspricht." },
    { term: "ATH", def: "All-Time High: der absolute Höchstkurs, den ein Wertpapier jemals erreicht hat." },
    { term: "ATS", def: "Alternative Trading System. Ein elektronischer Handelsplatz außerhalb der regulären Börsen, z.B. für institutionelle Anleger." },
    { term: "AUM", def: "Assets Under Management. Das gesamte verwaltete Vermögen eines Fonds oder Vermögensverwalters." },
    // B
    { term: "BaFin", def: "Bundesanstalt für Finanzdienstleistungsaufsicht. Die deutsche Behörde, die Banken, Versicherungen und den Wertpapierhandel beaufsichtigt." },
    { term: "Basispunkt", def: "Ein Hundertstel Prozentpunkt (0,01%). Wird bei Zinsänderungen verwendet: 25 Basispunkte = 0,25%." },
    { term: "Bear Market", def: "Bärenmarkt: Marktphase mit fallenden Kursen, typisch ab einem Rückgang von 20% vom Hoch." },
    { term: "Benchmark", def: "Vergleichsmaßstab für die Performance. Für US-Aktien oft der S&P 500, für globale Aktien der MSCI World." },
    { term: "Beta", def: "Kennzahl für die Volatilität einer Aktie im Verhältnis zum Gesamtmarkt. Beta über 1 bedeutet volatiler als der Markt." },
    { term: "Bid", def: "Höchster Preis, den ein Käufer bereit ist, für ein Wertpapier zu zahlen." },
    { term: "Block Trade", def: "Großauftrag (meist 10.000+ Aktien), der außerbörslich oder über spezielle Kanäle abgewickelt wird, um den Marktpreis nicht zu beeinflussen." },
    { term: "Blue Chip", def: "Große, etablierte und finanziell solide Unternehmen mit langjähriger Erfolgsbilanz. Beispiele: Apple, Microsoft, Nestlé." },
    { term: "Bollinger Bänder", def: "Technischer Indikator mit einem gleitenden Durchschnitt und zwei Standardabweichungsbändern, die Volatilität sichtbar machen." },
    { term: "Book Building", def: "Verfahren bei Börsengängen, bei dem Investoren Gebote abgeben, um den Emissionspreis zu ermitteln." },
    { term: "Book Value", def: "Buchwert: Eigenkapital eines Unternehmens laut Bilanz. Ergibt sich aus Vermögenswerten minus Verbindlichkeiten." },
    { term: "Bracket Order", def: "Kombination aus drei Orders: Kauforder plus Stop-Loss und Take-Profit. Automatisiert Absicherung und Gewinnmitnahme." },
    { term: "Buchwert", def: "Bilanzieller Wert eines Unternehmens. Vermögenswerte abzüglich aller Schulden." },
    { term: "Bull Market", def: "Bullenmarkt: Marktphase mit steigenden Kursen und optimistischer Stimmung." },
    { term: "Buyback", def: "Aktienrückkauf. Das Unternehmen kauft eigene Aktien vom Markt zurück, was den Gewinn pro Aktie steigert." },
    // C
    { term: "CAPM", def: "Capital Asset Pricing Model. Modell zur Bestimmung der erwarteten Rendite unter Berücksichtigung des systematischen Risikos (Beta)." },
    { term: "Capex", def: "Capital Expenditures. Investitionsausgaben für langfristige Vermögenswerte wie Maschinen, Gebäude oder Technologie." },
    { term: "CFD", def: "Contract for Difference. Differenzkontrakt, bei dem auf Kursänderungen spekuliert wird, ohne den Basiswert zu besitzen." },
    { term: "Circuit Breaker", def: "Automatischer Handelsstopp an Börsen, der bei extremen Kursausschlägen ausgelöst wird, um Panikverkäufe zu bremsen." },
    { term: "Clearing House", def: "Zentrale Abwicklungsstelle, die als Gegenpartei für beide Seiten eines Handels fungiert und so das Ausfallrisiko minimiert." },
    { term: "COGS", def: "Cost of Goods Sold. Herstellkosten der verkauften Produkte. Umsatz minus COGS ergibt den Bruttogewinn." },
    { term: "Comparable Analysis", def: "Bewertungsmethode, bei der ein Unternehmen mit ähnlichen börsennotierten Firmen verglichen wird (Multiples wie KGV, EV/EBITDA)." },
    { term: "Contrarian", def: "Anlagestil, der bewusst gegen den Markttrend handelt. Kaufen, wenn alle verkaufen, und umgekehrt." },
    { term: "Convertible Bond", def: "Wandelanleihe. Eine Anleihe, die zu bestimmten Bedingungen in Aktien des Unternehmens umgewandelt werden kann." },
    { term: "Correlation", def: "Statistisches Maß (-1 bis +1), das zeigt, wie stark sich zwei Anlagen gleichzeitig bewegen. -1 = gegenläufig, +1 = gleichläufig." },
    { term: "Covariance", def: "Maß dafür, wie zwei Wertpapiere gemeinsam schwanken. Grundlage für Korrelationsberechnungen und Portfoliooptimierung." },
    { term: "Covered Call", def: "Optionsstrategie: Du besitzt die Aktie und verkaufst gleichzeitig eine Call-Option darauf. Bringt Prämieneinnahmen, begrenzt aber das Aufwärtspotenzial." },
    { term: "CPI", def: "Consumer Price Index (Verbraucherpreisindex). Wichtigster Maßstab für die Inflation und damit für die Geldpolitik der Zentralbanken." },
    { term: "Credit Rating", def: "Bonitätsnote, vergeben von Ratingagenturen (S&P, Moody's, Fitch). AAA ist die Bestnote, alles unter BBB gilt als spekulativ." },
    { term: "Current Ratio", def: "Umlaufvermögen geteilt durch kurzfristige Verbindlichkeiten. Zeigt, ob ein Unternehmen seine kurzfristigen Schulden begleichen kann. Über 1 ist gesund." },
    { term: "Custody", def: "Verwahrung von Wertpapieren durch eine Bank oder einen Broker im Auftrag des Anlegers." },
    // D
    { term: "Dark Pool", def: "Privater Handelsplatz, auf dem große Aufträge anonym ausgeführt werden, um den Marktpreis nicht zu bewegen." },
    { term: "DAX", def: "Deutscher Aktienindex mit den 40 größten deutschen börsennotierten Unternehmen." },
    { term: "Day Order", def: "Kaufauftrag, der nur für den aktuellen Handelstag gültig ist. Wird er nicht ausgeführt, verfällt er automatisch." },
    { term: "Day Trading", def: "Handelsstil, bei dem Positionen innerhalb eines einzigen Handelstages eröffnet und geschlossen werden." },
    { term: "DCA", def: "Dollar-Cost-Averaging. Du investierst regelmäßig einen festen Betrag. So kaufst du bei niedrigen Kursen mehr Anteile und bei hohen weniger." },
    { term: "DCF", def: "Discounted Cash Flow. Bewertungsmethode, die zukünftige Cashflows auf den heutigen Wert abzinst." },
    { term: "Debt-to-Equity", def: "Verhältnis von Fremd- zu Eigenkapital. Ein hoher Wert bedeutet mehr Schulden im Verhältnis zum Eigenkapital." },
    { term: "Deflation", def: "Allgemeiner Preisrückgang über einen längeren Zeitraum. Das Gegenteil von Inflation. Kann die Wirtschaft bremsen, weil Konsumenten Käufe aufschieben." },
    { term: "Delisting", def: "Rücknahme der Börsenzulassung. Eine Aktie wird vom Handel an der Börse genommen, z.B. nach einer Übernahme oder wegen Regelverstößen." },
    { term: "Delta", def: "Optionskennzahl: Wie stark ändert sich der Optionspreis, wenn der Basiswert um 1 Dollar steigt? Ein Delta von 0,5 heißt: 50 Cent Änderung." },
    { term: "Depreciation", def: "Abschreibung auf Sachanlagen (Maschinen, Gebäude). Verteilt den Kaufpreis über die Nutzungsdauer in der Gewinn- und Verlustrechnung." },
    { term: "Derivat", def: "Finanzinstrument, dessen Wert sich von einem Basiswert (Aktie, Index, Rohstoff) ableitet." },
    { term: "Dilution", def: "Verwässerung. Wenn ein Unternehmen neue Aktien ausgibt, sinkt der Anteil bestehender Aktionäre am Gesamtunternehmen." },
    { term: "Diversifikation", def: "Risikostreuung durch Verteilung des Kapitals auf verschiedene Anlageklassen, Branchen und Regionen." },
    { term: "Dividende", def: "Gewinnausschüttung eines Unternehmens an seine Aktionäre, meist quartalsweise oder jährlich." },
    // E
    { term: "EBITDA", def: "Gewinn vor Zinsen, Steuern und Abschreibungen. Zeigt die operative Ertragskraft eines Unternehmens." },
    { term: "ECN", def: "Electronic Communication Network. Elektronisches Handelsnetzwerk, das Kauf- und Verkaufsaufträge direkt zusammenführt." },
    { term: "EPS", def: "Earnings Per Share (Gewinn pro Aktie). Nettogewinn geteilt durch die Anzahl ausstehender Aktien." },
    { term: "ESG", def: "Environmental, Social, Governance. Nachhaltigkeitskriterien für Investments: Umwelt, Soziales und Unternehmensführung." },
    { term: "ETF", def: "Exchange-Traded Fund. Börsengehandelter Fonds, der einen Index oder Sektor abbildet. Günstig und breit gestreut." },
    { term: "EV", def: "Enterprise Value. Gesamtwert eines Unternehmens inklusive Schulden und abzüglich Barmittel." },
    { term: "EV/EBITDA", def: "Bewertungskennzahl: Enterprise Value geteilt durch EBITDA. Ermöglicht Vergleiche unabhängig von Kapitalstruktur und Steuersituation." },
    { term: "EV/Revenue", def: "Enterprise Value geteilt durch Umsatz. Oft bei Wachstumsunternehmen genutzt, die noch keinen Gewinn machen." },
    { term: "Expense Ratio", def: "Jährliche Kostenquote eines Fonds oder ETFs, angegeben als Prozentsatz des verwalteten Vermögens." },
    { term: "Expiration Date", def: "Verfallstag einer Option. Nach diesem Datum ist die Option wertlos, wenn sie nicht ausgeübt wurde." },
    // F
    { term: "Fed Funds Rate", def: "Leitzins der US-Notenbank Federal Reserve. Beeinflusst die Kreditkosten in der gesamten Wirtschaft." },
    { term: "Fiduciary", def: "Treuhänder. Jemand, der gesetzlich verpflichtet ist, im besten Interesse seines Klienten zu handeln." },
    { term: "Fill or Kill", def: "Ordertyp: Die gesamte Order muss sofort vollständig ausgeführt werden, sonst wird sie komplett storniert." },
    { term: "FINRA", def: "Financial Industry Regulatory Authority. US-Aufsichtsbehörde für Broker und Wertpapierhändler." },
    { term: "FIRE", def: "Financial Independence, Retire Early. Strategie für finanzielle Unabhängigkeit durch hohe Sparquoten und gezieltes Investieren." },
    { term: "Fiscal Policy", def: "Fiskalpolitik. Steuerung der Wirtschaft durch Steuern und Staatsausgaben (Gegenstück zur Geldpolitik der Zentralbanken)." },
    { term: "Forward P/E", def: "Kurs-Gewinn-Verhältnis auf Basis der geschätzten zukünftigen Gewinne. Zeigt, wie teuer eine Aktie relativ zu erwarteten Erträgen ist." },
    { term: "Free Cash Flow", def: "Freier Cashflow. Verfügbare Barmittel nach Investitionsausgaben. Zeigt, wie viel Geld wirklich übrig bleibt." },
    { term: "Front Running", def: "Illegale Praxis, bei der ein Broker eigene Trades vor Kundenorders platziert, um von der erwarteten Preisbewegung zu profitieren." },
    { term: "Future", def: "Standardisierter Terminkontrakt zum Kauf oder Verkauf eines Basiswerts zu einem festgelegten Preis und Datum." },
    // G
    { term: "Gamma", def: "Optionskennzahl: Wie schnell ändert sich Delta, wenn sich der Kurs des Basiswerts bewegt? Wichtig für das Risikomanagement bei Optionen." },
    { term: "GDP", def: "Gross Domestic Product (Bruttoinlandsprodukt). Gesamtwert aller Waren und Dienstleistungen, die in einem Land in einem Jahr produziert werden." },
    { term: "Going Private", def: "Ein börsennotiertes Unternehmen wird privatisiert, z.B. durch einen Buyout. Die Aktien werden vom öffentlichen Handel genommen." },
    { term: "Goodwill", def: "Immaterieller Vermögenswert in der Bilanz. Entsteht bei Übernahmen, wenn der Kaufpreis über dem Buchwert liegt." },
    { term: "Gordon Growth Model", def: "Bewertungsmodell für Aktien mit stabiler Dividende. Fairer Wert = Dividende / (Renditeanforderung - Wachstumsrate)." },
    { term: "Greenshoe Option", def: "Mehrzuteilungsoption beim Börsengang. Der Underwriter kann zusätzliche Aktien ausgeben, um den Kurs zu stabilisieren." },
    { term: "Gross Margin", def: "Bruttomarge: (Umsatz minus Herstellkosten) geteilt durch Umsatz. Zeigt, wie effizient ein Unternehmen produziert." },
    { term: "Growth Investing", def: "Anlagestil, der auf Unternehmen mit überdurchschnittlichem Umsatz- und Gewinnwachstum setzt, auch bei hoher Bewertung." },
    { term: "GTC Order", def: "Good Till Cancelled. Eine Order, die so lange aktiv bleibt, bis sie ausgeführt oder manuell storniert wird." },
    // H
    { term: "Halting", def: "Vorübergehender Handelsstopp für ein Wertpapier, z.B. wegen kursrelevanter Nachrichten oder extremer Kursbewegungen." },
    { term: "Hedge", def: "Absicherungsgeschäft zur Reduzierung von Risiken im Portfolio, z.B. durch Optionen oder Short-Positionen." },
    { term: "HFT", def: "High-Frequency Trading. Hochfrequenzhandel mit algorithmischen Strategien im Millisekundenbereich." },
    { term: "Historical Volatility", def: "Historische Volatilität. Tatsächliche Schwankungsbreite eines Wertpapiers in der Vergangenheit, berechnet aus vergangenen Kursdaten." },
    // I
    { term: "Immaterielle Vermögenswerte", def: "Nicht-physische Werte in der Bilanz wie Patente, Marken, Software oder Goodwill." },
    { term: "Implied Volatility", def: "Implizite Volatilität. Vom Markt erwartete künftige Schwankungsbreite, abgeleitet aus Optionspreisen." },
    { term: "In the Money", def: "Eine Option, die einen inneren Wert hat. Bei Calls: Kurs über Strike. Bei Puts: Kurs unter Strike." },
    { term: "Income Investing", def: "Anlagestil, der auf regelmäßige Erträge (Dividenden, Zinsen) abzielt statt auf Kursgewinne." },
    { term: "Index Fund", def: "Fonds, der einen Börsenindex (z.B. S&P 500) passiv nachbildet. Niedrige Kosten und breite Streuung." },
    { term: "Inflation", def: "Allgemeiner Anstieg des Preisniveaus. Dein Geld verliert an Kaufkraft. Zentralbanken streben meist 2% pro Jahr an." },
    { term: "Information Ratio", def: "Kennzahl, die die Überschussrendite ins Verhältnis zum Tracking Error setzt. Misst die Qualität aktiver Managemententscheidungen." },
    { term: "Insider Trading", def: "Handel mit nicht-öffentlichen Informationen. Die legale Variante (Insider-Käufe/Verkäufe mit Meldepflicht) kann ein nützliches Signal sein. Die illegale Form ist strafbar." },
    { term: "Intrinsic Value", def: "Innerer Wert. Der tatsächliche, fundamentale Wert eines Unternehmens oder einer Option, unabhängig vom Marktpreis." },
    { term: "IPO", def: "Initial Public Offering. Börsengang eines Unternehmens, bei dem erstmals Aktien öffentlich angeboten werden." },
    { term: "Iron Condor", def: "Optionsstrategie aus vier Optionen (zwei Puts, zwei Calls), die von geringer Volatilität profitiert. Begrenzter Gewinn und begrenztes Risiko." },
    // K
    { term: "KGV (P/E)", def: "Kurs-Gewinn-Verhältnis. Aktienkurs geteilt durch den Gewinn je Aktie. Zeigt, wie viele Jahre Gewinn im Kurs stecken." },
    { term: "KBV (P/B)", def: "Kurs-Buchwert-Verhältnis. Aktienkurs geteilt durch den Buchwert je Aktie. Unter 1 kann auf Unterbewertung hindeuten." },
    // L
    { term: "Level 2 Data", def: "Detaillierte Orderbuchdaten mit allen Kauf- und Verkaufsaufträgen samt Stückzahl. Zeigt die Tiefe des Marktes." },
    { term: "Leverage", def: "Hebelwirkung. Einsatz von Fremdkapital oder Derivaten zur Vervielfachung von Gewinnen (und Verlusten)." },
    { term: "Limit Order", def: "Auftrag zum Kauf oder Verkauf zu einem bestimmten Maximal- oder Mindestpreis." },
    { term: "Liquidität", def: "Wie leicht ein Vermögenswert gekauft oder verkauft werden kann, ohne den Preis wesentlich zu beeinflussen." },
    { term: "Load", def: "Ausgabeaufschlag oder Rücknahmegebühr bei Fonds. No-Load-Fonds verzichten darauf." },
    { term: "Lot Size", def: "Mindesthandelsmenge für ein Wertpapier. Bei US-Aktien ist ein Standard-Lot 100 Aktien." },
    // M
    { term: "MACD", def: "Moving Average Convergence Divergence. Trendfolge-Indikator, der die Differenz zweier gleitender Durchschnitte zeigt." },
    { term: "Margin", def: "Sicherheitsleistung für gehebelte Positionen. Bei Unterschreitung droht ein Margin Call, bei dem du Geld nachschießen musst." },
    { term: "Margin of Safety", def: "Sicherheitsmarge. Differenz zwischen dem geschätzten inneren Wert und dem Kaufpreis. Zentrales Konzept im Value Investing." },
    { term: "Market Cap", def: "Marktkapitalisierung: Aktienkurs mal Gesamtzahl der Aktien. Maß für die Unternehmensgröße." },
    { term: "Market Maker", def: "Marktteilnehmer, der ständig Kauf- und Verkaufspreise stellt und so für Liquidität sorgt." },
    { term: "Market on Close", def: "Order, die zum Schlusskurs des Handelstages ausgeführt wird." },
    { term: "Market on Open", def: "Order, die zum Eröffnungskurs des nächsten Handelstages ausgeführt wird." },
    { term: "Market Order", def: "Auftrag zum sofortigen Kauf oder Verkauf zum aktuellen Marktpreis. Wird immer ausgeführt, aber der Preis ist nicht garantiert." },
    { term: "Max Drawdown", def: "Maximaler Wertverlust eines Portfolios vom Hoch zum Tief. Wichtige Risikokennzahl: zeigt das Worst-Case-Szenario." },
    { term: "Merger", def: "Fusion zweier Unternehmen zu einer neuen Gesellschaft. Beide Firmen geben ihre Eigenständigkeit auf." },
    { term: "Monetary Policy", def: "Geldpolitik. Steuerung der Geldmenge und der Zinsen durch die Zentralbank, um Inflation und Wachstum zu steuern." },
    { term: "Monte Carlo", def: "Simulationsmethode mit Zufallsvariablen zur Schätzung von Wahrscheinlichkeiten und Risiken in komplexen Systemen." },
    { term: "Momentum Investing", def: "Anlagestil, der Aktien kauft, die zuletzt stark gestiegen sind, in der Erwartung, dass sich der Trend fortsetzt." },
    { term: "Moving Average", def: "Gleitender Durchschnitt. Durchschnittskurs über einen bestimmten Zeitraum (z.B. 50 oder 200 Tage) zur Trendbestimmung." },
    // N
    { term: "Naked Option", def: "Ungedeckte Option. Der Verkäufer besitzt den Basiswert nicht (bei Calls) und hat theoretisch unbegrenztes Verlustrisiko." },
    { term: "NAV", def: "Net Asset Value. Nettoinventarwert eines Fonds: Gesamtvermögen minus Verbindlichkeiten, geteilt durch ausgegebene Anteile." },
    { term: "Net Income", def: "Nettogewinn. Der Gewinn nach Abzug aller Kosten, Zinsen und Steuern." },
    { term: "Net Margin", def: "Nettomarge: Nettogewinn geteilt durch Umsatz. Zeigt, wie viel Prozent vom Umsatz als Gewinn übrig bleiben." },
    // O
    { term: "OCO Order", def: "One-Cancels-Other. Zwei verknüpfte Orders, bei denen die Ausführung der einen automatisch die andere storniert." },
    { term: "Odd Lot", def: "Aktienorder mit weniger als 100 Stück. Im Gegensatz zu Round Lots (100er-Vielfache)." },
    { term: "Open Interest", def: "Gesamtzahl offener Optionskontrakte, die noch nicht geschlossen oder ausgeübt wurden. Maß für Marktaktivität." },
    { term: "Operating Margin", def: "Operative Marge: Betriebsergebnis geteilt durch Umsatz. Zeigt die Profitabilität des Kerngeschäfts." },
    { term: "Option", def: "Recht (nicht Pflicht) zum Kauf (Call) oder Verkauf (Put) eines Basiswerts zu einem bestimmten Preis bis zu einem festgelegten Datum." },
    { term: "Order Book", def: "Orderbuch. Digitale Liste aller offenen Kauf- und Verkaufsaufträge für ein Wertpapier, sortiert nach Preis." },
    { term: "Out of the Money", def: "Eine Option ohne inneren Wert. Bei Calls: Kurs unter Strike. Bei Puts: Kurs über Strike." },
    // P
    { term: "P/S (KUV)", def: "Kurs-Umsatz-Verhältnis. Marktkapitalisierung geteilt durch den Umsatz." },
    { term: "Pairs Trading", def: "Strategie, bei der eine Long-Position in einer Aktie mit einer Short-Position in einer ähnlichen Aktie kombiniert wird." },
    { term: "Passive Investing", def: "Anlagestrategie, die einen Index nachbildet statt aktiv Wertpapiere auszuwählen. Setzt auf breite Streuung und niedrige Kosten." },
    { term: "PEG Ratio", def: "KGV geteilt durch die erwartete Gewinnwachstumsrate. Ein PEG unter 1 deutet auf eine günstige Bewertung relativ zum Wachstum hin." },
    { term: "PMI", def: "Purchasing Managers' Index. Einkaufsmanagerindex, der die wirtschaftliche Aktivität misst. Über 50 = Expansion, unter 50 = Kontraktion." },
    { term: "Portfolio", def: "Gesamtheit aller Anlagen eines Investors." },
    { term: "Position Trading", def: "Langfristiger Handelsstil mit Haltedauer von Wochen bis Monaten, basierend auf fundamentalen und technischen Analysen." },
    { term: "PPI", def: "Producer Price Index (Erzeugerpreisindex). Misst Preisveränderungen aus Sicht der Produzenten. Oft ein Frühindikator für die Verbraucherinflation." },
    { term: "Precedent Transactions", def: "Bewertungsmethode, die vergangene Übernahmen ähnlicher Unternehmen als Referenz nutzt." },
    { term: "Prospectus", def: "Wertpapierprospekt. Offizielles Dokument mit allen relevanten Informationen für Anleger bei Neuemissionen." },
    { term: "Protective Put", def: "Absicherungsstrategie: Du kaufst eine Put-Option auf eine Aktie, die du bereits besitzt. Begrenzt den maximalen Verlust." },
    { term: "Proxy Vote", def: "Stimmrechtsvertretung. Aktionäre können ihr Stimmrecht an einen Vertreter übertragen, z.B. bei der Hauptversammlung." },
    // Q
    { term: "QE", def: "Quantitative Easing. Geldpolitisches Instrument, bei dem die Zentralbank Anleihen kauft, um die Geldmenge zu erhöhen und die Wirtschaft anzukurbeln." },
    { term: "Quick Ratio", def: "Liquiditätskennzahl: (Umlaufvermögen minus Vorräte) geteilt durch kurzfristige Verbindlichkeiten. Strenger als die Current Ratio." },
    // R
    { term: "R-Squared", def: "Bestimmtheitsmaß (0-1). Zeigt, wie viel der Kursbewegung eines Fonds durch seinen Benchmark erklärt wird. R² nahe 1 = eng am Index." },
    { term: "REIT", def: "Real Estate Investment Trust. Immobilien-Investmentgesellschaft mit Pflicht zur hohen Dividendenausschüttung." },
    { term: "Retained Earnings", def: "Einbehaltene Gewinne. Der Teil des Nettogewinns, der nicht als Dividende ausgeschüttet, sondern im Unternehmen reinvestiert wird." },
    { term: "Revenue", def: "Umsatz. Gesamteinnahmen eines Unternehmens aus dem Verkauf von Waren und Dienstleistungen." },
    { term: "Reverse Split", def: "Umgekehrter Aktiensplit. Mehrere bestehende Aktien werden zu einer zusammengelegt. Der Kurs pro Aktie steigt entsprechend." },
    { term: "Rho", def: "Optionskennzahl: Sensitivität des Optionspreises gegenüber Zinsänderungen. In der Praxis oft weniger relevant als Delta oder Theta." },
    { term: "Rights Issue", def: "Bezugsrechtsemission. Bestehende Aktionäre können neue Aktien zu einem vergünstigten Preis kaufen, bevor sie öffentlich angeboten werden." },
    { term: "ROA", def: "Return on Assets. Gesamtkapitalrendite: Gewinn im Verhältnis zu den Gesamtaktiva." },
    { term: "ROE", def: "Return on Equity. Eigenkapitalrendite: Gewinn im Verhältnis zum eingesetzten Eigenkapital." },
    { term: "ROIC", def: "Return on Invested Capital. Rendite auf das investierte Kapital. Zeigt, wie effizient ein Unternehmen Kapital einsetzt, um Gewinne zu erzielen." },
    { term: "ROCE", def: "Return on Capital Employed. Ähnlich wie ROIC, berücksichtigt aber das gesamte eingesetzte Kapital inklusive Fremdkapital." },
    { term: "Round Lot", def: "Standardmäßige Handelsmenge von 100 Aktien. Orders in Round Lots erhalten oft bessere Ausführungspreise." },
    { term: "RSI", def: "Relative Strength Index. Momentum-Indikator von 0 bis 100. Über 70 gilt als überkauft, unter 30 als überverkauft." },
    // S
    { term: "S&P 500", def: "Index der 500 größten US-Unternehmen nach Marktkapitalisierung. Einer der wichtigsten Benchmarks weltweit." },
    { term: "Scalping", def: "Sehr kurzfristiger Handelsstil mit vielen kleinen Trades, die auf minimale Kursgewinne abzielen." },
    { term: "SEC", def: "Securities and Exchange Commission. Die US-Börsenaufsichtsbehörde, verantwortlich für den Anlegerschutz und die Regulierung der Wertpapiermärkte." },
    { term: "Sector Rotation", def: "Strategie, bei der Kapital je nach Konjunkturphase zwischen verschiedenen Branchen umgeschichtet wird." },
    { term: "Settlement", def: "Abwicklung eines Handels. In den USA dauert die Abwicklung bei Aktien einen Werktag nach dem Handel (T+1)." },
    { term: "SG&A", def: "Selling, General & Administrative Expenses. Vertriebs- und Verwaltungskosten. Teil der operativen Ausgaben in der Gewinn- und Verlustrechnung." },
    { term: "Sharpe Ratio", def: "Risikobereinigtes Renditemaß. Berechnung: (Rendite minus risikofreier Zinssatz) geteilt durch Standardabweichung. Höher ist besser." },
    { term: "Short Selling", def: "Leerverkauf. Verkauf geliehener Aktien in der Hoffnung, sie günstiger zurückkaufen zu können." },
    { term: "Slippage", def: "Differenz zwischen erwartetem und tatsächlichem Ausführungspreis einer Order, vor allem in schnelllebigen Märkten." },
    { term: "Sortino Ratio", def: "Ähnlich wie Sharpe Ratio, berücksichtigt aber nur die Abwärtsvolatilität. Bestraft also nur negative Schwankungen." },
    { term: "Sovereign Debt", def: "Staatsschulden. Von einem Staat ausgegebene Anleihen. Gelten bei Industrieländern als besonders sicher." },
    { term: "Spin-off", def: "Ausgliederung eines Unternehmensteils als eigenständige, börsennotierte Gesellschaft. Aktionäre erhalten Anteile am neuen Unternehmen." },
    { term: "Spread", def: "Differenz zwischen Geld- (Bid) und Briefkurs (Ask). Je enger der Spread, desto liquider der Markt." },
    { term: "Stagflation", def: "Kombination aus stagnierender Wirtschaft und hoher Inflation. Schwierig für Anleger, da weder Aktien noch Anleihen gut abschneiden." },
    { term: "Standard Deviation", def: "Standardabweichung. Misst die Streuung der Renditen um den Durchschnitt. Höhere Werte bedeuten mehr Risiko." },
    { term: "Stock Split", def: "Aktiensplit. Eine Aktie wird in mehrere aufgeteilt (z.B. 1:4). Der Kurs sinkt entsprechend, der Gesamtwert bleibt gleich." },
    { term: "Stop-Loss", def: "Automatische Verkaufsorder bei Unterschreiten eines Schwellenkurses zur Verlustbegrenzung." },
    { term: "Straddle", def: "Optionsstrategie: Gleichzeitiger Kauf von Call und Put mit gleichem Strike und Verfall. Profitiert von starken Kursbewegungen in beide Richtungen." },
    { term: "Strangle", def: "Wie Straddle, aber mit verschiedenen Strike-Preisen. Günstiger, braucht aber eine stärkere Kursbewegung, um profitabel zu sein." },
    { term: "Strike Price", def: "Ausübungspreis einer Option. Der Preis, zu dem der Basiswert gekauft (Call) oder verkauft (Put) werden kann." },
    { term: "Swing Trading", def: "Handelsstil mit Haltedauer von wenigen Tagen bis Wochen. Nutzt mittelfristige Kursschwankungen aus." },
    { term: "Systematic Risk", def: "Marktrisiko, das alle Wertpapiere betrifft (z.B. Wirtschaftskrisen, Zinsänderungen). Kann nicht durch Diversifikation eliminiert werden." },
    // T
    { term: "T+1 / T+2", def: "Settlement-Fristen. T+1 bedeutet, der Handel wird einen Werktag nach Abschluss abgewickelt. In den USA gilt seit 2024 T+1." },
    { term: "Tail Risk", def: "Risiko extrem seltener, aber schwerwiegender Ereignisse (schwarze Schwäne), die weit außerhalb der normalen Verteilung liegen." },
    { term: "Tangible Assets", def: "Sachanlagen. Physische Vermögenswerte wie Grundstücke, Gebäude, Maschinen und Inventar." },
    { term: "Tape Reading", def: "Analyse des Orderflusses in Echtzeit. Trader beobachten, welche Orders gerade ausgeführt werden, um kurzfristige Trends zu erkennen." },
    { term: "Tapering", def: "Schrittweise Reduzierung der Anleihekäufe durch die Zentralbank. Signal dafür, dass die lockere Geldpolitik endet." },
    { term: "Tender Offer", def: "Übernahmeangebot. Ein Unternehmen bietet den Aktionären eines anderen Unternehmens an, ihre Aktien zu einem bestimmten Preis zu kaufen." },
    { term: "Terminal Value", def: "Restwert in der DCF-Analyse. Schätzung des Unternehmenswerts am Ende des Prognosezeitraums." },
    { term: "Theta", def: "Optionskennzahl: Zeitwertverfall pro Tag. Optionen verlieren mit jedem Tag an Wert, besonders kurz vor dem Verfall." },
    { term: "Tick Size", def: "Kleinste mögliche Preisveränderung eines Wertpapiers. Bei US-Aktien meist 1 Cent." },
    { term: "Tracking Error", def: "Abweichung der Rendite eines Fonds von seinem Benchmark. Bei Indexfonds sollte der Tracking Error möglichst gering sein." },
    { term: "Trade Balance", def: "Handelsbilanz. Differenz zwischen Exporten und Importen eines Landes. Ein Defizit bedeutet mehr Importe als Exporte." },
    { term: "Trailing P/E", def: "KGV auf Basis der tatsächlichen Gewinne der letzten 12 Monate (im Gegensatz zum Forward P/E)." },
    { term: "Trailing Stop", def: "Dynamischer Stop-Loss, der sich mit steigenden Kursen nach oben anpasst, aber bei fallenden Kursen stehen bleibt." },
    // U
    { term: "Underwriter", def: "Emissionsbank. Begleitet den Börsengang und garantiert die Platzierung der neuen Aktien." },
    { term: "Unsystematic Risk", def: "Unternehmensspezifisches Risiko, das durch Diversifikation reduziert werden kann (z.B. Managementfehler, Produktprobleme)." },
    // V
    { term: "Value at Risk", def: "Statistische Kennzahl, die den maximalen Verlust angibt, der mit einer bestimmten Wahrscheinlichkeit in einem definierten Zeitraum nicht überschritten wird." },
    { term: "Value Investing", def: "Anlagestil, der unterbewertete Aktien sucht und auf die Annäherung an den inneren Wert setzt. Geprägt von Benjamin Graham und Warren Buffett." },
    { term: "Vega", def: "Optionskennzahl: Sensitivität des Optionspreises gegenüber Änderungen der impliziten Volatilität." },
    { term: "Volatilität", def: "Maß für die Schwankungsbreite eines Wertpapiers. Hohe Volatilität bedeutet sowohl höheres Risiko als auch höhere Chancen." },
    // W
    { term: "WACC", def: "Weighted Average Cost of Capital. Gewichtete durchschnittliche Kapitalkosten eines Unternehmens (Eigen- und Fremdkapital)." },
    { term: "Warrant", def: "Optionsschein. Ähnlich einer Option, aber vom Unternehmen selbst ausgegeben. Meist längere Laufzeit." },
    { term: "Working Capital", def: "Betriebskapital: Umlaufvermögen minus kurzfristige Verbindlichkeiten. Zeigt die kurzfristige finanzielle Gesundheit." },
    // Y
    { term: "Yield Curve", def: "Zinskurve. Darstellung der Zinssätze von Anleihen verschiedener Laufzeiten. Eine inverse Kurve gilt als Rezessionswarnung." },
    // Z
    { term: "12b-1 Fee", def: "Marketing- und Vertriebsgebühr bei US-Investmentfonds, die aus dem Fondsvermögen bezahlt wird." },
  ];
  return [
    // A
    { term: "Acquisition", def: "When one company buys a controlling stake in another. The target may continue as a subsidiary or be fully absorbed." },
    { term: "Active Management", def: "Investment strategy where a fund manager picks securities to outperform the market. Typically more expensive than passive approaches." },
    { term: "ADR", def: "American Depositary Receipt. Tradeable certificates for foreign shares on US exchanges, making international investing accessible." },
    { term: "Alpha", def: "Excess return of an investment compared to its benchmark. Positive alpha means the manager beat the market." },
    { term: "Amortization", def: "Gradual write-down of intangible assets (patents, software) over their useful life in the income statement." },
    { term: "Arbitrage", def: "Exploiting price differences of the same asset across different markets for risk-free profit." },
    { term: "Ask Price", def: "The lowest price at which a seller is willing to sell a security." },
    { term: "Asset Allocation", def: "Distribution of a portfolio across asset classes like stocks, bonds, and commodities to manage risk." },
    { term: "At the Money", def: "An option whose strike price equals the current price of the underlying asset." },
    { term: "ATH", def: "All-Time High. The highest price ever reached by a security." },
    { term: "ATS", def: "Alternative Trading System. An electronic trading venue outside traditional exchanges, often used by institutions." },
    { term: "AUM", def: "Assets Under Management. The total market value of investments managed by a fund or financial advisor." },
    // B
    { term: "BaFin", def: "The German Federal Financial Supervisory Authority. Oversees banks, insurance companies, and securities trading in Germany." },
    { term: "Basis Point", def: "One hundredth of a percentage point (0.01%). Used for interest rate changes: 25 basis points = 0.25%." },
    { term: "Bear Market", def: "A market phase with falling prices, typically defined as a 20%+ decline from recent highs." },
    { term: "Benchmark", def: "A standard for measuring performance. For US stocks often the S&P 500, for global stocks the MSCI World." },
    { term: "Beta", def: "Measure of a stock's volatility relative to the overall market. Beta above 1 means more volatile than the market." },
    { term: "Bid Price", def: "The highest price a buyer is willing to pay for a security." },
    { term: "Block Trade", def: "A large order (usually 10,000+ shares) executed off-exchange or through special channels to avoid moving the market price." },
    { term: "Blue Chip", def: "Large, well-established, financially sound companies with a long track record. Examples: Apple, Microsoft, Nestlé." },
    { term: "Bollinger Bands", def: "Technical indicator with a moving average and two standard deviation bands that visualize volatility." },
    { term: "Bond", def: "Fixed-income security where the issuer pays interest and returns the face value at maturity." },
    { term: "Book Building", def: "Process during IPOs where investors submit bids to determine the offering price." },
    { term: "Book Value", def: "A company's equity according to its balance sheet. Calculated as total assets minus total liabilities." },
    { term: "Bracket Order", def: "Three linked orders: a buy order plus stop-loss and take-profit. Automates both protection and profit-taking." },
    { term: "Bull Market", def: "A market phase characterized by rising prices and investor optimism." },
    { term: "Buyback", def: "Share repurchase. A company buys its own shares from the open market, increasing earnings per share for remaining holders." },
    // C
    { term: "CAPM", def: "Capital Asset Pricing Model. Calculates expected return based on systematic risk (beta) and the market risk premium." },
    { term: "Capex", def: "Capital Expenditures. Spending on long-term assets like machinery, buildings, or technology." },
    { term: "CFD", def: "Contract for Difference. Speculate on price changes without owning the underlying asset." },
    { term: "Circuit Breaker", def: "Automatic trading halt at exchanges triggered by extreme price swings to prevent panic selling." },
    { term: "Clearing House", def: "Central counterparty that guarantees both sides of a trade, minimizing default risk." },
    { term: "COGS", def: "Cost of Goods Sold. Direct costs of producing goods. Revenue minus COGS equals gross profit." },
    { term: "Comparable Analysis", def: "Valuation method comparing a company to similar publicly traded firms using multiples like P/E or EV/EBITDA." },
    { term: "Contrarian", def: "Investment style that deliberately goes against market trends. Buy when everyone sells, sell when everyone buys." },
    { term: "Convertible Bond", def: "A bond that can be converted into shares of the issuing company under certain conditions." },
    { term: "Correlation", def: "Statistical measure (-1 to +1) showing how closely two investments move together. -1 = opposite, +1 = identical movement." },
    { term: "Covariance", def: "Measure of how two securities move together. Foundation for correlation calculations and portfolio optimization." },
    { term: "Covered Call", def: "Options strategy: You own the stock and sell a call option against it. Generates premium income but caps upside potential." },
    { term: "CPI", def: "Consumer Price Index. Key measure of inflation that tracks price changes of a basket of consumer goods and services." },
    { term: "Credit Rating", def: "Bond quality grade from rating agencies (S&P, Moody's, Fitch). AAA is the best, below BBB is considered speculative." },
    { term: "Current Account", def: "Broadest measure of a country's trade balance, including goods, services, income, and transfers." },
    { term: "Current Ratio", def: "Current assets divided by current liabilities. Shows whether a company can pay its short-term debts. Above 1 is healthy." },
    { term: "Custody", def: "Safekeeping of securities by a bank or broker on behalf of the investor." },
    // D
    { term: "Dark Pool", def: "Private exchange where large orders are executed anonymously to minimize market impact." },
    { term: "Day Order", def: "An order valid only for the current trading day. If not filled, it expires automatically at market close." },
    { term: "Day Trading", def: "Trading style where positions are opened and closed within a single trading day." },
    { term: "DCA", def: "Dollar-Cost Averaging. Investing a fixed amount regularly to smooth out entry prices over time." },
    { term: "DCF", def: "Discounted Cash Flow. Valuation method that discounts projected future cash flows to present value." },
    { term: "Debt-to-Equity", def: "Ratio of total debt to shareholders' equity. Higher values indicate more leverage and potentially more risk." },
    { term: "Deflation", def: "General decline in prices over an extended period. The opposite of inflation. Can slow the economy as consumers delay purchases." },
    { term: "Delisting", def: "Removal of a stock from exchange trading, e.g. after a takeover or for violating listing requirements." },
    { term: "Delta", def: "Options metric: How much the option price changes for a $1 move in the underlying. A delta of 0.5 means 50 cents change." },
    { term: "Depreciation", def: "Writing down the cost of physical assets (machinery, buildings) over their useful life in the income statement." },
    { term: "Derivative", def: "Financial instrument whose value is derived from an underlying asset (stock, index, commodity)." },
    { term: "Dilution", def: "When a company issues new shares, existing shareholders own a smaller percentage of the total." },
    { term: "Diversification", def: "Spreading investments across different asset classes, sectors, and regions to reduce risk." },
    { term: "Dividend", def: "A portion of a company's profits distributed to shareholders, usually quarterly or annually." },
    // E
    { term: "EBITDA", def: "Earnings Before Interest, Taxes, Depreciation & Amortization. Shows a company's operating profitability." },
    { term: "ECN", def: "Electronic Communication Network. Matches buy and sell orders directly without a traditional exchange intermediary." },
    { term: "EPS", def: "Earnings Per Share. Net income divided by the number of outstanding shares." },
    { term: "Enterprise Value", def: "Total company value including debt minus cash. Used in ratios like EV/EBITDA for cross-company comparison." },
    { term: "ESG", def: "Environmental, Social, Governance. Sustainability criteria for investments covering environmental impact, social responsibility, and corporate governance." },
    { term: "ETF", def: "Exchange-Traded Fund. A fund tracking an index or sector, traded like a stock. Typically low-cost and broadly diversified." },
    { term: "EV/EBITDA", def: "Enterprise Value divided by EBITDA. Enables comparisons independent of capital structure and tax situation." },
    { term: "EV/Revenue", def: "Enterprise Value divided by revenue. Often used for growth companies not yet profitable." },
    { term: "Expense Ratio", def: "Annual cost of a fund or ETF, expressed as a percentage of assets under management." },
    { term: "Expiration Date", def: "The date an option contract expires. After this date, unexercised options become worthless." },
    // F
    { term: "Fed Funds Rate", def: "The benchmark interest rate set by the US Federal Reserve. Influences borrowing costs across the economy." },
    { term: "Fiduciary", def: "Someone legally required to act in the best interest of their client." },
    { term: "Fill or Kill", def: "Order type: The entire order must be filled immediately and completely, or it's cancelled entirely." },
    { term: "FINRA", def: "Financial Industry Regulatory Authority. US regulator for brokers and securities dealers." },
    { term: "FIRE", def: "Financial Independence, Retire Early. Strategy for financial freedom through high savings rates and targeted investing." },
    { term: "Fiscal Policy", def: "Government management of the economy through taxation and spending (as opposed to monetary policy by central banks)." },
    { term: "Forward P/E", def: "Price-to-Earnings ratio based on estimated future earnings. Shows how expensive a stock is relative to expected profits." },
    { term: "Free Cash Flow", def: "Cash available after capital expenditures. Shows how much money the business truly generates." },
    { term: "Front Running", def: "Illegal practice where a broker places their own trades ahead of client orders to profit from the expected price movement." },
    { term: "Futures", def: "Standardized contract to buy or sell an asset at a predetermined price and date." },
    // G
    { term: "Gamma", def: "Options metric: Rate of change of Delta. Important for understanding how Delta shifts as the underlying moves." },
    { term: "GDP", def: "Gross Domestic Product. Total value of all goods and services produced in a country during a year." },
    { term: "Going Private", def: "When a public company is taken private, e.g. through a buyout. Shares are removed from public trading." },
    { term: "Goodwill", def: "Intangible asset on the balance sheet. Arises in acquisitions when the purchase price exceeds the book value of the target." },
    { term: "Gordon Growth Model", def: "Valuation model for stocks with stable dividends. Fair value = Dividend / (Required return - Growth rate)." },
    { term: "Greenshoe Option", def: "Over-allotment option in an IPO. The underwriter can issue additional shares to stabilize the price." },
    { term: "Gross Margin", def: "Revenue minus cost of goods sold, divided by revenue. Shows how efficiently a company produces." },
    { term: "Growth Investing", def: "Investment style focusing on companies with above-average revenue and earnings growth, even at high valuations." },
    { term: "GTC Order", def: "Good Till Cancelled. An order that stays active until filled or manually cancelled." },
    // H
    { term: "Halting", def: "Temporary trading suspension for a security, e.g. due to material news or extreme price swings." },
    { term: "Hedge", def: "An investment to reduce risk in a portfolio, e.g. through options or short positions." },
    { term: "HFT", def: "High-Frequency Trading. Algorithmic trading at millisecond speeds." },
    { term: "Historical Volatility", def: "Actual past price fluctuation of a security, calculated from historical price data." },
    // I
    { term: "Implied Volatility", def: "Market's expectation of future price swings, derived from current option prices." },
    { term: "In the Money", def: "An option with intrinsic value. For calls: price above strike. For puts: price below strike." },
    { term: "Income Investing", def: "Strategy focused on generating regular income (dividends, interest) rather than capital gains." },
    { term: "Index Fund", def: "Fund that passively tracks a market index (e.g. S&P 500). Low costs and broad diversification." },
    { term: "Inflation", def: "General rise in price levels. Your money loses purchasing power. Central banks typically target 2% annually." },
    { term: "Information Ratio", def: "Excess return relative to tracking error. Measures the quality of active management decisions." },
    { term: "Insider Trading", def: "Trading on non-public information. Legal insider trades (with disclosure) can be useful signals. The illegal form is a criminal offense." },
    { term: "Intangible Assets", def: "Non-physical assets on the balance sheet like patents, trademarks, software, or goodwill." },
    { term: "Intrinsic Value", def: "The true, fundamental value of a company or option, independent of market price." },
    { term: "IPO", def: "Initial Public Offering. When a company first sells shares to the public on a stock exchange." },
    { term: "Iron Condor", def: "Options strategy using four options (two puts, two calls) that profits from low volatility. Both profit and risk are capped." },
    // L
    { term: "Level 2 Data", def: "Detailed order book data showing all pending buy and sell orders with quantities. Reveals market depth." },
    { term: "Leverage", def: "Using borrowed money or derivatives to amplify gains (and losses)." },
    { term: "Limit Order", def: "Order to buy or sell at a specific maximum or minimum price." },
    { term: "Liquidity", def: "How easily an asset can be bought or sold without significantly affecting its price." },
    { term: "Load", def: "Sales charge or redemption fee on a mutual fund. No-load funds don't charge this." },
    { term: "Lot Size", def: "Minimum trading quantity for a security. For US stocks, a standard lot is 100 shares." },
    // M
    { term: "MACD", def: "Moving Average Convergence Divergence. Trend-following indicator showing the difference between two moving averages." },
    { term: "Margin", def: "Collateral for leveraged positions. Falling below required margin triggers a margin call, requiring you to deposit more funds." },
    { term: "Margin of Safety", def: "Difference between estimated intrinsic value and purchase price. Central concept in value investing." },
    { term: "Market Cap", def: "Share price times total shares outstanding. Measures company size." },
    { term: "Market Maker", def: "Participant that continuously provides buy and sell quotes, ensuring liquidity for a security." },
    { term: "Market on Close", def: "Order executed at the closing price of the trading day." },
    { term: "Market on Open", def: "Order executed at the opening price of the next trading session." },
    { term: "Market Order", def: "Order for immediate execution at the current market price. Always fills, but the exact price isn't guaranteed." },
    { term: "Max Drawdown", def: "Largest peak-to-trough decline in portfolio value. Key risk metric showing the worst-case scenario." },
    { term: "Merger", def: "Combination of two companies into a new entity. Both firms give up their independence." },
    { term: "Monetary Policy", def: "Central bank management of money supply and interest rates to control inflation and economic growth." },
    { term: "Momentum Investing", def: "Style that buys stocks with recent strong performance, expecting the trend to continue." },
    { term: "Monte Carlo", def: "Simulation method using random variables to estimate probabilities and risks in complex systems." },
    { term: "Moving Average", def: "Average price over a period (e.g. 50 or 200 days) used for trend identification." },
    // N
    { term: "Naked Option", def: "Uncovered option. The seller doesn't own the underlying (for calls), creating theoretically unlimited loss potential." },
    { term: "NAV", def: "Net Asset Value. Total fund assets minus liabilities, divided by shares outstanding." },
    { term: "Net Income", def: "Bottom-line profit after all expenses, interest, and taxes." },
    { term: "Net Margin", def: "Net income divided by revenue. Shows what percentage of revenue remains as profit." },
    // O
    { term: "OCO Order", def: "One-Cancels-Other. Two linked orders where filling one automatically cancels the other." },
    { term: "Odd Lot", def: "A stock order for fewer than 100 shares, as opposed to round lots (multiples of 100)." },
    { term: "Open Interest", def: "Total number of outstanding options contracts not yet closed or exercised. Indicates market activity." },
    { term: "Operating Margin", def: "Operating income divided by revenue. Shows the profitability of core business operations." },
    { term: "Option", def: "Right (not obligation) to buy (call) or sell (put) an asset at a specific price by a set date." },
    { term: "Order Book", def: "Digital list of all open buy and sell orders for a security, sorted by price." },
    { term: "Out of the Money", def: "An option with no intrinsic value. For calls: price below strike. For puts: price above strike." },
    // P
    { term: "P/B Ratio", def: "Price-to-Book. Share price divided by book value per share. Below 1 may indicate undervaluation." },
    { term: "P/E Ratio", def: "Price-to-Earnings. Share price divided by earnings per share. Shows how many years of earnings are priced in." },
    { term: "P/S Ratio", def: "Price-to-Sales. Market cap divided by total revenue." },
    { term: "Pairs Trading", def: "Strategy combining a long position in one stock with a short position in a similar stock." },
    { term: "Passive Investing", def: "Strategy that tracks an index rather than picking individual securities. Relies on broad diversification and low costs." },
    { term: "PEG Ratio", def: "P/E divided by expected earnings growth rate. A PEG below 1 suggests cheap valuation relative to growth." },
    { term: "PMI", def: "Purchasing Managers' Index. Measures economic activity. Above 50 = expansion, below 50 = contraction." },
    { term: "Portfolio", def: "The collection of all investments held by an individual or institution." },
    { term: "Position Trading", def: "Long-term trading style with holding periods of weeks to months, based on fundamental and technical analysis." },
    { term: "PPI", def: "Producer Price Index. Measures price changes from the producer's perspective. Often a leading indicator for consumer inflation." },
    { term: "Precedent Transactions", def: "Valuation method using past acquisitions of similar companies as reference points." },
    { term: "Prospectus", def: "Official document with all relevant information for investors in new securities offerings." },
    { term: "Protective Put", def: "Hedging strategy: You buy a put option on a stock you already own, capping your maximum loss." },
    { term: "Proxy Vote", def: "Delegating your shareholder voting rights to a representative, e.g. for annual meetings." },
    // Q
    { term: "QE", def: "Quantitative Easing. Central bank buys bonds to increase money supply and stimulate the economy." },
    { term: "Quick Ratio", def: "Liquidity metric: (Current assets minus inventory) divided by current liabilities. Stricter than current ratio." },
    // R
    { term: "R-Squared", def: "Coefficient of determination (0-1). Shows how much of a fund's movement is explained by its benchmark. R² near 1 = closely tracks the index." },
    { term: "REIT", def: "Real Estate Investment Trust. Company investing in real estate, required to distribute most income as dividends." },
    { term: "Retained Earnings", def: "Portion of net income not paid as dividends but reinvested in the company." },
    { term: "Revenue", def: "Total income from selling goods and services. The top line of the income statement." },
    { term: "Reverse Split", def: "Multiple existing shares consolidated into one. Share price increases proportionally." },
    { term: "Rho", def: "Options metric: Sensitivity of option price to interest rate changes. Usually less significant than Delta or Theta." },
    { term: "Rights Issue", def: "Existing shareholders can buy new shares at a discount before they're offered publicly." },
    { term: "ROA", def: "Return on Assets. Net income divided by total assets." },
    { term: "ROE", def: "Return on Equity. Net income divided by shareholders' equity." },
    { term: "ROIC", def: "Return on Invested Capital. Shows how efficiently a company uses capital to generate profits." },
    { term: "ROCE", def: "Return on Capital Employed. Similar to ROIC but includes total capital including debt." },
    { term: "Round Lot", def: "Standard trading quantity of 100 shares. Round lot orders often receive better execution prices." },
    { term: "RSI", def: "Relative Strength Index. Momentum oscillator from 0 to 100. Above 70 = overbought, below 30 = oversold." },
    // S
    { term: "S&P 500", def: "Index of the 500 largest US companies by market capitalization. One of the most important benchmarks worldwide." },
    { term: "Scalping", def: "Very short-term trading style with many small trades targeting minimal price gains." },
    { term: "SEC", def: "Securities and Exchange Commission. US authority responsible for investor protection and regulating securities markets." },
    { term: "Sector Rotation", def: "Strategy that shifts capital between sectors based on the economic cycle." },
    { term: "Settlement", def: "Finalizing a trade. In the US, stock trades settle one business day after execution (T+1)." },
    { term: "SG&A", def: "Selling, General & Administrative Expenses. Operating costs including sales, marketing, and overhead." },
    { term: "Sharpe Ratio", def: "Risk-adjusted return: (Return minus risk-free rate) divided by standard deviation. Higher is better." },
    { term: "Short Selling", def: "Selling borrowed shares hoping to buy them back cheaper later." },
    { term: "Slippage", def: "Difference between expected and actual execution price, especially in fast-moving markets." },
    { term: "Sortino Ratio", def: "Similar to Sharpe Ratio but only counts downside volatility. Only penalizes negative fluctuations." },
    { term: "Sovereign Debt", def: "Government bonds. Considered especially safe for developed nations." },
    { term: "Spin-off", def: "Separation of a business unit into an independent, publicly traded company. Shareholders receive shares in the new entity." },
    { term: "Spread", def: "Difference between bid and ask price. Tighter spreads indicate more liquid markets." },
    { term: "Stagflation", def: "Combination of stagnant economic growth and high inflation. Tough for investors since neither stocks nor bonds perform well." },
    { term: "Standard Deviation", def: "Measures the dispersion of returns around the average. Higher values indicate more risk." },
    { term: "Stock", def: "An ownership share in a company that entitles the holder to voting rights and profit participation." },
    { term: "Stock Split", def: "One share divided into multiple (e.g. 1:4). Price drops proportionally, total value stays the same." },
    { term: "Stop-Loss", def: "Automatic sell order triggered when price falls below a set level to limit losses." },
    { term: "Straddle", def: "Options strategy: Buy both a call and put with the same strike and expiration. Profits from large price swings in either direction." },
    { term: "Strangle", def: "Like a straddle but with different strike prices. Cheaper, but needs a bigger price move to be profitable." },
    { term: "Strike Price", def: "The price at which an option holder can buy (call) or sell (put) the underlying asset." },
    { term: "Swing Trading", def: "Trading style with holding periods of several days to weeks, exploiting medium-term price swings." },
    { term: "Systematic Risk", def: "Market-wide risk affecting all securities (e.g. economic crises, rate changes). Cannot be diversified away." },
    // T
    { term: "T+1 / T+2", def: "Settlement periods. T+1 means the trade settles one business day after execution. The US switched to T+1 in 2024." },
    { term: "Tail Risk", def: "Risk of extremely rare but severe events (black swans) far outside the normal distribution." },
    { term: "Tangible Assets", def: "Physical assets like land, buildings, machinery, and inventory." },
    { term: "Tape Reading", def: "Real-time order flow analysis. Traders watch which orders are being executed to spot short-term trends." },
    { term: "Tapering", def: "Gradual reduction of bond purchases by the central bank. Signals the end of loose monetary policy." },
    { term: "Tender Offer", def: "A bid to purchase shareholders' stock at a specified price, usually at a premium to market value." },
    { term: "Terminal Value", def: "Residual value in DCF analysis. Estimate of a company's worth at the end of the forecast period." },
    { term: "Theta", def: "Options metric: Time decay per day. Options lose value with each passing day, especially near expiration." },
    { term: "Tick Size", def: "Smallest possible price change for a security. For US stocks, typically one cent." },
    { term: "Tracking Error", def: "Deviation of a fund's return from its benchmark. For index funds, this should be as low as possible." },
    { term: "Trade Balance", def: "Difference between a country's exports and imports. A deficit means more imports than exports." },
    { term: "Trailing P/E", def: "P/E ratio based on actual earnings from the past 12 months (as opposed to forward P/E)." },
    { term: "Trailing Stop", def: "Dynamic stop-loss that moves up with rising prices but stays fixed when prices fall." },
    // U
    { term: "Underwriter", def: "Investment bank that manages an IPO, guaranteeing the placement of new shares." },
    { term: "Unsystematic Risk", def: "Company-specific risk that can be reduced through diversification (e.g. management failures, product issues)." },
    // V
    { term: "Value at Risk", def: "Statistical measure of the maximum loss expected within a given time period at a certain confidence level." },
    { term: "Value Investing", def: "Style seeking undervalued stocks, betting on convergence to intrinsic value. Pioneered by Benjamin Graham and Warren Buffett." },
    { term: "Vega", def: "Options metric: Sensitivity of option price to changes in implied volatility." },
    { term: "Volatility", def: "Measure of price fluctuation. High volatility means both higher risk and higher opportunity." },
    // W
    { term: "WACC", def: "Weighted Average Cost of Capital. Blended cost of debt and equity financing for a company." },
    { term: "Warrant", def: "Similar to an option but issued by the company itself. Usually has a longer lifespan." },
    { term: "Working Capital", def: "Current assets minus current liabilities. Indicates short-term financial health." },
    // Y
    { term: "Yield Curve", def: "Chart showing interest rates of bonds across different maturities. An inverted curve is often a recession warning." },
    // #
    { term: "12b-1 Fee", def: "Marketing and distribution fee charged by some US mutual funds, paid from fund assets." },
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
            <p className="text-sm text-muted-foreground">{lang === "de" ? `${glossary.length} Begriffe von A bis Z` : `${glossary.length} terms from A to Z`}</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={lang === "de" ? "Begriffe suchen..." : "Search terms..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex gap-1 mb-6 scroll-x-touch pb-1">
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
      <Footer />
    </div>
  );
}
