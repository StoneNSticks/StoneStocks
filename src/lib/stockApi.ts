const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function callStockApi(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const url = `https://${PROJECT_ID}.supabase.co/functions/v1/stock-data?${searchParams.toString()}`;
  const res = await fetch(url, {
    headers: {
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Existing endpoints
export const searchStocks = (query: string) => callStockApi({ action: "search", q: query });
export const getQuote = (symbol: string) => callStockApi({ action: "quote", symbol });
export const getProfile = (symbol: string) => callStockApi({ action: "profile", symbol });
export const getOverview = (symbol: string) => callStockApi({ action: "overview", symbol });
export const getTimeSeries = (symbol: string, interval = "daily") => callStockApi({ action: "series", symbol, interval });
export const getNews = (symbol: string) => callStockApi({ action: "news", symbol });
export const getPeers = (symbol: string) => callStockApi({ action: "peers", symbol });
export const getRecommendation = (symbol: string) => callStockApi({ action: "recommendation", symbol });
export const getEarnings = (symbol: string) => callStockApi({ action: "earnings", symbol });
export const getMarketIndices = () => callStockApi({ action: "indices" });
export const getTechnicals = (symbol: string) => callStockApi({ action: "technicals", symbol });
export const getFullStock = (symbol: string) => callStockApi({ action: "full", symbol });

// Massive API endpoints
export const getMassiveFinancials = (symbol: string) => callStockApi({ action: "massive_financials", symbol });
export const getMassiveTickerDetails = (symbol: string) => callStockApi({ action: "massive_ticker", symbol });
export const getMassiveDividends = (symbol: string) => callStockApi({ action: "massive_dividends", symbol });
export const getMassiveSplits = (symbol: string) => callStockApi({ action: "massive_splits", symbol });
export const getMassiveAggregates = (symbol: string, timespan = "day", from = "", to = "") => {
  const params: Record<string, string> = { action: "massive_aggs", symbol, timespan };
  if (from) params.from = from;
  if (to) params.to = to;
  return callStockApi(params);
};
export const getMassiveSnapshot = (symbol: string) => callStockApi({ action: "massive_snapshot", symbol });
export const getMassiveRelated = (symbol: string) => callStockApi({ action: "massive_related", symbol });
export const getMassiveNews = (symbol: string) => callStockApi({ action: "massive_news", symbol });

// Homepage endpoints
export const getMarketNews = () => callStockApi({ action: "market_news" });
export const getGainersLosers = () => callStockApi({ action: "gainers_losers" });
export const getMostActive = () => callStockApi({ action: "most_active" });
export const getTopCompanies = () => callStockApi({ action: "top_companies" });
export const getCurrencyRates = () => callStockApi({ action: "currency_rates" });
export const getSimFinStatements = (symbol: string) => callStockApi({ action: "simfin_statements", symbol });
export const getEulerpoolProfile = (symbol: string) => callStockApi({ action: "eulerpool_profile", symbol });
export const getHiddenGems = () => callStockApi({ action: "hidden_gems" });
