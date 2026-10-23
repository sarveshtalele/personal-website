# Progress Log

Timestamped log of every decision and action on the site rebuild. Newest entries at the bottom.
Format: `[YYYY-MM-DD HH:MM UTC] TYPE — note` where TYPE is PLAN, DECISION, ACTION, DONE, or ISSUE.

## Session 1 — Full restructure

[2026-10-23 15:15 UTC] ACTION — Read repo: Astro 7 + Tailwind 4, GitHub Pages deploy, Claude pages (index, foundations, quiz, review), 360-question JSON in public/claude.
[2026-10-23 15:15 UTC] DECISION — User answers: questions as one MD per domain; blog seeded with "I Built a Financial AI That Refuses to Guess" as MDX with per-post image folder; stats from site MD + GitHub API; keep GitHub Pages.
[2026-10-23 15:15 UTC] DECISION — Frontend skill not used (user preference). No Claude co-author trailer on commits.
[2026-10-23 15:17 UTC] ACTION — Fetched 52 public repos via GitHub MCP (top: claude-architect-exam-guide ★180/⑂82). Scraped live site structure. Medium image CDN blocked by sandbox proxy → blog images will be original SVG illustrations in the post folder.
[2026-10-23 15:17 UTC] ISSUE — Local git identity was "Claude <noreply@anthropic.com>". Set repo-local identity to Sarvesh Talele <talelesarvesh@gmail.com>. Existing history already authored by Sarvesh (verified), nothing to rewrite.
[2026-10-23 15:17 UTC] ACTION — pnpm install OK, baseline build OK. Added @fontsource/cormorant-garamond (serif display).

### Plan
[2026-10-23 15:17 UTC] PLAN — Information architecture:
  - / (landing): animated hero (Philosopher · AI Engineer · Traveller), proof strip, dashboard preview, pinned work, latest blogs, Claude, timeline, contact.
  - /dashboard: evidence-backed stats (every number links to proof), GitHub live stats, credentials with official verify badges.
  - /projects: all repos (build-time snapshot + live refresh), pinned via MD, filter by category/language, sort by stars/forks/updated/name, search.
  - /blog + /blog/[slug] + /blog/tags/[tag]: MDX posts, each in its own folder with images; cards with title + description; tag filter + search.
  - /claude hub, /claude/foundations, /claude/quiz (mock), /claude/review (360): questions live in src/content/claude/questions/domain-N.md, compiled by scripts/build-claude-data.mjs.
  - /about, /experience, /certifications, /publications, /contact, /privacy, /search kept and retuned.
