import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { GalleryItem } from '../../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Upload, 
  Image as ImageIcon, 
  Star 
} from 'lucide-react';
import { ASSETS } from '../../../data/portfolioData';

export const GallerySectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [gallery, setGallery] = useState<GalleryItem[]>([...cmsData.gallery]);
  const [toastMessage, setToastMessage] = useState('');

  const categories = [
    'Workspace',
    'WordPress',
    'AI',
    'Design Work',
    'Branding',
    'Marketing',
    'Web Projects',
    'Behind the Scenes'
  ];

  const handleFieldChange = (index: number, field: keyof GalleryItem, value: any) => {
    setGallery(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleFieldChange(index, 'image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: 'New Studio Asset',
      category: 'Workspace',
      image: ASSETS.workspace1,
      aspect: 'landscape',
      caption: 'Studio workspace, tools, and digital creations.',
      isFeatured: false
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Remove this photo from gallery?')) {
      setGallery(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    updateSection('gallery', gallery);
    setToastMessage('Gallery saved and published live!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset gallery photos to default Prineor assets?')) {
      resetSection('gallery');
      setGallery([...cmsData.gallery]);
      setToastMessage('Gallery reset to default.');
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Visual Assets</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Gallery Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Upload and organize photos of Prineor workspace, WordPress & AI designs, branding, and projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddImage}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>Add Photo</span>
          </button>

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
            <span>Save Gallery</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {gallery.map((item, idx) => (
          <div
            key={item.id || idx}
            className="rounded-3xl glass-panel p-4 border border-white/90 shadow-sm space-y-3 relative group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-white shadow-2xs">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleFieldChange(idx, 'isFeatured', !item.isFeatured)}
                    className={`p-1.5 rounded-lg backdrop-blur-md ${
                      item.isFeatured ? 'bg-[#D49E24] text-[#0F172A]' : 'bg-black/40 text-white hover:bg-black/60'
                    } transition-colors cursor-pointer`}
                    title="Toggle featured"
                  >
                    <Star className={`w-3 h-3 ${item.isFeatured ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="p-1.5 rounded-lg bg-black/40 text-white hover:bg-red-600 backdrop-blur-md transition-colors cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                    placeholder="Photo Title"
                    className="w-full px-2 py-1 rounded-lg bg-white/70 border border-slate-200 text-xs font-bold text-[#0F172A]"
                  />
                  
                  <select
                    value={item.category}
                    onChange={(e) => handleFieldChange(idx, 'category', e.target.value)}
                    className="px-2 py-1 rounded-lg bg-white/70 border border-slate-200 text-[10px] text-[#0F172A]"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={item.caption}
                  onChange={(e) => handleFieldChange(idx, 'caption', e.target.value)}
                  placeholder="Caption..."
                  className="w-full px-2 py-1 rounded-lg bg-white/70 border border-slate-200 text-[11px] text-[#64748B]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <label className="text-[11px] text-[#A87915] font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" />
                <span>Replace Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(idx, e)}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={item.image}
                onChange={(e) => handleFieldChange(idx, 'image', e.target.value)}
                placeholder="URL"
                className="w-28 px-2 py-0.5 rounded bg-white/60 border text-[10px] text-slate-500"
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
