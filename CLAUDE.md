# CLAUDE.md

Guidance for AI coding agents (and humans) working on **sarveshtalele.org**.

## What this is

A static Astro 7 site deployed to GitHub Pages. **All content is Markdown/MDX in `content/`.** Pages, cards,
dashboards, newsletter pages and topic pages, sitemap, search index, the Claude mock exam, and the question-bank PDFs are
all generated from those files at build time. The owner should only ever need to edit Markdown.

## Rules

1. **Never hard-code personal data in components.** Names, bios, socials, stats, skills, and quotes come from
   `content/profile/sarvesh.md` and `content/dashboard/metrics.md` via `src/lib/content.ts`.
2. **Every dashboard number must link to proof** (`proof:` field). Do not invent metrics. GitHub numbers are computed,
   never typed.
3. **No client-side API calls or third-party scripts.** GitHub data is fetched at build time
   (`scripts/fetch-github.mjs` → `src/data/github.json`). The CSP (`scripts/csp.mjs`) hashes inline scripts; adding
   an external script means updating the CSP deliberately.
4. **Links from content must be `https://`, `mailto:`, or start with `/`** (enforced by the `link` schema). External
   links use `target="_blank" rel="noopener noreferrer"`.
5. **Colours only via theme tokens** in `src/styles/global.css` (`--bg`, `--fg`, `--primary`, `--accent`, `--ion`, …).
   "Andromeda Voyage": the site is **dark-only** (`.dark` tokens: indigo void, starlight ink, gold `--primary`, nebula
   violet `--accent`). The light `:root` tokens are the newsletter's **paper** mode (default on `/newsletter/*`, reader can
   switch; `nl-theme` in localStorage, set by the head script in `BaseHead.astro`). System fonts only (newsletter body
   uses the system serif stack). Owner-requested motion: homepage voyage (`MissionScene.astro` + `src/scripts/mission-scene.ts`:
   first-person Three.js flight, one world per chapter, procedural Andromeda, warp streaks; `MissionHUD.astro` cockpit
   frame, readouts and chapter rail), hero without photo (`IntroHero.astro`), optional Web Audio soundtrack
   (`SoundToggle.astro` + `src/scripts/sound.ts`, **off by default, only starts from a tap**), newsletter night-sky hero
   and storybook path (`src/components/newsletter/`), credential cards, skills bento, stacking-card scroll story,
   ⌘K quick menu, card spotlight + tilt, magnetic buttons, back-to-top progress ring, heading wipe-ins. The owner's photo
   is not shown on the homepage. Film-inspired moods only: never copy ships, characters, logos or music from films.
6. Shared component classes (`.card`, `.chip`, `.pill`, `.field`, `.btn-primary`, `.link-arrow`, `.verify-btn`) live in
   `@layer components` in `global.css` so Tailwind utilities can override them. Don't put shared classes in a single
   component's `<style is:global>`.
7. Animations must respect `prefers-reduced-motion` and must not hide content without JS (`.js [data-reveal]`).
8. Mobile first: test at 375px. No horizontal overflow (long slugs need `break-all`).
9. **Log every decision and action in `progress.md`** with a UTC timestamp, before and after the change:
   `[YYYY-MM-DD HH:MM UTC] TYPE — note` (TYPE = PLAN, DECISION, ACTION, DONE, ISSUE).
10. Commits are authored by the repo owner. Do not add AI co-author trailers.
11. Never render the owner's email address anywhere on the site. Contact is Topmate + LinkedIn.
12. Decorative layers (SVG lines, blobs, glows) must be `pointer-events: none` so they never cover links.
13. Copy is first person, plain, and human (see `docs/UPDATING.md` → Writing style). Design rationale: `docs/DESIGN-PLAN.md`.
14. Scoped component `<style>` is unlayered: never set `display` there on elements that also use Tailwind
    responsive visibility (`hidden`, `lg:hidden`, `sm:inline-flex`), or the utilities stop working.

