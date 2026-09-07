import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  CMSData, 
  HeroConfig, 
  StatItem, 
  AboutConfig,
  PersonalBrandConfig, 
  ServiceItem, 
  ProjectCaseStudy, 
  HiringConfig, 
  PartnerCTAConfig, 
  LearningSectionConfig, 
  TimelineItem, 
  BlogPost, 
  GalleryItem, 
  SocialLink, 
  AppearanceConfig, 
  GeneralSettingsConfig, 
  MediaAsset,
  SkillCategory,
  TechStackItem,
  Testimonial
} from '../types';
import { 
  defaultBrandConfig, 
  featuredProjects as initialProjects, 
  allServices as initialServices, 
  statisticsData as initialStatsRaw, 
  socialLinks as initialSocials, 
  experienceTimeline as initialTimeline, 
  blogPosts as initialBlog, 
  galleryItems as initialGallery, 
  skillCategories as initialSkills,
  techStack as initialTech,
  clientTestimonials as initialTestimonials,
  ASSETS 
} from '../data/portfolioData';

const STORAGE_KEY = 'prineor_cms_master_data_v1';
const JWT_KEY = 'prineor_admin_jwt';

export const initialHeroConfig: HeroConfig = {
  badgeText: 'STARTED IN 2026 • BUILDING & GROWING',
  heading: 'PRINEOR',
  subheading: 'A Growing Digital Brand • Founded in 2026',
  description: 'Prineor started in 2026 and is currently growing through continuous learning, practical projects, experimentation, and improvement. We turn ideas into meaningful digital experiences through Web Development with WordPress, AI Development, Graphic Designing, Digital Marketing, and Social Media Services.',
  primaryBtnText: 'Explore Projects',
  primaryBtnLink: 'projects',
  secondaryBtnText: 'Contact Us',
  secondaryBtnLink: 'contact',
  heroImage: ASSETS.heroPortrait,
  statusBadge: 'Active Learning & Building'
};

export const initialStatsConfig: StatItem[] = [
  { id: '1', label: 'Projects Built — and the journey continues.', value: '8+', icon: 'Layers', description: 'Practical and client-oriented digital projects' },
  { id: '2', label: 'Clients — Coming Soon', value: 'Pending', icon: 'Sparkles', description: 'Welcoming early partner collaborations' },
  { id: '3', label: 'Brand Genesis', value: '2026', icon: 'CheckCircle2', description: 'Founded with a clear, long-term vision' },
  { id: '4', label: 'Learning & Growing', value: 'Active', icon: 'TrendingUp', description: 'Continuous daily experimentation and learning' }
];

export const initialHiringConfig: HiringConfig = {
  isHiringOpen: true,
  heading: 'Want To Join Our Team?',
  description: 'Prineor is growing, and we are looking for motivated people who want to learn, build, and grow with us.',
  positions: ['New Developers', 'AI Developers'],
  availablePositions: [
    {
      id: 'pos_1',
      title: 'New Developer',
      slug: 'new-developer',
      shortDescription: 'Motivated entry-level developers who want to learn modern web technologies, build practical projects, and grow daily.',
      detailedDescription: 'Join Prineor to build real-world digital solutions. You will work on web applications, collaborate on practical experiments, and improve through continuous feedback and learning.',
      status: 'Open',
      order: 1
    },
    {
      id: 'pos_2',
      title: 'AI Developer',
      slug: 'ai-developer',
      shortDescription: 'Creators passionate about AI integrations, intelligent workflows, and next-generation web experiences.',
      detailedDescription: 'Build AI-powered features, experiment with LLM integrations and automation, and help craft futuristic yet practical digital tools for Prineor and our partners.',
      status: 'Open',
      order: 2
    }
  ],
  notHiringNote: 'WordPress Developers — Not Currently Hiring',
  applicationEmail: 'prineorofficial@gmail.com'
};

export const initialPartnerConfig: PartnerCTAConfig = {
  isEnabled: true,
  heading: 'Become Our Partner',
  description: "If you have an idea, project, business, or brand you want to grow, you can become our partner. Let's work together, learn together, and build something meaningful.",
  buttonText: 'Become Our Partner',
  buttonLink: 'contact'
};

