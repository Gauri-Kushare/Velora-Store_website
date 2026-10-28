import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { currency } = useStore();

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Announcement"
      className="bg-charcoal text-ivory text-[11px] sm:text-xs tracking-luxury uppercase font-medium py-2.5 px-4 relative z-50 border-b border-charcoal-800 transition-all duration-300"
    >
      <div className="max-w-8xl mx-auto flex items-center justify-center text-center">
        <p className="flex items-center gap-2">
          <span>Complimentary worldwide shipping on orders over {currency.code === 'INR' ? '₹10,000' : '$150'}</span>
        </p>

        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss announcement"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-ivory transition-colors text-xs px-1"
        >
          ✕
        </button>
      </div>
    </aside>
  );
};
