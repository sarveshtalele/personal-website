# Updating sarveshtalele.org

This guide tells you **which file to edit, when to edit it, and what changes on the website** as a result. Every
page is generated from Markdown in `src/content/`, so you never need to touch code to keep the site current.

> **The loop for every change:** edit the Markdown file → commit → push to `main` → GitHub Actions rebuilds and
> deploys in about 2 minutes. You can also edit directly on github.com (pencil icon on any file → "Commit changes").

---

## 1. "Something happened, what do I update?"

| When this happens… | Edit this file | What updates on the site |
| --- | --- | --- |
| You publish a new article | New folder `src/content/blog/<slug>/index.mdx` (run `pnpm new:blog "Title"`) | Blog card, landing "From the journal", tag pages, RSS, sitemap, search |
| You cross-post from Medium | Same as above, set `canonical:` to the Medium URL | Adds an "Originally published on medium.com" note |
| You fix a typo in an old post | That post's `index.mdx` (add `updatedDate:` only for real revisions) | The post; "Updated" date if set |
| You start a new job or get promoted | `src/content/experience/<company-role>.md` (set old job's `current: false` + `endDate:`) | Experience page, landing "Journey", dashboard "Currently" card |
| A new impact number you can prove | `src/content/dashboard/metrics.md` → `impact:` | Dashboard + landing impact tiles |
| You earn a certification | `src/content/certifications/<name>.md` (+ badge image in `public/images/badges/`) | Certifications page, About, dashboard; Claude page if the title contains "Claude Certified Architect" |
| A paper is published | `src/content/publications/<name>.md` | Publications page, dashboard "Research" |
| You create a repo you want to show off | `src/content/project-settings/projects.md` → `pinned:` | Projects page (top, with "Pinned" badge) + landing "Pinned projects" |
| A repo is junk / a mirror | `projects.md` → `hidden:` | Removed from Projects page and stats lists |
| A repo has no or weak GitHub description | `projects.md` → `overrides:` | That repo's card |
| You add a GitHub topic to a repo | Nothing here (topic must be listed under `categories:` to become a filter) | Category filter on the Projects page after the next deploy |
| Stars/forks change | Nothing. The site rebuilds daily at 03:17 UTC | Every GitHub number |
| Your title, headline, bio or socials change | `src/content/profile/sarvesh.md` | Navbar, hero, footer, About, SEO metadata, JSON-LD, Contact |
| The small label above the headline | `profile/sarvesh.md` → `heroLabel:` | Landing hero (currently "AI Engineer") |
| Skill badges floating around your photo | `profile/sarvesh.md` → `heroChips:` (up to 3) | Landing hero |
| You learn a new tool | `profile/sarvesh.md` → `skills:` | Toolbox cards on Home, About, and Dashboard |
| The "How I work" steps | `profile/sarvesh.md` → `approach:` | Scroll story under the hero |
| The quote on the landing page | `profile/sarvesh.md` → `quotes:` (first entry is used) | Hero (under the headline) |
| A new achievement or award | `profile/sarvesh.md` → `achievements:` (and update the `8×` tile in `metrics.md` if it is a TCS award) | About "Achievements", dashboard |
| You want a new Claude practice question | `src/content/claude/questions/domain-<n>.md` | Learn & Review library, counts on Claude/landing/dashboard |
| A question has a wrong answer | Same file, move the `[x]` and fix the explanations | Mock exam + library |
| You want to change which questions are in the mock | Add/remove `- mock: true` (keep 60 to mirror the real exam) | `/claude/quiz` |
| Anthropic changes the exam (fee, time, domains) | `src/content/claude/exams/foundations.md` | `/claude/foundations` |
| You are ready to publish the Professional guide | `src/content/claude/exams/professional.md` → fill fields, set `status: live` | New page `/claude/professional` + live card on `/claude` |
| New profile photo | Replace `public/images/sarvesh-talele.jpg` (same name, square works best) | Navbar, hero, About, blog author line |
| New nav item, analytics, comments | `src/lib/site.ts` (the only non-Markdown settings file) | Navbar/footer, GA, Giscus |

---

## 2. File-by-file reference

### `src/content/profile/sarvesh.md`, who you are
**Update when:** your role, employer, headline, socials, skills, education, or story changes. Review every 3 months.

| Field | Shown on | Notes |
| --- | --- | --- |
| `name`, `fullName` | Navbar, footer, SEO title, JSON-LD | `fullName` is used for schema.org and copyright |
| `role` | About, footer, `<title>` | Keep it short: `AI Engineer · Claude Certified Architect` |
| `heroLabel` | Small label above the landing headline | e.g. `AI Engineer` |
| `headline` | Hero headline | Sentences split on `. `; the **third** sentence is rendered in gold italic |
| `tagline` | Hero paragraph, About intro | One sentence, concrete |
| `summary` | Default meta description, RSS description | 150–160 characters is ideal for search |
| `quotes` | Landing hero (first one) | `source` optional |
| `socials` | Navbar, footer, Contact, badges, JSON-LD `sameAs` | Must be `https://` links. No email is shown anywhere on the site by design |
| `credentials` | Credential cards on the landing page | `label`, `href` (proof), optional `note` (issuer · year) and `badge` (image path in `public/`) |
| `achievements` | About | `href` optional |
| `education`, `skills` | About, Dashboard | Skills are grouped; groups become filter pills |
| Body (Markdown below `---`) | About page story | Plain Markdown, links allowed |

### `src/content/dashboard/metrics.md`, the numbers recruiters see
**Update when:** you have a new, defensible number. Review every quarter.

- `impact:` → `value` (e.g. `50K+`, `4+ yrs`, `Top 15`; the first number animates), `label`, `context` (one line),
  `proof` (link to where it can be verified), `proofLabel`.
- `highlights:` → three cards under the GitHub panel (`icon`: `shield`, `flask`, `book`, `trophy`).
- **Rule:** never add a number you cannot link to. GitHub numbers are computed automatically; don't type them here.
- If a metric lives on LinkedIn only, link `proof:` to your LinkedIn profile or a post.

### `src/content/project-settings/projects.md`, the Projects page
**Update when:** you ship a repo worth featuring, or want to retire one from the top.

- `pinned:` exact repo names, in display order. The first six also appear on the landing page.
- `hidden:` repos never shown.
- `categories:` GitHub topic → filter label. Add the topic on GitHub, then it shows up here automatically.
- `overrides:` `description`, `demo` (https), `categories` per repo.
- `pnpm check:content` fails if a pinned or hidden name doesn't exist (catches typos).

### `src/content/blog/<slug>/index.mdx`, articles
**Update when:** you publish. One folder per post, images live beside it in `images/`.

```bash
pnpm new:blog "Post title" --category Engineering --tags "MCP, Agents"
```

| Field | Required | Shown on |
| --- | --- | --- |
| `title` (≤120) | yes | Card, post header, `<title>`, RSS |
| `description` (≤260) | yes | Card text, meta description, social preview |
| `pubDate` | yes | Card, post, sort order |
| `updatedDate` | no | "Updated" on post, `dateModified` in JSON-LD |
| `tags` | no | Card chips, tag filter, `/blog/tags/<tag>` pages |
| `category` | no | `Engineering`, `Philosophy`, `Claude`, or `Career` |
| `cover` + `coverAlt` | recommended | Card image, post hero, social share image |
| `canonical` | no | "Originally published on…" note |
| `featured` | no | Reserved for highlighting |
| `draft` | no | `true` = only visible in `pnpm dev` |

Images: put files in the post's `images/` folder and reference them as `./images/name.png`. `pnpm check:content`
fails if an image is missing. MDX also gives you `<Callout type="tip|info|warning|success" title="…">`.

### `src/content/experience/*.md`, jobs
**Update when:** you change role, company, or have new highlights (each bullet should contain a measurable result).
Only one entry should have `current: true`.

### `src/content/certifications/*.md`, credentials
**Update when:** you earn one. Add `credentialUrl` (the issuer's verify link, e.g. Credly) and `badge` (an image in
`public/images/badges/`). `featured: true` lists it on the landing page Claude block.

### `src/content/publications/*.md`, papers
**Update when:** a paper is accepted or gets a DOI/indexing. `badges:` adds verify buttons (arXiv, NASA ADS, code).

### `src/content/claude/questions/domain-*.md`, the question bank
**Update when:** you add questions, fix an answer, or the exam guide changes. The exact format is in
[`src/content/claude/README.md`](../src/content/claude/README.md). Every count on the site updates by itself.

### `src/content/claude/exams/*.md`, exam guide pages
**Update when:** Anthropic changes the exam facts, or a new track is ready (`status: live`).

### `src/lib/site.ts`, the only code-level settings
**Update rarely:** navigation links, footer links, Google Analytics ID (empty = off), Giscus comment IDs.

---

## 3. Theme (do not change by accident)

The site follows an **Apple-style** design: lots of whitespace, the system font, soft cards, and the cream-and-brown
palette, with tasteful motion throughout:

- **Hero** (`IntroHero.astro`): the site's original layout, no box. Left: role, big headline, tagline, the quote
  (words rise in), and buttons (evidence, projects, blog). Right: your photo with self-drawing lines, drifting colour,
  floating badges (Claude certifications and GitHub stars are automatic; the rest come from `heroChips:` in
  `profile/sarvesh.md`, up to 3), and social icons below. The quote is the big heading; your headline line sits
  under it; buttons are Read the blog and Explore projects. The photo tilts
  and the chips drift with the pointer.
- **Credential cards** (`CredentialCards.astro`): one card per item in `credentials:` with its badge (or a matching
  icon), a short note, and a Verify / See details link.
- **Toolbox** (`SkillsBento.astro`): one card per group in `skills:`; the pills pop in when the card scrolls into view.
- **Cards** everywhere get a soft spotlight that follows the pointer and a slight 3D tilt.
- **Section titles** wipe in as you scroll; numbers count up.
- **How I work** (`ScrollStory.astro`): stacking cards. Each step is a card that sticks as you scroll while the next
  one slides over it and the card underneath shrinks and dims. Works on phones. Edit the steps under `approach:` in
  `profile/sarvesh.md`.
- **⌘K / Ctrl+K quick menu** (`CommandMenu.astro`): jump to any page, blog post, or pinned project. It lists
  everything automatically.
- **Theme toggle** reveals the new theme in a circle from the button; **back-to-top** button shows scroll progress;
  primary buttons gently follow the pointer. All motion switches off for visitors who prefer reduced motion.

| Element | Light | Dark (default) |
| --- | --- | --- |
| Background | parchment cream `#f6f0e4` | espresso `#14100c` |
| Text | espresso `#2a1d14` | ivory `#f2e8d8` |
| Primary | cocoa brown `#6b4226` | champagne gold `#d9b77e` |
| Accent | antique gold `#a67c3d` | warm gold `#c99a5b` |
| Font | System font (SF Pro on Apple, Segoe UI on Windows, Roboto on Android) | same |

All colours are tokens in `src/styles/global.css`. To retune the palette, change the token values there, never
individual pages. Motion (fade-ins, count-ups) switches off automatically for visitors who
prefer reduced motion.

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
pnpm check:content   # questions, blog images, pinned repo names (seconds)
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

| How often | What |
| --- | --- |
| Every post | New blog folder; pin the related repo if it's new |
| Monthly | Review `pinned:` order; add GitHub topics to new repos |
| Quarterly | Dashboard metrics, experience highlights, skills |
| On each credential | Certification file + badge image; `credentials:` in profile |
| When Anthropic updates the exam | `claude/exams/foundations.md`, affected questions |

## 8. Writing style

Write the way you'd talk to someone over coffee: first person, short sentences, plain words. Skip slogans, buzzwords
("leverage", "synergy", "cutting-edge"), and long dashes. Say what you did and what changed because of it.

## 9. Design

The reasoning behind the layout, colours, and motion is in [`DESIGN-PLAN.md`](DESIGN-PLAN.md).
