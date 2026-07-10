# BullChat Architecture

## Overview

BullChat is built with scalability, maintainability, and performance as first-class priorities.

The architecture should allow new features to be added without affecting existing functionality.

Every feature should have a clear home within the project.

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Backend

- Supabase

## Database

- PostgreSQL (Supabase)

## Authentication

- Supabase Auth
- X OAuth
- Google OAuth
- Anonymous Authentication

## Deployment

- GitHub
- Vercel

---

# Project Structure

```
app/
components/
lib/
services/
hooks/
types/
constants/
public/
docs/
```

---

# Folder Responsibilities

## app/

Contains all application routes.

Examples

- Authentication
- Dashboard
- Rooms
- Profile
- Jobs
- Market Hub
- Settings

Business logic should never live here.

---

## components/

Reusable UI components.

Structure

```
components/

auth/
chat/
profile/
jobs/
market/
navigation/
settings/
ui/
```

Components should remain reusable.

Avoid duplicated UI.

---

## lib/

Contains shared logic.

Examples

- Supabase client
- Authentication helpers
- Utility functions
- Validators

---

## services/

Contains business logic.

Examples

```
services/

users/
messages/
jobs/
notifications/
rooms/
profiles/
market/
```

Services communicate with Supabase.

UI components should never query the database directly.

---

## hooks/

Reusable React hooks.

Examples

- useAuth()
- useProfile()
- useMessages()
- useNotifications()

---

## types/

Global TypeScript types.

Avoid declaring duplicate interfaces.

---

## constants/

Application constants.

Examples

- Routes
- Room Names
- Job Categories
- Reserved Usernames

---

# Component Rules

Components should

- Have one responsibility
- Be reusable
- Be easy to test
- Be easy to replace

Avoid massive components.

Split large screens into smaller components.

---

# Business Logic

Business logic belongs inside Services.

Never inside UI components.

Bad

Component fetches data.

Good

Component calls a service.

---

# Database Access

Never query Supabase directly inside components.

Instead

Component

↓

Service

↓

Supabase

---

# State Management

Prefer

- React Server Components where possible
- Local state when appropriate
- Context only when necessary

Avoid unnecessary global state.

---

# Styling

Tailwind CSS only.

Avoid inline styles.

Avoid duplicated utility classes.

Create reusable UI components.

---

# Forms

Every form should have

- Validation
- Loading state
- Error handling
- Success feedback

---

# Error Handling

Every API interaction should

- Handle errors
- Display meaningful feedback
- Never expose internal errors

---

# Performance

Prioritize

- Fast page loads
- Lazy loading
- Optimized images
- Efficient queries
- Pagination where needed

Performance is a feature.

---

# Security

Always validate user input.

Never trust client-side data.

Protect private routes.

Use Row Level Security in Supabase.

---

# Authentication

Supported providers

- X
- Google
- Anonymous

Anonymous accounts can later be upgraded.

---

# File Naming

Use consistent naming.

Examples

```
UserCard.tsx

ProfileHeader.tsx

JobCard.tsx

MessageBubble.tsx

ReplyPreview.tsx
```

Avoid vague names.

---

# Code Quality

Write production-quality code.

Avoid duplication.

Prefer composition over repetition.

Every function should have a single responsibility.

---

# Comments

Only write comments when they explain *why*.

Do not comment obvious code.

---

# API Design

Keep APIs predictable.

Avoid unnecessary endpoints.

Reuse services whenever possible.

---

# Responsive Design

Every feature must work on

- Mobile
- Tablet
- Desktop

Never design desktop first.

Design mobile and desktop together.

---

# Accessibility

Support

- Keyboard navigation
- Screen readers
- Proper labels
- High contrast

Accessibility is required.

---

# Animations

Animations should be subtle.

Prefer

- Fade
- Slide
- Scale

Avoid flashy animations.

---

# Notifications

Notifications should be meaningful.

Never notify users unnecessarily.

---

# Feature Development Workflow

Every new feature follows this process

1. Define the feature.
2. Update documentation if needed.
3. Design the UI.
4. Define database requirements.
5. Build reusable components.
6. Build business logic.
7. Connect to Supabase.
8. Test thoroughly.
9. Deploy.

---

# AI Development Rules

Claude should never redesign completed pages.

Claude should never invent features.

Claude should never move files unless requested.

Claude should always reuse existing components.

Claude should always explain architectural decisions.

Claude should stop after completing the requested task.

---

# BullChat Engineering Principles

Every decision should improve one or more of the following:

- Performance
- Simplicity
- Maintainability
- Scalability
- User Experience

When in doubt, choose the simpler solution.

---

# Long-Term Goal

BullChat should remain clean, modular, and easy to maintain as it grows from a single community platform into the home of Web3 communities.
