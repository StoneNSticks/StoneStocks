/**
 * polymarketApi — Typed client for all Polymarket APIs via edge function proxy.
 * Routes: Gamma (discovery), CLOB (orderbook/prices), Data (history/stats).
 * 
 * MIGRATION NOTE: To move away from Supabase, set VITE_POLYMARKET_PROXY_URL
 * to your own proxy endpoint (e.g. Express/Cloudflare Worker).
 * The proxy must accept ?path=/endpoint&param=value and route to the correct
 * Polymarket API base (gamma-api, clob, data-api).
 */
const BASE = import.meta.env.VITE_POLYMARKET_PROXY_URL
  || `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/polymarket-proxy`;

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
const POLITICS_KEYWORDS = ["president", "election", "senate", "congress", "vote", "trump", "biden", "republican", "democrat", "governor", "primary", "political", "war", "nato", "ukraine", "china", "tariff", "ceasefire", "iran", "russia", "impeach", "sanction"];

export type MarketCategory = "finance" | "politics" | "crypto" | "other";

export function categorizeMarket(question: string): MarketCategory {
  const q = question.toLowerCase();
  if (POLITICS_KEYWORDS.some(k => q.includes(k))) return "politics";
  if (q.includes("bitcoin") || q.includes("btc") || q.includes("eth") || q.includes("crypto") || q.includes("solana")) return "crypto";
  if (FINANCE_KEYWORDS.some(k => q.includes(k))) return "finance";
  return "other";
}

// ── Smart Sentiment: polarity-aware scoring ──

const FEAR_KEYWORDS = ["recession", "crash", "default", "impeach", "war", "decline", "collapse", "fail", "crisis", "downgrade", "shutdown", "invasion", "escalat", "sanctions", "tariff", "bear"];
const GREED_KEYWORDS = ["growth", "rally", "cut", "peace", "deal", "ceasefire", "approval", "rise", "bull", "recovery", "boom", "surplus", "gain", "win"];

function getMarketPolarity(question: string): "fear" | "greed" | "neutral" {
  const q = question.toLowerCase();
  const fearScore = FEAR_KEYWORDS.filter(k => q.includes(k)).length;
  const greedScore = GREED_KEYWORDS.filter(k => q.includes(k)).length;
  if (fearScore > greedScore) return "fear";
  if (greedScore > fearScore) return "greed";
  return "neutral";
}

/** 
 * Compute a polarity-aware sentiment score (0-100) from prediction markets.
 * Focuses on finance and world politics markets only.
 * Higher = more optimistic/greedy, Lower = more fearful.
 */
export function computePolymarketSentiment(markets: PolymarketMarket[]): number {
  if (!markets || markets.length === 0) return 50;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const m of markets) {
    const cat = categorizeMarket(m.question);
    // Only use finance and politics markets for sentiment
    if (cat !== "finance" && cat !== "politics") continue;
    
    try {
      const prices = JSON.parse(m.outcomePrices || "[]").map(Number);
      const yesPrice = prices[0] || 0.5;
      const vol = Number(m.volume || 0);
      if (vol <= 0) continue;
      
      const polarity = getMarketPolarity(m.question);
      const weight = Math.log10(vol + 1);
      
      let sentimentContribution: number;
      if (polarity === "fear") {
        // High "yes" on fear event = more fear = lower score
        sentimentContribution = (1 - yesPrice) * 100;
      } else if (polarity === "greed") {
        // High "yes" on greed event = more greed = higher score
        sentimentContribution = yesPrice * 100;
      } else {
        // Neutral: skip or use mild contribution
        sentimentContribution = 50;
      }
      
      totalWeight += weight;
      weightedSum += sentimentContribution * weight;
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
