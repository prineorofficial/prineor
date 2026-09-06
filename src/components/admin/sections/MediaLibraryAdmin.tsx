import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { MediaAsset } from '../../../types';
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Filter, 
  Plus, 
  ExternalLink,
  Save,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const MediaLibraryAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [mediaList, setMediaList] = useState<MediaAsset[]>([...cmsData.media]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const categories = ['All', 'Hero', 'Projects', 'Blog', 'Gallery', 'General'];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newAsset: MediaAsset = {
          id: `media-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, "") || 'Uploaded Image',
          url: result,
          category: (selectedCategory === 'All' ? 'General' : selectedCategory) as any,
          dateAdded: new Date().toISOString().slice(0, 10),
          size: `${Math.round(file.size / 1024)} KB`
        };
        const updated = [newAsset, ...mediaList];
        setMediaList(updated);
        updateSection('media', updated);
        setToastMessage(`Uploaded "${newAsset.title}" to Media Library`);
        setTimeout(() => setToastMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setToastMessage('Image reference URL copied to clipboard!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this asset from library?')) {
      const updated = mediaList.filter(m => m.id !== id);
      setMediaList(updated);
      updateSection('media', updated);
      setToastMessage('Asset deleted');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleSetAsHero = (url: string) => {
    updateSection('hero', {
      ...cmsData.hero,
      heroImage: url
    });
    setToastMessage('Selected image is now active as the main Hero image!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filtered = mediaList.filter(m => {
    if (selectedCategory === 'All') return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Asset Central</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Media Library
          </h1>
          <p className="text-xs text-[#64748B]">
            Upload, preview, copy URLs, and instantly deploy images into Hero, Projects, Blog, or Gallery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#0F172A]" />
            <span>Upload New Media</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] shadow-2xs'
                : 'glass-panel text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="rounded-3xl glass-panel p-4 border border-white/90 shadow-sm space-y-3 relative group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-white shadow-2xs">
                <img
                  src={asset.url}
                  alt={asset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 rounded-lg bg-black/40 text-white hover:bg-red-600 backdrop-blur-md transition-colors cursor-pointer"
                    title="Delete image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <span className="font-cinzel font-bold text-xs text-[#0F172A] block truncate">
                  {asset.title}
                </span>
                <span className="text-[10px] text-[#64748B]">
                  Category: {asset.category} {asset.size ? `• ${asset.size}` : ''}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="w-full py-1.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-semibold text-[#0F172A] flex items-center justify-center gap-1 cursor-pointer"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#D49E24]" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSetAsHero(asset.url)}
                  className="py-1.5 px-2.5 rounded-xl glass-panel hover:bg-white text-[11px] font-semibold text-[#855B09] border border-amber-200/50 flex-shrink-0 cursor-pointer"
                  title="Set as Hero background image"
                >
                  Use in Hero
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
