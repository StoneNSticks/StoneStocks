import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Star, Shield, Save, CheckCircle, Edit3 } from "lucide-react";
import { AchievementBadges } from "@/components/AchievementBadges";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { data: watchlist } = useWatchlist();
  const t = useT();
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Mein Profil" : "My Profile",
    lang === "de" ? "Profildaten und Kontoübersicht" : "Profile data and account overview"
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, username, email")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setUsername(data.username || "");
          setEmail(data.email || user.email || "");
        }
        setLoaded(true);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, username: username.toLowerCase() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: t("profile.errorSaving"), variant: "destructive" });
    } else {
      toast({ title: t("profile.saved") });
      setEditing(false);
    }
  };

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  if (authLoading || !loaded) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 max-w-xl">
          <Skeleton className="h-[400px] rounded-2xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-xl px-3 sm:px-4 w-full">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Avatar & Name Header */}
          <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/30" />
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-10">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent border-4 border-card flex items-center justify-center shadow-xl">
                  <span className="font-display text-3xl font-bold text-primary-foreground drop-shadow-md">
                    {(displayName || username || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <h1 className="font-display text-xl font-bold truncate">{displayName || username}</h1>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" />
                  {editing ? t("profile.cancel") : t("profile.edit")}
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Star className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <div className="font-display font-bold text-lg">{watchlist?.length ?? 0}</div>
                  <div className="text-xs text-muted-foreground">{t("profile.watchlistCount")}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <div className="font-display font-bold text-sm">{createdAt}</div>
                  <div className="text-xs text-muted-foreground">{t("profile.memberSince")}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <Shield className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <Badge variant="secondary" className="text-xs">{t("profile.freeAccount")}</Badge>
                  <div className="text-xs text-muted-foreground mt-0.5">{t("profile.plan")}</div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="mt-6 space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><User className="h-3 w-3" />{t("profile.displayName")}</Label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={!editing} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><User className="h-3 w-3" />{t("auth.username")}</Label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} disabled={!editing} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="h-3 w-3" />{t("auth.email")}</Label>
                  <Input value={email} disabled className="mt-1 opacity-60" />
                  <p className="text-xs text-muted-foreground mt-1">{t("profile.emailHint")}</p>
                </div>
                {editing && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                      {saving ? <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                      {t("profile.saveChanges")}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
