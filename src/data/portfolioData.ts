import { 
  ProjectCaseStudy, 
  ServiceItem, 
  SkillCategory, 
  TechStackItem, 
  TimelineItem, 
  BlogPost, 
  SocialLink, 
  GalleryItem, 
  Testimonial, 
  PersonalBrandConfig 
} from '../types';

import heroPortraitWebp from '../assets/images/hero_crystal_portrait.webp';
import crystalPrismWebp from '../assets/images/crystal_diamond_prism.webp';
import deskWorkspaceWebp from '../assets/images/luxury_desk_workspace.webp';

// Asset paths with optimized modern formats
export const ASSETS = {
  heroPortrait: heroPortraitWebp,
  heroWorkspace: deskWorkspaceWebp,
  crystalPrism: crystalPrismWebp,
  deskWorkspace: deskWorkspaceWebp,
  mockupMinimalist: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
  mockupDarkPro: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  workspace1: deskWorkspaceWebp,
  workspace2: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
  workspace3: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
};

export const defaultBrandConfig: PersonalBrandConfig = {
  name: 'PRINEOR',
  initials: 'P',
  foundingYear: '2026',
  badgeText: 'STARTED IN 2026 • BUILDING & GROWING',
  roles: [
    'Web Development with WordPress',
    'AI Development',
    'Graphic Designing',
    'Digital Marketing',
    'Social Media Services'
  ],
  shortBio: 'Prineor started in 2026 and is currently growing through continuous learning, practical projects, experimentation, and improvement. We turn ideas into meaningful digital experiences through Web Development with WordPress, AI Development, Graphic Designing, Digital Marketing, and Social Media Services.',
  fullBio: 'We are Prineor. We are the owners and founders of Prineor. Prineor started in 2026 and is currently growing through continuous learning, practical projects, experimentation, and improvement. We are somewhat experienced through our projects and practical work, but we are still learning, improving, and building every single day.',
  email: 'prineorofficial@gmail.com',
  phone: 'Phone — Coming Soon',
  location: 'Global / Digital',
  availability: 'Open for Partnerships & Projects',
  philosophy: 'Prineor is not just a portfolio. It is a brand we are building. Every project is an opportunity to learn, improve, experiment, and create real, practical value for people and businesses.',
  vision: 'To build Prineor into a strong and meaningful digital brand.',
  mission: 'Our mission is to grow Prineor into a strong and trusted digital brand by creating useful digital experiences, exploring AI-powered solutions, providing creative digital services, and continuously learning and improving.',
  youtubeUrl: 'https://www.youtube.com/@Prineorofficial',
  tiktokUrl: 'https://www.tiktok.com/@prineorofficial?_r=1&_d=el389ac4d3i9b1&sec_uid=MS4wLjABAAAAdjU5U_8QBiSk1B5XoMgQ_uzspB2E50ajsFnG0u-lqcFZHR3xCz7U-ueG_ycpxoGM&share_author_id=7659316646536496131&sharer_language=en&source=h5_m&u_code=f4bf5hmil09jl2&timestamp=1786120395&user_id=7659316646536496131&sec_user_id=MS4wLjABAAAAdjU5U_8QBiSk1B5XoMgQ_uzspB2E50ajsFnG0u-lqcFZHR3xCz7U-ueG_ycpxoGM&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7669315824654370578&share_link_id=95126597-404f-4d68-907e-2d20066b02a6&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb4907&social_share_type=5&share_enter_from=settings_page&item_author_type=1&enable_checksum=1',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61591642935337&mibextid=ZbWKwL',
  instagramUrl: 'https://www.instagram.com/prineorofficial?igsh=eGhvd3IxdGM3NzY=',
  githubUrl: 'https://github.com/prineorofficial',
  linkedinUrl: 'https://linkedin.com/company/prineorofficial',
  twitterUrl: 'https://twitter.com/prineorofficial',
  values: [
    { 
      title: 'Curiosity & Continuous Learning', 
      desc: 'We stay hungry, experiment daily, and embrace new technologies like AI to constantly expand our capabilities.' 
    },
    { 
      title: 'Honest Craftsmanship', 
      desc: 'No fabricated claims or inflated metrics — just authentic dedication, thoughtful design, and practical solutions.' 
    },
    { 
      title: 'Practical Value Creation', 
      desc: 'Every website, tool, or design we create is crafted to solve real problems and deliver meaningful value.' 
    },
    { 
      title: 'Long-Term Brand Vision', 
      desc: 'We are building Prineor step by step into a strong, reliable, and trusted digital brand.' 
    }
  ]
};

export const statisticsData = [
  { value: '8+', label: 'Projects Built — and the journey continues.', icon: 'Layers' },
  { value: 'Pending', label: 'Clients — Coming Soon', icon: 'Sparkles' },
  { value: '2026', label: 'Brand Genesis', icon: 'CheckCircle2' },
  { value: 'Active', label: 'Learning & Growing', icon: 'TrendingUp' }
];

