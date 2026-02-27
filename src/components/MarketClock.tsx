import { useState, useEffect, useRef } from "react";
import { Clock, ChevronDown, Circle } from "lucide-react";

interface MarketInfo {
  name: string;
  timezone: string;
  openHour: number;
  openMin: number;
  closeHour: number;
  closeMin: number;
  flag: string;
}

const MARKETS: MarketInfo[] = [
  { name: "NYSE / NASDAQ", timezone: "America/New_York", openHour: 9, openMin: 30, closeHour: 16, closeMin: 0, flag: "🇺🇸" },
  { name: "London (LSE)", timezone: "Europe/London", openHour: 8, openMin: 0, closeHour: 16, closeMin: 30, flag: "🇬🇧" },
  { name: "Frankfurt (XETRA)", timezone: "Europe/Berlin", openHour: 9, openMin: 0, closeHour: 17, closeMin: 30, flag: "🇩🇪" },
  { name: "Paris (Euronext)", timezone: "Europe/Paris", openHour: 9, openMin: 0, closeHour: 17, closeMin: 30, flag: "🇫🇷" },
  { name: "Tokyo (TSE)", timezone: "Asia/Tokyo", openHour: 9, openMin: 0, closeHour: 15, closeMin: 0, flag: "🇯🇵" },
  { name: "Hong Kong (HKEX)", timezone: "Asia/Hong_Kong", openHour: 9, openMin: 30, closeHour: 16, closeMin: 0, flag: "🇭🇰" },
  { name: "Shanghai (SSE)", timezone: "Asia/Shanghai", openHour: 9, openMin: 30, closeHour: 15, closeMin: 0, flag: "🇨🇳" },
];

function getMarketTime(tz: string): Date {
  const str = new Date().toLocaleString("en-US", { timeZone: tz });
  return new Date(str);
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isMarketOpen(m: MarketInfo): boolean {
  const now = getMarketTime(m.timezone);
  if (isWeekend(now)) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = m.openHour * 60 + m.openMin;
  const close = m.closeHour * 60 + m.closeMin;
  return mins >= open && mins < close;
}

function timeUntil(m: MarketInfo): string {
  const now = getMarketTime(m.timezone);
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = m.openHour * 60 + m.openMin;
  const close = m.closeHour * 60 + m.closeMin;
  const marketOpen = isMarketOpen(m);

  let diffMins: number;
  if (marketOpen) {
    diffMins = close - mins;
  } else if (isWeekend(now)) {
    // Calculate time until Monday open
    const day = now.getDay();
    const daysUntilMon = day === 0 ? 1 : 2;
    diffMins = daysUntilMon * 24 * 60 + (open - mins);
    if (diffMins < 0) diffMins += 24 * 60;
  } else if (mins < open) {
    diffMins = open - mins;
  } else {
    // After close, opens next trading day
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    const daysToAdd = nextDay.getDay() === 6 ? 2 : nextDay.getDay() === 0 ? 1 : 0;
    diffMins = (1 + daysToAdd) * 24 * 60 - mins + open;
  }

  if (diffMins < 0) diffMins = 0;
  const h = Math.floor(diffMins / 60);
  const mm = diffMins % 60;
  if (h > 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h`;
  }
  return h > 0 ? `${h}h ${mm}m` : `${mm}m`;
}

function formatLocalTime(tz: string): string {
  return new Date().toLocaleTimeString(navigator.language || "en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function MarketClock() {
  const [now, setNow] = useState(new Date());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const localTime = now.toLocaleTimeString(navigator.language || "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const anyOpen = MARKETS.some(isMarketOpen);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Clock className="h-3.5 w-3.5" />
        <span className="tabular-nums hidden sm:inline">{localTime}</span>
        <Circle
          className={`h-2 w-2 fill-current ${anyOpen ? "text-gain" : "text-loss"}`}
        />
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl border border-border/60 bg-card shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2.5 border-b border-border/40">
            <p className="text-xs font-semibold text-foreground">Market Hours</p>
            <p className="text-[10px] text-muted-foreground">
              Your time: {localTime}
            </p>
          </div>
          <div className="py-1">
            {MARKETS.map((m) => {
              const mOpen = isMarketOpen(m);
              const remaining = timeUntil(m);
              return (
                <div
                  key={m.name}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">{m.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground tabular-nums">
                      {formatLocalTime(m.timezone)} local
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Circle
                        className={`h-1.5 w-1.5 fill-current ${mOpen ? "text-gain" : "text-loss"}`}
                      />
                      <span className={`text-[11px] font-semibold ${mOpen ? "text-gain" : "text-loss"}`}>
                        {mOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground tabular-nums">
                      {mOpen ? `closes in ${remaining}` : `opens in ${remaining}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
