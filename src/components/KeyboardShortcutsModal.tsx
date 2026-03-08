/**
 * Phase 12: Keyboard Shortcuts Overlay — triggered by pressing `?`
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "/", en: "Focus search", de: "Suche fokussieren" },
  { key: "H", en: "Go to Home", de: "Zur Startseite" },
  { key: "W", en: "Go to Watchlist", de: "Zur Watchlist" },
  { key: "P", en: "Go to Portfolio", de: "Zum Portfolio" },
  { key: "N", en: "Go to News", de: "Zu Nachrichten" },
  { key: "R", en: "Go to Rankings", de: "Zu Rankings" },
  { key: "?", en: "Show shortcuts", de: "Tastenkürzel anzeigen" },
];

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "?") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            {lang === "de" ? "Tastenkürzel" : "Keyboard Shortcuts"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          {SHORTCUTS.map(s => (
            <div key={s.key} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50">
              <span className="text-sm text-muted-foreground">{lang === "de" ? s.de : s.en}</span>
              <kbd className="px-2 py-1 rounded-md bg-muted text-xs font-mono font-bold text-foreground border border-border/60">{s.key}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
