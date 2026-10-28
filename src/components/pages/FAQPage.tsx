import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronDown, ChevronUp, Search, MessageSquare, ArrowRight } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'Orders & Delivery',
    question: 'How long does domestic and international delivery take?',
    answer:
      'Domestic orders within India are dispatched within 24–48 hours via premium express couriers and arrive in 3–5 business days. International express shipments to the US, Europe, and UAE are delivered within 7–10 business days. You will receive an SMS and email notification with direct live tracking as soon as your parcel is sealed in our workshop.',
  },
  {
    id: '2',
    category: 'Orders & Delivery',
    question: 'What is the threshold for complimentary shipping?',
    answer:
      'We offer complimentary worldwide shipping on all orders over ₹10,000 (or $120 USD equivalent). Orders below this threshold incur a flat ₹1,500 domestic standard delivery charge.',
  },
  {
    id: '3',
    category: 'Sizing & Alterations',
    question: 'How do I determine my correct size?',
    answer:
      'Each garment page features an in-depth Size Guide with garment dimensions, model measurements, and international sizing conversions (US, UK, IT, FR). If you are between sizes or desire advice on whether a silhouette is designed to drape loosely or sit fitted, please contact our concierge team at care@velora.com.',
  },
  {
    id: '4',
    category: 'Sizing & Alterations',
    question: 'Do you offer custom tailoring or bespoke hem alterations?',
    answer:
      'Yes. Our trousers and tailored coats include generous internal hem allowances (up to 4cm) designed for custom tailoring. We also offer complimentary custom hem alterations on trousers for orders placed through our Mumbai and New Delhi ateliers.',
  },
  {
    id: '5',
    category: 'Returns & Exchanges',
    question: 'What is your returns and exchange policy?',
    answer:
      'We accept returns and exchanges on unworn, unwashed pieces with all original atelier security tags and dustbags attached within 14 days of delivery. Exchanges for an alternate size or colour are completely complimentary and include reverse-courier pickup.',
  },
  {
    id: '6',
    category: 'Returns & Exchanges',
    question: 'How do I schedule a return pickup?',
    answer:
      'Simply log into your account, navigate to Order History, and select "Request Return / Exchange". Alternatively, email care@velora.com with your order reference (e.g. VEL-XXXXXX), and our courier will collect the package from your doorstep.',
  },
  {
    id: '7',
    category: 'Sustainable Packaging',
    question: 'How are VELORA garments packaged and protected?',
    answer:
      'We maintain a strict zero single-use plastic policy. Every piece is wrapped in a breathable, unbleached organic cotton dust bag that can be reused for seasonal wardrobe storage. Outer shipping cartons are crafted from FSC-certified recycled paper and sealed with plant-based water-activated tape.',
  },
  {
    id: '8',
    category: 'Garment Care',
    question: 'How should I care for my mulberry silk shirt and virgin wool pieces?',
    answer:
      'For our 19-momme Mulberry silk, specialist dry cleaning or cold hand washing with pH-neutral silk detergent is recommended. Never wring silk; gently roll in a clean dry towel and air dry flat. For virgin wool trousers and blazers, hang in a ventilated space and steam between wears—wool naturally repels odor and moisture, requiring only infrequent dry cleaning.',
  },
];

const CATEGORIES = [
  'All',
  'Orders & Delivery',
  'Sizing & Alterations',
  'Returns & Exchanges',
  'Sustainable Packaging',
  'Garment Care',
];

export const FAQPage: React.FC = () => {
  const { navigateTo } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['1', '3']);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

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
            <li className="text-charcoal font-medium">Frequently Asked Questions</li>
          </ol>
        </nav>

        {/* Title */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold block mb-2">
            HELP & GUIDANCE
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-charcoal tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
            Find immediate answers regarding atelier ordering, sizing, delivery timelines, garment maintenance, and complimentary exchanges.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mb-8 relative">
          <Search className="w-4 h-4 text-charcoal/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. delivery, silk care, returns)..."
            className="w-full bg-ivory-50 border border-accent-border pl-10 pr-4 py-3 text-xs text-charcoal outline-none focus:border-charcoal"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-luxury transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-charcoal text-ivory border-charcoal font-medium shadow-sm'
                  : 'bg-ivory text-charcoal/70 border-accent-border hover:border-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl divide-y divide-accent-border border-y border-accent-border bg-ivory-50">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center text-xs text-charcoal/60 font-light">
              No matching answers found for "{searchQuery}". Please check your spelling or contact our concierge.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);

              return (
                <div key={faq.id} className="p-5 sm:p-6 transition-colors hover:bg-ivory-100">
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-start justify-between text-left gap-4"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-luxury text-sand-dark font-medium block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-charcoal font-medium">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="p-1 text-charcoal/70 flex-shrink-0 mt-1">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-3 border-t border-accent-border/50 text-xs sm:text-sm text-charcoal/75 font-light leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Unanswered question banner */}
        <div className="mt-16 p-8 bg-ivory-50 border border-accent-border max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="font-serif text-2xl text-charcoal font-normal">
              Need personalized styling or fit advice?
            </h3>
            <p className="text-xs text-charcoal/70 font-light mt-1">
              Our atelier styling advisors are available Monday to Saturday to assist you.
            </p>
          </div>

          <button
            onClick={() => navigateTo('contact')}
            className="px-6 py-3 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span>Contact Client Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
