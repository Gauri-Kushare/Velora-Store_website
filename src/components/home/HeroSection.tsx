import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onShopClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopClick }) => {
  return (
    <section className="relative w-full bg-ivory border-b border-accent-border overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[580px] lg:min-h-[700px]">
          {/* Left Column: Editorial Headline & Story */}
          <div className="lg:col-span-5 px-6 sm:px-12 lg:px-16 py-12 sm:py-20 lg:py-28 flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/60 font-medium block mb-4 sm:mb-6">
                THE ART OF EVERYDAY · COLLECTION 01
              </span>

              {/* Massive Serif Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-normal text-charcoal leading-[1.05] tracking-tight">
                Less, but
                <br />
                better.
              </h1>

              {/* Editorial Description */}
              <p className="mt-6 sm:mt-8 text-sm sm:text-base text-charcoal/70 font-light max-w-md leading-relaxed">
                A wardrobe of quiet confidence. Considered silhouettes, beautiful fabrics and pieces to return to, season after season.
              </p>

              {/* Primary Call to Action */}
              <div className="mt-8 sm:mt-10">
                <a
                  href="#collection"
                  onClick={(e) => {
                    if (onShopClick) {
                      e.preventDefault();
                      onShopClick();
                    }
                  }}
                  id="hero-shop-cta"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-all duration-300 shadow-soft hover:shadow-lg group"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Season Identifier */}
            <div className="pt-8 lg:pt-12">
              <span className="text-[10px] tracking-luxury uppercase text-charcoal/50 font-medium">
                AUTUMN / WINTER 2026
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[500px] lg:min-h-full bg-ivory-200">
            <img
              src="/images/hero-model.jpg"
              alt="Model wearing VELORA tailored blazer in sunlit architectural courtyard"
              className="w-full h-full object-cover object-center lg:object-top"
              loading="eager"
            />
            {/* Subtle overlay caption from Figma */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-charcoal/40 backdrop-blur-md px-3 py-1.5 text-[10px] sm:text-[11px] text-ivory/90 uppercase tracking-widest font-light">
              A STUDY IN STILLNESS — VELORA, 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
