import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (showForgot) {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("E-Mail zum Zurücksetzen gesendet. Prüfe dein Postfach.");
      setShowForgot(false);
      return;
    }
    if (isLogin) {
      const { error } = await signIn(identifier, password);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Erfolgreich eingeloggt!");
      navigate("/");
    } else {
      if (!username.trim()) { toast.error("Benutzername ist erforderlich."); setLoading(false); return; }
      const { error } = await signUp(email, password, displayName || undefined, username);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Bestätigungsmail gesendet! Prüfe dein Postfach.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">
              {showForgot ? "Passwort zurücksetzen" : isLogin ? "Einloggen" : "Registrieren"}
            </CardTitle>
            <CardDescription>
              {showForgot
                ? "Gib deine E-Mail ein, um einen Reset-Link zu erhalten."
                : isLogin
                ? "Melde dich an, um deine Watchlist zu nutzen."
                : "Erstelle einen Account für deine persönliche Watchlist."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !showForgot && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Benutzername</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="username" required placeholder="max123" value={username} onChange={e => setUsername(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Anzeigename (optional)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="displayName" placeholder="Max Mustermann" value={displayName} onChange={e => setDisplayName(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                </>
              )}
              {isLogin && !showForgot ? (
                <div className="space-y-2">
                  <Label htmlFor="identifier">E-Mail oder Benutzername</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="identifier" type="text" required placeholder="email@example.com oder max123" value={identifier} onChange={e => setIdentifier(e.target.value)} className="pl-10" />
                  </div>
                </div>
              ) : (
                !isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" required placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                )
              )}
              {showForgot && (
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" required placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
              )}
              {!showForgot && (
                <div className="space-y-2">
                  <Label htmlFor="password">Passwort</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" required minLength={6} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" />
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Laden..." : showForgot ? "Link senden" : isLogin ? "Einloggen" : "Registrieren"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
            <div className="mt-4 text-center text-sm space-y-2">
              {!showForgot && isLogin && (
                <button onClick={() => setShowForgot(true)} className="text-muted-foreground hover:text-primary transition-colors">
                  Passwort vergessen?
                </button>
              )}
              <div>
                <button
                  onClick={() => { setShowForgot(false); setIsLogin(!isLogin); }}
                  className="text-primary hover:underline font-medium"
                >
                  {showForgot ? "Zurück zum Login" : isLogin ? "Noch keinen Account? Registrieren" : "Bereits registriert? Einloggen"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
