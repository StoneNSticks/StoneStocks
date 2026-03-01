import { Header } from "@/components/Header";
import { BookOpen, TrendingUp, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Lightbulb, Target, Layers, CandlestickChart } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <motion.div variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-display font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">{children}</div>
    </motion.div>
  );
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
      <p className="font-medium text-foreground mb-1 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-primary" />
        {title}
      </p>
      <p className="text-muted-foreground text-sm">{children}</p>
    </div>
  );
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8 md:py-12 space-y-12">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />
            Finanzwissen
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Alles über Finanzen & Investieren
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vom Anfänger zum informierten Investor – hier findest du alles Wichtige über Finanzmärkte, Aktien, ETFs und Finanzprodukte.
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-6">
          <h2 className="font-display font-semibold text-foreground mb-3">Inhaltsverzeichnis</h2>
          <nav className="grid sm:grid-cols-3 gap-2">
            {[
              { label: "1. Grundlagen", href: "#grundlagen" },
              { label: "2. Aktien & ETFs", href: "#aktien-etfs" },
              { label: "3. Finanzprodukte", href: "#finanzprodukte" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                {item.label}
              </a>
            ))}
          </nav>
        </motion.div>

        {/* Section 1: Grundlagen */}
        <motion.section id="grundlagen" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <motion.div variants={fadeIn} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">1</div>
            <h2 className="text-2xl font-display font-bold text-foreground">Grundlagen der Finanzen</h2>
          </motion.div>

          <SectionCard icon={<Landmark className="h-5 w-5" />} title="Was sind Finanzmärkte?">
            <p>
              Finanzmärkte sind Orte, an denen Käufer und Verkäufer Finanzinstrumente wie Aktien, Anleihen, Währungen und Rohstoffe handeln. Sie ermöglichen Unternehmen, Kapital aufzunehmen, und Investoren, ihr Vermögen zu vermehren.
            </p>
            <p>
              Die wichtigsten Finanzmärkte sind <strong>Aktienmärkte</strong> (z. B. NYSE, NASDAQ, XETRA), <strong>Anleihemärkte</strong>, <strong>Devisenmärkte</strong> (Forex) und <strong>Rohstoffmärkte</strong>.
            </p>
            <InfoBox title="Gut zu wissen">
              Die weltweiten Aktienmärkte haben zusammen eine Marktkapitalisierung von über 100 Billionen US-Dollar.
            </InfoBox>
          </SectionCard>

          <SectionCard icon={<DollarSign className="h-5 w-5" />} title="Grundbegriffe">
            <div className="grid gap-3">
              {[
                { term: "Marktkapitalisierung", desc: "Der Gesamtwert aller ausgegebenen Aktien eines Unternehmens (Aktienkurs × Anzahl Aktien)." },
                { term: "Dividende", desc: "Eine regelmäßige Gewinnausschüttung eines Unternehmens an seine Aktionäre." },
                { term: "KGV (Kurs-Gewinn-Verhältnis)", desc: "Zeigt, wie viel Investoren bereit sind, pro Euro Gewinn zu zahlen. Ein niedrigeres KGV kann auf eine günstigere Bewertung hindeuten." },
                { term: "Volatilität", desc: "Maß für die Schwankungsbreite eines Kurses. Hohe Volatilität = höheres Risiko, aber auch höhere Chancen." },
                { term: "Liquidität", desc: "Wie leicht ein Wertpapier gekauft oder verkauft werden kann, ohne den Preis stark zu beeinflussen." },
                { term: "Bull Market / Bear Market", desc: "Bull Market = steigende Kurse, Bear Market = fallende Kurse über einen längeren Zeitraum." },
              ].map((item) => (
                <div key={item.term} className="rounded-lg bg-muted/50 p-3">
                  <p className="font-medium text-foreground text-sm">{item.term}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={<Shield className="h-5 w-5" />} title="Risiko & Diversifikation">
            <p>
              <strong>Risiko</strong> beschreibt die Möglichkeit, dass eine Investition an Wert verliert. Verschiedene Anlagen haben unterschiedliche Risikoprofile.
            </p>
            <p>
              <strong>Diversifikation</strong> ist die wichtigste Strategie zur Risikominimierung: Verteile dein Geld auf verschiedene Anlageklassen, Branchen und Regionen. So können Verluste in einem Bereich durch Gewinne in einem anderen ausgeglichen werden.
            </p>
            <InfoBox title="Goldene Regel">
              "Lege nie alle Eier in einen Korb." – Eine breite Streuung reduziert das Gesamtrisiko deines Portfolios erheblich.
            </InfoBox>
          </SectionCard>
        </motion.section>

        {/* Section 2: Aktien & ETFs */}
        <motion.section id="aktien-etfs" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <motion.div variants={fadeIn} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">2</div>
            <h2 className="text-2xl font-display font-bold text-foreground">Aktien & ETFs</h2>
          </motion.div>

          <SectionCard icon={<TrendingUp className="h-5 w-5" />} title="Was sind Aktien?">
            <p>
              Eine <strong>Aktie</strong> ist ein Anteil an einem Unternehmen. Wenn du eine Aktie kaufst, wirst du Miteigentümer und profitierst von Kursgewinnen und Dividenden.
            </p>
            <p>
              Aktien werden an Börsen gehandelt. Der Preis wird durch Angebot und Nachfrage bestimmt und spiegelt die Erwartungen der Investoren an die zukünftige Entwicklung des Unternehmens wider.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm flex items-center gap-1.5">
                  <span className="text-chart-2">▲</span> Vorteile
                </p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>Hohe potenzielle Renditen</li>
                  <li>Dividendeneinkommen</li>
                  <li>Mitspracherecht (Stimmrecht)</li>
                  <li>Inflationsschutz</li>
                </ul>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm flex items-center gap-1.5">
                  <span className="text-destructive">▼</span> Risiken
                </p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>Kursverluste möglich</li>
                  <li>Keine garantierte Rendite</li>
                  <li>Hohe Volatilität</li>
                  <li>Totalverlust bei Insolvenz</li>
                </ul>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<PieChart className="h-5 w-5" />} title="Was sind ETFs?">
            <p>
              Ein <strong>ETF (Exchange Traded Fund)</strong> ist ein börsengehandelter Fonds, der einen Index wie den S&P 500 oder den DAX nachbildet. Du investierst mit einem einzigen Kauf in hunderte oder tausende Unternehmen gleichzeitig.
            </p>
            <p>
              ETFs kombinieren die Diversifikation eines Fonds mit der einfachen Handelbarkeit einer Aktie. Sie haben in der Regel niedrige Gebühren und eignen sich hervorragend für langfristiges Investieren.
            </p>
            <InfoBox title="Beliebte ETFs">
              MSCI World ETF (weltweite Streuung), S&P 500 ETF (Top-500 US-Unternehmen), MSCI Emerging Markets (Schwellenländer).
            </InfoBox>
          </SectionCard>

          <SectionCard icon={<CandlestickChart className="h-5 w-5" />} title="Aktien analysieren">
            <p>Es gibt zwei Hauptansätze zur Aktienanalyse:</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm">📊 Fundamentalanalyse</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Bewertet den inneren Wert eines Unternehmens anhand von Kennzahlen wie KGV, Umsatz, Gewinn, Verschuldung und Wachstum.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm">📈 Technische Analyse</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Analysiert Kurscharts und Muster, um zukünftige Preisbewegungen vorherzusagen. Nutzt Indikatoren wie gleitende Durchschnitte und RSI.
                </p>
              </div>
            </div>
          </SectionCard>
        </motion.section>

        {/* Section 3: Finanzprodukte */}
        <motion.section id="finanzprodukte" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <motion.div variants={fadeIn} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">3</div>
            <h2 className="text-2xl font-display font-bold text-foreground">Finanzprodukte</h2>
          </motion.div>

          <SectionCard icon={<Layers className="h-5 w-5" />} title="Anleihen (Bonds)">
            <p>
              <strong>Anleihen</strong> sind Schuldverschreibungen – du leihst einem Unternehmen oder Staat Geld und bekommst dafür regelmäßige Zinszahlungen. Am Ende der Laufzeit erhältst du dein Kapital zurück.
            </p>
            <p>
              Anleihen gelten als sicherer als Aktien, bieten aber in der Regel niedrigere Renditen. Sie eignen sich gut zur Stabilisierung eines Portfolios.
            </p>
          </SectionCard>

          <SectionCard icon={<BarChart3 className="h-5 w-5" />} title="Fonds & Investmentfonds">
            <p>
              <strong>Investmentfonds</strong> sammeln Geld von vielen Anlegern und investieren es breit gestreut. Im Gegensatz zu ETFs werden sie aktiv von Fondsmanagern verwaltet, was zu höheren Gebühren führt.
            </p>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-medium text-foreground text-sm">ETF vs. aktiver Fonds</p>
              <p className="text-xs text-muted-foreground mt-1">
                Studien zeigen, dass die meisten aktiven Fonds langfristig ihren Vergleichsindex nicht schlagen. ETFs sind daher für die meisten Privatanleger die bessere Wahl.
              </p>
            </div>
          </SectionCard>

          <SectionCard icon={<Target className="h-5 w-5" />} title="Derivate (Optionen, Futures, etc.)">
            <p>
              <strong>Derivate</strong> sind Finanzinstrumente, deren Wert von einem Basiswert (z. B. Aktie, Index, Rohstoff) abgeleitet wird. Dazu gehören Optionen, Futures, Zertifikate und CFDs.
            </p>
            <InfoBox title="⚠️ Warnung">
              Derivate sind komplexe Finanzprodukte mit hohem Risiko. Sie eignen sich nicht für Anfänger und können zu Verlusten führen, die über das eingesetzte Kapital hinausgehen.
            </InfoBox>
          </SectionCard>

          <SectionCard icon={<DollarSign className="h-5 w-5" />} title="Kryptowährungen">
            <p>
              <strong>Kryptowährungen</strong> wie Bitcoin und Ethereum sind digitale Währungen, die auf Blockchain-Technologie basieren. Sie sind hochvolatil und gelten als spekulative Anlage.
            </p>
            <p>
              Als Beimischung in einem diversifizierten Portfolio können sie interessant sein, sollten aber nur einen kleinen Anteil ausmachen.
            </p>
          </SectionCard>
        </motion.section>

        {/* Footer note */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center text-xs text-muted-foreground pb-8 border-t border-border/40 pt-8">
          <p>
            ⚠️ Diese Informationen dienen ausschließlich zu Bildungszwecken und stellen keine Anlageberatung dar.
            Investieren birgt Risiken – informiere dich gründlich und ziehe bei Bedarf einen Finanzberater hinzu.
          </p>
        </motion.div>
      </main>
    </div>
  );
}