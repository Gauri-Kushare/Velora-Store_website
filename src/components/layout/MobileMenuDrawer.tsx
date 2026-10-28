import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, User, ArrowRight } from 'lucide-react';
import { PageView } from '../../types/store';
import { motion, AnimatePresence } from 'framer-motion';

export const MobileMenuDrawer: React.FC = () => {
  const {
    isMobileMenuOpen,
    closeMobileMenu,
    wishlistCount,
    currency,
    setCurrency,
    navigateTo,
  } = useStore();

  const handleLinkClick = (page: PageView, param?: string) => {
    closeMobileMenu();
    navigateTo(page, param);
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-ivory shadow-drawer flex flex-col justify-between overflow-y-auto border-r border-accent-border"
          >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-accent-border">
            <span className="font-serif text-2xl tracking-[0.2em] uppercase font-light text-charcoal">
              VELORA
            </span>
            <button
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="p-2 -mr-2 text-charcoal hover:text-charcoal/70 transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav aria-label="Mobile Navigation" className="px-6 py-6 space-y-4">
            <button
              onClick={() => handleLinkClick('shop')}
              className="w-full flex items-center justify-between py-2 text-sm uppercase tracking-luxury text-charcoal font-medium border-b border-accent-border/60 hover:text-sand-dark transition-colors text-left"
            >
              <span>The Collection (Shop All)</span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </button>

            <button
              onClick={() => handleLinkClick('shop', 'Clothing')}
              className="w-full flex items-center justify-between py-2 text-sm uppercase tracking-luxury text-charcoal font-medium border-b border-accent-border/60 hover:text-sand-dark transition-colors text-left"
            >
              <span>The Essentials</span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </button>

            <button
              onClick={() => handleLinkClick('shop', 'Tailoring')}
              className="w-full flex items-center justify-between py-2 text-sm uppercase tracking-luxury text-charcoal font-medium border-b border-accent-border/60 hover:text-sand-dark transition-colors text-left"
            >
              <span>Modern Tailoring</span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </button>

            <button
              onClick={() => handleLinkClick('shop', 'Dresses')}
              className="w-full flex items-center justify-between py-2 text-sm uppercase tracking-luxury text-charcoal font-medium border-b border-accent-border/60 hover:text-sand-dark transition-colors text-left"
            >
              <span>Dresses & Gowns</span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </button>

            <button
              onClick={() => handleLinkClick('shop', 'Accessories')}
              className="w-full flex items-center justify-between py-2 text-sm uppercase tracking-luxury text-charcoal font-medium border-b border-accent-border/60 hover:text-sand-dark transition-colors text-left"
            >
              <span>Accessories & Leather</span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </button>

            <button
              onClick={() => handleLinkClick('about')}
              className="w-full flex items-center justify-between py-2 text-sm uppercase tracking-luxury text-charcoal font-medium border-b border-accent-border/60 hover:text-sand-dark transition-colors text-left"
            >
              <span>Our Philosophy & Story</span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </button>

            <button
              onClick={() => handleLinkClick('contact')}
              className="w-full flex items-center justify-between py-2 text-sm uppercase tracking-luxury text-charcoal font-medium border-b border-accent-border/60 hover:text-sand-dark transition-colors text-left"
            >
              <span>Concierge & Contact</span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </button>

            <button
              onClick={() => handleLinkClick('faq')}
              className="w-full flex items-center justify-between py-2 text-sm uppercase tracking-luxury text-charcoal font-medium border-b border-accent-border/60 hover:text-sand-dark transition-colors text-left"
            >
              <span>Client FAQ & Sizing</span>
              <ArrowRight className="w-4 h-4 text-charcoal/40" />
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-6 border-t border-accent-border bg-ivory-50 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleLinkClick('account')}
              className="flex items-center gap-2 text-xs tracking-luxury uppercase text-charcoal hover:text-sand-dark transition-colors"
            >
              <User className="w-4 h-4" />
              <span>My Account</span>
            </button>

            <button
              onClick={() => handleLinkClick('wishlist')}
              className="flex items-center gap-2 text-xs tracking-luxury uppercase text-charcoal hover:text-sand-dark transition-colors"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-sand text-sand-dark' : ''}`} />
              <span>Wishlist ({wishlistCount})</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-charcoal/70 border-t border-accent-border/60">
            <span>Currency</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency({ code: 'INR', symbol: '₹', rate: 1 })}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  currency.code === 'INR' ? 'bg-charcoal text-ivory' : 'bg-transparent text-charcoal'
                }`}
              >
                INR ₹
              </button>
              <button
                onClick={() => setCurrency({ code: 'USD', symbol: '$', rate: 0.012 })}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  currency.code === 'USD' ? 'bg-charcoal text-ivory' : 'bg-transparent text-charcoal'
                }`}
              >
                USD $
              </button>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  );
};
