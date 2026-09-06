import React, { useState, useEffect } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { getAdminAuthHeaders } from '../../../utils/adminApi';
import { AdminEmailComposerModal, EmailComposerRecipient } from '../AdminEmailComposerModal';
import { 
  HiringConfig, 
  HiringPosition, 
  HiringApplication, 
  ApplicationStatus 
} from '../../../types';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  UserCheck, 
  Plus, 
  Trash2, 
  Mail, 
  ToggleLeft, 
  ToggleRight,
  Eye,
  FileText,
  Download,
  Search,
  User,
  Briefcase,
  Calendar,
  ExternalLink,
  Github,
  Globe,
  X,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Lock,
  Check,
  Phone
} from 'lucide-react';

export const HiringSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  
  // Navigation tabs inside Hiring admin (Defaults directly to Candidates & Applications)
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'applications' | 'settings'>('applications');

  // Hiring Settings State
  const initialAvailable: HiringPosition[] = (cmsData.hiring.availablePositions && cmsData.hiring.availablePositions.length > 0)
    ? cmsData.hiring.availablePositions
    : [
        {
          id: 'pos_1',
          title: 'New Developers',
          slug: 'new-developers',
          shortDescription: 'Motivated entry-level developers ready to learn modern tech stacks and grow with Prineor.',
          detailedDescription: 'Work on real client projects, refine your skills with practical tasks, and learn modern frameworks.',
          status: 'Open',
          order: 1
        },
        {
          id: 'pos_2',
          title: 'AI Developers',
          slug: 'ai-developers',
          shortDescription: 'Explorers interested in building practical AI solutions, GenAI workflows, and intelligent web applications.',
          detailedDescription: 'Build AI workflows, experiment with LLM integrations, and design futuristic digital experiences.',
          status: 'Open',
          order: 2
        }
      ];

  const [form, setForm] = useState<HiringConfig>({
    ...cmsData.hiring,
    availablePositions: initialAvailable
  });

  const [toastMessage, setToastMessage] = useState('');

  // Position Editor Modal
  const [editingPosition, setEditingPosition] = useState<HiringPosition | null>(null);
  const [isAddingPosition, setIsAddingPosition] = useState(false);

  // Applications State
  const [applications, setApplications] = useState<HiringApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState('');
  
  // Application Filter & Search
  const [searchAppQuery, setSearchAppQuery] = useState('');
  const [statusAppFilter, setStatusAppFilter] = useState<'All' | ApplicationStatus>('All');
  const [positionAppFilter, setPositionAppFilter] = useState<string>('All');

  // Selected Application for Details Modal
  const [selectedApp, setSelectedApp] = useState<HiringApplication | null>(null);
  const [appNotes, setAppNotes] = useState('');
  const [isSavingAppNotes, setIsSavingAppNotes] = useState(false);

  // Delete Application Target
  const [deleteAppTarget, setDeleteAppTarget] = useState<HiringApplication | null>(null);
  const [isDeletingApp, setIsDeletingApp] = useState(false);

  // Email Composer Modal State
  const [emailRecipient, setEmailRecipient] = useState<EmailComposerRecipient | null>(null);

  const fetchApplications = async () => {
    setLoadingApps(true);
    setAppsError('');
    try {
      const res = await fetch('/api/admin/applications', {
        credentials: 'include',
        headers: getAdminAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data || []);
      } else {
        setAppsError('Could not load applications. Please verify admin session.');
      }
    } catch (err) {
      console.error('Error loading applications:', err);
      setAppsError('Network error loading applications.');
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeAdminSubTab]);

  const handleSettingsChange = (key: keyof HiringConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Synchronize legacy positions array with active positions
    const activeTitles = (form.availablePositions || []).map(p => p.title);
    const updated = {
      ...form,
      positions: activeTitles
    };
    updateSection('hiring', updated);
    setToastMessage('Hiring settings & positions saved successfully!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleResetSettings = () => {
    if (window.confirm('Reset hiring settings to default values?')) {
      resetSection('hiring');
      setForm({ ...cmsData.hiring });
      setToastMessage('Hiring settings reset to default.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  // Positions Management Handlers
  const handleSavePositionModal = (pos: HiringPosition) => {
    setForm(prev => {
      const list = [...(prev.availablePositions || [])];
      const index = list.findIndex(p => p.id === pos.id);
      if (index >= 0) {
        list[index] = pos;
      } else {
        list.push(pos);
      }
      return { ...prev, availablePositions: list };
    });
    setEditingPosition(null);
    setIsAddingPosition(false);
  };

  const handleDeletePosition = (id: string) => {
    if (window.confirm('Delete this role from the hiring list?')) {
      setForm(prev => ({
        ...prev,
        availablePositions: (prev.availablePositions || []).filter(p => p.id !== id)
      }));
    }
  };

  const handleTogglePositionStatus = (id: string) => {
    setForm(prev => {
      const list = (prev.availablePositions || []).map(p => {
        if (p.id === id) {
          return { ...p, status: (p.status === 'Open' ? 'Closed' : 'Open') as 'Open' | 'Closed' };
        }
        return p;
      });
      return { ...prev, availablePositions: list };
    });
  };

  const handleMovePosition = (index: number, direction: 'up' | 'down') => {
    setForm(prev => {
      const list = [...(prev.availablePositions || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      
      return { ...prev, availablePositions: list };
    });
  };

  // Application Actions
  const handleUpdateAppStatus = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: getAdminAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
        }
        setToastMessage(`Application status updated to ${newStatus}`);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const handleSaveAppNotes = async () => {
    if (!selectedApp) return;
    setIsSavingAppNotes(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: getAdminAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ notes: appNotes })
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, notes: appNotes } : a));
        setSelectedApp(prev => prev ? { ...prev, notes: appNotes } : null);
        setToastMessage('Candidate evaluation notes saved');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving app notes:', err);
    } finally {
      setIsSavingAppNotes(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!deleteAppTarget) return;
    setIsDeletingApp(true);
    try {
      const res = await fetch(`/api/admin/applications/${deleteAppTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAdminAuthHeaders()
      });
      if (res.ok) {
        setApplications(prev => prev.filter(a => a.id !== deleteAppTarget.id));
        if (selectedApp && selectedApp.id === deleteAppTarget.id) {
          setSelectedApp(null);
        }
        setDeleteAppTarget(null);
        setToastMessage('Application deleted successfully.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting application:', err);
    } finally {
      setIsDeletingApp(false);
    }
  };

  // Filter Applications
  const filteredApps = applications.filter(app => {
    const query = searchAppQuery.toLowerCase();
    const matchesSearch = 
      app.fullName.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.positionTitle.toLowerCase().includes(query) ||
      app.experienceLevel.toLowerCase().includes(query) ||
      (app.whyJoin && app.whyJoin.toLowerCase().includes(query));
    
    const matchesStatus = statusAppFilter === 'All' || app.status === statusAppFilter;
    const matchesPosition = positionAppFilter === 'All' || app.positionTitle === positionAppFilter;

    return matchesSearch && matchesStatus && matchesPosition;
  });

  const appStats = {
    total: applications.length,
    newCount: applications.filter(a => a.status === 'New').length,
    reviewingCount: applications.filter(a => a.status === 'Reviewing').length,
    shortlistedCount: applications.filter(a => a.status === 'Shortlisted').length,
    interviewCount: applications.filter(a => a.status === 'Interview').length,
    acceptedCount: applications.filter(a => a.status === 'Accepted').length,
    rejectedCount: applications.filter(a => a.status === 'Rejected').length,
  };

  const getStatusAppBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'New': return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Reviewing': return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Shortlisted': return 'bg-indigo-100 text-indigo-900 border-indigo-200 font-bold';
      case 'Interview': return 'bg-purple-100 text-purple-900 border-purple-200 font-bold';
      case 'Accepted': return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'Rejected': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const openPositionsCount = (form.availablePositions || []).filter(p => p.status === 'Open').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Recruitment & Growth</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Hiring & Applications Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure active positions, hiring toggles, and manage incoming candidate applications and secure CVs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeAdminSubTab === 'settings' && (
            <>
              <button
                onClick={handleResetSettings}
                className="px-3 py-2 rounded-xl text-[#64748B] hover:text-red-600 hover:bg-red-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to default"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Hiring Settings</span>
              </button>
            </>
          )}

          {activeAdminSubTab === 'applications' && (
            <button
              onClick={fetchApplications}
              disabled={loadingApps}
              className="px-4 py-2 rounded-xl glass-panel hover:bg-white text-[#0F172A] font-semibold text-xs border border-slate-200 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingApps ? 'animate-spin text-[#D49E24]' : ''}`} />
              <span>Refresh Candidates</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          onClick={() => setActiveAdminSubTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'settings'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'glass-panel hover:bg-white text-[#475569]'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#D49E24]" />
          <span>Positions & Settings</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
            {openPositionsCount} Open
          </span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'applications'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'glass-panel hover:bg-white text-[#475569]'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#D49E24]" />
          <span>Applications & CVs</span>
          {appStats.newCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] animate-pulse">
              {appStats.newCount} New
            </span>
          )}
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 1: POSITIONS & SETTINGS */}
      {/* ======================================================== */}
      {activeAdminSubTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: General Configuration */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Status Toggle Card */}
            <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${form.isHiringOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'} flex items-center justify-center border border-white/80`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-cinzel font-bold text-base text-[#0F172A] block">
                    Hiring Portal Status: {form.isHiringOpen ? 'HIRING (ON)' : 'CLOSED (OFF)'}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {form.isHiringOpen ? 'The careers section is actively accepting applications' : 'Applications are closed and application forms are disabled'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSettingsChange('isHiringOpen', !form.isHiringOpen)}
                className="text-[#D49E24] hover:scale-110 transition-transform cursor-pointer"
              >
                {form.isHiringOpen ? (
                  <ToggleRight className="w-10 h-10 text-[#D49E24]" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-300" />
                )}
              </button>
            </div>

            {/* General Text Settings */}
            <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={form.heading}
                  onChange={(e) => handleSettingsChange('heading', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs font-bold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Description / Team Growth Pitch
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleSettingsChange('description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs text-[#475569] leading-relaxed resize-y"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Application Email Notification Destination
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={form.applicationEmail}
                    onChange={(e) => handleSettingsChange('applicationEmail', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Hiring Disclaimer / Closed Status Note
                </label>
                <input
                  type="text"
                  value={form.notHiringNote}
                  onChange={(e) => handleSettingsChange('notHiringNote', e.target.value)}
                  placeholder="WordPress Developers — Not Currently Hiring"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs italic text-[#855B09]"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Positions List & Structured Editor */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="rounded-3xl glass-panel-elevated p-6 border border-white/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
                    Available Positions ({(form.availablePositions || []).length})
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Manage titles, descriptions, and Open/Closed statuses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddingPosition(true);
                    setEditingPosition({
                      id: `pos_${Date.now()}`,
                      title: '',
                      slug: '',
                      shortDescription: '',
                      detailedDescription: '',
                      status: 'Open',
                      order: (form.availablePositions || []).length + 1
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-xs hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Position</span>
                </button>
              </div>

              {/* Positions List */}
              <div className="space-y-3">
                {(form.availablePositions || []).map((pos, idx) => {
                  const isOpen = pos.status === 'Open';
                  return (
                    <div 
                      key={pos.id || idx}
                      className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs hover:border-[#D49E24]/50 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <h4 className="font-bold text-sm text-[#0F172A]">
                            {pos.title}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {pos.status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMovePosition(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMovePosition(idx, 'down')}
                            disabled={idx === (form.availablePositions || []).length - 1}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTogglePositionStatus(pos.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                              isOpen 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {isOpen ? 'Close Role' : 'Open Role'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingPosition(pos);
                              setIsAddingPosition(false);
                            }}
                            className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#855B09] text-[10px] font-bold border border-amber-200 cursor-pointer"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePosition(pos.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#64748B]">
                        {pos.shortDescription || 'No description added yet.'}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: APPLICATIONS & CVS */}
      {/* ======================================================== */}
      {activeAdminSubTab === 'applications' && (
        <div className="space-y-5">
          
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { label: 'Total Apps', value: appStats.total, color: 'text-[#0F172A]' },
              { label: 'New', value: appStats.newCount, color: 'text-amber-600 font-bold' },
              { label: 'Reviewing', value: appStats.reviewingCount, color: 'text-blue-600' },
              { label: 'Shortlisted', value: appStats.shortlistedCount, color: 'text-indigo-600 font-bold' },
              { label: 'Interview', value: appStats.interviewCount, color: 'text-purple-600 font-bold' },
              { label: 'Accepted', value: appStats.acceptedCount, color: 'text-emerald-600' },
              { label: 'Rejected', value: appStats.rejectedCount, color: 'text-slate-500' }
            ].map((st, idx) => (
              <div key={idx} className="p-3 rounded-2xl glass-panel bg-white/70 border border-white/90 shadow-2xs">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                  {st.label}
                </span>
                <span className={`text-lg font-cinzel font-bold mt-0.5 block ${st.color}`}>
                  {st.value}
                </span>
              </div>
            ))}
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl glass-panel bg-white/60 border border-white/90 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, email, role, or skills..."
                value={searchAppQuery}
                onChange={(e) => setSearchAppQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/90 border border-slate-200/80 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {(['All', 'New', 'Reviewing', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusAppFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    statusAppFilter === st
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'glass-panel hover:bg-white text-[#475569] border border-slate-200/60'
                  }`}
                >
                  {st} {st === 'New' && appStats.newCount > 0 ? `(${appStats.newCount})` : ''}
                </button>
              ))}
            </div>

          </div>

          {/* Applications Table / Cards */}
          <div className="glass-panel-elevated rounded-3xl border border-white/90 shadow-sm overflow-hidden">
            {loadingApps ? (
              <div className="py-16 text-center text-xs text-[#64748B] flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#D49E24]" />
                <span>Loading candidates...</span>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#64748B] space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-semibold text-sm text-[#0F172A]">No applications found</p>
                <p className="text-xs text-[#94A3B8]">
                  Applications submitted from the Contact page careers section will securely appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const isNew = app.status === 'New';
                  return (
                    <div 
                      key={app.id}
                      className={`p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-amber-50/20 ${
                        isNew ? 'bg-amber-50/40' : 'bg-transparent'
                      }`}
                    >
                      {/* Left: Applicant Details */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase border ${getStatusAppBadge(app.status)}`}>
                            {app.status}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#0F172A] text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                            {app.positionTitle}
                          </span>

                          <span className="text-[11px] text-[#D49E24] font-semibold">
                            {app.experienceLevel}
                          </span>

                          <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {app.date} at {app.time}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <h4 className="font-bold text-sm text-[#0F172A] truncate">
                            {app.fullName}
                          </h4>
                          <span className="text-xs text-[#64748B] truncate">
                            &lt;{app.email}&gt;
                          </span>
                          {app.phone && (
                            <span className="text-xs text-[#94A3B8] hidden sm:inline">
                              • {app.phone}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#475569] line-clamp-1 italic">
                          "{app.whyJoin}"
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setAppNotes(app.notes || '');
                            if (app.status === 'New') {
                              handleUpdateAppStatus(app.id, 'Reviewing');
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
                          <span>Review Application</span>
                        </button>

                        <button
                          onClick={() => {
                            setEmailRecipient({
                              type: 'candidate',
                              id: app.id,
                              name: app.fullName,
                              email: app.email,
                              phone: app.phone,
                              positionTitle: app.positionTitle,
                              experienceLevel: app.experienceLevel,
                              whyJoin: app.whyJoin
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#855B09] text-xs font-bold border border-amber-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          title="Quick Email to Candidate"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#D49E24]" />
                          <span>Email</span>
                        </button>

                        <a
                          href={`/api/admin/applications/${app.id}/cv?download=1`}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#475569] border border-slate-200 transition-colors cursor-pointer"
                          title="Download CV securely"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => setDeleteAppTarget(app)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* POSITION EDIT / ADD MODAL */}
      {/* ======================================================== */}
      {editingPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
                {isAddingPosition ? 'Add New Position' : 'Edit Position'}
              </h3>
              <button
                onClick={() => setEditingPosition(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Developer"
                  value={editingPosition.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    setEditingPosition(prev => prev ? { ...prev, title, slug } : null);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary shown on the careers card..."
                  value={editingPosition.shortDescription}
                  onChange={(e) => setEditingPosition(prev => prev ? { ...prev, shortDescription: e.target.value } : null)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Responsibilities, expectations, or learning path..."
                  value={editingPosition.detailedDescription || ''}
                  onChange={(e) => setEditingPosition(prev => prev ? { ...prev, detailedDescription: e.target.value } : null)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                  Position Status
                </label>
                <div className="flex items-center gap-3">
                  {(['Open', 'Closed'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditingPosition(prev => prev ? { ...prev, status: st } : null)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        editingPosition.status === st 
                          ? 'bg-[#0F172A] text-white border-[#0F172A]' 
                          : 'bg-white text-[#475569] border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingPosition(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => editingPosition && handleSavePositionModal(editingPosition)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-xs"
              >
                Save Role
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* APPLICATION REVIEW MODAL */}
      {/* ======================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs border ${getStatusAppBadge(selectedApp.status)}`}>
                  {selectedApp.status}
                </span>
                <span className="text-xs font-bold uppercase text-[#D49E24]">
                  {selectedApp.positionTitle}
                </span>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              
              {/* Candidate Info Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D49E24]" />
                    <span className="font-bold text-base text-[#0F172A]">{selectedApp.fullName}</span>
                  </div>
                  <span className="text-xs text-[#94A3B8]">
                    Applied: {selectedApp.date} at {selectedApp.time}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#475569] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => {
                        setEmailRecipient({
                          type: 'candidate',
                          id: selectedApp.id,
                          name: selectedApp.fullName,
                          email: selectedApp.email,
                          phone: selectedApp.phone,
                          positionTitle: selectedApp.positionTitle,
                          experienceLevel: selectedApp.experienceLevel,
                          whyJoin: selectedApp.whyJoin
                        });
                      }}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      {selectedApp.email}
                    </button>
                  </div>
                  {selectedApp.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedApp.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Level: <strong>{selectedApp.experienceLevel}</strong></span>
                  </div>
                </div>

                {/* Portfolio / GitHub links */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200/60">
                  {selectedApp.portfolioUrl && (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#D49E24] hover:underline font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Portfolio: {selectedApp.portfolioUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedApp.githubUrl && (
                    <a
                      href={selectedApp.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#0F172A] hover:underline font-semibold"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub: {selectedApp.githubUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Why Join */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Why They Want To Join Prineor
                </label>
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs sm:text-sm text-[#1E293B] whitespace-pre-wrap leading-relaxed">
                  {selectedApp.whyJoin}
                </div>
              </div>

              {/* Secure CV File Card */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Candidate CV / Resume (Stored Privately)
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#D49E24] flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-xs text-[#0F172A] block truncate">
                        {selectedApp.cvOriginalName || selectedApp.cvFileName}
                      </span>
                      <span className="text-[10px] text-[#64748B]">
                        {(selectedApp.cvFileSize / 1024).toFixed(1)} KB • Private Admin Access Only
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/api/admin/applications/${selectedApp.id}/cv`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>View CV</span>
                    </a>
                    <a
                      href={`/api/admin/applications/${selectedApp.id}/cv?download=1`}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#855B09] text-xs font-bold border border-amber-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Admin Evaluation Notes */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Internal Candidate Notes
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveAppNotes}
                    disabled={isSavingAppNotes}
                    className="text-[11px] font-bold text-[#D49E24] hover:underline cursor-pointer"
                  >
                    {isSavingAppNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Add private candidate interview notes, rating, or feedback..."
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>

              {/* Status Update Buttons */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                  Update Candidate Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'Reviewing', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'] as ApplicationStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateAppStatus(selectedApp.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedApp.status === st
                          ? 'bg-[#0F172A] text-white border-[#0F172A]'
                          : 'bg-white hover:bg-slate-100 text-[#475569] border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDeleteAppTarget(selectedApp)}
                className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Application</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmailRecipient({
                      type: 'candidate',
                      id: selectedApp.id,
                      name: selectedApp.fullName,
                      email: selectedApp.email,
                      phone: selectedApp.phone,
                      positionTitle: selectedApp.positionTitle,
                      experienceLevel: selectedApp.experienceLevel,
                      whyJoin: selectedApp.whyJoin
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] text-xs font-bold shadow-xs hover:scale-102 transition-transform flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Compose & Send Email</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CANDIDATE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deleteAppTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
                Delete Application?
              </h3>
              <p className="text-xs text-[#64748B]">
                Are you sure you want to permanently delete the application and CV for <strong>{deleteAppTarget.fullName}</strong> ({deleteAppTarget.email})? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAppTarget(null)}
                className="px-5 py-2 rounded-xl glass-panel text-xs font-semibold text-[#0F172A] border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteApplication}
                disabled={isDeletingApp}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeletingApp ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EMAIL COMPOSER & RESPONSE MODAL */}
      {/* ======================================================== */}
      <AdminEmailComposerModal
        isOpen={Boolean(emailRecipient)}
        onClose={() => setEmailRecipient(null)}
        recipient={emailRecipient}
        onStatusUpdated={(newStatus) => {
          if (emailRecipient?.id) {
            handleUpdateAppStatus(emailRecipient.id, newStatus as ApplicationStatus);
          }
        }}
      />

    </div>
  );
};
