import { Router } from 'express';
import { getCart, syncCart, clearCart } from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/sync', optionalAuth, syncCart);
router.delete('/', optionalAuth, clearCart);

export default router;
