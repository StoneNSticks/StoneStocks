import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon, ChevronDown, ChevronRight, CheckCircle, Rocket, Search, FlaskConical, Leaf, Gavel, CircleDollarSign, History, PiggyBank, Binary, BanknoteIcon, Calculator, Heart, Flame, ClipboardList, Trophy, TrendingDown as TrendDown } from "lucide-react";
import { motion } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { SectionCard, InfoBox, WarningBox, TermCard, ProConGrid, SectionHeader, FormulaBox, StepList, fadeIn, stagger } from "@/components/learn/LearnComponents";
import { SuperSection, CalcLink } from "./LearnLayout";

export function LearnSuperD() {
  const t = useT();
  const { lang } = useLanguage();
  return (
        <SuperSection id="super-d" title={`D: ${t("learn.superD")}`} level={t("learn.levelExpert")} defaultOpen={false}>
          {/* Section 13: Market Microstructure */}
          <motion.section id="microstructure" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={15} title={t("learn.section13Title")} level={t("learn.levelExpert")} />
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
            <SectionHeader num={16} title={t("learn.section14Title")} level={t("learn.levelExpert")} />
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
            <SectionHeader num={17} title={t("learn.section15Title")} level={t("learn.levelExpert")} />
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
            <SectionHeader num={18} title={t("learn.section16Title")} level={t("learn.levelExpert")} />
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

          {/* Section 32: Trading Psychology & Mindset */}
          <motion.section id="trading-psychologie" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={19} title={t("learn.section32Title")} level={t("learn.levelExpert")} />
            <SectionCard icon={<Brain className="h-5 w-5" />} title={t("learn.emotionControlTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.emotionControlP1") }} />
            </SectionCard>
            <SectionCard icon={<Flame className="h-5 w-5" />} title={t("learn.fomoTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.fomoP1") }} />
            </SectionCard>
            <SectionCard icon={<ClipboardList className="h-5 w-5" />} title={t("learn.tradingJournalTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.tradingJournalP1") }} />
            </SectionCard>
            <SectionCard icon={<Target className="h-5 w-5" />} title={t("learn.tradingRoutineTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.tradingRoutineP1") }} />
            </SectionCard>
          </motion.section>

          {/* Section 34: Factor Investing & Smart Beta */}
          <motion.section id="faktor-investing" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={20} title={t("learn.section34Title")} level={t("learn.levelExpert")} />
            <SectionCard icon={<Layers className="h-5 w-5" />} title={t("learn.factorOverviewTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.factorOverviewP1") }} />
            </SectionCard>
            <SectionCard icon={<Scale className="h-5 w-5" />} title={t("learn.valueGrowthTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.valueGrowthP1") }} />
            </SectionCard>
            <SectionCard icon={<Zap className="h-5 w-5" />} title={t("learn.momentumFactorTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.momentumFactorP1") }} />
            </SectionCard>
            <SectionCard icon={<BarChart className="h-5 w-5" />} title={t("learn.smartBetaTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.smartBetaP1") }} />
            </SectionCard>
          </motion.section>
        </SuperSection>
  );
}
