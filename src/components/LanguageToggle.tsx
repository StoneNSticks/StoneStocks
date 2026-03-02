import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "de" ? "en" : "de")}
      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
      title={lang === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
    >
      <span className="text-sm">{lang === "de" ? "🇩🇪" : "🇬🇧"}</span>
      <span>{lang === "de" ? "DE" : "EN"}</span>
    </button>
  );
}
