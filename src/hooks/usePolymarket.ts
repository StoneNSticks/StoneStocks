import { useQuery } from "@tanstack/react-query";
import { fetchEvents, fetchMarkets, searchEvents, fetchOrderbook, fetchTimeSeries } from "@/lib/polymarketApi";
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
