import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// 1. CORS Configuration
const allowedOrigins = [
  config.corsOrigin,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev mode for ease of pairing
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
  })
);

// 2. Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Request Logger (Development)
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (config.nodeEnv !== 'test') {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} ${req.url}`);
  }
  next();
});

// 4. Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    atelier: 'VELORA Design Studios',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0',
  });
});

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);

// 6. 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found on VELORA server.`,
  });
});

// 7. Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred in VELORA backend.',
  });
});

// 8. Start Server
const server = app.listen(config.port, () => {
  console.log(`\n=================================================`);
  console.log(`  VELORA Atelier Backend Service Active`);
  console.log(`  Port: http://localhost:${config.port}`);
  console.log(`  Health Check: http://localhost:${config.port}/api/health`);
  console.log(`  Products API: http://localhost:${config.port}/api/products`);
  console.log(`  Auth API:     http://localhost:${config.port}/api/auth`);
  console.log(`=================================================\n`);
});

export default app;
