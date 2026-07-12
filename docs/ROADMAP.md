# BullChat Roadmap (v2)

## Vision

BullChat is being built to become the professional home for Web3 communities.

Version 1 is purpose-built for the **$ANSEM** community, delivering a fast, secure, spam-resistant communication platform. Future versions will evolve BullChat into a multi-community platform while maintaining the same high standards of quality, moderation, and user experience.

Every release should move BullChat closer to helping users:

* Connect
* Collaborate
* Build
* Discover Opportunities
* Learn
* Grow their reputation

---

# Core Product Principles

Every feature should:

* Solve a real problem.
* Be mobile-first.
* Be fast.
* Be scalable.
* Be reusable.
* Support healthy community engagement.
* Reduce spam instead of increasing moderation workload.

BullChat should always prioritize quality over feature quantity.

---

# Milestone 1 — Foundation & Community MVP 🚧

**Goal**

Build the core BullChat experience with secure authentication, real-time messaging, and intelligent anti-spam protection.

## Authentication

* Next.js Project Setup
* Tailwind CSS
* TypeScript
* Supabase Integration
* PostgreSQL Database
* X Authentication
* Google Authentication
* Anonymous Authentication
* Recovery Passcode
* Username Creation
* Country Selection
* Initial User Profile
* Responsive Authentication UI

---

## Core Community

* Sidebar Navigation
* Community Rooms
* Room Switching
* Real-time Messaging
* Replies
* @Mentions
* Emoji Reactions
* Message Search
* Pinned Messages
* Online Status
* Typing Indicators
* Message Timestamps

---

## Community Moderation (NEW)

BullChat launches with proactive moderation instead of relying entirely on manual moderators.

### Anti-Shilling Engine

Detect:

* Token contract addresses
* Token tickers
* Repetitive promotional messages
* Mass copy-paste spam
* Scam patterns
* Flooding

---

### Official Token Protection

Version 1 supports only the official **$ANSEM** token.

Rules:

* Official $ANSEM contract is allowed.
* Unauthorized token contract addresses are automatically flagged.
* Unauthorized token promotions are hidden from public chat.
* Moderators receive a review notification.
* Repeat offenders receive increasing spam scores.

Future releases will allow multiple approved tokens through the Admin Dashboard.

---

### Spam Detection

Every message is analyzed before publishing.

Checks include:

* Duplicate messages
* Rapid message frequency
* Contract address detection
* Blacklisted keywords
* Suspicious links
* Excessive mentions
* Excessive emojis
* Scam phrases

---

### Spam Score

Each account receives a dynamic spam score.

Higher scores trigger:

* Temporary message delay
* Hidden messages
* Moderator review
* Temporary posting restrictions

Spam scores decrease over time for good behavior.

---

### Moderator Queue

Flagged content enters a moderation queue.

Moderators can:

* Approve
* Delete
* Warn
* Suspend
* Permanently ban

Every moderation action is logged.

---

### Admin Controls

Administrators can configure:

* Spam thresholds
* Approved tokens
* Restricted keywords
* Automatic punishments
* Rate limits

---

Status

🟡 In Progress

---

# Milestone 2 — Professional Profiles

**Goal**

Help users showcase themselves professionally.

Features

* Opportunity Profile
* Skills
* Looking For
* Open To Work
* Open To Collaborate
* Portfolio Links
* Wallet Address
* X
* Telegram
* Discord
* GitHub
* Website
* Cover Image
* Avatar
* Bio
* Verified Links

---

# Milestone 3 — Networking

**Goal**

Help members build meaningful relationships.

Features

* Follow Users
* Followers
* Following
* Direct Messages
* Block Users
* Privacy Settings
* User Search
* Mutual Connections

---

# Milestone 4 — Opportunities

**Goal**

Turn BullChat into a collaboration platform.

Features

* Opportunity Feed
* Job Board
* Job Categories
* Project Listings
* Hiring Posts
* Talent Discovery
* Saved Jobs
* Saved Opportunities
* Recruiter Profiles

---

# Milestone 5 — Market Hub

Version 1 supports:

* $ANSEM

Features

* Live Price
* Market Cap
* Liquidity
* Holders
* Trading Volume
* Interactive Chart
* Official Contract
* Quick Copy Contract
* Community Stats

Future versions will support multiple approved community tokens.

---

# Milestone 6 — Notifications

Features

* Mentions
* Replies
* Direct Messages
* New Followers
* Job Matches
* Opportunity Matches
* Moderator Actions
* Official Announcements

---

# Milestone 7 — Reputation System

Goal

Reward meaningful participation.

Features

* Reputation Score
* Helpful Member Badges
* Community Endorsements
* Completed Collaborations
* Completed Jobs
* Recommendations
* Trust Level

---

# Milestone 8 — Admin Dashboard

A centralized control panel for managing BullChat.

Features

## User Management

* Search Users
* Ban Users
* Suspend Users
* View Reports
* User History

## Room Management

* Create Rooms
* Archive Rooms
* Edit Room Rules
* Pin Announcements

## Moderation

* Review Queue
* Spam Analytics
* Flagged Messages
* Ban History

## Token Management

* Approved Token Registry
* Official Contract Management
* Future Multi-token Support

## Analytics

* Active Users
* Daily Messages
* Room Activity
* Spam Trends
* Moderator Performance

---

# Milestone 9 — Official BullChat System

Features

* BullChat Verification
* Official Accounts
* Founder Account
* Username Protection
* Reserved Usernames
* Community Verification

---

# Milestone 10 — Public Launch 🚀

Requirements

* Stable
* Secure
* Responsive
* Mobile Optimized
* Fully Tested
* Production Ready
* Moderation System Active
* Admin Dashboard Operational

Launch BullChat publicly.

---

# Future Releases

Potential future additions:

* Voice Rooms
* Video Calls
* Screen Sharing
* File Sharing
* Wallet Verification
* NFT Verification
* Community Events
* AI Search
* AI Moderation
* AI Spam Classification
* Company Pages
* Startup Pages
* DAO Pages
* Community Analytics
* Multi-Community Support
* Multi-Token Support
* API Access
* Bot Platform

---

# Development Rules

Every feature must:

* Solve a real problem.
* Improve user experience.
* Follow the BullChat design system.
* Be mobile friendly.
* Be reusable.
* Be scalable.
* Be documented.
* Be tested.

Avoid feature bloat.

Always optimize for simplicity.

---

# Definition of Done

A feature is complete only when it:

* Works correctly.
* Is responsive.
* Matches the design system.
* Uses reusable components.
* Passes accessibility checks.
* Is tested.
* Is documented.
* Includes error handling.
* Includes loading states.

---

# Success Metrics

BullChat succeeds when users consistently return because it helps them:

* Meet people.
* Build meaningful relationships.
* Find jobs.
* Discover opportunities.
* Collaborate on projects.
* Stay informed.
* Participate in healthy discussions without being overwhelmed by spam.

Everything else is secondary.
