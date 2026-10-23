---
domain: 1
name: Agentic Architecture & Orchestration
weight: 27%
---

<!--
  Domain 1 question bank. Edit freely, then run `pnpm claude:build` (also runs on dev/build).
  Format guide: see src/content/claude/README.md
-->

# Task statements

### 1.1 Design and implement agentic loops for autonomous task execution

Loop lifecycle; inspect `stop_reason` (`tool_use` vs `end_turn`); append tool results to conversation history; model-driven decisions vs pre-configured trees. Anti-patterns: parsing natural-language completion signals, arbitrary iteration caps as the primary stop, checking for assistant text as a completion indicator.

Docs: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

### 1.2 Orchestrate multi-agent systems with coordinator, subagent patterns

Hub-and-spoke; subagents run with isolated context (no automatic inheritance of coordinator history); coordinator handles decomposition, delegation, aggregation, and dynamic subagent selection; iterative refinement loops; routing all communication through the coordinator for observability.

Docs: https://code.claude.com/docs/en/sub-agents

### 1.3 Configure subagent invocation, context passing, and spawning

`Task` tool as the spawn mechanism (`allowedTools` must include `Task`); explicit context passing (no shared memory); `AgentDefinition` (descriptions, system prompts, tool restrictions); parallel spawning via multiple `Task` calls in **one** response; `fork_session` from a shared baseline; goal-oriented (not procedural) coordinator prompts.

Docs: https://code.claude.com/docs/en/sub-agents

### 1.4 Implement multi-step workflows with enforcement and handoff patterns

Programmatic enforcement (hooks, prerequisite gates) vs prompt-based guidance; deterministic compliance for critical steps (e.g., identity verification before financial ops); structured handoff summaries (customer ID, root cause, recommended action) for human escalation.

Docs: https://code.claude.com/docs/en/hooks

### 1.5 Apply Agent SDK hooks for tool-call interception and data normalization

`PostToolUse` to normalize heterogeneous data (Unix timestamps, ISO 8601, numeric codes); tool-call interception to block policy-violating actions (e.g., refunds > $500) and redirect; hooks for deterministic guarantees vs prompts for probabilistic compliance.

Docs: https://code.claude.com/docs/en/hooks

### 1.6 Design task-decomposition strategies for complex workflows

Fixed sequential pipelines (prompt chaining) vs dynamic adaptive decomposition; per-file local passes plus a cross-file integration pass to avoid attention dilution; adaptive investigation plans generated from intermediate findings.

Docs: https://code.claude.com/docs/en/common-workflows

### 1.7 Manage session state, resumption, and forking

`--resume <session-name>` for named continuation; `fork_session` for divergent branches from a shared baseline; informing a resumed session of file changes; starting fresh with a structured summary when prior tool results are stale.

Docs: https://code.claude.com/docs/en/sessions

# Questions

## D1-Q01

- task: 1.1
- scenario: 1
- mock: true
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Your Agent SDK support agent runs an agentic loop. After each API response you must decide whether to execute tools or return the final answer to the customer. Which signal is the correct, reliable basis for that decision?

- [x] A. The `stop_reason` field: continue executing tools while it is `tool_use`, and terminate when it is `end_turn`.
- [ ] B. Whether the assistant's text response contains a phrase like "I'm done" or "Let me finish."
- [ ] C. Whether the response length is below a fixed token threshold.
- [ ] D. Whether a fixed maximum of 5 iterations has been reached.

**Explanation:** The agentic loop lifecycle keys on `stop_reason`. `tool_use` means Claude is requesting tools (execute them, append results, iterate); `end_turn` means Claude has finished reasoning and produced its final answer.

**Why not B:** Parsing natural-language completion signals is an explicit anti-pattern; phrasing is unreliable and model-dependent.

**Why not C:** Response length has no defined relationship to loop completion.

**Why not D:** Arbitrary iteration caps are an anti-pattern as the *primary* stopping mechanism; they are at best a safety backstop.

## D1-Q02

- task: 1.1
- scenario: 1
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

After Claude returns a `tool_use` block and you execute the requested tool, what must you do before the next API request so the model can reason about the next action?

- [ ] A. Discard the tool result and re-send only the original user message to keep context small.
- [ ] B. Store the tool result in a database and let Claude query it if needed.
- [ ] C. Summarize the tool result into one sentence and start a fresh conversation.
- [x] D. Append the tool result to the conversation history and send the full updated history back to Claude.

**Explanation:** Tool results are appended to conversation history so the model incorporates the new information into its reasoning on the next iteration. Maintaining the accumulating history is what makes the loop coherent.

**Why not A:** Discarding results breaks the loop; the model can't reason about an action whose outcome it never sees.

**Why not B:** The model has no autonomous database access mid-loop; results must be provided in the request.

**Why not C:** Premature summarization risks dropping precise values the model needs; it also loses the tool-call/result pairing.

## D1-Q03

- task: 1.1
- scenario: 1
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A teammate proposes ending the loop as soon as `max_iterations = 3` is hit, regardless of `stop_reason`. Why is this an anti-pattern as the primary control?

- [ ] A. Three iterations is always too few for any task.
- [ ] B. Iteration caps should govern loop termination instead of `stop_reason`, which is only advisory.
- [x] C. It can cut off multi-step tasks mid-execution; the cap should be a safety backstop, not the primary termination signal, which is `stop_reason`.
- [ ] D. Iteration caps prevent Claude from ever calling tools.

**Explanation:** Arbitrary iteration caps as the *primary* stopping mechanism truncate legitimate multi-step work. The correct primary signal is `stop_reason` (`end_turn`); a cap is only a defensive limit.

**Why not A:** The number isn't inherently wrong; using a cap *as the primary stop* is the problem.

**Why not B:** Reversed: `stop_reason` is authoritative, not advisory.

**Why not D:** Caps don't disable tool calls; they just bound the loop count.

## D1-Q04

- task: 1.1
- scenario: 3
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which description best distinguishes *model-driven* decision-making from a *pre-configured decision tree* in an agentic loop?

- [x] A. Model-driven means Claude reasons about which tool to call next based on accumulated context; a decision tree hard-codes the tool sequence in advance.
- [ ] B. Model-driven means the developer picks each tool; a decision tree lets Claude choose.
- [ ] C. They are identical; both rely on `stop_reason`.
- [ ] D. Model-driven loops cannot use tools at all.

**Explanation:** In model-driven control, Claude selects the next action from context each iteration; a pre-configured tree fixes the order regardless of intermediate findings.

**Why not B:** Reverses the definitions.

**Why not C:** They differ precisely in *who* decides the next step.

**Why not D:** Model-driven loops are built around tool use.

## D1-Q05

- task: 1.1
- scenario: 1
- mock: true
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Your loop occasionally terminates early on multi-step refunds. Investigation shows the code stops when the assistant text contains "processed." What is the root cause and fix?

- [x] A. Root cause: termination is based on assistant text content, an anti-pattern; fix by terminating on `stop_reason == "end_turn"` instead.
- [ ] B. Root cause: the model is broken; fix by switching models.
- [ ] C. Root cause: too many tools; fix by removing tools.
- [ ] D. Root cause: missing iteration cap; fix by adding `max_iterations = 1`.

**Explanation:** Checking assistant text as a completion indicator is a named anti-pattern. The reliable fix is to drive termination from `stop_reason`.

**Why not B:** Nothing indicates a model defect; the control logic is wrong.

