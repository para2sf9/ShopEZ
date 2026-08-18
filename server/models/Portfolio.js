import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema({
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  symbol: { type: String, required: true, uppercase: true },
  quantity: { type: Number, required: true, min: 0 },
  averageBuyPrice: { type: Number, required: true, min: 0 },
  realizedProfitLoss: { type: Number, default: 0 },
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  holdings: { type: [holdingSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Portfolio', portfolioSchema);
