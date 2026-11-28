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
dashboard, a newsletter, and a free Claude Certified Architect (CCAR-F) mock exam with 360 practice questions
(also as downloadable PDFs).

**Everything on the site is generated from Markdown.** Edit a `.md` file, push, and every card, page, tag, feed,
search entry, and dashboard tile that depends on it updates on the next deploy.

**Publishing a newsletter article?** Read [HOW-TO-PUBLISH.md](HOW-TO-PUBLISH.md): five steps, all on github.com.
**What lives where?** [content/README.md](content/README.md).

---

## Pages

| Route                                                                                                                                 | What it shows                                                                                                                                                                                                                                                                                                     | Source of truth                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `/`                                                                                                                                   | Andromeda Voyage: a first-person Three.js flight (lazy-loaded, CSS galaxy fallback). Scrolling is the throttle; each chapter is a world on the way to Andromeda, with cockpit readouts and an optional soundtrack (off by default)                                                                                | profile, dashboard, project settings, newsletter, media, experience |
| `/dashboard`                                                                                                                          | Recruiter view: every metric links to proof, live GitHub stats, verified badges, credentials, research                                                                                                                                                                                                            | `dashboard/metrics.md` + GitHub API + certifications + publications |
| `/projects`                                                                                                                           | Every public repo, pinned first; search, category + language filters, sort by stars/forks/updated/name                                                                                                                                                                                                            | GitHub API + `project-settings/projects.md`                         |
| `/newsletter`, `/newsletter/archive`, `/newsletter/products`, `/newsletter/about`, `/newsletter/<slug>`, `/newsletter/topics/<topic>` | Sarvesh's AI Newsletter: night-sky hero with my photo, featured article + latest list, "From curious to certified" path, topic shelves; archive with search, multi-topic filters, sort, year, grid/list, pagination; Topmate products; Substack-style article page. Light paper theme by default, dark on request | `newsletter/<slug>/index.md`, `products/products.md`                |
| `/references`                                                                                                                         | Podcasts and talks (thumbnails), plus LinkedIn posts and articles published elsewhere, with source/topic filters and search                                                                                                                                                                                       | `references/links.md`, `media/appearances.md`                       |
| `/claude` (Claude Prep)                                                                                                               | Both Anthropic badges (verify on Credly), practice hub, study guides                                                                                                                                                                                                                                              | certifications + `claude/exams/*.md`                                |
| `/claude/foundations`                                                                                                                 | CCAR-F guide: glance, domains, scenarios, mental model, resources                                                                                                                                                                                                                                                 | `claude/exams/foundations.md`                                       |
| `/claude/quiz`                                                                                                                        | Timed 60-question mock exam (scored by domain) + untimed practice                                                                                                                                                                                                                                                 | `claude/questions/*.md` (`mock: true`)                              |
| `/claude/review`                                                                                                                      | All 360 questions grouped by task statement, test mode, doc links, PDF downloads (Study + Practice editions)                                                                                                                                                                                                      | `claude/questions/*.md`                                             |
| `/about`, `/experience`, `/certifications`, `/publications`, `/contact`                                                               | Story, timeline, badges, papers, channels                                                                                                                                                                                                                                                                         | profile, experience, certifications, publications                   |

## Quick start

```bash
nvm use            # Node 24 (minimum 22.23.4, see .nvmrc)
pnpm install
pnpm dev           # http://localhost:4321 (drafts are visible in dev)
pnpm build         # production build into dist/
pnpm preview
```

## Updating content (the only thing you normally touch)

| To change…                                                                               | Edit this file                                                                                 |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Name, headline, hero label, quote, socials, skills, education, achievements, About story | `content/profile/sarvesh.md`                                                                   |
| Dashboard impact numbers (each needs a `proof:` link)                                    | `content/dashboard/metrics.md`                                                                 |
| Pinned / hidden repos, filter categories, repo description overrides                     | `content/project-settings/projects.md`                                                         |
| A newsletter article                                                                     | `content/newsletter/<slug>/index.md` (+ `images/`), see [HOW-TO-PUBLISH.md](HOW-TO-PUBLISH.md) |
| LinkedIn posts / articles elsewhere                                                      | `content/references/links.md`                                                                  |
| Podcasts and talks                                                                       | `content/media/appearances.md` (YouTube video ID)                                              |
| Claude questions, answers, explanations, mock-exam selection                             | `content/claude/questions/domain-1.md` … `domain-5.md`                                         |
| Claude exam guide pages                                                                  | `content/claude/exams/*.md`                                                                    |
| Jobs                                                                                     | `content/experience/*.md`                                                                      |
| Certifications (badge image + verify URL)                                                | `content/certifications/*.md`                                                                  |
| Papers (with badge links)                                                                | `content/publications/*.md`                                                                    |

