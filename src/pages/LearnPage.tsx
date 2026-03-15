import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon, ChevronDown, ChevronRight, CheckCircle, Rocket, Search, FlaskConical, Leaf, Gavel, CircleDollarSign, History, PiggyBank, Binary, BanknoteIcon, ArrowUp, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/contexts/LanguageContext";
import { SectionCard, InfoBox, WarningBox, TermCard, ProConGrid, SectionHeader, FormulaBox, StepList, fadeIn, stagger } from "@/components/learn/LearnComponents";

import { ReadingProgress } from "@/components/learn/ReadingProgress";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";

// Progress tracker using localStorage
function useReadProgress() {
  const [read, setRead] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("learn_read") || "[]"); } catch { return []; }
  });
  const markRead = (id: string) => {
    setRead(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("learn_read", JSON.stringify(next));
      return next;
    });
  };
  return { read, markRead };
}

// Simple section divider (no collapse)
function SuperSection({ id, title, level, children }: { id: string; title: string; level: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <div className="space-y-10" id={id}>
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{level}</span>
      </div>
      <div className="space-y-12">{children}</div>
    </div>
  );
}

function CalcLink({ to, label }: { to: string; label: string }) {
  const t = useT();
  return (
    <motion.div variants={fadeIn} className="rounded-lg border border-primary/20 bg-primary/[0.03] p-3 flex items-center gap-3">
      <Calculator className="h-4 w-4 text-primary shrink-0" />
      <span className="text-sm text-muted-foreground">{t("learn.relatedCalc")}: <strong>{label}</strong></span>
      <a href={to} className="ml-auto text-xs text-primary font-medium hover:underline">{t("learn.tryCalculator")}</a>
    </motion.div>
  );
}

