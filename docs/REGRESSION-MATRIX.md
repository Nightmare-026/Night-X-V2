# Night X V2 — Regression Matrix

| Feature / Subsystem | Primary Route(s) | Baseline State | Redesigned State | Verification Method | Status | Risk Level |
|---|---|---|---|---|---|---|
| **Public Homepage** | `/` | Heavy Three.js 3D hero, green neon glow, uncalibrated copy | CSS ambient lighting, warm amber palette, live workbench, honest copy | Browser, Lighthouse, Responsive | Planned | Low |
| **All Tools Catalog** | `/tools` | Tabbed tool grid with Pro & New badges, green accents | Clean, searchable catalog with category chips, amber focus, zero paywalls | Browser, search query test, filter test | Planned | Low |
| **Individual Tools (42 Tools)** | `/tools/[slug]` | Slug mismatch in how-to guide, green buttons, inconsistent layout | Unified workbench layout, accurate instructions, amber accents | Individual tool testing across categories | Planned | Medium |
| **Authentication Flow** | `/auth/signin`, `/auth/signup` | Functional NextAuth + Firestore, green UI theme | Preserved auth logic with cohesive amber-accented UI | Sign in, Sign up, Session persistence | Planned | High |
| **Protected Workspace Shell** | `/dashboard`, `/profile`, `/settings` | Inconsistent `bg-black`, mismatched font classes, unused nav items | Cohesive `#0E1118` sidebar shell, Inter font, active nav indicators | Auth session + navigation checks | Planned | Medium |
| **AI Assistant** | `/dashboard/ai`, Tool pages | Expired API key handling, AI chat bubble | Graceful API error/empty state, responsive chat widget | Chat UI inspection & state test | Planned | Medium |
| **URL Shortener** | `/tools/url-shortener`, `/u/[code]` | Broken Firestore route integration | Fully functional Firestore document creation & redirect | Shorten test + redirect test | Planned | High |
| **User Favorites & History** | `/dashboard/favorites`, `/dashboard/history` | Empty / mock placeholders | Firestore collection integration with clean empty states | Add favorite, record history, view lists | Planned | Medium |
| **Command Palette Search** | Global (`⌘K` / `Ctrl+K`) | Search modal with green accents | High-speed fuzzy search with amber highlight, full keyboard nav | Shortcut test, arrow navigation, enter launch | Planned | Low |
| **Secondary Public Pages (13 pages)**| `/about`, `/privacy`, `/terms`, `/faq`, etc. | Disparate formatting and legacy copy | Cohesive, structured information hierarchy & typography | Route check, layout validation, responsiveness | Planned | Low |
| **Payment Subsystem** | `/api/payment/*` | Razorpay endpoints & Pro upgrade prompts | Purged completely; free workspace model | Route inspection, build verification | Planned | Low |
| **Newsletter Subsystem** | `/api/newsletter` | Footer subscription form | Purged completely; clean footer | Footer check, build verification | Planned | Low |