export const initialLearningConfig: LearningSectionConfig = {
  isEnabled: true,
  title: 'Want To Learn With Us?',
  description: 'If you want to learn how to build websites with AI, follow Prineor on YouTube. We will share what we learn, what we build, and useful knowledge that can help you grow your own digital skills.',
  youtubeUrl: 'https://www.youtube.com/@Prineorofficial',
  buttonText: 'Learn With Prineor'
};

export const initialAppearanceConfig: AppearanceConfig = {
  accentColor: '#D49E24',
  goldIntensity: 100,
  glassBlur: 16,
  glassTransparency: 80,
  borderRadius: 24,
  animationsEnabled: true,
  cursorEffectEnabled: true
};

export const initialGeneralSettings: GeneralSettingsConfig = {
  brandName: 'PRINEOR',
  logoText: 'PRINEOR',
  faviconUrl: '',
  primaryEmail: 'prineorofficial@gmail.com',
  phone: 'Phone — Coming Soon',
  location: 'Global / Digital',
  copyrightText: '© 2026 PRINEOR. All rights reserved.',
  seoTitle: 'PRINEOR — Digital Brand • WordPress, AI, Design & Marketing',
  seoDescription: 'Prineor is a growing digital brand founded in 2026. Turning ideas into meaningful digital experiences through WordPress Web Development, AI Development, Graphic Design, and Digital Marketing.',
  metaTitle: 'PRINEOR — Growing Digital Brand | Web & AI Development',
  metaDescription: 'Prineor is a growing digital brand founded in 2026. Turning ideas into meaningful digital experiences through WordPress Web Development, AI Development, Graphic Design, and Digital Marketing.',
  metaKeywords: 'Prineor, Web Development, WordPress Development, AI Development, Digital Marketing, Graphic Design, UI UX Design, Brand Growth',
  canonicalUrl: 'https://prineor.com',
  ogImage: ASSETS.heroPortrait,
  twitterHandle: '@Prineorofficial',
  author: 'Prineor Founders',
  robots: 'index, follow',
  googleAnalyticsId: '',
  defaultCtaText: 'Become Our Partner',
  pageSeo: {
    home: {
      title: 'PRINEOR — Growing Digital Brand | Web & AI Development',
      description: 'Explore Prineor — a forward-thinking digital brand founded in 2026, delivering high-impact WordPress websites, AI integrations, UI/UX design, and growth marketing.',
      keywords: 'Prineor, Digital Brand, Web Development, WordPress, AI Development'
    },
    about: {
      title: 'About Prineor — Owners, Vision & Philosophy',
      description: 'Learn about the founders and journey behind Prineor. Discover our mission to build meaningful digital experiences and grow through continuous experimentation.',
      keywords: 'About Prineor, Founders, Brand Vision, Digital Agency Philosophy'
    },
    projects: {
      title: 'Projects & Case Studies — Prineor Digital Portfolio',
      description: 'Discover practical web applications, custom WordPress builds, and AI interfaces crafted with precision, glassmorphism aesthetics, and clean code.',
      keywords: 'Web Development Case Studies, WordPress Projects, AI Web Apps, Portfolio'
    },
    services: {
      title: 'Digital Services — WordPress, AI, Design & Marketing | Prineor',
      description: 'Full-spectrum digital services: Custom WordPress Development, AI-Powered Web Applications, Graphic Design, Digital Marketing, and Social Media Growth.',
      keywords: 'WordPress Services, AI Web Development, Digital Marketing Services'
    },
    skills: {
      title: 'Technical Skills & Tech Stack — Prineor',
      description: 'Explore the modern technologies, CMS frameworks, design tools, and AI workflows utilized daily at Prineor.',
      keywords: 'React, TypeScript, Tailwind CSS, WordPress, Gemini AI, Tech Stack'
    },
    experience: {
      title: 'Experience & Milestone Timeline — Prineor',
      description: 'The journey from our founding in 2026 through current development milestones, client projects, and continuous learning achievements.',
      keywords: 'Prineor Milestones, Experience Timeline, Career Journey'
    },
    story: {
      title: 'Our Story & Genesis — How Prineor Started in 2026',
      description: 'The authentic story of Prineor: starting with a passion for digital craftsmanship, learning daily, and building a long-term trusted brand.',
      keywords: 'Prineor Story, Brand Genesis, Digital Founders Story'
    },
    blog: {
      title: 'Journal & Insights — Tech, WordPress & AI by Prineor',
      description: 'Read insightful articles and practical tutorials on web development, WordPress best practices, AI integration, design systems, and digital strategy.',
      keywords: 'Prineor Blog, Web Development Articles, WordPress Tips, AI Tutorials'
    },
    links: {
      title: 'Direct Links & Official Channels — Prineor',
      description: 'Connect with Prineor across official digital platforms, YouTube, GitHub, LinkedIn, Twitter, and direct communication channels.',
      keywords: 'Prineor Links, Social Profiles, YouTube Channel, Contact Links'
    },
    gallery: {
      title: 'Visual Gallery & Studio Showcase — Prineor',
      description: 'A curated visual glimpse into our engineering workspace, UI concept studies, brand identity designs, and behind-the-scenes moments.',
      keywords: 'Studio Gallery, UI Design Showcase, Behind the Scenes'
    },
    contact: {
      title: 'Contact Us & Partner Inquiries — Prineor',
      description: 'Get in touch with the Prineor team for project inquiries, custom partnerships, careers, and collaborative digital opportunities.',
      keywords: 'Contact Prineor, Partner Inquiry, Hire Web Developer, Digital Agency Contact'
    }
  }
};

