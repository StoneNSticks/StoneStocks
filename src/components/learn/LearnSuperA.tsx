import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon, ChevronDown, ChevronRight, CheckCircle, Rocket, Search, FlaskConical, Leaf, Gavel, CircleDollarSign, History, PiggyBank, Binary, BanknoteIcon, Calculator, Heart, Flame, ClipboardList, Trophy, TrendingDown as TrendDown } from "lucide-react";
import { motion } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { SectionCard, InfoBox, WarningBox, TermCard, ProConGrid, SectionHeader, FormulaBox, StepList, fadeIn, stagger } from "@/components/learn/LearnComponents";
import { SuperSection, CalcLink } from "./LearnLayout";

export function LearnSuperA() {
  const t = useT();
  const { lang } = useLanguage();
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
  return (
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
  );
}
