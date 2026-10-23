# Design plan

How design decisions on sarveshtalele.org are made, and the implementation plan for the October 2026 polish pass.

## 1. Frameworks used

**Design Thinking (Stanford d.school): Empathize → Define → Ideate → Prototype → Test.** Every change starts with who
reads the page and what they need, and ends with a browser test on real viewport sizes.

**Apple Human Interface Guidelines: Clarity, Deference, Depth.**
- *Clarity*: one idea per section, large readable type, generous spacing, obvious buttons.
- *Deference*: motion and decoration support the content and never cover it (decorative layers are
  `pointer-events: none`).
- *Depth*: layered cards, soft shadows, and scroll-linked stacking give a sense of space without clutter.

**Dieter Rams, "less but better".** Remove anything that repeats (duplicate skill lists, two badge strips) or that
doesn't help a visitor decide something.

**Gestalt.** Proximity and common region group related things (skills by category, credentials as cards); similarity
keeps every card the same shape so the eye scans quickly.

**Hick's and Fitts's laws.** Fewer, larger choices: two hero buttons, big filter inputs and toggles on the review
page, touch targets at least 44px.

## 2. Who visits, and what they need (Empathize / Define)

| Visitor | Wants in 30 seconds | Page answer |
| --- | --- | --- |
| Recruiter / hiring manager | Is he real, senior, and verifiable? | Hero, credential cards with verify links, Dashboard |
| Engineer / peer | What has he built, can I use it? | Pinned projects, Projects page, blog |
| Exam candidate | Free, good CCAR-F practice | Claude Prep, mock exam, review library with clear filters |
| Someone who wants to talk | How do I reach him? | Topmate + LinkedIn, social icons that actually work |

**Problem statements**
1. Credentials read as a flat list of chips; they need to look like proof (badge + issuer + link).
2. The skills marquee repeats items and cuts words at the edges; it shows breadth but not structure.
3. "How I work" numbers sit at the bottom of each card and get hidden under the next stacked card.
4. Hero social icons can't be clicked because a decorative layer sits on top.
5. The review page's search, test mode, and count are small and easy to miss on a 360-question page.
6. Some copy sounds machine-written ("with receipts", slogans); it should sound like a person talking.

## 3. Ideas chosen (Ideate)

| Problem | Solution |
| --- | --- |
| 1 | Credential cards: badge or icon, title, issuer line, "Verify" link; 2/3/6-column responsive grid |
| 2 | Toolbox bento: one card per skill group with icon, count, and skill pills that pop in when scrolled to |
| 3 | Step number moves to the top-right of each card, solid gradient so it reads on every device |
| 4 | Decorative SVG lines and colour blobs get `pointer-events: none`; links get a higher stacking order |
| 5 | Sticky control bar: full-width search, a real switch for test mode, live count pill, domain jump chips |
| 6 | Rewrite page copy in first person, plain words, short sentences, no slogans or em-dash flourishes |

Theme stays: cream/espresso/gold light, espresso/ivory/champagne dark, system font, rounded cards.

## 4. Implementation plan (Prototype)

1. Hero: make decoration non-interactive; verify every social link is clickable at 375 / 820 / 1440px.
2. Credentials: add optional `badge` and `note` to `credentials:` in the profile; build `CredentialCards.astro`.
3. Skills: build `SkillsBento.astro`, replace the marquee on the landing page.
4. How I work: move the number, keep stacking motion.
5. Dashboard: remove the shields.io badge strip.
6. Review page: new header with stats, sticky control bar, switch, count pill, domain chips; TOC offset fixed.
7. Copy: profile, dashboard, landing sections, page descriptions.
8. Docs: `UPDATING.md`, `CLAUDE.md`, `progress.md`.

## 5. Test (and keep testing)

Automated Playwright audit on every page at 375×812, 820×1180, 1440×900 in light and dark:
- no JS or console errors, no horizontal overflow, no broken internal links or images
- every visible link's centre point actually hits the link (catches overlays)
- text not overflowing its box

Plus manual screenshot review of the hero, credentials, skills, How I work, dashboard, and review page.
