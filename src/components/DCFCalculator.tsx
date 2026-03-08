/**
 * DCFCalculator — Interactive Discounted Cash Flow calculator.
 * Users adjust growth rate, discount rate, terminal growth and projection years.
 * Includes a sensitivity table showing intrinsic value across different assumptions.
 */
import { useState, useMemo } from "react";
import { useT } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";

interface DCFCalculatorProps {
  overview: any;
  quote: any;
  derived: any;
}

function safeNum(v: unknown): number {
  const n = Number(v);
  return isNaN(n) || !isFinite(n) ? 0 : n;
}

function calculateDCF(fcf: number, growthRate: number, discountRate: number, terminalGrowth: number, years: number, sharesOut: number): number {
  if (fcf <= 0 || sharesOut <= 0 || discountRate <= terminalGrowth) return 0;

  let totalPV = 0;
  let projectedFCF = fcf;

  for (let y = 1; y <= years; y++) {
    projectedFCF *= (1 + growthRate / 100);
    totalPV += projectedFCF / Math.pow(1 + discountRate / 100, y);
  }

  // Terminal value using Gordon Growth Model
  const terminalFCF = projectedFCF * (1 + terminalGrowth / 100);
  const terminalValue = terminalFCF / ((discountRate - terminalGrowth) / 100);
  const pvTerminal = terminalValue / Math.pow(1 + discountRate / 100, years);

  const enterpriseValue = totalPV + pvTerminal;
  return enterpriseValue / sharesOut;
}

export function DCFCalculator({ overview, quote, derived }: DCFCalculatorProps) {
  const t = useT();
  const { convert, symbol: cSym } = useCurrency();

  const currentPrice = safeNum(quote?.c);
  const fcf = safeNum(derived?.freeCashFlow) || safeNum(overview?.FreeCashFlow);
  const sharesOut = safeNum(overview?.SharesOutstanding) || safeNum(derived?.sharesOutstanding);

  const [growthRate, setGrowthRate] = useState(10);
  const [discountRate, setDiscountRate] = useState(10);
  const [terminalGrowth, setTerminalGrowth] = useState(2.5);
  const [years, setYears] = useState(10);

  const intrinsicValue = useMemo(() => {
    if (!fcf || !sharesOut) return 0;
    return calculateDCF(fcf, growthRate, discountRate, terminalGrowth, years, sharesOut);
  }, [fcf, growthRate, discountRate, terminalGrowth, years, sharesOut]);

  // Sensitivity matrix
  const sensitivityData = useMemo(() => {
    if (!fcf || !sharesOut) return [];
    const growthRates = [growthRate - 4, growthRate - 2, growthRate, growthRate + 2, growthRate + 4];
    const discountRates = [discountRate - 2, discountRate - 1, discountRate, discountRate + 1, discountRate + 2];

    return discountRates.map((dr) => ({
      discount: dr,
      values: growthRates.map((gr) => calculateDCF(fcf, gr, dr, terminalGrowth, years, sharesOut)),
    }));
  }, [fcf, growthRate, discountRate, terminalGrowth, years, sharesOut]);

  if (!fcf || !sharesOut || !currentPrice) return null;

  const upside = currentPrice > 0 ? ((intrinsicValue - currentPrice) / currentPrice) * 100 : 0;
  const isUndervalued = upside > 0;

  const fmtPrice = (v: number) => {
    const c = convert(v) || v;
    return `${cSym}${c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const growthRatesHeader = [growthRate - 4, growthRate - 2, growthRate, growthRate + 2, growthRate + 4];

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
        <Calculator className="h-4 w-4 text-primary" />
        <h3 className="font-display font-bold text-sm">{t("dcf.title")}</h3>
        <Badge className={`ml-auto text-[10px] ${isUndervalued ? "bg-chart-2/10 text-chart-2" : "bg-destructive/10 text-destructive"}`}>
          {isUndervalued ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {upside >= 0 ? "+" : ""}{upside.toFixed(1)}%
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {/* Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <Label className="text-[10px] text-muted-foreground">{t("dcf.growthRate")}</Label>
            <Input type="number" value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} className="mt-1 h-8 text-xs" step={0.5} />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">{t("dcf.discountRate")}</Label>
            <Input type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} className="mt-1 h-8 text-xs" step={0.5} />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">{t("dcf.terminalGrowth")}</Label>
            <Input type="number" value={terminalGrowth} onChange={(e) => setTerminalGrowth(Number(e.target.value))} className="mt-1 h-8 text-xs" step={0.5} />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">{t("dcf.years")}</Label>
            <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1 h-8 text-xs" min={1} max={20} />
          </div>
        </div>

        {/* Result */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("dcf.intrinsicValue")} {t("dcf.perShare")}</div>
            <div className="font-mono font-bold text-lg text-primary">{fmtPrice(intrinsicValue)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground">{t("fv.currentPrice")}</div>
            <div className="font-mono font-semibold text-sm">{fmtPrice(currentPrice)}</div>
          </div>
        </div>

        {/* Sensitivity Table */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">{t("dcf.sensitivity")}</div>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr>
                  <th className="p-1.5 text-left text-muted-foreground">
                    <span className="text-[9px]">↓ Disc / Growth →</span>
                  </th>
                  {growthRatesHeader.map((gr) => (
                    <th key={gr} className={`p-1.5 text-center ${gr === growthRate ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      {gr}%
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sensitivityData.map((row) => (
                  <tr key={row.discount} className={row.discount === discountRate ? "bg-primary/5" : ""}>
                    <td className={`p-1.5 ${row.discount === discountRate ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      {row.discount}%
                    </td>
                    {row.values.map((val, i) => {
                      const cellUpside = ((val - currentPrice) / currentPrice) * 100;
                      const isCenter = row.discount === discountRate && growthRatesHeader[i] === growthRate;
                      return (
                        <td
                          key={i}
                          className={`p-1.5 text-center ${isCenter ? "font-bold bg-primary/10 rounded" : ""} ${cellUpside > 0 ? "text-chart-2" : "text-destructive"}`}
                        >
                          {val > 0 ? fmtPrice(val) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
