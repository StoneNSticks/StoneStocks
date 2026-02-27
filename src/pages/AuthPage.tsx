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

export default function AuthPage() {
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

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

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
      toast.success("Password reset email sent. Check your inbox.");
      setShowForgot(false);
      return;
    }
    if (isLogin) {
      const { error } = await signIn(identifier, password);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Successfully signed in!");
      navigate("/");
    } else {
      const trimmed = username.trim();
      if (!trimmed) { toast.error("Username is required."); setLoading(false); return; }
      if (trimmed.length < 3) { toast.error("Username must be at least 3 characters."); setLoading(false); return; }
      const { error } = await signUp(email || undefined, password, trimmed);
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Account created successfully!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">
              {showForgot ? "Reset Password" : isLogin ? "Sign In" : "Sign Up"}
            </CardTitle>
            <CardDescription>
              {showForgot
                ? "Enter your email to receive a reset link."
                : isLogin
                ? "Sign in to access your watchlist."
                : "Create an account for your personal watchlist."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !showForgot && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      required
                      placeholder="max123"
                      maxLength={15}
                      value={username}
                      onChange={e => handleUsernameChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Letters and numbers only, max 15 characters. ({username.length}/15)
                  </p>
                </div>
              )}
              {isLogin && !showForgot ? (
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Username</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="identifier" type="text" required placeholder="email@example.com or max123" value={identifier} onChange={e => setIdentifier(e.target.value)} className="pl-10" />
                  </div>
                </div>
              ) : (
                !isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-muted-foreground">(optional)</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                )
              )}
              {showForgot && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" required placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
              )}
              {!showForgot && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : showForgot ? "Send Link" : isLogin ? "Sign In" : "Sign Up"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
            <div className="mt-4 text-center text-sm space-y-2">
              {!showForgot && isLogin && (
                <button onClick={() => setShowForgot(true)} className="text-muted-foreground hover:text-primary transition-colors">
                  Forgot password?
                </button>
              )}
              <div>
                <button
                  onClick={() => { setShowForgot(false); setIsLogin(!isLogin); }}
                  className="text-primary hover:underline font-medium"
                >
                  {showForgot ? "Back to Sign In" : isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
