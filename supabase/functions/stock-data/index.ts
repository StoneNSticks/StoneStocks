import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALPHA_VANTAGE_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY")!;
const TWELVE_DATA_KEY = Deno.env.get("TWELVE_DATA_API_KEY")!;
const FINNHUB_KEY = Deno.env.get("FINNHUB_API_KEY")!;
const EULERPOOL_KEY = Deno.env.get("EULERPOOL_API_KEY")!;
const SIMFIN_KEY = Deno.env.get("SIMFIN_API_KEY")!;
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
  massive_news: 30, market_news: 15, gainers_losers: 30,
  most_active: 10, top_companies: 15, currency_rates: 60,
  simfin_statements: 60 * 24 * 7, eulerpool_profile: 60 * 24 * 7, hidden_gems: 30,
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

async function fetchEulerpool(endpoint: string) {
  const url = `https://api.eulerpool.com/api/1${endpoint}${endpoint.includes("?") ? "&" : "?"}token=${EULERPOOL_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Eulerpool error: ${res.status}`);
  return res.json();
}

async function fetchSimFin(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`https://backend.simfin.com/api/v3${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { "Authorization": `api-key ${SIMFIN_KEY}` },
  });
  if (!res.ok) throw new Error(`SimFin error: ${res.status}`);
  return res.json();
}

// === ISIN lookup helper (cached mapping) ===
const TICKER_ISIN_MAP: Record<string, string> = {
  AAPL: "US0378331005", MSFT: "US5949181045", GOOG: "US02079K3059",
  AMZN: "US0231351067", NVDA: "US67066G1040", META: "US30303M1027",
  TSLA: "US88160R1014", AVGO: "US11135F1012", TSM: "US8740391003",
  "BRK.B": "US0846707026", JPM: "US46625H1005", V: "US92826C8394",
  UNH: "US91324P1021", JNJ: "US4781601046", XOM: "US30231G1022",
  // Market indices
  GDAXI: "DE0008469008", N225: "XC0009692440", FTSE: "GB0001383545",
  IXIC: "XC0009694271", RUT: "CH0009988194",
};

function getIsin(symbol: string): string | null {
  return TICKER_ISIN_MAP[symbol] || null;
}

// === Smart fallback helper ===
async function tryInOrder<T>(fns: (() => Promise<T>)[], validate: (r: T) => boolean): Promise<T | null> {
  for (const fn of fns) {
    try {
      const result = await fn();
      if (validate(result)) return result;
    } catch (e) {
      console.warn("Fallback attempt failed:", e);
    }
  }
  return null;
}

// === Stock Handlers with smart fallback ===

async function handleProfile(symbol: string) {
  const cacheKey = `profile:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const result = await tryInOrder([
    // 1. Finnhub (strongest for profiles)
    async () => {
      const p = await fetchFinnhub("stock/profile2", { symbol });
      return p?.name ? p : null;
    },
    // 2. Eulerpool (if ISIN available)
    async () => {
      const isin = getIsin(symbol);
      if (!isin) throw new Error("No ISIN");
      const p = await fetchEulerpool(`/equity/profile/${isin}`);
      return p?.name ? { ...p, ticker: symbol, source: "eulerpool" } : null;
    },
    // 3. SimFin
    async () => {
      const data = await fetchSimFin("/companies/general", { ticker: symbol });
      if (data?.[0]) {
        const c = data[0];
        return { name: c.companyName, ticker: symbol, industry: c.industryName, country: "US", source: "simfin" };
      }
      return null;
    },
    // 4. Polygon/Massive
    async () => {
      const data = await fetchMassive(`/v3/reference/tickers/${symbol}`);
      return data?.results ? { name: data.results.name, ticker: symbol, industry: data.results.sic_description, source: "massive" } : null;
    },
  ], (r) => r != null);

  if (result) await setCache(cacheKey, result, "multi", TTL.profile);
  return result;
}

async function handleQuote(symbol: string) {
  const cacheKey = `quote:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const result = await tryInOrder([
    // 1. Finnhub (real-time)
    async () => {
      const q = await fetchFinnhub("quote", { symbol });
      return q?.c ? q : null;
    },
    // 2. Twelve Data
    async () => {
      const q = await fetchTwelveData("quote", { symbol });
      return q?.close ? { c: parseFloat(q.close), d: parseFloat(q.change || "0"), dp: parseFloat(q.percent_change || "0"), h: parseFloat(q.high || "0"), l: parseFloat(q.low || "0"), o: parseFloat(q.open || "0"), pc: parseFloat(q.previous_close || "0") } : null;
    },
    // 3. Polygon snapshot
    async () => {
      const data = await fetchMassive(`/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}`);
      if (data?.ticker?.day) {
        const t = data.ticker;
        return { c: t.day.c, d: t.todaysChange, dp: t.todaysChangePerc, h: t.day.h, l: t.day.l, o: t.day.o, pc: t.prevDay?.c || 0 };
      }
      return null;
    },
  ], (r) => r != null);

  if (result) await setCache(cacheKey, result, "multi", TTL.quote);
  return result;
}

async function handleOverview(symbol: string) {
  const cacheKey = `overview:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const result = await tryInOrder([
    // 1. Alpha Vantage (most comprehensive)
    async () => {
      const o = await fetchAlphaVantage("OVERVIEW", { symbol });
      return o?.Symbol ? o : null;
    },
    // 2. SimFin fundamentals
    async () => {
      const data = await fetchSimFin("/companies/general", { ticker: symbol });
      if (data?.[0]) {
        const c = data[0];
        return { Symbol: symbol, Name: c.companyName, Sector: c.sectorName, Industry: c.industryName, source: "simfin" };
      }
      return null;
    },
    // 3. Eulerpool
    async () => {
      const isin = getIsin(symbol);
      if (!isin) throw new Error("No ISIN");
      const p = await fetchEulerpool(`/equity/profile/${isin}`);
      return p ? { Symbol: symbol, Name: p.name, source: "eulerpool", ...p } : null;
    },
  ], (r) => r != null);

  if (result) await setCache(cacheKey, result, "multi", TTL.overview);
  return result;
}

