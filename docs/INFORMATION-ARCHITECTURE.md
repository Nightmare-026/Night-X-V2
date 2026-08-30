# Night X V2 — Information Architecture Specification

## 1. Hierarchy Model

Night X V2 is structured around user goals: **Discover Tools**, **Execute Workflows Locally**, **Manage Workspace Tasks**, and **Understand Privacy & Principles**.

```text
[Global Header] ─────────────────────────────────────────────────────────────┐
│ Brand ("Night X")  │  Nav: [Home] [Tools] [About]  │  [⌘K Search]  │  [Auth / Account] │
└────────────────────────────────────────────────────────────────────────────┘
     │
     ├── 1. PUBLIC MARKETING & DISCOVERY
     │    ├── / (Homepage with Live Workbench & Ecosystem Explorer)
     │    ├── /tools (Full Tool Catalog with Category & Tag Filtering)
     │    └── /tools/[slug] (Individual Tool Workbenches)
     │
     ├── 2. AUTHENTICATED WORKSPACE APP SHELL (/dashboard/*, /profile, /settings)
     │    ├── /dashboard (Workspace Overview & Quick Launchers)
     │    ├── /dashboard/ai (AI Assistant & Generator Suite)
     │    ├── /dashboard/favorites (Saved Quick-Access Tools)
     │    ├── /dashboard/history (Recent Local Runs)
     │    ├── /profile (User Account Details)
     │    └── /settings (Preferences, Shortcuts & Data Management)
     │
     ├── 3. PLATFORM & TRANSPARENCY (Footer / Linked)
     │    ├── /about (Mission, Architecture & Privacy Design)
     │    ├── /pricing ("100% Free Workspace" Philosophy & FAQs)
     │    ├── /docs (API & Client-Side Execution Documentation)
     │    ├── /status (Live System & Client Engine Health)
     │    └── /changelog (Release Timeline & Updates)
     │
     ├── 4. SUPPORT & FEEDBACK
     │    ├── /support (Help Center & Troubleshooting)
     │    ├── /contact (Direct Communication Channel)
     │    ├── /faq (Frequently Asked Questions)
     │    └── /feedback (Product Feedback & Feature Requests)
     │
     └── 5. LEGAL & COMPLIANCE
          ├── /privacy (Zero-Data Retention Policy)
          ├── /terms (Terms of Service)
          ├── /security (Security Architecture Whitepaper)
          └── /services (Capability Reference)
```

## 2. Navigation Components Specification

### A. Primary Desktop Header
- **Logo**: `BrandWordmark` with clean link to `/`.
- **Primary Nav**:
  - `Home` (`/`)
  - `Tools` (`/tools`)
  - `About` (`/about`)
  - *(When logged in)* `Dashboard` (`/dashboard`)
- **Utility Actions**:
  - `Search`: Search trigger pill with dynamic OS shortcut (`⌘K` / `Ctrl+K`).
  - `Unauthenticated`: `Sign In` text link + `Get Started` amber button.
  - `Authenticated`: User avatar chip with accessible dropdown menu (`Dashboard`, `Profile`, `Settings`, `Sign Out`).

### B. Mobile Navigation
- Single hamburger trigger with clear `aria-expanded` and `aria-controls`.
- Drawer overlay with grouped sections: Primary Destinations, 7 Ecosystem Suites, and Account Actions.
- Focus trap and body scroll lock on open; dismissible via `Escape` or backdrop touch.

### C. Authenticated Workspace Sidebar
- Persistent left rail for screens `≥ 1024px`, collapsable slide-over on mobile.
- Section 1: **Workspace** (`Overview`, `All Tools`, `AI Workspace`, `Favorites`, `History`).
- Section 2: **Preferences** (`My Profile`, `Settings`).
- Footer: User identity card + one-click `Sign Out`.

### D. Global Footer
- **Col 1 (Brand & Mission)**: Night X wordmark, client-side first description, live system operational indicator.
- **Col 2 (Ecosystem)**: Direct links to 6 category filters (`Image`, `Security`, `Text`, `Developer`, `Life`, `AI`).
- **Col 3 (Platform & Docs)**: `Tools Catalog`, `Documentation`, `Why Free?`, `Changelog`, `System Status`.
- **Col 4 (Resources & Legal)**: `About`, `Security Center`, `Privacy Policy`, `Terms`, `Support`, `FAQ`, `GitHub`.
