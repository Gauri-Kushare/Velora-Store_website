import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
    showToast('Thank you for subscribing to Letters from VELORA.');
  };

  return (
    <section className="py-20 sm:py-28 bg-[#EFECE6]/70 border-b border-accent-border px-4 sm:px-8 text-center">
      <div className="max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 font-medium block mb-3">
          LETTERS FROM VELORA
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal">
          A considered life, delivered.
        </h2>

        <p className="mt-4 text-xs sm:text-sm text-charcoal/70 font-light max-w-md mx-auto leading-relaxed">
          New collections, thoughtful stories and a closer look at the world of VELORA.
        </p>

        {isSubmitted ? (
          <div className="mt-8 p-4 bg-ivory border border-accent-border inline-flex items-center gap-2 text-xs text-charcoal">
            <Check className="w-4 h-4 text-sand-dark" />
            <span>You have been subscribed. Welcome to our private letters.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 max-w-md mx-auto">
            <div className="relative border-b border-charcoal/40 focus-within:border-charcoal pb-1 transition-colors">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-1 py-2 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/45 outline-none font-light pr-10"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-charcoal hover:text-sand-dark transition-colors group"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <p className="mt-3 text-[10px] sm:text-[11px] text-charcoal/50 font-light">
              By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
