/**
 * SEO & OpenGraph Helper Utilities
 */

import siteData from '../data/site/site.json';
import { ensureTrailingSlash } from './slug';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  pubDate?: Date | string;
  updatedDate?: Date | string;
  author?: string;
  noindex?: boolean;
}

export function buildCanonicalUrl(pathname: string): string {
  const base = siteData.url.replace(/\/$/, '');
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${ensureTrailingSlash(cleanPath)}`;
}

export function formatPageTitle(pageTitle?: string): string {
  if (!pageTitle || pageTitle === siteData.name) {
    return `${siteData.name} - ${siteData.tagline} | 专业网络工具与机场知识库`;
  }
  // Avoid keyword stuffing
  return `${pageTitle} | ${siteData.name}`;
}

export function formatMetaDescription(desc?: string): string {
  if (!desc) return siteData.description;
  // Truncate to reasonable length (80-160 Chinese characters)
  const trimmed = desc.trim();
  if (trimmed.length > 150) {
    return `${trimmed.slice(0, 147)}...`;
  }
  return trimmed;
}
