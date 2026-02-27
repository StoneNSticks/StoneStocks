import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALPHA_VANTAGE_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY")!;
const TWELVE_DATA_KEY = Deno.env.get("TWELVE_DATA_API_KEY")!;
const FINNHUB_KEY = Deno.env.get("FINNHUB_API_KEY")!;
const MASSIVE_KEYS = [
  Deno.env.get("MASSIVE_API_KEY_1")!,
  Deno.env.get("MASSIVE_API_KEY_2")!,
  Deno.env.get("MASSIVE_API_KEY_3")!,
].filter(Boolean);

let massiveKeyIndex = 0;
function getMassiveKey(): string {
  const key = MASSIVE_KEYS[massiveKeyIndex % MASSIVE_KEYS.length];
  massiveKeyIndex++;
  return key;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const TTL: Record<string, number> = {
  profile: 60 * 24 * 7, quote: 5, daily_series: 60 * 4, weekly_series: 60 * 24,
  monthly_series: 60 * 24 * 3, financials: 60 * 24 * 7, overview: 60 * 24 * 7,
  news: 30, peers: 60 * 24 * 7, recommendation: 60 * 24, earnings: 60 * 24 * 7,
  search: 60 * 24 * 30, market_indices: 10, technicals: 60 * 4,
  massive_financials: 60 * 24, massive_ticker: 60 * 24 * 7,
  massive_dividends: 60 * 24 * 7, massive_splits: 60 * 24 * 7,
  massive_aggs: 60 * 4, massive_snapshot: 5, massive_related: 60 * 24 * 7,
  massive_news: 30, market_news: 15, gainers_losers: 60 * 4,
  most_active: 10, top_companies: 15,
};

async function getCached(key: string): Promise<unknown | null> {
  const { data } = await supabase.from("api_cache").select("data, expires_at").eq("cache_key", key).single();
  if (data && new Date(data.expires_at) > new Date()) return data.data;
  return null;
}

async function setCache(key: string, value: unknown, source: string, ttlMinutes: number) {
  const expires_at = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  await supabase.from("api_cache").upsert(
    { cache_key: key, data: value, source, expires_at, updated_at: new Date().toISOString() },
    { onConflict: "cache_key" }
  );
}

// === API Fetch Helpers ===

async function fetchFinnhub(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`https://finnhub.io/api/v1/${endpoint}`);
  url.searchParams.set("token", FINNHUB_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);
  return res.json();
}

async function fetchAlphaVantage(fn: string, params: Record<string, string> = {}) {
  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", fn);
  url.searchParams.set("apikey", ALPHA_VANTAGE_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`AlphaVantage error: ${res.status}`);
  return res.json();
}

