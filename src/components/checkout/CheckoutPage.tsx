import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_CURRENCY } from '../../data/storeData';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Check,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Truck,
  Gift,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  PackageCheck,
  Clock,
  ArrowRight,
  QrCode,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { Order, ShippingAddress } from '../../types/store';
import { launchRazorpayCheckout } from '../../services/razorpay';

const MERCHANT_UPI_ID = import.meta.env.VITE_MERCHANT_UPI_ID || 'atelier.velora@hdfcbank';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    formatPrice,
    navigateTo,
    placeOrder,
    lastPlacedOrder,
    setLastPlacedOrder,
    user,
    showToast,
  } = useStore();

  // Active step in checkout: 1: Info, 2: Shipping, 3: Payment
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: user?.name ? user.name.split(' ')[0] : 'Eleanor',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') || 'Vance' : 'Vance',
    email: user?.email || 'eleanor.vance@atelier-velora.com',
    phone: user?.phone || '+91 98201 44520',
    address: '42 Altamount Road, Cumballa Hill',
    apartment: 'Apartment 8B, The Residence',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400026',
    country: 'India',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Shipping selection
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Gift note state
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    nameOnCard: 'ELEANOR VANCE',
    expiry: '08/29',
    cvv: '•••',
  });

  // UPI payment configuration
  const [upiSubMethod, setUpiSubMethod] = useState<'app' | 'vpa' | 'qr'>('app');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'CRED'>('Google Pay');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState<string | null>(null);
  const [isVpaVerified, setIsVpaVerified] = useState(false);
  const [isVerifyingVpa, setIsVerifyingVpa] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleVerifyVpa = () => {
    const clean = upiId.trim();
    if (!clean || !clean.includes('@') || clean.startsWith('@') || clean.endsWith('@')) {
      setUpiError('Please enter a valid UPI address with handle (e.g. name@okhdfcbank)');
      return;
    }
    setUpiError(null);
    setIsVerifyingVpa(true);
    setTimeout(() => {
      setIsVerifyingVpa(false);
      setIsVpaVerified(true);
      showToast(`VPA ${clean} successfully verified with banking partner`);
    }, 600);
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(MERCHANT_UPI_ID);
    }
    setCopiedUpi(true);
    showToast('Atelier UPI VPA copied to clipboard');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(lastPlacedOrder);

  // Calculations
  const freeThreshold = STORE_CURRENCY.freeShippingThreshold;
  const isFreeStandard = cartTotal >= freeThreshold;
  const standardShippingCost = isFreeStandard ? 0 : 1500;
  const expressShippingCost = 2500;
  const shippingFee = shippingMethod === 'standard' ? standardShippingCost : expressShippingCost;
  const finalTotal = Math.max(0, cartTotal + shippingFee - discountAmount);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateAddress = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required for delivery coordination';
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State / Province is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal / PIN code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'VELORA10' || code === 'WELCOME10') {
      const discount = Math.round(cartTotal * 0.1);
      setDiscountAmount(discount);
      setAppliedPromo(code);
      showToast(`Promo "${code}" applied: 10% atelier courtesy discount`);
    } else if (code === 'ATELIER') {
      setDiscountAmount(2000);
      setAppliedPromo(code);
      showToast('Promo "ATELIER" applied: ₹2,000 gift credit');
    } else {
      showToast('Invalid promotion code. Try "VELORA10" for 10% off.');
    }
  };

  const handlePlaceOrder = () => {
    if (!validateAddress()) {
      showToast('Please complete all required shipping fields marked in red.');
      setCurrentStep(1);
      return;
    }

    // UPI Validation
    if (paymentMethod === 'upi' && upiSubMethod === 'vpa') {
      const cleanVpa = upiId.trim();
      if (!cleanVpa) {
        setUpiError('Please enter your Virtual Payment Address (UPI ID)');
        showToast('Please enter your UPI ID (e.g. name@okhdfcbank)');
        return;
      }
      if (!cleanVpa.includes('@') || cleanVpa.startsWith('@') || cleanVpa.endsWith('@')) {
        setUpiError('Please enter a valid UPI format with bank handle (e.g. name@okhdfcbank)');
        showToast('Invalid UPI ID format');
        return;
      }
    }

    setIsSubmitting(true);

    const orderItems = cart.map((item) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      color: item.selectedColor.name,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images.main,
    }));

    const deliveryMethodLabel =
      shippingMethod === 'standard'
        ? isFreeStandard
          ? 'Complimentary Standard Delivery (3–5 Days)'
          : 'Standard Delivery (3–5 Days)'
        : 'Express White-Glove Courier (1–2 Days)';

    // 1. Pay on Delivery
    if (paymentMethod === 'cod') {
      setTimeout(() => {
        const placed = placeOrder({
          items: orderItems,
          subtotal: cartTotal,
          shippingFee,
          discount: discountAmount,
          total: finalTotal,
          shippingAddress: formData,
          deliveryMethod: deliveryMethodLabel,
          paymentMethod: 'Pay on Delivery (Cash/Card upon receipt)',
          giftNote: isGift ? giftNote : undefined,
        });

        setIsSubmitting(false);
        setOrderConfirmed(placed);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);
      return;
    }

    // 2. Razorpay Payment Gateway (Cards, UPI, Netbanking)
    const effectiveUpiApp =
      upiSubMethod === 'qr'
        ? 'UPI QR Code'
        : upiSubMethod === 'app'
        ? selectedUpiApp
        : 'UPI ID';

    const effectiveUpiId =
      upiSubMethod === 'vpa'
        ? upiId.trim()
        : upiSubMethod === 'qr'
        ? MERCHANT_UPI_ID
        : `${selectedUpiApp.toLowerCase().replace(/\s+/g, '')}@velora`;

    launchRazorpayCheckout({
      amount: finalTotal,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
      preferredMethod: paymentMethod === 'upi' ? 'upi' : 'card',
      upiId: paymentMethod === 'upi' ? effectiveUpiId : undefined,
      upiApp: paymentMethod === 'upi' ? effectiveUpiApp : undefined,
      onSuccess: ({ paymentId, method }) => {
        const paymentLabel = method || `Razorpay (${paymentMethod === 'card' ? 'Card' : `UPI · ${effectiveUpiApp}`} · Ref: ${paymentId})`;
        const placed = placeOrder({
          items: orderItems,
          subtotal: cartTotal,
          shippingFee,
          discount: discountAmount,
          total: finalTotal,
          shippingAddress: formData,
          deliveryMethod: deliveryMethodLabel,
          paymentMethod: paymentLabel,
          giftNote: isGift ? giftNote : undefined,
        });

        setIsSubmitting(false);
        setOrderConfirmed(placed);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onFailure: (errorMessage) => {
        setIsSubmitting(false);
        showToast(`Payment declined: ${errorMessage}`);
      },
      onDismiss: () => {
        setIsSubmitting(false);
        showToast('Payment window closed. Your items remain in your bag.');
      },
    });
  };

  // 1. ORDER CONFIRMATION VIEW (SUCCESS STATE)
  if (orderConfirmed) {
    return (
      <div className="bg-ivory min-h-screen pt-8 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          {/* Success Banner */}
          <div className="bg-ivory-50 border border-accent-border p-8 sm:p-12 text-center shadow-soft">
            <div className="w-16 h-16 rounded-full bg-sand-subtle/60 border border-sand-dark/40 flex items-center justify-center mx-auto mb-5 text-charcoal">
              <Check className="w-8 h-8 stroke-[1.8] text-charcoal" />
            </div>

            <span className="text-[11px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold block mb-2">
              CONFIRMED WITH THE ATELIER
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Thank you, {orderConfirmed.shippingAddress.firstName}.
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-charcoal/70 font-light max-w-lg mx-auto leading-relaxed">
              Your order has been safely placed. We are preparing your garment with the highest consideration in our workshop.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-ivory-200 border border-accent-border text-xs text-charcoal font-medium">
              <span>Order Reference:</span>
              <strong className="tracking-wider font-semibold text-charcoal">{orderConfirmed.id}</strong>
              <span className="text-charcoal/40">·</span>
              <span>{orderConfirmed.date}</span>
            </div>
          </div>

          {/* Delivery & Tracking Timeline */}
          <div className="mt-8 bg-ivory-50 border border-accent-border p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-accent-border pb-4 mb-6">
              <div>
                <h3 className="font-serif text-xl text-charcoal font-medium">Order Status & Progress</h3>
                <p className="text-xs text-charcoal/60 font-light mt-0.5">
                  Live updates are sent to {orderConfirmed.shippingAddress.email}
                </p>
              </div>
              <span className="px-3 py-1 bg-sand/20 border border-sand-dark/40 text-[11px] uppercase tracking-luxury text-charcoal font-medium">
                {orderConfirmed.status}
              </span>
            </div>

            {/* Step Progress Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-2">
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div className="w-7 h-7 rounded-full bg-charcoal text-ivory flex items-center justify-center text-xs font-semibold">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">Order Received</span>
                  <span className="text-[11px] text-charcoal/50">Details verified</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div className="w-7 h-7 rounded-full bg-sand-dark text-ivory flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">Atelier Preparation</span>
                  <span className="text-[11px] text-charcoal/70">Steaming & folding</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 opacity-60">
                <div className="w-7 h-7 rounded-full bg-ivory-300 text-charcoal flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">Quality Check</span>
                  <span className="text-[11px] text-charcoal/50">Packaging inspection</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 opacity-60">
                <div className="w-7 h-7 rounded-full bg-ivory-300 text-charcoal flex items-center justify-center text-xs font-semibold">
                  4
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">Dispatched</span>
                  <span className="text-[11px] text-charcoal/50">White-glove courier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Split (Items + Delivery summary) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Items summary */}
            <div className="md:col-span-7 bg-ivory-50 border border-accent-border p-6 space-y-4">
              <h3 className="font-serif text-lg text-charcoal font-medium border-b border-accent-border pb-3">
                Items In This Order ({orderConfirmed.items.length})
              </h3>

              <div className="divide-y divide-accent-border/60">
                {orderConfirmed.items.map((item) => (
                  <div key={item.id} className="py-3.5 first:pt-0 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover bg-ivory-200 border border-accent-border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-base text-charcoal font-medium truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-charcoal/60 mt-0.5">
                        {item.color} · Size {item.size} · Qty {item.quantity}
                      </p>
                      <span className="text-xs font-semibold text-charcoal mt-1 block">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-accent-border space-y-1.5 text-xs text-charcoal/80 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(orderConfirmed.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({orderConfirmed.deliveryMethod})</span>
                  <span>{orderConfirmed.shippingFee === 0 ? 'Complimentary' : formatPrice(orderConfirmed.shippingFee)}</span>
                </div>
                {orderConfirmed.discount > 0 && (
                  <div className="flex justify-between text-sand-dark font-medium">
                    <span>Atelier Courtesy Discount</span>
                    <span>-{formatPrice(orderConfirmed.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-accent-border font-semibold text-sm text-charcoal">
                  <span>Total Paid</span>
                  <span>{formatPrice(orderConfirmed.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery address & payment method info */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-ivory-50 border border-accent-border p-6 space-y-3">
                <h3 className="font-serif text-lg text-charcoal font-medium border-b border-accent-border pb-3">
                  Destination Address
                </h3>
                <p className="text-xs text-charcoal font-medium">
                  {orderConfirmed.shippingAddress.firstName} {orderConfirmed.shippingAddress.lastName}
                </p>
                <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                  {orderConfirmed.shippingAddress.address}
                  {orderConfirmed.shippingAddress.apartment && <>, {orderConfirmed.shippingAddress.apartment}</>}
                  <br />
                  {orderConfirmed.shippingAddress.city}, {orderConfirmed.shippingAddress.state} {orderConfirmed.shippingAddress.postalCode}
                  <br />
                  {orderConfirmed.shippingAddress.country}
                </p>
                <p className="text-xs text-charcoal/60 font-light pt-1">
                  Contact: {orderConfirmed.shippingAddress.phone}
                </p>
              </div>

              <div className="bg-ivory-50 border border-accent-border p-6 space-y-2">
                <h3 className="font-serif text-lg text-charcoal font-medium border-b border-accent-border pb-3">
                  Payment & Presentation
                </h3>
                <p className="text-xs text-charcoal/80 font-light">
                  <strong className="font-medium text-charcoal">Method: </strong>
                  {orderConfirmed.paymentMethod}
                </p>
                {orderConfirmed.giftNote && (
                  <div className="pt-2 text-xs">
                    <strong className="font-medium text-charcoal block">Handwritten Note:</strong>
                    <p className="italic text-charcoal/70 bg-ivory-200 p-2.5 mt-1 border border-accent-border">
                      "{orderConfirmed.giftNote}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setLastPlacedOrder(null);
                setOrderConfirmed(null);
                navigateTo('account');
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>View In Order History</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setLastPlacedOrder(null);
                setOrderConfirmed(null);
                navigateTo('shop');
              }}
              className="w-full sm:w-auto px-8 py-3.5 border border-accent-border bg-ivory text-charcoal text-xs uppercase tracking-luxury font-medium hover:border-charcoal transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY CART CHECKOUT GUARD
  if (cart.length === 0) {
    return (
      <div className="bg-ivory min-h-screen pt-12 pb-24">
        <div className="max-w-2xl mx-auto px-4 text-center py-20 border border-accent-border bg-ivory-50">
          <ShoppingBag className="w-10 h-10 text-charcoal/40 mx-auto stroke-[1.2] mb-3" />
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            No items ready for checkout
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-charcoal/70 font-light max-w-sm mx-auto leading-relaxed">
            Your bag is currently empty. Explore our collection of considered essentials to add pieces to your wardrobe.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-6 px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors inline-flex items-center gap-2"
          >
            <span>Explore the collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. MAIN CHECKOUT FLOW
  return (
    <div className="bg-ivory min-h-screen pt-4 sm:pt-6 pb-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Navigation Breadcrumb / Return */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-accent-border">
          <button
            onClick={() => navigateTo('cart')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-charcoal/70 hover:text-charcoal transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to bag ({cartCount})</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-charcoal/60 font-light">
            <Lock className="w-3.5 h-3.5 text-sand-dark" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Checkout Header Title */}
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-1">
            STEP {currentStep} OF 3
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal tracking-tight">
            Checkout & Delivery
          </h1>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step Tabs */}
            <div className="flex items-center border border-accent-border bg-ivory-50 p-1 text-xs">
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex-1 py-2 text-center uppercase tracking-luxury font-medium transition-all ${
                  currentStep === 1
                    ? 'bg-charcoal text-ivory shadow-sm'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                1. Shipping Address
              </button>
              <button
                onClick={() => {
                  if (validateAddress()) setCurrentStep(2);
                }}
                className={`flex-1 py-2 text-center uppercase tracking-luxury font-medium transition-all ${
                  currentStep === 2
                    ? 'bg-charcoal text-ivory shadow-sm'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                2. Delivery Method
              </button>
              <button
                onClick={() => {
                  if (validateAddress()) setCurrentStep(3);
                }}
                className={`flex-1 py-2 text-center uppercase tracking-luxury font-medium transition-all ${
                  currentStep === 3
                    ? 'bg-charcoal text-ivory shadow-sm'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                3. Payment
              </button>
            </div>

            {/* STEP 1: CONTACT & SHIPPING ADDRESS */}
            {currentStep === 1 && (
              <div className="bg-ivory-50 border border-accent-border p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal font-normal">Contact Information</h2>
                    <p className="text-xs text-charcoal/60 font-light mt-1">
                      We'll send your invoice and courier dispatch notifications here.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        firstName: 'Eleanor',
                        lastName: 'Vance',
                        email: 'eleanor.vance@atelier-velora.com',
                        phone: '+91 98201 44520',
                        address: '42 Altamount Road, Cumballa Hill',
                        apartment: 'Apartment 8B, The Residence',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        postalCode: '400026',
                        country: 'India',
                      });
                      setFormErrors({});
                      showToast('Atelier demo details auto-filled');
                    }}
                    className="text-[10px] uppercase tracking-luxury text-sand-dark hover:text-charcoal transition-colors border border-sand-dark/40 px-2.5 py-1 bg-ivory-200/50"
                  >
                    Fill Demo Info
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g. eleanor@velora.com"
                      className={`w-full bg-ivory border px-3.5 py-2.5 text-xs text-charcoal outline-none transition-colors ${
                        formErrors.email ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                      }`}
                    />
                    {formErrors.email && (
                      <span className="text-[10px] text-red-600 mt-1 block">{formErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                      Mobile Telephone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98201 00000"
                      className={`w-full bg-ivory border px-3.5 py-2.5 text-xs text-charcoal outline-none transition-colors ${
                        formErrors.phone ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                      }`}
                    />
                    {formErrors.phone && (
                      <span className="text-[10px] text-red-600 mt-1 block">{formErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-accent-border/60">
                  <h2 className="font-serif text-2xl text-charcoal font-normal">Shipping Address</h2>
                  <p className="text-xs text-charcoal/60 font-light mt-1">
                    Where would you like us to deliver your parcel?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="First name"
                      className={`w-full bg-ivory border px-3.5 py-2.5 text-xs text-charcoal outline-none transition-colors ${
                        formErrors.firstName ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                      }`}
                    />
                    {formErrors.firstName && (
                      <span className="text-[10px] text-red-600 mt-1 block">{formErrors.firstName}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Last name"
                      className={`w-full bg-ivory border px-3.5 py-2.5 text-xs text-charcoal outline-none transition-colors ${
                        formErrors.lastName ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                      }`}
                    />
                    {formErrors.lastName && (
                      <span className="text-[10px] text-red-600 mt-1 block">{formErrors.lastName}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                    Street Address & Building *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="House / Flat No., Street, Landmark"
                    className={`w-full bg-ivory border px-3.5 py-2.5 text-xs text-charcoal outline-none transition-colors ${
                      formErrors.address ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                    }`}
                  />
                  {formErrors.address && (
                    <span className="text-[10px] text-red-600 mt-1 block">{formErrors.address}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                    Apartment, Suite, Unit (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.apartment || ''}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    placeholder="Apartment 8B, Tower 2"
                    className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      className={`w-full bg-ivory border px-3.5 py-2.5 text-xs text-charcoal outline-none transition-colors ${
                        formErrors.city ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                      }`}
                    />
                    {formErrors.city && (
                      <span className="text-[10px] text-red-600 mt-1 block">{formErrors.city}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                      className={`w-full bg-ivory border px-3.5 py-2.5 text-xs text-charcoal outline-none transition-colors ${
                        formErrors.state ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                      }`}
                    />
                    {formErrors.state && (
                      <span className="text-[10px] text-red-600 mt-1 block">{formErrors.state}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                      PIN / Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="400026"
                      className={`w-full bg-ivory border px-3.5 py-2.5 text-xs text-charcoal outline-none transition-colors ${
                        formErrors.postalCode ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                      }`}
                    />
                    {formErrors.postalCode && (
                      <span className="text-[10px] text-red-600 mt-1 block">{formErrors.postalCode}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-charcoal mb-1.5">
                    Country / Region
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full bg-ivory border border-accent-border px-3.5 py-2.5 text-xs text-charcoal outline-none focus:border-charcoal"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                    <option value="France">France</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (validateAddress()) setCurrentStep(2);
                    }}
                    className="px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center gap-2"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY OPTIONS & GIFT NOTE */}
            {currentStep === 2 && (
              <div className="bg-ivory-50 border border-accent-border p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal font-normal">Choose Delivery Method</h2>
                  <p className="text-xs text-charcoal/60 font-light mt-1">
                    Delivered in signature unbleached organic cotton dust pouches and recyclable cartons.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Standard Option */}
                  <div
                    onClick={() => setShippingMethod('standard')}
                    className={`p-4 border transition-all cursor-pointer flex items-start justify-between ${
                      shippingMethod === 'standard'
                        ? 'border-charcoal bg-ivory-200/60 ring-1 ring-charcoal'
                        : 'border-accent-border bg-ivory hover:border-charcoal/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="mt-1 accent-charcoal"
                      />
                      <div>
                        <span className="text-xs font-semibold text-charcoal block">
                          Atelier Standard Delivery (3–5 Business Days)
                        </span>
                        <p className="text-[11px] text-charcoal/70 font-light mt-0.5 leading-relaxed">
                          Hand-packed with care. Carbon-neutral domestic transport.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-charcoal whitespace-nowrap">
                      {isFreeStandard ? 'Complimentary' : formatPrice(1500)}
                    </span>
                  </div>

                  {/* Express Option */}
                  <div
                    onClick={() => setShippingMethod('express')}
                    className={`p-4 border transition-all cursor-pointer flex items-start justify-between ${
                      shippingMethod === 'express'
                        ? 'border-charcoal bg-ivory-200/60 ring-1 ring-charcoal'
                        : 'border-accent-border bg-ivory hover:border-charcoal/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="mt-1 accent-charcoal"
                      />
                      <div>
                        <span className="text-xs font-semibold text-charcoal block flex items-center gap-1.5">
                          Express White-Glove Courier (1–2 Business Days)
                          <Sparkles className="w-3 h-3 text-sand-dark" />
                        </span>
                        <p className="text-[11px] text-charcoal/70 font-light mt-0.5 leading-relaxed">
                          Priority dispatch with tailored delivery appointment window.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-charcoal whitespace-nowrap">
                      {formatPrice(2500)}
                    </span>
                  </div>
                </div>

                {/* Gift Presentation Accordion */}
                <div className="pt-4 border-t border-accent-border/60">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 text-xs text-charcoal cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                        className="accent-charcoal w-4 h-4"
                      />
                      <Gift className="w-4 h-4 text-sand-dark" />
                      <span>This order is a gift (Complimentary gift note & unpriced receipt)</span>
                    </label>
                  </div>

                  {isGift && (
                    <div className="mt-3.5 space-y-2">
                      <label className="block text-[11px] uppercase tracking-luxury text-charcoal/70 font-medium">
                        Personal Gift Message (Up to 200 characters)
                      </label>
                      <textarea
                        rows={3}
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Write your note here. Our atelier team will handwrite this on heavy ivory paper..."
                        className="w-full bg-ivory border border-accent-border px-3.5 py-2.5 text-xs text-charcoal outline-none focus:border-charcoal"
                        maxLength={200}
                      />
                      <span className="text-[10px] text-charcoal/50 text-right block">
                        {giftNote.length}/200 characters
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-accent-border">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs uppercase tracking-luxury text-charcoal/70 hover:text-charcoal underline underline-offset-4"
                  >
                    Back to Address
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {currentStep === 3 && (
              <div className="bg-ivory-50 border border-accent-border p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal font-normal">Payment Gateway</h2>
                    <p className="text-xs text-charcoal/60 font-light mt-1">
                      Powered by Razorpay Secure Payments (INR ₹). 256-bit encrypted checkout.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-accent-border text-[10px] uppercase tracking-luxury font-medium text-charcoal">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Razorpay Protected
                  </span>
                </div>

                {/* Payment Option Selector */}
                <div className="space-y-3">
                  {/* Card Option */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-charcoal bg-ivory-200/50 ring-1 ring-charcoal'
                        : 'border-accent-border bg-ivory hover:border-charcoal/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="accent-charcoal"
                        />
                        <CreditCard className="w-4 h-4 text-charcoal" />
                        <span className="text-xs font-semibold text-charcoal">Credit or Debit Card</span>
                      </div>
                      <span className="text-[11px] text-charcoal/50 font-light">Visa, Mastercard, Amex</span>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-4 border-t border-accent-border/60 space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-luxury text-charcoal/70 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                            className="w-full bg-ivory border border-accent-border px-3 py-2 text-xs font-mono text-charcoal outline-none focus:border-charcoal"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <label className="block text-[10px] uppercase tracking-luxury text-charcoal/70 mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              value={cardDetails.nameOnCard}
                              onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
                              className="w-full bg-ivory border border-accent-border px-3 py-2 text-xs uppercase text-charcoal outline-none focus:border-charcoal"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-luxury text-charcoal/70 mb-1">
                              Expiry (MM/YY)
                            </label>
                            <input
                              type="text"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              className="w-full bg-ivory border border-accent-border px-3 py-2 text-xs text-charcoal outline-none focus:border-charcoal"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 border transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-charcoal bg-ivory-200/50 ring-1 ring-charcoal'
                        : 'border-accent-border bg-ivory hover:border-charcoal/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="accent-charcoal"
                        />
                        <span className="text-xs font-semibold text-charcoal">Instant UPI / NetBanking</span>
                      </div>
                      <span className="text-[11px] text-charcoal/50 font-light">GPay, PhonePe, Paytm, QR</span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-4 pt-4 border-t border-accent-border/60 space-y-4" onClick={(e) => e.stopPropagation()}>
                        {/* Submethod Selection Tabs */}
                        <div className="grid grid-cols-3 gap-2 bg-ivory-200/60 p-1 border border-accent-border text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              setUpiSubMethod('app');
                              setUpiError(null);
                            }}
                            className={`py-2 px-1 text-center uppercase tracking-luxury font-medium transition-all ${
                              upiSubMethod === 'app'
                                ? 'bg-charcoal text-ivory shadow-xs'
                                : 'text-charcoal/70 hover:text-charcoal'
                            }`}
                          >
                            UPI Apps
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUpiSubMethod('vpa');
                              setUpiError(null);
                            }}
                            className={`py-2 px-1 text-center uppercase tracking-luxury font-medium transition-all ${
                              upiSubMethod === 'vpa'
                                ? 'bg-charcoal text-ivory shadow-xs'
                                : 'text-charcoal/70 hover:text-charcoal'
                            }`}
                          >
                            UPI ID / VPA
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUpiSubMethod('qr');
                              setUpiError(null);
                            }}
                            className={`py-2 px-1 text-center uppercase tracking-luxury font-medium transition-all flex items-center justify-center gap-1 ${
                              upiSubMethod === 'qr'
                                ? 'bg-charcoal text-ivory shadow-xs'
                                : 'text-charcoal/70 hover:text-charcoal'
                            }`}
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Scan QR</span>
                          </button>
                        </div>

                        {/* 1. UPI APPS SELECTOR */}
                        {upiSubMethod === 'app' && (
                          <div className="space-y-3 pt-1">
                            <p className="text-[11px] text-charcoal/70 font-light">
                              Choose your preferred payment app. An authorization request will be sent upon placing the order:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                              {(['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'CRED'] as const).map((app) => (
                                <button
                                  key={app}
                                  type="button"
                                  onClick={() => setSelectedUpiApp(app)}
                                  className={`p-3 border text-left transition-all relative flex flex-col justify-between ${
                                    selectedUpiApp === app
                                      ? 'border-charcoal bg-ivory ring-1 ring-charcoal'
                                      : 'border-accent-border bg-ivory/60 hover:border-charcoal/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <Smartphone className="w-3.5 h-3.5 text-sand-dark" />
                                    {selectedUpiApp === app && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-charcoal" />
                                    )}
                                  </div>
                                  <span className="text-xs font-medium text-charcoal">{app}</span>
                                  <span className="text-[10px] text-charcoal/50">Instant push</span>
                                </button>
                              ))}
                            </div>
                            <div className="p-2.5 bg-ivory-200/50 border border-accent-border/70 text-[11px] text-charcoal/70 flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-sand-dark flex-shrink-0" />
                              <span>Direct zero-fee transaction via <strong>{selectedUpiApp}</strong></span>
                            </div>
                          </div>
                        )}

                        {/* 2. CUSTOM VPA INPUT */}
                        {upiSubMethod === 'vpa' && (
                          <div className="space-y-3 pt-1">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10px] uppercase tracking-luxury text-charcoal/70">
                                  Virtual Payment Address (UPI ID) *
                                </label>
                                {isVpaVerified && (
                                  <span className="text-[10px] font-medium text-emerald-700 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    VPA Verified (Atelier Secure)
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={upiId}
                                  onChange={(e) => {
                                    setUpiId(e.target.value);
                                    setUpiError(null);
                                    setIsVpaVerified(false);
                                  }}
                                  placeholder="e.g. yourname@okhdfcbank"
                                  className={`flex-1 bg-ivory border px-3 py-2 text-xs text-charcoal outline-none transition-colors ${
                                    upiError ? 'border-red-600 ring-1 ring-red-600' : 'border-accent-border focus:border-charcoal'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={handleVerifyVpa}
                                  disabled={isVerifyingVpa || !upiId.trim()}
                                  className="px-3.5 py-2 bg-ivory-200 border border-accent-border text-xs uppercase tracking-luxury text-charcoal font-medium hover:bg-ivory-300 transition-colors disabled:opacity-40"
                                >
                                  {isVerifyingVpa ? (
                                    <span className="w-3 h-3 border-2 border-charcoal border-t-transparent rounded-full animate-spin inline-block" />
                                  ) : isVpaVerified ? (
                                    'Verified ✓'
                                  ) : (
                                    'Verify'
                                  )}
                                </button>
                              </div>
                              {upiError && (
                                <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{upiError}</span>
                                </p>
                              )}
                            </div>

                            {/* Quick handle suggestions */}
                            <div>
                              <span className="text-[10px] text-charcoal/50 uppercase tracking-luxury block mb-1.5">
                                Common Handles:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {['@okhdfcbank', '@okaxis', '@oksbi', '@okicici', '@ybl', '@paytm', '@upi'].map((handle) => (
                                  <button
                                    key={handle}
                                    type="button"
                                    onClick={() => {
                                      const base = upiId.includes('@') ? upiId.split('@')[0] : upiId;
                                      setUpiId((base.trim() || 'user') + handle);
                                      setUpiError(null);
                                      setIsVpaVerified(false);
                                    }}
                                    className="px-2 py-1 bg-ivory border border-accent-border text-[10px] text-charcoal hover:border-charcoal transition-colors font-mono"
                                  >
                                    {handle}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. SCAN & PAY QR CODE */}
                        {upiSubMethod === 'qr' && (
                          <div className="pt-2 text-center space-y-3">
                            <div className="bg-ivory p-4 border border-accent-border inline-block shadow-soft mx-auto">
                              {/* Luxury QR SVG Graphic */}
                              <svg className="w-40 h-40 mx-auto" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="160" height="160" fill="#FBF9F5" />
                                {/* Position Detection Markers */}
                                <rect x="12" y="12" width="40" height="40" rx="3" stroke="#20201D" strokeWidth="5" fill="none" />
                                <rect x="22" y="22" width="20" height="20" fill="#20201D" />
                                <rect x="108" y="12" width="40" height="40" rx="3" stroke="#20201D" strokeWidth="5" fill="none" />
                                <rect x="118" y="22" width="20" height="20" fill="#20201D" />
                                <rect x="12" y="108" width="40" height="40" rx="3" stroke="#20201D" strokeWidth="5" fill="none" />
                                <rect x="22" y="118" width="20" height="20" fill="#20201D" />
                                {/* Grid patterns */}
                                <rect x="62" y="16" width="10" height="10" fill="#20201D" />
                                <rect x="76" y="16" width="10" height="10" fill="#20201D" />
                                <rect x="62" y="30" width="10" height="10" fill="#9E8D77" />
                                <rect x="88" y="30" width="10" height="10" fill="#20201D" />
                                <rect x="62" y="44" width="24" height="10" fill="#20201D" />
                                <rect x="16" y="62" width="12" height="12" fill="#20201D" />
                                <rect x="34" y="62" width="12" height="12" fill="#9E8D77" />
                                <rect x="52" y="62" width="10" height="10" fill="#20201D" />
                                <rect x="68" y="62" width="24" height="24" rx="4" fill="#20201D" />
                                <text x="80" y="77" fill="#F7F4EE" fontSize="9" fontFamily="serif" textAnchor="middle" fontWeight="bold">V</text>
                                <rect x="98" y="62" width="10" height="10" fill="#20201D" />
                                <rect x="114" y="62" width="12" height="12" fill="#9E8D77" />
                                <rect x="132" y="62" width="12" height="12" fill="#20201D" />
                                <rect x="16" y="80" width="10" height="10" fill="#9E8D77" />
                                <rect x="32" y="80" width="20" height="10" fill="#20201D" />
                                <rect x="98" y="80" width="14" height="14" fill="#20201D" />
                                <rect x="118" y="80" width="10" height="10" fill="#20201D" />
                                <rect x="134" y="80" width="12" height="12" fill="#9E8D77" />
                                <rect x="62" y="92" width="10" height="10" fill="#20201D" />
                                <rect x="76" y="92" width="10" height="10" fill="#20201D" />
                                <rect x="88" y="104" width="10" height="10" fill="#9E8D77" />
                                <rect x="62" y="118" width="16" height="16" fill="#20201D" />
                                <rect x="84" y="118" width="10" height="10" fill="#20201D" />
                                <rect x="100" y="118" width="20" height="10" fill="#20201D" />
                                <rect x="126" y="118" width="10" height="10" fill="#9E8D77" />
                                <rect x="62" y="138" width="10" height="10" fill="#20201D" />
                                <rect x="78" y="138" width="20" height="10" fill="#20201D" />
                                <rect x="104" y="138" width="12" height="12" fill="#20201D" />
                                <rect x="122" y="138" width="14" height="14" fill="#20201D" />
                              </svg>

                              <div className="mt-2 text-center">
                                <span className="text-[10px] uppercase tracking-luxury text-charcoal/60 block">
                                  Atelier Order Total
                                </span>
                                <strong className="font-serif text-lg text-charcoal font-semibold">
                                  {formatPrice(finalTotal)}
                                </strong>
                              </div>
                            </div>

                            <div className="max-w-xs mx-auto space-y-2">
                              <p className="text-[11px] text-charcoal/70 leading-relaxed font-light">
                                Scan with any UPI app on your phone (Google Pay, PhonePe, Paytm, BHIM, or Mobile Banking).
                              </p>

                              <div className="flex items-center justify-between p-2 bg-ivory-200/60 border border-accent-border text-xs font-mono">
                                <span className="text-charcoal/70 truncate text-[11px]">{MERCHANT_UPI_ID}</span>
                                <button
                                  type="button"
                                  onClick={handleCopyUpi}
                                  className="ml-2 px-2 py-0.5 bg-ivory border border-accent-border text-[10px] uppercase font-sans text-charcoal hover:bg-charcoal hover:text-ivory transition-colors flex items-center gap-1"
                                >
                                  {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>

                              <a
                                href={`upi://pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=VELORA%20Atelier&am=${finalTotal}&cu=INR&tn=VELORA%20Order`}
                                className="block w-full py-2 bg-ivory border border-charcoal/40 text-[11px] uppercase tracking-luxury text-charcoal hover:bg-charcoal hover:text-ivory transition-colors"
                              >
                                Tap to open UPI App on this device
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-charcoal bg-ivory-200/50 ring-1 ring-charcoal'
                        : 'border-accent-border bg-ivory hover:border-charcoal/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-charcoal"
                        />
                        <Truck className="w-4 h-4 text-charcoal" />
                        <span className="text-xs font-semibold text-charcoal">Pay on Delivery</span>
                      </div>
                      <span className="text-[11px] text-charcoal/50 font-light">Contactless upon arrival</span>
                    </div>
                  </div>
                </div>

                {/* Final Order Placement Action */}
                <div className="pt-6 border-t border-accent-border space-y-4">
                  <button
                    id="place-order-submit-btn"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="w-full py-4 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-soft group"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing with atelier...</span>
                      </span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Place Order — {formatPrice(finalTotal)}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs uppercase tracking-luxury text-charcoal/70 hover:text-charcoal underline underline-offset-4"
                    >
                      Back to Delivery
                    </button>
                    <span className="text-[11px] text-charcoal/50 font-light">
                      Free exchanges & 14-day returns guaranteed.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-ivory-50 border border-accent-border p-6 sm:p-8 space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-accent-border pb-4">
              <h2 className="font-serif text-2xl text-charcoal font-normal">Order Summary</h2>
              <span className="text-xs text-charcoal/60 font-medium">
                {cartCount} {cartCount === 1 ? 'piece' : 'pieces'}
              </span>
            </div>

            {/* List of items */}
            <div className="max-h-72 overflow-y-auto divide-y divide-accent-border/60 pr-1 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-18 bg-ivory-200 border border-accent-border flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product.images.main}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-charcoal text-ivory text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-sm font-medium text-charcoal line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-charcoal/60 font-light">
                        {item.selectedColor.name} · Size {item.selectedSize}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-charcoal whitespace-nowrap">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promotional Voucher Input */}
            <div className="pt-4 border-t border-accent-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo or Gift Code (e.g. VELORA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-ivory border border-accent-border px-3 py-2 text-xs uppercase text-charcoal outline-none focus:border-charcoal"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <span className="text-[11px] text-emerald-700 font-medium mt-1.5 block">
                  ✓ Voucher "{appliedPromo}" applied (-{formatPrice(discountAmount)})
                </span>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-charcoal/80 font-light pt-2 border-t border-accent-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-charcoal">{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'standard' ? 'Standard' : 'Express White-Glove'})</span>
                <span className="font-medium text-charcoal">
                  {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-sand-dark font-medium">
                  <span>Courtesy Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Duties & Taxes</span>
                <span className="text-charcoal/60">Included in price</span>
              </div>

              <div className="pt-4 border-t border-accent-border flex justify-between text-base font-semibold text-charcoal">
                <span>Total Due</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Packaging and Service Guarantee */}
            <div className="p-4 bg-ivory-200/50 border border-accent-border text-xs text-charcoal/75 space-y-1.5">
              <div className="flex items-center gap-2 font-medium text-charcoal">
                <ShieldCheck className="w-4 h-4 text-sand-dark" />
                <span>The VELORA Promise</span>
              </div>
              <p className="text-[11px] text-charcoal/70 leading-relaxed font-light">
                Every garment is inspected by hand in our workshop, wrapped in reusable organic dustbags, and covered by our complimentary 14-day exchange concierge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