**Full guide:** [docs/UPDATING.md](docs/UPDATING.md) explains, for every part of the site, which file to edit,
when to edit it, and what changes on the site as a result.

Frontmatter is validated at build time (`content.config.ts`); a typo fails the build with the file and field
name instead of shipping a broken page.

### Publish a newsletter article

On github.com: create `content/newsletter/<slug>/index.md`, add the frontmatter, upload images to `images/`, commit.
Step by step: [HOW-TO-PUBLISH.md](HOW-TO-PUBLISH.md). Locally:

```bash
pnpm new:article "Claude Code Hooks, Explained" --tags "Claude, Agents"
```

Articles get topic pages from their tags and appear on the homepage, `/newsletter`, the archive, the sitemap, and
search. `pnpm check:content` verifies every referenced image exists.

### Pin a repository

Add its exact name under `pinned:` in `content/project-settings/projects.md`. Pinned repos show first (in that
order), get a "Pinned" badge, and appear on the landing page. Add a GitHub topic listed under `categories:` to put a
repo in a filter.

### Edit the Claude question bank

Questions are plain Markdown; the format is documented in
[`content/claude/README.md`](content/claude/README.md). `pnpm check:content` validates every question (four
options, exactly one `[x]`, an explanation for each wrong option, an `https://` doc link) and compiles the JSON the
exam pages load.

## How it works

```
content/**.md(x) ─► zod schemas (content.config.ts) ─► src/lib/content.ts ─► pages & components
claude/questions/*.md ─► scripts/build-claude-data.mjs ─► public/claude/**.json  (generated, git-ignored)
                      └► scripts/build-claude-pdf.mjs ─► verify-claude-pdf.mjs ─► public/claude/downloads/*.pdf
GitHub API ───────────► scripts/fetch-github.mjs ──────► src/data/github.json   (committed fallback snapshot)
astro build ─► scripts/csp.mjs (hash inline scripts → CSP meta) ─► pagefind (search) ─► GitHub Pages
```

| Script                                     | Purpose                                                                                                     |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `pnpm build`                               | Compile questions → build + verify PDFs → sync GitHub → validate content → Astro build → CSP → search index |
| `pnpm check:content`                       | Validate question banks, newsletter images and dates, pinned/hidden repo names                              |
| `pnpm new:article "Title"`                 | Scaffold a newsletter article folder                                                                        |
| `pnpm claude:pdf`                          | Rebuild and verify the two question-bank PDFs                                                               |
| `pnpm github:sync`                         | Refresh the GitHub snapshot (set `GITHUB_TOKEN` for higher rate limits)                                     |
| `pnpm claude:build`                        | Recompile only the Claude question JSON                                                                     |
| `pnpm check` / `pnpm lint` / `pnpm format` | Type-check, ESLint, Prettier                                                                                |

**Stack:** Astro 7, Tailwind CSS 4, MDX, KaTeX, Shiki, Pagefind, Lucide, Three.js (homepage scene only), pdfkit. Font: the system font stack (SF Pro on
Apple devices), no web fonts. No client-side frameworks, no third-party scripts.

**Design:** Apple-style. Generous whitespace, soft cards, warm cream/brown palette in light mode and
espresso/ivory/champagne in dark mode. The homepage is a cinematic Three.js journey; everything else is calm. All
motion respects `prefers-reduced-motion`, and the page works fully without WebGL or JavaScript.

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
content/              ← all editable content (Markdown); map in content/README.md
  newsletter/         ← one folder per article (+ _template/)
  references/ media/  ← links elsewhere, podcasts and talks
  profile/ dashboard/ project-settings/ projects/ experience/ certifications/ publications/ claude/
src/
  components/         ← IntroHero, MissionScene, MissionHUD, SoundToggle, newsletter/*, PodcastCard, …
  layouts/            ← BaseLayout, PageLayout, ArticleLayout
  lib/                ← site.ts (tech config), content.ts, github.ts, newsletter.ts
  pages/              ← routes
  scripts/            ← client modules (mission-scene.ts: the Three.js scene)
  data/               ← github.json snapshot, claude-stats.json (generated)
  styles/global.css   ← theme tokens + shared component classes
scripts/              ← build-claude-data, build/verify-claude-pdf, fetch-github, validate-content, csp, new-article
docs/                 ← UPDATING.md (owner guide), DESIGN-PLAN.md, PLAN-2026-11.md
HOW-TO-PUBLISH.md     ← publishing a newsletter article from github.com
progress.md           ← timestamped log of every structural decision
CLAUDE.md             ← rules for AI agents editing this repo
```

## License

Content (writing, exam questions, images, photo) © Sarvesh Talele, all rights reserved. Exam questions are original
practice material, not official Anthropic exam content.
