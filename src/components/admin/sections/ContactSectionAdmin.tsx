import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { PersonalBrandConfig } from '../../../types';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  HelpCircle,
  Plus,
  Trash2,
  ShieldCheck 
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const ContactSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [form, setForm] = useState<PersonalBrandConfig>({ ...cmsData.brand });
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const raw = cmsData.contact?.faqs;
    if (raw && raw.length > 0) {
      return raw.map(f => ({
        question: f.question || f.q || '',
        answer: f.answer || f.a || ''
      }));
    }
    return [
      {
        question: 'How does Prineor work with clients and partners?',
        answer: 'We work closely and transparently with you from idea to execution. We begin with a clear discussion of your goals, create a structured plan, build the solution with continuous updates, and ensure everything runs smoothly.'
      },
      {
        question: 'What services does Prineor offer?',
        answer: 'Our core services include Web Development with WordPress, AI Development, Graphic Designing, Digital Marketing, and Social Media Services.'
      },
      {
        question: 'Is Prineor open to partnerships and collaborative projects?',
        answer: 'Yes! We are actively open to partnerships, client projects, and collaborations with creators and businesses looking to grow their digital presence.'
      },
      {
        question: 'When was Prineor founded?',
        answer: 'Prineor was founded in 2026 with a clear focus on continuous learning, practical projects, and turning ideas into meaningful digital experiences.'
      },
      {
        question: 'How quickly will you respond to my message?',
        answer: 'We usually respond within 24 hours via email (prineorofficial@gmail.com) to discuss your project details, timeline, and next steps.'
      }
    ];
  });
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (key: keyof PersonalBrandConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddFaq = () => {
    setFaqs(prev => [
      ...prev,
      { question: '', answer: '' }
    ]);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateSection('brand', form);
    
    // Update contact section with FAQs
    updateSection('contact', {
      email: form.email,
      phone: form.phone,
      location: form.location,
      availability: form.availability,
      faqs: faqs.filter(f => f.question.trim().length > 0)
    });

    // Also sync with settings if email/phone changed
    updateSection('settings', {
      ...cmsData.settings,
      primaryEmail: form.email,
      phone: form.phone,
      location: form.location
    });

    setToastMessage('Contact information and FAQs updated successfully!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset Contact Information and FAQs to Prineor defaults?')) {
      resetSection('brand');
      resetSection('contact');
      setForm({ ...cmsData.brand });
      setFaqs([
        {
          question: 'How does Prineor work with clients and partners?',
          answer: 'We work closely and transparently with you from idea to execution. We begin with a clear discussion of your goals, create a structured plan, build the solution with continuous updates, and ensure everything runs smoothly.'
        },
        {
          question: 'What services does Prineor offer?',
          answer: 'Our core services include Web Development with WordPress, AI Development, Graphic Designing, Digital Marketing, and Social Media Services.'
        },
        {
          question: 'Is Prineor open to partnerships and collaborative projects?',
          answer: 'Yes! We are actively open to partnerships, client projects, and collaborations with creators and businesses looking to grow their digital presence.'
        },
        {
          question: 'When was Prineor founded?',
          answer: 'Prineor was founded in 2026 with a clear focus on continuous learning, practical projects, and turning ideas into meaningful digital experiences.'
        },
        {
          question: 'How quickly will you respond to my message?',
          answer: 'We usually respond within 24 hours via email (prineorofficial@gmail.com) to discuss your project details, timeline, and next steps.'
        }
      ]);
      setToastMessage('Contact and FAQs reset to default.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Channels & FAQ</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Contact & FAQs Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure official email, phone status, studio location, availability badges, and Frequently Asked Questions.
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
            <span>Save Contact & FAQs</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Contact Form Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Email & Phone */}
        <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
          <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#D49E24]" />
            <span>Direct Communication</span>
          </h3>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Official Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="prineorofficial@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
            />
            <span className="text-[10px] text-[#94A3B8] mt-1 block">
              Default: prineorofficial@gmail.com
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Phone Number / Status
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone — Coming Soon"
              className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
            />
            <span className="text-[10px] text-[#94A3B8] mt-1 block">
              Default: "Phone — Coming Soon" (Do not invent numbers)
            </span>
          </div>
        </div>

        {/* Location & Availability */}
        <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
          <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D49E24]" />
            <span>Presence & Availability</span>
          </h3>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Studio Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Global / Digital"
              className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Availability Status Badge
            </label>
            <input
              type="text"
              value={form.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              placeholder="Open for Partnerships & Projects"
              className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
            />
          </div>
        </div>

      </div>

      {/* FAQs Management Section */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#D49E24]" />
            <div>
              <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
                Frequently Asked Questions (FAQ)
              </h3>
              <p className="text-xs text-[#64748B]">
                Manage the questions and answers shown on the Contact page.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddFaq}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-[#855B09] border border-amber-200/70 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D49E24]">
                  FAQ #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(index)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  placeholder="e.g. How does Prineor work with clients?"
                  className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white border border-slate-200/80 text-xs font-medium text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                  Answer
                </label>
                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  placeholder="Provide a clear and helpful explanation..."
                  className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white border border-slate-200/80 text-xs text-[#334155] focus:ring-2 focus:ring-[#D49E24]/50 resize-y"
                />
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="py-8 text-center border border-dashed border-slate-300 rounded-2xl">
              <p className="text-xs text-slate-500 mb-2">No FAQs added yet.</p>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xs font-bold text-[#D49E24] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sync preview card */}
      <div className="p-4 rounded-2xl glass-panel border border-white/90 shadow-2xs flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-[#D49E24] flex-shrink-0" />
        <span className="text-xs text-[#64748B]">
          Saving this form automatically updates the Contact page, FAQ accordion, Footer, Header direct links, and mailto triggers across the site.
        </span>
      </div>

    </div>
  );
};
