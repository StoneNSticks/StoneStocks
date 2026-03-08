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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Settings, Lock, Globe, Palette, Bell, Trash2, LogOut, Moon, Sun, Shield, BellRing, TrendingUp, TrendingDown, X, Eye, EyeOff, MessageSquare } from "lucide-react";

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const t = useT();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [priceAlerts, setPriceAlerts] = useState(() => localStorage.getItem("pref_price_alerts") !== "false");
  const [newsAlerts, setNewsAlerts] = useState(() => localStorage.getItem("pref_news_alerts") !== "false");
  const [commentReplyAlerts, setCommentReplyAlerts] = useState(false);
  const [showUsername, setShowUsername] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch active price alerts
  const { data: alerts } = useQuery({
    queryKey: ["price-alerts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  // Fetch profile settings
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("show_username, comment_reply_alerts").eq("id", user.id).single().then(({ data }) => {
      if (data) {
        setShowUsername((data as any).show_username !== false);
        setCommentReplyAlerts((data as any).comment_reply_alerts === true);
      }
    });
  }, [user]);

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast({ title: t("settings.pwTooShort"), variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: t("settings.pwMismatch"), variant: "destructive" });
      return;
    }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPw(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({ title: t("settings.pwChanged") });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handlePriceAlerts = (v: boolean) => {
    setPriceAlerts(v);
    localStorage.setItem("pref_price_alerts", String(v));
  };
  const handleNewsAlerts = (v: boolean) => {
    setNewsAlerts(v);
    localStorage.setItem("pref_news_alerts", String(v));
  };

  const deleteAlert = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["price-alerts"] });
    toast({ title: lang === "de" ? "Alarm gelöscht" : "Alert deleted" });
  };

  const handleDeleteAccount = async () => {
    toast({ title: t("settings.deleteNotAvailable") });
    setShowDelete(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-border/40">
        <div className="p-2 rounded-lg bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>
        <h2 className="font-display font-semibold text-sm">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </motion.div>
  );

  const SettingRow = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-xl px-3 sm:px-4 w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent"><Settings className="h-5 w-5 text-accent-foreground" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{t("settings.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Appearance */}
          <Section icon={Palette} title={t("settings.appearance")}>
            <SettingRow label={t("settings.darkMode")} desc={t("settings.darkModeDesc")}>
              <div className="flex items-center gap-2">
                <Sun className="h-3.5 w-3.5 text-muted-foreground" />
                <Switch checked={isDark} onCheckedChange={toggleTheme} />
                <Moon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </SettingRow>
          </Section>

          {/* Language */}
          <Section icon={Globe} title={t("settings.language")}>
            <SettingRow label={t("settings.appLanguage")} desc={t("settings.languageDesc")}>
              <div className="flex gap-1 rounded-lg border border-border/60 p-0.5">
                <button onClick={() => setLang("de")} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${lang === "de" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>DE</button>
                <button onClick={() => setLang("en")} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>EN</button>
              </div>
            </SettingRow>
          </Section>

          {/* Privacy */}
          <Section icon={Eye} title={lang === "de" ? "Privatsphare" : "Privacy"}>
            <SettingRow
              label={lang === "de" ? "Benutzername in Kommentaren anzeigen" : "Show username in comments"}
              desc={lang === "de" ? "Wenn deaktiviert, erscheinst du als 'Anonym'" : "If disabled, you appear as 'Anonymous'"}
            >
              <Switch checked={showUsername} onCheckedChange={async (v) => {
                setShowUsername(v);
                if (user) await (supabase as any).from("profiles").update({ show_username: v }).eq("id", user.id);
              }} />
            </SettingRow>
          </Section>

          {/* Notifications */}
          <Section icon={Bell} title={t("settings.notifications")}>
            <SettingRow label={t("settings.priceAlerts")} desc={t("settings.priceAlertsDesc")}>
              <Switch checked={priceAlerts} onCheckedChange={handlePriceAlerts} />
            </SettingRow>
            <SettingRow label={t("settings.newsAlerts")} desc={t("settings.newsAlertsDesc")}>
              <Switch checked={newsAlerts} onCheckedChange={handleNewsAlerts} />
            </SettingRow>
            <SettingRow
              label={lang === "de" ? "Antworten auf Kommentare" : "Comment reply alerts"}
              desc={lang === "de" ? "Benachrichtigung wenn jemand auf deinen Kommentar antwortet" : "Get notified when someone replies to your comment"}
            >
              <Switch checked={commentReplyAlerts} onCheckedChange={async (v) => {
                setCommentReplyAlerts(v);
                if (user) await (supabase as any).from("profiles").update({ comment_reply_alerts: v }).eq("id", user.id);
              }} />
            </SettingRow>
          </Section>

          {/* Active Price Alerts */}
          {alerts && alerts.length > 0 && (
            <Section icon={BellRing} title={lang === "de" ? "Aktive Kursalarme" : "Active Price Alerts"}>
              <div className="space-y-2">
                {alerts.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/40 px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {a.direction === "above" ? (
                        <TrendingUp className="h-4 w-4 text-chart-2 shrink-0" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="font-mono font-bold text-sm">{a.symbol}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {a.direction === "above" ? "≥" : "≤"} ${a.target_price?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.triggered && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-chart-2/15 text-chart-2 font-medium">
                          {lang === "de" ? "Ausgelöst" : "Triggered"}
                        </span>
                      )}
                      <button onClick={() => deleteAlert(a.id)} className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Security */}
          <Section icon={Lock} title={t("settings.security")}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">{t("settings.newPassword")}</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" placeholder="••••••••" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t("settings.confirmPassword")}</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" placeholder="••••••••" />
              </div>
              <Button onClick={handlePasswordChange} disabled={changingPw} variant="outline" className="w-full gap-2">
                <Shield className="h-4 w-4" />
                {t("settings.changePassword")}
              </Button>
            </div>
          </Section>

          {/* Danger Zone */}
          <Section icon={Trash2} title={t("settings.dangerZone")}>
            <SettingRow label={t("settings.deleteAccount")} desc={t("settings.deleteAccountDesc")}>
              <Button variant="destructive" size="sm" onClick={() => setShowDelete(!showDelete)}>{t("settings.delete")}</Button>
            </SettingRow>
            {showDelete && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
                <p className="mb-3">{t("settings.deleteWarning")}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowDelete(false)}>{lang === "de" ? "Abbrechen" : "Cancel"}</Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>{t("settings.confirmDelete")}</Button>
                </div>
              </motion.div>
            )}
          </Section>

          {/* Logout */}
          <Button onClick={handleLogout} variant="outline" className="w-full gap-2 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60">
            <LogOut className="h-4 w-4" />
            {t("nav.logout")}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