async function handleTimeSeries(symbol: string, interval: string, outputsize = "100") {
  const cacheKey = `series:${symbol}:${interval}:${outputsize}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const params: Record<string, string> = { symbol, outputsize, interval };
  if (interval === "daily") params.interval = "1day";
  else if (interval === "weekly") params.interval = "1week";
  else if (interval === "monthly") params.interval = "1month";
  const ttlKey = params.interval.includes("min") ? "daily_series" :
                 params.interval === "1day" ? "daily_series" :
                 params.interval === "1week" ? "weekly_series" : "monthly_series";

  const result = await tryInOrder([
    // 1. Twelve Data
    async () => {
      const series = await fetchTwelveData("time_series", params);
      return series?.values ? series : null;
    },
    // 2. Polygon aggregates → convert to Twelve Data format
    async () => {
      const timespanMap: Record<string, string> = { "1day": "day", "1week": "week", "1month": "month", "1min": "minute", "5min": "minute", "15min": "minute", "30min": "minute", "1h": "hour" };
      const multiplierMap: Record<string, number> = { "1min": 1, "5min": 5, "15min": 15, "30min": 30, "1h": 1, "1day": 1, "1week": 1, "1month": 1 };
      const ts = timespanMap[params.interval] || "day";
      const mult = multiplierMap[params.interval] || 1;
      const fromDate = new Date(); fromDate.setFullYear(fromDate.getFullYear() - 2);
      const data = await fetchMassive(`/v2/aggs/ticker/${symbol}/range/${mult}/${ts}/${fromDate.toISOString().split("T")[0]}/${new Date().toISOString().split("T")[0]}`, { adjusted: "true", sort: "desc", limit: outputsize });
      if (!data?.results?.length) return null;
      return {
        values: data.results.map((r: any) => ({
          datetime: new Date(r.t).toISOString().split("T")[0],
          open: String(r.o), high: String(r.h), low: String(r.l), close: String(r.c), volume: String(r.v),
        })),
        meta: { symbol, interval: params.interval, source: "polygon" },
      };
    },
  ], (r) => r != null);

  if (result) { await setCache(cacheKey, result, "multi", TTL[ttlKey]); return result; }
  return null;
}

async function handleNews(symbol: string) {
  const cacheKey = `news:v2:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const to = new Date().toISOString().split("T")[0];

  // Fetch company name for relevance filtering
  let companyName = "";
  try {
    const profile = await fetchFinnhub("stock/profile2", { symbol });
    companyName = (profile?.name || "").replace(/\s*(Inc\.?|Corp\.?|Ltd\.?|Co\.?|plc|SA|SE|AG|NV|Group|Holdings?|Platforms?|Technologies?|Semiconductor|Systems)\s*/gi, "").trim().toLowerCase();
  } catch { /* ignore */ }

  const [finnhubNews, polygonNews] = await Promise.all([
    fetchFinnhub("company-news", { symbol, from, to }).catch(() => []),
    fetchMassive("/v2/reference/news", { ticker: symbol, limit: "20", order: "desc" }).catch(() => ({ results: [] })),
  ]);

  const fhItems = (Array.isArray(finnhubNews) ? finnhubNews : []).map((n: any) => ({
    headline: n.headline, summary: n.summary, url: n.url, image: n.image,
    source: n.source, datetime: n.datetime, related: n.related || "", origin: "finnhub",
    tickerCount: 1, primaryTicker: n.related || "",
  }));

  const pgItems = (polygonNews?.results || []).map((n: any) => ({
    headline: n.title, summary: n.description || "", url: n.article_url,
    image: n.image_url || "", source: n.publisher?.name || "Polygon",
    datetime: Math.floor(new Date(n.published_utc).getTime() / 1000),
    related: (n.tickers || []).join(","), origin: "polygon",
    tickerCount: (n.tickers || []).length,
    primaryTicker: (n.tickers || [])[0] || "",
  }));

  const symbolUpper = symbol.toUpperCase();
  const symLower = symbol.toLowerCase();

  function isDirectlyRelevant(n: any): boolean {
    const hl = (n.headline || "").toLowerCase();
    const sum = (n.summary || "").toLowerCase();
    const text = hl + " " + sum;
    const rel = (n.related || "").toUpperCase();

    // Polygon: only accept if ticker is primary or among ≤3 tickers
    if (n.origin === "polygon") {
      const isPrimary = (n.primaryTicker || "").toUpperCase() === symbolUpper;
      const isFewTickers = (n.tickerCount || 0) <= 3 && rel.includes(symbolUpper);
      if (!isPrimary && !isFewTickers) return false;
    }

    // Finnhub: related field should match
    if (n.origin === "finnhub" && !rel.includes(symbolUpper)) return false;

    // Must mention ticker or company name in headline or summary
    const mentionsTicker = text.includes(symLower);
    const mentionsName = companyName.length >= 3 && text.includes(companyName);
    if (!mentionsTicker && !mentionsName) return false;

    // Reject generic roundup articles
    if (/most active stocks|top stocks|stocks to watch|market wrap|market today|stocks moving|here are the|round-?up/i.test(hl)) return false;

    return true;
  }

  const seen = new Set<string>();
  const combined = [...fhItems, ...pgItems]
    .filter((n: any) => {
      const key = n.headline?.toLowerCase().slice(0, 50);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return isDirectlyRelevant(n);
    })
    .sort((a: any, b: any) => b.datetime - a.datetime)
    .slice(0, 20);

  await setCache(cacheKey, combined, "combined", TTL.news);
  return combined;
}

