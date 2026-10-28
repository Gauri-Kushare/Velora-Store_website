# VELORA — Contemporary Luxury E-Commerce & Backend Service

VELORA is a high-end luxury fashion store built with a bespoke warm ivory (`#F7F4EE`) and charcoal (`#20201D`) aesthetic, powered by a modern TypeScript frontend and a Node.js/Express backend service supporting PostgreSQL, Prisma, and Supabase.

---

## Architecture Overview

```
velora-store/
├── server/                      # Production-ready Node.js & Express Backend
│   ├── prisma/
│   │   ├── schema.prisma        # Complete database schema (User, Product, Order, etc.)
│   │   └── migrations/init.sql  # 1-click SQL migration for Supabase / PostgreSQL
│   ├── src/
│   │   ├── config/env.ts        # Type-safe environment config
│   │   ├── controllers/         # Auth, Product, Order, Cart, Wishlist controllers
│   │   ├── routes/              # Express REST endpoints
│   │   ├── middleware/auth.ts   # JWT verification & optional session middleware
│   │   ├── data/store.ts        # High-performance store with seeded data & memory cache
│   │   └── index.ts             # Express server entry point (Port 5000)
│   ├── .env                     # Backend environment configuration
│   └── .env.example             # Template for PostgreSQL / Supabase
├── public/                      # Static assets & favicon
│   ├── favicon.svg
│   ├── images/
│   └── _redirects               # SPA fallback rule for Netlify
│
├── src/                         # React 18 + TypeScript + Vite Frontend
│   ├── components/              # Luxury UI (Home, PDP, Shop, Cart, Checkout, Account)
│   ├── context/StoreContext.tsx # Central state with automatic backend API sync & offline fallback
│   ├── services/api.ts          # Typed REST API client
│   └── data/storeData.ts        # Local fallback product catalog
│
├── .env                         # Frontend environment variables
├── .env.example                 # Frontend template
└── netlify.toml                 # Netlify build & SPA routing configuration
```

---

## 1. Quick Start

### Start Frontend & Backend
In the project root, you can run:

```bash
# Terminal 1: Run Vite frontend (http://localhost:5173)
npm run dev

# Terminal 2: Run Express backend (http://localhost:5000)
npm run server
```

The frontend automatically connects to `http://localhost:5000/api`. If the backend is ever stopped, the frontend seamlessly falls back to local storage and offline catalog without crashing.

---

## 2. Pre-Seeded Atelier Demo Account

For instant testing and evaluation:
- **Email**: `eleanor.vance@atelier-velora.com`
- **Password**: `Velora2026!`
- *Or click the "Auto-fill Seeded Demo Account" button on the `/account` page.*

### Seeded Promotion Codes
- `VELORA10` — 10% off entire order
- `WELCOME10` — 10% welcome privilege
- `ATELIER` — ₹2,000 off orders above ₹5,000

---

## 3. Database Schema

