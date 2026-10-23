---
domain: 3
name: Claude Code Configuration & Workflows
weight: 20%
---

<!--
  Domain 3 question bank. Edit freely, then run `pnpm claude:build` (also runs on dev/build).
  Format guide: see src/content/claude/README.md
-->

# Task statements

### 3.1 Configure CLAUDE.md with hierarchy, scoping, and modular organization

Hierarchy: user-level (`~/.claude/CLAUDE.md`), project-level (`.claude/CLAUDE.md` or root `CLAUDE.md`), directory-level; user-level not shared via version control; `@import` for modularity; `.claude/rules/` for topic-specific rules; `/memory` to inspect loaded files.

Docs: https://code.claude.com/docs/en/memory

### 3.2 Create and configure custom slash commands and skills

Project commands (`.claude/commands/`, shared) vs user (`~/.claude/commands/`, personal); skills in `.claude/skills/` with `SKILL.md` frontmatter (`context: fork`, `allowed-tools`, `argument-hint`); `context: fork` isolates verbose skill output; personal skill variants; skills (on-demand) vs CLAUDE.md (always-loaded).

Docs: https://code.claude.com/docs/en/skills

### 3.3 Apply path-specific rules for conditional convention loading

`.claude/rules/` files with YAML `paths` glob patterns; rules load only when editing matching files (reduces token usage); glob rules beat directory-level CLAUDE.md for conventions spanning many directories (e.g., `**/*.test.tsx`).

Docs: https://code.claude.com/docs/en/memory

### 3.4 Determine when to use plan mode vs direct execution

Plan mode for complex/large-scale/multi-approach/architectural/multi-file changes; direct execution for simple, well-scoped changes; plan mode enables safe exploration before committing; the Explore subagent isolates verbose discovery; combine plan (investigate) + direct (implement).

Docs: https://code.claude.com/docs/en/common-workflows

### 3.5 Apply iterative refinement techniques for progressive improvement

Concrete input/output examples beat prose; test-driven iteration (write tests, share failures); the interview pattern (Claude asks questions first); single message for interacting problems vs sequential for independent ones.

Docs: https://code.claude.com/docs/en/common-workflows

### 3.6 Integrate Claude Code into CI/CD pipelines

`-p`/`--print` for non-interactive mode; `--output-format json` and `--json-schema` for structured CI output; CLAUDE.md provides project context to CI-invoked Claude; session-context isolation (an independent review instance beats self-review); pass prior findings to avoid duplicate comments.

Docs: https://code.claude.com/docs/en/cli-reference

# Questions

## D3-Q01

- task: 3.1
- scenario: 2
- mock: true
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

A new team member isn't receiving the team's coding standards from Claude Code, while everyone else is. You find the standards were placed in `~/.claude/CLAUDE.md`. What is the diagnosis and fix?

- [ ] A. The teammate needs a larger context window.
- [x] B. The standards are in user-level config (not shared via version control); move them to project-level `.claude/CLAUDE.md` (or root `CLAUDE.md`) so all teammates receive them.
- [ ] C. The standards belong in `.mcp.json`.
- [ ] D. The teammate should run `/compact`.

**Explanation:** User-level `~/.claude/CLAUDE.md` applies only to that user and isn't shared via version control. Team-wide standards belong at the project level so they reach everyone.

**Why not A:** Context size is unrelated to which config is loaded.

**Why not C:** `.mcp.json` configures servers, not instructions.

**Why not D:** `/compact` reduces context, not a config-scoping fix.

## D3-Q02

- task: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

Which correctly lists the CLAUDE.md configuration hierarchy?

- [ ] A. Only user-level and MCP-level.
- [ ] B. Only a single root `CLAUDE.md` exists.
- [x] C. User-level (`~/.claude/CLAUDE.md`), project-level (`.claude/CLAUDE.md` or root `CLAUDE.md`), and directory-level (subdirectory `CLAUDE.md`).
- [ ] D. Global, regional, and local DNS levels.

**Explanation:** The hierarchy is user → project → directory-level CLAUDE.md files.

**Why not A:** There is no "MCP-level" CLAUDE.md.

**Why not B:** Multiple levels exist, not one.

**Why not D:** Nonsense mapping.

## D3-Q03

- task: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

Your root `CLAUDE.md` has grown huge and unwieldy. Which approach keeps it modular?

- [ ] A. Move all of it into `.mcp.json`.
- [ ] B. Delete everything except one line.
- [ ] C. Duplicate the file into every subdirectory.
- [x] D. Use `@import` to reference external files (e.g., package-specific standards) and/or split rules into `.claude/rules/`.

**Explanation:** `@import` references external files for modularity, and `.claude/rules/` organizes topic-specific rules as an alternative to a monolithic CLAUDE.md.

**Why not A:** `.mcp.json` isn't for instructions.

**Why not B:** Deleting content loses needed guidance.

**Why not C:** Duplication creates maintenance drift.

## D3-Q04

- task: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

What does the `@import` syntax accomplish in CLAUDE.md?

- [ ] A. It imports Python modules at runtime.
- [x] B. It references external files so CLAUDE.md stays modular (e.g., importing specific standards relevant to each package).
- [ ] C. It uploads the file to the cloud.
- [ ] D. It forces plan mode.

**Explanation:** `@import` pulls in external files, keeping CLAUDE.md modular and letting maintainers include only relevant standards.

**Why not A:** It's not a code import.

**Why not C:** It doesn't upload anything.

**Why not D:** It's unrelated to plan mode.

## D3-Q05

- task: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

You want to verify which memory/config files Claude Code currently has loaded because behavior seems inconsistent across sessions. Which command helps?

- [ ] A. `/compact`.
- [x] B. `/memory` to inspect which memory files are loaded.
- [ ] C. `--json-schema`.
- [ ] D. `fork_session`.

**Explanation:** `/memory` shows which memory/config files are loaded, helping diagnose inconsistent behavior.

**Why not A:** `/compact` reduces context; it doesn't list loaded files.

**Why not C:** A CI output flag, unrelated.

**Why not D:** Session forking, unrelated.

## D3-Q06

- task: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

Why is user-level `~/.claude/CLAUDE.md` unsuitable for team-wide conventions?

