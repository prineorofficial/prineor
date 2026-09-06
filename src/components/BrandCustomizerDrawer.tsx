import React, { useState } from 'react';
import { PersonalBrandConfig } from '../types';
import { Settings, X, RotateCcw, Check, Sparkles, Sliders } from 'lucide-react';
import { defaultBrandConfig } from '../data/portfolioData';

interface BrandCustomizerDrawerProps {
  brand: PersonalBrandConfig;
  onUpdateBrand: (updated: PersonalBrandConfig) => void;
}

export const BrandCustomizerDrawer: React.FC<BrandCustomizerDrawerProps> = ({ brand, onUpdateBrand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localBrand, setLocalBrand] = useState<PersonalBrandConfig>(brand);

  const presets = [
    {
      name: 'PRINEOR',
      initials: 'P',
      email: '[YOUR EMAIL]',
      phone: '[YOUR PHONE]',
      location: '[YOUR CITY, COUNTRY]',
      roles: ['AI Web Development', 'Web Development with WordPress', 'Digital Marketing', 'Social Media Services']
    },
    {
      name: '[YOUR NAME]',
      initials: 'YN',
      email: '[YOUR EMAIL]',
      phone: '[YOUR PHONE]',
      location: '[YOUR CITY, STATE]',
      roles: ['AI Web Developer', 'Web Developer', 'Digital Marketer', 'Social Media Strategist']
    },
    {
      name: 'PRINEOR DIGITAL',
      initials: 'PD',
      email: 'contact@prineor.com',
      phone: '+1 (555) 019-2834',
      location: 'Global / Remote',
      roles: ['Web Development with WordPress', 'AI Solutions', 'Social Media Growth', 'Digital Marketing']
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    const updated = {
      ...localBrand,
      ...preset
    };
    setLocalBrand(updated);
    onUpdateBrand(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBrand(localBrand);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalBrand(defaultBrandConfig);
    onUpdateBrand(defaultBrandConfig);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-2.5 sm:px-4 sm:py-2.5 rounded-full glass-panel-elevated hover:bg-white text-[#0F172A] font-semibold text-xs flex items-center gap-2 border border-white/90 shadow-[0_10px_30px_rgba(212,158,36,0.25)] hover:scale-105 transition-all cursor-pointer group"
        title="Customize Portfolio Identity"
      >
        <Sliders className="w-4 h-4 text-[#D49E24] group-hover:rotate-45 transition-transform" />
        <span className="font-heading hidden sm:inline">Customize Identity</span>
      </button>

      {/* Customizer Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-white/95 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
                  Portfolio Identity Configurator
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
              Easily update placeholder tokens like <span className="font-mono text-[#855B09] font-bold">[YOUR NAME]</span> and <span className="font-mono text-[#855B09] font-bold">[YOUR EMAIL]</span> with your real details or test presets.
            </p>

            {/* Quick Presets */}
            <div className="mb-5">
              <span className="text-[11px] font-bold text-[#855B09] uppercase tracking-wider block mb-2">
                Quick Presets:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(p)}
                    type="button"
                    className="p-2 rounded-xl glass-pill text-left hover:bg-white text-[11px] font-medium text-[#0F172A] border border-white/80 transition-all cursor-pointer truncate"
                  >
                    <span className="font-bold block truncate">{p.name}</span>
                    <span className="text-[9px] text-[#94A3B8] block truncate">{p.location}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Your Name</label>
                <input
                  type="text"
                  value={localBrand.name}
                  onChange={(e) => setLocalBrand({ ...localBrand, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/70 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Email</label>
                  <input
                    type="text"
                    value={localBrand.email}
                    onChange={(e) => setLocalBrand({ ...localBrand, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/70 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Phone</label>
                  <input
                    type="text"
                    value={localBrand.phone}
                    onChange={(e) => setLocalBrand({ ...localBrand, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/70 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Location</label>
                <input
                  type="text"
                  value={localBrand.location}
                  onChange={(e) => setLocalBrand({ ...localBrand, location: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/70 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Short Description / Bio</label>
                <textarea
                  rows={2}
                  value={localBrand.shortBio}
                  onChange={(e) => setLocalBrand({ ...localBrand, shortBio: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/70 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] text-[#0F172A] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full glass-panel hover:bg-white text-xs font-medium text-[#64748B] flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-semibold text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Changes</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
