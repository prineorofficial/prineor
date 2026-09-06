import React, { useState, useMemo } from 'react';
import { BlogPost, PageTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Star, 
  Tag, 
  BookOpen, 
  X,
  User,
  TrendingUp,
  Share2
} from 'lucide-react';
import { ASSETS } from '../data/portfolioData';

interface BlogPageProps {
  onSelectArticle: (article: BlogPost) => void;
  setActiveTab?: (tab: PageTab) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectArticle, setActiveTab }) => {
  const { cmsData } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback to cmsData.blog or cmsData.blogs
  const rawPosts: BlogPost[] = (cmsData.blog && cmsData.blog.length > 0) ? cmsData.blog : (cmsData.blogs || []);
  
  // Filter out unpublished drafts for public website
  const publishedBlogs = useMemo(() => {
    return rawPosts.filter(b => b.isPublished !== false && b.status !== 'Draft');
  }, [rawPosts]);

  // Featured post (either flagged isFeatured, or first available)
  const featuredArticle = useMemo(() => {
    const explicitlyFeatured = publishedBlogs.find(b => b.isFeatured || b.featured);
    return explicitlyFeatured || publishedBlogs[0] || null;
  }, [publishedBlogs]);

  // Dynamic category list from published posts + core Prineor categories
  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    publishedBlogs.forEach(b => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [publishedBlogs]);

  // Filtered posts for the grid (excluding featured if search is empty, or including all if filtered)
  const filteredPosts = useMemo(() => {
    return publishedBlogs.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        (post.category && post.category.toLowerCase().includes(q)) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [publishedBlogs, selectedCategory, searchQuery]);

  return (
    <div id="blog-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Prineor Knowledge & Journal</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide leading-tight">
          Essays on Digital Craftsmanship, Web & AI
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3 leading-relaxed">
          Practical strategies, WordPress architectures, AI experiments, and journey notes written by the creators behind Prineor.
        </p>
      </div>

      {/* Featured Article Hero (When no search query is active and a featured post exists) */}
      {!searchQuery && selectedCategory === 'All' && featuredArticle && (
        <div 
          onClick={() => onSelectArticle(featuredArticle)}
          className="mb-10 sm:mb-14 rounded-3xl sm:rounded-4xl glass-panel glass-card-hover p-6 sm:p-10 border border-white/95 shadow-md group cursor-pointer relative overflow-hidden transition-all"
        >
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Cover Photo */}
            <div className="lg:col-span-6 w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-white/90 shadow-sm relative">
              <img
                src={featuredArticle.image || ASSETS.deskWorkspace}
                alt={featuredArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#855B09] border border-white shadow-2xs flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#D49E24] fill-[#D49E24]" />
                <span>Featured Insight</span>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#855B09] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
                  {featuredArticle.category}
                </span>
                <span className="text-xs text-[#64748B] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#A87915]" />
                  {featuredArticle.date}
                </span>
                <span className="text-xs text-[#64748B] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#A87915]" />
                  {featuredArticle.readTime}
                </span>
              </div>

              <h2 className="font-cinzel font-black text-2xl sm:text-3xl text-[#0F172A] group-hover:text-[#A87915] transition-colors leading-tight">
                {featuredArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-3">
                {featuredArticle.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {featuredArticle.tags.map((t, idx) => (
                  <span key={idx} className="glass-pill px-2.5 py-1 text-[10px] text-[#64748B] rounded-full border border-slate-200/60">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-3 flex items-center gap-2 font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#855B09] transition-colors">
                <span>Read Full Essay</span>
                <ArrowRight className="w-4 h-4 text-[#D49E24] transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 mb-8 border border-white/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] shadow-xs'
                    : 'glass-pill text-[#64748B] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, tools, AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-full glass-pill bg-white/80 border border-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 placeholder:text-[#94A3B8] text-[#0F172A] shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-white/90 text-slate-500 max-w-md mx-auto my-8">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">No Articles Found</h3>
          <p className="text-xs text-[#64748B] mt-1">
            No essays match "{searchQuery || selectedCategory}". Try selecting another category or clearing your search.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-xl glass-panel text-xs font-bold text-[#855B09] border border-amber-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectArticle(post)}
              className="glass-panel glass-card-hover rounded-3xl p-6 flex flex-col justify-between cursor-pointer group border border-white/90 shadow-sm transition-all"
            >
              <div>
                {/* Image Cover */}
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-white/80 relative mb-4 shadow-2xs">
                  <img
                    src={post.image || ASSETS.deskWorkspace}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#855B09] border border-white shadow-2xs">
                    {post.category}
                  </div>
                  {(post.isFeatured || post.featured) && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400/90 text-[#0F172A] flex items-center justify-center shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-[#64748B] mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#A87915]" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A87915]" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-cinzel font-bold text-lg text-[#0F172A] group-hover:text-[#A87915] transition-colors leading-snug">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-[#475569] mt-2 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                  {post.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="glass-pill px-2 py-0.5 rounded-md">#{t}</span>
                  ))}
                </div>

                <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#A87915] flex items-center gap-1 transition-colors">
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D49E24] transform group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Bottom Newsletter & Collaboration CTA */}
      <div className="mt-16 rounded-3xl glass-panel-elevated p-8 sm:p-10 border border-white/95 shadow-md text-center max-w-3xl mx-auto relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 text-xs font-bold text-[#855B09] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span>Have an Idea or Topic?</span>
        </div>
        <h3 className="font-cinzel font-black text-2xl sm:text-3xl text-[#0F172A]">
          Collaborate or Suggest an Article
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-xl mx-auto leading-relaxed">
          We welcome guest inquiries, technical collaborations, and project discussions. Reach out to share what you're building.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <a
            href="mailto:prineorofficial@gmail.com"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-all"
          >
            Email Prineor Founders
          </a>
        </div>
      </div>

    </div>
  );
};
