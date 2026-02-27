import { useCurrency } from "@/contexts/CurrencyContext";
import { DollarSign, Euro } from "lucide-react";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <button
      onClick={() => setCurrency(currency === "USD" ? "EUR" : "USD")}
      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
      title={`Switch to ${currency === "USD" ? "EUR" : "USD"}`}
    >
      {currency === "USD" ? (
        <>
          <DollarSign className="h-3.5 w-3.5" />
          <span>USD</span>
        </>
      ) : (
        <>
          <Euro className="h-3.5 w-3.5" />
          <span>EUR</span>
        </>
      )}
    </button>
  );
}
