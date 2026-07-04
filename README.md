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

## Publishing workflow: from new file to live on the internet

This is the full loop for adding a blog post, note, tutorial, resource, certification, or experience entry —
the steps are identical for every collection, only the folder changes.

1. **Create the file** in the right folder under `src/content/` (see the table above), named
   `kebab-case-slug.md` (or `.mdx` if you need `<Callout>`). The filename becomes the URL slug, so keep it
   short and descriptive — e.g. `src/content/blog/what-is-mcp.md` → `/blog/what-is-mcp/`.
2. **Fill in frontmatter** matching the schema for that collection in `src/content.config.ts`, then write the
   body in Markdown.
3. **Preview it locally** before publishing:
   ```bash
   pnpm dev
   ```
   Open `http://localhost:4321` and check the new page, its listing, and (for blog posts) the tag/category
   pages it should now appear on.
4. **Commit and push** — see the exact commands below. The GitHub Actions workflow builds and deploys
   automatically; there is no separate "publish" button.
5. **Watch the deploy** (optional): `gh run watch --repo sarveshtalele/personal-website` or check the
   **Actions** tab on GitHub. It's usually live within 30–60 seconds of the push.

### Git commands to push a new post

From the project root, with your new file(s) already saved:

```bash
git status                                   # see what changed
git add src/content/blog/my-new-post.md      # stage the specific file(s) you added/edited
git commit -m "Add blog post: my new post"   # commit with a short, descriptive message
git push                                     # push to origin/main — this triggers the deploy
```

A few notes on this:

- Prefer `git add <path>` over `git add -A` or `git add .` — staging specific files avoids accidentally
  committing something unrelated (stray local files, editor config, etc.).
- If you're adding an image alongside a post (see "Adding images to a post" above), stage the whole post folder:
  `git add src/content/blog/my-new-post/`.
- If you ever work from a second machine, run `git pull` before you start editing to avoid merge conflicts.
- To update something you already published, just edit the file, then `git add`, `git commit -m "Update: ..."`,
  `git push` again — same loop.

## SEO & AEO checklist for every post

The site already handles the technical SEO automatically for every page — canonical URL, Open Graph/Twitter
cards, `Article` JSON-LD linked to your `Person` entity, sitemap entry, and RSS inclusion. Nothing to do there.
What actually affects how well an individual post ranks or gets surfaced by AI answer engines (Google AI
Overviews, Perplexity, ChatGPT search) is what you write in the frontmatter and the first few lines of the
body:

- **`title`** — specific and front-loaded with the term someone would actually search, not clever or vague.
  Keep it under ~60 characters so it doesn't get truncated in search results.
- **`description`** — 150–160 characters, includes the target phrase naturally, and reads like a reason to
  click (this becomes the meta description *and* the RSS/social preview text — it's doing three jobs).
- **Open with the direct answer.** The first two or three sentences of the post should state the core
  answer plainly, before any preamble. This is the single highest-leverage thing for AEO — answer engines and
  Google's featured snippets pull from the first clear, self-contained statement they find, not from a
  well-argued conclusion three paragraphs down.
- **Use real heading structure** (`##`/`###`, not bold text pretending to be a heading) — both readers and
  extraction models use headings to navigate to the part that answers their specific question.
- **`tags`/`category`** — use the terms people actually search or ask about (e.g. `MCP`, `LangGraph`), not
  internal jargon. These drive your tag/category pages, which are additional indexable, internally-linked pages.
- **Add a `heroImage`** — improves click-through from social shares and search image results, and gives the
  post a real `og:image` instead of the site default.
- **Write descriptive `alt` text** on inline images (`![alt text](...)`), not filenames or "image" — this is
  both an accessibility requirement and an image-search signal.
- **Link internally** to related notes/posts by URL (e.g. `[MCP notes](/notes/mcp-tool-calling/)`) — this
  site's related-posts and tag pages already do some of this automatically, but a manual in-text link to a
  deeply relevant note or post carries more weight than an automated "related" card.
- **Structure facts as lists or tables** where it fits naturally — these are what most often get lifted
  verbatim into featured snippets and AI-generated answers.
- **Set `updatedDate`** when you substantially revise a post — it updates the `dateModified` in the JSON-LD
  and is a real freshness signal, but only use it for actual substantive edits, not typo fixes.

**Being honest about what this does and doesn't do:** none of the above guarantees a top ranking. On-page
optimization is table stakes, not a lever that beats an established, high-authority site on its own. What
compounds over time and actually moves rankings against bigger competitors is backlinks (other sites, forums,
or newsletters linking to a specific post), consistent publishing cadence, and genuine depth/originality —
Google and answer engines both weight demonstrated expertise and external validation heavily, and no amount of
frontmatter tuning substitutes for that.

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
