import React, { useState, useEffect, useCallback } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { PartnerCTAConfig, ContactMessage, MessageStatus } from '../../../types';
import { getAdminAuthHeaders } from '../../../utils/adminApi';
import { AdminEmailComposerModal, EmailComposerRecipient } from '../AdminEmailComposerModal';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  HeartHandshake, 
  ToggleLeft, 
  ToggleRight,
  Eye,
  Search,
  MessageSquare,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Trash2,
  Reply,
  ShieldCheck,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';

export const PartnerSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [form, setForm] = useState<PartnerCTAConfig>({ ...cmsData.partner });
  const [toastMessage, setToastMessage] = useState('');

  // Partner Inquiries State
  const [partnerMessages, setPartnerMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState<EmailComposerRecipient | null>(null);

  const fetchPartnerInquiries = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch('/api/admin/messages', {
        credentials: 'include',
        headers: getAdminAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter partnership inquiries flexibly
          const partnerships = data.filter((m: ContactMessage) => {
            if (m.inquiryType === 'Partnership') return true;
            const sub = (m.subject || '').toLowerCase();
            const msg = (m.message || '').toLowerCase();
            return (
              sub.includes('partner') || 
              sub.includes('collaborat') || 
              msg.includes('partner') || 
              msg.includes('collaboration') ||
              msg.includes('brand or org')
            );
          });
          setPartnerMessages(partnerships);
        }
      } else {
        setFetchError('Could not fetch partner inquiries. Please check your admin session.');
      }
    } catch (e) {
      console.error('Failed to load partner inquiries:', e);
      setFetchError('Network error loading partner inquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartnerInquiries();
  }, [fetchPartnerInquiries]);

  const handleChange = (key: keyof PartnerCTAConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSection('partner', form);
    setToastMessage('Partner CTA Section updated successfully!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset Partner CTA section to default Prineor values?')) {
      resetSection('partner');
      setForm({ ...cmsData.partner });
      setToastMessage('Partner CTA section reset to default.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: MessageStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: getAdminAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setPartnerMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null);
        }
        setToastMessage(`Partner inquiry marked as ${newStatus}.`);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (e) {
      console.error('Error updating inquiry status:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAdminAuthHeaders()
      });
      if (res.ok) {
        setPartnerMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
        if (selectedMessage && selectedMessage.id === deleteTarget.id) {
          setSelectedMessage(null);
        }
        setDeleteTarget(null);
        setToastMessage('Partner inquiry permanently deleted.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (e) {
      console.error('Error deleting inquiry:', e);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered partner messages
  const filteredMessages = partnerMessages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const partnerStats = {
    total: partnerMessages.length,
    newCount: partnerMessages.filter(m => m.status === 'New').length,
    readCount: partnerMessages.filter(m => m.status === 'Read').length,
    repliedCount: partnerMessages.filter(m => m.status === 'Replied').length,
    archivedCount: partnerMessages.filter(m => m.status === 'Archived').length
  };

  const getStatusBadge = (st: MessageStatus) => {
    switch (st) {
      case 'New': return 'bg-amber-100 text-[#855B09] border-amber-300 font-bold';
      case 'Read': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Replied': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Archived': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Partnerships & Inquiries</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Partner Program & Leads
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage the "Become Our Partner" banner and review all submitted partnership proposals in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPartnerInquiries}
            className="px-3 py-2 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D49E24] ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Leads</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {fetchError && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button
            onClick={fetchPartnerInquiries}
            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg font-bold text-[11px] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* PART 1: PARTNER INQUIRIES FEED (PRIMARY FOCUS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#D49E24]" />
            <h2 className="font-cinzel font-bold text-lg text-[#0F172A]">
              Submitted Partner Inquiries
            </h2>
          </div>
          <span className="text-xs font-bold text-[#855B09] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {partnerStats.total} Total Partner {partnerStats.total === 1 ? 'Lead' : 'Leads'}
          </span>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Inquiries', value: partnerStats.total, color: 'text-[#0F172A]' },
            { label: 'New / Unread', value: partnerStats.newCount, color: 'text-amber-700 font-bold' },
            { label: 'Replied', value: partnerStats.repliedCount, color: 'text-emerald-700' },
            { label: 'Archived', value: partnerStats.archivedCount, color: 'text-slate-500' }
          ].map((st, i) => (
            <div key={i} className="p-3.5 rounded-2xl glass-panel bg-white/70 border border-white/90 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                {st.label}
              </span>
              <span className={`text-xl font-cinzel font-bold mt-0.5 block ${st.color}`}>
                {st.value}
              </span>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="p-3.5 rounded-2xl glass-panel bg-white/60 border border-white/90 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search partner leads by name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/90 border border-slate-200/80 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['All', 'New', 'Read', 'Replied', 'Archived'] as const).map(st => {
              const isSelected = statusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#0F172A] text-white shadow-xs' 
                      : 'glass-panel hover:bg-white text-[#475569] border border-slate-200/60'
                  }`}
                >
                  {st} {st === 'New' && partnerStats.newCount > 0 ? `(${partnerStats.newCount})` : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Partner Leads Table */}
        <div className="glass-panel-elevated rounded-3xl border border-white/90 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#64748B] flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#D49E24]" />
              <span>Loading partner inquiries...</span>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B] space-y-2">
              <MessageSquare className="w-9 h-9 text-slate-300 mx-auto" />
              <p className="font-semibold text-sm text-[#0F172A]">No partner inquiries found</p>
              <p className="text-xs text-[#94A3B8]">
                {searchQuery || statusFilter !== 'All' 
                  ? 'Try adjusting your search query or status filter.'
                  : 'When visitors click "Become Our Partner" on the public site and submit, they will appear here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredMessages.map((msg) => {
                const isNew = msg.status === 'New';
                return (
                  <div 
                    key={msg.id}
                    className={`p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-amber-50/20 ${
                      isNew ? 'bg-amber-50/40 font-medium' : 'bg-transparent'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase border ${getStatusBadge(msg.status)}`}>
                          {msg.status}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-100 to-yellow-100 text-[#855B09] border border-amber-300">
                          Partnership Lead
                        </span>

                        <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {msg.date} at {msg.time}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <h4 className="font-bold text-sm text-[#0F172A] truncate">
                          {msg.name}
                        </h4>
                        <span className="text-xs text-[#64748B] truncate">
                          &lt;{msg.email}&gt;
                        </span>
                        {msg.phone && (
                          <span className="text-xs text-[#94A3B8] hidden sm:inline">
                            • {msg.phone}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#0F172A] font-semibold truncate">
                        Subject: {msg.subject}
                      </p>

                      <p className="text-xs text-[#475569] line-clamp-1">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
                        <span>View Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmailRecipient({
                            type: 'partner',
                            id: msg.id,
                            name: msg.name,
                            email: msg.email,
                            phone: msg.phone,
                            subject: msg.subject,
                            originalMessage: msg.message
                          });
                        }}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#855B09] border border-amber-200/80 transition-colors cursor-pointer"
                        title="Compose & Send Email to Partner"
                      >
                        <Reply className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(msg)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Inquiry"
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

      {/* PART 2: PARTNER CTA BANNER CONFIGURATION */}
      <div className="pt-6 border-t border-slate-200/60 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D49E24]" />
          <h2 className="font-cinzel font-bold text-lg text-[#0F172A]">
            Partner CTA Homepage Banner Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-4">
            
            {/* Status Card */}
            <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${form.isEnabled ? 'bg-amber-50 text-[#A87915]' : 'bg-slate-100 text-slate-400'} flex items-center justify-center border border-white/80`}>
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-cinzel font-bold text-base text-[#0F172A] block">
                    Section Visibility: {form.isEnabled ? 'ACTIVE (ENABLED)' : 'HIDDEN (DISABLED)'}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    Toggle the entire Partner CTA section on the homepage
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleChange('isEnabled', !form.isEnabled)}
                className="text-[#D49E24] hover:scale-110 transition-transform cursor-pointer"
              >
                {form.isEnabled ? (
                  <ToggleRight className="w-10 h-10 text-[#D49E24]" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-300" />
                )}
              </button>
            </div>

            {/* Form Content */}
            <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={form.heading}
                  onChange={(e) => handleChange('heading', e.target.value)}
                  placeholder="Become Our Partner"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs font-bold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Partnership Vision Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs text-[#475569] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Button Target Link / Tab
                  </label>
                  <input
                    type="text"
                    value={form.buttonLink}
                    onChange={(e) => handleChange('buttonLink', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Live Preview Card */}
          <div className="md:col-span-4">
            <div className="sticky top-24 rounded-3xl glass-panel-elevated p-6 border border-white/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                <Eye className="w-4 h-4 text-[#D49E24]" />
                <span className="font-cinzel font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  Homepage Banner Preview
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-slate-50 border border-amber-200/60 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[10px] font-bold text-[#855B09] border border-amber-200 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#D49E24]" />
                  <span>Collaboration</span>
                </div>

                <h4 className="font-cinzel font-bold text-base text-[#0F172A]">
                  {form.heading || 'Become Our Partner'}
                </h4>

                <p className="text-xs text-[#475569] line-clamp-3 leading-relaxed">
                  {form.description || "Let's work together, learn together, and build something meaningful."}
                </p>

                <div className="pt-2">
                  <div className="w-full py-2 rounded-xl bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-bold text-xs shadow-xs text-center">
                    {form.buttonText || 'Become Our Partner'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Partner Message Detail */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs border ${getStatusBadge(selectedMessage.status)}`}>
                  {selectedMessage.status}
                </span>
                <span className="text-xs font-bold uppercase text-[#D49E24]">
                  Partnership Proposal
                </span>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D49E24]" />
                    <span className="font-bold text-sm text-[#0F172A]">{selectedMessage.name}</span>
                  </div>
                  <span className="text-xs text-[#94A3B8]">
                    {selectedMessage.date} at {selectedMessage.time}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-2 text-[#475569]">
                    <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <button
                      type="button"
                      onClick={() => {
                        setEmailRecipient({
                          type: 'partner',
                          id: selectedMessage.id,
                          name: selectedMessage.name,
                          email: selectedMessage.email,
                          phone: selectedMessage.phone,
                          subject: selectedMessage.subject,
                          originalMessage: selectedMessage.message
                        });
                      }}
                      className="hover:text-[#A87915] underline font-medium cursor-pointer"
                    >
                      {selectedMessage.email}
                    </button>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2 text-[#475569]">
                      <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{selectedMessage.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-1">
                  Subject
                </label>
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 font-semibold text-sm text-[#0F172A]">
                  {selectedMessage.subject}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-1">
                  Partnership Message & Proposal
                </label>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-[#334155] whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#475569]">Update Status:</span>
                <div className="flex items-center gap-1.5">
                  {(['New', 'Read', 'Replied', 'Archived'] as MessageStatus[]).map((st) => (
                    <button
                      key={st}
                      disabled={actionLoading || selectedMessage.status === st}
                      onClick={() => handleUpdateStatus(selectedMessage.id, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                        selectedMessage.status === st 
                          ? 'bg-[#0F172A] text-white' 
                          : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setDeleteTarget(selectedMessage);
                  setSelectedMessage(null);
                }}
                className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailRecipient({
                      type: 'partner',
                      id: selectedMessage.id,
                      name: selectedMessage.name,
                      email: selectedMessage.email,
                      phone: selectedMessage.phone,
                      subject: selectedMessage.subject,
                      originalMessage: selectedMessage.message
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-bold text-xs shadow-xs hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Compose & Send Email</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
              Permanently Delete Partner Inquiry?
            </h3>
            
            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to delete the partner proposal from <strong>{deleteTarget.name}</strong> ({deleteTarget.email})? This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#475569] cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                disabled={actionLoading}
                onClick={handleDeleteMessage}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete Forever'}
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
            handleUpdateStatus(emailRecipient.id, newStatus as MessageStatus);
          }
        }}
      />

    </div>
  );
};
