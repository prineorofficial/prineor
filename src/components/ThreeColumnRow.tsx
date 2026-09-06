import React from 'react';
import { PageTab } from '../types';
import { ASSETS, skillCategories, techStack } from '../data/portfolioData';
import { useCMS } from '../context/CMSContext';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Code2, 
  TrendingUp, 
  Share2, 
  FileCode2, 
  Palette, 
  Code, 
  Atom, 
  Globe, 
  Server, 
  Terminal, 
  Flame, 
  Database, 
  Framer, 
  GitBranch,
  Layers,
  Layout
} from 'lucide-react';

interface ThreeColumnRowProps {
  setActiveTab: (tab: PageTab) => void;
}

export const ThreeColumnRow: React.FC<ThreeColumnRowProps> = ({ setActiveTab }) => {
  const { cmsData } = useCMS();
  const services = cmsData.services.filter(s => s.status !== 'draft');

  const iconMap: Record<string, React.ElementType> = {
    Globe: Globe,
    Bot: Bot,
    Palette: Palette,
    TrendingUp: TrendingUp,
    Share2: Share2,
    Layers: Layers,
    Layout: Layout,
    Sparkles: Sparkles,
  };

  // Tech stack icon map
  const techIconMap: Record<string, React.ElementType> = {
    HTML5: FileCode2,
    CSS3: Palette,
    JavaScript: Code,
    React: Atom,
    'Next.js': Globe,
    'Node.js': Server,
    Python: Terminal,
    'Tailwind CSS': Sparkles,
    Firebase: Flame,
    MongoDB: Database,
    Figma: Framer,
    Git: GitBranch,
  };

  const coreSkills = skillCategories[0]?.skills || [];

  return (
    <section id="three-column-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: What I Do */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)] relative overflow-hidden">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#D49E24]" />
              <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                What We Do
              </h3>
            </div>

            {/* List of Active Services */}
            <div className="space-y-4">
              {services.slice(0, 4).map((srv, idx) => {
                const Icon = iconMap[srv.iconName] || Sparkles;
                return (
                  <div key={srv.id || idx} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] flex items-center justify-center flex-shrink-0 border border-[#F5D372]/60 mt-0.5">
                      <Icon className="w-4 h-4 text-[#A87915]" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[#0F172A] group-hover:text-[#A87915] transition-colors">
                        {srv.title}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed line-clamp-2">
                        {srv.shortDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: CTA & 3D Crystal Gem Artwork in Corner */}
          <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between relative">
            <button
              id="what-i-do-cta"
              onClick={() => setActiveTab('services')}
              className="text-xs font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>All Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D49E24] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 3D Crystal Gem Prism Art */}
            <div className="w-16 h-16 opacity-90 hover:opacity-100 hover:scale-110 transition-all">
              <img
                src={ASSETS.crystalPrism}
                alt="Crystal Prism"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Skills & Expertise */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)]">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#D49E24]" />
              <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                Skills & Expertise
              </h3>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {coreSkills.map((sk, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center text-xs font-semibold text-[#1E293B] mb-1.5">
                    <span>{sk.name}</span>
                    <span className="font-cinzel text-[#855B09]">{sk.percentage}%</span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full h-2 rounded-full bg-slate-100/90 border border-slate-200/60 overflow-hidden p-[1px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] shadow-[0_0_8px_rgba(212,158,36,0.5)] transition-all duration-1000"
                      style={{ width: `${sk.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
            <button
              id="skills-view-all-cta"
              onClick={() => setActiveTab('skills')}
              className="text-xs font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>View All Skills</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D49E24] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Column 3: Tech Stack */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)]">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#D49E24]" />
              <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                Tech Stack
              </h3>
            </div>

            {/* Grid of 12 Tech Tools */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {techStack.slice(0, 12).map((tool, idx) => {
                const Icon = techIconMap[tool.name] || Code;
                return (
                  <div
                    key={idx}
                    title={`${tool.name}: ${tool.description}`}
                    className="glass-pill rounded-xl p-2 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-[#D49E24]/50 hover:scale-105 transition-all shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center mb-1 group-hover:bg-amber-50/50">
                      <Icon className="w-4 h-4 text-[#475569] group-hover:text-[#A87915] transition-colors" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#1E293B] truncate max-w-full">
                      {tool.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
            <button
              id="tech-view-all-cta"
              onClick={() => setActiveTab('skills')}
              className="text-xs font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>View All Tools</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D49E24] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
