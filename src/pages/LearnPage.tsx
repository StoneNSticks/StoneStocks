import { Header } from "@/components/Header";
import { BookOpen, TrendingUp, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Lightbulb, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/contexts/LanguageContext";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

interface SectionCardProps { icon: React.ReactNode; title: string; children: React.ReactNode; }
function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <motion.div variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h3 className="text-xl font-display font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">{children}</div>
    </motion.div>
  );
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
      <p className="font-medium text-foreground mb-1 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" />{title}</p>
      <p className="text-muted-foreground text-sm">{children}</p>
    </div>
  );
}

export default function LearnPage() {
  const t = useT();

  const terms = [
    { term: t("learn.term.marketCap"), desc: t("learn.term.marketCapDesc") },
    { term: t("learn.term.dividend"), desc: t("learn.term.dividendDesc") },
    { term: t("learn.term.pe"), desc: t("learn.term.peDesc") },
    { term: t("learn.term.volatility"), desc: t("learn.term.volatilityDesc") },
    { term: t("learn.term.liquidity"), desc: t("learn.term.liquidityDesc") },
    { term: t("learn.term.bullBear"), desc: t("learn.term.bullBearDesc") },
    { term: t("learn.term.roe"), desc: t("learn.term.roeDesc") },
    { term: t("learn.term.freeCashFlow"), desc: t("learn.term.freeCashFlowDesc") },
  ];

  const toc = [
    { label: t("learn.toc1"), href: "#grundlagen" },
    { label: t("learn.toc2"), href: "#aktien-etfs" },
    { label: t("learn.toc3"), href: "#finanzprodukte" },
    { label: t("learn.toc4"), href: "#strategien" },
    { label: t("learn.toc5"), href: "#steuern" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8 md:py-12 space-y-12 px-3 sm:px-4 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />{t("learn.badge")}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t("learn.title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("learn.subtitle")}</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-6">
          <h2 className="font-display font-semibold text-foreground mb-3">{t("learn.toc")}</h2>
          <nav className="grid sm:grid-cols-3 gap-2">
            {toc.map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                <ArrowRight className="h-3.5 w-3.5" />{item.label}
              </a>
            ))}
          </nav>
        </motion.div>

        {/* Section 1 */}
        <motion.section id="grundlagen" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <motion.div variants={fadeIn} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">1</div>
            <h2 className="text-2xl font-display font-bold text-foreground">{t("learn.section1Title")}</h2>
          </motion.div>
          <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.marketsTitle")}>
            <p>{t("learn.marketsP1")}</p>
            <p dangerouslySetInnerHTML={{ __html: t("learn.marketsP2") }} />
            <InfoBox title={t("learn.goodToKnow")}>{t("learn.marketsInfo")}</InfoBox>
          </SectionCard>
          <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.basicsTitle")}>
            <div className="grid gap-3">
              {terms.map((item) => (
                <div key={item.term} className="rounded-lg bg-muted/50 p-3">
                  <p className="font-medium text-foreground text-sm">{item.term}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.riskTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.riskP1") }} />
            <p dangerouslySetInnerHTML={{ __html: t("learn.riskP2") }} />
            <InfoBox title={t("learn.goldenRule")}>{t("learn.riskInfo")}</InfoBox>
          </SectionCard>
        </motion.section>

        {/* Section 2 */}
        <motion.section id="aktien-etfs" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <motion.div variants={fadeIn} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">2</div>
            <h2 className="text-2xl font-display font-bold text-foreground">{t("learn.section2Title")}</h2>
          </motion.div>
          <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.stocksTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.stocksP1") }} />
            <p>{t("learn.stocksP2")}</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm flex items-center gap-1.5"><span className="text-chart-2">▲</span> {t("learn.stocksPros")}</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>{t("learn.stocksPro1")}</li><li>{t("learn.stocksPro2")}</li><li>{t("learn.stocksPro3")}</li><li>{t("learn.stocksPro4")}</li>
                </ul>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm flex items-center gap-1.5"><span className="text-destructive">▼</span> {t("learn.stocksCons")}</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>{t("learn.stocksCon1")}</li><li>{t("learn.stocksCon2")}</li><li>{t("learn.stocksCon3")}</li><li>{t("learn.stocksCon4")}</li>
                </ul>
              </div>
            </div>
          </SectionCard>
          <SectionCard icon={<PieChart className="h-5 w-5" />} title={t("learn.etfTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.etfP1") }} />
            <p>{t("learn.etfP2")}</p>
            <InfoBox title={t("learn.popularEtfs")}>{t("learn.etfInfo")}</InfoBox>
          </SectionCard>
          <SectionCard icon={<CandlestickChart className="h-5 w-5" />} title={t("learn.analysisTitle")}>
            <p>{t("learn.analysisIntro")}</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm">{t("learn.fundamentalTitle")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("learn.fundamentalDesc")}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm">{t("learn.technicalTitle")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("learn.technicalDesc")}</p>
              </div>
            </div>
          </SectionCard>
        </motion.section>

        {/* Section 3 */}
        <motion.section id="finanzprodukte" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <motion.div variants={fadeIn} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">3</div>
            <h2 className="text-2xl font-display font-bold text-foreground">{t("learn.section3Title")}</h2>
          </motion.div>
          <SectionCard icon={<Layers className="h-5 w-5" />} title={t("learn.bondsTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.bondsP1") }} />
            <p>{t("learn.bondsP2")}</p>
          </SectionCard>
          <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.fundsTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.fundsP1") }} />
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-medium text-foreground text-sm">{t("learn.fundsComparison")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("learn.fundsComparisonDesc")}</p>
            </div>
          </SectionCard>
          <SectionCard icon={<Target className="h-5 w-5" />} title={t("learn.derivativesTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.derivativesP1") }} />
            <InfoBox title={t("learn.warning")}>{t("learn.derivativesWarning")}</InfoBox>
          </SectionCard>
          <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.cryptoTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.cryptoP1") }} />
            <p>{t("learn.cryptoP2")}</p>
          </SectionCard>
        </motion.section>

        {/* Section 4: Strategies */}
        <motion.section id="strategien" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <motion.div variants={fadeIn} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">4</div>
            <h2 className="text-2xl font-display font-bold text-foreground">{t("learn.section4Title")}</h2>
          </motion.div>
          <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.buyHoldTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.buyHoldP1") }} />
            <div className="rounded-lg bg-muted/50 p-3 italic">
              <p className="text-sm text-foreground">{t("learn.buyHoldP2")}</p>
            </div>
            <InfoBox title={t("learn.goodToKnow")}>{t("learn.buyHoldInfo")}</InfoBox>
          </SectionCard>
          <SectionCard icon={<Calculator className="h-5 w-5" />} title={t("learn.dcaTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.dcaP1") }} />
            <p>{t("learn.dcaP2")}</p>
            <InfoBox title={t("learn.tipTitle")}>{t("learn.dcaInfo")}</InfoBox>
          </SectionCard>
          <SectionCard icon={<Target className="h-5 w-5" />} title={t("learn.valueTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.valueP1") }} />
            <p>{t("learn.valueP2")}</p>
          </SectionCard>
          <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.growthTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.growthP1") }} />
            <p>{t("learn.growthP2")}</p>
          </SectionCard>
          <SectionCard icon={<Brain className="h-5 w-5" />} title={t("learn.psychTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.psychP1") }} />
            <div className="rounded-lg bg-muted/50 p-3 italic">
              <p className="text-sm text-foreground">{t("learn.psychP2")}</p>
            </div>
            <InfoBox title={t("learn.goodToKnow")}>{t("learn.psychInfo")}</InfoBox>
          </SectionCard>
        </motion.section>

        {/* Section 5: Taxes & Costs */}
        <motion.section id="steuern" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <motion.div variants={fadeIn} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">5</div>
            <h2 className="text-2xl font-display font-bold text-foreground">{t("learn.section5Title")}</h2>
          </motion.div>
          <SectionCard icon={<Wallet className="h-5 w-5" />} title={t("learn.taxTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.taxP1") }} />
            <p dangerouslySetInnerHTML={{ __html: t("learn.taxP2") }} />
            <InfoBox title={t("learn.tipTitle")}>{t("learn.taxInfo")}</InfoBox>
          </SectionCard>
          <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.costsTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.costsP1") }} />
            <p>{t("learn.costsP2")}</p>
            <InfoBox title={t("learn.goodToKnow")}>{t("learn.costsInfo")}</InfoBox>
          </SectionCard>
          <SectionCard icon={<GraduationCap className="h-5 w-5" />} title={t("learn.compoundTitle")}>
            <p>{t("learn.compoundP1")}</p>
            <p>{t("learn.compoundP2")}</p>
            <InfoBox title={t("learn.tipTitle")}>{t("learn.compoundInfo")}</InfoBox>
          </SectionCard>
          <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.brokerTitle")}>
            <p>{t("learn.brokerP1")}</p>
            <p>{t("learn.brokerP2")}</p>
          </SectionCard>
        </motion.section>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center text-xs text-muted-foreground pb-8 border-t border-border/40 pt-8">
          <p>{t("learn.disclaimer")}</p>
        </motion.div>
      </main>
    </div>
  );
}
