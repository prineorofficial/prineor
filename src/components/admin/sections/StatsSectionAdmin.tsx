import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { StatItem } from '../../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Trophy, 
  Users, 
  Eye, 
  ArrowUpDown 
} from 'lucide-react';

export const StatsSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection, activeProjectCount } = useCMS();
  const [stats, setStats] = useState<StatItem[]>([...cmsData.stats]);
  const [toastMessage, setToastMessage] = useState('');
  const [useDynamicCount, setUseDynamicCount] = useState(false);

  const iconOptions = ['Layers', 'Sparkles', 'CheckCircle2', 'TrendingUp', 'Award', 'Trophy', 'Users'];

  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    setStats(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddStat = () => {
    const newStat: StatItem = {
      id: Date.now().toString(),
      label: 'New Statistic',
      value: '10+',
      icon: 'Sparkles',
      description: 'Custom milestone stat'
    };
    setStats(prev => [...prev, newStat]);
  };

  const handleDeleteStat = (index: number) => {
    setStats(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateSection('stats', stats);
    setToastMessage('Statistics successfully saved and updated across the site!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website statistics to Prineor default values?')) {
      resetSection('stats');
      setStats([...cmsData.stats]);
      setToastMessage('Statistics reset to default values.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const syncDynamicProjectCount = () => {
    setStats(prev => prev.map(s => {
      if (s.label.toLowerCase().includes('project')) {
        return { ...s, value: `${activeProjectCount}+` };
      }
      return s;
    }));
    setToastMessage(`Project statistic synced with active project count (${activeProjectCount}+)`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Metrics & Milestones</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Website Statistics Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Customize every label and value freely. We never force "years of experience" or rigid templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddStat}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>Add Stat</span>
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
            <span>Save Stats</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Auto Sync Helper Box */}
      <div className="rounded-2xl glass-panel p-4 border border-white/90 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#A87915]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0F172A] block">
              Active Projects in CMS Database: {activeProjectCount}
            </span>
            <span className="text-[11px] text-[#64748B]">
              Quickly sync your project counter value with your live portfolio entries.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={syncDynamicProjectCount}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0"
        >
          <RefreshCw className="w-3 h-3 text-[#D49E24]" />
          <span>Sync ({activeProjectCount}+)</span>
        </button>
      </div>

      {/* Editable Stats List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={stat.id || idx}
            className="rounded-3xl glass-panel p-5 sm:p-6 border border-white/90 shadow-sm space-y-4 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A87915] uppercase tracking-wider">
                Statistic #{idx + 1}
              </span>
              
              {stats.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteStat(idx)}
                  className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                  title="Delete Stat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                  Value / Number
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="e.g. 8+, 2026, Pending"
                  className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white/80 border border-white/95 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                  Icon Style
                </label>
                <select
                  value={stat.icon}
                  onChange={(e) => handleStatChange(idx, 'icon', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white/80 border border-white/95 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Statistic Label / Text
              </label>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                placeholder="e.g. Projects, Clients, Started, Experience"
                className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white/80 border border-white/95 text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#D49E24]/50"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Optional Description
              </label>
              <input
                type="text"
                value={stat.description || ''}
                onChange={(e) => handleStatChange(idx, 'description', e.target.value)}
                placeholder="Additional notes..."
                className="w-full px-3.5 py-1.5 rounded-xl glass-pill bg-white/70 border border-white/90 text-xs text-[#475569] focus:ring-2 focus:ring-[#D49E24]/50"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Bar */}
      <div className="rounded-3xl glass-panel-elevated p-6 border border-white/95 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#D49E24]" />
          <h3 className="font-cinzel font-bold text-sm text-[#0F172A]">
            Public Stat Bar Live Preview
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/60 border border-slate-200/60 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
          {stats.map((stat, idx) => (
            <div key={idx} className={`flex items-center gap-3 ${idx !== 0 ? 'pt-2 sm:pt-0 sm:pl-3' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] flex items-center justify-center text-[#A87915] border border-[#F5D372]/60 flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-cinzel font-bold text-lg text-[#0F172A] block leading-none">
                  {stat.value}
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