The schema is defined in [server/prisma/schema.prisma](file:///c:/Users/gauri/Downloads/velora-store/server/prisma/schema.prisma) and [server/prisma/migrations/init.sql](file:///c:/Users/gauri/Downloads/velora-store/server/prisma/migrations/init.sql):

- **`User`**: Customer accounts (`id`, `email`, `passwordHash`, `firstName`, `lastName`, `phone`, `tier`, `role`).
- **`Address`**: Multiple shipping & billing addresses per customer.
- **`Product`**: Catalog pieces (`id`, `slug`, `name`, `price` in INR, `stockCount`, `category`, `material`, `images`).
- **`ColorOption` & `SizeVariant`**: Product variants with individual stock management.
- **`Order` & `OrderItem`**: Checkout orders with status tracking, tax/shipping logic, and addresses.
- **`CartItem` & `WishlistItem`**: Persistent user cart and wishlist sync.
- **`PromotionCode`**: Validated discount codes.

---

## 4. API Reference

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | None | Service status and timestamp |
| `/api/products` | GET | None | Filter by category, department, price range, and sort |
| `/api/products/:slug` | GET | None | Retrieve single product details |
| `/api/products/featured` | GET | None | Curated featured pieces |
| `/api/products/categories` | GET | None | Category list with piece counts |
| `/api/auth/register` | POST | None | Create new customer account |
| `/api/auth/login` | POST | None | Sign in and receive JWT token |
| `/api/auth/me` | GET | Bearer | Get authenticated user profile |
| `/api/auth/profile` | PUT | Bearer | Update profile details |
| `/api/cart` | GET | Optional | Fetch synchronized cart items |
| `/api/cart/sync` | POST | Optional | Sync frontend cart state |
| `/api/cart` | DELETE | Optional | Empty cart |
| `/api/orders` | POST | Optional | Create order with auto-pricing and address validation |
| `/api/orders/my-orders` | GET | Bearer | Retrieve order history for logged-in user |
| `/api/orders/:id` | GET | Optional | Order status and receipt by reference ID |
| `/api/orders/validate-promo` | POST | None | Check validity and calculate coupon discount |
| `/api/wishlist` | GET | Bearer | Fetch saved items |
| `/api/wishlist/toggle` | POST | Bearer | Toggle piece in wishlist |

---

## 5. Connecting PostgreSQL / Supabase

1. Create a project in [Supabase](https://supabase.com) or any PostgreSQL provider.
2. Open the **SQL Editor** in Supabase and paste the contents of [server/prisma/migrations/init.sql](file:///c:/Users/gauri/Downloads/velora-store/server/prisma/migrations/init.sql), then click **Run**.
3. In `server/.env`, set your `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
   ```
4. Run Prisma client generation:
   ```bash
   cd server
   npx prisma generate
   ```

---

## 6. Netlify Production Deployment

The VELORA frontend is fully configured for deployment on [Netlify](https://www.netlify.com/).

### Deployment Settings
- **Base directory**: `.` (leave blank / root)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Configuration file**: `netlify.toml` (auto-detected)

### SPA Routing & Redirects
To prevent 404 errors when navigating directly to client-side routes (e.g., `/shop`, `/product/:slug`, `/cart`, `/checkout`, `/account`, `/orders`), Netlify redirects are configured in both:
1. `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
2. `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Production Environment Variables (Netlify Dashboard)

Set the following environment variables in **Netlify Dashboard** under:
**Site configuration** > **Environment variables** > **Add a variable**:

| Variable Name | Required | Default / Fallback | Description |
|---|:---:|---|---|
| `VITE_API_URL` | Optional | `http://localhost:5000/api` | Full URL to your deployed backend API (e.g. `https://velora-api.onrender.com/api`). If omitted or unreachable, VELORA seamlessly uses its high-fidelity local database and offline storage. |
| `VITE_SUPABASE_URL` | Optional | None | Your Supabase project URL (e.g. `https://your-project-id.supabase.co`). |
| `VITE_SUPABASE_ANON_KEY` | Optional | None | Your Supabase Anonymous Public Key (`anon public`). |
| `VITE_RAZORPAY_KEY_ID` | Optional | Sandbox test mode | Your Razorpay API Key ID (e.g. `rzp_test_...` or `rzp_live_...`). Enables interactive Razorpay popup checkout with Cards, UPI, and Netbanking. |
| `VITE_MERCHANT_UPI_ID` | Optional | `atelier.velora@hdfcbank` | Your store's merchant UPI Virtual Payment Address (e.g. `yourstore@okhdfcbank`). Used for direct UPI QR code scanning and app-intent checkout. |

### 1-Click Deploy with GitHub
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/Gauri-Kushare/Velora-Store_website.git
   git push -u origin main
   ```
2. In Netlify, click **"Add new site"** > **"Import an existing project"** > **GitHub**.
3. Select `Velora-Store_website`.
4. The build command (`npm run build`) and publish directory (`dist`) will be automatically detected from `netlify.toml`.
5. Under **Environment variables**, add any required production keys.
6. Click **Deploy VELORA Store**.

