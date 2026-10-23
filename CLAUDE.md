# CLAUDE.md

Guidance for AI coding agents (and humans) working on **sarveshtalele.org**.

## What this is

A static Astro 7 site deployed to GitHub Pages. **All content is Markdown/MDX in `src/content/`.** Pages, cards,
dashboards, tag pages, RSS, sitemap, search index, and the Claude mock exam are all generated from those files at
build time. The owner should only ever need to edit Markdown.

## Rules

1. **Never hard-code personal data in components.** Names, bios, socials, stats, skills, and quotes come from
   `src/content/profile/sarvesh.md` and `src/content/dashboard/metrics.md` via `src/lib/content.ts`.
2. **Every dashboard number must link to proof** (`proof:` field). Do not invent metrics. GitHub numbers are computed,
   never typed.
3. **No client-side API calls or third-party scripts.** GitHub data is fetched at build time
   (`scripts/fetch-github.mjs` → `src/data/github.json`). The CSP (`scripts/csp.mjs`) hashes inline scripts; adding
   an external script means updating the CSP deliberately.
4. **Links from content must be `https://`, `mailto:`, or start with `/`** (enforced by the `link` schema). External
   links use `target="_blank" rel="noopener noreferrer"`.
5. **Colours only via theme tokens** in `src/styles/global.css` (`--bg`, `--fg`, `--primary`, `--accent`, …). Light =
   cream/espresso/gold, dark = espresso/ivory/champagne. Apple-style base: system font stack only (no web fonts),
   clean cards. Owner-requested motion: rectangle hero (`IntroHero.astro`, rotating gradient border),
   skills marquee, scroll story, ⌘K quick menu, card spotlight + tilt, magnetic buttons,
   view-transition theme toggle, back-to-top progress ring, heading wipe-ins. No persona cards, canvas effects, or travel section.
6. Shared component classes (`.card`, `.chip`, `.pill`, `.field`, `.btn-primary`, `.link-arrow`, `.verify-btn`) live in
   `@layer components` in `global.css` so Tailwind utilities can override them. Don't put shared classes in a single
   component's `<style is:global>`.
7. Animations must respect `prefers-reduced-motion` and must not hide content without JS (`.js [data-reveal]`).
8. Mobile first: test at 375px. No horizontal overflow (long slugs need `break-all`).
9. **Log every decision and action in `progress.md`** with a UTC timestamp, before and after the change:
   `[YYYY-MM-DD HH:MM UTC] TYPE — note` (TYPE = PLAN, DECISION, ACTION, DONE, ISSUE).
10. Commits are authored by the repo owner. Do not add AI co-author trailers.
11. Never render the owner's email address anywhere on the site. Contact is Topmate + LinkedIn.
12. Scoped component `<style>` is unlayered: never set `display` there on elements that also use Tailwind
    responsive visibility (`hidden`, `lg:hidden`, `sm:inline-flex`), or the utilities stop working.

## Commands

```bash
pnpm dev               # compile question banks, start dev server (drafts visible)
pnpm build             # full production build: data → validate → astro → CSP → pagefind
pnpm check:content     # validate question banks, blog images, pinned repo names
pnpm check && pnpm lint
pnpm new:blog "Title" --category Engineering --tags "MCP, Agents"
pnpm github:sync       # refresh src/data/github.json (GITHUB_TOKEN optional)
pnpm claude:build      # recompile Claude question banks only
```

Node 24 (see `.nvmrc`; minimum 22.23.4), pnpm 11.

## Where things live

| Want to change… | Edit |
| --- | --- |
| Name, headline, hero label, quote, socials, skills, education, achievements, About story | `src/content/profile/sarvesh.md` |
| Dashboard impact tiles and highlights | `src/content/dashboard/metrics.md` |
| Pinned / hidden repos, category filters, repo description overrides | `src/content/project-settings/projects.md` |
| Blog posts | `src/content/blog/<slug>/index.mdx` + `images/` |
| Claude questions (360) and mock exam selection | `src/content/claude/questions/domain-*.md` (format: `src/content/claude/README.md`) |
| Claude exam guide pages | `src/content/claude/exams/*.md` |
| Jobs | `src/content/experience/*.md` |
| Certifications (badge + verify link) | `src/content/certifications/*.md` |
| Papers | `src/content/publications/*.md` |
| Optional project case studies (`/projects/<id>`) | `src/content/projects/*.mdx` |
| Nav links, analytics ID, Giscus | `src/lib/site.ts` |

Owner-facing guide: `docs/UPDATING.md`. Keep it in sync when content files or fields change.

## Architecture

```
src/content/**.md(x) ──► content.config.ts (zod schemas) ──► src/lib/content.ts ──► pages/components
src/content/claude/questions/*.md ──► scripts/build-claude-data.mjs ──► public/claude/**.json (git-ignored)
GitHub API ──► scripts/fetch-github.mjs ──► src/data/github.json (committed snapshot) ──► src/lib/github.ts
astro build ──► scripts/csp.mjs (CSP meta) ──► pagefind (search index) ──► dist/ ──► GitHub Pages
```

Pages: `/`, `/dashboard`, `/projects`, `/blog`, `/blog/[slug]`, `/blog/tags/[tag]`, `/rss.xml`, `/claude`,
`/claude/[exam]`, `/claude/quiz`, `/claude/review`, `/about`, `/experience`, `/certifications`, `/publications`,
`/contact`, `/search`, `/privacy`, `/404`.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and deploys. It also runs daily (03:17 UTC) so GitHub stars and
forks stay current. PRs run `ci.yml` (content validation, lint, type-check, build, audit) and CodeQL.
