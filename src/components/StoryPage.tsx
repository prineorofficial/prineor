import React, { useState } from 'react';
import { PageTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { Sparkles, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface StoryPageProps {
  setActiveTab: (tab: PageTab) => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ setActiveTab }) => {
  const { cmsData } = useCMS();
  const story = cmsData.story;
  const milestones = story.milestones || [];
  const [expandedYear, setExpandedYear] = useState<string | null>(milestones[0]?.year || '2026');

  return (
    <div id="story-page" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Our Story</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
          {story.title || 'The Journey of Prineor'}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3">
          {story.subtitle || 'Started in 2026 with a simple idea: to build something of our own and turn our skills, creativity, and curiosity into a real brand.'}
        </p>
      </div>

      {/* Workspace Feature Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-12 border border-white/90 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-white/80">
          <img
            src={story.heroImage}
            alt="Prineor Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2">
          <span className="text-xs font-bold text-[#A87915] tracking-widest uppercase">Brand Foundation</span>
          <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-[#0F172A] mt-1 mb-3">
            Learning, Building & Experimenting
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            We are currently at the beginning of our journey. We combine practical project experience with continuous learning, experimenting, and building. Every project is an opportunity to improve our skills and create real value.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('projects')}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all cursor-pointer"
            >
              <span>Explore Our Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Vertical Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#E6B942] via-[#D49E24]/60 before:to-slate-200">
        {milestones.map((milestone, idx) => {
          const isExpanded = expandedYear === milestone.year;
          return (
            <div key={idx} className="relative group">
              
              {/* Year Marker Pin */}
              <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-6 h-6 rounded-full bg-gradient-to-tr from-[#E6B942] to-[#D49E24] p-[2px] shadow-sm flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#D49E24]" />
                </div>
              </div>

              {/* Timeline Card */}
              <div 
                onClick={() => setExpandedYear(isExpanded ? null : milestone.year)}
                className="glass-panel glass-card-hover rounded-2xl p-5 sm:p-6 border border-white/90 shadow-xs cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel font-bold text-sm sm:text-base text-[#A87915]">
                        {milestone.year}
                      </span>
                      <span className="text-xs text-[#94A3B8]">•</span>
                      <span className="text-xs font-semibold text-[#64748B]">
                        {milestone.role}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-[#0F172A] mt-1">
                      {milestone.title}
                    </h3>
                  </div>

                  <button className="text-[#64748B] hover:text-[#0F172A] p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed">
                  {milestone.description}
                </p>

                {/* Expanded Highlights */}
                {isExpanded && milestone.highlights && milestone.highlights.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200/50 space-y-2 animate-in fade-in duration-200">
                    <span className="text-[11px] font-bold text-[#855B09] tracking-wider uppercase">Focus Areas:</span>
                    {milestone.highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs text-[#334155]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D49E24] flex-shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