async function fetchTwelveData(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`https://api.twelvedata.com/${endpoint}`);
  url.searchParams.set("apikey", TWELVE_DATA_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TwelveData error: ${res.status}`);
  return res.json();
}

async function fetchMassive(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`https://api.polygon.io${endpoint}`);
  url.searchParams.set("apiKey", getMassiveKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Massive error: ${res.status}`);
  return res.json();
}

// === Stock Handlers ===

async function handleProfile(symbol: string) {
  const cacheKey = `profile:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const profile = await fetchFinnhub("stock/profile2", { symbol });
  if (profile?.name) { await setCache(cacheKey, profile, "finnhub", TTL.profile); return profile; }
  return null;
}

async function handleQuote(symbol: string) {
  const cacheKey = `quote:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const quote = await fetchFinnhub("quote", { symbol });
  if (quote?.c) { await setCache(cacheKey, quote, "finnhub", TTL.quote); return quote; }
  return null;
}

async function handleOverview(symbol: string) {
  const cacheKey = `overview:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const overview = await fetchAlphaVantage("OVERVIEW", { symbol });
  if (overview?.Symbol) { await setCache(cacheKey, overview, "alphavantage", TTL.overview); return overview; }
  return null;
}

async function handleTimeSeries(symbol: string, interval: string) {
  const cacheKey = `series:${symbol}:${interval}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const params: Record<string, string> = { symbol, outputsize: "100" };
  if (interval === "daily") params.interval = "1day";
  else if (interval === "weekly") params.interval = "1week";
  else if (interval === "monthly") params.interval = "1month";
  else params.interval = interval;
  const series = await fetchTwelveData("time_series", params);
  const ttlKey = interval === "1day" || interval === "daily" ? "daily_series" :
                 interval === "1week" || interval === "weekly" ? "weekly_series" : "monthly_series";
  if (series?.values) { await setCache(cacheKey, series, "twelvedata", TTL[ttlKey]); return series; }
  return null;
}

async function handleNews(symbol: string) {
  const cacheKey = `news:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const to = new Date().toISOString().split("T")[0];
  const news = await fetchFinnhub("company-news", { symbol, from, to });
  if (Array.isArray(news)) {
    const trimmed = news.slice(0, 20);
    await setCache(cacheKey, trimmed, "finnhub", TTL.news);
    return trimmed;
  }
  return [];
}

async function handlePeers(symbol: string) {
  const cacheKey = `peers:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const peers = await fetchFinnhub("stock/peers", { symbol });
  if (Array.isArray(peers)) { await setCache(cacheKey, peers, "finnhub", TTL.peers); return peers; }
  return [];
}

async function handleRecommendation(symbol: string) {
  const cacheKey = `recommendation:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const rec = await fetchFinnhub("stock/recommendation", { symbol });
  if (Array.isArray(rec)) { await setCache(cacheKey, rec, "finnhub", TTL.recommendation); return rec; }
  return [];
}

async function handleEarnings(symbol: string) {
  const cacheKey = `earnings:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const earnings = await fetchAlphaVantage("EARNINGS", { symbol });
  if (earnings) { await setCache(cacheKey, earnings, "alphavantage", TTL.earnings); return earnings; }
  return null;
}

async function handleSearch(query: string) {
  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const results = await fetchFinnhub("search", { q: query });
  if (results?.result) {
    const filtered = results.result
      .filter((r: Record<string, unknown>) => r.type === "Common Stock" || r.type === "ETP" || r.type === "ADR")
      .slice(0, 10);
    await setCache(cacheKey, filtered, "finnhub", TTL.search);
    return filtered;
  }
  return [];
}

async function handleTechnicals(symbol: string) {
  const cacheKey = `technicals:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const [rsi, macd] = await Promise.all([
    fetchTwelveData("rsi", { symbol, interval: "1day", time_period: "14", outputsize: "30" }),
    fetchTwelveData("macd", { symbol, interval: "1day", outputsize: "30" }),
  ]);
  const result = { rsi: rsi?.values || [], macd: macd?.values || [] };
  await setCache(cacheKey, result, "twelvedata", TTL.technicals);
  return result;
}

// === Massive API Handlers ===

async function handleMassiveTickerDetails(symbol: string) {
  const cacheKey = `massive_ticker:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const data = await fetchMassive(`/v3/reference/tickers/${symbol}`);
  if (data?.results) { await setCache(cacheKey, data.results, "massive", TTL.massive_ticker); return data.results; }
  return null;
}

async function handleMassiveFinancials(symbol: string) {
  const cacheKey = `massive_financials:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const data = await fetchMassive("/vX/reference/financials", {
    ticker: symbol, limit: "20", sort: "filing_date", order: "desc", timeframe: "quarterly",
  });
  if (data?.results) { await setCache(cacheKey, data.results, "massive", TTL.massive_financials); return data.results; }
  return [];
}

async function handleMassiveDividends(symbol: string) {
  const cacheKey = `massive_dividends:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const data = await fetchMassive("/v3/reference/dividends", { ticker: symbol, limit: "50", order: "desc" });
  if (data?.results) { await setCache(cacheKey, data.results, "massive", TTL.massive_dividends); return data.results; }
  return [];
}

async function handleMassiveSplits(symbol: string) {
  const cacheKey = `massive_splits:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const data = await fetchMassive("/v3/reference/splits", { ticker: symbol });
  if (data?.results) { await setCache(cacheKey, data.results, "massive", TTL.massive_splits); return data.results; }
  return [];
}

async function handleMassiveAggregates(symbol: string, timespan = "day", from = "", to = "") {
  if (!from) { const d = new Date(); d.setFullYear(d.getFullYear() - 5); from = d.toISOString().split("T")[0]; }
  if (!to) to = new Date().toISOString().split("T")[0];
  const cacheKey = `massive_aggs:${symbol}:${timespan}:${from}:${to}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const data = await fetchMassive(`/v2/aggs/ticker/${symbol}/range/1/${timespan}/${from}/${to}`, { adjusted: "true", sort: "asc", limit: "5000" });
  if (data?.results) { await setCache(cacheKey, data.results, "massive", TTL.massive_aggs); return data.results; }
  return [];
}

async function handleMassiveSnapshot(symbol: string) {
  const cacheKey = `massive_snapshot:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const data = await fetchMassive(`/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}`);
  if (data?.ticker) { await setCache(cacheKey, data.ticker, "massive", TTL.massive_snapshot); return data.ticker; }
  return null;
}

async function handleMassiveRelated(symbol: string) {
  const cacheKey = `massive_related:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const data = await fetchMassive(`/v1/related-companies/${symbol}`);
  if (data?.results) { await setCache(cacheKey, data.results, "massive", TTL.massive_related); return data.results; }
  return [];
}

async function handleMassiveNews(symbol: string) {
  const cacheKey = `massive_news:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const data = await fetchMassive("/v2/reference/news", { ticker: symbol, limit: "20", order: "desc" });
  if (data?.results) { await setCache(cacheKey, data.results, "massive", TTL.massive_news); return data.results; }
  return [];
}

// === Homepage Data Handlers ===

// Real index point values using Twelve Data + ETF route mapping
const INDEX_CONFIG: Record<string, { name: string; etf: string }> = {
  "SPX": { name: "S&P 500", etf: "SPY" },
  "DJI": { name: "Dow Jones", etf: "DIA" },
  "IXIC": { name: "Nasdaq", etf: "QQQ" },
  "RUT": { name: "Russell 2000", etf: "IWM" },
};

async function handleMarketIndices() {
  const cacheKey = "market:indices:v2";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const symbols = Object.keys(INDEX_CONFIG);
  const indices = await Promise.all(
    symbols.map(async (sym) => {
      try {
        const q = await fetchTwelveData("quote", { symbol: sym });
        const price = parseFloat(q.close || "0");
        const prevClose = parseFloat(q.previous_close || "0");
        const change = parseFloat(q.change || "0");
        const changePercent = parseFloat(q.percent_change || "0");
        return {
          symbol: INDEX_CONFIG[sym].etf,
          indexSymbol: sym,
          name: INDEX_CONFIG[sym].name,
          price,
          prevClose,
          change,
          changePercent,
        };
      } catch {
        // Fallback to Finnhub ETF quote
        try {
          const q = await fetchFinnhub("quote", { symbol: INDEX_CONFIG[sym].etf });
          return {
            symbol: INDEX_CONFIG[sym].etf,
            indexSymbol: sym,
            name: INDEX_CONFIG[sym].name,
            price: q.c || 0,
            prevClose: q.pc || 0,
            change: q.d || 0,
            changePercent: q.dp || 0,
          };
        } catch {
          return { symbol: INDEX_CONFIG[sym].etf, indexSymbol: sym, name: INDEX_CONFIG[sym].name, price: 0, prevClose: 0, change: 0, changePercent: 0 };
        }
      }
    })
  );

  await setCache(cacheKey, indices, "twelvedata", TTL.market_indices);
  return indices;
}

// Combined market news from Finnhub + Polygon
async function handleMarketNews() {
  const cacheKey = "market:news:combined";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const [finnhubNews, polygonNews] = await Promise.all([
    fetchFinnhub("news", { category: "general" }).catch(() => []),
    fetchMassive("/v2/reference/news", { limit: "15", order: "desc" }).catch(() => ({ results: [] })),
  ]);

  // Normalize Finnhub news
  const fhItems = (Array.isArray(finnhubNews) ? finnhubNews : []).map((n: any) => ({
    headline: n.headline,
    summary: n.summary,
    url: n.url,
    image: n.image,
    source: n.source,
    datetime: n.datetime,
    related: n.related || "",
    origin: "finnhub",
  }));

  // Normalize Polygon news
  const pgItems = (polygonNews?.results || []).map((n: any) => ({
    headline: n.title,
    summary: n.description || "",
    url: n.article_url,
    image: n.image_url || "",
    source: n.publisher?.name || "Polygon",
    datetime: Math.floor(new Date(n.published_utc).getTime() / 1000),
    related: n.tickers?.[0] || "",
    origin: "polygon",
  }));

  // Merge & deduplicate by headline similarity, sort by datetime desc
  const seen = new Set<string>();
  const combined = [...fhItems, ...pgItems]
    .filter((n: any) => {
      const key = n.headline?.toLowerCase().slice(0, 50);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a: any, b: any) => b.datetime - a.datetime)
    .slice(0, 25);

  await setCache(cacheKey, combined, "combined", TTL.market_news);
  return combined;
}

// Get last trading date
function getLastTradingDate(): string {
  const now = new Date();
  // Adjust for EST (UTC-5)
  const est = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  const hour = est.getHours();
  const day = est.getDay();

  // If it's a weekday and after 4pm, use today
  // If before 4pm, use previous trading day
  // If weekend, use Friday
  let daysBack = 0;
  if (day === 0) daysBack = 2; // Sunday -> Friday
  else if (day === 6) daysBack = 1; // Saturday -> Friday
  else if (day === 1 && hour < 16) daysBack = 3; // Monday before close -> Friday
  else if (hour < 16) daysBack = 1; // Before close -> yesterday
  // After close -> today (daysBack = 0)

  const d = new Date(est);
  d.setDate(d.getDate() - daysBack);
  return d.toISOString().split("T")[0];
}

async function handleGainersLosers() {
  const lastDate = getLastTradingDate();
  const cacheKey = `market:gainers_losers:${lastDate}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchMassive(`/v2/aggs/grouped/locale/us/market/stocks/${lastDate}`, {
      adjusted: "true",
    });

    if (!data?.results || data.results.length === 0) {
      return { gainers: [], losers: [], date: lastDate };
    }

    const stocks = data.results
      .filter((s: any) => s.c > 2 && s.v > 200000 && s.o > 0) // $2+ price, 200k+ volume
      .map((s: any) => ({
        symbol: s.T,
        price: s.c,
        open: s.o,
        high: s.h,
        low: s.l,
        change: s.c - s.o,
        changePercent: ((s.c - s.o) / s.o) * 100,
        volume: s.v,
      }))
      .filter((s: any) => Math.abs(s.changePercent) < 100); // filter out glitches

    stocks.sort((a: any, b: any) => b.changePercent - a.changePercent);

    const result = {
      gainers: stocks.slice(0, 10),
      losers: stocks.slice(-10).reverse(),
      date: lastDate,
    };

    await setCache(cacheKey, result, "massive", TTL.gainers_losers);
    return result;
  } catch (err) {
    console.error("Gainers/losers error:", err);
    return { gainers: [], losers: [], date: lastDate };
  }
}

async function handleMostActive() {
  const lastDate = getLastTradingDate();
  const cacheKey = `market:most_active:${lastDate}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchMassive(`/v2/aggs/grouped/locale/us/market/stocks/${lastDate}`, {
      adjusted: "true",
    });

    if (!data?.results) return [];

    const stocks = data.results
      .filter((s: any) => s.c > 2 && s.v > 500000 && s.o > 0)
      .map((s: any) => ({
        symbol: s.T,
        price: s.c,
        change: s.c - s.o,
        changePercent: ((s.c - s.o) / s.o) * 100,
        volume: s.v,
      }))
      .sort((a: any, b: any) => b.volume - a.volume)
      .slice(0, 15);

    await setCache(cacheKey, stocks, "massive", TTL.most_active);
    return stocks;
  } catch {
    return [];
  }
}

