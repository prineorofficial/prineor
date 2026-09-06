import React, { useState } from 'react';
import { PageTab, PersonalBrandConfig } from '../types';
import { useCMS } from '../context/CMSContext';
import { Sparkles, ArrowUpRight, Copy, Check, Mail } from 'lucide-react';

interface LinksPageProps {
  brand?: PersonalBrandConfig;
  setActiveTab: (tab: PageTab) => void;
  onOpenResume: () => void;
}

export const LinksPage: React.FC<LinksPageProps> = ({ 
  brand: propBrand, 
  setActiveTab, 
  onOpenResume 
}) => {
  const { cmsData } = useCMS();
  const brand = propBrand || cmsData.brand;
  const [copied, setCopied] = useState(false);

  const activeSocials = cmsData.socials.filter(s => s.isEnabled !== false);

  const handleCopyProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div id="links-page" className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Profile Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 text-center border border-white/90 shadow-sm mb-8 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FEF3C7]/40 blur-2xl" />

        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#E6B942] to-[#D49E24] shadow-md mb-4">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
            <img
              src={brand.portraitImage}
              alt={brand.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 text-[11px] font-semibold text-[#855B09] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#D49E24] animate-pulse" />
          <span>{brand.badgeText}</span>
        </div>

        <h1 className="font-cinzel font-black text-2xl sm:text-3xl text-[#0F172A]">
          {brand.name}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#855B09] mt-0.5">
          {brand.roles.join(' • ')}
        </p>
        <p className="text-xs text-[#64748B] max-w-md mx-auto mt-2">
          {brand.shortBio}
        </p>

        {/* Share / Copy Hub Link */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={handleCopyProfile}
            className="px-4 py-1.5 rounded-full glass-pill text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-white flex items-center gap-1.5 border border-white/90 shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#D49E24]" />}
            <span>{copied ? 'Link Copied!' : 'Share Link Hub'}</span>
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setActiveTab('contact')}
          className="p-4 rounded-2xl bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-semibold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>Contact Prineor</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className="p-4 rounded-2xl glass-panel hover:bg-white text-[#0F172A] font-semibold text-xs sm:text-sm text-center flex items-center justify-center gap-2 border border-white/90 shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#A87915]" />
          <span>Our Services</span>
        </button>
      </div>

      {/* Large Glass Link Buttons List */}
      <div className="space-y-3 mb-10">
        {activeSocials.map((link, idx) => (
          <a
            key={link.id || idx}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-white/90 shadow-xs group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] flex items-center justify-center text-[#A87915] font-bold text-sm border border-[#F5D372]/60 shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                {link.platform.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F172A] group-hover:text-[#A87915] transition-colors">
                    {link.platform}
                  </h3>
                  {link.badge && (
                    <span className="glass-pill px-2 py-0.5 text-[9px] font-bold text-[#855B09] rounded-md border border-[#D49E24]/30">
                      {link.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">{link.description || link.handle}</p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#94A3B8] group-hover:text-[#D49E24] group-hover:bg-white transition-all flex-shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>

      {/* Direct Contact Glass Strip */}
      <div className="glass-panel rounded-2xl p-5 border border-white/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-[#D49E24]" />
          <div>
            <span className="text-xs font-semibold text-[#0F172A] block">{brand.email}</span>
            {brand.phone && <span className="text-[11px] text-[#64748B]">{brand.phone}</span>}
          </div>
        </div>

        <a
          href={`mailto:${brand.email}`}
          className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-[#D49E24] hover:text-[#0F172A] transition-colors"
        >
          Email Us
        </a>
      </div>

    </div>
  );
};
