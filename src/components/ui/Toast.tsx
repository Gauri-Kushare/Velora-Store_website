import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast.visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm bg-charcoal text-ivory px-4 py-3 shadow-modal border border-charcoal-800 flex items-center gap-3 transition-all transform translate-y-0"
    >
      <CheckCircle2 className="w-4 h-4 text-sand flex-shrink-0" />
      <p className="text-xs font-light tracking-wide text-ivory/95">{toast.message}</p>
    </div>
  );
};
