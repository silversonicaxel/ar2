## Project

Personal portfolio + dev blog for alessandrorabitti.com. Fully static Astro v7,
plain CSS, design tokens in `src/styles/global.css` ported from the previous
Vue SPA — keep home visually identical to the old site unless asked otherwise.

Conventions:

- Blog posts: `src/content/blog/YYYY-MM-DD-slug.md`; URL strips the date prefix
  (`/blog/<slug>/`). Frontmatter is Zod-validated in `src/content.config.ts`;
  `draft: true` hides a post from list/detail/RSS.
- Styling: prefer extending `src/styles/global.css` over scoped component CSS.
- Light/dark: always provide the `prefers-color-scheme: dark` counterpart.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
