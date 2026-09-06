import React from 'react';
import { PageTab } from '../types';
import { 
  Home, 
  Layers, 
  FileText, 
  Phone, 
  ArrowLeft, 
  Sparkles, 
  Compass, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface NotFoundPageProps {
  setActiveTab: (tab: PageTab) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ setActiveTab }) => {
  const handleNavigate = (tab: PageTab, path: string) => {
    setActiveTab(tab);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center animate-in fade-in zoom-in-95 duration-300">
      
      {/* Breadcrumb Header */}
      <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill bg-white/80 border border-white/95 shadow-2xs mb-8 text-xs font-medium text-[#64748B]">
        <button 
          onClick={() => handleNavigate('home', '/')}
          className="hover:text-[#855B09] transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-[#0F172A] font-semibold">404 Error</span>
      </nav>

      {/* 404 Hero Visual Badge */}
      <div className="relative inline-block mb-6">
        <div className="text-7xl sm:text-9xl font-cinzel font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D49E24] via-[#E6B942] to-[#B38016] drop-shadow-sm select-none">
          404
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-900 text-[#F5D372] text-xs font-bold uppercase tracking-widest border border-[#D49E24]/40 shadow-md whitespace-nowrap flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E6B942]" />
          <span>Page Not Found</span>
        </div>
      </div>

      {/* Primary Message */}
      <h1 className="font-cinzel font-bold text-2xl sm:text-4xl text-[#0F172A] mb-3 max-w-2xl mx-auto">
        The digital pathway you requested does not exist.
      </h1>

      <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto mb-10 leading-relaxed">
        The link you followed may have been updated, relocated, or temporarily retired. You can return safely to the Prineor homepage or explore our published work below.
      </p>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-left">
        <button
          onClick={() => handleNavigate('home', '/')}
          className="p-4 rounded-2xl glass-panel bg-white/80 hover:bg-white border border-white/95 hover:border-[#D49E24]/50 shadow-xs hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 group-hover:bg-[#D49E24] text-[#855B09] group-hover:text-white flex items-center justify-center mb-3 transition-colors">
            <Home className="w-4 h-4" />
          </div>
          <h3 className="font-cinzel font-bold text-sm text-[#0F172A] mb-1">Homepage</h3>
          <p className="text-xs text-[#64748B] line-clamp-2">Return to the main Prineor overview & brand genesis.</p>
        </button>

        <button
          onClick={() => handleNavigate('projects', '/projects')}
          className="p-4 rounded-2xl glass-panel bg-white/80 hover:bg-white border border-white/95 hover:border-[#D49E24]/50 shadow-xs hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 group-hover:bg-[#D49E24] text-[#855B09] group-hover:text-white flex items-center justify-center mb-3 transition-colors">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-cinzel font-bold text-sm text-[#0F172A] mb-1">Projects</h3>
          <p className="text-xs text-[#64748B] line-clamp-2">Explore practical web apps, case studies & designs.</p>
        </button>

        <button
          onClick={() => handleNavigate('blog', '/blog')}
          className="p-4 rounded-2xl glass-panel bg-white/80 hover:bg-white border border-white/95 hover:border-[#D49E24]/50 shadow-xs hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 group-hover:bg-[#D49E24] text-[#855B09] group-hover:text-white flex items-center justify-center mb-3 transition-colors">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="font-cinzel font-bold text-sm text-[#0F172A] mb-1">Journal</h3>
          <p className="text-xs text-[#64748B] line-clamp-2">Read insights, WordPress lessons & tech tutorials.</p>
        </button>

        <button
          onClick={() => handleNavigate('contact', '/contact')}
          className="p-4 rounded-2xl glass-panel bg-white/80 hover:bg-white border border-white/95 hover:border-[#D49E24]/50 shadow-xs hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 group-hover:bg-[#D49E24] text-[#855B09] group-hover:text-white flex items-center justify-center mb-3 transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <h3 className="font-cinzel font-bold text-sm text-[#0F172A] mb-1">Contact Us</h3>
          <p className="text-xs text-[#64748B] line-clamp-2">Send an inquiry, discuss a partnership or request help.</p>
        </button>
      </div>

      {/* Return Action */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => handleNavigate('home', '/')}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return To Homepage</span>
        </button>

        <a
          href="mailto:prineorofficial@gmail.com"
          className="px-5 py-3 rounded-full glass-pill bg-white/80 hover:bg-white text-[#475569] hover:text-[#0F172A] border border-white/90 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#D49E24]" />
          <span>Report Broken Link</span>
        </a>
      </div>

    </div>
  );
};
