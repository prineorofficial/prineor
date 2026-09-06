import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageTab, PersonalBrandConfig, ProjectCaseStudy, BlogPost } from './types';
import { CMSProvider, useCMS } from './context/CMSContext';

// Lazy-load Admin Components (Ensures public visitors never download Admin code)
const AdminSetup = lazy(() => import('./components/admin/AdminSetup').then(m => ({ default: m.AdminSetup })));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Reusable / Shared Core Public Components
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';

// Lazy-loaded Modals & Drawers (Only loaded when opened)
const ProjectDetailModal = lazy(() => import('./components/ProjectDetailModal').then(m => ({ default: m.ProjectDetailModal })));
const ArticleModal = lazy(() => import('./components/ArticleModal').then(m => ({ default: m.ArticleModal })));
const ResumeModal = lazy(() => import('./components/ResumeModal').then(m => ({ default: m.ResumeModal })));
const BrandCustomizerDrawer = lazy(() => import('./components/BrandCustomizerDrawer').then(m => ({ default: m.BrandCustomizerDrawer })));
const PartnerInquiryModal = lazy(() => import('./components/PartnerInquiryModal').then(m => ({ default: m.PartnerInquiryModal })));

// Home Page Sections (Immediate Render for Ultra-Fast Initial Paint)
import { HeroSection } from './components/HeroSection';
import { StatsQuoteBar } from './components/StatsQuoteBar';
import { FeaturedProjectsSection } from './components/FeaturedProjectsSection';
import { ThreeColumnRow } from './components/ThreeColumnRow';
import { ExperienceStoryRow } from './components/ExperienceStoryRow';
import { YouTubeLearningSection } from './components/YouTubeLearningSection';
import { PartnerCTASection } from './components/PartnerCTASection';
import { BottomRowSection } from './components/BottomRowSection';

