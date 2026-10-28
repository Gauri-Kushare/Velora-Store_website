import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  validatePromoCode,
} from '../controllers/orderController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Guest or authenticated user can place an order
router.post('/', optionalAuth, createOrder);

// Validate promo vouchers
router.post('/validate-promo', validatePromoCode);

// Customer order history
router.get('/my-orders', requireAuth, getMyOrders);

// Order tracking / details by reference ID
router.get('/:id', optionalAuth, getOrderById);

export default router;
