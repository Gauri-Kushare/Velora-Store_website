import { Product, CartItem, Order, ShippingAddress } from '../types/store';
import { PRODUCTS } from '../data/storeData';

// API Base URL from environment variable or default local server
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Local storage keys
const TOKEN_KEY = 'velora_auth_token';
const SESSION_KEY = 'velora_session_id';

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to save auth token to localStorage', e);
  }
};

export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to remove auth token from localStorage', e);
  }
};

export const getOrCreateSessionId = (): string => {
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return 'fallback_session';
  }
};

// Generic helper for API fetch requests with token injection and timeout
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAuthToken();
  const sessionId = getOrCreateSessionId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-session-id': sessionId,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: json.message || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data: json.data !== undefined ? json.data : json,
    };
  } catch (error: any) {
    // Graceful offline fallback
    console.warn(`[VELORA API] Offline or unreachable endpoint: ${endpoint}`, error.message);
    return {
      success: false,
      message: 'Could not connect to atelier backend server. Falling back to local offline mode.',
    };
  }
}

// ==========================================
// 1. PRODUCTS API
// ==========================================

export interface ProductFilters {
  category?: string;
  department?: string;
  size?: string;
  color?: string;
  priceRange?: string;
  sort?: string;
  search?: string;
}

export const fetchProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
  const queryParams = new URLSearchParams();
  if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
  if (filters.department && filters.department !== 'all') queryParams.append('department', filters.department);
  if (filters.size && filters.size !== 'all') queryParams.append('size', filters.size);
  if (filters.color && filters.color !== 'all') queryParams.append('color', filters.color);
  if (filters.sort) queryParams.append('sort', filters.sort);
  if (filters.search) queryParams.append('search', filters.search);

  if (filters.priceRange === 'under-10000') {
    queryParams.append('maxPrice', '9999');
  } else if (filters.priceRange === '10000-20000') {
    queryParams.append('minPrice', '10000');
    queryParams.append('maxPrice', '20000');
  } else if (filters.priceRange === 'above-20000') {
    queryParams.append('minPrice', '20001');
  }

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
  const res = await apiRequest<Product[]>(endpoint);

  if (res.success && Array.isArray(res.data)) {
    return res.data;
  }

  // Fallback to local PRODUCTS if backend is offline
  return PRODUCTS;
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const res = await apiRequest<Product>(`/products/${slug}`);
  if (res.success && res.data) {
    return res.data;
  }
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
};

// ==========================================
// 2. AUTHENTICATION API
// ==========================================

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
    tier: string;
  };
}

export const loginUserApi = async (email: string, password: string): Promise<{
  success: boolean;
  user?: AuthResponse['user'];
  message?: string;
}> => {
  const res = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (res.success && res.data?.token) {
    setAuthToken(res.data.token);
    return { success: true, user: res.data.user };
  }

  return { success: false, message: res.message || 'Login failed' };
};

export const registerUserApi = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<{
  success: boolean;
  user?: AuthResponse['user'];
  message?: string;
}> => {
  const res = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (res.success && res.data?.token) {
    setAuthToken(res.data.token);
    return { success: true, user: res.data.user };
  }

  return { success: false, message: res.message || 'Registration failed' };
};

export const fetchCurrentUserApi = async (): Promise<AuthResponse['user'] | null> => {
  const token = getAuthToken();
  if (!token) return null;

  const res = await apiRequest<{ user: AuthResponse['user'] }>('/auth/me');
  if (res.success && res.data?.user) {
    return res.data.user;
  }
  return null;
};

// ==========================================
// 3. ORDERS & CHECKOUT API
// ==========================================

export interface CreateOrderPayload {
  items: Array<{
    productId: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  paymentMethod: string;
  giftNote?: string;
  promoCode?: string;
}

export const createOrderApi = async (
  payload: CreateOrderPayload
): Promise<{ success: boolean; order?: Order; message?: string }> => {
  const res = await apiRequest<{ order: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.success && res.data?.order) {
    return { success: true, order: res.data.order };
  }

  return { success: false, message: res.message || 'Failed to place order' };
};

export const fetchMyOrdersApi = async (): Promise<Order[]> => {
  const res = await apiRequest<Order[]>('/orders/my-orders');
  if (res.success && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
};

export const validatePromoApi = async (
  code: string,
  cartTotal: number
): Promise<{ valid: boolean; discount: number; message: string }> => {
  const res = await apiRequest<{ discount: number; message: string }>('/orders/validate-promo', {
    method: 'POST',
    body: JSON.stringify({ code, cartTotal }),
  });

  if (res.success && res.data) {
    return { valid: true, discount: res.data.discount, message: res.data.message };
  }

  return { valid: false, discount: 0, message: res.message || 'Invalid promo code' };
};

// ==========================================
// 4. CART & WISHLIST SYNC API
// ==========================================

export const syncCartApi = async (cart: CartItem[]): Promise<void> => {
  const payload = cart.map((item) => ({
    productId: item.product.id,
    selectedColor: item.selectedColor,
    selectedSize: item.selectedSize,
    quantity: item.quantity,
  }));

  await apiRequest('/cart/sync', {
    method: 'POST',
    body: JSON.stringify({ items: payload }),
  });
};

export const toggleWishlistApi = async (productId: string): Promise<string[] | null> => {
  const res = await apiRequest<{ productIds: string[] }>('/wishlist/toggle', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });

  if (res.success && res.data?.productIds) {
    return res.data.productIds;
  }
  return null;
};
