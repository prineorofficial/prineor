import React, { useState } from 'react';
import { 
  X, 
  Handshake, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PartnerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerInquiryModal: React.FC<PartnerInquiryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    brandOrOrg: '',
    subject: 'Partnership & Collaboration Inquiry',
    message: ''
  });

  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const fullMessage = formData.brandOrOrg 
        ? `Organization / Brand: ${formData.brandOrOrg}\n\n${formData.message}`
        : formData.message;

      const response = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          inquiryType: 'Partnership',
          subject: formData.subject.trim() || 'Partnership Inquiry',
          message: fullMessage.trim(),
          honeypot: honeypot.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.id) {
        throw new Error(data.error || 'Something went wrong while sending your inquiry. Please try again.');
      }

      // Success state is ONLY triggered after confirmed database write
      setSubmitted(true);
      setSuccessMessage(data.message || 'Your partner inquiry has been received and saved. Our team will review and reply promptly.');

      // Celebratory luxury confetti
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E6B942', '#D49E24', '#F5D372', '#ffffff']
      });

    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while sending your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      brandOrOrg: '',
      subject: 'Partnership & Collaboration Inquiry',
      message: ''
    });
    setErrorMessage('');
    setSuccessMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white/95 rounded-3xl border border-white/90 shadow-[0_25px_60px_rgba(15,23,42,0.15)] overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Soft Gold Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-amber-100/50 via-yellow-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100/80 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E6B942] to-[#D49E24] p-[1px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
                <Handshake className="w-5 h-5 text-[#D49E24]" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-[10px] font-bold text-[#855B09] uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3 text-[#D49E24]" />
                <span>Partner With Prineor</span>
              </div>
              <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
                Become Our Partner
              </h3>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 relative z-10">
          {submitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              
              <h3 className="font-cinzel font-bold text-2xl text-[#0F172A]">
                Partner Inquiry Received!
              </h3>
              
              <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>

              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 max-w-md mx-auto text-xs text-amber-900 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D49E24]" />
                <span>We will review your proposal and reply to <strong>{formData.email}</strong>.</span>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[#64748B] leading-relaxed">
                Whether you are a creator, business, developer, or startup, let's explore how we can collaborate, build, and grow together.
              </p>

              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="partner_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Brand / Company / Project (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Creative Studio / Startup"
                    value={formData.brandOrOrg}
                    onChange={(e) => setFormData({ ...formData, brandOrOrg: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Phone / Contact (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 555 019 8832"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1">
                  Partnership Focus / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Collaborative Web Project & Digital Strategy"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] uppercase tracking-wider mb-1">
                  How Would You Like To Partner? *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about your vision, goals, what you are building, or how Prineor can collaborate with you..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-[0_6px_20px_rgba(212,158,36,0.35)] hover:shadow-[0_8px_25px_rgba(212,158,36,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Partner Inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Partner Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D49E24]" />
                <span>All partner inquiries are logged directly in our private admin system.</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
