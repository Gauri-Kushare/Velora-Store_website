import React from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_CURRENCY } from '../../data/storeData';
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    formatPrice,
    navigateTo,
    showToast,
  } = useStore();

  const freeThreshold = STORE_CURRENCY.freeShippingThreshold;
  const isFreeShipping = cartTotal >= freeThreshold;
  const amountNeeded = Math.max(0, freeThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeThreshold) * 100));

  const handleCheckout = () => {
    navigateTo('checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-ivory min-h-screen pt-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center py-20 border border-accent-border bg-ivory-50">
          <ShoppingBag className="w-10 h-10 text-charcoal/40 mx-auto stroke-[1.2] mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Your bag is currently empty
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-charcoal/70 font-light max-w-sm mx-auto leading-relaxed">
            A wardrobe built with quiet intention takes time. Explore our collection of enduring essentials.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors inline-flex items-center gap-2"
            >
              <span>Explore the collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <li className="text-charcoal font-medium">Your bag ({cartCount})</li>
          </ol>
        </nav>

        {/* Page Title & Subtitle */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal tracking-tight">
            Your bag ({cartCount})
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-charcoal/70 font-light">
            A few well-chosen things. Yours to make everyday.
          </p>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="mb-8 p-4 bg-ivory-200/70 border border-accent-border max-w-4xl">
          <div className="flex items-center justify-between text-xs text-charcoal mb-2 font-medium">
            <span>
              {isFreeShipping ? (
                <span className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-sand-dark" />
                  You've unlocked complimentary worldwide shipping.
                </span>
              ) : (
                <span>
                  Add <strong className="text-charcoal">{formatPrice(amountNeeded)}</strong> more to receive complimentary delivery.
                </span>
              )}
            </span>
            <span className="text-[11px] font-semibold text-charcoal/70">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-ivory-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-charcoal transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Main Grid (Split 2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Items Table / List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-accent-border bg-ivory-50 divide-y divide-accent-border">
              {cart.map((item) => (
                <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  {/* Thumbnail & Title */}
                  <div className="flex gap-4 items-center">
                    <div
                      onClick={() => navigateTo('pdp', item.product.slug)}
                      className="w-20 h-24 sm:w-24 sm:h-32 bg-ivory-200 border border-accent-border overflow-hidden flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={item.product.images.main}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3
                        onClick={() => navigateTo('pdp', item.product.slug)}
                        className="font-serif text-lg sm:text-xl text-charcoal font-medium hover:text-sand-dark transition-colors cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-charcoal/60 font-light">
                        {item.selectedColor.name} · Size {item.selectedSize}
                      </p>
                      <p className="text-xs text-charcoal font-medium">
                        {formatPrice(item.product.price)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-accent-border/50">
                    <div className="flex items-center border border-accent-border bg-ivory">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="p-2 text-charcoal/70 hover:text-charcoal hover:bg-ivory-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-medium text-charcoal min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="p-2 text-charcoal/70 hover:text-charcoal hover:bg-ivory-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-sm font-semibold text-charcoal block">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-charcoal/50 hover:text-charcoal underline underline-offset-4 mt-0.5"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Back link & A Thoughtful Gesture Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-charcoal hover:text-sand-dark transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue shopping</span>
              </button>
            </div>

            {/* A Thoughtful Gesture Note from Figma Artboard 5 */}
            <div className="p-5 bg-ivory-200/50 border border-accent-border text-xs text-charcoal/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-sand-dark flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-medium text-charcoal block text-xs">
                  A thoughtful gesture.
                </strong>
                <p className="mt-1 text-charcoal/70 font-light leading-relaxed">
                  Every order is wrapped in our signature recyclable unbleached cotton packaging with a complimentary handwritten gift message available at checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 bg-ivory-50 border border-accent-border p-6 sm:p-8 space-y-5 sticky top-28">
            <h2 className="font-serif text-2xl text-charcoal font-normal border-b border-accent-border pb-4">
              Order summary
            </h2>

            <div className="space-y-3 text-xs text-charcoal/80 font-light">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} pieces)</span>
                <span className="font-medium text-charcoal">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated shipping</span>
                <span className="font-medium text-charcoal">
                  {isFreeShipping ? 'Complimentary' : formatPrice(1500)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & duties</span>
                <span className="text-charcoal/60">Included in prices</span>
              </div>

              <div className="pt-4 border-t border-accent-border flex justify-between text-base font-semibold text-charcoal">
                <span>Total</span>
                <span>{formatPrice(isFreeShipping ? cartTotal : cartTotal + 1500)}</span>
              </div>
              <p className="text-[11px] text-charcoal/50">
                Inclusive of standard domestic delivery and applicable tax.
              </p>
            </div>

            <button
              id="full-cart-checkout-btn"
              onClick={handleCheckout}
              className="w-full py-4 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2 group shadow-soft"
            >
              <span>Proceed to checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-charcoal/50 font-light">
                Need help? Contact our styling advisors at care@velora.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