async function handlePeers(symbol: string) {
  const cacheKey = `peers:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const result = await tryInOrder([
    // 1. Finnhub
    async () => {
      const peers = await fetchFinnhub("stock/peers", { symbol });
      return Array.isArray(peers) && peers.length > 1 ? peers : null;
    },
    // 2. Polygon related companies
    async () => {
      const data = await fetchMassive(`/v1/related-companies/${symbol}`);
      return data?.results?.length ? data.results.map((r: any) => r.ticker) : null;
    },
  ], (r) => r != null);

  if (result) { await setCache(cacheKey, result, "multi", TTL.peers); return result; }
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

  const result = await tryInOrder([
    async () => {
      const e = await fetchAlphaVantage("EARNINGS", { symbol });
      return e?.quarterlyEarnings ? e : null;
    },
    async () => {
      const data = await fetchSimFin("/companies/statements", { ticker: symbol, statement: "pl", period: "q1,q2,q3,q4" });
      return data?.[0]?.statements ? { quarterlyEarnings: data[0].statements, source: "simfin" } : null;
    },
  ], (r) => r != null);

  if (result) await setCache(cacheKey, result, "multi", TTL.earnings);
  return result;
}

async function handleSearch(query: string) {
  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const result = await tryInOrder([
    // 1. Finnhub
    async () => {
      const results = await fetchFinnhub("search", { q: query });
      if (!results?.result?.length) return null;
      return results.result
        .filter((r: Record<string, unknown>) => r.type === "Common Stock" || r.type === "ETP" || r.type === "ADR")
        .slice(0, 10);
    },
    // 2. Polygon tickers search
    async () => {
      const data = await fetchMassive("/v3/reference/tickers", { search: query, active: "true", limit: "10", market: "stocks" });
      if (!data?.results?.length) return null;
      return data.results.map((r: any) => ({
        description: r.name, displaySymbol: r.ticker, symbol: r.ticker, type: r.type === "CS" ? "Common Stock" : r.type,
      }));
    },
    // 3. Twelve Data symbol search
    async () => {
      const data = await fetchTwelveData("symbol_search", { symbol: query, outputsize: "10" });
      if (!data?.data?.length) return null;
      return data.data.map((r: any) => ({
        description: r.instrument_name, displaySymbol: r.symbol, symbol: r.symbol, type: r.instrument_type === "Common Stock" ? "Common Stock" : r.instrument_type,
      }));
    },
  ], (r) => r != null && (r as any[]).length > 0);

  if (result) { await setCache(cacheKey, result, "multi", TTL.search); return result; }
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

  const result = await tryInOrder([
    // 1. Polygon
    async () => {
      const data = await fetchMassive(`/v3/reference/tickers/${symbol}`);
      return data?.results ? data.results : null;
    },
    // 2. Finnhub profile → convert to Polygon-like format
    async () => {
      const p = await fetchFinnhub("stock/profile2", { symbol });
      if (!p?.name) return null;
      return {
        name: p.name, ticker: symbol, market_cap: (p.marketCapitalization || 0) * 1e6,
        total_employees: p.employeeTotal || 0, sic_description: p.finnhubIndustry || "",
        homepage_url: p.weburl || "", locale: p.country || "", source: "finnhub",
      };
    },
    // 3. SimFin general info
    async () => {
      const data = await fetchSimFin("/companies/general", { ticker: symbol });
      if (!data?.[0]) return null;
      const c = data[0];
      return {
        name: c.companyName, ticker: symbol, sic_description: c.industryName || "",
        total_employees: c.numEmployees || 0, source: "simfin",
      };
    },
  ], (r) => r != null);

  if (result) { await setCache(cacheKey, result, "multi", TTL.massive_ticker); return result; }
  return null;
}

async function handleMassiveFinancials(symbol: string) {
  const cacheKey = `massive_financials:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  // Try Polygon first, then SimFin
  const result = await tryInOrder([
    async () => {
      const data = await fetchMassive("/vX/reference/financials", {
        ticker: symbol, limit: "20", sort: "filing_date", order: "desc", timeframe: "quarterly",
      });
      return data?.results?.length ? data.results : null;
    },
    async () => {
      const data = await fetchSimFin("/companies/statements", {
        ticker: symbol, statement: "pl,bs,cf", period: "q1,q2,q3,q4",
      });
      return data?.[0]?.statements ? data[0].statements : null;
    },
  ], (r) => r != null);

  if (result) await setCache(cacheKey, result, "multi", TTL.massive_financials);
  return result || [];
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

  const result = await tryInOrder([
    // 1. Polygon aggregates
    async () => {
      const data = await fetchMassive(`/v2/aggs/ticker/${symbol}/range/1/${timespan}/${from}/${to}`, { adjusted: "true", sort: "asc", limit: "5000" });
      return data?.results?.length ? data.results : null;
    },
    // 2. Twelve Data time series → convert to Polygon agg format
    async () => {
      const intervalMap: Record<string, string> = { day: "1day", week: "1week", month: "1month", hour: "1h", minute: "1min" };
      const tdInterval = intervalMap[timespan] || "1day";
      const series = await fetchTwelveData("time_series", { symbol, interval: tdInterval, outputsize: "500", start_date: from, end_date: to });
      if (!series?.values?.length) return null;
      return series.values.reverse().map((v: any) => ({
        t: new Date(v.datetime).getTime(), o: parseFloat(v.open), h: parseFloat(v.high),
        l: parseFloat(v.low), c: parseFloat(v.close), v: parseInt(v.volume || "0"),
      }));
    },
  ], (r) => r != null);

  if (result) { await setCache(cacheKey, result, "multi", TTL.massive_aggs); return result; }
  return [];
}

