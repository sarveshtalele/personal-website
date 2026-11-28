---
domain: 2
name: Tool Design & MCP Integration
weight: 18%
---

<!--
  Domain 2 question bank. Edit freely, then run `pnpm claude:build` (also runs on dev/build).
  Format guide: see src/content/claude/README.md
-->

# Task statements

### 2.1 Design effective tool interfaces with clear descriptions and boundaries

Descriptions are the primary tool-selection signal; include input formats, example queries, edge cases, boundaries; ambiguous/overlapping descriptions cause misrouting; keyword-sensitive system-prompt wording can create unintended tool associations; split generic tools into purpose-specific ones.

Docs: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

### 2.2 Implement structured error responses for MCP tools

MCP `isError` flag; distinguish transient / validation / business / permission errors; return `errorCategory`, `isRetryable`, human-readable descriptions; local recovery in subagents; distinguish access failures from valid empty results.

Docs: https://code.claude.com/docs/en/mcp

### 2.3 Distribute tools appropriately across agents and configure tool choice

Too many tools (e.g., 18 vs 4-5) degrades selection reliability; agents misuse out-of-specialization tools; scoped access with limited cross-role tools; `tool_choice` `auto` / `any` / forced (`{"type":"tool","name":"…"}`).

Docs: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

### 2.4 Integrate MCP servers into Claude Code and agent workflows

Project scope (`.mcp.json`) vs user scope (`~/.claude.json`); env-var expansion (`${GITHUB_TOKEN}`); all configured servers discovered at connect time and available simultaneously; MCP resources for content catalogs; prefer existing community servers for standard integrations.

Docs: https://code.claude.com/docs/en/mcp

### 2.5 Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively

Grep for content search; Glob for path patterns; Read/Write for full-file ops; Edit for unique-match modifications; Read+Write fallback when Edit can't find a unique anchor; build understanding incrementally (Grep entry points → Read to follow imports).

Docs: https://code.claude.com/docs/en/settings

# Questions

## D2-Q01

- task: 2.1
- scenario: 1
- mock: true
- official: true
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Logs show the agent frequently calls `get_customer` when users ask about orders (e.g., "check my order #12345") instead of `lookup_order`. Both tools have minimal descriptions ("Retrieves customer information" / "Retrieves order details") and accept similar identifiers. What is the most effective *first step* to improve tool-selection reliability?

- [x] A. Expand each tool's description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar tools.
- [ ] B. Add few-shot examples to the system prompt showing 5-8 order queries routing to `lookup_order`.
- [ ] C. Implement a routing layer that parses user input and pre-selects the tool by keyword before each turn.
- [ ] D. Consolidate both tools into a single `lookup_entity` tool that inspects the identifier and picks the backend.

**Explanation:** Tool descriptions are the primary mechanism LLMs use for selection. Minimal descriptions leave the model without enough signal to differentiate similar tools; expanding them is the low-effort, high-leverage first fix. (Mirrors official Sample Question 2.)

**Why not B:** Few-shot examples add token overhead without fixing the underlying weak descriptions.

**Why not C:** A routing layer is over-engineered and bypasses the model's natural language understanding.

**Why not D:** Consolidation is a valid architecture choice but is more effort than a "first step" warrants when the real problem is inadequate descriptions.

## D2-Q02

- task: 2.1
- scenario: 6
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Why do near-identical descriptions for `analyze_content` and `analyze_document` cause problems?

- [ ] A. They double the API cost.
- [ ] B. They prevent the tools from loading.
- [ ] C. They exceed the schema size limit.
- [x] D. Ambiguous or overlapping descriptions cause misrouting because the model can't tell which tool to select.

**Explanation:** Overlapping descriptions produce unreliable selection among similar tools, the model has no basis to disambiguate.

**Why not A:** Cost isn't the described failure.

**Why not B:** The tools load; they're just misrouted.

**Why not C:** There's no size-limit issue implied.

## D2-Q03

- task: 2.1
- scenario: 3
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

To eliminate overlap between `analyze_content` and a web-specific tool, which change is recommended?

- [x] A. Rename `analyze_content` to `analyze_web_results` and give it a web-specific description.
- [ ] B. Delete both tools.
- [ ] C. Give both tools the identical description.
- [ ] D. Hide the tools from the model.

**Explanation:** Renaming and updating descriptions to be purpose-specific (e.g., `analyze_web_results` with a web-specific description) removes functional overlap.

**Why not B:** Deleting needed tools removes capability.

**Why not C:** Identical descriptions worsen ambiguity.

**Why not D:** Hidden tools can't be selected at all.

## D2-Q04

- task: 2.1
- scenario: 6
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A generic `analyze_document` tool is misused across many tasks. The guide's recommended refactor is to split it into purpose-specific tools. Which split reflects that guidance?

- [ ] A. `analyze_document_1`, `analyze_document_2`, `analyze_document_3`.
- [ ] B. Keep it generic but raise `max_tokens`.
- [ ] C. One tool with a giant description.
- [x] D. `extract_data_points`, `summarize_content`, and `verify_claim_against_source`, each with defined input/output contracts.

**Explanation:** Splitting a generic tool into purpose-specific tools with defined I/O contracts (`extract_data_points`, `summarize_content`, `verify_claim_against_source`) improves selection and reliability.

**Why not A:** Numbered clones don't clarify purpose.

**Why not B:** Token budget doesn't fix overloaded tool semantics.

**Why not C:** A giant description doesn't disambiguate distinct purposes.

## D2-Q05

- task: 2.1
- scenario: 1
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A well-written tool description is still being ignored; the model keeps associating a tool with the wrong intent. What subtle cause should you check?

- [x] A. The system prompt contains keyword-sensitive wording that creates an unintended tool association overriding the description.
- [ ] B. The tool has too few characters in its name.
- [ ] C. The model cannot read tool descriptions at all.
- [ ] D. The `.mcp.json` file is missing.

**Explanation:** System-prompt wording can be keyword-sensitive and create unintended tool associations that override even good descriptions; review the prompt for such triggers.

**Why not B:** Name length isn't the described mechanism.

**Why not C:** Models do use tool descriptions.

**Why not D:** A missing `.mcp.json` would prevent loading, not cause misassociation.

## D2-Q06

- task: 2.1
- scenario: 6
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which elements does the guide say belong in a high-quality tool description?

