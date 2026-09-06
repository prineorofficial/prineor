import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { ProjectCaseStudy } from '../../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Star, 
  Edit3, 
  Layers, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  X, 
  AlertTriangle, 
  FileText, 
  Globe, 
  Sliders, 
  Calendar, 
  Clock, 
  Briefcase, 
  Cpu, 
  Zap, 
  Target, 
  Users, 
  Compass, 
  Award, 
  AlertCircle, 
  Maximize2 
} from 'lucide-react';
import { ASSETS } from '../../../data/portfolioData';
import { ProjectDetailModal } from '../../ProjectDetailModal';

type EditorTab = 'basic' | 'media' | 'casestudy' | 'settings' | 'seo';

export const ProjectsSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection, saveToServer } = useCMS();
  const [projects, setProjects] = useState<ProjectCaseStudy[]>(() => {
    return (cmsData.projects || []).map((p, idx) => ({
      ...p,
      slug: p.slug || generateSlug(p.title),
      order: typeof p.order === 'number' ? p.order : idx + 1,
      year: p.year || '2026',
      status: p.status || 'Completed',
      visibility: p.visibility || (p.isPublished === false ? 'Draft' : 'Published'),
      caseStudyEnabled: p.caseStudyEnabled !== false,
      isPublished: p.isPublished !== false && p.visibility !== 'Draft',
      settings: p.settings || {
        showGallery: true,
        showChallenge: true,
        showApproach: true,
        showResults: true,
        showTools: true,
        showOurRole: true,
        showWhatWeDid: true,
        showProcess: true
      }
    }));
  });

  const [editingProject, setEditingProject] = useState<ProjectCaseStudy | null>(null);
  const [editorTab, setEditorTab] = useState<EditorTab>('basic');
  const [previewProject, setPreviewProject] = useState<ProjectCaseStudy | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Published' | 'Draft' | 'Featured'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Input states for multi-values in editor
  const [newToolInput, setNewToolInput] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');

  const standardCategories = [
    'WordPress',
    'AI Development',
    'Graphic Design',
    'Digital Marketing',
    'Social Media',
    'UI/UX'
  ];

  const standardServices = [
    'WordPress Development',
    'AI Development',
    'Graphic Designing',
    'Digital Marketing',
    'Social Media Services',
    'UI/UX Design',
    'SEO & Performance',
    'Brand Identity'
  ];

  // Helper to slugify titles
  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project-case-study';
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Sync back to CMSContext and server
  const persistProjects = async (updatedProjects: ProjectCaseStudy[], msg = 'Project saved successfully.') => {
    setIsSaving(true);
    try {
      updateSection('projects', updatedProjects);
      const res = await saveToServer({
        ...cmsData,
        projects: updatedProjects
      });
      if (res.success) {
        showToast(msg, 'success');
      } else {
        showToast(res.message || 'Saved locally (server sync issue)', 'success');
      }
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new project
  const handleAddNewProject = () => {
    const newId = `proj-${Date.now()}`;
    const nextOrder = projects.length + 1;
    const nextNumber = nextOrder < 10 ? `0${nextOrder}` : `${nextOrder}`;
    const defaultTitle = `New Project ${nextNumber}`;
    const defaultSlug = `new-project-${nextNumber.toLowerCase()}`;

    const newProj: ProjectCaseStudy = {
      id: newId,
      number: nextNumber,
      slug: defaultSlug,
      title: defaultTitle,
      subtitle: 'Modern Digital Experience',
      category: 'WordPress',
      categories: ['WordPress'],
      tags: ['WordPress', 'Responsive', 'Modern UI'],
      image: ASSETS.mockupMinimalist,
      galleryImages: [ASSETS.mockupMinimalist, ASSETS.mockupDarkPro],
      mockupType: 'dashboard',
      shortDescription: 'Project overview describing the objectives, design systems, and digital deliverables.',
      overview: 'Comprehensive background summary detailing the practical execution, architecture, and workflow.',
      purpose: 'To deliver a scalable, highly accessible digital experience tailored for client engagement.',
      targetAudience: 'Digital creators, businesses, and modern web users seeking high-performance solutions.',
      problem: 'The client required a clean, responsive layout with high speed benchmarks and clear branding.',
      challenge: 'Ensuring fast render times, seamless mobile accessibility, and crystal-clear visual hierarchy.',
      solution: 'Developed a bespoke interface with thoughtful layouts, optimized assets, and modular components.',
      approach: 'Mapped user journeys, designed high-contrast components, and implemented rapid performance tuning.',
      servicesUsed: ['WordPress Development'],
      tools: ['WordPress', 'Elementor', 'Tailwind CSS', 'Figma'],
      role: 'Design & Web Development',
      ourRole: 'Designed and developed the full website experience using modern responsive workflows and AI assistance.',
      technologies: ['WordPress', 'PHP', 'Tailwind CSS', 'Figma'],
      process: [
        { step: '01', title: 'Discovery & IA', description: 'Outlining information architecture and user flows.' },
        { step: '02', title: 'Design & Execution', description: 'Crafting responsive UI with clean typography and assets.' },
        { step: '03', title: 'Quality Assurance', description: 'Testing across mobile, tablet, and widescreen viewports.' }
      ],
      features: ['Lightning fast page speed', 'Fully responsive across all screen sizes', 'Custom branded aesthetics'],
      results: [{ metric: '100%', label: 'Mobile Responsive' }, { metric: '0.5s', label: 'Page Load' }],
      outcomeText: 'Successfully launched a high-performing digital platform that elevates brand credibility.',
      keyResult: '100% Mobile Optimized with clean interactive typography.',
      additionalNotes: 'Built according to Prineor craftsmanship standards.',
      challenges: 'Optimizing high-resolution imagery and maintaining responsive consistency.',
      liveDemoUrl: 'https://prineor.com',
      projectUrl: 'https://prineor.com',
      year: '2026',
      status: 'Completed',
      visibility: 'Published',
      order: nextOrder,
      lastUpdated: new Date().toLocaleDateString(),
      isFeatured: false,
      isPublished: true,
      caseStudyEnabled: true,
      settings: {
        showGallery: true,
        showChallenge: true,
        showApproach: true,
        showResults: true,
        showTools: true,
        showOurRole: true,
        showWhatWeDid: true,
        showProcess: true
      },
      seo: {
        title: defaultTitle,
        description: 'Project overview describing the objectives, design systems, and digital deliverables.'
      }
    };

    const nextProjects = [newProj, ...projects];
    setProjects(nextProjects);
    setEditingProject(newProj);
    setEditorTab('basic');
    persistProjects(nextProjects, 'New project created! Now editing.');
  };

  // Duplicate an existing project
  const handleDuplicateProject = (project: ProjectCaseStudy) => {
    const newId = `proj-${Date.now()}`;
    const nextOrder = projects.length + 1;
    const nextNumber = nextOrder < 10 ? `0${nextOrder}` : `${nextOrder}`;
    const newTitle = `${project.title} (Copy)`;
    const newSlug = `${generateSlug(project.title)}-copy-${Date.now().toString().slice(-4)}`;

    const duplicated: ProjectCaseStudy = {
      ...project,
      id: newId,
      number: nextNumber,
      title: newTitle,
      slug: newSlug,
      order: nextOrder,
      visibility: 'Draft',
      isPublished: false,
      isFeatured: false,
      lastUpdated: new Date().toLocaleDateString()
    };

    const nextProjects = [duplicated, ...projects];
    setProjects(nextProjects);
    persistProjects(nextProjects, `Duplicated "${project.title}" as draft.`);
  };

  // Delete project
  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    const target = projects.find(p => p.id === deleteConfirmId);
    const nextProjects = projects.filter(p => p.id !== deleteConfirmId);
    setProjects(nextProjects);
    if (editingProject && editingProject.id === deleteConfirmId) {
      setEditingProject(null);
    }
    setDeleteConfirmId(null);
    persistProjects(nextProjects, `Project "${target?.title || 'item'}" deleted successfully.`);
  };

  // Toggle Publish
  const handleTogglePublish = (project: ProjectCaseStudy) => {
    const isCurrentlyPublished = project.isPublished !== false && project.visibility !== 'Draft';
    const updatedVisibility: 'Published' | 'Draft' = isCurrentlyPublished ? 'Draft' : 'Published';
    const updatedPublished = !isCurrentlyPublished;

    const nextProjects = projects.map(p => {
      if (p.id === project.id) {
        return {
          ...p,
          visibility: updatedVisibility,
          isPublished: updatedPublished,
          lastUpdated: new Date().toLocaleDateString()
        };
      }
      return p;
    });

    setProjects(nextProjects);
    persistProjects(nextProjects, `Project "${project.title}" marked as ${updatedVisibility}.`);
  };

  // Toggle Featured
  const handleToggleFeatured = (project: ProjectCaseStudy) => {
    const nextFeatured = !project.isFeatured;
    const nextProjects = projects.map(p => {
      if (p.id === project.id) {
        return {
          ...p,
          isFeatured: nextFeatured,
          lastUpdated: new Date().toLocaleDateString()
        };
      }
      return p;
    });

    setProjects(nextProjects);
    persistProjects(nextProjects, nextFeatured ? `Featured "${project.title}" on homepage.` : `Unfeatured "${project.title}".`);
  };

  // Reorder projects (Move Up / Move Down)
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const next = [...projects];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;

    // Update order numbers
    const reordered = next.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setProjects(reordered);
    persistProjects(reordered, 'Projects reordered successfully.');
  };

  // Handle Cover Image Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProject) return;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setEditingProject(prev => (prev ? { ...prev, image: result } : null));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Gallery Multiple Uploads
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProject) return;
    if (e.target.files) {
      const fileList: File[] = Array.from(e.target.files);
      fileList.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setEditingProject(prev => {
              if (!prev) return null;
              const currentGallery = prev.galleryImages || [];
              return {
                ...prev,
                galleryImages: [...currentGallery, result]
              };
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Add Gallery URL manually
  const handleAddGalleryUrl = () => {
    if (!editingProject || !newGalleryUrlInput.trim()) return;
    setEditingProject(prev => {
      if (!prev) return null;
      const current = prev.galleryImages || [];
      return {
        ...prev,
        galleryImages: [...current, newGalleryUrlInput.trim()]
      };
    });
    setNewGalleryUrlInput('');
  };

  // Delete Gallery Image
  const handleDeleteGalleryImage = (index: number) => {
    if (!editingProject) return;
    setEditingProject(prev => {
      if (!prev) return null;
      const nextGallery = (prev.galleryImages || []).filter((_, idx) => idx !== index);
      return {
        ...prev,
        galleryImages: nextGallery
      };
    });
  };

  // Move Gallery Image Left/Right
  const handleMoveGalleryImage = (index: number, direction: 'left' | 'right') => {
    if (!editingProject) return;
    const gallery = [...(editingProject.galleryImages || [])];
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= gallery.length) return;

    const temp = gallery[index];
    gallery[index] = gallery[target];
    gallery[target] = temp;

    setEditingProject(prev => (prev ? { ...prev, galleryImages: gallery } : null));
  };

  // Save Project in Editor
  const handleSaveEditor = (publishStatus?: 'Published' | 'Draft') => {
    if (!editingProject) return;

    // Validate title and slug
    const finalTitle = editingProject.title.trim() || 'Untitled Project';
    let finalSlug = (editingProject.slug || generateSlug(finalTitle)).trim();

    // Check slug collision with other projects
    const hasCollision = projects.some(p => p.id !== editingProject.id && p.slug === finalSlug);
    if (hasCollision) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const visibility = publishStatus || editingProject.visibility || 'Published';
    const isPub = visibility === 'Published';

    const updated: ProjectCaseStudy = {
      ...editingProject,
      title: finalTitle,
      slug: finalSlug,
      visibility,
      isPublished: isPub,
      lastUpdated: new Date().toLocaleDateString(),
      seo: {
        title: editingProject.seo?.title || finalTitle,
        description: editingProject.seo?.description || editingProject.shortDescription,
        ogImage: editingProject.seo?.ogImage || editingProject.image
      }
    };

    const nextProjects = projects.map(p => (p.id === updated.id ? updated : p));
    setProjects(nextProjects);
    setEditingProject(null);
    persistProjects(nextProjects, `Project "${updated.title}" saved successfully (${visibility}).`);
  };

  // Reset to Defaults
  const handleResetToDefault = () => {
    if (window.confirm('Reset all projects to official default Prineor showcase case studies?')) {
      resetSection('projects');
      setProjects([...cmsData.projects]);
      setEditingProject(null);
      showToast('Projects reset to default.', 'success');
    }
  };

  // Filtered list for display
  const filteredProjects = projects.filter(p => {
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesStatus = 
      filterStatus === 'All' ? true :
      filterStatus === 'Published' ? (p.isPublished !== false && p.visibility !== 'Draft') :
      filterStatus === 'Draft' ? (p.visibility === 'Draft' || p.isPublished === false) :
      p.isFeatured;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (
      p.title.toLowerCase().includes(query) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(query)) ||
      (p.slug && p.slug.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    );

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const publishedCount = projects.filter(p => p.isPublished !== false && p.visibility !== 'Draft').length;
  const draftCount = projects.filter(p => p.visibility === 'Draft' || p.isPublished === false).length;
  const featuredCount = projects.filter(p => p.isFeatured).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Portfolio & Case Studies</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#0F172A]">
            Project & Case Study Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Complete dynamic project dashboard. Manage covers, galleries, challenge, approach, results, tools, and SEO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddNewProject}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4 text-[#0F172A]" />
            <span>Add Project</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isSaving}
            className="px-3 py-2 rounded-xl text-[#64748B] hover:text-red-600 hover:bg-red-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset to default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 animate-in fade-in ${
          toastType === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toastType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-white/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">Total Projects</span>
          <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#0F172A]">{projects.length}</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-emerald-100 bg-emerald-50/30 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Published</span>
          <span className="font-cinzel text-xl sm:text-2xl font-bold text-emerald-800">{publishedCount}</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 bg-slate-50/50 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Drafts</span>
          <span className="font-cinzel text-xl sm:text-2xl font-bold text-slate-700">{draftCount}</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-200 bg-amber-50/40 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#855B09] block">Featured</span>
          <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#D49E24]">{featuredCount}</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['All', 'Published', 'Draft', 'Featured'] as const).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#0F172A] text-white shadow-2xs'
                  : 'glass-pill text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {st} {st === 'Published' ? `(${publishedCount})` : st === 'Draft' ? `(${draftCount})` : st === 'Featured' ? `(${featuredCount})` : ''}
            </button>
          ))}
        </div>

        {/* Category & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-full glass-pill bg-white border border-slate-200 text-xs font-medium text-[#0F172A]"
          >
            <option value="All">All Categories</option>
            {standardCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full glass-pill bg-white border border-slate-200 text-xs text-[#0F172A]"
            />
          </div>
        </div>

      </div>

      {/* Projects List Table / Cards */}
      <div className="space-y-3.5">
        {filteredProjects.length === 0 ? (
          <div className="p-10 rounded-3xl glass-panel text-center text-[#64748B] border border-white/90">
            <Layers className="w-8 h-8 mx-auto mb-2 text-[#94A3B8]" />
            <p className="font-semibold text-sm text-[#0F172A]">No projects found matching filter.</p>
            <button
              type="button"
              onClick={() => { setFilterCategory('All'); setFilterStatus('All'); setSearchQuery(''); }}
              className="mt-2 text-xs font-bold text-[#D49E24] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredProjects.map((proj, idx) => {
            const isPub = proj.isPublished !== false && proj.visibility !== 'Draft';
            const isFeat = !!proj.isFeatured;

            return (
              <div
                key={proj.id}
                className={`rounded-2xl glass-panel p-4 sm:p-5 border transition-all ${
                  isPub ? 'border-white/90 bg-white/80' : 'border-slate-200/50 bg-slate-50/60 opacity-80'
                } shadow-2xs hover:shadow-xs`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Project Preview Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Order buttons */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-[#0F172A] disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={idx === filteredProjects.length - 1}
                        className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-[#0F172A] disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Image Thumbnail */}
                    <img
                      src={proj.image}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                    />

                    {/* Project Text Info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-cinzel text-[11px] font-bold text-[#855B09] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                          {proj.number || '01'}
                        </span>
                        <span className="text-xs font-semibold text-[#475569]">
                          {proj.category}
                        </span>
                        {proj.year && (
                          <span className="text-[10px] text-[#94A3B8]">
                            • {proj.year}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          proj.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {proj.status || 'Completed'}
                        </span>
                      </div>

                      <h3 className="font-cinzel font-bold text-base text-[#0F172A] mt-0.5 truncate max-w-xs sm:max-w-md">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] text-[#64748B] truncate max-w-xs sm:max-w-md">
                        /{proj.slug || generateSlug(proj.title)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Badges & Action Controls */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-end md:self-center">
                    
                    {/* Featured Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(proj)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isFeat ? 'bg-amber-100 text-[#855B09] border border-amber-300' : 'glass-pill text-slate-400 hover:text-slate-700'
                      }`}
                      title="Toggle Featured on homepage"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFeat ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{isFeat ? 'Featured' : 'Feature'}</span>
                    </button>

                    {/* Publish / Draft Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(proj)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isPub ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                      title="Toggle visibility"
                    >
                      {isPub ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isPub ? 'Published' : 'Draft'}</span>
                    </button>

                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewProject(proj)}
                      className="p-2 rounded-xl glass-pill hover:bg-white text-[#475569] hover:text-[#0F172A] cursor-pointer"
                      title="Preview Case Study"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Duplicate Button */}
                    <button
                      type="button"
                      onClick={() => handleDuplicateProject(proj)}
                      className="p-2 rounded-xl glass-pill hover:bg-white text-[#475569] hover:text-[#0F172A] cursor-pointer"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(proj);
                        setEditorTab('basic');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#0F172A] flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(proj.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FULL PROJECT EDITOR MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div 
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel-elevated bg-white p-5 sm:p-8 border border-white/90 shadow-2xl space-y-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Editor Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D49E24] block">
                  Project Editor
                </span>
                <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-[#0F172A]">
                  {editingProject.title || 'Untitled Project'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewProject(editingProject)}
                  className="px-3 py-1.5 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/60 pb-3">
              {[
                { id: 'basic', label: '1. Basic Info', icon: FileText },
                { id: 'media', label: '2. Cover & Gallery', icon: ImageIcon },
                { id: 'casestudy', label: '3. Case Study Details', icon: Layers },
                { id: 'settings', label: '4. Case Study Settings', icon: Sliders },
                { id: 'seo', label: '5. SEO Settings', icon: Globe }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = editorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditorTab(tab.id as EditorTab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] shadow-xs'
                        : 'glass-panel text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: BASIC PROJECT INFORMATION */}
            {editorTab === 'basic' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setEditingProject(prev => (prev ? { 
                          ...prev, 
                          title, 
                          slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug 
                        } : null));
                      }}
                      placeholder="e.g. Elevate AI SaaS Website"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#D49E24]/50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Category *
                    </label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, category: e.target.value } : null))}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:bg-white"
                    >
                      {standardCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Project Slug (URL Path)
                    </label>
                    <input
                      type="text"
                      value={editingProject.slug || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, slug: generateSlug(e.target.value) } : null))}
                      placeholder="e.g. elevate-ai-saas"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] font-mono focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Subtitle / Catchphrase
                    </label>
                    <input
                      type="text"
                      value={editingProject.subtitle || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, subtitle: e.target.value } : null))}
                      placeholder="e.g. AI-Powered Workflow Interface"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Display Number
                    </label>
                    <input
                      type="text"
                      value={editingProject.number || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, number: e.target.value } : null))}
                      placeholder="e.g. 01"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Status, Year, Client Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Project Status
                    </label>
                    <select
                      value={editingProject.status || 'Completed'}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, status: e.target.value as any } : null))}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Project Year
                    </label>
                    <input
                      type="text"
                      value={editingProject.year || '2026'}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, year: e.target.value } : null))}
                      placeholder="2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Client Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingProject.clientName || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, clientName: e.target.value } : null))}
                      placeholder="Optional client name"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Short Description (Card Summary)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.shortDescription || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, shortDescription: e.target.value } : null))}
                      placeholder="Brief overview shown on cards and heroes..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Full Description / Overview
                    </label>
                    <textarea
                      rows={4}
                      value={editingProject.overview || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, overview: e.target.value } : null))}
                      placeholder="Comprehensive project summary..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Project URL & Repo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Live Project URL (Visit Project →)
                    </label>
                    <input
                      type="text"
                      value={editingProject.projectUrl || editingProject.liveDemoUrl || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, projectUrl: e.target.value, liveDemoUrl: e.target.value } : null))}
                      placeholder="https://example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Repository URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingProject.githubUrl || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, githubUrl: e.target.value } : null))}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                    Project Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(editingProject.tags || []).map((tag, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-[#0F172A] flex items-center gap-1">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(prev => (prev ? {
                              ...prev,
                              tags: (prev.tags || []).filter((_, i) => i !== tIdx)
                            } : null));
                          }}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTagInput.trim()) {
                            setEditingProject(prev => (prev ? { ...prev, tags: [...(prev.tags || []), newTagInput.trim()] } : null));
                            setNewTagInput('');
                          }
                        }
                      }}
                      placeholder="Add tag and press Enter (e.g. WordPress, SEO)..."
                      className="flex-1 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTagInput.trim()) {
                          setEditingProject(prev => (prev ? { ...prev, tags: [...(prev.tags || []), newTagInput.trim()] } : null));
                          setNewTagInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0F172A] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: COVER IMAGE & GALLERY */}
            {editorTab === 'media' && (
              <div className="space-y-6 animate-in fade-in">
                
                {/* 1. Cover / Hero Image */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#0F172A]">
                        Project Cover / Hero Image
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        Appears on Project Cards, Hero sections, and Social Previews.
                      </p>
                    </div>

                    <label className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#0F172A] flex items-center gap-1.5 shadow-2xs cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>Upload Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={editingProject.image}
                      alt="Cover Preview"
                      referrerPolicy="no-referrer"
                      className="w-48 h-28 rounded-xl object-cover border border-slate-300 shadow-2xs bg-white"
                    />

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={editingProject.image}
                        onChange={(e) => setEditingProject(prev => (prev ? { ...prev, image: e.target.value } : null))}
                        placeholder="Or enter direct image URL (https://...)"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A]"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingProject(prev => (prev ? { ...prev, image: ASSETS.mockupMinimalist } : null))}
                        className="text-[11px] font-semibold text-slate-500 hover:text-red-500 cursor-pointer"
                      >
                        Reset to default placeholder
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Project Visual Gallery */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#0F172A]">
                        Project Gallery ({(editingProject.galleryImages || []).length} images)
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        Upload multiple screenshots or paste image URLs. Reorder, preview, or remove.
                      </p>
                    </div>

                    <label className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-xs font-bold text-[#855B09] flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto">
                      <Upload className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>Upload Multiple</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Add URL input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newGalleryUrlInput}
                      onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                      placeholder="Or paste screenshot URL to add..."
                      className="flex-1 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-[#0F172A] cursor-pointer"
                    >
                      Add Image
                    </button>
                  </div>

                  {/* Gallery Grid items */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {(editingProject.galleryImages || []).map((imgUrl, gIdx) => (
                      <div key={gIdx} className="relative group rounded-xl overflow-hidden border border-slate-300 bg-white shadow-2xs">
                        <img
                          src={imgUrl}
                          alt={`Gallery ${gIdx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveGalleryImage(gIdx, 'left')}
                            disabled={gIdx === 0}
                            className="p-1 rounded bg-white text-[#0F172A] disabled:opacity-30 cursor-pointer"
                            title="Move Left"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(gIdx)}
                            className="p-1 rounded bg-red-600 text-white cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveGalleryImage(gIdx, 'right')}
                            disabled={gIdx === (editingProject.galleryImages || []).length - 1}
                            className="p-1 rounded bg-white text-[#0F172A] disabled:opacity-30 cursor-pointer"
                            title="Move Right"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(editingProject.galleryImages || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      No gallery images uploaded yet. If empty, the gallery section is automatically hidden.
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: CASE STUDY CONTENT */}
            {editorTab === 'casestudy' && (
              <div className="space-y-5 animate-in fade-in">
                
                {/* Purpose & Target Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Project Purpose
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.purpose || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, purpose: e.target.value } : null))}
                      placeholder="Why was this project built?"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Target Audience
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.targetAudience || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, targetAudience: e.target.value } : null))}
                      placeholder="Who is this digital solution designed for?"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* The Challenge & Our Approach */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#991B1B] block mb-1">
                      The Challenge (Problem)
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.challenge || editingProject.problem || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, challenge: e.target.value, problem: e.target.value } : null))}
                      placeholder="What obstacle or challenge did this solve?"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#855B09] block mb-1">
                      Our Approach (Solution)
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.approach || editingProject.solution || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, approach: e.target.value, solution: e.target.value } : null))}
                      placeholder="How did Prineor execute the solution?"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* What We Did (Services Selection) */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    What We Did (Select Services Deployed)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {standardServices.map(srv => {
                      const currentServices = editingProject.servicesUsed || [];
                      const isSelected = currentServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => {
                            const next = isSelected 
                              ? currentServices.filter(s => s !== srv)
                              : [...currentServices, srv];
                            setEditingProject(prev => (prev ? { ...prev, servicesUsed: next } : null));
                          }}
                          className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 text-[#855B09] border-amber-300 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{srv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tools & Technologies */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                    Tools & Technologies (WordPress, Figma, AI Tools, etc.)
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(editingProject.tools || editingProject.technologies || []).map((tool, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 border border-slate-200">
                        <span>{tool}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextTools = (editingProject.tools || editingProject.technologies || []).filter((_, i) => i !== tIdx);
                            setEditingProject(prev => (prev ? { ...prev, tools: nextTools, technologies: nextTools } : null));
                          }}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newToolInput}
                      onChange={(e) => setNewToolInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newToolInput.trim()) {
                            const cur = editingProject.tools || editingProject.technologies || [];
                            const next = [...cur, newToolInput.trim()];
                            setEditingProject(prev => (prev ? { ...prev, tools: next, technologies: next } : null));
                            setNewToolInput('');
                          }
                        }
                      }}
                      placeholder="Add tool (e.g. Elementor, Figma, Canva, AI)..."
                      className="flex-1 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newToolInput.trim()) {
                          const cur = editingProject.tools || editingProject.technologies || [];
                          const next = [...cur, newToolInput.trim()];
                          setEditingProject(prev => (prev ? { ...prev, tools: next, technologies: next } : null));
                          setNewToolInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-[#0F172A] cursor-pointer"
                    >
                      Add Tool
                    </button>
                  </div>
                </div>

                {/* Our Role */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                    Our Role
                  </label>
                  <input
                    type="text"
                    value={editingProject.ourRole || editingProject.role || ''}
                    onChange={(e) => setEditingProject(prev => (prev ? { ...prev, ourRole: e.target.value, role: e.target.value } : null))}
                    placeholder="e.g. Designed and developed the website experience using WordPress and AI-assisted workflows."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>

                {/* Results & Outcome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Key Result Highlight
                    </label>
                    <input
                      type="text"
                      value={editingProject.keyResult || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, keyResult: e.target.value } : null))}
                      placeholder="e.g. 100% Mobile Responsive with fast render times"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Results / Outcome Summary
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.outcomeText || ''}
                      onChange={(e) => setEditingProject(prev => (prev ? { ...prev, outcomeText: e.target.value } : null))}
                      placeholder="Describe the final outcome and value created..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                    Additional Notes
                  </label>
                  <input
                    type="text"
                    value={editingProject.additionalNotes || ''}
                    onChange={(e) => setEditingProject(prev => (prev ? { ...prev, additionalNotes: e.target.value } : null))}
                    placeholder="Any closing remarks, learning points, or next steps..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>

              </div>
            )}

            {/* TAB 4: CASE STUDY SETTINGS (TOGGLES) */}
            {editorTab === 'settings' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 mb-2">
                  <p className="text-xs text-[#855B09]">
                    Control which sections appear on this specific project&apos;s Case Study and card.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { key: 'caseStudyEnabled', label: 'Case Study Enabled', desc: 'Allow visitors to view the full Case Study page' },
                    { key: 'isFeatured', label: 'Featured on Homepage', desc: 'Show in the 3-card Featured Projects showcase' },
                    { key: 'showGallery', label: 'Show Visual Gallery', desc: 'Display screenshot gallery if images exist' },
                    { key: 'showChallenge', label: 'Show The Challenge', desc: 'Display problem statement' },
                    { key: 'showApproach', label: 'Show Our Approach', desc: 'Display strategy and solution' },
                    { key: 'showWhatWeDid', label: 'Show What We Did', desc: 'Display service tags deployed' },
                    { key: 'showTools', label: 'Show Tools & Technologies', desc: 'Display technology badges' },
                    { key: 'showOurRole', label: 'Show Our Role', desc: 'Display responsibility statement' },
                    { key: 'showResults', label: 'Show Results / Outcome', desc: 'Display outcomes and metrics' },
                    { key: 'showProcess', label: 'Show Workflow Steps', desc: 'Display execution steps' }
                  ].map(toggle => {
                    const isCaseStudyMain = toggle.key === 'caseStudyEnabled';
                    const isFeatMain = toggle.key === 'isFeatured';
                    
                    const isChecked = isCaseStudyMain 
                      ? editingProject.caseStudyEnabled !== false
                      : isFeatMain
                      ? !!editingProject.isFeatured
                      : (editingProject.settings as any)?.[toggle.key] !== false;

                    return (
                      <div key={toggle.key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-[#0F172A] block">{toggle.label}</span>
                          <span className="text-[11px] text-[#64748B] block">{toggle.desc}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (isCaseStudyMain) {
                              setEditingProject(prev => (prev ? { ...prev, caseStudyEnabled: !isChecked } : null));
                            } else if (isFeatMain) {
                              setEditingProject(prev => (prev ? { ...prev, isFeatured: !isChecked } : null));
                            } else {
                              setEditingProject(prev => (prev ? {
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  [toggle.key]: !isChecked
                                }
                              } : null));
                            }
                          }}
                          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                            isChecked ? 'bg-[#D49E24]' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                            isChecked ? 'right-1' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: SEO SETTINGS */}
            {editorTab === 'seo' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={editingProject.seo?.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingProject(prev => (prev ? {
                        ...prev,
                        seo: {
                          title: val,
                          description: prev.seo?.description || '',
                          ogImage: prev.seo?.ogImage || ''
                        }
                      } : null));
                    }}
                    placeholder={editingProject.title || 'Project Name'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Defaults to Project Title if left blank.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.seo?.description || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingProject(prev => (prev ? {
                        ...prev,
                        seo: {
                          title: prev.seo?.title || '',
                          description: val,
                          ogImage: prev.seo?.ogImage || ''
                        }
                      } : null));
                    }}
                    placeholder={editingProject.shortDescription || 'Short project summary...'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                    Social Share Image (Open Graph Image)
                  </label>
                  <input
                    type="text"
                    value={editingProject.seo?.ogImage || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingProject(prev => (prev ? {
                        ...prev,
                        seo: {
                          title: prev.seo?.title || '',
                          description: prev.seo?.description || '',
                          ogImage: val
                        }
                      } : null));
                    }}
                    placeholder={editingProject.image || 'Cover image URL'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
              </div>
            )}

            {/* Editor Action Bottom Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveEditor('Draft')}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0F172A] cursor-pointer"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveEditor('Published')}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Publish & Save'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">Delete Project</h3>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to delete this project? This will permanently remove it from the database, the public website, and its Case Study page.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      <ProjectDetailModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
        allProjects={projects}
        onSelectProject={(p) => setPreviewProject(p)}
      />

    </div>
  );
};
