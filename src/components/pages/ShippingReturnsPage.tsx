import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, RotateCcw, ShieldCheck, Clock, Package, Check, ArrowRight } from 'lucide-react';

export const ShippingReturnsPage: React.FC = () => {
  const { navigateTo } = useStore();

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
            <li className="text-charcoal font-medium">Shipping & Returns Policy</li>
          </ol>
        </nav>

        {/* Title */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold block mb-2">
            ATELIER LOGISTICS
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-charcoal tracking-tight">
            Shipping & Returns
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
            Considered from the moment your piece leaves our workshop to its arrival at your door. We provide carbon-neutral transit, white-glove couriers, and a seamless 14-day exchange concierge.
          </p>
        </div>

        {/* SECTION 1: SHIPPING & DELIVERY SCHEDULE */}
        <div className="pb-16 border-b border-accent-border space-y-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-1">
              WORLDWIDE DISPATCH
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
              Delivery Options & Schedules
            </h2>
          </div>

          {/* Delivery Table */}
          <div className="overflow-x-auto border border-accent-border bg-ivory-50">
            <table className="w-full text-left text-xs text-charcoal divide-y divide-accent-border">
              <thead className="bg-ivory-200/70 text-[11px] uppercase tracking-luxury font-medium text-charcoal/80">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Destination</th>
                  <th className="py-3.5 px-4 sm:px-6">Service Level</th>
                  <th className="py-3.5 px-4 sm:px-6">Transit Time</th>
                  <th className="py-3.5 px-4 sm:px-6">Rates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent-border/60 font-light">
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-medium">India (Domestic)</td>
                  <td className="py-4 px-4 sm:px-6">Standard Atelier Delivery</td>
                  <td className="py-4 px-4 sm:px-6">3–5 Business Days</td>
                  <td className="py-4 px-4 sm:px-6">Complimentary over ₹10,000 (else ₹1,500)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-medium">India (Metro Express)</td>
                  <td className="py-4 px-4 sm:px-6">Express White-Glove Courier</td>
                  <td className="py-4 px-4 sm:px-6">1–2 Business Days</td>
                  <td className="py-4 px-4 sm:px-6">₹2,500 flat fee</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-medium">United States & Canada</td>
                  <td className="py-4 px-4 sm:px-6">DHL Express Worldwide</td>
                  <td className="py-4 px-4 sm:px-6">7–10 Business Days</td>
                  <td className="py-4 px-4 sm:px-6">Complimentary over $150 USD</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-medium">United Kingdom & Europe</td>
                  <td className="py-4 px-4 sm:px-6">DHL Express Priority</td>
                  <td className="py-4 px-4 sm:px-6">7–10 Business Days</td>
                  <td className="py-4 px-4 sm:px-6">Complimentary over €140 EUR</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-medium">Middle East (UAE, Qatar, Saudi)</td>
                  <td className="py-4 px-4 sm:px-6">Aramex Premium Courier</td>
                  <td className="py-4 px-4 sm:px-6">5–8 Business Days</td>
                  <td className="py-4 px-4 sm:px-6">Complimentary over 550 AED</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Packaging details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 bg-ivory-50 border border-accent-border space-y-2">
              <Package className="w-5 h-5 text-sand-dark" />
              <h3 className="font-serif text-base text-charcoal font-medium">
                Plastic-Free Packaging
              </h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Garments are protected inside breathable, unbleached organic cotton dust pouches and recyclable cartons.
              </p>
            </div>

            <div className="p-5 bg-ivory-50 border border-accent-border space-y-2">
              <ShieldCheck className="w-5 h-5 text-sand-dark" />
              <h3 className="font-serif text-base text-charcoal font-medium">
                100% Insured Transit
              </h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Every shipment is covered by comprehensive transit insurance and requires an OTP or physical signature upon handover.
              </p>
            </div>

            <div className="p-5 bg-ivory-50 border border-accent-border space-y-2">
              <Clock className="w-5 h-5 text-sand-dark" />
              <h3 className="font-serif text-base text-charcoal font-medium">
                Real-Time Tracking
              </h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Receive direct courier link updates via SMS and email from dispatch to arrival.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: 14-DAY RETURN & EXCHANGE POLICY */}
        <div className="pt-16 pb-16 space-y-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-1">
              CONSIDERED ASSURANCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
              14-Day Hassle-Free Returns & Exchanges
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-charcoal/70 font-light max-w-2xl leading-relaxed">
              We want you to feel entirely at ease with every silhouette. Unworn pieces with all original atelier ribbons and tags intact may be returned or exchanged within 14 calendar days of receipt.
            </p>
          </div>

          {/* 4-Step Process */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-ivory-50 border border-accent-border space-y-3">
              <span className="font-serif text-2xl text-sand-dark font-light">01</span>
              <h3 className="font-serif text-base text-charcoal font-medium">Initiate Online</h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Log into your account order history or email care@velora.com with your order number.
              </p>
            </div>

            <div className="p-6 bg-ivory-50 border border-accent-border space-y-3">
              <span className="font-serif text-2xl text-sand-dark font-light">02</span>
              <h3 className="font-serif text-base text-charcoal font-medium">Repack Piece</h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Place the garment back into its original cotton dust pouch and carton.
              </p>
            </div>

            <div className="p-6 bg-ivory-50 border border-accent-border space-y-3">
              <span className="font-serif text-2xl text-sand-dark font-light">03</span>
              <h3 className="font-serif text-base text-charcoal font-medium">Doorstep Pickup</h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Our courier will collect the parcel directly from your doorstep with printed waybill.
              </p>
            </div>

            <div className="p-6 bg-ivory-50 border border-accent-border space-y-3">
              <span className="font-serif text-2xl text-sand-dark font-light">04</span>
              <h3 className="font-serif text-base text-charcoal font-medium">Prompt Refund</h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Following inspection at our atelier, your refund or exchange is issued within 3 business days.
              </p>
            </div>
          </div>

          {/* Return Requirements */}
          <div className="p-6 bg-ivory-200/50 border border-accent-border space-y-3">
            <h3 className="font-serif text-lg text-charcoal font-medium">
              Conditions for Return or Exchange:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/80 font-light list-disc pl-4">
              <li>Garments must be unwashed, unworn, and unaltered.</li>
              <li>Original security labels and tags must remain attached.</li>
              <li>Included organic cotton dustbag must be returned.</li>
              <li>Footwear or bags must show no scuffs or creasing.</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigateTo('account')}
              className="w-full sm:w-auto px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Manage In Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className="w-full sm:w-auto px-8 py-3.5 border border-accent-border bg-ivory text-charcoal text-xs uppercase tracking-luxury font-medium hover:border-charcoal transition-colors"
            >
              Contact Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
