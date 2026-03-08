/**
 * Phase 64: Paper Trading — Virtual trading simulator
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Wallet, Plus, TrendingUp, TrendingDown, RotateCcw, DollarSign, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Position { symbol: string; shares: number; buyPrice: number; currentPrice: number }
interface Trade { symbol: string; action: "buy" | "sell"; shares: number; price: number; time: string }

const MOCK_PRICES: Record<string, number> = { AAPL: 182.52, MSFT: 415.30, GOOGL: 141.80, AMZN: 178.90, TSLA: 245.60, NVDA: 875.40, META: 502.30 };

export default function PaperTradingPage() {
  const { lang } = useLanguage();
  usePageTitle(lang === "de" ? "Paper Trading" : "Paper Trading");
  const [balance, setBalance] = useState(100000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");

  const portfolioValue = useMemo(() => positions.reduce((s, p) => s + p.shares * p.currentPrice, 0), [positions]);
  const totalValue = balance + portfolioValue;
  const totalPnl = totalValue - 100000;

  const handleBuy = () => {
    const sym = symbol.toUpperCase().trim();
    const qty = Number(shares);
    const price = MOCK_PRICES[sym];
    if (!price) { toast.error(lang === "de" ? "Symbol nicht gefunden. Verfügbar: AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META" : "Symbol not found. Available: AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META"); return; }
    if (!qty || qty <= 0) { toast.error(lang === "de" ? "Ungültige Anzahl" : "Invalid quantity"); return; }
    const cost = price * qty;
    if (cost > balance) { toast.error(lang === "de" ? "Nicht genug Guthaben" : "Insufficient balance"); return; }
    setBalance(b => b - cost);
    setPositions(prev => {
      const existing = prev.find(p => p.symbol === sym);
      if (existing) return prev.map(p => p.symbol === sym ? { ...p, shares: p.shares + qty, buyPrice: (p.buyPrice * p.shares + price * qty) / (p.shares + qty) } : p);
      return [...prev, { symbol: sym, shares: qty, buyPrice: price, currentPrice: price }];
    });
    setTrades(prev => [{ symbol: sym, action: "buy", shares: qty, price, time: new Date().toLocaleTimeString() }, ...prev]);
    setSymbol(""); setShares("");
    toast.success(`${lang === "de" ? "Gekauft" : "Bought"}: ${qty}x ${sym} @ $${price.toFixed(2)}`);
  };

  const handleSell = (sym: string) => {
    const pos = positions.find(p => p.symbol === sym);
    if (!pos) return;
    const price = MOCK_PRICES[sym] || pos.currentPrice;
    const proceeds = price * pos.shares;
    setBalance(b => b + proceeds);
    setPositions(prev => prev.filter(p => p.symbol !== sym));
    setTrades(prev => [{ symbol: sym, action: "sell", shares: pos.shares, price, time: new Date().toLocaleTimeString() }, ...prev]);
    toast.success(`${lang === "de" ? "Verkauft" : "Sold"}: ${pos.shares}x ${sym} @ $${price.toFixed(2)}`);
  };

  const handleReset = () => { setBalance(100000); setPositions([]); setTrades([]); toast.info(lang === "de" ? "Portfolio zurückgesetzt" : "Portfolio reset"); };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 px-3 sm:px-4 lg:px-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent"><Wallet className="h-6 w-6 text-primary" /></div>
            <div>
              <h1 className="font-display text-2xl font-bold">Paper Trading</h1>
              <p className="text-sm text-muted-foreground">{lang === "de" ? "Virtuelles Trading ohne echtes Geld" : "Virtual trading without real money"}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5"><RotateCcw className="h-3.5 w-3.5" />Reset</Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="font-mono font-bold text-lg">${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-[10px] text-muted-foreground uppercase">{lang === "de" ? "Guthaben" : "Cash"}</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <BarChart3 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="font-mono font-bold text-lg">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-[10px] text-muted-foreground uppercase">{lang === "de" ? "Gesamtwert" : "Total"}</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <div className={`font-mono font-bold text-lg ${totalPnl >= 0 ? "text-chart-2" : "text-destructive"}`}>{totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-[10px] text-muted-foreground uppercase">P&L</div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><Label className="text-xs text-muted-foreground">Symbol</Label><Input placeholder="AAPL" value={symbol} onChange={e => setSymbol(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs text-muted-foreground">{lang === "de" ? "Anzahl" : "Shares"}</Label><Input type="number" placeholder="10" value={shares} onChange={e => setShares(e.target.value)} className="mt-1" /></div>
            <div className="flex items-end"><Button onClick={handleBuy} className="w-full gap-1"><Plus className="h-4 w-4" />{lang === "de" ? "Kaufen" : "Buy"}</Button></div>
            <div className="text-xs text-muted-foreground flex items-end pb-2">{symbol.toUpperCase() && MOCK_PRICES[symbol.toUpperCase()] ? `$${MOCK_PRICES[symbol.toUpperCase()].toFixed(2)}` : ""}</div>
          </div>
        </div>

        {positions.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display font-semibold text-sm mb-3">{lang === "de" ? "Offene Positionen" : "Open Positions"}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {positions.map(p => {
                  const pnl = (p.currentPrice - p.buyPrice) * p.shares;
                  const pnlPct = ((p.currentPrice - p.buyPrice) / p.buyPrice) * 100;
                  const isUp = pnl >= 0;
                  return (
                    <motion.div key={p.symbol} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4">
                      <div>
                        <span className="font-mono font-bold">{p.symbol}</span>
                        <span className="text-xs text-muted-foreground ml-2">{p.shares} shares @ ${p.buyPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`font-mono text-sm font-bold ${isUp ? "text-chart-2" : "text-destructive"}`}>{isUp ? "+" : ""}${pnl.toFixed(0)} ({isUp ? "+" : ""}{pnlPct.toFixed(1)}%)</div>
                        <Button variant="outline" size="sm" onClick={() => handleSell(p.symbol)}>{lang === "de" ? "Verkaufen" : "Sell"}</Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {trades.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm mb-3">{lang === "de" ? "Handelshistorie" : "Trade History"}</h3>
            <div className="space-y-1">
              {trades.slice(0, 20).map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={t.action === "buy" ? "default" : "secondary"} className="text-[10px]">{t.action === "buy" ? (lang === "de" ? "KAUF" : "BUY") : (lang === "de" ? "VERKAUF" : "SELL")}</Badge>
                    <span className="font-mono font-bold">{t.symbol}</span>
                    <span className="text-muted-foreground text-xs">{t.shares}x @ ${t.price.toFixed(2)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