// Lazy-loaded Sub-Pages (Loaded on demand as user navigates)
const AboutPage = lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const StoryPage = lazy(() => import('./components/StoryPage').then(m => ({ default: m.StoryPage })));
const ProjectsPage = lazy(() => import('./components/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ServicesPage = lazy(() => import('./components/ServicesPage').then(m => ({ default: m.ServicesPage })));
const SkillsPage = lazy(() => import('./components/SkillsPage').then(m => ({ default: m.SkillsPage })));
const ExperiencePage = lazy(() => import('./components/ExperiencePage').then(m => ({ default: m.ExperiencePage })));
const BlogPage = lazy(() => import('./components/BlogPage').then(m => ({ default: m.BlogPage })));
const LinksPage = lazy(() => import('./components/LinksPage').then(m => ({ default: m.LinksPage })));
const GalleryPage = lazy(() => import('./components/GalleryPage').then(m => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
import { Loader2 } from 'lucide-react';

const SectionLoader: React.FC = () => (
  <div className="w-full min-h-[45vh] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#D49E24] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-[#855B09] tracking-wider uppercase font-cinzel">
        Loading Prineor Experience...
      </span>
    </div>
  </div>
);

function AppContent() {
  const { cmsData, updateBrand, isAuthenticated, isSetup, authLoading, checkAuthStatus } = useCMS();
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin');
  });

  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [contactInquiryType, setContactInquiryType] = useState<'General Inquiry' | 'Partnership' | 'Project Inquiry' | 'Careers'>('General Inquiry');

  // Sync with browser URL / history & direct slugs
  useEffect(() => {
    const handleLocationChange = () => {
      const isPathAdmin = window.location.pathname.startsWith('/admin');
      setIsAdminView(isPathAdmin);

      const path = window.location.pathname;
      if (path.startsWith('/projects/')) {
        const slug = path.replace('/projects/', '').trim();
        if (slug) {
          const match = (cmsData.projects || []).find(p => (p.slug === slug || p.id === slug) && p.isPublished !== false && p.visibility !== 'Draft');
          if (match) {
            setSelectedProject(match);
          } else {
            setSelectedProject(null);
            setActiveTab('404');
          }
        }
      } else if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').trim();
        if (slug) {
          const rawPosts: BlogPost[] = (cmsData.blog && cmsData.blog.length > 0) ? cmsData.blog : (cmsData.blogs || []);
          const match = rawPosts.find(p => (p.slug === slug || p.id === slug) && p.isPublished !== false && p.status !== 'Draft');
          if (match) {
            setSelectedArticle(match);
          } else {
            setSelectedArticle(null);
            setActiveTab('404');
          }
        }
      } else if (!isPathAdmin) {
        const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
        const validTabs: Record<string, PageTab> = {
          '': 'home',
          'home': 'home',
          'about': 'about',
          'story': 'story',
          'projects': 'projects',
          'services': 'services',
          'skills': 'skills',
          'experience': 'experience',
          'blog': 'blog',
          'links': 'links',
          'learning': 'links',
          'search': 'projects',
          'gallery': 'gallery',
          'contact': 'contact',
        };

        if (clean === 'partner') {
          setActiveTab('contact');
          setContactInquiryType('Partnership');
          setIsPartnerModalOpen(true);
        } else if (clean === 'hiring' || clean === 'careers') {
          setActiveTab('contact');
          setContactInquiryType('Careers');
        } else if (validTabs[clean] !== undefined) {
          setActiveTab(validTabs[clean]);
        } else if (clean) {
          setActiveTab('404');
        }
      } else {
        // Enforce noindex for all admin routes
        document.title = 'Prineor — Admin Portal';
        const metaRobots = document.querySelector('meta[name="robots"]');
        if (metaRobots) {
          metaRobots.setAttribute('content', 'noindex, nofollow');
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [cmsData.projects, cmsData.blog, cmsData.blogs]);

  const navigateToAdmin = () => {
    setIsAdminView(true);
    if (!window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/admin/dashboard');
    }
  };

  const navigateToPublic = () => {
    setIsAdminView(false);
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  const handleTabChange = (tab: PageTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Mode: Check authentication & setup
  if (isAdminView) {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#D49E24] animate-spin" />
            <span className="text-xs font-bold text-[#855B09] tracking-wider uppercase">
              Verifying Admin Security...
            </span>
          </div>
        </div>
      );
    }

    // 1. FIRST TIME SETUP ONLY (Genuinely no admin account in database)
    if (isSetup === false) {
      return (
        <Suspense fallback={<SectionLoader />}>
          <AdminSetup
            onSuccess={() => {
              checkAuthStatus();
              window.history.pushState({}, '', '/admin/dashboard');
            }}
            onBackToSite={navigateToPublic}
          />
        </Suspense>
      );
    }

    // 2. UN-AUTHENTICATED ADMIN LOGIN (Normal entry screen every time authentication is needed)
    if (!isAuthenticated) {
      return (
        <Suspense fallback={<SectionLoader />}>
          <AdminLogin
            onSuccess={() => {
              checkAuthStatus();
              window.history.pushState({}, '', '/admin/dashboard');
            }}
            onBackToSite={navigateToPublic}
          />
        </Suspense>
      );
    }

    // 3. AUTHENTICATED ADMIN DASHBOARD
    return (
      <Suspense fallback={<SectionLoader />}>
        <AdminDashboard onExitAdmin={navigateToPublic} />
      </Suspense>
    );
  }

  // Public Website View
  const brand = cmsData.brand;

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] relative selection:bg-[#E6B942]/30 selection:text-[#855B09]">
      {/* Dynamic SEO & Social Share Meta Tags */}
      <SEOHead 
        activeTab={activeTab} 
        selectedProject={selectedProject} 
        selectedArticle={selectedArticle} 
      />

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Ambient Pearl Glow Backdrops */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-[30rem] h-[30rem] bg-slate-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Navbar
        brand={brand}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-4 pb-12">
        {activeTab === 'home' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* 1. Hero Section */}
            <HeroSection
              brand={brand}
              setActiveTab={handleTabChange}
              onOpenResume={() => setIsResumeOpen(true)}
            />

            {/* 2. Stats & Motivational Quote Bar */}
            <StatsQuoteBar />

            {/* 3. Featured 3-Card Projects Showcase */}
            <FeaturedProjectsSection
              setActiveTab={handleTabChange}
              onSelectProject={(proj) => setSelectedProject(proj)}
            />

            {/* 4. Three-Column Row (Services, Skills, Tech Stack) */}
            <ThreeColumnRow setActiveTab={handleTabChange} />

            {/* 5. Experience, Story & Client Feedback Row */}
            <ExperienceStoryRow setActiveTab={handleTabChange} />

            {/* 6. Want To Learn With Us? (YouTube Tutorials & Community) */}
            <YouTubeLearningSection youtubeUrl={brand.youtubeUrl} />

            {/* 7. Become Our Partner Premium CTA Section */}
            <PartnerCTASection 
              setActiveTab={handleTabChange} 
              onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
            />

            {/* 8. Bottom Row (Latest Blog, My Links with 3D Gem, Quick Contact) */}
            <BottomRowSection
              setActiveTab={handleTabChange}
              onSelectArticle={(article) => setSelectedArticle(article)}
            />
          </div>
        )}

        <Suspense fallback={<SectionLoader />}>
          {activeTab === 'about' && (
            <AboutPage
              brand={brand}
              setActiveTab={handleTabChange}
              onOpenResume={() => setIsResumeOpen(true)}
            />
          )}

          {activeTab === 'story' && (
            <StoryPage setActiveTab={handleTabChange} />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage onSelectProject={(proj) => setSelectedProject(proj)} />
          )}

          {activeTab === 'services' && (
            <ServicesPage setActiveTab={handleTabChange} />
          )}

          {activeTab === 'skills' && (
            <SkillsPage setActiveTab={handleTabChange} />
          )}

          {activeTab === 'experience' && (
            <ExperiencePage
              setActiveTab={handleTabChange}
              onOpenResume={() => setIsResumeOpen(true)}
            />
          )}

          {activeTab === 'blog' && (
            <BlogPage 
              onSelectArticle={(article) => setSelectedArticle(article)} 
              setActiveTab={handleTabChange}
            />
          )}

          {activeTab === 'links' && (
            <LinksPage
              brand={brand}
              setActiveTab={handleTabChange}
              onOpenResume={() => setIsResumeOpen(true)}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryPage />
          )}

          {activeTab === 'contact' && (
            <ContactPage 
              brand={brand} 
              initialInquiryType={contactInquiryType}
            />
          )}

          {activeTab === '404' && (
            <NotFoundPage setActiveTab={handleTabChange} />
          )}
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer
        brand={brand}
        setActiveTab={handleTabChange}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Modals & Drawers */}
      <Suspense fallback={null}>
        {isPartnerModalOpen && (
          <PartnerInquiryModal
            isOpen={isPartnerModalOpen}
            onClose={() => setIsPartnerModalOpen(false)}
          />
        )}

        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => {
              setSelectedProject(null);
              if (window.location.pathname.startsWith('/projects/')) {
                window.history.pushState({}, '', '/');
              }
            }}
            allProjects={cmsData.projects || []}
            onSelectProject={(proj) => setSelectedProject(proj)}
            setActiveTab={handleTabChange}
          />
        )}

        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => {
              setSelectedArticle(null);
              if (window.location.pathname.startsWith('/blog/')) {
                window.history.pushState({}, '', activeTab === 'blog' ? '/blog' : '/');
              }
            }}
            onSelectArticle={(art) => setSelectedArticle(art)}
            setActiveTab={handleTabChange}
          />
        )}

        {isResumeOpen && (
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={() => setIsResumeOpen(false)}
            brand={brand}
          />
        )}

        {/* Identity Customizer Floating Controller */}
        <BrandCustomizerDrawer
          brand={brand}
          onUpdateBrand={(updated) => updateBrand(updated)}
        />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
}
