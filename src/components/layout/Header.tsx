import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    cartBadgeBump,
    wishlistCount,
    openCart,
    openMobileMenu,
    openSearch,
    navigateTo,
    currentPage,
  } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full bg-ivory/95 backdrop-blur-md transition-shadow duration-300 border-b border-accent-border ${
        isScrolled ? 'shadow-soft' : ''
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Mobile Trigger / Desktop Navigation Links */}
        <div className="flex items-center gap-6 flex-1">
          <button
            id="mobile-menu-btn"
            onClick={openMobileMenu}
            aria-label="Open mobile navigation menu"
            className="lg:hidden p-1.5 text-charcoal hover:text-charcoal/70 transition-colors"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          <button
            onClick={openSearch}
            aria-label="Search collection"
            className="lg:hidden p-1.5 text-charcoal hover:text-charcoal/70 transition-colors"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          <nav aria-label="Main" className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => navigateTo('shop')}
              className={`text-xs tracking-luxury uppercase font-medium transition-colors relative group py-1 ${
                currentPage === 'shop' ? 'text-charcoal font-semibold' : 'text-charcoal/80 hover:text-charcoal'
              }`}
            >
              Shop
              <span
                className={`absolute bottom-0 left-0 h-[1px] bg-charcoal transition-all duration-300 ${
                  currentPage === 'shop' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>

            <button
              onClick={() => navigateTo('shop', 'Tailoring')}
              className="text-xs tracking-luxury uppercase font-medium text-charcoal/80 hover:text-charcoal transition-colors relative group py-1"
            >
              Collections
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-charcoal group-hover:w-full transition-all duration-300" />
            </button>

            <button
              onClick={() => navigateTo('about')}
              className={`text-xs tracking-luxury uppercase font-medium transition-colors relative group py-1 ${
                currentPage === 'about' ? 'text-charcoal font-semibold' : 'text-charcoal/80 hover:text-charcoal'
              }`}
            >
              About
              <span
                className={`absolute bottom-0 left-0 h-[1px] bg-charcoal transition-all duration-300 ${
                  currentPage === 'about' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>
          </nav>
        </div>

        {/* Center: VELORA Brand Wordmark */}
        <div className="flex-1 text-center">
          <button
            onClick={() => navigateTo('home')}
            className="inline-block focus:outline-none"
            aria-label="VELORA Home"
          >
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.22em] uppercase font-light text-charcoal">
              VELORA
            </span>
          </button>
        </div>

        {/* Right Side: Search, Account, Wishlist, Bag */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
          <button
            id="header-search-btn"
            onClick={openSearch}
            aria-label="Search catalog"
            className="hidden lg:flex items-center justify-center p-2 text-charcoal hover:text-sand-dark transition-colors"
          >
            <Search className="w-[18px] h-[18px] stroke-[1.5]" />
          </button>

          <button
            id="header-account-btn"
            onClick={() => navigateTo('account')}
            aria-label="User account"
            className={`hidden lg:flex items-center justify-center p-2 transition-colors ${
              currentPage === 'account' ? 'text-charcoal font-semibold' : 'text-charcoal hover:text-sand-dark'
            }`}
          >
            <User className="w-[18px] h-[18px] stroke-[1.5]" />
          </button>

          {/* Wishlist Button with Dynamic Counter */}
          <button
            id="header-wishlist-btn"
            onClick={() => navigateTo('wishlist')}
            aria-label={`Wishlist containing ${wishlistCount} pieces`}
            className={`hidden lg:flex items-center justify-center p-2 transition-colors relative ${
              currentPage === 'wishlist' ? 'text-charcoal' : 'text-charcoal hover:text-sand-dark'
            }`}
          >
            <Heart
              className={`w-[18px] h-[18px] stroke-[1.5] transition-all ${
                wishlistCount > 0 ? 'fill-sand text-sand-dark' : ''
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-0.5 bg-sand-dark text-ivory text-[9px] font-semibold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button with Immediate Animated Counter */}
          <button
            id="header-cart-btn"
            onClick={openCart}
            aria-label={cartCount === 0 ? 'Shopping bag is empty (0 items)' : `Shopping bag containing ${cartCount} items`}
            className={`flex items-center gap-1.5 p-1.5 sm:p-2 text-charcoal hover:text-sand-dark transition-colors group ${
              cartBadgeBump ? 'scale-110' : 'scale-100'
            }`}
          >
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5] group-hover:scale-105 transition-transform" />
            <span
              id="header-cart-count"
              className={`text-xs font-semibold tracking-tight transition-transform duration-300 ${
                cartBadgeBump ? 'text-sand-dark scale-125' : 'text-charcoal scale-100'
              }`}
            >
              ({cartCount})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
