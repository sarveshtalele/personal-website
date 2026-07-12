---
title: "How to prepare for the Claude Certified Architect — Foundations (CCA-F) exam"
description: I passed the CCA-F exam coming from a non-AI background. Here's the study path, resources, and mindset that actually got me there — plus the open-source guide I built from it.
pubDate: 2026-07-12
category: Claude
tags: [Claude, Certification, CCAF]
featured: true
---

I passed the [Claude Certified Architect — Foundations](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification/486716) exam without a formal AI or computer science
background. This post is the study path that got me there, and the reasoning behind it — the same reasoning
behind the [open-source exam guide repo](https://github.com/sarveshtalele/claude-architect-exam-guide) I built
once I was through.

## Most roadmaps assume you're already technical

After I shared my results on LinkedIn, the engagement pattern was telling: a large share of people entering the
Claude ecosystem come from non-technical backgrounds, yet almost every study roadmap out there throws you
straight into engineering-first material — architecture diagrams and tool-calling semantics before you've even
built an intuition for what an LLM can and can't do reliably.

That gap is worth naming explicitly, because it changes how you should prepare. If you come in expecting a
computer-science-style curriculum, you'll either bounce off it or memorize your way through — and rote
memorization is exactly what doesn't transfer to the exam, or to real architecture decisions afterward.

## What CCA-F actually tests

The Foundations exam isn't a trivia test on Claude's feature list. It's checking whether you can reason about
**systems-level architecture** — how to design agentic workflows with Claude that are robust, scalable, and
safe to deploy, not just clever demos. That distinction should shape your entire prep strategy: don't optimize
for recalling facts, optimize for being able to explain *why* an architecture decision is correct.

## The study path that worked

1. **Start with the official material.** [Claude 101](https://anthropic.skilljar.com/claude-101) and
   [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) on Anthropic's own SkillJar
   platform are the right foundation — they're free, current, and written by the people who built the thing
   you're being tested on.
2. **Read the official exam blueprint before you study, not after.** Anthropic publishes an
   [exam guide PDF](https://github.com/sarveshtalele/claude-architect-exam-guide/blob/main/study-materials/updated_Claude_certification_guide.pdf)
   with the domain breakdown. Use it as a checklist, not a reading assignment — it tells you where to spend
   time.
3. **Use Claude to study Claude.** I built a [SKILL.md framework](https://github.com/sarveshtalele/claude-architect-exam-guide/tree/main/prepare-with-prompts)
   specifically for exam prep, plus a set of prompt templates to interactively explore each exam domain instead
   of passively reading about it. If you're preparing for an exam about an AI system, actually use the AI
   system to prepare — it's the fastest way to build the intuition the exam is testing for.
4. **Practice explaining architecture decisions out loud.** The exam rewards systems-level reasoning. The best
   way to build that is to take a workflow you'd design with Claude and explain, in words, why each piece is
   there — not just that it works.

## What doesn't work

Question dumps and cheat sheets. I deliberately didn't build either into my guide, and I'd avoid anyone else's
version of them too. Real architectural competence — the kind that shows up when you're actually building
production systems with Claude afterward — is earned through practice and experimentation, not gamed through a
leaked question bank.

## If you're starting from zero

You don't need an engineering background to pass this. You need a structured path and a willingness to build
real intuition instead of memorizing. That's exactly what I tried to make the
[CCA-F study guide](https://github.com/sarveshtalele/claude-architect-exam-guide) — a living, community-built
resource, not a static PDF. If you're on this path, or you've already passed and want to contribute what
worked for you, the repo is open for issues and PRs.

Once you've got Foundations, the next step up is Professional — see my [CCAP prep guide](/claude) for where
that one stands.
