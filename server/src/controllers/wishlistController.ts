import { Response } from 'express';
import { db } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

const getSessionOrUserId = (req: AuthRequest): string => {
  if (req.user?.id) return req.user.id;
  const headerSession = req.headers['x-session-id'];
  if (headerSession && typeof headerSession === 'string') return headerSession;
  return 'anonymous-session';
};

export const getWishlist = (req: AuthRequest, res: Response): void => {
  try {
    const identifier = getSessionOrUserId(req);
    const productIds = db.getWishlist(identifier);
    const products = productIds.map((id) => db.getProductById(id)).filter(Boolean);

    res.status(200).json({
      success: true,
      count: productIds.length,
      productIds,
      data: products,
    });
  } catch (error) {
    console.error('getWishlist error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const toggleWishlistItem = (req: AuthRequest, res: Response): void => {
  try {
    const identifier = getSessionOrUserId(req);
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, message: 'Product ID is required.' });
      return;
    }

    const updated = db.toggleWishlist(identifier, productId);
    const isSaved = updated.includes(productId);

    res.status(200).json({
      success: true,
      message: isSaved ? 'Saved piece to your personal wishlist' : 'Removed piece from wishlist',
      isSaved,
      productIds: updated,
    });
  } catch (error) {
    console.error('toggleWishlistItem error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
