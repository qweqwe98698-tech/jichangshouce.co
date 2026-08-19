import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jichangshouce.co',
  trailingSlash: 'always',
  integrations: [
    tailwind({
      applyBaseStyles: false, // We control base styles via custom tokens & CSS
    }),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/search') &&
        !page.includes('/draft') &&
        !page.includes('/test') &&
        !page.includes('/404'),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
