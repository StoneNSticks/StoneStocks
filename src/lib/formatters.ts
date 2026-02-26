export function formatNumber(num: number | null | undefined): string {
  if (num == null || isNaN(num)) return "—";
  if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}

export function formatCurrency(num: number | null | undefined): string {
  if (num == null || isNaN(num)) return "—";
  return "$" + formatNumber(num);
}

export function formatPercent(num: number | null | undefined): string {
  if (num == null || isNaN(num)) return "—";
  return (num >= 0 ? "+" : "") + num.toFixed(2) + "%";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function priceChangeColor(change: number | null | undefined): string {
  if (change == null || change === 0) return "text-muted-foreground";
  return change > 0 ? "text-gain" : "text-loss";
}
