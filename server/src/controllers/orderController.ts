import { Response } from 'express';
import { db } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const createOrder = (req: AuthRequest, res: Response): void => {
  try {
    const {
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      giftNote,
      promoCode,
    } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Your order must contain at least one piece.',
      });
      return;
    }

    if (
      !shippingAddress ||
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      res.status(400).json({
        success: false,
        message: 'Complete shipping address is required.',
      });
      return;
    }

    // Calculate subtotal from products in database to prevent client tampering
    let subtotal = 0;
    const validatedItems = items.map((item: any) => {
      const product = db.getProductById(item.productId) || db.getProductBySlug(item.productId);
      const unitPrice = product ? product.price : item.price;
      const itemTotal = unitPrice * (item.quantity || 1);
      subtotal += itemTotal;

      return {
        id: `${item.productId}-${item.color}-${item.size}`,
        productId: item.productId,
        name: product ? product.name : item.name,
        color: item.color,
        size: item.size,
        quantity: item.quantity || 1,
        price: unitPrice,
        image: product ? product.images.main : item.image,
      };
    });

    // Shipping fee calculation (Free threshold: ₹10,000)
    const isFreeStandard = subtotal >= 10000;
    let shippingFee = 0;

    if (deliveryMethod?.toLowerCase().includes('express')) {
      shippingFee = 2500;
    } else {
      shippingFee = isFreeStandard ? 0 : 1500;
    }

    // Promo calculation
    let discount = 0;
    if (promoCode) {
      const promoResult = db.validatePromotion(promoCode, subtotal);
      if (promoResult.valid) {
        discount = promoResult.discount;
      }
    }

    const total = Math.max(0, subtotal + shippingFee - discount);

    // Save order
    const userId = req.user ? req.user.id : undefined;
    const customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim();
    const customerEmail = req.user?.email || shippingAddress.email || 'guest@velora.com';
    const customerPhone = shippingAddress.phone || '';

    const newOrder = db.createOrder({
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      deliveryMethod: deliveryMethod || 'Atelier Standard Delivery',
      shippingFee,
      subtotal,
      discount,
      total,
      status: 'Confirmed',
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      giftNote,
      items: validatedItems,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully. Thank you for choosing VELORA.',
      order: newOrder,
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMyOrders = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const orders = db.getOrdersByUser(req.user.id);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('getMyOrders error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getOrderById = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const order = db.getOrderById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: `Order reference "${id}" not found.`,
      });
      return;
    }

    // If order has userId, verify caller has permission (or admin)
    if (order.userId && req.user && req.user.id !== order.userId && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('getOrderById error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const validatePromoCode = (req: AuthRequest, res: Response): void => {
  try {
    const { code, cartTotal, subtotal } = req.body;
    const amount = Number(cartTotal ?? subtotal ?? 0);

    if (!code) {
      res.status(400).json({ success: false, message: 'Promo code is required.' });
      return;
    }

    const result = db.validatePromotion(code, amount);

    if (!result.valid) {
      res.status(400).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message,
      discount: result.discount,
      code: code.toUpperCase(),
    });
  } catch (error) {
    console.error('validatePromoCode error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
