/**
 * EarningsCalendar — Shows upcoming earnings dates for watchlist stocks or a single stock.
 * Displays date, symbol, estimated EPS, and time (BMO/AMC).
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useEarningsCalendar } from "@/hooks/useStockData";

interface EarningsCalendarProps {
  /** Comma-separated symbols or single symbol */
  symbols: string[];
  /** Compact mode for stock detail page */
  compact?: boolean;
}

interface EarningsEvent {
  date: string;
  symbol: string;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
  hour: string; // "bmo" (before market open), "amc" (after market close), "dmh" (during)
  quarter: number;
  year: number;
}

function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T12:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function HourBadge({ hour, lang }: { hour: string; lang: string }) {
  const labels: Record<string, Record<string, string>> = {
    bmo: { de: "Vor Börse", en: "Pre-Market" },
    amc: { de: "Nach Börse", en: "After Hours" },
    dmh: { de: "Während", en: "During" },
  };
  const label = labels[hour]?.[lang] || hour?.toUpperCase() || "—";
  const colors: Record<string, string> = {
    bmo: "bg-amber-500/10 text-amber-500",
    amc: "bg-blue-500/10 text-blue-500",
    dmh: "bg-purple-500/10 text-purple-500",
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${colors[hour] || "bg-muted text-muted-foreground"}`}>
      {label}
    </span>
  );
}

export function EarningsCalendar({ symbols, compact = false }: EarningsCalendarProps) {
  const { lang } = useLanguage();
  const { symbol: cSym } = useCurrency();
  const symbolStr = symbols.join(",");
  const { data, isLoading } = useEarningsCalendar(symbolStr);

  const events: EarningsEvent[] = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data
      .map((e: any) => ({
        date: e.date || "",
        symbol: e.symbol || "",
        epsEstimate: e.epsEstimate != null ? parseFloat(e.epsEstimate) : null,
        epsActual: e.epsActual != null ? parseFloat(e.epsActual) : null,
        revenueEstimate: e.revenueEstimate != null ? parseFloat(e.revenueEstimate) : null,
        revenueActual: e.revenueActual != null ? parseFloat(e.revenueActual) : null,
        hour: e.hour || "",
        quarter: e.quarter || 0,
        year: e.year || 0,
      }))
      .filter((e: EarningsEvent) => e.date && daysUntil(e.date) >= -1)
      .sort((a: EarningsEvent, b: EarningsEvent) => a.date.localeCompare(b.date));
  }, [data]);

  // Group by date — must be before any returns
  const grouped = useMemo(() => {
    const map = new Map<string, EarningsEvent[]>();
    events.forEach((e) => {
      const existing = map.get(e.date) || [];
      existing.push(e);
      map.set(e.date, existing);
    });
    return Array.from(map.entries());
  }, [events]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-muted-foreground">
            {lang === "de" ? "Earnings Kalender" : "Earnings Calendar"}
          </h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-muted-foreground">
            {lang === "de" ? "Earnings Kalender" : "Earnings Calendar"}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <AlertCircle className="h-4 w-4" />
          {lang === "de" ? "Keine anstehenden Quartalszahlen gefunden" : "No upcoming earnings found"}
        </div>
      </div>
    );
  }

  const displayGroups = compact ? grouped.slice(0, 3) : grouped;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-muted-foreground">
          {lang === "de" ? "Earnings Kalender" : "Earnings Calendar"}
        </h3>
        <Badge variant="secondary" className="text-[10px] ml-auto">
          {events.length} {lang === "de" ? "anstehend" : "upcoming"}
        </Badge>
      </div>

      <div className="space-y-3">
        {displayGroups.map(([date, dayEvents]) => {
          const days = daysUntil(date);
          const isToday = days === 0;
          const isTomorrow = days === 1;

          return (
            <div key={date} className={`rounded-lg p-3 ${isToday ? "bg-primary/5 border border-primary/20" : "bg-muted/30"}`}>
              {/* Date header */}
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {formatDate(date, lang)}
                </span>
                {isToday && (
                  <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                    {lang === "de" ? "HEUTE" : "TODAY"}
                  </span>
                )}
                {isTomorrow && (
                  <span className="text-[10px] font-medium text-amber-500 px-1.5 py-0.5 rounded bg-amber-500/10">
                    {lang === "de" ? "MORGEN" : "TOMORROW"}
                  </span>
                )}
                {!isToday && !isTomorrow && days > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {days}d
                  </span>
                )}
              </div>

              {/* Events for this date */}
              <div className="space-y-1.5">
                {dayEvents.map((event) => (
                  <div key={`${event.symbol}-${event.date}`} className="flex items-center gap-2 text-sm">
                    <Link
                      to={`/stock/${event.symbol}`}
                      className="font-bold text-foreground hover:text-primary transition-colors min-w-[60px]"
                    >
                      {event.symbol}
                    </Link>
                    <HourBadge hour={event.hour} lang={lang} />
                    {event.quarter > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        Q{event.quarter}/{event.year}
                      </span>
                    )}
                    {event.epsEstimate != null && (
                      <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Est. {cSym}{event.epsEstimate.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {compact && grouped.length > 3 && (
        <div className="text-center mt-3">
          <span className="text-xs text-muted-foreground">
            +{grouped.length - 3} {lang === "de" ? "weitere Termine" : "more dates"}
          </span>
        </div>
      )}
    </div>
  );
}
