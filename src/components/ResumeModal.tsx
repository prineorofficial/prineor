import React from 'react';
import { PersonalBrandConfig } from '../types';
import { X, Download, Printer, Mail, Phone, MapPin, Globe, CheckCircle2, Sparkles, Briefcase, GraduationCap, Award } from 'lucide-react';
import { experienceTimeline, skillCategories } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: PersonalBrandConfig;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, brand }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel-elevated p-6 sm:p-12 border border-white/95 shadow-2xl bg-white/95 animate-in zoom-in-95 duration-300 print:p-0 print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D49E24]" />
            <span className="font-cinzel font-bold text-sm text-[#0F172A]">Curriculum Vitae</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full glass-panel hover:bg-white text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Document Header */}
        <div className="text-center pb-6 border-b border-slate-200/80">
          <h1 className="font-cinzel font-black text-3xl sm:text-4xl text-[#0F172A] tracking-wider">
            {brand.name}
          </h1>
          <p className="font-heading font-semibold text-sm sm:text-base text-[#855B09] mt-1">
            {brand.roles.join(' • ')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748B] mt-3">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#D49E24]" />
              {brand.email}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#D49E24]" />
              {brand.phone}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D49E24]" />
              {brand.location}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="py-6 border-b border-slate-200/80">
          <h2 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#855B09] mb-2">
            Executive Summary
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            {brand.fullBio}
          </p>
        </div>

        {/* Work Experience */}
        <div className="py-6 border-b border-slate-200/80">
          <h2 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#855B09] mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#D49E24]" />
            <span>Professional Experience</span>
          </h2>

          <div className="space-y-6">
            {experienceTimeline.map((exp, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F172A]">
                    {exp.title}
                  </h3>
                  <span className="font-mono text-xs font-semibold text-[#855B09]">
                    {exp.year}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#64748B]">
                  {exp.role} — {exp.organization}
                </p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {exp.description}
                </p>
                <div className="space-y-1 pt-1">
                  {exp.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-[#334155]">
                      <span className="text-[#D49E24] mt-0.5">•</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Technologies Matrix */}
        <div className="py-6 border-b border-slate-200/80">
          <h2 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#855B09] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D49E24]" />
            <span>Core Technical Competencies</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillCategories.map((cat, idx) => (
              <div key={idx}>
                <h4 className="font-heading font-semibold text-xs text-[#0F172A] mb-1">{cat.category}</h4>
                <p className="text-xs text-[#64748B]">
                  {cat.skills.map(s => s.name).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Learning */}
        <div className="pt-6">
          <h2 className="font-cinzel font-bold text-xs uppercase tracking-widest text-[#855B09] mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#D49E24]" />
            <span>Foundations & Continuous Learning</span>
          </h2>
          <div className="flex justify-between items-baseline text-xs">
            <div>
              <h4 className="font-heading font-bold text-sm text-[#0F172A]">Modern Web Development & AI Workflows</h4>
              <p className="text-[#64748B]">Practical Project Engineering • WordPress Architectures • Digital Strategy</p>
            </div>
            <span className="font-mono text-[#855B09] font-semibold">2026</span>
          </div>
        </div>

      </div>
    </div>
  );
};
