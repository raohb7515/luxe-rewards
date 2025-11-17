# Luxe Rewards - Premium Shopping Platform

A modern e-commerce platform built with Next.js 14, featuring cashback rewards, prize redemption, and a comprehensive admin panel.

## Features

- 🛍️ **Product Catalog** - Browse and purchase premium products
- 💰 **Cashback System** - Earn 5% cashback on every purchase
- 🎁 **Prize Redemption** - Redeem cashback for exciting prizes
- 📰 **News Section** - Stay updated with latest news and announcements
- 👤 **User Profiles** - Manage your account and view cashback balance
- 🔐 **JWT Authentication** - Secure login and registration
- 💳 **Stripe Integration** - Secure payment processing
- 🎛️ **Admin Panel** - Complete admin dashboard for managing products, news, and users

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Database**: Prisma + SQLite
- **Authentication**: JWT (jsonwebtoken)
- **Payments**: Stripe
- **UI Components**: SwiperJS for hero slider
- **Notifications**: react-hot-toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Stripe account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxe-rewards
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # JWT Secret (generate a strong random string)
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # Stripe Keys (get from https://dashboard.stripe.com/apikeys)
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # App URL (for Stripe redirects)
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Create an admin user** (optional)
   
   You can create an admin user through the registration page and then manually update the database:
   ```bash
   npx prisma studio
   ```
   Then set `isAdmin: true` for your user in Prisma Studio.

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── page.tsx        # Admin dashboard
│   │   ├── products/       # Add product page
│   │   ├── news/           # Add news page
│   │   └── users/          # View users page
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── products/       # Product endpoints
│   │   ├── news/           # News endpoints
│   │   ├── orders/         # Order endpoints
│   │   ├── prizes/         # Prize endpoints
│   │   ├── cashback/       # Cashback endpoints
│   │   ├── contact/        # Contact form endpoint
│   │   ├── admin/          # Admin endpoints
│   │   └── webhooks/       # Stripe webhooks
│   ├── cashback/           # Cashback page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── products/           # Products listing and detail pages
│   ├── prize/              # Prize redemption page
│   ├── profile/            # User profile page
│   ├── orders/             # Order success page
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── BottomNav.tsx      # Bottom navigation bar
│   ├── HeroSlider.tsx     # Hero slider with Swiper
│   ├── NewsCard.tsx       # News card component
│   ├── NewsSection.tsx    # News section component
│   └── VideoBanner.tsx    # Video banner component
├── lib/                   # Utility libraries
│   ├── auth.ts            # JWT authentication utilities
│   ├── middleware.ts      # Auth middleware
│   ├── prisma.ts          # Prisma client
│   └── stripe.ts          # Stripe client
└── prisma/
    └── schema.prisma      # Database schema
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/update` - Update user profile (requires auth)

### Products
- `GET /api/products/list` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products/add` - Add product (admin only)

### News
- `GET /api/news/list` - List all news
- `POST /api/news/add` - Add news (admin only)

### Orders
- `POST /api/orders/create` - Create order and Stripe checkout session

### Prizes
- `GET /api/prizes/list` - List all prizes
- `POST /api/prizes/claim` - Claim a prize (requires auth)

### Cashback
- `GET /api/cashback/transactions` - Get user's cashback transactions (requires auth)

### Contact
- `POST /api/contact/submit` - Submit contact form

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `GET /api/admin/users` - Get all users (admin only)

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Database Models

- **User** - User accounts with cashback balance
- **Product** - Product catalog
- **News** - News articles
- **Order** - Purchase orders
- **Prize** - Redeemable prizes
- **PrizeClaim** - Prize redemption records
- **CashbackTransaction** - Cashback transaction history
- **ContactMessage** - Contact form submissions

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Set up a webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`
4. Copy the webhook secret to your `.env` file

## Admin Panel

Access the admin panel at `/admin` (requires admin privileges).

Features:
- Dashboard with statistics
- Add/Manage products
- Add/Manage news articles
- View and manage users

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

## License

This project is created for educational purposes.

## Support

For issues and questions, please open an issue on the repository.