async function handleMassiveSnapshot(symbol: string) {
  const cacheKey = `massive_snapshot:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const result = await tryInOrder([
    // 1. Polygon snapshot
    async () => {
      const data = await fetchMassive(`/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}`);
      return data?.ticker ? data.ticker : null;
    },
    // 2. Finnhub quote → convert to snapshot-like format
    async () => {
      const q = await fetchFinnhub("quote", { symbol });
      if (!q?.c) return null;
      return {
        ticker: symbol, day: { c: q.c, h: q.h, l: q.l, o: q.o, v: 0 },
        prevDay: { c: q.pc }, todaysChange: q.d, todaysChangePerc: q.dp, source: "finnhub",
      };
    },
  ], (r) => r != null);

  if (result) { await setCache(cacheKey, result, "multi", TTL.massive_snapshot); return result; }
  return null;
}

async function handleMassiveRelated(symbol: string) {
  const cacheKey = `massive_related:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const result = await tryInOrder([
    // 1. Polygon related
    async () => {
      const data = await fetchMassive(`/v1/related-companies/${symbol}`);
      return data?.results?.length ? data.results : null;
    },
    // 2. Finnhub peers → convert to related format
    async () => {
      const peers = await fetchFinnhub("stock/peers", { symbol });
      if (!Array.isArray(peers) || peers.length <= 1) return null;
      return peers.filter((p: string) => p !== symbol).map((ticker: string) => ({ ticker }));
    },
  ], (r) => r != null);

  if (result) { await setCache(cacheKey, result, "multi", TTL.massive_related); return result; }
  return [];
}

