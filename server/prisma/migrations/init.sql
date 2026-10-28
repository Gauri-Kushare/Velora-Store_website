-- VELORA Luxury Store Database Schema
-- Compatible with PostgreSQL 13+, Supabase, Neon, AWS RDS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN', 'ATELIER_STAFF');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('CONFIRMED', 'IN_ATELIER', 'QUALITY_CHECK', 'DISPATCHED', 'DELIVERED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "InventoryStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(50),
  "role" "Role" DEFAULT 'CUSTOMER',
  "tier" VARCHAR(50) DEFAULT 'Atelier Member',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Addresses Table
CREATE TABLE IF NOT EXISTS "addresses" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(50) NOT NULL,
  "street" TEXT NOT NULL,
  "apartment" VARCHAR(100),
  "city" VARCHAR(100) NOT NULL,
  "state" VARCHAR(100) NOT NULL,
  "postalCode" VARCHAR(20) NOT NULL,
  "country" VARCHAR(100) DEFAULT 'India',
  "isDefault" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS "products" (
  "id" VARCHAR(100) PRIMARY KEY,
  "slug" VARCHAR(150) UNIQUE NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "subtitle" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "material" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "originalPrice" INTEGER,
  "badge" VARCHAR(50),
  "category" VARCHAR(100) NOT NULL,
  "department" VARCHAR(100) NOT NULL,
  "inventoryStatus" "InventoryStatus" DEFAULT 'IN_STOCK',
  "stockCount" INTEGER DEFAULT 25,
  "images" JSONB NOT NULL,
  "details" JSONB NOT NULL,
  "care" JSONB NOT NULL,
  "delivery" TEXT NOT NULL,
  "isFeatured" BOOLEAN DEFAULT false,
  "pairingProductIds" JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Color Options Table
CREATE TABLE IF NOT EXISTS "color_options" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "productId" VARCHAR(100) NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "name" VARCHAR(50) NOT NULL,
  "hex" VARCHAR(20) NOT NULL,
  "inStock" BOOLEAN DEFAULT true,
  "imagePreview" TEXT
);

-- 5. Size Variants Table
CREATE TABLE IF NOT EXISTS "size_variants" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "productId" VARCHAR(100) NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "size" VARCHAR(20) NOT NULL,
  "inStock" BOOLEAN DEFAULT true,
  "stockCount" INTEGER DEFAULT 5
);

-- 6. Cart Items Table
CREATE TABLE IF NOT EXISTS "cart_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID REFERENCES "users"("id") ON DELETE CASCADE,
  "sessionId" VARCHAR(100),
  "productId" VARCHAR(100) NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "selectedColor" VARCHAR(50) NOT NULL,
  "selectedSize" VARCHAR(20) NOT NULL,
  "quantity" INTEGER DEFAULT 1,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Wishlist Items Table
CREATE TABLE IF NOT EXISTS "wishlist_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "productId" VARCHAR(100) NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "productId")
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS "orders" (
  "id" VARCHAR(50) PRIMARY KEY,
  "userId" UUID REFERENCES "users"("id") ON DELETE SET NULL,
  "customerName" VARCHAR(200) NOT NULL,
  "customerEmail" VARCHAR(255) NOT NULL,
  "customerPhone" VARCHAR(50) NOT NULL,
  "shippingAddress" JSONB NOT NULL,
  "deliveryMethod" VARCHAR(150) NOT NULL,
  "shippingFee" INTEGER DEFAULT 0,
  "subtotal" INTEGER NOT NULL,
  "discount" INTEGER DEFAULT 0,
  "total" INTEGER NOT NULL,
  "status" "OrderStatus" DEFAULT 'CONFIRMED',
  "paymentMethod" VARCHAR(100) NOT NULL,
  "paymentStatus" "PaymentStatus" DEFAULT 'PAID',
  "paymentId" VARCHAR(150),
  "giftNote" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Order Items Table
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "orderId" VARCHAR(50) NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "productId" VARCHAR(100) NOT NULL REFERENCES "products"("id"),
  "name" VARCHAR(255) NOT NULL,
  "color" VARCHAR(50) NOT NULL,
  "size" VARCHAR(20) NOT NULL,
  "quantity" INTEGER DEFAULT 1,
  "price" INTEGER NOT NULL,
  "image" TEXT NOT NULL
);

-- 10. Promotion Codes Table
CREATE TABLE IF NOT EXISTS "promotion_codes" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "code" VARCHAR(50) UNIQUE NOT NULL,
  "discountPercent" INTEGER,
  "discountAmount" INTEGER,
  "minOrderAmount" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "expiresAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products"("category");
CREATE INDEX IF NOT EXISTS "idx_products_department" ON "products"("department");
CREATE INDEX IF NOT EXISTS "idx_products_price" ON "products"("price");
CREATE INDEX IF NOT EXISTS "idx_orders_userId" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "idx_cart_sessionId" ON "cart_items"("sessionId");
