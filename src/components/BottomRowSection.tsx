import React, { useState } from 'react';
import { PageTab, BlogPost } from '../types';
import { ASSETS } from '../data/portfolioData';
import { useCMS } from '../context/CMSContext';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BottomRowSectionProps {
  setActiveTab: (tab: PageTab) => void;
  onSelectArticle: (article: BlogPost) => void;
}

export const BottomRowSection: React.FC<BottomRowSectionProps> = ({
  setActiveTab,
  onSelectArticle,
}) => {
  const { cmsData } = useCMS();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || "Let's Work Together Inquiry",
          message: formData.message.trim() || "Website visitor interested in collaborating with Prineor.",
          inquiryType: 'Project Inquiry'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSubmitted(true);
      
      // Trigger subtle celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E6B942', '#D49E24', '#F5D372', '#ffffff']
      });

      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rawBlogs: BlogPost[] = (cmsData.blog && cmsData.blog.length > 0) ? cmsData.blog : (cmsData.blogs || []);
  const publishedBlogs = rawBlogs.filter(b => b.isPublished !== false && b.status !== 'Draft');
  const topTwoArticles = publishedBlogs.slice(0, 2);
  const activeSocials = cmsData.socials.filter(s => s.isEnabled !== false);

  return (
    <section id="bottom-row-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Latest Blog (Span 5) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)]">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                  Latest Blog
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('blog')}
                className="text-xs font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D49E24]" />
              </button>
            </div>

            {/* 2 Article Cards Side-by-Side on Tablet, Stacked on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topTwoArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  className="glass-pill rounded-2xl p-3 flex flex-col justify-between cursor-pointer group hover:bg-white hover:border-[#D49E24]/50 transition-all shadow-xs"
                >
                  <div className="w-full aspect-[16/10] rounded-xl overflow-hidden glass-panel border border-white/70 relative mb-3">
                    <img
                      src={article.image}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[9px] font-semibold text-white">
                      {article.category}
                    </div>
                  </div>

                  <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#A87915] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-3 pt-2 border-t border-slate-200/50">
                    <span>{article.date}</span>
                    <span>• {article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/50">
            <button
              onClick={() => setActiveTab('blog')}
              className="w-full py-2 text-xs font-semibold text-center text-[#855B09] hover:text-[#0F172A] transition-colors"
            >
              Explore {publishedBlogs.length}+ Technical & Strategy Essays →
            </button>
          </div>
        </div>

        {/* Card 2: My Links (Span 3) */}
        <div className="lg:col-span-3 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)] relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                  My Links
                </h3>
              </div>
            </div>

            {/* List of Link Pills */}
            <div className="space-y-2 relative z-10">
              {activeSocials.slice(0, 4).map((link, idx) => (
                <a
                  key={link.id || idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-pill px-3 py-2 rounded-xl flex items-center justify-between text-xs hover:bg-white hover:border-[#D49E24]/50 hover:translate-x-1 transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[#475569] group-hover:text-[#D49E24] text-[10px] font-bold">
                      {link.platform.charAt(0)}
                    </span>
                    <span className="font-medium text-[#1E293B] truncate text-[11px]">
                      {link.handle}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#94A3B8] group-hover:text-[#D49E24] flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* 3D Crystal Gem Prism Art in Bottom Corner */}
          <div className="relative mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('links')}
              className="text-xs font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1 transition-colors cursor-pointer group"
            >
              <span>View All Links</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D49E24] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Crystal Gem Asset */}
            <div className="w-14 h-14 -mr-2">
              <img
                src={ASSETS.crystalPrism}
                alt="Diamond Gem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Let's Work Together (Span 4) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)] relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                  Let's Work Together
                </h3>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {errorMessage && (
                <div className="p-2 rounded-xl bg-red-50 text-red-700 text-[11px] border border-red-200 text-center animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/60 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] placeholder:text-[#94A3B8] text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/60 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] placeholder:text-[#94A3B8] text-[#0F172A]"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/60 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] placeholder:text-[#94A3B8] text-[#0F172A]"
                />
              </div>

              <div>
                <textarea
                  placeholder="Your Message"
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-pill bg-white/60 border border-white/90 focus:outline-none focus:ring-1 focus:ring-[#D49E24] placeholder:text-[#94A3B8] text-[#0F172A] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || submitted}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
              >
                {submitted ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0F172A]" />
                    <span>Message Sent!</span>
                  </>
                ) : loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-3 text-[10px] text-center text-[#94A3B8]">
            Direct email response guaranteed within 24 hours.
          </div>
        </div>

      </div>
    </section>
  );
};
