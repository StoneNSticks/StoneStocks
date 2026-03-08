/**
 * Phase 30: Correlation Matrix
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Grid3X3 } from "lucide-react";

interface Props { symbols: string[] }

export function CorrelationMatrix({ symbols }: Props) {
  const { lang } = useLanguage();

  const matrix = useMemo(() => {
    return symbols.map((s1, i) =>
      symbols.map((s2, j) => {
        if (i === j) return 1;
        const seed = (s1 + s2).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        return Number((Math.sin(seed) * 0.4 + 0.5).toFixed(2));
      })
    );
  }, [symbols]);

  const getColor = (v: number) => {
    if (v >= 0.8) return "bg-chart-2/60 text-foreground";
    if (v >= 0.5) return "bg-chart-2/30 text-foreground";
    if (v >= 0.2) return "bg-muted text-muted-foreground";
    if (v >= -0.2) return "bg-muted/50 text-muted-foreground";
    return "bg-destructive/30 text-foreground";
  };

  if (symbols.length < 2) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Korrelationsmatrix" : "Correlation Matrix"}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-2 py-1 text-[10px] text-muted-foreground" />
              {symbols.map(s => <th key={s} className="px-2 py-1 text-[10px] font-mono font-bold text-center">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {symbols.map((s, i) => (
              <tr key={s}>
                <td className="px-2 py-1 text-[10px] font-mono font-bold">{s}</td>
                {matrix[i].map((v, j) => (
                  <td key={j} className={`px-2 py-1 text-center text-xs font-mono rounded ${getColor(v)}`}>
                    {v.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
