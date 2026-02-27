import { useQuery } from "@tanstack/react-query";
import {
  searchStocks,
  getQuote,
  getProfile,
  getOverview,
  getTimeSeries,
  getNews,
  getPeers,
  getRecommendation,
  getEarnings,
  getMarketIndices,
  getTechnicals,
  getFullStock,
  getMassiveFinancials,
  getMassiveTickerDetails,
  getMassiveDividends,
  getMassiveSplits,
  getMassiveAggregates,
  getMassiveSnapshot,
  getMassiveRelated,
  getMassiveNews,
} from "@/lib/stockApi";

export function useSearchStocks(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchStocks(query),
    enabled: query.length >= 1,
    staleTime: 1000 * 60 * 30,
  });
}

export function useQuote(symbol: string) {
  return useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => getQuote(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useProfile(symbol: string) {
  return useQuery({
    queryKey: ["profile", symbol],
    queryFn: () => getProfile(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useOverview(symbol: string) {
  return useQuery({
    queryKey: ["overview", symbol],
    queryFn: () => getOverview(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useTimeSeries(symbol: string, interval = "daily") {
  return useQuery({
    queryKey: ["series", symbol, interval],
    queryFn: () => getTimeSeries(symbol, interval),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60,
  });
}

export function useNews(symbol: string) {
  return useQuery({
    queryKey: ["news", symbol],
    queryFn: () => getNews(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 15,
  });
}

export function usePeers(symbol: string) {
  return useQuery({
    queryKey: ["peers", symbol],
    queryFn: () => getPeers(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useRecommendation(symbol: string) {
  return useQuery({
    queryKey: ["recommendation", symbol],
    queryFn: () => getRecommendation(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 12,
  });
}

export function useEarnings(symbol: string) {
  return useQuery({
    queryKey: ["earnings", symbol],
    queryFn: () => getEarnings(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
}

export function useMarketIndices() {
  return useQuery({
    queryKey: ["indices"],
    queryFn: getMarketIndices,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 10,
  });
}

export function useTechnicals(symbol: string) {
  return useQuery({
    queryKey: ["technicals", symbol],
    queryFn: () => getTechnicals(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 4,
  });
}

export function useFullStock(symbol: string) {
  return useQuery({
    queryKey: ["fullStock", symbol],
    queryFn: () => getFullStock(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 3,
  });
}

// Massive API hooks

export function useMassiveFinancials(symbol: string) {
  return useQuery({
    queryKey: ["massiveFinancials", symbol],
    queryFn: () => getMassiveFinancials(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useMassiveTickerDetails(symbol: string) {
  return useQuery({
    queryKey: ["massiveTicker", symbol],
    queryFn: () => getMassiveTickerDetails(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
}

export function useMassiveDividends(symbol: string) {
  return useQuery({
    queryKey: ["massiveDividends", symbol],
    queryFn: () => getMassiveDividends(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
}

export function useMassiveSplits(symbol: string) {
  return useQuery({
    queryKey: ["massiveSplits", symbol],
    queryFn: () => getMassiveSplits(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
}

export function useMassiveAggregates(symbol: string, timespan = "day", from = "", to = "") {
  return useQuery({
    queryKey: ["massiveAggs", symbol, timespan, from, to],
    queryFn: () => getMassiveAggregates(symbol, timespan, from, to),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 4,
  });
}

export function useMassiveSnapshot(symbol: string) {
  return useQuery({
    queryKey: ["massiveSnapshot", symbol],
    queryFn: () => getMassiveSnapshot(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMassiveRelated(symbol: string) {
  return useQuery({
    queryKey: ["massiveRelated", symbol],
    queryFn: () => getMassiveRelated(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
}

export function useMassiveNews(symbol: string) {
  return useQuery({
    queryKey: ["massiveNews", symbol],
    queryFn: () => getMassiveNews(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 30,
  });
}