- [ ] A. It is too small to hold conventions.
- [x] B. It applies only to that individual user and isn't shared via version control.
- [ ] C. It is read-only.
- [ ] D. It overrides all project settings permanently.

**Explanation:** User-level config is personal and not version-controlled, so teammates don't receive it.

**Why not A:** Size isn't the issue.

**Why not C:** It's editable.

**Why not D:** It doesn't permanently override project config for the whole team.

## D3-Q07

- task: 3.1
- scenario: 2
- mock: true
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

A maintainer wants each package's CLAUDE.md to include only the standards relevant to that package. Which mechanism is intended?

- [ ] A. `.mcp.json` per package.
- [ ] B. One giant root CLAUDE.md for all packages.
- [x] C. `@import` to selectively include relevant standards files per package.
- [ ] D. A shell alias.

**Explanation:** `@import` lets each package's CLAUDE.md pull in just the relevant standards, based on maintainer domain knowledge.

**Why not A:** Not an instructions mechanism.

**Why not B:** A monolith includes irrelevant standards everywhere.

**Why not D:** Aliases don't scope CLAUDE.md content.

## D3-Q08

- task: 3.1/3.3
- group: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

As an alternative to a monolithic CLAUDE.md, where do you put focused topic-specific rule files?

- [ ] A. The commit message.
- [ ] B. `~/.bashrc`.
- [ ] C. `.mcp.json`.
- [x] D. `.claude/rules/` (e.g., `testing.md`, `api-conventions.md`, `deployment.md`).

**Explanation:** `.claude/rules/` organizes topic-specific rule files as an alternative to one large CLAUDE.md.

**Why not A:** None is the rules-organization mechanism.

**Why not B:** None is the rules-organization mechanism.

**Why not C:** None is the rules-organization mechanism.

## D3-Q09

- task: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

Behavior differs between two developers on the same repo. One has extra instructions the other lacks. Most likely cause?

- [ ] A. The repo is corrupted.
- [x] B. One developer has personal instructions in user-level `~/.claude/CLAUDE.md` that aren't in the shared project config.
- [ ] C. They use different keyboards.
- [ ] D. The model version differs by a patch.

**Explanation:** User-level config is per-user; instructions there won't be shared, explaining divergent behavior.

**Why not A:** None explains the specific instruction divergence.

**Why not C:** None explains the specific instruction divergence.

**Why not D:** None explains the specific instruction divergence.

## D3-Q10

- task: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

Which is the correct location for *project* instructions meant to be version-controlled and shared?

- [ ] A. `~/.claude.json`.
- [ ] B. `~/.claude/CLAUDE.md`.
- [x] C. `.claude/CLAUDE.md` or a root `CLAUDE.md` in the repo.
- [ ] D. `/etc/claude/CLAUDE.md`.

**Explanation:** Project-level CLAUDE.md (`.claude/CLAUDE.md` or root `CLAUDE.md`) is the shared, version-controlled location.

**Why not A:** MCP user config, not instructions.

**Why not B:** User-level, not shared.

**Why not D:** Not a Claude Code config path.

## D3-Q11

- task: 3.1/3.3
- group: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

What is the best reason to split a large CLAUDE.md into `.claude/rules/` files plus `@import`s?

- [ ] A. To make the repo larger.
- [x] B. To keep configuration modular and focused, improving maintainability and letting each area include only relevant guidance.
- [ ] C. To disable CLAUDE.md entirely.
- [ ] D. To force all rules to load on every file regardless of relevance.

**Explanation:** Modular organization improves maintainability and relevance targeting.

**Why not A:** Size isn't the goal.

**Why not C:** It organizes, not disables, configuration.

**Why not D:** Path-scoped rules load *conditionally*, the opposite of "always."

## D3-Q12

