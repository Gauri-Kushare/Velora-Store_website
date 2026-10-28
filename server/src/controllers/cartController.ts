import { Response } from 'express';
import { db } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

const getSessionOrUserId = (req: AuthRequest): string => {
  if (req.user?.id) return req.user.id;
  const headerSession = req.headers['x-session-id'];
  if (headerSession && typeof headerSession === 'string') return headerSession;
  return 'anonymous-session';
};

export const getCart = (req: AuthRequest, res: Response): void => {
  try {
    const identifier = getSessionOrUserId(req);
    const cart = db.getCart(identifier);

    res.status(200).json({
      success: true,
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
      data: cart,
    });
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const syncCart = (req: AuthRequest, res: Response): void => {
  try {
    const identifier = getSessionOrUserId(req);
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({ success: false, message: 'Items must be an array' });
      return;
    }

    const updatedCart = db.syncCart(identifier, items);

    res.status(200).json({
      success: true,
      message: 'Cart synchronized with atelier database',
      count: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
      data: updatedCart,
    });
  } catch (error) {
    console.error('syncCart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const clearCart = (req: AuthRequest, res: Response): void => {
  try {
    const identifier = getSessionOrUserId(req);
    db.clearCart(identifier);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: [],
    });
  } catch (error) {
    console.error('clearCart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
