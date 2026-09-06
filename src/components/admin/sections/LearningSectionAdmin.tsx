import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { LearningSectionConfig } from '../../../types';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Youtube, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink,
  Eye
} from 'lucide-react';

export const LearningSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [form, setForm] = useState<LearningSectionConfig>({ ...cmsData.learning });
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (key: keyof LearningSectionConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSection('learning', form);
    // Also sync brand youtubeUrl
    updateSection('brand', {
      ...cmsData.brand,
      youtubeUrl: form.youtubeUrl
    });
    setToastMessage('YouTube & Learning section updated successfully!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset YouTube Learning section to Prineor defaults?')) {
      resetSection('learning');
      setForm({ ...cmsData.learning });
      setToastMessage('Learning section reset to default.');
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Community & Tutorials</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            YouTube / Learning Section
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage the YouTube learning showcase where Prineor shares tutorials, AI site building, and digital insights.
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
            <span>Save Learning Section</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <div className="md:col-span-8 space-y-4">
          
          {/* Status Toggle Card */}
          <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-white/80">
                <Youtube className="w-5 h-5" />
              </div>
              <div>
                <span className="font-cinzel font-bold text-base text-[#0F172A] block">
                  YouTube Section Visibility: {form.isEnabled ? 'ENABLED (VISIBLE)' : 'DISABLED (HIDDEN)'}
                </span>
                <span className="text-xs text-[#64748B]">
                  Controls the learning showcase section on the homepage
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleChange('isEnabled', !form.isEnabled)}
              className="text-[#D49E24] hover:scale-110 transition-transform cursor-pointer"
            >
              {form.isEnabled ? (
                <ToggleRight className="w-10 h-10 text-[#D49E24]" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Want To Learn With Us?"
                className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Learning Mission Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs text-[#475569] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Official YouTube Channel URL
                </label>
                <div className="relative">
                  <Youtube className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={form.youtubeUrl}
                    onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                    placeholder="https://www.youtube.com/@Prineorofficial"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                  Action Button Label
                </label>
                <input
                  type="text"
                  value={form.buttonText}
                  onChange={(e) => handleChange('buttonText', e.target.value)}
                  placeholder="Learn With Prineor"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#0F172A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="md:col-span-4">
          <div className="rounded-3xl glass-panel-elevated p-6 border border-white/95 shadow-sm space-y-4 text-center">
            <span className="text-[10px] font-bold text-[#855B09] uppercase tracking-wider flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#D49E24]" />
              <span>Section Live Preview</span>
            </span>

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 shadow-2xs">
              <Youtube className="w-6 h-6" />
            </div>

            <h3 className="font-cinzel font-black text-lg text-[#0F172A]">
              {form.title}
            </h3>

            <p className="text-xs text-[#475569] leading-relaxed">
              {form.description}
            </p>

            <a
              href={form.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-xs font-bold text-[#0F172A]"
            >
              <span>{form.buttonText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
