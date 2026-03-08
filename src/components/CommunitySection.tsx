import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, MessageCircle, Send, Trash2, Reply, ChevronDown, ChevronUp, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  display_name: string;
  show_username: boolean;
}

export function CommunitySection({ symbol }: { symbol: string }) {
  const { user } = useAuth();
  const t = useT();
  const { lang } = useLanguage();

  // Vote state
  const [bulls, setBulls] = useState(0);
  const [bears, setBears] = useState(0);
  const [userVote, setUserVote] = useState<"bullish" | "bearish" | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  // Fetch votes
  useEffect(() => {
    const fetchVotes = async () => {
      const { data } = await (supabase as any)
        .from("stock_votes")
        .select("vote, user_id")
        .eq("symbol", symbol);
      if (data) {
        setBulls(data.filter((v: any) => v.vote === "bullish").length);
        setBears(data.filter((v: any) => v.vote === "bearish").length);
        if (user) {
          const myVote = data.find((v: any) => v.user_id === user.id);
          setUserVote(myVote ? (myVote.vote as "bullish" | "bearish") : null);
        }
      }
    };
    fetchVotes();
  }, [symbol, user]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await (supabase as any)
        .from("stock_comments")
        .select("id, content, created_at, user_id, parent_id")
        .eq("symbol", symbol)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) {
        const userIds = [...new Set(data.map((c: any) => c.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, username, show_username")
          .in("id", userIds as string[]);
        const profileMap: Record<string, { name: string; show: boolean }> = {};
        profiles?.forEach((p: any) => {
          profileMap[p.id] = {
            name: p.display_name || p.username || "User",
            show: p.show_username !== false,
          };
        });
        setComments(data.map((c: any) => ({
          ...c,
          display_name: profileMap[c.user_id]?.name || "User",
          show_username: profileMap[c.user_id]?.show !== false,
        })));
      }
    };
    fetchComments();

    const channel = supabase
      .channel(`community-${symbol}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "stock_comments", filter: `symbol=eq.${symbol}` }, (payload) => {
        const newC = payload.new as any;
        setComments(prev => [{ ...newC, display_name: "User", show_username: true }, ...prev]);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "stock_comments", filter: `symbol=eq.${symbol}` }, (payload) => {
        const oldC = payload.old as any;
        setComments(prev => prev.filter(c => c.id !== oldC.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [symbol]);

  // Vote handler with toggle
  const handleVote = async (v: "bullish" | "bearish") => {
    if (!user) return;
    if (userVote === v) {
      // Remove vote
      const { error } = await (supabase as any)
        .from("stock_votes")
        .delete()
        .eq("user_id", user.id)
        .eq("symbol", symbol);
      if (!error) {
        if (v === "bullish") setBulls(b => b - 1); else setBears(b => b - 1);
        setUserVote(null);
      }
    } else {
      // Upsert vote
      const { error } = await (supabase as any)
        .from("stock_votes")
        .upsert({ user_id: user.id, symbol, vote: v }, { onConflict: "user_id,symbol" });
      if (!error) {
        if (userVote) {
          if (userVote === "bullish") setBulls(b => b - 1); else setBears(b => b - 1);
        }
        if (v === "bullish") setBulls(b => b + 1); else setBears(b => b + 1);
        setUserVote(v);
      }
    }
  };

  // Submit comment
  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;
    setLoading(true);
    await (supabase as any).from("stock_comments").insert({
      symbol,
      user_id: user.id,
      content: newComment.trim(),
      parent_id: replyTo?.id || null,
    });
    setNewComment("");
    setReplyTo(null);
    setLoading(false);
  };

  // Delete comment
  const handleDelete = async (id: string) => {
    await (supabase as any).from("stock_comments").delete().eq("id", id);
    setComments(prev => prev.filter(c => c.id !== id && c.parent_id !== id));
  };

  // Group comments
  const topLevel = useMemo(() => comments.filter(c => !c.parent_id), [comments]);
  const repliesMap = useMemo(() => {
    const map: Record<string, Comment[]> = {};
    comments.filter(c => c.parent_id).forEach(c => {
      if (!map[c.parent_id!]) map[c.parent_id!] = [];
      map[c.parent_id!].push(c);
    });
    // Sort replies oldest first
    Object.values(map).forEach(arr => arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
    return map;
  }, [comments]);

  const total = bulls + bears;
  const bullPct = total > 0 ? (bulls / total) * 100 : 50;

  const toggleThread = (id: string) => {
    setExpandedThreads(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const CommentItem = ({ c, isReply = false }: { c: Comment; isReply?: boolean }) => {
    const replyCount = repliesMap[c.id]?.length || 0;
    const isExpanded = expandedThreads.has(c.id);
    const isOwn = user?.id === c.user_id;

    return (
      <div className={isReply ? "ml-6 border-l-2 border-border/40 pl-3" : ""}>
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-between mb-1 gap-2">
            <span className="text-xs font-medium text-foreground">
              {c.show_username ? c.display_name : (lang === "de" ? "Anonym" : "Anonymous")}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{formatTime(c.created_at)}</span>
              {!isReply && user && (
                <button
                  onClick={() => setReplyTo({ id: c.id, name: c.show_username ? c.display_name : "Anonymous" })}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title={lang === "de" ? "Antworten" : "Reply"}
                >
                  <Reply className="h-3 w-3" />
                </button>
              )}
              {isOwn && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {lang === "de" ? "Kommentar loschen?" : "Delete comment?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {lang === "de"
                          ? "Willst du diesen Kommentar wirklich loschen? Das kann nicht ruckgangig gemacht werden."
                          : "Are you sure you want to delete this comment? This cannot be undone."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{lang === "de" ? "Abbrechen" : "Cancel"}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {lang === "de" ? "Loschen" : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{c.content}</p>
        </div>

        {/* Reply count toggle */}
        {!isReply && replyCount > 0 && (
          <button
            onClick={() => toggleThread(c.id)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-1 ml-1 font-medium transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {replyCount} {replyCount === 1
              ? (lang === "de" ? "Antwort" : "Reply")
              : (lang === "de" ? "Antworten" : "Replies")}
          </button>
        )}

        {/* Expanded replies */}
        {!isReply && isExpanded && repliesMap[c.id]?.map(reply => (
          <div key={reply.id} className="mt-1.5">
            <CommentItem c={reply} isReply />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
      {/* Header */}
      <h3 className="font-display font-semibold text-sm text-muted-foreground flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-primary" />
        {t("sentiment.community")}
      </h3>

      {/* Vote section */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => handleVote("bullish")}
            disabled={!user}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${userVote === "bullish" ? "bg-chart-2/20 text-chart-2 ring-1 ring-chart-2/40" : "bg-muted/50 text-muted-foreground hover:bg-chart-2/10"}`}
          >
            <TrendingUp className="h-4 w-4" /> {t("sentiment.bullish")} ({bulls})
          </button>
          <button
            onClick={() => handleVote("bearish")}
            disabled={!user}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${userVote === "bearish" ? "bg-destructive/20 text-destructive ring-1 ring-destructive/40" : "bg-muted/50 text-muted-foreground hover:bg-destructive/10"}`}
          >
            <TrendingDown className="h-4 w-4" /> {t("sentiment.bearish")} ({bears})
          </button>
        </div>
        {total > 0 && (
          <div className="flex rounded-lg overflow-hidden h-2.5">
            <div className="bg-chart-2/70 transition-all" style={{ width: `${bullPct}%` }} />
            <div className="bg-destructive/70 transition-all" style={{ width: `${100 - bullPct}%` }} />
          </div>
        )}
        {!user && <p className="text-[10px] text-muted-foreground mt-2">{t("sentiment.loginToVote")}</p>}
      </div>

      {/* Comment input */}
      {user && (
        <div>
          {replyTo && (
            <div className="flex items-center gap-2 mb-1.5 text-xs text-primary">
              <Reply className="h-3 w-3" />
              <span>{lang === "de" ? "Antwort an" : "Reply to"} @{replyTo.name}</span>
              <button onClick={() => setReplyTo(null)} className="p-0.5 rounded hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo
                ? (lang === "de" ? "Antwort schreiben..." : "Write a reply...")
                : t("comments.placeholder")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              maxLength={280}
            />
            <Button size="icon" onClick={handleSubmit} disabled={loading || !newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Comments list */}
      {topLevel.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">{t("comments.empty")}</p>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto">
          {topLevel.map(c => (
            <CommentItem key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
