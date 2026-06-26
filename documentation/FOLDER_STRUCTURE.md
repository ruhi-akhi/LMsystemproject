# Smart Inventory — Folder Structure (ThemeForest Ready)

This is the **clean production structure** for the Smart Inventory Next.js 15 template.
Use this as a blueprint when building your next ThemeForest item.

> **Note:** This project uses **Next.js App Router** (`src/app/`), not the legacy `src/pages/` pattern from Vuexy/MUI templates. The architecture pattern is the same: **routes in `app/`**, **UI in `components/`**, **config in `configs/`**, **data in `lib/` + `public/data/`**.

---

## Root Level

```text
smart-inventory/
├── backend/                    # Socket.IO real-time server (optional)
│   └── server/
├── documentation/              # Buyer HTML docs (ThemeForest required)
│   ├── index.html
│   └── FOLDER_STRUCTURE.md     # This file
├── docs/                       # Markdown guides (installation, deploy, license)
├── marketplace-assets/         # Envato screenshots & thumbnails
├── public/                     # Static assets
├── scripts/                    # Build / screenshot utilities
├── src/                        # All application source code
├── .env.example
├── LICENSE
├── next.config.ts
├── package.json
├── README.md
├── tsconfig.json
└── vercel.json
```

---

## `public/` — Static Assets

```text
public/
├── data/
│   └── blogs.json              # Blog demo content (static JSON)
├── favicon.svg
└── (add images/ for buyer screenshots)
```

**Recommended for new projects:**
```text
public/
├── images/
│   ├── logos/
│   ├── pages/
│   └── products/
└── locales/                    # en.json, etc. (optional i18n)
```

---

## `src/` — Main Source Code

```text
src/
├── app/                        # Next.js App Router (URL = folder path)
├── components/                 # UI components (design layer)
├── configs/                    # App configuration
├── db/                         # MongoDB connection
├── firebase/                   # Firebase auth config
├── lib/                        # Services, helpers, demo data
├── models/                     # Mongoose schemas
├── utils/                      # Small utilities
└── middleware.ts               # Auth & route protection
```

---

## `src/app/` — Routes (Pages + API)

```text
src/app/
├── (auth)/                     # Auth route group
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── send-otp/
│   ├── verify-otp/
│   └── callback/
├── (public)/                   # Marketing route group
│   ├── page.tsx                # Homepage (/)
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── shop/
│   └── qr-demo/
├── api/                        # REST API routes
│   ├── auth/
│   ├── categories/
│   ├── products/
│   ├── orders/
│   ├── dashboard/
│   ├── dashboard-inventory/
│   ├── demo-data/
│   ├── demo-products/
│   ├── notifications/
│   ├── restock-queue/
│   ├── activity-log/
│   ├── scan/
│   └── chat/
├── dashboard/                  # Protected admin area
│   ├── layout.tsx              # Sidebar + topbar shell
│   ├── inventory/              # Main dashboard
│   ├── products/
│   ├── categories/
│   ├── orders/
│   ├── restock-queue/
│   ├── activity-log/
│   ├── analytics/
│   ├── profile/
│   └── settings/
├── blog/[slug]/                # Blog detail
├── demo/                       # Demo video page
├── faq/
├── privacy-policy/
├── refund/
├── terms/
├── scan/
├── layout.tsx                  # Root layout
├── globals.css
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

**Architecture rule (ThemeForest standard):**
```text
URL request
    ↓
src/app/dashboard/products/page.tsx    ← Thin route file
    ↓ imports
src/components/dashboard/DashboardUI.tsx  ← Reusable UI
src/configs/site.ts                       ← App config
    ↓ data from
src/lib/demo-data.ts  OR  src/app/api/*   ← API / seed data
```

---

## `src/components/` — UI Layer

```text
src/components/
├── blog/                       # Blog sections
├── chat/                       # AI + Live chat widgets
├── dashboard/                  # Dashboard UI primitives (cards, panels)
├── layout/                     # Navbar, Footer, Logo
├── marketing/                  # Homepage sections (Hero, Impact, etc.)
├── legal/                      # (optional) group Privacy/Terms/Refund
├── PrivacyPolicy/
├── RefundPolicy/
├── TermsAndConditions/
└── providers/                  # Client-side providers
```

---

## `src/configs/` — Configuration

```text
src/configs/
└── site.ts                     # Brand name, colors, demo credentials, links
```

---

## `src/lib/` — Business Logic & Services

```text
src/lib/
├── auth.ts                     # JWT helpers
├── default-categories.ts       # Auto-seed categories
├── demo-data.ts                # One-click demo seed
├── db.ts                       # Demo product schemas (QR flow)
└── productImage.ts             # Image URL helpers (in utils/)
```

---

## `src/models/` — Database Schemas

```text
src/models/
├── User.ts
├── Category.ts
├── Product.ts
├── Order.ts
├── ActivityLog.ts
├── RestockQueue.ts
├── Notification.ts
├── Transaction.ts
└── index.ts                    # Model registry
```

---

## `backend/server/` — Socket.IO (Optional)

```text
backend/server/
├── socket-server.ts
├── package.json
├── tsconfig.json
└── .env.example
```

Run:
```bash
cd backend/server && npm install && npm run dev
```

---

## ThemeForest ZIP Checklist

**Include:**
- `src/`, `public/`, `documentation/`, `docs/`, `backend/server/` (no `node_modules`)
- `.env.example`, `LICENSE`, `README.md`
- `marketplace-assets/` screenshots

**Exclude:**
- `node_modules/`
- `.next/`
- `.env.local`
- `backend/server/node_modules/`

---

## Quick Copy for Your Next Project

```text
✅ public/data/
✅ documentation/index.html
✅ src/app/(public)/ + (auth)/ + dashboard/ + api/
✅ src/components/marketing/ + dashboard/ + layout/
✅ src/configs/site.ts
✅ src/lib/demo-data.ts
✅ src/models/
✅ backend/server/ (if real-time needed)
✅ package.json + next.config.ts + tsconfig.json
```

---

*Smart Inventory v1.0.0 — ThemeForest submission structure*
