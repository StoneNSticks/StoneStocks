/**
 * backtestEngine — Pure functions for strategy simulation.
 * No side effects, no API calls. Works on pre-fetched OHLC data.
 */

export interface OHLC {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Trade {
  type: "buy" | "sell";
  date: string;
  price: number;
  shares: number;
}

export interface EquityPoint {
  date: string;
  equity: number;
  benchmark: number;
}

export interface BacktestResult {
  equity: EquityPoint[];
  trades: Trade[];
  metrics: BacktestMetrics;
}

export interface BacktestMetrics {
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  finalEquity: number;
  benchmarkReturn: number;
}

// ── Helpers ──

function sma(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += data[j];
    result.push(sum / period);
  }
  return result;
}

function rsi(data: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = [null];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);

    if (i < period) { result.push(null); continue; }

    if (i === period) {
      const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
      result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
    } else {
      const prevRsi = result[i - 1]!;
      const prevAvgGain = (100 / (100 - prevRsi) - 1) > 0 ? gains[i - 1] : 0;
      // Simplified: recompute from scratch for accuracy
      const recentGains = gains.slice(i - period, i);
      const recentLosses = losses.slice(i - period, i);
      const avgGain = recentGains.reduce((a, b) => a + b, 0) / period;
      const avgLoss = recentLosses.reduce((a, b) => a + b, 0) / period;
      result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
    }
  }
  return result;
}

// ── Strategies ──

export function runBuyAndHold(data: OHLC[], capital: number): BacktestResult {
  if (data.length < 2) return emptyResult(capital);

  const shares = capital / data[0].close;
  const trades: Trade[] = [
    { type: "buy", date: data[0].date, price: data[0].close, shares },
  ];

  const equity: EquityPoint[] = data.map(d => ({
    date: d.date,
    equity: shares * d.close,
    benchmark: shares * d.close,
  }));

  return { equity, trades, metrics: calculateMetrics(equity, trades, capital) };
}

export function runSMACrossover(
  data: OHLC[],
  capital: number,
  shortPeriod = 20,
  longPeriod = 50
): BacktestResult {
  if (data.length < longPeriod + 1) return emptyResult(capital);

  const closes = data.map(d => d.close);
  const shortSMA = sma(closes, shortPeriod);
  const longSMA = sma(closes, longPeriod);

  const benchmarkShares = capital / data[0].close;
  let cash = capital;
  let shares = 0;
  let inPosition = false;
  const trades: Trade[] = [];
  const equity: EquityPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    const s = shortSMA[i];
    const l = longSMA[i];
    const price = data[i].close;

    if (s !== null && l !== null && i > 0) {
      const prevS = shortSMA[i - 1];
      const prevL = longSMA[i - 1];

      // Golden cross: buy
      if (!inPosition && prevS !== null && prevL !== null && prevS <= prevL && s > l) {
        shares = cash / price;
        cash = 0;
        inPosition = true;
        trades.push({ type: "buy", date: data[i].date, price, shares });
      }
      // Death cross: sell
      else if (inPosition && prevS !== null && prevL !== null && prevS >= prevL && s < l) {
        cash = shares * price;
        trades.push({ type: "sell", date: data[i].date, price, shares });
        shares = 0;
        inPosition = false;
      }
    }

    equity.push({
      date: data[i].date,
      equity: cash + shares * price,
      benchmark: benchmarkShares * price,
    });
  }

  return { equity, trades, metrics: calculateMetrics(equity, trades, capital) };
}

export function runRSIStrategy(
  data: OHLC[],
  capital: number,
  oversold = 30,
  overbought = 70
): BacktestResult {
  if (data.length < 20) return emptyResult(capital);

  const closes = data.map(d => d.close);
  const rsiValues = rsi(closes);

  const benchmarkShares = capital / data[0].close;
  let cash = capital;
  let shares = 0;
  let inPosition = false;
  const trades: Trade[] = [];
  const equity: EquityPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    const r = rsiValues[i];
    const price = data[i].close;

    if (r !== null) {
      if (!inPosition && r < oversold) {
        shares = cash / price;
        cash = 0;
        inPosition = true;
        trades.push({ type: "buy", date: data[i].date, price, shares });
      } else if (inPosition && r > overbought) {
        cash = shares * price;
        trades.push({ type: "sell", date: data[i].date, price, shares });
        shares = 0;
        inPosition = false;
      }
    }

    equity.push({
      date: data[i].date,
      equity: cash + shares * price,
      benchmark: benchmarkShares * price,
    });
  }

  return { equity, trades, metrics: calculateMetrics(equity, trades, capital) };
}

// ── Metrics ──

function calculateMetrics(equity: EquityPoint[], trades: Trade[], capital: number): BacktestMetrics {
  if (equity.length === 0) return emptyMetrics(capital);

  const finalEquity = equity[equity.length - 1].equity;
  const totalReturn = ((finalEquity - capital) / capital) * 100;
  const benchmarkReturn = ((equity[equity.length - 1].benchmark - capital) / capital) * 100;

  // Annualized return (approximate 252 trading days/year)
  const years = equity.length / 252;
  const annualizedReturn = years > 0 ? (Math.pow(finalEquity / capital, 1 / years) - 1) * 100 : totalReturn;

  // Max drawdown
  let peak = -Infinity;
  let maxDrawdown = 0;
  for (const pt of equity) {
    if (pt.equity > peak) peak = pt.equity;
    const dd = ((peak - pt.equity) / peak) * 100;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  // Sharpe ratio (simplified, assuming 0 risk-free rate)
  const returns: number[] = [];
  for (let i = 1; i < equity.length; i++) {
    returns.push((equity[i].equity - equity[i - 1].equity) / equity[i - 1].equity);
  }
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const stdDev = returns.length > 1
    ? Math.sqrt(returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / (returns.length - 1))
    : 0;
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

  // Win rate from completed round trips
  const buyTrades = trades.filter(t => t.type === "buy");
  const sellTrades = trades.filter(t => t.type === "sell");
  const pairs = Math.min(buyTrades.length, sellTrades.length);
  let wins = 0;
  for (let i = 0; i < pairs; i++) {
    if (sellTrades[i].price > buyTrades[i].price) wins++;
  }
  const winRate = pairs > 0 ? (wins / pairs) * 100 : 0;

  return {
    totalReturn,
    annualizedReturn,
    maxDrawdown,
    sharpeRatio,
    winRate,
    totalTrades: trades.length,
    finalEquity,
    benchmarkReturn,
  };
}

function emptyMetrics(capital: number): BacktestMetrics {
  return { totalReturn: 0, annualizedReturn: 0, maxDrawdown: 0, sharpeRatio: 0, winRate: 0, totalTrades: 0, finalEquity: capital, benchmarkReturn: 0 };
}

function emptyResult(capital: number): BacktestResult {
  return { equity: [], trades: [], metrics: emptyMetrics(capital) };
}
