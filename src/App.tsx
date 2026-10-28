import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { MobileMenuDrawer } from './components/layout/MobileMenuDrawer';
import { CartDrawer } from './components/layout/CartDrawer';
import { QuickViewModal } from './components/layout/QuickViewModal';
import { SearchModal } from './components/layout/SearchModal';
import { SizeGuideModal } from './components/pdp/SizeGuideModal';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';

// Homepage Components
import { HeroSection } from './components/home/HeroSection';
import { ValuePropsBar } from './components/home/ValuePropsBar';
import { CategoryGrid } from './components/home/CategoryGrid';
import { ProductShowcase } from './components/home/ProductShowcase';
import { PhilosophyBanner } from './components/home/PhilosophyBanner';
import { QuoteSection } from './components/home/QuoteSection';
import { JournalSection } from './components/home/JournalSection';
import { PillarsSection } from './components/home/PillarsSection';
import { NewsletterSection } from './components/home/NewsletterSection';

// Shopping Pages
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/pdp/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { AccountPage } from './components/account/AccountPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { FAQPage } from './components/pages/FAQPage';
import { ShippingReturnsPage } from './components/pages/ShippingReturnsPage';
import { LegalPage } from './components/pages/LegalPage';
import { Product } from './types/store';

const StoreContent: React.FC = () => {
  const { currentPage, navigateTo, showToast } = useStore();

  const handleProductSelect = (product: Product) => {
    navigateTo('pdp', product.slug);
  };

  const handleShopClick = () => {
    navigateTo('shop');
  };

  const handleCategorySelect = (catId: string) => {
    if (catId === 'modern-tailoring') {
      navigateTo('shop', 'Tailoring');
    } else if (catId === 'everyday-essentials') {
      navigateTo('shop', 'Clothing');
    } else if (catId === 'finishing-touches') {
      navigateTo('shop', 'Accessories');
    } else {
      navigateTo('shop');
    }
  };

  const handleDiscoverStory = () => {
    navigateTo('about');
  };

  const handleArticleClick = (articleId: string) => {
    navigateTo('about');
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal selection:bg-sand selection:text-charcoal font-sans">
      {/* 1. Global Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Global Header with immediate cart counter & navigation */}
      <Header />

      {/* 3. Main Dynamic Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <HeroSection onShopClick={handleShopClick} />
            <ValuePropsBar />
            <CategoryGrid onCategorySelect={handleCategorySelect} />
            <ProductShowcase
              onProductSelect={handleProductSelect}
              onViewAll={handleShopClick}
            />
            <PhilosophyBanner onDiscoverStory={handleDiscoverStory} />
            <QuoteSection />
            <JournalSection onArticleClick={handleArticleClick} />
            <PillarsSection />
            <NewsletterSection />
          </>
        )}

        {currentPage === 'shop' && <ShopPage />}

        {currentPage === 'pdp' && <ProductDetailPage />}

        {currentPage === 'cart' && <CartPage />}

        {currentPage === 'wishlist' && <WishlistPage />}

        {currentPage === 'checkout' && <CheckoutPage />}

        {currentPage === 'account' && <AccountPage />}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'faq' && <FAQPage />}

        {currentPage === 'shipping-returns' && <ShippingReturnsPage />}

        {(currentPage === 'privacy' || currentPage === 'terms') && <LegalPage />}
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Drawers, Modals & Toast Overlays */}
      <MobileMenuDrawer />
      <CartDrawer onCheckout={() => navigateTo('checkout')} />
      <QuickViewModal />
      <SearchModal />
      <SizeGuideModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
