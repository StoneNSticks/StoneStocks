/**
 * Phase 25: Bond Yields Overview with yield curve
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Landmark, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const YIELDS = [
  { maturity: "1M", yield: 5.38, change: -0.02 },
  { maturity: "3M", yield: 5.36, change: -0.01 },
  { maturity: "6M", yield: 5.28, change: 0.01 },
  { maturity: "1Y", yield: 5.05, change: 0.03 },
  { maturity: "2Y", yield: 4.72, change: 0.05 },
  { maturity: "3Y", yield: 4.48, change: 0.04 },
  { maturity: "5Y", yield: 4.32, change: 0.06 },
  { maturity: "7Y", yield: 4.38, change: 0.05 },
  { maturity: "10Y", yield: 4.42, change: 0.07 },
  { maturity: "20Y", yield: 4.68, change: 0.06 },
  { maturity: "30Y", yield: 4.55, change: 0.04 },
];

export default function BondsPage() {
  const { lang } = useLanguage();
  usePageTitle(lang === "de" ? "Anleihen" : "Bonds");
  const chartData = YIELDS.map(y => ({ name: y.maturity, yield: y.yield }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent"><Landmark className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "US Treasury Yields" : "US Treasury Yields"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? "Renditekurve und aktuelle Zinssätze" : "Yield curve and current rates"}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 mb-6">
          <h3 className="font-display font-semibold text-sm mb-3">{lang === "de" ? "Renditekurve" : "Yield Curve"}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v.toFixed(2)}%`, "Yield"]} />
                <Line type="monotone" dataKey="yield" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
          <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
            <span>{lang === "de" ? "Laufzeit" : "Maturity"}</span>
            <span className="text-right">{lang === "de" ? "Rendite" : "Yield"}</span>
            <span className="text-right">{lang === "de" ? "Änderung" : "Change"}</span>
          </div>
          {YIELDS.map(y => {
            const isUp = y.change >= 0;
            return (
              <div key={y.maturity} className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors items-center">
                <span className="font-mono font-bold text-sm">{y.maturity}</span>
                <span className="text-right font-mono text-sm font-semibold">{y.yield.toFixed(2)}%</span>
                <div className={`text-right font-mono text-xs font-semibold flex items-center justify-end gap-0.5 ${isUp ? "text-chart-2" : "text-destructive"}`}>
                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isUp ? "+" : ""}{y.change.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