async function handleMassiveNews(symbol: string) {
  const cacheKey = `massive_news:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const result = await tryInOrder([
    // 1. Polygon news
    async () => {
      const data = await fetchMassive("/v2/reference/news", { ticker: symbol, limit: "20", order: "desc" });
      return data?.results?.length ? data.results : null;
    },
    // 2. Finnhub company news → convert to Polygon-like format
    async () => {
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const to = new Date().toISOString().split("T")[0];
      const news = await fetchFinnhub("company-news", { symbol, from, to });
      if (!Array.isArray(news) || !news.length) return null;
      return news.slice(0, 20).map((n: any) => ({
        title: n.headline, description: n.summary, article_url: n.url,
        image_url: n.image, publisher: { name: n.source },
        published_utc: new Date(n.datetime * 1000).toISOString(), tickers: [symbol],
      }));
    },
  ], (r) => r != null);

  if (result) { await setCache(cacheKey, result, "multi", TTL.massive_news); return result; }
  return [];
}

// === Homepage Data Handlers ===

// Helper: filter to common stocks only (no ETFs, ETPs, leveraged/inverse products, warrants, units, preferred shares)
function isCommonStock(ticker: string): boolean {
  if (!ticker || ticker.length > 5) return false;
  // Exclude tickers with numbers, dots, dashes, or special suffixes
  if (/[0-9.\-+\/^]/.test(ticker)) return false;
  // Exclude tickers ending in W (warrants), U (units), or R (rights)
  if (ticker.length >= 4 && /[WUR]$/.test(ticker)) return false;

  // Comprehensive ETF / ETP / leveraged & inverse product blacklist
  const ETF_BLACKLIST = new Set([
    // Major index ETFs
    "SPY","QQQ","IWM","DIA","VOO","VTI","IVV","RSP","MDY","IJH","IJR","VB","VTV","VUG","SCHD","SCHX","SCHB",
    // Sector ETFs (XL* family + others)
    "XLB","XLC","XLE","XLF","XLI","XLK","XLP","XLRE","XLU","XLV","XLY","VGT","VHT","VNQ","VFH","VIS","VAW","VCR","VPU","VOX",
    // ARK ETFs
    "ARKK","ARKW","ARKQ","ARKG","ARKF","ARKX","ARKB",
    // Leveraged & Inverse (2x/3x)
    "TQQQ","SQQQ","UPRO","SPXU","UDOW","SDOW","TNA","TZA","FAS","FAZ","SOXL","SOXS","LABU","LABD","JNUG","DUST","NUGT",
    "FNGU","FNGD","TECL","TECS","SPXS","SSO","SH","SDS","QLD","QID","DDM","DXD","MVV","MZZ","UWM","TWM",
    "UVXY","SVXY","VXX","VIXY","UVIX","SVIX",
    "BOIL","KOLD","UCO","SCO","GUSH","DRIP","NAIL","DRV","CURE","PILL","ERX","ERY","DFEN","WEBS",
    "YINN","YANG","INDL","SMIN","BNKU","BNKD","DPST","WEAT","CORN","SOYB",
    "BULL","BEAR","SPXL",
    // Crypto / Commodity ETFs
    "BITO","GBTC","ETHE","IBIT","FBTC","BITB","HODL","BTCO","GLD","SLV","IAU","SGOL","PPLT","PALL","SLX","COPX","GLTR","DBA","DBC","GSG","PDBC","USO","UNG","BNO",
    // Bond / Fixed Income ETFs
    "TLT","TLH","IEF","SHY","BND","AGG","LQD","HYG","JNK","EMB","MUB","TIP","BNDX","VCSH","VCIT","VMBS","MBB","GOVT","FLOT",
    // International / Country ETFs
    "EFA","EEM","IEMG","VEA","VWO","IXUS","ACWI","VXUS","HEFA","SCZ","IEFA",
    "EWA","EWC","EWG","EWH","EWI","EWJ","EWL","EWN","EWP","EWQ","EWS","EWT","EWU","EWW","EWY","EWZ","EWK","EWD","EWM","EWO",
    "FEZ","FXI","KWEB","MCHI","ASHR","GXC","INDA","INDY","THD","VNM","EPHE","EPU","ECH","ENZL","NORW","EDEN",
    // Dividend / Strategy ETFs
    "DVY","HDV","VIG","DGRO","NOBL","SDY","DGRW","JEPI","JEPQ","QYLD","XYLD","RYLD","DIVO","NUSI",
    // Thematic / Specialty ETFs
    "HACK","ROBO","BOTZ","IRBO","LIT","TAN","ICLN","QCLN","PBW","FAN","ACES","DRIV","IDRV","CARZ","JETS","UFO","MOON","HERO","ESPO","GAMR","NERD","BETZ","PAVE","IFRA","WOOD","PHO","REMX","URA",
    // Misc popular ETFs
    "IYR","XLRE","REM","MORT","RWR","USRT","ICF",
    "IBB","XBI","ARKG","IDNA","GNOM",
    "GDX","GDXJ","SIL","SILJ",
    "KBE","KRE","IAI","XHB","ITB",
    "SPHD","SPLV","USMV","MTUM","QUAL","VLUE","SIZE",
    "MOAT","COWZ","FTCS","XMLV","XSLV",
    "AMLP","MLPA","TPYP",
  ]);

  if (ETF_BLACKLIST.has(ticker)) return false;
  return /^[A-Z]{1,5}$/.test(ticker);
}

// Helper to enrich stock lists with company names and logos (multi-source fallback)
async function enrichWithProfileData(stocks: any[]): Promise<any[]> {
  const enriched = await Promise.all(
    stocks.map(async (s: any) => {
      // Try Finnhub first
      try {
        const profile = await fetchFinnhub("stock/profile2", { symbol: s.symbol });
        if (profile?.name) {
          return { ...s, name: profile.name, logo: profile.logo || "" };
        }
      } catch { /* fall through */ }
      // Fallback: Polygon ticker details
      try {
        const data = await fetchMassive(`/v3/reference/tickers/${s.symbol}`);
        if (data?.results?.name) {
          return { ...s, name: data.results.name, logo: data.results.branding?.icon_url ? `${data.results.branding.icon_url}?apiKey=${getMassiveKey()}` : "" };
        }
      } catch { /* fall through */ }
      // Fallback: Twelve Data
      try {
        const data = await fetchTwelveData("stocks", { symbol: s.symbol });
        if (data?.data?.[0]?.name) {
          return { ...s, name: data.data[0].name, logo: "" };
        }
      } catch { /* fall through */ }
      return { ...s, name: s.name || s.symbol, logo: "" };
    })
  );
  return enriched;
}

// ETF-to-Index approximate multipliers (ETF price × multiplier ≈ index points)
const INDEX_CONFIG: { indexSymbol: string; name: string; twelveSymbol: string; etf: string; etfMultiplier: number; etfSymbol?: string }[] = [
  { indexSymbol: "SPX", name: "S&P 500", twelveSymbol: "SPX", etf: "SPY", etfMultiplier: 10, etfSymbol: "SPY" },
  { indexSymbol: "DJI", name: "Dow Jones", twelveSymbol: "DJI", etf: "DIA", etfMultiplier: 100, etfSymbol: "DIA" },
  { indexSymbol: "IXIC", name: "Nasdaq", twelveSymbol: "IXIC", etf: "QQQ", etfMultiplier: 32.1, etfSymbol: "QQQ" },
  { indexSymbol: "RUT", name: "Russell 2000", twelveSymbol: "RUT", etf: "IWM", etfMultiplier: 8.31, etfSymbol: "IWM" },
  { indexSymbol: "GDAXI", name: "DAX", twelveSymbol: "DAX", etf: "EWG", etfMultiplier: 750, etfSymbol: "EWG" },
  { indexSymbol: "N225", name: "Nikkei 225", twelveSymbol: "N225", etf: "EWJ", etfMultiplier: 570, etfSymbol: "EWJ" },
  { indexSymbol: "FTSE", name: "FTSE 100", twelveSymbol: "FTSE", etf: "EWU", etfMultiplier: 243, etfSymbol: "EWU" },
  { indexSymbol: "FCHI", name: "CAC 40", twelveSymbol: "FCHI", etf: "EWQ", etfMultiplier: 215, etfSymbol: "EWQ" },
  { indexSymbol: "HSI", name: "Hang Seng", twelveSymbol: "HSI", etf: "EWH", etfMultiplier: 1050, etfSymbol: "EWH" },
  { indexSymbol: "STOXX50E", name: "Euro Stoxx 50", twelveSymbol: "STOXX50E", etf: "FEZ", etfMultiplier: 82, etfSymbol: "FEZ" },
];

async function handleMarketIndices() {
  const cacheKey = "market:indices:v6";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const indices = await Promise.all(
    INDEX_CONFIG.map(async (cfg) => {
      // Try Twelve Data with proper symbol first
      try {
        const q = await fetchTwelveData("quote", { symbol: cfg.twelveSymbol });
        const price = parseFloat(q?.close || "0");
        if (price > 0) {
          return {
            indexSymbol: cfg.indexSymbol,
            name: cfg.name,
            etfSymbol: cfg.etfSymbol,
            price,
            prevClose: parseFloat(q.previous_close || "0"),
            change: parseFloat(q.change || "0"),
            changePercent: parseFloat(q.percent_change || "0"),
            isIndex: true,
          };
        }
      } catch (e) {
        console.warn(`Twelve Data index ${cfg.twelveSymbol} failed:`, e);
      }

      // Fallback: Finnhub ETF quote → convert to approximate index points
      try {
        const q = await fetchFinnhub("quote", { symbol: cfg.etf });
        if (q?.c > 0) {
          const m = cfg.etfMultiplier;
          return {
            indexSymbol: cfg.indexSymbol,
            name: cfg.name,
            etfSymbol: cfg.etfSymbol,
            price: Math.round(q.c * m * 100) / 100,
            prevClose: Math.round((q.pc || 0) * m * 100) / 100,
            change: Math.round((q.d || 0) * m * 100) / 100,
            changePercent: q.dp || 0,
            isIndex: true,
          };
        }
      } catch {
        // ignore
      }

      return { indexSymbol: cfg.indexSymbol, name: cfg.name, etfSymbol: cfg.etfSymbol, price: 0, prevClose: 0, change: 0, changePercent: 0, isIndex: true };
    })
  );

  const valid = indices.filter(i => i.price > 0);
  await setCache(cacheKey, valid.length > 0 ? valid : indices, "multi", TTL.market_indices);
  return valid.length > 0 ? valid : indices;
}

// Combined market news from Finnhub + Polygon (covers Reuters, Bloomberg, CNBC, etc.)
async function handleMarketNews() {
  const cacheKey = "market:news:combined:v2";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const [finnhubNews, polygonNews] = await Promise.all([
    fetchFinnhub("news", { category: "general" }).catch(() => []),
    fetchMassive("/v2/reference/news", { limit: "20", order: "desc" }).catch(() => ({ results: [] })),
  ]);

  const fhItems = (Array.isArray(finnhubNews) ? finnhubNews : []).map((n: any) => ({
    headline: n.headline, summary: n.summary, url: n.url, image: n.image,
    source: n.source, datetime: n.datetime, related: n.related || "", origin: "finnhub",
  }));

  const pgItems = (polygonNews?.results || []).map((n: any) => ({
    headline: n.title, summary: n.description || "", url: n.article_url,
    image: n.image_url || "", source: n.publisher?.name || "Polygon",
    datetime: Math.floor(new Date(n.published_utc).getTime() / 1000),
    related: n.tickers?.[0] || "", origin: "polygon",
  }));

  const seen = new Set<string>();
  const combined = [...fhItems, ...pgItems]
    .filter((n: any) => {
      const key = n.headline?.toLowerCase().slice(0, 50);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a: any, b: any) => b.datetime - a.datetime)
    .slice(0, 30);

  await setCache(cacheKey, combined, "combined", TTL.market_news);
  return combined;
}

// Gainers/Losers - available anytime using Polygon snapshot
async function handleGainersLosers() {
  const cacheKey = "market:gainers_losers:realtime";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  try {
    // Try real-time snapshots first (works anytime)
    const [gainersData, losersData] = await Promise.all([
      fetchMassive("/v2/snapshot/locale/us/markets/stocks/gainers", {}).catch(() => null),
      fetchMassive("/v2/snapshot/locale/us/markets/stocks/losers", {}).catch(() => null),
    ]);

    const mapSnapshot = (items: any[]) =>
      (items || [])
        .filter((s: any) => s.day?.c > 2 && s.day?.v > 200000 && isCommonStock(s.ticker))
        .map((s: any) => ({
          symbol: s.ticker,
          name: s.ticker,
          price: s.day?.c || 0,
          change: s.todaysChange || 0,
          changePercent: s.todaysChangePerc || 0,
          volume: s.day?.v || 0,
        }))
        .slice(0, 10);

    if (gainersData?.tickers?.length || losersData?.tickers?.length) {
      const rawGainers = mapSnapshot(gainersData?.tickers || []);
      const rawLosers = mapSnapshot(losersData?.tickers || []);
      // Enrich with company names and logos
      const [gainers, losers] = await Promise.all([
        enrichWithProfileData(rawGainers),
        enrichWithProfileData(rawLosers),
      ]);
      const result = {
        gainers,
        losers,
        date: new Date().toISOString().split("T")[0],
      };
      await setCache(cacheKey, result, "massive", TTL.gainers_losers);
      return result;
    }

    // Fallback: grouped daily bars for last trading date
    const lastDate = getLastTradingDate();
    const data = await fetchMassive(`/v2/aggs/grouped/locale/us/market/stocks/${lastDate}`, { adjusted: "true" });
    if (!data?.results?.length) return { gainers: [], losers: [], date: lastDate };

    const stocks = data.results
      .filter((s: any) => s.c > 2 && s.v > 200000 && s.o > 0 && isCommonStock(s.T))
      .map((s: any) => ({
        symbol: s.T, name: s.T, price: s.c, change: s.c - s.o,
        changePercent: ((s.c - s.o) / s.o) * 100, volume: s.v,
      }))
      .filter((s: any) => Math.abs(s.changePercent) < 100);

    stocks.sort((a: any, b: any) => b.changePercent - a.changePercent);
    const rawGainers = stocks.slice(0, 10);
    const rawLosers = stocks.slice(-10).reverse();
    const [enrichedGainers, enrichedLosers] = await Promise.all([
      enrichWithProfileData(rawGainers),
      enrichWithProfileData(rawLosers),
    ]);
    const result = { gainers: enrichedGainers, losers: enrichedLosers, date: lastDate };
    await setCache(cacheKey, result, "massive", TTL.gainers_losers);
    return result;
  } catch (err) {
    console.error("Gainers/losers error:", err);
    return { gainers: [], losers: [], date: "" };
  }
}

function getLastTradingDate(): string {
  const now = new Date();
  const est = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  const hour = est.getHours();
  const day = est.getDay();
  let daysBack = 0;
  if (day === 0) daysBack = 2;
  else if (day === 6) daysBack = 1;
  else if (day === 1 && hour < 16) daysBack = 3;
  else if (hour < 16) daysBack = 1;
  const d = new Date(est);
  d.setDate(d.getDate() - daysBack);
  return d.toISOString().split("T")[0];
}

async function handleMostActive() {
  const cacheKey = "market:most_active:realtime";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  try {
    // Try real-time snapshot
    const data = await fetchMassive("/v2/snapshot/locale/us/markets/stocks/tickers", { include_otc: "false" }).catch(() => null);
    if (data?.tickers?.length) {
      const rawStocks = data.tickers
        .filter((s: any) => s.day?.c > 2 && s.day?.v > 500000 && isCommonStock(s.ticker))
        .map((s: any) => ({
          symbol: s.ticker, name: s.ticker, price: s.day?.c || 0,
          change: s.todaysChange || 0, changePercent: s.todaysChangePerc || 0,
          volume: s.day?.v || 0,
        }))
        .sort((a: any, b: any) => b.volume - a.volume)
        .slice(0, 15);
      const stocks = await enrichWithProfileData(rawStocks);
      await setCache(cacheKey, stocks, "massive", TTL.most_active);
      return stocks;
    }

    // Fallback: grouped daily
    const lastDate = getLastTradingDate();
    const fallback = await fetchMassive(`/v2/aggs/grouped/locale/us/market/stocks/${lastDate}`, { adjusted: "true" });
    if (!fallback?.results) return [];
    const stocks = fallback.results
      .filter((s: any) => s.c > 2 && s.v > 500000 && s.o > 0 && isCommonStock(s.T))
      .map((s: any) => ({
        symbol: s.T, name: s.T, price: s.c, change: s.c - s.o,
        changePercent: ((s.c - s.o) / s.o) * 100, volume: s.v,
      }))
      .sort((a: any, b: any) => b.volume - a.volume)
      .slice(0, 15);
    const enrichedStocks = await enrichWithProfileData(stocks);
    await setCache(cacheKey, enrichedStocks, "massive", TTL.most_active);
    return enrichedStocks;
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
  const cacheKey = "market:top_companies:v2";
  const cached = await getCached(cacheKey);
  if (cached) return cached;
  const quotes = await Promise.all(
    TOP_COMPANIES.map(async (c) => {
      try {
        const [q, profile, polygonTicker] = await Promise.all([
          fetchFinnhub("quote", { symbol: c.symbol }),
          fetchFinnhub("stock/profile2", { symbol: c.symbol }),
          fetchMassive(`/v3/reference/tickers/${c.symbol}`).catch(() => null),
        ]);
        // Polygon market_cap is generally the most accurate (reflects full company, not just ADR float)
        const polygonMarketCap = polygonTicker?.results?.market_cap || 0;
        const finnhubMarketCap = (profile?.marketCapitalization || 0) * 1e6;
        const shareOutstanding = profile?.shareOutstanding || 0;
        const computedMarketCap = (q.c || 0) * shareOutstanding * 1e6;
        // Prefer Polygon > Finnhub > computed
        const marketCap = polygonMarketCap > 0 ? polygonMarketCap : (finnhubMarketCap > 0 ? finnhubMarketCap : computedMarketCap);
        return {
          symbol: c.symbol, name: c.name, price: q.c || 0,
          change: q.d || 0, changePercent: q.dp || 0,
          marketCap,
          logo: profile?.logo || "",
        };
      } catch {
        return { symbol: c.symbol, name: c.name, price: 0, change: 0, changePercent: 0, marketCap: 0, logo: "" };
      }
    })
  );
  quotes.sort((a: any, b: any) => b.marketCap - a.marketCap);
  await setCache(cacheKey, quotes, "multi", TTL.top_companies);
  return quotes;
}

// === Currency Conversion ===
async function handleCurrencyRates() {
  const cacheKey = "currency:rates";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch("https://cdn.moneyconvert.net/api/latest.json");
  if (!res.ok) throw new Error("Currency API error");
  const data = await res.json();
  const rates = data?.rates || {};
  await setCache(cacheKey, rates, "moneyconvert", TTL.currency_rates);
  return rates;
}

// === SimFin Statements ===
async function handleSimFinStatements(symbol: string) {
  const cacheKey = `simfin:statements:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const data = await fetchSimFin("/companies/statements", {
    ticker: symbol, statement: "pl,bs,cf", period: "fy",
  });
  if (data?.[0]) {
    await setCache(cacheKey, data[0], "simfin", TTL.simfin_statements);
    return data[0];
  }
  return null;
}

