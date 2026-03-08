import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useT } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Newspaper, BarChart3, Calculator, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const t = useT();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const links = [
    { to: "/", icon: TrendingUp, label: t("nav.markets") },
    { to: "/news", icon: Newspaper, label: t("nav.news") },
    { to: "/rankings", icon: BarChart3, label: t("nav.rankings") },
    { to: "/calculators", icon: Calculator, label: t("nav.tools") },
    { to: "/learn", icon: HelpCircle, label: t("nav.learn") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/10 shadow-xl mx-auto">
            <span className="font-display text-5xl font-bold text-primary/60">404</span>
          </div>
          <h1 className="font-display text-2xl font-bold">{t("notfound.title")}</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t("notfound.desc") || "The page you're looking for doesn't exist or has been moved."}
          </p>
          <div className="max-w-sm mx-auto">
            <SearchBar />
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {links.map(({ to, icon: Icon, label }) => (
              <Button key={to} asChild variant="outline" size="sm" className="rounded-xl gap-1.5">
                <Link to={to}><Icon className="h-3.5 w-3.5" />{label}</Link>
              </Button>
            ))}
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 mt-4">
            <Link to="/"><ArrowLeft className="h-3.5 w-3.5" />{t("notfound.back")}</Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFound;
