# DigitalRecharge.tn

Modern digital marketplace web app built with:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)
- Zod + React Hook Form
- Server Actions
- Vercel-ready deployment

## Folder structure

```text
app/
  admin/                    # admin dashboard (protected)
  account/orders/           # user orders (auth)
  cart/ checkout/ shop/     # storefront + order flow
  product/[slug]/           # product details
  order-created/ orders/[id]/ # post-checkout pages
  login/ signup/            # email/password auth
  terms/ refund-policy/ privacy/
components/
  admin/ forms/ ui/
lib/
  actions/                  # server actions
  supabase/                 # supabase clients
  auth.ts cart.ts data.ts validation.ts
supabase/
  migrations/20260304_init.sql
  seed.sql
types/
```

## 1) Create Supabase project

1. Go to Supabase and create a new project.
2. In Supabase SQL editor, run:
   - `supabase/migrations/20260304_init.sql`
   - then `supabase/seed.sql`
3. In Authentication settings:
   - enable Email/Password provider.
4. In API settings:
   - copy Project URL, anon key, service role key.

## 2) Environment variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_WHATSAPP_NUMBER=216XXXXXXXX
```

## 3) Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4) Admin setup

After creating your first user account, set admin manually:

```sql
update public.profiles
set is_admin = true
where user_id = 'YOUR_AUTH_USER_ID';
```

Then access `/admin`.

## 5) Deploy to Vercel

1. Push project to GitHub.
2. Import project in Vercel.
3. Add all env vars from `.env.example`.
4. Deploy.
5. Set `NEXT_PUBLIC_SITE_URL` to your production domain.

## Main capabilities implemented

- Public storefront (`/`, `/shop`, `/product/[slug]`) with SEO metadata/OpenGraph.
- Session cart via cookies + checkout with Tunisia-friendly payment methods.
- Order creation flow + WhatsApp pre-filled actions + optional payment proof upload.
- Auth (email/password), account orders pages, and order details.
- Role-based admin area for categories/products/orders management.
- Legal pages: terms, refund policy, privacy.
