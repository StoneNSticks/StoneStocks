/**
 * backtestEngine — Pure functions for strategy simulation.
 * No side effects, no API calls. Works on pre-fetched OHLC data.
 *
 * Strategies:
 *  1. Buy & Hold
 *  2. SMA Crossover (Golden/Death Cross)
 *  3. RSI Mean Reversion
 *  4. MACD Crossover
 *  5. Bollinger Band Mean Reversion
 *  6. Dual Momentum (Absolute + Relative via SMA)
 *  7. Mean Reversion (% deviation from SMA)
 *  8. Breakout (Donchian Channel)
 *  9. Triple SMA (fast/mid/slow confirmation)
 * 10. Volume Weighted Momentum
 * 11. Momentum (Rate of Change)
 * 12. Stochastic Oscillator
 * 13. VWAP Reversion
 * 14. Chandelier Exit (ATR trailing stop)
 * 15. Keltner Channel Breakout
 */

export interface OHLC {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
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

// ══════════════════════════════════════
// TECHNICAL INDICATOR HELPERS
// ══════════════════════════════════════

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

function ema(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += data[j];
      result.push(sum / period);
    } else {
      result.push(data[i] * k + (result[i - 1]! * (1 - k)));
    }
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
    const recentGains = gains.slice(i - period, i);
    const recentLosses = losses.slice(i - period, i);
    const avgGain = recentGains.reduce((a, b) => a + b, 0) / period;
    const avgLoss = recentLosses.reduce((a, b) => a + b, 0) / period;
    result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  }
  return result;
}

function stdDev(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((sum, v) => sum + (v - mean) ** 2, 0) / period;
    result.push(Math.sqrt(variance));
  }
  return result;
}

function atr(data: OHLC[], period: number): (number | null)[] {
  const trs: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) { trs.push(data[i].high - data[i].low); continue; }
    const tr = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );
    trs.push(tr);
  }
  return sma(trs, period);
}

function highestHigh(data: OHLC[], period: number, idx: number): number {
  let max = -Infinity;
  for (let i = Math.max(0, idx - period + 1); i <= idx; i++) max = Math.max(max, data[i].high);
  return max;
}

function lowestLow(data: OHLC[], period: number, idx: number): number {
  let min = Infinity;
  for (let i = Math.max(0, idx - period + 1); i <= idx; i++) min = Math.min(min, data[i].low);
  return min;
}

// ══════════════════════════════════════
// SIMULATION HARNESS
// ══════════════════════════════════════

interface Signal { action: "buy" | "sell" | "hold" }

function simulateSignals(
  data: OHLC[],
  capital: number,
  signalFn: (i: number, inPosition: boolean) => Signal
): BacktestResult {
  if (data.length < 2) return emptyResult(capital);
  const benchmarkShares = capital / data[0].close;
  let cash = capital;
  let shares = 0;
  let inPosition = false;
  const trades: Trade[] = [];
  const equity: EquityPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    const price = data[i].close;
    const sig = signalFn(i, inPosition);

    if (sig.action === "buy" && !inPosition) {
      shares = cash / price;
      cash = 0;
      inPosition = true;
      trades.push({ type: "buy", date: data[i].date, price, shares });
    } else if (sig.action === "sell" && inPosition) {
      cash = shares * price;
      trades.push({ type: "sell", date: data[i].date, price, shares });
      shares = 0;
      inPosition = false;
    }

    equity.push({ date: data[i].date, equity: cash + shares * price, benchmark: benchmarkShares * price });
  }

  return { equity, trades, metrics: calculateMetrics(equity, trades, capital) };
}

// ══════════════════════════════════════
// STRATEGIES
// ══════════════════════════════════════

// 1. Buy & Hold
export function runBuyAndHold(data: OHLC[], capital: number): BacktestResult {
  if (data.length < 2) return emptyResult(capital);
  const shares = capital / data[0].close;
  const trades: Trade[] = [{ type: "buy", date: data[0].date, price: data[0].close, shares }];
  const equity: EquityPoint[] = data.map(d => ({ date: d.date, equity: shares * d.close, benchmark: shares * d.close }));
  return { equity, trades, metrics: calculateMetrics(equity, trades, capital) };
}