- [x] A. Input formats, example queries, edge cases, and boundary explanations (when to use vs similar tools).
- [ ] B. Only the tool's name.
- [ ] C. The server's IP address.
- [ ] D. The developer's contact email.

**Explanation:** Effective descriptions include input formats, example queries, edge cases, and boundaries distinguishing the tool from similar ones.

**Why not B:** A name alone is insufficient for reliable selection.

**Why not C:** Infrastructure/contact details don't aid selection.

**Why not D:** Infrastructure/contact details don't aid selection.

## D2-Q07

- task: 2.1
- scenario: 6
- mock: true
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

What is the primary mechanism an LLM uses to choose among available tools?

- [ ] A. Alphabetical order of tool names.
- [ ] B. Random selection weighted by token count.
- [ ] C. The order tools were registered.
- [x] D. The tool descriptions.

**Explanation:** Tool descriptions are the primary selection signal; their quality directly determines routing reliability.

**Why not A:** None reflects how the model actually reasons about tool choice.

**Why not B:** None reflects how the model actually reasons about tool choice.

**Why not C:** None reflects how the model actually reasons about tool choice.

## D2-Q08

- task: 2.1/2.3
- group: 2.1
- scenario: 3
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

You replace a broad `fetch_url` tool with a constrained `load_document` that validates document URLs. What tool-design principle does this illustrate?

- [x] A. Replacing generic tools with constrained alternatives that encode boundaries reduces misuse.
- [ ] B. Adding more tools always improves reliability.
- [ ] C. Tool names should be as generic as possible.
- [ ] D. Validation belongs only in the model's reasoning, never in tools.

**Explanation:** Constrained, purpose-specific tools (e.g., `load_document` validating URLs) reduce misuse compared to generic ones.

**Why not B:** More tools can *hurt* selection reliability (see 2.3).

**Why not C:** Generic names invite ambiguity.

**Why not D:** Encoding validation in the tool is exactly the recommended constraint.

## D2-Q09

- task: 2.1
- scenario: 6
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Two tools legitimately have related purposes. What description content most reduces misrouting between them?

- [ ] A. Marketing language emphasizing speed.
- [ ] B. Removing all examples to keep descriptions short.
- [ ] C. Identical text so the model treats them the same.
- [x] D. An explicit "use this when… / use the other when…" boundary statement in each description.

**Explanation:** Explicit boundary statements ("use X when…, use Y when…") differentiate related tools and reduce misrouting.

**Why not A:** Marketing language doesn't aid selection.

**Why not B:** Examples and boundaries are what disambiguate.

**Why not C:** Identical text maximizes confusion.

## D2-Q10

- task: 2.1/2.3
- group: 2.1
- scenario: 3
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A synthesis agent occasionally invokes a web-search tool it shouldn't. Beyond tool distribution, which *description-level* fix helps?

- [x] A. Make the web-search description explicitly state it is for retrieving fresh web results and not for synthesis tasks.
- [ ] B. Delete the synthesis agent.
- [ ] C. Give the synthesis agent more unrelated tools.
- [ ] D. Remove all descriptions.

