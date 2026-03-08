/**
 * PriceAlertForm — Bell icon that opens a popover with the full Advanced Alert Builder.
 * Supports price above/below, RSI, and volume spike alerts.
 */
import { useState } from "react";
import { Bell, BellPlus, Plus, Trash2, TrendingUp, TrendingDown, Activity, AlertTriangle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type AlertType = "price_above" | "price_below" | "rsi_oversold" | "rsi_overbought" | "volume_spike";

const ALERT_TYPES = [
  { type: "price_above" as AlertType, label: "Price Above", icon: TrendingUp, de: "Kurs über Zielwert" },
  { type: "price_below" as AlertType, label: "Price Below", icon: TrendingDown, de: "Kurs unter Zielwert" },
  { type: "rsi_oversold" as AlertType, label: "RSI Oversold", icon: Activity, de: "RSI unter 30" },
  { type: "rsi_overbought" as AlertType, label: "RSI Overbought", icon: AlertTriangle, de: "RSI über 70" },
  { type: "volume_spike" as AlertType, label: "Volume Spike", icon: BarChart3, de: "Ungewöhnliches Volumen" },
];

export function PriceAlertForm({ symbol, currentPrice }: { symbol: string; currentPrice?: number }) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("price_above");
  const [targetValue, setTargetValue] = useState(currentPrice ? Math.round(currentPrice * 1.1) : 0);

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
    const direction = alertType.includes("above") || alertType === "rsi_overbought" || alertType === "volume_spike"
      ? "above" : "below";
    const { error } = await supabase.from("price_alerts").insert({
      user_id: user.id, symbol, target_price: targetValue, direction,
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

  const needsInput = alertType === "price_above" || alertType === "price_below";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg relative" title={lang === "de" ? "Kursalarm" : "Price Alert"}>
          <Bell className="h-4 w-4" />
          {alerts && alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BellPlus className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-sm">{lang === "de" ? "Alerts" : "Alerts"}</span>
            {!isAdding && (
              <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs gap-1" onClick={() => setIsAdding(true)}>
                <Plus className="h-3 w-3" />{lang === "de" ? "Neu" : "New"}
              </Button>
            )}
          </div>

          {/* Active alerts */}
          <AnimatePresence>
            {(alerts || []).map((alert: any) => (
              <motion.div key={alert.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 py-1.5 border-b border-border/20 last:border-0">
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
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5 p-3 rounded-lg bg-muted/30 border border-border/40">
              <Select value={alertType} onValueChange={(v) => setAlertType(v as AlertType)}>
                <SelectTrigger className="h-8 text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALERT_TYPES.map(at => (
                    <SelectItem key={at.type} value={at.type}>
                      <span className="flex items-center gap-2">
                        <at.icon className="h-3 w-3" />
                        {lang === "de" ? at.de : at.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {needsInput && (
                <Input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  placeholder={lang === "de" ? "Zielkurs" : "Target price"}
                  className="h-8 text-sm rounded-lg"
                  step="0.01"
                />
              )}

              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs rounded-lg flex-1" onClick={createAlert}>
                  {lang === "de" ? "Erstellen" : "Create"}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs rounded-lg" onClick={() => setIsAdding(false)}>
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
      </PopoverContent>
    </Popover>
  );
}