**Why not C:** Tool count is unrelated to this bug.

**Why not D:** A cap of 1 would break multi-step refunds entirely.

## D1-Q06

- task: 1.1
- scenario: 1
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

During a loop iteration, Claude returns both a short text preamble *and* a `tool_use` block. What is the correct handling?

- [ ] A. Return the text to the user immediately and stop the loop.
- [ ] B. Treat the presence of any text as `end_turn` and stop.
- [x] C. Because `stop_reason` is `tool_use`, execute the requested tool, append the result, and continue the loop.
- [ ] D. Ignore the `tool_use` block and re-prompt for a cleaner response.

**Explanation:** A response can contain narration alongside a tool request; the authoritative control is `stop_reason`, which is `tool_use` here, so you execute and iterate.

**Why not A:** Presence of text does not mean completion; that's the assistant-text anti-pattern.

**Why not B:** Presence of text does not mean completion; that's the assistant-text anti-pattern.

**Why not D:** The tool request is valid and should be honored, not discarded.

## D1-Q07

- task: 1.1
- scenario: 1
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which of the following is the *strongest* completion condition for a single-agent tool-using loop?

- [x] A. `stop_reason` returns `end_turn` with no further `tool_use` requests.
- [ ] B. The response contains a period at the end.
- [ ] C. The total tokens used exceed the model's context window.
- [ ] D. The customer stops typing.

**Explanation:** `end_turn` with no pending tool requests is the model signaling it has completed its reasoning for the turn, the defined completion condition.

**Why not B:** Punctuation is not a control signal.

**Why not C:** Exceeding context is a failure mode, not a graceful completion.

**Why not D:** User typing behavior doesn't govern the agent's internal loop.

## D1-Q08

- task: 1.1
- scenario: 1
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

You want observability into every tool the agent runs during a loop. Which approach preserves the loop's correctness while adding logging?

- [x] A. Log each `tool_use` request and its result as you append the result to history, without altering the `stop_reason`-based control flow.
- [ ] B. Replace `stop_reason` checks with log-line parsing.
- [ ] C. Stop the loop after the first logged tool call.
- [ ] D. Only log when the assistant text says "logging."

**Explanation:** Logging is orthogonal to control flow. You can record each request/result pair at the append step while leaving `stop_reason` as the authoritative loop control.

**Why not B:** Log parsing reintroduces fragile text-based control.

**Why not C:** Stopping after one tool call breaks multi-step tasks.

**Why not D:** Conditioning logging on assistant text is unreliable and pointless.

## D1-Q09

- task: 1.1 (+1.4)
- group: 1.1
- scenario: 1
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A loop must call `get_customer`, then `lookup_order`, then possibly `process_refund`. Should you hard-code this exact sequence or let the model decide? Choose the best-justified answer.

- [ ] A. Always hard-code sequences; model-driven loops are unreliable.
- [ ] B. Hard-code the sequence and remove `stop_reason` handling.
- [ ] C. Never use enforcement; the model should have full freedom including refunds without verification.
- [x] D. Let the model decide each next step from context, since request specifics (e.g., customer volunteers order info) change the optimal path; use enforcement only for hard prerequisites.

**Explanation:** Model-driven decision-making adapts to varying inputs, while *specific* critical prerequisites (verify identity before refund) are best enforced programmatically. This blends 1.1 with 1.4.

**Why not A:** Over-rigid; discards the adaptability that makes agents useful.

**Why not B:** Removing `stop_reason` handling breaks the loop.

**Why not C:** Removing all enforcement is unsafe for financial actions.

## D1-Q10

- task: 1.1
- scenario: 1
- mock: true
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

In an agentic loop, what is the correct interpretation when the API returns `stop_reason: "end_turn"` *and* no tool calls after the agent has gathered all needed data?

- [x] A. The model has finished; present its final response and exit the loop.
- [ ] B. The model failed and the request should be retried.
- [ ] C. The model is waiting for another tool result before finishing.
- [ ] D. The loop should append an empty tool result and continue.

**Explanation:** `end_turn` with no tool requests is the terminal state, surface the answer and stop.

**Why not B:** `end_turn` is a normal completion, not an error.

**Why not C:** `end_turn` specifically means it is *not* waiting on tools.

**Why not D:** Appending an empty result and continuing creates an infinite/no-op loop.

## D1-Q11