**Explanation:** Sharpening boundaries in the description (what the tool is and isn't for) reduces inappropriate selection.

**Why not B:** Deleting the agent is drastic and unrelated to descriptions.

**Why not C:** More tools worsen selection.

**Why not D:** Removing descriptions removes the selection signal.

## D2-Q11

- task: 2.1
- scenario: 1
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which statement about the relationship between system prompts and tool descriptions is correct?

- [x] A. Keyword-sensitive system-prompt instructions can create unintended tool associations, so prompts should be reviewed for wording that might override tool descriptions.
- [ ] B. System prompts never influence tool selection.
- [ ] C. Tool descriptions always override system prompts entirely.
- [ ] D. Only the system prompt matters; descriptions are ignored.

**Explanation:** Reviewing system prompts for keyword-sensitive instructions prevents them from overriding well-written descriptions.

**Why not B:** Prompts can influence selection.

**Why not C:** Descriptions don't always win; prompt keywords can override.

**Why not D:** Descriptions are the primary selection signal, not ignored.

## D2-Q12

- task: 2.1
- scenario: 6
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

What is the best rationale for including *example queries* in a tool description?

- [ ] A. They increase the tool's execution speed.
- [ ] B. They replace the need for a description entirely.
- [ ] C. They are required by the MCP protocol.
- [x] D. They demonstrate the shape of inputs the tool handles, helping the model route matching requests to it.

**Explanation:** Example queries show the model what inputs the tool expects, improving routing of similar requests.

**Why not A:** Examples don't affect execution speed.

**Why not B:** Examples supplement, not replace, the description.

**Why not C:** They're a best practice, not a protocol requirement.

## D2-Q13

- task: 2.1
- scenario: 6
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A team keeps adding capabilities to one `do_everything` tool. What tool-interface problem does this create?

- [x] A. It becomes impossible to write a clear description that differentiates its many behaviors, harming selection and predictability.
- [ ] B. It automatically improves selection reliability.
- [ ] C. It reduces token usage to zero.
- [ ] D. It prevents the model from ever calling it.

**Explanation:** Overloaded tools resist clear, bounded descriptions; splitting into purpose-specific tools with I/O contracts is preferred.

**Why not B:** Overloading harms, not helps, selection.

**Why not C:** It doesn't zero out tokens.

**Why not D:** The model can still call it, just unreliably.

## D2-Q14

- task: 2.1
- scenario: 1
- mock: true
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which is the *strongest* signal that your tool descriptions, not the model, are the cause of misrouting?

- [x] A. The model routes correctly once descriptions are expanded with formats, examples, and boundaries.
- [ ] B. The model always refuses to call any tool.
- [ ] C. The API returns 500 errors.
- [ ] D. The tools are written in different languages.

**Explanation:** If expanding descriptions (formats, examples, boundaries) resolves the misrouting, the descriptions were the root cause.

**Why not B:** Total refusal points to a different issue.

**Why not C:** Server errors are infrastructure, not description quality.

**Why not D:** Implementation language doesn't drive selection.

## D2-Q15

- task: 2.1
- scenario: 6
- docs: [Tool use, defining tools & descriptions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

For the extraction scenario, splitting `analyze_document` into `extract_data_points`, `summarize_content`, and `verify_claim_against_source` primarily improves what?

- [x] A. The model's ability to select the right operation and produce predictable outputs per contract.
- [ ] B. The physical storage of documents.
- [ ] C. The network latency of MCP.
- [ ] D. The billing currency.

**Explanation:** Purpose-specific tools with defined contracts improve selection accuracy and output predictability.

**Why not B:** None relates to tool-selection or output contracts.

**Why not C:** None relates to tool-selection or output contracts.

**Why not D:** None relates to tool-selection or output contracts.

## D2-Q16

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

Your MCP tools return a generic `"Operation failed"` on every error. Why does the guide consider this harmful?

- [x] A. Uniform error responses prevent the agent from making appropriate recovery decisions.
- [ ] B. It uses too many tokens.
- [ ] C. It violates the JSON schema.
- [ ] D. It doubles latency.

**Explanation:** Generic errors strip the metadata the agent needs to decide whether to retry, escalate, or explain, blocking appropriate recovery.

**Why not B:** Generic strings are short, not token-heavy.

**Why not C:** It doesn't inherently break schemas.

**Why not D:** It doesn't inherently affect latency.

## D2-Q17

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

Which structured metadata should an MCP tool return to enable intelligent error handling?

- [x] A. `errorCategory` (transient/validation/permission/business), `isRetryable` boolean, and a human-readable description.
- [ ] B. Only an HTTP status number.
- [ ] C. A random error ID with no meaning.
- [ ] D. The full stack trace and nothing else.

**Explanation:** Structured error metadata, category, retryability, and a readable description, lets the agent choose the right recovery.

**Why not B:** A bare status code lacks category/retryability guidance.

**Why not C:** A meaningless ID gives no decision signal.

**Why not D:** A stack trace alone isn't an actionable, categorized error.

## D2-Q18

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

A business-rule violation (e.g., refund exceeds policy) should be returned to the agent how?

- [ ] A. As a transient error with `isRetryable: true`.
- [ ] B. As a permission error requiring credentials.
- [ ] C. As a silent empty result.
- [x] D. With `isRetryable: false` plus a customer-friendly explanation so the agent communicates appropriately.

**Explanation:** Business violations are non-retryable; flag `isRetryable: false` and include a customer-friendly explanation so the agent responds correctly.

**Why not A:** Retrying a policy violation will just fail again.

**Why not B:** It's a policy issue, not a credentials issue.

**Why not C:** Silent empties hide the reason from the agent.

## D2-Q19

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

Why does distinguishing retryable from non-retryable errors matter?

- [x] A. Returning structured retryability prevents wasted retry attempts on errors that will never succeed.
- [ ] B. It changes the tool's color in the UI.
- [ ] C. It's required for billing.
- [ ] D. It has no practical effect.

**Explanation:** Retryability metadata prevents the agent from wasting attempts on permanently-failing operations.

**Why not B:** UI color is irrelevant.

**Why not C:** Not a billing requirement.

**Why not D:** It materially changes recovery behavior.

## D2-Q20

- task: 2.2/5.3
- group: 2.2
- scenario: 3
- mock: true
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

A subagent hits a transient timeout on a non-critical lookup. What does the guide recommend before escalating to the coordinator?

- [ ] A. Immediately terminate the whole workflow.
- [ ] B. Retry forever with no cap.
- [ ] C. Return an empty result marked as success.
- [x] D. Implement local error recovery within the subagent for transient failures, propagating to the coordinator only errors it cannot resolve locally, along with partial results and what was attempted.

**Explanation:** Subagents should recover locally from transient failures and only propagate unrecoverable errors (with partial results and attempt context) to the coordinator.

**Why not A:** Terminating everything on one transient failure is an anti-pattern.

**Why not B:** Unbounded retries risk hangs.

**Why not C:** Marking failure as success hides the error and corrupts results.

## D2-Q21

- task: 2.2/5.3
- group: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

A query legitimately returns no matching records. How should the tool represent this versus a failure?

- [x] A. Return a valid empty result distinguished from an access failure, so the agent treats "no matches" differently from "couldn't access."
- [ ] B. Return an error so the agent retries.
- [ ] C. Return `"Operation failed"`.
- [ ] D. Return partial fabricated records to avoid emptiness.

**Explanation:** Valid empty results (successful query, no matches) must be distinguished from access failures so the agent doesn't retry a legitimately empty result or treat a failure as empty.

**Why not B:** An empty result isn't an error to retry.

**Why not C:** Generic failure conflates the two cases.

**Why not D:** Fabricating records is a serious correctness/hallucination bug.

## D2-Q22

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

What is the purpose of the MCP `isError` flag?

- [x] A. To communicate tool failures back to the agent.
- [ ] B. To indicate the tool is deprecated.
- [ ] C. To toggle verbose logging.
- [ ] D. To set the tool's priority.

**Explanation:** The MCP `isError` flag signals tool failures back to the agent so it can handle them.

**Why not B:** None reflects the `isError` flag's defined role.

**Why not C:** None reflects the `isError` flag's defined role.

**Why not D:** None reflects the `isError` flag's defined role.

## D2-Q23

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

Which categories does the guide use to classify MCP tool errors?

- [ ] A. Red, yellow, green.
- [ ] B. Client and server only.
- [ ] C. Fatal and non-fatal only.
- [x] D. Transient, validation, business, and permission errors.

**Explanation:** The guide distinguishes transient, validation, business, and permission errors, each implying different recovery.

**Why not A:** Not a real taxonomy here.

**Why not B:** Too coarse; they miss the actionable categories.

**Why not C:** Too coarse; they miss the actionable categories.

## D2-Q24

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

An agent keeps retrying a validation error caused by malformed input. What metadata would have prevented the wasted retries?

- [x] A. `errorCategory: validation` with `isRetryable: false` (retrying identical bad input won't help; the input must change).
- [ ] B. `isRetryable: true` so it keeps trying.
- [ ] C. No metadata at all.
- [ ] D. A longer human-readable message only.

**Explanation:** Marking validation errors non-retryable (identical input will fail again) prevents wasted retries; the fix is corrected input, not repetition.

**Why not B:** Encourages the exact wasted retries described.

**Why not C:** No metadata leaves the agent guessing.

**Why not D:** A message without retryability still invites blind retries.

## D2-Q25

- task: 2.2/5.3
- group: 2.2
- scenario: 3
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

When a subagent returns partial results plus an unrecoverable error to the coordinator, what should it include to enable intelligent recovery?

- [x] A. The failure type, what was attempted, and any partial results, so the coordinator can decide next steps.
- [ ] B. Only the word "failed."
- [ ] C. A silent success.
- [ ] D. The entire raw log with no structure.

**Explanation:** Structured error context (failure type, attempted action, partial results) enables coordinator recovery decisions.

**Why not B:** "failed" hides the context needed to recover.

**Why not C:** Silent success corrupts downstream reasoning.

**Why not D:** Unstructured logs are hard to act on.

## D2-Q26

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

Why is returning `isRetryable: false` important for permission errors specifically?

- [ ] A. Permission errors are always transient.
- [ ] B. Permission errors should trigger infinite retries.
- [ ] C. Permission errors should be silently ignored.
- [x] D. Retrying without new credentials/permissions will keep failing, so the agent should stop retrying and handle it differently (e.g., escalate).

**Explanation:** Permission failures won't resolve on retry with the same credentials; marking them non-retryable routes the agent to an alternative (e.g., escalation).

**Why not A:** Permission errors aren't transient.

**Why not B:** Infinite retries waste resources and never succeed.

**Why not C:** Ignoring them hides a real access problem.

## D2-Q27

- task: 2.2/5.3
- group: 2.2
- scenario: 1
- mock: true
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

Which pairing of error type → correct agent behavior is right?

- [x] A. Transient timeout → retry (possibly after backoff); business violation → do not retry, explain to the user.
- [ ] B. Transient timeout → do not retry; business violation → retry.
- [ ] C. Both → silently return empty.
- [ ] D. Both → terminate the whole workflow.

**Explanation:** Transient errors are retryable; business violations are non-retryable and should be explained. Matching behavior to category is the goal.

**Why not B:** Reverses the correct behaviors.

**Why not C:** Silent empties hide both.

**Why not D:** Terminating everything is an anti-pattern.

## D2-Q28

- task: 2.2/5.3
- group: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

A tool returns an empty array for "orders in the last 24h" because there genuinely were none. The agent escalates as if the system failed. What's the design fix?

- [ ] A. Make the tool return an error for empty results.
- [ ] B. Retry the query 10 times.
- [ ] C. Fabricate a placeholder order.
- [x] D. Return a valid empty result clearly distinguished from an access failure, so the agent reports "no recent orders" rather than escalating.

**Explanation:** Distinguishing valid empty results from access failures prevents the agent from misinterpreting legitimate emptiness as a failure.

**Why not A:** Turning empties into errors causes false escalations.

**Why not B:** Retrying a correct empty result is wasteful.

**Why not C:** Fabrication is a correctness violation.

## D2-Q29

- task: 2.2
- scenario: 1
- docs: [MCP, tools & structured errors](https://code.claude.com/docs/en/mcp)

What is the benefit of including a *human-readable description* alongside `errorCategory` and `isRetryable`?

- [x] A. It lets the agent explain the situation appropriately to the user or log a meaningful message.
- [ ] B. It replaces the need for categories.
- [ ] C. It is only for developers and never reaches the agent.
- [ ] D. It forces a retry.

**Explanation:** A readable description lets the agent communicate the issue to the user or produce a meaningful log, complementing the machine-readable fields.

**Why not B:** Descriptions complement, not replace, categories.

**Why not C:** The agent uses it to respond appropriately.

**Why not D:** It doesn't force retries; `isRetryable` governs that.

## D2-Q30

- task: 2.3
- scenario: 3
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

An agent has 18 tools and its selection reliability has degraded. What principle explains this?

- [ ] A. More tools always improve reliability.
- [x] B. Giving an agent too many tools increases decision complexity and degrades selection reliability; scope tools to the agent's role (e.g., 4-5 relevant tools).
- [ ] C. Tool count has no effect on selection.
- [ ] D. 18 is the required minimum.

**Explanation:** Excess tools (e.g., 18 vs 4-5) increase decision complexity and reduce selection reliability; scope tools to the role.

**Why not A:** More tools can hurt, not help.

**Why not C:** Count demonstrably affects reliability.

**Why not D:** There's no such minimum.

## D2-Q31

- task: 2.3
- scenario: 3
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A synthesis agent keeps attempting web searches it shouldn't perform. What is the recommended structural fix?

- [ ] A. Give the synthesis agent even more tools.
- [x] B. Restrict each subagent's tool set to those relevant to its role, preventing cross-specialization misuse.
- [ ] C. Remove all tools from every agent.
- [ ] D. Merge all agents into one.

**Explanation:** Agents with out-of-specialization tools tend to misuse them; scoping tool sets to each role prevents this.

**Why not A:** More tools worsen misuse.

**Why not C:** Removing all tools eliminates capability.

**Why not D:** Merging overloads a single agent's selection.

## D2-Q32

- task: 2.3
- scenario: 3
- official: true
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

The synthesis agent needs occasional simple fact-checks (85% of the time) but complex verifications should still route through the coordinator. What is the least-privilege design?

- [x] A. Give the synthesis agent a scoped `verify_fact` tool for simple lookups, while complex verifications continue delegating through the coordinator.
- [ ] B. Give the synthesis agent every web-search tool.
- [ ] C. Batch all verifications and block synthesis until they return.
- [ ] D. Have the web-search agent speculatively cache everything the synthesis agent might need.

**Explanation:** Least privilege: give the synthesis agent a scoped `verify_fact` tool for the 85% simple case while preserving coordinator routing for complex cases. (Mirrors official Sample Question 9.)

**Why not B:** Over-provisions, violating separation of concerns and hurting selection.

**Why not C:** Batching creates blocking dependencies when steps depend on earlier verified facts.

**Why not D:** Speculative caching can't reliably predict what will be needed.

## D2-Q33

- task: 2.3/4.3
- group: 2.3
- scenario: 6
- mock: true
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

You must guarantee that the model calls *some* tool on this turn (never returns plain conversational text). Which `tool_choice` setting achieves that?

- [ ] A. `tool_choice: "auto"`.
- [x] B. `tool_choice: "any"`.
- [ ] C. `tool_choice: {"type": "tool", "name": "..."}`.
- [ ] D. No `tool_choice` at all.

**Explanation:** `tool_choice: "any"` forces the model to call a tool (of its choosing) rather than returning conversational text.

**Why not A:** `auto` allows the model to return text instead of calling a tool.

**Why not C:** Forces a *specific* tool, which is stronger than "any tool" and may be inappropriate.

**Why not D:** Defaults to `auto` behavior.

## D2-Q34

- task: 2.3/4.3
- group: 2.3
- scenario: 6
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

You need `extract_metadata` to run *first*, before enrichment tools, on this turn. Which `tool_choice` fits?

- [ ] A. `tool_choice: "auto"`.
- [ ] B. `tool_choice: "any"`.
- [x] C. Forced selection: `tool_choice: {"type": "tool", "name": "extract_metadata"}`.
- [ ] D. Removing the tool from the list.

**Explanation:** Forcing a specific tool (`{"type":"tool","name":"extract_metadata"}`) guarantees that exact tool is called first, before enrichment steps in follow-up turns.

**Why not A:** `auto` may not call it or may call another tool.

**Why not B:** `any` forces a call but not the *specific* tool you need first.

**Why not D:** Removing the tool prevents it from running at all.

## D2-Q35

- task: 2.3/4.3
- group: 2.3
- scenario: 6
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

What does `tool_choice: "auto"` allow that `"any"` does not?

- [x] A. It allows the model to return conversational text instead of calling a tool.
- [ ] B. It forbids all tool calls.
- [ ] C. It forces a specific named tool.
- [ ] D. It disables the tools entirely.

**Explanation:** With `auto`, the model may respond with text rather than calling a tool; `any` requires a tool call.

**Why not B:** `auto` permits tool calls; it doesn't forbid them.

**Why not C:** Forcing a named tool is a different setting.

**Why not D:** `auto` doesn't disable tools.

## D2-Q36

- task: 2.3
- scenario: 3
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which best describes "scoped cross-role tools"?

- [ ] A. Giving every agent access to all tools.
- [x] B. Providing an agent a limited cross-role tool for a specific high-frequency need, while routing complex cases through the coordinator.
- [ ] C. Forbidding any tool that isn't unique to one agent.
- [ ] D. Randomly assigning tools to agents.

**Explanation:** Scoped cross-role tools address specific high-frequency needs (e.g., `verify_fact`) without over-provisioning, keeping complex cases coordinator-routed.

**Why not A:** Universal access degrades selection.

**Why not C:** A strict no-cross-role rule ignores legitimate high-frequency needs.

**Why not D:** Random assignment is not a design principle.

## D2-Q37

- task: 2.3
- scenario: 3
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Why can an agent with tools outside its specialization degrade quality even if the tools work?

- [ ] A. Extra tools reduce API latency.
- [x] B. Agents tend to misuse out-of-specialization tools (e.g., a synthesis agent attempting web searches), producing lower-quality actions.
- [ ] C. The tools stop functioning.
- [ ] D. It increases the passing score.

**Explanation:** Out-of-specialization tools invite misuse; the synthesis-agent-doing-web-searches example is the canonical case.

**Why not A:** Not a latency issue.

**Why not C:** The tools still function; they're just misapplied.

**Why not D:** Irrelevant to exam scoring.

## D2-Q38

- task: 2.3/4.3
- group: 2.3
- scenario: 6
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A document pipeline must call `extract_metadata` before any enrichment tool runs. After it runs, subsequent steps process results in follow-up turns. Which strategy does the guide describe?

- [x] A. Use `tool_choice` forced selection to ensure `extract_metadata` is called first, then process subsequent steps in follow-up turns.
- [ ] B. Remove all other tools permanently.
- [ ] C. Use `tool_choice: auto` and hope it picks the right order.
- [ ] D. Batch everything into one tool call.

**Explanation:** Forced selection guarantees the required first tool, with later steps handled on subsequent turns, the described pattern.

**Why not B:** Removing enrichment tools breaks the pipeline.

**Why not C:** `auto` doesn't guarantee ordering.

**Why not D:** A single call can't guarantee the staged order.

## D2-Q39

- task: 2.3
- scenario: 3
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Reducing an over-provisioned agent from 18 tools to a scoped 5 is expected to primarily improve what?

- [x] A. Tool-selection reliability, by reducing decision complexity.
- [ ] B. The physical disk usage of the server.
- [ ] C. The exam's cut score.
- [ ] D. The number of MCP servers.

**Explanation:** Fewer, role-scoped tools reduce decision complexity and improve selection reliability.

**Why not B:** None is affected by tool count in the way described.

**Why not C:** None is affected by tool count in the way described.

**Why not D:** None is affected by tool count in the way described.

## D2-Q40

- task: 2.3/2.1
- group: 2.3
- scenario: 3
- mock: true
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which is the best example of replacing a generic tool with a constrained alternative to reduce misuse?

- [ ] A. Renaming `fetch_url` to `fetch_url_v2`.
- [x] B. Replacing `fetch_url` with `load_document`, which validates that the URL points to a document.
- [ ] C. Adding five more generic fetch tools.
- [ ] D. Deleting all fetch tools.

**Explanation:** A constrained `load_document` that validates document URLs reduces misuse compared to a generic `fetch_url`.

**Why not A:** A version bump doesn't add constraints.

**Why not C:** More generic tools increase confusion.

**Why not D:** Deleting removes needed capability.

## D2-Q41

- task: 2.3/4.3
- group: 2.3
- scenario: 6
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

When is `tool_choice: {"type":"tool","name":"..."}` the right choice?

- [ ] A. When you want the model to freely decide whether to use tools.
- [x] B. When a specific tool must run (e.g., a required extraction step) regardless of the model's inclination.
- [ ] C. When you want the model to return text.
- [ ] D. When you want to disable tools.

**Explanation:** Forced named selection guarantees a specific required tool runs, e.g., a mandatory extraction step.

**Why not A:** That's `auto`.

**Why not C:** Forcing a tool prevents plain text.

**Why not D:** It enables, not disables, a tool.

## D2-Q42

- task: 2.3
- scenario: 3
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

A coordinator should retain complex verification routing while offloading simple checks. Which design best balances reliability and latency?

- [x] A. Give the synthesis agent a narrowly scoped verify tool for common simple checks; keep complex verifications flowing through the coordinator.
- [ ] B. Move all verification into the synthesis agent with full web access.
- [ ] C. Force every verification through the coordinator, even trivial ones.
- [ ] D. Eliminate verification to save time.

**Explanation:** Scoped simple-check tool + coordinator-routed complex checks balances least privilege with latency reduction for the common case.

**Why not B:** Over-provisions and invites misuse.

**Why not C:** Routing trivial checks through the coordinator adds needless latency.

**Why not D:** Removing verification harms reliability.

## D2-Q43

- task: 2.3/4.3
- group: 2.3
- scenario: 6
- docs: [Tool use, tool_choice (auto/any/tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

Which statement about `tool_choice: "any"` is correct in the structured-output context?

- [ ] A. It guarantees a *specific* tool is used.
- [x] B. It guarantees the model calls *some* tool (useful to force structured output when the document type is unknown among multiple schemas).
- [ ] C. It allows plain text responses.
- [ ] D. It disables all but one tool.

**Explanation:** `any` guarantees a tool call (structured output) without forcing a specific one, useful when several extraction schemas exist and the doc type is unknown.

**Why not A:** That's forced named selection, not `any`.

**Why not C:** `any` prevents plain text.

**Why not D:** It doesn't disable tools.

## D2-Q44

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

Your team wants a shared MCP server configuration that every developer receives when they clone the repo. Where should it be configured?

- [x] A. Project scope: `.mcp.json` checked into the repository.
- [ ] B. User scope: `~/.claude.json` on each developer's machine.
- [ ] C. Inside CLAUDE.md as prose.
- [ ] D. In each developer's shell profile.

**Explanation:** Project-scoped `.mcp.json` is for shared team tooling and is version-controlled, so it reaches everyone who clones the repo.

**Why not B:** `~/.claude.json` is user-scoped/personal, not shared.

**Why not C:** CLAUDE.md holds instructions/context, not MCP server config.

**Why not D:** Shell profiles don't configure Claude's MCP servers.

## D2-Q45

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

How should an MCP server config reference a secret like a GitHub token without committing the secret?

- [ ] A. Hard-code the token in `.mcp.json`.
- [x] B. Use environment variable expansion, e.g., `${GITHUB_TOKEN}`, in `.mcp.json`.
- [ ] C. Paste the token into CLAUDE.md.
- [ ] D. Store it in a public README.

**Explanation:** Environment-variable expansion (`${GITHUB_TOKEN}`) keeps secrets out of version control while configuring authenticated servers.

**Why not A:** All commit or expose the secret, a serious security problem.

**Why not C:** All commit or expose the secret, a serious security problem.

**Why not D:** All commit or expose the secret, a serious security problem.

## D2-Q46

- task: 2.4
- scenario: 4
- mock: true
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

A personal, experimental MCP server that you don't want to impose on teammates should live where?

- [ ] A. Project-scoped `.mcp.json`.
- [x] B. User-scoped `~/.claude.json`.
- [ ] C. The repo's root CLAUDE.md.
- [ ] D. A shared wiki page.

**Explanation:** User-scoped `~/.claude.json` holds personal/experimental servers that aren't shared with the team.

**Why not A:** Project scope shares it with everyone via version control.

**Why not C:** CLAUDE.md isn't for server config.

**Why not D:** A wiki page doesn't configure anything.

## D2-Q47

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

After configuring both a project `.mcp.json` server and a personal `~/.claude.json` server, which are available to the agent?

- [ ] A. Only the project one.
- [ ] B. Only the personal one.
- [x] C. Tools from all configured MCP servers are discovered at connection time and available simultaneously.
- [ ] D. Neither, until you restart the OS.

**Explanation:** All configured servers are discovered at connect time and their tools are available to the agent simultaneously.

**Why not A:** Both scopes contribute tools; neither is exclusive.

**Why not B:** Both scopes contribute tools; neither is exclusive.

**Why not D:** No OS restart is required.

## D2-Q48

- task: 2.4/2.1
- group: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

The agent keeps preferring the built-in `Grep` tool over a more capable MCP search tool. Which fix aligns with the guide?

- [ ] A. Delete the `Grep` tool from Claude Code.
- [x] B. Enhance the MCP tool's description to explain its capabilities and outputs in detail so the agent stops preferring the less capable built-in.
- [ ] C. Rename `Grep` to something confusing.
- [ ] D. Increase `max_tokens`.

**Explanation:** Enhancing the MCP tool's description (capabilities, outputs) prevents the agent from defaulting to a less capable built-in like `Grep`.

**Why not A:** Removing `Grep` cripples ordinary searches.

**Why not C:** Obfuscating names harms overall selection.

**Why not D:** Token budget doesn't change tool preference.

## D2-Q49

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

For a standard Jira integration, the guide advises which build-vs-buy stance?

- [ ] A. Always build a custom MCP server for every integration.
- [x] B. Choose existing community MCP servers for standard integrations (e.g., Jira), reserving custom servers for team-specific workflows.
- [ ] C. Never use MCP for Jira.
- [ ] D. Store Jira data in CLAUDE.md.

**Explanation:** Prefer existing community servers for standard integrations; reserve custom builds for team-specific needs.

**Why not A:** Rebuilding standard integrations is wasteful.

**Why not C:** MCP is well-suited to Jira.

**Why not D:** CLAUDE.md isn't a data store for Jira.

## D2-Q50

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

An agent wastes calls exploring what data is available before acting. Which MCP feature reduces these exploratory calls?

- [x] A. MCP resources exposing content catalogs (e.g., issue summaries, doc hierarchies, database schemas).
- [ ] B. Raising the temperature.
- [ ] C. Removing the agent's tools.
- [ ] D. Switching to user scope.

**Explanation:** MCP resources expose content catalogs, giving the agent visibility into available data without exploratory tool calls.

**Why not B:** Temperature doesn't provide data visibility.

**Why not C:** Removing tools removes capability.

**Why not D:** Scope choice doesn't expose catalogs.

## D2-Q51

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

Which statement about `.mcp.json` vs `~/.claude.json` scoping is correct?

- [ ] A. `.mcp.json` is user-only; `~/.claude.json` is team-shared.
- [x] B. `.mcp.json` (project) is for shared team tooling via version control; `~/.claude.json` (user) is for personal/experimental servers.
- [ ] C. Both are identical and interchangeable.
- [ ] D. Neither can hold MCP configuration.

**Explanation:** Project `.mcp.json` is shared team tooling; user `~/.claude.json` is personal/experimental.

**Why not A:** Reverses the scopes.

**Why not C:** They differ in sharing semantics.

**Why not D:** Both hold MCP configuration.

## D2-Q52

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

A secret committed accidentally into `.mcp.json` was caught in review. What is the preventive pattern going forward?

- [ ] A. Commit secrets but encrypt the whole repo.
- [x] B. Reference secrets via `${ENV_VAR}` expansion so the value stays out of version control.
- [ ] C. Email the secret to the team instead.
- [ ] D. Store the secret in the commit message.

**Explanation:** Env-var expansion keeps the actual secret out of the committed config.

**Why not A:** Encrypting the repo is heavyweight and still risks exposure; env-var expansion is the intended pattern.

**Why not C:** Both leak the secret.

**Why not D:** Both leak the secret.

## D2-Q53

- task: 2.4
- scenario: 4
- mock: true
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

Why expose a database schema or documentation hierarchy as an MCP *resource* rather than forcing the agent to discover it via tools?

- [ ] A. Resources are faster to type.
- [x] B. Resources give the agent visibility into available data up front, reducing exploratory tool calls and token usage.
- [ ] C. Resources are required for authentication.
- [ ] D. Tools cannot read schemas at all.

**Explanation:** Content-catalog resources reduce exploratory tool calls by giving the agent visibility into available data.

**Why not A:** Not about typing speed.

**Why not C:** Resources aren't an auth mechanism.

**Why not D:** Tools can read schemas; resources just reduce the need to explore.

## D2-Q54

- task: 2.4/3.1
- group: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

A new teammate isn't getting the shared MCP servers. Which is the most likely misconfiguration?

- [x] A. The servers were configured in the teammate's user-scoped `~/.claude.json` instead of the project's version-controlled `.mcp.json`.
- [ ] B. The teammate has too many tools.
- [ ] C. The temperature is too low.
- [ ] D. The CLAUDE.md is too short.

**Explanation:** Shared servers belong in project `.mcp.json` (version-controlled). If they're only in a user-scoped file, teammates won't receive them.

**Why not B:** None explains missing *shared* server config.

**Why not C:** None explains missing *shared* server config.

**Why not D:** None explains missing *shared* server config.

## D2-Q55

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

Which is a legitimate reason to build a *custom* MCP server rather than adopting a community one?

- [x] A. A team-specific workflow with no suitable existing server.
- [ ] B. A completely standard GitHub integration.
- [ ] C. Standard Slack messaging.
- [ ] D. Standard Google Drive access.

**Explanation:** Custom servers are reserved for team-specific workflows; standard integrations should use community servers.

**Why not B:** All are standard integrations well-served by existing community servers.

**Why not C:** All are standard integrations well-served by existing community servers.

**Why not D:** All are standard integrations well-served by existing community servers.

## D2-Q56

- task: 2.4/2.1
- group: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

After adding a highly capable MCP search server, the agent still uses `Grep`. Beyond description quality, what does the guide emphasize about tool discovery?

- [x] A. Tools from all configured servers are discovered at connect time, so the description quality, not availability, usually determines preference.
- [ ] B. Only one server can be active at a time.
- [ ] C. MCP tools are never discovered automatically.
- [ ] D. `Grep` cannot coexist with MCP tools.

**Explanation:** Since all servers' tools are available simultaneously, preference issues stem from description quality, not availability.

**Why not B:** Multiple servers can be active.

**Why not C:** MCP tools are discovered at connect time.

**Why not D:** Built-ins and MCP tools coexist.

## D2-Q57

- task: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

Which configuration keeps team credentials secure while still enabling an authenticated shared MCP server?

- [x] A. Project `.mcp.json` with `${GITHUB_TOKEN}` expansion, each developer supplying the env var locally.
- [ ] B. Project `.mcp.json` with the raw token committed.
- [ ] C. User `~/.claude.json` with the token in CLAUDE.md.
- [ ] D. No configuration; paste tokens per session.

**Explanation:** Shared project config plus per-developer env-var expansion authenticates without committing secrets.

**Why not B:** Commits the secret.

**Why not C:** Puts a secret in the wrong place and exposes it.

**Why not D:** Manual per-session pasting is error-prone and unshared.

## D2-Q58

- task: 2.4/5.1
- group: 2.4
- scenario: 4
- docs: [MCP, servers & .mcp.json scoping](https://code.claude.com/docs/en/mcp)

What is the token-efficiency argument for MCP resources exposing catalogs?

- [ ] A. They increase context size deliberately.
- [x] B. By providing available-data visibility upfront, they prevent repeated exploratory tool calls that would otherwise accumulate tokens.
- [ ] C. They compress the model weights.
- [ ] D. They disable logging.

**Explanation:** Catalog resources cut exploratory calls, avoiding token accumulation from repeated discovery.

**Why not A:** The goal is efficiency, not bloat.

**Why not C:** Unrelated to weights or logging.

**Why not D:** Unrelated to weights or logging.

## D2-Q59

- task: 2.5
- scenario: 4
- mock: true
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

You need to find every caller of a function `processRefund` across an unfamiliar codebase. Which built-in tool is the right choice?

- [ ] A. Glob.
- [x] B. Grep, to search file *contents* for the function name.
- [ ] C. Read every file one by one.
- [ ] D. Bash `rm`.

**Explanation:** Grep searches file contents for patterns (function names, error messages, imports), the right tool to find callers.

**Why not A:** Glob matches file *paths/names*, not contents.

**Why not C:** Reading every file is inefficient for a content search.

**Why not D:** `rm` deletes files; wholly inappropriate.

## D2-Q60

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

You want to locate all test files matching `**/*.test.tsx`. Which built-in tool fits?

- [ ] A. Grep.
- [x] B. Glob, for file *path* pattern matching.
- [ ] C. Edit.
- [ ] D. Bash `cat`.

**Explanation:** Glob matches files by name/extension patterns like `**/*.test.tsx`.

**Why not A:** Grep searches contents, not path patterns.

**Why not C:** Edit modifies a file; it doesn't find files.

**Why not D:** `cat` prints contents; it isn't a path-matcher.

## D2-Q61

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

An `Edit` operation fails because the target text isn't unique in the file. What is the recommended fallback?

- [ ] A. Give up and skip the change.
- [x] B. Use Read to load the full file, then Write the modified content as a reliable fallback.
- [ ] C. Run the Edit 10 more times.
- [ ] D. Delete the file and recreate it blindly.

**Explanation:** When Edit can't find a unique anchor, Read + Write (load full content, write modified version) is the reliable fallback.

**Why not A:** Skipping abandons the needed change.

**Why not C:** Repeating a failing Edit won't succeed.

**Why not D:** Blind recreation risks data loss.

## D2-Q62

- task: 2.5/5.4
- group: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

For exploring a large unfamiliar codebase efficiently, which approach does the guide recommend?

- [ ] A. Read all files upfront before doing anything.
- [x] B. Start with Grep to find entry points, then use Read to follow imports and trace flows incrementally.
- [ ] C. Use Glob to delete unused files first.
- [ ] D. Immediately Edit files to see what breaks.

**Explanation:** Build understanding incrementally: Grep for entry points, then Read to follow imports and trace flows, avoiding reading everything upfront.

**Why not A:** Reading all files upfront wastes context.

**Why not C:** Glob doesn't delete, and deleting is inappropriate for exploration.

**Why not D:** Editing to probe behavior is reckless.

## D2-Q63

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

Which tool is appropriate for a *targeted* modification using a unique text match, rather than rewriting a whole file?

- [ ] A. Write.
- [x] B. Edit.
- [ ] C. Glob.
- [ ] D. Grep.

**Explanation:** Edit performs targeted modifications by matching unique text; Write overwrites full files.

**Why not A:** Write replaces the entire file.

**Why not C:** Glob and Grep find files/content; they don't modify.

**Why not D:** Glob and Grep find files/content; they don't modify.

## D2-Q64

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

To trace function usage across wrapper modules, the guide suggests which sequence?

- [ ] A. Randomly open files until you find usages.
- [x] B. First identify all exported names, then search for each name across the codebase (Grep).
- [ ] C. Delete wrapper modules to simplify.
- [ ] D. Read only the README.

**Explanation:** Identify exported names, then Grep each across the codebase to trace usage through wrappers.

**Why not A:** Random opening is inefficient and incomplete.

**Why not C:** Deleting modules destroys the code you're tracing.

**Why not D:** The README won't reveal all usages.

## D2-Q65

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

Which built-in tool pairing is correct for "find files by name" vs "search inside files"?

- [x] A. Glob finds files by name; Grep searches inside files.
- [ ] B. Grep finds files by name; Glob searches inside files.
- [ ] C. Both do the same thing.
- [ ] D. Edit does both.

**Explanation:** Glob = path/name pattern matching; Grep = content search.

**Why not B:** Reverses their roles.

**Why not C:** They serve distinct purposes.

**Why not D:** Edit modifies; it doesn't search.

## D2-Q66

- task: 2.5
- scenario: 4
- mock: true
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

You need to make a small change but the anchor string appears many times. Choosing Edit fails repeatedly. Best next step?

- [x] A. Read the file to get full context, then Write the corrected file.
- [ ] B. Keep retrying Edit with the same non-unique anchor.
- [ ] C. Use Glob to change the text.
- [ ] D. Use Bash to `sed` blindly without reading.

**Explanation:** Read + Write is the reliable fallback when Edit can't find a unique anchor.

**Why not B:** Same non-unique anchor will keep failing.

**Why not C:** Glob doesn't edit contents.

**Why not D:** Blind `sed` risks unintended replacements.

## D2-Q67

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

For locating error messages across a service to diagnose a bug, the best built-in tool is:

- [ ] A. Glob.
- [x] B. Grep, searching contents for the error string.
- [ ] C. Write.
- [ ] D. Edit.

**Explanation:** Grep searches file contents for patterns such as error messages.

**Why not A:** Glob matches names, not message text.

**Why not C:** Write/Edit modify files, not search them.

**Why not D:** Write/Edit modify files, not search them.

## D2-Q68

- task: 2.5/5.4
- group: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

Which describes the recommended *incremental* codebase-understanding workflow?

- [ ] A. Read everything, then act.
- [x] B. Grep to find entry points → Read to follow imports/trace flows → act, expanding context only as needed.
- [ ] C. Edit files to observe failures.
- [ ] D. Glob then delete.

**Explanation:** Incremental building (Grep → Read → follow flows) conserves context versus reading all files upfront.

**Why not A:** Upfront full reads waste context.

**Why not C:** Editing to probe is unsafe.

**Why not D:** Deleting isn't exploration.

## D2-Q69

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

When is `Write` (full-file) preferred over `Edit` (targeted)?

- [ ] A. When you need a small, uniquely-anchored change.
- [x] B. When rewriting the whole file, or as a fallback when Edit can't find a unique anchor.
- [ ] C. When searching file contents.
- [ ] D. When matching file-name patterns.

**Explanation:** Write suits full-file replacement and the Edit-fallback case; Edit suits small unique-match changes.

**Why not A:** That's the Edit use case.

**Why not C:** Those are Grep/Glob, not Write.

**Why not D:** Those are Grep/Glob, not Write.

## D2-Q70

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

A developer-productivity agent uses built-in tools (Read, Write, Bash, Grep, Glob). Which tool should it use to run the project's test command?

- [ ] A. Grep.
- [x] B. Bash, to execute the test command.
- [ ] C. Glob.
- [ ] D. Edit.

**Explanation:** Bash executes commands such as running tests.

**Why not A:** Grep/Glob search or match; they don't run commands.

**Why not C:** Grep/Glob search or match; they don't run commands.

**Why not D:** Edit modifies files.

## D2-Q71

- task: 2.5/5.4
- group: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

Why prefer Grep+Read incremental exploration over reading all files, in the context of context management?

- [ ] A. It looks more professional.
- [x] B. Reading all files upfront consumes context disproportionately; Grep+Read loads only what's relevant, preserving context budget.
- [ ] C. Grep is the only tool that can open files.
- [ ] D. Read cannot be used after Grep.

**Explanation:** Targeted Grep+Read conserves the context budget by loading only relevant code, unlike bulk reading.

**Why not A:** Not about appearances.

**Why not C:** Read opens files; Grep searches.

**Why not D:** Read is used precisely after Grep to follow leads.

## D2-Q72

- task: 2.5
- scenario: 4
- docs: [Claude Code settings & built-in tools](https://code.claude.com/docs/en/settings)

A refactor must rename a symbol used in dozens of files. Which built-in-tool strategy is soundest?

- [x] A. Grep to find all occurrences, Read the relevant files to confirm context, then Edit (or Read+Write) each occurrence deliberately.
- [ ] B. Glob to rename the symbol automatically.
- [ ] C. Bash `rm` on affected files.
- [ ] D. Write a single new file and hope imports resolve.

**Explanation:** Grep to locate, Read to confirm context, then careful Edit/Write is the disciplined refactor path with built-in tools.

**Why not B:** Glob matches paths; it doesn't rename symbols in content.

**Why not C:** Deleting files loses code.

**Why not D:** A lone new file won't fix scattered references.
