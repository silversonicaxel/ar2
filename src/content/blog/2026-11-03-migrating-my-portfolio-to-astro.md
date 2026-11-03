---
title: "Migrating my portfolio to Astro"
description: "Why I rewrote an old Vue SPA into a static Astro site and how the markdown pipeline works."
date: 2026-11-03
tags: [astro, vue, migration]
stack: [Astro, TypeScript]
repo: https://github.com/silversonicaxel
draft: false
---

The old version of this site was a Vue SPA: a single empty `div`, a router with
one route, and a bundle of JavaScript whose only real job was to render text
that never changes. It worked, but every visit paid for a framework it did not
need, and publishing anything meant writing Vue components by hand.

## What changed

The rebuild runs on [Astro](https://astro.build) v7 and stays fully static:

- the home page is the same design, ported to plain CSS — no client framework;
- blog posts are plain markdown files in the repo;
- `astro build` outputs HTML that any static host can serve as-is.

Astro ships zero JavaScript by default, which fits a portfolio perfectly. The
only scripts left on the page are the ones the design actually wants: the
cursor-following gradient and the fullscreen menu toggle.

## The content pipeline

Posts live in `src/content/blog/` with a `YYYY-MM-DD-slug.md` naming
convention, so sorting by filename is sorting by date. Every file is validated
at build time by a Zod schema:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
```

A missing `title` or a typo'd field fails the build and names the exact file.
Each post becomes a static page via `getStaticPaths`, with the date prefix
stripped from the URL, and code fences get [Shiki](https://shiki.style)
highlighting at build time — free for this blog, since most posts will be
write-ups of implementations.

## Publishing

The end state is a git push:

```bash
# one new post
vim src/content/blog/2026-12-01-next-post.md

# and that is basically it
git add . && git commit -m "post: next post" && git push
```

The host builds `dist/` on push and the post is live about a minute later.
Drafts get `draft: true` and a preview URL from a branch build, and are
excluded from the list, the detail pages and the RSS feed.

## What is next

Tag pages, maybe comments, and — more importantly — actually writing.
