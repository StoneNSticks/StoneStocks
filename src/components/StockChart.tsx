import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart, ReferenceLine, BarChart, Bar } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { getTimeSeries } from "@/lib/stockApi";
import { useQuery } from "@tanstack/react-query";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

const intervals = [
  { label: "1D", value: "1d", outputsize: "78", interval: "5min" },
  { label: "5D", value: "5d", outputsize: "130", interval: "15min" },
  { label: "1M", value: "1m", outputsize: "22", interval: "1day" },
  { label: "6M", value: "6m", outputsize: "130", interval: "1day" },
  { label: "1Y", value: "1y", outputsize: "252", interval: "1day" },
  { label: "5Y", value: "5y", outputsize: "260", interval: "1week" },
  { label: "MAX", value: "max", outputsize: "500", interval: "1month" },
];

type Overlay = "none" | "sma" | "bb" | "rsi" | "macd" | "volume";

function calcSMA(data: { close: number }[], period: number): (number | null)[] {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    const slice = data.slice(i - period + 1, i + 1);
    return slice.reduce((s, d) => s + d.close, 0) / period;
  });
}

function calcBollinger(data: { close: number }[], period = 20, mult = 2) {
  const sma = calcSMA(data, period);
  return data.map((_, i) => {
    if (sma[i] === null) return { upper: null, middle: null, lower: null };
    const slice = data.slice(i - period + 1, i + 1).map((d) => d.close);
    const mean = sma[i]!;
    const stdDev = Math.sqrt(slice.reduce((s, v) => s + (v - mean) ** 2, 0) / period);
    return { upper: mean + mult * stdDev, middle: mean, lower: mean - mult * stdDev };
  });
}

function calcRSI(data: { close: number }[], period = 14): (number | null)[] {
  const rsi: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) { rsi.push(null); continue; }
    let gains = 0, losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j].close - data[j - 1].close;
      if (diff > 0) gains += diff; else losses -= diff;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }
  return rsi;
}

function calcMACD(data: { close: number }[], fast = 12, slow = 26, signal = 9) {
  const ema = (arr: number[], p: number) => {
    const k = 2 / (p + 1);
    const result = [arr[0]];
    for (let i = 1; i < arr.length; i++) result.push(arr[i] * k + result[i - 1] * (1 - k));
    return result;
  };
  const closes = data.map(d => d.close);
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const macdLine = emaFast.map((v, i) => v - emaSlow[i]);
  const signalLine = ema(macdLine, signal);
  return data.map((_, i) => ({
    macd: i >= slow - 1 ? macdLine[i] : null,
    signal: i >= slow + signal - 2 ? signalLine[i] : null,
    histogram: i >= slow + signal - 2 ? macdLine[i] - signalLine[i] : null,
  }));
}

