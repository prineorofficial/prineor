import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { AppearanceConfig } from '../../../types';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Palette, 
  Sliders, 
  Layers, 
  MousePointer, 
  Eye
} from 'lucide-react';

export const AppearanceSectionAdmin: React.FC = () => {
  const { cmsData, updateSection, resetSection } = useCMS();
  const [form, setForm] = useState<AppearanceConfig>({ ...cmsData.appearance });
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (key: keyof AppearanceConfig, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSection('appearance', form);
    setToastMessage('Appearance preferences saved! Visual styling updated.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset Appearance to Prineor signature Luxury Crystal defaults?')) {
      resetSection('appearance');
      setForm({ ...cmsData.appearance });
      setToastMessage('Appearance reset to default.');
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Aesthetic Controls</span>
          </div>
          <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
            Appearance Settings
          </h1>
          <p className="text-xs text-[#64748B]">
            Refine glassmorphism blur, transparency, champagne gold accents, corner radii, and interactive cursor physics.
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
            <span>Save Appearance</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Color & Gold Accents */}
        <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
          <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#D49E24]" />
            <span>Signature Color Accents</span>
          </h3>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Champagne Gold Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
              />
              <input
                type="text"
                value={form.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="w-36 px-3 py-2 rounded-xl glass-pill bg-white border text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                Gold Hue Warmth ({form.goldIntensity}%)
              </label>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={form.goldIntensity}
              onChange={(e) => handleChange('goldIntensity', parseInt(e.target.value))}
              className="w-full accent-[#D49E24] cursor-pointer"
            />
          </div>
        </div>

        {/* Glassmorphism & Geometry */}
        <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4">
          <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D49E24]" />
            <span>Glassmorphism & Structure</span>
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                Glass Backdrop Blur ({form.glassBlur}px)
              </label>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              value={form.glassBlur}
              onChange={(e) => handleChange('glassBlur', parseInt(e.target.value))}
              className="w-full accent-[#D49E24] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                Container Corner Radius ({form.borderRadius}px)
              </label>
            </div>
            <input
              type="range"
              min="12"
              max="32"
              value={form.borderRadius}
              onChange={(e) => handleChange('borderRadius', parseInt(e.target.value))}
              className="w-full accent-[#D49E24] cursor-pointer"
            />
          </div>
        </div>

        {/* Interactive Physics & FX */}
        <div className="rounded-3xl glass-panel p-6 border border-white/90 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-[#D49E24]" />
            <span>Interactive FX & Physics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/60 border border-white/90 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#0F172A] block">
                  Interactive Pearl Cursor Physics
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Smooth magnetic trailing circle with gold core
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.cursorEffectEnabled}
                onChange={(e) => handleChange('cursorEffectEnabled', e.target.checked)}
                className="w-5 h-5 accent-[#D49E24] cursor-pointer rounded"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/60 border border-white/90 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#0F172A] block">
                  Page Transition Animations
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Subtle fade-in and card hover elevation
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.animationsEnabled}
                onChange={(e) => handleChange('animationsEnabled', e.target.checked)}
                className="w-5 h-5 accent-[#D49E24] cursor-pointer rounded"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
