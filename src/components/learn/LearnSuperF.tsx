import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon, ChevronDown, ChevronRight, CheckCircle, Rocket, Search, FlaskConical, Leaf, Gavel, CircleDollarSign, History, PiggyBank, Binary, BanknoteIcon, Calculator, Heart, Flame, ClipboardList, Trophy, TrendingDown as TrendDown } from "lucide-react";
import { motion } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { SectionCard, InfoBox, WarningBox, TermCard, ProConGrid, SectionHeader, FormulaBox, StepList, fadeIn, stagger } from "@/components/learn/LearnComponents";
import { SuperSection, CalcLink } from "./LearnLayout";

export function LearnSuperF() {
  const t = useT();
  const { lang } = useLanguage();
  return (
        <SuperSection id="super-f" title={`F: ${t("learn.superF")}`} level={t("learn.levelMaster")} defaultOpen={false}>
          {/* Section 23: Valuation Methods */}
          <motion.section id="bewertungsmethoden" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={29} title={t("learn.section23Title")} level={t("learn.levelMaster")} />
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
            <SectionHeader num={30} title={t("learn.section24Title")} level={t("learn.levelMaster")} />
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
            <SectionHeader num={31} title={t("learn.section25Title")} level={t("learn.levelMaster")} />
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
            
            <SectionCard icon={<Globe className="h-5 w-5" />} title={t("learn.asianCrisisTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.asianCrisisP1") }} />
            </SectionCard>
            <SectionCard icon={<Coins className="h-5 w-5" />} title={t("learn.cryptoCrash2022Title")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.cryptoCrash2022P1") }} />
            </SectionCard>
          </motion.section>
            
          {/* Section 26: Personal Finance & Retirement */}
          <motion.section id="personal-finance" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={32} title={t("learn.section26Title")} level={t("learn.levelMaster")} />
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
            <SectionHeader num={33} title={t("learn.section27Title")} level={t("learn.levelMaster")} />
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
            <SectionHeader num={34} title={t("learn.section28Title")} level={t("learn.levelMaster")} />
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
            <SectionHeader num={35} title={t("learn.section29Title")} level={t("learn.levelMaster")} />
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
  );
}
