// src/utils/headManager.ts

import { useEffect } from 'react';

// Declare global function type for TypeScript
// This ensures TypeScript knows 'window.getPrerenderLiveBaseUrl' exists
declare global {
  interface Window {
    getPrerenderLiveBaseUrl?: () => string;
  }
}

// Helper function to get full logo URL (unified logic)
const BACKEND_URL = "https://eragon-backend1.onrender.com";

const getFullLogoUrl = (logoPath?: string | null) => {
  if (logoPath) {
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    if (logoPath.startsWith('/')) {
        return `${BACKEND_URL}${logoPath}`;
    }
    return `${BACKEND_URL}/${logoPath}`;
  }
  return undefined;
};

interface HeadConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;       // This will now be explicitly passed from the component
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string; // This will now be explicitly passed from the component
  // We don't need baseLiveUrl directly in HeadConfig anymore,
  // as the page components will calculate the full URL and pass it to ogUrl/canonicalUrl.
}

export const usePageHead = (config: HeadConfig) => {
  useEffect(() => {
    // Determine the actual URL for ogUrl/canonicalUrl based on config.ogUrl/canonicalUrl
    // If provided in config, use that. Otherwise, fall back to window.location.href (for client-side)
    const currentAbsoluteUrl = config.ogUrl || config.canonicalUrl || window.location.href;

    document.title = config.title;

    let descriptionTag = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', config.description);

    const updateOrCreateMeta = (property: string, content?: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      if (content) {
        tag.setAttribute('content', content);
      } else {
        tag.remove();
      }
    };

    updateOrCreateMeta('og:title', config.ogTitle || config.title);
    updateOrCreateMeta('og:description', config.ogDescription || config.description);
    updateOrCreateMeta('og:image', config.ogImage ? getFullLogoUrl(config.ogImage) : undefined);
    // --- CHANGE: Use config.ogUrl if provided, else currentAbsoluteUrl ---
    updateOrCreateMeta('og:url', config.ogUrl || currentAbsoluteUrl);
    // --- END CHANGE ---
    updateOrCreateMeta('og:type', config.ogType || 'website');

    updateOrCreateMeta('twitter:card', config.twitterCard || 'summary_large_image');
    updateOrCreateMeta('twitter:title', config.twitterTitle || config.title);
    updateOrCreateMeta('twitter:description', config.twitterDescription || config.description);
    updateOrCreateMeta('twitter:image', config.twitterImage ? getFullLogoUrl(config.twitterImage) : (config.ogImage ? getFullLogoUrl(config.ogImage) : undefined));

    let keywordsTag = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!keywordsTag) {
      keywordsTag = document.createElement('meta');
      keywordsTag.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsTag);
    }
    if (config.keywords) {
      keywordsTag.setAttribute('content', config.keywords);
    } else {
      keywordsTag.remove();
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    // --- CHANGE: Use config.canonicalUrl if provided, else currentAbsoluteUrl ---
    if (config.canonicalUrl) {
      canonicalLink.setAttribute('href', config.canonicalUrl);
    } else {
      canonicalLink.setAttribute('href', currentAbsoluteUrl);
    }
    // --- END CHANGE ---

    return () => {
      const propertiesToRemove = [
        'og:title', 'og:description', 'og:image', 'og:url', 'og:type',
        'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image',
        'keywords'
      ];

      propertiesToRemove.forEach(prop => {
        const tag = document.head.querySelector(`meta[property="${prop}"]`) || document.head.querySelector(`meta[name="${prop}"]`);
        if (tag) tag.remove();
      });

      const canonicalToRemove = document.head.querySelector('link[rel="canonical"]');
      if (canonicalToRemove) canonicalToRemove.remove();
    };
  }, [config]);
};