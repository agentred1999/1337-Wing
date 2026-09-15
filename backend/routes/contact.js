import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitContact, getMessages } from '../controllers/contactController.js';
import { contactRules, handleValidation } from '../middleware/validators.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many messages sent, please try again later' },
});

router.post('/', contactLimiter, contactRules, handleValidation, submitContact);
router.get('/', authenticate, requireRole('admin', 'super_admin'), getMessages);

export default router;