// 2. SMA Crossover
export function runSMACrossover(data: OHLC[], capital: number, shortPeriod = 20, longPeriod = 50): BacktestResult {
  if (data.length < longPeriod + 1) return emptyResult(capital);
  const closes = data.map(d => d.close);
  const shortSMA = sma(closes, shortPeriod);
  const longSMA = sma(closes, longPeriod);

  return simulateSignals(data, capital, (i, inPos) => {
    if (i < 1) return { action: "hold" };
    const s = shortSMA[i], l = longSMA[i], ps = shortSMA[i - 1], pl = longSMA[i - 1];
    if (s === null || l === null || ps === null || pl === null) return { action: "hold" };
    if (!inPos && ps <= pl && s > l) return { action: "buy" };
    if (inPos && ps >= pl && s < l) return { action: "sell" };
    return { action: "hold" };
  });
}

// 3. RSI Strategy
export function runRSIStrategy(data: OHLC[], capital: number, oversold = 30, overbought = 70): BacktestResult {
  if (data.length < 20) return emptyResult(capital);
  const rsiValues = rsi(data.map(d => d.close));

  return simulateSignals(data, capital, (i, inPos) => {
    const r = rsiValues[i];
    if (r === null) return { action: "hold" };
    if (!inPos && r < oversold) return { action: "buy" };
    if (inPos && r > overbought) return { action: "sell" };
    return { action: "hold" };
  });
}

// 4. MACD Crossover
export function runMACDStrategy(data: OHLC[], capital: number, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9): BacktestResult {
  if (data.length < slowPeriod + signalPeriod + 1) return emptyResult(capital);
  const closes = data.map(d => d.close);
  const fastEMA = ema(closes, fastPeriod);
  const slowEMA = ema(closes, slowPeriod);

  const macdLine: (number | null)[] = fastEMA.map((f, i) => {
    const s = slowEMA[i];
    return f !== null && s !== null ? f - s : null;
  });

  const macdValues = macdLine.filter(v => v !== null) as number[];
  const signalEMA = ema(macdValues, signalPeriod);

  // Map signal back to full index
  let sigIdx = 0;
  const signalLine: (number | null)[] = macdLine.map(v => {
    if (v === null) return null;
    return signalEMA[sigIdx++] ?? null;
  });

  return simulateSignals(data, capital, (i, inPos) => {
    if (i < 1) return { action: "hold" };
    const m = macdLine[i], s = signalLine[i];
    const pm = macdLine[i - 1], ps = signalLine[i - 1];
    if (m === null || s === null || pm === null || ps === null) return { action: "hold" };
    if (!inPos && pm <= ps && m > s) return { action: "buy" };
    if (inPos && pm >= ps && m < s) return { action: "sell" };
    return { action: "hold" };
  });
}

// 5. Bollinger Bands Mean Reversion
export function runBollingerStrategy(data: OHLC[], capital: number, period = 20, numStdDev = 2): BacktestResult {
  if (data.length < period + 1) return emptyResult(capital);
  const closes = data.map(d => d.close);
  const mid = sma(closes, period);
  const sd = stdDev(closes, period);

  return simulateSignals(data, capital, (i, inPos) => {
    const m = mid[i], s = sd[i];
    if (m === null || s === null) return { action: "hold" };
    const lower = m - numStdDev * s;
    const upper = m + numStdDev * s;
    if (!inPos && data[i].close < lower) return { action: "buy" };
    if (inPos && data[i].close > upper) return { action: "sell" };
    return { action: "hold" };
  });
}

// 6. Dual Momentum (price above SMA = uptrend, buy; below = sell)
export function runDualMomentumStrategy(data: OHLC[], capital: number, lookback = 200, momentumPeriod = 12): BacktestResult {
  if (data.length < lookback + 1) return emptyResult(capital);
  const closes = data.map(d => d.close);
  const trendSMA = sma(closes, lookback);

  return simulateSignals(data, capital, (i, inPos) => {
    if (i < momentumPeriod) return { action: "hold" };
    const trend = trendSMA[i];
    if (trend === null) return { action: "hold" };
    const momentum = (closes[i] - closes[i - momentumPeriod]) / closes[i - momentumPeriod];
    if (!inPos && closes[i] > trend && momentum > 0) return { action: "buy" };
    if (inPos && (closes[i] < trend || momentum < 0)) return { action: "sell" };
    return { action: "hold" };
  });
}

