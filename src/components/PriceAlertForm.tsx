/**
 * PriceAlertForm — Allows authenticated users to set price alerts on a stock.
 * Creates entries in the price_alerts table with target_price and direction (above/below).
 * Displayed on StockDetail pages via a bell icon button that opens a popover.
 */
import { useState } from "react";
import { Bell, BellPlus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useT, useLanguage } from "@/contexts/LanguageContext";

export function PriceAlertForm({ symbol, currentPrice }: { symbol: string; currentPrice?: number }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { lang } = useLanguage();
  const qc = useQueryClient();
  const [targetPrice, setTargetPrice] = useState(currentPrice ? Math.round(currentPrice * 1.1) : 0);
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [open, setOpen] = useState(false);

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

  const handleSubmit = async () => {
    if (!user) return;
    const { error } = await supabase.from("price_alerts").insert({
      user_id: user.id,
      symbol,
      target_price: targetPrice,
      direction,
    });
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({ title: lang === "de" ? "Kursalarm gesetzt!" : "Price alert set!" });
      qc.invalidateQueries({ queryKey: ["price-alerts", symbol] });
      setOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["price-alerts", symbol] });
  };

  if (!user) return null;

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
      <PopoverContent className="w-72" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BellPlus className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-sm">{lang === "de" ? "Kursalarm setzen" : "Set Price Alert"}</span>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">{lang === "de" ? "Zielkurs" : "Target Price"}</Label>
            <Input type="number" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} className="mt-1" step="0.01" />
          </div>

          <div className="flex gap-1">
            <button onClick={() => setDirection("above")} className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors ${direction === "above" ? "bg-chart-2/20 text-chart-2 border border-chart-2/30" : "bg-muted text-muted-foreground"}`}>
              <TrendingUp className="h-3 w-3" />{lang === "de" ? "Über" : "Above"}
            </button>
            <button onClick={() => setDirection("below")} className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors ${direction === "below" ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-muted text-muted-foreground"}`}>
              <TrendingDown className="h-3 w-3" />{lang === "de" ? "Unter" : "Below"}
            </button>
          </div>

          <Button onClick={handleSubmit} className="w-full" size="sm">{lang === "de" ? "Alarm setzen" : "Set Alert"}</Button>

          {alerts && alerts.length > 0 && (
            <div className="border-t border-border/40 pt-2 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{lang === "de" ? "Aktive Alarme" : "Active Alerts"}</span>
              {alerts.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between text-xs">
                  <span className={a.direction === "above" ? "text-chart-2" : "text-destructive"}>
                    {a.direction === "above" ? "↑" : "↓"} ${a.target_price}
                  </span>
                  <button onClick={() => handleDelete(a.id)} className="text-muted-foreground hover:text-destructive text-[10px]">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
