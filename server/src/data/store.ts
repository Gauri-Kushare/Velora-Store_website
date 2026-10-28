import bcrypt from 'bcryptjs';
import { SEED_PRODUCTS, SEED_PROMOTIONS, ProductData } from './seedData.js';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  tier: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressRecord {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItemRecord {
  id: string;
  productId: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderRecord {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  deliveryMethod: string;
  shippingFee: number;
  subtotal: number;
  discount: number;
  total: number;
  status: 'Confirmed' | 'In Atelier' | 'Quality Check' | 'Dispatched' | 'Delivered';
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentId?: string;
  giftNote?: string;
  date: string;
  createdAt: Date;
  items: OrderItemRecord[];
}

export interface CartItemRecord {
  id: string;
  userId?: string;
  sessionId?: string;
  product: ProductData;
  selectedColor: { name: string; hex: string; inStock: boolean };
  selectedSize: string;
  quantity: number;
  updatedAt: Date;
}

class Store {
  private products: ProductData[] = [];
  private users: UserRecord[] = [];
  private addresses: AddressRecord[] = [];
  private orders: OrderRecord[] = [];
  private cartItems: CartItemRecord[] = [];
  private wishlist: Map<string, string[]> = new Map(); // userId/sessionId -> productId[]

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Seed products
    this.products = [...SEED_PRODUCTS];

    // 2. Seed default demo customer (Eleanor Vance)
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Velora2026!', salt);

    const demoUser: UserRecord = {
      id: 'usr-eleanor-vance-001',
      email: 'eleanor.vance@atelier-velora.com',
      passwordHash,
      firstName: 'Eleanor',
      lastName: 'Vance',
      phone: '+91 98201 44520',
      role: 'CUSTOMER',
      tier: 'Atelier Member',
      createdAt: new Date('2026-01-15T10:00:00Z'),
      updatedAt: new Date('2026-01-15T10:00:00Z'),
    };
    this.users.push(demoUser);

    // 3. Seed demo address
    this.addresses.push({
      id: 'addr-eleanor-001',
      userId: demoUser.id,
      firstName: 'Eleanor',
      lastName: 'Vance',
      phone: '+91 98201 44520',
      street: '42 Altamount Road, Cumballa Hill',
      apartment: 'Apartment 8B, The Residence',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400026',
      country: 'India',
      isDefault: true,
    });

    // 4. Seed initial order
    const silkShirt = this.products[0];
    this.orders.push({
      id: 'VEL-849201',
      userId: demoUser.id,
      customerName: 'Eleanor Vance',
      customerEmail: 'eleanor.vance@atelier-velora.com',
      customerPhone: '+91 98201 44520',
      shippingAddress: {
        firstName: 'Eleanor',
        lastName: 'Vance',
        phone: '+91 98201 44520',
        address: '42 Altamount Road, Cumballa Hill',
        apartment: 'Apartment 8B, The Residence',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400026',
        country: 'India',
      },
      deliveryMethod: 'Complimentary White-Glove Standard',
      shippingFee: 0,
      subtotal: 6900,
      discount: 0,
      total: 6900,
      status: 'Dispatched',
      paymentMethod: 'Credit Card (ending 4242)',
      paymentStatus: 'Paid',
      giftNote: 'For a considered season ahead.',
      date: 'Oct 22, 2026',
      createdAt: new Date('2026-10-22T14:30:00Z'),
      items: [
        {
          id: 'silk-shirt-Ivory-M',
          productId: silkShirt.id,
          name: silkShirt.name,
          color: 'Ivory',
          size: 'M',
          quantity: 1,
          price: silkShirt.price,
          image: silkShirt.images.main,
        },
      ],
    });

    // 5. Seed demo wishlist
    this.wishlist.set(demoUser.id, ['silk-shirt', 'everyday-blazer']);
  }

  // --- PRODUCT METHODS ---
  getProducts(filters: {
    category?: string;
    department?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    search?: string;
    featured?: boolean;
  }): ProductData[] {
    let result = [...this.products];

    // Filter by department or category
    if (filters.department && filters.department !== 'all') {
      result = result.filter(
        (p) =>
          p.department.toLowerCase() === filters.department!.toLowerCase() ||
          p.category.toLowerCase() === filters.department!.toLowerCase()
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Filter by size
    if (filters.size && filters.size !== 'all') {
      result = result.filter((p) => p.sizes.includes(filters.size!));
    }

    // Filter by color
    if (filters.color && filters.color !== 'all') {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === filters.color!.toLowerCase())
      );
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    // Filter by search query
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Filter by featured
    if (filters.featured !== undefined) {
      result = result.filter((p) => p.isFeatured === filters.featured);
    }

    // Sorting
    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'newest') {
      result.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
    }

    return result;
  }

  getProductBySlug(slug: string): ProductData | null {
    return this.products.find((p) => p.slug === slug || p.id === slug) || null;
  }

  getProductById(id: string): ProductData | null {
    return this.products.find((p) => p.id === id) || null;
  }

  // --- USER & AUTH METHODS ---
  findUserByEmail(email: string): UserRecord | null {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id: string): UserRecord | null {
    return this.users.find((u) => u.id === id) || null;
  }

  createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): UserRecord {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);

    const newUser: UserRecord = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'CUSTOMER',
      tier: 'Atelier Member',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  updateUserProfile(
    id: string,
    updates: Partial<Pick<UserRecord, 'firstName' | 'lastName' | 'phone'>>
  ): UserRecord | null {
    const user = this.findUserById(id);
    if (!user) return null;

    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;
    if (updates.phone) user.phone = updates.phone;
    user.updatedAt = new Date();

    return user;
  }

  getUserAddresses(userId: string): AddressRecord[] {
    return this.addresses.filter((a) => a.userId === userId);
  }

  // --- ORDER METHODS ---
  createOrder(orderData: Omit<OrderRecord, 'id' | 'date' | 'createdAt'>): OrderRecord {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `VEL-${randomNum}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newOrder: OrderRecord = {
      ...orderData,
      id: orderId,
      date: dateFormatted,
      createdAt: now,
    };

    this.orders.unshift(newOrder);

    // If order has a userId or sessionId, clear their cart
    if (orderData.userId) {
      this.clearCart(orderData.userId);
    }

    return newOrder;
  }

  getOrdersByUser(userId: string): OrderRecord[] {
    return this.orders.filter((o) => o.userId === userId);
  }

  getOrderById(id: string): OrderRecord | null {
    return this.orders.find((o) => o.id === id) || null;
  }

  // --- CART METHODS ---
  getCart(identifier: string): CartItemRecord[] {
    return this.cartItems.filter(
      (c) => c.userId === identifier || c.sessionId === identifier
    );
  }

  syncCart(identifier: string, items: Array<{
    productId: string;
    selectedColor: { name: string; hex: string; inStock: boolean };
    selectedSize: string;
    quantity: number;
  }>): CartItemRecord[] {
    // Remove existing items for this user/session
    this.cartItems = this.cartItems.filter(
      (c) => c.userId !== identifier && c.sessionId !== identifier
    );

    // Insert new synced items
    const newItems: CartItemRecord[] = items.map((item) => {
      const product = this.getProductById(item.productId) || this.products[0];
      return {
        id: `${product.id}-${item.selectedColor.name}-${item.selectedSize}`,
        userId: identifier.startsWith('usr-') ? identifier : undefined,
        sessionId: !identifier.startsWith('usr-') ? identifier : undefined,
        product,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        updatedAt: new Date(),
      };
    });

    this.cartItems.push(...newItems);
    return newItems;
  }

  clearCart(identifier: string) {
    this.cartItems = this.cartItems.filter(
      (c) => c.userId !== identifier && c.sessionId !== identifier
    );
  }

  // --- WISHLIST METHODS ---
  getWishlist(identifier: string): string[] {
    return this.wishlist.get(identifier) || [];
  }

  toggleWishlist(identifier: string, productId: string): string[] {
    const current = this.getWishlist(identifier);
    let updated: string[];

    if (current.includes(productId)) {
      updated = current.filter((id) => id !== productId);
    } else {
      updated = [...current, productId];
    }

    this.wishlist.set(identifier, updated);
    return updated;
  }

  // --- PROMO CODES ---
  validatePromotion(code: string, cartTotal: number): {
    valid: boolean;
    discount: number;
    message: string;
  } {
    const promo = SEED_PROMOTIONS.find(
      (p) => p.code.toUpperCase() === code.toUpperCase() && p.isActive
    );

    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid or expired promotional code' };
    }

    if (cartTotal < promo.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Order must be at least ₹${promo.minOrderAmount.toLocaleString('en-IN')} to use this code`,
      };
    }

    let discount = 0;
    if (promo.discountPercent) {
      discount = Math.round((cartTotal * promo.discountPercent) / 100);
    } else if (promo.discountAmount) {
      discount = promo.discountAmount;
    }

    return {
      valid: true,
      discount,
      message: `Promotional code ${promo.code} applied successfully`,
    };
  }
}

export const db = new Store();
