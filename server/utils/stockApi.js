import fetch from 'node-fetch';
import logger from './logger.js';

const n = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;

// Deterministic development fallback: no API key or network required.
const mockQuote = (symbol, base = 1000) => {
  const seed = [...symbol].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const wave = Math.sin(Date.now() / 180000 + seed) * Math.max(base * 0.006, 1);
  const price = Math.max(1, base + wave);
  return {
    symbol,
    price: Number(price.toFixed(2)),
    previousClose: Number(base.toFixed(2)),
    open: Number((base * 0.998).toFixed(2)),
    high: Number((price * 1.008).toFixed(2)),
    low: Number((price * 0.992).toFixed(2)),
    volume: Math.floor(100000 + (seed * 9781) % 9000000),
    timestamp: new Date(),
    source: 'mock',
  };
};

export async function fetchQuote(symbol, currentPrice = 1000) {
  const key = process.env.STOCK_API_KEY;
  const provider = (process.env.STOCK_API_PROVIDER || 'finnhub').toLowerCase();
  const baseUrl = process.env.STOCK_API_BASE || 'https://finnhub.io/api/v1';
  if (!key || process.env.USE_MOCK_STOCK_DATA === 'true') return mockQuote(symbol, currentPrice);

  try {
    if (provider === 'finnhub') {
      const response = await fetch(`${baseUrl}/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(key)}`, { timeout: 8000 });
      if (!response.ok) throw new Error(`Provider responded ${response.status}`);
      const q = await response.json();
      if (!q.c) throw new Error('Quote was empty');
      return {
        symbol,
        price: n(q.c), previousClose: n(q.pc), open: n(q.o), high: n(q.h), low: n(q.l),
        volume: 0, timestamp: q.t ? new Date(q.t * 1000) : new Date(), source: 'finnhub',
      };
    }

    if (provider === 'twelvedata') {
      const response = await fetch(`${baseUrl}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(key)}`, { timeout: 8000 });
      if (!response.ok) throw new Error(`Provider responded ${response.status}`);
      const q = await response.json();
      return {
        symbol,
        price: n(q.close), previousClose: n(q.previous_close), open: n(q.open), high: n(q.high), low: n(q.low),
        volume: n(q.volume), timestamp: new Date(), source: 'twelvedata',
      };
    }

    // Generic REST provider. Configure STOCK_API_QUOTE_PATH, e.g. /quote?symbol={symbol}&apikey={key}
    const path = (process.env.STOCK_API_QUOTE_PATH || '/quote?symbol={symbol}&apikey={key}')
      .replace('{symbol}', encodeURIComponent(symbol)).replace('{key}', encodeURIComponent(key));
    const response = await fetch(`${baseUrl}${path}`, { timeout: 8000 });
    if (!response.ok) throw new Error(`Provider responded ${response.status}`);
    const q = await response.json();
    return {
      symbol,
      price: n(q.price ?? q.close ?? q.c), previousClose: n(q.previousClose ?? q.previous_close ?? q.pc),
      open: n(q.open ?? q.o), high: n(q.high ?? q.h), low: n(q.low ?? q.l), volume: n(q.volume ?? q.v),
      timestamp: new Date(), source: 'generic',
    };
  } catch (error) {
    logger.warn(`Quote fetch failed for ${symbol}: ${error.message}; using mock.`);
    return mockQuote(symbol, currentPrice);
  }
}

export function generateHistory(symbol, basePrice, points = 90) {
  const seed = [...symbol].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  let price = basePrice * 0.88;
  return Array.from({ length: points }, (_, i) => {
    const drift = 0.0018 + Math.sin((i + seed) / 7) * 0.004 + Math.cos((i + seed) / 3) * 0.002;
    price = Math.max(1, price * (1 + drift));
    const d = new Date();
    d.setDate(d.getDate() - (points - i - 1));
    d.setHours(16, 0, 0, 0);
    return { time: d, price: Number(price.toFixed(2)) };
  });
}
