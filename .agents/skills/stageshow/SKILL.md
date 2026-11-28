---
name: stageshow
description: Story-led product visuals and UI motion, adapted for the visual identity and static Astro architecture of sarveshtalele.org.
---

# Stageshow — site adaptation

This local playbook adapts the **Stageshow** design and motion skill by Benji Taylor:

- Upstream skill and examples: https://github.com/benjitaylor/skills/tree/main/stageshow
- Upstream repository: https://github.com/benjitaylor/skills
- To install the complete upstream skill in a separate agent workspace: `npx skills add benjitaylor/skills --skill stageshow`

This is a site-specific guide, not a copy of the upstream React kit.

## The core principle

**Make the subject recognisable, show one meaningful change, and let the result explain itself.** Every moving element needs a cause. A quieter, fuller, better-framed composition beats a busier one.

## Plan before drawing

Write a short plan first:

- **Placement:** blog hero, inline explainer, feature card, bento tile or social export.
- **Focal object:** the one interface, diagram or relationship the viewer should notice first.
- **Action:** what changes, and what caused it?
- **Payoff:** what should be visible at the end?
- **Omit:** which details do not help the story?

Use the actual site theme. Do not invent a new visual language for one illustration.

## Site visual language

Use the tokens and values already established in `src/styles/global.css`:

| Role | Palette |
|---|---|
| Background | parchment cream in light mode; espresso in dark mode |
| Main ink | espresso / ivory |
| Surface | warm cream / walnut |
| Primary accent | cocoa brown |
| Secondary accent | antique gold / champagne |
| Muted text | warm taupe |

Reference values include `#f6f0e4`, `#fbf7ef`, `#2a1d14`, `#6b4226`, `#a67c3d`, `#14100c`, `#f2e8d8` and `#d9b77e`.

Use the existing system font stack. Monospace is for code, identifiers and aligned numbers only. Avoid remote fonts, neon gradients, generic AI sparkles, invented logos and decorative UI that does not support the story.

## Composition

- One hero object and at most one or two supporting objects.
- Preserve the context that makes the focal object recognisable; do not shrink a complete interface into a tiny card surrounded by empty margins.
- Crop only secondary or filler content. Keep meaningful words, controls and the payoff inside the visible frame.
- Establish hierarchy with scale, contrast, spacing and depth—not a border around every object.
- Use real, concise labels for the subject and action. Placeholder bars are for secondary content only.
- Design at the size where the artwork will be seen. For a blog hero, begin around 1200 × 675; verify legibility around 900px wide and on a 375–390px viewport.

## Motion story

For a short hero animation, prefer **3–5 beats over roughly 10–16 seconds**:

1. Open on a complete, understandable still.
2. Show one action that starts the change.
3. Let the response arrive because of that action.
4. Make the consequence or tension visible.
5. Hold a clear payoff long enough to read.

Motion rules:

- Use a travel curve such as `cubic-bezier(0.45, 0, 0.1, 1)` and a soft arrival such as `cubic-bezier(0.25, 0.8, 0.25, 1)`. Choose timing by the relationship being animated, not by applying one duration everywhere.
- Related changes overlap. Stagger grouped content in reading order, typically 40–80ms apart.
- Nothing important should pop in, vanish abruptly or move without a cause.
- Keep the same object mounted through state changes. Change only what changed; preserve alignment and container geometry.
- A result should follow its cause. Hold the payoff for about two seconds.
- If the animation loops, return to the opening state under a visible transition or opaque reset. Never visibly rewind data or reverse a navigation path.
- Cut motion that does not improve comprehension.

## Accessibility and progressive enhancement

- Every animation needs a meaningful static poster or settled state.
- Respect `prefers-reduced-motion: reduce`: stop motion and deliberately show the completed, question-led or otherwise useful static frame—not a random halfway frame.
- Keep a text alternative in the surrounding article or figure caption; write descriptive alt text for meaningful graphics.
- Decorative SVG layers must not intercept pointer events.
- Keep the core explanation available if an image fails to load.

## Implementation for this Astro site

Prefer assets that render as normal images: SVG with CSS animation, or GIF when explicitly requested. Keep the static cover in the post's `images/` directory and reference it in frontmatter.

- Do not add a client-side framework, third-party script, remote font or runtime network dependency just to animate one illustration.
- Keep scene styles scoped to the artwork; avoid global selectors that affect the site.
- Use `src/content/blog/<slug>/images/` for post-specific artwork.
- Keep `coverAlt` and in-article alt text specific and non-promotional.
- If exporting a GIF as an additional deliverable, keep it small enough to load comfortably and provide a poster frame separately.
- If a visual is illustrative, do not imply the depicted UI is a recording of a real user workflow.

## Review / rehearsal checklist

Before handoff, inspect the rendered asset—not just its source:

- Opening frame tells the story without motion.
- Focal object and action are obvious at the final rendered size.
- Three to five beats are causally connected.
- Text is legible, correctly aligned and not clipped in every frame.
- Motion has a clear departure, travel and soft arrival.
- The payoff is complete and holds long enough to read.
- The loop seam has no dead air, flicker or visible data rewind.
- Reduced-motion mode shows a useful static state.
- Check a narrow viewport and both site themes.
- Read the full article beside the visual; remove anything that repeats or distracts from its argument.

Fix the largest visible fault first: framing, then hierarchy, then motion, then polish. A clean screenshot does not prove that the animation works; inspect the transitions and loop seam too.