export const initialMediaAssets: MediaAsset[] = [
  { id: 'm1', title: 'Main Hero Crystal Portrait', url: ASSETS.heroPortrait, category: 'Hero', dateAdded: '2026-08-25', size: 'HD' },
  { id: 'm2', title: 'Crystal Diamond Prism', url: ASSETS.crystalPrism, category: 'Gallery', dateAdded: '2026-08-25', size: 'HD' },
  { id: 'm3', title: 'Workspace Desk Environment', url: ASSETS.deskWorkspace, category: 'Gallery', dateAdded: '2026-08-25', size: 'HD' },
];

export const initialAboutConfig: AboutConfig = {
  title: 'Who We Are & What Drives Us',
  subtitle: 'A growing digital brand built to turn ideas into meaningful digital experiences — modern websites, AI solutions, digital marketing, and social media.',
  portraitImage: ASSETS.heroPortrait,
  introHeading: 'We are Prineor.',
  introSubheading: 'We are the owners and founders of Prineor.',
  biography: 'We are Prineor. We are the owners and founders of Prineor. Prineor started in 2026 and is currently growing through continuous learning, practical projects, experimentation, and improvement. We are somewhat experienced through our projects and practical work, but we are still learning, improving, and building every single day.',
  vision: 'To build Prineor into a strong and meaningful digital brand.',
  mission: 'Our mission is to grow Prineor into a strong and trusted digital brand by creating useful digital experiences, exploring AI-powered solutions, providing creative digital services, and continuously learning and improving.',
  values: [
    { title: 'Curiosity & Continuous Learning', desc: 'We stay hungry, experiment daily, and embrace new technologies like AI to constantly expand our capabilities.' },
    { title: 'Honest Craftsmanship', desc: 'No fabricated claims or inflated metrics — just authentic dedication, thoughtful design, and practical solutions.' },
    { title: 'Practical Value Creation', desc: 'Every website, tool, or design we create is crafted to solve real problems and deliver meaningful value.' },
    { title: 'Long-Term Brand Vision', desc: 'We are building Prineor step by step into a strong, reliable, and trusted digital brand.' }
  ]
};

