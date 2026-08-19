import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Base content schema
const baseContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  updatedDate: z.date().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  author: z.string().default('机场手册编辑部'),
  cover: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
  pillar: z.string().optional(),
  relatedSlugs: z.array(z.string()).default([]),
  faq: z.array(z.object({
    q: z.string(),
    a: z.string(),
  })).default([]),
  draft: z.boolean().default(false),
  answer: z.string().optional(), // 60-180 words quick answer
  intent: z.enum(['informational', 'commercial', 'troubleshooting', 'comparison', 'navigational']).default('informational'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  platform: z.array(z.string()).optional(),
  client: z.string().optional(),
  topic: z.string().optional(),
  nextStep: z.object({
    title: z.string(),
    description: z.string(),
    link: z.string(),
    linkText: z.string(),
  }).optional(),
});

// Articles collection
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: baseContentSchema,
});

// Guides collection
const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: baseContentSchema,
});

// Answers collection (GEO direct answers)
const answers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/answers' }),
  schema: baseContentSchema.extend({
    symptom: z.string().optional(),
    quickCheck: z.array(z.string()).optional(),
  }),
});

// Topics collection
const topics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    featured: z.boolean().default(false),
    subtopics: z.array(z.string()).default([]),
    pillarArticleSlug: z.string().optional(),
    updatedDate: z.date(),
  }),
});

// Brands collection
const brands = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/brands' }),
  schema: baseContentSchema.extend({
    brandId: z.string(), // references data/providers/[brandId].json
    pricingSummary: z.string().optional(),
    routeType: z.string().optional(),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    suitableFor: z.array(z.string()).default([]),
    unsuitableFor: z.array(z.string()).default([]),
  }),
});

// Comparisons collection
const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/comparisons' }),
  schema: baseContentSchema.extend({
    itemA: z.string(),
    itemB: z.string(),
    verdict: z.string(),
    comparisonTable: z.array(z.object({
      dimension: z.string(),
      itemAValue: z.string(),
      itemBValue: z.string(),
      note: z.string().optional(),
    })).default([]),
  }),
});

// Tutorials collection
const tutorials = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tutorials' }),
  schema: baseContentSchema.extend({
    client: z.string(), // e.g. 'clash', 'shadowrocket', 'v2rayn'
    os: z.array(z.string()).default([]),
    stepsCount: z.number().optional(),
  }),
});

// Glossary collection
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    slug: z.string(),
    shortDefinition: z.string(),
    category: z.string(),
    relatedTerms: z.array(z.string()).default([]),
    updatedDate: z.date(),
  }),
});

export const collections = {
  articles,
  guides,
  answers,
  topics,
  brands,
  comparisons,
  tutorials,
  glossary,
};