- task: 1.1
- scenario: 1
- docs: [Tool use & the agentic loop (stop_reason)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which pair correctly matches the two `stop_reason` values an agentic loop must handle to its meaning?

- [ ] A. `tool_use` → finished; `end_turn` → needs a tool.
- [ ] B. `tool_use` → user turn; `end_turn` → system turn.
- [ ] C. `tool_use` → error; `end_turn` → success only if text present.
- [x] D. `tool_use` → Claude requests tool execution (continue); `end_turn` → Claude finished the turn (stop).

**Explanation:** These are the two lifecycle-critical values: `tool_use` continues the loop, `end_turn` terminates it.

**Why not A:** Reverses both meanings.

**Why not B:** These are not speaker roles.

**Why not C:** `tool_use` is not an error; completion doesn't depend on text presence.

## D1-Q12

- task: 1.2/1.3
- group: 1.2
- scenario: 3
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

In a hub-and-spoke multi-agent research system, how do subagents receive the information they need to do their work?

- [ ] A. They automatically inherit the coordinator's full conversation history.
- [ ] B. They share a global memory that all agents read and write.
- [x] C. They operate with isolated context and must be given the needed information explicitly in their prompt.
- [ ] D. They query the coordinator's memory via a built-in tool at will.

**Explanation:** Subagents run with isolated context and do **not** inherit the coordinator's history; required context must be passed explicitly.

**Why not A:** Automatic inheritance is exactly what does *not* happen.

**Why not B:** There is no shared global memory across invocations.

**Why not D:** There is no ambient coordinator-memory tool; context is passed in the prompt.

## D1-Q13

- task: 1.2
- scenario: 3
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

What is the coordinator agent's primary set of responsibilities in a coordinator, subagent architecture?

- [x] A. Task decomposition, delegation, result aggregation, and deciding which subagents to invoke based on query complexity.
- [ ] B. Executing all tool calls itself and never delegating.
- [ ] C. Only formatting the final report; subagents self-organize.
- [ ] D. Storing API keys for the subagents.

**Explanation:** The coordinator decomposes the task, delegates, aggregates results, and selects subagents based on complexity, the hub in hub-and-spoke.

**Why not B:** Doing everything itself defeats the multi-agent design.

**Why not C:** Subagents don't self-organize; the coordinator routes and aggregates.

**Why not D:** Credential storage is not the coordinator's architectural role here.

## D1-Q14

- task: 1.2
- scenario: 3
- mock: true
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

A research coordinator always routes every query through the full pipeline (search → analyze → synthesize → report), even trivial factual lookups. What improvement does the guide recommend?

- [ ] A. Remove the synthesis agent permanently.
- [ ] B. Run all subagents in parallel regardless of need.
- [ ] C. Merge all subagents into one giant agent.
- [x] D. Design the coordinator to analyze query requirements and dynamically select which subagents to invoke rather than always routing through the full pipeline.

**Explanation:** Coordinators should dynamically select subagents based on query needs, avoiding unnecessary pipeline stages.

**Why not A:** Removing synthesis breaks complex queries that need it.

**Why not B:** Blind parallelism wastes work and doesn't address unnecessary routing.

**Why not C:** Merging eliminates the specialization benefit and overloads tool selection.

## D1-Q15

- task: 1.2
- scenario: 3
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

To minimize duplicated work across research subagents, how should the coordinator partition scope?

- [x] A. Assign distinct subtopics or source types to each subagent so their work doesn't overlap.
- [ ] B. Give every subagent the identical broad prompt and deduplicate later.
- [ ] C. Let subagents negotiate scope among themselves at runtime.
- [ ] D. Have one subagent do everything and the rest idle.

**Explanation:** Partitioning research scope (distinct subtopics or source types per agent) minimizes duplication.

**Why not B:** Identical prompts guarantee overlap and wasted tokens.

**Why not C:** Direct subagent negotiation contradicts hub-and-spoke routing through the coordinator.

**Why not D:** Wastes the parallel capacity and doesn't partition anything.

## D1-Q16

- task: 1.2
- scenario: 3
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

After synthesis, the coordinator notices topic coverage gaps. What iterative-refinement pattern does the guide describe?

- [ ] A. Ship the report as-is; gaps are acceptable.
- [ ] B. Restart the entire pipeline from scratch on every gap.
- [ ] C. Ask the user to fill the gaps manually.
- [x] D. Evaluate synthesis output for gaps, re-delegate to search/analysis subagents with targeted queries, and re-invoke synthesis until coverage is sufficient.

**Explanation:** Iterative refinement loops have the coordinator detect gaps, re-delegate targeted work, and re-synthesize until coverage is adequate.

**Why not A:** Knowingly shipping gaps fails the quality goal.

**Why not B:** Full restarts are wasteful; targeted re-delegation is the pattern.

**Why not C:** Offloading to the user defeats the automated system.

## D1-Q17

- task: 1.2
- scenario: 3
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

Why should all inter-subagent communication route through the coordinator rather than subagents talking directly to each other?

- [x] A. For observability, consistent error handling, and controlled information flow.
- [ ] B. It is required by the network protocol.
- [ ] C. Because subagents cannot produce output otherwise.
- [ ] D. To reduce the number of tools each subagent has.

**Explanation:** Routing through the coordinator gives observability, uniform error handling, and controlled information flow, the point of hub-and-spoke.

**Why not B:** It's an architectural choice, not a protocol mandate.

**Why not C:** Subagents produce output regardless; the issue is routing.

**Why not D:** Tool count is a separate concern (2.3), not why routing is centralized.

## D1-Q18

- task: 1.2
- scenario: 3
- official: true
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

A coordinator decomposes "impact of AI on creative industries" into only "AI in digital art," "AI in graphic design," and "AI in photography." Reports omit music, writing, and film. What is the root cause?

- [ ] A. The synthesis agent lacks gap-detection instructions.
- [ ] B. The web search agent's queries are too narrow.
- [x] C. The coordinator's task decomposition is too narrow, producing subagent assignments that don't cover all relevant domains.
- [ ] D. The document-analysis agent filters out non-visual sources.

**Explanation:** The subagents executed their assigned tasks correctly; the omission originates in the coordinator's overly narrow decomposition. (This mirrors the official Sample Question 7.)

**Why not A:** Each blames a downstream agent that is working correctly within its assigned scope; the assignments themselves are the defect.

**Why not B:** Each blames a downstream agent that is working correctly within its assigned scope; the assignments themselves are the defect.

**Why not D:** Each blames a downstream agent that is working correctly within its assigned scope; the assignments themselves are the defect.

## D1-Q19

- task: 1.2
- scenario: 3
- mock: true
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

Which risk is specifically associated with *overly narrow* task decomposition by the coordinator?

- [ ] A. Excessive token usage from redundant subagents.
- [ ] B. Tool selection becoming more reliable.
- [ ] C. Subagents inheriting too much context.
- [x] D. Incomplete coverage of broad research topics.

**Explanation:** Narrow decomposition risks incomplete coverage of broad topics, subtopics get missed.

**Why not A:** That's a risk of redundant, not narrow, decomposition.

**Why not B:** Reliability isn't the risk being described.

**Why not C:** Subagents have isolated context; narrow scope doesn't cause over-inheritance.

## D1-Q20

- task: 1.2/1.3
- group: 1.2
- scenario: 3
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

A synthesis subagent needs the outputs of the search and analysis subagents. Given isolated context, how should the coordinator make those available?

- [x] A. Include the complete prior findings directly in the synthesis subagent's prompt.
- [ ] B. Assume the synthesis agent already has them via shared memory.
- [ ] C. Tell the synthesis agent to re-run the searches itself.
- [ ] D. Send only a one-word topic label and let it infer the rest.

**Explanation:** Because subagents don't share memory, the coordinator must pass complete prior findings directly in the downstream subagent's prompt.

**Why not B:** No shared memory exists.

**Why not C:** Re-running duplicates work and may drift from what was analyzed.

**Why not D:** A label is insufficient context and invites hallucination.

## D1-Q21

- task: 1.2/1.3
- group: 1.2
- scenario: 3
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

Which statement about coordinator prompts to subagents best supports subagent adaptability?

- [ ] A. Specify exact step-by-step procedural instructions for every action.
- [ ] B. Provide only the tool list with no objective.
- [ ] C. Provide no instructions and let the subagent guess.
- [x] D. Specify research goals and quality criteria rather than rigid procedures, enabling the subagent to adapt.

**Explanation:** Goal-and-criteria prompts (vs procedural micro-instructions) let subagents adapt their approach, a stated skill.

**Why not A:** Rigid procedures reduce adaptability.

**Why not B:** Missing objectives lead to unfocused or misdirected work.

**Why not C:** Missing objectives lead to unfocused or misdirected work.

## D1-Q22

- task: 1.2
- scenario: 3
- docs: [Subagents, coordinator/subagent orchestration](https://code.claude.com/docs/en/sub-agents)

A coordinator must decide, per query, whether to invoke one subagent or several. What input should drive that decision?

- [x] A. Query complexity and requirements analyzed by the coordinator.
- [ ] B. A random selection to balance load.
- [ ] C. The alphabetical order of subagent names.
- [ ] D. Whichever subagent responded fastest last time.

**Explanation:** The coordinator decides which subagents to invoke based on query complexity/requirements.

**Why not B:** None reflects the query's actual needs; they're arbitrary heuristics.

**Why not C:** None reflects the query's actual needs; they're arbitrary heuristics.

**Why not D:** None reflects the query's actual needs; they're arbitrary heuristics.

## D1-Q23

- task: 1.3
- scenario: 3
- mock: true
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

Your coordinator cannot spawn subagents. Which configuration requirement is most likely missing?

- [x] A. `allowedTools` must include `Task`, the mechanism for spawning subagents.
- [ ] B. `tool_choice` must be set to `any`.
- [ ] C. The subagents must be listed in `.mcp.json`.
- [ ] D. `max_tokens` must be increased.

**Explanation:** Subagents are spawned via the `Task` tool; the coordinator's `allowedTools` must include `Task`.

**Why not B:** `tool_choice: any` forces *some* tool call but doesn't enable spawning.

**Why not C:** Subagents aren't MCP servers configured in `.mcp.json`.

**Why not D:** Token limits don't gate spawning capability.

## D1-Q24

- task: 1.3
- scenario: 3
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

You want two research subagents to run in parallel to cut latency. How do you spawn them in parallel with the Agent SDK?

- [x] A. Emit multiple `Task` tool calls in a single coordinator response.
- [ ] B. Emit one `Task` call per turn across separate turns.
- [ ] C. Set `parallel: true` in `.mcp.json`.
- [ ] D. Increase `max_iterations`.

**Explanation:** Parallel subagents are launched by emitting multiple `Task` calls within one response, not across separate turns.

**Why not B:** Sequential turns run serially, not in parallel.

**Why not C:** No such `.mcp.json` flag governs subagent parallelism.

**Why not D:** Iteration count doesn't create parallelism.

## D1-Q25

- task: 1.3 (+5.6)
- group: 1.3
- scenario: 3
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

When passing web-search results and document-analysis outputs to a synthesis subagent, how should you preserve attribution?

- [ ] A. Merge everything into a single unlabeled text blob.
- [ ] B. Send only the URLs without the findings.
- [ ] C. Drop the metadata to save tokens.
- [x] D. Use structured data formats that separate content from metadata (source URLs, document names, page numbers).

**Explanation:** Structured formats separating content from metadata (source URLs, doc names, page numbers) preserve attribution across agent handoffs.

**Why not A:** An unlabeled blob loses source mappings.

**Why not B:** URLs alone strip the actual findings.

**Why not C:** Dropping metadata destroys provenance (see 5.6).

## D1-Q26

- task: 1.3/1.7
- group: 1.3
- scenario: 4
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

What is the purpose of `fork_session` in subagent/session management?

- [x] A. To create independent branches from a shared analysis baseline for exploring divergent approaches.
- [ ] B. To permanently delete a session.
- [ ] C. To merge two unrelated sessions into one.
- [ ] D. To convert a session into an MCP server.

**Explanation:** `fork_session` creates independent branches from a shared baseline to explore divergent approaches (e.g., two refactoring strategies).

**Why not B:** Forking doesn't delete.

**Why not C:** It branches from one baseline; it doesn't merge sessions.

**Why not D:** Sessions and MCP servers are unrelated concepts.

## D1-Q27

- task: 1.3
- scenario: 3
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

An `AgentDefinition` for a subagent type typically configures which of the following?

- [ ] A. Only the model temperature.
- [ ] B. The user's billing tier.
- [ ] C. The physical server hosting the agent.
- [x] D. Descriptions, system prompts, and tool restrictions for the subagent type.

**Explanation:** `AgentDefinition` specifies the subagent's description, system prompt, and tool restrictions.

**Why not A:** Temperature is not the definition's purpose here.

**Why not B:** Hosting and billing are out of scope for agent definitions.

**Why not C:** Hosting and billing are out of scope for agent definitions.

## D1-Q28

- task: 1.3
- scenario: 3
- mock: true
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

A subagent produced a wrong answer because it "didn't know" a fact the coordinator had. What is the most likely design error?

- [x] A. The coordinator relied on automatic context inheritance instead of explicitly passing the fact in the subagent's prompt.
- [ ] B. The subagent's `max_tokens` was too high.
- [ ] C. The coordinator used the `Task` tool.
- [ ] D. The subagent shared memory with the coordinator.

**Explanation:** Subagents don't inherit parent context; needed facts must be included explicitly in the prompt. Assuming inheritance is the classic error.

**Why not B:** High token limits don't cause missing knowledge.

**Why not C:** Using `Task` is correct, not the error.

**Why not D:** Subagents do *not* share memory; that's the point.

## D1-Q29

- task: 1.3/1.7
- group: 1.3
- scenario: 4
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

You want two subagents to explore two different testing strategies starting from the *same* codebase analysis you already ran. Which mechanism fits best?

- [x] A. `fork_session` from the shared analysis baseline to create parallel exploration branches.
- [ ] B. `--resume` the same named session twice.
- [ ] C. Start two unrelated fresh sessions with no shared baseline.
- [ ] D. Increase the iteration cap on one session.

**Explanation:** `fork_session` creates parallel branches from a shared baseline, exactly comparing two strategies from one analysis.

**Why not B:** Resuming the same named session doesn't create independent divergent branches.

**Why not C:** Fresh sessions discard the shared analysis you want to reuse.

**Why not D:** Iteration caps are unrelated to branching.

## D1-Q30

- task: 1.3
- scenario: 3
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

Which coordinator behavior best reflects "goal-oriented delegation" for a synthesis subagent?

- [ ] A. "Read file A line 1, then line 2, then compute X, then write to B."
- [ ] B. "Return the raw tool logs verbatim."
- [ ] C. "Do whatever you think is best" with no findings attached.
- [x] D. "Produce a comprehensive, cited synthesis of these findings; ensure every claim is attributed and flag any coverage gaps."

**Explanation:** Specifying goals and quality criteria (comprehensive, cited, attributed, gap-flagged) supports adaptability while ensuring quality.

**Why not A:** Over-procedural, reducing adaptability.

**Why not B:** Raw logs aren't a synthesis.

**Why not C:** No findings/criteria yields unfocused output.

## D1-Q31

- task: 1.3
- scenario: 3
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

Which statement about parallel subagent spawning is correct?

- [x] A. Multiple `Task` calls in one response run subagents concurrently, improving latency versus sequential spawning.
- [ ] B. Parallelism requires spawning across multiple sequential turns.
- [ ] C. Parallel subagents automatically share each other's results in real time.
- [ ] D. Only one `Task` call is ever allowed per response.

**Explanation:** Emitting multiple `Task` calls in a single response runs them concurrently, reducing wall-clock latency.

**Why not B:** Sequential turns are serial, not parallel.

**Why not C:** Results flow back through the coordinator, not laterally in real time.

**Why not D:** Multiple `Task` calls per response are expressly how parallelism is achieved.

## D1-Q32

- task: 1.3 (+5.6)
- group: 1.3
- scenario: 3
- mock: true
- docs: [Subagents, invocation, context & spawning](https://code.claude.com/docs/en/sub-agents)

A synthesis subagent must retain source URLs and publication dates from upstream agents. What should upstream subagents output to make that possible?

- [ ] A. Free-form prose with citations woven into sentences only.
- [ ] B. A confidence score with no source data.
- [ ] C. Only a final summary paragraph.
- [x] D. Structured outputs with claim, evidence excerpt, source URL/document name, and publication date fields.

**Explanation:** Structured outputs separating content from metadata (source, date) let downstream synthesis preserve attribution and temporal context.

**Why not A:** Prose-only citations are easily lost during summarization.

**Why not B:** Confidence without sources can't support attribution.

**Why not C:** A summary drops the per-claim source mapping.

## D1-Q33

- task: 1.4
- scenario: 1
- official: true
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

Production data shows the agent skips `get_customer` in 12% of cases and calls `lookup_order` using only the customer's stated name, sometimes refunding the wrong account. What change most effectively addresses this reliability issue?

- [x] A. Add a programmatic prerequisite that blocks `lookup_order` and `process_refund` until `get_customer` has returned a verified customer ID.
- [ ] B. Enhance the system prompt to say customer verification is mandatory before order operations.
- [ ] C. Add few-shot examples showing the agent always calling `get_customer` first.
- [ ] D. Implement a routing classifier that enables only the subset of tools appropriate for each request.

**Explanation:** When a specific tool sequence is required for critical business logic (verify identity before financial ops), programmatic enforcement gives deterministic guarantees that prompt-based approaches cannot. (Mirrors official Sample Question 1.)

**Why not B:** Rely on probabilistic LLM compliance, which has a non-zero failure rate, unacceptable when errors have financial consequences.

**Why not C:** Rely on probabilistic LLM compliance, which has a non-zero failure rate, unacceptable when errors have financial consequences.

**Why not D:** Addresses tool *availability*, not tool *ordering*, which is the actual problem.

## D1-Q34

- task: 1.4
- scenario: 1
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

When is *programmatic* enforcement (hooks/prerequisite gates) preferred over *prompt-based* guidance for workflow ordering?

- [x] A. When deterministic compliance is required, e.g., identity verification before financial operations, because prompt instructions have a non-zero failure rate.
- [ ] B. Whenever any ordering preference exists, even cosmetic ones.
- [ ] C. Only when the model is small.
- [ ] D. Never; prompts are always sufficient.

**Explanation:** Deterministic compliance for critical steps calls for programmatic gates; prompts alone can fail probabilistically.

**Why not B:** Over-applying enforcement to cosmetic ordering adds needless rigidity.

**Why not C:** Model size isn't the criterion.

**Why not D:** Prompts are insufficient where guaranteed compliance matters.

## D1-Q35

- task: 1.4 (+5.2)
- group: 1.4
- scenario: 1
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

An agent escalates a multi-issue billing dispute to a human who lacks access to the chat transcript. What should the structured handoff summary include?

- [ ] A. Only the customer's first name.
- [ ] B. Nothing; the human can re-interview the customer.
- [ ] C. The entire raw token-by-token transcript with no structure.
- [x] D. Customer ID, root cause analysis, refund amount, and recommended action.

**Explanation:** Structured handoff summaries include customer ID, root cause, refund amount, and recommended action so the human can act without the transcript.

**Why not A:** A name alone is insufficient to act.

**Why not B:** Re-interviewing wastes the customer's time and the work already done.

**Why not C:** A raw dump isn't a usable, structured handoff.

## D1-Q36

- task: 1.4
- scenario: 1
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

A customer raises three concerns in one message (a return, a billing error, and an address change). What decomposition approach does the guide recommend?

- [x] A. Decompose into distinct items, investigate each (in parallel using shared context), then synthesize a unified resolution.
- [ ] B. Handle only the first concern and ignore the rest.
- [ ] C. Escalate immediately without investigation.
- [ ] D. Force the customer to submit three separate tickets.

**Explanation:** Multi-concern requests should be decomposed into distinct items, each investigated (in parallel with shared context), then synthesized into one resolution.

**Why not B:** Dropping concerns fails the customer.

**Why not C:** Immediate escalation without investigation is inappropriate for straightforward items.

**Why not D:** Fragmenting the request degrades experience and duplicates effort.

## D1-Q37

- task: 1.4/1.5
- group: 1.4
- scenario: 1
- mock: true
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

A hook blocks `process_refund` until a verified customer ID exists. This is an example of which pattern?

- [ ] A. Prompt-based probabilistic guidance.
- [ ] B. Progressive summarization.
- [ ] C. Sentiment-based escalation.
- [x] D. A programmatic prerequisite gate that blocks downstream tool calls until a prerequisite step has completed.

**Explanation:** Blocking a downstream tool until a prerequisite returns is a programmatic prerequisite gate, deterministic enforcement.

**Why not A:** A hook is deterministic, not probabilistic prompting.

**Why not B:** Unrelated to summarization.

**Why not C:** Unrelated to sentiment.

## D1-Q38

- task: 1.4
- scenario: 1
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

Why is a system-prompt instruction like "always verify the customer before refunding" insufficient on its own for a financial workflow?

- [x] A. Prompt-based instructions have a non-zero failure rate, which is unacceptable when an error moves money.
- [ ] B. Prompts cannot mention refunds.
- [ ] C. The model ignores all system prompts.
- [ ] D. It is sufficient; no enforcement is ever needed.

**Explanation:** Instructions guide but don't guarantee; the residual failure rate is unacceptable for money-moving steps, so add programmatic enforcement.

**Why not B:** Prompts can absolutely mention refunds.

**Why not C:** Models do follow system prompts, just not with 100% reliability.

**Why not D:** Enforcement is precisely what's needed here.

## D1-Q39

- task: 1.4
- scenario: 1
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

Which of the following is a legitimate use of *prompt-based* guidance rather than programmatic enforcement?

- [ ] A. Blocking a $10,000 refund that exceeds policy.
- [ ] B. Ensuring a signature is collected before shipping controlled goods.
- [ ] C. Guaranteeing identity verification before a refund.
- [x] D. Guiding tone and preferred phrasing in customer replies where a rare deviation is harmless.

**Explanation:** Prompt guidance suits soft, low-stakes preferences (tone/phrasing) where occasional deviation causes no harm; hard guarantees need enforcement.

**Why not A:** All are high-stakes guarantees that require deterministic programmatic enforcement, not prompts.

**Why not B:** All are high-stakes guarantees that require deterministic programmatic enforcement, not prompts.

**Why not C:** All are high-stakes guarantees that require deterministic programmatic enforcement, not prompts.

## D1-Q40

- task: 1.4 (+5.2)
- group: 1.4
- scenario: 1
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

During a mid-process escalation, which combination best preserves continuity for the human agent?

- [x] A. A structured handoff containing customer ID, root cause, and recommended action, compiled before transferring.
- [ ] B. Escalate with no context and let the human start over.
- [ ] C. Only the sentiment score of the conversation.
- [ ] D. A promise to email details "later."

**Explanation:** Compiling a structured handoff (ID, root cause, recommended action) before transfer preserves continuity for a human without transcript access.

**Why not B:** No-context handoffs waste effort and frustrate customers.

**Why not C:** Sentiment alone isn't actionable.

**Why not D:** Deferred details break continuity at the moment of handoff.

## D1-Q41

- task: 1.4
- scenario: 1
- mock: true
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

A workflow requires steps in order: A (gather), B (investigate each concern), C (synthesize). Which statement about enforcement vs guidance is most accurate?

- [ ] A. Every step must be a hard programmatic gate.
- [ ] B. Enforcement and guidance are interchangeable with no tradeoffs.
- [ ] C. None of the steps should ever be enforced.
- [x] D. Use programmatic gates only where a downstream action is unsafe without a prerequisite (e.g., refund after verification); use guidance for ordering that is merely preferred.

**Explanation:** Reserve deterministic gates for safety/critical prerequisites; guidance suffices for preferred-but-not-critical ordering, matching the enforcement-vs-guidance distinction.

**Why not A:** Over-gating adds rigidity and maintenance cost where it isn't needed.

**Why not B:** They have different reliability guarantees; not interchangeable.

**Why not C:** Some steps (financial prerequisites) genuinely need enforcement.

## D1-Q42

- task: 1.4 (+5.2)
- group: 1.4
- scenario: 1
- docs: [Hooks, workflow enforcement & gates](https://code.claude.com/docs/en/hooks)

What is the correct handling when a customer's single message mixes a straightforward return with a policy-gap question the agent can't resolve?

- [x] A. Resolve the straightforward return autonomously, and escalate only the policy-gap portion with a structured handoff.
- [ ] B. Escalate the entire message and resolve nothing.
- [ ] C. Refuse the whole request.
- [ ] D. Guess an answer to the policy-gap question to avoid escalating.

**Explanation:** Decompose the request: handle resolvable items autonomously and escalate only the genuinely blocked portion (policy gap) with a proper handoff.

**Why not B:** Escalating everything wastes human capacity on the resolvable item.

**Why not C:** Refusing fails the customer on both counts.

**Why not D:** Guessing on a policy gap risks incorrect commitments.

## D1-Q43

- task: 1.5
- scenario: 1
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

Different MCP tools return timestamps as Unix epoch, ISO 8601 strings, and numeric status codes. You want the agent to see a single normalized format. Which hook pattern fits?

- [x] A. A `PostToolUse` hook that normalizes heterogeneous tool results before the model processes them.
- [ ] B. A `PreToolUse` hook that rewrites the user's message.
- [ ] C. A system-prompt instruction asking the model to "please normalize dates."
- [ ] D. Increasing `max_tokens` so the model has room to normalize.

**Explanation:** `PostToolUse` hooks intercept tool results and can transform/normalize them (e.g., unify timestamp formats) before the model reasons over them, a deterministic normalization point.

**Why not B:** `PreToolUse` fires before execution and targets the call, not the heterogeneous results.

**Why not C:** Prompt-based normalization is probabilistic and inconsistent across formats.

**Why not D:** Token budget doesn't normalize data.

## D1-Q44

- task: 1.5
- scenario: 1
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

Business policy: refunds above $500 must never execute automatically. Which mechanism guarantees compliance?

- [x] A. A tool-call interception hook that blocks `process_refund` when the amount exceeds $500 and redirects to human escalation.
- [ ] B. A system-prompt sentence discouraging large refunds.
- [ ] C. A few-shot example showing a $500 refund being declined.
- [ ] D. Lowering the model temperature.

**Explanation:** Intercepting outgoing tool calls to block policy-violating actions (refunds > $500) and redirect to an alternative workflow provides guaranteed compliance.

**Why not B:** Probabilistic prompt/example approaches can't guarantee the block for money-moving actions.

**Why not C:** Probabilistic prompt/example approaches can't guarantee the block for money-moving actions.

**Why not D:** Temperature doesn't enforce business rules.

## D1-Q45

- task: 1.5
- scenario: 1
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

What is the core distinction the guide draws between hooks and prompt instructions for compliance?

- [ ] A. Hooks are slower but identical in guarantee to prompts.
- [ ] B. Neither can enforce anything.
- [ ] C. Prompts are deterministic; hooks are probabilistic.
- [x] D. Hooks provide deterministic guarantees; prompt instructions provide only probabilistic compliance.

**Explanation:** Hooks give deterministic enforcement; prompts yield probabilistic compliance, choose hooks when business rules require guarantees.

**Why not A:** The guarantees differ; that's the whole point.

**Why not B:** Hooks can and do enforce.

**Why not C:** Reverses the truth.

## D1-Q46

- task: 1.5
- scenario: 1
- mock: true
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

A `PostToolUse` hook is best described as intercepting which part of the tool lifecycle?

- [x] A. The tool result after execution, before the model processes it.
- [ ] B. The user's prompt before submission.
- [ ] C. The model's final answer before display only.
- [ ] D. The API authentication handshake.

**Explanation:** `PostToolUse` fires after a tool executes and can transform the result before the model consumes it.

**Why not B:** That's `UserPromptSubmit`.

**Why not C:** Rewriting final display text is a different event.

**Why not D:** Hooks don't manage auth handshakes.

## D1-Q47

- task: 1.5
- scenario: 1
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

You need to *block* a tool call before it executes and, in some cases, substitute safer input. Which event supports blocking/denying and modifying the call input?

- [ ] A. `PostToolUse`.
- [ ] B. `Stop`.
- [ ] C. `SessionEnd`.
- [x] D. `PreToolUse`.

**Explanation:** `PreToolUse` fires before execution and can deny/allow/ask and rewrite tool input (`updatedInput`).

**Why not A:** `PostToolUse` runs after execution and can't prevent it.

**Why not B:** `Stop` concerns turn completion, not tool interception.

**Why not C:** `SessionEnd` fires once at session close.

## D1-Q48

- task: 1.5
- scenario: 1
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

Which scenario is the *best* justification for choosing a hook over prompt-based enforcement?

- [x] A. A regulatory rule requires that refunds over a threshold are always routed to a human, with zero tolerance for exceptions.
- [ ] B. You want the agent to prefer British spelling in replies.
- [ ] C. You'd like the agent to be friendlier.
- [ ] D. You want slightly shorter responses.

**Explanation:** Zero-tolerance business rules demand deterministic hook enforcement; the others are soft preferences.

**Why not B:** Stylistic preferences are fine to handle via prompt; they don't need guaranteed enforcement.

**Why not C:** Stylistic preferences are fine to handle via prompt; they don't need guaranteed enforcement.

**Why not D:** Stylistic preferences are fine to handle via prompt; they don't need guaranteed enforcement.

## D1-Q49

- task: 1.5
- scenario: 1
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

After adding a `PostToolUse` normalization hook, the agent still occasionally reasons over raw Unix timestamps. What is the most likely cause?

- [x] A. The hook matcher doesn't cover the specific tool(s) emitting Unix timestamps, so their results bypass normalization.
- [ ] B. Hooks cannot normalize timestamps at all.
- [ ] C. The model ignores all tool results.
- [ ] D. `PostToolUse` runs before the tool executes.

**Explanation:** If a hook's matcher doesn't include a given tool, that tool's output isn't normalized, the gap is in matcher coverage.

**Why not B:** Hooks can normalize output; that's their purpose here.

**Why not C:** The model does use tool results.

**Why not D:** `PostToolUse` runs *after* execution.

## D1-Q50

- task: 1.5
- scenario: 1
- mock: true
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

Which statement about combining hooks and prompts is most accurate for a production support agent?

- [x] A. Use hooks for guaranteed compliance (blocking, normalization) and prompts for adaptable judgment (tone, ambiguity handling).
- [ ] B. Use prompts for everything; hooks are deprecated.
- [ ] C. Use hooks for everything; prompts are deprecated.
- [ ] D. Never combine them; pick one per agent.

**Explanation:** The layered approach uses deterministic hooks where guarantees matter and prompts where flexible judgment is preferable.

**Why not B:** Neither mechanism is deprecated; each has a distinct role.

**Why not C:** Neither mechanism is deprecated; each has a distinct role.

**Why not D:** Combining them is exactly the recommended production pattern.

## D1-Q51

- task: 1.5
- scenario: 1
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

A `PreToolUse` hook returns a deny decision with a reason when it detects a disallowed operation. What does the agent experience?

- [ ] A. The tool runs anyway and the reason is ignored.
- [ ] B. The user is silently logged out.
- [ ] C. The entire session terminates.
- [x] D. The tool call is blocked and Claude is shown the reason so it can choose an alternative path.

**Explanation:** A `PreToolUse` deny blocks the call and surfaces the reason to Claude, enabling it to redirect (e.g., escalate).

**Why not A:** Deny prevents execution.

**Why not B:** No logout occurs.

**Why not C:** Blocking a call doesn't end the session.

## D1-Q52

- task: 1.5
- scenario: 1
- docs: [Hooks, PreToolUse / PostToolUse interception](https://code.claude.com/docs/en/hooks)

Your MCP tools return status as numeric codes (`0`, `1`, `2`) but the agent must reason in human terms. Where is the cleanest, deterministic place to translate these?

- [x] A. A `PostToolUse` hook that maps numeric codes to human-readable statuses before the model sees them.
- [ ] B. Ask the model in the system prompt to memorize the code table.
- [ ] C. Rely on the model to guess code meanings.
- [ ] D. Store the mapping in `.mcp.json`.

**Explanation:** `PostToolUse` normalization deterministically maps numeric codes to readable statuses before the model reasons, consistent and reliable.

**Why not B:** Prompt memorization is probabilistic and clutters context.

**Why not C:** Guessing is unreliable.

**Why not D:** `.mcp.json` configures servers, not result transformations.

## D1-Q53

- task: 1.6
- scenario: 5
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

A code-review workflow always reviews the same fixed aspects (style, security, tests) in the same order for every PR. Which decomposition pattern fits best?

- [ ] A. Dynamic adaptive decomposition based on intermediate findings.
- [ ] B. Random ordering of steps each run.
- [ ] C. No decomposition; one giant prompt.
- [x] D. A fixed sequential pipeline (prompt chaining) of predictable steps.

**Explanation:** Predictable, multi-aspect reviews suit fixed sequential pipelines (prompt chaining).

**Why not A:** Dynamic decomposition is for open-ended tasks where next steps depend on findings.

**Why not B:** Random ordering adds no value and hurts reproducibility.

**Why not C:** A single giant prompt dilutes attention across aspects.

## D1-Q54

- task: 1.6
- scenario: 4
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

The task is "add comprehensive tests to a large legacy codebase," where the right subtasks aren't known upfront. Which approach does the guide recommend?

- [x] A. Dynamic adaptive decomposition: map structure, identify high-impact areas, then build a prioritized plan that adapts as dependencies are discovered.
- [ ] B. A rigid pre-planned sequence written before looking at the code.
- [ ] C. A single prompt: "write all the tests."
- [ ] D. Randomly pick files to test until time runs out.

**Explanation:** Open-ended tasks call for adaptive decomposition that generates subtasks from what's discovered at each step.

**Why not B:** A rigid pre-plan can't anticipate discovered dependencies.

**Why not C:** One prompt won't reliably cover a large legacy codebase.

**Why not D:** Random selection ignores impact and dependencies.

## D1-Q55

- task: 1.6 (+4.6)
- group: 1.6
- scenario: 5
- mock: true
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

A 40-file review produces inconsistent depth and contradictory findings when done in one pass. Which decomposition fixes attention dilution?

- [x] A. Analyze each file individually for local issues, then run a separate cross-file integration pass.
- [ ] B. Add more files to the single pass.
- [ ] C. Switch to a larger context window and keep the single pass.
- [ ] D. Require developers to submit fewer files.

**Explanation:** Splitting into per-file local passes plus a cross-file integration pass avoids attention dilution and contradictory findings.

**Why not B:** More files worsen dilution.

**Why not C:** Larger context doesn't solve attention-quality dilution across many files.

**Why not D:** Shifts burden to developers without fixing the review method.

## D1-Q56

- task: 1.6
- scenario: 5
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

When should you prefer a fixed sequential pipeline over dynamic decomposition?

- [ ] A. When the task is open-ended and next steps depend on what you find.
- [ ] B. Whenever subagents are involved.
- [ ] C. Whenever the codebase is legacy.
- [x] D. When the review has predictable, multi-aspect structure known in advance.

**Explanation:** Fixed pipelines suit predictable multi-aspect work; dynamic decomposition suits open-ended investigation.

**Why not A:** That's the case for dynamic decomposition.

**Why not B:** Neither "legacy" nor "subagents" alone dictates the pattern; predictability does.

**Why not C:** Neither "legacy" nor "subagents" alone dictates the pattern; predictability does.

## D1-Q57

- task: 1.6
- scenario: 4
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

What is the value of an *adaptive investigation plan* in complex workflows?

- [x] A. It generates subtasks based on what is discovered at each step, adapting as dependencies surface.
- [ ] B. It fixes all subtasks before any exploration.
- [ ] C. It removes the need for any planning.
- [ ] D. It guarantees fewer total steps than any other method.

**Explanation:** Adaptive plans derive subtasks from intermediate discoveries, adjusting to newly-found dependencies.

**Why not B:** That's a fixed plan, not adaptive.

**Why not C:** Adaptive planning is still planning.

**Why not D:** It optimizes for coverage/correctness, not minimal step count.

## D1-Q58

- task: 1.6
- scenario: 5
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

For a large multi-file code review, why split into "per-file local analysis" plus a "cross-file integration" pass rather than one combined pass?

- [ ] A. It uses more tokens, which improves quality.
- [ ] B. Single passes are impossible in Claude Code.
- [ ] C. It lets you skip the integration concerns entirely.
- [x] D. Per-file passes keep local analysis consistent, while a dedicated integration pass catches cross-file data-flow issues, avoiding dilution and contradictions.

**Explanation:** The two-tier split preserves local depth and separately handles cross-file concerns, preventing attention dilution and contradictory findings.

**Why not A:** More tokens isn't the mechanism; focused attention is.

**Why not B:** Single passes are possible but worse for many files.

**Why not C:** Integration concerns are handled, not skipped.

## D1-Q59

- task: 1.6
- scenario: 5
- mock: true
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

Which task is the *clearest* fit for prompt chaining (fixed sequential decomposition)?

- [x] A. "For each file, run the standard lint→type→security checklist, then produce a summary."
- [ ] B. "Explore this unfamiliar system and figure out what to refactor."
- [ ] C. "Discover the root cause of an intermittent production incident."
- [ ] D. "Design a new microservice architecture."

**Explanation:** A repeatable per-file checklist is predictable and multi-aspect, ideal for prompt chaining.

**Why not B:** Each is open-ended/architectural, favoring dynamic or plan-mode approaches.

**Why not C:** Each is open-ended/architectural, favoring dynamic or plan-mode approaches.

**Why not D:** Each is open-ended/architectural, favoring dynamic or plan-mode approaches.

## D1-Q60

- task: 1.6
- scenario: 4
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

A dynamic decomposition for "add tests to legacy code" first maps structure and identifies high-impact areas. Why prioritize before generating all subtasks?

- [x] A. To ensure the plan adapts as dependencies are discovered and effort targets the highest-impact areas.
- [ ] B. To guarantee alphabetical file coverage.
- [ ] C. Because Claude cannot read more than one file.
- [ ] D. To avoid using any tools.

**Explanation:** Prioritizing high-impact areas and adapting as dependencies surface is the core of effective dynamic decomposition.

**Why not B:** Alphabetical coverage ignores impact.

**Why not C:** Claude can read many files.

**Why not D:** Tools are essential to exploration.

## D1-Q61

- task: 1.6 (+4.6)
- group: 1.6
- scenario: 5
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

Which is a symptom that a *single-pass* decomposition is diluting attention on a large review?

- [x] A. The review flags a pattern as problematic in one file while approving identical code elsewhere in the same PR.
- [ ] B. The review finishes faster than expected.
- [ ] C. The review uses the `Grep` tool.
- [ ] D. The review references a CLAUDE.md file.

**Explanation:** Contradictory findings on identical code are a hallmark of attention dilution in a single combined pass, fixed by splitting into focused passes.

**Why not B:** Speed alone isn't a dilution symptom.

**Why not C:** Using Grep or reading CLAUDE.md are normal, not symptoms.

**Why not D:** Using Grep or reading CLAUDE.md are normal, not symptoms.

## D1-Q62

- task: 1.6
- scenario: 4
- docs: [Common workflows, task decomposition](https://code.claude.com/docs/en/common-workflows)

You must choose a decomposition strategy for a workflow whose steps are *unknown* until earlier results arrive. Which is most appropriate?

- [ ] A. Fixed prompt chaining defined before execution.
- [ ] B. Randomized step selection.
- [ ] C. A single monolithic prompt.
- [x] D. Dynamic adaptive decomposition that generates subtasks from intermediate findings.

**Explanation:** Unknown-until-discovered steps require dynamic adaptive decomposition.

**Why not A:** Fixed chaining can't handle emergent steps.

**Why not B:** Randomization is not a strategy.

**Why not C:** Monolithic prompts dilute focus and miss discovered dependencies.

## D1-Q63

- task: 1.7
- scenario: 4
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

You want to continue a specific named investigation from yesterday. Which mechanism is correct?

- [x] A. `--resume <session-name>` to continue that specific prior conversation.
- [ ] B. `fork_session` to branch a new divergent copy.
- [ ] C. Start a brand-new session with no history.
- [ ] D. `/compact` to shrink context.

**Explanation:** Named session resumption via `--resume <session-name>` continues a specific prior conversation.

**Why not B:** Forking creates a divergent branch, not a continuation of the same line.

**Why not C:** A fresh session loses the prior investigation context.

**Why not D:** `/compact` reduces context but isn't a resumption mechanism.

## D1-Q64

- task: 1.7
- scenario: 4
- mock: true
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

You resume a session after editing several files Claude previously analyzed. What should you do to avoid stale reasoning?

- [x] A. Inform the agent which specific files changed so it can re-analyze those targeted areas.
- [ ] B. Say nothing; Claude will detect all changes automatically.
- [ ] C. Delete the session and lose all context.
- [ ] D. Increase `max_tokens`.

**Explanation:** When resuming after modifications, inform the agent about changed files so it can re-analyze the affected areas rather than trusting stale results.

**Why not B:** The agent won't automatically know what changed on disk between sessions.

**Why not C:** Deleting throws away useful context needlessly.

**Why not D:** Token budget doesn't refresh stale file knowledge.

## D1-Q65

- task: 1.7
- scenario: 4
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

Prior tool results in an old session are now badly out of date. Which is more reliable, resuming or starting fresh with a structured summary?

- [ ] A. Always resume; stale results are fine.
- [ ] B. Never start fresh; it loses too much.
- [ ] C. Fork the stale session repeatedly.
- [x] D. Start a new session seeded with a structured summary, because resuming with stale tool results is unreliable.

**Explanation:** When prior tool results are stale, a fresh session with an injected structured summary is more reliable than resuming stale context.

**Why not A:** Stale results cause incorrect reasoning.

**Why not B:** Fresh-with-summary is exactly the recommended path here.

**Why not C:** Forking stale state propagates the staleness.

## D1-Q66

- task: 1.7
- scenario: 4
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

When is *resuming* (rather than starting fresh) the better choice?

- [x] A. When prior context is mostly still valid.
- [ ] B. When every prior tool result is stale.
- [ ] C. When you want two divergent branches.
- [ ] D. When you need to delete history.

**Explanation:** Resume when prior context is mostly valid; start fresh (with a summary) when it's stale.

**Why not B:** Stale context favors fresh start.

**Why not C:** Divergent branches call for `fork_session`.

**Why not D:** Resumption isn't about deletion.

## D1-Q67

- task: 1.7
- scenario: 4
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

You want to compare two refactoring approaches that both start from the same completed codebase analysis. Which is the best mechanism?

- [x] A. `fork_session` from the shared analysis baseline into two branches.
- [ ] B. `--resume` the analysis session twice sequentially.
- [ ] C. Two unrelated fresh sessions.
- [ ] D. A single session that tries both approaches interleaved.

**Explanation:** `fork_session` branches independent explorations from a shared baseline, ideal for comparing approaches.

**Why not B:** Sequential resumes don't yield independent parallel branches.

**Why not C:** Fresh sessions discard the shared analysis.

**Why not D:** Interleaving two approaches in one session muddles the comparison.

## D1-Q68

- task: 1.7
- scenario: 4
- mock: true
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

A resumed session gives a targeted fix. Rather than re-exploring everything, what's the efficient move after small code changes?

- [ ] A. Re-run the full exploration from scratch.
- [ ] B. Discard the session.
- [ ] C. Fork the session five times.
- [x] D. Inform the resumed session about the specific file changes so it re-analyzes only those, avoiding full re-exploration.

**Explanation:** Informing a resumed session about specific changes enables targeted re-analysis instead of full re-exploration.

**Why not A:** Full re-exploration wastes time and context.

**Why not B:** Discarding loses valid context.

**Why not C:** Forking doesn't target the changed files.

## D1-Q69

- task: 1.7
- scenario: 4
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

Which statement about `fork_session` vs `--resume` is correct?

- [x] A. `fork_session` creates independent branches from a shared baseline; `--resume` continues a specific existing session.
- [ ] B. `--resume` creates divergent branches; `fork_session` continues a single line.
- [ ] C. Both delete the original session.
- [ ] D. Both require an MCP server.

**Explanation:** `fork_session` branches from a baseline; `--resume` continues a named/specific session.

**Why not B:** Reverses their behaviors.

**Why not C:** Neither deletes the original.

**Why not D:** Neither requires MCP.

## D1-Q70

- task: 1.7
- scenario: 4
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

After a long refactor across sessions, you want to keep working on the *same* investigation tomorrow without re-establishing context. What's the intended workflow?

- [x] A. Name the session and use `--resume <session-name>` to continue it across work sessions.
- [ ] B. Copy-paste the entire transcript into a new prompt each day.
- [ ] C. Fork a new session every morning.
- [ ] D. Rely on the model remembering across unrelated sessions automatically.

**Explanation:** Named sessions plus `--resume <session-name>` are designed for continuing the same investigation across work sessions.

**Why not B:** Manual paste is error-prone and unnecessary.

**Why not C:** Forking creates divergence, not continuity.

**Why not D:** Sessions don't share memory automatically.

## D1-Q71

- task: 1.7
- scenario: 4
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

Which is the *safest* reason to start a fresh session with an injected summary rather than resuming?

- [ ] A. You changed the session's display color.
- [ ] B. The model version number incremented by a patch.
- [ ] C. You want a shorter session name.
- [x] D. The prior session's tool results (file contents, query outputs) are now stale and could mislead reasoning.

**Explanation:** Stale tool results are the key trigger for a fresh, summary-seeded session, they can actively mislead if resumed.

**Why not A:** Cosmetic or trivial changes don't justify abandoning valid context.

**Why not B:** Cosmetic or trivial changes don't justify abandoning valid context.

**Why not C:** Cosmetic or trivial changes don't justify abandoning valid context.

## D1-Q72

- task: 1.7
- scenario: 4
- docs: [Managing sessions, resume & fork](https://code.claude.com/docs/en/sessions)

You resume a session where Claude had mapped a module, but two classes were since renamed. What's the correct, minimal intervention?

- [x] A. Tell the resumed session exactly which classes were renamed so it updates its model of those, not the whole codebase.
- [ ] B. Force a full re-exploration of every module.
- [ ] C. Ignore it; the old names are close enough.
- [ ] D. Start a brand-new session and re-analyze everything.

**Explanation:** Targeted notification of the specific changes lets the resumed session re-analyze only what changed, minimal and reliable.

**Why not B:** Full re-exploration is wasteful when only two classes changed.

**Why not C:** Using stale names produces incorrect references.

**Why not D:** Full re-exploration is wasteful when only two classes changed.
