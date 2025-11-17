Use Next.js 14 (App router) + TailwindCSS + Prisma + SQLite.

Create the following pages with components:

1. Home Page:
   - Hero slider with 3 images
   - Video section
   - News section with cards

2. Product Page:
   - Grid of products
   - Product detail page

3. Cashback Page:
   - User cashback balance
   - Transaction history

4. Prize Page:
   - Prize list
   - Claim button

5. Profile Page (Me):
   - User info
   - Logout
   - Edit profile

6. Admin Panel:
   - Add Product
   - Add News
   - View Users
   - Dashboard stats

7. Backend APIs:
   - /api/auth/login
   - /api/auth/register
   - /api/products/add
   - /api/products/list
   - /api/news/add
   - /api/news/list
   - /api/contact/submit

8. Database using Prisma + SQLite:
   Models:
   - User (id, name, email, password, cashback)
   - Product (id, name, desc, price, image)
   - News (id, title, content, thumb, date)
   - ContactMessages (id, name, email, message)
   - Orders (id, userId, productId, amount, status)

9. Add JWT based login and signup system.

10. Add Stripe payment integration for checkout.

11. Create UI components:
   - Bottom navigation bar
   - HeroSlider using SwiperJS
   - NewsCard
   - VideoBanner

Then
 generate all files in correct folder structure.




my-app/
│
├─ app/                         # Next.js app folder (pages if pages router)
│   ├─ register/                 # Registration page
│   │   └─ page.tsx
│   ├─ login/
│   │   └─ page.tsx
│   ├─ products/                 # Product listing/details
│   │   └─ [id]/page.tsx
│   ├─ orders/
│   │   ├─ create/
│   │   │   └─ route.ts          # Create new order
│   │   ├─ success/page.tsx      # Success page
│   │   └─ index/page.tsx        # Orders listing
│   └─ ... other pages
│
├─ api/
│   ├─ auth/
│   │   ├─ send-otp/route.ts     # Send OTP
│   │   ├─ verify-otp/route.ts   # Verify OTP
│   │   └─ register/route.ts     # Register user
│   ├─ stripe/
│   │   └─ webhook/route.ts      # Stripe webhook
│   ├─ cashback/
│   │   └─ transactions/route.ts # Fetch cashback transactions
│   └─ ... other APIs
│
├─ lib/                          # Utility functions / helpers
│   ├─ prisma.ts                 # Prisma client
│   ├─ stripe.ts                 # Stripe client
│   ├─ middleware.ts             # Auth middleware, etc.
│   └─ ... other helpers
│
├─ prisma/
│   ├─ schema.prisma             # Database schema
│   └─ migrations/               # Prisma migrations
│
├─ components/                   # Reusable React components
│   ├─ Button.tsx
│   ├─ Input.tsx
│   ├─ Layout.tsx
│   └─ ... other components
│
├─ styles/
│   ├─ globals.css
│   └─ tailwind.css (if using Tailwind)
│
├─ .env                          # Environment variables
├─ package.json
├─ next.config.js
└─ tsconfig.json


DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
JWT_SECRET="your_jwt_secret"
STRIPE_SECRET_KEY="sk_test_XXXX"
STRIPE_WEBHOOK_SECRET="whsec_XXXX"
EMAIL_USER="youremail@gmail.com"
EMAIL_PASS="app_specific_password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
