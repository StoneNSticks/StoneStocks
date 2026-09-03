import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, TrendingUp, TrendingDown, Landmark, PieChart, BarChart3, DollarSign, Shield, ArrowRight, Target, Layers, CandlestickChart, Brain, Wallet, GraduationCap, Coins, LineChart, Briefcase, AlertTriangle, FileText, Building, Gem, Repeat, BarChart, Scale, Sigma, Globe, Zap, Activity, Eye, Gauge, Network, Link as LinkIcon, ChevronDown, ChevronRight, CheckCircle, Rocket, Search, FlaskConical, Leaf, Gavel, CircleDollarSign, History, PiggyBank, Binary, BanknoteIcon, Calculator, Heart, Flame, ClipboardList, Trophy, TrendingDown as TrendDown } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/contexts/LanguageContext";
import { fadeIn } from "@/components/learn/LearnComponents";
import { LearnSuperA } from "@/components/learn/LearnSuperA";
import { LearnSuperB } from "@/components/learn/LearnSuperB";
import { LearnSuperC } from "@/components/learn/LearnSuperC";
import { LearnSuperD } from "@/components/learn/LearnSuperD";
import { LearnSuperE } from "@/components/learn/LearnSuperE";
import { LearnSuperF } from "@/components/learn/LearnSuperF";

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
      { label: t("learn.toc33"), href: "#dividendenstrategien" },
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
      { label: t("learn.toc32"), href: "#trading-psychologie" },
      { label: t("learn.toc34"), href: "#faktor-investing" },
    ]},
    { title: `E: ${t("learn.superE")}`, level: t("learn.levelAcademic"), items: [
      { label: t("learn.toc17"), href: "#corporate-finance" },
      { label: t("learn.toc18"), href: "#rechnungswesen" },
      { label: t("learn.toc19"), href: "#international-finance" },
      { label: t("learn.toc20"), href: "#fixed-income-advanced" },
      { label: t("learn.toc21"), href: "#esg" },
      { label: t("learn.toc22"), href: "#regulierung" },
      { label: t("learn.toc31"), href: "#steueroptimierung" },
      { label: t("learn.toc35"), href: "#altersvorsorge" },
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
        <LearnSuperA />

        {/* ═══════════════════════════════════════════════
            OBERSEKTION B: AUFBAU (Intermediate)
            ═══════════════════════════════════════════════ */}
        <LearnSuperB />


        {/* ═══════════════════════════════════════════════
            OBERSEKTION C: FORTGESCHRITTEN (Advanced)
            ═══════════════════════════════════════════════ */}
        <LearnSuperC />

        {/* ═══════════════════════════════════════════════
            OBERSEKTION D: EXPERTE (Expert)
            ═══════════════════════════════════════════════ */}
        <LearnSuperD />

        {/* ═══════════════════════════════════════════════
            OBERSEKTION E: AKADEMISCH (Academic)
            ═══════════════════════════════════════════════ */}
        <LearnSuperE />

        {/* ═══════════════════════════════════════════════
            OBERSEKTION F: MEISTERKLASSE (Master Class)
            ═══════════════════════════════════════════════ */}
        <LearnSuperF />

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


      <Footer />
    </div>
  );
}
