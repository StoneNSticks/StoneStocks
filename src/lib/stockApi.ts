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

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function searchStocks(query: string) {
  return callStockApi({ action: "search", q: query });
}

export async function getQuote(symbol: string) {
  return callStockApi({ action: "quote", symbol });
}

export async function getProfile(symbol: string) {
  return callStockApi({ action: "profile", symbol });
}

export async function getOverview(symbol: string) {
  return callStockApi({ action: "overview", symbol });
}

export async function getTimeSeries(symbol: string, interval = "daily") {
  return callStockApi({ action: "series", symbol, interval });
}

export async function getNews(symbol: string) {
  return callStockApi({ action: "news", symbol });
}

export async function getPeers(symbol: string) {
  return callStockApi({ action: "peers", symbol });
}

export async function getRecommendation(symbol: string) {
  return callStockApi({ action: "recommendation", symbol });
}

export async function getEarnings(symbol: string) {
  return callStockApi({ action: "earnings", symbol });
}

export async function getMarketIndices() {
  return callStockApi({ action: "indices" });
}

export async function getTechnicals(symbol: string) {
  return callStockApi({ action: "technicals", symbol });
}

export async function getFullStock(symbol: string) {
  return callStockApi({ action: "full", symbol });
}

// Massive API endpoints
export async function getMassiveFinancials(symbol: string) {
  return callStockApi({ action: "massive_financials", symbol });
}

export async function getMassiveTickerDetails(symbol: string) {
  return callStockApi({ action: "massive_ticker", symbol });
}

export async function getMassiveDividends(symbol: string) {
  return callStockApi({ action: "massive_dividends", symbol });
}

export async function getMassiveSplits(symbol: string) {
  return callStockApi({ action: "massive_splits", symbol });
}

export async function getMassiveAggregates(symbol: string, timespan = "day", from = "", to = "") {
  const params: Record<string, string> = { action: "massive_aggs", symbol, timespan };
  if (from) params.from = from;
  if (to) params.to = to;
  return callStockApi(params);
}

export async function getMassiveSnapshot(symbol: string) {
  return callStockApi({ action: "massive_snapshot", symbol });
}

export async function getMassiveRelated(symbol: string) {
  return callStockApi({ action: "massive_related", symbol });
}

export async function getMassiveNews(symbol: string) {
  return callStockApi({ action: "massive_news", symbol });
}
