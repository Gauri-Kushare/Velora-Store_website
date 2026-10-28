import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield, FileText, Lock, Globe } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy' }) => {
  const { currentPage, navigateTo } = useStore();
  const currentTab = currentPage === 'terms' ? 'terms' : 'privacy';

  return (
    <div className="bg-ivory min-h-screen pt-4 sm:pt-6 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-luxury text-charcoal/50 mb-6 sm:mb-8">
          <ol className="flex items-center gap-2">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-charcoal transition-colors">
                Home
              </button>
            </li>
            <li>/</li>
            <li className="text-charcoal font-medium">
              {currentTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </li>
          </ol>
        </nav>

        {/* Tab switch */}
        <div className="flex border-b border-accent-border mb-10 text-xs uppercase tracking-luxury font-medium">
          <button
            onClick={() => navigateTo('privacy')}
            className={`py-3 px-6 border-b-2 transition-all ${
              currentTab === 'privacy'
                ? 'border-charcoal text-charcoal font-semibold'
                : 'border-transparent text-charcoal/50 hover:text-charcoal'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => navigateTo('terms')}
            className={`py-3 px-6 border-b-2 transition-all ${
              currentTab === 'terms'
                ? 'border-charcoal text-charcoal font-semibold'
                : 'border-transparent text-charcoal/50 hover:text-charcoal'
            }`}
          >
            Terms & Conditions
          </button>
        </div>

        {/* PRIVACY POLICY CONTENT */}
        {currentTab === 'privacy' ? (
          <div className="space-y-10 text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-1">
                LAST UPDATED: OCTOBER 2026
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal tracking-tight">
                Privacy & Data Protection Policy
              </h1>
              <p className="mt-4 text-charcoal/70">
                At VELORA, we treat your personal information with the same discretion, care, and consideration that we invest in our garments. This policy details how we collect, safeguard, and respect your personal data.
              </p>
            </div>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                1. Information We Collect
              </h2>
              <p>
                When you browse our collections, place an order, or register with our atelier, we may collect:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-charcoal/70">
                <li>Contact information (e.g. name, email address, telephone number, and delivery address).</li>
                <li>Order history, saved wishlist pieces, and sizing/measurement preferences.</li>
                <li>Transaction details processed securely via PCI-DSS Level 1 encrypted payment tokens (we never store raw credit card numbers on our servers).</li>
                <li>Technical interaction data (device type, operating system, and anonymous analytics to refine site performance).</li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                2. How Your Information Is Used
              </h2>
              <p>
                We use your information exclusively for legitimate atelier purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-charcoal/70">
                <li>Processing, packing, and dispatching your garments with our white-glove couriers.</li>
                <li>Communicating delivery tracking notifications and tax receipts.</li>
                <li>Providing personalized styling and fit consultations through our concierge desk.</li>
                <li>Delivering private collection invitations (only with your explicit opt-in consent).</li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                3. Data Security & Storage
              </h2>
              <p>
                All data transmission is protected using 256-bit SSL encryption. We adhere strictly to global data protection standards (including India's Digital Personal Data Protection Act and GDPR). We never sell, rent, or trade your personal information to third-party data brokers.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                4. Your Rights & Inquiries
              </h2>
              <p>
                You may request access to, correction of, or complete deletion of your account records at any time by contacting our Data Protection Officer at{' '}
                <a href="mailto:privacy@velora.com" className="text-charcoal underline underline-offset-4 font-medium">
                  privacy@velora.com
                </a>.
              </p>
            </section>
          </div>
        ) : (
          /* TERMS & CONDITIONS CONTENT */
          <div className="space-y-10 text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-1">
                LAST UPDATED: OCTOBER 2026
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal tracking-tight">
                Terms of Service & Atelier Conditions
              </h1>
              <p className="mt-4 text-charcoal/70">
                Welcome to VELORA. By accessing our website, purchasing our garments, or visiting our atelier salons, you agree to comply with and be bound by the following terms.
              </p>
            </div>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                1. Garment Representation & Natural Materiality
              </h2>
              <p>
                We make every effort to display the colors, textures, and drape of our pieces with precise fidelity. However, as our fabrics are crafted from natural fibers (Mulberry silk, virgin wool, unbleached cotton, and vegetable-tanned leather), subtle organic variations in weave, slub, and grain are inherent to the noble nature of these materials and are celebrated as marks of authenticity.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                2. Pricing & Taxes
              </h2>
              <p>
                All prices listed in Indian Rupees (₹) are inclusive of applicable Goods and Services Tax (GST). For international orders, local import duties and clearance fees may be calculated and presented during checkout or payable upon destination arrival in accordance with local customs laws.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                3. Bespoke Alterations & Limited Editions
              </h2>
              <p>
                Garments that have undergone custom hem alteration, bespoke monogramming, or custom sizing at the client's request are considered final sale and cannot be returned or exchanged.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                4. Intellectual Property
              </h2>
              <p>
                All designs, garment silhouettes, editorial imagery, typography, and written journal content on this site are the exclusive intellectual property of VELORA Design Studios Ltd. Reproduction without prior written authorization is strictly prohibited.
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-accent-border">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                5. Governing Law
              </h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of India, subject to the exclusive jurisdiction of the courts of Mumbai.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
