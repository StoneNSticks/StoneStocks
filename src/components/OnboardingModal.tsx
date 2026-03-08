/**
 * OnboardingModal — 4-step guide shown on first login.
 * Explains search, watchlist, portfolio, and learn features.
 * Uses localStorage "onboarding_done" to only show once.
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Star, PieChart, BookOpen, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS_DE = [
  { icon: Search, title: "Aktien durchsuchen", desc: "Nutze die Suchleiste, um jede Aktie, jeden ETF und Index zu finden. Du bekommst Echtzeitkurse, Fundamentaldaten und Charts." },
  { icon: Star, title: "Watchlist anlegen", desc: "Klicke auf das Stern-Symbol bei jeder Aktie, um sie deiner persönlichen Watchlist hinzuzufügen. So behältst du deine Favoriten im Blick." },
  { icon: PieChart, title: "Portfolio verwalten", desc: "Trage deine Positionen ein und verfolge deine Performance. Du siehst Gewinne, Verluste und Gewichtungen auf einen Blick." },
  { icon: BookOpen, title: "Finanzwissen aufbauen", desc: "Im Bereich Finanzwissen findest du Lektionen von den Grundlagen bis zu fortgeschrittenen Strategien – alles in deinem Tempo." },
];

const STEPS_EN = [
  { icon: Search, title: "Search stocks", desc: "Use the search bar to find any stock, ETF, or index. Get real-time quotes, fundamentals, and charts." },
  { icon: Star, title: "Build your watchlist", desc: "Click the star icon on any stock to add it to your personal watchlist. Keep your favorites in view." },
  { icon: PieChart, title: "Manage your portfolio", desc: "Enter your positions and track performance. See gains, losses, and allocations at a glance." },
  { icon: BookOpen, title: "Learn finance", desc: "The learn section offers lessons from basics to advanced strategies – all at your own pace." },
];

export function OnboardingModal() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (user && !localStorage.getItem("onboarding_done")) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const steps = lang === "de" ? STEPS_DE : STEPS_EN;
  const current = steps[step];

  const handleClose = () => {
    localStorage.setItem("onboarding_done", "1");
    setOpen(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleClose();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl border-primary/20">
        <div className="bg-gradient-to-br from-primary/10 to-accent/5 p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-muted-foreground">{step + 1}/{steps.length}</span>
            <button onClick={handleClose} className="text-xs text-muted-foreground hover:text-foreground">{lang === "de" ? "Überspringen" : "Skip"}</button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
                <current.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{current.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{current.desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-6">
            <div className="flex gap-1.5 flex-1 justify-center">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/20"}`} />
              ))}
            </div>
          </div>

          <Button onClick={handleNext} className="w-full mt-4 gap-2 rounded-xl">
            {step < steps.length - 1 ? (
              <>{lang === "de" ? "Weiter" : "Next"}<ArrowRight className="h-4 w-4" /></>
            ) : (
              <>{lang === "de" ? "Los geht's!" : "Let's go!"}<Check className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
