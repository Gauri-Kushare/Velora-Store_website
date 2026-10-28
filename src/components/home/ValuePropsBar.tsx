import React from 'react';
import { Package, Truck, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ValuePropsBar: React.FC = () => {
  const { currency } = useStore();

  return (
    <section 
      aria-label="Brand Guarantees"
      className="bg-ivory border-b border-accent-border py-4 sm:py-5 px-4 sm:px-8"
    >
      <div className="max-w-8xl mx-auto">
        {/* Desktop 3-column Layout */}
        <div className="hidden sm:grid grid-cols-3 divide-x divide-accent-border/60 text-center">
          <div className="flex items-center justify-center gap-2.5 px-4 text-xs tracking-wider text-charcoal/80 font-light">
            <Package className="w-4 h-4 text-sand-dark stroke-[1.5]" />
            <span>Considered, from cloth to care</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 px-4 text-xs tracking-wider text-charcoal/80 font-light">
            <Truck className="w-4 h-4 text-sand-dark stroke-[1.5]" />
            <span>
              Complimentary shipping over {currency.code === 'INR' ? '₹10,000' : '$150'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2.5 px-4 text-xs tracking-wider text-charcoal/80 font-light">
            <RefreshCw className="w-4 h-4 text-sand-dark stroke-[1.5]" />
            <span>Easy returns within 14 days</span>
          </div>
        </div>

        {/* Mobile Single Centered Line */}
        <div className="sm:hidden flex items-center justify-center gap-2 text-xs tracking-wider text-charcoal/80 font-light text-center">
          <RefreshCw className="w-3.5 h-3.5 text-sand-dark stroke-[1.5]" />
          <span>Considered design. Easy 14-day returns.</span>
        </div>
      </div>
    </section>
  );
};