const TOP_COMPANIES = [
  { symbol: "NVDA", name: "NVIDIA" }, { symbol: "AAPL", name: "Apple" },
  { symbol: "GOOG", name: "Alphabet" }, { symbol: "MSFT", name: "Microsoft" },
  { symbol: "AMZN", name: "Amazon" }, { symbol: "META", name: "Meta Platforms" },
  { symbol: "TSLA", name: "Tesla" }, { symbol: "AVGO", name: "Broadcom" },
  { symbol: "TSM", name: "TSMC" }, { symbol: "BRK.B", name: "Berkshire Hathaway" },
];

async function handleTopCompanies() {
  const cacheKey = "market:top_companies";
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const quotes = await Promise.all(
    TOP_COMPANIES.map(async (c) => {
      try {
        const [q, profile] = await Promise.all([
          fetchFinnhub("quote", { symbol: c.symbol }),
          fetchFinnhub("stock/profile2", { symbol: c.symbol }),
        ]);
        return {
          symbol: c.symbol, name: c.name, price: q.c || 0,
          change: q.d || 0, changePercent: q.dp || 0,
          marketCap: profile?.marketCapitalization ? profile.marketCapitalization * 1e6 : 0,
          logo: profile?.logo || "",
        };
      } catch {
        return { symbol: c.symbol, name: c.name, price: 0, change: 0, changePercent: 0, marketCap: 0, logo: "" };
      }
    })
  );
  quotes.sort((a: any, b: any) => b.marketCap - a.marketCap);
  await setCache(cacheKey, quotes, "finnhub", TTL.top_companies);
  return quotes;
}

