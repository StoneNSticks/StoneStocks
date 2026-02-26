import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALPHA_VANTAGE_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY")!;
const TWELVE_DATA_KEY = Deno.env.get("TWELVE_DATA_API_KEY")!;
const FINNHUB_KEY = Deno.env.get("FINNHUB_API_KEY")!;

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// TTL in minutes for different data types
const TTL: Record<string, number> = {
  profile: 60 * 24 * 7, // 7 days - company info rarely changes
  quote: 5, // 5 min - prices change frequently
  daily_series: 60 * 4, // 4 hours
  weekly_series: 60 * 24, // 1 day
  monthly_series: 60 * 24 * 3, // 3 days
  financials: 60 * 24 * 7, // 7 days
  overview: 60 * 24 * 7, // 7 days
  news: 30, // 30 min
  peers: 60 * 24 * 7, // 7 days
  recommendation: 60 * 24, // 1 day
  earnings: 60 * 24 * 7, // 7 days
  search: 60 * 24 * 30, // 30 days
  market_indices: 10, // 10 min
  technicals: 60 * 4, // 4 hours
};

async function getCached(key: string): Promise<any | null> {
  const { data } = await supabase
    .from("api_cache")
    .select("data, expires_at")
    .eq("cache_key", key)
    .single();

  if (data && new Date(data.expires_at) > new Date()) {
    return data.data;
  }
  return null;
}

async function setCache(key: string, value: any, source: string, ttlMinutes: number) {
  const expires_at = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  await supabase.from("api_cache").upsert(
    { cache_key: key, data: value, source, expires_at, updated_at: new Date().toISOString() },
    { onConflict: "cache_key" }
  );
}

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

// Derived metrics calculated from raw data
function calculateDerivedMetrics(overview: any, quote: any) {
  const price = parseFloat(quote?.c || overview?.Price || "0");
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
  const peRatio = eps !== 0 ? price / eps : null;
  const pbRatio = bookValue !== 0 ? price / bookValue : null;
  const psRatio = revenue !== 0 ? marketCap / revenue : null;
  const dividendYield = price !== 0 ? (dividendPerShare / price) * 100 : null;
  const evToEbitda = ebitda !== 0 ? (marketCap + totalDebt - cash) / ebitda : null;
  const freeCashflow = operatingCashflow - Math.abs(capex);
  const fcfYield = marketCap !== 0 ? (freeCashflow / marketCap) * 100 : null;

  return {
    calculatedPE: peRatio,
    calculatedPB: pbRatio,
    calculatedPS: psRatio,
    dividendYield,
    evToEbitda,
    freeCashflow,
    fcfYield,
    marketCap,
  };
}

async function handleProfile(symbol: string) {
  const cacheKey = `profile:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  // Use Finnhub for company profile
  const profile = await fetchFinnhub("stock/profile2", { symbol });
  if (profile && profile.name) {
    await setCache(cacheKey, profile, "finnhub", TTL.profile);
    return profile;
  }
  return null;
}

async function handleQuote(symbol: string) {
  const cacheKey = `quote:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  // Use Finnhub for real-time quote
  const quote = await fetchFinnhub("quote", { symbol });
  if (quote && quote.c) {
    await setCache(cacheKey, quote, "finnhub", TTL.quote);
    return quote;
  }
  return null;
}

async function handleOverview(symbol: string) {
  const cacheKey = `overview:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  // Use Alpha Vantage for detailed fundamentals
  const overview = await fetchAlphaVantage("OVERVIEW", { symbol });
  if (overview && overview.Symbol) {
    await setCache(cacheKey, overview, "alphavantage", TTL.overview);
    return overview;
  }
  return null;
}

async function handleTimeSeries(symbol: string, interval: string) {
  const cacheKey = `series:${symbol}:${interval}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  // Use Twelve Data for time series
  const params: Record<string, string> = { symbol, outputsize: "100" };
  if (interval === "daily") {
    params.interval = "1day";
  } else if (interval === "weekly") {
    params.interval = "1week";
  } else if (interval === "monthly") {
    params.interval = "1month";
  } else {
    params.interval = interval;
  }

  const series = await fetchTwelveData("time_series", params);
  const ttlKey = interval === "1day" || interval === "daily" ? "daily_series" :
                 interval === "1week" || interval === "weekly" ? "weekly_series" : "monthly_series";
  if (series && series.values) {
    await setCache(cacheKey, series, "twelvedata", TTL[ttlKey]);
    return series;
  }
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
  if (Array.isArray(peers)) {
    await setCache(cacheKey, peers, "finnhub", TTL.peers);
    return peers;
  }
  return [];
}

