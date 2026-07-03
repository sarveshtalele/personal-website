# sarveshtalele.org

Personal AI engineering platform — portfolio, résumé, technical blog, knowledge base, and project showcase.
Built with Astro, Tailwind CSS, and Markdown/MDX content collections. Deploys to GitHub Pages automatically on
every push to `main`.

## Stack

- **Framework:** Astro 7 (static output)
- **Styling:** Tailwind CSS v4
- **Content:** Astro Content Collections (Markdown + MDX)
- **Icons:** Lucide (+ hand-drawn GitHub/LinkedIn/X marks, since Lucide dropped brand logos)
- **Syntax highlighting:** Shiki (GitHub Light / GitHub Dark themes)
- **Search:** Pagefind (static, generated at build time)
- **Comments:** Giscus (GitHub Discussions)
- **CI/CD:** GitHub Actions → GitHub Pages
- **Package manager:** pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:4321`.

```bash
pnpm build     # astro build + pagefind index generation
pnpm preview   # preview the production build locally
pnpm check     # astro + TypeScript type checking
pnpm lint      # eslint
pnpm format    # prettier --write
```

## Updating content — the only thing you'll normally touch

Every page except a handful of static ones (About, Contact, Resume, Privacy) is generated from Markdown/MDX
files in `src/content/`. **Adding a new file automatically makes it appear in its listing page, the RSS feed,
the sitemap, tag pages, and the search index — no code changes required.**

| Collection | Folder | Shows up on |
|---|---|---|
| Blog posts | `src/content/blog/` | `/blog`, tags, categories, RSS |
| Projects | `src/content/projects/` | `/projects` |
| Notes | `src/content/notes/` | `/notes`, tags |
| Tutorials | `src/content/tutorials/` | `/tutorials` |
| Resources | `src/content/resources/` | `/resources` |
| Publications | `src/content/publications/` | `/publications`, homepage |
| Talks | `src/content/talks/` | `/talks` |
| Certifications | `src/content/certifications/` | `/certifications`, homepage, résumé |
| Experience | `src/content/experience/` | `/experience`, homepage, résumé |

To add a new blog post, copy the frontmatter shape from an existing file in `src/content/blog/` (see
`src/content.config.ts` for the exact schema per collection) and write. Use `.mdx` instead of `.md` if you want
to use the `<Callout type="info|tip|warning|success">` component inside the body.

### Frontmatter reference (blog example)

```md
---
title: "Post title"
description: One or two sentences for previews, SEO, and RSS.
pubDate: 2026-07-03
category: Agentic AI
tags: [MCP, LangGraph]
featured: false   # true = shown on the homepage
draft: false      # true = hidden from all listings/RSS/sitemap
---

Body content here. Standard Markdown, GFM tables, and (in .mdx files) the `<Callout>` component.
```

Math is supported via `remark-math` + `rehype-katex` — write `$inline$` or `$$block$$` LaTeX in any post.

### Adding images to a post

Two ways, pick based on whether you want automatic optimization:

**1. Colocated (recommended) — optimized, resized, converted to WebP automatically.**
Turn the post into a folder and put the image next to it:

```
src/content/blog/my-post/index.md   ← was my-post.md
src/content/blog/my-post/cover.jpg
```

Reference it with a relative path — in frontmatter for the banner image, and/or inline in the body:

```md
---
title: My post
heroImage: ./cover.jpg
---

Some text.

![Alt text](./cover.jpg)
```

`heroImage` automatically renders as a banner on the post page and as the thumbnail on blog cards. This works
the same way for `image` in `src/content/projects/`.

**2. Public folder — simple, but not optimized (served as-is).**
Drop the file in `public/images/` and reference it by absolute path — no frontmatter field needed, just inline:

```md
![Alt text](/images/my-screenshot.png)
```

Use this for quick screenshots where you don't need responsive/WebP output.

## Site-wide settings

Edit `src/lib/site.ts` to change:

- Name, title, description, email, location (`SITE`)
- GitHub/LinkedIn URLs (`SOCIALS`, `GITHUB_USERNAME`)
- Nav links (`NAV_LINKS`)
- Skills, education, achievements shown on the homepage/résumé/about page
- Google Analytics measurement ID (`GA_MEASUREMENT_ID`) — leave blank to disable analytics
- Giscus repo/category IDs (`GISCUS`) — leave blank to hide comments

## Enabling comments (Giscus)

1. Make the GitHub repo public (or use a public repo just for Discussions) and enable **Discussions** under repo Settings.
2. Go to [giscus.app](https://giscus.app), fill in your repo, and copy the generated `data-repo-id` and `data-category-id`.
3. Paste them into `GISCUS` in `src/lib/site.ts`.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys automatically on every push to `main`:

```
install deps → astro build → pagefind index → upload artifact → deploy to Pages
```

**One-time setup after pushing to GitHub:** in the repo, go to **Settings → Pages → Build and deployment** and
set **Source** to "GitHub Actions". The workflow needs no secrets — it uses the default `GITHUB_TOKEN`.

### Custom domain

Add a file `public/CNAME` containing just your domain (e.g. `sarveshtalele.org`), or set it in
**Settings → Pages → Custom domain** (GitHub will create/commit the CNAME file for you). Then point your DNS:

- **Apex domain** (`sarveshtalele.org`): four `A` records to GitHub Pages' IPs (185.199.108.153,
  185.199.109.153, 185.199.110.153, 185.199.111.153), or an `ALIAS`/`ANAME` record if your DNS provider supports it.
- **`www` subdomain**: a `CNAME` record pointing to `<username>.github.io`.

Update `site:` in `astro.config.mjs` and `SITE.url` in `src/lib/site.ts` to match your final domain — canonical
URLs, the sitemap, and RSS all read from that value.

## Updating your résumé

Replace `public/resume.pdf` with your latest PDF export — the download buttons on the homepage, About, and
Résumé pages all link to `/resume.pdf` directly. The on-site `/resume` page is generated dynamically from the
`experience`, `projects`, `certifications`, `publications`, and site config data, so keep those content files in
sync with the PDF.

## Project structure

```
src/
  components/     Reusable UI (Navbar, Footer, cards, Callout, etc.)
  layouts/        BaseLayout, ArticleLayout (blog/notes/tutorials/projects), PageLayout
  pages/          Route files — most are thin wrappers around content collections
  content/        Markdown/MDX content collections (the part you edit)
  content.config.ts   Zod schemas for every collection
  lib/site.ts     Site-wide config (name, socials, nav, skills, analytics, giscus)
  styles/         Tailwind v4 theme tokens + global/prose/print CSS
  utils/          Small formatting helpers (dates, tag slugs)
public/           Static files served as-is (resume.pdf, favicon, robots.txt, og image)
.github/workflows/deploy.yml   CI/CD to GitHub Pages
```

## License

Content (blog posts, notes, résumé) is © Sarvesh Talele. Code is free to reuse as a starting point for your own
site.
