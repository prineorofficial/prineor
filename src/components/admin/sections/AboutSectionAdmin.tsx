import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { PersonalBrandConfig } from '../../../types';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  User, 
  Target, 
  Compass, 
  Plus, 
  Trash2,
  Eye
} from 'lucide-react';

export const AboutSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [form, setForm] = useState<PersonalBrandConfig>({ ...cmsData.brand });
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (key: keyof PersonalBrandConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleValueChange = (index: number, field: 'title' | 'desc', val: string) => {
    setForm(prev => {
      const copy = [...prev.values];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, values: copy };
    });
  };

  const handleAddValue = () => {
    setForm(prev => ({
      ...prev,
      values: [...prev.values, { title: 'New Core Value', desc: 'Description of this value and principle.' }]
    }));
  };

  const handleDeleteValue = (index: number) => {
    setForm(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    updateSection('brand', form);
    setToastMessage('About & Founders details updated and live across the site!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset About & Founders information to default Prineor values?')) {
      resetSection('brand');
      setForm({ ...cmsData.brand });
      setToastMessage('About details reset to default.');
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Brand & Story</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            About & Founders Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure founder declarations, founding narrative, vision, mission statement, and core values.
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

      {/* 1. Founders & Owners Declaration Card */}
      <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
        <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
          <User className="w-4 h-4 text-[#D49E24]" />
          <span>Founders Declaration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Founders Badge
            </label>
            <input
              type="text"
              value={form.foundersBadge || 'Owners & Founders'}
              onChange={(e) => handleChange('foundersBadge', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs focus:ring-2 focus:ring-[#D49E24]/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Founder Title Text
            </label>
            <input
              type="text"
              value={form.foundersTitle || 'We are Prineor.'}
              onChange={(e) => handleChange('foundersTitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs font-bold focus:ring-2 focus:ring-[#D49E24]/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Founder Subtitle Wording
            </label>
            <input
              type="text"
              value={form.foundersSubtitle || 'We are the owners and founders of Prineor.'}
              onChange={(e) => handleChange('foundersSubtitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs focus:ring-2 focus:ring-[#D49E24]/50"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
            Full Biography / Story Narrative
          </label>
          <textarea
            rows={4}
            value={form.fullBio}
            onChange={(e) => handleChange('fullBio', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs leading-relaxed focus:ring-2 focus:ring-[#D49E24]/50"
          />
        </div>
      </div>

      {/* 2. Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D49E24]" />
            <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
              Our Vision
            </h3>
          </div>
          <textarea
            rows={3}
            value={form.vision}
            onChange={(e) => handleChange('vision', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs leading-relaxed focus:ring-2 focus:ring-[#D49E24]/50"
          />
        </div>

        <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#D49E24]" />
            <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
              Our Mission
            </h3>
          </div>
          <textarea
            rows={3}
            value={form.mission}
            onChange={(e) => handleChange('mission', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl glass-pill bg-white/70 border border-white/90 text-xs leading-relaxed focus:ring-2 focus:ring-[#D49E24]/50"
          />
        </div>

      </div>

      {/* 3. Core Values Management */}
      <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
            Core Values & Principles ({form.values.length})
          </h3>
          <button
            type="button"
            onClick={handleAddValue}
            className="px-3 py-1.5 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>Add Value</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {form.values.map((val, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/60 border border-white/90 space-y-2 relative group">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={val.title}
                  onChange={(e) => handleValueChange(idx, 'title', e.target.value)}
                  placeholder="Value Title"
                  className="px-2 py-1 rounded-lg bg-transparent border-b border-transparent focus:border-[#D49E24] text-xs font-bold text-[#0F172A] w-full"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteValue(idx)}
                  className="w-6 h-6 rounded text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                rows={2}
                value={val.desc}
                onChange={(e) => handleValueChange(idx, 'desc', e.target.value)}
                placeholder="Value Description"
                className="w-full px-2.5 py-1.5 rounded-xl bg-white/70 border border-slate-200/60 text-xs text-[#475569] leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
