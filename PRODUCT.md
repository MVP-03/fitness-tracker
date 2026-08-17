# Product

<!-- impeccable:product-schema 1 -->

## Platform

web
<!-- Runs inside Electron (desktop shell) as a single-window React app; UI is standard web tech, no native APIs used. -->

## Stack

React 18 + Vite, plain CSS (no Tailwind/UI kit), packaged as a desktop app via Electron. Local-first storage via better-sqlite3 in the Electron main process; optional Supabase (Postgres + Auth) as a shared cloud backend when configured.

## Users

Pranay and 2-3 people close to him, sharing one installed desktop app. Each person signs in with their own Supabase account so their food/weight/workout logs stay separate, while the app itself is a single shared install (not a public multi-tenant product). Daily, personal use — logging meals, weight, and workouts, then checking progress against goals.

## Product Purpose

A private, local-first fitness and food tracker: log meals (with AI-assisted nutrition estimation from a plain-English description), track body weight over time, log workouts, and see daily calorie/macro/micronutrient progress against personal goals calculated from a profile (BMR/TDEE-based).

## Positioning

Unlike MyFitnessPal/Cronometer-style apps, this is a small, private, local-first tool built for a specific small group rather than the public — no ads, no social feed, no subscription. Nutrition estimation is AI-driven from a natural-language food description (via Groq) rather than a packaged-food barcode database, and the whole app works fully offline with cloud sync as an optional add-on rather than a requirement.

## Operating Context

- Desktop app (Electron), used at a computer, not primarily on the go.
- Core loop: describe a meal in plain English → AI estimates macros/micros → log it against a meal type (breakfast/lunch/dinner/snack) → check Dashboard rings against daily goals.
- Secondary flows: log a body-weight entry per day (chart over time), log a workout (exercise/sets/reps/weight/duration), and set/derive daily goals from a Profile (sex, age, height, current/target weight, activity level, target rate of change).
- Auth is only relevant when Supabase cloud sync is configured (`isCloudConfigured`); otherwise the app is fully local with no login.
- Groq API key and (optionally) Supabase URL/anon key are configured once via Settings or a local `.env` file, not part of daily use.

## Capabilities and Constraints

- Local SQLite persistence always available; Supabase sync is optional and additive, scoped per-user via RLS.
- Groq-based "Estimate with AI" is a local secret call from the Electron main process only, never routed through the cloud API layer.
- No native mobile app; no public/multi-tenant signup — this is a small, closed group.
- Existing pages: Dashboard (today's rings + entries + micronutrients), Food (food library + AI estimate + logging), Weight (log + trend chart), Workouts (log), Profile (goal calculator), Settings (Groq key), AuthGate (Supabase sign-in/sign-up).

## Brand Commitments

Visual language should draw from Pranay's personal portfolio (`Pranay_Portfolio` project): warm cream/ink base with a blue accent (`#007acc` light / `#1a94e0` dark) and a sparing red-pink accent-deep (`#f62440`) used only as a small decorative "pixel mark" motif, not as a functional color. Typography pairs Geist Sans (body/UI) with Geist Pixel Square (a blocky pixel-art display face) reserved for short uppercase tracked-out labels/eyebrows, never body copy. A small 8x8 pixel-grid mark (`PixelMark`) is the personal identity motif. Full light/dark theming via the same named CSS variables per theme, toggled by a `data-theme` attribute, no separate dark: variant sprawl. This is the app's own tool, not a copy of the portfolio — the fitness tracker gets its own layout and information design suited to a data-dense daily-use tool, while borrowing this palette, type pairing, pixel-mark motif, and warm/calm tone instead of a generic dark dashboard aesthetic.

## Evidence on Hand

Full working React codebase for both the fitness tracker (`src/`) and the portfolio (`Pranay_Portfolio/src/`) are available locally as reference. No user testimonials, external data, or marketing assets apply — this is not a marketing surface.

## Product Principles

- Comfortable, daily-use tool, not a dashboard to admire once — calm density over flashy motion; the person using it every day should never feel nagged or overwhelmed.
- Personal, not generic — carry Pranay's own visual identity (palette, type pairing, pixel-mark motif) rather than a stock dark-SaaS-dashboard look.
- Fast data entry first — logging a meal, weight, or workout should take as few steps/clicks as possible; AI estimation exists specifically to remove tedious macro lookup.
- Small and honest — no artificial multi-tenant chrome, no feature bloat; it's a tool for 2-4 people who know each other.

## Accessibility & Inclusion

No explicit requirement established; carry over general standards (keyboard-navigable forms, sufficient contrast in both themes) as good practice, consistent with the portfolio's existing `:focus-visible` and reduced-motion handling.
