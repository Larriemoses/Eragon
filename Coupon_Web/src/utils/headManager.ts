// src/utils/headManager.ts

import { useEffect } from 'react';

// Helper function to get full logo URL (unified logic - copy from your existing utils)
// Ensure BACKEND_URL is defined here or imported consistently.
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
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string; // Optional: for canonical links
}

export const usePageHead = (config: HeadConfig) => {
  useEffect(() => {
    // Store original title to potentially restore it on unmount (less common in SPAs)
    // For SPAs, new component's useEffect will just overwrite.


    // --- Title ---
    document.title = config.title;

    // --- Meta Description ---
    let descriptionTag = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', config.description);

    // --- Open Graph Tags (for Social Media Sharing) ---
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
        tag.remove(); // Remove tag if content is empty or null
      }
    };

    updateOrCreateMeta('og:title', config.ogTitle || config.title);
    updateOrCreateMeta('og:description', config.ogDescription || config.description);
    // Ensure image URLs are full URLs
    updateOrCreateMeta('og:image', config.ogImage ? getFullLogoUrl(config.ogImage) : undefined);
    updateOrCreateMeta('og:url', config.ogUrl || window.location.href);
    updateOrCreateMeta('og:type', config.ogType || 'website');

    // --- Twitter Card Tags ---
    updateOrCreateMeta('twitter:card', config.twitterCard || 'summary_large_image');
    updateOrCreateMeta('twitter:title', config.twitterTitle || config.title);
    updateOrCreateMeta('twitter:description', config.twitterDescription || config.description);
    // Ensure image URLs are full URLs for Twitter
    updateOrCreateMeta('twitter:image', config.twitterImage ? getFullLogoUrl(config.twitterImage) : (config.ogImage ? getFullLogoUrl(config.ogImage) : undefined));


    // --- Canonical URL ---
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    if (config.canonicalUrl) {
      canonicalLink.setAttribute('href', config.canonicalUrl);
    } else {
      canonicalLink.remove(); // Remove canonical if not provided for the page
    }


    // Cleanup function: This is important!
    return () => {
      // For title and description, the next useEffect call will just overwrite them.
      // For other tags, we explicitly remove them.
      const propertiesToRemove = [
        'og:title', 'og:description', 'og:image', 'og:url', 'og:type',
        'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'
      ];

      propertiesToRemove.forEach(prop => {
        const tag = document.head.querySelector(`meta[property="${prop}"]`);
        if (tag) tag.remove();
        // Also remove name-based twitter tags
        const nameTag = document.head.querySelector(`meta[name="${prop}"]`);
        if (nameTag) nameTag.remove();
      });

      const canonicalToRemove = document.head.querySelector('link[rel="canonical"]');
      if (canonicalToRemove) canonicalToRemove.remove();

      // Optionally revert to a default title if needed, but often not necessary in SPAs
      // document.title = originalTitle;
    };
  }, [config]); // Re-run effect if config object changes
};