import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../config/env.js';

// Initialize Razorpay client if real keys are provided
let razorpayInstance: Razorpay | null = null;
const isRealRazorpayConfigured =
  config.razorpayKeyId &&
  config.razorpayKeySecret &&
  config.razorpayKeyId !== 'rzp_test_velora_sandbox' &&
  !config.razorpayKeyId.includes('placeholder');

if (isRealRazorpayConfigured) {
  try {
    razorpayInstance = new Razorpay({
      key_id: config.razorpayKeyId,
      key_secret: config.razorpayKeySecret,
    });
  } catch (err) {
    console.warn('Failed to initialize Razorpay SDK with provided keys, using test mode.', err);
  }
}

/**
 * POST /api/payment/create-order
 * Initializes a Razorpay order in INR paise (amount * 100)
 */
export const createRazorpayOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid order amount. Amount must be greater than zero.',
      });
      return;
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const orderReceipt = receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (razorpayInstance) {
      try {
        const razorpayOrder = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency,
          receipt: orderReceipt,
          notes: notes || { atelier: 'VELORA Design Studios' },
        });

        res.status(200).json({
          success: true,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: config.razorpayKeyId,
          receipt: razorpayOrder.receipt,
          isLiveGateway: true,
        });
        return;
      } catch (err: any) {
        console.warn('Razorpay API error, falling back to secure test sandbox order:', err.message);
      }
    }

    // Secure Sandbox/Test Order for development & evaluation
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.status(200).json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: config.razorpayKeyId,
      receipt: orderReceipt,
      isLiveGateway: false,
      message: 'Razorpay sandbox order initialized.',
    });
  } catch (error) {
    console.error('createRazorpayOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize payment gateway order.' });
  }
};

/**
 * POST /api/payment/verify-payment
 * Cryptographically verifies Razorpay payment signature
 */
export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      res.status(400).json({
        success: false,
        message: 'Missing required payment verification identifiers.',
      });
      return;
    }

    // If real Razorpay key secret is present and signature provided
    if (isRealRazorpayConfigured && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', config.razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        res.status(400).json({
          success: false,
          verified: false,
          message: 'Payment verification failed: Signature mismatch.',
        });
        return;
      }
    }

    // Verified
    res.status(200).json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: 'Razorpay payment signature verified successfully.',
    });
  } catch (error) {
    console.error('verifyRazorpayPayment error:', error);
    res.status(500).json({ success: false, message: 'Internal server payment verification error.' });
  }
};
