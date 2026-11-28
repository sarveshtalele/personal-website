---
# Drives /claude/foundations and the exam cards on /claude.
title: Claude Certified Architect, Foundations
code: CCAR-F
status: live
description: The hands-on, scenario-based entry credential in the Claude Certification Program. It validates sound tradeoff decisions when building production systems with Claude Code, the Claude Agent SDK, the Claude API, and MCP.
official: https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification
repo: https://github.com/sarveshtalele/claude-architect-exam-guide/tree/main/foundations

glance:
  - { label: Credential, value: 'Claude Certified Architect, Foundations' }
  - { label: Exam code, value: CCAR-F }
  - { label: Items, value: 60 (multiple-choice and multiple-response) }
  - { label: Structure, value: 4 scenarios drawn at random from a bank of 6 }
  - { label: Time, value: 120 minutes }
  - { label: Passing score, value: '720 on a 100-1,000 scale' }
  - { label: Delivery, value: Proctored (online or test center) }
  - { label: Fee, value: $125 USD }
  - { label: Validity, value: 12 months }

domains:
  - { n: 1, name: Agentic Architecture & Orchestration, weight: 27%, tests: 'Agentic loops (stop_reason), coordinator/subagent patterns, the Task tool, hooks, task decomposition, session resume/fork' }
  - { n: 2, name: Tool Design & MCP Integration, weight: 18%, tests: 'Tool descriptions, structured errors (isError), tool distribution, tool_choice, .mcp.json scoping, built-in tools' }
  - { n: 3, name: Claude Code Configuration & Workflows, weight: 20%, tests: 'CLAUDE.md hierarchy & @import, slash commands, .claude/rules/ globs, plan vs. direct execution, CI (-p, JSON output)' }
  - { n: 4, name: Prompt Engineering & Structured Output, weight: 20%, tests: 'Explicit criteria, few-shot, tool_use + JSON schemas, nullable fields, retry-with-feedback, Batches API, multi-pass review' }
  - { n: 5, name: Context Management & Reliability, weight: 15%, tests: 'Summarization risk, case-facts blocks, escalation triggers, error propagation, provenance, confidence calibration' }

scenarios:
  - Customer Support Resolution Agent, Agent SDK + MCP tools; 80%+ first-contact resolution.
  - Code Generation with Claude Code, slash commands, CLAUDE.md, plan vs. direct execution.
  - Multi-Agent Research System, coordinator + search/analyze/synthesize/report subagents.
  - Developer Productivity with Claude, Agent SDK, built-in tools, MCP servers.
  - Claude Code for Continuous Integration, CI/CD reviews, test generation, PR feedback.
  - Structured Data Extraction, tool_use + JSON schemas, validation, edge cases.

rules:
  - { title: 'R1 · Root cause, not symptom', body: 'Fix what is actually broken, not the surface symptom.' }
  - { title: 'R2 · Deterministic beats probabilistic', body: 'When compliance matters, prefer hooks, prerequisite gates, tool_choice, and JSON schemas over prose instructions.' }
  - { title: 'R3 · Proportionate wins', body: 'The lowest-effort, highest-leverage fix is usually correct; ML classifiers and heavy infra "first steps" are traps.' }

distractors:
  - System-prompt enforcement
  - Few-shot overload
  - Over-engineering
  - Sentiment-based escalation
  - Tool bloat
  - Batch API for blocking work
  - Self-review
  - Text-signal loops

resources:
  - { name: Claude Code docs, use: 'Domains 1-3 & 5, sub-agents, MCP, CLAUDE.md, hooks, plan mode, CLI (-p)', url: 'https://code.claude.com/docs/en/overview' }
  - { name: Claude API & Agent SDK docs, use: 'Domains 1, 2, 4, Messages API, tool use, JSON schemas, Batches API', url: 'https://docs.claude.com' }
  - { name: Anthropic courses, use: 'anthropic-api-fundamentals, tool-use, prompt-engineering', url: 'https://github.com/anthropics/courses' }
  - { name: Exam guide & prompt packs (my repo), use: 'Blueprint, a study skill, and copy-paste Learning / Practice / Mock prompts', url: 'https://github.com/sarveshtalele/claude-architect-exam-guide/tree/main/foundations' }
---

## How to prepare, a 3-step path

1. **Diagnose.** Take the [mock exam](/claude/quiz) to find your weakest domains, then read the blueprint and self-assess against each domain's task statements.
2. **Study interactively.** Create a Claude Project, upload the exam guide PDF, and use the [prompt packs](https://github.com/sarveshtalele/claude-architect-exam-guide/blob/main/foundations/prepare-with-prompts/prompt-based-learning.md) or the [ccar-f-examprep-coach skill](https://github.com/sarveshtalele/claude-architect-exam-guide/blob/main/foundations/claude-skills/examprep-guide-skill.md).
3. **Build three projects.** An agentic loop with escalation logic; a Claude Code team setup (CLAUDE.md hierarchy, `.claude/rules/`, a `context: fork` skill, an MCP server); and a structured-extraction pipeline (`tool_use` + JSON schema + validation-retry).

Facts come from the official Exam Guide (v1.0, effective July 2026). Always confirm against the current official page, the guide is subject to change.
