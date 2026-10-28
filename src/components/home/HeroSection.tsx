import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onShopClick?: () => void;
}

const luxuryEase = [0.22, 1, 0.36, 1] as const;

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopClick }) => {
  return (
    <section className="relative w-full bg-ivory border-b border-accent-border overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[580px] lg:min-h-[700px]">
          {/* Left Column: Editorial Headline & Story */}
          <div className="lg:col-span-5 px-6 sm:px-12 lg:px-16 py-12 sm:py-20 lg:py-28 flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: luxuryEase }}
                className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/60 font-medium block mb-4 sm:mb-6"
              >
                THE ART OF EVERYDAY · COLLECTION 01
              </motion.span>

              {/* Massive Serif Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.22, ease: luxuryEase }}
                className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-normal text-charcoal leading-[1.05] tracking-tight"
              >
                Less, but
                <br />
                better.
              </motion.h1>

              {/* Editorial Description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.38, ease: luxuryEase }}
                className="mt-6 sm:mt-8 text-sm sm:text-base text-charcoal/70 font-light max-w-md leading-relaxed"
              >
                A wardrobe of quiet confidence. Considered silhouettes, beautiful fabrics and pieces to return to, season after season.
              </motion.p>

              {/* Primary Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: luxuryEase }}
                className="mt-8 sm:mt-10"
              >
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
              </motion.div>
            </div>

            {/* Season Identifier */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="pt-8 lg:pt-12"
            >
              <span className="text-[10px] tracking-luxury uppercase text-charcoal/50 font-medium">
                AUTUMN / WINTER 2026
              </span>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: luxuryEase }}
            className="lg:col-span-7 relative min-h-[380px] sm:min-h-[500px] lg:min-h-full bg-ivory-200 overflow-hidden"
          >
            <img
              src="/images/hero-model.jpg"
              alt="Model wearing VELORA tailored blazer in sunlit architectural courtyard"
              className="w-full h-full object-cover object-center lg:object-top transition-transform duration-1000 ease-out hover:scale-[1.02]"
              loading="eager"
            />
            {/* Subtle overlay caption from Figma */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: luxuryEase }}
              className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-charcoal/40 backdrop-blur-md px-3 py-1.5 text-[10px] sm:text-[11px] text-ivory/90 uppercase tracking-widest font-light"
            >
              A STUDY IN STILLNESS — VELORA, 2026
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