// === Derived metrics ===

function calculateDerivedMetrics(overview: Record<string, string> | null, quote: Record<string, number> | null) {
  const price = parseFloat(quote?.c?.toString() || overview?.Price || "0");
  const eps = parseFloat(overview?.EPS || "0");
  const bookValue = parseFloat(overview?.BookValue || "0");
  const dividendPerShare = parseFloat(overview?.DividendPerShare || "0");
  const shares = parseFloat(overview?.SharesOutstanding || "0");
  const revenue = parseFloat(overview?.RevenueTTM || "0");
  const ebitda = parseFloat(overview?.EBITDATTM || overview?.EBITDA || "0");
  const totalDebt = parseFloat(overview?.TotalDebt || "0");
  const cash = parseFloat(overview?.CashAndCashEquivalentsAtCarryingValue || "0");
  const operatingCashflow = parseFloat(overview?.OperatingCashflowTTM || "0");
  const capex = parseFloat(overview?.CapitalExpenditures || "0");
  const marketCap = price * shares;
  return {
    calculatedPE: eps !== 0 ? price / eps : null,
    calculatedPB: bookValue !== 0 ? price / bookValue : null,
    calculatedPS: revenue !== 0 ? marketCap / revenue : null,
    dividendYield: price !== 0 ? (dividendPerShare / price) * 100 : null,
    evToEbitda: ebitda !== 0 ? (marketCap + totalDebt - cash) / ebitda : null,
    freeCashflow: operatingCashflow - Math.abs(capex),
    fcfYield: marketCap !== 0 ? ((operatingCashflow - Math.abs(capex)) / marketCap) * 100 : null,
    marketCap,
  };
}

