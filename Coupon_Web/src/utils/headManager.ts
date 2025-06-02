// src/utils/headManager.ts

import { useEffect } from 'react';

// Declare global function type for TypeScript
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
  ogUrl?: string;       // Explicitly passed from the component
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string; // Explicitly passed from the component
  baseLiveUrl?: string; // Passed from page component, contains "https://www.discountregion.com"
}

export const usePageHead = (config: HeadConfig) => {
  useEffect(() => {
    // --- Step 1: Ensure initial <head> is clean of generic React defaults ---
    // (This is a proactive measure for initial render or hydration issues)
    const existingDefaultMeta = document.head.querySelector('meta[data-react-helmet="true"]');
    if (existingDefaultMeta) existingDefaultMeta.remove();
    // Also explicitly remove default description if not the one we manage
    let defaultDescription = document.head.querySelector('meta[name="description"]');
    if (defaultDescription && defaultDescription.getAttribute('content') === "Your go-to source for verified discounts and promo codes from top brands like Oraimo, Shopinverse, 1xBet, and leading prop firms. Begin your discount journey and save more every time!") {
        defaultDescription.remove();
    }
    // You might also find a default title here if you had one in index.html, it would be replaced by document.title below.


    // Determine the absolute URL for ogUrl/canonicalUrl
    let effectiveAbsoluteUrl: string;
    if (config.ogUrl || config.canonicalUrl) {
      effectiveAbsoluteUrl = config.ogUrl || config.canonicalUrl || window.location.href;
    } else if (config.baseLiveUrl) {
      effectiveAbsoluteUrl = `${config.baseLiveUrl}${window.location.pathname}${window.location.search}`;
    } else {
      effectiveAbsoluteUrl = window.location.href;
    }


    // --- Step 2: Update/Create Tags ---

    // Function to update or create a meta tag. More robust.
    const manageMetaTag = (
        selector: string,                 // e.g., 'meta[name="description"]'
        attribute: 'name' | 'property',   // 'name' for standard, 'property' for Open Graph
        value: string,                    // The value of the attribute (e.g., 'description', 'og:title')
        content?: string                  // The content for the 'content' attribute
    ) => {
      let tag = document.head.querySelector(selector) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, value);
        document.head.appendChild(tag);
      }
      if (content !== undefined) { // Only update content if provided, otherwise leave if existing or remove if explicitly undefined
        tag.setAttribute('content', content);
      } else {
        tag.remove(); // Remove tag if content is explicitly undefined
      }
      return tag;
    };

    // Function to update or create a link tag (for canonical)
    const manageLinkTag = (selector: string, rel: string, href?: string) => {
      let tag = document.head.querySelector(selector) as HTMLLinkElement;
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        document.head.appendChild(tag);
      }
      if (href !== undefined) {
        tag.setAttribute('href', href);
      } else {
        tag.remove();
      }
      return tag;
    };


    // --- Title ---
    document.title = config.title;

    // --- Meta Description ---
    manageMetaTag('meta[name="description"]', 'name', 'description', config.description);

    // --- Open Graph Tags (for Social Media Sharing) ---
    manageMetaTag('meta[property="og:title"]', 'property', 'og:title', config.ogTitle || config.title);
    manageMetaTag('meta[property="og:description"]', 'property', 'og:description', config.ogDescription || config.description);
    manageMetaTag('meta[property="og:image"]', 'property', 'og:image', config.ogImage ? getFullLogoUrl(config.ogImage) : undefined);
    manageMetaTag('meta[property="og:url"]', 'property', 'og:url', config.ogUrl || effectiveAbsoluteUrl);
    manageMetaTag('meta[property="og:type"]', 'property', 'og:type', config.ogType || 'website');

    // --- Twitter Card Tags --- (These use 'name' attribute, not 'property')
    manageMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', config.twitterCard || 'summary_large_image');
    manageMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', config.twitterTitle || config.title);
    manageMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', config.twitterDescription || config.description);
    manageMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', config.twitterImage ? getFullLogoUrl(config.twitterImage) : (config.ogImage ? getFullLogoUrl(config.ogImage) : undefined));

    // --- Meta Keywords ---
    manageMetaTag('meta[name="keywords"]', 'name', 'keywords', config.keywords);

    // --- Canonical URL ---
    manageLinkTag('link[rel="canonical"]', 'canonical', config.canonicalUrl || effectiveAbsoluteUrl);


    // --- Step 3: Comprehensive CLEANUP FUNCTION for component unmount/re-render ---
    // This is vital to prevent accumulation of tags from previous renders.
    return () => {
        const selectorsToClean = [
            'meta[name="description"]',
            'meta[name="keywords"]',
            'meta[property="og:title"]',
            'meta[property="og:description"]',
            'meta[property="og:image"]',
            'meta[property="og:url"]',
            'meta[property="og:type"]',
            'meta[name="twitter:card"]',
            'meta[name="twitter:title"]',
            'meta[name="twitter:description"]',
            'meta[name="twitter:image"]',
            'link[rel="canonical"]'
        ];

        selectorsToClean.forEach(selector => {
            const tag = document.head.querySelector(selector);
            if (tag) {
                tag.remove();
            }
        });
        // Title is automatically managed by document.title = ""; or next component.
        // google-site-verification is usually persistent and not managed by usePageHead
    };
  }, [config]); // Dependency array: re-run effect if config object changes
};