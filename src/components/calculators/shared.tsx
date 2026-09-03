/** Shared helpers and primitives for the financial calculators. */
export function formatMoney(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}

export const ResultCard = ({ label, value, color = "text-foreground" }: { label: string; value: string; color?: string }) => (
  <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <div className={`font-display font-bold text-lg ${color}`}>{value}</div>
  </div>
);

export const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" };
export const tickStyle = { fontSize: 11, fill: "hsl(var(--muted-foreground))" };
