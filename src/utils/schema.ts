const SITE_URL = 'https://alessandrorabitti.com';

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Alessandro Rabitti',
  alternateName: 'axel',
  url: SITE_URL,
  jobTitle: 'Senior Frontend Engineer',
  sameAs: [
    'https://github.com/silversonicaxel',
    'https://www.linkedin.com/in/alessandrorabitti/'
  ]
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'axel - alessandrorabitti.com',
  description: 'Alessandro Rabitti, Senior Frontend Engineer. Frontend touches and Backend magic with React, Next.js, TypeScript and AI.',
  author: { '@id': `${SITE_URL}/#person` }
};

export function blogSchema(
  posts: Array<{ title: string; description: string; date: Date; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog/#blog`,
    name: 'axel - blog',
    url: `${SITE_URL}/blog/`,
    author: { '@id': `${SITE_URL}/#person` },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date.toISOString(),
      url: post.url
    }))
  };
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  date: Date;
  url: string;
  keywords: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date.toISOString(),
    url: post.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.url },
    keywords: post.keywords.join(', '),
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` }
  };
}
