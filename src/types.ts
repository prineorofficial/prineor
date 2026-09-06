export type PageTab = 
  | 'home' 
  | 'about' 
  | 'story' 
  | 'projects' 
  | 'services' 
  | 'skills' 
  | 'experience' 
  | 'blog' 
  | 'links' 
  | 'gallery' 
  | 'contact'
  | 'apply'
  | '404'
  | 'admin';

export type AdminTab =
  | 'dashboard'
  | 'messages'
  | 'hero'
  | 'stats'
  | 'about'
  | 'services'
  | 'projects'
  | 'contact'
  | 'socials'
  | 'hiring'
  | 'partner'
  | 'learning'
  | 'story'
  | 'blog'
  | 'gallery'
  | 'settings'
  | 'appearance'
  | 'media';

export type MessageInquiryType = 'General Inquiry' | 'Project Inquiry' | 'Partnership';

export type MessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: MessageInquiryType;
  subject: string;
  message: string;
  createdAt: string;
  date: string;
  time: string;
  status: MessageStatus;
  notes?: string;
}

export interface HiringPosition {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription?: string;
  status: 'Open' | 'Closed';
  order: number;
}

export type ApplicationStatus = 'New' | 'Reviewing' | 'Shortlisted' | 'Interview' | 'Accepted' | 'Rejected';

export type ExperienceLevel = 
  | 'Beginner — 0–1 year' 
  | 'Intermediate — 1–3 years' 
  | 'Experienced — 3+ years' 
  | string;

export interface HiringApplication {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  positionId?: string;
  positionTitle: string;
  experienceLevel: ExperienceLevel;
  portfolioUrl?: string;
  githubUrl?: string;
  whyJoin: string;
  cvFileName: string;
  cvOriginalName: string;
  cvMimeType: string;
  cvFileSize: number;
  cvFileId: string;
  createdAt: string;
  date: string;
  time: string;
  status: ApplicationStatus;
  notes?: string;
}

export interface ProjectCaseStudy {
  id: string;
  number: string;
  slug?: string;
  title: string;
  subtitle: string;
  category: 'WordPress' | 'AI Development' | 'AI' | 'Web Development' | 'UI/UX' | 'Graphic Design' | 'Digital Marketing' | 'Social Media' | 'Branding' | string;
  categories?: string[];
  tags: string[];
  image: string;
  galleryImages?: string[];
  mockupType?: 'dashboard' | 'laptop' | 'mobile' | 'dual';
  shortDescription: string;
  overview: string;
  purpose?: string;
  targetAudience?: string;
  problem: string;
  challenge?: string;
  solution: string;
  approach?: string;
  servicesUsed?: string[];
  tools?: string[];
  role: string;
  ourRole?: string;
  technologies: string[];
  process?: { step: string; title: string; description: string }[];
  features?: string[];
  results: { metric: string; label: string }[];
  outcomeText?: string;
  keyResult?: string;
  additionalNotes?: string;
  challenges?: string;
  clientName?: string;
  projectUrl?: string;
  liveDemoUrl?: string;
  caseStudyUrl?: string;
  githubUrl?: string;
  year?: string;
  status?: 'Completed' | 'In Progress' | 'Coming Soon';
  visibility?: 'Published' | 'Draft';
  order?: number;
  lastUpdated?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  caseStudyEnabled?: boolean;
  settings?: {
    showGallery?: boolean;
    showChallenge?: boolean;
    showApproach?: boolean;
    showResults?: boolean;
    showTools?: boolean;
    showOurRole?: boolean;
    showWhatWeDid?: boolean;
    showProcess?: boolean;
  };
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  benefits: string[];
  process: string[];
  deliverables: string[];
  badge?: string;
  image?: string;
  status?: 'active' | 'draft';
}

export interface SkillCategory {
  category: string;
  skills: { name: string; percentage: number; level: string }[];
}

export interface TechStackItem {
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
}

export interface TimelineItem {
  id?: string;
  year: string;
  title: string;
  role: string;
  organization?: string;
  description: string;
  highlights: string[];
  category: 'experience' | 'education' | 'milestone';
  image?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: 'Web Development' | 'WordPress' | 'AI' | 'Graphic Design' | 'Digital Marketing' | 'Social Media' | 'Learning' | 'Prineor Journey' | 'Marketing' | 'Business' | 'Personal Journey' | 'UI/UX' | string;
  image: string;
  author?: string;
  authorRole?: string;
  tags: string[];
  isPublished?: boolean;
  status?: 'Published' | 'Draft';
  isFeatured?: boolean;
  featured?: boolean;
  readingTimeMinutes?: number;
  views?: number;
  seoTitle?: string;
  seoDescription?: string;
  socialShareImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  icon: string;
  badge?: string;
  description?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Workspace' | 'Web Projects' | 'Design Work' | 'Behind the Scenes' | 'Events' | 'Professional Photos' | 'Branding' | 'WordPress' | 'AI' | 'Marketing' | string;
  image: string;
  aspect: 'landscape' | 'portrait' | 'square';
  caption: string;
  isFeatured?: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: string;
  description?: string;
}

