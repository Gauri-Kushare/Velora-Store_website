import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useStore();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [activeTab, setActiveTab] = useState<'tops' | 'bottoms' | 'outerwear'>('tops');

  return (
    <AnimatePresence>
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop with luxury blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-md"
            onClick={closeSizeGuide}
          />

          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden bg-ivory text-left shadow-modal w-full max-w-2xl border border-accent-border p-6 sm:p-8 my-8 pointer-events-auto"
            >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-accent-border pb-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-sand-dark stroke-[1.5]" />
              <h3 className="font-serif text-2xl text-charcoal font-normal">
                Garment Size Guide
              </h3>
            </div>
            <button
              onClick={closeSizeGuide}
              aria-label="Close size guide"
              className="p-1.5 text-charcoal/60 hover:text-charcoal"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Unit Toggle and Category Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('tops')}
                className={`px-3 py-1.5 text-xs uppercase tracking-luxury border transition-colors ${
                  activeTab === 'tops'
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-ivory border-accent-border text-charcoal/70'
                }`}
              >
                Shirts & Tops
              </button>
              <button
                onClick={() => setActiveTab('bottoms')}
                className={`px-3 py-1.5 text-xs uppercase tracking-luxury border transition-colors ${
                  activeTab === 'bottoms'
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-ivory border-accent-border text-charcoal/70'
                }`}
              >
                Trousers & Skirts
              </button>
              <button
                onClick={() => setActiveTab('outerwear')}
                className={`px-3 py-1.5 text-xs uppercase tracking-luxury border transition-colors ${
                  activeTab === 'outerwear'
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-ivory border-accent-border text-charcoal/70'
                }`}
              >
                Blazers & Coats
              </button>
            </div>

            <div className="flex items-center gap-1 bg-ivory-200 p-0.5 border border-accent-border self-start">
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  unit === 'cm' ? 'bg-ivory text-charcoal shadow-sm' : 'text-charcoal/60'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  unit === 'in' ? 'bg-ivory text-charcoal shadow-sm' : 'text-charcoal/60'
                }`}
              >
                INCHES
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="mt-6 overflow-x-auto border border-accent-border">
            <table className="w-full text-xs text-left">
              <thead className="bg-ivory-200 border-b border-accent-border text-charcoal/70 uppercase tracking-luxury text-[10px]">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Bust / Chest</th>
                  <th className="py-3 px-4">Waist</th>
                  <th className="py-3 px-4">Hip</th>
                  <th className="py-3 px-4">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent-border/60 text-charcoal font-light">
                {unit === 'cm' ? (
                  <>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">XS (34)</td>
                      <td className="py-3 px-4">82–86 cm</td>
                      <td className="py-3 px-4">64–68 cm</td>
                      <td className="py-3 px-4">88–92 cm</td>
                      <td className="py-3 px-4">58 cm</td>
                    </tr>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">S (36)</td>
                      <td className="py-3 px-4">86–90 cm</td>
                      <td className="py-3 px-4">68–72 cm</td>
                      <td className="py-3 px-4">92–96 cm</td>
                      <td className="py-3 px-4">59 cm</td>
                    </tr>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">M (38)</td>
                      <td className="py-3 px-4">90–96 cm</td>
                      <td className="py-3 px-4">72–78 cm</td>
                      <td className="py-3 px-4">96–102 cm</td>
                      <td className="py-3 px-4">60 cm</td>
                    </tr>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">L (40)</td>
                      <td className="py-3 px-4">96–102 cm</td>
                      <td className="py-3 px-4">78–84 cm</td>
                      <td className="py-3 px-4">102–108 cm</td>
                      <td className="py-3 px-4">61 cm</td>
                    </tr>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">XL (42)</td>
                      <td className="py-3 px-4">102–108 cm</td>
                      <td className="py-3 px-4">84–90 cm</td>
                      <td className="py-3 px-4">108–114 cm</td>
                      <td className="py-3 px-4">62 cm</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">XS (34)</td>
                      <td className="py-3 px-4">32–34 in</td>
                      <td className="py-3 px-4">25–27 in</td>
                      <td className="py-3 px-4">34–36 in</td>
                      <td className="py-3 px-4">22.8 in</td>
                    </tr>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">S (36)</td>
                      <td className="py-3 px-4">34–35.5 in</td>
                      <td className="py-3 px-4">27–28.5 in</td>
                      <td className="py-3 px-4">36–38 in</td>
                      <td className="py-3 px-4">23.2 in</td>
                    </tr>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">M (38)</td>
                      <td className="py-3 px-4">35.5–38 in</td>
                      <td className="py-3 px-4">28.5–31 in</td>
                      <td className="py-3 px-4">38–40 in</td>
                      <td className="py-3 px-4">23.6 in</td>
                    </tr>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">L (40)</td>
                      <td className="py-3 px-4">38–40 in</td>
                      <td className="py-3 px-4">31–33 in</td>
                      <td className="py-3 px-4">40–42.5 in</td>
                      <td className="py-3 px-4">24.0 in</td>
                    </tr>
                    <tr className="hover:bg-ivory-200/50">
                      <td className="py-3 px-4 font-medium">XL (42)</td>
                      <td className="py-3 px-4">40–42.5 in</td>
                      <td className="py-3 px-4">33–35.5 in</td>
                      <td className="py-3 px-4">42.5–45 in</td>
                      <td className="py-3 px-4">24.4 in</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Advice notes */}
          <div className="mt-6 p-4 bg-ivory-200/70 border border-accent-border/70 text-xs text-charcoal/80 space-y-1.5 font-light">
            <strong className="font-medium text-charcoal">Fit Note:</strong>
            <p>
              VELORA silhouettes are engineered with relaxed, architectural drape. If you are between sizes, we recommend ordering your true size for a relaxed tailored silhouette, or sizing down for a closer fit.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )}
</AnimatePresence>
  );
};
