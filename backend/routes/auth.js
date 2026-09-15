import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, me } from '../controllers/authController.js';
import { requestPasswordReset, resetPassword } from '../controllers/passwordResetController.js';
import { registerRules, loginRules, handleValidation } from '../middleware/validators.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts, please try again later' },
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many reset attempts, please try again later' },
});

router.post('/register', authLimiter, registerRules, handleValidation, register);
router.post('/login', authLimiter, loginRules, handleValidation, login);
router.post('/logout', logout);
router.get('/me', authenticate, me);
router.post('/forgot-password', resetLimiter, requestPasswordReset);
router.post('/reset-password', resetLimiter, resetPassword);

export default router;
