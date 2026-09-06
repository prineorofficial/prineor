import React, { useState } from 'react';
import { ProjectCaseStudy, PageTab } from '../types';
import { 
  X, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Layers, 
  Cpu, 
  Calendar,
  User,
  Activity,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Briefcase,
  Target,
  Users,
  Compass,
  AlertCircle,
  Award,
  Zap,
  Clock
} from 'lucide-react';

import { SocialShareButtons } from './SocialShareButtons';

interface ProjectDetailModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
  allProjects?: ProjectCaseStudy[];
  onSelectProject?: (project: ProjectCaseStudy) => void;
  setActiveTab?: (tab: PageTab) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  project, 
  onClose,
  allProjects = [],
  onSelectProject,
  setActiveTab
}) => {
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  if (!project) return null;

  // Filter only published projects for dynamic previous / next navigation
  const publishedList = allProjects.filter(p => p.isPublished !== false && p.visibility !== 'Draft');
  const currentIndex = publishedList.findIndex(p => p.id === project.id);
  
  const prevProject = currentIndex > 0 ? publishedList[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < publishedList.length - 1 ? publishedList[currentIndex + 1] : null;

  const settings = project.settings || {
    showGallery: true,
    showChallenge: true,
    showApproach: true,
    showResults: true,
    showTools: true,
    showOurRole: true,
    showWhatWeDid: true,
    showProcess: true
  };

  const projectUrl = project.projectUrl || project.liveDemoUrl;
  const challengeText = project.challenge || project.problem;
  const approachText = project.approach || project.solution;
  const roleText = project.ourRole || project.role;
  const servicesList = project.servicesUsed && project.servicesUsed.length > 0 
    ? project.servicesUsed 
    : (project.categories && project.categories.length > 0 ? project.categories : [project.category]);
  const toolsList = project.tools && project.tools.length > 0 ? project.tools : project.technologies || [];
  const gallery = project.galleryImages && project.galleryImages.length > 0 ? project.galleryImages : [];

  const handleNavigateToProject = (target: ProjectCaseStudy) => {
    if (onSelectProject) {
      onSelectProject(target);
    }
  };

  const handleContactClick = () => {
    onClose();
    if (setActiveTab) {
      setActiveTab('contact');
    }
  };

  return (
    <>
      <div 
        id="case-study-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        {/* Modal Container */}
        <div 
          id={`case-study-${project.slug || project.id}`}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel-elevated p-5 sm:p-8 md:p-10 border border-white/95 shadow-2xl animate-in zoom-in-95 duration-300 bg-white/95 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Sticky Bar */}
          <div className="sticky top-0 z-30 -mt-2 -mx-2 px-2 py-2 mb-4 flex items-center justify-between bg-white/85 backdrop-blur-md rounded-2xl border border-slate-100/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold text-[#855B09] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D49E24]" />
                <span>Case Study {project.number}</span>
              </span>
              <span className="text-xs font-semibold text-[#64748B] hidden sm:inline">
                {project.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {projectUrl && (
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-bold text-xs shadow-xs hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <span>Visit Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                aria-label="Close Case Study"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Header Section */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-[#855B09] border border-amber-300/40 text-xs font-bold uppercase tracking-wider">
                {project.category}
              </span>
              {project.year && (
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#D49E24]" />
                  <span>{project.year}</span>
                </span>
              )}
              {project.status && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  project.status === 'Completed' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' 
                    : project.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                    : 'bg-purple-50 text-purple-800 border border-purple-200/60'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>{project.status}</span>
                </span>
              )}
              {project.clientName && (
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Client: {project.clientName}</span>
                </span>
              )}
            </div>

            <h1 className="font-cinzel font-black text-2xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-wide leading-tight">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-base sm:text-xl text-[#64748B] font-medium mt-1.5">
                {project.subtitle}
              </p>
            )}

            {project.shortDescription && (
              <p className="text-sm sm:text-base text-[#334155] mt-3 max-w-3xl leading-relaxed">
                {project.shortDescription}
              </p>
            )}

            {/* Tags Ribbon */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="glass-pill px-3 py-1 text-xs font-semibold text-[#475569] rounded-full border border-slate-200/80 bg-slate-50/60">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Project Cover / Hero Image */}
          <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden glass-panel border border-white/95 shadow-md relative mb-10 group">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            
            <button
              onClick={() => setActiveLightboxImg(project.image)}
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#0F172A] shadow-md hover:bg-[#E6B942] hover:text-white transition-all cursor-pointer"
              title="Expand Image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Key Metrics / Results Highlights if present */}
          {settings.showResults !== false && project.results && project.results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {project.results.map((res, idx) => (
                <div key={idx} className="glass-panel rounded-2xl p-4 sm:p-5 text-center border border-white/90 shadow-2xs bg-gradient-to-b from-white/90 to-amber-50/20">
                  <span className="font-cinzel font-black text-2xl sm:text-3xl text-gold-gradient block">
                    {res.metric}
                  </span>
                  <span className="text-xs text-[#64748B] font-semibold mt-1 block">
                    {res.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Main Case Study Body Sections */}
          <div className="space-y-8 text-[#334155]">

            {/* 1. Project Overview, Purpose, & Audience */}
            {(project.overview || project.purpose || project.targetAudience) && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xs space-y-4">
                <h3 className="font-cinzel font-bold text-xl text-[#0F172A] flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-[#D49E24]" />
                  <span>Project Overview</span>
                </h3>

                {project.overview && (
                  <p className="text-sm sm:text-base leading-relaxed text-[#475569]">
                    {project.overview}
                  </p>
                )}

                {(project.purpose || project.targetAudience) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    {project.purpose && (
                      <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/60">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#855B09] mb-1.5">
                          <Target className="w-3.5 h-3.5 text-[#D49E24]" />
                          <span>Project Purpose</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          {project.purpose}
                        </p>
                      </div>
                    )}

                    {project.targetAudience && (
                      <div className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100/60">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>Target Audience</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          {project.targetAudience}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. The Challenge & Our Approach 2-Column Grid */}
            {((settings.showChallenge !== false && challengeText) || (settings.showApproach !== false && approachText)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.showChallenge !== false && challengeText && (
                  <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-red-100/80 bg-red-50/15 shadow-2xs">
                    <h3 className="font-cinzel font-bold text-lg text-[#991B1B] mb-2.5 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>The Challenge</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {challengeText}
                    </p>
                  </div>
                )}

                {settings.showApproach !== false && approachText && (
                  <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-200/80 bg-amber-50/20 shadow-2xs">
                    <h3 className="font-cinzel font-bold text-lg text-[#855B09] mb-2.5 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#D49E24]" />
                      <span>Our Approach</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                      {approachText}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. What We Did (Services Used) */}
            {settings.showWhatWeDid !== false && servicesList && servicesList.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xs">
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A] mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#D49E24]" />
                  <span>What We Did (Services Deployed)</span>
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {servicesList.map((srv, idx) => (
                    <div key={idx} className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/70 text-xs font-bold text-[#855B09] flex items-center gap-2 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Tools & Technologies */}
            {settings.showTools !== false && toolsList && toolsList.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xs">
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A] mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#D49E24]" />
                  <span>Tools & Technologies</span>
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {toolsList.map((tech, idx) => (
                    <div key={idx} className="glass-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#0F172A] border border-slate-200/80 bg-white shadow-2xs">
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Our Role */}
            {settings.showOurRole !== false && roleText && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xs">
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A] mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#D49E24]" />
                  <span>Our Role</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {roleText}
                </p>
              </div>
            )}

            {/* 6. Execution Process / Steps */}
            {settings.showProcess !== false && project.process && project.process.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xs">
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A] mb-4">
                  Execution Workflow
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.process.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/70 border border-slate-100 shadow-2xs">
                      <span className="font-cinzel text-xs font-bold text-[#A87915] block mb-1">
                        Step {step.step}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#0F172A]">{step.title}</h4>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Project Gallery */}
            {settings.showGallery !== false && gallery && gallery.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xs space-y-4">
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#D49E24]" />
                  <span>Project Visual Gallery ({gallery.length})</span>
                </h3>
                <p className="text-xs text-[#64748B]">
                  Click on any screenshot to view high-resolution details.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {gallery.map((imgUrl, gIdx) => (
                    <div
                      key={gIdx}
                      onClick={() => setActiveLightboxImg(imgUrl)}
                      className="aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 relative cursor-pointer group shadow-2xs"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${gIdx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-white/90 text-[11px] font-bold text-[#0F172A] shadow-xs flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" /> View
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Results / Outcome & Additional Notes */}
            {settings.showResults !== false && (project.outcomeText || project.keyResult || project.additionalNotes) && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xs space-y-3">
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D49E24]" />
                  <span>Results & Outcome</span>
                </h3>

                {project.keyResult && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs font-bold text-[#855B09]">
                    ⭐ Key Result: {project.keyResult}
                  </div>
                )}

                {project.outcomeText && (
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {project.outcomeText}
                  </p>
                )}

                {project.additionalNotes && (
                  <p className="text-xs text-[#64748B] italic pt-2 border-t border-slate-100">
                    Note: {project.additionalNotes}
                  </p>
                )}
              </div>
            )}

            {/* Social Share Ribbon */}
            <SocialShareButtons
              url={`${window.location.origin}/projects/${project.slug || project.id}`}
              title={`${project.title} — Prineor Case Study`}
              summary={project.shortDescription || project.subtitle}
              hashtags={project.tags || ['Prineor', 'WebDev', 'CaseStudy']}
            />

            {/* 9. Comprehensive Project Details Table */}
            <div className="rounded-3xl bg-slate-50/80 p-5 sm:p-6 border border-slate-200/80">
              <h4 className="font-cinzel font-bold text-sm text-[#0F172A] uppercase tracking-wider mb-4">
                Project Specifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">Category</span>
                  <span className="font-semibold text-[#0F172A]">{project.category}</span>
                </div>
                {project.year && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">Year</span>
                    <span className="font-semibold text-[#0F172A]">{project.year}</span>
                  </div>
                )}
                {project.status && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">Status</span>
                    <span className="font-semibold text-[#0F172A]">{project.status}</span>
                  </div>
                )}
                {project.clientName && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">Client</span>
                    <span className="font-semibold text-[#0F172A]">{project.clientName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 10. Previous / Next Dynamic Navigation */}
            <div className="pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevProject ? (
                <button
                  onClick={() => handleNavigateToProject(prevProject)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center justify-center sm:justify-start gap-2 transition-all cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#D49E24] group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <span className="text-[10px] text-[#94A3B8] block uppercase">Previous Project</span>
                    <span className="font-cinzel text-xs font-bold text-[#0F172A]">{prevProject.title}</span>
                  </div>
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                Back to Projects
              </button>

              {nextProject ? (
                <button
                  onClick={() => handleNavigateToProject(nextProject)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center justify-center sm:justify-end gap-2 transition-all cursor-pointer group"
                >
                  <div className="text-right">
                    <span className="text-[10px] text-[#94A3B8] block uppercase">Next Project</span>
                    <span className="font-cinzel text-xs font-bold text-[#0F172A]">{nextProject.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D49E24] group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}
            </div>

            {/* 11. Become Our Partner & Contact CTA Banner */}
            <div className="mt-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D49E24]">
                  Start A Project Together
                </span>
                <h4 className="font-cinzel font-bold text-xl sm:text-2xl mt-1">
                  Have a vision for your next website or AI solution?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Let Prineor build, design, and execute your digital presence with authentic craftsmanship.
                </p>
              </div>

              <button
                onClick={handleContactClick}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
              >
                Contact Prineor →
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Lightbox for Gallery Zoom */}
      {activeLightboxImg && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveLightboxImg(null)}
        >
          <button
            onClick={() => setActiveLightboxImg(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={activeLightboxImg}
            alt="Enlarged gallery view"
            referrerPolicy="no-referrer"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
