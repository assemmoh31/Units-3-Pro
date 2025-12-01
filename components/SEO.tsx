import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords = [], 
  image = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200', 
  type = 'website',
  schema 
}) => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  
  const siteName = 'Unit Converter Pro';
  const fullTitle = `${title} | ${siteName}`;
  // Use window.location.href for canonical if possible, otherwise construct it
  const url = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    updateMeta('description', description);
    updateMeta('keywords', keywords.join(', '));
    updateMeta('author', siteName);
    
    // Open Graph
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:url', url, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:site_name', siteName, 'property');
    updateMeta('og:locale', language, 'property');

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', url);

    // Schema.org JSON-LD
    let scriptSchema = document.getElementById('seo-schema');
    if (!scriptSchema) {
      scriptSchema = document.createElement('script');
      scriptSchema.id = 'seo-schema';
      scriptSchema.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptSchema);
    }
    // Default schema if none provided
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": siteName,
      "url": window.location.origin,
      "description": "A comprehensive suite of online calculators and unit converters for finance, science, math, and everyday use.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any"
    };
    scriptSchema.textContent = JSON.stringify(schema || defaultSchema);

  }, [fullTitle, description, keywords, image, type, url, language, schema]);

  return null;
};

export default SEO;