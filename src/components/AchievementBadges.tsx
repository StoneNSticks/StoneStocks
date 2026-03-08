/**
 * Phase 48: Achievement System — Badges for milestones
 */
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, MessageSquare, Eye, TrendingUp, BookOpen, Target, Flame } from "lucide-react";

const BADGES = [
  { id: "first_watchlist", icon: Star, en: "First Watch", de: "Erster Stern", descEn: "Added first stock to watchlist", descDe: "Erste Aktie zur Watchlist", check: "watchlist", threshold: 1 },
  { id: "watchlist_10", icon: Eye, en: "Eagle Eye", de: "Adlerauge", descEn: "Tracking 10+ stocks", descDe: "10+ Aktien beobachtet", check: "watchlist", threshold: 10 },
  { id: "first_comment", icon: MessageSquare, en: "Voice Heard", de: "Stimme gehört", descEn: "Posted first comment", descDe: "Ersten Kommentar gepostet", check: "comments", threshold: 1 },
  { id: "first_portfolio", icon: TrendingUp, en: "Investor", de: "Investor", descEn: "Created first portfolio position", descDe: "Erste Portfolio-Position", check: "portfolio", threshold: 1 },
  { id: "portfolio_5", icon: Target, en: "Diversified", de: "Diversifiziert", descEn: "5+ portfolio positions", descDe: "5+ Portfolio-Positionen", check: "portfolio", threshold: 5 },
  { id: "voter", icon: Flame, en: "Sentiment Voter", de: "Stimmungsgeber", descEn: "Voted on stock sentiment", descDe: "Über Stimmung abgestimmt", check: "votes", threshold: 1 },
  { id: "learner", icon: BookOpen, en: "Scholar", de: "Gelehrter", descEn: "Completed a learning section", descDe: "Lernabschnitt abgeschlossen", check: "learn", threshold: 1 },
  { id: "alert_master", icon: Trophy, en: "Alert Master", de: "Alarm-Meister", descEn: "Created 5+ price alerts", descDe: "5+ Kursalarme erstellt", check: "alerts", threshold: 5 },
];

export function AchievementBadges() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const { data: counts } = useQuery({
    queryKey: ["achievement-counts", user?.id],
    queryFn: async () => {
      if (!user) return { watchlist: 0, comments: 0, portfolio: 0, votes: 0, learn: 0, alerts: 0 };
      const [w, c, p, v, l, a] = await Promise.all([
        supabase.from("watchlist").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("stock_comments").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("portfolio_positions").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("stock_votes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("learn_progress").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("price_alerts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      return { watchlist: w.count || 0, comments: c.count || 0, portfolio: p.count || 0, votes: v.count || 0, learn: l.count || 0, alerts: a.count || 0 };
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  const earned = useMemo(() => {
    if (!counts) return [];
    return BADGES.filter(b => {
      const val = counts[b.check as keyof typeof counts] || 0;
      return val >= b.threshold;
    });
  }, [counts]);

  if (!user || !counts) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Errungenschaften" : "Achievements"}</h3>
        <span className="text-xs text-muted-foreground font-mono ml-auto">{earned.length}/{BADGES.length}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BADGES.map(b => {
          const isEarned = earned.some(e => e.id === b.id);
          const Icon = b.icon;
          return (
            <div key={b.id} className={`rounded-lg p-3 text-center transition-all ${isEarned ? "bg-primary/10 border border-primary/20" : "bg-muted/30 opacity-40"}`}>
              <Icon className={`h-6 w-6 mx-auto mb-1 ${isEarned ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-xs font-bold">{lang === "de" ? b.de : b.en}</div>
              <div className="text-[10px] text-muted-foreground">{lang === "de" ? b.descDe : b.descEn}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
