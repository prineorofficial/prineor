import React from 'react';
import { PageTab } from '../types';
import { Sparkles, ArrowRight, Handshake, ShieldCheck } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface PartnerCTASectionProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenPartnerModal?: () => void;
}

export const PartnerCTASection: React.FC<PartnerCTASectionProps> = ({ 
  setActiveTab,
  onOpenPartnerModal
}) => {
  const { cmsData } = useCMS();
  const partner = cmsData.partner;

  if (!partner.isEnabled) return null;

  const handlePartnerClick = () => {
    if (onOpenPartnerModal) {
      onOpenPartnerModal();
    } else {
      setActiveTab('contact');
    }
  };

  return (
    <section id="partner-cta-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="relative w-full rounded-3xl glass-panel-elevated p-8 sm:p-12 border border-white/95 shadow-[0_20px_50px_rgba(212,158,36,0.1)] text-center overflow-hidden">
        
        {/* Soft Decorative Ambient Lights */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#FEF3C7]/60 via-[#FDE68A]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-64 h-64 bg-gradient-to-tl from-[#E0E7FF]/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
              Collaboration & Growth
            </span>
          </div>

          <h2 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
            {partner.heading || 'Become Our Partner'}
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl mx-auto">
            {partner.description || "If you have an idea, project, business, or brand you want to grow, you can become our partner. Let's work together, learn together, and build something meaningful."}
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="become-partner-primary-btn"
              onClick={handlePartnerClick}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-semibold text-sm sm:text-base shadow-[0_8px_30px_rgba(212,158,36,0.35)] hover:shadow-[0_12px_35px_rgba(212,158,36,0.5)] hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Handshake className="w-5 h-5 text-[#0F172A]" />
              <span>{partner.buttonText || 'Become Our Partner'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className="px-6 py-3.5 rounded-full glass-panel hover:bg-white text-[#0F172A] font-medium text-xs sm:text-sm border border-white/90 shadow-xs transition-all cursor-pointer"
            >
              Explore Our Services
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#D49E24]" />
            <span>Honest collaboration, practical solutions, and continuous support.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
