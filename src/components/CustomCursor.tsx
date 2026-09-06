import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (disable on touch/mobile)
    if (typeof window === 'undefined' || window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let rafId: number | null = null;
    let pendingX = -100;
    let pendingY = -100;
    let pendingTarget: HTMLElement | null = null;

    const onMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      pendingTarget = e.target as HTMLElement | null;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          setMousePosition({ x: pendingX, y: pendingY });
          if (!isVisible) setIsVisible(true);

          if (pendingTarget) {
            const isClickable = 
              pendingTarget.tagName === 'BUTTON' || 
              pendingTarget.tagName === 'A' || 
              pendingTarget.closest('button') || 
              pendingTarget.closest('a') ||
              pendingTarget.closest('[role="button"]') ||
              pendingTarget.classList.contains('cursor-pointer');
            
            setIsPointer(!!isClickable);
            
            const isCard = pendingTarget.closest('.glass-card-hover') || pendingTarget.closest('.project-card');
            setIsHovered(!!isCard);
          }

          rafId = null;
        });
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Central Diamond/Point */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#D49E24] rounded-full shadow-[0_0_10px_#F5D372]"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />

      {/* Outer Luxury Glass Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#D49E24]/40 bg-white/10 backdrop-blur-[2px] shadow-[0_0_15px_rgba(212,158,36,0.15)]"
        animate={{
          x: mousePosition.x - (isPointer ? 24 : isHovered ? 32 : 18),
          y: mousePosition.y - (isPointer ? 24 : isHovered ? 32 : 18),
          width: isPointer ? 48 : isHovered ? 64 : 36,
          height: isPointer ? 48 : isHovered ? 64 : 36,
          borderColor: isPointer ? 'rgba(212, 158, 36, 0.8)' : 'rgba(212, 158, 36, 0.35)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.2 }}
      />
    </div>
  );
};
