export interface ColorOption {
  name: string;
  hex: string;
  inStock: boolean;
  imagePreview?: string;
}

export interface SizeOption {
  size: string;
  inStock: boolean;
  stockCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  badge?: 'BESTSELLER' | 'NEW' | 'LIMITED' | null;
  category: 'Tailoring' | 'Dresses' | 'Shirts' | 'Knitwear' | 'Outerwear' | 'Accessories' | 'Skirts' | 'Trousers';
  department: 'Clothing' | 'Tailoring' | 'Knitwear' | 'Accessories' | 'Outerwear' | 'Dresses';
  images: {
    main: string;
    hover?: string;
    back?: string;
    detail?: string;
    gallery?: string[];
  };
  colors: ColorOption[];
  sizes: string[];
  sizeVariants: SizeOption[];
  inventoryStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount: number;
  description: string;
  material: string;
  details: string[];
  care: string[];
  delivery: string;
  isFeatured?: boolean;
  pairingProductIds?: string[];
}

export interface CartItem {
  id: string; // unique composite key: productId + color + size
  product: Product;
  selectedColor: ColorOption;
  selectedSize: string;
  quantity: number;
}

export interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  categoryKey?: string;
}

export interface JournalArticle {
  id: string;
  category: string;
  readTime: string;
  title: string;
  image: string;
  link: string;
}

export interface PillarItem {
  number: string;
  title: string;
  description: string;
}

export type PageView =
  | 'home'
  | 'shop'
  | 'pdp'
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'account'
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping-returns'
  | 'privacy'
  | 'terms';

export interface FilterState {
  category: string;
  size: string;
  priceRange: string;
  sort: 'featured' | 'newest' | 'price-asc' | 'price-desc';
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'Confirmed' | 'In Atelier' | 'Dispatched' | 'Delivered';
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  paymentMethod: string;
  giftNote?: string;
}
