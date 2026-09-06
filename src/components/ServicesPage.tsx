import React, { useState } from 'react';
import { PageTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Code2, 
  Layout, 
  TrendingUp, 
  Share2, 
  Target, 
  Search, 
  PenTool, 
  Crown, 
  CheckCircle2, 
  Globe,
  Palette,
  Layers
} from 'lucide-react';

interface ServicesPageProps {
  setActiveTab: (tab: PageTab) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setActiveTab }) => {
  const { cmsData } = useCMS();
  const services = cmsData.services.filter(s => s.status !== 'draft');

  const iconMap: Record<string, React.ElementType> = {
    Sparkles: Sparkles,
    Bot: Bot,
    Globe: Globe,
    Palette: Palette,
    Code2: Code2,
    Layout: Layout,
    TrendingUp: TrendingUp,
    Share2: Share2,
    Target: Target,
    Search: Search,
    PenTool: PenTool,
    Crown: Crown,
    Layers: Layers,
  };

  return (
    <div id="services-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Prineor Services</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
          Our Digital Services
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3">
          WordPress development, AI development, graphic designing, digital marketing, and social media services to help you build and grow.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = iconMap[service.iconName] || Bot;
          return (
            <div
              key={service.id}
              className="glass-panel glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-sm relative overflow-hidden"
            >
              <div>
                {/* Header: Icon & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] flex items-center justify-center border border-[#F5D372]/60 shadow-xs">
                    <Icon className="w-6 h-6 text-[#A87915]" />
                  </div>

                  {service.badge && (
                    <span className="glass-pill px-3 py-1 text-[10px] font-bold text-[#855B09] rounded-full border border-[#D49E24]/30">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A] mb-2">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-5">
                  {service.shortDescription}
                </p>

                {/* Key Benefits */}
                {service.benefits && service.benefits.length > 0 && (
                  <div className="space-y-2 mb-5">
                    <span className="text-[11px] font-bold text-[#855B09] tracking-wider uppercase block">
                      What You Receive:
                    </span>
                    {service.benefits.map((ben, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-[#334155]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D49E24] flex-shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Execution Process Steps */}
                {service.process && service.process.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/50">
                    <span className="text-[10px] font-bold text-[#94A3B8] tracking-widest uppercase block mb-2">
                      Process Steps:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#64748B]">
                      {service.process.map((step, sIdx) => (
                        <div key={sIdx} className="glass-pill px-2 py-1 rounded-lg text-[10px] truncate border border-white/70">
                          {sIdx + 1}. {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action CTA */}
              <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('contact')}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Become Our Partner Section */}
      <div className="mt-12 rounded-3xl glass-panel-elevated p-8 sm:p-10 border border-white/90 shadow-md text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold text-[#A87915] uppercase tracking-widest block">
          Collaboration
        </span>
        <h3 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#0F172A]">
          Become Our Partner
        </h3>
        <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto leading-relaxed">
          If you have an idea, project, business, or brand you want to grow, you can become our partner. Let's work together, learn together, and build something meaningful.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('contact')}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-semibold text-sm shadow-[0_6px_25px_rgba(212,158,36,0.3)] hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Become Our Partner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
