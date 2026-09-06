import React, { useState, useMemo } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { BlogPost } from '../../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  Eye, 
  EyeOff, 
  Upload, 
  Edit3, 
  Copy, 
  Search, 
  Calendar, 
  Clock, 
  Tag, 
  Star, 
  Globe, 
  Check, 
  X, 
  ArrowRight, 
  Image as ImageIcon,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  HelpCircle,
  Share2,
  AlertCircle
} from 'lucide-react';
import { ASSETS } from '../../../data/portfolioData';
import { ArticleModal } from '../../ArticleModal';

export const BlogSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [articles, setArticles] = useState<BlogPost[]>([...cmsData.blog]);
  
  // Editor State
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editorTab, setEditorTab] = useState<'content' | 'seo' | 'preview'>('content');
  const [tagInput, setTagInput] = useState('');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Featured'>('All');

  // Previewing post in full modal
  const [previewArticle, setPreviewArticle] = useState<BlogPost | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = [
    'Web Development',
    'WordPress',
    'AI',
    'Graphic Design',
    'Digital Marketing',
    'Social Media',
    'Learning',
    'Prineor Journey',
    'Marketing',
    'Business',
    'Personal Journey',
    'UI/UX'
  ];

  // Helper to generate clean slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helper to estimate read time
  const calculateReadTime = (content: string) => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    return `${minutes} min read`;
  };

  // Metrics
  const totalCount = articles.length;
  const publishedCount = articles.filter(a => a.isPublished !== false && a.status !== 'Draft').length;
  const draftCount = totalCount - publishedCount;
  const featuredCount = articles.filter(a => a.isFeatured || a.featured).length;

  // Filtered list
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategoryFilter === 'All' || art.category === selectedCategoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'Published') {
        matchesStatus = art.isPublished !== false && art.status !== 'Draft';
      } else if (statusFilter === 'Draft') {
        matchesStatus = art.isPublished === false || art.status === 'Draft';
      } else if (statusFilter === 'Featured') {
        matchesStatus = Boolean(art.isFeatured || art.featured);
      }

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [articles, searchQuery, selectedCategoryFilter, statusFilter]);

  // Open Editor for new post
  const handleCreateNew = () => {
    const newId = `blog_${Date.now()}`;
    const newPost: BlogPost = {
      id: newId,
      slug: 'new-prineor-insight',
      title: 'New Digital Insight / Strategy Guide',
      excerpt: 'A practical, actionable exploration of modern digital craftsmanship, AI, or web tools.',
      content: `### Introduction\n\nPrineor is dedicated to building practical digital solutions. In this article, we break down actionable insights and lessons learned.\n\n#### Key Learnings & Strategy\n- **Focus on Clarity:** Strip away unnecessary complexity.\n- **Practical Utility:** Build tools and websites that solve real problems.\n\n#### Moving Forward\nWe continue to learn, experiment, and refine our craft every single day.`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      readTime: '3 min read',
      category: 'Web Development',
      image: ASSETS.deskWorkspace,
      author: 'Prineor Founders',
      authorRole: 'Web & AI Builders',
      tags: ['Development', 'AI', 'Growth'],
      isPublished: true,
      status: 'Published',
      isFeatured: false,
      seoTitle: '',
      seoDescription: ''
    };
    setEditingPost(newPost);
    setEditorTab('content');
    setIsEditingModalOpen(true);
  };

  // Open Editor for existing post
  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setEditorTab('content');
    setIsEditingModalOpen(true);
  };

  // Duplicate a post
  const handleDuplicate = (post: BlogPost) => {
    const newId = `blog_${Date.now()}`;
    const duplicated: BlogPost = {
      ...post,
      id: newId,
      slug: `${post.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${post.title} (Copy)`,
      status: 'Draft',
      isPublished: false,
      isFeatured: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    const updated = [duplicated, ...articles];
    setArticles(updated);
    updateSection('blog', updated);
    updateSection('blogs', updated);
    setToastMessage(`Duplicated "${post.title}" as Draft.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Toggle Publish Status
  const handleTogglePublish = (id: string) => {
    const updated = articles.map(art => {
      if (art.id === id) {
        const isCurrentlyPub = art.isPublished !== false && art.status !== 'Draft';
        return {
          ...art,
          isPublished: !isCurrentlyPub,
          status: (!isCurrentlyPub ? 'Published' : 'Draft') as 'Published' | 'Draft'
        };
      }
      return art;
    });
    setArticles(updated);
    updateSection('blog', updated);
    updateSection('blogs', updated);
    setToastMessage('Publish status updated live.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Toggle Featured Status
  const handleToggleFeatured = (id: string) => {
    const updated = articles.map(art => {
      if (art.id === id) {
        const isCurrentlyFeatured = Boolean(art.isFeatured || art.featured);
        return {
          ...art,
          isFeatured: !isCurrentlyFeatured,
          featured: !isCurrentlyFeatured
        };
      }
      return art;
    });
    setArticles(updated);
    updateSection('blog', updated);
    updateSection('blogs', updated);
    setToastMessage('Featured status updated.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Delete Post
  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    const target = articles.find(a => a.id === deleteConfirmId);
    const updated = articles.filter(a => a.id !== deleteConfirmId);
    setArticles(updated);
    updateSection('blog', updated);
    updateSection('blogs', updated);
    setDeleteConfirmId(null);
    setToastMessage(`Deleted "${target?.title || 'Article'}" successfully.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Image Upload handler for Editor
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingPost) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setEditingPost({ ...editingPost, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Modal Editor Form
  const handleSaveModalPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (!editingPost.title.trim()) {
      alert('Please provide a title for the blog post.');
      return;
    }

    const calculatedTime = calculateReadTime(editingPost.content);
    const finalizedPost: BlogPost = {
      ...editingPost,
      readTime: editingPost.readTime || calculatedTime,
      isPublished: editingPost.status === 'Published',
      updatedAt: new Date().toISOString()
    };

    let updated: BlogPost[];
    const exists = articles.some(a => a.id === finalizedPost.id);
    if (exists) {
      updated = articles.map(a => a.id === finalizedPost.id ? finalizedPost : a);
    } else {
      updated = [finalizedPost, ...articles];
    }

    setArticles(updated);
    updateSection('blog', updated);
    updateSection('blogs', updated);
    setIsEditingModalOpen(false);
    setEditingPost(null);
    setToastMessage(`Blog article "${finalizedPost.title}" saved successfully!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Text insertion toolbar helper for markdown
  const handleInsertMarkdown = (prefix: string, suffix: string = '') => {
    if (!editingPost) return;
    const textarea = document.getElementById('blog-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editingPost.content;
    const selected = text.substring(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setEditingPost({
      ...editingPost,
      content: newContent,
      readTime: calculateReadTime(newContent)
    });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Add Tag chip
  const handleAddTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();

    if (!tagInput.trim() || !editingPost) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!editingPost.tags.includes(cleanTag)) {
      setEditingPost({
        ...editingPost,
        tags: [...editingPost.tags, cleanTag]
      });
    }
    setTagInput('');
  };

  // Remove Tag chip
  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      tags: editingPost.tags.filter(t => t !== tagToRemove)
    });
  };

  // Save all to server manually
  const handleSaveAll = () => {
    updateSection('blog', articles);
    updateSection('blogs', articles);
    setToastMessage('All blog articles synchronized with server and local storage.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Reset all blog articles to original Prineor defaults?')) {
      resetSection('blog');
      resetSection('blogs');
      setArticles([...cmsData.blog]);
      setToastMessage('Blog articles restored to default portfolio essays.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Prineor Journal Studio</span>
          </div>
          <h1 className="font-cinzel font-black text-2xl sm:text-3xl text-[#0F172A]">
            Blog & Articles Management
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Write, edit, organize, and publish technical guides, WordPress insights, AI breakdowns, and Prineor journey essays.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default Prineor essays"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white text-xs font-bold text-[#0F172A] border border-white/95 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>Save Live</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-[0_4px_20px_rgba(212,158,36,0.3)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter('All')}
          className={`p-4 rounded-2xl glass-panel border ${statusFilter === 'All' ? 'border-[#D49E24] bg-amber-50/40' : 'border-white/90'} shadow-xs cursor-pointer transition-all`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Total Articles</span>
            <FileText className="w-4 h-4 text-[#D49E24]" />
          </div>
          <div className="font-cinzel font-bold text-2xl text-[#0F172A] mt-1">{totalCount}</div>
          <span className="text-[10px] text-[#94A3B8]">All essays & drafts</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Published')}
          className={`p-4 rounded-2xl glass-panel border ${statusFilter === 'Published' ? 'border-emerald-500 bg-emerald-50/40' : 'border-white/90'} shadow-xs cursor-pointer transition-all`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Published Live</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-cinzel font-bold text-2xl text-emerald-800 mt-1">{publishedCount}</div>
          <span className="text-[10px] text-emerald-600">Visible on public site</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Draft')}
          className={`p-4 rounded-2xl glass-panel border ${statusFilter === 'Draft' ? 'border-slate-400 bg-slate-100/60' : 'border-white/90'} shadow-xs cursor-pointer transition-all`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Drafts</span>
            <EyeOff className="w-4 h-4 text-slate-500" />
          </div>
          <div className="font-cinzel font-bold text-2xl text-[#0F172A] mt-1">{draftCount}</div>
          <span className="text-[10px] text-[#94A3B8]">Unpublished work</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Featured')}
          className={`p-4 rounded-2xl glass-panel border ${statusFilter === 'Featured' ? 'border-amber-400 bg-amber-50/60' : 'border-white/90'} shadow-xs cursor-pointer transition-all`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#855B09]">Featured Posts</span>
            <Star className="w-4 h-4 text-[#D49E24] fill-[#D49E24]" />
          </div>
          <div className="font-cinzel font-bold text-2xl text-[#855B09] mt-1">{featuredCount}</div>
          <span className="text-[10px] text-[#A87915]">Highlighted on home & blog</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl glass-panel border border-white/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, tag, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl glass-pill bg-white/80 border border-white/90 focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
          />
        </div>

        {/* Category & Status Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D49E24]"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D49E24]"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
            <option value="Featured">Featured Only</option>
          </select>
        </div>
      </div>

      {/* Articles List / Grid */}
      <div className="space-y-3.5">
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/90 text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h3 className="font-cinzel font-bold text-base text-[#0F172A]">No Articles Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or create a new blog post.</p>
          </div>
        ) : (
          filteredArticles.map((art) => {
            const isPub = art.isPublished !== false && art.status !== 'Draft';
            const isFeat = Boolean(art.isFeatured || art.featured);

            return (
              <div
                key={art.id}
                className={`rounded-3xl glass-panel p-5 sm:p-6 border transition-all ${
                  isPub ? 'border-white/95 shadow-sm hover:border-[#D49E24]/40' : 'border-slate-200/60 bg-slate-50/60 opacity-85'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Image, Badges & Title */}
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden glass-panel border border-white/90 flex-shrink-0 relative shadow-2xs">
                      <img
                        src={art.image || ASSETS.deskWorkspace}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isFeat && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-400/90 text-[#0F172A] flex items-center justify-center shadow-xs">
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#855B09] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                          {art.category}
                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isPub ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isPub ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {isPub ? 'Published' : 'Draft'}
                        </span>

                        <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#A87915]" />
                          {art.date}
                        </span>

                        <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#A87915]" />
                          {art.readTime || calculateReadTime(art.content)}
                        </span>
                      </div>

                      <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#0F172A] truncate">
                        {art.title}
                      </h3>

                      <p className="text-xs text-[#64748B] line-clamp-1 leading-relaxed">
                        {art.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono text-slate-400 truncate">
                          slug: /blog/{art.slug}
                        </span>
                        {art.tags.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[9px] font-medium text-slate-500 bg-white/80 px-1.5 py-0.5 rounded-md border border-slate-200/60">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-end lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                    {/* Toggle Featured */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(art.id)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isFeat 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-white/80 text-slate-400 border-slate-200 hover:text-amber-600'
                      }`}
                      title={isFeat ? 'Featured on homepage' : 'Mark as featured'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFeat ? 'fill-current' : ''}`} />
                    </button>

                    {/* Toggle Publish */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(art.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isPub 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isPub ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{isPub ? 'Published' : 'Draft'}</span>
                    </button>

                    {/* Live Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewArticle(art)}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      title="Preview public modal"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#D49E24]" />
                      <span>Preview</span>
                    </button>

                    {/* Duplicate Button */}
                    <button
                      type="button"
                      onClick={() => handleDuplicate(art)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0F172A] transition-all cursor-pointer shadow-2xs"
                      title="Duplicate article"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleEdit(art)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-bold text-xs shadow-xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Post</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(art.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULL POST EDITOR MODAL */}
      {/* ========================================================================= */}
      {isEditingModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-white/95 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#855B09]">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                    {editingPost.id.startsWith('blog_') && !articles.some(a => a.id === editingPost.id) ? 'Create New Article' : 'Edit Blog Post'}
                  </h2>
                  <p className="text-[11px] text-[#64748B]">
                    Slug: /blog/{editingPost.slug} • {editingPost.readTime || calculateReadTime(editingPost.content)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-slate-500 hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub Tabs: Content vs SEO vs Live Render */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200/60 pb-3">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  editorTab === 'content'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'glass-pill text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Article Content & Details
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('seo')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  editorTab === 'seo'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'glass-pill text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                SEO & Social Meta
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  editorTab === 'preview'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'glass-pill text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
                <span>Live Markdown Preview</span>
              </button>
            </div>

            <form onSubmit={handleSaveModalPost} className="space-y-5 flex-1">
              
              {editorTab === 'content' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                        Article Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPost.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingPost({
                            ...editingPost,
                            title: val,
                            // Auto-update slug if not manually customized
                            slug: editingPost.slug === generateSlug(editingPost.title) ? generateSlug(val) : editingPost.slug
                          });
                        }}
                        placeholder="e.g. How We Build AI-Powered Websites in 2026"
                        className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white border border-white/95 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 shadow-inner"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                        URL Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: generateSlug(e.target.value) })}
                        placeholder="how-we-build-ai-websites"
                        className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white border border-white/95 text-xs font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Category, Author, Publish Date, Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                        Category
                      </label>
                      <select
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={editingPost.author || 'Prineor Founders'}
                        onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                        className="w-full px-3 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                        Publish Date
                      </label>
                      <input
                        type="text"
                        value={editingPost.date}
                        onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                        placeholder="Aug 2026"
                        className="w-full px-3 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                        Status & Visibility
                      </label>
                      <select
                        value={editingPost.status || (editingPost.isPublished !== false ? 'Published' : 'Draft')}
                        onChange={(e) => setEditingPost({ 
                          ...editingPost, 
                          status: e.target.value as 'Published' | 'Draft',
                          isPublished: e.target.value === 'Published'
                        })}
                        className="w-full px-3 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
                      >
                        <option value="Published">Published (Live)</option>
                        <option value="Draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Toggle Checkbox */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                    <input
                      type="checkbox"
                      id="isFeaturedToggle"
                      checked={Boolean(editingPost.isFeatured || editingPost.featured)}
                      onChange={(e) => setEditingPost({ 
                        ...editingPost, 
                        isFeatured: e.target.checked,
                        featured: e.target.checked 
                      })}
                      className="w-4 h-4 text-[#D49E24] rounded-sm focus:ring-[#D49E24] cursor-pointer"
                    />
                    <label htmlFor="isFeaturedToggle" className="text-xs font-bold text-[#855B09] cursor-pointer flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-[#D49E24] fill-[#D49E24]" />
                      <span>Feature this article on Homepage & Blog Banner</span>
                    </label>
                  </div>

                  {/* Cover Image URL & File Upload */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Cover Image
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-8 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingPost.image}
                          onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                          placeholder="https://images.unsplash.com/... or data:image/..."
                          className="w-full px-3.5 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 shadow-inner"
                        />
                        <label className="px-3.5 py-2 rounded-2xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 border border-slate-200 cursor-pointer flex-shrink-0 shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-[#D49E24]" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="sm:col-span-4 flex items-center gap-2">
                        <div className="w-16 h-10 rounded-xl overflow-hidden glass-panel border border-slate-200 flex-shrink-0 shadow-2xs">
                          <img
                            src={editingPost.image || ASSETS.deskWorkspace}
                            alt="Cover Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">Live Cover Thumbnail</span>
                      </div>
                    </div>
                  </div>

                  {/* Excerpt / Summary */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Short Excerpt / Teaser
                    </label>
                    <textarea
                      rows={2}
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      placeholder="Concise 1-2 sentence preview that appears on article cards..."
                      className="w-full px-3.5 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 resize-none shadow-inner leading-relaxed"
                    />
                  </div>

                  {/* Markdown Content Editor with Toolbar */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                        Full Article Body (Markdown Supported)
                      </label>
                      
                      {/* Markdown Toolbar */}
                      <div className="flex flex-wrap items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('### ')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                          title="H2 Heading"
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('#### ')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                          title="H3 Subheading"
                        >
                          <Heading3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('**', '**')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('*', '*')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('- ')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                          title="Bullet List"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('1. ')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                          title="Numbered List"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('> ')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                          title="Blockquote"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertMarkdown('`', '`')}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer"
                          title="Code"
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      id="blog-content-textarea"
                      rows={10}
                      value={editingPost.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingPost({
                          ...editingPost,
                          content: val,
                          readTime: calculateReadTime(val)
                        });
                      }}
                      className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 leading-relaxed shadow-inner"
                      placeholder="Write your article in markdown..."
                    />
                  </div>

                  {/* Tags Input */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Article Tags
                    </label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {editingPost.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-[#855B09] border border-amber-200 flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Add tag and press Enter (e.g. AI, WordPress, Design)"
                        className="w-full px-3.5 py-2 rounded-2xl glass-pill bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag()}
                        className="px-4 py-2 rounded-2xl glass-panel hover:bg-white text-xs font-bold text-[#0F172A] border border-slate-200 flex-shrink-0 cursor-pointer shadow-2xs"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {editorTab === 'seo' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 text-xs text-indigo-900 leading-relaxed">
                    <span className="font-bold flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Search Engine & Social Optimization
                    </span>
                    Configure custom metadata for Google Search results and social media cards (Twitter, LinkedIn, Facebook).
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1">
                      Custom SEO Title
                    </label>
                    <input
                      type="text"
                      value={editingPost.seoTitle || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, seoTitle: e.target.value })}
                      placeholder={editingPost.title || 'PRINEOR — Insights'}
                      className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 shadow-inner"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                        Meta Description
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {(editingPost.seoDescription || editingPost.excerpt || '').length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={editingPost.seoDescription || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, seoDescription: e.target.value })}
                      placeholder={editingPost.excerpt || 'Write a search engine friendly summary...'}
                      className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 shadow-inner leading-relaxed resize-none"
                    />
                  </div>

                  {/* Google Search Snippet Preview */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-inner space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Google Search Preview</span>
                    <span className="text-xs text-[#1a0dab] font-medium block truncate">
                      {editingPost.seoTitle || editingPost.title} | PRINEOR
                    </span>
                    <span className="text-[11px] text-[#006621] block truncate">
                      https://prineor.com/blog/{editingPost.slug}
                    </span>
                    <p className="text-xs text-[#545454] line-clamp-2 leading-relaxed">
                      {editingPost.seoDescription || editingPost.excerpt}
                    </p>
                  </div>
                </div>
              )}

              {editorTab === 'preview' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-6 rounded-3xl glass-panel border border-white/95 shadow-sm space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 text-xs font-semibold text-[#855B09]">
                      <Sparkles className="w-3 h-3 text-[#D49E24]" />
                      <span>{editingPost.category}</span>
                    </div>

                    <h1 className="font-cinzel font-black text-2xl sm:text-3xl text-[#0F172A] leading-tight">
                      {editingPost.title}
                    </h1>

                    <div className="flex items-center gap-3 text-xs text-[#64748B]">
                      <span>{editingPost.date}</span>
                      <span>•</span>
                      <span>{editingPost.readTime || calculateReadTime(editingPost.content)}</span>
                      <span>•</span>
                      <span>By {editingPost.author || 'Prineor Founders'}</span>
                    </div>

                    <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden glass-panel border border-white/90 shadow-md">
                      <img
                        src={editingPost.image || ASSETS.deskWorkspace}
                        alt={editingPost.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Body content rendering */}
                    <div className="prose prose-slate max-w-none text-[#334155] leading-relaxed text-sm space-y-3 pt-2">
                      {editingPost.content.split('\n\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('### ')) {
                          return (
                            <h3 key={idx} className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A] mt-5 mb-2">
                              {paragraph.replace('### ', '')}
                            </h3>
                          );
                        }
                        if (paragraph.startsWith('#### ')) {
                          return (
                            <h4 key={idx} className="font-heading font-bold text-sm sm:text-base text-[#0F172A] mt-3 mb-1">
                              {paragraph.replace('#### ', '')}
                            </h4>
                          );
                        }
                        if (paragraph.startsWith('> ')) {
                          return (
                            <blockquote key={idx} className="border-l-4 border-[#D49E24] pl-4 py-1.5 text-xs text-[#475569] italic bg-amber-50/50 rounded-r-xl my-2">
                              {paragraph.replace('> ', '')}
                            </blockquote>
                          );
                        }
                        if (paragraph.startsWith('- ')) {
                          const items = paragraph.split('\n').filter(Boolean);
                          return (
                            <ul key={idx} className="list-disc pl-5 text-xs text-[#475569] space-y-1">
                              {items.map((item, i) => (
                                <li key={i}>{item.replace(/^- /, '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={idx} className="text-xs text-[#475569] leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-[0_4px_20px_rgba(212,158,36,0.35)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Article</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL PUBLIC ARTICLE MODAL PREVIEW (Live Reader Preview) */}
      {/* ========================================================================= */}
      {previewArticle && (
        <ArticleModal
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-white/95 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-xl text-[#0F172A]">Delete Blog Article?</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to permanently delete this article? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
              >
                Yes, Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
