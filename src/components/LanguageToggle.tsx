import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "de" ? "en" : "de")}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 group"
      title={lang === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
    >
      <Globe className="h-3.5 w-3.5" />
      <div className="flex items-center overflow-hidden">
        <span className={`transition-all font-semibold ${lang === "de" ? "text-foreground" : "opacity-50"}`}>DE</span>
        <span className="mx-1 text-border">/</span>
        <span className={`transition-all font-semibold ${lang === "en" ? "text-foreground" : "opacity-50"}`}>EN</span>
      </div>
    </button>
  );
}
