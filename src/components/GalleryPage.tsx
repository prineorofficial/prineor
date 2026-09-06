import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { useCMS } from '../context/CMSContext';
import { Sparkles, X, Eye } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { cmsData } = useCMS();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryList = cmsData.gallery || [];
  const categories = [
    'All',
    ...Array.from(new Set(galleryList.map(item => item.category)))
  ];

  const filteredItems = galleryList.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <div id="gallery-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Visual Showcase</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-5xl text-[#0F172A] tracking-wide">
          Studio Gallery & Artifacts
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-3">
          Behind-the-scenes projects, bespoke design assets, and visual work by Prineor.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#E6B942] to-[#D49E24] text-[#0F172A] font-bold shadow-xs'
                  : 'glass-pill text-[#64748B] hover:text-[#0F172A] hover:bg-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Masonry / Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="break-inside-avoid glass-panel rounded-3xl p-3 sm:p-4 border border-white/90 shadow-sm cursor-pointer group hover:scale-[1.02] transition-all"
          >
            <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/80">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#F5D372] font-semibold">
                  {item.category}
                </span>
                <h4 className="font-heading font-bold text-sm text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5">
                  {item.caption}
                </p>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] rounded-3xl glass-panel-elevated p-4 sm:p-6 border border-white/90 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#0F172A] hover:scale-110 transition-all cursor-pointer shadow-md z-30"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto mx-auto rounded-2xl object-contain"
            />

            <div className="mt-4 text-center">
              <span className="text-xs font-bold text-[#A87915] uppercase tracking-wider">
                {selectedImage.category}
              </span>
              <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A] mt-1">
                {selectedImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl mx-auto">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
