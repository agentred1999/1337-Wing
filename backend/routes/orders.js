import { Router } from 'express';
import { createOrder, createGuestOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/ordersController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createOrder);
router.post('/guest', createGuestOrder);
router.get('/me', authenticate, getMyOrders);
router.get('/', authenticate, requireRole('admin', 'super_admin'), getAllOrders);
router.put('/:id/status', authenticate, requireRole('admin', 'super_admin'), updateOrderStatus);

export default router;
