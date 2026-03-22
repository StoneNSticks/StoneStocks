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

// ── Gamma API ──

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

// ── CLOB API ──

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

export function fetchOrderbook(tokenId: string): Promise<Orderbook> {
  return proxyGet<Orderbook>("/book", { token_id: tokenId });
}

export function fetchPrices(tokenIds: string[]): Promise<Record<string, number>> {
  return proxyGet<Record<string, number>>("/prices", { token_ids: tokenIds.join(",") });
}

// ── Data API ──

export interface TimeSeriesPoint {
  t: number; // timestamp
  p: number; // price
}

export function fetchTimeSeries(tokenId: string, fidelity = 60): Promise<{ history: TimeSeriesPoint[] }> {
  return proxyGet<{ history: TimeSeriesPoint[] }>(`/prices-history`, {
    market: tokenId,
    interval: "max",
    fidelity: String(fidelity),
  });
}
