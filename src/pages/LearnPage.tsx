import { Header } from "@/components/Header";
import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Calculator, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/contexts/LanguageContext";
import { SectionCard, InfoBox, WarningBox, TermCard, ProConGrid, SectionHeader, FormulaBox, fadeIn, stagger } from "@/components/learn/LearnComponents";
import { QuizSection, type QuizQuestion } from "@/components/learn/QuizSection";
import { ReadingProgress } from "@/components/learn/ReadingProgress";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LearnPage() {
  const t = useT();
  const { lang } = useLanguage();

  // Quizzes for each section
  const quizBasics: QuizQuestion[] = lang === "de" ? [
    { question: "Was beschreibt die Marktkapitalisierung?", options: ["Tägliches Handelsvolumen", "Gesamtwert aller Aktien eines Unternehmens", "Jahresgewinn", "Dividendenrendite"], correct: 1 },
    { question: "Was bedeutet ein Beta von 1,5?", options: ["50% weniger volatil als der Markt", "Gleich wie der Markt", "50% volatiler als der Markt", "Keine Korrelation"], correct: 2 },
    { question: "Was ist der Hauptvorteil von Diversifikation?", options: ["Höhere Renditen garantiert", "Risikominimierung durch Streuung", "Steuerersparnis", "Schnellere Gewinne"], correct: 1 },
  ] : [
    { question: "What does market capitalization describe?", options: ["Daily trading volume", "Total value of all company shares", "Annual profit", "Dividend yield"], correct: 1 },
    { question: "What does a Beta of 1.5 mean?", options: ["50% less volatile than market", "Same as market", "50% more volatile than market", "No correlation"], correct: 2 },
    { question: "What is the main benefit of diversification?", options: ["Guaranteed higher returns", "Risk reduction through spreading", "Tax savings", "Faster profits"], correct: 1 },
  ];

  const quizStocksETFs: QuizQuestion[] = lang === "de" ? [
    { question: "Was unterscheidet einen ETF von einem aktiven Fonds?", options: ["ETFs haben höhere Gebühren", "ETFs bilden einen Index passiv ab", "Aktive Fonds sind immer besser", "ETFs zahlen keine Dividenden"], correct: 1 },
    { question: "Was sind Blue-Chip Aktien?", options: ["Billige Penny Stocks", "Große, etablierte Unternehmen", "Nur Tech-Aktien", "Aktien unter 10€"], correct: 1 },
  ] : [
    { question: "What distinguishes an ETF from an active fund?", options: ["ETFs have higher fees", "ETFs passively track an index", "Active funds are always better", "ETFs don't pay dividends"], correct: 1 },
    { question: "What are Blue-Chip stocks?", options: ["Cheap penny stocks", "Large, established companies", "Only tech stocks", "Stocks under $10"], correct: 1 },
  ];

  const quizDerivatives: QuizQuestion[] = lang === "de" ? [
    { question: "Was gibt dir eine Call-Option?", options: ["Pflicht zum Kauf", "Recht zum Kauf", "Pflicht zum Verkauf", "Recht zum Verkauf"], correct: 1 },
    { question: "Was misst Theta bei Optionen?", options: ["Preisänderung pro $1", "Zeitwertverfall pro Tag", "Volatilitätssensitivität", "Zinssensitivität"], correct: 1 },
    { question: "Was ist das Hauptrisiko bei CFDs?", options: ["Geringe Liquidität", "Hebelwirkung vervielfacht Verluste", "Zu niedrige Renditen", "Nur in EUR handelbar"], correct: 1 },
  ] : [
    { question: "What does a Call option give you?", options: ["Obligation to buy", "Right to buy", "Obligation to sell", "Right to sell"], correct: 1 },
    { question: "What does Theta measure in options?", options: ["Price change per $1", "Time decay per day", "Volatility sensitivity", "Interest rate sensitivity"], correct: 1 },
    { question: "What is the main risk with CFDs?", options: ["Low liquidity", "Leverage multiplies losses", "Returns too low", "Only tradeable in EUR"], correct: 1 },
  ];

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

  const toc = [
    { label: t("learn.toc1"), href: "#grundlagen" },
    { label: t("learn.toc2"), href: "#aktien-etfs" },
    { label: t("learn.toc3"), href: "#anleihen-fonds" },
    { label: t("learn.toc4"), href: "#derivate" },
    { label: t("learn.toc5"), href: "#krypto-alternativen" },
    { label: t("learn.toc6"), href: "#strategien" },
    { label: t("learn.toc7"), href: "#technische-analyse" },
    { label: t("learn.toc8"), href: "#portfolio" },
    { label: t("learn.toc9"), href: "#steuern" },
    { label: t("learn.toc10"), href: "#formeln" },
    { label: t("learn.toc11"), href: "#microstructure" },
    { label: t("learn.toc12"), href: "#behavioral" },
    { label: t("learn.toc13"), href: "#macro" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8 md:py-12 space-y-12 px-3 sm:px-4 lg:px-8">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />{t("learn.badge")}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t("learn.title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("learn.subtitle")}</p>
          <div className="flex justify-center gap-2 flex-wrap pt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{t("learn.levelBeginner")}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">{t("learn.levelIntermediate")}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">{t("learn.levelAdvanced")}</span>
          </div>
        </motion.div>

        {/* TOC */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-6">
          <h2 className="font-display font-semibold text-foreground mb-3">{t("learn.toc")}</h2>
          <nav className="grid sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {toc.map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                <ArrowRight className="h-3.5 w-3.5" />{item.label}
              </a>
            ))}
          </nav>
        </motion.div>

        {/* ═══ SECTION 1: BASICS ═══ */}
        <motion.section id="grundlagen" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={1} title={t("learn.section1Title")} level={t("learn.levelBeginner")} />
          
          <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.marketsTitle")}>
            <p>{t("learn.marketsP1")}</p>
            <p dangerouslySetInnerHTML={{ __html: t("learn.marketsP2") }} />
            <p dangerouslySetInnerHTML={{ __html: t("learn.marketsP3") }} />
            <InfoBox title={t("learn.goodToKnow")}>{t("learn.marketsInfo")}</InfoBox>
          </SectionCard>

          <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.basicsTitle")}>
            <div className="grid gap-3">
              {terms.map((item) => <TermCard key={item.term} term={item.term} desc={item.desc} />)}
            </div>
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

        {/* ═══ SECTION 2: STOCKS & ETFs ═══ */}
        <motion.section id="aktien-etfs" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={2} title={t("learn.section2Title")} level={t("learn.levelBeginner")} />

          <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.stocksTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.stocksP1") }} />
            <p>{t("learn.stocksP2")}</p>
            <ProConGrid
              prosTitle={t("learn.stocksPros")}
              consTitle={t("learn.stocksCons")}
              pros={[t("learn.stocksPro1"), t("learn.stocksPro2"), t("learn.stocksPro3"), t("learn.stocksPro4")]}
              cons={[t("learn.stocksCon1"), t("learn.stocksCon2"), t("learn.stocksCon3"), t("learn.stocksCon4")]}
            />
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

        {/* ═══ SECTION 3: BONDS & FUNDS ═══ */}
        <motion.section id="anleihen-fonds" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={3} title={t("learn.section3Title")} level={t("learn.levelIntermediate")} />

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

        {/* ═══ SECTION 4: DERIVATIVES ═══ */}
        <motion.section id="derivate" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={4} title={t("learn.section4Title")} level={t("learn.levelAdvanced")} />

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
            <p className="font-medium text-foreground text-sm mt-3">{t("learn.optionsStrategies")}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <TermCard term={t("learn.coveredCall")} desc={t("learn.coveredCallDesc")} />
              <TermCard term={t("learn.protectivePut")} desc={t("learn.protectivePutDesc")} />
              <TermCard term={t("learn.straddle")} desc={t("learn.straddleDesc")} />
              <TermCard term={t("learn.ironCondor")} desc={t("learn.ironCondorDesc")} />
            </div>
          </SectionCard>

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

          <motion.div variants={fadeIn}>
            <InfoBox title={t("learn.goodToKnow")}>{t("learn.derivativesSummary")}</InfoBox>
          </motion.div>
        </motion.section>

        {/* ═══ SECTION 5: CRYPTO & ALTERNATIVES ═══ */}
        <motion.section id="krypto-alternativen" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={5} title={t("learn.section5Title")} level={t("learn.levelIntermediate")} />

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

        {/* ═══ SECTION 6: STRATEGIES ═══ */}
        <motion.section id="strategien" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={6} title={t("learn.section6Title")} level={t("learn.levelIntermediate")} />

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

          <SectionCard icon={<Repeat className="h-5 w-5" />} title={t("learn.momentumTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.momentumP1") }} />
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

        {/* ═══ SECTION 7: TECHNICAL ANALYSIS ═══ */}
        <motion.section id="technische-analyse" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={7} title={t("learn.section7Title")} level={t("learn.levelAdvanced")} />

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

          <motion.div variants={fadeIn}>
            <WarningBox title={t("learn.warning")}>{t("learn.taWarning")}</WarningBox>
          </motion.div>
        </motion.section>

        {/* ═══ SECTION 8: PORTFOLIO MANAGEMENT ═══ */}
        <motion.section id="portfolio" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={8} title={t("learn.section8Title")} level={t("learn.levelAdvanced")} />

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
        </motion.section>

        {/* ═══ SECTION 9: TAXES & COSTS ═══ */}
        <motion.section id="steuern" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={9} title={t("learn.section9Title")} level={t("learn.levelBeginner")} />

          <SectionCard icon={<Wallet className="h-5 w-5" />} title={t("learn.taxTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.taxP1") }} />
            <p dangerouslySetInnerHTML={{ __html: t("learn.taxP2") }} />
            <TermCard term={t("learn.taxLossHarvesting")} desc={t("learn.taxLossHarvestingDesc")} />
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
            <p className="font-medium text-foreground text-sm mt-2">{t("learn.brokerTypes")}</p>
            <div className="grid gap-3">
              <TermCard term={t("learn.neobroker")} desc={t("learn.neobrokerDesc")} />
              <TermCard term={t("learn.onlinebroker")} desc={t("learn.onlinebrokerDesc")} />
              <TermCard term={t("learn.probroker")} desc={t("learn.probrokerDesc")} />
            </div>
          </SectionCard>
        </motion.section>

        {/* ═══ SECTION 10: FORMULAS & EXPERT KNOWLEDGE ═══ */}
        <motion.section id="formeln" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={10} title={t("learn.section10Title")} level={t("learn.levelAdvanced")} />

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
            <WarningBox title={t("learn.warning")}>{t("learn.taWarning")}</WarningBox>
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

        {/* ═══ SECTION 11: MARKET MICROSTRUCTURE ═══ */}
        <motion.section id="microstructure" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={11} title={t("learn.section11Title")} level={t("learn.levelAdvanced")} />

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
        </motion.section>

        {/* ═══ SECTION 12: BEHAVIORAL FINANCE ═══ */}
        <motion.section id="behavioral" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={12} title={t("learn.section12Title")} level={t("learn.levelAdvanced")} />

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

          <SectionCard icon={<Scale className="h-5 w-5" />} title={t("learn.emhTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.emhP1") }} />
          </SectionCard>
        </motion.section>

        {/* ═══ SECTION 13: GLOBAL MARKETS & MACRO ═══ */}
        <motion.section id="macro" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
          <SectionHeader num={13} title={t("learn.section13Title")} level={t("learn.levelAdvanced")} />

          <SectionCard icon={<Landmark className="h-5 w-5" />} title={t("learn.centralBanksTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.centralBanksP1") }} />
          </SectionCard>

          <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.inflationTitle")}>
            <p dangerouslySetInnerHTML={{ __html: t("learn.inflationP1") }} />
          </SectionCard>

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

        {/* Disclaimer */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center text-xs text-muted-foreground pb-8 border-t border-border/40 pt-8">
          <p>{t("learn.disclaimer")}</p>
        </motion.div>
      </main>
    </div>
  );
}
