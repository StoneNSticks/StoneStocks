import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

export const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
export const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

interface SectionCardProps { icon: React.ReactNode; title: string; children: React.ReactNode; }
export function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <motion.div variants={fadeIn} className="rounded-xl border border-border/60 bg-card p-5 md:p-7">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h3 className="text-lg md:text-xl font-display font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">{children}</div>
    </motion.div>
  );
}

export function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
      <p className="font-medium text-foreground mb-1 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" />{title}</p>
      <p className="text-muted-foreground text-sm">{children}</p>
    </div>
  );
}

export function WarningBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
      <p className="font-medium text-foreground mb-1">{title}</p>
      <p className="text-muted-foreground text-sm">{children}</p>
    </div>
  );
}

export function TermCard({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="font-medium text-foreground text-sm">{term}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
  );
}

export function ProConGrid({ pros, cons, prosTitle, consTitle }: { pros: string[]; cons: string[]; prosTitle: string; consTitle: string }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-2">
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="font-medium text-foreground text-sm flex items-center gap-1.5"><span className="text-chart-2">▲</span> {prosTitle}</p>
        <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
          {pros.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="font-medium text-foreground text-sm flex items-center gap-1.5"><span className="text-destructive">▼</span> {consTitle}</p>
        <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
          {cons.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
    </div>
  );
}

export function SectionHeader({ num, title, level }: { num: number; title: string; level?: string }) {
  return (
    <motion.div variants={fadeIn} className="flex items-center gap-3 flex-wrap">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">{num}</div>
      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{title}</h2>
      {level && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{level}</span>}
    </motion.div>
  );
}
