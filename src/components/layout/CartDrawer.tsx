import React from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_CURRENCY } from '../../data/storeData';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  onCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    isCartOpen,
    closeCart,
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    formatPrice,
    currency,
    navigateTo,
  } = useStore();

  if (!isCartOpen) return null;

  const freeThreshold = STORE_CURRENCY.freeShippingThreshold;
  const isFreeShipping = cartTotal >= freeThreshold;
  const amountNeeded = Math.max(0, freeThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-ivory shadow-drawer flex flex-col justify-between border-l border-accent-border">
          {/* Header */}
          <div className="px-6 py-5 border-b border-accent-border flex items-center justify-between bg-ivory-50">
            <div>
              <h2 className="font-serif text-2xl text-charcoal font-normal tracking-wide">
                Your bag
              </h2>
              <p className="text-xs text-charcoal/60 mt-0.5 tracking-wider uppercase font-medium">
                {cartCount} {cartCount === 1 ? 'considered piece' : 'considered pieces'}
              </p>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 -mr-2 text-charcoal hover:text-charcoal/60 transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3.5 bg-ivory-200/60 border-b border-accent-border">
            <div className="flex items-center justify-between text-xs text-charcoal mb-1.5 font-medium">
              <span>
                {isFreeShipping ? (
                  <span className="flex items-center gap-1.5 text-charcoal font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-sand-dark" />
                    Complimentary worldwide shipping unlocked
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-charcoal">{formatPrice(amountNeeded)}</strong> more for complimentary shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] text-charcoal/60 font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-ivory-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-charcoal transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 divide-y divide-accent-border/60">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <span className="font-serif text-3xl text-charcoal/40 mb-2 italic">Empty</span>
                <p className="text-sm text-charcoal/70 max-w-xs font-light">
                  Your wardrobe bag is currently empty. Explore our collection to discover pieces made to endure.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigateTo('shop');
                  }}
                  className="mt-6 px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-6 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 sm:w-24 sm:h-32 bg-ivory-200 overflow-hidden flex-shrink-0 border border-accent-border/80">
                    <img
                      src={item.product.images.main}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-serif text-base sm:text-lg text-charcoal font-medium leading-snug">
                          {item.product.name}
                        </h3>
                        <span className="font-sans text-xs sm:text-sm font-semibold text-charcoal whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>

                      <p className="text-xs text-charcoal/60 mt-1">
                        {item.selectedColor.name} · Size {item.selectedSize}
                      </p>
                    </div>

                    {/* Quantity controls and delete */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-accent-border bg-ivory-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-charcoal/70 hover:text-charcoal hover:bg-ivory-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-charcoal min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-charcoal/70 hover:text-charcoal hover:bg-ivory-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        className="text-xs text-charcoal/50 hover:text-charcoal underline underline-offset-4 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Thoughtful Gesture note from Figma */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-ivory-50 border-t border-accent-border/70 text-xs text-charcoal/75 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sand-dark flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-medium text-charcoal">A thoughtful gesture:</strong>
                <p className="font-light text-[11px] leading-relaxed mt-0.5 text-charcoal/70">
                  Every order is wrapped in signature recyclable packaging with a complimentary handwritten note.
                </p>
              </div>
            </div>
          )}

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="px-6 py-5 border-t border-accent-border bg-ivory-50 space-y-4">
              <div className="space-y-1.5 text-xs text-charcoal/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-charcoal">
                    {isFreeShipping ? 'Complimentary' : formatPrice(1500)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-accent-border/60 text-sm font-semibold text-charcoal">
                  <span>Total</span>
                  <span>{formatPrice(isFreeShipping ? cartTotal : cartTotal + 1500)}</span>
                </div>
                <p className="text-[10px] text-charcoal/50 pt-0.5">
                  Taxes and duties calculated during final checkout step.
                </p>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={() => {
                  closeCart();
                  if (onCheckout) {
                    onCheckout();
                  } else {
                    navigateTo('checkout');
                  }
                }}
                className="w-full py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => {
                    closeCart();
                    navigateTo('cart');
                  }}
                  className="text-charcoal/80 hover:text-charcoal underline underline-offset-4 font-medium"
                >
                  View full bag ({cartCount})
                </button>
                <button
                  onClick={closeCart}
                  className="text-charcoal/60 hover:text-charcoal underline underline-offset-4 font-light"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
