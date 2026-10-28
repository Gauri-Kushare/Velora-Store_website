import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types/store';

interface QuickViewContentProps {
  product: Product;
}

const QuickViewContent: React.FC<QuickViewContentProps> = ({ product }) => {
  const {
    closeQuickView,
    addToCart,
    formatPrice,
    toggleWishlist,
    isWishlisted,
    openSizeGuide,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images.main);

  const isFavorite = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with luxury blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-md"
        onClick={closeQuickView}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-ivory text-left shadow-modal w-full max-w-4xl border border-accent-border my-8 pointer-events-auto"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 p-2 text-charcoal/70 hover:text-charcoal bg-ivory/80 backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Images */}
            <div className="bg-ivory-200 p-6 flex flex-col justify-between">
              <div className="aspect-[3/4] overflow-hidden bg-ivory-300">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-all duration-300"
                />
              </div>

              {/* Thumbnails if available */}
              {product.images.back && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setActiveImage(product.images.main)}
                    className={`w-16 h-20 border overflow-hidden ${
                      activeImage === product.images.main
                        ? 'border-charcoal'
                        : 'border-accent-border opacity-70'
                    }`}
                  >
                    <img
                      src={product.images.main}
                      alt="Front"
                      className="w-full h-full object-cover object-top"
                    />
                  </button>

                  <button
                    onClick={() => setActiveImage(product.images.back!)}
                    className={`w-16 h-20 border overflow-hidden ${
                      activeImage === product.images.back
                        ? 'border-charcoal'
                        : 'border-accent-border opacity-70'
                    }`}
                  >
                    <img
                      src={product.images.back!}
                      alt="Back"
                      className="w-full h-full object-cover object-top"
                    />
                  </button>

                  {product.images.detail && (
                    <button
                      onClick={() => setActiveImage(product.images.detail!)}
                      className={`w-16 h-20 border overflow-hidden ${
                        activeImage === product.images.detail
                          ? 'border-charcoal'
                          : 'border-accent-border opacity-70'
                      }`}
                    >
                      <img
                        src={product.images.detail!}
                        alt="Detail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right: Details & Purchase */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Eyebrow / Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-luxury text-charcoal/60 font-medium">
                    {product.category} {product.badge && `· ${product.badge}`}
                  </span>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="text-charcoal hover:text-sand-dark transition-colors p-1"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 stroke-[1.5] ${
                        isFavorite ? 'fill-sand text-sand-dark' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Title & Price */}
                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <span className="text-lg font-medium text-charcoal">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-charcoal/50 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-charcoal/50 mt-0.5">
                  Inclusive of all taxes & sustainable packaging.
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed mt-4">
                  {product.description}
                </p>

                {/* Color Selection */}
                <div className="mt-6">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-charcoal/60 uppercase tracking-luxury text-[10px] font-medium">
                      Colour: <strong className="text-charcoal">{selectedColor.name}</strong>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        aria-label={`Select ${c.name}`}
                        className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                          selectedColor.name === c.name
                            ? 'border-charcoal ring-1 ring-charcoal ring-offset-2'
                            : 'border-accent-border hover:border-charcoal/40'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColor.name === c.name && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              c.name === 'Onyx' || c.name === 'Black' ? 'text-white' : 'text-charcoal'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mt-5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-charcoal/60 uppercase tracking-luxury text-[10px] font-medium">
                      Size: <strong className="text-charcoal">{selectedSize}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={openSizeGuide}
                      className="text-[11px] text-charcoal/70 hover:text-charcoal underline underline-offset-4"
                    >
                      Size guide ↗
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-xs font-medium border uppercase transition-colors ${
                          selectedSize === size
                            ? 'bg-charcoal text-ivory border-charcoal'
                            : 'bg-ivory border-accent-border text-charcoal hover:border-charcoal'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Details List */}
                <div className="mt-5 pt-4 border-t border-accent-border/60">
                  <ul className="text-xs text-charcoal/70 space-y-1 font-light">
                    {product.details.slice(0, 3).map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-sand rounded-full" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-accent-border space-y-3">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  className="w-full py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2 group"
                >
                  <span>Add to cart — {formatPrice(product.price * quantity)}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct } = useStore();

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <QuickViewContent key={quickViewProduct.id} product={quickViewProduct} />
      )}
    </AnimatePresence>
  );
};
