import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createPaymentIntent } from '../controllers/paymentsController.js';

const router = Router();

// Optional auth: if a valid session cookie is present, req.user is populated
// (so the controller can verify ownership for logged-in users' orders).
// If not, req.user stays undefined and the request proceeds as a guest.
function attachUserIfPresent(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Invalid/expired token on an otherwise-guest request — ignore rather than reject.
  }
  next();
}

router.post('/:orderId/create-intent', attachUserIfPresent, createPaymentIntent);

export default router;
