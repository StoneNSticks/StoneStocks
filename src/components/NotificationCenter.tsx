/**
 * NotificationCenter — Central hub for all alerts, earnings reminders and activity.
 * Opens as a Sheet from the header bell icon.
 */
import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, BellRing, TrendingUp, TrendingDown, Calendar, Trash2, CheckCheck, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useT } from "@/contexts/LanguageContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

export function NotificationCenter() {
  const { user } = useAuth();
  const t = useT();
  const { lang } = useLanguage();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  // Fetch triggered price alerts
  const { data: triggeredAlerts = [] } = useQuery({
    queryKey: ["triggered-alerts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", user.id)
        .eq("triggered", true)
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  // Fetch active (untriggered) alerts
  const { data: activeAlerts = [] } = useQuery({
    queryKey: ["active-alerts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", user.id)
        .eq("triggered", false)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  // Fetch earnings notifications
  const { data: earningsNotifs = [] } = useQuery({
    queryKey: ["earnings-notifs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("earnings_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("notified_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  const totalCount = triggeredAlerts.length + earningsNotifs.length;

  const deleteAlert = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["triggered-alerts"] });
    qc.invalidateQueries({ queryKey: ["active-alerts"] });
    qc.invalidateQueries({ queryKey: ["price-alerts"] });
  };

  const clearAllTriggered = async () => {
    if (!user) return;
    await supabase.from("price_alerts").delete().eq("user_id", user.id).eq("triggered", true);
    qc.invalidateQueries({ queryKey: ["triggered-alerts"] });
    qc.invalidateQueries({ queryKey: ["price-alerts"] });
  };

  const dateFmtLocale = lang === "de" ? de : enUS;

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          {totalCount > 0 ? (
            <BellRing className="h-4 w-4 text-primary" />
          ) : (
            <Bell className="h-4 w-4 text-muted-foreground" />
          )}
          {totalCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              {totalCount > 9 ? "9+" : totalCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[420px] p-0">
        <SheetHeader className="p-4 pb-2 border-b border-border/40">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" />
            {lang === "de" ? "Benachrichtigungen" : "Notifications"}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="triggered" className="flex flex-col h-[calc(100vh-80px)]">
          <TabsList className="mx-4 mt-3 grid grid-cols-3 h-9">
            <TabsTrigger value="triggered" className="text-xs gap-1">
              <AlertTriangle className="h-3 w-3" />
              {lang === "de" ? "Ausgelöst" : "Triggered"}
              {triggeredAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 px-1 text-[10px]">{triggeredAlerts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs gap-1">
              <TrendingUp className="h-3 w-3" />
              {lang === "de" ? "Aktiv" : "Active"}
              {activeAlerts.length > 0 && (
                <Badge className="ml-1 h-4 px-1 text-[10px]">{activeAlerts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="earnings" className="text-xs gap-1">
              <Calendar className="h-3 w-3" />
              Earnings
              {earningsNotifs.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{earningsNotifs.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="triggered" className="flex-1 overflow-y-auto px-4 pb-4">
            {triggeredAlerts.length > 0 && (
              <div className="flex justify-end mb-2">
                <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground" onClick={clearAllTriggered}>
                  <CheckCheck className="h-3 w-3 mr-1" />
                  {lang === "de" ? "Alle löschen" : "Clear all"}
                </Button>
              </div>
            )}
            <AnimatePresence>
              {triggeredAlerts.length === 0 ? (
                <EmptyState icon={<AlertTriangle className="h-10 w-10" />} text={lang === "de" ? "Keine ausgelösten Alerts" : "No triggered alerts"} />
              ) : (
                triggeredAlerts.map((alert: any) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/30 mb-2"
                  >
                    <div className={`p-1.5 rounded-lg ${alert.direction === "above" ? "bg-chart-2/10" : "bg-destructive/10"}`}>
                      {alert.direction === "above" ? (
                        <TrendingUp className="h-4 w-4 text-chart-2" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/stock/${alert.symbol}`} onClick={() => setOpen(false)} className="font-mono font-bold text-sm hover:text-primary transition-colors">
                        {alert.symbol}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {alert.direction === "above" ? "↑" : "↓"} ${alert.target_price}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70">
                        {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true, locale: dateFmtLocale })}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => deleteAlert(alert.id)}>
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="active" className="flex-1 overflow-y-auto px-4 pb-4">
            {activeAlerts.length === 0 ? (
              <EmptyState icon={<TrendingUp className="h-10 w-10" />} text={lang === "de" ? "Keine aktiven Alerts" : "No active alerts"} />
            ) : (
              activeAlerts.map((alert: any) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 mb-2">
                  <div className={`p-1.5 rounded-lg ${alert.direction === "above" ? "bg-primary/10" : "bg-destructive/10"}`}>
                    {alert.direction === "above" ? (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/stock/${alert.symbol}`} onClick={() => setOpen(false)} className="font-mono font-bold text-sm hover:text-primary transition-colors">
                      {alert.symbol}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {lang === "de" ? "Ziel" : "Target"}: ${alert.target_price} ({alert.direction === "above" ? "↑" : "↓"})
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => deleteAlert(alert.id)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="earnings" className="flex-1 overflow-y-auto px-4 pb-4">
            {earningsNotifs.length === 0 ? (
              <EmptyState icon={<Calendar className="h-10 w-10" />} text={lang === "de" ? "Keine Earnings-Erinnerungen" : "No earnings reminders"} />
            ) : (
              earningsNotifs.map((notif: any) => (
                <div key={notif.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 mb-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/stock/${notif.symbol}`} onClick={() => setOpen(false)} className="font-mono font-bold text-sm hover:text-primary transition-colors">
                      {notif.symbol}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Earnings: {new Date(notif.earnings_date).toLocaleDateString(lang === "de" ? "de-DE" : "en-US")}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {formatDistanceToNow(new Date(notif.notified_at), { addSuffix: true, locale: dateFmtLocale })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
      {icon}
      <p className="text-sm mt-3">{text}</p>
    </div>
  );
}
