import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon, ChevronDown, ChevronRight, CheckCircle, Rocket, Search, FlaskConical, Leaf, Gavel, CircleDollarSign, History, PiggyBank, Binary, BanknoteIcon, Calculator, Heart, Flame, ClipboardList, Trophy, TrendingDown as TrendDown } from "lucide-react";
import { motion } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { SectionCard, InfoBox, WarningBox, TermCard, ProConGrid, SectionHeader, FormulaBox, StepList, fadeIn, stagger } from "@/components/learn/LearnComponents";
import { SuperSection, CalcLink } from "./LearnLayout";

export function LearnSuperC() {
  const t = useT();
  const { lang } = useLanguage();
  return (
        <SuperSection id="super-c" title={`C: ${t("learn.superC")}`} level={t("learn.levelAdvanced")} defaultOpen={false}>
          {/* Section 10: Technical Analysis */}
          <motion.section id="technische-analyse" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={12} title={t("learn.section10Title")} level={t("learn.levelAdvanced")} />
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
            <SectionHeader num={13} title={t("learn.section11Title")} level={t("learn.levelAdvanced")} />
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
            <SectionHeader num={14} title={t("learn.section12Title")} level={t("learn.levelAdvanced")} />
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
  );
}
