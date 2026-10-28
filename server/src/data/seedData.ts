export interface ProductData {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  material: string;
  price: number;
  originalPrice?: number;
  badge?: 'BESTSELLER' | 'NEW' | 'LIMITED' | null;
  category: string;
  department: string;
  inventoryStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount: number;
  images: {
    main: string;
    hover?: string;
    back?: string;
    detail?: string;
    gallery?: string[];
  };
  colors: Array<{
    name: string;
    hex: string;
    inStock: boolean;
    imagePreview?: string;
  }>;
  sizes: string[];
  sizeVariants: Array<{
    size: string;
    inStock: boolean;
    stockCount: number;
  }>;
  details: string[];
  care: string[];
  delivery: string;
  isFeatured?: boolean;
  pairingProductIds?: string[];
}

export const SEED_PRODUCTS: ProductData[] = [
  {
    id: 'silk-shirt',
    slug: 'the-silk-shirt',
    name: 'The Silk Shirt',
    subtitle: 'Fluid silk · Ivory',
    price: 6900,
    originalPrice: 8900,
    badge: 'BESTSELLER',
    category: 'Shirts',
    department: 'Clothing',
    images: {
      main: '/images/product-silk-shirt-main.jpg',
      hover: '/images/product-silk-shirt.jpg',
      back: '/images/product-silk-shirt-back.jpg',
      detail: '/images/product-silk-shirt-fabric.jpg',
      gallery: [
        '/images/product-silk-shirt-main.jpg',
        '/images/product-silk-shirt-back.jpg',
        '/images/product-silk-shirt-fabric.jpg',
        '/images/category-essentials.jpg',
      ],
    },
    colors: [
      { name: 'Ivory', hex: '#F7F4EE', inStock: true },
      { name: 'Sand', hex: '#D1C4AF', inStock: true },
      { name: 'Onyx', hex: '#20201D', inStock: true },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeVariants: [
      { size: 'XS', inStock: true, stockCount: 6 },
      { size: 'S', inStock: true, stockCount: 12 },
      { size: 'M', inStock: true, stockCount: 8 },
      { size: 'L', inStock: true, stockCount: 4 },
      { size: 'XL', inStock: false, stockCount: 0 },
    ],
    inventoryStatus: 'in_stock',
    stockCount: 30,
    description: "An effortless silhouette in luminous, fluid silk. Softly dropped shoulders and a generous cut make this the shirt you'll reach for, again and again.",
    material: '100% Grade 6A Mulberry Silk (19 Momme Crepe de Chine)',
    details: [
      '100% mulberry silk (19 momme)',
      'Natural mother-of-pearl buttons sourced responsibly',
      'French seams throughout for clean interior finish and longevity',
      'Soft curved hemline designed for both tucked and untucked styling',
      'Relaxed silhouette with subtle back yoke pleat',
    ],
    care: [
      'Specialist dry clean recommended',
      'Gentle cold hand wash using pH-neutral silk detergent',
      'Steam gently on reverse side; never press directly onto damp silk',
      'Store hanging away from direct sunlight',
    ],
    delivery: 'Dispatch in 1–2 business days. Complimentary worldwide shipping over ₹10,000.',
    isFeatured: true,
    pairingProductIds: ['tailored-trouser', 'everyday-blazer', 'shoulder-bag', 'cashmere-crew'],
  },
  {
    id: 'tailored-trouser',
    slug: 'the-tailored-trouser',
    name: 'The Tailored Trouser',
    subtitle: 'Italian wool blend · Sand',
    price: 8400,
    badge: null,
    category: 'Trousers',
    department: 'Tailoring',
    images: {
      main: '/images/product-tailored-trouser.jpg',
      hover: '/images/category-essentials.jpg',
      gallery: [
        '/images/product-tailored-trouser.jpg',
        '/images/category-essentials.jpg',
        '/images/product-silk-shirt-main.jpg',
      ],
    },
    colors: [
      { name: 'Sand', hex: '#C8B89F', inStock: true },
      { name: 'Ivory', hex: '#FAF8F5', inStock: true },
      { name: 'Onyx', hex: '#20201D', inStock: true },
    ],
    sizes: ['26', '28', '30', '32', '34'],
    sizeVariants: [
      { size: '26', inStock: true, stockCount: 5 },
      { size: '28', inStock: true, stockCount: 9 },
      { size: '30', inStock: true, stockCount: 7 },
      { size: '32', inStock: true, stockCount: 3 },
      { size: '34', inStock: false, stockCount: 0 },
    ],
    inventoryStatus: 'in_stock',
    stockCount: 24,
    description: 'Cut with an elongated wide leg and subtle front pleats. Designed to pool gently over loafers or sneakers while retaining a clean, architectural line.',
    material: '88% Italian Virgin Wool, 10% Silk, 2% Elastane',
    details: [
      '88% Italian virgin wool, 10% silk, 2% elastane',
      'Extended tab closure with concealed horn button',
      'Deep functional side slash pockets and rear besom pockets',
      'Generous 4cm hem allowance for custom alteration',
    ],
    care: [
      'Specialist dry clean only',
      'Steam between wears to naturally release wrinkles and refresh fibers',
      'Hang from cuffs using a wooden clamp trouser hanger',
    ],
    delivery: 'Dispatch in 1–2 business days. Complimentary worldwide shipping over ₹10,000.',
    isFeatured: true,
    pairingProductIds: ['silk-shirt', 'everyday-blazer', 'shoulder-bag', 'wool-overcoat'],
  },
  {
    id: 'everyday-blazer',
    slug: 'the-everyday-blazer',
    name: 'The Everyday Blazer',
    subtitle: 'Italian wool blend · Sand',
    price: 12900,
    originalPrice: 15500,
    badge: 'NEW',
    category: 'Tailoring',
    department: 'Tailoring',
    images: {
      main: '/images/product-everyday-blazer.jpg',
      hover: '/images/category-tailoring.jpg',
      gallery: [
        '/images/product-everyday-blazer.jpg',
        '/images/category-tailoring.jpg',
        '/images/hero-model.jpg',
      ],
    },
    colors: [
      { name: 'Sand', hex: '#B9A58A', inStock: true },
      { name: 'Ivory', hex: '#FAF8F5', inStock: true },
      { name: 'Onyx', hex: '#20201D', inStock: true },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    sizeVariants: [
      { size: 'XS', inStock: true, stockCount: 4 },
      { size: 'S', inStock: true, stockCount: 8 },
      { size: 'M', inStock: true, stockCount: 5 },
      { size: 'L', inStock: true, stockCount: 2 },
    ],
    inventoryStatus: 'low_stock',
    stockCount: 19,
    description: 'An unstructured single-breasted blazer with relaxed shoulders. Built with just enough internal canvas to drape effortlessly without feeling rigid.',
    material: '92% Italian Tropical Wool, 8% Cashmere, Cupro Lining',
    details: [
      'Italian tropical wool blend with featherweight drape',
      '100% Bemberg cupro lining for smooth friction-free layering',
      'Natural corozo nut buttons dyed to match fabric',
      'Internal passport and phone welt pocket',
    ],
    care: [
      'Dry clean only with reputable specialist',
      'Brush regularly with natural horsehair garment brush',
      'Store inside included breathable canvas garment bag',
    ],
    delivery: 'Dispatch in 1–2 business days. Complimentary worldwide shipping over ₹10,000.',
    isFeatured: true,
    pairingProductIds: ['tailored-trouser', 'silk-shirt', 'shoulder-bag', 'column-dress'],
  },
  {
    id: 'column-dress',
    slug: 'the-column-dress',
    name: 'The Column Dress',
    subtitle: 'Fluid crepe · Onyx',
    price: 9800,
    badge: null,
    category: 'Dresses',
    department: 'Dresses',
    images: {
      main: '/images/product-column-dress.jpg',
      hover: '/images/editorial-philosophy.jpg',
      gallery: [
        '/images/product-column-dress.jpg',
        '/images/editorial-philosophy.jpg',
        '/images/product-shoulder-bag.jpg',
      ],
    },
    colors: [
      { name: 'Onyx', hex: '#20201D', inStock: true },
      { name: 'Ivory', hex: '#FAF8F5', inStock: true },
      { name: 'Sand', hex: '#C8B89F', inStock: true },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    sizeVariants: [
      { size: 'XS', inStock: true, stockCount: 6 },
      { size: 'S', inStock: true, stockCount: 7 },
      { size: 'M', inStock: true, stockCount: 9 },
      { size: 'L', inStock: true, stockCount: 3 },
    ],
    inventoryStatus: 'in_stock',
    stockCount: 25,
    description: 'A floor-skimming column silhouette rendered in weighted crepe that holds its clean shape through day and evening. High boat neck and discreet back slit.',
    material: '74% Acetate, 26% Sustainable Viscose Heavy Crepe',
    details: [
      'Heavyweight matte crepe with fluid, liquid drape',
      'Concealed invisible center-back zipper with hook-and-eye closure',
      'Clean bias-bound armholes and neckline',
      'Reinforced rear walking slit allows natural stride',
    ],
    care: [
      'Dry clean recommended or gentle cold hand wash',
      'Do not wring or twist; press water out with dry towel',
      'Cool iron on reverse side with damp pressing cloth',
    ],
    delivery: 'Dispatch in 1–2 business days. Complimentary worldwide shipping over ₹10,000.',
    isFeatured: true,
    pairingProductIds: ['everyday-blazer', 'shoulder-bag', 'wool-overcoat'],
  },
  {
    id: 'cashmere-crew',
    slug: 'the-cashmere-crew',
    name: 'The Cashmere Crew',
    subtitle: 'Grade-A cashmere · Oatmeal',
    price: 14500,
    badge: 'NEW',
    category: 'Knitwear',
    department: 'Knitwear',
    images: {
      main: '/images/product-cashmere-crew.jpg',
      hover: '/images/journal-wardrobe.jpg',
      gallery: [
        '/images/product-cashmere-crew.jpg',
        '/images/journal-wardrobe.jpg',
      ],
    },
    colors: [
      { name: 'Oatmeal', hex: '#E2DACB', inStock: true },
      { name: 'Charcoal', hex: '#20201D', inStock: true },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    sizeVariants: [
      { size: 'XS', inStock: true, stockCount: 3 },
      { size: 'S', inStock: true, stockCount: 6 },
      { size: 'M', inStock: true, stockCount: 4 },
      { size: 'L', inStock: false, stockCount: 0 },
    ],
    inventoryStatus: 'low_stock',
    stockCount: 13,
    description: 'Spun from long-staple Inner Mongolian cashmere fibers that become softer with every wear. Finished with ribbed cuffs and a reinforced crew collar.',
    material: '100% Pure Grade-A Long-Staple Cashmere (2-ply, 12 gauge)',
    details: [
      '100% pure Grade-A cashmere from Inner Mongolia',
      '2-ply 12-gauge tight knit minimizes pilling',
      'Seamless tubular cuffs and hem that retain memory',
      'Relaxed body with slightly cropped contemporary length',
    ],
    care: [
      'Gentle hand wash in cold water using delicate wool shampoo',
      'Dry flat on towel away from artificial heat',
      'Use a cedar ball and cashmere comb to maintain surface loft',
    ],
    delivery: 'Dispatch in 1–2 business days. Complimentary worldwide shipping over ₹10,000.',
    isFeatured: false,
    pairingProductIds: ['tailored-trouser', 'knit-midi-skirt', 'wool-overcoat'],
  },
  {
    id: 'shoulder-bag',
    slug: 'the-form-shoulder-bag',
    name: 'The Form Shoulder Bag',
    subtitle: 'Vegetable-tanned leather · Espresso',
    price: 16800,
    badge: 'LIMITED',
    category: 'Accessories',
    department: 'Accessories',
    images: {
      main: '/images/product-shoulder-bag.jpg',
      hover: '/images/category-finishing.jpg',
      gallery: [
        '/images/product-shoulder-bag.jpg',
        '/images/category-finishing.jpg',
      ],
    },
    colors: [
      { name: 'Espresso', hex: '#3D2E24', inStock: true },
      { name: 'Cognac', hex: '#7E4B28', inStock: true },
      { name: 'Noir', hex: '#1A1A1A', inStock: true },
    ],
    sizes: ['One Size'],
    sizeVariants: [
      { size: 'One Size', inStock: true, stockCount: 8 },
    ],
    inventoryStatus: 'in_stock',
    stockCount: 8,
    description: 'Sculptural asymmetric flap bag with hand-painted edge finishing and an adjustable crossbody or shoulder strap.',
    material: '100% Full Grain Tuscan Calfskin, Solid Brushed Brass',
    details: [
      'Full grain vegetable-tanned Tuscan calf leather',
      'Solid brushed brass bespoke hardware',
      'Internal split-suede leather slip pocket and key lanyard',
      'Magnetic flap closure with silent dampener',
    ],
    care: [
      'Store in provided unbleached cotton dust bag',
      'Treat annually with natural beeswax or leather conditioning cream',
      'Wipe moisture immediately with soft microfiber cloth',
    ],
    delivery: 'Dispatch in 1–2 business days. Complimentary worldwide shipping over ₹10,000.',
    isFeatured: false,
    pairingProductIds: ['silk-shirt', 'everyday-blazer', 'tailored-trouser', 'wool-overcoat'],
  },
  {
    id: 'knit-midi-skirt',
    slug: 'the-knit-midi-skirt',
    name: 'The Knit Midi Skirt',
    subtitle: 'Ribbed organic cotton · Dune',
    price: 7800,
    badge: null,
    category: 'Skirts',
    department: 'Clothing',
    images: {
      main: '/images/product-knit-skirt.jpg',
      hover: '/images/category-essentials.jpg',
      gallery: [
        '/images/product-knit-skirt.jpg',
        '/images/category-essentials.jpg',
      ],
    },
    colors: [
      { name: 'Dune', hex: '#D1C4AF', inStock: true },
      { name: 'Black', hex: '#20201D', inStock: true },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    sizeVariants: [
      { size: 'XS', inStock: true, stockCount: 5 },
      { size: 'S', inStock: true, stockCount: 8 },
      { size: 'M', inStock: true, stockCount: 6 },
      { size: 'L', inStock: true, stockCount: 4 },
    ],
    inventoryStatus: 'in_stock',
    stockCount: 23,
    description: 'A sculpting ribbed midi skirt that balances comfortable stretch with structured elegance.',
    material: '95% Certified Organic Combed Cotton, 5% Elastane',
    details: [
      '100% organic combed cotton in heavy ribbed knit',
      'Wide comfortable internal elasticated waistband',
      'Ottoman stitch that resists bagging at knees',
      'Ankle-brushing length with clean edge',
    ],
    care: [
      'Machine wash cold on delicate cycle inside wash bag',
      'Dry flat in shade; do not tumble dry',
      'Steam gently on low setting',
    ],
    delivery: 'Dispatch in 1–2 business days.',
    isFeatured: false,
    pairingProductIds: ['silk-shirt', 'cashmere-crew', 'shoulder-bag'],
  },
  {
    id: 'wool-overcoat',
    slug: 'the-wool-overcoat',
    name: 'The Wool Overcoat',
    subtitle: 'Double-faced wool · Camel',
    price: 24000,
    originalPrice: 28000,
    badge: null,
    category: 'Outerwear',
    department: 'Outerwear',
    images: {
      main: '/images/product-wool-overcoat.jpg',
      hover: '/images/hero-model.jpg',
      gallery: [
        '/images/product-wool-overcoat.jpg',
        '/images/hero-model.jpg',
      ],
    },
    colors: [
      { name: 'Camel', hex: '#B58A58', inStock: true },
      { name: 'Charcoal', hex: '#20201D', inStock: true },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    sizeVariants: [
      { size: 'XS', inStock: true, stockCount: 2 },
      { size: 'S', inStock: true, stockCount: 4 },
      { size: 'M', inStock: true, stockCount: 3 },
      { size: 'L', inStock: false, stockCount: 0 },
    ],
    inventoryStatus: 'low_stock',
    stockCount: 9,
    description: 'Hand-finished double-faced wool overcoat with an unlined interior and notched lapels. Tailored for sweeping drape and deep warmth.',
    material: '90% Australian Virgin Merino Wool, 10% Cashmere',
    details: [
      'Hand-stitched double-faced split seams with invisible threads',
      'Unlined construction for fluid natural drape',
      'Deep ergonomic welt pockets lined with warm brushed cotton',
      'Detachable self-tie waist belt with horn buckle',
    ],
    care: [
      'Specialist dry clean only',
      'Hang on broad contoured wooden coat hanger',
      'Air out naturally after wearing in damp weather',
    ],
    delivery: 'Complimentary white-glove courier delivery on this piece.',
    isFeatured: false,
    pairingProductIds: ['silk-shirt', 'tailored-trouser', 'cashmere-crew', 'column-dress'],
  },
];

export const SEED_PROMOTIONS = [
  {
    code: 'VELORA10',
    discountPercent: 10,
    discountAmount: null,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    code: 'WELCOME10',
    discountPercent: 10,
    discountAmount: null,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    code: 'ATELIER',
    discountPercent: null,
    discountAmount: 2000,
    minOrderAmount: 5000,
    isActive: true,
  },
];
