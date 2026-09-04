import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string | undefined, password: string, username?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (identifier: string, password: string) => {
    // Username login is verified server-side; the account email is never
    // exposed to the client, which removes the enumeration surface.
    if (!identifier.includes("@")) {
      const { data, error: lookupError } = await supabase.functions.invoke("resolve-username", {
        body: { username: identifier, password },
      });
      if (lookupError || !data?.access_token || !data?.refresh_token) {
        return { error: new Error("Invalid username or password.") };
      }
      const { error } = await supabase.auth.setSession({
        access_token: data.access_token as string,
        refresh_token: data.refresh_token as string,
      });
      return { error: error as Error | null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email: identifier, password });
    return { error: error as Error | null };
  };


  const signUp = async (emailInput: string | undefined, password: string, username?: string) => {
    const lowerUsername = username ? username.toLowerCase() : undefined;
    // If no email provided, generate a placeholder email from the username
    const email = emailInput || `${lowerUsername}@noemail.local`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          username: lowerUsername || email.split("@")[0],
          display_name: username || email.split("@")[0],
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
