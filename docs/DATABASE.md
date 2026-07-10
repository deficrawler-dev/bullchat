# BullChat Database

## Overview

BullChat stores user identities, community interactions, professional profiles, messaging, jobs, and community data.

The database is designed to scale from the Ansem community to multiple Web3 communities.

---

# Authentication

## Authentication Providers

- X
- Google
- Anonymous

Anonymous accounts can later be linked to X or Google without losing:

- Profile
- Messages
- Followers
- Following
- Reputation
- Settings

---

# User

Stores the primary account information.

Fields

- User ID
- Username
- Display Name
- Email
- Authentication Provider
- Country
- Avatar
- Cover Image
- Bio
- Wallet Address
- Created At
- Updated At
- Last Seen
- Online Status

---

# Username Policy

- Every username must be unique.
- Usernames can be changed once every 30 days.
- Display names can be changed at any time.
- Usernames are case-insensitive.

---

# Reserved Usernames

## System Reserved

- admin
- support
- bullchat
- bullchatapp
- team
- system
- moderator
- staff
- security
- help
- official
- notifications
- jobs
- news
- market
- verify

## Founder Reserved

- deficrawler

Reserved exclusively for the creator of BullChat.

## Community Reserved

Reserved until ownership can be verified.

Examples

- ansem

---

# Anonymous Accounts

When users create an anonymous account:

BullChat automatically generates:

- Unique Username
- Recovery Passcode

Example usernames

- @anon_a8k3n
- @anon_x72pf
- @anon_m4q9z

Default Display Name

Anonymous

Users may immediately change:

- Username
- Display Name
- Country

The Recovery Passcode is the only recovery method.

BullChat cannot recover lost Recovery Passcodes.

---

# Social Links

Users may connect

- X
- Telegram
- Discord
- Dribbble
- Portfolio Website
- GitHub

---

# Follow System

Stores

- Followers
- Following
- Follow Date

---

# Block System

Stores

- Blocked User
- Blocked By
- Block Date

Blocked users cannot:

- Send DMs
- Follow
- Mention
- Interact directly

---

# Privacy Settings

Users can choose who may

- Send Direct Messages
- Follow Them
- Mention Them
- View Their Profile

---

# Rooms

Stores

- Room Name
- Description
- Icon
- Banner
- Visibility
- Creator
- Created Date

Room Types

- Community
- Token
- Jobs
- General

---

# Messages

Stores

- Sender
- Room
- Message
- Timestamp
- Edited
- Deleted

Supports

- Text
- Images (Future)
- Files (Future)

---

# Message Replies

Stores

- Parent Message
- Reply Message
- Reply Author
- Timestamp

Clicking a reply scrolls to the original message.

---

# Mentions

Supports

@username

When mentioned

- Notify User
- Highlight Username
- Open Profile on Click

---

# Reactions

Supports reactions on messages.

Stores

- Message
- Reaction
- User

---

# Direct Messages

Stores

- Sender
- Receiver
- Message
- Timestamp
- Read Status
- Reply Support
- Reactions

---

# Notifications

Supports

- New Followers
- Mentions
- Replies
- Job Matches
- Room Invitations
- Official Announcements

---

# Jobs

Stores

- Title
- Description
- Company
- Poster
- Tags
- Budget
- Deadline
- Status

---

# Job Categories

Examples

- UI/UX Design
- Product Design
- Graphic Design
- Frontend Development
- Backend Development
- Smart Contract Development
- Whitepaper Writing
- Content Writing
- Community Manager
- Moderator
- Marketing
- KOL
- Shiller
- Video Editing
- Motion Design

---

# Portfolio

Supports

- Dribbble
- Behance (Future)
- Personal Website
- GitHub

---

# Market Hub

Supports live market information including

- Token Price
- Market Cap
- Liquidity
- Holders
- Volume
- Charts

Initial launch focuses on the $ANSEM token.

Designed to support additional tokens in future.

---

# Verification

Verification Types

- Founder
- Official BullChat
- Verified Community Member
- Moderator
- Builder
- Designer
- Writer
- Hiring

Official BullChat accounts display the BullChat Mark.

Examples

- @bullchat
- @deficrawler
- @support
- @jobs
- @news
- @market
- @verify

Official accounts may use unique username colors defined in the design system.

---

# Reporting

Users can report

- Messages
- Profiles
- Rooms
- Spam
- Abuse

---

# Future Features

- Voice Rooms
- Video Calls
- File Sharing
- Community Reputation
- Community Points
- NFT Verification
- Wallet Verification
- Multi-language Support
