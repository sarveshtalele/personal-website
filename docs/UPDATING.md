# Updating sarveshtalele.org

This guide tells you **which file to edit, when to edit it, and what changes on the website** as a result. Every
page is generated from Markdown in `content/`, so you never need to touch code to keep the site current.

> **The loop for every change:** edit the Markdown file → commit → push to `main` → GitHub Actions rebuilds and
> deploys in about 2 minutes. You can also edit directly on github.com (pencil icon on any file → "Commit changes").

---

## 1. "Something happened, what do I update?"

| When this happens…                                 | Edit this file                                                                                                                     | What updates on the site                                                                              |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| You publish a newsletter article                   | New folder `content/newsletter/<slug>/index.md` (see [HOW-TO-PUBLISH.md](../HOW-TO-PUBLISH.md), or run `pnpm new:article "Title"`) | Newsletter home and archive, homepage "Transmissions", topic pages, sitemap, search                   |
| You shared the article on LinkedIn                 | That article's `linkedin:` field                                                                                                   | "Join the discussion on LinkedIn" at the end of the article                                           |
| It first appeared on Medium                        | Set `canonical:` to the Medium URL                                                                                                 | Search engines credit the original                                                                    |
| You fix a typo in an old article                   | That article's `index.md` (add `updatedDate:` only for real revisions)                                                             | The article; "Updated" date if set                                                                    |
| You post on LinkedIn or write elsewhere            | `content/references/links.md` → `items:`                                                                                           | `/references` (filters by source and topic)                                                           |
| You appear on a podcast or give a talk             | `content/media/appearances.md` → `items:` (YouTube video ID)                                                                       | Homepage "On air" with thumbnail, `/references`                                                       |
| You start a new job or get promoted                | `content/experience/<company-role>.md` (set old job's `current: false` + `endDate:`)                                               | Experience page, landing "Journey", dashboard "Currently" card                                        |
| A new impact number you can prove                  | `content/dashboard/metrics.md` → `impact:`                                                                                         | Dashboard + landing impact tiles                                                                      |
| You earn a certification                           | `content/certifications/<name>.md` (+ badge image in `public/images/badges/`)                                                      | Certifications page, About, dashboard; Claude page if the title contains "Claude Certified Architect" |
| A paper is published                               | `content/publications/<name>.md`                                                                                                   | Publications page, dashboard "Research"                                                               |
| You create a repo you want to show off             | `content/project-settings/projects.md` → `pinned:`                                                                                 | Projects page (top, with "Pinned" badge) + landing "Pinned projects"                                  |
| A repo is junk / a mirror                          | `projects.md` → `hidden:`                                                                                                          | Removed from Projects page and stats lists                                                            |
| A repo has no or weak GitHub description           | `projects.md` → `overrides:`                                                                                                       | That repo's card                                                                                      |
| You add a GitHub topic to a repo                   | Nothing here (topic must be listed under `categories:` to become a filter)                                                         | Category filter on the Projects page after the next deploy                                            |
| Stars/forks change                                 | Nothing. The site rebuilds daily at 03:17 UTC                                                                                      | Every GitHub number                                                                                   |
| Your title, headline, bio or socials change        | `content/profile/sarvesh.md`                                                                                                       | Navbar, hero, footer, About, SEO metadata, JSON-LD, Contact                                           |
| The small label above the headline                 | `profile/sarvesh.md` → `heroLabel:`                                                                                                | Landing hero (currently "AI Engineer")                                                                |
| Skill badges floating around your photo            | `profile/sarvesh.md` → `heroChips:` (up to 3)                                                                                      | Landing hero                                                                                          |
| You learn a new tool                               | `profile/sarvesh.md` → `skills:`                                                                                                   | Toolbox cards on Home, About, and Dashboard                                                           |
| The "How I work" steps                             | `profile/sarvesh.md` → `approach:`                                                                                                 | Scroll story under the hero                                                                           |
| The quote on the landing page                      | `profile/sarvesh.md` → `quotes:` (first entry is used)                                                                             | Hero (under the headline)                                                                             |
| A new achievement or award                         | `profile/sarvesh.md` → `achievements:` (and update the `8×` tile in `metrics.md` if it is a TCS award)                             | About "Achievements", dashboard                                                                       |
| You want a new Claude practice question            | `content/claude/questions/domain-<n>.md`                                                                                           | Learn & Review library, counts on Claude/landing/dashboard                                            |
| A question has a wrong answer                      | Same file, move the `[x]` and fix the explanations                                                                                 | Mock exam + library                                                                                   |
| You want to change which questions are in the mock | Add/remove `- mock: true` (keep 60 to mirror the real exam)                                                                        | `/claude/quiz`                                                                                        |
| Anthropic changes the exam (fee, time, domains)    | `content/claude/exams/foundations.md`                                                                                              | `/claude/foundations`                                                                                 |
| You are ready to publish the Professional guide    | `content/claude/exams/professional.md` → fill fields, set `status: live`                                                           | New page `/claude/professional` + live card on `/claude`                                              |
| New profile photo                                  | Replace `public/images/sarvesh-talele.jpg` (same name, square works best)                                                          | Navbar, hero, About, newsletter author line                                                           |
| New nav item, analytics, comments                  | `src/lib/site.ts` (the only non-Markdown settings file)                                                                            | Navbar/footer, GA, Giscus                                                                             |

---

## 2. File-by-file reference

### `content/profile/sarvesh.md`, who you are

**Update when:** your role, employer, headline, socials, skills, education, or story changes. Review every 3 months.

| Field                       | Shown on                                          | Notes                                                                                          |
| --------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `name`, `fullName`          | Navbar, footer, SEO title, JSON-LD                | `fullName` is used for schema.org and copyright                                                |
| `role`                      | About, footer, `<title>`                          | Keep it short: `AI Engineer · Claude Certified Architect`                                      |
| `heroLabel`                 | Small label above the landing headline            | e.g. `AI Engineer`                                                                             |
| `headline`                  | Hero headline                                     | Sentences split on `. `; the **third** sentence is rendered in gold italic                     |
| `tagline`                   | Hero paragraph, About intro                       | One sentence, concrete                                                                         |
| `summary`                   | Default meta description                          | 150–160 characters is ideal for search                                                         |
| `quotes`                    | Landing hero (first one)                          | `source` optional                                                                              |
| `socials`                   | Navbar, footer, Contact, badges, JSON-LD `sameAs` | Must be `https://` links. No email is shown anywhere on the site by design                     |
| `credentials`               | Credential cards on the landing page              | `label`, `href` (proof), optional `note` (issuer · year) and `badge` (image path in `public/`) |
| `achievements`              | About                                             | `href` optional                                                                                |
| `education`, `skills`       | About, Dashboard                                  | Skills are grouped; groups become filter pills                                                 |
| Body (Markdown below `---`) | About page story                                  | Plain Markdown, links allowed                                                                  |

### `content/dashboard/metrics.md`, the numbers recruiters see

**Update when:** you have a new, defensible number. Review every quarter.

- `impact:` → `value` (e.g. `50K+`, `4+ yrs`, `Top 15`; the first number animates), `label`, `context` (one line),
  `proof` (link to where it can be verified), `proofLabel`.
- `highlights:` → three cards under the GitHub panel (`icon`: `shield`, `flask`, `book`, `trophy`).
- **Rule:** never add a number you cannot link to. GitHub numbers are computed automatically; don't type them here.
- If a metric lives on LinkedIn only, link `proof:` to your LinkedIn profile or a post.

### `content/project-settings/projects.md`, the Projects page

**Update when:** you ship a repo worth featuring, or want to retire one from the top.

- `pinned:` exact repo names, in display order. The first six also appear on the landing page.
- `hidden:` repos never shown.
- `categories:` GitHub topic → filter label. Add the topic on GitHub, then it shows up here automatically.
- `overrides:` `description`, `demo` (https), `categories` per repo.
- `pnpm check:content` fails if a pinned or hidden name doesn't exist (catches typos).

### `content/newsletter/<slug>/index.md`, newsletter articles

**Update when:** you publish. One folder per article; images live beside it in `images/`. Beginner guide:
[HOW-TO-PUBLISH.md](../HOW-TO-PUBLISH.md). The `_template/` folder is never published.

```bash
pnpm new:article "Article title" --tags "Claude, Agents"
```

| Field                | Required    | Shown on                                                         |
| -------------------- | ----------- | ---------------------------------------------------------------- |
| `title` (≤140)       | yes         | Card, article header, `<title>`                                  |
| `seoTitle` (≤70)     | no          | Google result title instead of `title`                           |
| `description` (≤300) | yes         | Card text, meta description, social preview                      |
| `pubDate` or `date`  | yes         | Card, article, sort order                                        |
| `updatedDate`        | no          | "Updated" on the article, `dateModified` in JSON-LD              |
| `tags`               | no          | Topic chips, archive filters, `/newsletter/topics/<topic>` pages |
| `cover` + `coverAlt` | recommended | Card image, article hero, social share image                     |
| `linkedin`           | no          | "Discuss on LinkedIn" button                                     |
| `canonical`          | no          | Canonical URL if first published elsewhere                       |
| `draft`              | no          | `true` = only visible in `pnpm dev`                              |

Images: reference them as `./images/name.png`. `pnpm check:content` fails if an image is missing. `.mdx` articles
also get `<Callout type="tip|info|warning|success" title="…">`.

### `content/products/products.md`, the newsletter's Products tab

Each item: `title`, `type` (e.g. `Video call · 30 min`), `price` (`Free`, a price, or `See price on Topmate`), optional
`badge`, `icon` (`bundle`, `call`, `heart`, `book`), `summary`, `includes`, and `href` (its Topmate link). Also
`rating`/`ratings` (shown with a link to Topmate as proof) and `testimonials`. The free bundle also feeds step 3 of the
"From curious to certified" path.

### `content/references/links.md`, posts and articles elsewhere

Each item: `title`, `url` (https), `source` (e.g. `LinkedIn`, `Medium`), `date`, optional `note` and `topics`.
Sources and topics become filters on `/references` automatically.

### `content/media/appearances.md`, podcasts and talks

Each item: `title`, `show`, optional `host`, `date`, `youtube` (just the video ID, e.g. `ke1gVk8Ksno`), `summary`,
`topics`. The thumbnail and link are built from the ID. The newest one is featured on the homepage.

### The question-bank PDFs

Built on every deploy from `content/claude/questions/` (Study edition with answers inline, Practice edition with an
answer key at the back) and checked line by line against the source. Nothing to edit; run `pnpm claude:pdf` locally
to preview them in `public/claude/downloads/`.

### `content/experience/*.md`, jobs

**Update when:** you change role, company, or have new highlights (each bullet should contain a measurable result).
Only one entry should have `current: true`.

### `content/certifications/*.md`, credentials

**Update when:** you earn one. Add `credentialUrl` (the issuer's verify link, e.g. Credly) and `badge` (an image in
`public/images/badges/`). `featured: true` lists it on the landing page Claude block.

### `content/publications/*.md`, papers

**Update when:** a paper is accepted or gets a DOI/indexing. `badges:` adds verify buttons (arXiv, NASA ADS, code).

### `content/claude/questions/domain-*.md`, the question bank

**Update when:** you add questions, fix an answer, or the exam guide changes. The exact format is in
[`content/claude/README.md`](../content/claude/README.md). Every count on the site updates by itself.

### `content/claude/exams/*.md`, exam guide pages

**Update when:** Anthropic changes the exam facts, or a new track is ready (`status: live`).

### `src/lib/site.ts`, the only code-level settings

**Update rarely:** navigation links, footer links, Google Analytics ID (empty = off), Giscus comment IDs.

---

## 3. Theme (do not change by accident)

The site is **"Andromeda Voyage"**: dark-only, deep indigo space with starlight text, nebula violet accents and the
warm gold of the galaxy's core for buttons. The newsletter also has a **light paper** reading mode.

- **Homepage voyage** (`MissionScene.astro`, `src/scripts/mission-scene.ts`): you fly first-person toward the
  Andromeda galaxy. Scrolling is the throttle; fast scrolling stretches the stars into warp streaks. Each chapter is a
  world you pass: Earth (Departure), an orbital station (Flight Clearance), an asteroid field (Flight Protocol), a
  ringed giant (Mission Telemetry), a shipyard moon (Engineering Bay), a nebula relay (Transmissions), a pulsar (Comms
  Channel), an ice world (Flight Academy), binary stars (Instrument Panel), a wormhole (Voyage Log), and a black hole
  before Andromeda fills the screen (Open Channel). Phones get a lighter scene; reduced motion gets still frames; no
  WebGL gets a CSS galaxy. Chapter names and headings live in `src/pages/index.astro` (`chapters`).
- **Cockpit** (`MissionHUD.astro`): window frame, sector name, velocity, a countdown of the 2.537 million light-years
  to Andromeda, a sound chip, and (on wide screens) a chapter rail.
- **Soundtrack** (`SoundToggle.astro`, `src/scripts/sound.ts`): a speaker icon in the navbar. **Off by default**, it
  only starts when someone taps it. Generated live in the browser (no audio files): an ambient pad that changes chord
  per chapter, an engine hum that follows scroll speed, soft hover blips, and a whoosh at warp.
- **Hero** (`IntroHero.astro`): no photo. Status line, role, the quote rising in word by word, headline, tagline,
  buttons, highlight tags (Claude certifications and GitHub stars are automatic; the rest come from `heroChips:`), and
  socials.
- **Newsletter** (`src/components/newsletter/`): a night-sky illustration hero with your photo and a giant wordmark,
  the "From curious to certified" storybook path, and a Substack-style article page. A sun/moon switch appears only on
  newsletter pages; light paper is the default.
- **Credential cards**, **toolbox bento**, **stacking "How I build AI systems" cards**, **⌘K quick menu**, card
  spotlight + tilt, heading wipe-ins, count-ups and a back-to-top progress ring work as before.

| Token                 | Dark (whole site)                        | Light paper (newsletter only)                     |
| --------------------- | ---------------------------------------- | ------------------------------------------------- |
| Background            | void `#070814`                           | paper `#f6f5f0`                                   |
| Text                  | starlight `#eef0ff`                      | ink `#1c1a16`                                     |
| Primary (`--primary`) | galactic core gold `#f3c77a`             | nebula violet `#4b2fc9`                           |
| Accent (`--accent`)   | nebula violet `#a48bff`                  | violet `#5a3fd6`                                  |
| Font                  | System font (SF Pro / Segoe UI / Roboto) | newsletter body: system serif (Charter / Georgia) |

All colours are tokens in `src/styles/global.css`. To retune the palette, change the token values there, never
individual pages. All motion switches off for visitors who prefer reduced motion.

---

## 4. Badges (shields.io)

Profile and repo badges come from [shields.io](https://shields.io) and update themselves:

- Site: `src/components/VerifiedBadges.astro` (Dashboard + About) and the exam-guide stars badge on `/claude` (Claude Prep).
- README: the badge rows at the top.

To add one, build it at <https://shields.io/badges> (style `for-the-badge`, colour `6b4226` brown or `a67c3d` gold to
match the theme) and add `{ href, src, alt }` to the list in `VerifiedBadges.astro`.

---

## 5. Check before you push

```bash
pnpm check:content   # questions, newsletter images, pinned repo names (seconds)
pnpm dev             # preview at http://localhost:4321, drafts visible
pnpm build           # the exact build that deploys
```

CI runs the same checks on every pull request. If the build fails, the error names the file and field.

## 6. Publishing

```bash
git checkout main && git pull
# edit files…
git add -A
git commit -m "Blog: why deterministic tools beat clever prompts"
git push
```

Watch the deploy under **Actions → Deploy to GitHub Pages**. If Pages reports a transient failure, the retry
workflow re-runs it automatically.

## 7. Suggested cadence

| How often                       | What                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| Every article                   | New newsletter folder; add the LinkedIn post to `linkedin:` and `references/links.md` |
| Monthly                         | Review `pinned:` order; add GitHub topics to new repos                                |
| Quarterly                       | Dashboard metrics, experience highlights, skills                                      |
| On each credential              | Certification file + badge image; `credentials:` in profile                           |
| When Anthropic updates the exam | `claude/exams/foundations.md`, affected questions                                     |

## 8. Writing style

Write the way you'd talk to someone over coffee: first person, short sentences, plain words. Skip slogans, buzzwords
("leverage", "synergy", "cutting-edge"), and long dashes. Say what you did and what changed because of it.

## 9. Design

The reasoning behind the layout, colours, and motion is in [`DESIGN-PLAN.md`](DESIGN-PLAN.md).