- task: 3.1
- scenario: 2
- docs: [Memory, CLAUDE.md hierarchy & @import](https://code.claude.com/docs/en/memory)

When diagnosing "why did Claude apply this rule here?", which is the most direct investigative step?

- [ ] A. Increase `max_tokens`.
- [ ] B. Delete the repo.
- [ ] C. Switch models.
- [x] D. Run `/memory` to see which CLAUDE.md/rules files are loaded in the current session.

**Explanation:** `/memory` reveals loaded memory/config files, directly answering which instructions are active.

**Why not A:** None inspects loaded configuration.

**Why not B:** None inspects loaded configuration.

**Why not C:** None inspects loaded configuration.

## D3-Q13

- task: 3.2
- scenario: 2
- mock: true
- official: true
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

You want a `/review` slash command that runs your team's standard code-review checklist and is available to every developer when they clone the repo. Where should the command file live?

- [ ] A. `~/.claude/commands/` in each developer's home directory.
- [x] B. `.claude/commands/` in the project repository.
- [ ] C. In the root `CLAUDE.md`.
- [ ] D. In a `.claude/config.json` with a `commands` array.

**Explanation:** Project-scoped commands live in `.claude/commands/`, are version-controlled, and reach all developers on clone/pull. (Mirrors official Sample Question 4.)

**Why not A:** `~/.claude/commands/` is personal and not shared.

**Why not C:** CLAUDE.md is for instructions/context, not command definitions.

**Why not D:** No such `.claude/config.json` commands-array mechanism exists.

## D3-Q14

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

A skill produces very verbose codebase-analysis output that pollutes the main conversation. Which frontmatter option isolates it?

- [ ] A. `argument-hint: verbose`.
- [ ] B. `allowed-tools: none`.
- [x] C. `context: fork` to run the skill in an isolated sub-agent context.
- [ ] D. `model: haiku`.

**Explanation:** `context: fork` runs the skill in an isolated sub-agent context, preventing verbose output from polluting the main conversation.

**Why not A:** `argument-hint` prompts for parameters, not isolation.

**Why not B:** Restricting tools doesn't isolate the output context.

**Why not D:** Model choice doesn't isolate context.

## D3-Q15

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

What is the purpose of the `allowed-tools` frontmatter field in a skill's `SKILL.md`?

- [ ] A. To choose the terminal color.
- [ ] B. To list the developers allowed to run the skill.
- [ ] C. To set the billing tier.
- [x] D. To restrict which tools the skill may use during execution (e.g., limiting to file writes to prevent destructive actions).

**Explanation:** `allowed-tools` restricts tool access during skill execution, e.g., limiting to safe operations.

**Why not A:** None reflects the field's defined role.

**Why not B:** None reflects the field's defined role.

**Why not C:** None reflects the field's defined role.

## D3-Q16

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

A skill often needs a parameter, and developers forget to pass it. Which frontmatter helps prompt them?

- [ ] A. `context: fork`.
- [x] B. `argument-hint`, to prompt developers for required parameters when they invoke the skill without arguments.
- [ ] C. `allowed-tools`.
- [ ] D. `model`.

**Explanation:** `argument-hint` prompts for required parameters when the skill is invoked without them.

**Why not A:** Isolates context, not parameter prompting.

**Why not C:** Restricts tools.

**Why not D:** Sets the model.

## D3-Q17

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

When should you use a *skill* rather than adding content to CLAUDE.md?

- [ ] A. For always-loaded universal standards.
- [x] B. For on-demand, task-specific workflows invoked when needed, so long reference material doesn't cost context until used.
- [ ] C. Never; skills are deprecated.
- [ ] D. Only for MCP servers.

**Explanation:** Skills are on-demand (loaded when invoked), ideal for task-specific workflows; CLAUDE.md is for always-loaded universal standards.

**Why not A:** That's the CLAUDE.md case.

**Why not C:** Skills are current, not deprecated.

**Why not D:** Skills aren't limited to MCP.

## D3-Q18

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

You want a personal variant of a team skill without affecting teammates. What does the guide suggest?

- [ ] A. Delete the team skill.
- [ ] B. Overwrite the team skill in `.claude/skills/`.
- [x] C. Create a personal variant in `~/.claude/skills/` with a different name.
- [ ] D. Put your variant in `.mcp.json`.

**Explanation:** Personal skill customization means creating variants in `~/.claude/skills/` with different names to avoid affecting teammates.

**Why not A:** Deleting harms the team.

**Why not B:** Overwriting the shared skill affects everyone.

**Why not D:** `.mcp.json` isn't for skills.

## D3-Q19

- task: 3.2
- scenario: 2
- mock: true
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

Which pair correctly distinguishes project vs user command scope?

- [ ] A. Neither is version-controllable.
- [ ] B. `.claude/commands/` = personal; `~/.claude/commands/` = shared.
- [ ] C. Both are shared identically.
- [x] D. `.claude/commands/` = project (shared via version control); `~/.claude/commands/` = user (personal).

**Explanation:** Project commands (`.claude/commands/`) are shared; user commands (`~/.claude/commands/`) are personal.

**Why not A:** Project commands are version-controllable.

**Why not B:** Reverses the scopes.

**Why not C:** They differ in sharing.

## D3-Q20

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

A brainstorming skill generates exploratory alternatives you don't want cluttering the main session. Best configuration?

- [ ] A. Put it in `~/.bashrc`.
- [x] B. `context: fork` so the skill's exploratory output stays isolated from the main session.
- [ ] C. `allowed-tools: Bash` only.
- [ ] D. Run it without frontmatter.

**Explanation:** `context: fork` isolates verbose/exploratory skill output (like brainstorming) from the main conversation.

**Why not A:** Shell profiles don't run skills.

**Why not C:** Tool restriction doesn't isolate context.

**Why not D:** Without `context: fork`, output pollutes the main session.

## D3-Q21

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

A skill could perform destructive file operations. How do you limit its blast radius via frontmatter?

- [ ] A. Set `context: fork`.
- [ ] B. Set `argument-hint`.
- [x] C. Set `allowed-tools` to restrict it to the minimum safe tools needed.
- [ ] D. Set `model: opus`.

**Explanation:** `allowed-tools` restricts tool access during skill execution to prevent destructive actions.

**Why not A:** Isolates context, not tool permissions.

**Why not B:** Prompts for parameters, not tool restriction.

**Why not D:** Model choice doesn't restrict tools.

## D3-Q22

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

Which statement about skills vs CLAUDE.md loading is correct?

- [ ] A. Both always load fully into every session.
- [x] B. CLAUDE.md content is always loaded; a skill's body loads only when the skill is used, so long reference material costs little until needed.
- [ ] C. Skills always load; CLAUDE.md loads on demand.
- [ ] D. Neither loads automatically.

**Explanation:** CLAUDE.md is always-loaded; skills load on invocation, keeping long material cheap until used.

**Why not A:** Skills don't always fully load.

**Why not C:** Reverses the behavior.

**Why not D:** CLAUDE.md loads automatically.

## D3-Q23

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

A `/deploy-staging` workflow is repeated often and is team-wide. Best implementation?

- [ ] A. An entry in `.mcp.json`.
- [ ] B. A personal note in `~/.claude/CLAUDE.md`.
- [ ] C. A paragraph pasted into chat each time.
- [x] D. A project-scoped skill/command in `.claude/` so it's shared and invocable on demand.

**Explanation:** A project-scoped, on-demand skill/command shares the repeatable workflow team-wide.

**Why not A:** `.mcp.json` is for servers.

**Why not B:** Personal and unshared.

**Why not C:** Manual pasting defeats reuse.

## D3-Q24

- task: 3.2
- scenario: 2
- docs: [Skills & slash commands](https://code.claude.com/docs/en/skills)

Which frontmatter combination would you use for a shared code-analysis skill that is verbose and should not run destructive operations?

- [ ] A. `argument-hint` + `model: haiku` only.
- [x] B. `context: fork` (isolate verbose output) + `allowed-tools` restricting to read/analysis tools.
- [ ] C. No frontmatter.
- [ ] D. `context: fork` + `allowed-tools: Bash, Write, Edit` (full write access).

**Explanation:** Combine `context: fork` to isolate verbose output with `allowed-tools` restricting to safe read/analysis tools.

**Why not A:** Doesn't isolate context or restrict destructive tools.

**Why not C:** Leaves output polluting and tools unrestricted.

**Why not D:** Granting full write/exec access contradicts "no destructive operations."

## D3-Q25

- task: 3.3
- scenario: 2
- mock: true
- official: true
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

Your codebase has React components, API handlers, and DB models with different conventions, and test files are scattered throughout next to the code they test. You want Claude to auto-apply the right conventions by file path. What is the most maintainable approach?

- [ ] A. Create skills in `.claude/skills/` for each code type and invoke them manually.
- [ ] B. Consolidate all conventions in the root CLAUDE.md under headers and rely on Claude to infer which applies.
- [x] C. Create rule files in `.claude/rules/` with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths.
- [ ] D. Place a separate CLAUDE.md in each subdirectory.

**Explanation:** `.claude/rules/` with glob patterns (e.g., `**/*.test.tsx`) auto-applies conventions by path regardless of directory, ideal for test files spread throughout. (Mirrors official Sample Question 6.)

**Why not A:** Requires manual invocation, contradicting "automatic" application by path.

**Why not B:** Relies on inference rather than explicit matching, making it unreliable.

**Why not D:** Directory-bound CLAUDE.md files can't easily cover files spread across many directories.

## D3-Q26

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

What field in a `.claude/rules/` file's YAML frontmatter drives conditional activation?

- [ ] A. A `commands` array.
- [ ] B. A `color` field.
- [ ] C. A `priority` integer only.
- [x] D. A `paths` field containing glob patterns.

**Explanation:** `.claude/rules/` files use a `paths` frontmatter field with glob patterns for conditional rule activation.

**Why not A:** None governs path-based activation.

**Why not B:** None governs path-based activation.

**Why not C:** None governs path-based activation.

## D3-Q27

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

What is the token-efficiency benefit of path-scoped rules?

- [ ] A. They load on every request regardless of file.
- [x] B. They load only when editing matching files, reducing irrelevant context and token usage.
- [ ] C. They compress the model.
- [ ] D. They disable CLAUDE.md.

**Explanation:** Path-scoped rules load only when editing matching files, reducing irrelevant context and tokens.

**Why not A:** The point is conditional, not universal, loading.

**Why not C:** Neither is what path-scoping does.

**Why not D:** Neither is what path-scoping does.

## D3-Q28

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

Why prefer glob-pattern rules over directory-level CLAUDE.md for conventions that span many directories?

- [ ] A. Directory CLAUDE.md files are faster.
- [x] B. Glob patterns apply to files by type regardless of location (e.g., `**/*.test.tsx`), while directory CLAUDE.md is bound to one directory tree.
- [ ] C. Glob patterns disable other rules.
- [ ] D. There is no difference.

**Explanation:** Glob rules match by file type across the whole codebase; directory CLAUDE.md is location-bound, so it can't cover scattered files well.

**Why not A:** Speed isn't the distinction.

**Why not C:** Glob rules don't disable others.

**Why not D:** There's a meaningful difference for cross-directory conventions.

## D3-Q29

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

Which glob configuration correctly scopes a rule to all TypeScript test files anywhere in the repo?

- [ ] A. `paths: ["src/only/here.ts"]`.
- [x] B. `paths: ["**/*.test.tsx"]`.
- [ ] C. `paths: ["*.md"]`.
- [ ] D. No `paths` field at all.

**Explanation:** `**/*.test.tsx` matches test files by type regardless of directory location.

**Why not A:** Matches a single file only.

**Why not C:** Matches markdown, not tests.

**Why not D:** Without `paths`, the rule isn't path-scoped.

## D3-Q30

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

API conventions should apply only when editing files under `src/api/`. Which rule config fits?

- [ ] A. `tool_choice: any`.
- [ ] B. A note in `~/.claude/CLAUDE.md`.
- [x] C. `paths: ["src/api/**/*"]` in a `.claude/rules/` file.
- [ ] D. A skill with `argument-hint`.

**Explanation:** A `paths: ["src/api/**/*"]` glob scopes API conventions to those files only.

**Why not A:** Unrelated tool-choice setting.

**Why not B:** User-level, unshared, and not path-scoped.

**Why not D:** Requires manual invocation and isn't path-triggered.

## D3-Q31

- task: 3.3
- scenario: 2
- mock: true
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

When are path-specific rules preferred over subdirectory CLAUDE.md files?

- [ ] A. When you need MCP servers.
- [ ] B. When conventions apply to exactly one directory.
- [ ] C. When you want rules to never load.
- [x] D. When conventions must apply to files spread across the codebase by type, not by directory.

**Explanation:** Path-specific glob rules suit conventions that must apply across the codebase by file type.

**Why not A:** Unrelated to MCP.

**Why not B:** A single directory is the subdirectory-CLAUDE.md case.

**Why not C:** Rules are meant to load conditionally, not never.

## D3-Q32

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

A team uses `paths: ["terraform/**/*"]` on a rule. What behavior results?

- [ ] A. The rule loads on every file edit.
- [x] B. The rule loads only when editing files matching that glob.
- [ ] C. The rule never loads.
- [ ] D. The rule deletes Terraform files.

**Explanation:** Path-scoped rules load only when editing files matching the glob (here, under `terraform/`).

**Why not A:** Conditional, not universal loading.

**Why not C:** It does load, for matching files.

**Why not D:** Rules don't delete files.

## D3-Q33

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

Why does relying on a monolithic CLAUDE.md with headers ("Claude will infer which section applies") underperform path-scoped rules?

- [ ] A. It's faster but less accurate.
- [x] B. Inference is less reliable than explicit glob matching, and it loads all sections regardless of the file being edited.
- [ ] C. It cannot contain headers.
- [ ] D. It requires an MCP server.

**Explanation:** Explicit glob matching is more reliable than inference and avoids loading irrelevant sections for every file.

**Why not A:** It's both less reliable and less token-efficient.

**Why not C:** Headers are allowed; that's not the issue.

**Why not D:** No MCP dependency.

## D3-Q34

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

Test files sit next to their source (`Button.test.tsx` beside `Button.tsx`) throughout the repo. Which mechanism ensures consistent test conventions everywhere?

- [ ] A. A user-scoped note.
- [ ] B. A CLAUDE.md only in the top-level `tests/` folder.
- [x] C. A path-scoped rule with `paths: ["**/*.test.tsx"]`.
- [ ] D. Manual reminders in chat.

**Explanation:** A `**/*.test.tsx` glob rule applies test conventions wherever test files live.

**Why not A:** Unshared and not path-triggered.

**Why not B:** A single-folder CLAUDE.md misses scattered test files.

**Why not D:** Manual reminders don't scale.

## D3-Q35

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

The advantage of conditional (path-scoped) rule loading for large repos is best summarized as:

- [ ] A. Always maximizing loaded context.
- [x] B. Loading only relevant conventions per file, reducing token usage and irrelevant instructions.
- [ ] C. Preventing any rules from applying.
- [ ] D. Requiring all rules in one file.

**Explanation:** Conditional loading brings in only relevant conventions per file, saving tokens and noise.

**Why not A:** The opposite of the benefit.

**Why not C:** Rules do apply, conditionally.

**Why not D:** Path-scoping enables splitting across files.

## D3-Q36

- task: 3.3
- scenario: 2
- docs: [Memory, path-scoped rules (.claude/rules)](https://code.claude.com/docs/en/memory)

Which is the best reason to choose `.claude/rules/` glob rules over directory-level CLAUDE.md for a convention like "all GraphQL resolvers must validate inputs"?

- [ ] A. It forces plan mode.
- [ ] B. Directory CLAUDE.md is always better.
- [ ] C. Glob rules can't express file types.
- [x] D. Resolvers may be spread across many directories, so a type/pattern-based glob rule applies consistently regardless of location.

**Explanation:** When files span directories, glob-based rules apply the convention consistently by pattern, unlike location-bound CLAUDE.md.

**Why not A:** Unrelated to plan mode.

**Why not B:** Not for cross-directory conventions.

**Why not C:** Globs are exactly for file-type patterns.

## D3-Q37

- task: 3.4
- scenario: 2
- mock: true
- official: true
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

You've been assigned to restructure a monolithic application into microservices, changes across dozens of files, plus decisions about service boundaries and module dependencies. Which approach should you take?

- [ ] A. Start with direct execution and let the implementation reveal the natural service boundaries.
- [x] B. Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes.
- [ ] C. Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured.
- [ ] D. Begin in direct execution and only switch to plan mode if you encounter unexpected complexity.

**Explanation:** Plan mode is designed for complex, large-scale, multi-approach, architectural, multi-file changes, exactly monolith-to-microservices. It enables safe exploration and design before committing, preventing costly rework. (Mirrors official Sample Question 5.)

**Why not A:** Risks costly rework when dependencies surface late.

**Why not C:** Assumes you already know the right structure without exploring the code.

**Why not D:** Ignores that the complexity is already stated in the requirements, not something that merely *might* emerge.

## D3-Q38

- task: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

For which change is *direct execution* clearly appropriate?

- [ ] A. Choosing between two integration approaches with different infrastructure requirements.
- [ ] B. A library migration affecting 45+ files.
- [x] C. A single-file bug fix with a clear stack trace, e.g., adding a date-validation conditional.
- [ ] D. Restructuring service boundaries.

**Explanation:** Direct execution suits simple, well-scoped changes with clear scope, like a single-file fix.

**Why not A:** All are complex, architectural, or multi-file, plan-mode territory.

**Why not B:** All are complex, architectural, or multi-file, plan-mode territory.

**Why not D:** All are complex, architectural, or multi-file, plan-mode territory.

## D3-Q39

- task: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

What is the core value proposition of plan mode?

- [ ] A. It executes changes faster than direct mode.
- [x] B. It enables safe codebase exploration and design before committing to changes, preventing costly rework.
- [ ] C. It disables all tools.
- [ ] D. It automatically merges pull requests.

**Explanation:** Plan mode allows safe exploration/design before committing, avoiding expensive rework.

**Why not A:** It's about safety/design, not raw speed.

**Why not C:** It doesn't disable tools.

**Why not D:** It doesn't merge PRs.

## D3-Q40

- task: 3.4/5.4
- group: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

During a multi-phase task, verbose discovery output is threatening to exhaust the context window. Which mechanism helps?

- [ ] A. Deleting CLAUDE.md.
- [ ] B. `tool_choice: any`.
- [ ] C. `--json-schema`.
- [x] D. The Explore subagent, to isolate verbose discovery output and return summaries, preserving main conversation context.

**Explanation:** The Explore subagent isolates verbose discovery and returns summaries, preserving main-conversation context during multi-phase work.

**Why not A:** Deleting config doesn't manage discovery output.

**Why not B:** Unrelated flags.

**Why not C:** Unrelated flags.

## D3-Q41

- task: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

A library migration affects 45+ files and involves choosing between integration approaches. Which combined workflow does the guide endorse?

- [ ] A. Direct execution only.
- [x] B. Plan mode to investigate and design, then direct execution to implement the planned approach.
- [ ] C. Plan mode only, never implementing.
- [ ] D. Random switching.

**Explanation:** Combine plan mode (investigate/design) with direct execution (implement the plan) for complex migrations.

**Why not A:** Direct-only risks rework on a 45-file architectural change.

**Why not C:** Planning without implementing never ships.

**Why not D:** Random switching is not a strategy.

## D3-Q42

- task: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

Which is the clearest signal to choose *plan mode* over direct execution?

- [ ] A. The task is a one-line fix with a clear cause.
- [x] B. The task has architectural implications or multiple valid approaches and spans many files.
- [ ] C. You want to add a single validation check to one function.
- [ ] D. You already know exactly what to change and it's small.

**Explanation:** Architectural implications, multiple valid approaches, and multi-file scope signal plan mode.

**Why not A:** All are small, well-scoped changes suited to direct execution.

**Why not C:** All are small, well-scoped changes suited to direct execution.

**Why not D:** All are small, well-scoped changes suited to direct execution.

## D3-Q43

- task: 3.4
- scenario: 2
- mock: true
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

Why is "start direct, switch to plan mode only if complexity emerges" a weak strategy for a task whose complexity is already known?

- [ ] A. Plan mode can't be entered mid-task.
- [x] B. The complexity is stated upfront, so beginning direct risks committing changes and incurring rework before the switch, plan mode should be chosen from the start.
- [ ] C. Direct execution is always forbidden.
- [ ] D. Switching modes corrupts the repo.

**Explanation:** When complexity is known in advance, starting direct risks premature changes and rework; choose plan mode from the outset.

**Why not A:** You can switch, but that's not the point; the issue is early rework risk.

**Why not C:** Direct execution is fine for simple tasks.

**Why not D:** Switching doesn't corrupt anything.

## D3-Q44

- task: 3.4/5.4
- group: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

The Explore subagent's main benefit during plan-mode investigation is:

- [ ] A. Committing changes automatically.
- [x] B. Isolating verbose discovery output and returning concise summaries to preserve the main context window.
- [ ] C. Forcing tool calls.
- [ ] D. Running the CI pipeline.

**Explanation:** Explore isolates verbose discovery and returns summaries, protecting the main context.

**Why not A:** It doesn't commit changes.

**Why not C:** Not a tool-choice mechanism.

**Why not D:** It doesn't run CI.

## D3-Q45

- task: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

Which task set is best matched to direct execution?

- [ ] A. Choosing between integration approaches with different infrastructure.
- [ ] B. Microservice restructuring; 45-file migration.
- [x] C. Single-file bug fix with a clear stack trace; adding a date-validation conditional.
- [ ] D. Designing a new architecture from scratch.

**Explanation:** Clear, small, well-scoped changes fit direct execution.

**Why not A:** Architectural/multi-file/multi-approach work needs plan mode.

**Why not B:** Architectural/multi-file/multi-approach work needs plan mode.

**Why not D:** Architectural/multi-file/multi-approach work needs plan mode.

## D3-Q46

- task: 3.4/5.4
- group: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

A developer wants to avoid context exhaustion while Claude explores a large system before planning. Best practice?

- [ ] A. Read every file into the main session.
- [x] B. Delegate verbose discovery to the Explore subagent and bring back summaries.
- [ ] C. Disable plan mode.
- [ ] D. Force `end_turn` early.

**Explanation:** Delegating verbose discovery to Explore and returning summaries preserves the main context window.

**Why not A:** Bulk reading exhausts context.

**Why not C:** Disabling plan mode removes the safe-exploration benefit.

**Why not D:** Forcing early termination abandons the task.

## D3-Q47

- task: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

Which statement about plan mode vs direct execution is most accurate?

- [ ] A. Plan mode is for simple one-liners; direct execution is for architecture.
- [x] B. Plan mode suits complex, multi-approach, architectural, multi-file work; direct execution suits simple, well-scoped changes.
- [ ] C. They are interchangeable with identical outcomes.
- [ ] D. Direct execution can never be combined with plan mode.

**Explanation:** This matches the guide's split between plan mode (complex/architectural) and direct execution (simple/well-scoped).

**Why not A:** Reverses their appropriate uses.

**Why not C:** Outcomes differ, especially on complex tasks.

**Why not D:** They're explicitly combinable (plan then execute).

## D3-Q48

- task: 3.4
- scenario: 2
- docs: [Common workflows, plan mode vs direct execution](https://code.claude.com/docs/en/common-workflows)

You must choose between two integration approaches with different infrastructure requirements before writing code. Which mode fits?

- [ ] A. Direct execution with no exploration.
- [x] B. Plan mode, to evaluate the approaches and their implications before committing.
- [ ] C. Neither; just pick randomly.
- [ ] D. Skip the decision.

**Explanation:** Choosing among approaches with architectural/infrastructure implications is a plan-mode decision.

**Why not A:** Skips necessary evaluation.

**Why not C:** Not responsible engineering choices.

**Why not D:** Not responsible engineering choices.

## D3-Q49

- task: 3.5
- scenario: 2
- mock: true
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

Prose descriptions of a data transformation are being interpreted inconsistently by Claude. What is the most effective refinement?

- [ ] A. Increase `max_tokens`.
- [ ] B. Repeat the prose description more emphatically.
- [ ] C. Add "be careful" to the prompt.
- [x] D. Provide 2-3 concrete input/output examples to clarify the transformation.

**Explanation:** Concrete input/output examples are the most effective way to communicate expected transformations when prose is interpreted inconsistently.

**Why not A:** Token budget isn't the issue.

**Why not B:** Emphatic prose doesn't resolve ambiguity.

**Why not C:** Vague instructions don't clarify the transformation.

## D3-Q50

- task: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

Which describes the *test-driven iteration* refinement pattern?

- [ ] A. Never writing tests.
- [x] B. Writing test suites first (covering behavior, edge cases, performance), then iterating by sharing test failures to guide improvement.
- [ ] C. Writing code first and never testing.
- [ ] D. Deleting failing tests.

**Explanation:** Test-driven iteration writes tests first, then iterates by sharing failures to drive progressive improvement.

**Why not A:** Skip testing, contrary to the pattern.

**Why not C:** Skip testing, contrary to the pattern.

**Why not D:** Deleting failing tests hides problems.

## D3-Q51

- task: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

What is the *interview pattern* in iterative refinement?

- [ ] A. Forcing Claude to answer without questions.
- [ ] B. Interviewing job candidates.
- [x] C. Having Claude ask clarifying questions to surface considerations the developer may not have anticipated before implementing.
- [ ] D. Removing all context.

**Explanation:** The interview pattern has Claude ask questions first to surface design considerations (e.g., cache invalidation, failure modes) before implementing.

**Why not A:** The opposite of the pattern.

**Why not B:** Unrelated meaning.

**Why not D:** Removing context undermines good questions.

## D3-Q52

- task: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

You have several *interacting* problems whose fixes affect each other. How should you present them?

- [ ] A. Only the first one.
- [ ] B. One at a time in sequential messages regardless of interaction.
- [ ] C. Not at all.
- [x] D. In a single detailed message addressing all interacting issues together.

**Explanation:** Provide all issues in a single message when they interact, so fixes are coordinated; sequential iteration is for independent problems.

**Why not A:** Ignoring issues doesn't solve them.

**Why not B:** Sequential handling of interacting fixes causes churn.

**Why not C:** Ignoring issues doesn't solve them.

## D3-Q53

- task: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

For *independent* problems, the guide recommends:

- [ ] A. Always bundling them into one giant message.
- [x] B. Fixing them sequentially, one at a time.
- [ ] C. Ignoring them.
- [ ] D. Only fixing the hardest one.

**Explanation:** Independent problems are best fixed sequentially; single-message bundling is reserved for interacting problems.

**Why not A:** Bundling independent issues adds no benefit and can confuse.

**Why not C:** Leaves problems unresolved.

**Why not D:** Leaves problems unresolved.

## D3-Q54

- task: 3.5/4.2
- group: 3.5
- scenario: 6
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

When natural-language descriptions produce inconsistent extraction results, the most reliable refinement is:

- [ ] A. Lowering temperature only.
- [ ] B. Saying "please be accurate."
- [x] C. Providing 2-3 concrete input/output examples of the desired transformation.
- [ ] D. Adding more prose adjectives.

**Explanation:** Concrete examples reliably communicate the intended transformation better than prose.

**Why not A:** Temperature alone won't fix specification ambiguity.

**Why not B:** Vague or verbose prose doesn't disambiguate.

**Why not D:** Vague or verbose prose doesn't disambiguate.

## D3-Q55

- task: 3.5
- scenario: 2
- mock: true
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

To fix an edge-case handling bug (e.g., null values in migration scripts), the guide suggests:

- [ ] A. Increasing iteration caps.
- [ ] B. Telling Claude to "handle edge cases."
- [ ] C. Removing the edge case from scope.
- [x] D. Providing specific test cases with example input and expected output for the edge case.

**Explanation:** Concrete test cases (example input + expected output) precisely fix edge-case handling.

**Why not A:** Iteration count doesn't clarify the requirement.

**Why not B:** Vague instruction doesn't specify behavior.

**Why not C:** Dropping the edge case avoids, not fixes, the bug.

## D3-Q56

- task: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

Why use the interview pattern in an unfamiliar domain before implementing?

- [ ] A. To delay work indefinitely.
- [x] B. To surface design considerations (e.g., cache invalidation strategies, failure modes) the developer may not have anticipated.
- [ ] C. To avoid writing any code.
- [ ] D. To reduce the number of tools.

**Explanation:** In unfamiliar domains, the interview pattern surfaces overlooked considerations before implementation.

**Why not A:** It's a prelude to implementation, not a delay tactic.

**Why not C:** It's a prelude to implementation, not a delay tactic.

**Why not D:** Unrelated to tool count.

## D3-Q57

- task: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

Which is the best example of the single-message approach for interacting problems?

- [ ] A. "Only tell me the first bug."
- [ ] B. "Fix the typo in the README." then later "Rename an unrelated variable."
- [x] C. "Fix the race condition and the related lock ordering together, they interact, here are both symptoms and constraints."
- [ ] D. "Ignore the interaction between the two."

**Explanation:** Interacting fixes (race condition + lock ordering) belong in one coordinated message.

**Why not A:** Ignoring or truncating the interaction risks incomplete fixes.

**Why not B:** Those are independent, better handled sequentially.

**Why not D:** Ignoring or truncating the interaction risks incomplete fixes.

## D3-Q58

- task: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

Test-driven iteration improves results primarily because:

- [ ] A. It always reduces token usage.
- [ ] B. It removes the need for any prompt.
- [ ] C. It hides failures from the model.
- [x] D. Sharing concrete test failures gives precise, actionable signals that guide progressive improvement.

**Explanation:** Concrete failing tests are precise signals that drive targeted improvement.

**Why not A:** Token usage isn't the mechanism.

**Why not B:** Prompts still matter.

**Why not C:** It surfaces, not hides, failures.

## D3-Q59

- task: 3.5/4.2
- group: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

You get inconsistent formatting from Claude despite detailed prose instructions. Best next refinement?

- [ ] A. Add "format nicely" to the prompt.
- [x] B. Add 2-4 concrete examples demonstrating the exact desired output format.
- [ ] C. Switch to plan mode.
- [ ] D. Increase `max_tokens`.

**Explanation:** Concrete examples of the desired format are the most effective fix for inconsistent formatting (bridges to few-shot, 4.2).

**Why not A:** Vague instructions don't standardize format.

**Why not C:** Plan mode is unrelated to output formatting.

**Why not D:** Token budget isn't the cause.

## D3-Q60

- task: 3.5
- scenario: 2
- docs: [Common workflows, iterative refinement](https://code.claude.com/docs/en/common-workflows)

Which refinement technique best fits: "I'm not sure what considerations I'm missing for this new caching layer"?

- [ ] A. `tool_choice: any`.
- [ ] B. Batch processing.
- [x] C. The interview pattern, have Claude ask clarifying questions first.
- [ ] D. Deleting CLAUDE.md.

**Explanation:** The interview pattern surfaces unanticipated considerations (e.g., invalidation, failure modes) for the new caching layer.

**Why not A:** None surfaces design considerations.

**Why not B:** None surfaces design considerations.

**Why not D:** None surfaces design considerations.

## D3-Q61

- task: 3.6
- scenario: 5
- mock: true
- official: true
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

Your pipeline runs `claude "Analyze this pull request for security issues"` but the job hangs waiting for interactive input. What's the correct fix?

- [ ] A. Add a `--batch` flag.
- [ ] B. Set `CLAUDE_HEADLESS=true` before running.
- [ ] C. Redirect stdin from `/dev/null`.
- [x] D. Add the `-p` (or `--print`) flag to run in non-interactive mode: `claude -p "Analyze this pull request for security issues"`.

**Explanation:** `-p`/`--print` runs Claude Code non-interactively: it processes the prompt, prints the result, and exits, exactly what CI needs. (Mirrors official Sample Question 10.)

**Why not A:** There is no `--batch` flag for this.

**Why not B:** `CLAUDE_HEADLESS` is not a real environment variable.

**Why not C:** A stdin workaround doesn't properly address Claude Code's command syntax.

## D3-Q62

- task: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

You need machine-parseable structured findings from a CI review to post as inline PR comments. Which flags apply?

- [ ] A. `--verbose` only.
- [x] B. `--output-format json` with `--json-schema` to produce validated structured output.
- [ ] C. `--resume`.
- [ ] D. `--fork-session`.

**Explanation:** `--output-format json` plus `--json-schema` yields machine-parseable, schema-validated findings for automated posting.

**Why not A:** Verbose text isn't reliably machine-parseable.

**Why not C:** Session flags don't produce structured output.

**Why not D:** Session flags don't produce structured output.

## D3-Q63

- task: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

How does CI-invoked Claude Code get project context like testing standards and review criteria?

- [ ] A. Only via `.mcp.json`.
- [ ] B. It cannot receive any project context in CI.
- [x] C. Via CLAUDE.md, which provides project context (testing standards, fixture conventions, review criteria) to CI-invoked Claude.
- [ ] D. Only via command-line temperature.

**Explanation:** CLAUDE.md supplies project context (standards, conventions, criteria) to Claude Code even when invoked in CI.

**Why not A:** `.mcp.json` configures servers, not review criteria.

**Why not B:** Context is available via CLAUDE.md.

**Why not D:** Temperature isn't a context mechanism.

## D3-Q64

- task: 3.6/4.6
- group: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

Why is an *independent* review instance more effective than having the same session that generated code review its own changes?

- [ ] A. There is no difference.
- [ ] B. Independent instances are cheaper only.
- [ ] C. The same session cannot output text.
- [x] D. The generating session retains its reasoning context, making it less likely to question its own decisions; an independent instance lacks that bias.

**Explanation:** Session-context isolation matters: the generator retains reasoning that biases it against catching its own issues; an independent instance reviews without that context.

**Why not A:** There is a meaningful effectiveness difference.

**Why not B:** Effectiveness, not just cost, is the point.

**Why not C:** The same session can output text; that's not the issue.

## D3-Q65

- task: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

When re-running a CI review after new commits, how do you avoid duplicate comments?

- [ ] A. Re-run with no context so it re-flags everything.
- [x] B. Include prior review findings in context and instruct Claude to report only new or still-unaddressed issues.
- [ ] C. Disable the review.
- [ ] D. Randomly drop half the comments.

**Explanation:** Passing prior findings and instructing Claude to report only new/unaddressed issues prevents duplicate comments.

**Why not A:** No context guarantees duplicates.

**Why not C:** Disabling loses the value of review.

**Why not D:** Random dropping is unreliable and may hide real issues.

## D3-Q66

- task: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

To reduce low-value or duplicate test generation in CI, what should you provide in context?

- [ ] A. Only the production code with no tests.
- [ ] B. Nothing; let it regenerate everything.
- [x] C. Existing test files, so generation avoids suggesting scenarios already covered.
- [ ] D. A larger temperature.

**Explanation:** Providing existing tests lets generation skip already-covered scenarios, reducing duplicates.

**Why not A:** Without existing tests it can't know what's covered.

**Why not B:** Regenerating everything duplicates coverage.

**Why not D:** Temperature doesn't address coverage overlap.

## D3-Q67

- task: 3.6/4.3
- group: 3.6
- scenario: 5
- mock: true
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

What is the role of `--json-schema` in a CI context?

- [ ] A. To set the model.
- [ ] B. To resume a session.
- [ ] C. To fork a session.
- [x] D. To validate that Claude's structured output matches a specified JSON Schema for reliable downstream posting.

**Explanation:** `--json-schema` enforces schema-validated structured output suitable for automated CI consumption.

**Why not A:** Those are session/model flags, not output-schema enforcement.

**Why not B:** Those are session/model flags, not output-schema enforcement.

**Why not C:** Those are session/model flags, not output-schema enforcement.

## D3-Q68

- task: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

Documenting testing standards and valuable test criteria in CLAUDE.md primarily helps CI by:

- [ ] A. Increasing the number of comments regardless of value.
- [x] B. Improving test-generation quality and reducing low-value test output.
- [ ] C. Disabling the review.
- [ ] D. Forcing interactive mode.

**Explanation:** CLAUDE.md testing standards/criteria improve generated-test quality and cut low-value output.

**Why not A:** The goal is value, not volume.

**Why not C:** It enables, not disables, better review.

**Why not D:** CLAUDE.md doesn't force interactivity.

## D3-Q69

- task: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

A CI job must never hang on interactive prompts and must emit parseable results. Which flag combination is best?

- [ ] A. No flags (default interactive).
- [ ] B. `--verbose` only.
- [x] C. `-p --output-format json` (non-interactive + structured output).
- [ ] D. `--resume` only.

**Explanation:** `-p` prevents interactive hangs; `--output-format json` yields parseable results.

**Why not A:** Default may wait for input.

**Why not B:** Verbose text isn't reliably parseable and doesn't guarantee non-interactivity.

**Why not D:** Resume doesn't address interactivity or output format.

## D3-Q70

- task: 3.6/4.6
- group: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

Which best explains "session context isolation" as it applies to CI review quality?

- [ ] A. It only affects billing.
- [ ] B. Sessions must never be isolated.
- [ ] C. Isolation means deleting all context including CLAUDE.md.
- [x] D. An independent Claude instance (without the generator's reasoning context) catches subtle issues the generator overlooks.

**Explanation:** Independent instances lack the generator's biasing reasoning, catching more subtle issues.

**Why not A:** It affects effectiveness, not just billing.

**Why not B:** Isolation is beneficial for review.

**Why not C:** It doesn't require deleting project context like CLAUDE.md.

## D3-Q71

- task: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

A pipeline should post only *actionable* review findings and minimize false positives. Beyond prompt criteria (Domain 4), which CI integration practice helps most?

- [ ] A. Print free-form prose and grep it.
- [x] B. Emit structured JSON findings (`--output-format json --json-schema`) so downstream tooling can filter, dedupe, and post consistently.
- [ ] C. Run interactively and copy-paste.
- [ ] D. Disable schemas.

**Explanation:** Structured, schema-validated output enables reliable filtering/deduping/posting in the pipeline.

**Why not A:** Grepping prose is brittle.

**Why not C:** Interactive copy-paste doesn't belong in CI.

**Why not D:** Disabling schemas loses the structure that enables filtering.

## D3-Q72

- task: 3.6
- scenario: 5
- docs: [CLI reference, running Claude Code in CI (-p, JSON)](https://code.claude.com/docs/en/cli-reference)

Your CI review re-runs on every push and developers complain about repeated identical comments. The single most effective fix is:

- [ ] A. Run the review twice.
- [ ] B. Increase the model size.
- [x] C. Pass the prior findings into context and instruct Claude to report only new or still-unaddressed issues.
- [ ] D. Remove CLAUDE.md.

**Explanation:** Supplying prior findings and scoping to new/unaddressed issues eliminates duplicate comments.

**Why not A:** Running twice worsens duplication.

**Why not B:** Model size doesn't address duplication.

**Why not D:** Removing CLAUDE.md loses project context and doesn't dedupe.
