/**
 * AlertNotifications — Floating alert banner that shows when price alerts are triggered.
 * Uses useAlertChecker to poll prices and displays animated notifications.
 */
import { useAlertChecker } from "@/hooks/useAlertChecker";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AlertNotifications() {
  const { triggered, dismiss, dismissAll } = useAlertChecker();
  const { lang } = useLanguage();

  if (triggered.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {triggered.slice(0, 5).map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20 p-4 backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${alert.direction === "above" ? "bg-chart-2/10" : "bg-destructive/10"}`}>
                {alert.direction === "above" ? (
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Bell className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    {lang === "de" ? "Kursalarm" : "Price Alert"}
                  </span>
                </div>
                <p className="text-sm font-bold mt-0.5">
                  {alert.symbol}{" "}
                  <span className={alert.direction === "above" ? "text-chart-2" : "text-destructive"}>
                    {alert.direction === "above" ? "↑" : "↓"} ${alert.currentPrice.toFixed(2)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {lang === "de"
                    ? `Zielkurs $${alert.target_price.toFixed(2)} erreicht`
                    : `Target $${alert.target_price.toFixed(2)} reached`}
                </p>
                <Link
                  to={`/stock/${alert.symbol}`}
                  className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline mt-1"
                >
                  {lang === "de" ? "Details" : "View"} <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <button
                onClick={() => dismiss(alert.id)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {triggered.length > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={dismissAll}
          className="pointer-events-auto self-end text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg bg-card border border-border/40"
        >
          {lang === "de" ? "Alle schließen" : "Dismiss all"}
        </motion.button>
      )}
    </div>
  );
}
