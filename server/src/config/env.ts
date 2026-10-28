import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'velora_atelier_secret_jwt_key_super_secure_984729104',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL || '',
  isProduction: process.env.NODE_ENV === 'production',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_velora_sandbox',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'velora_razorpay_secret_sandbox',
};
