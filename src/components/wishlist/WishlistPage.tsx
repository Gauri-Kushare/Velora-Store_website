import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/storeData';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    navigateTo,
    formatPrice,
    openQuickView,
  } = useStore();

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

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
            <li className="text-charcoal font-medium">Personal Wishlist ({wishlist.length})</li>
          </ol>
        </nav>

        {/* Title */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal tracking-tight">
            Your saved pieces
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-charcoal/70 font-light">
            Considered silhouettes saved to revisit and curate over time.
          </p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-20 text-center border border-accent-border bg-ivory-50 max-w-2xl mx-auto">
            <Heart className="w-10 h-10 text-charcoal/30 stroke-[1.2] mx-auto mb-3" />
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-charcoal/70 font-light max-w-sm mx-auto leading-relaxed">
              Explore our considered collection and tap the heart icon on any piece to save it here.
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="mt-6 px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors inline-flex items-center gap-2"
            >
              <span>Explore collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {savedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-ivory-50 border border-accent-border overflow-hidden flex flex-col justify-between group"
              >
                {/* Image */}
                <div
                  onClick={() => navigateTo('pdp', product.slug)}
                  className="aspect-[3/4] bg-ivory-200 overflow-hidden relative cursor-pointer"
                >
                  <img
                    src={product.images.main}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-ivory/90 backdrop-blur-sm px-2 py-0.5 text-[10px] uppercase tracking-luxury font-medium text-charcoal">
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 p-1.5 bg-ivory/90 backdrop-blur-sm rounded-full text-charcoal hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3
                      onClick={() => navigateTo('pdp', product.slug)}
                      className="font-serif text-lg text-charcoal font-medium hover:text-sand-dark transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-charcoal/60 font-light mt-0.5">{product.subtitle}</p>
                    <span className="text-sm font-semibold text-charcoal block mt-2">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-accent-border/60 mt-4 space-y-2">
                    <button
                      onClick={() => addToCart(product, product.colors[0], product.sizes[0] || 'M', 1)}
                      className="w-full py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      onClick={() => openQuickView(product)}
                      className="w-full py-2 text-xs text-charcoal/70 hover:text-charcoal underline underline-offset-4 font-light text-center"
                    >
                      Quick Options
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
