import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PhilosophyBannerProps {
  onDiscoverStory?: () => void;
}

const luxuryEase = [0.22, 1, 0.36, 1] as const;

export const PhilosophyBanner: React.FC<PhilosophyBannerProps> = ({ onDiscoverStory }) => {
  return (
    <section id="about" className="bg-ivory border-b border-accent-border overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Left: Atmospheric Lifestyle Imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, ease: luxuryEase }}
            className="relative min-h-[340px] sm:min-h-[460px] lg:min-h-[580px] bg-ivory-200 overflow-hidden"
          >
            <img
              src="/images/editorial-philosophy.jpg"
              alt="Woman resting in sculpted wooden chair in sun-drenched sanctuary"
              className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.02]"
              loading="lazy"
            />
          </motion.div>

          {/* Right: Editorial Narrative Block */}
          <div className="bg-[#EFECE6] p-8 sm:p-14 lg:p-20 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-accent-border">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: luxuryEase }}
              className="max-w-md"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 font-medium block mb-4">
                OUR PHILOSOPHY
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-normal text-charcoal leading-[1.1]">
                Not more.
                <br />
                More meaningful.
              </h2>

              <p className="mt-6 text-xs sm:text-sm text-charcoal/75 font-light leading-relaxed">
                We believe the most beautiful things are the ones you choose with intention. VELORA is a slower approach to getting dressed — where material, proportion and feeling matter more than the moment.
              </p>

              <div className="mt-8 sm:mt-10">
                <button
                  onClick={onDiscoverStory}
                  className="px-8 py-3.5 border border-charcoal/40 text-charcoal text-xs uppercase tracking-luxury font-medium hover:bg-charcoal hover:text-ivory transition-all duration-300 flex items-center gap-2 group"
                >
                  <span>Discover our story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
