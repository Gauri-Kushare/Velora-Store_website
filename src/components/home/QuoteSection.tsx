import React from 'react';

export const QuoteSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-ivory border-b border-accent-border text-center px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <span className="text-[11px] uppercase tracking-[0.22em] text-charcoal/50 font-medium block mb-6">
          THE VELORA WAY
        </span>

        <blockquote className="font-serif text-2xl sm:text-4xl lg:text-[44px] font-normal text-charcoal leading-[1.3] max-w-3xl mx-auto">
          “True luxury is feeling entirely yourself.
          <br className="hidden sm:inline" />
          Nothing added. Nothing to prove.”
        </blockquote>

        <p className="mt-8 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/60 font-medium">
          A QUIETER KIND OF CONFIDENCE
        </p>
      </div>
    </section>
  );
};
