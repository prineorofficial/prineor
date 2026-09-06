import React, { useState } from 'react';
import { PageTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { 
  Sparkles, 
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
  Cpu,
  Share2,
  Brush
} from 'lucide-react';

interface SkillsPageProps {
  setActiveTab: (tab: PageTab) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ setActiveTab }) => {
  const { cmsData } = useCMS();
  const [activeTechCategory, setActiveTechCategory] = useState('All');

  const skillCategories = cmsData.skillCategories || [];
  const techStack = cmsData.techStack || [];

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
    WordPress: Globe,
    'AI / LLMs': Cpu,
    'Graphic Design': Brush,
    'Digital Marketing': Share2,
  };

  const techCategories = [
    'All',
    ...Array.from(new Set(techStack.map(t => t.category)))
  ];

  const filteredTech = techStack.filter((t) => {
    if (activeTechCategory === 'All') return true;
    return t.category.includes(activeTechCategory) || t.category === activeTechCategory;
  });

  return (
    <div id="skills-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Expertise</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
          Technical Proficiency & Stack
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3">
          Our core capabilities in WordPress development, AI integration, graphic designing, and digital marketing.
        </p>
      </div>

      {/* 2x2 Grid of Skill Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {skillCategories.map((cat, idx) => (
          <div
            key={cat.id || idx}
            className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                {cat.category}
              </h3>
              <span className="text-[10px] font-bold text-[#855B09] tracking-wider uppercase glass-pill px-2.5 py-1 rounded-full">
                0{idx + 1} Matrix
              </span>
            </div>

            <div className="space-y-4">
              {cat.skills.map((skill, sIdx) => (
                <div key={skill.id || sIdx}>
                  <div className="flex justify-between items-center text-xs font-semibold text-[#1E293B] mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-[#A87915] font-normal font-mono px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200/50">
                        {skill.level}
                      </span>
                    </div>
                    <span className="font-cinzel text-sm text-[#855B09]">{skill.percentage}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100/90 border border-slate-200/60 overflow-hidden p-[1px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] shadow-[0_0_8px_rgba(212,158,36,0.5)] transition-all duration-1000"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Technology Stack Explorer */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-[#0F172A]">
              Technology & Framework Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Battle-tested tools and modern platforms leveraged for clients and digital products.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {techCategories.map((tc) => (
              <button
                key={tc}
                onClick={() => setActiveTechCategory(tc)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTechCategory === tc
                    ? 'bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-bold shadow-xs'
                    : 'glass-pill text-[#64748B] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                {tc}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTech.map((tech, idx) => {
            const Icon = techIconMap[tech.name] || Layers;
            return (
              <div
                key={tech.id || idx}
                className="glass-pill rounded-2xl p-4 flex flex-col justify-between hover:bg-white hover:border-[#D49E24]/50 hover:scale-[1.02] transition-all shadow-xs group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-amber-50/50 border border-slate-200/50">
                    <Icon className="w-5 h-5 text-[#475569] group-hover:text-[#A87915] transition-colors" />
                  </div>
                  <span className="text-[10px] font-mono font-medium text-[#94A3B8] glass-pill px-2 py-0.5 rounded-md">
                    {tech.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-[#0F172A] group-hover:text-[#A87915] transition-colors">
                    {tech.name}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
