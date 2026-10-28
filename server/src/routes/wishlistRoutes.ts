import { Router } from 'express';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlistController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getWishlist);
router.post('/toggle', optionalAuth, toggleWishlistItem);

export default router;
