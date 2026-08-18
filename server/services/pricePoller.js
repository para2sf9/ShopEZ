import Stock from '../models/Stock.js';
import { fetchQuote } from '../utils/stockApi.js';
import logger from '../utils/logger.js';

let timer;

export const updatePrices = async () => {
  const stocks = await Stock.find({ isActive: true }).select('symbol price history');
  const concurrency = Math.max(1, Number(process.env.PRICE_POLL_CONCURRENCY || 4));
  for (let i = 0; i < stocks.length; i += concurrency) {
    await Promise.all(stocks.slice(i, i + concurrency).map(async (stock) => {
      const quote = await fetchQuote(stock.symbol, stock.price);
      stock.previousClose = quote.previousClose || stock.previousClose || stock.price;
      stock.open = quote.open || stock.open;
      stock.high = quote.high || stock.high;
      stock.low = quote.low || stock.low;
      stock.volume = quote.volume || stock.volume;
      stock.price = quote.price;
      stock.lastPriceUpdate = quote.timestamp;
      stock.history.push({ time: quote.timestamp, price: quote.price });
      if (stock.history.length > 365) stock.history = stock.history.slice(-365);
      await stock.save();
    }));
  }
  logger.info(`Updated ${stocks.length} stock quotes.`);
};

export const startPricePoller = () => {
  if (process.env.ENABLE_PRICE_POLLING === 'false') return;
  const interval = Math.max(15000, Number(process.env.PRICE_POLL_INTERVAL_MS || 60000));
  setTimeout(() => updatePrices().catch((e) => logger.error(e.message)), 2000);
  timer = setInterval(() => updatePrices().catch((e) => logger.error(e.message)), interval);
  timer.unref?.();
};

export const stopPricePoller = () => timer && clearInterval(timer);
