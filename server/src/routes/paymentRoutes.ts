import { Router } from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js';

const router = Router();

// Route: POST /api/payment/create-order
router.post('/create-order', createRazorpayOrder);

// Route: POST /api/payment/verify-payment
router.post('/verify-payment', verifyRazorpayPayment);

export default router;