// 7. Mean Reversion (buy when price deviates below SMA by X%, sell when returns)
export function runMeanReversionStrategy(data: OHLC[], capital: number, period = 20, deviationPct = 5): BacktestResult {
  if (data.length < period + 1) return emptyResult(capital);
  const closes = data.map(d => d.close);
  const avg = sma(closes, period);

  return simulateSignals(data, capital, (i, inPos) => {
    const m = avg[i];
    if (m === null) return { action: "hold" };
    const deviation = ((closes[i] - m) / m) * 100;
    if (!inPos && deviation < -deviationPct) return { action: "buy" };
    if (inPos && deviation > 0) return { action: "sell" };
    return { action: "hold" };
  });
}

// 8. Breakout (Donchian Channel)
export function runBreakoutStrategy(data: OHLC[], capital: number, period = 20): BacktestResult {
  if (data.length < period + 1) return emptyResult(capital);

  return simulateSignals(data, capital, (i, inPos) => {
    if (i < period) return { action: "hold" };
    const hh = highestHigh(data, period, i - 1);
    const ll = lowestLow(data, period, i - 1);
    if (!inPos && data[i].close > hh) return { action: "buy" };
    if (inPos && data[i].close < ll) return { action: "sell" };
    return { action: "hold" };
  });
}

// 9. Triple SMA (fast > mid > slow = buy; fast < mid < slow = sell)
export function runTripleSMAStrategy(data: OHLC[], capital: number, fast = 10, mid = 30, slow = 50): BacktestResult {
  if (data.length < slow + 1) return emptyResult(capital);
  const closes = data.map(d => d.close);
  const f = sma(closes, fast);
  const m = sma(closes, mid);
  const s = sma(closes, slow);

  return simulateSignals(data, capital, (i, inPos) => {
    const fv = f[i], mv = m[i], sv = s[i];
    if (fv === null || mv === null || sv === null) return { action: "hold" };
    if (!inPos && fv > mv && mv > sv) return { action: "buy" };
    if (inPos && fv < mv && mv < sv) return { action: "sell" };
    return { action: "hold" };
  });
}

// 10. Volume Weighted Momentum (buy on high volume + price up, sell on high volume + price down)
export function runVolumeWeightedMomentum(data: OHLC[], capital: number, volumePeriod = 20, momentumDays = 5): BacktestResult {
  if (data.length < Math.max(volumePeriod, momentumDays) + 1) return emptyResult(capital);
  const volumes = data.map(d => d.volume || 0);
  const avgVol = sma(volumes, volumePeriod);

  return simulateSignals(data, capital, (i, inPos) => {
    if (i < momentumDays) return { action: "hold" };
    const av = avgVol[i];
    if (av === null || av === 0) return { action: "hold" };
    const vol = data[i].volume || 0;
    const priceChange = (data[i].close - data[i - momentumDays].close) / data[i - momentumDays].close;
    const volRatio = vol / av;

    if (!inPos && priceChange > 0.02 && volRatio > 1.5) return { action: "buy" };
    if (inPos && priceChange < -0.02 && volRatio > 1.5) return { action: "sell" };
    return { action: "hold" };
  });
}

// 11. Momentum / Rate of Change
export function runMomentumStrategy(data: OHLC[], capital: number, lookback = 20, exitLookback = 10): BacktestResult {
  if (data.length < lookback + 1) return emptyResult(capital);
  const closes = data.map(d => d.close);

  return simulateSignals(data, capital, (i, inPos) => {
    if (i < lookback) return { action: "hold" };
    const roc = (closes[i] - closes[i - lookback]) / closes[i - lookback] * 100;
    if (!inPos && roc > 5) return { action: "buy" };
    if (inPos) {
      const shortRoc = (closes[i] - closes[i - exitLookback]) / closes[i - exitLookback] * 100;
      if (shortRoc < -3) return { action: "sell" };
    }
    return { action: "hold" };
  });
}

// 12. Stochastic Oscillator
export function runStochasticStrategy(data: OHLC[], capital: number, period = 14, oversold = 20, overbought = 80): BacktestResult {
  if (data.length < period + 1) return emptyResult(capital);

  return simulateSignals(data, capital, (i, inPos) => {
    if (i < period) return { action: "hold" };
    const hh = highestHigh(data, period, i);
    const ll = lowestLow(data, period, i);
    if (hh === ll) return { action: "hold" };
    const k = ((data[i].close - ll) / (hh - ll)) * 100;
    if (!inPos && k < oversold) return { action: "buy" };
    if (inPos && k > overbought) return { action: "sell" };
    return { action: "hold" };
  });
}

