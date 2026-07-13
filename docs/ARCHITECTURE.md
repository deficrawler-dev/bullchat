# BullChat Architecture (v2)

## Overview

BullChat is designed as a scalable, secure, real-time communication platform built specifically for Web3 communities.

Version 1 is dedicated to the **$ANSEM** community, but every architectural decision should support future expansion into multiple communities without requiring major rewrites.

The architecture prioritizes:

* Performance
* Security
* Scalability
* Maintainability
* Mobile-first UX
* Reusable components
* Modular services

Every feature should have a clear responsibility and belong to a well-defined layer.

---

# Technology Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

---

## Backend

* Supabase

---

## Database

* PostgreSQL (Supabase)

---

## Authentication

Supported providers:

* X OAuth
* Google OAuth
* Anonymous Authentication

Anonymous users can later upgrade their accounts without losing data.

---

## Deployment

* GitHub
* Vercel

---

# High-Level Architecture

```
Client (Web)

↓

Next.js

↓

Services Layer

↓

Supabase

↓

PostgreSQL
```

UI components must never communicate directly with the database.

Every request passes through the Services Layer.

---

# Project Structure

```
app/

components/

services/

lib/

hooks/

types/

constants/

contexts/

middleware/

public/

docs/
```

---

# Folder Responsibilities

## app/

Contains only routes and layouts.

Examples

* Authentication
* Rooms
* Profile
* Market Hub
* Settings
* Admin Dashboard

Business logic must never live inside pages.

---

## components/

Reusable UI components.

```
components/

auth/

chat/

navigation/

profile/

market/

admin/

moderation/

notifications/

settings/

ui/
```

Components should remain small and reusable.

---

## services/

Contains all business logic.

```
services/

auth/

rooms/

messages/

moderation/

spam/

market/

notifications/

users/

profiles/
```

Every database interaction happens here.

---

## lib/

Shared utilities.

Examples

* Supabase Client
* Validators
* Helpers
* Token Detection
* URL Detection
* Rate Limiter

---

## hooks/

Reusable React hooks.

Examples

```
useAuth()

useMessages()

useRoom()

useNotifications()

useProfile()

useSpamStatus()
```

---

## types/

Global TypeScript types.

Avoid duplicate interfaces.

---

## constants/

Application constants.

Examples

* Routes
* Reserved Usernames
* Room IDs
* Spam Thresholds
* Official Token Registry

---

# Services Layer

The Services Layer acts as the only gateway between the UI and the database.

```
Component

↓

Service

↓

Supabase

↓

Database
```

Benefits:

* Easier testing
* Better security
* Centralized validation
* Easier maintenance

---

# Database Design

Core tables include:

---

## profiles

Stores professional profile information.

Additional fields include:

- OG Member status
- Verification status
- Reputation summary

- ---

## users

Stores user accounts.

---

## profiles

Professional profile information.

---

## rooms

Community rooms.

---

## messages

Chat messages.

---

## message_reactions

Emoji reactions.

---

## notifications

System notifications.

---

## follows

Follower relationships.

---

## direct_messages

Private conversations.

---

## moderation_queue (NEW)

Stores every flagged message.

Fields include:

* Message ID
* User ID
* Reason
* Spam Score
* Status
* Moderator
* Created At

---

## spam_events (NEW)

Stores spam detection events.

Examples:

* Contract detected
* Scam phrase
* Excessive mentions
* Flood detection

---

## user_spam_scores (NEW)

Tracks dynamic spam scores.

Fields:

* User ID
* Current Score
* Warnings
* Hidden Messages
* Suspensions

Scores automatically decay over time for users with good behavior.

---

## approved_tokens (NEW)

Stores tokens officially allowed in BullChat.

Version 1 contains only:

* $ANSEM

Future releases can add more tokens without changing application code.

---

# Real-Time Messaging Flow

```
User Sends Message

↓

Client Validation

↓

Messages Service

↓

Spam Engine

↓

If Clean

↓

Save Message

↓

Broadcast via Supabase Realtime

↓

Room Updates
```

---

# Spam Detection Engine

Every message passes through the Spam Engine before publication.

Checks include:

## Contract Address Detection

Detect blockchain contract addresses.

If contract matches an approved token:

Publish.

Otherwise:

Flag.

---

## Token Detection

Detect token tickers.

Examples

* $TOKEN
* CA references
* Promotional patterns

---

