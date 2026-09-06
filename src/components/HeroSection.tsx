import React from 'react';
import { motion } from 'motion/react';
import { PageTab, PersonalBrandConfig } from '../types';
import { useCMS } from '../context/CMSContext';
import { 
  ArrowRight, 
  Instagram, 
  Youtube,
  Sparkles, 
  Share2, 
  Music2, 
  Mail 
} from 'lucide-react';

interface HeroSectionProps {
  brand?: PersonalBrandConfig;
  setActiveTab: (tab: PageTab) => void;
  onOpenResume: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  brand: propBrand,
  setActiveTab,
  onOpenResume,
}) => {
  const { cmsData } = useCMS();
  const hero = cmsData.hero;
  const brand = propBrand || cmsData.brand;

  const socialIcons = [
    { 
      name: 'TikTok', 
      icon: Music2, 
      url: brand.tiktokUrl || 'https://www.tiktok.com/@prineorofficial' 
    },
    { 
      name: 'Facebook', 
      icon: Share2, 
      url: brand.facebookUrl || 'https://www.facebook.com/profile.php?id=61591642935337&mibextid=ZbWKwL' 
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: brand.instagramUrl || 'https://www.instagram.com/prineorofficial?igsh=eGhvd3IxdGM3NzY=' 
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      url: brand.youtubeUrl || 'https://www.youtube.com/@Prineorofficial' 
    },
    { 
      name: 'Email', 
      icon: Mail, 
      url: `mailto:${brand.email || 'prineorofficial@gmail.com'}` 
    },
  ];

  return (
    <section id="hero-section" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
      {/* Main Glass Hero Card */}
      <div className="relative w-full rounded-3xl sm:rounded-[36px] glass-panel-elevated p-6 sm:p-10 lg:p-14 overflow-hidden border border-white/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.05),0_0_30px_rgba(230,240,255,0.4)]">
        
        {/* Soft Ambient Light Glows inside Card */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#FEF3C7]/40 to-[#E0E7FF]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-gradient-to-bl from-[#DBEAFE]/40 to-[#FEF3C7]/30 blur-3xl pointer-events-none" />

        {/* Floating Vertical Social Navigation Bar (Right on Desktop) */}
        <div className="hidden lg:flex flex-col gap-3 absolute top-12 right-8 z-30">
          {socialIcons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                id={`hero-social-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                title={item.name}
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[#475569] hover:text-[#A87915] hover:border-[#D49E24]/60 hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-20">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 w-fit mb-4 sm:mb-6 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6B942] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D49E24]"></span>
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-[#0F172A] uppercase">
                {hero.badge || brand.badgeText}
              </span>
            </motion.div>

            {/* "We are" & Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="font-serif italic text-lg sm:text-2xl text-[#92600D] tracking-wide block mb-1">
                {hero.greeting || 'We are'}
              </span>
              
              <div className="relative inline-block">
                <h1 className="font-cinzel font-black text-4xl sm:text-6xl xl:text-7xl tracking-[0.08em] text-[#0F172A] leading-[1.05]">
                  {hero.headline || brand.name}
                </h1>
                {/* Golden Diamond Sparkle Accent */}
                <span className="absolute -top-2 -right-5 sm:-right-8 text-[#D49E24] animate-pulse text-xl sm:text-2xl">
                  ✦
                </span>
              </div>
            </motion.div>

            {/* Roles Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4"
            >
              <p className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-[#334155] leading-relaxed">
                {hero.subheading || brand.roles.join(' • ')}
              </p>
            </motion.div>

            {/* Short Bio Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 text-sm sm:text-base text-[#64748B] max-w-xl leading-relaxed"
            >
              {hero.description || brand.shortBio}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <button
                id="hero-view-work-btn"
                onClick={() => setActiveTab('projects')}
                className="px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-semibold text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:shadow-[0_8px_30px_rgba(212,158,36,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>{hero.primaryCtaText || 'Explore Our Work'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-partner-cta-btn"
                onClick={() => setActiveTab('contact')}
                className="px-5 sm:px-6 py-3 rounded-full glass-panel hover:bg-white text-[#0F172A] font-medium text-sm border border-white/90 shadow-sm hover:border-[#D49E24]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{hero.secondaryCtaText || 'Become Our Partner'}</span>
                <ArrowRight className="w-4 h-4 text-[#A87915]" />
              </button>
            </motion.div>

            {/* Mobile Social Row */}
            <div className="flex lg:hidden items-center gap-2.5 mt-6 pt-4 border-t border-slate-200/50">
              {socialIcons.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[#475569] hover:text-[#A87915]"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* Scroll Indicator */}
            <div className="mt-8 sm:mt-10 hidden sm:flex items-center gap-2.5 text-xs text-[#94A3B8]">
              <div className="w-4 h-6 rounded-full border border-[#94A3B8] p-0.5 flex justify-center">
                <span className="w-1 h-1.5 bg-[#D49E24] rounded-full animate-bounce mt-0.5" />
              </div>
              <span className="tracking-wider uppercase text-[11px] font-medium">Scroll to explore Prineor</span>
            </div>

          </div>

          {/* Right Column: Crystal Portrait Frame */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[420px] lg:max-w-[480px] aspect-[4/5] rounded-[32px] p-2 sm:p-3 crystal-glow"
            >
              {/* Glass Frame Substrate */}
              <div className="w-full h-full rounded-[26px] overflow-hidden relative glass-panel-elevated border border-white/90 shadow-[0_20px_50px_rgba(212,158,36,0.12)]">
                
                {/* Portrait Image */}
                <img
                  src={hero.heroImage || brand.portraitImage}
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle Translucent Crystal Facet Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/30 via-transparent to-white/20 pointer-events-none" />
                
                {/* Geometric Prism Light Angle Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/60 via-white/10 to-transparent pointer-events-none transform rotate-12" />

                {/* Floating Gold Monogram Seal Badge */}
                <div className="absolute bottom-4 right-4 z-20">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#A87915] via-[#E6B942] to-[#F5D372] p-[2px] shadow-[0_8px_20px_rgba(212,158,36,0.4)] animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-white/85 backdrop-blur-md flex flex-col items-center justify-center p-1 border border-white/80">
                      <span className="font-cinzel font-black text-xs sm:text-sm text-[#A87915]">
                        {brand.initials}
                      </span>
                      <span className="text-[7px] sm:text-[8px] font-bold text-[#855B09] tracking-tighter uppercase text-center leading-none mt-0.5">
                        EST. 2026
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Diamond Corner Accent */}
                <div className="absolute top-4 left-4 glass-pill px-3 py-1 text-[11px] font-semibold text-[#0F172A] border border-white/90 shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D49E24]" />
                  <span>Prineor Brand</span>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

