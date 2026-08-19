/**
 * Intelligent Internal Linking & Related Content Scoring Engine
 * 
 * Weights:
 * - Manual `relatedSlugs`: +10
 * - Same topic: +5
 * - Same pillar: +4
 * - Same client: +3
 * - Same search intent: +3
 * - Same category: +2
 * - Shared tags: +2 each
 */

export interface ContentItem {
  id: string;
  slug?: string;
  data: {
    title: string;
    description: string;
    category?: string;
    tags?: string[];
    pillar?: string;
    topic?: string;
    client?: string;
    intent?: string;
    relatedSlugs?: string[];
    cover?: { src: string; alt: string };
    pubDate?: Date;
    updatedDate?: Date;
    [key: string]: any;
  };
  collection?: string;
}

export function getRelatedContent(
  current: ContentItem,
  allCandidates: ContentItem[],
  limit = 4
): ContentItem[] {
  const currentSlug = current.slug || current.id;
  const currentData = current.data;
  const manualRelated = currentData.relatedSlugs || [];

  const scored = allCandidates
    .filter((item) => {
      const itemSlug = item.slug || item.id;
      return itemSlug !== currentSlug;
    })
    .map((item) => {
      const itemSlug = item.slug || item.id;
      const data = item.data;
      let score = 0;

      // 1. Manual relatedSlugs match (+10)
      if (manualRelated.includes(itemSlug) || (data.relatedSlugs && data.relatedSlugs.includes(currentSlug))) {
        score += 10;
      }

      // 2. Same topic (+5)
      if (currentData.topic && data.topic && currentData.topic === data.topic) {
        score += 5;
      }

      // 3. Same pillar (+4)
      if (currentData.pillar && data.pillar && currentData.pillar === data.pillar) {
        score += 4;
      }

      // 4. Same client (+3)
      if (currentData.client && data.client && currentData.client === data.client) {
        score += 3;
      }

      // 5. Same intent (+3)
      if (currentData.intent && data.intent && currentData.intent === data.intent) {
        score += 3;
      }

      // 6. Same category (+2)
      if (currentData.category && data.category && currentData.category === data.category) {
        score += 2;
      }

      // 7. Shared tags (+2 per shared tag)
      if (currentData.tags && data.tags) {
        const sharedTags = currentData.tags.filter((t) => data.tags?.includes(t));
        score += sharedTags.length * 2;
      }

      return { item, score };
    });

  // Sort descending by score, tie-break by pubDate/updatedDate
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const dateB = (b.item.data.updatedDate || b.item.data.pubDate || new Date(0)).getTime();
    const dateA = (a.item.data.updatedDate || a.item.data.pubDate || new Date(0)).getTime();
    return dateB - dateA;
  });

  return scored.slice(0, Math.max(3, Math.min(limit, 6))).map((s) => s.item);
}
