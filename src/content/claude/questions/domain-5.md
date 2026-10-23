---
domain: 5
name: Context Management & Reliability
weight: 15%
---

<!--
  Domain 5 question bank. Edit freely, then run `pnpm claude:build` (also runs on dev/build).
  Format guide: see src/content/claude/README.md
-->

# Task statements

### 5.1 Manage conversation context to preserve critical information across long interactions

Progressive-summarization risk (condensing numbers/dates/expectations); "lost in the middle"; tool results consume tokens disproportionately (40+ fields when 5 matter); pass complete history in subsequent requests; persistent "case facts" block; trim verbose tool outputs before they accumulate.

Docs: https://code.claude.com/docs/en/memory

### 5.2 Design effective escalation and ambiguity-resolution patterns

Escalation triggers: explicit customer request for a human, policy gaps/exceptions, inability to progress; escalate-on-demand vs offer-to-resolve when straightforward; sentiment and self-reported confidence are unreliable proxies for complexity; multiple matches → request clarification, not heuristics.

Docs: https://code.claude.com/docs/en/sub-agents

### 5.3 Implement error-propagation strategies across multi-agent systems

Structured error context (failure type, attempted query, partial results, alternatives) enables coordinator recovery; access failures vs valid empty results; generic statuses hide context; silently suppressing errors or terminating whole workflows on one failure are anti-patterns.

Docs: https://code.claude.com/docs/en/sub-agents

### 5.4 Manage context effectively in large codebase exploration

Context degradation in extended sessions (referencing "typical patterns" not specific classes); scratchpad files persist findings; subagent delegation isolates verbose exploration; structured state persistence + manifests for crash recovery; `/compact` to reduce context usage.

Docs: https://code.claude.com/docs/en/common-workflows

### 5.5 Design human-review workflows and confidence calibration

Aggregate accuracy can mask weak segments; stratified random sampling of high-confidence extractions; field-level confidence calibrated with labeled validation sets; validate accuracy by document type/field before automating; route low-confidence/ambiguous items to humans.

Docs: https://code.claude.com/docs/en/common-workflows

### 5.6 Preserve information provenance and handle uncertainty in multi-source synthesis

