---
# ─────────────────────────────────────────────────────────────────────────────
# PROJECTS PAGE SETTINGS
#   pinned     → shown first (in this order) with a "Pinned" badge, and on the
#                landing page. Use the exact GitHub repo name.
#   hidden     → never shown (profile READMEs, scratch repos, mirrors).
#   categories → GitHub topic → filter chip label. Add a topic to a repo on
#                GitHub and it appears in that filter on the next deploy.
#   overrides  → per-repo tweaks when the GitHub description is missing/weak.
# Repo data (stars, forks, language, updated date) refreshes on every deploy
# and on the daily scheduled rebuild.
# ─────────────────────────────────────────────────────────────────────────────
pinned:
  - claude-architect-exam-guide
  - personal-finance-mcp
  - mcp-skills-registry
  - devcrew
  - linkedin-content-skill
  - ACCIDENT-CVPR_2026

hidden:
  - sarveshtalele
  - personal-website

categories:
  agentic-ai: Agentic AI
  mcp: MCP
  rag: RAG
  claude-skills: Claude Skills
  claude-code: Claude Code
  ai-projects: AI Projects
  machine-learning: Machine Learning
  developer-tools: Developer Tools

overrides:
  linkedin-autonomous-content-creation-agentic-system:
    description: Autonomous multi-agent system that researches, drafts, and schedules LinkedIn content.
  vulnerability-checks:
    description: Automated vulnerability checks for Python projects and dependencies.
    categories: [developer-tools]
  maf-harness-testing:
    description: Test harness for Microsoft Agent Framework agents.
---

Settings live in the frontmatter above.
