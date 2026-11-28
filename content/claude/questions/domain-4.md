---
domain: 4
name: Prompt Engineering & Structured Output
weight: 20%
---

<!--
  Domain 4 question bank. Edit freely, then run `pnpm claude:build` (also runs on dev/build).
  Format guide: see src/content/claude/README.md
-->

# Task statements

### 4.1 Design prompts with explicit criteria to improve precision and reduce false positives

Explicit categorical criteria beat vague instructions ("flag only when comments contradict actual behavior" vs "check comments are accurate"); "be conservative"/"only high-confidence" don't improve precision; high false-positive categories erode developer trust; temporarily disable bad categories while improving them.

Docs: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview

### 4.2 Apply few-shot prompting to improve output consistency and quality

Few-shot examples are the most effective technique when detailed instructions alone give inconsistent output; demonstrate ambiguous-case handling; enable generalization to novel patterns; reduce hallucination in extraction; 2-4 targeted examples showing reasoning.

Docs: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview

### 4.3 Enforce structured output using tool use and JSON schemas

`tool_use` + JSON schema is the most reliable structured-output approach (eliminates syntax errors, not semantic errors); `tool_choice` `auto`/`any`/forced; optional/nullable fields prevent fabrication; enum + `"other"` + detail patterns; force a specific tool for enrichment pipelines.

Docs: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

### 4.4 Implement validation, retry, and feedback loops for extraction quality

