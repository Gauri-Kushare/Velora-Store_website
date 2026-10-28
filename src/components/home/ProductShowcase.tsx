import React from 'react';
import { PRODUCTS } from '../../data/storeData';
import { ProductCard } from '../ui/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types/store';

interface ProductShowcaseProps {
  onProductSelect?: (product: Product) => void;
  onViewAll?: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onProductSelect,
  onViewAll,
}) => {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <section id="shop" className="py-16 sm:py-24 bg-ivory border-b border-accent-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 font-medium block mb-2">
              THE MOST LOVED
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal">
              Enduring favourites.
            </h2>
          </div>

          <a
            href="#bestsellers"
            onClick={(e) => {
              if (onViewAll) {
                e.preventDefault();
                onViewAll();
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium tracking-luxury uppercase text-charcoal hover:text-sand-dark transition-colors py-1 group"
          >
            <span>Shop bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Product Cards Grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onProductSelect}
            />
          ))}
        </div>

        {/* Mobile View All Button (matches Figma mobile artboard) */}
        <div className="sm:hidden mt-8 text-center">
          <button
            onClick={onViewAll}
            className="w-full py-3.5 border border-charcoal/30 bg-transparent text-charcoal text-xs uppercase tracking-luxury font-medium hover:bg-charcoal hover:text-ivory transition-colors"
          >
            Shop Bestsellers
          </button>
        </div>
      </div>
    </section>
  );
};