export const defaultCMSData: CMSData = {
  hero: initialHeroConfig,
  stats: initialStatsConfig,
  brand: {
    ...defaultBrandConfig,
    foundersBadge: 'Owners & Founders',
    foundersTitle: 'We are Prineor.',
    foundersSubtitle: 'We are the owners and founders of Prineor.',
  },
  about: initialAboutConfig,
  services: initialServices,
  projects: initialProjects,
  hiring: initialHiringConfig,
  partner: initialPartnerConfig,
  learning: initialLearningConfig,
  timeline: initialTimeline,
  experienceTimeline: initialTimeline,
  story: {
    paragraphs: [
      'Prineor is a growing digital brand built with a simple vision: to turn ideas into meaningful digital experiences. We work on websites, AI-powered solutions, graphic design, and digital marketing.',
      'Started in 2026, Prineor is built on continuous experimentation, daily improvement, and building digital tools that solve practical problems.'
    ],
    heroImage: ASSETS.deskWorkspace,
    milestones: initialTimeline
  },
  testimonials: initialTestimonials,
  skillCategories: initialSkills,
  techStack: initialTech,
  contact: {
    email: 'prineorofficial@gmail.com',
    phone: 'Phone — Coming Soon',
    location: 'Global / Digital',
    availability: 'Open for Partnerships & Projects',
    faqs: [
      { question: 'When did Prineor start?', answer: 'Prineor was founded in 2026 with a focus on building modern digital experiences.' },
      { question: 'What core services does Prineor provide?', answer: 'Web Development with WordPress, AI Development, Graphic Designing, Digital Marketing, and Social Media Services.' },
      { question: 'Can I partner with Prineor on a project?', answer: 'Yes, we are actively open for collaborations, new partnerships, and client projects.' }
    ]
  },
  careers: {
    isHiringOpen: true,
    positions: ['New Developers', 'AI Developers'],
    note: 'WordPress Developers — Not Currently Hiring'
  },
  blog: initialBlog,
  blogs: initialBlog,
  gallery: initialGallery,
  socials: initialSocials,
  appearance: initialAppearanceConfig,
  settings: initialGeneralSettings,
  media: initialMediaAssets
};

