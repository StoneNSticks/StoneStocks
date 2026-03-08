/**
 * Phase 18: IPO Calendar
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge } from "@/components/ui/badge";
import { Rocket, Calendar, DollarSign, Building } from "lucide-react";

const UPCOMING_IPOS = [
  { company: "CoreWeave", ticker: "CRWV", date: "2026-03-15", priceRange: "$40-47", sector: "Cloud/AI", exchange: "NASDAQ", status: "upcoming" },
  { company: "Databricks", ticker: "DBR", date: "2026-04-02", priceRange: "$60-72", sector: "Data/AI", exchange: "NYSE", status: "upcoming" },
  { company: "Stripe", ticker: "STRP", date: "2026-05-10", priceRange: "$80-95", sector: "Fintech", exchange: "NYSE", status: "upcoming" },
  { company: "Klarna", ticker: "KLAR", date: "2026-06-01", priceRange: "$52-65", sector: "Fintech", exchange: "NYSE", status: "upcoming" },
  { company: "Discord", ticker: "DISC", date: "2026-Q3", priceRange: "TBD", sector: "Social", exchange: "NASDAQ", status: "rumored" },
];

const RECENT_IPOS = [
  { company: "Reddit", ticker: "RDDT", date: "2024-03-21", ipoPrice: "$34.00", currentPrice: "$145.23", change: 327.1, sector: "Social" },
  { company: "Astera Labs", ticker: "ALAB", date: "2024-03-20", ipoPrice: "$36.00", currentPrice: "$78.45", change: 117.9, sector: "Semiconductors" },
  { company: "Arm Holdings", ticker: "ARM", date: "2023-09-14", ipoPrice: "$51.00", currentPrice: "$132.67", change: 160.1, sector: "Semiconductors" },
];

export default function IPOCalendarPage() {
  const { lang } = useLanguage();
  usePageTitle(lang === "de" ? "IPO-Kalender" : "IPO Calendar");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 px-3 sm:px-4 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent"><Rocket className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "IPO-Kalender" : "IPO Calendar"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? "Kommende und vergangene Börsengänge" : "Upcoming and recent IPOs"}</p>
          </div>
        </div>

        <h2 className="font-display font-semibold text-lg mb-3 flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />{lang === "de" ? "Kommende IPOs" : "Upcoming IPOs"}</h2>
        <div className="space-y-3 mb-8">
          {UPCOMING_IPOS.map(ipo => (
            <div key={ipo.ticker} className="rounded-xl border border-border/60 bg-card p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{ipo.ticker.slice(0, 2)}</div>
                  <div>
                    <div className="font-display font-bold text-sm">{ipo.company} <span className="font-mono text-muted-foreground ml-1">{ipo.ticker}</span></div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{ipo.exchange}</span>·<span>{ipo.sector}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Badge variant={ipo.status === "upcoming" ? "default" : "secondary"} className="text-[10px]">{ipo.status === "upcoming" ? (lang === "de" ? "Geplant" : "Planned") : (lang === "de" ? "Gerücht" : "Rumored")}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />{ipo.date}
                    <DollarSign className="h-3 w-3 ml-1" />{ipo.priceRange}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-display font-semibold text-lg mb-3 flex items-center gap-2"><Building className="h-5 w-5 text-primary" />{lang === "de" ? "Vergangene IPOs" : "Recent IPOs"}</h2>
        <div className="space-y-3">
          {RECENT_IPOS.map(ipo => (
            <div key={ipo.ticker} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-display font-bold text-sm">{ipo.company} <span className="font-mono text-muted-foreground">{ipo.ticker}</span></div>
                  <div className="text-xs text-muted-foreground">{ipo.date} · {ipo.sector} · IPO @ {ipo.ipoPrice}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm">{ipo.currentPrice}</div>
                  <div className={`text-xs font-mono font-bold ${ipo.change >= 0 ? "text-chart-2" : "text-destructive"}`}>+{ipo.change.toFixed(1)}% {lang === "de" ? "seit IPO" : "since IPO"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