export default function LearnPage() {
  const t = useT();
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Börse lernen" : "Learn Investing",
    lang === "de" ? "Umfassender Leitfaden für Einsteiger und Fortgeschrittene" : "Comprehensive guide for beginners and advanced investors"
  );
  const { read, markRead } = useReadProgress();



  // Track which sections are in view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.target.id) markRead(e.target.id);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll("section[id]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);


  const terms = [
    { term: t("learn.term.marketCap"), desc: t("learn.term.marketCapDesc") },
    { term: t("learn.term.dividend"), desc: t("learn.term.dividendDesc") },
    { term: t("learn.term.pe"), desc: t("learn.term.peDesc") },
    { term: t("learn.term.eps"), desc: t("learn.term.epsDesc") },
    { term: t("learn.term.beta"), desc: t("learn.term.betaDesc") },
    { term: t("learn.term.volatility"), desc: t("learn.term.volatilityDesc") },
    { term: t("learn.term.liquidity"), desc: t("learn.term.liquidityDesc") },
    { term: t("learn.term.bullBear"), desc: t("learn.term.bullBearDesc") },
    { term: t("learn.term.roe"), desc: t("learn.term.roeDesc") },
    { term: t("learn.term.freeCashFlow"), desc: t("learn.term.freeCashFlowDesc") },
    { term: t("learn.term.spread"), desc: t("learn.term.spreadDesc") },
  ];

  // TOC with super-sections
  const tocGroups = [
    { title: `A: ${t("learn.superA")}`, level: t("learn.levelBeginner"), items: [
      { label: t("learn.toc1"), href: "#grundlagen" },
      { label: t("learn.toc2"), href: "#aktien-etfs" },
      { label: t("learn.toc3"), href: "#strategien" },
      { label: t("learn.toc4"), href: "#steuern" },
      { label: t("learn.toc5"), href: "#erstes-investment" },
    ]},
    { title: `B: ${t("learn.superB")}`, level: t("learn.levelIntermediate"), items: [
      { label: t("learn.toc6"), href: "#anleihen-fonds" },
      { label: t("learn.toc7"), href: "#krypto-alternativen" },
      { label: t("learn.toc8"), href: "#portfolio" },
      { label: t("learn.toc9"), href: "#aktienanalyse" },
      { label: t("learn.toc30"), href: "#immobilien" },
    ]},
    { title: `C: ${t("learn.superC")}`, level: t("learn.levelAdvanced"), items: [
      { label: t("learn.toc10"), href: "#technische-analyse" },
      { label: t("learn.toc11"), href: "#derivate" },
      { label: t("learn.toc12"), href: "#formeln" },
    ]},
    { title: `D: ${t("learn.superD")}`, level: t("learn.levelExpert"), items: [
      { label: t("learn.toc13"), href: "#microstructure" },
      { label: t("learn.toc14"), href: "#behavioral" },
      { label: t("learn.toc15"), href: "#macro" },
      { label: t("learn.toc16"), href: "#quantitative" },
    ]},
    { title: `E: ${t("learn.superE")}`, level: t("learn.levelAcademic"), items: [
      { label: t("learn.toc17"), href: "#corporate-finance" },
      { label: t("learn.toc18"), href: "#rechnungswesen" },
      { label: t("learn.toc19"), href: "#international-finance" },
      { label: t("learn.toc20"), href: "#fixed-income-advanced" },
      { label: t("learn.toc21"), href: "#esg" },
      { label: t("learn.toc22"), href: "#regulierung" },
      { label: t("learn.toc31"), href: "#steueroptimierung" },
    ]},
    { title: `F: ${t("learn.superF")}`, level: t("learn.levelMaster"), items: [
      { label: t("learn.toc23"), href: "#bewertungsmethoden" },
      { label: t("learn.toc24"), href: "#alternative-advanced" },
      { label: t("learn.toc25"), href: "#marktgeschichte" },
      { label: t("learn.toc26"), href: "#personal-finance" },
      { label: t("learn.toc27"), href: "#okonometrie" },
      { label: t("learn.toc28"), href: "#geldpolitik" },
      { label: t("learn.toc29"), href: "#fintech" },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />
      <main className="container max-w-4xl py-8 md:py-12 space-y-12 px-3 sm:px-4 lg:px-8">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center space-y-3 relative">
          <a href="/glossary" className="absolute top-0 right-0 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
            <BookOpen className="h-3.5 w-3.5" />
            {lang === "de" ? "Glossar" : "Glossary"}
          </a>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />{t("learn.badge")}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t("learn.title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("learn.subtitle")}</p>
          <div className="flex justify-center gap-2 flex-wrap pt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{t("learn.levelBeginner")}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">{t("learn.levelIntermediate")}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">{t("learn.levelAdvanced")}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">{t("learn.levelExpert")}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">{t("learn.levelAcademic")}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-foreground/10 text-foreground">{t("learn.levelMaster")}</span>
          </div>
        </motion.div>


        {/* Professional TOC */}
        <motion.nav initial="hidden" animate="visible" variants={fadeIn} className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/40 bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground tracking-wide uppercase">{t("learn.toc")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/30">
            {tocGroups.map((group, gi) => {
              const globalOffset = tocGroups.slice(0, gi).reduce((a, g) => a + g.items.length, 0);
              return (
                <div key={group.title} className="px-5 py-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-foreground tracking-wide">{group.title}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{group.level}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {group.items.map((item, ii) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-mono text-[10px] w-5 text-center text-muted-foreground/50 group-hover:text-primary transition-colors">
                            {String(globalOffset + ii + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.nav>

        {/* ═══════════════════════════════════════════════
            OBERSEKTION A: EINSTIEG (Beginner)
            ═══════════════════════════════════════════════ */}
        <SuperSection id="super-a" title={`A: ${t("learn.superA")}`} level={t("learn.levelBeginner")} defaultOpen={true}>
          {/* Section 1: Basics */}
          <motion.section id="grundlagen" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={1} title={t("learn.section1Title")} level={t("learn.levelBeginner")} />
            <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.marketsTitle")}>
              <p>{t("learn.marketsP1")}</p>
              <p dangerouslySetInnerHTML={{ __html: t("learn.marketsP2") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.marketsP3") }} />
              <InfoBox title={t("learn.goodToKnow")}>{t("learn.marketsInfo")}</InfoBox>
            </SectionCard>
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.basicsTitle")}>
              <div className="grid gap-3">{terms.map((item) => <TermCard key={item.term} term={item.term} desc={item.desc} />)}</div>
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.riskTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.riskP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.riskP2") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.riskP3") }} />
              <InfoBox title={t("learn.goldenRule")}>{t("learn.riskInfo")}</InfoBox>
            </SectionCard>
            <SectionCard icon={<FileText className="h-5 w-5" />} title={t("learn.orderTypesTitle")}>
              <p>{t("learn.orderTypesP1")}</p>
              <div className="grid gap-3 mt-2">
                <TermCard term={t("learn.orderMarket")} desc={t("learn.orderMarketDesc")} />
                <TermCard term={t("learn.orderLimit")} desc={t("learn.orderLimitDesc")} />
                <TermCard term={t("learn.orderStopLoss")} desc={t("learn.orderStopLossDesc")} />
                <TermCard term={t("learn.orderTrailingStop")} desc={t("learn.orderTrailingStopDesc")} />
              </div>
            </SectionCard>
            
          </motion.section>

          {/* Section 2: Stocks & ETFs */}
          <motion.section id="aktien-etfs" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={2} title={t("learn.section2Title")} level={t("learn.levelBeginner")} />
            <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.stocksTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.stocksP1") }} />
              <p>{t("learn.stocksP2")}</p>
              <ProConGrid prosTitle={t("learn.stocksPros")} consTitle={t("learn.stocksCons")} pros={[t("learn.stocksPro1"), t("learn.stocksPro2"), t("learn.stocksPro3"), t("learn.stocksPro4")]} cons={[t("learn.stocksCon1"), t("learn.stocksCon2"), t("learn.stocksCon3"), t("learn.stocksCon4")]} />
            </SectionCard>
            <SectionCard icon={<Briefcase className="h-5 w-5" />} title={t("learn.stockTypesTitle")}>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.blueChip")} desc={t("learn.blueChipDesc")} />
                <TermCard term={t("learn.growthStocks")} desc={t("learn.growthStocksDesc")} />
                <TermCard term={t("learn.dividendStocks")} desc={t("learn.dividendStocksDesc")} />
                <TermCard term={t("learn.pennyStocks")} desc={t("learn.pennyStocksDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<PieChart className="h-5 w-5" />} title={t("learn.etfTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.etfP1") }} />
              <p>{t("learn.etfP2")}</p>
              <p className="font-medium text-foreground text-sm mt-2">{t("learn.etfTypes")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.etfIndex")} desc={t("learn.etfIndexDesc")} />
                <TermCard term={t("learn.etfSector")} desc={t("learn.etfSectorDesc")} />
                <TermCard term={t("learn.etfBond")} desc={t("learn.etfBondDesc")} />
                <TermCard term={t("learn.etfThematic")} desc={t("learn.etfThematicDesc")} />
              </div>
              <InfoBox title={t("learn.popularEtfs")}>{t("learn.etfInfo")}</InfoBox>
            </SectionCard>
            <SectionCard icon={<CandlestickChart className="h-5 w-5" />} title={t("learn.analysisTitle")}>
              <p>{t("learn.analysisIntro")}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                <TermCard term={t("learn.fundamentalTitle")} desc={t("learn.fundamentalDesc")} />
                <TermCard term={t("learn.technicalTitle")} desc={t("learn.technicalDesc")} />
              </div>
            </SectionCard>
            
          </motion.section>

          {/* Section 3: Strategies (was 6, now Beginner) */}
          <motion.section id="strategien" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={3} title={t("learn.section3Title")} level={t("learn.levelBeginner")} />
            <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.buyHoldTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.buyHoldP1") }} />
              <div className="rounded-lg bg-muted/50 p-3 italic"><p className="text-sm text-foreground">{t("learn.buyHoldP2")}</p></div>
              <InfoBox title={t("learn.goodToKnow")}>{t("learn.buyHoldInfo")}</InfoBox>
            </SectionCard>
            <SectionCard icon={<Calculator className="h-5 w-5" />} title={t("learn.dcaTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.dcaP1") }} />
              <p>{t("learn.dcaP2")}</p>
              <InfoBox title={t("learn.tipTitle")}>{t("learn.dcaInfo")}</InfoBox>
            </SectionCard>
            <CalcLink to="/calculator" label="DCA Simulator" />
            <SectionCard icon={<Target className="h-5 w-5" />} title={t("learn.valueTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.valueP1") }} />
              <p>{t("learn.valueP2")}</p>
            </SectionCard>
            <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.growthTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.growthP1") }} />
              <p>{t("learn.growthP2")}</p>
            </SectionCard>
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.dividendStratTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.dividendStratP1") }} />
              <p>{t("learn.dividendStratP2")}</p>
            </SectionCard>
            <CalcLink to="/calculator" label={lang === "de" ? "Dividenden-Projektion" : "Div. Projector"} />
            <SectionCard icon={<Repeat className="h-5 w-5" />} title={t("learn.momentumTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.momentumP1") }} />
            </SectionCard>
            <SectionCard icon={<TrendingDown className="h-5 w-5" />} title={t("learn.contrarianTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.contrarianP1") }} />
            </SectionCard>
            <SectionCard icon={<Repeat className="h-5 w-5" />} title={t("learn.sectorRotationTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.sectorRotationP1") }} />
            </SectionCard>
            <SectionCard icon={<PieChart className="h-5 w-5" />} title={t("learn.coreSatelliteTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.coreSatelliteP1") }} />
            </SectionCard>
            <SectionCard icon={<Brain className="h-5 w-5" />} title={t("learn.psychTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.psychP1") }} />
              <div className="rounded-lg bg-muted/50 p-3 italic"><p className="text-sm text-foreground">{t("learn.psychP2")}</p></div>
              <p className="font-medium text-foreground text-sm mt-2">{t("learn.psychBiases")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.biasConfirmation")} desc={t("learn.biasConfirmationDesc")} />
                <TermCard term={t("learn.biasLossAversion")} desc={t("learn.biasLossAversionDesc")} />
                <TermCard term={t("learn.biasRecency")} desc={t("learn.biasRecencyDesc")} />
                <TermCard term={t("learn.biasHerd")} desc={t("learn.biasHerdDesc")} />
              </div>
              <InfoBox title={t("learn.goodToKnow")}>{t("learn.psychInfo")}</InfoBox>
            </SectionCard>
            
          </motion.section>

          {/* Section 4: Taxes & Costs (was 9) */}
          <motion.section id="steuern" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={4} title={t("learn.section4Title")} level={t("learn.levelBeginner")} />
            <SectionCard icon={<Wallet className="h-5 w-5" />} title={t("learn.taxTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.taxP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.taxP2") }} />
              <TermCard term={t("learn.taxLossHarvesting")} desc={t("learn.taxLossHarvestingDesc")} />
              <InfoBox title={t("learn.tipTitle")}>{t("learn.taxInfo")}</InfoBox>
            </SectionCard>
            <CalcLink to="/calculator" label="Tax-Loss Harvesting" />
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
            <CalcLink to="/calculator" label={lang === "de" ? "Zinseszins" : "Compound Interest"} />
            
            <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.brokerTitle")}>
              <p>{t("learn.brokerP1")}</p>
              <p>{t("learn.brokerP2")}</p>
              <p className="font-medium text-foreground text-sm mt-2">{t("learn.brokerTypes")}</p>
              <div className="grid gap-3">
                <TermCard term={t("learn.neobroker")} desc={t("learn.neobrokerDesc")} />
                <TermCard term={t("learn.onlinebroker")} desc={t("learn.onlinebrokerDesc")} />
                <TermCard term={t("learn.probroker")} desc={t("learn.probrokerDesc")} />
              </div>
            </SectionCard>
          </motion.section>

          {/* Section 5: Your First Investment (NEW) */}
          <motion.section id="erstes-investment" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={5} title={t("learn.section5Title")} level={t("learn.levelBeginner")} />
            <SectionCard icon={<Rocket className="h-5 w-5" />} title={t("learn.firstStepsTitle")}>
              <StepList steps={[t("learn.firstStep1"), t("learn.firstStep2"), t("learn.firstStep3"), t("learn.firstStep4"), t("learn.firstStep5")]} />
            </SectionCard>
            <SectionCard icon={<AlertTriangle className="h-5 w-5" />} title={t("learn.firstMistakesTitle")}>
              <StepList steps={[t("learn.firstMistake1"), t("learn.firstMistake2"), t("learn.firstMistake3"), t("learn.firstMistake4"), t("learn.firstMistake5")]} />
            </SectionCard>
            <SectionCard icon={<PieChart className="h-5 w-5" />} title={t("learn.firstPortfolioTitle")}>
              <div className="grid gap-3">
                <TermCard term={t("learn.starterSimple")} desc={t("learn.starterSimpleDesc")} />
                <TermCard term={t("learn.starterBalanced")} desc={t("learn.starterBalancedDesc")} />
                <TermCard term={t("learn.starterConservative")} desc={t("learn.starterConservativeDesc")} />
              </div>
            </SectionCard>
            <CalcLink to="/calculator" label={lang === "de" ? "Portfolio-Wachstum" : "Portfolio Growth"} />
          </motion.section>
        </SuperSection>

        {/* ═══════════════════════════════════════════════
            OBERSEKTION B: AUFBAU (Intermediate)
            ═══════════════════════════════════════════════ */}
        <SuperSection id="super-b" title={`B: ${t("learn.superB")}`} level={t("learn.levelIntermediate")} defaultOpen={false}>
          {/* Section 6: Bonds & Funds */}
          <motion.section id="anleihen-fonds" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={6} title={t("learn.section6Title")} level={t("learn.levelIntermediate")} />
            <SectionCard icon={<Layers className="h-5 w-5" />} title={t("learn.bondsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.bondsP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.bondsP2") }} />
              <p className="font-medium text-foreground text-sm mt-2">{t("learn.bondsTypes")}</p>
              <div className="grid gap-3">
                <TermCard term={t("learn.govBonds")} desc={t("learn.govBondsDesc")} />
                <TermCard term={t("learn.corpBonds")} desc={t("learn.corpBondsDesc")} />
                <TermCard term={t("learn.highYield")} desc={t("learn.highYieldDesc")} />
              </div>
              <InfoBox title={t("learn.goodToKnow")}>{t("learn.bondsInfo")}</InfoBox>
            </SectionCard>
            <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.fundsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.fundsP1") }} />
              <TermCard term={t("learn.fundsComparison")} desc={t("learn.fundsComparisonDesc")} />
            </SectionCard>
            <SectionCard icon={<Building className="h-5 w-5" />} title={t("learn.reitsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.reitsP1") }} />
              <p>{t("learn.reitsP2")}</p>
            </SectionCard>
          </motion.section>

          {/* Section 7: Crypto & Alternatives */}
          <motion.section id="krypto-alternativen" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={7} title={t("learn.section7Title")} level={t("learn.levelIntermediate")} />
            <SectionCard icon={<Coins className="h-5 w-5" />} title={t("learn.cryptoTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.cryptoP1") }} />
              <p>{t("learn.cryptoP2")}</p>
              <p className="font-medium text-foreground text-sm mt-2">{t("learn.cryptoTypes")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.cryptoBtc")} desc={t("learn.cryptoBtcDesc")} />
                <TermCard term={t("learn.cryptoEth")} desc={t("learn.cryptoEthDesc")} />
                <TermCard term={t("learn.cryptoAlt")} desc={t("learn.cryptoAltDesc")} />
                <TermCard term={t("learn.cryptoStable")} desc={t("learn.cryptoStableDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<Gem className="h-5 w-5" />} title={t("learn.commoditiesTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.commoditiesP1") }} />
              <p>{t("learn.commoditiesP2")}</p>
            </SectionCard>
            <SectionCard icon={<Briefcase className="h-5 w-5" />} title={t("learn.altInvestTitle")}>
              <div className="grid gap-3">
                <TermCard term={t("learn.altP2P")} desc={t("learn.altP2PDesc")} />
                <TermCard term={t("learn.altPE")} desc={t("learn.altPEDesc")} />
                <TermCard term={t("learn.altCollectibles")} desc={t("learn.altCollectiblesDesc")} />
              </div>
            </SectionCard>
          </motion.section>

          {/* Section 8: Portfolio Management (was Advanced, now Intermediate) */}
          <motion.section id="portfolio" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={8} title={t("learn.section8Title")} level={t("learn.levelIntermediate")} />
            <SectionCard icon={<PieChart className="h-5 w-5" />} title={t("learn.assetAllocTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.assetAllocP1") }} />
              <p className="font-medium text-foreground text-sm mt-2">{t("learn.assetAllocModels")}</p>
              <div className="grid gap-3">
                <TermCard term={t("learn.model6040")} desc={t("learn.model6040Desc")} />
                <TermCard term={t("learn.modelAge")} desc={t("learn.modelAgeDesc")} />
                <TermCard term={t("learn.modelAllWeather")} desc={t("learn.modelAllWeatherDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<Repeat className="h-5 w-5" />} title={t("learn.rebalancingTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.rebalancingP1") }} />
              <p>{t("learn.rebalancingP2")}</p>
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.riskMgmtTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.riskMgmtP1") }} />
            </SectionCard>
            <SectionCard icon={<Wallet className="h-5 w-5" />} title={t("learn.emergencyFundTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.emergencyFundP1") }} />
            </SectionCard>
            <SectionCard icon={<FlaskConical className="h-5 w-5" />} title={t("learn.mptPracticalTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.mptPracticalP1") }} />
            </SectionCard>
            <SectionCard icon={<Scale className="h-5 w-5" />} title={t("learn.riskParityTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.riskParityP1") }} />
            </SectionCard>
            
          </motion.section>

          {/* Section 9: Stock Analysis in Practice (NEW) */}
          <motion.section id="aktienanalyse" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={9} title={t("learn.section9Title")} level={t("learn.levelIntermediate")} />
            <SectionCard icon={<FileText className="h-5 w-5" />} title={t("learn.annualReportsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.annualReportsP1") }} />
              <p>{t("learn.annualReportsP2")}</p>
            </SectionCard>
            <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.balanceSheetTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.balanceSheetP1") }} />
            </SectionCard>
            <SectionCard icon={<Eye className="h-5 w-5" />} title={t("learn.evaluateMgmtTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.evaluateMgmtP1") }} />
            </SectionCard>
            <SectionCard icon={<Scale className="h-5 w-5" />} title={t("learn.industryCompareTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.industryCompareP1") }} />
            </SectionCard>
            <CalcLink to="/compare" label={lang === "de" ? "Aktienvergleich" : "Stock Compare"} />
          </motion.section>

          {/* Section 10: Real Estate Investing */}
          <motion.section id="immobilien" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={10} title={t("learn.section30Title")} level={t("learn.levelIntermediate")} />
            <SectionCard icon={<Building className="h-5 w-5" />} title={t("learn.realEstateOverviewTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.realEstateOverviewP1") }} />
            </SectionCard>
            <SectionCard icon={<Layers className="h-5 w-5" />} title={t("learn.directVsIndirectTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.directVsIndirectP1") }} />
            </SectionCard>
            <SectionCard icon={<PieChart className="h-5 w-5" />} title={t("learn.reitsDeepTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.reitsDeepP1") }} />
            </SectionCard>
            <SectionCard icon={<Calculator className="h-5 w-5" />} title={t("learn.realEstateValuationTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.realEstateValuationP1") }} />
            </SectionCard>
          </motion.section>
        </SuperSection>


        {/* ═══════════════════════════════════════════════
            OBERSEKTION C: FORTGESCHRITTEN (Advanced)
            ═══════════════════════════════════════════════ */}
        <SuperSection id="super-c" title={`C: ${t("learn.superC")}`} level={t("learn.levelAdvanced")} defaultOpen={false}>
          {/* Section 10: Technical Analysis */}
          <motion.section id="technische-analyse" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={11} title={t("learn.section10Title")} level={t("learn.levelAdvanced")} />
            <motion.div variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-5 md:p-7">
              <p className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t("learn.taIntro") }} />
            </motion.div>
            <SectionCard icon={<LineChart className="h-5 w-5" />} title={t("learn.chartPatternsTitle")}>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.headShoulders")} desc={t("learn.headShouldersDesc")} />
                <TermCard term={t("learn.doubleTop")} desc={t("learn.doubleTopDesc")} />
                <TermCard term={t("learn.triangles")} desc={t("learn.trianglesDesc")} />
                <TermCard term={t("learn.flagsPennants")} desc={t("learn.flagsPennantsDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<BarChart className="h-5 w-5" />} title={t("learn.indicatorsTitle")}>
              <div className="grid gap-3">
                <TermCard term={t("learn.smaEma")} desc={t("learn.smaEmaDesc")} />
                <TermCard term={t("learn.rsi")} desc={t("learn.rsiDesc")} />
                <TermCard term={t("learn.macd")} desc={t("learn.macdDesc")} />
                <TermCard term={t("learn.bollinger")} desc={t("learn.bollingerDesc")} />
                <TermCard term={t("learn.volume")} desc={t("learn.volumeDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<Scale className="h-5 w-5" />} title={t("learn.supportResistance")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.supportResistanceP1") }} />
            </SectionCard>
            <motion.div variants={fadeIn}><WarningBox title={t("learn.warning")}>{t("learn.taWarning")}</WarningBox></motion.div>
            
          </motion.section>

          {/* Section 11: Derivatives */}
          <motion.section id="derivate" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={12} title={t("learn.section11Title")} level={t("learn.levelAdvanced")} />
            <motion.div variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-5 md:p-7">
              <p className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t("learn.derivativesIntro") }} />
            </motion.div>
            <SectionCard icon={<Target className="h-5 w-5" />} title={t("learn.optionsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.optionsP1") }} />
              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                <TermCard term={t("learn.optionsCall")} desc={t("learn.optionsCallDesc")} />
                <TermCard term={t("learn.optionsPut")} desc={t("learn.optionsPutDesc")} />
              </div>
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-foreground text-sm">{t("learn.optionsGreeks")}</p>
                <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: t("learn.optionsGreeksDesc") }} />
              </div>
            </SectionCard>
            
            {/* American vs European Options */}
            <SectionCard icon={<Globe className="h-5 w-5" />} title={t("learn.optionStylesTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.optionStylesIntro") }} />
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <TermCard term={t("learn.americanOption")} desc={t("learn.americanOptionDesc")} />
                <TermCard term={t("learn.europeanOption")} desc={t("learn.europeanOptionDesc")} />
              </div>
              <div className="mt-4 space-y-3">
                <p className="font-medium text-foreground text-sm">{lang === "de" ? "Detaillierte Beispiele:" : "Detailed Examples:"}</p>
                <TermCard term={t("learn.americanCallTitle")} desc={t("learn.americanCallDesc")} />
                <TermCard term={t("learn.americanPutTitle")} desc={t("learn.americanPutDesc")} />
                <TermCard term={t("learn.europeanCallTitle")} desc={t("learn.europeanCallDesc")} />
                <TermCard term={t("learn.europeanPutTitle")} desc={t("learn.europeanPutDesc")} />
              </div>
              <InfoBox title={t("learn.goodToKnow")}>{t("learn.optionStyleComparison")}</InfoBox>
            </SectionCard>
            
            {/* Options Strategies */}
            <SectionCard icon={<Layers className="h-5 w-5" />} title={lang === "de" ? "Optionsstrategien" : "Option Strategies"}>
              <p className="font-medium text-foreground text-sm">{t("learn.optionsStrategies")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.coveredCall")} desc={t("learn.coveredCallDesc")} />
                <TermCard term={t("learn.protectivePut")} desc={t("learn.protectivePutDesc")} />
                <TermCard term={t("learn.straddle")} desc={t("learn.straddleDesc")} />
                <TermCard term={t("learn.ironCondor")} desc={t("learn.ironCondorDesc")} />
              </div>
            </SectionCard>
            <CalcLink to="/calculator" label={lang === "de" ? "Optionsrechner" : "Options Calc"} />
            <SectionCard icon={<BarChart className="h-5 w-5" />} title={t("learn.futuresTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.futuresP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.futuresP2") }} />
              <WarningBox title={t("learn.warning")}>{t("learn.futuresWarning")}</WarningBox>
            </SectionCard>
            <SectionCard icon={<AlertTriangle className="h-5 w-5" />} title={t("learn.cfdsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.cfdsP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.cfdsP2") }} />
              <WarningBox title={t("learn.warning")}>{t("learn.cfdsWarning")}</WarningBox>
            </SectionCard>
            <SectionCard icon={<FileText className="h-5 w-5" />} title={t("learn.warrantsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.warrantsP1") }} />
              <p>{t("learn.warrantsP2")}</p>
            </SectionCard>
            <SectionCard icon={<Layers className="h-5 w-5" />} title={t("learn.certificatesTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.certificatesP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.certificatesP2") }} />
            </SectionCard>
            <motion.div variants={fadeIn}><InfoBox title={t("learn.goodToKnow")}>{t("learn.derivativesSummary")}</InfoBox></motion.div>
            
          </motion.section>

          {/* Section 12: Formulas */}
          <motion.section id="formeln" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={12} title={t("learn.section12Title")} level={t("learn.levelAdvanced")} />
            <SectionCard icon={<Calculator className="h-5 w-5" />} title={t("learn.dcfTitle")}>
              <p>{t("learn.dcfExplanation").split('.')[0]}.</p>
              <FormulaBox title={t("learn.dcfTitle")} formula={t("learn.dcfFormula")} explanation={t("learn.dcfExplanation")} />
            </SectionCard>
            <SectionCard icon={<LineChart className="h-5 w-5" />} title={t("learn.capmTitle")}>
              <FormulaBox title={t("learn.capmTitle")} formula={t("learn.capmFormula")} explanation={t("learn.capmExplanation")} />
            </SectionCard>
            <SectionCard icon={<BarChart className="h-5 w-5" />} title={t("learn.sharpeTitle")}>
              <FormulaBox title={t("learn.sharpeTitle")} formula={t("learn.sharpeFormula")} explanation={t("learn.sharpeExplanation")} />
            </SectionCard>
            <SectionCard icon={<Target className="h-5 w-5" />} title={t("learn.bsTitle")}>
              <FormulaBox title={t("learn.bsTitle")} formula={t("learn.bsFormula")} explanation={t("learn.bsExplanation")} />
            </SectionCard>
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.gordonTitle")}>
              <FormulaBox title={t("learn.gordonTitle")} formula={t("learn.gordonFormula")} explanation={t("learn.gordonExplanation")} />
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.kellyTitle")}>
              <FormulaBox title={t("learn.kellyTitle")} formula={t("learn.kellyFormula")} explanation={t("learn.kellyExplanation")} />
            </SectionCard>
            <SectionCard icon={<Layers className="h-5 w-5" />} title={t("learn.waccTitle")}>
              <FormulaBox title={t("learn.waccTitle")} formula={t("learn.waccFormula")} explanation={t("learn.waccExplanation")} />
            </SectionCard>
            <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.evFormulaTitle")}>
              <FormulaBox title={t("learn.evFormulaTitle")} formula={t("learn.evFormula")} explanation={t("learn.evExplanation")} />
            </SectionCard>
            <SectionCard icon={<PieChart className="h-5 w-5" />} title={t("learn.mptTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.mptP1") }} />
              <FormulaBox title={t("learn.mptTitle")} formula={t("learn.mptFormula")} explanation={t("learn.mptExplanation")} />
            </SectionCard>
            <SectionCard icon={<CandlestickChart className="h-5 w-5" />} title={t("learn.fibonacciTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.fibonacciP1") }} />
            </SectionCard>
            <SectionCard icon={<Brain className="h-5 w-5" />} title={t("learn.elliottTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.elliottP1") }} />
            </SectionCard>
            <SectionCard icon={<Briefcase className="h-5 w-5" />} title={t("learn.monteCarloTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.monteCarloP1") }} />
            </SectionCard>
          </motion.section>
        </SuperSection>

        {/* ═══════════════════════════════════════════════
            OBERSEKTION D: EXPERTE (Expert)
            ═══════════════════════════════════════════════ */}
        <SuperSection id="super-d" title={`D: ${t("learn.superD")}`} level={t("learn.levelExpert")} defaultOpen={false}>
          {/* Section 13: Market Microstructure */}
          <motion.section id="microstructure" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={13} title={t("learn.section13Title")} level={t("learn.levelExpert")} />
            <SectionCard icon={<Activity className="h-5 w-5" />} title={t("learn.orderBookTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.orderBookP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.orderBookP2") }} />
            </SectionCard>
            <SectionCard icon={<Network className="h-5 w-5" />} title={t("learn.marketMakersTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.marketMakersP1") }} />
            </SectionCard>
            <SectionCard icon={<Zap className="h-5 w-5" />} title={t("learn.hftTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.hftP1") }} />
            </SectionCard>
            <SectionCard icon={<TrendingDown className="h-5 w-5" />} title={t("learn.shortSellingTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.shortSellingP1") }} />
            </SectionCard>
            <SectionCard icon={<Gauge className="h-5 w-5" />} title={t("learn.slippageTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.slippageP1") }} />
            </SectionCard>
            <SectionCard icon={<AlertTriangle className="h-5 w-5" />} title={t("learn.marginTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.marginP1") }} />
              <WarningBox title={t("learn.warning")}>{t("learn.marginWarning")}</WarningBox>
            </SectionCard>
            <CalcLink to="/calculator" label={lang === "de" ? "Margin-Rechner" : "Margin Calculator"} />
          </motion.section>

          {/* Section 14: Behavioral Finance */}
          <motion.section id="behavioral" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={14} title={t("learn.section14Title")} level={t("learn.levelExpert")} />
            <motion.div variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-5 md:p-7">
              <p className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t("learn.behavioralIntro") }} />
            </motion.div>
            <SectionCard icon={<Brain className="h-5 w-5" />} title={t("learn.prospectTheoryTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.prospectTheoryP1") }} />
            </SectionCard>
            <SectionCard icon={<Eye className="h-5 w-5" />} title={t("learn.anomaliesTitle")}>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.anchoring")} desc={t("learn.anchoringDesc")} />
                <TermCard term={t("learn.overconfidence")} desc={t("learn.overconfidenceDesc")} />
                <TermCard term={t("learn.dispositionEffect")} desc={t("learn.dispositionEffectDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.anomaliesTitle")}>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.januaryEffect")} desc={t("learn.januaryEffectDesc")} />
                <TermCard term={t("learn.momentumAnomaly")} desc={t("learn.momentumAnomalyDesc")} />
                <TermCard term={t("learn.valueAnomaly")} desc={t("learn.valueAnomalyDesc")} />
                <TermCard term={t("learn.sizeAnomaly")} desc={t("learn.sizeAnomalyDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<Brain className="h-5 w-5" />} title={t("learn.framingEffectTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.framingEffectP1") }} />
            </SectionCard>
            <SectionCard icon={<Wallet className="h-5 w-5" />} title={t("learn.mentalAccountingTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.mentalAccountingP1") }} />
            </SectionCard>
            <SectionCard icon={<AlertTriangle className="h-5 w-5" />} title={t("learn.sunkCostTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.sunkCostP1") }} />
            </SectionCard>
            <SectionCard icon={<Scale className="h-5 w-5" />} title={t("learn.emhTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.emhP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 15: Global Markets & Macro */}
          <motion.section id="macro" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={15} title={t("learn.section15Title")} level={t("learn.levelExpert")} />
            <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.centralBanksTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.centralBanksP1") }} />
            </SectionCard>
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.inflationTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.inflationP1") }} />
            </SectionCard>
            <CalcLink to="/calculator" label={lang === "de" ? "Inflationsrechner" : "Inflation Calculator"} />
            <SectionCard icon={<LineChart className="h-5 w-5" />} title={t("learn.yieldCurveTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.yieldCurveP1") }} />
            </SectionCard>
            <SectionCard icon={<Repeat className="h-5 w-5" />} title={t("learn.businessCycleTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.businessCycleP1") }} />
            </SectionCard>
            <SectionCard icon={<Globe className="h-5 w-5" />} title={t("learn.geopoliticsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.geopoliticsP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 16: Quantitative Analysis (NEW) */}
          <motion.section id="quantitative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={16} title={t("learn.section16Title")} level={t("learn.levelExpert")} />
            <SectionCard icon={<FlaskConical className="h-5 w-5" />} title={t("learn.factorModelsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.factorModelsP1") }} />
            </SectionCard>
            <SectionCard icon={<LineChart className="h-5 w-5" />} title={t("learn.statArbTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.statArbP1") }} />
            </SectionCard>
            <SectionCard icon={<BarChart className="h-5 w-5" />} title={t("learn.backtestingTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.backtestingP1") }} />
            </SectionCard>
            <SectionCard icon={<Sigma className="h-5 w-5" />} title={t("learn.alphaBetaTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.alphaBetaP1") }} />
            </SectionCard>
          </motion.section>
        </SuperSection>

        {/* ═══════════════════════════════════════════════
            OBERSEKTION E: AKADEMISCH (Academic)
            ═══════════════════════════════════════════════ */}
        <SuperSection id="super-e" title={`E: ${t("learn.superE")}`} level={t("learn.levelAcademic")} defaultOpen={false}>
          {/* Section 17: Corporate Finance */}
          <motion.section id="corporate-finance" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={17} title={t("learn.section17Title")} level={t("learn.levelAcademic")} />
            <SectionCard icon={<Building className="h-5 w-5" />} title={t("learn.capitalStructureTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.capitalStructureP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.capitalStructureP2") }} />
            </SectionCard>
            
            <SectionCard icon={<Briefcase className="h-5 w-5" />} title={t("learn.maTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.maP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.maP2") }} />
            </SectionCard>
            <SectionCard icon={<Rocket className="h-5 w-5" />} title={t("learn.ipoTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.ipoP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t("learn.ipoP2") }} />
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.corpGovTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.corpGovP1") }} />
            </SectionCard>
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.dividendPolicyTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.dividendPolicyP1") }} />
            </SectionCard>
            <SectionCard icon={<Repeat className="h-5 w-5" />} title={t("learn.shareRepurchaseTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.shareRepurchaseP1") }} />
            </SectionCard>
            
          </motion.section>

          {/* Section 18: Accounting & Financial Statements */}
          <motion.section id="rechnungswesen" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={18} title={t("learn.section18Title")} level={t("learn.levelAcademic")} />
            <SectionCard icon={<FileText className="h-5 w-5" />} title={t("learn.threeStatementsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.threeStatementsP1") }} />
            </SectionCard>
            <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.incomeStatementTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.incomeStatementP1") }} />
            </SectionCard>
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.cashFlowStatementTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.cashFlowStatementP1") }} />
            </SectionCard>
            <SectionCard icon={<Calculator className="h-5 w-5" />} title={t("learn.ratioAnalysisTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.ratioAnalysisP1") }} />
            </SectionCard>
            <SectionCard icon={<PieChart className="h-5 w-5" />} title={t("learn.duPontTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.duPontP1") }} />
              <FormulaBox title="DuPont" formula="ROE = Net Margin × Asset Turnover × Equity Multiplier" explanation={t("learn.duPontP1").replace(/<[^>]*>/g, '').slice(0, 120) + '...'} />
            </SectionCard>
            
            <SectionCard icon={<Layers className="h-5 w-5" />} title={t("learn.accrualVsCashTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.accrualVsCashP1") }} />
            </SectionCard>
            <SectionCard icon={<Gem className="h-5 w-5" />} title={t("learn.goodwillTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.goodwillP1") }} />
            </SectionCard>
            
          </motion.section>

          {/* Section 19: International Finance */}
          <motion.section id="international-finance" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={19} title={t("learn.section19Title")} level={t("learn.levelAcademic")} />
            <SectionCard icon={<Globe className="h-5 w-5" />} title={t("learn.forexMarketsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.forexMarketsP1") }} />
            </SectionCard>
            <SectionCard icon={<Scale className="h-5 w-5" />} title={t("learn.pppTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.pppP1") }} />
            </SectionCard>
            <SectionCard icon={<LineChart className="h-5 w-5" />} title={t("learn.irpTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.irpP1") }} />
            </SectionCard>
            <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.carryTradeTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.carryTradeP1") }} />
              <WarningBox title={t("learn.warning")}>{lang === "de" ? "Carry Trades können bei Risk-off Events massive Verluste verursachen." : "Carry trades can cause massive losses during risk-off events."}</WarningBox>
            </SectionCard>
            <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.emergingMarketsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.emergingMarketsP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 20: Fixed Income Advanced */}
          <motion.section id="fixed-income-advanced" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={20} title={t("learn.section20Title")} level={t("learn.levelAcademic")} />
            <SectionCard icon={<BarChart className="h-5 w-5" />} title={t("learn.durationTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.durationP1") }} />
            </SectionCard>
            <SectionCard icon={<LineChart className="h-5 w-5" />} title={t("learn.convexityTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.convexityP1") }} />
              <FormulaBox title="Price Change" formula="ΔP ≈ -Duration × Δy + ½ × Convexity × (Δy)²" explanation={lang === "de" ? "Genauere Preisschätzung durch Berücksichtigung der Konvexität." : "More accurate price estimation by accounting for convexity."} />
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.creditAnalysisTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.creditAnalysisP1") }} />
            </SectionCard>
            <SectionCard icon={<Calculator className="h-5 w-5" />} title={t("learn.bondValuationTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.bondValuationP1") }} />
              <FormulaBox title="Bond Price" formula="P = Σ C/(1+r)^t + FV/(1+r)^n" explanation={lang === "de" ? "C = Kupon, r = Marktzins, FV = Nennwert, n = Restlaufzeit." : "C = coupon, r = market rate, FV = face value, n = remaining term."} />
            </SectionCard>
            
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.yieldMeasuresTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.yieldMeasuresP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 21: ESG */}
          <motion.section id="esg" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={21} title={t("learn.section21Title")} level={t("learn.levelAcademic")} />
            <SectionCard icon={<Leaf className="h-5 w-5" />} title={t("learn.esgOverviewTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.esgOverviewP1") }} />
            </SectionCard>
            <SectionCard icon={<Target className="h-5 w-5" />} title={t("learn.esgStrategiesTitle")}>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.negativeScreening")} desc={t("learn.negativeScreeningDesc")} />
                <TermCard term={t("learn.bestInClass")} desc={t("learn.bestInClassDesc")} />
                <TermCard term={t("learn.impactInvesting")} desc={t("learn.impactInvestingDesc")} />
                <TermCard term={t("learn.thematicESG")} desc={t("learn.thematicESGDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<AlertTriangle className="h-5 w-5" />} title={t("learn.greenwashingTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.greenwashingP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 22: Financial Regulation */}
          <motion.section id="regulierung" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={22} title={t("learn.section22Title")} level={t("learn.levelAcademic")} />
            <SectionCard icon={<Gavel className="h-5 w-5" />} title={t("learn.regulatorsTitle")}>
              <div className="grid sm:grid-cols-2 gap-3">
                <TermCard term={t("learn.sec")} desc={t("learn.secDesc")} />
                <TermCard term={t("learn.bafin")} desc={t("learn.bafinDesc")} />
                <TermCard term={t("learn.ecb")} desc={t("learn.ecbDesc")} />
                <TermCard term={t("learn.esma")} desc={t("learn.esmaDesc")} />
              </div>
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.mifidTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.mifidP1") }} />
            </SectionCard>
            <SectionCard icon={<AlertTriangle className="h-5 w-5" />} title={t("learn.insiderTradingTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.insiderTradingP1") }} />
            </SectionCard>
            <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.baselTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.baselP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 31: Tax Optimization (NEW) */}
          <motion.section id="steueroptimierung" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={31} title={t("learn.section31Title")} level={t("learn.levelAcademic")} />
            <SectionCard icon={<Wallet className="h-5 w-5" />} title={t("learn.taxPlanningOverviewTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.taxPlanningOverviewP1") }} />
            </SectionCard>
            <SectionCard icon={<Calculator className="h-5 w-5" />} title={t("learn.taxLossHarvestingAdvTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.taxLossHarvestingAdvP1") }} />
            </SectionCard>
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.capitalGainsStrategiesTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.capitalGainsStrategiesP1") }} />
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.estatePlanningTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.estatePlanningP1") }} />
            </SectionCard>
          </motion.section>
        </SuperSection>

        {/* ═══════════════════════════════════════════════
            OBERSEKTION F: MEISTERKLASSE (Master Class)
            ═══════════════════════════════════════════════ */}
        <SuperSection id="super-f" title={`F: ${t("learn.superF")}`} level={t("learn.levelMaster")} defaultOpen={false}>
          {/* Section 23: Valuation Methods */}
          <motion.section id="bewertungsmethoden" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={23} title={t("learn.section23Title")} level={t("learn.levelMaster")} />
            <SectionCard icon={<Calculator className="h-5 w-5" />} title={t("learn.multiplesTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.multiplesP1") }} />
            </SectionCard>
            <SectionCard icon={<BarChart3 className="h-5 w-5" />} title={t("learn.comparablesTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.comparablesP1") }} />
            </SectionCard>
            <SectionCard icon={<Briefcase className="h-5 w-5" />} title={t("learn.precedentTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.precedentP1") }} />
            </SectionCard>
            <SectionCard icon={<Target className="h-5 w-5" />} title={t("learn.dcfDeepTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.dcfDeepP1") }} />
            </SectionCard>
            <SectionCard icon={<Layers className="h-5 w-5" />} title={t("learn.lboTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.lboP1") }} />
            </SectionCard>
            <CalcLink to="/calculators" label="DCF Calculator" />
            
          </motion.section>

          {/* Section 24: Alternative Investments Advanced */}
          <motion.section id="alternative-advanced" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={24} title={t("learn.section24Title")} level={t("learn.levelMaster")} />
            <SectionCard icon={<Briefcase className="h-5 w-5" />} title={t("learn.hedgeFundsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.hedgeFundsP1") }} />
            </SectionCard>
            <SectionCard icon={<Building className="h-5 w-5" />} title={t("learn.privateEquityTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.privateEquityP1") }} />
            </SectionCard>
            <SectionCard icon={<Rocket className="h-5 w-5" />} title={t("learn.ventureCapitalTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.ventureCapitalP1") }} />
            </SectionCard>
            <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.infrastructureTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.infrastructureP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 25: Market History & Crises */}
          <motion.section id="marktgeschichte" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={25} title={t("learn.section25Title")} level={t("learn.levelMaster")} />
            <SectionCard icon={<History className="h-5 w-5" />} title={t("learn.tulipManiaTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.tulipManiaP1") }} />
            </SectionCard>
            <SectionCard icon={<TrendingDown className="h-5 w-5" />} title={t("learn.crash1929Title")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.crash1929P1") }} />
            </SectionCard>
            <SectionCard icon={<Globe className="h-5 w-5" />} title={t("learn.dotcomTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.dotcomP1") }} />
            </SectionCard>
            <SectionCard icon={<AlertTriangle className="h-5 w-5" />} title={t("learn.gfc2008Title")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.gfc2008P1") }} />
            </SectionCard>
            <SectionCard icon={<Activity className="h-5 w-5" />} title={t("learn.covidCrashTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.covidCrashP1") }} />
            </SectionCard>
            
          </motion.section>
            <SectionCard icon={<Globe className="h-5 w-5" />} title={t("learn.asianCrisisTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.asianCrisisP1") }} />
            </SectionCard>
            <SectionCard icon={<Coins className="h-5 w-5" />} title={t("learn.cryptoCrash2022Title")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.cryptoCrash2022P1") }} />
            </SectionCard>
            
          {/* Section 26: Personal Finance & Retirement */}
          <motion.section id="personal-finance" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={26} title={t("learn.section26Title")} level={t("learn.levelMaster")} />
            <SectionCard icon={<PiggyBank className="h-5 w-5" />} title={t("learn.budgetingTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.budgetingP1") }} />
            </SectionCard>
            <SectionCard icon={<GraduationCap className="h-5 w-5" />} title={t("learn.retirementPlanningTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.retirementPlanningP1") }} />
              <FormulaBox title={lang === "de" ? "4%-Regel" : "4% Rule"} formula={lang === "de" ? "Benötigtes Kapital = Jährliche Ausgaben × 25" : "Required Capital = Annual Expenses × 25"} explanation={lang === "de" ? "Bei €40.000 Jahresausgaben brauchst du €1.000.000 für finanzielle Unabhängigkeit." : "With $40,000 annual expenses you need $1,000,000 for financial independence."} />
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.insuranceTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.insuranceP1") }} />
            </SectionCard>
            <SectionCard icon={<Wallet className="h-5 w-5" />} title={t("learn.debtManagementTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.debtManagementP1") }} />
            </SectionCard>
            <SectionCard icon={<Brain className="h-5 w-5" />} title={t("learn.humanCapitalTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.humanCapitalP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 27: Econometrics & Financial Modeling */}
          <motion.section id="okonometrie" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={27} title={t("learn.section27Title")} level={t("learn.levelMaster")} />
            <SectionCard icon={<Sigma className="h-5 w-5" />} title={t("learn.regressionTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.regressionP1") }} />
              <FormulaBox title={lang === "de" ? "Lineare Regression" : "Linear Regression"} formula="Y = α + βX + ε" explanation={lang === "de" ? "Y = abhängige Variable, α = Intercept, β = Steigung, X = unabhängige Variable, ε = Fehlerterm." : "Y = dependent variable, α = intercept, β = slope, X = independent variable, ε = error term."} />
            </SectionCard>
            <SectionCard icon={<LineChart className="h-5 w-5" />} title={t("learn.timeSeriesTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.timeSeriesP1") }} />
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.varModelTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.varModelP1") }} />
            </SectionCard>
            <SectionCard icon={<FileText className="h-5 w-5" />} title={t("learn.financialModelingTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.financialModelingP1") }} />
            </SectionCard>
            <SectionCard icon={<Network className="h-5 w-5" />} title={t("learn.correlationTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.correlationP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 28: Monetary Policy & Banking */}
          <motion.section id="geldpolitik" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={28} title={t("learn.section28Title")} level={t("learn.levelMaster")} />
            <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.moneyCreationTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.moneyCreationP1") }} />
            </SectionCard>
            <SectionCard icon={<Zap className="h-5 w-5" />} title={t("learn.centralBankToolsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.centralBankToolsP1") }} />
            </SectionCard>
            <SectionCard icon={<Building className="h-5 w-5" />} title={t("learn.bankingSystemTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.bankingSystemP1") }} />
            </SectionCard>
            <SectionCard icon={<Activity className="h-5 w-5" />} title={t("learn.transmissionTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.transmissionP1") }} />
            </SectionCard>
            <SectionCard icon={<Brain className="h-5 w-5" />} title={t("learn.modernMonetaryTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.modernMonetaryP1") }} />
              <WarningBox title={t("learn.warning")}>{lang === "de" ? "MMT ist hochkontrovers und wird von der Mehrheit der Ökonomen kritisch gesehen." : "MMT is highly controversial and viewed critically by most economists."}</WarningBox>
            </SectionCard>
          </motion.section>

          {/* Section 29: Fintech & Digital Finance (NEW) */}
          <motion.section id="fintech" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={29} title={t("learn.section29Title")} level={t("learn.levelMaster")} />
            <SectionCard icon={<Binary className="h-5 w-5" />} title={t("learn.roboAdvisorsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.roboAdvisorsP1") }} />
            </SectionCard>
            <SectionCard icon={<BanknoteIcon className="h-5 w-5" />} title={t("learn.neobanksTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.neobanksP1") }} />
            </SectionCard>
            <SectionCard icon={<Network className="h-5 w-5" />} title={t("learn.blockchainFinanceTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.blockchainFinanceP1") }} />
            </SectionCard>
            <SectionCard icon={<Coins className="h-5 w-5" />} title={t("learn.defiTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.defiP1") }} />
            </SectionCard>
            <SectionCard icon={<Zap className="h-5 w-5" />} title={t("learn.paymentInnovationTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.paymentInnovationP1") }} />
            </SectionCard>
          </motion.section>
        </SuperSection>

        {/* Glossary CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6 text-center space-y-3">
          <BookOpen className="h-8 w-8 text-primary mx-auto" />
          <h3 className="font-display font-bold text-lg text-foreground">
            {lang === "de" ? "Finanz-Glossar" : "Financial Glossary"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {lang === "de"
              ? "Über 500 Finanzbegriffe und Abkürzungen verständlich erklärt. Perfekt zum Nachschlagen."
              : "Over 500 financial terms and abbreviations explained clearly. Perfect for reference."}
          </p>
          <a href="/glossary" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            {lang === "de" ? "Zum Glossar" : "Open Glossary"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Disclaimer */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center text-xs text-muted-foreground pb-8 border-t border-border/40 pt-8">
          <p>{t("learn.disclaimer")}</p>
        </motion.div>
      </main>

      {/* Side scroll-to-top arrow */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
