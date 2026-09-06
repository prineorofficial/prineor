import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { PageTab, ProjectCaseStudy, BlogPost } from '../types';

interface SEOHeadProps {
  activeTab: PageTab;
  selectedProject?: ProjectCaseStudy | null;
  selectedArticle?: BlogPost | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  activeTab,
  selectedProject,
  selectedArticle
}) => {
  const { cmsData } = useCMS();
  const settings = cmsData.settings || {};
  const brand = cmsData.brand || {};

  useEffect(() => {
    // 1. Core Brand & Site Variables
    const siteName = settings.siteName || brand.name || 'Prineor';
    const canonicalBase = (settings.siteUrl || settings.canonicalUrl || 'https://prineor.com').replace(/\/$/, '');
    const defaultAuthor = settings.defaultAuthor || settings.author || 'Prineor Founders';
    const defaultLanguage = settings.defaultLanguage || 'en';
    const defaultSocialImage = settings.defaultSocialImage || settings.ogImage || brand.portraitImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop';
    
    // Set HTML lang attribute
    document.documentElement.lang = defaultLanguage;

    // Default Fallbacks
    let title = settings.defaultSeoTitle || settings.metaTitle || settings.siteTitle || `${siteName} — Growing Digital Brand | WordPress & AI`;
    let description = settings.defaultSeoDescription || settings.metaDescription || settings.siteDescription || settings.seoDescription || brand.shortBio || 'Prineor is a growing digital brand founded in 2026. Turning ideas into meaningful digital experiences through WordPress Web Development, AI Development, Graphic Design, and Digital Marketing.';
    let keywords = settings.metaKeywords || 'Prineor, Web Development, WordPress Development, AI Development, Digital Marketing, Graphic Design, Social Media Services, UI UX Design';
    let ogImage = defaultSocialImage;
    let currentUrl = `${canonicalBase}/`;
    let robots = settings.robots || 'index, follow';
    let schemaType = 'WebSite';
    let breadcrumbItems: { name: string; url: string }[] = [{ name: 'Home', url: `${canonicalBase}/` }];
    let customSchema: any = null;

    // 2. Route & Modal Specific Resolutions
    if (activeTab === '404') {
      title = `404 — Page Not Found | ${siteName}`;
      description = 'The requested page could not be found. Return to the Prineor homepage or explore our projects.';
      robots = 'noindex, nofollow';
      currentUrl = window.location.href;
    } else if (selectedArticle) {
      // Blog / Journal Post SEO
      const isDraft = selectedArticle.status === 'Draft' || selectedArticle.isPublished === false;
      title = selectedArticle.seoTitle || `${selectedArticle.title} | ${siteName} Journal`;
      description = selectedArticle.seoDescription || selectedArticle.excerpt || description;
      ogImage = selectedArticle.socialShareImage || selectedArticle.image || defaultSocialImage;
      currentUrl = `${canonicalBase}/blog/${selectedArticle.slug || selectedArticle.id}`;
      keywords = selectedArticle.tags && selectedArticle.tags.length > 0 ? selectedArticle.tags.join(', ') : keywords;
      robots = isDraft ? 'noindex, nofollow' : (settings.robots || 'index, follow');
      schemaType = 'BlogPosting';

      breadcrumbItems = [
        { name: 'Home', url: `${canonicalBase}/` },
        { name: 'Journal', url: `${canonicalBase}/blog` },
        { name: selectedArticle.title, url: currentUrl }
      ];

      customSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': selectedArticle.title,
        'description': description,
        'image': ogImage,
        'author': {
          '@type': 'Person',
          'name': selectedArticle.author || defaultAuthor
        },
        'publisher': {
          '@type': 'Organization',
          'name': siteName,
          'url': canonicalBase,
          'logo': {
            '@type': 'ImageObject',
            'url': defaultSocialImage
          }
        },
        'datePublished': selectedArticle.createdAt || selectedArticle.date || '2026-01-01',
        'dateModified': selectedArticle.updatedAt || selectedArticle.date || new Date().toISOString(),
        'mainEntityOfPage': currentUrl
      };
    } else if (selectedProject) {
      // Project Case Study SEO
      const isDraft = selectedProject.visibility === 'Draft' || selectedProject.isPublished === false;
      title = selectedProject.seo?.title || `${selectedProject.title} — Case Study | ${siteName}`;
      description = selectedProject.seo?.description || selectedProject.shortDescription || description;
      ogImage = selectedProject.seo?.ogImage || selectedProject.image || defaultSocialImage;
      currentUrl = `${canonicalBase}/projects/${selectedProject.slug || selectedProject.id}`;
      keywords = selectedProject.tags && selectedProject.tags.length > 0 ? selectedProject.tags.join(', ') : keywords;
      robots = isDraft ? 'noindex, nofollow' : (settings.robots || 'index, follow');
      schemaType = 'CreativeWork';

      breadcrumbItems = [
        { name: 'Home', url: `${canonicalBase}/` },
        { name: 'Projects', url: `${canonicalBase}/projects` },
        { name: selectedProject.title, url: currentUrl }
      ];

      customSchema = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        'name': selectedProject.title,
        'headline': selectedProject.subtitle || selectedProject.title,
        'description': description,
        'image': ogImage,
        'author': {
          '@type': 'Organization',
          'name': siteName,
          'url': canonicalBase
        },
        'url': currentUrl
      };
    } else {
      // Standard Public Page SEO
      const pageKey = activeTab as string;
      const pageSeoItem = settings.pageSeo && settings.pageSeo[pageKey];

      currentUrl = pageKey === 'home' ? `${canonicalBase}/` : `${canonicalBase}/${pageKey}`;

      if (pageSeoItem) {
        if (pageSeoItem.title) title = pageSeoItem.title;
        if (pageSeoItem.description) description = pageSeoItem.description;
        if (pageSeoItem.keywords) keywords = pageSeoItem.keywords;
        if (pageSeoItem.ogImage) ogImage = pageSeoItem.ogImage;
        if (pageSeoItem.canonicalUrl) currentUrl = pageSeoItem.canonicalUrl;
        if (pageSeoItem.robots) robots = pageSeoItem.robots;
      } else {
        // Natural Default Page Titles if not overridden
        const pageTitles: Record<string, string> = {
          home: `${siteName} — Growing Digital Brand | WordPress & AI`,
          about: `About Us — Founders & Vision | ${siteName}`,
          story: `Our Story & Genesis — Founded in 2026 | ${siteName}`,
          services: `Services — WordPress, AI, Design & Marketing | ${siteName}`,
          skills: `Skills & Tech Stack — Prineor Digital Solutions`,
          experience: `Experience & Milestones | ${siteName}`,
          projects: `Projects & Case Studies | ${siteName}`,
          blog: `Journal & Insights — Tech & WordPress | ${siteName}`,
          gallery: `Studio Gallery & Showcase | ${siteName}`,
          contact: `Contact Us & Inquiries | ${siteName}`,
          apply: `Hiring & Careers — Join Our Team | ${siteName}`,
          links: `Direct Links & Official Channels | ${siteName}`
        };

        if (pageTitles[pageKey]) {
          title = pageTitles[pageKey];
        }
      }

      if (pageKey !== 'home') {
        const pageLabel = pageKey.charAt(0).toUpperCase() + pageKey.slice(1);
        breadcrumbItems = [
          { name: 'Home', url: `${canonicalBase}/` },
          { name: pageLabel, url: currentUrl }
        ];
      }
    }

    // 3. Set Document Title
    document.title = title;

    // Helper functions for meta and link manipulation
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 4. Update Standard Search Engine Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', defaultAuthor);
    setMetaTag('name', 'robots', robots);
    setLinkTag('canonical', currentUrl);

    // 5. Update Favicon if custom favicon specified
    if (settings.faviconUrl) {
      setLinkTag('icon', settings.faviconUrl);
    }

    // 6. Update Open Graph (OG) Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', schemaType === 'BlogPosting' ? 'article' : 'website');
    setMetaTag('property', 'og:site_name', siteName);

    // 7. Update Twitter / X Summary Large Image Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:creator', settings.twitterHandle || '@Prineorofficial');

    // 8. Generate Multi-Object Schema.org JSON-LD Graph
    let scriptTag = document.querySelector('#prineor-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'prineor-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const breadcrumbListSchema = {
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    };

    const organizationSchema = {
      '@type': 'Organization',
      'name': siteName,
      'url': canonicalBase,
      'logo': defaultSocialImage,
      'foundingDate': '2026',
      'description': description,
      'email': brand.email || settings.primaryEmail || 'prineorofficial@gmail.com',
      'sameAs': (cmsData.socials || [])
        .filter(s => s.url)
        .map(s => s.url)
    };

    const websiteSchema = {
      '@type': 'WebSite',
      'name': siteName,
      'url': canonicalBase,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${canonicalBase}/projects?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    const schemaGraph = [
      organizationSchema,
      websiteSchema,
      breadcrumbListSchema,
      ...(customSchema ? [customSchema] : [])
    ];

    scriptTag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemaGraph
    });

  }, [
    activeTab, 
    selectedProject, 
    selectedArticle, 
    cmsData.settings, 
    cmsData.brand, 
    cmsData.socials
  ]);

  return null;
};