// 13. VWAP Reversion (approximate daily VWAP with cumulative volume-price)
export function runVWAPStrategy(data: OHLC[], capital: number, deviationPct = 2): BacktestResult {
  if (data.length < 20) return emptyResult(capital);
  // Compute rolling VWAP (20-day window)
  const period = 20;

  return simulateSignals(data, capital, (i, inPos) => {
    if (i < period) return { action: "hold" };
    let volSum = 0, vpSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const v = data[j].volume || 1;
      volSum += v;
      vpSum += ((data[j].high + data[j].low + data[j].close) / 3) * v;
    }
    const vwap = vpSum / volSum;
    const deviation = ((data[i].close - vwap) / vwap) * 100;
    if (!inPos && deviation < -deviationPct) return { action: "buy" };
    if (inPos && deviation > deviationPct * 0.5) return { action: "sell" };
    return { action: "hold" };
  });
}

// 14. Chandelier Exit (ATR-based trailing stop)
export function runChandelierStrategy(data: OHLC[], capital: number, atrPeriod = 22, atrMultiplier = 3): BacktestResult {
  if (data.length < atrPeriod + 1) return emptyResult(capital);
  const atrValues = atr(data, atrPeriod);

  let highestClose = 0;

  return simulateSignals(data, capital, (i, inPos) => {
    const a = atrValues[i];
    if (a === null) return { action: "hold" };

    if (inPos) {
      if (data[i].close > highestClose) highestClose = data[i].close;
      const stopLevel = highestClose - atrMultiplier * a;
      if (data[i].close < stopLevel) return { action: "sell" };
    } else {
      // Enter on uptrend: price above SMA
      if (i >= 50) {
        const avg = data.slice(i - 49, i + 1).reduce((s, d) => s + d.close, 0) / 50;
        if (data[i].close > avg) {
          highestClose = data[i].close;
          return { action: "buy" };
        }
      }
    }
    return { action: "hold" };
  });
}

// 15. Keltner Channel Breakout
export function runKeltnerStrategy(data: OHLC[], capital: number, emaPeriod = 20, atrPeriod = 10, atrMultiplier = 2): BacktestResult {
  if (data.length < Math.max(emaPeriod, atrPeriod) + 1) return emptyResult(capital);
  const closes = data.map(d => d.close);
  const midLine = ema(closes, emaPeriod);
  const atrValues = atr(data, atrPeriod);

  return simulateSignals(data, capital, (i, inPos) => {
    const m = midLine[i], a = atrValues[i];
    if (m === null || a === null) return { action: "hold" };
    const upper = m + atrMultiplier * a;
    const lower = m - atrMultiplier * a;
    if (!inPos && data[i].close > upper) return { action: "buy" };
    if (inPos && data[i].close < lower) return { action: "sell" };
    return { action: "hold" };
  });
}

// ══════════════════════════════════════
// METRICS
// ══════════════════════════════════════

