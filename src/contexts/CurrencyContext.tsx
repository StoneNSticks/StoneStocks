import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrencyRates } from "@/lib/stockApi";

type Currency = "USD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (usdAmount: number | null | undefined) => number | null;
  symbol: string;
  rate: number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  convert: (v) => v ?? null,
  symbol: "$",
  rate: 1,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem("stonestocks-currency");
    return (saved === "EUR" ? "EUR" : "USD") as Currency;
  });

  const { data: rates } = useQuery({
    queryKey: ["currencyRates"],
    queryFn: getCurrencyRates,
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
  });

  useEffect(() => {
    localStorage.setItem("stonestocks-currency", currency);
  }, [currency]);

  const eurRate = (rates as Record<string, number>)?.EUR || 0.92;

  const convert = (usdAmount: number | null | undefined): number | null => {
    if (usdAmount == null || isNaN(usdAmount)) return null;
    if (currency === "USD") return usdAmount;
    return usdAmount * eurRate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convert,
        symbol: currency === "USD" ? "$" : "€",
        rate: currency === "USD" ? 1 : eurRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
