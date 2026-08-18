import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { startPricePoller, stopPricePoller } from './services/pricePoller.js';
import logger from './utils/logger.js';

const port = process.env.PORT || 5000;
await connectDB();
const server = app.listen(port, () => {
  logger.info(`API listening on port ${port} (${process.env.NODE_ENV || 'development'})`);
  startPricePoller();
});

const shutdown = (signal) => {
  logger.info(`${signal} received; shutting down.`);
  stopPricePoller();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => { logger.error(err); shutdown('unhandledRejection'); });
