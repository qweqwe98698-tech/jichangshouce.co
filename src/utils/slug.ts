/**
 * Slug and URL path normalization utilities
 */

export function cleanSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ensureTrailingSlash(path: string): string {
  if (path.endsWith('/') || path.includes('#') || path.includes('?')) {
    return path;
  }
  return `${path}/`;
}

export function removeTrailingSlash(path: string): string {
  if (path === '/' || !path.endsWith('/')) {
    return path;
  }
  return path.slice(0, -1);
}
