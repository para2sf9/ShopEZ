import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';
import ApiError from '../utils/ApiError.js';
import { generateHistory } from '../utils/stockApi.js';

export const dashboard = asyncHandler(async (_req, res) => {
  const [users, stocks, transactions, traded] = await Promise.all([
    User.countDocuments(), Stock.countDocuments({ isActive: true }), Transaction.countDocuments(),
    Transaction.aggregate([{ $match: { status: 'COMPLETED' } }, { $group: { _id: null, volume: { $sum: '$total' } } }]),
  ]);
  const recent = await Transaction.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(8);
  res.json({ success: true, data: { users, stocks, transactions, tradedValue: traded[0]?.volume || 0, recent } });
});

export const listUsers = asyncHandler(async (req, res) => {
  const search = req.query.search || '';
  const filter = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const allowed = ['name', 'role', 'balance', 'isActive'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found.');
  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) throw new ApiError(400, 'You cannot delete your own account.');
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  await Promise.all([Portfolio.deleteOne({ user: user._id }), Transaction.deleteMany({ user: user._id })]);
  res.json({ success: true, message: 'User deleted.' });
});

export const createStock = asyncHandler(async (req, res) => {
  const input = { ...req.body, symbol: req.body.symbol.toUpperCase() };
  if (!input.history?.length) input.history = generateHistory(input.symbol, input.price, 90);
  const stock = await Stock.create(input);
  res.status(201).json({ success: true, data: stock });
});

export const updateStock = asyncHandler(async (req, res) => {
  if (req.body.symbol) req.body.symbol = req.body.symbol.toUpperCase();
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!stock) throw new ApiError(404, 'Stock not found.');
  res.json({ success: true, data: stock });
});

export const deleteStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!stock) throw new ApiError(404, 'Stock not found.');
  res.json({ success: true, message: 'Stock deactivated.' });
});