## Link Detection

Analyze URLs.

Detect:

* Suspicious domains
* Repeated links
* Scam websites

---

## Duplicate Detection

Detect repeated messages.

Repeated spam increases the user's spam score.

---

## Flood Detection

Monitor:

* Messages per minute
* Character repetition
* Excessive emojis
* Repeated mentions

---

## Scam Phrase Detection

Examples:

* Guaranteed profit
* 100x
* Send funds
* Presale now
* Limited whitelist

The keyword list should be configurable through the Admin Dashboard.

---

# Spam Scoring

Each event contributes points.

Example:

Duplicate message

+10

Unauthorized contract

+50

Repeated violation

+25

Flooding

+20

Thresholds:

0–39

Normal

40–69

Warning

70–99

Hidden

100+

Temporary restriction

These values should remain configurable.

---

# Moderation Pipeline

```
Message

↓

Spam Engine

↓

Spam Score

↓

Below Threshold

↓

Publish

OR

Above Threshold

↓

Hide Message

↓

Moderation Queue

↓

Moderator Decision

↓

Approve

Delete

Warn

Suspend

Ban
```

Every action is logged.

---

# Room Permissions

Every room defines:

* Read Permission
* Write Permission
* Moderator Permission

Future versions may support:

* Token-gated rooms
* Private communities
* Invite-only rooms

---

# Admin Dashboard

The Admin Dashboard manages the entire platform.

## User Management

* Search users
* Ban
* Suspend
* Warn
* View history

---

## Moderation

* Review queue
* Hidden messages
* Reports
* Appeals
* Moderator logs

---

## Spam Management

Configure:

* Spam thresholds
* Restricted phrases
* Rate limits
* Link policies
* Emoji limits

---

## Token Management

Version 1

* Official $ANSEM contract

Future

* Add approved tokens
* Remove tokens
* Update contracts

No code changes should be required.

---

## Analytics

Dashboard metrics:

* Active users
* Active rooms
* Daily messages
* Hidden messages
* Spam events
* Moderator activity
* User growth

---

# WebSocket Events

Examples:

```
room:join

room:leave

message:new

message:update

message:delete

message:hidden

typing:start

typing:stop

reaction:add

reaction:remove

moderation:flagged

moderation:approved

moderation:deleted

notification:new
```

These events should remain versioned to avoid breaking future clients.

---

# Authentication Rules

Supported:

* X
* Google
* Anonymous

Every authenticated request must validate:

* Session
* User
* Permissions

Never trust client-side roles.

---

# Security

BullChat follows a server-first security model.

Requirements:

* Row Level Security
* Server-side validation
* Rate limiting
* Input sanitization
* XSS protection
* CSRF protection where applicable
* Secure environment variables

Never expose service keys to the client.

---

# Performance

Optimize for:

* Lazy loading
* Pagination
* Efficient SQL queries
* Code splitting
* Image optimization
* Cached profile data
* Minimal client-side JavaScript

Performance is a feature.

---

# Responsive Design

Every feature must support:

* Mobile
* Tablet
* Desktop

Mobile should never be treated as a secondary experience.

---

# Accessibility

Support:

* Keyboard navigation
* Screen readers
* Proper labels
* Focus management
* High contrast

Accessibility is mandatory.

---

# Development Workflow

Every new feature follows this order:

1. Define the feature.
2. Update documentation.
3. Design reusable UI.
4. Design database changes.
5. Build components.
6. Implement services.
7. Connect Supabase.
8. Test thoroughly.
9. Review performance.
10. Deploy.

---

# AI Development Rules

When using AI assistants:

* Never redesign completed pages without instruction.
* Never invent new features.
* Reuse existing components whenever possible.
* Preserve project architecture.
* Keep business logic inside Services.
* Explain architectural decisions when introducing new systems.

---

# Engineering Principles

Every architectural decision should improve one or more of:

* Performance
* Simplicity
* Maintainability
* Security
* Scalability
* User Experience

When multiple solutions exist, choose the simplest one that scales.

---

# Long-Term Vision

BullChat should evolve from a single-community platform into the operating system for Web3 communities.

The architecture should support:

* Multiple communities
* Multiple official tokens
* AI-assisted moderation
* AI-powered search
* Company pages
* DAO workspaces
* Community analytics
* Public APIs
* Third-party integrations

The core architecture should require minimal restructuring as BullChat grows.
