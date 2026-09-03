import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { fadeIn } from "@/components/learn/LearnComponents";

/** Divider heading for a group of learn sections. */
export function SuperSection({ id, title, level, children }: { id: string; title: string; level: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <div className="space-y-10" id={id}>
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{level}</span>
      </div>
      <div className="space-y-12">{children}</div>
    </div>
  );
}

/** Link from a lesson to the matching calculator. */
export function CalcLink({ to, label }: { to: string; label: string }) {
  const t = useT();
  return (
    <motion.div variants={fadeIn} className="rounded-lg border border-primary/20 bg-primary/[0.03] p-3 flex items-center gap-3">
      <Calculator className="h-4 w-4 text-primary shrink-0" />
      <span className="text-sm text-muted-foreground">{t("learn.relatedCalc")}: <strong>{label}</strong></span>
      <a href={to} className="ml-auto text-xs text-primary font-medium hover:underline">{t("learn.tryCalculator")}</a>
    </motion.div>
  );
}
