z# Night X - Redesign Audit Report

## 1. Route Inventory & Status

| Route Path | Page Type | Public/Protected | Status | Priority | Key Issues Identified |
|------------|-----------|------------------|--------|----------|-----------------------|
| `/` | Homepage | Public | 200 OK | High | Needs premium 3D hero, brand update, fix generic CTAs, remove placeholder icons. |
| `/dashboard` | App Core | Protected | 200 OK | High | Auth gate works. Needs design system update. |
| `/dashboard/ai` | AI Hub | Protected | 200 OK | High | Heavy layout; verify lazy loading. |
| `/profile` | User Mgmt | Protected | 200 OK | Medium | Standardize form components, padding. |
| `/settings` | App Config | Protected | 200 OK | Medium | Needs consistent UI shell. |
| `/about` | Legal/Info | Public | 200 OK | Low | Needs better brand story copy, remove fake stats. |
| `/contact` | Form | Public | 200 OK | Medium | Verify form functionality, improve visual states. |
| `/faq` | Info | Public | 200 OK | Low | Styling update. |
| `/feedback` | Form | Public | 200 OK | Medium | Fix spacing, standardize input fields. |
| `/privacy`, `/security`, `/terms`, `/services` | Legal | Public | 200 OK | Low | Check text formatting, ensure accurate claims. |
| `/support` | Info/Form | Public | 200 OK | High | Remove or disable "Coming Soon" payment/donation blocks. |
| `/auth/signin`, `/auth/signup`, `/auth/forgot-password` | Auth | Public | 200 OK | High | Need full premium styling, currently functional but basic. |
| `/pricing` | Info | Public | **404** | High | Broken link in footer. Must create or remove. |
| `/api-docs` | Info | Public | **404** | Medium | Broken link in footer. Must create or remove. |
| `/changelog` | Info | Public | **404** | Low | Broken link in footer. Must create or remove. |
| `/status` | Info | Public | **404** | Low | Broken link in footer. Must create or remove. |

## 2. Tools Inventory (42 Tools)
- **Public Tools:** `/tools/[slug]` where `isPublic: true` (e.g., Image Compressor, Word Counter)
- **Protected Tools:** `/tools/[slug]` where `isPublic: false` (redirects to `/auth/signin`)
- **Key Issues:** The `[slug]` template needs a universal layout update (breadcrumbs, clear input/output areas, related tools section, removing broken symbols).

## 3. UI/UX & Brand Issues
- **Logo:** Currently uses a generic `N` box with glow `shadow-[0_0_12px_rgba(139,92,246,0.4)]`. Needs replacement with "Night X" wordmark.
- **Footer:** Broken icon (Heart) in "Made with Heart in India". "Stay Updated" form looks functional UI-wise but may not be wired to a backend.
- **Icons:** Inconsistent Lucide/emoji usage across `tools-registry.ts`.
- **Styling:** The `globals.css` and hard-coded tailwind values need alignment with the new design system (deep navy, electric cyan, etc.).

## 4. Authentication Architecture
- Currently using `next-auth` middleware (with `auth.config.ts`), though the backend provider might be wired to Firebase. Need to improve UI states across the auth flows.

## 5. Next Steps
Move to **Phase 1: Brand and design system rebuild**.
