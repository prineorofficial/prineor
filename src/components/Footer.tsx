import React from 'react';
import { PageTab, PersonalBrandConfig } from '../types';
import { Mail, Phone, MapPin, ArrowUp, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  brand: PersonalBrandConfig;
  setActiveTab: (tab: PageTab) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ brand, setActiveTab, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
      {/* Upper Glass Container */}
      <div className="w-full rounded-3xl glass-panel p-6 sm:p-8 border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)] flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Monogram & Tagline */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E6B942] to-[#D49E24] p-[1px] shadow-sm flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-[10px] flex items-center justify-center">
              <span className="font-cinzel font-bold text-base text-[#A87915]">
                {brand.initials.charAt(0) || 'P'}
              </span>
            </div>
          </div>
          <div>
            <h4 className="font-cinzel font-bold text-base tracking-widest text-[#0F172A]">
              {brand.name}
            </h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              Building digital experiences that inspire and perform.
            </p>
          </div>
        </div>

        {/* Middle: Contact Details */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#475569]">
          <a
            href={`mailto:${brand.email}`}
            className="flex items-center gap-1.5 hover:text-[#A87915] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>{brand.email}</span>
          </a>

          <a
            href={`tel:${brand.phone}`}
            className="flex items-center gap-1.5 hover:text-[#A87915] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>{brand.phone}</span>
          </a>

          <div className="flex items-center gap-1.5 text-[#64748B]">
            <MapPin className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>{brand.location}</span>
          </div>
        </div>

        {/* Right: Copyright & Scroll to Top */}
        <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
          <span className="hidden xl:inline">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>

          <button
            onClick={scrollToTop}
            title="Scroll to top"
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E6B942] to-[#D49E24] text-[#0F172A] flex items-center justify-center shadow-[0_4px_15px_rgba(212,158,36,0.3)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Subtle Sub-footer Links */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8] px-3 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
          <button onClick={() => setActiveTab('about')} className="hover:text-[#0F172A] transition-colors cursor-pointer py-1">About</button>
          <button onClick={() => setActiveTab('projects')} className="hover:text-[#0F172A] transition-colors cursor-pointer py-1">Projects</button>
          <button onClick={() => setActiveTab('services')} className="hover:text-[#0F172A] transition-colors cursor-pointer py-1">Services</button>
          <button onClick={() => setActiveTab('skills')} className="hover:text-[#0F172A] transition-colors cursor-pointer py-1">Skills</button>
          <button onClick={() => setActiveTab('blog')} className="hover:text-[#0F172A] transition-colors cursor-pointer py-1">Blog</button>
          <button onClick={() => setActiveTab('contact')} className="hover:text-[#0F172A] transition-colors cursor-pointer py-1">Contact</button>
          <a href="/partner" onClick={(e) => { e.preventDefault(); setActiveTab('contact'); window.history.pushState({}, '', '/partner'); }} className="hover:text-[#0F172A] transition-colors cursor-pointer py-1">Partner</a>
          <a href="/hiring" onClick={(e) => { e.preventDefault(); setActiveTab('contact'); window.history.pushState({}, '', '/hiring'); }} className="hover:text-[#0F172A] transition-colors cursor-pointer py-1">Careers</a>
          {onOpenAdmin && (
            <button 
              onClick={onOpenAdmin}
              className="text-[#D49E24] hover:text-[#855B09] font-semibold transition-colors cursor-pointer flex items-center gap-1 py-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Admin CMS</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 justify-center">
          <span>Crafted with crystal glassmorphism & precision engineering</span>
        </div>
      </div>
    </footer>
  );
};
