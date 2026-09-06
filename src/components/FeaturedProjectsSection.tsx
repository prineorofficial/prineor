import React from 'react';
import { PageTab, ProjectCaseStudy } from '../types';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface FeaturedProjectsSectionProps {
  setActiveTab: (tab: PageTab) => void;
  onSelectProject: (project: ProjectCaseStudy) => void;
}

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  setActiveTab,
  onSelectProject,
}) => {
  const { cmsData } = useCMS();
  
  // Filter active and published projects (excluding drafts)
  const publishedProjects = (cmsData.projects || [])
    .filter(p => p.isPublished !== false && p.visibility !== 'Draft')
    .sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : 999;
      const orderB = typeof b.order === 'number' ? b.order : 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.number || '').localeCompare(b.number || '');
    });

  const featured = publishedProjects.filter(p => p.isFeatured);
  const displayProjects = featured.length >= 3 
    ? featured.slice(0, 3) 
    : [...featured, ...publishedProjects.filter(p => !p.isFeatured)].slice(0, 3);

  if (displayProjects.length === 0) return null;

  return (
    <section id="featured-projects-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D49E24]" />
          <h2 className="font-cinzel font-bold text-xl sm:text-2xl tracking-wide text-[#0F172A]">
            Featured Projects
          </h2>
        </div>

        <button
          id="view-all-projects-header-btn"
          onClick={() => setActiveTab('projects')}
          className="group text-xs sm:text-sm font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-4 h-4 text-[#D49E24] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3 Large Glass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {displayProjects.map((project) => {
          const hasCaseStudy = project.caseStudyEnabled !== false;
          const liveUrl = project.projectUrl || project.liveDemoUrl;

          return (
            <div
              key={project.id}
              id={`featured-project-${project.slug || project.id}`}
              onClick={() => {
                if (hasCaseStudy) {
                  onSelectProject(project);
                } else if (liveUrl) {
                  window.open(liveUrl, '_blank', 'noreferrer');
                }
              }}
              className="glass-panel glass-card-hover rounded-3xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer group border border-white/90 relative overflow-hidden"
            >
              {/* Top Row: Number & Action Arrow */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-cinzel text-lg sm:text-xl font-bold text-[#94A3B8] group-hover:text-[#A87915] transition-colors">
                      {project.number || '01'}
                    </span>
                    <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-[#0F172A] mt-1 group-hover:text-[#A87915] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Circular Glass Arrow Button */}
                  <div className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#0F172A] group-hover:bg-[#E6B942] group-hover:text-white transition-all shadow-sm flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 text-[11px] font-medium text-[#64748B] flex-wrap">
                    {project.tags.slice(0, 2).map((tag, tIdx) => (
                      <span key={tIdx} className="glass-pill px-2.5 py-0.5 rounded-full border border-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Project Mockup Visual Container */}
                <div className="mt-5 w-full aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-white/80 relative shadow-inner group-hover:shadow-md transition-shadow bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* View Case Study pill on hover */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap">
                    {hasCaseStudy ? 'View Case Study' : 'View Project'}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#855B09]">
                  {project.category}
                </span>

                {liveUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(liveUrl, '_blank', 'noreferrer');
                    }}
                    className="text-[11px] font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3 text-[#D49E24]" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
