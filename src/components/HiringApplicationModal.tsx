import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { HiringPosition, ExperienceLevel } from '../types';
import { 
  Sparkles, 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Briefcase, 
  Send, 
  ShieldCheck, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Github 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HiringApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPosition?: string;
}

export const HiringApplicationModal: React.FC<HiringApplicationModalProps> = ({
  isOpen,
  onClose,
  initialPosition
}) => {
  const { cmsData } = useCMS();
  const hiring = cmsData.hiring;

  // Extract active/open positions
  const rawPositions = hiring.availablePositions || [];
  const openPositions: { id: string; title: string; slug: string }[] = rawPositions.length > 0
    ? rawPositions.filter(p => p.status === 'Open').map(p => ({ id: p.id, title: p.title, slug: p.slug }))
    : [
        { id: 'pos_1', title: 'New Developer', slug: 'new-developer' },
        { id: 'pos_2', title: 'AI Developer', slug: 'ai-developer' }
      ];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Beginner — 0–1 year');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // CV File State
  const [cvFile, setCvFile] = useState<{
    name: string;
    size: number;
    type: string;
    base64Data: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Set initial position when opened
  useEffect(() => {
    if (isOpen) {
      if (initialPosition) {
        // Try matching by slug or exact title
        const match = openPositions.find(
          p => p.slug.toLowerCase() === initialPosition.toLowerCase() || 
               p.title.toLowerCase() === initialPosition.toLowerCase() ||
               p.id === initialPosition
        );
        if (match) {
          setPositionTitle(match.title);
        } else {
          setPositionTitle(initialPosition);
        }
      } else if (openPositions.length > 0) {
        setPositionTitle(openPositions[0].title);
      }
      setSuccessMessage('');
      setErrorMessage('');
      setFileError('');
    }
  }, [isOpen, initialPosition]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension
    const name = file.name;
    const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(ext)) {
      setFileError('Unsupported file format. Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    // Check size (10 MB max)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError('File exceeds 10 MB limit. Please select a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCvFile({
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        base64Data: base64
      });
    };
    reader.onerror = () => {
      setFileError('Failed to read selected file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    setFileError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (honeypot.trim().length > 0) {
      return; // spam rejection
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!positionTitle) {
      setErrorMessage('Please select the position you are applying for.');
      return;
    }

    if (!experienceLevel) {
      setErrorMessage('Please select your experience level.');
      return;
    }

    if (!whyJoin.trim() || whyJoin.trim().length < 5) {
      setErrorMessage('Please explain why you want to join Prineor.');
      return;
    }

    if (!cvFile) {
      setErrorMessage('Please upload your CV / Resume (PDF, DOC, or DOCX).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          positionTitle: positionTitle.trim(),
          experienceLevel: experienceLevel.trim(),
          portfolioUrl: portfolioUrl.trim() || undefined,
          githubUrl: githubUrl.trim() || undefined,
          whyJoin: whyJoin.trim(),
          cvFile: {
            name: cvFile.name,
            size: cvFile.size,
            type: cvFile.type,
            base64Data: cvFile.base64Data
          },
          honeypot: honeypot.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(data.message || 'Application submitted successfully. Thank you for your interest in joining Prineor.');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E6B942', '#D49E24', '#F5D372', '#0F172A']
        });
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Application submit error:', err);
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF9F5]/95 rounded-3xl border border-white/90 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-slate-200/60 flex items-center justify-between relative bg-white/40">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                Prineor Careers & Growth
              </span>
            </div>
            <h2 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#0F172A]">
              Join the Prineor Team
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Complete the application below. We look forward to reviewing your skills and story.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full glass-panel hover:bg-white text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
          {successMessage ? (
            <div className="py-10 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="font-cinzel font-bold text-2xl text-[#0F172A]">
                  Application Received!
                </h3>
                <p className="text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                  {successMessage}
                </p>
              </div>
              <div className="p-4 rounded-2xl glass-panel border border-emerald-200 bg-emerald-50/50 max-w-md mx-auto text-xs text-emerald-900 flex items-center gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Your CV and details have been securely stored in our private portal. Our team will contact you at <strong>{email}</strong>.
                </span>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-transform cursor-pointer"
                >
                  Close & Return to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Honeypot hidden input */}
              <input
                type="text"
                name="website_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="e.g. +1 555 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Position Applying For *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      required
                      value={positionTitle}
                      onChange={(e) => setPositionTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                    >
                      {openPositions.map((pos) => (
                        <option key={pos.id} value={pos.title}>
                          {pos.title}
                        </option>
                      ))}
                      {openPositions.length === 0 && (
                        <option value="General Application">General Application</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Experience Level *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { label: 'Beginner — 0–1 year', desc: 'Starting career / learning' },
                    { label: 'Intermediate — 1–3 years', desc: 'Practical projects done' },
                    { label: 'Experienced — 3+ years', desc: 'Deep domain expertise' }
                  ].map((lvl) => {
                    const isSelected = experienceLevel === lvl.label;
                    return (
                      <button
                        type="button"
                        key={lvl.label}
                        onClick={() => setExperienceLevel(lvl.label as ExperienceLevel)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/90 border-[#D49E24] shadow-xs'
                            : 'bg-white/60 border-slate-200/80 hover:bg-white'
                        }`}
                      >
                        <span className={`text-xs font-bold block ${isSelected ? 'text-[#855B09]' : 'text-[#0F172A]'}`}>
                          {lvl.label}
                        </span>
                        <span className="text-[10px] text-[#64748B] block mt-0.5">
                          {lvl.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Portfolio & GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    Portfolio / Website
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                    GitHub / Relevant Profile
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Why Join Prineor */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Why do you want to join Prineor? *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your learning goals, passions, and how you want to build and grow with Prineor..."
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50 resize-y"
                />
              </div>

              {/* CV / Resume Upload */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Upload Your CV / Resume * (PDF, DOC, DOCX — Max 10 MB)
                </label>
                
                {fileError && (
                  <p className="text-xs text-red-600 mb-2 font-medium">{fileError}</p>
                )}

                {cvFile ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#D49E24] border border-amber-200/60 flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-[#0F172A] block truncate">
                          {cvFile.name}
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          {formatFileSize(cvFile.size)} • Ready to upload
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <label className="px-2.5 py-1 rounded-lg glass-panel hover:bg-white text-[11px] font-semibold text-[#0F172A] border border-slate-200 cursor-pointer">
                        Change
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#D49E24] bg-white/50 hover:bg-amber-50/30 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-amber-100/60 flex items-center justify-center text-[#A87915]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">
                        Click to select CV / Resume file
                      </span>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">
                        Allowed formats: PDF, DOC, DOCX (Maximum file size: 10 MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application to Prineor</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Guarantee */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#94A3B8] pt-1 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D49E24] flex-shrink-0" />
                <span>
                  Your personal information and CV are stored in protected private storage and only accessible to authenticated Prineor admins.
                </span>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
