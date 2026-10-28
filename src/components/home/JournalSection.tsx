import React from 'react';
import { JOURNAL_ARTICLES } from '../../data/storeData';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface JournalSectionProps {
  onArticleClick?: (articleId: string) => void;
}

const luxuryEase = [0.22, 1, 0.36, 1] as const;

export const JournalSection: React.FC<JournalSectionProps> = ({ onArticleClick }) => {
  return (
    <section id="journal" className="py-16 sm:py-24 bg-ivory border-b border-accent-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: luxuryEase }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4"
        >
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 font-medium block mb-2">
              NOTES ON A CONSIDERED LIFE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal">
              The quiet edit.
            </h2>
          </div>

          <a
            href="#journal"
            onClick={(e) => {
              if (onArticleClick) {
                e.preventDefault();
                onArticleClick('all');
              }
            }}
            className="text-xs font-medium tracking-luxury uppercase text-charcoal hover:text-sand-dark transition-colors inline-flex items-center gap-1 group py-1"
          >
            <span>Read the journal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* 2 Journal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {JOURNAL_ARTICLES.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.75, delay: index * 0.15, ease: luxuryEase }}
              onClick={() => onArticleClick && onArticleClick(article.id)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ivory-200 border border-accent-border/70">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              <div className="pt-4 flex flex-col">
                <span className="text-[10px] tracking-luxury uppercase text-charcoal/60 font-medium">
                  {article.category} · {article.readTime}
                </span>

                <div className="flex items-center justify-between mt-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-normal group-hover:text-sand-dark transition-colors">
                    {article.title}
                  </h3>
                  <span className="text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
