import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { TimelineItem } from '../../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Edit3 
} from 'lucide-react';

export const StorySectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [timeline, setTimeline] = useState<TimelineItem[]>([...cmsData.timeline]);
  const [toastMessage, setToastMessage] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleFieldChange = (index: number, field: keyof TimelineItem, value: any) => {
    setTimeline(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddMilestone = () => {
    const newMilestone: TimelineItem = {
      id: `milestone-${Date.now()}`,
      year: '2026',
      title: 'New Milestone / Chapter',
      role: 'Founders & Builders',
      organization: 'Prineor',
      description: 'Milestone summary explaining what was learned, built, or achieved.',
      highlights: ['Practical milestone', 'Skill expansion'],
      category: 'milestone'
    };
    setTimeline(prev => [...prev, newMilestone]);
    setEditingIdx(timeline.length);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Delete this story milestone?')) {
      setTimeline(prev => prev.filter((_, i) => i !== index));
      if (editingIdx === index) setEditingIdx(null);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === timeline.length - 1) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    setTimeline(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleSave = () => {
    updateSection('timeline', timeline);
    setToastMessage('Story & Timeline milestones saved successfully!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset Story milestones to default Prineor genesis (2026)?')) {
      resetSection('timeline');
      setTimeline([...cmsData.timeline]);
      setToastMessage('Milestones reset to default.');
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Chronicles</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Story & Timeline Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Add and manage honest timeline milestones starting from 2026 Prineor Begins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddMilestone}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>Add Milestone</span>
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
            <span>Save Milestones</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Timeline List */}
      <div className="space-y-4">
        {timeline.map((item, idx) => {
          const isEditing = editingIdx === idx;

          return (
            <div
              key={item.id || idx}
              className="rounded-3xl glass-panel p-5 sm:p-6 border border-white/90 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center font-cinzel font-bold text-xs text-[#855B09]">
                    {item.year}
                  </div>
                  <div>
                    <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-[#64748B]">
                      {item.role} {item.organization ? `• ${item.organization}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === timeline.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingIdx(isEditing ? null : idx)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-[#D49E24]" />
                    <span>{isEditing ? 'Close' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="pt-3 space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => handleFieldChange(idx, 'year', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-pill bg-white border text-xs font-bold text-[#0F172A]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-pill bg-white border text-xs font-bold text-[#0F172A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                      Narrative Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-pill bg-white border text-xs text-[#475569] leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#475569] leading-relaxed">
                  {item.description}
                </p>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
