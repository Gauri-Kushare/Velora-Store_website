import React from 'react';
import { BRAND_PILLARS } from '../../data/storeData';

export const PillarsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-ivory border-b border-accent-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16">
          {BRAND_PILLARS.map((pillar) => (
            <div key={pillar.number} className="flex flex-col">
              <span className="font-serif text-sm tracking-widest text-charcoal/40 font-medium mb-3">
                {pillar.number}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-medium mb-2.5">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
