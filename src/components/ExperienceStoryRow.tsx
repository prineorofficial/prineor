import React, { useState } from 'react';
import { PageTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { ArrowRight, ArrowUpRight, Sparkles, Quote } from 'lucide-react';

interface ExperienceStoryRowProps {
  setActiveTab: (tab: PageTab) => void;
}

export const ExperienceStoryRow: React.FC<ExperienceStoryRowProps> = ({ setActiveTab }) => {
  const { cmsData } = useCMS();
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const timeline = cmsData.experienceTimeline || [];
  const testimonials = cmsData.testimonials || [];
  const story = cmsData.story;
  const currentTestimonial = testimonials[activeTestimonialIdx] || testimonials[0];

  return (
    <section id="experience-story-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Experience Journey */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)]">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                  Experience Journey
                </h3>
              </div>
            </div>

            {/* Vertical timeline items */}
            <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#E6B942] before:via-[#D49E24]/50 before:to-slate-200">
              {timeline.slice(0, 3).map((item, idx) => (
                <div key={item.id || idx} className="relative group">
                  {/* Dot on line */}
                  <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#D49E24] border-2 border-white shadow-[0_0_6px_rgba(212,158,36,0.8)] group-hover:scale-125 transition-transform" />
                  
                  <span className="text-[11px] font-bold text-[#855B09] tracking-wide block">
                    {item.year}
                  </span>
                  <h4 className="font-heading font-semibold text-sm text-[#0F172A] mt-0.5 group-hover:text-[#A87915] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
            <button
              id="experience-full-timeline-cta"
              onClick={() => setActiveTab('experience')}
              className="text-xs font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>Full Timeline</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D49E24] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 2: Our Story */}
        <div 
          onClick={() => setActiveTab('story')}
          className="glass-panel glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)] cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A] group-hover:text-[#A87915] transition-colors">
                  Our Story
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#0F172A] group-hover:bg-[#E6B942] group-hover:text-white transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-4">
              {story.paragraphs?.[0] || "Prineor is a growing digital brand built with a simple vision: to turn ideas into meaningful digital experiences. We work on websites, AI-powered solutions, graphic design, and digital marketing."}
            </p>

            {/* Workspace Desk Image */}
            <div className="mt-4 w-full aspect-[16/9] rounded-2xl overflow-hidden glass-panel border border-white/80 relative shadow-inner">
              <img
                src={story.heroImage}
                alt="Story Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/50">
            <button
              id="read-my-story-cta"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('story');
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Read Our Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: What Partners Say */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.03)] relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D49E24]" />
                <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#0F172A]">
                  Client & Partner Feedback
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#94A3B8]">
                <Quote className="w-4 h-4 text-[#D49E24]" />
              </div>
            </div>

            {/* Testimonial Quote */}
            {currentTestimonial && (
              <div className="min-h-[140px] flex flex-col justify-between">
                <p className="font-serif italic text-sm sm:text-base text-[#334155] leading-relaxed">
                  "{currentTestimonial.quote}"
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentTestimonial.avatar && (
                      <img
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.author}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-[#F5D372]/60 shadow-xs"
                      />
                    )}
                    <div>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#0F172A]">
                        — {currentTestimonial.author}
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        {currentTestimonial.role}{currentTestimonial.company ? `, ${currentTestimonial.company}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Golden Quotation Accent */}
                  <span className="font-serif font-black text-3xl sm:text-4xl text-[#E6B942] opacity-60">
                    ”
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Pagination Dots */}
          {testimonials.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeTestimonialIdx === idx 
                        ? 'w-6 bg-[#D49E24]' 
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveTab('about')}
                className="text-xs font-semibold text-[#0F172A] hover:text-[#A87915] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>About Us</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D49E24]" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
