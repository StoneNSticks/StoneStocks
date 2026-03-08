/**
 * StockComments — Per-stock comment section for logged-in users.
 * Reads/writes to the `stock_comments` table in Supabase.
 * Shows latest comments with realtime subscription for live updates.
 */
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useT } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  display_name?: string;
}

export function StockComments({ symbol }: { symbol: string }) {
  const { user } = useAuth();
  const t = useT();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await (supabase as any)
        .from("stock_comments")
        .select("id, content, created_at, user_id")
        .eq("symbol", symbol)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) {
        const userIds = [...new Set(data.map((c: any) => c.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, username")
          .in("id", userIds as string[]);
        const nameMap: Record<string, string> = {};
        profiles?.forEach(p => { nameMap[p.id] = p.display_name || p.username || "User"; });
        setComments(data.map((c: any) => ({ ...c, display_name: nameMap[c.user_id] || "User" })));
      }
    };
    fetchComments();

    const channel = supabase
      .channel(`comments-${symbol}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "stock_comments", filter: `symbol=eq.${symbol}` }, async (payload) => {
        const newC = payload.new as any;
        const { data: prof } = await supabase.from("profiles").select("display_name, username").eq("id", newC.user_id).single();
        setComments(prev => [{ ...newC, display_name: prof?.display_name || prof?.username || "User" }, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [symbol]);

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;
    setLoading(true);
    await (supabase as any).from("stock_comments").insert({
      symbol,
      user_id: user.id,
      content: newComment.trim(),
    });
    setNewComment("");
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4 flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-primary" />
        {t("comments.title")} ({comments.length})
      </h3>

      {user && (
        <div className="flex gap-2 mb-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("comments.placeholder")}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            maxLength={280}
          />
          <Button size="icon" onClick={handleSubmit} disabled={loading || !newComment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">{t("comments.empty")}</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {comments.map(c => (
            <div key={c.id} className="rounded-lg bg-muted/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{c.display_name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
