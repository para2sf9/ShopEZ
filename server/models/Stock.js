import mongoose from 'mongoose';

const pricePointSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  name: { type: String, required: true, trim: true, index: true },
  exchange: { type: String, default: 'NASDAQ' },
  sector: { type: String, default: 'Technology', index: true },
  price: { type: Number, required: true, min: 0 },
  previousClose: { type: Number, min: 0 },
  open: { type: Number, min: 0 },
  high: { type: Number, min: 0 },
  low: { type: Number, min: 0 },
  volume: { type: Number, default: 0, min: 0 },
  marketCap: { type: Number, default: 0, min: 0 },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  isActive: { type: Boolean, default: true, index: true },
  history: { type: [pricePointSchema], default: [] },
  lastPriceUpdate: { type: Date, default: Date.now },
}, { timestamps: true });

stockSchema.index({ symbol: 'text', name: 'text' });
stockSchema.virtual('change').get(function () {
  return this.previousClose ? this.price - this.previousClose : 0;
});
stockSchema.virtual('changePercent').get(function () {
  return this.previousClose ? ((this.price - this.previousClose) / this.previousClose) * 100 : 0;
});
stockSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Stock', stockSchema);
