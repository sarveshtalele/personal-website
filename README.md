# sarveshtalele.org

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fsarveshtalele.org&label=sarveshtalele.org&style=for-the-badge&color=6b4226)](https://sarveshtalele.org)
[![Deploy](https://img.shields.io/github/actions/workflow/status/sarveshtalele/personal-website/deploy.yml?branch=main&label=deploy&style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/sarveshtalele/personal-website/actions/workflows/deploy.yml)
[![CI](https://img.shields.io/github/actions/workflow/status/sarveshtalele/personal-website/ci.yml?label=ci&style=for-the-badge&logo=github)](https://github.com/sarveshtalele/personal-website/actions/workflows/ci.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/sarveshtalele/personal-website/codeql.yml?label=codeql&style=for-the-badge&logo=github)](https://github.com/sarveshtalele/personal-website/actions/workflows/codeql.yml)
[![Last commit](https://img.shields.io/github/last-commit/sarveshtalele/personal-website?style=for-the-badge&color=a67c3d)](https://github.com/sarveshtalele/personal-website/commits/main)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![Claude Certified Architect · Professional](https://img.shields.io/badge/Claude_Certified_Architect-Professional-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.credly.com/badges/a27e0744-fb64-43d7-9676-ceef2b11452a/public_url)
[![Claude Certified Architect · Foundations](https://img.shields.io/badge/Claude_Certified_Architect-Foundations-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.credly.com/badges/f164b498-cc76-44ef-9962-cc79f7d61fe7/public_url)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sarveshtalele-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sarveshtalele)
[![arXiv](https://img.shields.io/badge/arXiv-2604.09685-B31B1B?style=for-the-badge&logo=arxiv&logoColor=white)](https://arxiv.org/abs/2604.09685)

Personal website of **Sarvesh Talele**, AI Engineer and Claude Certified Architect: portfolio, evidence-backed
dashboard, blog, and a free Claude Certified Architect (CCAR-F) mock exam with 360 practice questions.

**Everything on the site is generated from Markdown.** Edit a `.md` file, push, and every card, page, tag, feed,
search entry, and dashboard tile that depends on it updates on the next deploy.

---

## Pages

| Route | What it shows | Source of truth |
| --- | --- | --- |
| `/` | Animated hero (Philosopher · AI Engineer · Traveller theme), credential marquee, impact tiles, quotes, pinned repos, latest posts, Claude, journey, contact | profile, dashboard, project settings, blog, experience |
| `/dashboard` | Recruiter view: every metric links to proof, live GitHub stats, verified badges, credentials, research | `dashboard/metrics.md` + GitHub API + certifications + publications |
| `/projects` | Every public repo, pinned first; search, category + language filters, sort by stars/forks/updated/name | GitHub API + `project-settings/projects.md` |
| `/blog`, `/blog/<slug>`, `/blog/tags/<tag>`, `/rss.xml` | Cards with title + description, category/tag filters and search; full post with TOC, related posts | `blog/<slug>/index.mdx` |
| `/claude` | Both Anthropic badges (verify on Credly), practice hub, study guides | certifications + `claude/exams/*.md` |
| `/claude/foundations` | CCAR-F guide: glance, domains, scenarios, mental model, resources | `claude/exams/foundations.md` |
| `/claude/quiz` | Timed 60-question mock exam (scored by domain) + untimed practice | `claude/questions/*.md` (`mock: true`) |
| `/claude/review` | All 360 questions grouped by task statement, test mode, doc links | `claude/questions/*.md` |
| `/about`, `/experience`, `/certifications`, `/publications`, `/contact` | Story, timeline, badges, papers, channels | profile, experience, certifications, publications |

## Quick start

```bash
nvm use            # Node 22.23.4+ (see .nvmrc)
pnpm install
pnpm dev           # http://localhost:4321 (drafts are visible in dev)
pnpm build         # production build into dist/
pnpm preview
```

## Updating content (the only thing you normally touch)

| To change… | Edit this file |
| --- | --- |
| Name, headline, personas, quotes, socials, skills, education, achievements, About story | `src/content/profile/sarvesh.md` |
| Dashboard impact numbers (each needs a `proof:` link) | `src/content/dashboard/metrics.md` |
| Pinned / hidden repos, filter categories, repo description overrides | `src/content/project-settings/projects.md` |
| A blog post | `src/content/blog/<slug>/index.mdx` (+ `images/`) |
| Claude questions, answers, explanations, mock-exam selection | `src/content/claude/questions/domain-1.md` … `domain-5.md` |
| Claude exam guide pages | `src/content/claude/exams/*.md` |
| Jobs | `src/content/experience/*.md` |
| Certifications (badge image + verify URL) | `src/content/certifications/*.md` |
| Papers (with badge links) | `src/content/publications/*.md` |

**Full guide:** [docs/UPDATING.md](docs/UPDATING.md) explains, for every part of the site, which file to edit,
when to edit it, and what changes on the site as a result.

Frontmatter is validated at build time (`src/content.config.ts`); a typo fails the build with the file and field
name instead of shipping a broken page.

### Write a blog post

```bash
pnpm new:blog "Why deterministic tools beat clever prompts" --category Engineering --tags "MCP, Agents"
```

This creates `src/content/blog/why-deterministic-tools-beat-clever-prompts/index.mdx` and an `images/` folder.

```mdx
---
title: Why deterministic tools beat clever prompts
description: Shown on the card, in search results, and in RSS. 150–160 characters is ideal.
pubDate: 2026-11-01
tags: [MCP, Agents]
category: Engineering   # Engineering | Philosophy | Claude | Career
cover: ./images/cover.png
coverAlt: What the cover shows
canonical: https://medium.com/...   # optional, if first published elsewhere
featured: false
draft: true             # set to false to publish
---

Your post. Images: ![Alt text](./images/diagram.png). Components: <Callout type="tip">Hi</Callout>
```

Set `draft: false`, commit, push. The card on `/blog`, the landing-page "From the journal" section, tag pages, RSS,
sitemap, and search all update automatically. `pnpm check:content` verifies every referenced image exists.

### Pin a repository

Add its exact name under `pinned:` in `src/content/project-settings/projects.md`. Pinned repos show first (in that
order), get a "Pinned" badge, and appear on the landing page. Add a GitHub topic listed under `categories:` to put a
repo in a filter.

### Edit the Claude question bank

Questions are plain Markdown; the format is documented in
[`src/content/claude/README.md`](src/content/claude/README.md). `pnpm check:content` validates every question (four
options, exactly one `[x]`, an explanation for each wrong option, an `https://` doc link) and compiles the JSON the
exam pages load.

## How it works

```
src/content/**.md(x) ─► zod schemas (content.config.ts) ─► src/lib/content.ts ─► pages & components
claude/questions/*.md ─► scripts/build-claude-data.mjs ─► public/claude/**.json  (generated, git-ignored)
GitHub API ───────────► scripts/fetch-github.mjs ──────► src/data/github.json   (committed fallback snapshot)
astro build ─► scripts/csp.mjs (hash inline scripts → CSP meta) ─► pagefind (search) ─► GitHub Pages
```

| Script | Purpose |
| --- | --- |
| `pnpm build` | Compile questions → sync GitHub → validate content → Astro build → CSP → search index |
| `pnpm check:content` | Validate question banks, blog images, pinned/hidden repo names |
| `pnpm new:blog "Title"` | Scaffold a post folder |
| `pnpm github:sync` | Refresh the GitHub snapshot (set `GITHUB_TOKEN` for higher rate limits) |
| `pnpm claude:build` | Recompile only the Claude question JSON |
| `pnpm check` / `pnpm lint` / `pnpm format` | Type-check, ESLint, Prettier |

**Stack:** Astro 7, Tailwind CSS 4, MDX, KaTeX, Shiki, Pagefind, Lucide. Fonts: Cormorant Garamond (display) and
Inter (body), self-hosted. No client-side frameworks, no tracking, no third-party scripts.

**Design system:** cream parchment, espresso, cocoa and antique gold in light mode; espresso, walnut, ivory and
champagne gold in dark mode (dark is the default, the toggle remembers your choice). Motion: constellation canvas,
masked headline reveal, persona rotator, scroll reveals, count-ups, gilded hover borders, marquee. All of it
respects `prefers-reduced-motion`, and content stays visible without JavaScript.

## Deployment

`.github/workflows/deploy.yml` deploys to GitHub Pages on every push to `main` **and daily at 03:17 UTC** so star
and fork counts stay fresh. `retry-pages-deploy.yml` re-runs transient Pages failures with backoff.

One-time setup: **Settings → Pages → Source: GitHub Actions**. Custom domain is set by `public/CNAME`
(`sarveshtalele.org`).

## Quality & security

- `ci.yml` on every PR: content validation, ESLint, `astro check`, full build, `pnpm audit --audit-level high`
- CodeQL weekly and on PRs; Dependabot for npm and GitHub Actions
- Strict CSP with hashed inline scripts, `object-src 'none'`, `base-uri 'self'`; referrer policy; `noopener
  noreferrer` on external links; content links restricted to `https:`/`mailto:`/site paths
- See [SECURITY.md](SECURITY.md) to report a vulnerability

## Repository layout

```
src/
  content/            ← all editable content (Markdown/MDX)
  components/         ← Hero, RepoCard, ProjectExplorer, BlogCard, ImpactGrid, GithubPanel, CredentialWall, …
  layouts/            ← BaseLayout (reveal + progress bar), PageLayout, ArticleLayout
  lib/                ← site.ts (tech config), content.ts, github.ts, blog.ts
  pages/              ← routes
  data/               ← github.json snapshot, claude-stats.json (generated)
  styles/global.css   ← theme tokens + shared component classes
scripts/              ← build-claude-data, fetch-github, validate-content, csp, new-blog
progress.md           ← timestamped log of every structural decision
CLAUDE.md             ← rules for AI agents editing this repo
```

## License

Content (writing, exam questions, images, photo) © Sarvesh Talele, all rights reserved. Exam questions are original
practice material, not official Anthropic exam content.
