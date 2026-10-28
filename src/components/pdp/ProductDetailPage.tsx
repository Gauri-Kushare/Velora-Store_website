import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/storeData';
import { ProductCard } from '../ui/ProductCard';
import { SizeGuideModal } from './SizeGuideModal';
import {
  Heart,
  Plus,
  Minus,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Package,
} from 'lucide-react';
import { ColorOption, Product } from '../../types/store';

interface ProductDetailPageProps {
  productSlug?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productSlug }) => {
  const {
    currentProductSlug,
    navigateTo,
    addToCart,
    formatPrice,
    toggleWishlist,
    isWishlisted,
    openSizeGuide,
  } = useStore();

  const slug = productSlug || currentProductSlug || 'the-silk-shirt';

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];

  // Gallery and options state
  const galleryImages = product.images.gallery || [
    product.images.main,
    product.images.back || product.images.main,
    product.images.detail || product.images.main,
  ];

  const [activeImage, setActiveImage] = useState<string>(product.images.main);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);

  // Accordion states
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isPackagingOpen, setIsPackagingOpen] = useState(false);

  // Update active image when product changes
  useEffect(() => {
    setActiveImage(product.images.main);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0] || 'M');
    setQuantity(1);
  }, [product]);

  const isFavorite = isWishlisted(product.id);

  // Complementary pieces
  const pairingProducts = (product.pairingProductIds || [])
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  // Selected size stock check
  const currentSizeVariant = product.sizeVariants.find((v) => v.size === selectedSize);
  const isSelectedSizeInStock = currentSizeVariant ? currentSizeVariant.inStock : true;

  return (
    <div className="bg-ivory min-h-screen pt-4 sm:pt-6 pb-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-luxury text-charcoal/50 mb-6 sm:mb-8">
          <ol className="flex items-center gap-2">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-charcoal transition-colors">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigateTo('shop')} className="hover:text-charcoal transition-colors">
                Clothing
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => navigateTo('shop', product.department)}
                className="hover:text-charcoal transition-colors"
              >
                {product.category}
              </button>
            </li>
            <li>/</li>
            <li className="text-charcoal font-medium line-clamp-1">{product.name}</li>
          </ol>
        </nav>

        {/* Main Product Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pb-16 border-b border-accent-border">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails Strip */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  aria-label={`View angle ${idx + 1}`}
                  className={`w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-ivory-200 border overflow-hidden transition-all ${
                    activeImage === img
                      ? 'border-charcoal ring-1 ring-charcoal'
                      : 'border-accent-border/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} preview angle ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Active High-Res Image Display */}
            <div className="flex-1 aspect-[3/4] bg-ivory-200 border border-accent-border/70 overflow-hidden relative group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-ivory/90 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-luxury text-charcoal font-medium border border-accent-border/40">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Details & Purchase Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Department & Badge Eyebrow */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 font-medium">
                  {product.department} {product.badge && `· ${product.badge}`}
                </span>
                <span className="text-xs text-charcoal/50 font-light">Art. No. {product.id}</span>
              </div>

              {/* Title & Price */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-2.5">
                <span className="text-xl sm:text-2xl font-medium text-charcoal">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-charcoal/50 line-through font-light">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-charcoal/50 mt-1 font-light">
                Inclusive of all applicable taxes & duties.
              </p>

              {/* Editorial Description */}
              <p className="mt-5 text-xs sm:text-sm text-charcoal/75 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Material highlight */}
              <div className="mt-4 p-3 bg-ivory-200/60 border border-accent-border/60 text-xs text-charcoal/80 font-light">
                <strong className="font-medium text-charcoal">Material Composition: </strong>
                {product.material}
              </div>

              {/* Color Selector */}
              <div className="mt-6 pt-5 border-t border-accent-border/60">
                <div className="flex justify-between items-center text-xs mb-2.5">
                  <span className="text-charcoal/60 uppercase tracking-luxury text-[11px] font-medium">
                    Colour: <strong className="text-charcoal">{selectedColor.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor.name === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        aria-label={`Select ${c.name} color`}
                        className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                          isSelected
                            ? 'border-charcoal ring-1 ring-charcoal ring-offset-2'
                            : 'border-accent-border hover:border-charcoal/60'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              c.name === 'Onyx' || c.name === 'Black' ? 'text-white' : 'text-charcoal'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs mb-2.5">
                  <span className="text-charcoal/60 uppercase tracking-luxury text-[11px] font-medium">
                    Size: <strong className="text-charcoal">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={openSizeGuide}
                    className="text-xs text-charcoal/70 hover:text-charcoal underline underline-offset-4 flex items-center gap-1"
                  >
                    <span>Size guide</span>
                    <span className="text-[10px]">↗</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizeVariants.map((variant) => {
                    const isSelected = selectedSize === variant.size;
                    const inStock = variant.inStock;

                    return (
                      <button
                        key={variant.size}
                        disabled={!inStock}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`py-3 text-xs font-medium uppercase border transition-all ${
                          !inStock
                            ? 'bg-ivory-200/50 text-charcoal/30 border-accent-border/50 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-charcoal text-ivory border-charcoal shadow-sm'
                            : 'bg-ivory text-charcoal border-accent-border hover:border-charcoal'
                        }`}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Status Note */}
                <div className="mt-3 flex items-center gap-2 text-xs">
                  {isSelectedSizeInStock ? (
                    <span className="inline-flex items-center gap-1.5 text-charcoal/80 font-light">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      <span>In stock · Ready to dispatch</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-amber-800 font-light">
                      <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                      <span>Currently out of stock in this size</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Selector & Add to Cart Controls */}
              <div className="mt-8 pt-6 border-t border-accent-border space-y-4">
                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-accent-border bg-ivory-50 h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="px-3.5 h-full text-charcoal/70 hover:text-charcoal hover:bg-ivory-200 transition-colors disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-medium text-charcoal min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      className="px-3.5 h-full text-charcoal/70 hover:text-charcoal hover:bg-ivory-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary Add to Cart Button */}
                  <button
                    id="pdp-add-to-cart-btn"
                    disabled={!isSelectedSizeInStock}
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-soft"
                  >
                    <span>
                      {isSelectedSizeInStock
                        ? `Add to cart — ${formatPrice(product.price * quantity)}`
                        : 'Out of stock'}
                    </span>
                    {isSelectedSizeInStock && (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>

                {/* Save to Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-full py-2.5 border border-accent-border bg-transparent text-charcoal hover:border-charcoal text-xs uppercase tracking-luxury font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Heart
                    className={`w-4 h-4 stroke-[1.5] ${
                      isFavorite ? 'fill-sand text-sand-dark' : 'text-charcoal'
                    }`}
                  />
                  <span>{isFavorite ? 'Saved to wishlist' : 'Save to wishlist'}</span>
                </button>
              </div>

              {/* Collapsible Accordions (Figma PDP) */}
              <div className="mt-8 divide-y divide-accent-border border-y border-accent-border">
                {/* Details & Care */}
                <div className="py-3.5">
                  <button
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-luxury font-medium text-charcoal"
                  >
                    <span>Details & care</span>
                    {isDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isDetailsOpen && (
                    <div className="pt-3 text-xs text-charcoal/75 font-light space-y-2 leading-relaxed">
                      <ul className="space-y-1.5 list-disc pl-4">
                        {product.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                      <div className="pt-2 border-t border-accent-border/50">
                        <strong className="font-medium text-charcoal">Care Instructions:</strong>
                        <ul className="space-y-1 list-disc pl-4 mt-1">
                          {product.care.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery & Returns */}
                <div className="py-3.5">
                  <button
                    onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-luxury font-medium text-charcoal"
                  >
                    <span>Delivery & returns</span>
                    {isDeliveryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isDeliveryOpen && (
                    <div className="pt-3 text-xs text-charcoal/75 font-light space-y-2 leading-relaxed">
                      <p>{product.delivery}</p>
                      <p>
                        Domestic delivery across India within 3–5 business days. International express in 7–12 business days.
                      </p>
                      <p>
                        Unworn, tagged pieces may be returned within 14 days of delivery.
                      </p>
                    </div>
                  )}
                </div>

                {/* Sustainable Packaging */}
                <div className="py-3.5">
                  <button
                    onClick={() => setIsPackagingOpen(!isPackagingOpen)}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-luxury font-medium text-charcoal"
                  >
                    <span>Sustainable packaging & gift notes</span>
                    {isPackagingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isPackagingOpen && (
                    <div className="pt-3 text-xs text-charcoal/75 font-light space-y-2 leading-relaxed">
                      <p>
                        Every piece is enclosed in breathable unbleached organic cotton dust pouches and shipped in recyclable FSC-certified paper cartons without single-use plastics.
                      </p>
                      <p>Complimentary handwritten gift notes can be added at checkout.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Craft Section (Figma PDP 'BEHIND THE PIECE') */}
        <section className="py-16 sm:py-20 border-b border-accent-border text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-3">
              BEHIND THE PIECE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Beautiful, down to the last detail.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-charcoal/75 font-light leading-relaxed">
              Selected for its natural lustre and fluid drape, our materials move easily with you. Clean finishing and understated proportions keep the focus where it belongs: on how it feels to wear.
            </p>
          </div>
        </section>

        {/* 'A Natural Pairing' Recommendations Carousel/Grid */}
        {pairingProducts.length > 0 && (
          <section className="pt-16 sm:pt-20">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 font-medium block mb-1">
                  CURATED WARDROBE
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
                  A natural pairing.
                </h3>
              </div>
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs uppercase tracking-luxury text-charcoal hover:text-sand-dark underline underline-offset-4"
              >
                View all pieces
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {pairingProducts.map((pairedProduct) => (
                <ProductCard
                  key={pairedProduct.id}
                  product={pairedProduct}
                  onSelect={(p) => navigateTo('pdp', p.slug)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal />
    </div>
  );
};
