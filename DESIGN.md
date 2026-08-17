---
name: Fitness Tracker
description: A warm, personal daily-use log for food, weight, and workouts, carrying Pranay's own portfolio identity instead of a generic dark dashboard.
colors:
  ink: "#1c1917"
  cream: "#faf7f2"
  surface: "#ffffff"
  surface-recessed: "#f2ece1"
  border: "rgba(28, 25, 23, 0.10)"
  border-strong: "rgba(28, 25, 23, 0.16)"
  accent-blue: "#007acc"
  accent-blue-soft: "#d6ecf8"
  accent-red: "#f62440"
  carb-amber: "#b8730f"
  fat-plum: "#7c5cbf"
  good-green: "#3f8f5f"
typography:
  label:
    fontFamily: "Geist Pixel Square, ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 500
    letterSpacing: "0.08em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.5
  numeral:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "22px"
  xl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.accent-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  nav-item-active:
    backgroundColor: "{colors.accent-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "9px 10px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "18px"
---

# Design System: Fitness Tracker

## Overview

**Creative North Star: "The Pixel Ledger"**

A private daily ledger, not a fitness dashboard performing for an audience — the app exists for one small group of people who already know each other, so nothing about it needs to sell itself. The system is inherited directly from Pranay's own portfolio: a warm paper-cream ground, Geist as the working typeface, and a single hand-drawn 8x8 pixel glyph as the one piece of personal identity in the whole interface. Where the portfolio spends that identity on motion and generous whitespace, the tracker spends it on density and speed of entry — the same materials, tuned for a tool opened every day rather than viewed once.

The rejected default here is the generic AI-dashboard look: near-black surfaces, a single neon-teal accent, glassy cards, sparkline decoration. Nothing in this system uses that vocabulary. Depth comes from paper-thin elevation (a hairline border plus a soft, real shadow), never a glow or a gradient.

**Key Characteristics:**
- Warm cream-and-ink base in light mode, its true tonal inverse in dark mode — no accent hue changes meaning between themes.
- One functional blue accent carries every primary action and the calorie ring; a second accent (red-pink) is reserved for the identity mark and doubles, sparingly, as one of four macro-ring hues and the "over goal" signal.
- Geist Pixel Square, uppercase and tracked wide, is the *only* voice used for section labels — never for numbers or paragraph text.
- A left-rail sidebar, not a top tab bar, gives the app a fixed, calm sense of place across all six sections.

## Colors

Restrained strategy: neutral cream/ink carries the surface, one committed blue accent carries action and identity, with three narrow-role hues reserved strictly for macro/weight data.

### Primary
- **Working Blue** (`#007acc` light / `#2fa3ea` dark): every primary button, submit action, focus ring, active nav item, the calories ring, and the weight trend line. This is the only color a user should associate with "do this" or "this is on."

### Secondary
- **Ledger Red** (`#f62440`, same value both themes): the pixel identity mark, the "weight went up" delta, and the protein ring. Used nowhere else — it never appears as a button or a state background, only as a small, precise accent.

### Tertiary (data-only)
- **Amber Carb** (`#b8730f` light / `#e0973a` dark) and **Plum Fat** (`#7c5cbf` light / `#a78bdc` dark): reserved exclusively for the carbs and fat macro rings, so the four-ring row reads as one coherent, muted family rather than a rainbow.
- **Ledger Green** (`#3f8f5f` light / `#5fb583` dark): the one "good news" signal — a falling weight delta. Never used for buttons or nav.

### Neutral
- **Cream** (`#faf7f2` light / `#16120e` dark): the app background — the "paper" everything sits on.
- **Surface** (`#ffffff` light / `#1f1a14` dark): cards, list rows, forms, the sidebar — one step lifted off the cream ground.
- **Surface Recessed** (`#f2ece1` light / `#241e16` dark): input fields, track backgrounds behind rings and bars — one step sunk below the surface.
- **Ink** (`#1c1917` light / `#f3ece3` dark) at three opacities (100% body text, 62% secondary/dim text, 42% faint/placeholder text) rather than a separate gray scale — every text tone derives from the same hue as the page, so nothing reads as a mismatched gray import.

### Named Rules
**The One Accent Rule.** Working Blue is the only color that ever means "actionable." If a new control needs a color, it is blue, cream, or ink — never a new hue invented for the occasion.

## Typography

**Display/Label Font:** Geist Pixel Square (with ui-monospace, monospace fallback)
**Body/UI Font:** Geist (with ui-sans-serif, system-ui, sans-serif fallback)

**Character:** Geist is a quiet, humanist grotesk doing all of the reading and data work; Geist Pixel Square is a blocky, deliberately artificial display face that appears only in short bursts, marking a section the way a library card-catalog stamp marks a category — never used long enough to become hard to read.

