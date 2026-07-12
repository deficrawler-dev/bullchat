# 🐂 BullChat

> The professional home for Web3 communities.

BullChat is a modern, real-time community platform built specifically for Web3.

Unlike traditional chat applications, BullChat combines community discussion, professional networking, market insights, moderation tools, and collaboration into a single platform.

Version 1 is dedicated to the **$ANSEM** community.

Future releases will support multiple communities while maintaining a premium user experience.

---

# Vision

BullChat exists to help Web3 communities:

- Connect
- Collaborate
- Discover Opportunities
- Build Projects
- Share Knowledge
- Grow Together

BullChat prioritizes quality, speed, security, and community trust over feature bloat.

---

# Technology Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Backend

- Supabase

## Database

- PostgreSQL

## Authentication

- X OAuth
- Google OAuth
- Anonymous Authentication

## Deployment

- Vercel

---

# Documentation

Every contributor must read the documentation before implementing features.

## ROADMAP.md

Defines:

- Product vision
- Development milestones
- Feature roadmap
- Future releases

Read this to understand **what** BullChat is building.

---

## ARCHITECTURE.md

Defines:

- Project structure
- Services
- Database
- Security
- Moderation
- Real-time architecture

Read this to understand **how** BullChat is built.

---

## DESIGN_SYSTEM.md

Defines:

- Colors
- Typography
- Components
- Layout
- Responsive design
- UI rules

Read this before creating any UI.

---

## BRANDING.md

Defines:

- Brand identity
- Logo rules
- Brand voice
- Color usage
- Marketing style

Read this before making visual or branding decisions.

---

# Development Principles

Every feature must be:

- Reusable
- Responsive
- Accessible
- Tested
- Documented
- Mobile-first
- Production-ready

Avoid shortcuts that increase technical debt.

---

# Core Features

Version 1 includes:

- Authentication
- Community Rooms
- Real-time Chat
- Replies
- Mentions
- Notifications
- Professional Profiles
- Market Hub
- Reputation
- Admin Dashboard
- Intelligent Moderation

---

# Anti-Spam System

BullChat includes a built-in moderation system.

Features include:

- Contract Address Detection
- Token Detection
- Spam Scoring
- Hidden Messages
- Moderator Queue
- Admin Controls

Version 1 supports only the official **$ANSEM** token.

Future releases will support multiple approved community tokens.

---

# Folder Structure

```
app/
components/
services/
hooks/
lib/
types/
constants/
contexts/
middleware/
public/
docs/
```

Business logic must remain inside the Services layer.

Components should remain reusable.

---

# Development Workflow

Every feature follows this process:

1. Understand the roadmap.
2. Review the architecture.
3. Follow the design system.
4. Respect the branding guide.
5. Build reusable components.
6. Implement services.
7. Connect backend.
8. Test thoroughly.
9. Document changes.
10. Submit for review.

---

# AI Development Rules

When using AI assistants such as Claude or ChatGPT:

Always:

- Read all documentation first.
- Reuse existing components.
- Follow the architecture.
- Follow the design system.
- Preserve branding.
- Keep business logic inside Services.
- Prioritize responsive design.
- Write production-quality code.

Never:

- Invent new features.
- Ignore documentation.
- Move files without instruction.
- Introduce inconsistent styling.
- Duplicate components.
- Query the database directly from UI components.
- Break the established architecture.

When unsure, ask instead of guessing.

---

# Coding Standards

Use:

- TypeScript
- Functional Components
- Reusable Hooks
- Clean Folder Structure
- Clear Naming

Every function should have one responsibility.

Every component should solve one problem.

---

# Definition of Done

A task is complete only when:

- Functionality works correctly.
- Mobile responsiveness is verified.
- Desktop responsiveness is verified.
- Accessibility requirements are met.
- Error handling is implemented.
- Loading states are implemented.
- Components are reusable.
- Documentation is updated where necessary.

---

# Long-Term Vision

BullChat is being designed to scale from a single-community application into the operating system for Web3 communities.

Future expansion includes:

- Multiple Communities
- Multiple Official Tokens
- AI Moderation
- AI Search
- Voice Rooms
- Video Calls
- Company Pages
- DAO Workspaces
- Community Analytics
- Public APIs

Every architectural decision should support this long-term vision.

---

# Contributing

Before contributing:

1. Read all documentation.
2. Understand the architecture.
3. Follow the design system.
4. Maintain the BullChat brand.
5. Build with scalability in mind.

Quality is always more important than speed.

---

# Project Status

🚧 Active Development

Current Phase:

**UI/UX Design and Frontend Development**

The focus is on building a production-ready interface before integrating backend functionality.

---

# BullChat Motto

> **Built for Communities. Designed for Builders.**
