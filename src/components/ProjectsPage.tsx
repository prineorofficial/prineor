import React, { useState } from 'react';
import { ProjectCaseStudy } from '../types';
import { useCMS } from '../context/CMSContext';
import { Sparkles, Search, ArrowUpRight, Layers, ExternalLink, Calendar } from 'lucide-react';

interface ProjectsPageProps {
  onSelectProject: (project: ProjectCaseStudy) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
  const { cmsData } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter published projects (excluding drafts) and sort by order / number
  const publishedProjects = (cmsData.projects || [])
    .filter(p => p.isPublished !== false && p.visibility !== 'Draft')
    .sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : 999;
      const orderB = typeof b.order === 'number' ? b.order : 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.number || '').localeCompare(b.number || '');
    });

  // Extract distinct categories
  const categorySet = new Set<string>();
  publishedProjects.forEach(p => {
    if (p.category) categorySet.add(p.category);
    if (p.categories && Array.isArray(p.categories)) {
      p.categories.forEach(c => categorySet.add(c));
    }
  });

  const availableCategories = ['All', ...Array.from(categorySet)];

  const filteredProjects = publishedProjects.filter((project) => {
    const matchesCategory = 
      selectedCategory === 'All' || 
      project.category === selectedCategory ||
      (project.categories && project.categories.includes(selectedCategory));

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch = 
      (project.title && project.title.toLowerCase().includes(query)) ||
      (project.subtitle && project.subtitle.toLowerCase().includes(query)) ||
      (project.shortDescription && project.shortDescription.toLowerCase().includes(query)) ||
      (project.tags && project.tags.some(t => t.toLowerCase().includes(query))) ||
      (project.tools && project.tools.some(t => t.toLowerCase().includes(query))) ||
      (project.technologies && project.technologies.some(t => t.toLowerCase().includes(query)));

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="projects-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Portfolio</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
          Selected Works & Case Studies
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3">
          Explore production websites, AI integrations, design systems, and digital solutions crafted by Prineor.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 mb-8 border border-white/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
          {availableCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-bold shadow-sm'
                    : 'glass-pill text-[#64748B] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects & technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full glass-pill bg-white/70 border border-white/90 text-xs focus:outline-none focus:ring-1 focus:ring-[#D49E24] placeholder:text-[#94A3B8] text-[#0F172A]"
          />
        </div>

      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-[#64748B]">
          <Layers className="w-10 h-10 mx-auto mb-3 text-[#94A3B8]" />
          <p className="font-heading font-semibold text-base text-[#0F172A]">No projects match your criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-3 text-xs font-semibold text-[#855B09] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const hasCaseStudy = project.caseStudyEnabled !== false;
            const projectLiveUrl = project.projectUrl || project.liveDemoUrl;

            return (
              <div
                key={project.id}
                id={`project-card-${project.slug || project.id}`}
                onClick={() => {
                  if (hasCaseStudy) {
                    onSelectProject(project);
                  } else if (projectLiveUrl) {
                    window.open(projectLiveUrl, '_blank', 'noreferrer');
                  }
                }}
                className="glass-panel glass-card-hover rounded-3xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer group border border-white/90 relative overflow-hidden transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel text-sm font-bold text-[#A87915]">
                          {project.number || '01'}
                        </span>
                        {project.year && (
                          <span className="text-[10px] text-[#94A3B8] font-semibold flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                            {project.year}
                          </span>
                        )}
                        {project.status && (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {project.status}
                          </span>
                        )}
                      </div>

                      <h3 className="font-cinzel font-bold text-xl text-[#0F172A] mt-1 group-hover:text-[#A87915] transition-colors leading-snug">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-xs text-[#64748B] font-medium mt-0.5">
                          {project.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#0F172A] group-hover:bg-[#E6B942] group-hover:text-white transition-all shadow-sm flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="glass-pill px-2.5 py-0.5 text-[10px] font-medium text-[#475569] rounded-full border border-white/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Mockup Preview Container */}
                  <div className="mt-4 w-full aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-white/80 relative shadow-inner bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <p className="text-xs text-[#475569] mt-4 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Bottom Row Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-200/50 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#855B09] truncate">
                    {project.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {projectLiveUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(projectLiveUrl, '_blank', 'noreferrer');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-semibold text-[#0F172A] border border-slate-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Visit Live Project"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3 text-[#D49E24]" />
                      </button>
                    )}

                    {hasCaseStudy && (
                      <span className="text-xs font-semibold text-[#0F172A] group-hover:text-[#A87915] flex items-center gap-1">
                        <span>Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
