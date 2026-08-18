import { Router } from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { dashboard, listUsers, getUser, updateUser, deleteUser, createStock, updateStock, deleteStock } from '../controllers/adminController.js';
const router = Router();
router.use(protect, authorize('ADMIN'));
router.get('/dashboard', dashboard);
router.route('/users').get(listUsers);
router.route('/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.post('/stocks', [
  body('symbol').trim().notEmpty(), body('name').trim().notEmpty(), body('price').isFloat({ gt: 0 }),
], validate, createStock);
router.patch('/stocks/:id', updateStock);
router.delete('/stocks/:id', deleteStock);
export default router;
