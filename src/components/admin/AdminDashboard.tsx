import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { getAdminAuthHeaders } from '../../utils/adminApi';
import { 
  Sparkles, 
  LayoutDashboard, 
  Tv, 
  BarChart3, 
  User, 
  Briefcase, 
  Layers, 
  Phone, 
  Share2, 
  UserPlus, 
  HeartHandshake, 
  Youtube, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  FolderOpen, 
  Palette, 
  Settings, 
  ShieldCheck,
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Eye,
  Mail
} from 'lucide-react';

import { DashboardSection } from './sections/DashboardSection';
import { MessagesSectionAdmin } from './sections/MessagesSectionAdmin';
import { HeroSectionAdmin } from './sections/HeroSectionAdmin';
import { StatsSectionAdmin } from './sections/StatsSectionAdmin';
import { AboutSectionAdmin } from './sections/AboutSectionAdmin';
import { ServicesSectionAdmin } from './sections/ServicesSectionAdmin';
import { ProjectsSectionAdmin } from './sections/ProjectsSectionAdmin';
import { ContactSectionAdmin } from './sections/ContactSectionAdmin';
import { SocialsSectionAdmin } from './sections/SocialsSectionAdmin';
import { HiringSectionAdmin } from './sections/HiringSectionAdmin';
import { PartnerSectionAdmin } from './sections/PartnerSectionAdmin';
import { LearningSectionAdmin } from './sections/LearningSectionAdmin';
import { StorySectionAdmin } from './sections/StorySectionAdmin';
import { BlogSectionAdmin } from './sections/BlogSectionAdmin';
import { GallerySectionAdmin } from './sections/GallerySectionAdmin';
import { MediaLibraryAdmin } from './sections/MediaLibraryAdmin';
import { AppearanceSectionAdmin } from './sections/AppearanceSectionAdmin';
import { SettingsSectionAdmin } from './sections/SettingsSectionAdmin';
import { SecuritySectionAdmin } from './sections/SecuritySectionAdmin';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const { logout } = useCMS();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [newMessagesCount, setNewMessagesCount] = useState<number>(0);
  const [newApplicationsCount, setNewApplicationsCount] = useState<number>(0);
  const [newPartnersCount, setNewPartnersCount] = useState<number>(0);

  useEffect(() => {
    const fetchCounters = () => {
      fetch('/api/admin/messages', {
        credentials: 'include',
        headers: getAdminAuthHeaders()
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) {
            const newMsg = data.filter((m: any) => m.status === 'New').length;
            const newPartners = data.filter((m: any) => 
              m.status === 'New' && (
                m.inquiryType === 'Partnership' || 
                (m.subject || '').toLowerCase().includes('partner') ||
                (m.message || '').toLowerCase().includes('partner')
              )
            ).length;
            setNewMessagesCount(newMsg);
            setNewPartnersCount(newPartners);
          }
        })
        .catch(() => {});

      fetch('/api/admin/applications', {
        credentials: 'include',
        headers: getAdminAuthHeaders()
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) {
            const newApps = data.filter((a: any) => a.status === 'New').length;
            setNewApplicationsCount(newApps);
          }
        })
        .catch(() => {});
    };

    fetchCounters();
    const interval = setInterval(fetchCounters, 15000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, category: 'Core' },
    { id: 'messages', label: 'Inquiries & Messages', icon: Mail, category: 'Inbox' },
    { id: 'hiring', label: 'Hiring & Candidates', icon: UserPlus, category: 'Inbox' },
    { id: 'projects', label: 'Projects & Case Studies', icon: Layers, category: 'Content' },
    { id: 'hero', label: 'Hero Section', icon: Tv, category: 'Content' },
    { id: 'stats', label: 'Stats & Metrics', icon: BarChart3, category: 'Content' },
    { id: 'about', label: 'About & Vision', icon: User, category: 'Content' },
    { id: 'services', label: 'Services', icon: Briefcase, category: 'Content' },
    { id: 'contact', label: 'Contact Info & FAQs', icon: Phone, category: 'Channels' },
    { id: 'socials', label: 'Social Links', icon: Share2, category: 'Channels' },
    { id: 'partner', label: 'Partner CTA', icon: HeartHandshake, category: 'Marketing' },
    { id: 'learning', label: 'YouTube / Learning', icon: Youtube, category: 'Marketing' },
    { id: 'story', label: 'Story & Milestones', icon: Clock, category: 'Narrative' },
    { id: 'blog', label: 'Blog & Articles', icon: FileText, category: 'Narrative' },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, category: 'Media' },
    { id: 'media', label: 'Media Library', icon: FolderOpen, category: 'Media' },
    { id: 'security', label: 'Account & Security', icon: ShieldCheck, category: 'System' },
    { id: 'appearance', label: 'Appearance', icon: Palette, category: 'System' },
    { id: 'settings', label: 'Settings & SEO', icon: Settings, category: 'System' }
  ];

  const handleLogout = () => {
    logout();
    onExitAdmin();
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardSection onNavigate={(tab) => setActiveTab(tab)} />;
      case 'messages':
        return <MessagesSectionAdmin />;
      case 'hero':
        return <HeroSectionAdmin />;
      case 'stats':
        return <StatsSectionAdmin />;
      case 'about':
        return <AboutSectionAdmin />;
      case 'services':
        return <ServicesSectionAdmin />;
      case 'projects':
        return <ProjectsSectionAdmin />;
      case 'contact':
        return <ContactSectionAdmin />;
      case 'socials':
        return <SocialsSectionAdmin />;
      case 'hiring':
      case 'applications':
        return <HiringSectionAdmin />;
      case 'partner':
        return <PartnerSectionAdmin />;
      case 'learning':
        return <LearningSectionAdmin />;
      case 'story':
        return <StorySectionAdmin />;
      case 'blog':
        return <BlogSectionAdmin />;
      case 'gallery':
        return <GallerySectionAdmin />;
      case 'media':
        return <MediaLibraryAdmin />;
      case 'security':
      case 'account':
        return <SecuritySectionAdmin />;
      case 'appearance':
        return <AppearanceSectionAdmin />;
      case 'settings':
        return <SettingsSectionAdmin />;
      default:
        return <DashboardSection onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0F172A] flex flex-col antialiased selection:bg-[#D49E24]/20 selection:text-[#855B09]">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-200/80 glass-nav flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl glass-panel text-[#0F172A] hover:bg-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D49E24] to-[#F5D372] p-0.5 shadow-xs">
              <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
              </div>
            </div>
            <div>
              <span className="font-cinzel font-bold text-sm tracking-wider text-[#0F172A]">
                PRINEOR
              </span>
              <span className="text-[10px] font-semibold text-[#D49E24] block leading-none">
                Admin Studio CMS
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-1.5 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="hidden sm:inline">View Public Website</span>
            <span className="sm:hidden">Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3.5 sm:py-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white/80 lg:bg-transparent backdrop-blur-xl border-r border-slate-200/80 p-4 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
            sidebarOpen ? 'translate-x-0 top-16 h-[calc(100vh-4rem)]' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1 overflow-y-auto pr-1 flex-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Content & Management
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              let badgeCount = 0;
              let badgeColor = 'bg-amber-500 text-white';
              if (item.id === 'messages') {
                badgeCount = newMessagesCount;
                badgeColor = 'bg-amber-500 text-white';
              } else if (item.id === 'hiring') {
                badgeCount = newApplicationsCount;
                badgeColor = 'bg-emerald-600 text-white';
              } else if (item.id === 'partner') {
                badgeCount = newPartnersCount;
                badgeColor = 'bg-[#D49E24] text-white';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D49E24]/15 to-[#F5D372]/20 text-[#855B09] border border-[#D49E24]/30 shadow-2xs font-bold'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#D49E24]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {badgeCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor} shadow-2xs animate-pulse`}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200/60 space-y-2">
            <button
              onClick={() => {
                setActiveTab('security');
                setSidebarOpen(false);
              }}
              className="w-full p-2 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/60 flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-[10px] font-bold flex-shrink-0">
                  A
                </div>
                <div className="truncate">
                  <span className="text-[11px] font-bold text-slate-800 block truncate group-hover:text-[#855B09]">
                    Admin Account
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Security & Credentials
                  </span>
                </div>
              </div>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            </button>
            <div className="text-[10px] text-[#94A3B8] text-center">
              Prineor Private Admin • 2026
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/20 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>

      </div>

    </div>
  );
};
