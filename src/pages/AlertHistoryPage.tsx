/**
 * Phase 71: Alert History — shows all triggered and active alerts
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BellRing, TrendingUp, TrendingDown, LogIn, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertHistoryPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  usePageTitle(lang === "de" ? "Alert-Verlauf" : "Alert History");

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["all-alerts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("price_alerts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const triggered = alerts?.filter((a: any) => a.triggered) || [];
  const active = alerts?.filter((a: any) => !a.triggered) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 px-3 sm:px-4 lg:px-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent"><BellRing className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Alert-Verlauf" : "Alert History"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? "Alle aktiven und ausgelösten Alarme" : "All active and triggered alerts"}</p>
          </div>
        </div>

        {!user ? (
          <div className="text-center py-20">
            <BellRing className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{lang === "de" ? "Melde dich an, um Alarme zu sehen" : "Sign in to view alerts"}</p>
            <Button asChild><Link to="/auth"><LogIn className="h-4 w-4 mr-2" />{lang === "de" ? "Anmelden" : "Sign In"}</Link></Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{lang === "de" ? "Aktive Alarme" : "Active Alerts"} <Badge variant="secondary">{active.length}</Badge></h3>
                <div className="space-y-2">
                  {active.map((a: any) => (
                    <Link key={a.id} to={`/stock/${a.symbol}`} className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {a.direction === "above" ? <TrendingUp className="h-4 w-4 text-chart-2" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                        <div>
                          <span className="font-mono font-bold text-sm">{a.symbol}</span>
                          <span className="text-xs text-muted-foreground ml-2">{a.direction === "above" ? "≥" : "≤"} ${a.target_price?.toFixed(2)}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{lang === "de" ? "Wartend" : "Pending"}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {triggered.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><BellRing className="h-4 w-4 text-chart-2" />{lang === "de" ? "Ausgelöste Alarme" : "Triggered Alerts"} <Badge variant="secondary">{triggered.length}</Badge></h3>
                <div className="space-y-2">
                  {triggered.map((a: any) => (
                    <Link key={a.id} to={`/stock/${a.symbol}`} className="flex items-center justify-between rounded-xl border border-chart-2/20 bg-chart-2/5 p-4 hover:bg-chart-2/10 transition-colors">
                      <div className="flex items-center gap-3">
                        {a.direction === "above" ? <TrendingUp className="h-4 w-4 text-chart-2" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                        <div>
                          <span className="font-mono font-bold text-sm">{a.symbol}</span>
                          <span className="text-xs text-muted-foreground ml-2">{a.direction === "above" ? "≥" : "≤"} ${a.target_price?.toFixed(2)}</span>
                        </div>
                      </div>
                      <Badge className="text-[10px] bg-chart-2/15 text-chart-2 border-chart-2/30">{lang === "de" ? "Ausgelöst" : "Triggered"}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(!alerts || alerts.length === 0) && (
              <div className="text-center py-16">
                <BellRing className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">{lang === "de" ? "Noch keine Alarme erstellt" : "No alerts created yet"}</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
