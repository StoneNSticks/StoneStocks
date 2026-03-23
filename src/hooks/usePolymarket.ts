import { useQuery } from "@tanstack/react-query";
import {
  fetchEvents, fetchMarkets, searchEvents, fetchOrderbook, fetchTimeSeries,
  fetchMidpoint, fetchSpread, searchEarningsMarkets, fetchMacroMarkets, computePolymarketSentiment
} from "@/lib/polymarketApi";
import type { PolymarketEvent, PolymarketMarket, Orderbook, TimeSeriesPoint } from "@/lib/polymarketApi";

export function usePolymarketEvents(params?: Record<string, string>) {
  return useQuery<PolymarketEvent[]>({
    queryKey: ["polymarket-events", params],
    queryFn: () => fetchEvents(params),
    staleTime: 60_000,
  });
}

export function usePolymarketMarkets(params?: Record<string, string>) {
  return useQuery<PolymarketMarket[]>({
    queryKey: ["polymarket-markets", params],
    queryFn: () => fetchMarkets(params),
    staleTime: 60_000,
  });
}

export function usePolymarketSearch(query: string) {
  return useQuery<PolymarketEvent[]>({
    queryKey: ["polymarket-search", query],
    queryFn: () => searchEvents(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}

export function usePolymarketOrderbook(tokenId: string | null) {
  return useQuery<Orderbook>({
    queryKey: ["polymarket-book", tokenId],
    queryFn: () => fetchOrderbook(tokenId!),
    enabled: !!tokenId,
    staleTime: 15_000,
  });
}

export function usePolymarketTimeSeries(tokenId: string | null) {
  return useQuery<{ history: TimeSeriesPoint[] }>({
    queryKey: ["polymarket-ts", tokenId],
    queryFn: () => fetchTimeSeries(tokenId!),
    enabled: !!tokenId,
    staleTime: 60_000,
  });
}

export function usePolymarketMidpoint(tokenId: string | null) {
  return useQuery({
    queryKey: ["polymarket-mid", tokenId],
    queryFn: () => fetchMidpoint(tokenId!),
    enabled: !!tokenId,
    staleTime: 15_000,
  });
}

export function usePolymarketSpread(tokenId: string | null) {
  return useQuery({
    queryKey: ["polymarket-spread", tokenId],
    queryFn: () => fetchSpread(tokenId!),
    enabled: !!tokenId,
    staleTime: 15_000,
  });
}

/** Fetch earnings-related prediction markets for a stock */
export function usePolymarketEarnings(ticker: string, companyName?: string) {
  return useQuery<PolymarketMarket[]>({
    queryKey: ["polymarket-earnings", ticker, companyName],
    queryFn: () => searchEarningsMarkets(ticker, companyName),
    enabled: !!ticker,
    staleTime: 5 * 60_000,
  });
}

/** Fetch macro-relevant prediction markets */
export function usePolymarketMacro() {
  return useQuery<PolymarketEvent[]>({
    queryKey: ["polymarket-macro"],
    queryFn: () => fetchMacroMarkets(),
    staleTime: 5 * 60_000,
  });
}

/** Compute a prediction market sentiment score from top markets */
export function usePolymarketSentiment() {
  const { data: markets } = usePolymarketMarkets({ limit: "50" });
  
  return useQuery({
    queryKey: ["polymarket-sentiment", markets?.length],
    queryFn: () => computePolymarketSentiment(markets || []),
    enabled: !!markets && markets.length > 0,
    staleTime: 60_000,
  });
}
