import asyncHandler from 'express-async-handler';
import Stock from '../models/Stock.js';
import ApiError from '../utils/ApiError.js';
import { fetchQuote, generateHistory } from '../utils/stockApi.js';

export const listStocks = asyncHandler(async (req, res) => {
  const { search = '', sector = '', sort = 'symbol', order = 'asc', limit = 100 } = req.query;
  const filter = { isActive: true };
  if (search) filter.$or = [
    { symbol: { $regex: search, $options: 'i' } },
    { name: { $regex: search, $options: 'i' } },
  ];
  if (sector) filter.sector = sector;
  const allowed = ['symbol', 'name', 'price', 'volume', 'marketCap', 'lastPriceUpdate'];
  const sortKey = allowed.includes(sort) ? sort : 'symbol';
  const stocks = await Stock.find(filter).sort({ [sortKey]: order === 'desc' ? -1 : 1 }).limit(Math.min(Number(limit), 250));
  res.json({ success: true, count: stocks.length, data: stocks });
});

export const getStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase(), isActive: true });
  if (!stock) throw new ApiError(404, 'Stock not found.');
  res.json({ success: true, data: stock });
});

export const getHistory = asyncHandler(async (req, res) => {
  const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase(), isActive: true }).select('symbol price history');
  if (!stock) throw new ApiError(404, 'Stock not found.');
  const days = Math.min(Math.max(Number(req.query.days || 90), 1), 365);
  const from = new Date(); from.setDate(from.getDate() - days);
  const history = stock.history.filter((p) => new Date(p.time) >= from);
  res.json({ success: true, data: history.length ? history : generateHistory(stock.symbol, stock.price, days) });
});

export const refreshStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase(), isActive: true });
  if (!stock) throw new ApiError(404, 'Stock not found.');
  const q = await fetchQuote(stock.symbol, stock.price);
  Object.assign(stock, {
    price: q.price, previousClose: q.previousClose || stock.previousClose, open: q.open || stock.open,
    high: q.high || stock.high, low: q.low || stock.low, volume: q.volume || stock.volume,
    lastPriceUpdate: q.timestamp,
  });
  stock.history.push({ time: q.timestamp, price: q.price });
  await stock.save();
  res.json({ success: true, data: stock });
});

export const marketSummary = asyncHandler(async (_req, res) => {
  const stocks = await Stock.find({ isActive: true }).select('symbol name price previousClose volume marketCap');
  const formatted = stocks.map((s) => ({ ...s.toJSON(), change: s.price - (s.previousClose || s.price), changePercent: s.previousClose ? ((s.price - s.previousClose) / s.previousClose) * 100 : 0 }));
  const gainers = [...formatted].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...formatted].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const advances = formatted.filter((s) => s.change > 0).length;
  const declines = formatted.filter((s) => s.change < 0).length;
  res.json({ success: true, data: {
    gainers, losers,
    stats: { traded: formatted.length, advances, declines, unchanged: formatted.length - advances - declines, totalVolume: formatted.reduce((a, s) => a + (s.volume || 0), 0), totalMarketCap: formatted.reduce((a, s) => a + (s.marketCap || 0), 0) },
  }});
});
