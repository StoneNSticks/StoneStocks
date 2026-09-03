import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon, ChevronDown, ChevronRight, CheckCircle, Rocket, Search, FlaskConical, Leaf, Gavel, CircleDollarSign, History, PiggyBank, Binary, BanknoteIcon, Calculator, Heart, Flame, ClipboardList, Trophy, TrendingDown as TrendDown } from "lucide-react";
import { motion } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { SectionCard, InfoBox, WarningBox, TermCard, ProConGrid, SectionHeader, FormulaBox, StepList, fadeIn, stagger } from "@/components/learn/LearnComponents";
import { SuperSection, CalcLink } from "./LearnLayout";

export function LearnSuperB() {
  const t = useT();
  const { lang } = useLanguage();
  return (
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

          {/* Section 33: Dividend Strategies */}
          <motion.section id="dividendenstrategien" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <SectionHeader num={11} title={t("learn.section33Title")} level={t("learn.levelIntermediate")} />
            <SectionCard icon={<TrendingUp className="h-5 w-5" />} title={t("learn.divGrowthVsYieldTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.divGrowthVsYieldP1") }} />
            </SectionCard>
            <SectionCard icon={<Trophy className="h-5 w-5" />} title={t("learn.divAristocratsTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.divAristocratsP1") }} />
            </SectionCard>
            <SectionCard icon={<Repeat className="h-5 w-5" />} title={t("learn.dripTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.dripP1") }} />
            </SectionCard>
            <SectionCard icon={<CircleDollarSign className="h-5 w-5" />} title={t("learn.divTaxTitle")}>
              <p dangerouslySetInnerHTML={{ __html: t("learn.divTaxP1") }} />
            </SectionCard>
          </motion.section>
        </SuperSection>
  );
}
