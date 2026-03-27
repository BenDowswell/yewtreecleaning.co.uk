# Yew Tree Cleaning

Website for Yew Tree Cleaning — a domestic cleaning service based in Madeley, CW3 9DT, covering approximately 10–15 miles of the surrounding area.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form + Zod validation
- **Maps:** Leaflet with OpenStreetMap
- **Data:** Mock in-memory backend (designed for easy database swap later)

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm

### Install and Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

## Demo Accounts

| Role     | Email                        | Password      |
|----------|------------------------------|---------------|
| Admin    | joy@yewtreecleaning.co.uk    | admin123      |
| Customer | sarah@example.co.uk          | customer123   |
| Customer | james@example.co.uk          | customer123   |

## Deploying to Cloudflare Pages

Cloudflare Pages does not natively support Next.js server-side features (API routes, server components with dynamic data). To deploy this site you need the **`@cloudflare/next-on-pages`** adapter.

### 1. Install the adapter

```bash
npm install -D @cloudflare/next-on-pages
```

### 2. Update `next.config.ts`

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

No additional config is needed — the adapter handles the rest.

### 3. Add a build script

In `package.json`, add:

```json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages",
    "pages:dev": "npx wrangler pages dev .vercel/output/static --compatibility-date=2024-01-01 --compatibility-flags=nodejs_compat"
  }
}
```

### 4. Deploy via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select the repository `BenDowswell/yewtreecleaning.co.uk`.
3. Set the build configuration:
   - **Framework preset:** Next.js
   - **Build command:** `npx @cloudflare/next-on-pages`
   - **Build output directory:** `.vercel/output/static`
4. Under **Environment variables**, add:
   - `NODE_VERSION` = `18`
   - `NEXT_PUBLIC_SITE_URL` = `https://yewtreecleaning.co.uk` (or your Cloudflare Pages URL)
5. Click **Save and Deploy**.

### 5. Custom Domain

Once deployed, go to **Custom domains** in your Pages project and add `yewtreecleaning.co.uk`. Cloudflare will handle the SSL certificate automatically.

### 6. Deploy via CLI (alternative)

```bash
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=yewtreecleaning
```

### Notes on Cloudflare Pages

- The mock in-memory database resets on each deployment and cold start. For production, you would swap it for a persistent database (e.g. Cloudflare D1, Supabase, or PlanetScale).
- API routes run as Cloudflare Workers edge functions.
- Static pages are served from Cloudflare's CDN automatically.
- If you encounter build issues, check the [compatibility matrix](https://github.com/cloudflare/next-on-pages/blob/main/docs/supported.md).

## Project Structure

```
src/
├── app/                  # Pages and API routes (Next.js App Router)
│   ├── about/            # About page
│   ├── admin/            # Admin dashboard (protected)
│   ├── api/              # Mock API routes
│   ├── areas/            # Areas covered page
│   ├── book/             # Booking wizard
│   ├── contact/          # Contact page with forms
│   ├── dashboard/        # Customer dashboard (protected)
│   ├── faq/              # FAQ page
│   ├── gallery/          # Gallery page
│   ├── login/            # Login / register page
│   ├── privacy/          # Privacy policy
│   └── services/         # Services listing + detail pages
├── components/           # Reusable UI components
│   ├── admin/            # Admin dashboard components
│   ├── booking/          # Booking wizard steps
│   ├── dashboard/        # Customer dashboard components
│   ├── forms/            # Contact, quote, login forms
│   ├── gallery/          # Gallery grid and lightbox
│   ├── home/             # Homepage sections
│   ├── layout/           # Header, Footer, MobileNav, WhatsApp button
│   ├── map/              # Interactive Leaflet map
│   ├── seo/              # JSON-LD structured data
│   ├── services/         # Service card component
│   └── ui/               # Design system primitives
├── context/              # React context providers (Auth, Booking)
├── domain/               # Domain types, validation, utilities
├── hooks/                # Custom React hooks
├── lib/                  # API client, mock database, constants
└── styles/               # Theme tokens
```
