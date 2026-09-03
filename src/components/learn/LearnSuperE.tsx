import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon, ChevronDown, ChevronRight, CheckCircle, Rocket, Search, FlaskConical, Leaf, Gavel, CircleDollarSign, History, PiggyBank, Binary, BanknoteIcon, Calculator, Heart, Flame, ClipboardList, Trophy, TrendingDown as TrendDown } from "lucide-react";
import { motion } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { SectionCard, InfoBox, WarningBox, TermCard, ProConGrid, SectionHeader, FormulaBox, StepList, fadeIn, stagger } from "@/components/learn/LearnComponents";
import { SuperSection, CalcLink } from "./LearnLayout";

export function LearnSuperE() {
  const t = useT();
  const { lang } = useLanguage();
  return (
        <SuperSection id="super-e" title={`E: ${t("learn.superE")}`} level={t("learn.levelAcademic")} defaultOpen={false}>
          {/* Section 17: Corporate Finance */}
          <motion.section id="corporate-finance" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={21} title={t("learn.section17Title")} level={t("learn.levelAcademic")} />
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
            <SectionHeader num={22} title={t("learn.section18Title")} level={t("learn.levelAcademic")} />
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
            <SectionHeader num={23} title={t("learn.section19Title")} level={t("learn.levelAcademic")} />
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
            <SectionHeader num={24} title={t("learn.section20Title")} level={t("learn.levelAcademic")} />
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
            <SectionHeader num={25} title={t("learn.section21Title")} level={t("learn.levelAcademic")} />
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
            <SectionHeader num={26} title={t("learn.section22Title")} level={t("learn.levelAcademic")} />
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
            <SectionHeader num={27} title={t("learn.section31Title")} level={t("learn.levelAcademic")} />
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

          {/* Section 35: Retirement Planning in Detail */}
          <motion.section id="altersvorsorge" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={28} title={t("learn.section35Title")} level={t("learn.levelAcademic")} />
            <SectionCard icon={<PiggyBank className="h-5 w-5" />} title={t("learn.retirementPillarsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.retirementPillarsP1") }} />
            </SectionCard>
            <SectionCard icon={<Shield className="h-5 w-5" />} title={t("learn.retirementAccountsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.retirementAccountsP1") }} />
            </SectionCard>
            <SectionCard icon={<TrendDown className="h-5 w-5" />} title={t("learn.withdrawalTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.withdrawalP1") }} />
            </SectionCard>
            <SectionCard icon={<DollarSign className="h-5 w-5" />} title={t("learn.retirementDividendTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.retirementDividendP1") }} />
            </SectionCard>
          </motion.section>
        </SuperSection>
  );
}
