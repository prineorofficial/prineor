import React, { useState, useEffect } from 'react';
import { PageTab, PersonalBrandConfig } from '../types';
import { Sparkles, Menu, X, ArrowRight, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  brand: PersonalBrandConfig;
  onOpenCustomizer?: () => void;
  onOpenResume?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  brand,
  onOpenCustomizer,
  onOpenResume,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'story', label: 'Story' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'blog', label: 'Blog' },
    { id: 'links', label: 'Links' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300">
      <div 
        id="main-navbar"
        className={`w-full rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 transition-all duration-300 flex items-center justify-between ${
          scrolled 
            ? 'glass-panel-elevated shadow-[0_15px_35px_rgba(15,23,42,0.06)]' 
            : 'glass-panel shadow-[0_10px_25px_rgba(15,23,42,0.03)]'
        }`}
      >
        {/* Brand Logo with Gold Monogram */}
        <button
          id="nav-logo-btn"
          onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E6B942] to-[#D49E24] p-[1px] shadow-sm flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-[7px] flex items-center justify-center">
              <span className="font-cinzel font-bold text-sm text-[#A87915] group-hover:text-[#D49E24] transition-colors">
                {brand.initials.charAt(0) || 'N'}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel font-bold text-sm sm:text-base tracking-[0.15em] text-[#0F172A]">
              {brand.name}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium transition-all duration-200 rounded-full cursor-pointer ${
                  isActive
                    ? 'text-[#0F172A] font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/50'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] rounded-full shadow-[0_0_8px_rgba(212,158,36,0.6)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customizer / Settings Trigger */}
          <button
            id="brand-customizer-toggle"
            onClick={() => {
              if (onOpenCustomizer) {
                onOpenCustomizer();
              } else {
                setActiveTab('contact');
              }
            }}
            title="Get in Touch / Settings"
            className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#64748B] hover:text-[#A87915] hover:border-[#D49E24]/50 transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Contact Me CTA Button */}
          <button
            id="nav-contact-cta"
            onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
            className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-medium text-xs sm:text-sm shadow-[0_4px_15px_rgba(212,158,36,0.3)] hover:shadow-[0_6px_20px_rgba(212,158,36,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Contact Me</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#1E293B] hover:text-[#D49E24] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="lg:hidden mt-2 p-4 glass-panel-elevated rounded-2xl shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-2 gap-1.5 py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-sm text-left rounded-xl transition-all font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E6B942]/20 to-[#F5D372]/10 text-[#0F172A] font-semibold border border-[#D49E24]/30'
                      : 'text-[#475569] hover:bg-white/60 hover:text-[#0F172A]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D49E24]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-medium text-sm text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Contact Me</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
