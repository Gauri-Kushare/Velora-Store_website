import React, { useState } from 'react';
import { FOOTER_COLUMNS } from '../../data/storeData';
import { useStore } from '../../context/StoreContext';
import { ChevronDown, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currency, setCurrency, navigateTo, openSizeGuide, showToast } = useStore();
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const handleFooterLinkClick = (label: string, href: string, external?: boolean) => {
    if (external) return;

    if (label === 'Size guide') {
      openSizeGuide();
    } else if (label === 'New arrivals') {
      navigateTo('shop');
    } else if (label === 'The Essentials') {
      navigateTo('shop', 'Clothing');
    } else if (label === 'Tailoring') {
      navigateTo('shop', 'Tailoring');
    } else if (label === 'Accessories') {
      navigateTo('shop', 'Accessories');
    } else if (label === 'Our story' || label === 'Sustainability') {
      navigateTo('about');
    } else if (label === 'My account' || label === 'Order history') {
      navigateTo('account');
    } else if (label === 'Contact') {
      navigateTo('contact');
    } else if (label === 'FAQ') {
      navigateTo('faq');
    } else if (label === 'Shipping & Returns') {
      navigateTo('shipping-returns');
    } else {
      navigateTo('shop');
    }
  };

  return (
    <footer className="bg-ivory border-t border-accent-border pt-16 sm:pt-20 pb-12 text-charcoal">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16 border-b border-accent-border/70">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <button
              onClick={() => navigateTo('home')}
              className="text-left focus:outline-none"
            >
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.2em] uppercase font-light text-charcoal block">
                VELORA
              </span>
            </button>
            <p className="text-xs sm:text-sm text-charcoal/70 font-light max-w-sm leading-relaxed">
              Modern essentials. Enduring by design. Built with quiet confidence, timeless natural fibers and considered silhouettes.
            </p>
            <div className="pt-2">
              <a
                href="mailto:care@velora.com"
                className="text-xs text-charcoal/80 hover:text-charcoal underline underline-offset-4 tracking-wider transition-colors"
              >
                care@velora.com
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-[11px] font-medium tracking-widest uppercase text-charcoal">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-charcoal/70 font-light">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-charcoal transition-colors hover:underline underline-offset-4"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => handleFooterLinkClick(link.label, link.href, link.external)}
                        className="hover:text-charcoal transition-colors hover:underline underline-offset-4 text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal/60 font-light">
          <div>
            <p>© 2026 VELORA. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('privacy')}
              className="hover:text-charcoal transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigateTo('terms')}
              className="hover:text-charcoal transition-colors underline-offset-4 hover:underline"
            >
              Terms & Conditions
            </button>
          </div>

          {/* Currency / Region Picker */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className="flex items-center gap-2 hover:text-charcoal transition-colors py-1 px-2.5 border border-accent-border/60 rounded bg-ivory-50 text-xs"
            >
              <Globe className="w-3.5 h-3.5 text-charcoal/60" />
              <span>{currency.code === 'INR' ? 'India · INR ₹' : 'United States · USD $'}</span>
              <ChevronDown className="w-3 h-3 text-charcoal/60" />
            </button>

            {isCurrencyMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-44 bg-ivory border border-accent-border shadow-soft rounded p-1.5 z-30">
                <button
                  onClick={() => {
                    setCurrency({ code: 'INR', symbol: '₹', rate: 1 });
                    setIsCurrencyMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded hover:bg-ivory-200 transition-colors ${
                    currency.code === 'INR' ? 'font-semibold text-charcoal' : 'text-charcoal/70'
                  }`}
                >
                  India · INR (₹)
                </button>
                <button
                  onClick={() => {
                    setCurrency({ code: 'USD', symbol: '$', rate: 0.012 });
                    setIsCurrencyMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded hover:bg-ivory-200 transition-colors ${
                    currency.code === 'USD' ? 'font-semibold text-charcoal' : 'text-charcoal/70'
                  }`}
                >
                  International · USD ($)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
