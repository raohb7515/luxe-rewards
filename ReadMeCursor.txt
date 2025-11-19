Luxe Rewards – Next.js 14 (App Router) + Tailwind CSS + Prisma + SQLite

This document reflects the current project layout so you can quickly find key app, API, and library files.

app/
├─ globals.css
├─ layout.tsx
├─ page.tsx
├─ admin/
│  ├─ page.tsx                    # Admin dashboard with stats
│  ├─ news/
│  │  └─ add/page.tsx            # Add news article form
│  ├─ products/
│  │  └─ add/page.tsx            # Add product form
│  └─ users/page.tsx             # User management table
├─ cashback/page.tsx
├─ login/page.tsx
├─ news/
│  └─ [id]/page.tsx              # News detail page
├─ orders/
│  └─ success/page.tsx          # Order success confirmation
├─ prize/page.tsx
├─ products/
│  ├─ page.tsx                   # Product listing grid
│  └─ [id]/page.tsx              # Product detail page
├─ profile/page.tsx
├─ register/page.tsx
└─ api/
   ├─ admin/                     # ALL admin-only API routes
   │  ├─ news/
   │  │  └─ add/route.ts         # POST: Add news (admin only)
   │  ├─ products/
   │  │  └─ add/route.ts         # POST: Add product (admin only)
   │  ├─ stats/route.ts          # GET: Dashboard statistics (admin only)
   │  └─ users/route.ts          # GET: List all users (admin only)
   ├─ auth/
   │  ├─ login/route.ts          # POST: User login (sets HTTP-only cookie)
   │  ├─ me/route.ts             # GET: Get current user (requires auth)
   │  ├─ register/route.ts       # POST: User registration
   │  ├─ send-otp/route.ts       # POST: Send OTP email
   │  ├─ update/route.ts         # PUT: Update user profile (requires auth)
   │  └─ verify-otp/route.ts      # POST: Verify OTP
   ├─ cashback/
   │  └─ transactions/route.ts   # GET: User cashback transactions (requires auth)
   ├─ contact/
   │  └─ submit/route.ts         # POST: Submit contact form
   ├─ news/
   │  └─ list/route.ts           # GET: List all news (public)
   ├─ orders/
   │  └─ create/route.ts         # POST: Create order + Stripe checkout
   ├─ prizes/
   │  ├─ claim/route.ts          # POST: Claim prize (requires auth)
   │  └─ list/route.ts           # GET: List all prizes (public)
   ├─ products/
   │  ├─ [id]/route.ts           # GET: Get product by ID (public)
   │  └─ list/route.ts           # GET: List all products (public)
   ├─ stripe/
   │  └─ webhook/route.ts        # POST: Stripe webhook handler
   └─ webhooks/
      └─ stripe/route.ts         # POST: Alternative Stripe webhook

components/
├─ BottomNav.tsx                 # Bottom navigation bar
├─ HeroSlider.tsx                # Hero slider with SwiperJS
├─ NewsCard.tsx                  # News card component
├─ NewsSection.tsx               # News section component
└─ VideoBanner.tsx               # Video banner component

lib/
├─ auth.ts                       # JWT generation/verification, password hashing
├─ middleware.ts                 # requireAuth & requireAdmin for API routes
├─ otpStore.ts                   # In-memory OTP storage
├─ prisma.ts                     # Prisma client singleton
└─ stripe.ts                     # Stripe SDK configuration

prisma/
├─ schema.prisma                 # Database schema (User, Product, News, Order, etc.)
├─ dev.db                        # SQLite database file
└─ migrations/
   └─ 20251118210612_init/
      └─ migration.sql

Root files
├─ middleware.ts                 # Root edge middleware protecting /admin routes
├─ package.json                  # Dependencies: jose, jsonwebtoken, zod, etc.
├─ tailwind.config.ts
├─ tsconfig.json
├─ README.md
└─ PROJECT_SUMMARY.md

Authentication & Authorization

- JWT token stored in HTTP-only cookie named `token` (set by `/api/auth/login`)
- Root `middleware.ts` protects `/admin/:path*` routes:
  - Reads JWT from cookie
  - Verifies token using jose (edge-compatible)
  - Redirects to `/login` if token missing, invalid, or user is not admin
- API routes use `lib/middleware.ts`:
  - `requireAuth()` accepts JWT from Authorization header OR cookie
  - `requireAdmin()` extends requireAuth to check `isAdmin: true`
  - All admin API routes are under `/api/admin/*`
- Admin pages use `credentials: 'include'` in fetch calls to send cookies
- Login API sets cookie with:
  - `httpOnly: true`
  - `secure: true` in production, `false` in development
  - `sameSite: 'strict'` in production, `'lax'` in development
  - `path: '/'`
  - `maxAge: 7 days`

Environment Variables (.env)
- `DATABASE_URL` - Prisma database connection string
- `JWT_SECRET` - Secret key for JWT signing/verification
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `EMAIL_USER` - Email account for sending OTPs
- `EMAIL_PASS` - Email account password
- `NEXT_PUBLIC_APP_URL` - Public app URL (e.g., http://localhost:3000)
