/**
 * CustomDashboard — Configurable widget dashboard with drag-to-reorder.
 * Uses localStorage to persist layout. Widgets: Watchlist, Portfolio, News, Chart, Gainers/Losers.
 */
import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GainersLosers } from "@/components/GainersLosers";
import { MostActive } from "@/components/MostActive";
import { MarketNewsSection } from "@/components/MarketNewsSection";
import { SectorPerformance } from "@/components/SectorPerformance";
import { VixIndicator } from "@/components/VixIndicator";
import { HiddenGems } from "@/components/HiddenGems";
import { LayoutDashboard, GripVertical, Eye, EyeOff, RotateCcw } from "lucide-react";
import { motion, Reorder } from "framer-motion";

interface Widget {
  id: string;
  label: { en: string; de: string };
  visible: boolean;
}

const DEFAULT_WIDGETS: Widget[] = [
  { id: "gainers", label: { en: "Gainers & Losers", de: "Gewinner & Verlierer" }, visible: true },
  { id: "active", label: { en: "Most Active", de: "Meistgehandelt" }, visible: true },
  { id: "news", label: { en: "Market News", de: "Marktnachrichten" }, visible: true },
  { id: "sectors", label: { en: "Sector Performance", de: "Sektor-Performance" }, visible: true },
  { id: "vix", label: { en: "VIX / Fear Index", de: "VIX / Angst-Index" }, visible: true },
  { id: "gems", label: { en: "Hidden Gems", de: "Geheimtipps" }, visible: false },
];

function loadWidgets(): Widget[] {
  try {
    const saved = localStorage.getItem("dashboard_widgets");
    if (saved) {
      const parsed = JSON.parse(saved) as Widget[];
      // Merge with defaults to catch new widgets
      const ids = new Set(parsed.map(w => w.id));
      const merged = [...parsed];
      DEFAULT_WIDGETS.forEach(dw => {
        if (!ids.has(dw.id)) merged.push(dw);
      });
      return merged;
    }
  } catch {}
  return DEFAULT_WIDGETS;
}

function saveWidgets(widgets: Widget[]) {
  localStorage.setItem("dashboard_widgets", JSON.stringify(widgets));
}

function WidgetRenderer({ id }: { id: string }) {
  switch (id) {
    case "gainers": return <GainersLosers />;
    case "active": return <MostActive />;
    case "news": return <MarketNewsSection />;
    case "sectors": return <SectorPerformance />;
    case "vix": return <VixIndicator />;
    case "gems": return <HiddenGems />;
    default: return null;
  }
}

export default function CustomDashboard() {
  const { lang } = useLanguage();

  usePageTitle(
    lang === "de" ? "Mein Dashboard" : "My Dashboard",
    lang === "de" ? "Dein persönliches Markt-Dashboard" : "Your personal market dashboard"
  );

  const [widgets, setWidgets] = useState<Widget[]>(loadWidgets);
  const [editing, setEditing] = useState(false);

  const toggleWidget = useCallback((id: string) => {
    setWidgets(prev => {
      const next = prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
      saveWidgets(next);
      return next;
    });
  }, []);

  const handleReorder = useCallback((newOrder: Widget[]) => {
    setWidgets(newOrder);
    saveWidgets(newOrder);
  }, []);

  const resetLayout = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
    saveWidgets(DEFAULT_WIDGETS);
  }, []);

  const visibleWidgets = widgets.filter(w => w.visible);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-8 px-3 sm:px-4 lg:px-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl sm:text-2xl font-bold">
              {lang === "de" ? "Mein" : "My"} <span className="text-primary">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-lg" onClick={() => setEditing(!editing)}>
              {editing ? <EyeOff className="h-3.5 w-3.5" /> : <GripVertical className="h-3.5 w-3.5" />}
              {editing ? (lang === "de" ? "Fertig" : "Done") : (lang === "de" ? "Anpassen" : "Customize")}
            </Button>
            {editing && (
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs rounded-lg" onClick={resetLayout}>
                <RotateCcw className="h-3.5 w-3.5" />{lang === "de" ? "Zurücksetzen" : "Reset"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Edit mode: widget toggles */}
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 rounded-xl border border-border/60 bg-card">
            <p className="text-xs text-muted-foreground mb-3">
              {lang === "de" ? "Widgets ein-/ausblenden. Reihenfolge durch Ziehen ändern." : "Toggle widgets on/off. Drag to reorder."}
            </p>
            <Reorder.Group axis="y" values={widgets} onReorder={handleReorder} className="space-y-2">
              {widgets.map(w => (
                <Reorder.Item key={w.id} value={w} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/30 cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                  <span className="text-sm flex-1">{lang === "de" ? w.label.de : w.label.en}</span>
                  <button onClick={() => toggleWidget(w.id)} className="p-1 rounded-md hover:bg-muted transition-colors">
                    {w.visible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground/40" />}
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        )}

        {/* Rendered widgets */}
        <div className="space-y-6">
          {visibleWidgets.map(w => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} layout>
              <WidgetRenderer id={w.id} />
            </motion.div>
          ))}
          {visibleWidgets.length === 0 && (
            <div className="text-center py-20">
              <LayoutDashboard className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                {lang === "de" ? "Keine Widgets aktiv. Klicke \"Anpassen\" um Widgets hinzuzufügen." : "No widgets active. Click \"Customize\" to add widgets."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
