import { useMemo, memo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useT } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface EarningsCardProps {
  earnings: any;
}

export function EarningsCard({ earnings }: EarningsCardProps) {
  const t = useT();
  const { symbol: cSym } = useCurrency();

  const data = useMemo(() => {
    if (!earnings?.quarterlyEarnings || !Array.isArray(earnings.quarterlyEarnings)) return [];
    return earnings.quarterlyEarnings
      .slice(0, 8)
      .reverse()
      .map((q: any) => ({
        quarter: q.fiscalDateEnding?.slice(0, 7) || "",
        reported: parseFloat(q.reportedEPS || "0"),
        estimated: parseFloat(q.estimatedEPS || "0"),
        surprise: parseFloat(q.surprisePercentage || "0"),
      }));
  }, [earnings]);

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">{t("ec.title")}</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }} tickFormatter={(v) => `${cSym}${v.toFixed(2)}`} width={45} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 11, color: "hsl(var(--foreground))" }}
              formatter={(v: number, name: string) => [`${cSym}${v.toFixed(2)}`, name === "reported" ? t("ec.reported") : t("ec.estimated")]}
            />
            <Bar dataKey="estimated" fill="hsl(var(--muted-foreground))" radius={[2, 2, 0, 0]} opacity={0.4} />
            <Bar dataKey="reported" radius={[2, 2, 0, 0]}>
              {data.map((entry: any, i: number) => (
                <Cell key={i} fill={entry.reported >= entry.estimated ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/40" />{t("ec.estimated")}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(145, 63%, 42%)" }} />{t("ec.beat")}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(0, 72%, 51%)" }} />{t("ec.miss")}</span>
      </div>
    </div>
  );
}
