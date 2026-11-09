# alessandrorabitti.com

Personal portfolio + dev blog. Static site built with [Astro](https://astro.build) v7,
migrated from the old Vue SPA (see `AR-PLAN.md` for the original rebuild plan).

## Stack

- **Astro v7**, fully static output (`astro build` → `dist/` of plain HTML)
- **Content Collections**: blog posts are plain `.md` files, validated by a Zod schema
  at build time (`src/content.config.ts`)
- **Shiki** syntax highlighting (github-dark) with a copy-to-clipboard button
- **RSS** (`@astrojs/rss`) + **sitemap** (`@astrojs/sitemap`)
- **Google Analytics** — same measurement id as the old site (`G-81KW2717WH`),
  loaded in `src/layouts/BaseLayout.astro`
- Plain CSS port of the previous design (Share Tech, `#070e14`/`#fafafa`,
  light/dark via `prefers-color-scheme`, cursor-following gradient, skewY motif)

## Structure

```
src/
  content/blog/            ← posts as YYYY-MM-DD-slug.md (URL strips the date)
  content.config.ts        ← blog collection + zod schema
  layouts/BaseLayout.astro ← head/SEO/meta + page frame + gradient
  components/FullscreenMenu.astro
  pages/index.astro        ← home (port of the old design)
  pages/blog/index.astro   ← post list, date desc
  pages/blog/[slug].astro  ← post detail
  pages/rss.xml.ts
  styles/global.css        ← tokens + all styling
public/                    ← favicon, images/, media/CV-AR-EN.pdf
```

## Commands

| Command               | Action                                       |
| :-------------------- | :------------------------------------------- |
| `npm run dev`         | Dev server at `localhost:4321`               |
| `npm run build`       | Production build into `./dist/`              |
| `npm run preview`     | Preview the built site locally               |
| `npm run lint:md`     | Lint blog markdown (prose @ 80 cols)         |
| `npm run lint:astro`  | Type-check `.astro`/`.ts` files (`astro check`) |

## Publishing a post

```
write src/content/blog/2026-12-01-my-post.md   (frontmatter per src/content.config.ts)
→ git commit + push to main
→ hosting provider builds and deploys automatically
```

`draft: true` excludes a post from list, detail pages and RSS; push it to a
branch for a provider preview URL.

## Deployment

GitHub is the source of truth; the host builds on push. One-time setup:

1. Push this repo to GitHub (`alessandrorabitti.com`).
2. Connect it to a static host — Netlify / Vercel / Cloudflare Pages all work:
   build command `npm run build`, output directory `dist`, Node >= 22.
3. Point the `alessandrorabitti.com` DNS at the host.

## Optional later

- Tag pages (`/blog/tag/[tag]`)
- Giscus comments (GitHub Discussions-based)
- Open Graph images per post
