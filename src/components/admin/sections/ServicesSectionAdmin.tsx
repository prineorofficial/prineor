import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { ServiceItem } from '../../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Layout, 
  Globe, 
  Bot, 
  Palette, 
  TrendingUp, 
  Share2, 
  Layers, 
  Edit3, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';

export const ServicesSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [services, setServices] = useState<ServiceItem[]>([...cmsData.services]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const iconList = ['Globe', 'Bot', 'Palette', 'TrendingUp', 'Share2', 'Layers', 'Layout', 'Sparkles'];

  const handleFieldChange = (index: number, field: keyof ServiceItem, value: any) => {
    setServices(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeliverableChange = (serviceIdx: number, delIdx: number, val: string) => {
    setServices(prev => {
      const copy = [...prev];
      const delCopy = [...copy[serviceIdx].deliverables];
      delCopy[delIdx] = val;
      copy[serviceIdx] = { ...copy[serviceIdx], deliverables: delCopy };
      return copy;
    });
  };

  const handleAddDeliverable = (serviceIdx: number) => {
    setServices(prev => {
      const copy = [...prev];
      copy[serviceIdx] = { 
        ...copy[serviceIdx], 
        deliverables: [...copy[serviceIdx].deliverables, 'New Deliverable Item'] 
      };
      return copy;
    });
  };

  const handleDeleteDeliverable = (serviceIdx: number, delIdx: number) => {
    setServices(prev => {
      const copy = [...prev];
      copy[serviceIdx] = { 
        ...copy[serviceIdx], 
        deliverables: copy[serviceIdx].deliverables.filter((_, i) => i !== delIdx) 
      };
      return copy;
    });
  };

  const handleAddService = () => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      title: 'New Digital Service',
      shortDescription: 'Comprehensive service overview explaining value and process.',
      iconName: 'Sparkles',
      benefits: ['High quality delivery', 'Continuous optimization'],
      process: ['Discovery', 'Execution', 'Refinement'],
      deliverables: ['Custom Assets', 'Documentation', 'Ongoing Support'],
      status: 'active'
    };
    setServices(prev => [...prev, newService]);
    setEditingIndex(services.length);
  };

  const handleDeleteService = (index: number) => {
    if (window.confirm('Delete this service offering?')) {
      const updated = services.filter((_, i) => i !== index);
      setServices(updated);
      updateSection('services', updated);
      if (editingIndex === index) setEditingIndex(null);
      setToastMessage('Service deleted and changes saved live!');
      setTimeout(() => setToastMessage(''), 3500);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === services.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    setServices(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleSave = () => {
    updateSection('services', services);
    setToastMessage('Services updated successfully and live across all pages!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset services to default Prineor offerings (WordPress, AI, Graphic Design, Digital Marketing, Social Media)?')) {
      resetSection('services');
      setServices([...cmsData.services]);
      setToastMessage('Services reset to default.');
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Offerings</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Services Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage Prineor's bespoke digital capabilities: WordPress, AI, Graphic Design, Digital Marketing, and Social Media.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddService}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>Add Service</span>
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
            <span>Save Services</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service, idx) => {
          const isEditing = editingIndex === idx;
          const isActive = service.status !== 'draft';

          return (
            <div
              key={service.id || idx}
              className={`rounded-3xl glass-panel p-5 sm:p-6 border ${isActive ? 'border-white/90' : 'border-slate-200/40 opacity-75'} shadow-sm transition-all`}
            >
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-xs font-bold text-[#855B09] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-cinzel font-bold text-base text-[#0F172A]">
                      {service.title}
                    </h3>
                    <span className="text-[10px] text-[#64748B]">
                      Icon: {service.iconName} • {service.deliverables.length} deliverables
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === services.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange(idx, 'status', isActive ? 'draft' : 'active')}
                    className={`p-1.5 rounded-lg ${isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'} cursor-pointer`}
                    title={isActive ? 'Active (Click to disable)' : 'Draft (Click to enable)'}
                  >
                    {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingIndex(isEditing ? null : idx)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-[#D49E24]" />
                    <span>{isEditing ? 'Close' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteService(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editing Form Expanded */}
              {isEditing ? (
                <div className="pt-4 space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white border border-white/95 text-xs font-bold text-[#0F172A]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                        Icon
                      </label>
                      <select
                        value={service.iconName}
                        onChange={(e) => handleFieldChange(idx, 'iconName', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white border border-white/95 text-xs text-[#0F172A]"
                      >
                        {iconList.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={service.shortDescription}
                      onChange={(e) => handleFieldChange(idx, 'shortDescription', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-pill bg-white border border-white/95 text-xs text-[#475569] leading-relaxed"
                    />
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#855B09] uppercase tracking-wider">
                        Key Deliverables
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddDeliverable(idx)}
                        className="text-xs text-[#D49E24] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Deliverable</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.deliverables.map((del, delIdx) => (
                        <div key={delIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={del}
                            onChange={(e) => handleDeliverableChange(idx, delIdx, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteDeliverable(idx, delIdx)}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="pt-3 text-xs text-[#475569] leading-relaxed line-clamp-2">
                  {service.shortDescription}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
