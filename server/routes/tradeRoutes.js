import { Router } from 'express';
import { body } from 'express-validator';
import { executeTrade, getTransactions, getPortfolio } from '../controllers/tradeController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
const router = Router();
router.use(protect);
router.get('/portfolio', getPortfolio);
router.get('/transactions', getTransactions);
router.post('/', [
  body('symbol').trim().notEmpty().withMessage('Stock symbol is required.'),
  body('type').isIn(['BUY', 'SELL', 'buy', 'sell']).withMessage('Type must be BUY or SELL.'),
  body('quantity').isFloat({ gt: 0 }).withMessage('Quantity must be greater than zero.'),
], validate, executeTrade);
export default router;
