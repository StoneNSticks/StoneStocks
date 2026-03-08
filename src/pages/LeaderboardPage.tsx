/**
 * Phase 44: Leaderboard — Top performers (simulated)
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, TrendingUp, Users } from "lucide-react";

const LEADERS = [
  { rank: 1, name: "TraderX", return: 42.5, trades: 156, winRate: 68, streak: 12 },
  { rank: 2, name: "AlphaInvestor", return: 38.2, trades: 89, winRate: 72, streak: 8 },
  { rank: 3, name: "MarketWolf", return: 35.8, trades: 234, winRate: 61, streak: 15 },
  { rank: 4, name: "BullRunner", return: 31.4, trades: 67, winRate: 75, streak: 6 },
  { rank: 5, name: "StockSage", return: 28.9, trades: 112, winRate: 64, streak: 9 },
  { rank: 6, name: "DividendKing", return: 25.3, trades: 45, winRate: 78, streak: 4 },
  { rank: 7, name: "TechTrader", return: 22.7, trades: 189, winRate: 58, streak: 7 },
  { rank: 8, name: "ValueHunter", return: 19.5, trades: 34, winRate: 82, streak: 3 },
  { rank: 9, name: "SwingMaster", return: 17.2, trades: 201, winRate: 55, streak: 11 },
  { rank: 10, name: "CalmInvestor", return: 15.8, trades: 28, winRate: 85, streak: 2 },
];

const rankIcon = (r: number) => {
  if (r === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (r === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (r === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return <span className="font-mono font-bold text-sm text-muted-foreground w-5 text-center">{r}</span>;
};

export default function LeaderboardPage() {
  const { lang } = useLanguage();
  usePageTitle(lang === "de" ? "Bestenliste" : "Leaderboard");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 px-3 sm:px-4 lg:px-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent"><Trophy className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Bestenliste" : "Leaderboard"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? "Top-Performer nach Portfolio-Rendite" : "Top performers by portfolio returns"}</p>
          </div>
          <Badge variant="secondary" className="ml-auto gap-1"><Users className="h-3 w-3" />{lang === "de" ? "Paper Trading" : "Paper Trading"}</Badge>
        </div>
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
          <div className="grid grid-cols-[3rem_1fr_5rem_4rem_4rem_4rem] gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
            <span>#</span><span>{lang === "de" ? "Nutzer" : "User"}</span>
            <span className="text-right">{lang === "de" ? "Rendite" : "Return"}</span>
            <span className="text-right">Trades</span>
            <span className="text-right">{lang === "de" ? "Gewinnrate" : "Win %"}</span>
            <span className="text-right">Streak</span>
          </div>
          {LEADERS.map(l => (
            <div key={l.rank} className={`grid grid-cols-[3rem_1fr_5rem_4rem_4rem_4rem] gap-2 px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors items-center ${l.rank <= 3 ? "bg-primary/[0.03]" : ""}`}>
              <div className="flex items-center justify-center">{rankIcon(l.rank)}</div>
              <div className="font-display font-bold text-sm">{l.name}</div>
              <div className="text-right font-mono text-sm font-bold text-chart-2 flex items-center justify-end gap-0.5">
                <TrendingUp className="h-3 w-3" />+{l.return}%
              </div>
              <div className="text-right font-mono text-xs text-muted-foreground">{l.trades}</div>
              <div className="text-right font-mono text-xs">{l.winRate}%</div>
              <div className="text-right font-mono text-xs">🔥{l.streak}</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
