import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/storeData';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, openQuickView, formatPrice } = useStore();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : PRODUCTS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={closeSearch}
      />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-8 pt-20">
        <div className="relative w-full max-w-2xl bg-ivory shadow-modal border border-accent-border overflow-hidden">
          {/* Search Input Bar */}
          <div className="p-4 sm:p-6 border-b border-accent-border flex items-center gap-3 bg-ivory-50">
            <Search className="w-5 h-5 text-charcoal/50 stroke-[1.5]" />
            <input
              type="text"
              autoFocus
              placeholder="Search silk, tailoring, trousers, dresses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-charcoal placeholder:text-charcoal/40 font-light"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-xs text-charcoal/50 hover:text-charcoal"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeSearch}
              aria-label="Close search"
              className="p-1.5 text-charcoal/60 hover:text-charcoal"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Quick Categories suggestions */}
          <div className="px-6 py-3 bg-ivory-200/50 border-b border-accent-border flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-charcoal/50 uppercase tracking-luxury text-[10px] font-medium mr-1">
              Popular:
            </span>
            {['Silk Shirt', 'Tailoring', 'Trouser', 'Blazer', 'Cashmere'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 bg-ivory border border-accent-border rounded-full hover:border-charcoal transition-colors whitespace-nowrap text-charcoal text-[11px]"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Results list */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            <div className="text-[11px] uppercase tracking-luxury text-charcoal/50 font-medium mb-3">
              {query.trim() ? `Found ${filtered.length} results` : 'Featured recommendations'}
            </div>

            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-charcoal/60 font-light">
                No matching pieces found for "{query}". Try checking your spelling or search for "Silk" or "Tailoring".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      closeSearch();
                      openQuickView(product);
                    }}
                    className="flex gap-3 p-2 hover:bg-ivory-200/70 border border-transparent hover:border-accent-border transition-colors cursor-pointer group"
                  >
                    <div className="w-16 h-20 bg-ivory-300 overflow-hidden flex-shrink-0">
                      <img
                        src={product.images.main}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-serif text-sm font-medium text-charcoal group-hover:text-sand-dark transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-charcoal/60 line-clamp-1">{product.subtitle}</p>
                      <span className="text-xs font-semibold text-charcoal mt-1">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
