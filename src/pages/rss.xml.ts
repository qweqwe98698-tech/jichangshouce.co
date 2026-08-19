import { getCollection } from 'astro:content';
import siteData from '../data/site/site.json';

export async function GET() {
  const allGuides = await getCollection('guides');
  const allTutorials = await getCollection('tutorials');
  const allAnswers = await getCollection('answers');
  
  const allPosts = [...allGuides, ...allTutorials, ...allAnswers];
  allPosts.sort((a, b) => (b.data.pubDate?.getTime() || 0) - (a.data.pubDate?.getTime() || 0));

  const itemsXml = allPosts.map(post => {
    let url = `${siteData.url}/guides/${post.id}/`;
    if (post.collection === 'tutorials') url = `${siteData.url}/tutorials/${post.id}/`;
    if (post.collection === 'answers') url = `${siteData.url}/answers/${post.id}/`;

    return `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.data.description}]]></description>
      <pubDate>${new Date(post.data.pubDate || Date.now()).toUTCString()}</pubDate>
      <author>${post.data.author || siteData.author}</author>
      <category>${post.data.category || '网络教程'}</category>
    </item>`;
  }).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteData.name} - ${siteData.tagline}]]></title>
    <link>${siteData.url}</link>
    <description><![CDATA[${siteData.description}]]></description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteData.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
