import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authenticate, requireRole('admin', 'super_admin'), createProduct);
router.put('/:id', authenticate, requireRole('admin', 'super_admin'), updateProduct);
router.delete('/:id', authenticate, requireRole('admin', 'super_admin'), deleteProduct);

export default router;