export const quoteData = {
  quote: "Prineor is not just a portfolio. It is a brand we are building.",
  author: "Prineor Team"
};

export const featuredProjects: ProjectCaseStudy[] = [
  {
    id: 'stellar-ui',
    number: '01',
    title: 'Stellar UI',
    subtitle: 'SaaS Dashboard Platform',
    category: 'UI/UX',
    tags: ['UI/UX Design', 'Web App', 'React', 'Analytics'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    mockupType: 'dashboard',
    shortDescription: 'Modern dashboard platform engineered with crystal glass visuals, responsive data widgets, and modular component architecture.',
    overview: 'Stellar UI is a modern analytics interface exploration built by Prineor. It demonstrates how clean data visualization and elegant glassmorphic design create an intuitive user experience.',
    problem: 'Traditional dashboards often suffer from dense clutter, poor mobile responsiveness, and confusing visual hierarchies.',
    solution: 'Designed and engineered a modular UI system with custom glass styling, balanced spacing, and interactive data filtering.',
    role: 'UI/UX Design & Frontend Development',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide Icons'],
    process: [
      { step: '01', title: 'Layout Architecture', description: 'Mapped primary KPI metrics and created clean visual hierarchies.' },
      { step: '02', title: 'Glass Design System', description: 'Developed reusable UI components with subtle depth and smooth hover states.' },
      { step: '03', title: 'Interactive Prototyping', description: 'Connected dynamic state filters for instant data switching.' },
      { step: '04', title: 'Responsive Polish', description: 'Tested across mobile, tablet, and widescreen viewports for optimal rendering.' }
    ],
    features: [
      'Responsive telemetry cards with smooth visual transitions',
      'Modular layout adaptable for financial or operational data',
      'High-contrast typography for effortless scanning',
      'Crystal glass aesthetics paired with warm champagne accents'
    ],
    results: [
      { metric: '100%', label: 'Responsive Layout' },
      { metric: '0.6s', label: 'Instant Render Time' },
      { metric: '100%', label: 'Component Reusability' }
    ],
    challenges: 'Ensuring fluid glass backdrop filters across various browsers while maintaining accessibility contrast.',
    liveDemoUrl: 'https://example.com/stellar-ui',
    githubUrl: '[PRINEOR GITHUB LINK]'
  },
  {
    id: 'elevate-ai',
    number: '02',
    title: 'Elevate AI',
    subtitle: 'AI-Powered Digital Assistant',
    category: 'AI Development',
    tags: ['AI Development', 'Web App', 'LLM Tools', 'Automation'],
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop',
    mockupType: 'laptop',
    shortDescription: 'Intelligent conversational assistant and automated workflow interface built to streamline digital tasks and content exploration.',
    overview: 'Elevate AI explores the practical application of modern LLMs in day-to-day productivity, combining clean conversational UX with smart contextual prompts.',
    problem: 'Many AI interfaces are either too bare or too complex for standard everyday users looking for quick, accurate assistance.',
    solution: 'Engineered a focused, elegant web interface that makes querying and automating tasks straightforward and enjoyable.',
    role: 'AI Prompt Engineering & Web Development',
    technologies: ['Gemini API', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    process: [
      { step: '01', title: 'User Flow Mapping', description: 'Identified the most common AI assistance workflows.' },
      { step: '02', title: 'Prompt Structuring', description: 'Created contextual prompt templates for clear and reliable outputs.' },
      { step: '03', title: 'Interface Build', description: 'Crafted a distraction-free glass chat canvas with real-time feedback.' },
      { step: '04', title: 'Testing & Refinement', description: 'Iterated on response formatting and mobile touch interactions.' }
    ],
    features: [
      'Clean streaming conversational UI with quick-action prompt chips',
      'Context-aware assistant for writing, coding, and marketing ideation',
      'Saved history scratchpad for easy reference',
      'Seamless responsive layout on desktop and mobile'
    ],
    results: [
      { metric: 'Instant', label: 'Prompt Response UX' },
      { metric: '100%', label: 'Mobile Optimized' },
      { metric: 'Practical', label: 'Daily Utility' }
    ],
    challenges: 'Formatting rich markdown and code blocks cleanly within compact mobile screens.',
    liveDemoUrl: 'https://example.com/elevate-ai',
    githubUrl: '[PRINEOR GITHUB LINK]'
  },
  {
    id: 'brandify',
    number: '03',
    title: 'Brandify Hub',
    subtitle: 'Marketing & Social Media Dashboard',
    category: 'Digital Marketing',
    tags: ['Digital Marketing', 'Social Media', 'Analytics', 'Strategy'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    mockupType: 'mobile',
    shortDescription: 'Integrated social media campaign planner and growth tracking dashboard for modern digital brands.',
    overview: 'Brandify Hub was built to help creators and businesses plan content calendars, track engagement trends, and optimize digital marketing efforts across channels.',
    problem: 'Managing multiple social accounts without a unified plan leads to inconsistent posting and missed audience growth.',
    solution: 'Designed an all-in-one planning board that organizes posts, tracks key metrics, and outlines campaign schedules.',
    role: 'Marketing Strategy & UI/UX Design',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Analytics'],
    process: [
      { step: '01', title: 'Strategy Framework', description: 'Defined the core metrics needed for effective social media growth.' },
      { step: '02', title: 'Wireframing', description: 'Drafted calendar views, asset libraries, and metric cards.' },
      { step: '03', title: 'Dashboard Implementation', description: 'Built an interactive React interface with filterable content queues.' },
      { step: '04', title: 'Optimization', description: 'Polished visuals to give the interface an inspiring, modern feel.' }
    ],
    features: [
      'Visual content calendar with drag-and-drop planning concepts',
      'Engagement overview across Instagram, YouTube, X, and LinkedIn',
      'Content ideation and viral hook library',
      'Campaign performance summary cards'
    ],
    results: [
      { metric: 'Unified', label: 'Multi-Channel View' },
      { metric: 'Clean', label: 'Visual Workflow' },
      { metric: 'Organized', label: 'Content Strategy' }
    ],
    challenges: 'Creating an intuitive calendar grid that remains legible and easy to use on mobile devices.',
    liveDemoUrl: 'https://example.com/brandify',
    githubUrl: '[PRINEOR GITHUB LINK]'
  },
  {
    id: 'prism-cms',
    number: '04',
    title: 'Prism WordPress Studio',
    subtitle: 'Custom WordPress & Web Design',
    category: 'Web Development',
    tags: ['WordPress', 'Web Design', 'SEO', 'Responsive'],
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop',
    mockupType: 'laptop',
    shortDescription: 'Custom WordPress website design crafted with clean styling, responsive layouts, and seamless content management.',
    overview: 'A custom WordPress project showcasing how thoughtful design and structured CMS configuration make publishing effortless for business owners.',
    problem: 'Generic WordPress themes are often bloated, slow, and hard to customize without breaking layouts.',
    solution: 'Created a lightweight custom theme structure with customized block templates and optimized assets.',
    role: 'WordPress Developer & Web Designer',
    technologies: ['WordPress', 'PHP', 'HTML5', 'CSS3', 'JavaScript'],
    process: [
      { step: '01', title: 'Brand Discovery', description: 'Understood visual style preferences and content requirements.' },
      { step: '02', title: 'Custom Theme Setup', description: 'Built a clean template structure avoiding unnecessary plugin bloat.' },
      { step: '03', title: 'Content Integration', description: 'Structured pages for services, portfolio, and contact forms.' },
      { step: '04', title: 'Speed & SEO Audit', description: 'Optimized image delivery, caching, and metadata.' }
    ],
    features: [
      'Custom block layouts tailored for easy editing',
      'Fast page load speeds with zero unnecessary plugins',
      'Mobile-first responsive navigation',
      'Built-in contact form integration and SEO metadata'
    ],
    results: [
      { metric: 'Fast', label: 'Load Performance' },
      { metric: 'Easy', label: 'Content Management' },
      { metric: '100%', label: 'Responsive Design' }
    ],
    challenges: 'Keeping the WordPress backend intuitive for non-technical editors while preserving bespoke frontend styling.',
    liveDemoUrl: 'https://example.com/prism-cms',
    githubUrl: '[PRINEOR GITHUB LINK]'
  },
  {
    id: 'social-growth-lab',
    number: '05',
    title: 'Social Growth Strategy Lab',
    subtitle: 'Content Architecture & Brand Positioning',
    category: 'Social Media',
    tags: ['Social Media', 'Strategy', 'Branding', 'Content'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    mockupType: 'dual',
    shortDescription: 'Comprehensive social media strategy framework designed to build genuine audience engagement and brand authority.',
    overview: 'A documented social media playbook exploring hook formats, visual branding consistency, and multi-platform distribution strategies for growing digital brands.',
    problem: 'Businesses struggle to maintain consistent social presence and often post without clear objectives.',
    solution: 'Formulated a step-by-step strategy framework with thematic content pillars and repeatable creation workflows.',
    role: 'Social Media Strategist & Content Creator',
    technologies: ['Content Strategy', 'Canva/Figma', 'Copywriting', 'Analytics'],
    process: [
      { step: '01', title: 'Audience Research', description: 'Mapped target audience interests, questions, and pain points.' },
      { step: '02', title: 'Content Pillars', description: 'Established 4 core topics: Educational, Behind-the-Scenes, Project Showcases, and Tips.' },
      { step: '03', title: 'Visual Template Kit', description: 'Designed cohesive graphic templates matching the brand aesthetic.' },
      { step: '04', title: 'Distribution Workflow', description: 'Set up cross-posting workflows for YouTube, X, Instagram, and LinkedIn.' }
    ],
    features: [
      'Content calendar roadmap with ready-to-use topic prompts',
      'Visual template kit for carousels and highlight covers',
      'Hook swipe file for engaging opening lines',
      'Engagement tracking guidelines'
    ],
    results: [
      { metric: '4 Pillars', label: 'Content Framework' },
      { metric: 'Consistent', label: 'Brand Voice' },
      { metric: 'Actionable', label: 'Growth Plan' }
    ],
    challenges: 'Balancing educational value with engaging, quick-to-consume visual formats.',
    liveDemoUrl: 'https://example.com/social-lab',
    githubUrl: '[PRINEOR GITHUB LINK]'
  },
  {
    id: 'pulse-seo',
    number: '06',
    title: 'Pulse Digital Strategy',
    subtitle: 'SEO & Content Optimization System',
    category: 'Branding',
    tags: ['Digital Strategy', 'SEO', 'Web Design', 'Growth'],
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop',
    mockupType: 'dashboard',
    shortDescription: 'Modern digital strategy and website optimization system focusing on organic reach and clear brand messaging.',
    overview: 'A digital strategy project showing how technical SEO foundations and crystal-clear copywriting combine to elevate brand credibility.',
    problem: 'Websites often look good but lack clear messaging and fail to appear in search engine results.',
    solution: 'Implemented structured on-page SEO, optimized semantic markup, and crafted high-converting hero messaging.',
    role: 'Digital Strategist & Web Developer',
    technologies: ['SEO Audit', 'Semantic HTML', 'Copywriting', 'Analytics'],
    process: [
      { step: '01', title: 'Content Audit', description: 'Analyzed on-page structure and identified keyword opportunities.' },
      { step: '02', title: 'Copy Optimization', description: 'Refined headings and paragraphs for clarity and search intent.' },
      { step: '03', title: 'Technical SEO', description: 'Structured metadata, OpenGraph tags, and sitemaps.' },
      { step: '04', title: 'Performance Review', description: 'Monitored indexation and page speed metrics.' }
    ],
    features: [
      'Clear value proposition and messaging hierarchy',
      'Semantic schema markup for search engines',
      'Fast-loading assets and optimized media',
      'Direct call-to-action pathways for visitors'
    ],
    results: [
      { metric: 'Clear', label: 'Brand Messaging' },
      { metric: 'Optimized', label: 'Search Structure' },
      { metric: 'High', label: 'User Readability' }
    ],
    challenges: 'Writing concise, engaging copy while maintaining relevant search keywords naturally.',
    liveDemoUrl: 'https://example.com/pulse-seo',
    githubUrl: '[PRINEOR GITHUB LINK]'
  }
];

export const allServices: ServiceItem[] = [
  {
    id: 'wordpress-dev',
    title: 'Web Development with WordPress',
    shortDescription: 'Custom WordPress websites built with clean design, responsive layouts, fast loading speeds, and easy content management.',
    iconName: 'Layout',
    badge: 'Popular',
    benefits: [
      'Custom theme setup and tailored page templates',
      'Fast performance with clean, lightweight structure',
      'Simple, intuitive backend for effortless content updates',
      'Integrated contact forms, security basics, and SEO friendliness'
    ],
    process: [
      'Project discovery & requirement analysis',
      'Custom layout structure & design setup',
      'Content integration & plugin configuration',
      'Testing, speed optimization & launch'
    ],
    deliverables: ['Custom WordPress Website', 'Admin Guide & Walkthrough', 'Responsive Testing', 'Launch Support']
  },
  {
    id: 'ai-dev',
    title: 'AI Development',
    shortDescription: 'Building practical web tools and intelligent conversational interfaces powered by modern AI to assist and automate tasks.',
    iconName: 'Sparkles',
    badge: 'Innovative',
    benefits: [
      'Smart AI assistants and conversational interfaces',
      'Automated content generation and workflow tools',
      'Modern web frameworks (React, Vite, TypeScript)',
      'Practical AI integration tailored to your specific needs'
    ],
    process: [
      'Use-case identification & AI feasibility review',
      'Frontend interface design & API integration',
      'Prompt tuning & workflow automation',
      'Deployment, testing, and continuous improvement'
    ],
    deliverables: ['AI-Powered Web App', 'Interactive Chat/Tool UI', 'Prompt Configuration', 'Documentation']
  },
  {
    id: 'graphic-designing',
    title: 'Graphic Designing',
    shortDescription: 'Creative visual identity, modern branding assets, promotional graphics, and refined visual systems for digital brands.',
    iconName: 'Palette',
    badge: 'Creative',
    benefits: [
      'Distinctive visual identity that makes your brand stand out',
      'Carefully paired typography, color schemes, and icon styles',
      'Social media graphics, promotional banners, and visual assets',
      'High-resolution exports tailored for web and digital media'
    ],
    process: [
      'Visual moodboard & brand style exploration',
      'Concept drafting and asset design',
      'Refinements based on feedback',
      'Final visual asset delivery in required formats'
    ],
    deliverables: ['Brand Visual Assets', 'Social Media Templates', 'High-Res Graphics', 'Style Guidelines']
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    shortDescription: 'Data-informed marketing strategies that help brands reach their target audience, build awareness, and drive real results.',
    iconName: 'TrendingUp',
    benefits: [
      'Clear marketing roadmap tailored to your business goals',
      'Audience research and target persona definition',
      'Conversion-focused landing page guidance',
      'Performance tracking and actionable improvement insights'
    ],
    process: [
      'Brand & market opportunity analysis',
      'Strategy formulation & channel selection',
      'Campaign setup & asset creation',
      'Review, reporting, and strategy iteration'
    ],
    deliverables: ['Digital Marketing Roadmap', 'Campaign Setup Guide', 'Audience Strategy', 'Performance Report']
  },
  {
    id: 'social-media-services',
    title: 'Social Media Services',
    shortDescription: 'Managing and growing your social media presence with engaging posts, consistent posting, and active audience care.',
    iconName: 'Share2',
    badge: 'Growth',
    benefits: [
      'Consistent and visually appealing social presence',
      'Community engagement and follower interaction',
      'Content scheduling and platform management',
      'Monthly overview of reach and growth metrics'
    ],
    process: [
      'Profile setup & visual branding alignment',
      'Content planning & calendar preparation',
      'Publishing, caption writing, and engagement',
      'Monthly performance review and adjustments'
    ],
    deliverables: ['Monthly Content Calendar', 'Scheduled Social Posts', 'Community Engagement', 'Monthly Growth Report']
  }
];

export const skillCategories: SkillCategory[] = [
  {
    category: 'Core Disciplines',
    skills: [
      { name: 'Web Development', percentage: 90, level: 'Active Practice' },
      { name: 'WordPress Development', percentage: 88, level: 'Active Practice' },
      { name: 'AI Web Development', percentage: 85, level: 'Active Practice' },
      { name: 'UI/UX & Web Design', percentage: 88, level: 'Active Practice' }
    ]
  },
  {
    category: 'Marketing & Social',
    skills: [
      { name: 'Digital Marketing', percentage: 84, level: 'Active Practice' },
      { name: 'Social Media Strategy', percentage: 86, level: 'Active Practice' },
      { name: 'Content & Copywriting', percentage: 85, level: 'Active Practice' },
      { name: 'Brand Positioning', percentage: 82, level: 'Active Practice' }
    ]
  },
  {
    category: 'Frontend Technologies',
    skills: [
      { name: 'HTML5 & CSS3', percentage: 92, level: 'Proficient' },
      { name: 'JavaScript & TypeScript', percentage: 86, level: 'Proficient' },
      { name: 'React & Vite', percentage: 88, level: 'Proficient' },
      { name: 'Tailwind CSS', percentage: 90, level: 'Proficient' }
    ]
  },
  {
    category: 'AI, CMS & Tools',
    skills: [
      { name: 'Gemini & AI Workflows', percentage: 86, level: 'Active Practice' },
      { name: 'WordPress & CMS', percentage: 88, level: 'Proficient' },
      { name: 'Figma & Design Systems', percentage: 84, level: 'Proficient' },
      { name: 'Git & Deployment', percentage: 80, level: 'Active Practice' }
    ]
  }
];

export const techStack: TechStackItem[] = [
  { name: 'WordPress', category: 'CMS & Web', icon: 'Globe', color: '#21759B', description: 'Custom themes, block templates, responsive layout design & CMS management' },
  { name: 'React', category: 'Frontend', icon: 'Atom', color: '#61DAFB', description: 'Component-driven web applications with modern state and smooth interactions' },
  { name: 'TypeScript', category: 'Language', icon: 'Code', color: '#3178C6', description: 'Type-safe architecture ensuring robust and maintainable codebases' },
  { name: 'Tailwind CSS', category: 'Styling', icon: 'Sparkles', color: '#38B2AC', description: 'Utility-first CSS for sleek, glassmorphic, and responsive web styling' },
  { name: 'HTML5', category: 'Frontend', icon: 'FileCode2', color: '#E34F26', description: 'Semantic, accessible, and structured modern web foundations' },
  { name: 'CSS3', category: 'Styling', icon: 'Palette', color: '#1572B6', description: 'Modern CSS layouts, flexbox, grid, glass effects, and micro-animations' },
  { name: 'JavaScript', category: 'Frontend', icon: 'Code', color: '#F7DF1E', description: 'Modern ES6+ web functionality, dynamic DOM, and asynchronous workflows' },
  { name: 'Gemini AI', category: 'AI & Automation', icon: 'Sparkles', color: '#4285F4', description: 'Smart AI integrations, LLM workflows, and intelligent conversational tools' },
  { name: 'Node.js', category: 'Backend', icon: 'Server', color: '#339933', description: 'Server-side API routes, automated scripts, and lightweight microservices' },
  { name: 'Figma', category: 'Design', icon: 'Framer', color: '#F24E1E', description: 'UI/UX wireframing, high-fidelity mockups, and interactive design prototypes' },
  { name: 'SEO & Analytics', category: 'Marketing', icon: 'TrendingUp', color: '#FF9900', description: 'Technical on-page SEO, semantic metadata, and audience analytics' },
  { name: 'Git', category: 'DevOps', icon: 'GitBranch', color: '#F05032', description: 'Version control, continuous deployment, and collaborative project workflows' }
];

export const experienceTimeline: TimelineItem[] = [
  {
    year: '2026 — Genesis',
    title: 'Founding of Prineor',
    role: 'Founders & Digital Builders',
    organization: 'Prineor',
    description: 'Prineor was started in 2026 with a simple vision: to turn ideas into meaningful digital experiences. Focused on building modern websites, AI solutions, digital marketing, and social media services.',
    highlights: [
      'Established Prineor as an ambitious, growing digital brand.',
      'Developed core multidisciplinary service framework combining Web, AI, Marketing, and Social Media.',
      'Focused on honest craftsmanship, practical value, and continuous learning.'
    ],
    category: 'milestone'
  },
  {
    year: '2026 — Present',
    title: 'Practical Project Development & Partnerships',
    role: 'Web Developer & Digital Strategist',
    organization: 'Prineor Projects & Collaborations',
    description: 'Actively building custom websites, WordPress projects, AI tooling interfaces, and social media growth strategies for partners and personal brand initiatives.',
    highlights: [
      'Built and delivered modern responsive web experiences and custom WordPress setups.',
      'Explored and implemented practical AI web workflows using Gemini and modern APIs.',
      'Formulated structured social media strategies and visual branding systems.'
    ],
    category: 'experience'
  },
  {
    year: '2026 — Continuous',
    title: 'Skills Mastery & Brand Expansion',
    role: 'Continuous Learner & Creator',
    organization: 'Prineor Lab',
    description: 'Every project is an opportunity to learn, improve, experiment, and refine our skills while sharing what we learn on YouTube and social platforms.',
    highlights: [
      'Practicing new web technologies, AI integrations, and conversion strategies daily.',
      'Preparing educational tutorials and case study videos for our YouTube channel.',
      'Welcoming partners and collaborations to build meaningful digital solutions together.'
    ],
    category: 'experience'
  }
];

export const storyMilestones: TimelineItem[] = [
  {
    year: '2026',
    title: 'The Spark & Brand Genesis',
    role: 'Founders of Prineor',
    description: 'Prineor started in 2026 with a simple idea — to build something of our own and turn our skills, creativity, and curiosity into a real digital brand.',
    highlights: [
      'Created the Prineor identity founded on curiosity, honesty, and ambition.',
      'Defined our 8 core service disciplines across Web, AI, Marketing, and Social Media.'
    ],
    category: 'milestone'
  },
  {
    year: '2026',
    title: 'Learning, Experimenting & Building',
    role: 'Digital Creators & Developers',
    description: 'We are currently in our early stage, with practical experience while continuing to learn, improve, experiment, and build with every single project.',
    highlights: [
      'Developed modern React, Vite, and custom WordPress website solutions.',
      'Integrated AI models and smart features into real web interfaces.'
    ],
    category: 'milestone'
  },
  {
    year: '2026',
    title: 'Practical Projects & Expanding Services',
    role: 'Web & Digital Marketing Specialists',
    description: 'Turning ideas into real, functional digital projects for partners and clients who want to grow their online presence.',
    highlights: [
      'Delivered clean, high-performance websites with elegant design.',
      'Crafted social media roadmaps and content strategies.'
    ],
    category: 'milestone'
  },
  {
    year: '2026 & Beyond',
    title: 'The Vision: Growing Prineor into a Trusted Brand',
    role: 'Prineor Team',
    description: 'Our mission is to grow Prineor into a meaningful digital brand that creates useful websites, AI-powered solutions, marketing experiences, and digital services.',
    highlights: [
      'Continuously improving our skills and creating real value for people and businesses.',
      'Sharing our journey, tutorials, and practical knowledge with the community on YouTube.'
    ],
    category: 'milestone'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'building-prineor-2026',
    slug: 'building-prineor-the-journey-of-a-growing-digital-brand',
    title: 'Building Prineor: The Journey of a Growing Digital Brand',
    excerpt: 'How we started Prineor in 2026, why we combine Web Development, AI, and Marketing, and our vision for building something meaningful.',
    date: '2026',
    readTime: '4 min read',
    category: 'Personal Journey',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
    tags: ['Prineor', 'Brand Story', 'Vision', 'Growth'],
    content: `
### Prineor: Built With a Clear Vision

Prineor started in 2026 with a simple idea: **to build something of our own and turn our skills, creativity, and curiosity into a real brand**.

We believe that great digital experiences are not created by coding alone. A successful website requires a combination of:
1. **Modern Web Development** (clean code, speed, and responsiveness)
2. **Artificial Intelligence** (smart workflows, automation, and user assistance)
3. **Digital Marketing & Social Media Strategy** (reaching the right audience and building real trust)

#### Honest Ambition Over Fake Claims
We are at the beginning of our journey. We don't invent decades of experience or boast fake numbers. Instead, we let our work, our dedication, and our practical projects speak for themselves.

Every project we take on is an opportunity to learn, improve, experiment, and deliver real value.

#### What's Ahead for Prineor
Our mission is clear: to grow Prineor into a trusted digital brand that creates useful websites, AI-powered solutions, marketing experiences, and digital services while sharing what we learn along the way.
    `
  },
  {
    id: 'building-ai-websites-2026',
    slug: 'how-we-build-ai-powered-websites-in-2026',
    title: 'How We Build AI-Powered Websites in 2026',
    excerpt: 'A practical guide to integrating modern AI capabilities like Gemini into clean, responsive web applications.',
    date: '2026',
    readTime: '5 min read',
    category: 'AI',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
    tags: ['AI', 'Web Development', 'Gemini', 'Automation'],
    content: `
### Integrating AI Into Everyday Web Experiences

Artificial intelligence in 2026 is no longer just for big tech companies. With accessible APIs like Gemini, developers and creators can build smart, practical tools for everyday businesses.

#### 1. Focused Use-Cases
Instead of generic chatbots, we focus on specific practical tasks:
- Assisting users in finding the right service or product
- Automating repetitive data entry or content drafts
- Providing instant answers to customer questions

#### 2. Clean, Fast UI
AI features should feel effortless and responsive. By using modern tools like React and Vite with clean visual feedback, users get immediate value without waiting.

#### 3. Continuous Experimentation
We continuously experiment with new AI models and prompt techniques to make sure the solutions we build are both reliable and genuinely helpful.
    `
  },
  {
    id: 'wordpress-and-modern-web',
    slug: 'why-wordpress-remains-a-powerhouse-for-business-websites',
    title: 'Why WordPress Remains a Powerhouse for Business Websites',
    excerpt: 'How custom WordPress development provides the perfect balance of flexibility, client control, and modern design.',
    date: '2026',
    readTime: '4 min read',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop',
    tags: ['WordPress', 'Web Design', 'CMS', 'Small Business'],
    content: `
### The Real Strength of WordPress

When built cleanly without bloated plugins, WordPress offers business owners unmatched control over their content.

#### What Makes a Great WordPress Site:
- **Clean custom templates** rather than heavy multipurpose themes
- **Lightweight plugins** only where necessary for security and forms
- **Fast loading speeds** with optimized images and caching
- **Responsive design** that looks impeccable on phones and desktops

At Prineor, we build WordPress websites that empower business owners to update their content with ease while maintaining a bespoke, polished design.
    `
  },
  {
    id: 'social-media-growth-strategies',
    slug: 'social-media-strategies-that-actually-build-trust',
    title: 'Social Media Strategies That Actually Build Trust',
    excerpt: 'Why authenticity, consistent value, and clear content pillars outperform vanity follower tricks in 2026.',
    date: '2026',
    readTime: '5 min read',
    category: 'Social Media',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    tags: ['Social Media', 'Marketing', 'Content Strategy', 'Growth'],
    content: `
### Building Genuine Audience Resonance

In 2026, audiences can immediately sense generic or fake content. Real brand growth comes from sharing practical insights, behind-the-scenes progress, and genuine value.

#### 1. The Power of Thematic Pillars
Organize your posts into clear pillars:
- **Educational**: Share tips, tutorials, and practical insights
- **Behind the Scenes**: Show what you are building and learning
- **Project Showcases**: Demonstrate real work and outcomes
- **Community & Conversation**: Ask questions and engage genuinely

#### 2. Consistency Over Perfection
Showing up consistently with honest, helpful content builds long-term authority and turns casual viewers into loyal partners.
    `
  }
];

export const socialLinks: SocialLink[] = [
  { 
    platform: 'TikTok', 
    handle: '@prineorofficial', 
    url: 'https://www.tiktok.com/@prineorofficial?_r=1&_d=el389ac4d3i9b1&sec_uid=MS4wLjABAAAAdjU5U_8QBiSk1B5XoMgQ_uzspB2E50ajsFnG0u-lqcFZHR3xCz7U-ueG_ycpxoGM&share_author_id=7659316646536496131&sharer_language=en&source=h5_m&u_code=f4bf5hmil09jl2&timestamp=1786120395&user_id=7659316646536496131&sec_user_id=MS4wLjABAAAAdjU5U_8QBiSk1B5XoMgQ_uzspB2E50ajsFnG0u-lqcFZHR3xCz7U-ueG_ycpxoGM&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7669315824654370578&share_link_id=95126597-404f-4d68-907e-2d20066b02a6&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb4907&social_share_type=5&share_enter_from=settings_page&item_author_type=1&enable_checksum=1', 
    icon: 'Music2', 
    badge: 'Shorts & Insights', 
    description: 'Follow Prineor on TikTok for bite-sized tutorials, AI tips, design insights, and brand journey updates.' 
  },
  { 
    platform: 'Facebook', 
    handle: 'Prineor', 
    url: 'https://www.facebook.com/profile.php?id=61591642935337&mibextid=ZbWKwL', 
    icon: 'Share2', 
    badge: 'Community', 
    description: 'Connect with Prineor on Facebook for project announcements, community updates, and digital marketing tips.' 
  },
  { 
    platform: 'Instagram', 
    handle: '@prineorofficial', 
    url: 'https://www.instagram.com/prineorofficial?igsh=eGhvd3IxdGM3NzY=', 
    icon: 'Instagram', 
    badge: 'Visual Stories', 
    description: 'Behind-the-scenes glimpses into our design workflows, projects, and daily brand growth.' 
  },
  { 
    platform: 'YouTube', 
    handle: '@Prineorofficial', 
    url: 'https://www.youtube.com/@Prineorofficial', 
    icon: 'Youtube', 
    badge: 'Learn With Us', 
    description: 'Follow Prineor on YouTube to learn how to build websites with AI, see what we build, and grow your digital skills.' 
  },
  { 
    platform: 'Email', 
    handle: 'prineorofficial@gmail.com', 
    url: 'mailto:prineorofficial@gmail.com', 
    icon: 'Mail', 
    badge: 'Direct Contact', 
    description: 'Reach out to the Prineor founders directly for project proposals, questions, and partnerships.' 
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Workspace & Engineering Lab',
    category: 'Workspace',
    image: ASSETS.deskWorkspace,
    aspect: 'landscape',
    caption: 'Our modern workspace where we design, code, and experiment with new digital ideas.'
  },
  {
    id: 'gal-2',
    title: 'Stellar UI Dashboard Exploration',
    category: 'Web Projects',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    aspect: 'landscape',
    caption: 'Modular UI design and data layout exploration built with React and Tailwind.'
  },
  {
    id: 'gal-3',
    title: 'Crystal Prism Visual Study',
    category: 'Design Work',
    image: ASSETS.crystalPrism,
    aspect: 'square',
    caption: 'Exploring light, glassmorphism, and crystal aesthetics for the Prineor visual language.'
  },
  {
    id: 'gal-4',
    title: 'Elevate AI Interface Concept',
    category: 'Web Projects',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop',
    aspect: 'landscape',
    caption: 'Clean, distraction-free conversational canvas for practical AI workflows.'
  },
  {
    id: 'gal-5',
    title: 'Social Strategy & Campaign Planning',
    category: 'Design Work',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    aspect: 'portrait',
    caption: 'Mapping content calendar workflows and multi-channel marketing campaigns.'
  },
  {
    id: 'gal-6',
    title: 'Prineor Brand Identity Portrait',
    category: 'Professional Photos',
    image: ASSETS.heroPortrait,
    aspect: 'portrait',
    caption: 'Editorial studio portrait representing the ambitious, forward-looking spirit of Prineor.'
  },
  {
    id: 'gal-7',
    title: 'Strategy & Wireframing Session',
    category: 'Behind the Scenes',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    aspect: 'landscape',
    caption: 'Mapping user journeys, responsive website wireframes, and project architectures.'
  }
];

export const clientTestimonials: Testimonial[] = [
  {
    quote: "Working with Prineor was a refreshing experience. Their dedication, honest communication, and eye for clean web design helped bring our project to life exactly as we envisioned.",
    author: "Early Project Partner",
    role: "Founder",
    company: "Digital Partner Venture",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    rating: 5
  },
  {
    quote: "Prineor combines practical web development with thoughtful marketing strategy. They are ambitious, quick to learn, and genuinely care about the quality of what they build.",
    author: "Collaborative Creator",
    role: "Content Strategist",
    company: "Creative Studio Partner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    rating: 5
  },
  {
    quote: "The website they built for us is fast, modern, and easy to manage. Prineor is a brand with a bright future and a true passion for digital craftsmanship.",
    author: "Business Client",
    role: "Managing Director",
    company: "Modern Retail Brand",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    rating: 5
  }
];