async function handleRecommendation(symbol: string) {
  const cacheKey = `recommendation:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const rec = await fetchFinnhub("stock/recommendation", { symbol });
  if (Array.isArray(rec)) {
    await setCache(cacheKey, rec, "finnhub", TTL.recommendation);
    return rec;
  }
  return [];
}

async function handleEarnings(symbol: string) {
  const cacheKey = `earnings:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const earnings = await fetchAlphaVantage("EARNINGS", { symbol });
  if (earnings) {
    await setCache(cacheKey, earnings, "alphavantage", TTL.earnings);
    return earnings;
  }
  return null;
}

async function handleSearch(query: string) {
  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const results = await fetchFinnhub("search", { q: query });
  if (results && results.result) {
    const filtered = results.result
      .filter((r: any) => r.type === "Common Stock" || r.type === "ETP" || r.type === "ADR")
      .slice(0, 10);
    await setCache(cacheKey, filtered, "finnhub", TTL.search);
    return filtered;
  }
  return [];
}

async function handleMarketIndices() {
  const cacheKey = "market:indices";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const symbols = ["SPY", "QQQ", "DIA", "IWM", "VGK", "EWJ"];
  const quotes = await Promise.all(
    symbols.map(async (s) => {
      try {
        const q = await fetchFinnhub("quote", { symbol: s });
        return { symbol: s, ...q };
      } catch {
        return { symbol: s, c: 0, d: 0, dp: 0 };
      }
    })
  );

  const indices = quotes.map((q) => ({
    symbol: q.symbol,
    name: { SPY: "S&P 500", QQQ: "NASDAQ 100", DIA: "Dow Jones", IWM: "Russell 2000", VGK: "FTSE Europe", EWJ: "Nikkei Japan" }[q.symbol] || q.symbol,
    price: q.c,
    change: q.d,
    changePercent: q.dp,
  }));

  await setCache(cacheKey, indices, "finnhub", TTL.market_indices);
  return indices;
}

async function handleTechnicals(symbol: string) {
  const cacheKey = `technicals:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  // Fetch RSI and MACD from Twelve Data
  const [rsi, macd] = await Promise.all([
    fetchTwelveData("rsi", { symbol, interval: "1day", time_period: "14", outputsize: "30" }),
    fetchTwelveData("macd", { symbol, interval: "1day", outputsize: "30" }),
  ]);

  const result = { rsi: rsi?.values || [], macd: macd?.values || [] };
  await setCache(cacheKey, result, "twelvedata", TTL.technicals);
  return result;
}

// Full stock page data - orchestrates all APIs efficiently
async function handleFullStock(symbol: string) {
  const [profile, quote, overview, news, peers, recommendation] = await Promise.all([
    handleProfile(symbol),
    handleQuote(symbol),
    handleOverview(symbol),
    handleNews(symbol),
    handlePeers(symbol),
    handleRecommendation(symbol),
  ]);

  const derived = calculateDerivedMetrics(overview || {}, quote || {});

  return {
    profile,
    quote,
    overview,
    derived,
    news,
    peers,
    recommendation,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const symbol = url.searchParams.get("symbol")?.toUpperCase();
    const query = url.searchParams.get("q");
    const interval = url.searchParams.get("interval") || "daily";

    let result: any = null;

    switch (action) {
      case "profile":
        result = await handleProfile(symbol!);
        break;
      case "quote":
        result = await handleQuote(symbol!);
        break;
      case "overview":
        result = await handleOverview(symbol!);
        break;
      case "series":
        result = await handleTimeSeries(symbol!, interval);
        break;
      case "news":
        result = await handleNews(symbol!);
        break;
      case "peers":
        result = await handlePeers(symbol!);
        break;
      case "recommendation":
        result = await handleRecommendation(symbol!);
        break;
      case "earnings":
        result = await handleEarnings(symbol!);
        break;
      case "search":
        result = await handleSearch(query || "");
        break;
      case "indices":
        result = await handleMarketIndices();
        break;
      case "technicals":
        result = await handleTechnicals(symbol!);
        break;
      case "full":
        result = await handleFullStock(symbol!);
        break;
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stock data error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
