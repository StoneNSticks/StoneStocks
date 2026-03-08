import { useQuery } from "@tanstack/react-query";
import {
  searchStocks, getQuote, getProfile, getOverview, getTimeSeries,
  getNews, getPeers, getRecommendation, getEarnings, getMarketIndices,
  getTechnicals, getFullStock,
  getMassiveFinancials, getMassiveTickerDetails, getMassiveDividends,
  getMassiveSplits, getMassiveAggregates, getMassiveSnapshot,
  getMassiveRelated, getMassiveNews,
  getMarketNews, getGainersLosers, getMostActive, getTopCompanies,
  getCurrencyRates, getSimFinStatements, getEulerpoolProfile, getHiddenGems, getInsiderTransactions, getEarningsCalendar,
} from "@/lib/stockApi";

export const useSearchStocks = (query: string) => useQuery({ queryKey: ["search", query], queryFn: () => searchStocks(query), enabled: query.length >= 1, staleTime: 1000 * 60 * 30 });
export const useQuote = (symbol: string) => useQuery({ queryKey: ["quote", symbol], queryFn: () => getQuote(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 2, refetchInterval: 1000 * 60 * 5 });
export const useProfile = (symbol: string) => useQuery({ queryKey: ["profile", symbol], queryFn: () => getProfile(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 });
export const useOverview = (symbol: string) => useQuery({ queryKey: ["overview", symbol], queryFn: () => getOverview(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 });
export const useTimeSeries = (symbol: string, interval = "1day", outputsize = "100") => useQuery({ queryKey: ["series", symbol, interval, outputsize], queryFn: () => getTimeSeries(symbol, interval, outputsize), enabled: !!symbol, staleTime: 1000 * 60 * 60 });
export const useNews = (symbol: string) => useQuery({ queryKey: ["news", symbol], queryFn: () => getNews(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 15 });
export const usePeers = (symbol: string) => useQuery({ queryKey: ["peers", symbol], queryFn: () => getPeers(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 });
export const useRecommendation = (symbol: string) => useQuery({ queryKey: ["recommendation", symbol], queryFn: () => getRecommendation(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 12 });
export const useEarnings = (symbol: string) => useQuery({ queryKey: ["earnings", symbol], queryFn: () => getEarnings(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 * 7 });
export const useMarketIndices = () => useQuery({ queryKey: ["indices"], queryFn: getMarketIndices, staleTime: 1000 * 60 * 5, refetchInterval: 1000 * 60 * 10 });
export const useTechnicals = (symbol: string) => useQuery({ queryKey: ["technicals", symbol], queryFn: () => getTechnicals(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 4 });
export const useFullStock = (symbol: string) => useQuery({ queryKey: ["fullStock", symbol], queryFn: () => getFullStock(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 3 });

// Massive hooks
export const useMassiveFinancials = (symbol: string) => useQuery({ queryKey: ["massiveFinancials", symbol], queryFn: () => getMassiveFinancials(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 });
export const useMassiveTickerDetails = (symbol: string) => useQuery({ queryKey: ["massiveTicker", symbol], queryFn: () => getMassiveTickerDetails(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 * 7 });
export const useMassiveDividends = (symbol: string) => useQuery({ queryKey: ["massiveDividends", symbol], queryFn: () => getMassiveDividends(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 * 7 });
export const useMassiveSplits = (symbol: string) => useQuery({ queryKey: ["massiveSplits", symbol], queryFn: () => getMassiveSplits(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 * 7 });
export const useMassiveAggregates = (symbol: string, timespan = "day", from = "", to = "") => useQuery({ queryKey: ["massiveAggs", symbol, timespan, from, to], queryFn: () => getMassiveAggregates(symbol, timespan, from, to), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 4 });
export const useMassiveSnapshot = (symbol: string) => useQuery({ queryKey: ["massiveSnapshot", symbol], queryFn: () => getMassiveSnapshot(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 5 });
export const useMassiveRelated = (symbol: string) => useQuery({ queryKey: ["massiveRelated", symbol], queryFn: () => getMassiveRelated(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 * 7 });
export const useMassiveNews = (symbol: string) => useQuery({ queryKey: ["massiveNews", symbol], queryFn: () => getMassiveNews(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 30 });

// Homepage hooks
export const useMarketNews = () => useQuery({ queryKey: ["marketNews"], queryFn: getMarketNews, staleTime: 1000 * 60 * 10, refetchInterval: 1000 * 60 * 15 });
export const useGainersLosers = () => useQuery({ queryKey: ["gainersLosers"], queryFn: getGainersLosers, staleTime: 1000 * 60 * 5, refetchInterval: 1000 * 60 * 10 });
export const useMostActive = () => useQuery({ queryKey: ["mostActive"], queryFn: getMostActive, staleTime: 1000 * 60 * 5, refetchInterval: 1000 * 60 * 10 });
export const useTopCompanies = () => useQuery({ queryKey: ["topCompanies"], queryFn: getTopCompanies, staleTime: 1000 * 60 * 10, refetchInterval: 1000 * 60 * 15 });
export const useCurrencyRates = () => useQuery({ queryKey: ["currencyRates"], queryFn: getCurrencyRates, staleTime: 1000 * 60 * 60 });
export const useSimFinStatements = (symbol: string) => useQuery({ queryKey: ["simfinStatements", symbol], queryFn: () => getSimFinStatements(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 * 7 });
export const useEulerpoolProfile = (symbol: string) => useQuery({ queryKey: ["eulerpoolProfile", symbol], queryFn: () => getEulerpoolProfile(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 60 * 24 * 7 });
export const useHiddenGems = () => useQuery({ queryKey: ["hiddenGems"], queryFn: getHiddenGems, staleTime: 1000 * 60 * 15, refetchInterval: 1000 * 60 * 30 });
export const useInsiderTransactions = (symbol: string) => useQuery({ queryKey: ["insiderTx", symbol], queryFn: () => getInsiderTransactions(symbol), enabled: !!symbol, staleTime: 1000 * 60 * 30 });