[2026-10-23 15:17 UTC] PLAN — Editable content all in src/content/**/*.md(x): profile, dashboard, projects settings, blog, claude questions/exam, experience, certifications, publications, travel.
[2026-10-23 15:17 UTC] PLAN — Theme: cream/parchment + espresso/cocoa brown + muted gold (light); espresso/walnut + champagne gold (dark). Cormorant Garamond display + Inter body.
[2026-10-23 15:17 UTC] PLAN — Security: strict CSP meta, referrer policy, no unescaped innerHTML of content, validated content schemas, Dependabot, CodeQL, CI checks, SECURITY.md.
[2026-10-23 15:19 UTC] DONE — Task 1: 360 questions migrated to src/content/claude/questions/domain-{1..5}.md (task statements + questions). scripts/build-claude-data.mjs compiles + validates → public/claude/**.json. Round-trip verified byte-equal to original JSON (360 review, 30 concepts, 60 mock).
[2026-10-23 15:25 UTC] ACTION — New content collections (profile, dashboard, projectSettings, blog, travel, claudeExams) with link-safety validation. Profile/dashboard/projects/exam MD files written.
[2026-10-23 15:25 UTC] ACTION — scripts/fetch-github.mjs (build-time GitHub sync, token optional, falls back to committed snapshot src/data/github.json seeded with 52 repos via MCP).
[2026-10-23 15:25 UTC] ACTION — Theme rewrite (global.css): cream/espresso/gold tokens, Cormorant Garamond display, gilded cards, scroll reveal, marquee, reduced-motion support. New Navbar, Footer, Section, Button, PageLayout, BaseHead (JSON-LD from profile MD).
[2026-10-23 15:25 UTC] ACTION — Hero: constellation canvas (pauses off-screen), masked headline reveal, persona rotator, arched portrait with orbit rings + rotating SVG text ring.
[2026-10-23 15:25 UTC] DECISION — GitHub data is build-time only (no client API calls) → no rate limits for visitors and a tighter CSP. Daily scheduled rebuild keeps stars/forks fresh.
[2026-10-23 15:25 UTC] DECISION — Not using Astro security.csp: it always emits style hashes, which disables 'unsafe-inline' and breaks Shiki's inline-styled code blocks. Instead scripts/csp.mjs runs post-build, SHA-256 hashes every inline script per page, and injects a strict CSP meta (no unsafe-inline scripts, object-src none, base-uri self).
[2026-10-23 15:48 UTC] ACTION — Pages: landing (hero, credential marquee, impact grid, quote interlude, pinned repos, journal, Claude, journey, CTA), /dashboard, /projects (filter/sort/search/pinned, URL-synced), /blog + /blog/[slug] + /blog/tags/[tag] + /rss.xml, /claude hub + /claude/[exam] (from exams/*.md), quiz/review rethemed on site tokens, about/experience/certs/publications/contact/privacy/404/search refreshed.
[2026-10-23 15:48 UTC] ACTION — Blog post "I Built a Financial AI That Refuses to Guess" as MDX with its own images/ folder (cover, architecture, meta-advisor SVGs). Draft template at src/content/blog/_template. scripts/new-blog.mjs scaffolds posts.
[2026-10-23 15:48 UTC] ACTION — Removed every "Download resume" button and public/resume.pdf. Old live-API components (GitHubRepoExplorer, SpaceDashboard, StatsDashboard, PublicationCard, PrevNext) deleted.
[2026-10-23 15:48 UTC] ISSUE — Browser QA (Playwright, 16 pages × light/dark × desktop/375px): fixed 210px mobile overflow on /projects (long repo slug), hero headline too wide, text ring overlapping portrait, shared CSS classes only loading with their component, unlayered .field padding beating Tailwind utilities (moved shared classes into @layer components), missing spaces before inline <strong>/<em>.
[2026-10-23 15:48 UTC] DONE — Browser QA clean: no page errors, no CSP violations, no horizontal overflow. Only failures are shields.io badge images blocked by the sandbox proxy (they load in production). Quiz practice flow + review (360 rendered) verified.
[2026-10-23 15:59 UTC] ISSUE — pnpm audit: 1 critical (Astro <7.2.8 RCE via AVIF optimisation) + 29 high transitive. Ran pnpm update within semver ranges → only 1 low remains. Astro 7.4.2 needs Node ≥22.23.4: engines + .nvmrc updated; CI uses latest Node 22.
[2026-10-23 15:59 UTC] ACTION — Repo setup: CI (content validation, lint, astro check, build, audit), CodeQL, Dependabot, CODEOWNERS, PR template, issue forms (bug, exam-question correction), SECURITY.md, daily scheduled deploy for fresh GitHub stats.
[2026-10-23 15:59 UTC] ACTION — Docs: CLAUDE.md (agent rules + where-to-edit map), README rewrite, src/content/claude/README.md (question format), llms.txt refresh, regenerated og-home.png from the new hero.
[2026-10-23 15:59 UTC] DONE — Final verification: pnpm check:content ✔, pnpm build ✔ (22 pages, CSP on all), astro check 0 errors/0 warnings, eslint clean, Playwright QA clean on light/dark × desktop/mobile.

### Open items for the owner
- Medium images could not be downloaded from the sandbox; the post uses original SVG illustrations. Drop the Medium screenshots into src/content/blog/i-built-a-financial-ai-that-refuses-to-guess/images/ and reference them if preferred.
- LinkedIn is login-walled; dashboard numbers come from the experience MD. Edit src/content/dashboard/metrics.md to add LinkedIn-only facts (each with a proof link).
- Travel notes: copy src/content/travel/_example.md to add real places; the landing "Traveller's notebook" appears automatically.
- Repo About/topics on GitHub (description, website, topics) must be set in the GitHub UI.
[2026-10-23 15:59 UTC] DONE — Committed as Sarvesh Talele (no co-author trailer) and pushed to claude/blissful-clarke-6s5lv2.

## Session 2 — Remove travel section, docs, deploy

[2026-10-23 16:12 UTC] PLAN — User: live site unchanged (branch never merged). Remove travel collection/section (traveller stays as a theme persona only), use shields.io badges, write a detailed when-to-update guide, set GitHub repo description + website, push to main and deploy.
[2026-10-23 16:21 UTC] ACTION — Removed travel collection, landing 'Traveller's notebook' and the Travel blog category; Traveller remains a theme persona only. README badges all on shields.io. Added docs/UPDATING.md (event → file → effect guide, field reference, theme, badges, cadence).
[2026-10-23 16:21 UTC] ISSUE — Setting repo description/homepage/topics via API refused: sandbox proxy blocks repository-settings writes. Owner sets them in GitHub UI (About → gear).
[2026-10-23 16:21 UTC] DONE — build ✔, astro check 0/0, eslint clean, Playwright QA clean.
