import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("pwa_dismissed") === "1");
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIOS) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
    handleDismiss();
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("pwa_dismissed", "1");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        className="fixed bottom-16 md:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-sm z-50"
      >
        <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20 p-4 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-sm">
                {lang === "de" ? "StoneStocks installieren" : "Install StoneStocks"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {isIOS
                  ? (lang === "de"
                    ? "Tippe auf Teilen ⬆ und dann \u201EZum Home-Bildschirm\u201C"
                    : "Tap Share ⬆ then \u201CAdd to Home Screen\u201D")
                  : (lang === "de"
                    ? "Füge die App zu deinem Homescreen hinzu für schnellen Zugriff"
                    : "Add to your home screen for quick access")}
              </p>
              {deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors min-h-[36px]"
                >
                  <Download className="h-3.5 w-3.5" />
                  {lang === "de" ? "Jetzt installieren" : "Install now"}
                </button>
              )}
            </div>
            <button onClick={handleDismiss} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
