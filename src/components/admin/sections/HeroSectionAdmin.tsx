import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { HeroConfig } from '../../../types';
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Save, 
  Eye, 
  ArrowRight, 
  Image as ImageIcon,
  CheckCircle2,
  Undo
} from 'lucide-react';
import { ASSETS } from '../../../data/portfolioData';

export const HeroSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [form, setForm] = useState<HeroConfig>({ ...cmsData.hero });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (key: keyof HeroConfig, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleChange('heroImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateSection('hero', form);
    setToastMessage('Hero Section updated and live on the homepage!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset Hero Section to Prineor default values?')) {
      resetSection('hero');
      setForm({ ...cmsData.hero });
      setToastMessage('Hero Section reset to default.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const handleCancel = () => {
    setForm({ ...cmsData.hero });
    setToastMessage('Changes discarded.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Page Section</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Hero Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure the main hero presentation, status badges, typography, CTA buttons, and visuals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>{isPreviewOpen ? 'Hide Preview' : 'Live Preview'}</span>
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
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Form and Optional Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: 7 or 12 Cols */}
        <div className={`${isPreviewOpen ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
          
          {/* 1. Hero Image Management Card */}
          <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#D49E24]" />
              <span>Hero Image</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-36 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100 flex-shrink-0">
                {form.heroImage ? (
                  <img
                    src={form.heroImage}
                    alt="Hero Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#94A3B8]">
                    No Image
                  </div>
                )}
              </div>

              <div className="space-y-2.5 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-2 shadow-2xs transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#D49E24]" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleChange('heroImage', ASSETS.heroWorkspace)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-[#475569] transition-all cursor-pointer"
                  >
                    Use Default
                  </button>

                  {form.heroImage && (
                    <button
                      type="button"
                      onClick={() => handleChange('heroImage', '')}
                      className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="w-full">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Or Enter Image URL
                  </label>
                  <input
                    type="text"
                    value={form.heroImage}
                    onChange={(e) => handleChange('heroImage', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs focus:ring-2 focus:ring-[#D49E24]/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Text Content Card */}
          <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
              Headings & Messaging
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={form.badgeText}
                  onChange={(e) => handleChange('badgeText', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Status Indicator Badge
                </label>
                <input
                  type="text"
                  value={form.statusBadge}
                  onChange={(e) => handleChange('statusBadge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Main Brand Heading
                </label>
                <input
                  type="text"
                  value={form.heading}
                  onChange={(e) => handleChange('heading', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs focus:ring-2 focus:ring-[#D49E24]/50 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Subheading
                </label>
                <input
                  type="text"
                  value={form.subheading}
                  onChange={(e) => handleChange('subheading', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Hero Description / Bio
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs leading-relaxed focus:ring-2 focus:ring-[#D49E24]/50"
              />
            </div>
          </div>

          {/* 3. CTA Buttons Configuration */}
          <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
              Call-to-Action Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/50 border border-white/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#855B09] block">
                  Primary Gold Button
                </span>
                <div>
                  <label className="text-[10px] font-medium text-[#64748B] block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={form.primaryBtnText}
                    onChange={(e) => handleChange('primaryBtnText', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#64748B] block mb-1">Target Action / Link</label>
                  <input
                    type="text"
                    value={form.primaryBtnLink}
                    onChange={(e) => handleChange('primaryBtnLink', e.target.value)}
                    placeholder="projects or #projects"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 border border-white/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Secondary Glass Button
                </span>
                <div>
                  <label className="text-[10px] font-medium text-[#64748B] block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={form.secondaryBtnText}
                    onChange={(e) => handleChange('secondaryBtnText', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#64748B] block mb-1">Target Action / Link</label>
                  <input
                    type="text"
                    value={form.secondaryBtnLink}
                    onChange={(e) => handleChange('secondaryBtnLink', e.target.value)}
                    placeholder="contact or #contact"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Publish Hero</span>
            </button>
          </div>

        </div>

        {/* Right Live Preview Panel (if toggled) */}
        {isPreviewOpen && (
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl glass-panel-elevated p-6 border border-white/95 shadow-md sticky top-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4">
                <span className="text-xs font-bold text-[#855B09] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
                  <span>Real-time Preview</span>
                </span>
                <span className="text-[10px] text-[#94A3B8]">Desktop Preview Mode</span>
              </div>

              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#D49E24]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F172A]">
                    {form.badgeText || 'Badge'}
                  </span>
                </div>

                <h2 className="font-cinzel font-black text-2xl text-[#0F172A]">
                  {form.heading || 'PRINEOR'}
                </h2>

                <p className="text-xs font-bold text-[#A87915]">
                  {form.subheading}
                </p>

                <p className="text-[11px] text-[#475569] leading-relaxed line-clamp-3">
                  {form.description}
                </p>

                {form.heroImage && (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-inner border border-white/80">
                    <img
                      src={form.heroImage}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[11px] font-bold text-[#0F172A]">
                    {form.primaryBtnText} →
                  </span>
                  <span className="px-4 py-2 rounded-full glass-panel text-[11px] font-semibold text-[#0F172A]">
                    {form.secondaryBtnText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
