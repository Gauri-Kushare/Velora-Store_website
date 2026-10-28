import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { Product, Order } from '../types/store';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    !supabaseUrl.includes('your-project')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =========================================================================
// Supabase Authentication Services
// =========================================================================

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    tier?: string;
  };
  message?: string;
}

export const signUpWithSupabase = async (
  email: string,
  password: string,
  metadata: { firstName: string; lastName: string; phone?: string }
): Promise<AuthResponse> => {
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase credentials not configured in environment.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.firstName,
          last_name: metadata.lastName,
          phone: metadata.phone || '',
          tier: 'Atelier Member',
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: 'Registration failed. No user returned.' };
    }

    // Save profile to public.users table if schema exists
    try {
      await supabase.from('users').upsert({
        id: data.user.id,
        email: data.user.email,
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        phone: metadata.phone || '',
        tier: 'Atelier Member',
      });
    } catch {
      // Ignore if table schema not initialized
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || email,
        firstName: metadata.firstName,
        lastName: metadata.lastName,
        phone: metadata.phone,
        tier: 'Atelier Member',
      },
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Supabase authentication failed.' };
  }
};

export const signInWithSupabase = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase credentials not configured in environment.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: 'Invalid credentials.' };
    }

    const meta = data.user.user_metadata || {};
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || email,
        firstName: meta.first_name || email.split('@')[0],
        lastName: meta.last_name || '',
        phone: meta.phone || '',
        tier: meta.tier || 'Atelier Member',
      },
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Supabase login failed.' };
  }
};

export const signOutWithSupabase = async (): Promise<void> => {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error signing out of Supabase:', e);
    }
  }
};

export const getCurrentSupabaseUser = async (): Promise<AuthResponse['user'] | null> => {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const meta = data.user.user_metadata || {};
    return {
      id: data.user.id,
      email: data.user.email || '',
      firstName: meta.first_name || '',
      lastName: meta.last_name || '',
      phone: meta.phone || '',
      tier: meta.tier || 'Atelier Member',
    };
  } catch {
    return null;
  }
};

// =========================================================================
// Supabase Database Services (Products & Orders)
// =========================================================================

export const fetchProductsFromSupabase = async (): Promise<Product[] | null> => {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map((item: any) => {
      const parsedSizes = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes || ['XS', 'S', 'M', 'L'];
      const parsedSizeVariants = item.size_variants
        ? typeof item.size_variants === 'string'
          ? JSON.parse(item.size_variants)
          : item.size_variants
        : parsedSizes.map((s: string) => ({ size: s, inStock: true, stockCount: 10 }));

      return {
        id: item.id,
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle || '',
        description: item.description || '',
        material: item.material || '',
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        badge: item.badge || null,
        category: item.category,
        department: item.department,
        images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images,
        colors: typeof item.colors === 'string' ? JSON.parse(item.colors) : item.colors || [],
        sizes: parsedSizes,
        sizeVariants: parsedSizeVariants,
        inventoryStatus: (item.inventory_status as any) || 'in_stock',
        details: typeof item.details === 'string' ? JSON.parse(item.details) : item.details || [],
        care: typeof item.care === 'string' ? JSON.parse(item.care) : item.care || [],
        delivery: item.delivery || 'Complimentary white-glove courier delivery on this piece.',
        stockCount: item.stock_count || 15,
        isFeatured: Boolean(item.is_featured),
      };
    });
  } catch (e) {
    console.warn('Could not read products from Supabase:', e);
    return null;
  }
};

export const saveOrderToSupabase = async (order: Order, userId?: string): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      user_id: userId || null,
      customer_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim(),
      customer_email: order.shippingAddress.email,
      customer_phone: order.shippingAddress.phone,
      shipping_address: order.shippingAddress,
      delivery_method: order.deliveryMethod,
      shipping_fee: order.shippingFee,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
      payment_status: 'Paid',
      gift_note: order.giftNote,
      items: order.items,
    });

    if (error) {
      console.warn('Supabase order insert error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to insert order to Supabase:', e);
    return false;
  }
};

export const fetchOrdersFromSupabase = async (userId: string): Promise<Order[] | null> => {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      date: new Date(item.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      items: item.items || [],
      subtotal: item.subtotal,
      shippingFee: item.shipping_fee,
      discount: item.discount,
      total: item.total,
      status: item.status,
      shippingAddress: item.shipping_address,
      deliveryMethod: item.delivery_method,
      paymentMethod: item.payment_method,
      giftNote: item.gift_note,
    }));
  } catch (e) {
    console.warn('Failed to fetch orders from Supabase:', e);
    return null;
  }
};