export function StockChart({ symbol }: { symbol: string }) {
  const [selected, setSelected] = useState("1y");
  const [overlay, setOverlay] = useState<Overlay>("none");
  const { convert, symbol: currSymbol } = useCurrency();
  const t = useT();
  const config = intervals.find((i) => i.value === selected) || intervals[4];

  const { data: series, isLoading } = useQuery({
    queryKey: ["chartSeries", symbol, selected],
    queryFn: () => getTimeSeries(symbol, config.interval, config.outputsize),
    enabled: !!symbol,
    staleTime: selected.includes("d") && selected !== "1d" ? 1000 * 60 * 60 : 1000 * 60 * 5,
  });

  const chartData = useMemo(() => {
    if (!series?.values) return [];
    const raw = [...series.values].reverse().map((v: any) => ({
      date: v.datetime,
      close: parseFloat(v.close),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      volume: parseInt(v.volume),
    }));

    if (overlay === "sma") {
      const sma20 = calcSMA(raw, 20);
      const sma50 = calcSMA(raw, Math.min(50, raw.length));
      return raw.map((d, i) => ({ ...d, sma20: sma20[i], sma50: sma50[i] }));
    }
    if (overlay === "bb") {
      const bb = calcBollinger(raw, 20);
      return raw.map((d, i) => ({ ...d, bbUpper: bb[i].upper, bbMiddle: bb[i].middle, bbLower: bb[i].lower }));
    }
    if (overlay === "rsi") {
      const rsi = calcRSI(raw, 14);
      return raw.map((d, i) => ({ ...d, rsi: rsi[i] }));
    }
    if (overlay === "macd") {
      const macd = calcMACD(raw);
      return raw.map((d, i) => ({ ...d, macdLine: macd[i].macd, macdSignal: macd[i].signal, macdHist: macd[i].histogram }));
    }
    if (overlay === "volume") {
      return raw;
    }
    return raw;
  }, [series, overlay]);

  const isPositive = chartData.length >= 2 && chartData[chartData.length - 1].close >= chartData[0].close;
  const color = isPositive ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)";
  const isIntraday = selected === "1d" || selected === "5d";
  const userLocale = navigator.language || "en-US";
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatXLabel = (d: string) => {
    const date = new Date(d);
    if (isIntraday) return date.toLocaleTimeString(userLocale, { hour: "numeric", minute: "2-digit", timeZone: userTz });
    if (selected === "max" || selected === "5y") return date.toLocaleDateString(userLocale, { year: "numeric", timeZone: userTz });
    return date.toLocaleDateString(userLocale, { month: "short", day: "numeric", timeZone: userTz });
  };

  const overlays: { key: Overlay; label: string }[] = [
    { key: "none", label: t("chart.title") },
    { key: "sma", label: "SMA" },
    { key: "bb", label: "Bollinger" },
    { key: "rsi", label: "RSI" },
    { key: "macd", label: "MACD" },
    { key: "volume", label: "Vol" },
  ];

  const showSubChart = overlay === "rsi" || overlay === "macd" || overlay === "volume";

  if (isLoading) return <Skeleton className="h-72 rounded-xl" />;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display font-semibold text-sm text-muted-foreground">{t("chart.title")}</h3>
          <div className="flex gap-0.5 ml-2">
            {overlays.map((o) => (
              <button
                key={o.key}
                onClick={() => setOverlay(o.key)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${overlay === o.key ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-0.5">
          {intervals.map((i) => (
            <button key={i.value} onClick={() => setSelected(i.value)} className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${selected === i.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{i.label}</button>
          ))}
        </div>
      </div>
      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={showSubChart ? 190 : 260}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id={`colorClose-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
                {overlay === "bb" && (
                  <linearGradient id={`bbFill-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.02} />
                  </linearGradient>
                )}
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={formatXLabel} minTickGap={40} />
              <YAxis domain={["auto", "auto"]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v: number) => `${currSymbol}${(convert(v) ?? v).toFixed(0)}`} width={55} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }}
                formatter={(v: number, name: string) => {
                  const label = name === "close" ? t("chart.close") : name === "sma20" ? "SMA 20" : name === "sma50" ? "SMA 50" : name === "bbUpper" ? "Upper" : name === "bbLower" ? "Lower" : name === "bbMiddle" ? "Middle" : name;
                  return [`${currSymbol}${(convert(v) ?? v).toFixed(2)}`, label];
                }}
                labelFormatter={(l: string) => {
                  const d = new Date(l);
                  if (isIntraday) return d.toLocaleString(userLocale, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: userTz });
                  return d.toLocaleDateString(userLocale, { month: "long", day: "numeric", year: "numeric", timeZone: userTz });
                }}
              />
              {overlay === "bb" && (
                <>
                  <Area type="monotone" dataKey="bbUpper" stroke="hsl(210, 80%, 55%)" strokeWidth={1} strokeDasharray="3 3" fill="none" dot={false} />
                  <Area type="monotone" dataKey="bbLower" stroke="hsl(210, 80%, 55%)" strokeWidth={1} strokeDasharray="3 3" fill={`url(#bbFill-${symbol})`} dot={false} />
                  <Line type="monotone" dataKey="bbMiddle" stroke="hsl(210, 80%, 55%)" strokeWidth={1} dot={false} strokeOpacity={0.5} />
                </>
              )}
              {overlay === "sma" && (
                <>
                  <Line type="monotone" dataKey="sma20" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="sma50" stroke="hsl(280, 65%, 55%)" strokeWidth={1.5} dot={false} />
                </>
              )}
              <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2} fill={`url(#colorClose-${symbol})`} />
            </ComposedChart>
          </ResponsiveContainer>

          {/* RSI Sub-Chart */}
          {overlay === "rsi" && (
            <div className="mt-1 border-t border-border/30 pt-1">
              <ResponsiveContainer width="100%" height={80}>
                <ComposedChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={55} ticks={[30, 50, 70]} />
                  <ReferenceLine y={70} stroke="hsl(0, 72%, 51%)" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <ReferenceLine y={30} stroke="hsl(145, 63%, 42%)" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 11, color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [v?.toFixed(1), "RSI"]}
                  />
                  <Line type="monotone" dataKey="rsi" stroke="hsl(280, 65%, 55%)" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* MACD Sub-Chart */}
          {overlay === "macd" && (
            <div className="mt-1 border-t border-border/30 pt-1">
              <ResponsiveContainer width="100%" height={80}>
                <ComposedChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={55} />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 11, color: "hsl(var(--foreground))" }}
                    formatter={(v: number, name: string) => {
                      const label = name === "macdLine" ? "MACD" : name === "macdSignal" ? "Signal" : "Histogram";
                      return [v?.toFixed(3), label];
                    }}
                  />
                  <Bar dataKey="macdHist" fill="hsl(210, 80%, 55%)" opacity={0.4} />
                  <Line type="monotone" dataKey="macdLine" stroke="hsl(210, 80%, 55%)" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="macdSignal" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Volume Sub-Chart */}
          {overlay === "volume" && (
            <div className="mt-1 border-t border-border/30 pt-1">
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={55} tickFormatter={(v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : `${(v / 1e3).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 11, color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [v?.toLocaleString(), "Volume"]}
                  />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.4} radius={[1, 1, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">{t("chart.noData")}</div>
      )}
    </div>
  );
}