Retry-with-error-feedback (append validation errors on retry); retries fail when info is absent from source (vs format/structural errors); `detected_pattern` fields for dismissal analysis; semantic validation (values don't sum) vs schema syntax errors; self-correction flows (`calculated_total` vs `stated_total`, `conflict_detected`).

Docs: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

### 4.5 Design efficient batch processing strategies

Message Batches API: 50% cost savings, up to 24-hour window, no latency SLA; appropriate for non-blocking/latency-tolerant work, inappropriate for blocking (pre-merge); no multi-turn tool calling within a single batch request; `custom_id` correlates request/response; resubmit only failed docs.

Docs: https://platform.claude.com/docs/en/build-with-claude/batch-processing

### 4.6 Design multi-instance and multi-pass review architectures

Self-review limits (model retains generation reasoning); independent review instances catch more; multi-pass (per-file local + cross-file integration) avoids attention dilution and contradictory findings; verification passes with self-reported confidence for calibrated routing.

Docs: https://code.claude.com/docs/en/common-workflows

# Questions

## D4-Q01

- task: 4.1
- scenario: 5
- mock: true
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Your CI code reviewer flags too many false positives on documentation comments, and developers are losing trust. Which instruction change most improves precision?

- [ ] A. Lower the temperature and keep the vague instruction.
- [ ] B. Add "be conservative" to the prompt.
- [ ] C. Add "only report high-confidence findings."
- [x] D. Replace "check that comments are accurate" with "flag comments only when the claimed behavior contradicts the actual code behavior."

**Explanation:** Explicit categorical criteria ("flag only when claimed behavior contradicts actual behavior") outperform vague instructions; they define exactly what to report.

**Why not A:** Temperature doesn't fix an under-specified criterion.

**Why not B:** "Be conservative" / "only high-confidence" are general instructions that don't improve precision compared to specific categorical criteria.

**Why not C:** "Be conservative" / "only high-confidence" are general instructions that don't improve precision compared to specific categorical criteria.

## D4-Q02

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Why do instructions like "be conservative" or "only report high-confidence findings" fail to improve precision?

- [ ] A. They're too long.
- [x] B. They're vague and don't give the model specific categorical criteria for what to report vs skip.
- [ ] C. They disable tool use.
- [ ] D. They increase token cost beyond limits.

**Explanation:** Confidence-based, vague instructions don't define categories; specific criteria do.

**Why not A:** Length isn't the problem.

**Why not C:** They don't disable tools.

**Why not D:** Cost isn't the mechanism.

## D4-Q03

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

A review category (e.g., "style nitpicks") has a high false-positive rate that undermines trust in the accurate categories. What does the guide recommend?

- [ ] A. Keep it enabled and tell developers to ignore it.
- [x] B. Temporarily disable the high false-positive category while improving its prompt, to restore developer trust.
- [ ] C. Delete all categories.
- [ ] D. Increase its sensitivity.

**Explanation:** Temporarily disabling high false-positive categories restores trust while you improve those prompts.

**Why not A:** Telling developers to ignore output erodes trust in everything.

**Why not C:** Deleting all categories throws away valuable signal.

**Why not D:** Higher sensitivity worsens false positives.

## D4-Q04

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

How do high false-positive categories affect developer trust in accurate categories?

- [ ] A. They have no effect.
- [x] B. They undermine confidence in the accurate categories because developers start distrusting all output.
- [ ] C. They improve trust by showing thoroughness.
- [ ] D. They only affect latency.

**Explanation:** High false-positive categories erode trust that spills over onto the accurate categories.

**Why not A:** There is a real spillover effect.

**Why not C:** Noise reduces, not builds, trust.

**Why not D:** It's a trust issue, not latency.

## D4-Q05

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Which review-criteria design produces the most consistent severity classification?

- [ ] A. Relying on the model's confidence score.
- [ ] B. Asking the model to "use good judgment."
- [x] C. Defining explicit severity criteria with concrete code examples for each severity level.
- [ ] D. Randomizing severity.

**Explanation:** Explicit severity criteria with concrete examples per level yield consistent classification.

**Why not A:** Confidence isn't a severity definition.

**Why not B:** Vague judgment is inconsistent.

**Why not D:** Randomization is not a design.

## D4-Q06

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Which criteria style best defines *what to report vs skip*?

- [ ] A. "Report nothing to be safe."
- [ ] B. "Report anything you're 90% sure about."
- [ ] C. "Report everything, then let humans filter."
- [x] D. "Report bugs and security issues; skip minor style and local patterns," rather than confidence-based filtering.

**Explanation:** Categorical criteria (report bugs/security; skip minor style) beat confidence-based filtering.

**Why not A:** Reporting nothing defeats review.

**Why not B:** Confidence thresholds don't define categories.

**Why not C:** Reporting everything creates noise.

## D4-Q07

- task: 4.1
- scenario: 5
- mock: true
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

A prompt says "flag comments that are inaccurate." Reviews flag stylistic comment preferences too. Best fix?

- [ ] A. Add "please be accurate."
- [x] B. Narrow the criterion: "flag a comment only when its claim contradicts the actual code behavior."
- [ ] C. Increase temperature.
- [ ] D. Remove the comment-review entirely.

**Explanation:** A precise contradiction-based criterion removes stylistic false positives.

**Why not A:** Vague reinforcement doesn't narrow scope.

**Why not C:** Temperature won't sharpen the criterion.

**Why not D:** Removing the check loses a valuable category unnecessarily.

## D4-Q08

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

The guide contrasts "flag comments only when claimed behavior contradicts actual code behavior" with "check that comments are accurate." The first is better because:

- [ ] A. It is shorter.
- [x] B. It gives an explicit, testable criterion, reducing subjective false positives.
- [ ] C. It disables the model's reasoning.
- [ ] D. It uses more tokens.

**Explanation:** An explicit, testable criterion reduces subjective interpretation and false positives.

**Why not A:** Brevity isn't the reason.

**Why not C:** It guides, not disables, reasoning.

**Why not D:** Token count isn't the benefit.

## D4-Q09

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

After disabling a noisy category, when should you re-enable it?

- [ ] A. Never.
- [x] B. After improving its prompt/criteria so its false-positive rate is acceptable.
- [ ] C. Immediately, unchanged.
- [ ] D. Only if developers beg for it.

**Explanation:** Re-enable once the category's criteria are improved enough to keep false positives acceptable.

**Why not A:** Permanent disabling loses value if it can be fixed.

**Why not C:** Re-enabling unchanged reintroduces the noise.

**Why not D:** The gate is quality, not requests.

## D4-Q10

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Which is the strongest indicator that your review prompt relies on vague rather than explicit criteria?

- [ ] A. It includes severity examples.
- [ ] B. It names specific categories with examples.
- [x] C. It uses phrases like "be conservative" and "high-confidence" instead of naming which issue categories to report or skip.
- [ ] D. It defines contradiction-based comment criteria.

**Explanation:** Reliance on "be conservative"/"high-confidence" language signals vague, non-categorical criteria.

**Why not A:** All are hallmarks of explicit criteria, the desired state.

**Why not B:** All are hallmarks of explicit criteria, the desired state.

**Why not D:** All are hallmarks of explicit criteria, the desired state.

## D4-Q11

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

A team wants consistent triage between "blocker" and "nit." What most improves consistency?

- [ ] A. Assigning severity at random.
- [ ] B. Telling the model to "be strict."
- [ ] C. Using the model's self-reported confidence.
- [x] D. Concrete code examples illustrating each severity level in the prompt.

**Explanation:** Concrete per-level examples anchor severity classification for consistency.

**Why not A:** Random assignment is inconsistent by definition.

**Why not B:** "Be strict" is vague.

**Why not C:** Confidence isn't a severity criterion.

## D4-Q12

- task: 4.1
- scenario: 5
- docs: [Prompt engineering, explicit criteria](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

The main risk of leaving a high-false-positive category enabled while you "figure it out later" is:

- [ ] A. Slightly higher token usage.
- [x] B. Erosion of developer trust that reduces confidence in the reviewer's accurate findings too.
- [ ] C. The model will crash.
- [ ] D. The category will auto-disable.

**Explanation:** Sustained false positives erode trust that generalizes to accurate categories, hence the temporary-disable recommendation.

**Why not A:** Tokens aren't the primary risk.

**Why not C:** No crash results.

**Why not D:** Categories don't auto-disable.

## D4-Q13

- task: 4.2
- scenario: 6
- mock: true
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Detailed instructions alone still yield inconsistently formatted, hard-to-act-on output. Which technique is *most* effective for consistent, actionable output?

- [ ] A. Repeating the instructions twice.
- [x] B. Few-shot examples demonstrating the exact desired output.
- [ ] C. Lowering temperature to 0 only.
- [ ] D. Adding "be consistent."

**Explanation:** Few-shot examples are the most effective technique for consistently formatted, actionable output when instructions alone fall short.

**Why not A:** Repetition doesn't demonstrate the target format.

**Why not C:** Temperature 0 doesn't teach the format.

**Why not D:** A vague plea doesn't standardize output.

## D4-Q14

- task: 4.2
- scenario: 1
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

For an ambiguous tool-selection situation, how many few-shot examples and of what kind does the guide suggest?

- [ ] A. One example only, always.
- [ ] B. 50 examples with no reasoning.
- [x] C. 2-4 targeted examples that show the reasoning for why one action was chosen over plausible alternatives.
- [ ] D. Zero; rely on instructions.

**Explanation:** 2-4 targeted examples that show *reasoning* for the chosen action over alternatives are recommended for ambiguous cases.

**Why not A:** A single example may not cover the ambiguity.

**Why not B:** Excessive, reasoning-free examples are inefficient and less instructive.

**Why not D:** Instructions alone were insufficient here.

## D4-Q15

- task: 4.2
- scenario: 6
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

How do few-shot examples help with *novel* patterns not explicitly enumerated?

- [ ] A. They require one example per possible input.
- [ ] B. They only work for exact matches.
- [ ] C. They prevent generalization.
- [x] D. They let the model generalize judgment to new patterns rather than matching only pre-specified cases.

**Explanation:** Well-chosen few-shot examples enable generalization to novel patterns, not just memorized cases.

**Why not A:** Generalization is the point; you needn't enumerate every input.

**Why not B:** They enable generalization, not exact-match-only behavior.

**Why not C:** They enable generalization, not exact-match-only behavior.

## D4-Q16

- task: 4.2
- scenario: 6
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

In extraction tasks with informal measurements and varied document structures, few-shot examples primarily:

- [ ] A. Increase hallucination.
- [x] B. Reduce hallucination by demonstrating correct handling of the varied inputs.
- [ ] C. Have no effect on extraction.
- [ ] D. Replace the need for a schema.

**Explanation:** Few-shot examples reduce hallucination in extraction by showing correct handling of informal/varied inputs.

**Why not A:** They reduce, not increase, hallucination.

**Why not C:** They materially help extraction.

**Why not D:** They complement, not replace, schemas (see 4.3).

## D4-Q17

- task: 4.2
- scenario: 5
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

To achieve a consistent finding format (location, issue, severity, suggested fix), the guide recommends:

- [ ] A. Letting the model choose any format.
- [ ] B. Describing the format only in prose.
- [x] C. Including few-shot examples that demonstrate that exact output format.
- [ ] D. Using `tool_choice: auto`.

**Explanation:** Few-shot examples demonstrating the exact format (location, issue, severity, fix) drive consistency.

**Why not A:** Free choice yields inconsistency.

**Why not B:** Prose-only is what proved inconsistent.

**Why not D:** `auto` is unrelated to output formatting.

## D4-Q18

- task: 4.2
- scenario: 5
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Few-shot examples that distinguish acceptable code patterns from genuine issues help by:

- [ ] A. Disabling severity levels.
- [ ] B. Eliminating all findings.
- [ ] C. Forcing the model to flag everything.
- [x] D. Reducing false positives while still enabling generalization to new cases.

**Explanation:** Contrasting examples reduce false positives while preserving generalization.

**Why not A:** They don't disable severity.

**Why not B:** They refine, not eliminate, findings.

**Why not C:** They reduce over-flagging.

## D4-Q19

- task: 4.2
- scenario: 6
- mock: true
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

For documents with varied citation styles (inline vs bibliographies) and structures (methodology sections vs embedded details), few-shot examples should:

- [ ] A. Show only one structure.
- [x] B. Demonstrate correct handling of each varied structure so extraction stays accurate.
- [ ] C. Avoid showing structure at all.
- [ ] D. Replace the extraction tool.

**Explanation:** Examples covering varied structures teach correct handling across document formats.

**Why not A:** One structure won't cover the variety.

**Why not C:** Structure is exactly what needs demonstrating.

**Why not D:** Examples support, not replace, the tool.

## D4-Q20

- task: 4.2/4.4
- group: 4.2
- scenario: 6
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

When required fields are sometimes extracted as empty/null incorrectly, adding few-shot examples of documents with varied formats helps because:

- [ ] A. It removes the fields from the schema.
- [ ] B. It forces the model to fabricate values.
- [x] C. It shows correct extraction from those formats, addressing empty/null extraction of required fields.
- [ ] D. It has no effect.

**Explanation:** Examples of varied-format documents demonstrate correct extraction, fixing spurious empty/null results.

**Why not A:** Removing fields isn't the fix.

**Why not B:** The goal is correct extraction, never fabrication.

**Why not D:** Examples do help here.

## D4-Q21

- task: 4.2
- scenario: 6
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Which statement best captures when few-shot examples are the right tool?

- [ ] A. Never for extraction.
- [ ] B. Only when there are zero instructions.
- [ ] C. Only for math problems.
- [x] D. When detailed instructions alone produce inconsistent results, examples demonstrate the desired behavior concretely.

**Explanation:** Few-shot is the go-to when instructions alone give inconsistent output.

**Why not A:** They're specifically valuable for extraction.

**Why not B:** Examples complement instructions.

**Why not C:** They apply broadly, including extraction.

## D4-Q22

- task: 4.2
- scenario: 1
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

Why include the *reasoning* in ambiguous-case few-shot examples (why one action beat alternatives)?

- [ ] A. It's required by JSON schema.
- [x] B. It teaches the model the decision principle so it generalizes to similar ambiguous cases.
- [ ] C. It reduces token usage.
- [ ] D. It disables tool use.

**Explanation:** Showing the reasoning conveys the decision principle, enabling generalization.

**Why not A:** Not a schema requirement.

**Why not C:** It adds tokens; the benefit is generalization.

**Why not D:** It doesn't disable tools.

## D4-Q23

- task: 4.2
- scenario: 1
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

A support agent mishandles ambiguous requests (e.g., unclear returns). Which prompt improvement fits best?

- [ ] A. Remove all examples.
- [ ] B. Add "handle ambiguity well."
- [x] C. Add 2-4 few-shot examples showing correct handling of ambiguous requests with the reasoning for each choice.
- [ ] D. Increase `max_tokens`.

**Explanation:** Targeted few-shot examples with reasoning are the recommended fix for ambiguous-case handling.

**Why not A:** Removing examples worsens consistency.

**Why not B:** Vague instruction doesn't teach handling.

**Why not D:** Token budget isn't the issue.

## D4-Q24

- task: 4.2
- scenario: 5
- docs: [Prompt engineering, few-shot / multishot](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

For branch-level test coverage gaps, few-shot examples help the model:

- [ ] A. Fabricate coverage numbers.
- [ ] B. Ignore coverage entirely.
- [ ] C. Only detect line coverage.
- [x] D. Recognize the pattern of missing branch coverage and generalize to new code.

**Explanation:** Examples demonstrating ambiguous coverage-gap cases help the model generalize to new code.

**Why not A:** Fabrication is never the goal.

**Why not B:** They improve, not ignore or narrow, detection.

**Why not C:** They improve, not ignore or narrow, detection.

## D4-Q25

- task: 4.3
- scenario: 6
- mock: true
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

You need guaranteed schema-compliant structured output with no JSON syntax errors. Which approach is most reliable?

- [ ] A. Asking the model to "output valid JSON" in prose.
- [x] B. Tool use (`tool_use`) with a JSON schema as the tool's input parameters.
- [ ] C. Post-processing free-text with regex.
- [ ] D. Lowering temperature and hoping.

**Explanation:** `tool_use` with a JSON schema is the most reliable approach for guaranteed schema-compliant output, eliminating JSON syntax errors.

**Why not A:** Prose requests don't guarantee valid JSON.

**Why not C:** Regex on free text is brittle.

**Why not D:** Temperature doesn't guarantee structure.

## D4-Q26

- task: 4.3/4.4
- group: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Strict JSON schemas via tool use eliminate which class of errors but *not* which other?

- [ ] A. Eliminate both.
- [ ] B. Eliminate semantic errors; do not prevent syntax errors.
- [x] C. Eliminate syntax errors; do not prevent semantic errors (e.g., line items that don't sum to the total, values in wrong fields).
- [ ] D. Eliminate neither.

**Explanation:** Tool-use schemas guarantee syntactic validity but not semantic correctness (values can still be wrong or misplaced).

**Why not A:** Semantic errors persist.

**Why not B:** Reverses it.

**Why not D:** Syntax errors are eliminated.

## D4-Q27

- task: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

You have multiple extraction schemas and the document type is unknown, but you must guarantee structured output. Which `tool_choice` setting fits?

- [ ] A. Forced selection of one specific schema regardless of the document.
- [ ] B. `tool_choice: "auto"`, which may return text.
- [ ] C. No `tool_choice`.
- [x] D. `tool_choice: "any"`, so the model must call one of the extraction tools.

**Explanation:** `any` guarantees a tool call (structured output) while letting the model pick the matching schema when the type is unknown.

**Why not A:** Forcing one schema is wrong when the type is unknown.

**Why not B:** `auto` may return plain text.

**Why not C:** Defaults to `auto` behavior.

## D4-Q28

- task: 4.3/2.3
- group: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

To guarantee a specific enrichment tool (`extract_metadata`) runs before others, use:

- [ ] A. `tool_choice: "auto"`.
- [x] B. `tool_choice: {"type": "tool", "name": "extract_metadata"}` (forced selection).
- [ ] C. `tool_choice: "any"`.
- [ ] D. Remove all other tools.

**Explanation:** Forced tool selection ensures the specific tool runs first, before enrichment steps.

**Why not A:** `auto` may not call it.

**Why not C:** `any` forces a call but not that specific tool.

**Why not D:** Removing tools breaks the pipeline.

## D4-Q29

- task: 4.3/4.4
- group: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Source documents sometimes lack a field. How do you design the schema to prevent the model from fabricating a value?

- [ ] A. Remove the field.
- [ ] B. Mark every field required.
- [x] C. Make the field optional/nullable so the model can return null rather than inventing data.
- [ ] D. Set a default fake value.

**Explanation:** Optional/nullable fields let the model return null when info is absent, preventing fabrication to satisfy required fields.

**Why not A:** Removing the field loses legitimate data when present.

**Why not B:** Required fields pressure the model to fabricate.

**Why not D:** A fake default is fabrication.

## D4-Q30

- task: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

For an extensible category field, the guide suggests:

- [ ] A. A required integer code.
- [ ] B. A free-text field only.
- [ ] C. A boolean.
- [x] D. An enum plus an `"other"` value with a detail string for cases outside the enum.

**Explanation:** Enum + `"other"` + detail string handles extensible categorization while keeping structure.

**Why not A:** A required integer code is neither extensible nor descriptive here.

**Why not B:** Free text loses enum consistency.

**Why not C:** A boolean can't represent categories.

## D4-Q31

- task: 4.3/5.5
- group: 4.3
- scenario: 6
- mock: true
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

For ambiguous cases in a classification schema, the guide suggests adding:

- [ ] A. Nothing; force a definite class.
- [x] B. An enum value like `"unclear"` so the model can mark ambiguity instead of guessing.
- [ ] C. A random class.
- [ ] D. A numeric confidence only.

**Explanation:** An `"unclear"` enum value lets the model represent ambiguity rather than forcing a wrong definite answer.

**Why not A:** Forcing a definite class invites errors.

**Why not C:** Random assignment is wrong.

**Why not D:** Confidence alone doesn't capture "unclear" as a category.

## D4-Q32

- task: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

What distinguishes `tool_choice: "auto"` from `"any"` for structured output?

- [ ] A. They are identical.
- [ ] B. `auto` forces a specific tool; `any` returns text.
- [x] C. `auto` may return conversational text instead of calling a tool; `any` requires a tool call (guaranteeing structured output).
- [ ] D. `any` disables tools.

**Explanation:** `auto` permits text; `any` mandates a tool call, guaranteeing structured output.

**Why not A:** They differ.

**Why not B:** Mischaracterizes both.

**Why not D:** `any` enables, not disables, tools.

## D4-Q33

- task: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Why include format-normalization rules in the prompt *alongside* a strict output schema?

- [ ] A. To increase syntax errors.
- [ ] B. Because schemas can't produce JSON.
- [ ] C. To disable the schema.
- [x] D. To handle inconsistent source formatting while the schema guarantees output structure.

**Explanation:** Normalization rules in the prompt handle messy source formatting; the schema enforces output structure, complementary.

**Why not A:** The schema reduces syntax errors.

**Why not B:** Schemas do produce structured JSON.

**Why not C:** They work together, not against.

## D4-Q34

- task: 4.3/4.4
- group: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A tool-use schema guarantees valid JSON, yet a report shows line items that don't sum to the stated total. What does this illustrate?

- [ ] A. The schema is broken and must be removed.
- [x] B. Schemas eliminate syntax errors but not semantic errors; add validation to catch sums that don't reconcile.
- [ ] C. Tool use is unreliable for structure.
- [ ] D. JSON is the wrong format.

**Explanation:** Semantic errors (non-summing totals) survive schema validation; a separate validation step is needed.

**Why not A:** The schema works; semantics are the gap.

**Why not C:** Tool use is reliable for structure specifically.

**Why not D:** Format isn't the issue.

## D4-Q35

- task: 4.3/4.4
- group: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which schema-design choice best prevents "required field" pressure that causes fabrication?

- [ ] A. Using only string types.
- [ ] B. Making all fields required with no null allowed.
- [x] C. Designing fields that may be absent as optional/nullable.
- [ ] D. Removing the schema entirely.

**Explanation:** Optional/nullable fields relieve the pressure to fabricate values for absent data.

**Why not A:** Type choice doesn't address absence.

**Why not B:** All-required invites fabrication.

**Why not D:** Removing the schema loses structure guarantees.

## D4-Q36

- task: 4.3/2.3
- group: 4.3
- scenario: 6
- docs: [Tool use, structured output via JSON schema](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

For an extraction pipeline where a metadata step must always run first and produce structured output, the best configuration is:

- [ ] A. No schema; free-text output.
- [ ] B. `tool_choice: auto` and hope it runs first.
- [ ] C. Prose instruction: "please extract metadata first."
- [x] D. Define the extraction tool with a JSON schema and force it via `tool_choice: {"type":"tool","name":"extract_metadata"}` on the first turn.

**Explanation:** A JSON-schema tool plus forced selection guarantees both the ordering and structured output.

**Why not A:** Free text loses structure guarantees.

**Why not B:** `auto` doesn't guarantee ordering or a call.

**Why not C:** Prose doesn't guarantee execution order.

## D4-Q37

- task: 4.4
- scenario: 6
- mock: true
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A JSON-schema validation fails on an extraction. What is the recommended retry design?

- [ ] A. Retry with the identical prompt and no error details.
- [x] B. Retry-with-error-feedback: send a follow-up including the original document, the failed extraction, and the specific validation errors to guide correction.
- [ ] C. Give up after the first failure.
- [ ] D. Switch to a different document.

**Explanation:** Appending the original document, failed output, and specific validation errors guides the model toward self-correction.

**Why not A:** Identical retries lack the signal to correct.

**Why not C:** One failure isn't a reason to abandon recoverable cases.

**Why not D:** Changing documents doesn't fix the extraction.

## D4-Q38

- task: 4.4
- scenario: 6
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

When are retries *ineffective* for extraction?

- [ ] A. When the output has a JSON structural error.
- [ ] B. When the error is a format mismatch.
- [x] C. When the required information is simply absent from the source document (vs format or structural errors).
- [ ] D. When validation errors are specific.

**Explanation:** If the info isn't in the source, no retry can produce it; retries help with format/structural errors, not missing data.

**Why not A:** Format and structural errors are exactly where retries help.

**Why not B:** Format and structural errors are exactly where retries help.

**Why not D:** Specific errors make retries *more* effective.

## D4-Q39

- task: 4.4
- scenario: 5
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

To analyze *why* developers dismiss certain review findings, what field should structured findings include?

- [ ] A. The reviewer's name.
- [ ] B. A random ID.
- [ ] C. Only the severity.
- [x] D. A `detected_pattern` field recording which code construct triggered the finding, enabling systematic false-positive analysis.

**Explanation:** A `detected_pattern` field links findings to the triggering construct, enabling analysis of dismissal/false-positive patterns.

**Why not A:** Reviewer name isn't the pattern signal.

**Why not B:** A random ID gives no analytic signal.

**Why not C:** Severity alone doesn't reveal the trigger.

## D4-Q40

- task: 4.4/4.3
- group: 4.4
- scenario: 6
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which distinction does the guide draw between semantic validation errors and schema syntax errors?

- [ ] A. Both are eliminated by tool use.
- [x] B. Semantic errors (values don't sum, wrong field placement) require added validation; schema syntax errors are eliminated by tool use.
- [ ] C. Both require added validation.
- [ ] D. Neither can be detected.

**Explanation:** Tool-use schemas remove syntax errors; semantic errors need separate validation logic.

**Why not A:** Semantic errors survive schemas.

**Why not C:** Syntax errors are handled by tool use.

**Why not D:** Both are detectable with the right approach.

## D4-Q41

- task: 4.4
- scenario: 6
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

To flag documents where the stated total doesn't match the line items, the guide suggests a self-correction validation flow that:

- [ ] A. Trusts the stated total always.
- [ ] B. Ignores totals.
- [x] C. Extracts `calculated_total` alongside `stated_total` and flags discrepancies.
- [ ] D. Deletes the total field.

**Explanation:** Extracting both `calculated_total` and `stated_total` lets you flag discrepancies, a semantic self-correction check.

**Why not A:** Ignoring or blindly trusting misses the discrepancy.

**Why not B:** Ignoring or blindly trusting misses the discrepancy.

**Why not D:** Deleting the field removes the check.

## D4-Q42

- task: 4.4/5.6
- group: 4.4
- scenario: 6
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

For inconsistent source data (e.g., a figure stated two different ways), a useful schema addition is:

- [ ] A. A random selection field.
- [ ] B. A required single value that hides the conflict.
- [ ] C. No field; pick one silently.
- [x] D. A `conflict_detected` boolean to surface inconsistent source data.

**Explanation:** A `conflict_detected` boolean surfaces inconsistent source data rather than hiding it.

**Why not A:** Random selection is arbitrary and untraceable.

**Why not B:** Hiding or silently picking loses the conflict signal.

**Why not C:** Hiding or silently picking loses the conflict signal.

## D4-Q43

- task: 4.4
- scenario: 6
- mock: true
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A retry keeps failing because the requested value doesn't exist in the provided document (it's in an external doc you didn't include). What should you conclude?

- [ ] A. Retry more times with the same input.
- [x] B. Retries won't help; the information is absent from the source, provide the correct source or mark the field null.
- [ ] C. The schema is wrong.
- [ ] D. The model is broken.

**Explanation:** When info is absent from the provided source, retries are futile; supply the right document or return null.

**Why not A:** More identical retries won't conjure missing data.

**Why not C:** The schema isn't the problem.

**Why not D:** The model behaves correctly by not fabricating.

## D4-Q44

- task: 4.4
- scenario: 6
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which retry payload maximizes the chance of self-correction?

- [ ] A. Only the validation error code with no document.
- [ ] B. Just "try again."
- [x] C. Original document + failed extraction + specific validation errors.
- [ ] D. A different, unrelated document.

**Explanation:** Including the document, the failed output, and precise errors gives the model everything needed to self-correct.

**Why not A:** Without the document, the model can't recheck.

**Why not B:** No actionable signal.

**Why not D:** Wrong input can't fix the extraction.

## D4-Q45

- task: 4.4
- scenario: 5
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

The purpose of tracking `detected_pattern` across many findings is to:

- [ ] A. Encrypt the findings.
- [ ] B. Speed up the API.
- [ ] C. Replace the severity field.
- [x] D. Enable systematic analysis of which constructs trigger false positives when developers dismiss findings.

**Explanation:** `detected_pattern` supports systematic dismissal/false-positive analysis by construct.

**Why not A:** Not performance or security features.

**Why not B:** Not performance or security features.

**Why not C:** It complements, not replaces, severity.

## D4-Q46

- task: 4.4
- scenario: 6
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which pair is correctly categorized as *retry-recoverable* vs *not*?

- [ ] A. Information absent → recoverable; format mismatch → not recoverable.
- [x] B. Format mismatch → recoverable via retry; information absent from source → not recoverable via retry.
- [ ] C. Both recoverable.
- [ ] D. Both non-recoverable.

**Explanation:** Format/structural errors are retry-recoverable; genuinely missing information is not.

**Why not A:** Reverses recoverability.

**Why not C:** They differ in recoverability.

**Why not D:** They differ in recoverability.

## D4-Q47

- task: 4.4
- scenario: 6
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A validation-retry loop should stop retrying when:

- [ ] A. Never; retry infinitely.
- [ ] B. The first retry succeeds, then keep retrying anyway.
- [x] C. The failure is due to missing source information (retries can't succeed), rather than a fixable format/structure error.
- [ ] D. Only when tokens run out.

**Explanation:** Stop when the cause is unrecoverable (absent info); continue only for fixable format/structure errors.

**Why not A:** Infinite retries waste resources.

**Why not B:** Stop on success, don't keep retrying.

**Why not D:** Token exhaustion is a crude, not principled, stop.

## D4-Q48

- task: 4.4/4.3
- group: 4.4
- scenario: 6
- docs: [Tool use, results, validation & retries](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Adding a `calculated_total` vs `stated_total` check is an example of catching which error class?

- [ ] A. Permission errors.
- [ ] B. JSON syntax errors.
- [ ] C. Network errors.
- [x] D. Semantic errors that strict schemas do not prevent.

**Explanation:** Non-reconciling totals are semantic errors that schemas don't catch, so an explicit check is needed.

**Why not A:** Unrelated error classes.

**Why not B:** Syntax errors are handled by tool use.

**Why not C:** Unrelated error classes.

## D4-Q49

- task: 4.5
- scenario: 6
- mock: true
- official: true
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

Your team wants to cut API costs. Two workflows exist: (1) a blocking pre-merge check developers wait on, and (2) an overnight technical-debt report. Your manager proposes moving both to the Message Batches API for 50% savings. How should you evaluate this?

- [ ] A. Switch both to batch with status polling for completion.
- [x] B. Use batch processing for the technical-debt reports only; keep real-time calls for the pre-merge check.
- [ ] C. Keep real-time for both to avoid batch ordering issues.
- [ ] D. Switch both to batch with a timeout fallback to real-time.

**Explanation:** The Batches API offers 50% savings but processes in up to 24 hours with no latency SLA, unsuitable for blocking pre-merge checks, ideal for overnight jobs. Match each API to its workload. (Mirrors official Sample Question 11.)

**Why not A:** "Often faster" completion isn't acceptable for a blocking workflow.

**Why not C:** A misconception; batch results correlate via `custom_id`, so ordering isn't the blocker, latency is.

**Why not D:** Adds unnecessary complexity when the simpler solution is matching each API to its use case.

## D4-Q50

- task: 4.5
- scenario: 6
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

Which characteristics define the Message Batches API?

- [ ] A. No savings, real-time only.
- [ ] B. 90% savings, instant results, guaranteed SLA.
- [x] C. 50% cost savings, up to 24-hour processing window, no guaranteed latency SLA.
- [ ] D. Free, unlimited, synchronous.

**Explanation:** The guide states 50% savings, up-to-24-hour window, and no latency SLA.

**Why not A:** None matches the stated characteristics.

**Why not B:** None matches the stated characteristics.

**Why not D:** None matches the stated characteristics.

## D4-Q51

- task: 4.5
- scenario: 6
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

Which workload is *appropriate* for batch processing?

- [ ] A. A real-time fraud block.
- [ ] B. A blocking pre-merge check.
- [ ] C. An interactive chat.
- [x] D. Overnight reports, weekly audits, nightly test generation (non-blocking, latency-tolerant).

**Explanation:** Non-blocking, latency-tolerant jobs (overnight/weekly/nightly) suit batch processing.

**Why not A:** All are blocking/latency-sensitive, unsuitable for batch.

**Why not B:** All are blocking/latency-sensitive, unsuitable for batch.

**Why not C:** All are blocking/latency-sensitive, unsuitable for batch.

## D4-Q52

- task: 4.5
- scenario: 6
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

How do you correlate batch responses back to their requests?

- [ ] A. By response arrival order only.
- [x] B. Using `custom_id` fields on each request/response pair.
- [ ] C. By timestamp only.
- [ ] D. You cannot correlate them.

**Explanation:** `custom_id` fields correlate batch request/response pairs regardless of arrival order.

**Why not A:** Order and timestamp aren't reliable correlators.

**Why not C:** Order and timestamp aren't reliable correlators.

**Why not D:** Correlation is possible via `custom_id`.

## D4-Q53

- task: 4.5
- scenario: 6
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

A limitation of the batch API relevant to agentic workflows is:

- [ ] A. It has no cost savings.
- [ ] B. It cannot process more than one document.
- [x] C. It does not support multi-turn tool calling within a single request (can't execute tools mid-request and return results).
- [ ] D. It requires interactive input.

**Explanation:** The batch API doesn't support multi-turn tool calling within a single request.

**Why not A:** It offers 50% savings.

**Why not B:** It handles many documents.

**Why not D:** It's non-interactive by design.

## D4-Q54

- task: 4.5
- scenario: 6
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

Some documents in a 100-document batch fail (e.g., exceeded context limits). What's the recommended handling?

- [ ] A. Ignore the failures.
- [ ] B. Resubmit the entire batch unchanged.
- [ ] C. Discard the whole batch.
- [x] D. Resubmit only the failed documents (identified by `custom_id`) with appropriate modifications, e.g., chunking oversized ones.

**Explanation:** Resubmit only failed docs (via `custom_id`) with fixes like chunking, efficient failure handling.

**Why not A:** Ignoring failures loses those documents' results.

**Why not B:** Resubmitting everything wastes cost and repeats successes.

**Why not C:** Discarding loses completed work.

## D4-Q55

- task: 4.5
- scenario: 6
- mock: true
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

You must guarantee a 30-hour SLA using 24-hour batch processing. How do you calculate submission frequency?

- [ ] A. Submit once per week.
- [x] B. Submit in windows (e.g., every 4 hours) so worst-case 24-hour processing still meets the 30-hour SLA.
- [ ] C. Submit only when convenient.
- [ ] D. Batch can never meet any SLA.

**Explanation:** Calculating batch submission frequency against SLA constraints (e.g., 4-hour windows) ensures the 24-hour processing stays within a 30-hour SLA.

**Why not A:** Weekly submission can't guarantee a 30-hour SLA.

**Why not C:** Ad hoc timing doesn't guarantee SLAs.

**Why not D:** Batch *can* meet latency-tolerant SLAs with planning.

## D4-Q56

- task: 4.5
- scenario: 6
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

Before batch-processing a large volume, what does the guide recommend to maximize first-pass success?

- [ ] A. Skip refinement entirely.
- [ ] B. Submit everything blind and fix later.
- [x] C. Use prompt refinement on a sample set first to maximize first-pass success and reduce iterative resubmission costs.
- [ ] D. Use real-time for the whole volume.

**Explanation:** Refining prompts on a sample before the full batch maximizes first-pass success and cuts resubmission costs.

**Why not A:** Skipping refinement forgoes the savings.

**Why not B:** Blind submission raises failure/resubmission costs.

**Why not D:** Real-time for everything defeats the cost goal.

## D4-Q57

- task: 4.5
- scenario: 5
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

Why is the batch API inappropriate for a pre-merge check specifically?

- [ ] A. Batch can't read code.
- [ ] B. Pre-merge checks can't be expressed as prompts.
- [ ] C. Batch is more expensive.
- [x] D. Pre-merge checks are blocking, developers wait, and batch has no latency SLA (up to 24 hours).

**Explanation:** Blocking workflows can't tolerate batch's up-to-24-hour, no-SLA latency.

**Why not A:** Batch can process code; latency is the issue.

**Why not B:** They can be expressed as prompts.

**Why not C:** Batch is cheaper, not more expensive.

## D4-Q58

- task: 4.5
- scenario: 5
- docs: [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

The claim "we should switch the blocking check to batch because batches are often faster than 24 hours" is flawed because:

- [ ] A. Batches are always exactly 24 hours.
- [x] B. "Often faster" isn't a guarantee; a blocking workflow needs a latency guarantee the batch API doesn't provide.
- [ ] C. Blocking workflows don't care about latency.
- [ ] D. Batch has a strict SLA.

**Explanation:** Relying on "often faster" is unacceptable for blocking work that requires a latency guarantee.

**Why not A:** Processing varies up to 24 hours.

**Why not C:** Blocking workflows are latency-sensitive.

**Why not D:** Batch explicitly has no guaranteed SLA.

## D4-Q59

- task: 4.6
- scenario: 5
- official: true
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

A PR modifies 14 files. A single-pass review analyzing all files together gives inconsistent depth, misses obvious bugs, and produces contradictory feedback (flagging a pattern in one file, approving identical code elsewhere). How should you restructure the review?

- [ ] A. Switch to a higher-tier model with a larger context window to fit all 14 files in one pass.
- [ ] B. Require developers to split large PRs into 3-4 file submissions.
- [x] C. Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow.
- [ ] D. Run three independent passes on the full PR and only flag issues appearing in at least two runs.

**Explanation:** Splitting into focused passes addresses the root cause, attention dilution across many files. Per-file passes ensure consistent depth; a separate integration pass catches cross-file issues. (Mirrors official Sample Question 12.)

**Why not A:** Larger context windows don't solve attention-quality dilution.

**Why not B:** Shifts burden to developers without improving the review system.

**Why not D:** Consensus voting would suppress real bugs that are only caught intermittently.

## D4-Q60

- task: 4.6/3.6
- group: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Why is a *second independent* Claude instance often better at catching issues than asking the generating instance to review its own code?

- [ ] A. There's no real difference.
- [ ] B. Independent instances are always cheaper.
- [ ] C. The generator cannot produce review text.
- [x] D. The generator retains its reasoning context, making it less likely to question its own decisions; an independent instance lacks that bias.

**Explanation:** Self-review is limited because the model retains generation reasoning; an independent instance reviews without that bias and catches more.

**Why not A:** There is a meaningful effectiveness difference.

**Why not B:** Effectiveness, not cost, is the reason.

**Why not C:** The generator can produce text; bias is the issue.

## D4-Q61

- task: 4.6
- scenario: 5
- mock: true
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Multi-pass review splits large reviews into which two kinds of passes?

- [ ] A. Two identical full passes.
- [x] B. Per-file local analysis passes plus cross-file integration passes.
- [ ] C. A syntax pass and a spelling pass only.
- [ ] D. A random pass and a final pass.

**Explanation:** The pattern is per-file local passes + cross-file integration passes, avoiding attention dilution and contradictions.

**Why not A:** Identical passes don't address dilution.

**Why not C:** Too narrow.

**Why not D:** Random isn't a defined pass type.

## D4-Q62

- task: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Why does a larger context window *not* solve the 14-file review inconsistency?

- [ ] A. It does solve it completely.
- [ ] B. Larger context windows corrupt files.
- [x] C. The problem is attention dilution/quality across many files, which more context capacity doesn't fix.
- [ ] D. Larger windows disable review.

**Explanation:** Fitting everything in context doesn't cure attention dilution; focused passes do.

**Why not A:** It doesn't solve the dilution.

**Why not B:** No corruption occurs.

**Why not D:** It doesn't disable review.

## D4-Q63

- task: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Why is "flag only issues that appear in ≥2 of 3 identical full-PR runs" a poor design?

- [ ] A. It's identical to per-file passes.
- [ ] B. It's too fast.
- [ ] C. It always finds more bugs.
- [x] D. It suppresses real bugs that are only caught intermittently, requiring consensus for genuine issues.

**Explanation:** Consensus voting across identical passes hides real bugs caught in only one run.

**Why not A:** It's not the per-file/integration split.

**Why not B:** Speed isn't the flaw.

**Why not C:** It finds fewer, by suppressing single-run catches.

## D4-Q64

- task: 4.6/5.5
- group: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Running a verification pass where the model self-reports confidence alongside each finding enables:

- [ ] A. Elimination of all human review.
- [x] B. Calibrated review routing (e.g., routing low-confidence findings for closer inspection).
- [ ] C. Guaranteed correctness.
- [ ] D. Faster JSON parsing.

**Explanation:** Self-reported confidence per finding supports calibrated routing of review attention.

**Why not A:** It informs, not eliminates, human review.

**Why not C:** Confidence doesn't guarantee correctness.

**Why not D:** Unrelated to parsing.

## D4-Q65

- task: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Self-review limitations arise primarily because:

- [ ] A. Self-review uses more tokens than any alternative.
- [ ] B. Models can't read their own output.
- [x] C. A model retains reasoning context from generation, making it less likely to question its own decisions in the same session.
- [ ] D. Self-review is disabled by default.

**Explanation:** Retained generation reasoning biases the model against catching its own issues.

**Why not A:** Token usage isn't the limitation.

**Why not B:** Models can read their output; bias is the issue.

**Why not D:** It isn't a default-disabled feature.

## D4-Q66

- task: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

For a large multi-file review, the integration-focused pass specifically targets:

- [ ] A. Nothing; it's redundant.
- [ ] B. Spelling only.
- [ ] C. Single-line lint within one file.
- [x] D. Cross-file data-flow issues that per-file passes can't see.

**Explanation:** The integration pass examines cross-file data flow, complementing per-file local analysis.

**Why not A:** It's essential, not redundant.

**Why not B:** Those are local concerns handled per file.

**Why not C:** Those are local concerns handled per file.

## D4-Q67

- task: 4.6
- scenario: 5
- mock: true
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Contradictory findings (flagging a pattern in one file, approving it in another within one PR) are a symptom of:

- [ ] A. A network outage.
- [x] B. Attention dilution in a single combined pass, fixed by focused per-file passes.
- [ ] C. Too small a model only.
- [ ] D. Correct, expected behavior.

**Explanation:** Contradictions across identical code signal attention dilution; focused passes fix it.

**Why not A:** Not a network issue.

**Why not C:** Model size isn't the described cause.

**Why not D:** Contradictions are a defect, not expected.

## D4-Q68

- task: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Which combination best improves review quality on a complex PR?

- [ ] A. One giant single pass with a bigger model.
- [ ] B. Self-review only, in the generating session.
- [x] C. An independent review instance + multi-pass (per-file local + cross-file integration) + confidence-annotated verification for routing.
- [ ] D. Consensus voting across identical full passes.

**Explanation:** Combining independence, multi-pass structure, and calibrated confidence routing addresses bias, dilution, and attention allocation together.

**Why not A:** Bigger single pass still dilutes attention.

**Why not B:** Self-review retains bias.

**Why not D:** Consensus voting suppresses intermittently-caught bugs.

## D4-Q69

- task: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

The purpose of splitting per-file passes from the integration pass is to:

- [ ] A. Make review non-deterministic.
- [ ] B. Increase total token cost as a goal.
- [ ] C. Skip cross-file analysis.
- [x] D. Keep local analysis consistent and deep, while a dedicated pass handles cross-file concerns, avoiding dilution and contradictions.

**Explanation:** The split preserves per-file depth and separately handles cross-file logic.

**Why not A:** The goal is consistency, not randomness.

**Why not B:** Cost isn't the objective.

**Why not C:** Cross-file analysis is explicitly included.

## D4-Q70

- task: 4.6/3.6
- group: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

An independent review instance should still receive which project context to be effective?

- [ ] A. The full generation reasoning chain, to bias it.
- [x] B. Project standards/criteria via CLAUDE.md, without the generator's step-by-step reasoning.
- [ ] C. Nothing at all.
- [ ] D. Only the file names.

**Explanation:** Independence means lacking the *generator's reasoning*, not lacking project context, CLAUDE.md standards still help.

**Why not A:** Injecting generation reasoning reintroduces the bias.

**Why not C:** No context makes review less grounded.

**Why not D:** File names alone are insufficient.

## D4-Q71

- task: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

For a 40-file PR, which review architecture best balances depth and cross-file correctness?

- [ ] A. Three identical full passes with majority voting.
- [ ] B. One combined pass over all 40 files.
- [x] C. Per-file focused passes for local issues, then a separate integration pass for data flow across files.
- [ ] D. Skip review for large PRs.

**Explanation:** The per-file + integration split scales to many files without diluting attention.

**Why not A:** Voting suppresses single-run catches.

**Why not B:** Combined pass dilutes attention.

**Why not D:** Skipping review is unacceptable.

## D4-Q72

- task: 4.6/5.5
- group: 4.6
- scenario: 5
- docs: [Common workflows, multi-pass / independent review](https://code.claude.com/docs/en/common-workflows)

Verification passes that annotate each finding with confidence primarily support:

- [ ] A. Faster batch processing.
- [ ] B. Automatic deletion of low-confidence findings.
- [ ] C. Guaranteeing zero false positives.
- [x] D. Calibrated routing, sending low-confidence or ambiguous findings for additional (possibly human) scrutiny.

**Explanation:** Confidence annotations enable calibrated routing of review attention, not blind deletion or guarantees.

**Why not A:** Unrelated to batch speed.

**Why not B:** Low confidence warrants scrutiny, not silent deletion.

**Why not C:** Confidence doesn't guarantee zero false positives.