### Hierarchy
- **Numeral** (700, 19px, tabular): ring center values, the day's weight-in-kg display. The only place weight is given to a number over a word.
- **Body** (400, 14.5px, 1.5 line-height): all paragraph copy, hints, form labels, list entry text.
- **Label** (500, 12.5px, 0.08em tracking, uppercase, Geist Pixel Square): section headers ("TODAY'S ENTRIES", "MICRONUTRIENTS") stand *as* the heading itself — never as a small kicker floating above a larger heading.

### Named Rules
**The One Display Voice Rule.** Geist Pixel Square never appears in a sentence-case or lowercase string, and never at a size larger than ~13px. It is a stamp, not a headline font.

## Layout

Single persistent left sidebar (216px, collapsing to a 68px icon rail under 720px) plus a centered content column capped at 780px so line lengths and card widths stay comfortable at the desktop window's default 1200x800. Vertical rhythm is generous between sections (22px page gaps) and tight within a list (8px between rows) — the density lives inside groups, the calm lives between them. Forms wrap and reflow rather than scroll horizontally; data grids (goal stats, micronutrients) step down from 3/2 columns to 2 columns under the same 720px breakpoint the sidebar collapses at.

## Elevation & Depth

Hybrid: flat cream ground with lifted-white (or lifted-dark) surfaces carrying a real, soft shadow plus a 1px hairline border — never a glow, never a flat drop-shadow with no blur.

### Shadow Vocabulary
- **Resting** (`0 1px 2px rgba(28,25,23,.05)` light / `rgba(0,0,0,.3)` dark): every card, row, and form at rest.
- **Lifted** (`0 1px 2px rgba(28,25,23,.04), 0 12px 28px -14px rgba(28,25,23,.18)` light / deeper dark equivalent): the auth card and any surface asking for a beat more focus.

### Named Rules
**The Hairline-Plus-Blur Rule.** A surface never floats on shadow alone or border alone — always both, together, at low opacity.

## Shapes

Soft, confident rounding rather than sharp or pill-everywhere: 8px on small controls (inputs, icon buttons, date-nav circles), 14px on cards and rows, 20px on the auth card — the one surface allowed a slightly larger, more deliberate curve since it's a one-time, calmer moment rather than daily-use density. The one true pill (999px) is reserved for the circular date-nav step buttons.

## Components

### Buttons
- **Shape:** 8px radius, all buttons.
- **Primary:** Working Blue background, cream/white text, 9px/18px padding, no border. Active state scales to 97% (`transform: scale(0.97)`) rather than darkening — a tactile press, not a color change.
- **Ghost/Link:** transparent background, Working Blue text, no border, opacity-fade on hover.
- **Icon-only:** transparent at rest, recessed-surface background plus Ledger Red text on hover — the only place red appears as an interactive state, signaling "removes something."

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Surface, on Cream page background.
- **Shadow Strategy:** Resting shadow (see Elevation) plus a 1px border — never shadow alone.
- **Internal Padding:** 18-22px.

### Inputs / Fields
- **Style:** Surface Recessed background, 1px border, 8px radius.
- **Focus:** 2px solid Working Blue outline, 1px offset, border turns transparent — the outline carries the state, not a glow.

### Navigation
- **Style:** left rail, Surface background, 1px right border. Items are ink-dim at rest, full ink on hover with a Surface Recessed background, and Working Blue background with cream text when active — never an underline or a bare color change alone, always a filled pill-like state so "where am I" is answerable at a glance.
- **Collapse:** under 720px width the rail narrows to icons only; labels and email disappear rather than truncating.

### Macro Ring (signature component)
A circular progress ring (SVG, 8px stroke, round cap) with the current value and goal set as real text inside the ring rather than a separate label — the ring is data, not decoration. Four rings sit in one row (Calories/Working Blue, Protein/Ledger Red, Carbs/Amber, Fat/Plum), always in that order and that color assignment, so returning users read the row by position and color without re-reading labels.

## Do's and Don'ts

### Do:
- **Do** keep Geist Pixel Square strictly to uppercase, tracked, ≤13px section labels.
- **Do** derive every text color from ink at a fixed opacity rather than introducing a separate gray palette.
- **Do** use the hairline-border-plus-soft-shadow pairing for every raised surface.
- **Do** keep the four macro-ring colors fixed to their assigned macro across every screen that shows them.

### Don't:
- **Don't** introduce a fifth accent hue for a new feature — reuse Working Blue, or extend the ink-opacity scale.
- **Don't** use Ledger Red for anything other than the identity mark, the protein ring, an "increase"/delta-up signal, or a destructive hover state.
- **Don't** use emoji or Unicode glyphs as functional icons; draw a matching-stroke SVG instead (see `src/components/Icons.jsx`).
- **Don't** animate `width`/`height`/`padding`/`margin` for progress indicators — animate `transform: scaleX()` from a `transform-origin: left` base instead.