function calculateMetrics(equity: EquityPoint[], trades: Trade[], capital: number): BacktestMetrics {
  if (equity.length === 0) return emptyMetrics(capital);

  const finalEquity = equity[equity.length - 1].equity;
  const totalReturn = ((finalEquity - capital) / capital) * 100;
  const benchmarkReturn = ((equity[equity.length - 1].benchmark - capital) / capital) * 100;

  const years = equity.length / 252;
  const annualizedReturn = years > 0 ? (Math.pow(finalEquity / capital, 1 / years) - 1) * 100 : totalReturn;

  let peak = -Infinity;
  let maxDrawdown = 0;
  for (const pt of equity) {
    if (pt.equity > peak) peak = pt.equity;
    const dd = ((peak - pt.equity) / peak) * 100;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  const returns: number[] = [];
  for (let i = 1; i < equity.length; i++) {
    returns.push((equity[i].equity - equity[i - 1].equity) / equity[i - 1].equity);
  }
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const sd = returns.length > 1
    ? Math.sqrt(returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / (returns.length - 1))
    : 0;
  const sharpeRatio = sd > 0 ? (avgReturn / sd) * Math.sqrt(252) : 0;

  const buyTrades = trades.filter(t => t.type === "buy");
  const sellTrades = trades.filter(t => t.type === "sell");
  const pairs = Math.min(buyTrades.length, sellTrades.length);
  let wins = 0;
  for (let i = 0; i < pairs; i++) {
    if (sellTrades[i].price > buyTrades[i].price) wins++;
  }
  const winRate = pairs > 0 ? (wins / pairs) * 100 : 0;

  return { totalReturn, annualizedReturn, maxDrawdown, sharpeRatio, winRate, totalTrades: trades.length, finalEquity, benchmarkReturn };
}

// === 16. Dollar Cost Averaging ===
// Buy fixed amount every N days regardless of price
export function runDCAStrategy(data: OHLC[], capital: number, intervalDays = 20): BacktestResult {
  if (data.length < 10) return emptyResult(capital);
  let cash = capital;
  let shares = 0;
  const trades: Trade[] = [];
  const buyAmount = capital / Math.max(1, Math.floor(data.length / intervalDays));

  const benchStart = data[0].close;
  const benchShares = capital / benchStart;

  const equity: EquityPoint[] = data.map((d, i) => {
    if (i > 0 && i % intervalDays === 0 && cash >= buyAmount) {
      const s = Math.floor(buyAmount / d.close);
      if (s > 0) {
        shares += s;
        cash -= s * d.close;
        trades.push({ type: "buy", date: d.date, price: d.close, shares: s });
      }
    }
    return { date: d.date, equity: cash + shares * d.close, benchmark: benchShares * d.close };
  });

  return { equity, trades, metrics: calculateMetrics(equity, trades, capital) };
}

// === 17. 52-Week High Strategy ===
// Buy when price makes new 52-week high, sell when drops 10% from peak
export function runHighStrategy(data: OHLC[], capital: number, lookback = 252, trailStop = 0.10): BacktestResult {
  if (data.length < lookback) return emptyResult(capital);
  let cash = capital;
  let shares = 0;
  let peakPrice = 0;
  const trades: Trade[] = [];
  const benchStart = data[0].close;
  const benchShares = capital / benchStart;

  const equity: EquityPoint[] = data.map((d, i) => {
    const windowStart = Math.max(0, i - lookback);
    const windowHigh = Math.max(...data.slice(windowStart, i + 1).map(x => x.high));

    if (shares === 0 && d.close >= windowHigh && cash > d.close) {
      shares = Math.floor(cash / d.close);
      cash -= shares * d.close;
      peakPrice = d.close;
      trades.push({ type: "buy", date: d.date, price: d.close, shares });
    } else if (shares > 0) {
      peakPrice = Math.max(peakPrice, d.close);
      if (d.close < peakPrice * (1 - trailStop)) {
        cash += shares * d.close;
        trades.push({ type: "sell", date: d.date, price: d.close, shares });
        shares = 0;
      }
    }
    return { date: d.date, equity: cash + shares * d.close, benchmark: benchShares * d.close };
  });

  return { equity, trades, metrics: computeMetrics(equity, trades, capital) };
}

// === 18. Moving Average Envelope ===
// Buy when price drops below SMA*(1-envelope%), sell above SMA*(1+envelope%)
export function runEnvelopeStrategy(data: OHLC[], capital: number, smaPeriod = 20, envelope = 0.03): BacktestResult {
  if (data.length < smaPeriod) return emptyResult(capital);
  let cash = capital;
  let shares = 0;
  const trades: Trade[] = [];
  const benchStart = data[0].close;
  const benchShares = capital / benchStart;

  const equity: EquityPoint[] = data.map((d, i) => {
    if (i < smaPeriod - 1) return { date: d.date, equity: cash, benchmark: benchShares * d.close };
    const sma = data.slice(i - smaPeriod + 1, i + 1).reduce((s, x) => s + x.close, 0) / smaPeriod;
    const lower = sma * (1 - envelope);
    const upper = sma * (1 + envelope);

    if (shares === 0 && d.close <= lower && cash > d.close) {
      shares = Math.floor(cash / d.close);
      cash -= shares * d.close;
      trades.push({ type: "buy", date: d.date, price: d.close, shares });
    } else if (shares > 0 && d.close >= upper) {
      cash += shares * d.close;
      trades.push({ type: "sell", date: d.date, price: d.close, shares });
      shares = 0;
    }
    return { date: d.date, equity: cash + shares * d.close, benchmark: benchShares * d.close };
  });

  return { equity, trades, metrics: computeMetrics(equity, trades, capital) };
}

function emptyMetrics(capital: number): BacktestMetrics {
  return { totalReturn: 0, annualizedReturn: 0, maxDrawdown: 0, sharpeRatio: 0, winRate: 0, totalTrades: 0, finalEquity: capital, benchmarkReturn: 0 };
}

function emptyResult(capital: number): BacktestResult {
  return { equity: [], trades: [], metrics: emptyMetrics(capital) };
}
