import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, ColorOption, PageView, Order } from '../types/store';
import { PRODUCTS, STORE_CURRENCY } from '../data/storeData';
import {
  fetchProducts as fetchProductsApi,
  loginUserApi,
  registerUserApi,
  createOrderApi,
  syncCartApi,
  toggleWishlistApi,
  removeAuthToken,
  fetchCurrentUserApi,
  fetchMyOrdersApi,
} from '../services/api';
import {
  isSupabaseConfigured,
  signInWithSupabase,
  signUpWithSupabase,
  signOutWithSupabase,
  getCurrentSupabaseUser,
  saveOrderToSupabase,
  fetchOrdersFromSupabase,
  fetchProductsFromSupabase,
} from '../services/supabase';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  phone?: string;
  tier?: string;
}

interface StoreContextType {
  // Navigation & Page State
  currentPage: PageView;
  currentProductSlug: string | null;
  selectedCategory: string | null;
  navigateTo: (page: PageView, param?: string) => void;

  // Products
  products: Product[];

  // Cart State & Actions
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  cartBadgeBump: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, selectedColor?: ColorOption, selectedSize?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist State & Actions
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  moveToBagFromWishlist: (product: Product, selectedColor?: ColorOption, selectedSize?: string) => void;

  // Orders & Checkout
  orders: Order[];
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => Order;

  // User Profile
  user: UserProfile;
  loginUser: (email: string, passwordOrName?: string, name?: string) => Promise<boolean>;
  registerUser: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<boolean>;
  logoutUser: () => void;

  // Drawers & Modals
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;

  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;

  // Toast
  toast: { message: string; visible: boolean };
  showToast: (message: string) => void;