Attribution lost during summarization; structured claim-source mappings preserved through synthesis; annotate conflicting statistics with source attribution (don't arbitrarily pick); require publication/collection dates to avoid misreading temporal differences as contradictions; render content types appropriately (financial as tables, news as prose).

Docs: https://code.claude.com/docs/en/sub-agents

# Questions

## D5-Q01

- task: 5.1
- scenario: 1
- mock: true
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

In a long support conversation, progressive summarization is condensing exact figures ("$47.50 refund," "ordered March 3") into vague phrases ("a refund," "recently"). What is the risk, and the recommended mitigation?

- [ ] A. Risk: too many tokens; mitigation: summarize more aggressively.
- [x] B. Risk: loss of precise transactional facts; mitigation: extract facts (amounts, dates, order numbers, statuses) into a persistent "case facts" block included in each prompt, outside the summarized history.
- [ ] C. Risk: the model is too slow; mitigation: switch models.
- [ ] D. There is no risk; summaries are always safe.

**Explanation:** Progressive summarization risks condensing numbers, dates, and expectations into vague summaries; extracting them into a persistent case-facts block preserves precision.

**Why not A:** More aggressive summarization worsens the loss.

**Why not C:** Speed isn't the issue.

**Why not D:** The loss of precise facts is a real, documented risk.

## D5-Q02

- task: 5.1
- scenario: 6
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

The "lost in the middle" effect means:

- [ ] A. Models process the middle best.
- [ ] B. Models always ignore the first token.
- [x] C. Models reliably process the beginning and end of long inputs but may omit findings from middle sections.
- [ ] D. Models can't read long inputs at all.

**Explanation:** Models reliably handle the start and end of long inputs but may miss the middle, the lost-in-the-middle effect.

**Why not A:** Mischaracterize the effect.

**Why not B:** Mischaracterize the effect.

**Why not D:** Long inputs are processed, just unevenly.

## D5-Q03

- task: 5.1
- scenario: 1
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

A tool returns 40+ fields per order lookup when only 5 are relevant. Over a long session this bloats context. What's the fix?

- [ ] A. Increase the context window and change nothing else.
- [ ] B. Keep all 40 fields to be safe.
- [ ] C. Summarize the entire conversation each turn.
- [x] D. Trim verbose tool outputs to only the relevant fields before they accumulate in context.

**Explanation:** Trimming verbose tool outputs to the return-relevant fields prevents disproportionate token consumption.

**Why not A:** A bigger window doesn't stop the ongoing bloat.

**Why not B:** Keeping all fields is the problem.

**Why not C:** Summarizing everything risks losing precise facts.

## D5-Q04

- task: 5.1
- scenario: 3
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

To mitigate lost-in-the-middle when aggregating many inputs, the guide recommends:

- [ ] A. Burying key findings in the middle.
- [x] B. Placing key findings at the beginning and organizing detailed results with explicit section headers.
- [ ] C. Removing all headers.
- [ ] D. Randomizing section order.

**Explanation:** Placing key summaries at the start and using explicit section headers mitigates position effects.

**Why not A:** The middle is the weak spot.

**Why not C:** Headers aid navigation and reliability.

**Why not D:** Randomizing worsens findability.

## D5-Q05

- task: 5.1
- scenario: 1
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

Why must you pass complete conversation history in subsequent API requests?

- [ ] A. Because history is optional and cosmetic.
- [ ] B. Because the API charges less for longer inputs.
- [x] C. To maintain conversational coherence; the model is stateless per request and needs the history to reason consistently.
- [ ] D. To disable tools.

**Explanation:** Passing complete history maintains conversational coherence across turns.

**Why not A:** History is functionally necessary, not cosmetic.

**Why not B:** Longer inputs don't cost less.

**Why not D:** Unrelated to tools.

## D5-Q06

- task: 5.1
- scenario: 1
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

For a multi-issue support session, where should structured issue data (order IDs, amounts, statuses) live?

- [ ] A. In `.mcp.json`.
- [ ] B. Only in the first message, then dropped.
- [ ] C. In the model's imagination.
- [x] D. In a separate persistent context layer, extracted and maintained across turns.

**Explanation:** Extracting and persisting structured issue data into a separate context layer supports multi-issue sessions.

**Why not A:** `.mcp.json` is server config.

**Why not B:** Dropping it loses needed facts later.

**Why not C:** The model can't retain state without it in context.

## D5-Q07

- task: 5.1
- scenario: 1
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

Which best describes a "case facts" block?

- [ ] A. A one-time greeting.
- [x] B. A persistent block of transactional facts (amounts, dates, order numbers, statuses) included in each prompt, kept outside the summarized history.
- [ ] C. A random cache.
- [ ] D. A list of tools.

**Explanation:** The case-facts block persists precise transactional facts in each prompt, protected from summarization.

**Why not A:** None matches the defined purpose.

**Why not C:** None matches the defined purpose.

**Why not D:** None matches the defined purpose.

## D5-Q08

- task: 5.1/5.6
- group: 5.1
- scenario: 3
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

A downstream synthesis agent has a limited context budget. What should upstream agents return to help?

- [ ] A. Nothing.
- [ ] B. Their entire raw reasoning transcript.
- [x] C. Structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains.
- [ ] D. Only emojis.

**Explanation:** Returning structured key facts/citations/relevance scores (not verbose reasoning) fits downstream context budgets.

**Why not A:** No data leaves synthesis blind.

**Why not B:** Verbose transcripts blow the budget.

**Why not D:** Not usable data.

## D5-Q09

- task: 5.1
- scenario: 1
- mock: true
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

Why do tool results consume tokens "disproportionately to their relevance"?

- [ ] A. Tool results are free of tokens.
- [ ] B. Tools return encrypted blobs.
- [ ] C. Tools always return one field.
- [x] D. Tools often return many fields (e.g., 40+) when only a few matter, so raw results bloat context relative to their usefulness.

**Explanation:** Verbose tool payloads carry many irrelevant fields, consuming tokens out of proportion to relevance.

**Why not A:** Tool results do consume tokens.

**Why not B:** Mischaracterize tool output.

**Why not C:** Mischaracterize tool output.

## D5-Q10

- task: 5.1/5.6
- group: 5.1
- scenario: 3
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

To support accurate downstream synthesis, subagents should include which metadata in their structured outputs?

- [ ] A. Only a single number.
- [x] B. Dates, source locations, and methodological context.
- [ ] C. No metadata.
- [ ] D. The developer's name.

**Explanation:** Including dates, source locations, and methodological context supports accurate downstream synthesis.

**Why not A:** Insufficient metadata undermines synthesis.

**Why not C:** Insufficient metadata undermines synthesis.

**Why not D:** Irrelevant metadata.

## D5-Q11

- task: 5.1
- scenario: 1
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

A long conversation is at risk of losing a customer's stated expectation ("wants delivery before Friday"). Best practice?

- [ ] A. Summarize it into "wants delivery soon."
- [ ] B. Assume the model remembers it.
- [x] C. Persist it as a fact in the case-facts block so summarization can't dilute it.
- [ ] D. Delete it to save tokens.

**Explanation:** Customer-stated expectations are precisely what progressive summarization dilutes; persist them in the case-facts block.

**Why not A:** "Soon" loses the Friday deadline.

**Why not B:** The model won't reliably retain it under summarization.

**Why not D:** Deleting loses a commitment-relevant fact.

## D5-Q12

- task: 5.1
- scenario: 1
- docs: [Memory & context management](https://code.claude.com/docs/en/memory)

Which combination best manages context in a long, multi-issue support session?

- [ ] A. Restart the conversation each turn.
- [ ] B. Summarize aggressively and hope facts survive.
- [ ] C. Keep every raw tool payload forever.
- [x] D. Persist a case-facts block, keep a separate structured issue-data layer, and trim verbose tool outputs before they accumulate.

**Explanation:** Case-facts persistence + structured issue layer + output trimming together preserve precision and control token growth.

**Why not A:** Restarting loses continuity.

**Why not B:** Aggressive summarization dilutes facts.

**Why not C:** Raw payloads bloat context.

## D5-Q13

- task: 5.2
- scenario: 1
- official: true
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

Your support agent achieves 55% first-contact resolution vs an 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while trying to autonomously handle complex policy-exception cases. What most improves escalation calibration?

- [ ] A. Have the agent self-report a confidence score (1-10) and auto-route below a threshold.
- [x] B. Add explicit escalation criteria to the system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously.
- [ ] C. Deploy a separate classifier model trained on historical tickets to predict escalation.
- [ ] D. Implement sentiment analysis to escalate when negative sentiment exceeds a threshold.

**Explanation:** The root cause is unclear decision boundaries; explicit escalation criteria with few-shot examples is the proportionate first response. (Mirrors official Sample Question 3.)

**Why not A:** LLM self-reported confidence is poorly calibrated, the agent is already wrongly confident on hard cases.

**Why not C:** Over-engineered; requires labeled data and ML infrastructure before prompt optimization is even tried.

**Why not D:** Sentiment doesn't correlate with case complexity, the actual issue.

## D5-Q14

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

Which are appropriate escalation triggers per the guide?

- [ ] A. The model's temperature is high.
- [ ] B. The customer used more than 50 words.
- [x] C. A customer explicitly requests a human, a policy exception/gap applies, or the agent cannot make meaningful progress.
- [ ] D. It is after 5 PM.

**Explanation:** Explicit human request, policy gap/exception, and inability to progress are the appropriate triggers.

**Why not A:** None reflects genuine escalation triggers.

**Why not B:** None reflects genuine escalation triggers.

**Why not D:** None reflects genuine escalation triggers.

## D5-Q15

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

A customer explicitly demands a human agent for a simple, resolvable question. What should the agent do?

- [ ] A. Ask three clarifying questions first.
- [ ] B. Refuse and resolve it anyway.
- [ ] C. Ignore the request.
- [x] D. Honor the explicit request for a human immediately, without first attempting investigation.

**Explanation:** Explicit customer requests for a human should be honored immediately, without first attempting investigation.

**Why not A:** Stalling with questions disregards the explicit demand.

**Why not B:** Overriding or ignoring the explicit request is wrong.

**Why not C:** Overriding or ignoring the explicit request is wrong.

## D5-Q16

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

For a straightforward, in-scope issue where the customer is frustrated but hasn't demanded a human, the guide recommends:

- [ ] A. Escalate immediately on any frustration.
- [x] B. Acknowledge the frustration while offering resolution, escalating only if the customer reiterates the preference for a human.
- [ ] C. Ignore the frustration entirely.
- [ ] D. Auto-escalate on negative sentiment.

**Explanation:** Acknowledge frustration and offer to resolve when within capability; escalate only if the customer reiterates.

**Why not A:** Sentiment-triggered escalation is unreliable and premature.

**Why not C:** Ignoring frustration harms the interaction.

**Why not D:** Sentiment-triggered escalation is unreliable and premature.

## D5-Q17

- task: 5.2
- scenario: 1
- mock: true
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

Policy addresses own-site price adjustments but is silent on competitor price matching, which the customer requests. Correct handling?

- [ ] A. Deny without explanation.
- [ ] B. Invent a competitor-matching policy and apply it.
- [x] C. Escalate, because policy is ambiguous/silent on the customer's specific request.
- [ ] D. Ignore the request.

**Explanation:** Escalate when policy is ambiguous or silent on the specific request (e.g., competitor matching not covered).

**Why not A:** Denying/ignoring without basis fails the customer and the policy-gap escalation rule.

**Why not B:** Fabricating policy is unsafe and unauthorized.

**Why not D:** Denying/ignoring without basis fails the customer and the policy-gap escalation rule.

## D5-Q18

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

Why are sentiment-based escalation and self-reported confidence unreliable proxies for case complexity?

- [ ] A. They are required by the API.
- [ ] B. They are always perfectly accurate.
- [ ] C. They require no configuration.
- [x] D. They don't correlate with actual complexity; an agent can be confidently wrong on hard cases and calm on complex ones.

**Explanation:** Neither sentiment nor self-reported confidence tracks true complexity, so both are poor escalation proxies.

**Why not A:** Not the point; reliability is.

**Why not B:** They're specifically unreliable.

**Why not C:** Not the point; reliability is.

## D5-Q19

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

A tool returns multiple customer matches for a lookup. What should the agent do?

- [ ] A. Pick the first match.
- [x] B. Ask for additional identifiers to clarify, rather than selecting a match by heuristic.
- [ ] C. Pick a random match.
- [ ] D. Escalate every multi-match case to a human immediately.

**Explanation:** Multiple matches require clarification (request additional identifiers), not heuristic selection.

**Why not A:** Heuristic/random selection risks acting on the wrong account.

**Why not C:** Heuristic/random selection risks acting on the wrong account.

**Why not D:** Immediate escalation isn't required if clarification can resolve it.

## D5-Q20

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

The distinction between "escalate immediately" and "offer to resolve" hinges on:

- [ ] A. The message length.
- [ ] B. The time of day.
- [x] C. Whether the customer explicitly demands a human (escalate) versus the issue being straightforward and within capability (offer to resolve).
- [ ] D. The model version.

**Explanation:** Explicit human demand → escalate; straightforward and in-capability → offer to resolve.

**Why not A:** None is the actual criterion.

**Why not B:** None is the actual criterion.

**Why not D:** None is the actual criterion.

## D5-Q21

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

How should explicit escalation criteria be conveyed to the agent most effectively?

- [ ] A. Not at all; let the model guess.
- [ ] B. As a single vague sentence: "escalate when needed."
- [ ] C. Via sentiment thresholds only.
- [x] D. As explicit criteria plus few-shot examples in the system prompt demonstrating escalate-vs-resolve decisions.

**Explanation:** Explicit criteria with few-shot examples teach the escalate-vs-resolve boundary effectively.

**Why not A:** Guessing yields miscalibration.

**Why not B:** Vague guidance leaves the boundary unclear.

**Why not C:** Sentiment isn't a reliable trigger.

## D5-Q22

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

An agent is over-escalating simple cases and under-escalating complex ones. The best *first* intervention is:

- [ ] A. Immediately build a trained classifier.
- [x] B. Improve the prompt's escalation criteria and add few-shot examples before adding classifiers or ML.
- [ ] C. Add sentiment analysis.
- [ ] D. Raise the escalation threshold arbitrarily.

**Explanation:** Prompt-level criteria and examples are the proportionate first fix for miscalibrated escalation.

**Why not A:** Premature infrastructure before trying prompt optimization.

**Why not C:** Sentiment doesn't track complexity.

**Why not D:** Arbitrary thresholds don't fix the boundary.

## D5-Q23

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

When a customer reiterates a preference for a human after being offered resolution, the agent should:

- [ ] A. End the conversation.
- [ ] B. Keep insisting on resolving autonomously.
- [x] C. Escalate, honoring the reiterated preference.
- [ ] D. Ignore the reiteration.

**Explanation:** Escalate once the customer reiterates the preference for a human, even if you first offered to resolve.

**Why not A:** Ending or ignoring fails the customer.

**Why not B:** Insisting overrides the customer's clear preference.

**Why not D:** Ending or ignoring fails the customer.

## D5-Q24

- task: 5.2
- scenario: 1
- docs: [Subagents, escalation & reliability](https://code.claude.com/docs/en/sub-agents)

Which reflects correct ambiguity handling when identifiers are insufficient?

- [ ] A. Merge all matches into one.
- [ ] B. Always pick the highest account ID.
- [ ] C. Escalate without attempting clarification.
- [x] D. Instruct the agent to ask for additional identifiers when tool results return multiple matches, rather than choosing by heuristic.

**Explanation:** Asking for additional identifiers resolves multi-match ambiguity safely.

**Why not A:** Merging accounts is dangerous.

**Why not B:** Heuristic selection risks the wrong account.

**Why not C:** Clarification is preferable before escalation.

## D5-Q25

- task: 5.3
- scenario: 3
- mock: true
- official: true
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

A web-search subagent times out on a complex topic. Which error-propagation approach best enables intelligent coordinator recovery?

- [ ] A. Implement retry with exponential backoff inside the subagent, returning a generic "search unavailable" only after retries are exhausted.
- [x] B. Return structured error context to the coordinator: failure type, the attempted query, any partial results, and potential alternative approaches.
- [ ] C. Catch the timeout and return an empty result set marked as successful.
- [ ] D. Propagate the timeout exception to a top-level handler that terminates the entire research workflow.

**Explanation:** Structured error context gives the coordinator what it needs to retry with a modified query, try an alternative, or proceed with partial results. (Mirrors official Sample Question 8.)

**Why not A:** A generic status hides valuable context, preventing informed recovery decisions.

**Why not C:** Marking failure as success suppresses the error and risks incomplete outputs.

**Why not D:** Terminating the whole workflow is unnecessary when recovery could succeed.

## D5-Q26

- task: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

Why is returning a generic "search unavailable" status an anti-pattern?

- [ ] A. It is too specific.
- [ ] B. It uses too many tokens.
- [x] C. Generic statuses hide valuable context (failure type, attempted query, partial results) from the coordinator, preventing recovery.
- [ ] D. It always crashes the coordinator.

**Explanation:** Generic statuses strip the context the coordinator needs to make good recovery decisions.

**Why not A:** It's too vague, not too specific.

**Why not B:** Generic strings are short, not token-heavy.

**Why not D:** It doesn't crash the coordinator; it starves it of context.

## D5-Q27

- task: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

Silently suppressing errors by returning empty results as success is problematic because:

- [ ] A. It doubles latency.
- [ ] B. It is too transparent.
- [ ] C. It always escalates unnecessarily.
- [x] D. It prevents any recovery and risks incomplete research outputs presented as complete.

**Explanation:** Marking failures as successful empties hides the problem and yields silently-incomplete outputs.

**Why not A:** Latency isn't the core issue.

**Why not B:** It's the opposite of transparent.

**Why not C:** It suppresses rather than escalates.

## D5-Q28

- task: 5.3/2.2
- group: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

How should the system distinguish an access failure from a valid empty result?

- [ ] A. Treat both as success.
- [x] B. Report them differently: a timeout/access failure needs a retry decision, while a valid empty result is a successful query with no matches.
- [ ] C. Treat both as errors.
- [ ] D. Ignore both.

**Explanation:** Access failures (need retry) must be distinguished from valid empty results (successful, no matches) so the coordinator decides correctly.

**Why not A:** Treating a failure as success hides it.

**Why not C:** Treating a valid empty as an error causes false retries/escalations.

**Why not D:** Ignoring loses information either way.

## D5-Q29

- task: 5.3/2.2
- group: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

For a transient failure on a non-critical lookup, a subagent should:

- [ ] A. Return a generic failure with no context.
- [ ] B. Immediately terminate the whole workflow.
- [x] C. Attempt local recovery and only propagate errors it cannot resolve, including what was attempted and partial results.
- [ ] D. Mark it as success.

**Explanation:** Subagents recover locally from transient failures and propagate only unrecoverable errors with attempt/partial-result context.

**Why not A:** Generic failures hide context.

**Why not B:** Terminating everything on a transient failure is an anti-pattern.

**Why not D:** Marking as success corrupts results.

## D5-Q30

- task: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

Structured error context that enables coordinator recovery includes which elements?

- [ ] A. The developer's email.
- [ ] B. Only a boolean "failed."
- [ ] C. Only the timestamp.
- [x] D. Failure type, what was attempted, partial results, and potential alternatives.

**Explanation:** Those four elements (type, attempt, partial results, alternatives) enable intelligent recovery.

**Why not A:** None provides enough for recovery decisions.

**Why not B:** None provides enough for recovery decisions.

**Why not C:** None provides enough for recovery decisions.

## D5-Q31

- task: 5.3/5.6
- group: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

When some topic areas can't be covered due to unavailable sources, how should synthesis output represent this?

- [ ] A. By omitting any mention of gaps.
- [x] B. With coverage annotations indicating which findings are well-supported versus which areas have gaps.
- [ ] C. By fabricating content to fill the gaps.
- [ ] D. By terminating the report.

**Explanation:** Coverage annotations mark well-supported findings vs gap areas due to unavailable sources.

**Why not A:** Hiding gaps misleads readers.

**Why not C:** Fabrication is a correctness violation.

**Why not D:** Terminating discards valid partial results.

## D5-Q32

- task: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

Terminating an entire multi-agent workflow because one subagent failed is an anti-pattern because:

- [ ] A. It always loses billing data.
- [ ] B. Termination is too slow.
- [x] C. Recovery strategies (retry with modified query, alternative approach, proceed with partial results) could have succeeded.
- [ ] D. It is required by MCP.

**Explanation:** Single-failure termination forecloses recovery paths that could have salvaged the task.

**Why not A:** Not about billing.

**Why not B:** Speed isn't the issue.

**Why not D:** MCP doesn't require it.

## D5-Q33

- task: 5.3
- scenario: 3
- mock: true
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

A subagent returns partial results plus an unrecoverable error. The coordinator should:

- [ ] A. Ignore the error metadata.
- [ ] B. Discard the partial results and terminate.
- [ ] C. Treat the partial results as complete.
- [x] D. Use the structured context (attempt, partial results, alternatives) to decide whether to retry, try an alternative, or proceed with partial results and annotate gaps.

**Explanation:** The coordinator leverages structured context to choose the best recovery, possibly proceeding with annotated partial results.

**Why not A:** Ignoring metadata forfeits recovery guidance.

**Why not B:** Discarding partial results wastes usable work.

**Why not C:** Treating partial as complete misleads.

## D5-Q34

- task: 5.3/2.2
- group: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

Which is the correct reporting for "the query ran successfully and legitimately found no matching records"?

- [ ] A. A transient access failure requiring retry.
- [x] B. A valid empty result (success, no matches), not an error.
- [ ] C. A generic "unavailable."
- [ ] D. A permission error.

**Explanation:** A legitimate no-match is a valid empty result, distinct from an access failure.

**Why not A:** All misclassify a successful empty query as a failure.

**Why not C:** All misclassify a successful empty query as a failure.

**Why not D:** All misclassify a successful empty query as a failure.

## D5-Q35

- task: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

Local recovery in subagents means:

- [ ] A. Escalating every error immediately.
- [ ] B. Never handling any error.
- [x] C. Handling transient failures internally (e.g., a brief retry) and only escalating to the coordinator errors that can't be resolved locally.
- [ ] D. Terminating on the first error.

**Explanation:** Subagents resolve transient issues locally and propagate only unrecoverable errors.

**Why not A:** Escalating everything overloads the coordinator.

**Why not B:** No handling defeats resilience.

**Why not D:** First-error termination is an anti-pattern.

## D5-Q36

- task: 5.3
- scenario: 3
- docs: [Subagents, error propagation](https://code.claude.com/docs/en/sub-agents)

The best summary of sound multi-agent error propagation is:

- [ ] A. Always use a single generic error string.
- [ ] B. Always terminate the whole workflow on any error.
- [ ] C. Always return empty success to keep things moving.
- [x] D. Return structured, distinguishable errors (type, attempt, partial results, alternatives), recover locally when possible, and let the coordinator decide, never suppress or blanket-terminate.

**Explanation:** This captures the full recommended pattern: structured, distinguishable, locally-recovered, coordinator-decided.

**Why not A:** Each is a named anti-pattern (termination, suppression, generic status).

**Why not B:** Each is a named anti-pattern (termination, suppression, generic status).

**Why not C:** Each is a named anti-pattern (termination, suppression, generic status).

## D5-Q37

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

During an extended exploration session, Claude starts giving inconsistent answers and referencing "typical patterns" instead of the specific classes it discovered earlier. What is happening and what helps?

- [ ] A. The model is broken; switch providers.
- [x] B. Context degradation in extended sessions; use scratchpad files to persist key findings and reference them to counteract degradation.
- [ ] C. The context window is too small; nothing can help.
- [ ] D. Tool descriptions are wrong.

**Explanation:** In long sessions, context degrades and models drift to generic "typical patterns"; scratchpad files persist key findings across context boundaries.

**Why not A:** It's context degradation, not a defect.

**Why not C:** Scratchpads and delegation specifically help.

**Why not D:** Descriptions aren't the cause here.

## D5-Q38

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

What is the role of scratchpad files in large codebase exploration?

- [ ] A. Replacing the codebase.
- [ ] B. Storing API keys.
- [x] C. Persisting key findings across context boundaries so the agent can reference them later.
- [ ] D. Disabling tools.

**Explanation:** Scratchpad files persist key findings across context boundaries, countering degradation.

**Why not A:** None matches the scratchpad's purpose.

**Why not B:** None matches the scratchpad's purpose.

**Why not D:** None matches the scratchpad's purpose.

## D5-Q39

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

To keep the main agent's context clean while exploring a large system, the guide recommends:

- [ ] A. Disabling the coordinator.
- [ ] B. Reading all files into the main context.
- [ ] C. Never using subagents.
- [x] D. Subagent delegation to isolate verbose exploration output while the main agent coordinates high-level understanding.

**Explanation:** Delegating verbose exploration to subagents isolates output while the main agent keeps high-level coordination.

**Why not A:** The coordinator is needed for high-level understanding.

**Why not B:** Bulk reading exhausts context.

**Why not C:** Subagents are the recommended tool here.

## D5-Q40

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

For crash recovery in a long multi-agent exploration, the guide describes:

- [ ] A. Hoping the session survives.
- [x] B. Structured state persistence where each agent exports state to a known location, and the coordinator loads a manifest on resume.
- [ ] C. Restarting from zero every time.
- [ ] D. Storing state only in the model's memory.

**Explanation:** Structured state exports plus a coordinator-loaded manifest enable crash recovery.

**Why not A:** Hope isn't a recovery strategy.

**Why not C:** Restarting from zero wastes work.

**Why not D:** Models don't persist state across crashes.

## D5-Q41

- task: 5.4
- scenario: 4
- mock: true
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

When context fills with verbose discovery output during an extended session, which command reduces context usage?

- [ ] A. `--json-schema`.
- [ ] B. `/memory`.
- [x] C. `/compact`.
- [ ] D. `fork_session`.

**Explanation:** `/compact` reduces context usage during extended exploration sessions.

**Why not A:** A CI output flag.

**Why not B:** `/memory` inspects loaded files; it doesn't compact.

**Why not D:** Forking branches sessions; it doesn't compact context.

## D5-Q42

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

Before spawning subagents for the next exploration phase, the guide recommends:

- [ ] A. Deleting all prior findings.
- [ ] B. Passing the entire raw transcript.
- [ ] C. Passing nothing.
- [x] D. Summarizing key findings from the current phase and injecting those summaries into the next phase's initial context.

**Explanation:** Summarize each phase's key findings and inject summaries into the next phase to preserve continuity efficiently.

**Why not A:** Passing nothing or deleting findings loses continuity.

**Why not B:** Raw transcripts overwhelm context.

**Why not C:** Passing nothing or deleting findings loses continuity.

## D5-Q43

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

A symptom that a session has degraded is:

- [ ] A. The model answers faster.
- [x] B. The model references "typical patterns" rather than the specific classes it discovered earlier, and answers become inconsistent.
- [ ] C. The model uses the Grep tool.
- [ ] D. The model reads CLAUDE.md.

**Explanation:** Drift to generic "typical patterns" and inconsistency are hallmarks of context degradation.

**Why not A:** Speed isn't a degradation symptom.

**Why not C:** Normal tool/config usage, not symptoms.

**Why not D:** Normal tool/config usage, not symptoms.

## D5-Q44

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

Which subagent-based technique isolates verbose discovery while preserving the main agent's high-level coordination?

- [ ] A. Disabling subagents.
- [ ] B. Having the main agent read every file itself.
- [x] C. Spawning subagents to investigate specific questions (e.g., "find all test files," "trace refund flow dependencies") while the main agent preserves high-level coordination.
- [ ] D. Forcing `end_turn`.

**Explanation:** Delegating focused investigations to subagents isolates verbose output while the main agent coordinates.

**Why not A:** Subagents are the mechanism.

**Why not B:** Reading everything defeats isolation.

**Why not D:** Forcing termination abandons the task.

## D5-Q45

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

How does the coordinator use exported agent state (manifests) on resume?

- [ ] A. It restarts every agent from scratch.
- [ ] B. It deletes the manifest.
- [ ] C. It ignores prior state.
- [x] D. It loads the manifest and injects the relevant state into agent prompts to reconstruct context after a crash.

**Explanation:** The coordinator loads the manifest and injects state into prompts, reconstructing context on resume.

**Why not A:** Restarting from scratch wastes prior work.

**Why not B:** Deleting or ignoring state defeats recovery.

**Why not C:** Deleting or ignoring state defeats recovery.

## D5-Q46

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

Which practice best counteracts context degradation over a multi-hour exploration?

- [ ] A. Keep everything in the live conversation and never persist findings.
- [x] B. Maintain scratchpad files of key findings and reference them for subsequent questions.
- [ ] C. Summarize away all specifics.
- [ ] D. Increase temperature.

**Explanation:** Scratchpads persist specific findings, countering degradation over long sessions.

**Why not A:** Relying on the live conversation is what degrades.

**Why not C:** Summarizing away specifics loses the exact classes needed.

**Why not D:** Temperature is irrelevant to degradation.

## D5-Q47

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

During a multi-phase task, injecting phase summaries into the next phase's initial context primarily:

- [ ] A. Deletes prior work.
- [ ] B. Increases raw transcript size.
- [x] C. Preserves continuity and key findings while keeping context lean.
- [ ] D. Disables coordination.

**Explanation:** Summary injection preserves continuity/findings without bloating context.

**Why not A:** It preserves work and coordination.

**Why not B:** It reduces, not increases, bloat.

**Why not D:** It preserves work and coordination.

## D5-Q48

- task: 5.4
- scenario: 4
- docs: [Common workflows, large codebase exploration](https://code.claude.com/docs/en/common-workflows)

Which combination best manages context across a large, crash-prone exploration?

- [ ] A. Store everything only in the model's short-term reasoning.
- [ ] B. One giant session reading all files with no persistence.
- [ ] C. Restart from zero after every crash.
- [x] D. Subagent delegation for verbose discovery + scratchpad files for key findings + structured state exports/manifests for crash recovery + `/compact` when context fills.

**Explanation:** This bundles the guide's context-management techniques: delegation, scratchpads, manifests, and `/compact`.

**Why not A:** Models don't persist across crashes.

**Why not B:** No persistence and bulk reading both fail.

**Why not C:** Zero-restart wastes work.

## D5-Q49

- task: 5.5
- scenario: 6
- mock: true
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

An extraction system reports 97% aggregate accuracy, but a downstream team reports frequent errors on a specific document type. What risk does this illustrate, and what should you do?

- [ ] A. 97% is fine; ignore the complaints.
- [x] B. Aggregate accuracy can mask poor performance on specific document types or fields; analyze accuracy by document type and field before automating high-confidence extractions.
- [ ] C. Switch models immediately.
- [ ] D. Increase the aggregate to 99% by relabeling.

**Explanation:** Aggregate metrics can hide weak segments; validate accuracy by document type and field before automating.

**Why not A:** Ignoring a known weak segment is unsafe.

**Why not C:** Model-swapping is premature without segment analysis.

**Why not D:** Relabeling to inflate metrics is dishonest and unsafe.

## D5-Q50

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

To measure ongoing error rates in high-confidence extractions and detect novel error patterns, the guide recommends:

- [ ] A. Never sampling high-confidence outputs.
- [ ] B. Reviewing only the lowest-confidence extractions.
- [x] C. Stratified random sampling of high-confidence extractions for ongoing error-rate measurement.
- [ ] D. Trusting all high-confidence outputs blindly.

**Explanation:** Stratified random sampling of high-confidence extractions measures error rates and surfaces novel error patterns.

**Why not A:** Never sampling / blind trust hides emerging errors.

**Why not B:** Only reviewing low-confidence items misses novel high-confidence errors.

**Why not D:** Never sampling / blind trust hides emerging errors.

## D5-Q51

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

How should field-level confidence thresholds for routing review be set?

- [ ] A. Based on the model's mood.
- [ ] B. Guessed arbitrarily.
- [ ] C. Set to 0 for all fields.
- [x] D. Calibrated using labeled validation sets.

**Explanation:** Field-level confidence is calibrated with labeled validation sets to route review attention reliably.

**Why not A:** Arbitrary/uncalibrated thresholds don't route reliably.

**Why not B:** Arbitrary/uncalibrated thresholds don't route reliably.

**Why not C:** A zero threshold routes everything or nothing meaningfully.

## D5-Q52

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

Which extractions should be routed to human review given limited reviewer capacity?

- [ ] A. Only the highest-confidence extractions.
- [x] B. Extractions with low model confidence or from ambiguous/contradictory source documents.
- [ ] C. A random 50% regardless of confidence.
- [ ] D. None; automate everything.

**Explanation:** Route low-confidence or ambiguous/contradictory-source extractions to humans, prioritizing limited capacity.

**Why not A:** High-confidence items least need review (though sampled).

**Why not C:** Random routing wastes limited capacity.

**Why not D:** Full automation ignores risky cases.

## D5-Q53

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

Before reducing human review on high-confidence extractions, you should:

- [ ] A. Remove all validation.
- [ ] B. Rely on the single aggregate accuracy number.
- [x] C. Analyze accuracy by document type and field to verify consistent performance across all segments.
- [ ] D. Assume performance is uniform.

**Explanation:** Verify consistent per-segment (type/field) accuracy before cutting human review.

**Why not A:** Removing validation is unsafe.

**Why not B:** Aggregate/uniform assumptions can hide weak segments.

**Why not D:** Aggregate/uniform assumptions can hide weak segments.

## D5-Q54

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

Why sample *high-confidence* extractions rather than only reviewing low-confidence ones?

- [ ] A. There is no reason.
- [ ] B. Because high-confidence outputs are always wrong.
- [ ] C. To increase reviewer workload for its own sake.
- [x] D. To catch novel error patterns and measure true error rates in the outputs you plan to automate.

**Explanation:** Sampling high-confidence outputs detects novel errors and measures the real error rate you're about to trust.

**Why not A:** There's a clear reliability reason.

**Why not B:** They're usually right, but not guaranteed, hence sampling.

**Why not C:** The goal is quality, not busywork.

## D5-Q55

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

The risk of automating based on a single aggregate accuracy metric is:

- [ ] A. It is always too pessimistic.
- [x] B. It may mask poor performance on specific document types or fields that the aggregate averages out.
- [ ] C. It cannot be computed.
- [ ] D. It guarantees per-segment quality.

**Explanation:** Aggregates can average away weak segments, masking poor per-type/field performance.

**Why not A:** It can be over-optimistic for weak segments.

**Why not C:** It's computable; the issue is what it hides.

**Why not D:** It does not guarantee per-segment quality.

## D5-Q56

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

Field-level confidence scores are most useful when they are:

- [ ] A. Used to auto-accept everything.
- [ ] B. Uncalibrated and ignored.
- [x] C. Calibrated with labeled validation sets and used to route review attention where it's most needed.
- [ ] D. Randomly generated.

**Explanation:** Calibrated field-level confidence routes review attention effectively.

**Why not A:** Auto-accepting defeats calibration.

**Why not B:** Ignoring them wastes the signal.

**Why not D:** Random scores carry no signal.

## D5-Q57

- task: 5.5
- scenario: 6
- mock: true
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

A reviewer team is small. The best routing strategy prioritizes:

- [ ] A. Whatever arrives last.
- [ ] B. High-confidence extractions first.
- [ ] C. Alphabetical document order.
- [x] D. Low-confidence and ambiguous/contradictory-source extractions, so scarce human attention targets the riskiest items.

**Explanation:** Prioritize the riskiest (low-confidence/ambiguous) items for limited reviewer capacity.

**Why not A:** Arbitrary ordering ignores risk.

**Why not B:** High-confidence items are lowest priority (aside from sampling).

**Why not C:** Arbitrary ordering ignores risk.

## D5-Q58

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

To validate that a high-confidence auto-extraction pipeline is safe to deploy per document type, you should:

- [ ] A. Deploy first, monitor never.
- [x] B. Analyze accuracy segmented by document type and field, plus stratified sampling of high-confidence outputs for ongoing monitoring.
- [ ] C. Only test one document type and generalize.
- [ ] D. Trust the aggregate metric alone.

**Explanation:** Segment analysis plus stratified high-confidence sampling validates and monitors the pipeline safely.

**Why not A:** No monitoring is unsafe.

**Why not C:** One type doesn't generalize.

**Why not D:** Aggregates hide weak segments.

## D5-Q59

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

Having the model output field-level confidence, then calibrating thresholds with labeled data, primarily enables:

- [ ] A. Faster batch processing only.
- [ ] B. Elimination of the schema.
- [x] C. Reliable routing of which extractions need human review versus which can be automated.
- [ ] D. Guaranteed 100% accuracy.

**Explanation:** Calibrated field-level confidence enables reliable review-vs-automate routing.

**Why not A:** Not primarily a speed feature.

**Why not B:** Schemas remain necessary.

**Why not D:** No method guarantees perfect accuracy.

## D5-Q60

- task: 5.5
- scenario: 6
- docs: [Common workflows, review & validation](https://code.claude.com/docs/en/common-workflows)

A pipeline shows 97% overall but 82% on invoices specifically. The correct action is:

- [ ] A. Relabel invoices as another type.
- [ ] B. Automate invoices too, since 97% is high.
- [ ] C. Stop the whole pipeline.
- [x] D. Keep human review (or improve extraction) for invoices while safely automating segments proven consistently accurate.

**Explanation:** Segment-specific weakness (invoices) warrants continued review/improvement there while automating proven-strong segments.

**Why not A:** Relabeling hides the problem.

**Why not B:** Automating a weak segment on an aggregate is unsafe.

**Why not C:** Halting everything is overkill.

## D5-Q61

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

During synthesis, source attribution is being lost because findings are compressed without preserving claim-source mappings. What does the guide recommend?

- [ ] A. Drop attribution to save tokens.
- [x] B. Require subagents to output structured claim-source mappings (source URLs, document names, relevant excerpts) that downstream agents preserve through synthesis.
- [ ] C. Let the synthesis agent invent plausible citations.
- [ ] D. Merge everything into one unlabeled summary.

**Explanation:** Structured claim-source mappings preserved through synthesis prevent attribution loss during compression.

**Why not A:** Dropping attribution destroys provenance.

**Why not C:** Inventing citations is fabrication.

**Why not D:** Unlabeled summaries lose source mappings.

## D5-Q62

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

Two credible sources report different statistics for the same metric. How should synthesis handle this?

- [ ] A. Average them without noting the conflict.
- [ ] B. Pick one value silently.
- [x] C. Annotate the conflict with source attribution rather than arbitrarily selecting one value.
- [ ] D. Discard both.

**Explanation:** Conflicting statistics from credible sources should be annotated with attribution, not arbitrarily resolved.

**Why not A:** Averaging without noting the conflict misrepresents the data.

**Why not B:** Silent selection hides the disagreement.

**Why not D:** Discarding loses valid information.

## D5-Q63

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

Two sources give different figures because they were published a year apart. Without which metadata might this be misread as a contradiction?

- [ ] A. The API version.
- [ ] B. The font of the document.
- [ ] C. The reviewer's name.
- [x] D. Publication/collection dates in the structured outputs.

**Explanation:** Requiring publication/collection dates prevents temporal differences from being misinterpreted as contradictions.

**Why not A:** None disambiguates temporal differences.

**Why not B:** None disambiguates temporal differences.

**Why not C:** None disambiguates temporal differences.

## D5-Q64

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

How should a synthesis report structure well-established versus contested findings?

- [ ] A. Blend them so readers can't tell which is which.
- [x] B. With explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context.
- [ ] C. Only report well-established findings and hide contested ones.
- [ ] D. Only report contested findings.

**Explanation:** Explicit sections separate well-established from contested findings while preserving source characterizations and methodology.

**Why not A:** Blending obscures reliability.

**Why not C:** Hiding either side misrepresents the evidence.

**Why not D:** Hiding either side misrepresents the evidence.

## D5-Q65

- task: 5.6
- scenario: 3
- mock: true
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

When a document-analysis subagent finds conflicting values within its scope, it should:

- [ ] A. Drop the document.
- [ ] B. Pick one and hide the other.
- [x] C. Include both conflicting values, explicitly annotated, and let the coordinator decide how to reconcile before synthesis.
- [ ] D. Fabricate a compromise value.

**Explanation:** Surface both annotated values and defer reconciliation to the coordinator before synthesis.

**Why not A:** Dropping the document discards evidence.

**Why not B:** Hiding a value loses information.

**Why not D:** Fabrication is a correctness violation.

## D5-Q66

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

Different content types in a synthesis output should be rendered how?

- [ ] A. All as bullet points regardless of type.
- [ ] B. All as one uniform paragraph.
- [ ] C. All as raw JSON.
- [x] D. Appropriately per type, financial data as tables, news as prose, technical findings as structured lists, rather than forcing a uniform format.

**Explanation:** Render each content type appropriately (financial→tables, news→prose, technical→lists) instead of a uniform format.

**Why not A:** Forcing one format loses the strengths of each content type.

**Why not B:** Forcing one format loses the strengths of each content type.

**Why not C:** Forcing one format loses the strengths of each content type.

## D5-Q67

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

Why require subagents to include relevant excerpts alongside source URLs in claim-source mappings?

- [ ] A. To increase token usage for its own sake.
- [x] B. So downstream synthesis can preserve accurate attribution and verify claims against the exact supporting text.
- [ ] C. To replace the claim itself.
- [ ] D. To hide the source.

**Explanation:** Excerpts plus URLs let synthesis preserve attribution and ground claims in the supporting text.

**Why not A:** The purpose is provenance, not bloat.

**Why not C:** Excerpts support, not replace, the claim.

**Why not D:** They reveal, not hide, the source.

## D5-Q68

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

The core problem with compressing findings during summarization without claim-source mappings is:

- [ ] A. The model runs out of tools.
- [ ] B. The summary becomes too long.
- [x] C. Source attribution is lost, so the synthesis can't say which source supports which claim.
- [ ] D. The schema breaks.

**Explanation:** Without preserved mappings, compression severs the claim-to-source link.

**Why not A:** Not the described failure.

**Why not B:** Compression shortens, not lengthens.

**Why not D:** Not the described failure.

## D5-Q69

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

Conflicting statistics from two credible sources are best presented as:

- [ ] A. Neither value.
- [ ] B. A single blended number with no attribution.
- [ ] C. Whichever value the model prefers.
- [x] D. Both values, each attributed to its source, with any methodological/temporal context noted.

**Explanation:** Present both attributed values with context, rather than blending or arbitrarily choosing.

**Why not A:** Omitting both loses information.

**Why not B:** Blended-without-attribution hides the conflict.

**Why not C:** Preference-based selection is arbitrary.

## D5-Q70

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

Requiring publication or data-collection dates in structured outputs enables:

- [ ] A. Faster tool calls.
- [x] B. Correct temporal interpretation, so year-apart figures aren't misread as contradictions.
- [ ] C. Smaller schemas.
- [ ] D. Disabling synthesis.

**Explanation:** Dates enable correct temporal interpretation of differing figures.

**Why not A:** None relates to temporal interpretation.

**Why not C:** None relates to temporal interpretation.

**Why not D:** None relates to temporal interpretation.

## D5-Q71

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

A synthesis agent combining findings from multiple subagents must, above all:

- [ ] A. Rewrite every source characterization in its own words without noting origin.
- [ ] B. Strip all metadata for brevity.
- [x] C. Preserve and merge the structured claim-source mappings so attribution survives the synthesis step.
- [ ] D. Choose one source and ignore the rest.

**Explanation:** The synthesis agent must preserve and merge claim-source mappings to keep attribution intact.

**Why not A:** Losing origin characterizations misrepresents sources.

**Why not B:** Stripping metadata destroys provenance.

**Why not D:** Ignoring sources loses evidence and attribution.

## D5-Q72

- task: 5.6
- scenario: 3
- docs: [Subagents, multi-source synthesis & provenance](https://code.claude.com/docs/en/sub-agents)

A research report mixes stock financials, news developments, and technical benchmark findings. The most faithful synthesis:

- [ ] A. Merges all numbers into one figure without sources.
- [ ] B. Converts everything to a single uniform prose block.
- [ ] C. Drops the financial tables to keep it readable.
- [x] D. Renders financials as tables, news as prose, and benchmarks as structured lists, while preserving each source's attribution and any conflicts/dates.

**Explanation:** Type-appropriate rendering plus preserved attribution, conflicts, and dates yields the most faithful synthesis.

**Why not A:** Merging without sources destroys provenance.

**Why not B:** Uniform prose loses the strengths of each content type.

**Why not C:** Dropping tables loses precise financial data.
