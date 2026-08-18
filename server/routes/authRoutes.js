import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
  body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[a-z]/).matches(/[0-9]/)
    .withMessage('Password must be at least 8 characters and include uppercase, lowercase, and a number.'),
], validate, register);
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], validate, login);
router.get('/me', protect, me);
export default router;