  // Currency
  currency: CurrencyInfo;
  setCurrency: (c: CurrencyInfo) => void;
  formatPrice: (inrAmount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'velora_cart_v2';
const WISHLIST_STORAGE_KEY = 'velora_wishlist_v1';
const ORDERS_STORAGE_KEY = 'velora_orders_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from LocalStorage - Starts completely empty (0 items) by default
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      // Clear legacy pre-filled test cart from previous demo sessions
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('velora_cart_v1');
      }

      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify valid cart items with positive quantity
          const validItems: CartItem[] = parsed.filter(
            (item: any) =>
              item &&
              typeof item.id === 'string' &&
              item.product &&
              typeof item.product.id === 'string' &&
              typeof item.quantity === 'number' &&
              item.quantity > 0
          );
          if (validItems.length > 0) return validItems;
        }
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    // New user starts with completely empty cart (0 items)
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read wishlist from localStorage', e);
    }
    return [];
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read orders from localStorage', e);
    }
    return [];
  });

  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // User Profile (logged-out by default until signed in)
  const [user, setUser] = useState<UserProfile>(() => {
    return {
      name: '',
      email: '',
      isLoggedIn: false,
    };
  });

  // Products State (initialized from local catalog, enriched by backend API)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Initial Sync from Supabase or Backend API (Products, Auth Session, Orders)
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live product catalog
    if (isSupabaseConfigured()) {
      fetchProductsFromSupabase()
        .then((sbProducts) => {
          if (isMounted && sbProducts && sbProducts.length > 0) {
            setProducts(sbProducts);
          } else {
            fetchProductsApi().then((apiProds) => {
              if (isMounted && apiProds && apiProds.length > 0) setProducts(apiProds);
            });
          }
        })
        .catch(() => {});
    } else {
      fetchProductsApi()
        .then((apiProds) => {
          if (isMounted && apiProds && apiProds.length > 0) {
            setProducts(apiProds);
          }
        })
        .catch(() => {
          // Keeps local PRODUCTS fallback
        });
    }

    // 2. Validate session and restore user
    if (isSupabaseConfigured()) {
      getCurrentSupabaseUser()
        .then((sbUser) => {
          if (isMounted && sbUser) {
            setUser({
              name: `${sbUser.firstName} ${sbUser.lastName}`.trim() || sbUser.email.split('@')[0],
              email: sbUser.email,
              isLoggedIn: true,
              phone: sbUser.phone || '',
              tier: sbUser.tier || 'Atelier Member',
            });
            fetchOrdersFromSupabase(sbUser.id).then((sbOrders) => {
              if (isMounted && sbOrders && sbOrders.length > 0) {
                setOrders(sbOrders);
              }
            });
          } else {
            // Check Express backend JWT
            fetchCurrentUserApi()
              .then((profile) => {
                if (isMounted && profile) {
                  setUser({
                    name: `${profile.firstName} ${profile.lastName}`.trim() || profile.email.split('@')[0],
                    email: profile.email,
                    isLoggedIn: true,
                    phone: profile.phone || '',
                    tier: profile.tier || 'Atelier Member',
                  });
                  fetchMyOrdersApi().then((apiOrders) => {
                    if (isMounted && apiOrders && apiOrders.length > 0) setOrders(apiOrders);
                  });
                }
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    } else {
      fetchCurrentUserApi()
        .then((profile) => {
          if (isMounted && profile) {
            setUser({
              name: `${profile.firstName} ${profile.lastName}`.trim() || profile.email.split('@')[0],
              email: profile.email,
              isLoggedIn: true,
              phone: profile.phone || '',
              tier: profile.tier || 'Atelier Member',
            });
            fetchMyOrdersApi()
              .then((apiOrders) => {
                if (isMounted && apiOrders && apiOrders.length > 0) {
                  setOrders(apiOrders);
                }
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentProductSlug, setCurrentProductSlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // UI Drawer & Modal State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartBadgeBump, setCartBadgeBump] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const [currency, setCurrency] = useState<CurrencyInfo>({
    code: 'INR',
    symbol: '₹',
    rate: 1,
  });

  // Sync Cart with Backend API when user is logged in
  useEffect(() => {
    if (user.isLoggedIn) {
      syncCartApi(cart).catch(() => {});
    }
  }, [cart, user.isLoggedIn]);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Persist Orders
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // URL Hash Routing Listener
  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#', '');
      const [path, queryString] = fullHash.split('?');
      const params = new URLSearchParams(queryString || '');

      if (!path || path === 'home') {
        setCurrentPage('home');
        setCurrentProductSlug(null);
      } else if (path.startsWith('product/')) {
        const slug = path.replace('product/', '');
        setCurrentProductSlug(slug);
        setCurrentPage('pdp');
      } else if (path === 'shop' || path === 'collections') {
        setCurrentPage('shop');
        const cat = params.get('category');
        setSelectedCategory(cat || null);
      } else if (path === 'cart') {
        setCurrentPage('cart');
      } else if (path === 'wishlist') {
        setCurrentPage('wishlist');
      } else if (path === 'checkout') {
        setCurrentPage('checkout');
      } else if (path === 'account' || path === 'orders' || path === 'profile') {
        setCurrentPage('account');
      } else if (path === 'about' || path === 'philosophy' || path === 'story' || path === 'sustainability') {
        setCurrentPage('about');
      } else if (path === 'contact' || path === 'concierge') {
        setCurrentPage('contact');
      } else if (path === 'faq') {
        setCurrentPage('faq');
      } else if (path === 'shipping' || path === 'shipping-returns' || path === 'returns') {
        setCurrentPage('shipping-returns');
      } else if (path === 'privacy' || path === 'privacy-policy') {
        setCurrentPage('privacy');
      } else if (path === 'terms' || path === 'terms-conditions') {
        setCurrentPage('terms');
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((page: PageView, param?: string) => {
    if (page === 'home') {
      window.location.hash = '#home';
      setCurrentPage('home');
      setCurrentProductSlug(null);
    } else if (page === 'shop') {
      if (param) {
        window.location.hash = `#shop?category=${encodeURIComponent(param)}`;
        setSelectedCategory(param);
      } else {
        window.location.hash = '#shop';
        setSelectedCategory(null);
      }
      setCurrentPage('shop');
    } else if (page === 'pdp' && param) {
      window.location.hash = `#product/${param}`;
      setCurrentProductSlug(param);
      setCurrentPage('pdp');
    } else if (page === 'cart') {
      window.location.hash = '#cart';
      setCurrentPage('cart');
    } else if (page === 'wishlist') {
      window.location.hash = '#wishlist';
      setCurrentPage('wishlist');
    } else if (page === 'checkout') {
      window.location.hash = '#checkout';
      setCurrentPage('checkout');
    } else if (page === 'account') {
      window.location.hash = '#account';
      setCurrentPage('account');
    } else if (page === 'about') {
      window.location.hash = '#about';
      setCurrentPage('about');
    } else if (page === 'contact') {
      window.location.hash = '#contact';
      setCurrentPage('contact');
    } else if (page === 'faq') {
      window.location.hash = '#faq';
      setCurrentPage('faq');
    } else if (page === 'shipping-returns') {
      window.location.hash = '#shipping-returns';
      setCurrentPage('shipping-returns');
    } else if (page === 'privacy') {
      window.location.hash = '#privacy';
      setCurrentPage('privacy');
    } else if (page === 'terms') {
      window.location.hash = '#terms';
      setCurrentPage('terms');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const triggerBadgeBump = () => {
    setCartBadgeBump(true);
    setTimeout(() => setCartBadgeBump(false), 500);
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const addToCart = (
    product: Product,
    selectedColor: ColorOption = product.colors[0],
    selectedSize: string = product.sizes[0] || 'M',
    quantity: number = 1
  ) => {
    const itemId = `${product.id}-${selectedColor.name}-${selectedSize}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, selectedColor, selectedSize, quantity }];
    });
    triggerBadgeBump();
    showToast(`Added "${product.name}" (${selectedColor.name}, ${selectedSize}) to bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    triggerBadgeBump();
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
    triggerBadgeBump();
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem('velora_cart_v1');
    } catch (e) {
      console.warn('Could not clear cart in localStorage', e);
    }
    triggerBadgeBump();
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `VEL-${randomNum}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: dateFormatted,
      status: 'Confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    // Async sync with Supabase and Express backend
    if (isSupabaseConfigured()) {
      saveOrderToSupabase(newOrder, user.email).catch((err) => {
        console.info('Supabase order sync:', err);
      });
    }

    createOrderApi(newOrder).catch((err) => {
      console.info('Backend order sync stored locally:', err.message);
    });

    return newOrder;
  };

  const loginUser = async (email: string, passwordOrName?: string, name?: string): Promise<boolean> => {
    const isLikelyPassword = passwordOrName && passwordOrName.length >= 6;

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured() && isLikelyPassword) {
      const sbResult = await signInWithSupabase(email, passwordOrName);
      if (sbResult.success && sbResult.user) {
        setUser({
          email: sbResult.user.email,
          name: `${sbResult.user.firstName} ${sbResult.user.lastName}`.trim() || email.split('@')[0],
          isLoggedIn: true,
          phone: sbResult.user.phone,
          tier: sbResult.user.tier || 'Atelier Member',
        });
        showToast(`Welcome back, ${sbResult.user.firstName || email.split('@')[0]}`);
        fetchOrdersFromSupabase(sbResult.user.id).then((sbOrders) => {
          if (sbOrders && sbOrders.length > 0) setOrders(sbOrders);
        });
        return true;
      }
    }

    // 2. Try Node/Express API
    if (isLikelyPassword) {
      const result = await loginUserApi(email, passwordOrName);
      if (result.success && result.user) {
        setUser({
          email: result.user.email,
          name: `${result.user.firstName} ${result.user.lastName}`.trim() || email.split('@')[0],
          isLoggedIn: true,
          phone: result.user.phone,
          tier: result.user.tier || 'Atelier Member',
        });
        showToast(`Welcome back, ${result.user.firstName || email.split('@')[0]}`);
        
        // Refresh orders from backend
        fetchMyOrdersApi()
          .then((apiOrders) => {
            if (apiOrders && apiOrders.length > 0) {
              setOrders(apiOrders);
            }
          })
          .catch(() => {});
        return true;
      }
    }

    // 3. Fallback local sign-in (offline / mock)
    const displayName = name || (passwordOrName && !isLikelyPassword ? passwordOrName : email.split('@')[0]);
    setUser({
      email,
      name: displayName,
      isLoggedIn: true,
      tier: 'Atelier Member',
    });
    showToast(`Welcome back, ${displayName}`);
    return true;
  };

  const registerUser = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<boolean> => {
    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured()) {
      const sbResult = await signUpWithSupabase(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      if (sbResult.success && sbResult.user) {
        setUser({
          email: sbResult.user.email,
          name: `${sbResult.user.firstName} ${sbResult.user.lastName}`.trim(),
          isLoggedIn: true,
          phone: sbResult.user.phone,
          tier: 'Atelier Member',
        });
        showToast(`Account registered on Supabase. Welcome, ${sbResult.user.firstName}`);
        return true;
      }
    }

    // 2. Try Node/Express API
    const result = await registerUserApi(data);
    if (result.success && result.user) {
      setUser({
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`.trim(),
        isLoggedIn: true,
        phone: result.user.phone,
        tier: result.user.tier || 'Atelier Member',
      });
      showToast(`Account created. Welcome to VELORA, ${result.user.firstName}`);
      return true;
    }

    // 3. Local fallback
    setUser({
      email: data.email,
      name: `${data.firstName} ${data.lastName}`.trim(),
      isLoggedIn: true,
      phone: data.phone,
      tier: 'Atelier Member',
    });
    showToast(`Account created. Welcome to VELORA, ${data.firstName}`);
    return true;
  };

  const logoutUser = () => {
    signOutWithSupabase().catch(() => {});
    removeAuthToken();
    setUser({
      email: '',
      name: '',
      isLoggedIn: false,
    });
    showToast('Signed out of your VELORA account.');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed piece from wishlist' : 'Saved piece to your personal wishlist');
      return updated;
    });
    toggleWishlistApi(productId).catch(() => {});
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const moveToBagFromWishlist = (
    product: Product,
    selectedColor: ColorOption = product.colors[0],
    selectedSize: string = product.sizes[0] || 'M'
  ) => {
    addToCart(product, selectedColor, selectedSize, 1);
    setWishlist((prev) => prev.filter((id) => id !== product.id));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openSizeGuide = () => setIsSizeGuideOpen(true);
  const closeSizeGuide = () => setIsSizeGuideOpen(false);

  const formatPrice = (inrAmount: number) => {
    if (currency.code === 'USD') {
      const usdAmount = inrAmount * 0.012;
      return `$${Math.round(usdAmount).toLocaleString()}`;
    }
    return `₹${inrAmount.toLocaleString('en-IN')}`;
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        currentProductSlug,
        selectedCategory,
        navigateTo,

        products,

        cart,
        cartCount,
        cartTotal,
        cartBadgeBump,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isWishlisted,
        moveToBagFromWishlist,

        orders,
        lastPlacedOrder,
        setLastPlacedOrder,
        placeOrder,

        user,
        loginUser,
        registerUser,
        logoutUser,

        isMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,

        isSearchOpen,
        openSearch,
        closeSearch,

        quickViewProduct,
        openQuickView,
        closeQuickView,

        isSizeGuideOpen,
        openSizeGuide,
        closeSizeGuide,

        toast,
        showToast,

        currency,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};


export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
