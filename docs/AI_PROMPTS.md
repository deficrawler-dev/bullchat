# BullChat AI Development Prompts

## Purpose

This document contains reusable prompts for AI-assisted development.

These prompts ensure consistency, reduce AI token usage, and prevent unnecessary redesigns.

Before starting any task, the AI must follow:

- CLAUDE.md
- PROJECT_BIBLE.md
- FEATURES.md
- DATABASE.md
- UI_GUIDELINES.md
- USER_FLOWS.md
- ARCHITECTURE.md

Never ignore those documents.

Never redesign completed pages.

Never invent new features.

Only complete the requested task.

---

# Global Prompt

Before starting any development task:

Read every document inside the /docs folder.

Follow the established design system.

Reuse existing components whenever possible.

Write production-quality TypeScript.

Use Next.js App Router.

Use Tailwind CSS.

Use Supabase.

Never create placeholder features.

Never redesign completed work.

Explain architectural decisions before writing code.

Stop after completing the requested task.

---

# Prompt — Create Component

Build only the requested component.

Requirements

- Reusable
- Responsive
- Accessible
- TypeScript
- Tailwind CSS

Do not build surrounding pages.

---

# Prompt — Build Page

Build only the requested page.

Reuse existing components.

Do not redesign navigation.

Do not change colors.

Do not modify typography.

Do not invent missing requirements.

---

# Prompt — Database

Generate only the required Supabase tables.

Include

- Foreign Keys
- Indexes
- Row Level Security
- Relationships

Explain every table before writing SQL.

---

# Prompt — Authentication

Build only authentication.

Include

- X Login
- Google Login
- Anonymous Login
- Recovery Passcode
- Username
- Country Selection

Do not build chat.

Do not build profiles.

Do not build jobs.

---

# Prompt — Chat

Build only the chat module.

Include

- Message List
- Message Bubble
- Replies
- Mentions
- Reactions

Reuse UI components.

---

# Prompt — Profile

Build only profile functionality.

Include

- Opportunity Profile
- Skills
- Looking For
- Availability
- Social Links
- Portfolio

Do not build unrelated features.

---

# Prompt — Jobs

Build only the Jobs module.

Include

- Create Job
- Browse Jobs
- Filters
- Categories

---

# Prompt — Market Hub

Build only the Market Hub.

Version 1 supports:

$ANSEM

Display

- Price
- Chart
- Liquidity
- Market Cap
- Holders
- Volume

---

# Prompt — Notifications

Build only notifications.

Support

- Mentions
- Replies
- Followers
- Jobs
- Announcements

---

# Prompt — Bug Fix

Fix only the reported issue.

Do not refactor unrelated code.

Do not redesign UI.

Explain the root cause.

---

# Prompt — Refactoring

Improve code quality.

Do not change behavior.

Reduce duplication.

Improve readability.

Keep existing functionality intact.

---

# Prompt — Mobile Optimization

Optimize the requested page for mobile.

Do not redesign desktop.

Maintain visual consistency.

---

# Prompt — Accessibility

Review the requested page.

Improve accessibility.

Maintain the existing design.

---

# Prompt — Performance

Optimize performance.

Focus on

- Rendering
- Images
- Queries
- Bundle Size
- Lazy Loading

---

# Prompt — Documentation

Update documentation only.

Do not write code.

Keep documentation synchronized with implementation.

---

# Development Workflow

Every task should follow this order:

1. Read documentation.
2. Explain the plan.
3. Build only the requested feature.
4. Test mentally for edge cases.
5. Explain what changed.
6. Stop.

Never continue into another feature unless explicitly requested.

---

# Golden Rule

Build BullChat incrementally.

One feature.

One prompt.

One completed task.

Never attempt to build the entire application in a single prompt.
