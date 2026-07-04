# sarveshtalele.org

Personal AI engineering platform — portfolio, resume, technical blog, knowledge base, and project showcase.
Built with Astro, Tailwind CSS, and Markdown/MDX content collections. Deploys to GitHub Pages automatically on
every push to `main`.

## Stack

- **Framework:** Astro 7 (static output)
- **Styling:** Tailwind CSS v4
- **Content:** Astro Content Collections (Markdown + MDX)
- **Icons:** Lucide (+ hand-drawn GitHub/LinkedIn/X/Medium/ORCID marks, since Lucide dropped brand logos)
- **Syntax highlighting:** Shiki (GitHub Light / GitHub Dark themes)
- **Search:** Pagefind (static, generated at build time)
- **Comments:** Giscus (GitHub Discussions)
- **Live GitHub data:** repo listings, language stats, and project categories are fetched client-side from the
  public GitHub API — no token needed, nothing to keep in sync manually
- **CI/CD:** GitHub Actions → GitHub Pages, with an auto-retry workflow for transient Pages deploy failures
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
pnpm audit     # check dependencies for known vulnerabilities
```

## Updating content — the only thing you'll normally touch

Every page except a handful of static ones (About, Contact, Resume, Privacy) is generated from Markdown/MDX
files in `src/content/`. **Adding a new file automatically makes it appear in its listing page, the RSS feed,
the sitemap, tag pages, and the search index — no code changes required.**

| Collection | Folder | Shows up on |
|---|---|---|
| Blog posts | `src/content/blog/` | `/blog`, tags, categories, RSS, homepage |
| Notes | `src/content/notes/` | `/notes`, tags, homepage |
| Tutorials | `src/content/tutorials/` | `/tutorials`, level pages |
| Resources | `src/content/resources/` | `/resources`, category pages |
| Publications | `src/content/publications/` | `/publications`, homepage |
| Certifications | `src/content/certifications/` | `/certifications`, homepage, About, resume |
| Experience | `src/content/experience/` | `/experience`, homepage, resume |

**Projects are the one exception.** The `/projects` page and the homepage "Featured Work" section pull live
from your public GitHub repositories via the GitHub API — not from a content-collection folder. There's nothing
to edit for a new project to show up; push it to GitHub and it appears automatically, sorted by stars. The
`src/content/projects/` collection still exists in the schema for a per-project detail page
(`src/pages/projects/[id].astro`) if you ever want a hand-written case study for a specific project, but it's
optional and currently empty.

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

Two ways, pick based on whether you want automatic optimization. Both work in `.md` and `.mdx` files.

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

`heroImage` automatically renders as a banner on the post page and as the thumbnail on blog cards. The same
`image()` pattern works for `image` in `src/content/projects/` (used only if you add a hand-written project
detail page).

**2. Public folder — simple, but not optimized (served as-is).**
Drop the file in `public/images/` and reference it by absolute path — no frontmatter field needed, just inline:

```md
![Alt text](/images/my-screenshot.png)
```

Use this for quick screenshots where you don't need responsive/WebP output, or for images reused across
multiple pages (like the site's own profile photo at `public/images/sarvesh-talele.jpg`, used in the Hero,
About page, and Navbar logo).

## Homepage dashboard & GitHub project categories

The homepage "Dashboard" section and the About page stats panel both read from `STATS` in `src/lib/site.ts` —
edit that array to change the personal KPI tiles (years of experience, RAG solutions built, etc.). The
"Everything on this site" row underneath is computed automatically from your content collection counts (blog
posts, notes, tutorials, resources, certifications, publications) — nothing to maintain there. The GitHub repo
count tile and the "Most starred repos" section are fetched live from the GitHub API at page load.

**Project category pills** (Agentic AI, MCP, RAG, AI Projects, Machine Learning, Claude Skills, Developer
Tools) on the `/projects` page come from **GitHub topics** you set on each repository — this is the one place
in the project that isn't driven by a Markdown file. To categorize a new repo, add matching topics to it:

```bash
gh api repos/sarveshtalele/YOUR-REPO/topics -X PUT --input - <<< '{"names":["agentic-ai","mcp"]}'
```

or add them from the repo's GitHub page (gear icon next to "About" → Topics). The category list itself is
defined in `CONCEPT_CATEGORIES` inside `src/components/GitHubRepoExplorer.astro`.

## Site-wide settings

Edit `src/lib/site.ts` to change:

- Name, title, description, email, location (`SITE`)
- GitHub/LinkedIn/Medium/Google Scholar/ORCID URLs (`SOCIALS`, `GITHUB_USERNAME`)
- Nav links (`NAV_LINKS`)
- Skills dashboard categories (`SKILLS`), education (`EDUCATION`), achievements (`ACHIEVEMENTS`)
- Homepage/About KPI tiles (`STATS`) and the About page credential badges (`CREDENTIALS`)
- Google Analytics measurement ID (`GA_MEASUREMENT_ID`) — leave blank to disable analytics
- Giscus repo/category IDs (`GISCUS`) — leave blank to hide comments

The Topmate booking link is hardcoded in `src/components/TopmateCTA.astro` and the Hero's "Get in touch!"
button in `src/components/Hero.astro` — update the URL in both places if it ever changes.

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

GitHub Pages occasionally rejects a deployment with "Deployment failed, try again later" if you push more than
once in quick succession — the backend needs a brief cooldown between deployments. `.github/workflows/
retry-pages-deploy.yml` watches for this and automatically reruns the failed job with increasing backoff, so it
self-heals without a manual rerun.

### Custom domain

Add a file `public/CNAME` containing just your domain (e.g. `sarveshtalele.org`), or set it in
**Settings → Pages → Custom domain** (GitHub will create/commit the CNAME file for you). Then point your DNS:

- **Apex domain** (`sarveshtalele.org`): four `A` records to GitHub Pages' IPs (185.199.108.153,
  185.199.109.153, 185.199.110.153, 185.199.111.153), or an `ALIAS`/`ANAME` record if your DNS provider supports it.
- **`www` subdomain**: a `CNAME` record pointing to `<username>.github.io`.

Update `site:` in `astro.config.mjs` and `SITE.url` in `src/lib/site.ts` to match your final domain — canonical
URLs, the sitemap, and RSS all read from that value.

## Updating your resume

Replace `public/resume.pdf` with your latest PDF export — the download buttons on the homepage, About, and
Resume pages all link to `/resume.pdf` directly. The on-site `/resume` page is generated dynamically from the
`experience`, `certifications`, `publications`, and site config data, so keep those content files in sync with
the PDF.

## Updating your photo / favicon / social preview image

The profile photo lives at `public/images/sarvesh-talele.jpg` and is reused in the Navbar, Hero, and About
page — replace that one file to update it everywhere. The favicon (`public/favicon-32.png`,
`public/favicon-512.png`, `public/apple-touch-icon.png`) and the default social-share preview
(`public/og-home.png`, a real screenshot of the homepage) were generated from that photo and a headless
Chrome capture; regenerate them if you change the photo or redesign the homepage:

```bash
# Favicon sizes, via sharp (already a project dependency)
node -e "
const sharp = require('sharp');
const src = 'public/images/sarvesh-talele.jpg';
Promise.all([
  sharp(src).resize(32, 32).toFile('public/favicon-32.png'),
  sharp(src).resize(180, 180).toFile('public/apple-touch-icon.png'),
  sharp(src).resize(512, 512).toFile('public/favicon-512.png'),
]);
"

