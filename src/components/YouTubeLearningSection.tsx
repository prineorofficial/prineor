import React from 'react';
import { Youtube, Sparkles, ArrowRight, Video } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface YouTubeLearningSectionProps {
  youtubeUrl?: string;
}

export const YouTubeLearningSection: React.FC<YouTubeLearningSectionProps> = ({
  youtubeUrl: propUrl
}) => {
  const { cmsData } = useCMS();
  const learning = cmsData.learning;
  const youtubeUrl = propUrl || learning.youtubeUrl || cmsData.brand.youtubeUrl || 'https://www.youtube.com/@Prineorofficial';

  if (!learning.isEnabled) return null;

  return (
    <section id="youtube-learning-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="relative w-full rounded-3xl glass-panel-elevated p-6 sm:p-10 border border-white/95 shadow-[0_20px_50px_rgba(212,158,36,0.08)] overflow-hidden">
        
        {/* Soft Ambient Gold/Pearl Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FEF3C7]/50 via-[#FDE68A]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-[#DBEAFE]/40 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                YouTube Community & Tutorials
              </span>
            </div>

            <h2 className="font-cinzel font-black text-2xl sm:text-4xl text-[#0F172A] tracking-wide leading-tight">
              {learning.title || 'Want To Learn With Us?'}
            </h2>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
              {learning.description || 'If you want to learn how to build websites with AI, follow Prineor on YouTube. We will share what we learn, what we build, and useful knowledge that can help you grow your own digital skills.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                id="youtube-learning-cta-btn"
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-semibold text-xs sm:text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:shadow-[0_8px_30px_rgba(212,158,36,0.5)] hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Youtube className="w-4 h-4 text-[#0F172A]" />
                <span>{learning.buttonText || 'Learn With Prineor'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <span className="text-xs text-[#64748B] font-medium flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#D49E24]" />
                <span>Free tutorials, project breakdowns & AI insights</span>
              </span>
            </div>
          </div>

          {/* Right Column: Crystal YouTube Showcase Card */}
          <div className="lg:col-span-4 flex justify-center">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="relative w-full max-w-[280px] aspect-[4/3] rounded-2xl p-4 glass-panel border border-white/90 shadow-sm hover:scale-105 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                  <Youtube className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#855B09] uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                  @Prineorofficial
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#0F172A] block group-hover:text-[#A87915] transition-colors">
                  Prineor Official
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  Websites • AI Tools • Digital Skills
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-[#855B09] pt-2 border-t border-slate-200/50">
                <span>Watch on YouTube</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
