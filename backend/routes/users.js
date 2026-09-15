import { Router } from 'express';
import { getUsers, getCurrentUser, updateUserRole } from '../controllers/usersController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, getCurrentUser);
router.get('/', authenticate, requireRole('admin', 'super_admin'), getUsers);
router.put('/:id/role', authenticate, requireRole('super_admin'), updateUserRole);

export default router;

