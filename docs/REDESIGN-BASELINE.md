# Night X V2 — Redesign Baseline & Architecture Audit

## 1. System Context & Overview
Night X V2 is a hybrid browser-first utility hub and productivity workspace built on Next.js 14 (App Router), Tailwind CSS, NextAuth 5 (beta), and Firebase / Firestore.

### Core Strengths
- **42 functional tools** across 7 domain categories (`image`, `security`, `text`, `developer`, `utility`, `life`, `ai`).
- **Client-Side Privacy Engine**: Heavy reliance on WebAssembly, Web Crypto API, Canvas, and browser DOM for local processing.
- **Robust Auth Foundation**: NextAuth 5 with Google OAuth and Email/Password credentials backed by Firestore and rate limiting.

### Identified Baseline Weaknesses & Technical Debt
1. **Visual Language Inconsistency**:
   - Competing neon green vs. neutral vs. black background styling (`bg-black` vs `bg-[#080A0E]`).
   - Hardcoded inline styles and unmaintained custom CSS animations (`blob-float`, heavy radial glow layers).
   - Three.js 3D hero (`Hero3D.tsx`) adding substantial overhead without functional utility.
2. **Navigation & Information Architecture**:
   - Header overloaded with low-priority destinations (`Status`, `Pricing`) while lacking clear primary focus.
   - Mobile drawer navigation lacking proper keyboard trap management and clean hierarchical grouping.
   - Misaligned footer links (e.g. generic Twitter links, unmaintained newsletter form).
3. **Product & Business Model Discrepancies**:
   - Razorpay payment code and "Pro" badges remain even though Night X is completely free.
   - Stale "New" badges cluttering tool cards.
4. **Tool Slug & Schema Inconsistencies**:
   - Slug mismatches in `ToolPageLayout.tsx` and `tools/[slug]/page.tsx` (`screenshot-to-pdf` vs `image-to-pdf`).
   - URL shortener broken due to missing/incomplete Firestore handler integration.
   - Dashboard favorites and history routes present as placeholders requiring full persistence implementation.
5. **Typography & Styling**:
   - Tailwind config defining missing `font-display: ['Manrope']` and `font-outfit` classes in components without loading the fonts in Next.js layout.

---

## 2. Route Inventory & Classification

| Route | Classification | Layout / Shell | Status | Redesign Plan |
|---|---|---|---|---|
| `/` | Public | Main (Header + Footer) | Active | Redesign with CSS ambient hero & live workbench |
| `/tools` | Public | Main (Header + Footer) | Active | Streamlined catalog with unified filters & search |
| `/tools/[slug]` | Public / Auth | Main (Header + Footer) | Active | Unified tool workbench layout, clean how-to guide |
| `/about` | Public | Main (Header + Footer) | Active | Coherent narrative & system architecture presentation |
| `/contact` | Public | Main (Header + Footer) | Active | Polished contact & feedback form |
| `/faq` | Public | Main (Header + Footer) | Active | Accordion FAQ with clear categorization |
| `/support` | Public | Main (Header + Footer) | Active | Help desk & troubleshooting resources |
| `/feedback` | Public | Main (Header + Footer) | Active | Product feedback intake with validation |
| `/security` | Public | Main (Header + Footer) | Active | In-depth privacy & security whitepaper layout |
| `/privacy` | Public | Main (Header + Footer) | Active | Clean legal privacy policy |
| `/terms` | Public | Main (Header + Footer) | Active | Clean terms of service |
| `/services` | Public | Main (Header + Footer) | Active | Architectural capabilities breakdown |
| `/pricing` | Public | Main (Header + Footer) | Active | Re-orient as "100% Free Workspace" philosophy |
| `/docs` | Public | Main (Header + Footer) | Active | Developer & tool integration documentation |
| `/changelog` | Public | Main (Header + Footer) | Active | Modern release timeline & milestones |
| `/status` | Public | Main (Header + Footer) | Active | System health & local engine metrics |
| `/auth/signin` | Auth | Minimal Shell | Active | Modernized amber-accented signin |
| `/auth/signup` | Auth | Minimal Shell | Active | Clean registration flow |
| `/auth/forgot-password` | Auth | Minimal Shell | Active | Password reset flow |
| `/auth/error` | Auth | Minimal Shell | Active | Clear error recovery UI |
| `/dashboard` | Protected | Sidebar Shell | Active | Streamlined workspace overview |
| `/dashboard/ai` | Protected | Sidebar Shell | Active | AI Chat assistant & workflow suite |
| `/dashboard/favorites`| Protected | Sidebar Shell | Active | Firestore-backed user favorites |
| `/dashboard/history` | Protected | Sidebar Shell | Active | Firestore-backed execution history |
| `/profile` | Protected | Sidebar Shell | Active | User account & preferences management |
| `/settings` | Protected | Sidebar Shell | Active | Theme, keyboard shortcuts & data management |
| `/u/[code]` | Dynamic / Redirect | Server Handler | Broken | Fixed via Firestore shortened links collection |

---

## 3. High-Risk Files & Protection Boundary

- `auth.ts`, `auth.config.ts`, `middleware.ts`: Security sensitive auth flow. Must remain structurally intact and preserve session management.
- `lib/firebase.ts`, `lib/firebaseAdmin.ts`: Firestore connectivity. Preserved for rate limiting, user accounts, shortened links, favorites, and history.
- `app/api/ai/*`: Google Generative AI streaming & prompt endpoints. Preserved.
- `app/api/auth/*`: NextAuth endpoints & registration handlers. Preserved.
- `components/tools/*`: Internal logic of all 42 tools. Preserved and wrapped with unified UI layout.
