# BullChat Design System

Version: 1.0

---

# Philosophy

BullChat is a premium Web3 community platform.

It is NOT a gaming platform.

It is NOT another Discord clone.

BullChat should feel like the place where serious crypto communities gather.

Every interface should communicate:

• Professional
• Modern
• Fast
• Clean
• Premium
• Bullish

Less is more.

---

# Brand Identity

BullChat's identity is inspired by its logo.

The Bull represents:

- Strength
- Confidence
- Leadership
- Momentum
- Bull Markets

The interface should reinforce those qualities.

---

# Brand Colors

## Primary Brand Green

BullChat Green

```css
#7CFF2B
```

Use for:

- Primary Buttons
- Active Navigation
- Active Room
- Links
- Verified Badge
- Online Status
- Progress Indicators
- Positive Market Changes
- Interactive Elements

---

## Secondary Green

```css
#4DBA1E
```

Use for:

- Hover States
- Charts
- Secondary Buttons
- Icons

---

## Deep Green

```css
#1F6F1C
```

Use sparingly for:

- Gradients
- Decorative Elements
- Large Charts

---

# Neutral Colors

## Background

```css
#0D0F10
```

Main application background.

---

## Surface

```css
#171A1D
```

Cards

Sidebar

Panels

---

## Elevated Surface

```css
#202529
```

Modals

Dropdowns

Floating Panels

Popovers

---

## Borders

```css
#2C3136
```

Subtle borders only.

Avoid heavy outlines.

---

# Text

Primary

```css
#F5F7FA
```

Secondary

```css
#A1AAB3
```

Muted

```css
#737B86
```

Disabled

```css
#5C636B
```

---

# Semantic Colors

Success

```css
#22C55E
```

Warning

```css
#F59E0B
```

Danger

```css
#EF4444
```

Information

```css
#38BDF8
```

---

# Theme

Dark Theme is the default.

Light Theme will be supported later.

Never use pure black.

Always use layered dark surfaces.

---

# Typography

Primary Font

Geist

Fallback

Inter

Fallback

system-ui

---

# Font Sizes

Display

48px

H1

36px

H2

30px

H3

24px

H4

20px

Body

16px

Small

14px

Caption

12px

---

# Font Weight

Regular

400

Medium

500

Semi Bold

600

Bold

700

---

# Spacing

Use an 8pt spacing system.

Available spacing values

4

8

12

16

20

24

32

40

48

64

80

96

Never invent spacing values.

---

# Border Radius

Small

8px

Medium

12px

Large

16px

Extra Large

20px

Pill

999px

Use consistent radius everywhere.

---

# Shadows

Use soft shadows.

Never use glowing neon shadows.

Cards should rely on elevation through layered surfaces.

---

# Buttons

Supported Variants

Primary

Secondary

Outline

Ghost

Danger

Success

Disabled

Loading

Every button must support

Hover

Focus

Pressed

Disabled

Loading

---

# Inputs

Every input must support

Label

Placeholder

Helper Text

Validation

Error

Success

Disabled

Loading

---

# Cards

Reusable cards

User Card

Room Card

Profile Card

Notification Card

Market Card

Analytics Card

Admin Card

---

# Chat Components

Reusable components

Message Bubble

Reply Preview

Thread Preview

Reaction Bar

Typing Indicator

Unread Divider

Pinned Message

Message Menu

Emoji Picker

Message Timestamp

Mention

Attachment Preview

System Message

Moderator Message

---

# Navigation

Desktop

Left Sidebar

Chat Area

Right Information Panel

Mobile

Bottom Navigation

Slide-out Sidebar

Collapsible Panels

---

# Icons

Use Lucide React.

Never mix icon libraries.

---

# Avatar

Support

Profile Image

Fallback Initials

Online Indicator

Verified Badge

Moderator Badge

Founder Badge

---

# Badges

Official

Verified

Founder

Admin

Moderator

Spam Warning

Beta

New

Success

Warning

Danger

---

# Market Widgets

Version 1

Only $ANSEM

Widgets

Price

Market Cap

Liquidity

Volume

24h Change

Official Contract

Trending

Future versions will support additional approved tokens.

---

# Motion

Allowed animations

Fade

Slide

Scale

Duration

150ms–250ms

Avoid flashy effects.

Animations should improve usability.

---

# Responsive Breakpoints

Mobile

320+

Tablet

768+

Laptop

1024+

Desktop

1280+

Ultra Wide

1536+

Every page must support all breakpoints.

---

# Accessibility

Support

Keyboard Navigation

Visible Focus States

ARIA Labels

Screen Readers

High Contrast

Accessible Forms

Accessibility is required.

---

# Anti-Spam UI

Version 1 includes

Spam Warning Labels

Hidden Message Banner

Moderator Review Banner

Restricted User Badge

Reported Message Indicator

Admin Moderation Queue

These interfaces should feel native to BullChat.

---

# Component Rules

Every component must

- Have one responsibility
- Be reusable
- Accept props
- Be responsive
- Be accessible
- Follow this design system

Avoid duplicated UI.

---

# Naming Convention

Examples

PrimaryButton

UserCard

RoomCard

MessageBubble

ReplyPreview

NotificationItem

MarketWidget

ProfileHeader

SpamWarningBanner

ModerationQueue

---

# Claude Development Rules

Claude must never invent new colors.

Claude must always use the colors defined in this document.

Claude must never redesign existing components without instruction.

Claude must build reusable components first.

Claude must prioritize mobile responsiveness.

Claude must reuse components whenever possible.

Claude must follow ROADMAP.md and ARCHITECTURE.md.

Claude must not introduce visual inconsistencies.

---

# Guiding Principle

Every screen should immediately communicate:

"This is BullChat."

Not Discord.

Not Slack.

Not Telegram.

BullChat should have a distinctive, premium identity that reflects confidence, clarity, and the energy of a bullish Web3 community.
