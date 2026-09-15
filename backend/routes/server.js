import { Router } from 'express';
import { getServerStatus } from '../controllers/serverController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireRole('admin', 'super_admin'), getServerStatus);

export default router;