// === Full Stock (orchestrator) ===

async function handleFullStock(symbol: string) {
  const [profile, quote, overview, news, peers, recommendation, massiveFinancials, massiveTicker, massiveDividends, massiveSnapshot] = await Promise.all([
    handleProfile(symbol), handleQuote(symbol), handleOverview(symbol),
    handleNews(symbol), handlePeers(symbol), handleRecommendation(symbol),
    handleMassiveFinancials(symbol).catch(() => []),
    handleMassiveTickerDetails(symbol).catch(() => null),
    handleMassiveDividends(symbol).catch(() => []),
    handleMassiveSnapshot(symbol).catch(() => null),
  ]);
  const derived = calculateDerivedMetrics(overview || {}, quote || {});
  return { profile, quote, overview, derived, news, peers, recommendation, massiveFinancials, massiveTicker, massiveDividends, massiveSnapshot };
}

// === Main Handler ===

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const symbol = url.searchParams.get("symbol")?.toUpperCase();
    const query = url.searchParams.get("q");
    const interval = url.searchParams.get("interval") || "daily";
    const timespan = url.searchParams.get("timespan") || "day";
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";

    let result: unknown = null;
    switch (action) {
      case "profile": result = await handleProfile(symbol!); break;
      case "quote": result = await handleQuote(symbol!); break;
      case "overview": result = await handleOverview(symbol!); break;
      case "series": result = await handleTimeSeries(symbol!, interval); break;
      case "news": result = await handleNews(symbol!); break;
      case "peers": result = await handlePeers(symbol!); break;
      case "recommendation": result = await handleRecommendation(symbol!); break;
      case "earnings": result = await handleEarnings(symbol!); break;
      case "search": result = await handleSearch(query || ""); break;
      case "indices": result = await handleMarketIndices(); break;
      case "technicals": result = await handleTechnicals(symbol!); break;
      case "full": result = await handleFullStock(symbol!); break;
      case "massive_financials": result = await handleMassiveFinancials(symbol!); break;
      case "massive_ticker": result = await handleMassiveTickerDetails(symbol!); break;
      case "massive_dividends": result = await handleMassiveDividends(symbol!); break;
      case "massive_splits": result = await handleMassiveSplits(symbol!); break;
      case "massive_aggs": result = await handleMassiveAggregates(symbol!, timespan, from, to); break;
      case "massive_snapshot": result = await handleMassiveSnapshot(symbol!); break;
      case "massive_related": result = await handleMassiveRelated(symbol!); break;
      case "massive_news": result = await handleMassiveNews(symbol!); break;
      case "market_news": result = await handleMarketNews(); break;
      case "gainers_losers": result = await handleGainersLosers(); break;
      case "most_active": result = await handleMostActive(); break;
      case "top_companies": result = await handleTopCompanies(); break;
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stock data error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
