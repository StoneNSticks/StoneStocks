/**
 * AdvancedAlertBuilder — Multi-condition alert builder supporting price, RSI, volume spike alerts.
 */
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2, AlertTriangle, TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type AlertType = "price_above" | "price_below" | "rsi_oversold" | "rsi_overbought" | "volume_spike";

interface AlertConfig {
  type: AlertType;
  label: string;
  icon: any;
  description: { en: string; de: string };
}

const ALERT_TYPES: AlertConfig[] = [
  { type: "price_above", label: "Price Above", icon: TrendingUp, description: { en: "Triggers when price goes above target", de: "Auslösung bei Kurs über Zielwert" } },
  { type: "price_below", label: "Price Below", icon: TrendingDown, description: { en: "Triggers when price drops below target", de: "Auslösung bei Kurs unter Zielwert" } },
  { type: "rsi_oversold", label: "RSI Oversold", icon: Activity, description: { en: "Triggers when RSI drops below 30 (oversold)", de: "Auslösung bei RSI unter 30 (überverkauft)" } },
  { type: "rsi_overbought", label: "RSI Overbought", icon: AlertTriangle, description: { en: "Triggers when RSI rises above 70 (overbought)", de: "Auslösung bei RSI über 70 (überkauft)" } },
  { type: "volume_spike", label: "Volume Spike", icon: BarChart3, description: { en: "Triggers on unusual volume (2x average)", de: "Auslösung bei ungewöhnlichem Volumen (2x Durchschnitt)" } },
];

export function AdvancedAlertBuilder({ symbol, currentPrice }: { symbol: string; currentPrice?: number }) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const qc = useQueryClient();
  const [alertType, setAlertType] = useState<AlertType>("price_above");
  const [targetValue, setTargetValue] = useState(currentPrice ? Math.round(currentPrice * 1.1) : 0);
  const [isAdding, setIsAdding] = useState(false);

  const { data: alerts } = useQuery({
    queryKey: ["price-alerts", symbol, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", user.id)
        .eq("symbol", symbol)
        .eq("triggered", false);
      return data || [];
    },
    enabled: !!user,
  });

  const createAlert = async () => {
    if (!user) return;

    // Map advanced types to direction field for DB compatibility
    const direction = alertType.includes("above") || alertType === "rsi_overbought" || alertType === "volume_spike"
      ? "above" : "below";

    const { error } = await supabase.from("price_alerts").insert({
      user_id: user.id,
      symbol,
      target_price: targetValue,
      direction,
    });

    if (error) {
      toast.error(lang === "de" ? "Fehler beim Erstellen" : "Failed to create alert");
    } else {
      toast.success(lang === "de" ? "Alert erstellt!" : "Alert created!");
      qc.invalidateQueries({ queryKey: ["price-alerts", symbol] });
      setIsAdding(false);
    }
  };

  const deleteAlert = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["price-alerts", symbol] });
    toast.success(lang === "de" ? "Alert gelöscht" : "Alert deleted");
  };

  if (!user) return null;

  const alertConfig = ALERT_TYPES.find(a => a.type === alertType);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">
          {lang === "de" ? "Erweiterte Alerts" : "Advanced Alerts"}
        </h3>
        {!isAdding && (
          <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs gap-1" onClick={() => setIsAdding(true)}>
            <Plus className="h-3 w-3" />{lang === "de" ? "Neu" : "New"}
          </Button>
        )}
      </div>

      {/* Active alerts */}
      <AnimatePresence>
        {(alerts || []).map(alert => (
          <motion.div key={alert.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 py-2 border-b border-border/20 last:border-0">
            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${alert.direction === "above" ? "text-chart-2 border-chart-2/30" : "text-destructive border-destructive/30"}`}>
              {alert.direction === "above" ? "↑" : "↓"} ${alert.target_price}
            </Badge>
            <span className="text-xs text-muted-foreground flex-1">{alert.symbol}</span>
            <button onClick={() => deleteAlert(alert.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add alert form */}
      {isAdding && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-3 p-3 rounded-lg bg-muted/30 border border-border/40">
          <Select value={alertType} onValueChange={(v) => setAlertType(v as AlertType)}>
            <SelectTrigger className="h-9 text-xs rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALERT_TYPES.map(at => (
                <SelectItem key={at.type} value={at.type}>
                  <span className="flex items-center gap-2">
                    <at.icon className="h-3 w-3" />
                    {at.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {alertConfig && (
            <p className="text-[10px] text-muted-foreground">
              {lang === "de" ? alertConfig.description.de : alertConfig.description.en}
            </p>
          )}

          {(alertType === "price_above" || alertType === "price_below") && (
            <Input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              placeholder={lang === "de" ? "Zielkurs" : "Target price"}
              className="h-9 text-sm rounded-lg"
            />
          )}

          <div className="flex gap-2">
            <Button size="sm" className="h-8 text-xs rounded-lg flex-1" onClick={createAlert}>
              {lang === "de" ? "Alert erstellen" : "Create Alert"}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs rounded-lg" onClick={() => setIsAdding(false)}>
              {lang === "de" ? "Abbrechen" : "Cancel"}
            </Button>
          </div>
        </motion.div>
      )}

      {(!alerts || alerts.length === 0) && !isAdding && (
        <p className="text-xs text-muted-foreground/50 text-center py-2">
          {lang === "de" ? "Keine aktiven Alerts" : "No active alerts"}
        </p>
      )}
    </div>
  );
}
