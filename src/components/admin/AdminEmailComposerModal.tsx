import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Sparkles, 
  User, 
  Briefcase, 
  CheckCircle2,
  Calendar,
  MessageSquare
} from 'lucide-react';

export interface EmailComposerRecipient {
  type: 'candidate' | 'message' | 'partner';
  id?: string;
  name: string;
  email: string;
  phone?: string;
  positionTitle?: string;
  experienceLevel?: string;
  subject?: string;
  originalMessage?: string;
  whyJoin?: string;
}

interface AdminEmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: EmailComposerRecipient | null;
  onStatusUpdated?: (status: string) => void;
}

export const AdminEmailComposerModal: React.FC<AdminEmailComposerModalProps> = ({
  isOpen,
  onClose,
  recipient,
  onStatusUpdated
}) => {
  if (!isOpen || !recipient) return null;

  // Preset Template Selection based on type
  const isCandidate = recipient.type === 'candidate';
  const isPartner = recipient.type === 'partner';

  const defaultTemplates = isCandidate
    ? [
        {
          id: 'interview',
          title: '🗓️ Interview Invitation',
          subject: `Interview Invitation — ${recipient.positionTitle || 'Position'} at Prineor`,
          body: `Hi ${recipient.name},

Thank you for your interest in joining Prineor and applying for the ${recipient.positionTitle || 'open'} role!

We reviewed your application and portfolio/CV, and we are excited to invite you for an initial interview to discuss your experience, goals, and upcoming projects.

Please let us know your availability over the next few days (along with your timezone) so we can schedule a quick 30-minute video call.

Looking forward to speaking with you!

Best regards,
Dawood Muzahir & The Prineor Team
https://prineor.com`
        },
        {
          id: 'shortlist',
          title: '⭐ Shortlisted Notice',
          subject: `Application Update: ${recipient.positionTitle || 'Position'} — Prineor`,
          body: `Hi ${recipient.name},

Thank you for applying for the ${recipient.positionTitle || 'open'} position at Prineor.

We wanted to let you know that your application has been shortlisted by our review team. We are currently finalizing candidate reviews and will follow up shortly with next steps.

Thank you for your patience and enthusiasm!

Best regards,
The Prineor Careers Team`
        },
        {
          id: 'acceptance',
          title: '🎉 Offer / Next Steps',
          subject: `Offer & Next Steps — ${recipient.positionTitle || 'Position'} at Prineor`,
          body: `Hi ${recipient.name},

Following our discussions and review of your application for the ${recipient.positionTitle || 'open'} role, we are thrilled to move forward with you!

Please find our preliminary proposal details attached / below. Let's arrange a brief onboarding call to finalize the start date and project assignments.

Welcome aboard!

Warm regards,
Prineor Talent Team`
        },
        {
          id: 'general',
          title: '✉️ General Response',
          subject: `Regarding your application for ${recipient.positionTitle || 'Career'} — Prineor`,
          body: `Hi ${recipient.name},

Thank you for reaching out and submitting your application to Prineor for the ${recipient.positionTitle || 'open'} position.

We are currently evaluating your profile against our current project roadmap. If you have any additional portfolio items or project repositories to share, feel free to reply directly to this email.

Best regards,
Dawood Muzahir
Prineor`
        }
      ]
    : isPartner
    ? [
        {
          id: 'partner_call',
          title: '🤝 Partner Collaboration Call',
          subject: `Partnership Discussion: ${recipient.subject || 'Prineor & ' + recipient.name}`,
          body: `Hi ${recipient.name},

Thank you for reaching out to partner with Prineor!

We are excited about potential collaboration opportunities across design, full-stack engineering, and AI digital solutions.

We would love to schedule a brief discovery call to discuss how our teams can work together. What days and times work best for you this week?

Best regards,
Dawood Muzahir
Founder & Principal, Prineor
prineorofficial@gmail.com`
        },
        {
          id: 'partner_info',
          title: '📋 Partnership Overview',
          subject: `Re: ${recipient.subject || 'Partnership with Prineor'}`,
          body: `Hi ${recipient.name},

Thank you for your interest in partnering with Prineor.

We have received your proposal regarding:
"${recipient.subject || 'Partnership Inquiry'}"

Our team has reviewed your note and we are eager to explore mutually beneficial synergies. Let's connect to share our agency credentials, capabilities deck, and discuss next steps.

Warm regards,
The Prineor Partnerships Team`
        }
      ]
    : [
        {
          id: 'inquiry_reply',
          title: '💬 Inquiry Reply',
          subject: `Re: ${recipient.subject || 'Your Message to Prineor'}`,
          body: `Hi ${recipient.name},

Thank you for contacting Prineor regarding "${recipient.subject || 'your inquiry'}".

We have received your message and would love to help you bring your vision to life. Could you share a few more details about your timeline and requirements, or would you prefer a quick 15-minute discovery call?

Looking forward to your response.

Best regards,
Dawood Muzahir
Prineor`
        },
        {
          id: 'project_estimate',
          title: '📊 Project Discovery & Estimate',
          subject: `Project Discussion: ${recipient.subject || 'New Project with Prineor'}`,
          body: `Hi ${recipient.name},

Thank you for reaching out to Prineor regarding your project!

We specialize in high-performance digital products, bespoke web design, and full-stack solutions. We would be happy to prepare a scoped proposal and timeline for you.

Let us know when you are available for a brief scoping call.

Best regards,
The Prineor Team`
        }
      ];

  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultTemplates[0]?.id || '');
  const [subject, setSubject] = useState<string>(defaultTemplates[0]?.subject || `Message from Prineor to ${recipient.name}`);
  const [body, setBody] = useState<string>(defaultTemplates[0]?.body || `Hi ${recipient.name},\n\n`);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = defaultTemplates.find(t => t.id === templateId);
    if (tmpl) {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(recipient.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyFullText = () => {
    const fullText = `To: ${recipient.email}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  // Gmail Web Compose Link
  const getGmailComposeUrl = () => {
    const encTo = encodeURIComponent(recipient.email);
    const encSub = encodeURIComponent(subject);
    const encBody = encodeURIComponent(body);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encTo}&su=${encSub}&body=${encBody}`;
  };

  // Outlook Web Compose Link
  const getOutlookComposeUrl = () => {
    const encTo = encodeURIComponent(recipient.email);
    const encSub = encodeURIComponent(subject);
    const encBody = encodeURIComponent(body);
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${encTo}&subject=${encSub}&body=${encBody}`;
  };

  // Native mailto Link
  const getMailtoUrl = () => {
    const encSub = encodeURIComponent(subject);
    const encBody = encodeURIComponent(body);
    return `mailto:${recipient.email}?subject=${encSub}&body=${encBody}`;
  };

  const handleOpenEmail = (url: string, newStatus?: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setSentNotice(true);
    if (newStatus && onStatusUpdated) {
      onStatusUpdated(newStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E6B942] to-[#D49E24] flex items-center justify-center text-[#0F172A] shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
                <span>Compose & Send Email</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-[#855B09] font-sans font-bold uppercase">
                  {recipient.type}
                </span>
              </h3>
              <p className="text-xs text-[#64748B]">
                Direct 1-click email response to <strong>{recipient.name}</strong> ({recipient.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Recipient summary banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#0F172A]">{recipient.name}</span>
              <span className="text-[#64748B]">&lt;{recipient.email}&gt;</span>
              {recipient.positionTitle && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100/70 text-[#855B09] font-medium text-[11px]">
                  {recipient.positionTitle}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
            </button>
          </div>

          {/* Preset templates selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
              <span>Choose Professional Response Template</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {defaultTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTemplateSelect(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    selectedTemplate === t.id
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-[#475569] border-slate-200'
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          {/* Email Subject field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
            />
          </div>

          {/* Email Body field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Message Body
              </label>
              <button
                type="button"
                onClick={handleCopyFullText}
                className="text-[11px] font-bold text-[#D49E24] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedBody ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBody ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#0F172A] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 resize-y"
            />
          </div>

          {sentNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Email client window opened! You can complete sending directly in Gmail, Outlook, or your preferred mail application.</span>
            </div>
          )}

        </div>

        {/* Footer with multiple 1-Click Send / Webmail options */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Native Mail App (mailto) */}
            <a
              href={getMailtoUrl()}
              onClick={() => {
                setSentNotice(true);
                if (onStatusUpdated) onStatusUpdated(isCandidate ? 'Reviewing' : 'Replied');
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Default Mail App</span>
            </a>

            {/* Outlook Web Compose */}
            <button
              type="button"
              onClick={() => handleOpenEmail(getOutlookComposeUrl(), isCandidate ? 'Interview' : 'Replied')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              <span>Open in Outlook</span>
            </button>

            {/* Gmail Web Compose (Primary) */}
            <button
              type="button"
              onClick={() => handleOpenEmail(getGmailComposeUrl(), isCandidate ? 'Interview' : 'Replied')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] text-xs font-bold shadow-xs hover:scale-102 transition-transform flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#0F172A]" />
              <span>Open in Gmail (Send)</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
