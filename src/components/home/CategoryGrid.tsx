import React from 'react';
import { CATEGORIES } from '../../data/storeData';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  onCategorySelect?: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  return (
    <section id="collections" className="py-16 sm:py-24 bg-ivory border-b border-accent-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 font-medium block mb-2">
              A CONSIDERED WARDROBE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal">
              Made for your everyday.
            </h2>
          </div>

          <a
            href="#all-collections"
            onClick={(e) => {
              if (onCategorySelect) {
                e.preventDefault();
                onCategorySelect('all');
              }
            }}
            className="text-xs font-medium tracking-luxury uppercase text-charcoal hover:text-sand-dark transition-colors inline-flex items-center gap-1 group py-1"
          >
            <span>Explore all collections</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Categories Grid (Desktop 3 cols / Mobile 2 cols + 1 full) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat, index) => {
            // In mobile, make the 3rd card span 2 cols so it matches the mobile artboard
            const isLastOnMobile = index === 2 ? 'sm:col-span-2 lg:col-span-1' : '';

            return (
              <div
                key={cat.id}
                onClick={() => onCategorySelect && onCategorySelect(cat.id)}
                className={`group cursor-pointer flex flex-col ${isLastOnMobile}`}
              >
                {/* Image Container with Luxury Zoom */}
                <div className="relative aspect-[4/4.2] sm:aspect-[4/4.5] overflow-hidden bg-ivory-200 border border-accent-border/70">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors duration-300" />
                </div>

                {/* Title & Caption */}
                <div className="pt-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-charcoal font-medium group-hover:text-sand-dark transition-colors flex items-center gap-1">
                      <span>{cat.title}</span>
                    </h3>
                    <p className="text-xs text-charcoal/60 font-light mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>

                  <span className="p-1 text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
