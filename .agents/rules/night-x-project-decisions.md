# Night X V2 — Project Decisions & Architectural Rules

These decisions are binding and govern all work on the Night X V2 codebase.

## 1. Visual System & Theme
- **Primary Color Palette**: Warm Amber (`#F59E0B` / `amber-500`) with Orange accents (`#F97316` / `orange-500`) on Dark background (`#080A0E`).
- **Surface Elevation**: Inset `#0A0D13`, Card `#111520`, Surface `#0E1118`, Elevated `#141824`, Hover `#1A2030`.
- **Typography**: `Inter` only via `next/font/google`. No missing/unloaded font families like Manrope or Outfit.
- **Motion & Animations**: Restrained and subtle. Page transitions, hover feedback, modal enter/exit. No continuous infinite floating blobs, no intense neon glow pulsing. Respect `prefers-reduced-motion`.
- **Hero Banner**: Lightweight CSS-only ambient lighting / gradient effect. Three.js (`Hero3D.tsx`) is retired.
- **Iconography**: `lucide-react` exclusively. Consistent stroke weight and sizing.

## 2. Product & Business Model
- **100% Free**: Night X is completely free. Razorpay and all payment API routes/models are removed.
- **Badge System**: No `Pro` badges, no `isPro` gating, no `New` badges on tools. Tool cards are clean, minimal, and informative.
- **Newsletter**: No newsletter subscription module or `/api/newsletter` form.
- **Tagline**: "The workspace for everyday digital work".
- **Brand Wordmark**: "Night X" text wordmark.

## 3. Authentication & Access Control
- **Authentication Purpose**: Personalization, user profiles, saved favorites, execution history, and AI workflows.
- **Tool Access**: 12 core tools are public (no login required). 30 advanced tools require login for session state/history, but without paywall/Pro language.
- **Protected Area**: App shell with left sidebar navigation for all authenticated routes (`/dashboard`, `/dashboard/ai`, `/dashboard/favorites`, `/dashboard/history`, `/profile`, `/settings`).

## 4. Feature Implementation Standards
- **Global Search**: Command palette `Ctrl+K` / `⌘K` modal — fast fuzzy filter, keyboard accessible.
- **AI Integration**: AI Chat widget present on dashboard and tool pages. Graceful error/prompt handling if API key is not yet set.
- **URL Shortener**: Functional client tool and API backed by Firestore storage with `/u/[code]` redirection.
- **Favorites & History**: Functional client and backend persistence via Firestore collections for logged-in users.
- **Public Pages**: All public pages (`/about`, `/contact`, `/faq`, `/support`, `/feedback`, `/security`, `/privacy`, `/terms`, `/services`, `/pricing`, `/docs`, `/changelog`, `/status`) get coherent visual and IA redesign.
- **Copy Integrity**: Transparent, honest product copy. No unverifiable statistics or misleading claims.
