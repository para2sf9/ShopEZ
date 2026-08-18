import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import ApiError from '../utils/ApiError.js';
import { signToken } from '../utils/token.js';

const authResponse = (user) => ({ token: signToken(user), user: user.safeJSON() });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.exists({ email: email.toLowerCase() })) throw new ApiError(409, 'An account with this email already exists.');
  const user = await User.create({ name, email, password });
  await Portfolio.create({ user: user._id, holdings: [] });
  res.status(201).json({ success: true, data: authResponse(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password.');
  if (!user.isActive) throw new ApiError(403, 'This account is disabled.');
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, data: authResponse(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.safeJSON() });
});
