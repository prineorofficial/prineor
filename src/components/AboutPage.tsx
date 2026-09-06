import React from 'react';
import { PageTab, PersonalBrandConfig } from '../types';
import { useCMS } from '../context/CMSContext';
import { Sparkles, Target, Compass, Handshake, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  brand?: PersonalBrandConfig;
  setActiveTab: (tab: PageTab) => void;
  onOpenResume: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ 
  brand: propBrand, 
  setActiveTab, 
  onOpenResume 
}) => {
  const { cmsData } = useCMS();
  const brand = propBrand || cmsData.brand || {};
  const about = cmsData.about || {
    title: 'Who We Are & What Drives Us',
    subtitle: 'A growing digital brand built to turn ideas into meaningful digital experiences — modern websites, AI solutions, digital marketing, and social media.',
    portraitImage: (brand as any).portraitImage || (brand as any).heroImage,
    introHeading: (brand as any).foundersTitle || 'We are Prineor.',
    introSubheading: (brand as any).foundersSubtitle || 'We are the owners and founders of Prineor.',
    biography: (brand as any).fullBio || (brand as any).bio || (brand as any).shortBio,
    vision: brand.vision,
    mission: brand.mission,
    values: brand.values || []
  };

  const valuesList = about.values || brand.values || [];

  return (
    <div id="about-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">About Prineor</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
          {about.title || 'Who We Are & What Drives Us'}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3">
          {about.subtitle || 'A growing digital brand built to turn ideas into meaningful digital experiences — modern websites, AI solutions, digital marketing, and social media.'}
        </p>
      </div>

      {/* Main Grid: Portrait & Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Crystal Frame Portrait */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[32px] p-2.5 crystal-glow">
            <div className="w-full h-full rounded-[26px] overflow-hidden relative glass-panel-elevated border border-white/90 shadow-[0_20px_50px_rgba(212,158,36,0.12)]">
              <img
                src={about.portraitImage || (brand as any).portraitImage || (brand as any).heroImage || '/src/assets/images/hero_crystal_portrait_1787639780033.jpg'}
                alt={brand.name || 'Prineor'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-transparent to-white/10 pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 glass-panel p-3.5 rounded-2xl border border-white/90">
                <span className="font-cinzel font-bold text-sm text-[#0F172A] block">{brand.name || 'PRINEOR'}</span>
                <span className="text-[11px] font-semibold text-[#855B09] block">{(brand.roles || ['Web Development with WordPress', 'AI Development', 'Graphic Designing', 'Digital Marketing']).join(' • ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Biography, Vision & Mission */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-[#A87915] tracking-widest uppercase block mb-1">
                {(brand as any).foundersBadge || 'Owners & Founders'}
              </span>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-[#0F172A]">
                {about.introHeading || (brand as any).foundersTitle || 'We are Prineor.'}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#855B09] mt-0.5">
                {about.introSubheading || (brand as any).foundersSubtitle || 'We are the owners and founders of Prineor.'}
              </p>
            </div>
            
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed whitespace-pre-line">
              {about.biography || (brand as any).fullBio || (brand as any).bio || (brand as any).shortBio || 'We are Prineor. We are the owners and founders of Prineor. Prineor started in 2026 and is currently growing through continuous learning, practical projects, experimentation, and improvement.'}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200/60">
              <button
                onClick={() => setActiveTab('contact')}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-full bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-semibold text-xs sm:text-sm shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Handshake className="w-4 h-4" />
                <span>Become Our Partner</span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full glass-panel hover:bg-white text-[#0F172A] font-medium text-xs sm:text-sm border border-white/90 transition-all flex items-center justify-center cursor-pointer"
              >
                Explore Services
              </button>
            </div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-white/90">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] flex items-center justify-center mb-3">
                <Target className="w-4 h-4 text-[#A87915]" />
              </div>
              <h3 className="font-cinzel font-bold text-base text-[#0F172A]">Our Vision</h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                {about.vision || brand.vision || 'To build Prineor into a strong and meaningful digital brand.'}
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-white/90">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] flex items-center justify-center mb-3">
                <Compass className="w-4 h-4 text-[#A87915]" />
              </div>
              <h3 className="font-cinzel font-bold text-base text-[#0F172A]">Our Mission</h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                {about.mission || brand.mission || 'Our mission is to grow Prineor into a strong and trusted digital brand by creating useful digital experiences, exploring AI-powered solutions, providing creative digital services, and continuously learning and improving.'}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Core Values Section */}
      <div className="mt-12">
        <div className="text-center mb-8">
          <h2 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#0F172A]">
            Guiding Principles & Values
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            The honest standards and ambitious mindset that guide everything we build at Prineor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {valuesList.map((val, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-5 border border-white/90 hover:bg-white transition-all shadow-xs group"
            >
              <span className="font-cinzel text-xs font-bold text-[#A87915] block mb-2">
                0{idx + 1}
              </span>
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F172A] group-hover:text-[#A87915] transition-colors">
                {val.title}
              </h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="mt-12 rounded-3xl glass-panel-elevated p-8 text-center max-w-4xl mx-auto border border-white/90 shadow-md relative overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-[#E6B942]/20 flex items-center justify-center mx-auto mb-4 text-[#A87915]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-[#0F172A] mb-3">
          The Prineor Philosophy
        </h3>
        <p className="font-serif italic text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl mx-auto">
          "{about.philosophy || brand.philosophy}"
        </p>
      </div>

    </div>
  );
};
