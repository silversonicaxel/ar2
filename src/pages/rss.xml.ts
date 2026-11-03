import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'axel - blog',
    description: 'Write-ups of implementations, experiments and migrations by Alessandro Rabitti.',
    site: context.site ?? 'https://alessandrorabitti.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`
    })),
    customData: '<language>en</language>'
  });
}
