import React, { useState, useEffect } from 'react';
import { PersonalBrandConfig, MessageInquiryType, HiringPosition } from '../types';
import { useCMS } from '../context/CMSContext';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Handshake, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Lock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HiringApplicationModal } from './HiringApplicationModal';

interface ContactPageProps {
  brand?: PersonalBrandConfig;
  initialInquiryType?: MessageInquiryType;
  onOpenApply?: (positionTitle?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ 
  brand: propBrand, 
  initialInquiryType,
  onOpenApply: propOpenApply 
}) => {
  const { cmsData } = useCMS();
  const brand = propBrand || cmsData.brand;
  const contact = cmsData.contact || {
    email: brand.email || 'prineorofficial@gmail.com',
    phone: brand.phone || 'Phone — Coming Soon',
    location: brand.location || 'Global / Digital',
    availability: brand.availability || 'Open for Partnerships & Projects',
    faqs: []
  };
  const hiring = cmsData.hiring;

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: initialInquiryType || ('General Inquiry' as MessageInquiryType),
    subject: initialInquiryType === 'Partnership' ? 'Partnership with Prineor' : '',
    message: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Hiring Application Modal State (Local if no global handler)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  useEffect(() => {
    if (initialInquiryType) {
      setFormData(prev => ({
        ...prev,
        inquiryType: initialInquiryType,
        subject: initialInquiryType === 'Partnership' ? 'Partnership & Collaboration Inquiry' : prev.subject
      }));
    }
  }, [initialInquiryType]);

  const defaultFaqs = [
    {
      question: 'How does Prineor work with clients and partners?',
      answer: 'We work closely and transparently with you from idea to execution. We begin with a clear discussion of your goals, create a structured plan, build the solution with continuous updates, and ensure everything runs smoothly.'
    },
    {
      question: 'What core services does Prineor provide?',
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

  const rawFaqs = (contact.faqs && contact.faqs.length > 0) ? contact.faqs : defaultFaqs;
  const faqs = rawFaqs.map(f => ({
    question: f.question || f.q || 'Question',
    answer: f.answer || f.a || 'Answer details coming soon.'
  }));

  const handleOpenApply = (posTitle: string) => {
    if (propOpenApply) {
      propOpenApply(posTitle);
    } else {
      setSelectedPosition(posTitle);
      setIsApplyModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (honeypot.trim().length > 0) {
      return; // spam honeypot
    }

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please provide your Full Name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!formData.subject.trim()) {
      setErrorMessage('Please enter a subject for your message.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 4) {
      setErrorMessage('Please enter your message.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          inquiryType: formData.inquiryType,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          honeypot: honeypot.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setSuccessMessage(data.message || "Your message has been sent successfully. We'll get back to you soon.");
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#E6B942', '#D49E24', '#F5D372', '#0F172A']
        });
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get positions from hiring config
  const rawPositions = hiring.availablePositions || [];
  const normalizedPositions: HiringPosition[] = rawPositions.length > 0
    ? rawPositions
    : [
        {
          id: 'pos_1',
          title: 'New Developers',
          slug: 'new-developers',
          shortDescription: 'Motivated entry-level developers ready to learn modern tech stacks and grow with Prineor.',
          status: 'Open',
          order: 1
        },
        {
          id: 'pos_2',
          title: 'AI Developers',
          slug: 'ai-developers',
          shortDescription: 'Explorers interested in building practical AI solutions, GenAI workflows, and intelligent web applications.',
          status: 'Open',
          order: 2
        }
      ];

  const hasAnyOpen = hiring.isHiringOpen && normalizedPositions.some(p => p.status === 'Open');

  return (
    <div id="contact-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Get In Touch</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
          {contact.heading || "Let's Build Something Meaningful"}
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3">
          {contact.subheading || "We help businesses, creators, and brands turn ideas into powerful, modern websites, AI solutions, graphic design, and digital marketing."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Info & FAQ */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Contact Details Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-sm space-y-5">
            <h2 className="font-cinzel font-bold text-xl text-[#0F172A]">
              Connect With Prineor
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Whether you need a custom WordPress site, an AI solution, graphic design, digital marketing, or social media strategy, we are ready to collaborate.
            </p>

            <div className="space-y-3.5 pt-2">
              <a
                href={`mailto:${contact.email || brand.email || 'prineorofficial@gmail.com'}`}
                className="glass-pill p-3.5 rounded-2xl flex items-center gap-3 hover:bg-white hover:border-[#D49E24]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#A87915] border border-amber-200/60 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">Official Email</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#0F172A] group-hover:text-[#A87915] truncate block">
                    {contact.email || brand.email || 'prineorofficial@gmail.com'}
                  </span>
                </div>
              </a>

              <div className="glass-pill p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#A87915] border border-amber-200/60 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">Direct Line</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                    {contact.phone || (brand.phone ? brand.phone : 'Phone — Coming Soon')}
                  </span>
                </div>
              </div>

              <div className="glass-pill p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#A87915] border border-amber-200/60 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">Location</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                    {contact.location || brand.location || 'Global / Digital'}
                  </span>
                </div>
              </div>

              <div className="glass-pill p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200/60 flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">Availability</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                    {contact.availability || brand.availability || 'Open for Partnerships & Projects'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-sm">
            <h3 className="font-cinzel font-bold text-lg text-[#0F172A] mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="border-b border-slate-200/50 pb-3">
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-[#0F172A] hover:text-[#A87915] transition-colors cursor-pointer py-1.5 gap-2"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#D49E24] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed animate-in fade-in duration-200 pl-1 border-l-2 border-[#D49E24]/40">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Full Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-white/95 shadow-md relative overflow-hidden">
            
            <h2 className="font-cinzel font-bold text-2xl text-[#0F172A] mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mb-6">
              Tell us about your brand, project goals, timeline, or partnership inquiry. All messages are reviewed directly by our team.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="font-cinzel font-bold text-2xl text-[#0F172A]">
                  Message Received!
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                  {successMessage || `Thank you for reaching out, ${formData.name}. Your message has been sent successfully. We'll get back to you soon.`}
                </p>
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 max-w-md mx-auto text-xs text-amber-900 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D49E24]" />
                  <span>We'll reply directly to <strong>{formData.email}</strong>.</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        inquiryType: 'General Inquiry',
                        subject: '',
                        message: ''
                      });
                      setSuccessMessage('');
                    }}
                    className="px-6 py-2.5 rounded-full glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] border border-white/90 shadow-xs cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Honeypot anti-spam */}
                <input
                  type="text"
                  name="website_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Inquiry Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Inquiry Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'General Inquiry', label: 'General Inquiry' },
                      { id: 'Project Inquiry', label: 'Project Inquiry' },
                      { id: 'Partnership', label: 'Partnership' }
                    ].map(type => {
                      const isSelected = formData.inquiryType === type.id;
                      return (
                        <button
                          type="button"
                          key={type.id}
                          onClick={() => setFormData({ ...formData, inquiryType: type.id as MessageInquiryType })}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                            isSelected
                              ? 'bg-amber-50 border-[#D49E24] text-[#855B09] shadow-xs'
                              : 'bg-white/60 border-slate-200/70 text-[#475569] hover:bg-white'
                          }`}
                        >
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 placeholder:text-[#94A3B8] text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 placeholder:text-[#94A3B8] text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Phone & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 555 019 2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 placeholder:text-[#94A3B8] text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Website & Digital Strategy Project"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 placeholder:text-[#94A3B8] text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your project, idea, timeline, or how you want to partner with Prineor..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 placeholder:text-[#94A3B8] text-[#0F172A] resize-y"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:shadow-[0_8px_30px_rgba(212,158,36,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message →</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#94A3B8] pt-2">
                  <Handshake className="w-3.5 h-3.5 text-[#D49E24]" />
                  <span>We value honest communication and practical, long-term digital growth.</span>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>

      {/* HIRING SECTION (Luxury Glassmorphism Careers Section) */}
      <div id="careers-section" className="mt-14 max-w-4xl mx-auto rounded-3xl glass-panel-elevated p-8 sm:p-10 border border-white/90 shadow-md relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-gradient-to-tl from-[#FEF3C7]/50 to-[#E0E7FF]/30 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          
          {/* Header */}
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Careers & Growth</span>
            </div>
            
            <h2 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#0F172A]">
              {hiring.heading || 'Want To Join Our Team?'}
            </h2>
            
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-2xl">
              {hiring.description || 'Prineor is growing, and we are looking for motivated people who want to learn, build, and grow with us.'}
            </p>
          </div>

          {/* Hiring Status ON / OFF check */}
          {!hiring.isHiringOpen ? (
            <div className="p-6 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Hiring Closed</span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Prineor is not currently accepting applications. Check back soon for upcoming opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {normalizedPositions.map((pos) => {
                  const isOpen = pos.status === 'Open';
                  return (
                    <div 
                      key={pos.id} 
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isOpen 
                          ? 'glass-panel bg-white/70 border-white/95 shadow-xs hover:border-[#D49E24]/40 hover:bg-white' 
                          : 'bg-slate-100/60 border-slate-200/70 opacity-80'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#D49E24]" />
                            <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
                              {pos.title}
                            </h3>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isOpen 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-slate-200 text-slate-600 border border-slate-300'
                          }`}>
                            {isOpen ? 'Open Position' : 'Closed'}
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] leading-relaxed">
                          {pos.shortDescription || 'Join Prineor to build real-world digital solutions and grow daily.'}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                        {isOpen ? (
                          <button
                            type="button"
                            onClick={() => handleOpenApply(pos.title)}
                            className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Apply Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500 italic">
                            Applications Closed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explicit WordPress Developers Note */}
              <div className="p-4 rounded-2xl glass-panel border border-amber-200/70 bg-amber-50/40 text-xs text-[#855B09] flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#D49E24] flex-shrink-0" />
                <span>
                  <strong>Note:</strong> {hiring.notHiringNote || 'WordPress Developers — Not Currently Hiring'}
                </span>
              </div>

              {!hasAnyOpen && (
                <div className="text-center py-2 text-xs text-[#64748B]">
                  We are not currently hiring, but you can check back later.
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Local Modal Instance (if not triggered globally) */}
      <HiringApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        initialPosition={selectedPosition}
      />

    </div>
  );
};
