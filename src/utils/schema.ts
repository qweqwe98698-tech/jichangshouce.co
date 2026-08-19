/**
 * Schema.org JSON-LD Generator
 */

import siteData from '../data/site/site.json';
import { buildCanonicalUrl } from './seo';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteData.name,
    url: siteData.url,
    logo: `${siteData.url}/images/logo.png`,
    description: siteData.description,
    foundingDate: '2024',
    sameAs: [],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteData.name,
    url: siteData.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteData.url}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteData.url}${item.url}`,
    })),
  };
}

export function generateArticleSchema(params: {
  title: string;
  description: string;
  pathname: string;
  pubDate: Date | string;
  updatedDate?: Date | string;
  author?: string;
  image?: string;
}) {
  const canonical = buildCanonicalUrl(params.pathname);
  const pubIso = typeof params.pubDate === 'string' ? new Date(params.pubDate).toISOString() : params.pubDate.toISOString();
  const updateIso = params.updatedDate ? (typeof params.updatedDate === 'string' ? new Date(params.updatedDate).toISOString() : params.updatedDate.toISOString()) : pubIso;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: params.title,
    description: params.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    image: params.image ? (params.image.startsWith('http') ? params.image : `${siteData.url}${params.image}`) : `${siteData.url}/og/default.png`,
    datePublished: pubIso,
    dateModified: updateIso,
    author: {
      '@type': 'Person',
      name: params.author || siteData.author,
      url: `${siteData.url}/authors/`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteData.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteData.url}/images/logo.png`,
      },
    },
  };
}

export function generateFAQSchema(faqs: { q: string; a: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function generateHowToSchema(params: {
  name: string;
  description: string;
  steps: { name: string; text: string; image?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    description: params.description,
    step: params.steps.map((s, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: s.name,
      text: s.text,
      image: s.image ? (s.image.startsWith('http') ? s.image : `${siteData.url}${s.image}`) : undefined,
    })),
  };
}