## Visual design and motion

Before creating product-style illustrations, animated diagrams, UI demos or motion graphics, read `.agents/skills/stageshow/SKILL.md`. Follow its site-adapted guidance for composition, story beats, timing, framing, loop continuity, reduced-motion fallback and rehearsal. Keep the site palette and system typography; do not add external fonts, runtime scripts or a client framework just to animate an illustration.

## Commands

```bash
pnpm dev               # compile question banks, start dev server (drafts visible)
pnpm build             # full production build: data → validate → astro → CSP → pagefind
pnpm check:content     # validate question banks, newsletter images, pinned repo names
pnpm check && pnpm lint
pnpm new:article "Title" --tags "MCP, Agents" # newsletter article scaffold
pnpm claude:pdf        # rebuild + verify the two question-bank PDFs
pnpm github:sync       # refresh src/data/github.json (GITHUB_TOKEN optional)
pnpm claude:build      # recompile Claude question banks only
```

Node 24 (see `.nvmrc`; minimum 22.23.4), pnpm 11.

## Where things live

| Want to change…                                                                          | Edit                                                                                |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Name, headline, hero label, quote, socials, skills, education, achievements, About story | `content/profile/sarvesh.md`                                                        |
| Dashboard impact tiles and highlights                                                    | `content/dashboard/metrics.md`                                                      |
| Pinned / hidden repos, category filters, repo description overrides                      | `content/project-settings/projects.md`                                              |
| Newsletter articles                                                                      | `content/newsletter/<slug>/index.md` + `images/` (owner guide: `HOW-TO-PUBLISH.md`) |
| Newsletter products (Topmate) → `content/products/products.md`                           |
| LinkedIn posts / external articles                                                       | `content/references/links.md`                                                       |
| Podcasts and talks (YouTube ID)                                                          | `content/media/appearances.md`                                                      |
| Claude questions (360) and mock exam selection                                           | `content/claude/questions/domain-*.md` (format: `content/claude/README.md`)         |
| Claude exam guide pages                                                                  | `content/claude/exams/*.md`                                                         |
| Jobs                                                                                     | `content/experience/*.md`                                                           |
| Certifications (badge + verify link)                                                     | `content/certifications/*.md`                                                       |
| Papers                                                                                   | `content/publications/*.md`                                                         |
| Optional project case studies (`/projects/<id>`)                                         | `content/projects/*.mdx`                                                            |
| Nav links, analytics ID, Giscus                                                          | `src/lib/site.ts`                                                                   |

Owner-facing guides: `HOW-TO-PUBLISH.md`, `content/README.md`, `docs/UPDATING.md`. Keep it in sync when content files or fields change.

## Architecture

```
content/**.md(x) ──► content.config.ts (zod schemas) ──► src/lib/content.ts ──► pages/components
content/claude/questions/*.md ──► scripts/build-claude-data.mjs ──► public/claude/**.json (git-ignored)
                              └─► scripts/build-claude-pdf.mjs ──► verify-claude-pdf.mjs ──► public/claude/downloads/*.pdf
GitHub API ──► scripts/fetch-github.mjs ──► src/data/github.json (committed snapshot) ──► src/lib/github.ts
astro build ──► scripts/csp.mjs (CSP meta) ──► pagefind (search index) ──► dist/ ──► GitHub Pages
```

Pages: `/`, `/dashboard`, `/projects`, `/newsletter`, `/newsletter/archive`, `/newsletter/products`, `/newsletter/about`,
`/newsletter/[slug]`, `/newsletter/topics/[topic]`,
`/references`, `/claude`,
`/claude/[exam]`, `/claude/quiz`, `/claude/review`, `/about`, `/experience`, `/certifications`, `/publications`,
`/contact`, `/search`, `/privacy`, `/404`.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and deploys. It also runs daily (03:17 UTC) so GitHub stars and
forks stay current. PRs run `ci.yml` (content validation, lint, type-check, build, audit) and CodeQL.
