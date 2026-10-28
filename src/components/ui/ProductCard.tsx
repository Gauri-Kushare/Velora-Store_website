import React, { useState } from 'react';
import { Product, ColorOption } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { Heart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { formatPrice, openQuickView, addToCart, toggleWishlist, isWishlisted, navigateTo } = useStore();
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = isWishlisted(product.id);

  const handleCardClick = () => {
    if (onSelect) onSelect(product);
    else navigateTo('pdp', product.slug);
  };

  // If there is an alternate hover image and card is hovered, display it
  const displayImage = isHovered && product.images.hover ? product.images.hover : product.images.main;

  return (
    <article 
      aria-label={product.name}
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div 
        onClick={handleCardClick}
        className="relative aspect-[3/4] w-full overflow-hidden bg-ivory-200 border border-accent-border/60"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="bg-ivory/90 backdrop-blur-sm text-charcoal text-[10px] font-medium tracking-luxury uppercase px-2 py-0.5 border border-accent-border/40">
              {product.badge}
            </span>
          ) : (
            <span />
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={`Save ${product.name} to wishlist`}
            className="pointer-events-auto p-1.5 rounded-full bg-ivory/80 backdrop-blur-sm text-charcoal hover:text-sand-dark transition-all duration-200 hover:scale-110"
          >
            <Heart
              className={`w-3.5 h-3.5 stroke-[1.5] ${
                isFavorite ? 'fill-sand text-sand-dark' : 'text-charcoal'
              }`}
            />
          </button>
        </div>

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, selectedColor, product.sizes[0] || 'M', 1);
            }}
            className="w-full py-2.5 bg-ivory/95 backdrop-blur-md text-charcoal hover:bg-charcoal hover:text-ivory text-[11px] uppercase tracking-luxury font-medium border border-accent-border shadow-soft transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <h3 
            onClick={handleCardClick}
            className="font-serif text-base text-charcoal font-medium hover:text-sand-dark transition-colors line-clamp-1"
          >
            {product.name}
          </h3>
        </div>

        <p className="text-xs text-charcoal/60 font-light mt-0.5 line-clamp-1">
          {product.subtitle}
        </p>

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs sm:text-sm font-medium text-charcoal tracking-tight">
            {formatPrice(product.price)}
          </span>

          {/* Color Swatch Dots */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((color) => {
              const isActive = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  aria-label={`Select ${color.name} color`}
                  className={`w-3 h-3 rounded-full border transition-all ${
                    isActive
                      ? 'ring-1 ring-charcoal ring-offset-1 border-charcoal scale-110'
                      : 'border-accent-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
};
