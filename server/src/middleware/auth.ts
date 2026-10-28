import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { db } from '../data/store.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid Bearer token.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string; role: string };

    const user = db.findUserById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid session. User account no longer exists.',
      });
      return;
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please sign in again.',
    });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string; role: string };
      const user = db.findUserById(decoded.id);
      if (user) {
        req.user = { id: user.id, email: user.email, role: user.role };
      }
    }
  } catch {
    // Optional auth silently proceeds if token is missing or invalid
  }
  next();
};