export interface AboutConfig {
  title?: string;
  subtitle?: string;
  portraitImage?: string;
  introHeading?: string;
  introSubheading?: string;
  biography?: string;
  vision?: string;
  mission?: string;
  values?: { title: string; desc: string }[];
}

export interface HeroConfig {
  badgeText: string;
  heading: string;
  subheading: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  heroImage: string;
  statusBadge: string;
}

export interface HiringConfig {
  isHiringOpen: boolean;
  heading: string;
  description: string;
  positions: (HiringPosition | string)[];
  availablePositions?: HiringPosition[];
  notHiringNote: string;
  applicationEmail: string;
}

export interface PartnerCTAConfig {
  isEnabled: boolean;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface LearningSectionConfig {
  isEnabled: boolean;
  title: string;
  description: string;
  youtubeUrl: string;
  buttonText: string;
}

export interface AppearanceConfig {
  accentColor: string;
  goldIntensity: number;
  glassBlur: number;
  glassTransparency: number;
  borderRadius: number;
  animationsEnabled: boolean;
  cursorEffectEnabled: boolean;
}

export interface PageSEOItem {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: 'index, follow' | 'noindex, nofollow' | string;
}

export interface GeneralSettingsConfig {
  brandName: string;
  siteName?: string;
  siteTitle?: string;
  siteDescription?: string;
  siteUrl?: string;
  logoText: string;
  logoUrl?: string;
  tagline?: string;
  faviconUrl: string;
  primaryEmail: string;
  phone: string;
  location: string;
  copyrightText: string;
  defaultAuthor?: string;
  defaultLanguage?: string;
  seoTitle: string;
  seoDescription: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultSocialImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterHandle?: string;
  author?: string;
  robots?: 'index, follow' | 'noindex, nofollow' | 'index, nofollow' | 'noindex, follow' | string;
  googleAnalyticsId?: string;
  defaultCtaText: string;
  pageSeo?: {
    home?: PageSEOItem;
    about?: PageSEOItem;
    story?: PageSEOItem;
    projects?: PageSEOItem;
    services?: PageSEOItem;
    skills?: PageSEOItem;
    experience?: PageSEOItem;
    blog?: PageSEOItem;
    links?: PageSEOItem;
    gallery?: PageSEOItem;
    contact?: PageSEOItem;
    partner?: PageSEOItem;
    hiring?: PageSEOItem;
    [key: string]: PageSEOItem | undefined;
  };
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  category: 'Hero' | 'Projects' | 'Blog' | 'Gallery' | 'General';
  dateAdded: string;
  size?: string;
}

export interface CMSData {
  hero: HeroConfig;
  stats: StatItem[];
  brand: PersonalBrandConfig;
  about?: AboutConfig;
  services: ServiceItem[];
  projects: ProjectCaseStudy[];
  hiring: HiringConfig;
  partner: PartnerCTAConfig;
  learning: LearningSectionConfig;
  timeline: TimelineItem[];
  experienceTimeline?: TimelineItem[];
  story?: { 
    title?: string;
    subtitle?: string;
    paragraphs: string[]; 
    heroImage: string; 
    milestones?: TimelineItem[] 
  };
  testimonials?: Testimonial[];
  skillCategories?: SkillCategory[];
  techStack?: TechStackItem[];
  contact?: {
    heading?: string;
    subheading?: string;
    email: string;
    phone: string;
    location: string;
    availability: string;
    faqs: { question?: string; answer?: string; q?: string; a?: string }[];
  };
  careers?: {
    isHiringOpen: boolean;
    positions: string[];
    note: string;
  };
  blog: BlogPost[];
  blogs?: BlogPost[];
  gallery: GalleryItem[];
  socials: SocialLink[];
  appearance: AppearanceConfig;
  settings: GeneralSettingsConfig;
  media: MediaAsset[];
}

export interface PersonalBrandConfig {
  name: string;
  initials: string;
  foundingYear: string;
  badgeText: string;
  roles: string[];
  shortBio: string;
  fullBio: string;
  bio?: string;
  portraitImage?: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  philosophy: string;
  vision: string;
  mission: string;
  foundersBadge?: string;
  foundersTitle?: string;
  foundersSubtitle?: string;
  youtubeUrl: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  instagramUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  values: { title: string; desc: string }[];
}

