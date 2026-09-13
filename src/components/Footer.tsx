import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { legalDocs, legalRoutes } from "@/i18n/legalContent";

export function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="border-t border-border/50 py-6 mt-8">
      <div className="container px-3 sm:px-4 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Alexander Albert · StoneStocks · {t("index.footer")}</span>
          <nav aria-label={lang === "de" ? "Weitere Seiten" : "More pages"} className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/learn" className="hover:text-foreground transition-colors">{t("nav.learn")}</Link>
            <Link to="/glossary" className="hover:text-foreground transition-colors">{t("nav.glossary") || "Glossar"}</Link>
            <Link to="/calculators" className="hover:text-foreground transition-colors">{t("nav.tools")}</Link>
            {legalRoutes.map(r => (
              <Link key={r.path} to={r.path} className="hover:text-foreground transition-colors">
                {legalDocs[r.slug][lang].title}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground text-center sm:text-left">
          {t("legal.disclaimerShort")}
        </p>
      </div>
    </footer>
  );
}
