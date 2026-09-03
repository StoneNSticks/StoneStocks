import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calculator, TrendingUp, Percent, DollarSign, PiggyBank, BarChart3, Landmark, Target, Scale, ArrowLeftRight, Crosshair, Scissors, Coins, TrendingDown, Wallet, RotateCcw, Activity, LayoutList } from "lucide-react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useQuery } from "@tanstack/react-query";
import { getCurrencyRates } from "@/lib/stockApi";
import { PortfolioGrowth, CompoundInterest, DividendCalc, InflationCalc, ROICalc } from "@/components/calculators/basics";
import { PositionSize, RiskRewardCalc, OptionsCalc, MarginCalc, BreakEvenCalc } from "@/components/calculators/trading";
import { FireCalc, LoanCalc, RetirementWithdrawal, SavingsGoalCalc, NetWorthCalc } from "@/components/calculators/planning";
import { CurrencyConverter, DCASimulator, TaxLossHarvesting, KellyCalc, DividendProjector } from "@/components/calculators/special";

const CalculatorPage = () => {
  const t = useT();
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Finanzrechner" : "Financial Calculators",
    lang === "de" ? "Zinseszins, Dividenden, FIRE und mehr berechnen" : "Compound interest, dividends, FIRE and more"
  );
  const [activeCategory, setActiveCategory] = useState<CalcCategory>("all");

  const tabs: CalcTab[] = [
    { value: "portfolio", label: t("calc.portfolioGrowth"), icon: <TrendingUp className="h-3.5 w-3.5" />, category: "basics", component: <PortfolioGrowth /> },
    { value: "compound", label: t("calc.compoundInterest"), icon: <Percent className="h-3.5 w-3.5" />, category: "basics", component: <CompoundInterest /> },
    { value: "dividend", label: t("calc.dividendGrowth"), icon: <DollarSign className="h-3.5 w-3.5" />, category: "basics", component: <DividendCalc /> },
    { value: "inflation", label: t("calc.inflationCalc"), icon: <TrendingDown className="h-3.5 w-3.5" />, category: "basics", component: <InflationCalc /> },
    { value: "roi", label: t("calc.roiCalc"), icon: <BarChart3 className="h-3.5 w-3.5" />, category: "basics", component: <ROICalc /> },
    { value: "position", label: t("calc.positionSize"), icon: <BarChart3 className="h-3.5 w-3.5" />, category: "trading", component: <PositionSize /> },
    { value: "riskreward", label: t("calc.riskReward"), icon: <Scale className="h-3.5 w-3.5" />, category: "trading", component: <RiskRewardCalc /> },
    { value: "options", label: t("calc.optionsCalc"), icon: <Crosshair className="h-3.5 w-3.5" />, category: "trading", component: <OptionsCalc /> },
    { value: "margin", label: t("calc.marginCalc"), icon: <Wallet className="h-3.5 w-3.5" />, category: "trading", component: <MarginCalc /> },
    { value: "breakeven", label: t("calc.breakEvenCalc"), icon: <RotateCcw className="h-3.5 w-3.5" />, category: "trading", component: <BreakEvenCalc /> },
    { value: "fire", label: t("calc.fireCalc"), icon: <PiggyBank className="h-3.5 w-3.5" />, category: "planning", component: <FireCalc /> },
    { value: "loan", label: t("calc.loanCalc"), icon: <Landmark className="h-3.5 w-3.5" />, category: "planning", component: <LoanCalc /> },
    { value: "retirement", label: t("calc.retirementCalc"), icon: <Wallet className="h-3.5 w-3.5" />, category: "planning", component: <RetirementWithdrawal /> },
    { value: "savingsgoal", label: t("calc.savingsGoal"), icon: <Target className="h-3.5 w-3.5" />, category: "planning", component: <SavingsGoalCalc /> },
    { value: "networth", label: "Nettovermögen", icon: <LayoutList className="h-3.5 w-3.5" />, category: "planning", component: <NetWorthCalc /> },
    { value: "dca", label: t("calc.dcaSimulator"), icon: <Target className="h-3.5 w-3.5" />, category: "special", component: <DCASimulator /> },
    { value: "currency", label: t("calc.currencyConverter"), icon: <ArrowLeftRight className="h-3.5 w-3.5" />, category: "special", component: <CurrencyConverter /> },
    { value: "taxloss", label: t("calc.taxLossHarvesting"), icon: <Scissors className="h-3.5 w-3.5" />, category: "special", component: <TaxLossHarvesting /> },
    { value: "divproject", label: t("calc.divProjector"), icon: <Coins className="h-3.5 w-3.5" />, category: "special", component: <DividendProjector /> },
    { value: "kelly", label: "Kelly-Kriterium", icon: <Activity className="h-3.5 w-3.5" />, category: "special", component: <KellyCalc /> },
  ];

  const filteredTabs = activeCategory === "all" ? tabs : tabs.filter(tab => tab.category === activeCategory);

  const categories: { key: CalcCategory; label: string }[] = [
    { key: "all", label: t("calc.catAll") },
    { key: "basics", label: t("calc.catBasics") },
    { key: "trading", label: t("calc.catTrading") },
    { key: "planning", label: t("calc.catPlanning") },
    { key: "special", label: t("calc.catSpecial") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{t("calc.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("calc.subtitle")}</p>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-4 scroll-x-touch pb-1">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.label} {cat.key !== "all" && <span className="ml-1 opacity-60">({tabs.filter(t => t.category === cat.key).length})</span>}
            </button>
          ))}
        </div>

        <Tabs defaultValue="portfolio" className="space-y-5">
          {/* Category-grouped calculator grid */}
          <div className="space-y-4">
            {(activeCategory === "all" ? ["basics", "trading", "planning", "special"] as const : [activeCategory]).map(catKey => {
              const catTabs = tabs.filter(t => t.category === catKey);
              if (catTabs.length === 0) return null;
              const catLabel = categories.find(c => c.key === catKey)?.label || catKey;
              return (
                <div key={catKey}>
                  {activeCategory === "all" && (
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">{catLabel}</h2>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {catTabs.map(tab => (
                      <TabsList key={tab.value} className="bg-transparent p-0 h-auto w-full">
                        <TabsTrigger
                          value={tab.value}
                          className="w-full flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-card px-2 py-3 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm"
                        >
                          <span className="p-1.5 rounded-lg bg-muted/50">{tab.icon}</span>
                          <span className="text-center leading-tight">{tab.label}</span>
                        </TabsTrigger>
                      </TabsList>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {filteredTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>{tab.component}</TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default CalculatorPage;
