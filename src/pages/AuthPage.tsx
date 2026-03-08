import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function AuthPage() {
  const t = useT();
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Anmelden" : "Sign In",
    lang === "de" ? "Anmelden oder Konto erstellen" : "Sign in or create an account"
  );
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  if (user) { navigate("/", { replace: true }); return null; }

  const usernameRegex = /^[a-zA-Z0-9]*$/;
  const handleUsernameChange = (val: string) => {
    if (val.length > 15) return;
    if (!usernameRegex.test(val)) return;
    setUsername(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (showForgot) {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success(t("auth.resetSuccess"));
      setShowForgot(false);
      return;
    }
    if (isLogin) {
      const { error } = await signIn(identifier, password);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success(t("auth.signInSuccess"));
      navigate("/");
    } else {
      const trimmed = username.trim();
      if (!trimmed) { toast.error(t("auth.usernameRequired")); setLoading(false); return; }
      if (trimmed.length < 3) { toast.error(t("auth.usernameTooShort")); setLoading(false); return; }
      const { error } = await signUp(email || undefined, password, trimmed);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success(t("auth.signUpSuccess"));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex items-center justify-center py-10 sm:py-16 px-3 sm:px-4">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">
              {showForgot ? t("auth.resetPassword") : isLogin ? t("auth.signIn") : t("auth.signUp")}
            </CardTitle>
            <CardDescription>
              {showForgot ? t("auth.resetDesc") : isLogin ? t("auth.signInDesc") : t("auth.signUpDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !showForgot && (
                <div className="space-y-2">
                  <Label htmlFor="username">{t("auth.username")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="username" required placeholder="max123" maxLength={15} value={username} onChange={e => handleUsernameChange(e.target.value)} className="pl-10" />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("auth.usernameHint")} ({username.length}/15)</p>
                </div>
              )}
              {isLogin && !showForgot ? (
                <div className="space-y-2">
                  <Label htmlFor="identifier">{t("auth.emailOrUsername")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="identifier" type="text" required placeholder="email@example.com" value={identifier} onChange={e => setIdentifier(e.target.value)} className="pl-10" />
                  </div>
                </div>
              ) : !isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.emailOptional")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
              )}
              {showForgot && (
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" required placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
              )}
              {!showForgot && (
                <div className="space-y-2">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} required minLength={6} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
                {loading ? t("auth.loading") : showForgot ? t("auth.sendLink") : isLogin ? t("auth.signIn") : t("auth.signUp")}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
            <div className="mt-4 text-center text-sm space-y-2">
              {!showForgot && isLogin && (
                <button onClick={() => setShowForgot(true)} className="text-muted-foreground hover:text-primary transition-colors">{t("auth.forgotPassword")}</button>
              )}
              <div>
                <button onClick={() => { setShowForgot(false); setIsLogin(!isLogin); }} className="text-primary hover:underline font-medium">
                  {showForgot ? t("auth.backToSignIn") : isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
