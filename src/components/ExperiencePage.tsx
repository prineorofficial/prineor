import React from 'react';
import { PageTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { Sparkles, Briefcase, CheckCircle2, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface ExperiencePageProps {
  setActiveTab: (tab: PageTab) => void;
  onOpenResume?: () => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ setActiveTab }) => {
  const { cmsData } = useCMS();
  const experienceTimeline = cmsData.experienceTimeline || [];

  const learningFocus = [
    {
      title: 'Modern Web Engineering & WordPress',
      institution: 'Independent Practice & Real-World Projects',
      year: '2026',
      details: 'Deep practice in custom WordPress architectures, modern web frameworks, TypeScript, responsive layouts, and performance optimization.'
    },
    {
      title: 'AI Engineering & Automation Workflows',
      institution: 'Continuous Experimentation & API Integration',
      year: '2026',
      details: 'Integrating Gemini AI, automated content tools, and practical smart assistants into modern web interfaces.'
    }
  ];

  const focusAreas = [
    { name: 'Custom WordPress & CMS Solutions', issuer: 'Clean theme setups, fast speeds, and intuitive editor workflows', year: '2026' },
    { name: 'AI-Powered Web Tools & Interfaces', issuer: 'Practical automation and conversational user interfaces', year: '2026' },
    { name: 'Digital Marketing & Social Strategy', issuer: 'Content pillars, engaging hooks, and organic growth frameworks', year: '2026' },
    { name: 'UI/UX & Glassmorphic Design Systems', issuer: 'Crystal-clean typography, balanced spacing, and responsive layout polish', year: '2026' }
  ];

  const commitments = [
    { title: 'Honest Craftsmanship', desc: 'No inflated metrics or fake claims — just dedicated execution and continuous daily improvement.' },
    { title: 'Practical Business Utility', desc: 'Every website, tool, or strategy is built to solve real problems and create tangible value.' },
    { title: 'Long-Term Brand Building', desc: 'Building Prineor step by step into a strong, reliable, and trusted digital powerhouse.' }
  ];

  return (
    <div id="experience-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Prineor Journey</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
          Experience & Brand Growth
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3">
          Prineor is in its early stage, combining practical project experience with continuous learning, experimentation, and building.
        </p>
      </div>

      {/* Main Experience Timeline */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 mb-12 border border-white/90 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] flex items-center justify-center border border-[#F5D372]/60">
              <Briefcase className="w-5 h-5 text-[#A87915]" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-[#0F172A]">
                Practical Experience & Projects
              </h2>
              <p className="text-xs text-[#64748B]">Our journey of building websites, AI tools, and growth strategies.</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('contact')}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-semibold text-xs shadow-sm hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Partner With Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#E6B942] via-[#D49E24]/60 before:to-slate-200">
          {experienceTimeline.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Pin */}
              <span className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#D49E24] shadow-[0_0_10px_rgba(212,158,36,0.6)] group-hover:scale-125 transition-transform" />

              <div className="glass-pill rounded-2xl p-5 sm:p-6 border border-white/90 shadow-xs hover:bg-white transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#0F172A]">
                    {item.title}
                  </h3>
                  <span className="font-cinzel text-xs font-bold text-[#A87915] glass-pill px-3 py-1 rounded-full w-fit">
                    {item.year}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#855B09] mb-3">
                  {item.role} • {item.organization}
                </p>

                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-200/50">
                    <span className="text-[11px] font-bold text-[#64748B] tracking-wider uppercase block mb-1">
                      Key Highlights:
                    </span>
                    {item.highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-[#334155]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D49E24] flex-shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 3-Column Bottom Row: Learning & Foundations, Core Disciplines, Brand Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Learning Foundations */}
        <div className="glass-panel rounded-3xl p-6 border border-white/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="w-5 h-5 text-[#A87915]" />
            <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">Active Learning</h3>
          </div>

          <div className="space-y-4">
            {learningFocus.map((edu, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <span className="font-mono text-[11px] text-[#A87915] font-bold">{edu.year}</span>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{edu.title}</h4>
                <p className="text-[#64748B]">{edu.institution}</p>
                <p className="text-[#475569] pt-1.5 border-t border-slate-200/50 leading-relaxed">{edu.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Disciplines */}
        <div className="glass-panel rounded-3xl p-6 border border-white/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <Layers className="w-5 h-5 text-[#A87915]" />
            <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">Core Disciplines</h3>
          </div>

          <div className="space-y-3">
            {focusAreas.map((cert, idx) => (
              <div key={idx} className="glass-pill p-2.5 rounded-xl border border-white/80">
                <div className="flex justify-between items-start text-xs">
                  <h4 className="font-medium text-[#0F172A] font-heading">{cert.name}</h4>
                  <span className="text-[10px] font-mono text-[#A87915]">{cert.year}</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Commitments */}
        <div className="glass-panel rounded-3xl p-6 border border-white/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <Sparkles className="w-5 h-5 text-[#A87915]" />
            <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">Brand Commitments</h3>
          </div>

          <div className="space-y-3">
            {commitments.map((ach, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D49E24]" />
                  <span>{ach.title}</span>
                </h4>
                <p className="text-xs text-[#64748B] pl-3 leading-relaxed">
                  {ach.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