interface CMSContextType {
  cmsData: CMSData;
  isSetup: boolean | null;
  isAuthenticated: boolean;
  adminEmail: string | null;
  authLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  login: (email: string, token: string) => void;
  logout: () => Promise<void>;
  updateSection: <K extends keyof CMSData>(section: K, data: CMSData[K]) => void;
  saveToServer: (customData?: CMSData) => Promise<{ success: boolean; message?: string }>;
  updateBrand: (updated: PersonalBrandConfig) => void;
  resetSection: (section: keyof CMSData) => void;
  resetAllToDefault: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
  activeProjectCount: number;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CMSData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultCMSData,
          ...parsed,
          hero: { ...defaultCMSData.hero, ...(parsed.hero || {}) },
          brand: { ...defaultCMSData.brand, ...(parsed.brand || {}) },
          about: { ...initialAboutConfig, ...(parsed.about || {}) },
          hiring: { 
            ...defaultCMSData.hiring, 
            ...(parsed.hiring || {}),
            availablePositions: (parsed.hiring?.availablePositions && parsed.hiring.availablePositions.length > 0)
              ? parsed.hiring.availablePositions 
              : defaultCMSData.hiring.availablePositions
          },
          partner: { ...defaultCMSData.partner, ...(parsed.partner || {}) },
          learning: { ...defaultCMSData.learning, ...(parsed.learning || {}) },
          story: { ...defaultCMSData.story, ...(parsed.story || {}) },
          contact: { ...defaultCMSData.contact, ...(parsed.contact || {}) },
          appearance: { ...defaultCMSData.appearance, ...(parsed.appearance || {}) },
          settings: { ...defaultCMSData.settings, ...(parsed.settings || {}) },
          blog: parsed.blog || parsed.blogs || defaultCMSData.blog,
          blogs: parsed.blogs || parsed.blog || defaultCMSData.blog,
          projects: parsed.projects || defaultCMSData.projects,
        };
      }
    } catch (e) {
      console.warn('Could not read CMS data from localStorage', e);
    }
    return defaultCMSData;
  });

  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Sync with server on initial mount
  useEffect(() => {
    const fetchServerCMS = async () => {
      try {
        const res = await fetch('/api/cms/data', { credentials: 'include' });
        if (res.ok) {
          const serverData = await res.json();
          if (serverData && typeof serverData === 'object') {
            setCmsData(prev => ({
              ...prev,
              ...serverData,
              hero: { ...prev.hero, ...(serverData.hero || {}) },
              brand: { ...prev.brand, ...(serverData.brand || {}) },
              contact: { ...prev.contact, ...(serverData.contact || {}) },
              settings: { ...prev.settings, ...(serverData.settings || {}) },
              projects: serverData.projects && serverData.projects.length > 0 ? serverData.projects : prev.projects
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch server CMS data:', err);
      }
    };
    fetchServerCMS();
  }, []);

  // Check auth and setup status on server
  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthLoading(true);
      const token = sessionStorage.getItem(JWT_KEY) || localStorage.getItem(JWT_KEY);
      const res = await fetch('/api/auth/status', {
        credentials: 'include',
        headers: token ? { 'Authorization': `Bearer ${token}`, 'x-admin-token': token } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setIsSetup(data.isSetup !== false);
        const isAuth = Boolean(data.isAuthenticated);
        setIsAuthenticated(isAuth);
        setAdminEmail(data.adminEmail || null);

        // Auto-sync token if returned or refreshed by the server
        if (isAuth && data.token) {
          try {
            sessionStorage.setItem(JWT_KEY, data.token);
            localStorage.setItem(JWT_KEY, data.token);
          } catch {
            // ignore
          }
        }
      } else {
        setIsSetup(true);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Failed to query auth status:', e);
      setIsSetup(true);
      // Fallback: if network had a blip, don't kick out if we had a valid local token
      const localToken = sessionStorage.getItem(JWT_KEY) || localStorage.getItem(JWT_KEY);
      if (!localToken) {
        setIsAuthenticated(false);
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Save to LocalStorage whenever CMS data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cmsData));
    } catch (e) {
      console.error('Error saving CMS data to localStorage', e);
    }
  }, [cmsData]);

  // Save to Server Helper
  const saveToServer = async (customData?: CMSData): Promise<{ success: boolean; message?: string }> => {
    const payload = customData || cmsData;
    try {
      const token = sessionStorage.getItem(JWT_KEY) || localStorage.getItem(JWT_KEY);
      const res = await fetch('/api/cms/data', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}`, 'x-admin-token': token } : {})
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return { success: true, message: 'Saved to server successfully.' };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.error || 'Server rejected CMS save' };
    } catch (e: any) {
      console.warn('Server save failed, relying on localStorage:', e);
      return { success: true, message: 'Saved locally' };
    }
  };

  const login = (email: string, token: string) => {
    setIsAuthenticated(true);
    setIsSetup(true);
    setAdminEmail(email);
    try {
      if (token) {
        sessionStorage.setItem(JWT_KEY, token);
        localStorage.setItem(JWT_KEY, token);
      }
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' 
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setIsAuthenticated(false);
    setAdminEmail(null);
    try {
      sessionStorage.removeItem(JWT_KEY);
      localStorage.removeItem(JWT_KEY);
    } catch {
      // ignore
    }
  };

  const updateSection = <K extends keyof CMSData>(section: K, data: CMSData[K]) => {
    setCmsData(prev => {
      const updated = {
        ...prev,
        [section]: data
      };
      // Asynchronously sync to server
      saveToServer(updated);
      return updated;
    });
  };

  const updateBrand = (updated: PersonalBrandConfig) => {
    setCmsData(prev => {
      const next = {
        ...prev,
        brand: updated
      };
      saveToServer(next);
      return next;
    });
  };

  const resetSection = (section: keyof CMSData) => {
    setCmsData(prev => {
      const updated = {
        ...prev,
        [section]: defaultCMSData[section]
      };
      saveToServer(updated);
      return updated;
    });
  };

  const resetAllToDefault = () => {
    setCmsData(defaultCMSData);
    saveToServer(defaultCMSData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const exportJSON = () => {
    return JSON.stringify(cmsData, null, 2);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        const fullData = {
          ...defaultCMSData,
          ...parsed
        };
        setCmsData(fullData);
        saveToServer(fullData);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const activeProjectCount = (cmsData.projects || []).filter(p => p.isPublished !== false && p.visibility !== 'Draft').length;

  return (
    <CMSContext.Provider value={{
      cmsData,
      isSetup,
      isAuthenticated,
      adminEmail,
      authLoading,
      checkAuthStatus,
      login,
      logout,
      updateSection,
      saveToServer,
      updateBrand,
      resetSection,
      resetAllToDefault,
      exportJSON,
      importJSON,
      activeProjectCount
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
