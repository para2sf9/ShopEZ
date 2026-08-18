import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, index: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true, index: true },
  quantity: { type: Number, required: true, min: 0.000001 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  realizedProfitLoss: { type: Number, default: 0 },
  status: { type: String, enum: ['COMPLETED', 'REJECTED'], default: 'COMPLETED' },
}, { timestamps: true });

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ user: 1, symbol: 1, createdAt: -1 });

export default mongoose.model('Transaction', transactionSchema);
