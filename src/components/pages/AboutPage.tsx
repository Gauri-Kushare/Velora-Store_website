import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Feather } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="bg-ivory min-h-screen pt-4 sm:pt-6 pb-24">
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
            <li className="text-charcoal font-medium">Our Story & Philosophy</li>
          </ol>
        </nav>

        {/* Editorial Hero Header */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold block mb-2">
            THE ATELIER PHILOSOPHY
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-charcoal tracking-tight leading-[1.08]">
            A wardrobe of quiet confidence. Enduring by design.
          </h1>
          <p className="mt-6 text-sm sm:text-base text-charcoal/75 font-light max-w-2xl leading-relaxed">
            VELORA was founded on a simple conviction: that what we wear should be considered, enduring, and quietly distinctive. We design pieces to be returned to season after season, free from fleeting trends.
          </p>
        </div>

        {/* Split Editorial Image and Manifest */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center pb-16 sm:pb-24 border-b border-accent-border">
          <div className="lg:col-span-7 aspect-[4/3] sm:aspect-[16/10] bg-ivory-200 border border-accent-border overflow-hidden relative">
            <img
              src="/images/editorial-philosophy.jpg"
              alt="VELORA Atelier Craftsmanship"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-charcoal/10" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-ivory/90 backdrop-blur-md px-4 py-2 border border-accent-border text-[11px] uppercase tracking-luxury text-charcoal">
              Atelier Archive · Considered Silhouettes
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block">
              OUR FOUNDATION
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal font-normal leading-snug">
              The beauty of a smaller, more meaningful wardrobe.
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/75 font-light leading-relaxed">
              In an age of endless accumulation and synthetic speed, we step back. Every garment in the VELORA collection undergoes months of fit calibration and material testing. We believe that true luxury is not loud or ostentatious; it is the quiet ease of a seam that falls precisely where it should, and a fabric that breathes naturally with the skin.
            </p>
            <p className="text-xs sm:text-sm text-charcoal/75 font-light leading-relaxed">
              When each piece pairs instinctively with the next, getting dressed becomes an unhurried ritual of clarity.
            </p>
          </div>
        </div>

        {/* Four Material Pillars */}
        <div className="py-16 sm:py-24 border-b border-accent-border">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-2">
              PROVENANCE & INTEGRITY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Materiality matters above all.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-charcoal/70 font-light">
              We source only natural fibers from generational mills that honor the land and the craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-6 bg-ivory-50 border border-accent-border space-y-3">
              <span className="font-serif text-2xl text-sand-dark font-light">01</span>
              <h3 className="font-serif text-lg text-charcoal font-medium">Mulberry Silk</h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Grade 6A Mulberry silk, woven in 19-momme crepe de Chine for a fluid, liquid drape that drapes naturally without static or cling.
              </p>
            </div>

            <div className="p-6 bg-ivory-50 border border-accent-border space-y-3">
              <span className="font-serif text-2xl text-sand-dark font-light">02</span>
              <h3 className="font-serif text-lg text-charcoal font-medium">Italian Virgin Wool</h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Spun in family-run Biella mills from fine merino fleece. Breathable across seasons, wrinkle-resilient, and finished with a soft peach touch.
              </p>
            </div>

            <div className="p-6 bg-ivory-50 border border-accent-border space-y-3">
              <span className="font-serif text-2xl text-sand-dark font-light">03</span>
              <h3 className="font-serif text-lg text-charcoal font-medium">Inner Mongolian Cashmere</h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Combed humanely during spring molting. Only the longest staple fibers are selected for 2-ply yarns, preventing premature pilling and ensuring lasting loft.
              </p>
            </div>

            <div className="p-6 bg-ivory-50 border border-accent-border space-y-3">
              <span className="font-serif text-2xl text-sand-dark font-light">04</span>
              <h3 className="font-serif text-lg text-charcoal font-medium">Tuscan Leather</h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Full-grain calfskin vegetable-tanned with mimosa and chestnut extracts in Santa Croce sull'Arno. Rich with character, aging into a deep golden patina.
              </p>
            </div>
          </div>
        </div>

        {/* Sustainable Responsibility Ethos */}
        <div className="py-16 sm:py-24 border-b border-accent-border grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block">
              OUR COMMITMENT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Zero single-use plastics. 100% recyclable presentation.
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/75 font-light leading-relaxed">
              Every garment leaves our workshop enclosed inside an unbleached organic cotton dust pouch, designed to safeguard your piece in your wardrobe for decades to come.
            </p>
            <p className="text-xs sm:text-sm text-charcoal/75 font-light leading-relaxed">
              Our shipping boxes are crafted from FSC-certified post-consumer recycled paper, and sealed with water-activated gummed paper tape.
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs text-charcoal font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sand-dark" />
                <span>OEKO-TEX Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-sand-dark" />
                <span>Cruelty-Free Fibers</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 aspect-[4/3] bg-ivory-200 border border-accent-border overflow-hidden">
            <img
              src="/images/journal-lasting.jpg"
              alt="VELORA Ethical Production"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Footer Call to Action */}
        <div className="pt-16 sm:pt-20 text-center max-w-xl mx-auto">
          <h3 className="font-serif text-3xl text-charcoal font-normal">
            Experience the collection.
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-charcoal/70 font-light">
            Discover the building blocks of an enduring, considered wardrobe.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors inline-flex items-center gap-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
