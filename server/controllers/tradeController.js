import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';
import ApiError from '../utils/ApiError.js';

const roundMoney = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const roundQty = (n) => Math.round((Number(n) + Number.EPSILON) * 1e6) / 1e6;

export const executeTrade = asyncHandler(async (req, res) => {
  if (process.env.TRADING_ENABLED === 'false') throw new ApiError(503, 'Order placement is temporarily unavailable.');
  const { symbol, type } = req.body;
  const quantity = roundQty(req.body.quantity);
  const side = String(type).toUpperCase();
  if (!['BUY', 'SELL'].includes(side)) throw new ApiError(422, 'Trade type must be BUY or SELL.');
  if (!Number.isFinite(quantity) || quantity <= 0) throw new ApiError(422, 'Quantity must be greater than zero.');

  const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
  if (!stock) throw new ApiError(404, 'Stock not found or unavailable for trading.');
  const price = roundMoney(stock.price);
  const total = roundMoney(price * quantity);
  if (total <= 0) throw new ApiError(422, 'Trade total is invalid.');

  let portfolio = await Portfolio.findOne({ user: req.user._id });
  if (!portfolio) portfolio = await Portfolio.create({ user: req.user._id, holdings: [] });
  const index = portfolio.holdings.findIndex((h) => h.symbol === stock.symbol);
  let realizedProfitLoss = 0;

  if (side === 'BUY') {
    // Conditional update prevents a negative balance even under concurrent requests.
    const charged = await User.findOneAndUpdate(
      { _id: req.user._id, isActive: true, balance: { $gte: total } },
      { $inc: { balance: -total } },
      { new: true },
    );
    if (!charged) throw new ApiError(400, 'Insufficient cash balance for this purchase.');

    try {
      if (index >= 0) {
        const h = portfolio.holdings[index];
        const newQty = roundQty(h.quantity + quantity);
        h.averageBuyPrice = roundMoney(((h.quantity * h.averageBuyPrice) + total) / newQty);
        h.quantity = newQty;
      } else {
        portfolio.holdings.push({ stock: stock._id, symbol: stock.symbol, quantity, averageBuyPrice: price });
      }
      await portfolio.save();
    } catch (error) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { balance: total } });
      throw error;
    }
  } else {
    if (index < 0 || portfolio.holdings[index].quantity < quantity) {
      throw new ApiError(400, 'Insufficient shares for this sale.');
    }
    const holding = portfolio.holdings[index];
    realizedProfitLoss = roundMoney((price - holding.averageBuyPrice) * quantity);
    const original = holding.toObject();
    holding.quantity = roundQty(holding.quantity - quantity);
    holding.realizedProfitLoss = roundMoney((holding.realizedProfitLoss || 0) + realizedProfitLoss);
    if (holding.quantity <= 0) portfolio.holdings.splice(index, 1);
    await portfolio.save();
    try {
      await User.findByIdAndUpdate(req.user._id, { $inc: { balance: total } });
    } catch (error) {
      portfolio.holdings.push(original);
      await portfolio.save();
      throw error;
    }
  }

  const transaction = await Transaction.create({
    user: req.user._id, stock: stock._id, symbol: stock.symbol, type: side,
    quantity, price, total, realizedProfitLoss, status: 'COMPLETED',
  });
  const freshUser = await User.findById(req.user._id);
  res.status(201).json({ success: true, message: `${side} order completed.`, data: { transaction, balance: freshUser.balance } });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25)));
  const filter = { user: req.user._id };
  if (req.query.type) filter.type = req.query.type.toUpperCase();
  if (req.query.symbol) filter.symbol = req.query.symbol.toUpperCase();
  const [items, total] = await Promise.all([
    Transaction.find(filter).populate('stock', 'name sector').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Transaction.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const getPortfolio = asyncHandler(async (req, res) => {
  const [portfolio, user] = await Promise.all([
    Portfolio.findOne({ user: req.user._id }).populate('holdings.stock', 'name price previousClose sector lastPriceUpdate'),
    User.findById(req.user._id).select('balance'),
  ]);
  const holdings = (portfolio?.holdings || []).map((h) => {
    const currentPrice = h.stock?.price || 0;
    const marketValue = roundMoney(currentPrice * h.quantity);
    const costBasis = roundMoney(h.averageBuyPrice * h.quantity);
    const unrealizedProfitLoss = roundMoney(marketValue - costBasis);
    const unrealizedPercent = costBasis ? roundMoney((unrealizedProfitLoss / costBasis) * 100) : 0;
    return { ...h.toObject(), currentPrice, marketValue, costBasis, unrealizedProfitLoss, unrealizedPercent };
  });
  const marketValue = roundMoney(holdings.reduce((sum, h) => sum + h.marketValue, 0));
  const costBasis = roundMoney(holdings.reduce((sum, h) => sum + h.costBasis, 0));
  const unrealizedProfitLoss = roundMoney(marketValue - costBasis);
  res.json({ success: true, data: {
    cashBalance: user.balance, holdings,
    summary: { marketValue, costBasis, unrealizedProfitLoss, totalValue: roundMoney(user.balance + marketValue), unrealizedPercent: costBasis ? roundMoney(unrealizedProfitLoss / costBasis * 100) : 0 },
  }});
});
