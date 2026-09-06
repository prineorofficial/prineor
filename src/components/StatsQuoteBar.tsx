import React from 'react';
import { Award, CheckCircle2, Users, Trophy, Quote, Sparkles, Layers, TrendingUp, Zap, Target } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const StatsQuoteBar: React.FC = () => {
  const { cmsData } = useCMS();
  const rawStats = cmsData.stats;

  const items: any[] = Array.isArray(rawStats)
    ? rawStats
    : (rawStats && Array.isArray((rawStats as any).items) ? (rawStats as any).items : []);

  const quote = (!Array.isArray(rawStats) && (rawStats as any)?.quote)
    ? (rawStats as any).quote
    : {
        quote: "Prineor is not just a portfolio. It is a brand we are building.",
        author: "Prineor Team"
      };

  const iconMap: Record<string, React.ElementType> = {
    Award: Award,
    CheckCircle2: CheckCircle2,
    Users: Users,
    Trophy: Trophy,
    Sparkles: Sparkles,
    Layers: Layers,
    TrendingUp: TrendingUp,
    Zap: Zap,
    Target: Target
  };

  return (
    <section id="stats-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="w-full rounded-2xl sm:rounded-3xl glass-panel p-5 sm:p-7 border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Left Side: Statistics Badges */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
          {items.map((stat, idx) => {
            const Icon = iconMap[stat.icon] || Trophy;
            return (
              <div 
                key={stat.id || idx} 
                className={`flex items-center gap-3.5 ${idx !== 0 ? 'pt-3 sm:pt-0 sm:pl-5' : ''}`}
              >
                {/* Circular Gold Icon Badge */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] p-0.5 shadow-sm flex items-center justify-center flex-shrink-0 border border-[#F5D372]/60">
                  <Icon className="w-5 h-5 text-[#A87915]" />
                </div>

                <div className="flex flex-col">
                  <span className="font-cinzel font-bold text-2xl sm:text-3xl text-[#0F172A] leading-none">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-[#64748B] font-medium mt-1">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Inspirational Quote Panel */}
        <div className="lg:col-span-4 lg:border-l border-slate-200/60 lg:pl-6">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-[#D49E24] flex-shrink-0 mt-0.5 rotate-180" />
            <div>
              <p className="font-serif italic text-xs sm:text-sm text-[#334155] leading-relaxed">
                "{quote.quote || 'Prineor is not just a portfolio. It is a brand we are building.'}"
              </p>
              <p className="text-[11px] font-semibold text-[#855B09] mt-1 tracking-wider uppercase">
                — {quote.author || 'Prineor Team'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
