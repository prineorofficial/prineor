import React, { useState, useEffect } from 'react';
import { BlogPost, PageTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  Share2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Copy, 
  Check, 
  Twitter, 
  Linkedin, 
  Facebook, 
  BookOpen, 
  User, 
  MessageSquare,
  HeartHandshake
} from 'lucide-react';
import { ASSETS } from '../data/portfolioData';

interface ArticleModalProps {
  article: BlogPost | null;
  onClose: () => void;
  onSelectArticle?: (article: BlogPost) => void;
  setActiveTab?: (tab: PageTab) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ 
  article, 
  onClose, 
  onSelectArticle, 
  setActiveTab 
}) => {
  const { cmsData } = useCMS();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // All published articles for navigation and related posts
  const rawPosts: BlogPost[] = (cmsData.blog && cmsData.blog.length > 0) ? cmsData.blog : (cmsData.blogs || []);
  const publishedArticles = rawPosts.filter(b => b.isPublished !== false && b.status !== 'Draft');

  // Handle URL history state & Escape key
  useEffect(() => {
    if (article) {
      const slug = article.slug || article.id;
      window.history.pushState({ modal: 'blog', slug }, '', `/blog/${slug}`);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [article, onClose]);

  // Handle modal scroll progress indicator
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalScroll = target.scrollHeight - target.clientHeight;
    if (totalScroll > 0) {
      const currentProgress = (target.scrollTop / totalScroll) * 100;
      setScrollProgress(currentProgress);
    }
  };

  if (!article) return null;

  // Find index for Previous / Next navigation
  const currentIndex = publishedArticles.findIndex(a => a.id === article.id || a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? publishedArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < publishedArticles.length - 1 ? publishedArticles[currentIndex + 1] : null;

  // Find Related Articles (same category, excluding current)
  const relatedArticles = publishedArticles
    .filter(a => a.id !== article.id && (a.category === article.category || !article.category))
    .slice(0, 2);

  // Fallback to any other articles if none in same category
  const fallbackRelated = relatedArticles.length > 0 
    ? relatedArticles 
    : publishedArticles.filter(a => a.id !== article.id).slice(0, 2);

  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${article.title}" — Insights by Prineor`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(articleUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: articleUrl,
        });
      } catch (e) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSwitchArticle = (target: BlogPost) => {
    if (onSelectArticle) {
      onSelectArticle(target);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        onScroll={handleScroll}
        className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl sm:rounded-4xl glass-panel-elevated p-6 sm:p-10 md:p-12 border border-white/95 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Reading Progress Bar */}
        <div className="sticky top-0 -mt-6 -mx-6 sm:-mt-10 sm:-mx-10 md:-mt-12 md:-mx-12 z-30 h-1.5 bg-slate-200/50">
          <div 
            className="h-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div>
          {/* Top Bar: Breadcrumbs & Close Action */}
          <div className="flex items-center justify-between gap-4 mb-8 pt-4">
            <div className="flex items-center gap-2 text-xs text-[#64748B] overflow-hidden truncate">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 font-semibold text-[#855B09] hover:underline cursor-pointer flex-shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Journal</span>
              </button>
              <span>/</span>
              <span className="font-semibold text-slate-700 truncate">{article.category}</span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:scale-105 transition-all cursor-pointer shadow-xs flex-shrink-0"
              title="Close article (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Badge & Article Heading */}
          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill border border-[#D49E24]/30 text-xs font-bold text-[#855B09] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
              <span>{article.category}</span>
            </div>

            <h1 className="font-cinzel font-black text-2xl sm:text-4xl md:text-5xl text-[#0F172A] leading-tight tracking-tight">
              {article.title}
            </h1>

            {/* Author, Date, Reading Time Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-2 border-b border-slate-200/60 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D49E24] to-[#F5D372] p-0.5 shadow-2xs">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[11px] font-black text-[#855B09]">
                    P
                  </div>
                </div>
                <div>
                  <span className="font-bold text-[#0F172A] block leading-none">
                    {article.author || 'Prineor Founders'}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    {article.authorRole || 'Web & AI Builders'}
                  </span>
                </div>
              </div>

              <span className="text-slate-300">•</span>

              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#A87915]" />
                <span>Published {article.date}</span>
              </span>

              <span className="text-slate-300">•</span>

              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A87915]" />
                <span>{article.readTime}</span>
              </span>
            </div>
          </div>

          {/* Large Featured Cover Image */}
          <div className="w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-white/95 shadow-md relative mb-10">
            <img
              src={article.image || ASSETS.deskWorkspace}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Excerpt Callout */}
          {article.excerpt && (
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border-l-4 border-[#D49E24] text-xs sm:text-sm text-[#475569] font-medium leading-relaxed mb-8 shadow-xs">
              {article.excerpt}
            </div>
          )}

          {/* Article Markdown Body Content */}
          <div className="prose prose-slate max-w-none text-[#334155] leading-relaxed text-sm sm:text-base space-y-4 pt-2">
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-cinzel font-black text-xl sm:text-2xl text-[#0F172A] mt-8 mb-3 border-b border-slate-200/50 pb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="font-heading font-bold text-base sm:text-lg text-[#0F172A] mt-6 mb-2 text-[#855B09]">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="border-l-4 border-[#D49E24] pl-4 py-2 text-sm text-[#475569] italic bg-white/70 rounded-r-xl my-4 shadow-2xs">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                const items = paragraph.split('\n').filter(Boolean);
                return (
                  <ul key={idx} className="list-disc pl-6 text-sm text-[#475569] space-y-1.5 my-3">
                    {items.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item.replace(/^[-*]\s+/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s+/.test(paragraph)) {
                const items = paragraph.split('\n').filter(Boolean);
                return (
                  <ol key={idx} className="list-decimal pl-6 text-sm text-[#475569] space-y-1.5 my-3">
                    {items.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item.replace(/^\d+\.\s+/, '')}
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-[#475569] leading-relaxed text-sm sm:text-base">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tag Chips & Social Sharing */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#A87915]" />
                Tags:
              </span>
              {article.tags.map((tag, idx) => (
                <span key={idx} className="glass-pill px-3 py-1 text-xs font-semibold text-[#855B09] rounded-full border border-amber-200/60 shadow-2xs">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#64748B] font-semibold mr-1">Share:</span>
              
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 border border-slate-200 shadow-2xs transition-all cursor-pointer"
                title="Copy article link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#A87915]" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="w-8 h-8 rounded-xl glass-panel hover:bg-white flex items-center justify-center text-[#1DA1F2] border border-slate-200 shadow-2xs transition-all cursor-pointer"
                title="Share on X / Twitter"
              >
                <Twitter className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="w-8 h-8 rounded-xl glass-panel hover:bg-white flex items-center justify-center text-[#0A66C2] border border-slate-200 shadow-2xs transition-all cursor-pointer"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={handleShareFacebook}
                className="w-8 h-8 rounded-xl glass-panel hover:bg-white flex items-center justify-center text-[#1877F2] border border-slate-200 shadow-2xs transition-all cursor-pointer"
                title="Share on Facebook"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Previous & Next Post Navigation */}
          {(prevArticle || nextArticle) && (
            <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <div
                  onClick={() => handleSwitchArticle(prevArticle)}
                  className="p-4 rounded-2xl glass-panel glass-card-hover border border-white/90 cursor-pointer group flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1 mb-1">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Previous Essay
                  </span>
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#A87915] line-clamp-1">
                    {prevArticle.title}
                  </span>
                </div>
              ) : <div />}

              {nextArticle && (
                <div
                  onClick={() => handleSwitchArticle(nextArticle)}
                  className="p-4 rounded-2xl glass-panel glass-card-hover border border-white/90 cursor-pointer group flex flex-col justify-between text-right sm:items-end"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1 mb-1 justify-end">
                    Next Essay
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#A87915] line-clamp-1">
                    {nextArticle.title}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Related Articles Section */}
          {fallbackRelated.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
                  Related Insights
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fallbackRelated.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => handleSwitchArticle(rel)}
                    className="p-4 rounded-2xl glass-panel glass-card-hover border border-white/90 shadow-2xs flex items-center gap-4 cursor-pointer group"
                  >
                    <img
                      src={rel.image || ASSETS.deskWorkspace}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200/60 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold uppercase text-[#855B09] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/40 inline-block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="font-cinzel font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#A87915] truncate">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">
                        {rel.date} • {rel.readTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Interactive CTA Banner */}
          <div className="mt-12 rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-white/95 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#855B09] block mb-1">
                Have a Project or Digital Idea?
              </span>
              <h4 className="font-cinzel font-bold text-base sm:text-lg text-[#0F172A]">
                Let's Build Something Meaningful Together
              </h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-md">
                Custom websites, AI development, graphic designing, and digital marketing strategies.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {setActiveTab && (
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('contact');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-all cursor-pointer"
                >
                  Contact Prineor
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
