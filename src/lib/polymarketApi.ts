/**
 * polymarketApi — Typed client for all Polymarket APIs via edge function proxy.
 * Routes: Gamma (discovery), CLOB (orderbook/prices), Data (history/stats).
 */
const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const BASE = `https://${PROJECT_ID}.supabase.co/functions/v1/polymarket-proxy`;

async function proxyGet<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(BASE);
  url.searchParams.set("path", path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Polymarket API error [${res.status}]: ${text}`);
  }
  return res.json();
}

// ── Types ──

export interface PolymarketMarket {
  id: string;
  question: string;
  slug: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  liquidity: string;
  active: boolean;
  closed: boolean;
  endDate: string;
  image: string;
  icon: string;
  category: string;
  volume24hr: number;
  clobTokenIds: string;
  oneDayPriceChange: number;
  bestBid: number;
  bestAsk: number;
  description?: string;
  conditionId?: string;
}

export interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  volume: number;
  volume24hr: number;
  liquidity: number;
  category: string;
  startDate: string;
  endDate: string;
  markets: PolymarketMarket[];
  commentCount: number;
}

export interface OrderbookLevel {
  price: string;
  size: string;
}

export interface Orderbook {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  market: string;
  asset_id: string;
  hash: string;
  timestamp: string;
}

export interface TimeSeriesPoint {
  t: number;
  p: number;
}

// ── Gamma API (Discovery) ──

export function fetchEvents(params: Record<string, string> = {}): Promise<PolymarketEvent[]> {
  return proxyGet<PolymarketEvent[]>("/events", {
    limit: "20",
    active: "true",
    closed: "false",
    order: "volume24hr",
    ascending: "false",
    ...params,
  });
}

export function fetchMarkets(params: Record<string, string> = {}): Promise<PolymarketMarket[]> {
  return proxyGet<PolymarketMarket[]>("/markets", {
    limit: "30",
    active: "true",
    closed: "false",
    order: "volume24hr",
    ascending: "false",
    ...params,
  });
}

export function searchEvents(query: string): Promise<PolymarketEvent[]> {
  return proxyGet<PolymarketEvent[]>("/events", {
    limit: "20",
    active: "true",
    closed: "false",
    title: query,
  });
}

// ── CLOB API (Orderbook/Prices) ──

export function fetchOrderbook(tokenId: string): Promise<Orderbook> {
  return proxyGet<Orderbook>("/book", { token_id: tokenId });
}

export function fetchPrices(tokenIds: string[]): Promise<Record<string, number>> {
  return proxyGet<Record<string, number>>("/prices", { token_ids: tokenIds.join(",") });
}

export function fetchMidpoint(tokenId: string): Promise<{ mid: number }> {
  return proxyGet<{ mid: number }>("/midpoint", { token_id: tokenId });
}

export function fetchSpread(tokenId: string): Promise<{ spread: number }> {
  return proxyGet<{ spread: number }>("/spread", { token_id: tokenId });
}

// ── Data API (History/Stats) ──

export function fetchTimeSeries(tokenId: string, fidelity = 60): Promise<{ history: TimeSeriesPoint[] }> {
  return proxyGet<{ history: TimeSeriesPoint[] }>("/prices-history", {
    market: tokenId,
    interval: "max",
    fidelity: String(fidelity),
  });
}

// ── Utility: categorize markets ──

const FINANCE_KEYWORDS = ["fed", "rate", "inflation", "recession", "gdp", "unemployment", "treasury", "interest", "earnings", "stock", "market", "s&p", "nasdaq", "dow", "bitcoin", "btc", "eth", "crypto", "oil", "gold", "economic"];
const POLITICS_KEYWORDS = ["president", "election", "senate", "congress", "vote", "trump", "biden", "republican", "democrat", "governor", "primary", "political", "war", "nato", "ukraine", "china", "tariff"];

export type MarketCategory = "finance" | "politics" | "crypto" | "other";

export function categorizeMarket(question: string): MarketCategory {
  const q = question.toLowerCase();
  if (POLITICS_KEYWORDS.some(k => q.includes(k))) return "politics";
  if (q.includes("bitcoin") || q.includes("btc") || q.includes("eth") || q.includes("crypto") || q.includes("solana")) return "crypto";
  if (FINANCE_KEYWORDS.some(k => q.includes(k))) return "finance";
  return "other";
}

/** Extract a sentiment score (0-100) from a set of markets. Higher = more risk-on/optimistic. */
export function computePolymarketSentiment(markets: PolymarketMarket[]): number {
  if (!markets || markets.length === 0) return 50;
  
  // Look at financial/economic markets and compute average "yes" probability
  // weighted by volume — markets with more volume count more
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const m of markets) {
    const cat = categorizeMarket(m.question);
    if (cat !== "finance" && cat !== "politics") continue;
    
    try {
      const prices = JSON.parse(m.outcomePrices || "[]").map(Number);
      const yesPrice = prices[0] || 0.5;
      const vol = Number(m.volume || 0);
      if (vol <= 0) continue;
      
      const weight = Math.log10(vol + 1);
      totalWeight += weight;
      weightedSum += yesPrice * 100 * weight;
    } catch { /* skip */ }
  }
  
  return totalWeight > 0 ? Math.min(100, Math.max(0, weightedSum / totalWeight)) : 50;
}

/** Search for earnings-related markets for a specific ticker/company */
export async function searchEarningsMarkets(ticker: string, companyName?: string): Promise<PolymarketMarket[]> {
  const queries = [ticker];
  if (companyName) queries.push(companyName);
  
  const results: PolymarketMarket[] = [];
  
  for (const q of queries) {
    try {
      const events = await searchEvents(q);
      for (const event of events || []) {
        for (const market of event.markets || []) {
          const question = market.question.toLowerCase();
          if (question.includes("earning") || question.includes("revenue") || question.includes("profit") || 
              question.includes("beat") || question.includes("miss") || question.includes("guidance") ||
              question.includes(ticker.toLowerCase())) {
            results.push(market);
          }
        }
      }
    } catch { /* ignore search failures */ }
  }
  
  // Deduplicate by market id
  const seen = new Set<string>();
  return results.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

/** Fetch macro-relevant markets (Fed, inflation, recession, etc.) */
export async function fetchMacroMarkets(): Promise<PolymarketEvent[]> {
  const macroQueries = ["federal reserve", "inflation", "recession", "interest rate"];
  const allEvents: PolymarketEvent[] = [];
  const seenIds = new Set<string>();
  
  for (const q of macroQueries) {
    try {
      const events = await searchEvents(q);
      for (const event of events || []) {
        if (!seenIds.has(event.id)) {
          seenIds.add(event.id);
          allEvents.push(event);
        }
      }
    } catch { /* ignore */ }
  }
  
  return allEvents;
}