// === Eulerpool Profile ===
async function handleEulerpoolProfile(symbol: string) {
  const isin = getIsin(symbol);
  if (!isin) return null;
  const cacheKey = `eulerpool:profile:${symbol}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const data = await fetchEulerpool(`/equity/profile/${isin}`);
  if (data?.name) {
    await setCache(cacheKey, data, "eulerpool", TTL.eulerpool_profile);
    return data;
  }
  return null;
}

// === Hidden Gems - stocks with strong buy consensus + positive momentum ===
const HIDDEN_GEM_CANDIDATES = [
  { symbol: "PLTR", name: "Palantir" }, { symbol: "SOFI", name: "SoFi Technologies" },
  { symbol: "NET", name: "Cloudflare" }, { symbol: "DDOG", name: "Datadog" },
  { symbol: "CRWD", name: "CrowdStrike" }, { symbol: "SNOW", name: "Snowflake" },
  { symbol: "AFRM", name: "Affirm" }, { symbol: "RBLX", name: "Roblox" },
  { symbol: "U", name: "Unity Software" }, { symbol: "PINS", name: "Pinterest" },
  { symbol: "ROKU", name: "Roku" }, { symbol: "COIN", name: "Coinbase" },
  { symbol: "TTD", name: "The Trade Desk" }, { symbol: "MDB", name: "MongoDB" },
  { symbol: "ZS", name: "Zscaler" }, { symbol: "BILL", name: "Bill Holdings" },
];

async function handleHiddenGems() {
  const cacheKey = "market:hidden_gems:v1";
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const results = await Promise.all(
    HIDDEN_GEM_CANDIDATES.map(async (c) => {
      try {
        const [q, rec, profile] = await Promise.all([
          fetchFinnhub("quote", { symbol: c.symbol }).catch(() => null),
          fetchFinnhub("stock/recommendation", { symbol: c.symbol }).catch(() => []),
          fetchFinnhub("stock/profile2", { symbol: c.symbol }).catch(() => null),
        ]);
        const latest = Array.isArray(rec) && rec.length > 0 ? rec[0] : null;
        const buyScore = latest ? (latest.strongBuy || 0) + (latest.buy || 0) : 0;
        const totalAnalysts = latest ? buyScore + (latest.hold || 0) + (latest.sell || 0) + (latest.strongSell || 0) : 0;
        const buyRatio = totalAnalysts > 0 ? buyScore / totalAnalysts : 0;
        return {
          symbol: c.symbol, name: c.name,
          price: q?.c || 0, change: q?.d || 0, changePercent: q?.dp || 0,
          logo: profile?.logo || "",
          buyRatio, buyScore, totalAnalysts,
        };
      } catch {
        return null;
      }
    })
  );

  const gems = results
    .filter((r): r is NonNullable<typeof r> => r != null && r.price > 0 && r.buyRatio > 0.5)
    .sort((a, b) => b.buyRatio - a.buyRatio)
    .slice(0, 12);

  await setCache(cacheKey, gems, "finnhub", 30);
  return gems;
}


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

// === Full Stock (with cross-source gap filling) ===

async function handleFullStock(symbol: string) {
  const [profile, quote, overview, news, peers, recommendation, massiveFinancials, massiveTicker, massiveDividends, massiveSnapshot] = await Promise.all([
    handleProfile(symbol), handleQuote(symbol), handleOverview(symbol),
    handleNews(symbol), handlePeers(symbol), handleRecommendation(symbol),
    handleMassiveFinancials(symbol).catch(() => []),
    handleMassiveTickerDetails(symbol).catch(() => null),
    handleMassiveDividends(symbol).catch(() => []),
    handleMassiveSnapshot(symbol).catch(() => null),
  ]);

  // Fill missing overview fields from secondary sources
  const filledOverview = { ...(overview || {}) } as Record<string, string>;

  // If Alpha Vantage overview is sparse, supplement from SimFin/Eulerpool/Polygon
  const hasCoreData = filledOverview.EPS && filledOverview.PERatio && filledOverview.MarketCapitalization;
  if (!hasCoreData) {
    // Try SimFin statements for financial data
    try {
      const simfin = await handleSimFinStatements(symbol).catch(() => null);
      if (simfin?.statements) {
        const latest = Array.isArray(simfin.statements) ? simfin.statements[0] : null;
        if (latest) {
          if (!filledOverview.RevenueTTM && latest.Revenue) filledOverview.RevenueTTM = String(latest.Revenue);
          if (!filledOverview.GrossProfitTTM && latest["Gross Profit"]) filledOverview.GrossProfitTTM = String(latest["Gross Profit"]);
          if (!filledOverview.EPS && latest["Earnings Per Share, Diluted"]) filledOverview.EPS = String(latest["Earnings Per Share, Diluted"]);
        }
      }
    } catch { /* ignore */ }

    // Try Eulerpool for European / ISIN-available stocks
    try {
      const euler = await handleEulerpoolProfile(symbol).catch(() => null);
      if (euler) {
        if (!filledOverview.Name && euler.name) filledOverview.Name = euler.name;
        if (!filledOverview.Sector && euler.sector) filledOverview.Sector = euler.sector;
        if (!filledOverview.DividendYield && euler.dividendYield) filledOverview.DividendYield = String(euler.dividendYield);
        if (!filledOverview.PERatio && euler.pe) filledOverview.PERatio = String(euler.pe);
      }
    } catch { /* ignore */ }

    // Fill from Polygon ticker details
    if (massiveTicker) {
      const mt = massiveTicker as Record<string, any>;
      if (!filledOverview.MarketCapitalization && mt.market_cap) filledOverview.MarketCapitalization = String(mt.market_cap);
      if (!filledOverview.SharesOutstanding && mt.share_class_shares_outstanding) filledOverview.SharesOutstanding = String(mt.share_class_shares_outstanding);
      if (!filledOverview.Name && mt.name) filledOverview.Name = mt.name;
      if (!filledOverview.Description && mt.description) filledOverview.Description = mt.description;
    }

    // Fill from Finnhub profile
    if (profile) {
      const p = profile as Record<string, any>;
      if (!filledOverview.MarketCapitalization && p.marketCapitalization) filledOverview.MarketCapitalization = String(p.marketCapitalization * 1e6);
      if (!filledOverview.Name && p.name) filledOverview.Name = p.name;
      if (!filledOverview.Industry && p.finnhubIndustry) filledOverview.Industry = p.finnhubIndustry;
      if (!filledOverview.Country && p.country) filledOverview.Country = p.country;
    }
  }

  const derived = calculateDerivedMetrics(filledOverview, quote || {});

  // Supplement derived metrics from massiveTicker if still missing
  if (massiveTicker) {
    const mt = massiveTicker as Record<string, any>;
    if (!derived.marketCap && mt.market_cap) derived.marketCap = mt.market_cap;
  }

  return { profile, quote, overview: filledOverview, derived, news, peers, recommendation, massiveFinancials, massiveTicker, massiveDividends, massiveSnapshot };
}

// === Main Handler ===

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const symbol = url.searchParams.get("symbol")?.toUpperCase();
    const query = url.searchParams.get("q");
    const interval = url.searchParams.get("interval") || "1day";
    const outputsize = url.searchParams.get("outputsize") || "100";
    const timespan = url.searchParams.get("timespan") || "day";
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";

    let result: unknown = null;
    switch (action) {
      case "profile": result = await handleProfile(symbol!); break;
      case "quote": result = await handleQuote(symbol!); break;
      case "overview": result = await handleOverview(symbol!); break;
      case "series": result = await handleTimeSeries(symbol!, interval, outputsize); break;
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
      case "currency_rates": result = await handleCurrencyRates(); break;
      case "simfin_statements": result = await handleSimFinStatements(symbol!); break;
      case "eulerpool_profile": result = await handleEulerpoolProfile(symbol!); break;
      case "hidden_gems": result = await handleHiddenGems(); break;
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
