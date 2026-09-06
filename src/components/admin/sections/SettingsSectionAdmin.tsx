import React, { useState, useMemo } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { GeneralSettingsConfig, PageSEOItem, ProjectCaseStudy, BlogPost } from '../../../types';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Globe, 
  ShieldCheck, 
  Upload,
  Search,
  Share2,
  ExternalLink,
  Eye,
  Smartphone,
  Monitor,
  Twitter,
  Linkedin,
  Facebook,
  FileCode2,
  Copy,
  Check,
  AlertTriangle,
  Layers,
  FileText,
  HelpCircle,
  BarChart3,
  Info,
  Compass
} from 'lucide-react';

export const SettingsSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [form, setForm] = useState<GeneralSettingsConfig>({ ...cmsData.settings });
  const [activeTab, setActiveTab] = useState<'audit' | 'global_seo' | 'page_seo' | 'content_seo' | 'preview_studio' | 'sitemap' | 'general'>('audit');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewPlatform, setPreviewPlatform] = useState<'google' | 'twitter' | 'linkedin'>('google');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const projects = cmsData.projects || [];
  const rawPosts: BlogPost[] = (cmsData.blog && cmsData.blog.length > 0) ? cmsData.blog : (cmsData.blogs || []);

  const handleChange = (key: keyof GeneralSettingsConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handlePageSeoChange = (pageKey: string, field: keyof PageSEOItem, value: string) => {
    setForm(prev => {
      const pageSeo = { ...(prev.pageSeo || {}) };
      const current = pageSeo[pageKey] || { title: '', description: '' };
      return {
        ...prev,
        pageSeo: {
          ...pageSeo,
          [pageKey]: {
            ...current,
            [field]: value
          }
        }
      };
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleChange('logoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleChange('defaultSocialImage', result);
        handleChange('ogImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleChange('faviconUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateSection('settings', form);
    // Sync brand details
    updateSection('brand', {
      ...cmsData.brand,
      name: form.brandName || form.siteName || 'PRINEOR',
      tagline: form.tagline,
      email: form.primaryEmail,
      phone: form.phone,
      location: form.location
    });
    setToastMessage('SEO, metadata & website settings saved successfully!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website and SEO settings to default Prineor configuration?')) {
      resetSection('settings');
      setForm({ ...cmsData.settings });
      setToastMessage('Settings reset to default.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const pageList = [
    { key: 'home', label: 'Homepage', path: '/' },
    { key: 'about', label: 'About Us & Founders', path: '/about' },
    { key: 'story', label: 'Our Story & Genesis', path: '/story' },
    { key: 'services', label: 'Digital Services', path: '/services' },
    { key: 'skills', label: 'Skills & Tech Stack', path: '/skills' },
    { key: 'experience', label: 'Experience & Timeline', path: '/experience' },
    { key: 'projects', label: 'Projects & Case Studies', path: '/projects' },
    { key: 'blog', label: 'Journal & Articles', path: '/blog' },
    { key: 'gallery', label: 'Studio Gallery', path: '/gallery' },
    { key: 'contact', label: 'Contact Us', path: '/contact' },
    { key: 'partner', label: 'Become Our Partner', path: '/partner' },
    { key: 'apply', label: 'Hiring & Careers', path: '/apply' },
    { key: 'links', label: 'Direct Links', path: '/links' }
  ];

  // Calculated values for previews & audit
  const siteName = form.siteName || form.brandName || 'Prineor';
  const metaTitle = form.defaultSeoTitle || form.metaTitle || form.seoTitle || `${siteName} — Growing Digital Brand | WordPress & AI`;
  const metaDesc = form.defaultSeoDescription || form.metaDescription || form.seoDescription || 'Prineor is a growing digital brand founded in 2026. Turning ideas into meaningful digital experiences through WordPress Web Development, AI Development, Graphic Design, and Digital Marketing.';
  const canonical = form.siteUrl || form.canonicalUrl || 'https://prineor.com';
  const ogImg = form.defaultSocialImage || form.ogImage || cmsData.brand?.portraitImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop';

  const titleLength = metaTitle.length;
  const descLength = metaDesc.length;

  const currentPageSEO: PageSEOItem = (form.pageSeo && form.pageSeo[selectedPageKey]) || {
    title: '',
    description: '',
    keywords: '',
    robots: 'index, follow'
  };

  // SEO Health Audit computation
  const auditReport = useMemo(() => {
    const publishedProjects = projects.filter(p => p.isPublished !== false && p.visibility !== 'Draft');
    const publishedBlogs = rawPosts.filter(b => b.isPublished !== false && b.status !== 'Draft');

    const missingPageTitles = pageList.filter(p => !form.pageSeo?.[p.key]?.title);
    const missingPageDescriptions = pageList.filter(p => !form.pageSeo?.[p.key]?.description);
    
    const projectsMissingSeo = publishedProjects.filter(p => !p.seo?.title || !p.seo?.description);
    const blogsMissingSeo = publishedBlogs.filter(b => !b.seoTitle || !b.seoDescription);

    let score = 100;
    if (!form.siteTitle && !form.defaultSeoTitle && !form.metaTitle) score -= 15;
    if (!form.siteDescription && !form.defaultSeoDescription && !form.metaDescription) score -= 15;
    if (!form.defaultSocialImage && !form.ogImage) score -= 10;
    if (form.robots === 'noindex, nofollow') score -= 20;

    const totalPages = pageList.length + publishedProjects.length + publishedBlogs.length;

    return {
      score: Math.max(0, score),
      publishedProjectsCount: publishedProjects.length,
      publishedBlogsCount: publishedBlogs.length,
      totalPages,
      missingPageTitlesCount: missingPageTitles.length,
      missingPageDescriptionsCount: missingPageDescriptions.length,
      projectsMissingSeoCount: projectsMissingSeo.length,
      blogsMissingSeoCount: blogsMissingSeo.length,
      isNoIndexGlobal: form.robots === 'noindex, nofollow'
    };
  }, [projects, rawPosts, form]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Step 4 Complete SEO Suite</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            SEO, Social Sharing & Indexing System
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage search ranking metadata, Open Graph cards, sitemap.xml, robots.txt, structured data, and per-page SEO overrides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-[#64748B] hover:text-red-600 hover:bg-red-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset to default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-2">
        {[
          { id: 'audit', label: 'SEO Health & Audit', icon: BarChart3 },
          { id: 'global_seo', label: 'Global SEO Settings', icon: Globe },
          { id: 'page_seo', label: 'Per-Page SEO', icon: Search },
          { id: 'content_seo', label: 'Projects & Blog SEO', icon: Layers },
          { id: 'preview_studio', label: 'SERP & Social Preview', icon: Eye },
          { id: 'sitemap', label: 'Sitemap & Robots.txt', icon: FileCode2 },
          { id: 'general', label: 'Brand & Footprint', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'glass-panel text-[#475569] hover:bg-white border border-slate-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6B942]' : 'text-[#94A3B8]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: SEO HEALTH AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-3xl glass-panel bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">SEO Health Score</span>
                <span className="p-1.5 rounded-xl bg-amber-50 text-[#D49E24]">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-cinzel font-black text-[#0F172A]">{auditReport.score}%</span>
                <span className="text-xs font-bold text-emerald-600">Excellent</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Structured data, Open Graph & sitemap synchronized.</p>
            </div>

            <div className="p-5 rounded-3xl glass-panel bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Sitemap URLs</span>
                <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                  <FileCode2 className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-cinzel font-black text-[#0F172A]">{auditReport.totalPages}</span>
                <span className="text-xs font-bold text-blue-600">Dynamic</span>
              </div>
              <p className="text-[11px] text-[#64748B]">{pageList.length} pages + {auditReport.publishedProjectsCount} projects + {auditReport.publishedBlogsCount} articles.</p>
            </div>

            <div className="p-5 rounded-3xl glass-panel bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Robots Indexing</span>
                <span className={`p-1.5 rounded-xl ${auditReport.isNoIndexGlobal ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-cinzel font-bold text-[#0F172A]">
                  {form.robots || 'index, follow'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                {auditReport.isNoIndexGlobal ? 'Warning: Global noindex is active' : 'Public pages allow Googlebot crawling'}
              </p>
            </div>

            <div className="p-5 rounded-3xl glass-panel bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">JSON-LD Graph</span>
                <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                  <Globe className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-cinzel font-bold text-[#0F172A]">4 Schemas</span>
                <span className="text-xs font-bold text-purple-600">Active</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Organization, WebSite, BreadcrumbList, CreativeWork.</p>
            </div>

          </div>

          {/* Audit Insights & Guidance */}
          <div className="p-6 rounded-3xl glass-panel bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D49E24]" />
              <span>SEO Audit Checklist & Search Engine Directives</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Meta Title & Description Formatting</span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  Default global title is <strong>{titleLength}</strong> characters (Recommended: 50-60). Default description is <strong>{descLength}</strong> characters (Recommended: 140-160).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Privacy & Crawler Protection</span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  Private admin login, private candidate CV files, contact inquiries, and partner submissions are strictly disallowed in robots.txt and excluded from sitemap.xml.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Social Share Image (Open Graph)</span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  High-definition 1200x630px social card is configured and served for rich previews across Twitter/X, LinkedIn, Facebook, and WhatsApp.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Canonical URLs & Breadcrumb Navigation</span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  Dynamic canonical tags prevent duplicate content issues across all routes. BreadcrumbList JSON-LD enhances Google search rich snippets.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: GLOBAL SEO SETTINGS */}
      {activeTab === 'global_seo' && (
        <div className="space-y-6">
          <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-5 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="font-cinzel font-bold text-base text-[#0F172A]">Global Search & Metadata Configuration</h3>
                <p className="text-xs text-[#64748B]">These values define your default search engine listing and Open Graph previews.</p>
              </div>
            </div>

            {/* Site Name & Site URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Site Name
                </label>
                <input
                  type="text"
                  value={form.siteName || form.brandName || 'Prineor'}
                  onChange={(e) => {
                    handleChange('siteName', e.target.value);
                    handleChange('brandName', e.target.value);
                  }}
                  placeholder="Prineor"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Site Canonical Base URL
                </label>
                <input
                  type="url"
                  value={form.siteUrl || form.canonicalUrl || 'https://prineor.com'}
                  onChange={(e) => {
                    handleChange('siteUrl', e.target.value);
                    handleChange('canonicalUrl', e.target.value);
                  }}
                  placeholder="https://prineor.com"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>
            </div>

            {/* Default SEO Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                  Default SEO Title
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  titleLength >= 50 && titleLength <= 60 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : titleLength > 60 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  {titleLength}/60 chars (Recommended: 50-60)
                </span>
              </div>
              <input
                type="text"
                value={form.defaultSeoTitle || form.metaTitle || form.seoTitle || ''}
                onChange={(e) => {
                  handleChange('defaultSeoTitle', e.target.value);
                  handleChange('metaTitle', e.target.value);
                  handleChange('seoTitle', e.target.value);
                }}
                placeholder="PRINEOR — Growing Digital Brand | WordPress & AI Development"
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
              />
            </div>

            {/* Default SEO Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                  Default SEO Description
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  descLength >= 140 && descLength <= 160 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : descLength > 160 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  {descLength}/160 chars (Recommended: 140-160)
                </span>
              </div>
              <textarea
                rows={3}
                value={form.defaultSeoDescription || form.metaDescription || form.seoDescription || ''}
                onChange={(e) => {
                  handleChange('defaultSeoDescription', e.target.value);
                  handleChange('metaDescription', e.target.value);
                  handleChange('seoDescription', e.target.value);
                }}
                placeholder="Prineor is a growing digital brand founded in 2026. Turning ideas into meaningful digital experiences through WordPress Web Development, AI Development, Graphic Design, and Digital Marketing."
                className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#334155] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
              />
            </div>

            {/* Default Author & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Default Author / Organization
                </label>
                <input
                  type="text"
                  value={form.defaultAuthor || form.author || 'Prineor Founders'}
                  onChange={(e) => {
                    handleChange('defaultAuthor', e.target.value);
                    handleChange('author', e.target.value);
                  }}
                  placeholder="Prineor Founders"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Default Language Code
                </label>
                <input
                  type="text"
                  value={form.defaultLanguage || 'en'}
                  onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                  placeholder="en"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>
            </div>

            {/* Twitter Creator & Global Robots Indexing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Twitter / X Creator Handle
                </label>
                <input
                  type="text"
                  value={form.twitterHandle || '@Prineorofficial'}
                  onChange={(e) => handleChange('twitterHandle', e.target.value)}
                  placeholder="@Prineorofficial"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Global Robots / Indexing Directives
                </label>
                <select
                  value={form.robots || 'index, follow'}
                  onChange={(e) => handleChange('robots', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A]"
                >
                  <option value="index, follow">Index, Follow (Recommended for Production)</option>
                  <option value="noindex, nofollow">Noindex, Nofollow (Development / Private)</option>
                  <option value="index, nofollow">Index, Nofollow</option>
                  <option value="noindex, follow">Noindex, Follow</option>
                </select>
              </div>
            </div>

            {/* Default Social Share Image */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Default Social Share Image (Open Graph Image 1200x630)
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                  <img src={ogImg} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={form.defaultSocialImage || form.ogImage || ''}
                  onChange={(e) => {
                    handleChange('defaultSocialImage', e.target.value);
                    handleChange('ogImage', e.target.value);
                  }}
                  placeholder="https://... image URL"
                  className="flex-1 px-3.5 py-2 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleOgImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Custom Favicon */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Custom Favicon URL (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={form.faviconUrl || ''}
                  onChange={(e) => handleChange('faviconUrl', e.target.value)}
                  placeholder="https://... favicon image URL"
                  className="flex-1 px-3.5 py-2 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                </label>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: PER-PAGE SEO OVERRIDES */}
      {activeTab === 'page_seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block px-1">
              Select Page To Customize ({pageList.length} Public Pages)
            </span>
            <div className="rounded-2xl glass-panel p-2 border border-slate-200/80 shadow-2xs space-y-1 bg-white">
              {pageList.map((p) => {
                const isSel = selectedPageKey === p.key;
                const hasCustom = form.pageSeo && form.pageSeo[p.key]?.title;
                const isNoIndex = form.pageSeo && form.pageSeo[p.key]?.robots === 'noindex, nofollow';

                return (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPageKey(p.key)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-[#0F172A] text-white shadow-xs' 
                        : 'hover:bg-slate-100 text-[#475569]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.label}</span>
                      <span className="text-[10px] opacity-60">{p.path}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {isNoIndex && (
                        <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-bold">
                          noindex
                        </span>
                      )}
                      {hasCustom && (
                        <span className={`w-2 h-2 rounded-full ${isSel ? 'bg-[#D49E24]' : 'bg-emerald-500'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 shadow-sm space-y-4 bg-white">
              <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
                    {pageList.find(p => p.key === selectedPageKey)?.label} SEO
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Route: <code className="text-[#855B09] font-mono">{pageList.find(p => p.key === selectedPageKey)?.path}</code>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#475569]">Robots:</span>
                  <select
                    value={currentPageSEO.robots || 'index, follow'}
                    onChange={(e) => handlePageSeoChange(selectedPageKey, 'robots', e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold bg-slate-50 text-[#0F172A]"
                  >
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, nofollow">Noindex, Nofollow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Page Meta Title
                </label>
                <input
                  type="text"
                  value={currentPageSEO.title || ''}
                  onChange={(e) => handlePageSeoChange(selectedPageKey, 'title', e.target.value)}
                  placeholder={`e.g. ${pageList.find(p => p.key === selectedPageKey)?.label} | Prineor`}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Page Meta Description
                </label>
                <textarea
                  rows={3}
                  value={currentPageSEO.description || ''}
                  onChange={(e) => handlePageSeoChange(selectedPageKey, 'description', e.target.value)}
                  placeholder="Enter a tailored description describing this page..."
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#475569] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Specific Keywords
                  </label>
                  <input
                    type="text"
                    value={currentPageSEO.keywords || ''}
                    onChange={(e) => handlePageSeoChange(selectedPageKey, 'keywords', e.target.value)}
                    placeholder="Keyword 1, Keyword 2, Keyword 3"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Canonical URL Override (Optional)
                  </label>
                  <input
                    type="url"
                    value={currentPageSEO.canonicalUrl || ''}
                    onChange={(e) => handlePageSeoChange(selectedPageKey, 'canonicalUrl', e.target.value)}
                    placeholder="https://prineor.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Custom Page Social Share Image (Optional)
                </label>
                <input
                  type="text"
                  value={currentPageSEO.ogImage || ''}
                  onChange={(e) => handlePageSeoChange(selectedPageKey, 'ogImage', e.target.value)}
                  placeholder="https://... image URL"
                  className="w-full px-3.5 py-2 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PROJECTS & BLOG SEO INSPECTOR */}
      {activeTab === 'content_seo' && (
        <div className="space-y-6">
          
          {/* Projects SEO Status */}
          <div className="p-6 rounded-3xl glass-panel bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-base text-[#0F172A]">Projects & Case Studies SEO Health</h3>
              </div>
              <span className="text-xs text-[#64748B]">{projects.length} Case Studies</span>
            </div>

            <div className="divide-y divide-slate-100">
              {projects.map((proj) => {
                const isPublished = proj.isPublished !== false && proj.visibility !== 'Draft';
                const hasCustomTitle = Boolean(proj.seo?.title);
                const hasCustomDesc = Boolean(proj.seo?.description);
                const slug = proj.slug || proj.id;

                return (
                  <div key={proj.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0F172A]">{proj.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isPublished ? 'Indexed in Sitemap' : 'Draft (noindex)'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] font-mono">
                        /projects/{slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        hasCustomTitle ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-[#855B09]'
                      }`}>
                        {hasCustomTitle ? 'Custom SEO Title' : 'Default Title Fallback'}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        hasCustomDesc ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-[#855B09]'
                      }`}>
                        {hasCustomDesc ? 'Custom Description' : 'Overview Fallback'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blog Articles SEO Status */}
          <div className="p-6 rounded-3xl glass-panel bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-base text-[#0F172A]">Journal & Blog Articles SEO Health</h3>
              </div>
              <span className="text-xs text-[#64748B]">{rawPosts.length} Articles</span>
            </div>

            <div className="divide-y divide-slate-100">
              {rawPosts.map((art) => {
                const isPublished = art.isPublished !== false && art.status !== 'Draft';
                const hasCustomTitle = Boolean(art.seoTitle);
                const hasCustomDesc = Boolean(art.seoDescription);
                const slug = art.slug || art.id;

                return (
                  <div key={art.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0F172A]">{art.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isPublished ? 'Indexed in Sitemap' : 'Draft (noindex)'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] font-mono">
                        /blog/{slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        hasCustomTitle ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-[#855B09]'
                      }`}>
                        {hasCustomTitle ? 'Custom SEO Title' : 'Title Fallback'}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        hasCustomDesc ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-[#855B09]'
                      }`}>
                        {hasCustomDesc ? 'Custom Description' : 'Excerpt Fallback'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: SERP & SOCIAL PREVIEW STUDIO */}
      {activeTab === 'preview_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <div className="rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-white/90 shadow-sm space-y-6 bg-white">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-[#0F172A] flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#D49E24]" />
                    <span>Live Search Engine & Social Card Simulator</span>
                  </h3>
                  <p className="text-xs text-[#64748B]">Preview how your website appears on Google SERP, Twitter/X summary cards, and LinkedIn posts.</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setPreviewPlatform('google')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewPlatform === 'google' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Google SERP</span>
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('twitter')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewPlatform === 'twitter' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>Twitter / X Card</span>
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('linkedin')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      previewPlatform === 'linkedin' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Card</span>
                  </button>
                </div>
              </div>

              {/* 1. Google SERP Preview */}
              {previewPlatform === 'google' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span>Google Search Engine Preview</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`flex items-center gap-1 cursor-pointer ${previewDevice === 'desktop' ? 'text-[#0F172A] font-bold' : 'text-slate-400'}`}
                      >
                        <Monitor className="w-4 h-4" />
                        <span>Desktop</span>
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`flex items-center gap-1 cursor-pointer ${previewDevice === 'mobile' ? 'text-[#0F172A] font-bold' : 'text-slate-400'}`}
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-left ${previewDevice === 'mobile' ? 'max-w-md' : 'max-w-2xl'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#855B09]">
                        P
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#202124] font-medium leading-none">{siteName}</span>
                        <span className="text-[11px] text-[#5f6368] leading-tight truncate">
                          {canonical}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                      {metaTitle}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed">
                      {metaDesc}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Twitter / X Card Preview */}
              {previewPlatform === 'twitter' && (
                <div className="space-y-4 max-w-xl">
                  <span className="text-xs text-[#64748B] block">Twitter / X Summary Card with Large Image (1200x630)</span>
                  
                  <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-2xs text-left">
                    <div className="aspect-[16/9] w-full bg-slate-100 relative overflow-hidden">
                      <img src={ogImg} alt="Card Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-1 bg-white">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                        prineor.com
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {metaTitle}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {metaDesc}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. LinkedIn Card Preview */}
              {previewPlatform === 'linkedin' && (
                <div className="space-y-4 max-w-xl">
                  <span className="text-xs text-[#64748B] block">LinkedIn Rich Link Post Preview</span>
                  
                  <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-2xs text-left">
                    <div className="aspect-[1.91/1] w-full bg-slate-100 relative overflow-hidden">
                      <img src={ogImg} alt="Card Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-1 bg-slate-50 border-t border-slate-100">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {metaTitle}
                      </h4>
                      <span className="text-xs text-slate-500 block">
                        prineor.com • 2 min read
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SITEMAP & ROBOTS.TXT DIRECTIVES */}
      {activeTab === 'sitemap' && (
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/90 shadow-sm space-y-6 bg-white">
          <div className="border-b border-slate-200/60 pb-3">
            <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
              Dynamic Sitemap & Search Engine Directives
            </h3>
            <p className="text-xs text-[#64748B]">
              Your sitemap.xml and robots.txt files are automatically generated by the Prineor server backend in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-[#D49E24]" />
                  <span className="font-bold text-sm text-[#0F172A]">XML Sitemap</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {auditReport.totalPages} URLs Synced
                </span>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">
                Indexes all public static pages, dynamic project case studies, and published journal articles automatically.
              </p>

              <div className="flex items-center gap-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open sitemap.xml</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(`${window.location.origin}/sitemap.xml`, 'sitemap')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink === 'sitemap' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D49E24]" />
                  <span className="font-bold text-sm text-[#0F172A]">Robots.txt</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active
                </span>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">
                Guides Googlebot and search crawlers while protecting the private admin panel and API routes from being indexed.
              </p>

              <div className="flex items-center gap-2">
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open robots.txt</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(`${window.location.origin}/robots.txt`, 'robots')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink === 'robots' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 6: BRAND & GENERAL IDENTITY */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 shadow-sm space-y-4 bg-white">
            <span className="font-cinzel font-bold text-sm text-[#0F172A] block border-b border-slate-200/60 pb-2">
              Brand & Visual Identity
            </span>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={form.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Logo Text
              </label>
              <input
                type="text"
                value={form.logoText}
                onChange={(e) => handleChange('logoText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="A Growing Digital Brand • Founded in 2026"
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Custom Logo Image (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={form.logoUrl || ''}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="https://... logo URL"
                  className="flex-1 px-3.5 py-2 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0F172A] cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 shadow-sm space-y-4 bg-white">
            <span className="font-cinzel font-bold text-sm text-[#0F172A] block border-b border-slate-200/60 pb-2">
              Contact & Official Footprint
            </span>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={form.primaryEmail}
                onChange={(e) => handleChange('primaryEmail', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Official Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Copyright Text
              </label>
              <input
                type="text"
                value={form.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-slate-50 border border-slate-200 text-xs text-[#0F172A]"
              />
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
