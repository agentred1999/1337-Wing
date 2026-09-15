import { Router } from 'express';
import {
  getPayloads,
  submitPayload,
  approvePayload,
  upvotePayload,
} from '../controllers/payloadsController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getPayloads);
router.post('/', authenticate, submitPayload);
router.post('/:id/upvote', authenticate, upvotePayload);
router.post('/:id/approve', authenticate, requireRole('admin', 'super_admin'), approvePayload);

export default router;

