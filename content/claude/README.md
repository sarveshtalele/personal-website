# Claude exam content

Two kinds of files live here:

| Path | Drives | Format |
| --- | --- | --- |
| `questions/domain-1.md` … `domain-5.md` | `/claude/quiz` (mock exam) and `/claude/review` (all questions) | Custom Markdown, compiled by `scripts/build-claude-data.mjs` |
| `exams/foundations.md`, `exams/professional.md` | `/claude/<file-name>` guide pages and the cards on `/claude` | Frontmatter (validated by `src/content.config.ts`) + Markdown body |

After editing, run `pnpm check:content`. It also runs automatically on `pnpm dev` and `pnpm build`, and a malformed
question fails the build with the file and question ID, so a broken exam can never ship.

## Question bank format

Each domain file has frontmatter, a `# Task statements` section, and a `# Questions` section.

```md
---
domain: 1
name: Agentic Architecture & Orchestration
weight: 27%
---

# Task statements

### 1.1 Design and implement agentic loops for autonomous task execution

One-paragraph summary shown in the Learn & Review library.

Docs: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

# Questions

## D1-Q01

- task: 1.1
- scenario: 1
- mock: true
- docs: [Tool use & the agentic loop](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

The question text (stem). Can wrap over several lines.

- [x] A. The correct option is marked with [x]
- [ ] B. A distractor
- [ ] C. A distractor
- [ ] D. A distractor

**Explanation:** Why A is right.

**Why not B:** Why B is wrong.

**Why not C:** Why C is wrong.

**Why not D:** Why D is wrong.
```

### Field reference

| Line | Required | Meaning |
| --- | --- | --- |
| `## D1-Q01` | yes | Unique ID. Prefix must match the file's domain. |
| `- task: 1.1` | yes | Task statement(s). Cross-domain labels like `2.3/4.3` or `1.4 (+5.2)` are fine. |
| `- group: 1.1` | no | Which task section the question is listed under in Learn & Review (defaults to `task`). |
| `- scenario: 1` | yes | 1–6, see the scenario list in `exams/foundations.md`. |
| `- mock: true` | no | Include in the timed mock exam. Keep the mock at 60 questions to mirror the real exam. |
| `- official: true` | no | Shows an "Exam-style ★" chip. |
| `- docs: [label](https://…)` | yes | The doc page to study. Must be `https://`. |
| `- [x] A.` … `- [ ] D.` | yes | Exactly four options, exactly one `[x]`. |
| `**Explanation:**` | yes | Shown after answering. |
| `**Why not X:**` | yes | One for every wrong option. |

Options are shuffled for each attempt, and the explanation letters are remapped automatically.

## Adding a new exam guide

Copy `exams/foundations.md` to `exams/<slug>.md`, edit the frontmatter, and set `status: live`. It appears at
`/claude/<slug>` and as a card on `/claude`. With `status: coming-soon` it shows as a card only.
