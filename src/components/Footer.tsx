import { Link } from "react-router-dom";
import { useT } from "@/contexts/LanguageContext";

export function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-border/50 py-6 mt-8">
      <div className="container px-3 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Alexander Albert · StoneStocks · {t("index.footer")}</span>
          <nav className="flex items-center gap-4">
            <Link to="/learn" className="hover:text-foreground transition-colors">{t("nav.learn")}</Link>
            <Link to="/glossary" className="hover:text-foreground transition-colors">Glossar</Link>
            <Link to="/calculators" className="hover:text-foreground transition-colors">{t("nav.tools")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