# Homepage OG/social preview screenshot (needs `pnpm build` + `pnpm preview` running on :4322 first)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --blink-settings=preferredColorScheme=1 \
  --screenshot=public/og-home.png http://localhost:4322/
```

## Security

- **Secret scanning + push protection** and **Dependabot security updates/alerts** are enabled on the GitHub
  repo (free for public repos) — a leaked key would be blocked at push time, and dependency CVEs raise
  automatic alerts/PRs.
- Run `pnpm audit` periodically (or let Dependabot do it) — it should report zero known vulnerabilities.
- No secrets are used anywhere in this project: the GitHub API calls are unauthenticated public reads, Giscus
  and GA IDs are meant to be client-visible, and the CI workflows only trigger on `push`/`workflow_run` (not
  `pull_request`), so fork PRs can't run anything against this repo's secrets.

## Project structure

```
src/
  components/     Reusable UI (Navbar, Footer, cards, dashboards, Callout, icons/, etc.)
  layouts/        BaseLayout, ArticleLayout (blog/notes/tutorials/project pages), PageLayout
  pages/          Route files — most are thin wrappers around content collections
  content/        Markdown/MDX content collections (the part you edit)
  content.config.ts   Zod schemas for every collection
  lib/site.ts     Site-wide config (name, socials, nav, skills, stats, analytics, giscus)
  styles/         Tailwind v4 theme tokens + global/prose/print CSS
  utils/          Small formatting helpers (dates, tag slugs)
public/           Static files served as-is (resume.pdf, favicon, robots.txt, og-home.png, images/)
.github/workflows/
  deploy.yml               Build + deploy to GitHub Pages
  retry-pages-deploy.yml   Auto-retries the deploy job on transient Pages backend failures
```

## License

Content (blog posts, notes, resume) is © Sarvesh Talele. Code is free to reuse as a starting point for your own
site.
