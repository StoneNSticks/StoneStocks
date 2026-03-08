/**
 * Phase 22: Economic Calendar
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, AlertTriangle, TrendingUp } from "lucide-react";

const EVENTS = [
  { date: "2026-03-10", time: "08:30", event: "CPI (YoY)", eventDe: "VPI (JüJ)", country: "US", previous: "3.1%", forecast: "2.9%", impact: "high" },
  { date: "2026-03-12", time: "14:00", event: "Fed Interest Rate Decision", eventDe: "Fed Zinsentscheid", country: "US", previous: "5.25%", forecast: "5.25%", impact: "high" },
  { date: "2026-03-14", time: "08:30", event: "Retail Sales (MoM)", eventDe: "Einzelhandelsumsätze (MüM)", country: "US", previous: "0.6%", forecast: "0.3%", impact: "medium" },
  { date: "2026-03-15", time: "10:00", event: "Consumer Sentiment", eventDe: "Verbraucherstimmung", country: "US", previous: "79.4", forecast: "80.0", impact: "medium" },
  { date: "2026-03-18", time: "03:00", event: "ECB Rate Decision", eventDe: "EZB Zinsentscheid", country: "EU", previous: "4.50%", forecast: "4.25%", impact: "high" },
  { date: "2026-03-19", time: "08:30", event: "Initial Jobless Claims", eventDe: "Erstanträge Arbeitslosenhilfe", country: "US", previous: "217K", forecast: "215K", impact: "low" },
  { date: "2026-03-21", time: "09:45", event: "PMI Manufacturing", eventDe: "PMI Verarbeitendes Gewerbe", country: "US", previous: "52.2", forecast: "52.5", impact: "medium" },
  { date: "2026-03-25", time: "10:00", event: "CB Consumer Confidence", eventDe: "CB Verbrauchervertrauen", country: "US", previous: "106.7", forecast: "107.0", impact: "medium" },
  { date: "2026-03-28", time: "08:30", event: "GDP (QoQ)", eventDe: "BIP (QüQ)", country: "US", previous: "3.2%", forecast: "2.8%", impact: "high" },
  { date: "2026-03-28", time: "08:30", event: "Core PCE Price Index", eventDe: "Kern-PCE Preisindex", country: "US", previous: "2.8%", forecast: "2.7%", impact: "high" },
];

export default function EconomicCalendarPage() {
  const { lang } = useLanguage();
  usePageTitle(lang === "de" ? "Wirtschaftskalender" : "Economic Calendar");

  const impactColor = (i: string) => i === "high" ? "text-destructive" : i === "medium" ? "text-yellow-500" : "text-muted-foreground";
  const impactBg = (i: string) => i === "high" ? "bg-destructive/10" : i === "medium" ? "bg-yellow-500/10" : "bg-muted";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 px-3 sm:px-4 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent"><CalendarDays className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Wirtschaftskalender" : "Economic Calendar"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? "Wichtige Makro-Events und Termine" : "Key macro events and dates"}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline" className="gap-1"><span className="h-2 w-2 rounded-full bg-destructive" />{lang === "de" ? "Hoch" : "High"}</Badge>
          <Badge variant="outline" className="gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" />{lang === "de" ? "Mittel" : "Medium"}</Badge>
          <Badge variant="outline" className="gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground" />{lang === "de" ? "Niedrig" : "Low"}</Badge>
        </div>

        <div className="space-y-2">
          {EVENTS.map((e, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${impactBg(e.impact)}`}>
                    {e.impact === "high" ? <AlertTriangle className={`h-4 w-4 ${impactColor(e.impact)}`} /> : <TrendingUp className={`h-4 w-4 ${impactColor(e.impact)}`} />}
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm">{lang === "de" ? e.eventDe : e.event}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />{e.date} {e.time} ET
                      <Badge variant="secondary" className="text-[10px] px-1">{e.country}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground">{lang === "de" ? "Vorher" : "Previous"}</div>
                    <div className="font-mono font-bold">{e.previous}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">{lang === "de" ? "Prognose" : "Forecast"}</div>
                    <div className="font-mono font-bold text-primary">{e.forecast}</div>
                  </div>
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
