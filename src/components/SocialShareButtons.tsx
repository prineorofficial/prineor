import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Send,
  MessageCircle
} from 'lucide-react';

interface SocialShareButtonsProps {
  url?: string;
  title: string;
  summary?: string;
  hashtags?: string[];
  className?: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  summary,
  hashtags,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary || title);
  const tagList = hashtags ? hashtags.map(t => t.replace(/[^a-zA-Z0-9]/g, '')).filter(Boolean).join(',') : 'Prineor,WebDev,Tech';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl glass-panel bg-white/70 border border-white/95 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#D49E24]" />
          <span className="font-cinzel font-bold text-xs sm:text-sm text-[#0F172A]">
            Share This Story & Insights
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                : 'glass-pill bg-white/80 hover:bg-white text-[#0F172A] border-white/90 hover:border-[#D49E24]/50'
            }`}
            title="Copy URL Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#D49E24]" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass-pill bg-white/80 hover:bg-[#0A66C2] text-[#475569] hover:text-white border border-white/90 transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${tagList}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass-pill bg-white/80 hover:bg-black text-[#475569] hover:text-white border border-white/90 transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Share on X / Twitter"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass-pill bg-white/80 hover:bg-[#25D366] text-[#475569] hover:text-white border border-white/90 transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass-pill bg-white/80 hover:bg-[#1877F2] text-[#475569] hover:text-white border border-white/90 transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Share on Facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>

          {/* Email */}
          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedSummary}%0D%0A%0D%0ARead more at: ${encodedUrl}`}
            className="p-2 rounded-xl glass-pill bg-white/80 hover:bg-amber-50 text-[#475569] hover:text-[#855B09] border border-white/90 transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Share via Email"
          >
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
