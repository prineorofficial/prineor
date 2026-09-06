import React, { useState, useEffect } from 'react';
import { ContactMessage, MessageStatus, MessageInquiryType } from '../../../types';
import { getAdminAuthHeaders } from '../../../utils/adminApi';
import { AdminEmailComposerModal, EmailComposerRecipient } from '../AdminEmailComposerModal';
import { 
  Mail, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Reply, 
  Archive, 
  Eye, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Phone, 
  User, 
  Calendar, 
  Tag, 
  X, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const MessagesSectionAdmin: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | MessageStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | MessageInquiryType>('All');

  // Selected Message Modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Email Composer Modal State
  const [emailRecipient, setEmailRecipient] = useState<EmailComposerRecipient | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/messages', {
        credentials: 'include',
        headers: getAdminAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
      } else {
        setError('Failed to fetch messages. Please check authentication.');
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Network error loading messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: MessageStatus) => {
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
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null);
        }
        setActionSuccess(`Status updated to ${newStatus}`);
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: getAdminAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ notes: adminNotes })
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, notes: adminNotes } : m));
        setSelectedMessage(prev => prev ? { ...prev, notes: adminNotes } : null);
        setActionSuccess('Admin notes saved');
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAdminAuthHeaders()
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
        if (selectedMessage && selectedMessage.id === deleteTarget.id) {
          setSelectedMessage(null);
        }
        setDeleteTarget(null);
        setActionSuccess('Message deleted successfully.');
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setError('Failed to delete message.');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Network error deleting message.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openMessageModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.notes || '');
    // Automatically mark 'New' messages as 'Read' upon opening
    if (msg.status === 'New') {
      handleUpdateStatus(msg.id, 'Read');
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || msg.status === statusFilter;
    const matchesType = typeFilter === 'All' || msg.inquiryType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: messages.length,
    newCount: messages.filter(m => m.status === 'New').length,
    readCount: messages.filter(m => m.status === 'Read').length,
    repliedCount: messages.filter(m => m.status === 'Replied').length,
    archivedCount: messages.filter(m => m.status === 'Archived').length,
  };

  const getStatusBadge = (status: MessageStatus) => {
    switch (status) {
      case 'New':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Read':
        return 'bg-blue-50 text-blue-800 border-blue-200 font-medium';
      case 'Replied':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium';
      case 'Archived':
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#0F172A]">
              Contact Messages & Inquiries
            </h2>
            {stats.newCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse">
                {stats.newCount} New
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Real-time messages sent from the Contact page and Partnership CTAs.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="px-4 py-2 rounded-xl glass-panel hover:bg-white text-[#0F172A] font-semibold text-xs border border-slate-200 shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D49E24]' : ''}`} />
          <span>Refresh Messages</span>
        </button>
      </div>

      {/* Success / Error notification */}
      {actionSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stat KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Inquiries', value: stats.total, color: 'text-[#0F172A]' },
          { label: 'New / Unread', value: stats.newCount, color: 'text-amber-600 font-bold' },
          { label: 'Read', value: stats.readCount, color: 'text-blue-600' },
          { label: 'Replied', value: stats.repliedCount, color: 'text-emerald-600' },
          { label: 'Archived', value: stats.archivedCount, color: 'text-slate-600' }
        ].map((s, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl glass-panel bg-white/70 border border-white/90 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              {s.label}
            </span>
            <span className={`text-xl sm:text-2xl font-cinzel font-bold mt-0.5 block ${s.color}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel bg-white/60 border border-white/90 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/90 border border-slate-200/80 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
          />
        </div>

        {/* Status Filter Tabs */}
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
                {st} {st === 'New' && stats.newCount > 0 ? `(${stats.newCount})` : ''}
              </button>
            );
          })}
        </div>

        {/* Type Filter Dropdown */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-white/90 border border-slate-200/80 text-xs font-semibold text-[#0F172A] focus:outline-none"
        >
          <option value="All">All Inquiries</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Project Inquiry">Project Inquiry</option>
          <option value="Partnership">Partnership Inquiry</option>
        </select>
      </div>

      {/* Messages List / Table */}
      <div className="glass-panel-elevated rounded-3xl border border-white/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#64748B] flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#D49E24]" />
            <span>Loading contact messages...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B] space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-sm text-[#0F172A]">No messages found</p>
            <p className="text-xs text-[#94A3B8]">
              {searchQuery || statusFilter !== 'All' || typeFilter !== 'All' 
                ? 'Try adjusting your search or active filters.'
                : 'Inquiries submitted through the Contact Page will appear here.'}
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
                  {/* Left: Sender & Preview */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase border ${getStatusBadge(msg.status)}`}>
                        {msg.status}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        msg.inquiryType === 'Partnership' 
                          ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-[#855B09] border border-amber-300' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {msg.inquiryType}
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

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openMessageModal(msg)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>View Message</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEmailRecipient({
                          type: msg.inquiryType === 'Partnership' ? 'partner' : 'message',
                          id: msg.id,
                          name: msg.name,
                          email: msg.email,
                          phone: msg.phone,
                          subject: msg.subject,
                          originalMessage: msg.message
                        });
                      }}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#855B09] border border-amber-200/80 transition-colors cursor-pointer"
                      title="Compose & Send Email Reply"
                    >
                      <Reply className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(msg)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Message"
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

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs border ${getStatusBadge(selectedMessage.status)}`}>
                  {selectedMessage.status}
                </span>
                <span className="text-xs font-bold uppercase text-[#D49E24]">
                  {selectedMessage.inquiryType}
                </span>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              
              {/* Sender Block */}
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

                <div className="flex flex-wrap gap-4 text-xs text-[#475569]">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => {
                        setEmailRecipient({
                          type: selectedMessage.inquiryType === 'Partnership' ? 'partner' : 'message',
                          id: selectedMessage.id,
                          name: selectedMessage.name,
                          email: selectedMessage.email,
                          phone: selectedMessage.phone,
                          subject: selectedMessage.subject,
                          originalMessage: selectedMessage.message
                        });
                      }}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      {selectedMessage.email}
                    </button>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMessage.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Subject
                </label>
                <div className="text-sm font-bold text-[#0F172A]">
                  {selectedMessage.subject}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Message Content
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-[#1E293B] whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Internal Admin Notes
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="text-[11px] font-bold text-[#D49E24] hover:underline cursor-pointer"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Add private internal notes or follow-up reminders..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>

              {/* Status Update Quick Toggles */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                  Update Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'Read', 'Replied', 'Archived'] as MessageStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedMessage.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedMessage.status === st
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
                onClick={() => {
                  setDeleteTarget(selectedMessage);
                }}
                className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmailRecipient({
                      type: selectedMessage.inquiryType === 'Partnership' ? 'partner' : 'message',
                      id: selectedMessage.id,
                      name: selectedMessage.name,
                      email: selectedMessage.email,
                      phone: selectedMessage.phone,
                      subject: selectedMessage.subject,
                      originalMessage: selectedMessage.message
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] text-xs font-bold shadow-xs hover:scale-102 transition-transform flex items-center gap-2 cursor-pointer"
                >
                  <Reply className="w-4 h-4" />
                  <span>Compose & Send Email</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
                Delete Inquiry?
              </h3>
              <p className="text-xs text-[#64748B]">
                Are you sure you want to permanently delete the inquiry from <strong>{deleteTarget.name}</strong> ({deleteTarget.email})? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2 rounded-xl glass-panel text-xs font-semibold text-[#0F172A] border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
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
