import React, { useState, useEffect } from 'react';
import { AdminTab } from '../../../types';
import { useCMS } from '../../../context/CMSContext';
import { getAdminAuthHeaders } from '../../../utils/adminApi';
import { 
  Layers, 
  Sparkles, 
  Calendar, 
  Layout, 
  FileText, 
  UserCheck, 
  ArrowRight, 
  Download, 
  Upload, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Share2, 
  Phone, 
  HeartHandshake, 
  Youtube, 
  Palette, 
  Eye, 
  Mail, 
  UserPlus 
} from 'lucide-react';

interface DashboardSectionProps {
  setActiveTab?: (tab: AdminTab) => void;
  onNavigate?: (tab: string) => void;
  onViewLiveSite?: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ setActiveTab, onNavigate, onViewLiveSite }) => {
  const { cmsData, activeProjectCount, exportJSON, importJSON, resetAllToDefault } = useCMS();
  const [importStatus, setImportStatus] = useState<string>('');

  // Live dynamic message and application counters
  const [inquiriesCount, setInquiriesCount] = useState<{ total: number; newCount: number }>({ total: 0, newCount: 0 });
  const [applicationsCount, setApplicationsCount] = useState<{ total: number; newCount: number }>({ total: 0, newCount: 0 });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live counts and recent items
    fetch('/api/admin/messages', { 
      credentials: 'include',
      headers: getAdminAuthHeaders() 
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setInquiriesCount({
            total: data.length,
            newCount: data.filter((m: any) => m.status === 'New').length
          });
          setRecentInquiries(data.slice(0, 4));
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
          setApplicationsCount({
            total: data.length,
            newCount: data.filter((a: any) => a.status === 'New').length
          });
          setRecentApplications(data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  const navigateTo = (tab: any) => {
    if (setActiveTab) setActiveTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `prineor-cms-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        const content = event.target?.result as string;
        const ok = importJSON(content);
        if (ok) {
          setImportStatus('Backup restored successfully!');
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportStatus('Invalid JSON backup file.');
          setTimeout(() => setImportStatus(''), 4000);
        }
      };
    }
  };

  const statCards = [
    { 
      label: 'Projects', 
      value: `${activeProjectCount} Active`, 
      desc: 'Dynamic portfolio count', 
      icon: Layers, 
      color: 'from-amber-50 to-amber-100/70', 
      actionTab: 'projects' as AdminTab 
    },
    { 
      label: 'Contact Inquiries', 
      value: inquiriesCount.newCount > 0 ? `${inquiriesCount.newCount} New` : `${inquiriesCount.total} Total`, 
      desc: inquiriesCount.newCount > 0 ? `${inquiriesCount.total} total messages` : 'Customer & partner inquiries', 
      icon: Mail, 
      color: 'from-blue-50 to-indigo-100/60', 
      actionTab: 'messages' as any 
    },
    { 
      label: 'Applications', 
      value: applicationsCount.newCount > 0 ? `${applicationsCount.newCount} New` : `${applicationsCount.total} Total`, 
      desc: `${(cmsData.hiring.availablePositions || []).filter(p => p.status === 'Open').length} open positions`, 
      icon: UserPlus, 
      color: 'from-emerald-50 to-emerald-100/60', 
      actionTab: 'hiring' as AdminTab 
    },
    { 
      label: 'Services', 
      value: `${cmsData.services.length} Offerings`, 
      desc: 'Core service disciplines', 
      icon: Layout, 
      color: 'from-purple-50 to-purple-100/60', 
      actionTab: 'services' as AdminTab 
    },
    { 
      label: 'Blog Posts', 
      value: `${cmsData.blog.length} Articles`, 
      desc: 'Published & drafts', 
      icon: FileText, 
      color: 'from-rose-50 to-rose-100/60', 
      actionTab: 'blog' as AdminTab 
    },
    { 
      label: 'Hiring Status', 
      value: cmsData.hiring.isHiringOpen ? 'HIRING: ON' : 'HIRING: OFF', 
      desc: cmsData.hiring.positions.join(', ') || 'No open roles', 
      icon: UserCheck, 
      color: cmsData.hiring.isHiringOpen ? 'from-amber-50 to-amber-100/80' : 'from-slate-50 to-slate-100', 
      actionTab: 'hiring' as AdminTab 
    },
  ];

  const quickActions = [
    { label: 'View Inquiries', tab: 'messages', icon: Mail, desc: 'Contact inquiries & partner leads' },
    { label: 'Review Candidates', tab: 'hiring', icon: UserPlus, desc: 'Candidate applications & CVs' },
    { label: 'Add / Edit Projects', tab: 'projects', icon: Sparkles, desc: 'Case studies & images' },
    { label: 'Edit Services', tab: 'services', icon: Layout, desc: 'WordPress, AI, Design, Marketing' },
    { label: 'Edit Contact & FAQs', tab: 'contact', icon: Phone, desc: 'Email, phone, FAQs' },
    { label: 'Edit Hero Section', tab: 'hero', icon: Layout, desc: 'Image, text, CTA buttons' },
    { label: 'Edit Social Links', tab: 'socials', icon: Share2, desc: 'TikTok, Facebook, IG, YouTube' },
    { label: 'Partner CTA', tab: 'partner', icon: HeartHandshake, desc: 'Collaboration section' },
    { label: 'YouTube / Learning', tab: 'learning', icon: Youtube, desc: 'Video tutorials section' },
    { label: 'Appearance & Colors', tab: 'appearance', icon: Palette, desc: 'Gold & glass styling' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-white/95 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Prineor Control Center</span>
          </div>
          <h1 className="font-cinzel font-black text-2xl sm:text-3xl text-[#0F172A]">
            CMS Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Manage your public website dynamically. Any changes you save here instantly update the public portfolio in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onViewLiveSite && (
            <button
              onClick={onViewLiveSite}
              className="px-5 py-3 rounded-full glass-panel hover:bg-white text-[#0F172A] font-semibold text-xs border border-white/95 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#D49E24]" />
              <span>View Public Website</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('messages')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-[0_6px_25px_rgba(212,158,36,0.3)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>View Inquiries</span>
            {inquiriesCount.newCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#0F172A] text-white text-[10px]">
                {inquiriesCount.newCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => navigateTo(stat.actionTab)}
              className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 border border-white/90 shadow-sm cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center border border-white/80 shadow-2xs`}>
                  <Icon className="w-4 h-4 text-[#0F172A]" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#A87915] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                  {stat.label}
                </span>
                <span className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A] block mt-0.5 group-hover:text-[#A87915] transition-colors">
                  {stat.value}
                </span>
                <span className="text-[10px] text-[#94A3B8] block mt-1">
                  {stat.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D49E24]" />
          <h2 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => navigateTo(action.tab)}
                className="glass-panel glass-card-hover rounded-2xl p-4 text-left border border-white/90 shadow-sm flex flex-col justify-between group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-[#A87915]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block group-hover:text-[#A87915] transition-colors">
                    {action.label}
                  </span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">
                    {action.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Job / Candidate Applications Overview Widget */}
      <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#D49E24]" />
            <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
              Recent Job Applications & Candidates ({applicationsCount.total})
            </h3>
            {applicationsCount.newCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold animate-pulse">
                {applicationsCount.newCount} New
              </span>
            )}
          </div>
          <button
            onClick={() => navigateTo('hiring')}
            className="text-xs font-semibold text-[#855B09] bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200/70 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Candidates</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recentApplications.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#94A3B8]">
            No job applications received yet. When candidates apply through the careers section, their full form details & CV will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentApplications.map((app: any) => (
              <div
                key={app.id}
                onClick={() => navigateTo('hiring')}
                className="p-4 rounded-2xl bg-white/70 hover:bg-white/95 border border-white/90 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between gap-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#A87915] transition-colors truncate">
                        {app.fullName}
                      </span>
                      <span className="text-[11px] text-[#64748B] truncate">
                        &lt;{app.email}&gt;
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      app.status === 'New' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[#0F172A] font-semibold">
                      Role: {app.positionTitle}
                    </span>
                    {app.experienceLevel && (
                      <span className="text-[#D49E24] font-medium">
                        • {app.experienceLevel}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#475569] line-clamp-2 italic bg-amber-50/40 p-2 rounded-xl border border-amber-100/60">
                    "{app.whyJoin}"
                  </p>

                  {app.cvOriginalName && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#855B09]">
                      <FileText className="w-3 h-3 text-[#D49E24]" />
                      <span className="truncate">CV: {app.cvOriginalName}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-[#94A3B8]">
                  <span>Applied: {app.date} at {app.time}</span>
                  <span className="font-bold text-[#D49E24] group-hover:underline flex items-center gap-1">
                    Review Application &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Inquiries & Partner Leads Section */}
      <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#D49E24]" />
            <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
              Recent Contact & Partner Inquiries ({inquiriesCount.total})
            </h3>
            {inquiriesCount.newCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold animate-pulse">
                {inquiriesCount.newCount} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('partner')}
              className="text-xs font-semibold text-[#855B09] bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200/70 transition-colors cursor-pointer"
            >
              Partner Leads
            </button>
            <button
              onClick={() => navigateTo('messages')}
              className="text-xs font-semibold text-[#A87915] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Inquiries</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#94A3B8]">
            No inquiries received yet. When visitors submit the Contact form or "Become Our Partner" modal, they will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentInquiries.map((inq: any) => {
              const isPartner = inq.inquiryType === 'Partnership' || (inq.subject || '').toLowerCase().includes('partner');
              return (
                <div
                  key={inq.id}
                  onClick={() => navigateTo(isPartner ? 'partner' : 'messages')}
                  className="p-3.5 rounded-2xl bg-white/70 hover:bg-white/95 border border-white/90 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#A87915] transition-colors truncate">
                          {inq.name}
                        </span>
                        <span className="text-[11px] text-[#64748B] truncate">
                          &lt;{inq.email}&gt;
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isPartner 
                          ? 'bg-amber-100 text-[#855B09] border border-amber-300' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isPartner ? 'Partner' : inq.inquiryType || 'Inquiry'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate">
                      Subject: {inq.subject}
                    </p>
                    <p className="text-[11px] text-[#475569] line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                      "{inq.message}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-[#94A3B8]">
                    <span>{inq.date} at {inq.time}</span>
                    <span className="font-semibold text-[#D49E24] group-hover:underline">Open &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Columns: Recent Projects & Database Backup/Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Projects Preview */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D49E24]" />
              <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
                Recent Projects ({cmsData.projects.length})
              </h3>
            </div>
            <button
              onClick={() => navigateTo('projects')}
              className="text-xs font-semibold text-[#A87915] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {cmsData.projects.slice(0, 4).map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigateTo('projects')}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/60 hover:bg-white/90 border border-white/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200/60 flex-shrink-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block group-hover:text-[#A87915] transition-colors">
                      {proj.title}
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      {proj.category} • {proj.tags.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-[#855B09] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                  {proj.number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Data Persistence & Backup / Export */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#D49E24]" />
              <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
                Backup & Data Sync
              </h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              All edits are automatically saved to your browser storage and backend database. You can export a complete JSON snapshot to backup your content anytime.
            </p>
          </div>

          {importStatus && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              {importStatus}
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleExport}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D49E24]" />
              <span>Export Full CMS JSON Backup</span>
            </button>

            <label className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#D49E24]" />
              <span>Restore from JSON File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all CMS content to original Prineor defaults?')) {
                  resetAllToDefault();
                  alert('All CMS sections have been reset to default.');
                }
              }}
              className="w-full py-2 px-4 rounded-xl text-red-600 hover:bg-red-50 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Entire Website to Defaults</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
