# Deploying Yew Tree Cleaning to Cloudflare Pages

This guide walks through every step needed to deploy this Next.js website to Cloudflare Pages, connect a custom domain, and configure it for production.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is fine)
- The domain `yewtreecleaning.co.uk` added to your Cloudflare account (or whichever domain you're using)
- Node.js 18.18+ installed locally
- The repository pushed to GitHub at `BenDowswell/yewtreecleaning.co.uk`

## Step 1: Install the Cloudflare Adapter

The `@cloudflare/next-on-pages` adapter converts a Next.js application into a format that runs on Cloudflare Pages (Workers).

```bash
npm install -D @cloudflare/next-on-pages wrangler
```

## Step 2: Add Build Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "pages:build": "npx @cloudflare/next-on-pages",
    "pages:dev": "npx wrangler pages dev .vercel/output/static --compatibility-date=2024-01-01 --compatibility-flags=nodejs_compat",
    "pages:deploy": "npx wrangler pages deploy .vercel/output/static --project-name=yewtreecleaning"
  }
}
```

## Step 3: Test the Build Locally

Run the Cloudflare build locally to make sure it works before deploying:

```bash
npm run pages:build
```

This will:
1. Run `next build` internally
2. Convert the output into Cloudflare-compatible Workers format
3. Place the result in `.vercel/output/static`

To preview locally using the Cloudflare Workers runtime:

```bash
npm run pages:dev
```

Open [http://localhost:8788](http://localhost:8788) to test.

## Step 4: Deploy via Cloudflare Dashboard

### 4.1 Create the Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, click **Workers & Pages**.
3. Click **Create** then select the **Pages** tab.
4. Click **Connect to Git**.
5. If you haven't already, authorise Cloudflare to access your GitHub account.
6. Select the repository **BenDowswell/yewtreecleaning.co.uk**.
7. Click **Begin setup**.

### 4.2 Configure Build Settings

Set the following on the build configuration screen:

| Setting | Value |
|---|---|
| **Project name** | `yewtreecleaning` |
| **Production branch** | `main` |
| **Framework preset** | Next.js |
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory** | _(leave blank)_ |

### 4.3 Set Environment Variables

Click **Environment variables** and add the following:

#### Production variables

| Variable | Value | Notes |
|---|---|---|
| `NODE_VERSION` | `18` | Required — Cloudflare build uses Node 16 by default |
| `NEXT_PUBLIC_SITE_URL` | `https://yewtreecleaning.co.uk` | Used for SEO metadata |

#### Preview variables (optional)

For preview deployments (non-main branches), you can set:

| Variable | Value |
|---|---|
| `NODE_VERSION` | `18` |
| `NEXT_PUBLIC_SITE_URL` | `https://preview.yewtreecleaning.pages.dev` |

### 4.4 Compatibility Flags

After creating the project, go to **Settings** > **Functions** > **Compatibility flags** and add:

| Flag | Applies to |
|---|---|
| `nodejs_compat` | Production and Preview |

This is required for Next.js API routes to work on Cloudflare Workers.

Alternatively, create a `wrangler.toml` in the project root:

```toml
name = "yewtreecleaning"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
NEXT_PUBLIC_SITE_URL = "https://yewtreecleaning.co.uk"
```

### 4.5 Deploy

Click **Save and Deploy**. Cloudflare will:
1. Clone the repository
2. Install dependencies
3. Run the build command
4. Deploy the output to the Cloudflare edge network

The first build takes 2-5 minutes. You'll get a URL like `https://yewtreecleaning.pages.dev`.

## Step 5: Connect a Custom Domain

### 5.1 Add the Domain

1. In your Pages project, go to **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `yewtreecleaning.co.uk`.
4. Click **Continue**.

### 5.2 DNS Configuration

If your domain is already on Cloudflare DNS, it will add the required CNAME record automatically. If not, add this DNS record manually:

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `@` | `yewtreecleaning.pages.dev` | Proxied (orange cloud) |

For the `www` subdomain, add:

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `www` | `yewtreecleaning.pages.dev` | Proxied (orange cloud) |

### 5.3 SSL Certificate

Cloudflare provisions a free SSL certificate automatically. This usually takes a few minutes but can take up to 24 hours. Your site will be available at `https://yewtreecleaning.co.uk` once the certificate is active.

### 5.4 Redirect www to Apex

To redirect `www.yewtreecleaning.co.uk` to `yewtreecleaning.co.uk`:

1. Go to **Rules** > **Redirect Rules** in the Cloudflare dashboard.
2. Create a new rule:
   - **When:** Hostname equals `www.yewtreecleaning.co.uk`
   - **Then:** Dynamic redirect to `https://yewtreecleaning.co.uk${http.request.uri.path}`
   - **Status code:** 301 (permanent)

## Step 6: Configure Caching and Performance

### 6.1 Page Rules (optional)

Go to **Rules** > **Page Rules** and add:

| URL Pattern | Setting | Value |
|---|---|---|
| `yewtreecleaning.co.uk/api/*` | Cache Level | Bypass |
| `yewtreecleaning.co.uk/*.js` | Cache Level | Cache Everything |
| `yewtreecleaning.co.uk/*.css` | Cache Level | Cache Everything |

API routes should not be cached since they serve dynamic data. Static assets are safe to cache aggressively.

### 6.2 Speed Settings

In **Speed** > **Optimization**:
- **Auto Minify:** Enable for JavaScript, CSS, and HTML
- **Brotli:** Enable (on by default)
- **Early Hints:** Enable
- **HTTP/2:** Enable (on by default)

### 6.3 Security Settings

In **Security** > **Settings**:
- **Security Level:** Medium
- **Bot Fight Mode:** Enable
- **Browser Integrity Check:** Enable

## Step 7: Set Up Automatic Deployments

Cloudflare Pages automatically deploys when you push to the `main` branch. No additional configuration needed.

- **Push to `main`** → Production deployment at `yewtreecleaning.co.uk`
- **Push to any other branch** → Preview deployment at `<branch>.yewtreecleaning.pages.dev`
- **Pull requests** → Preview deployment with a unique URL shown in the PR

## Step 8: Deploy via CLI (Alternative)

If you prefer deploying from your machine rather than via Git integration:

```bash
# Build for Cloudflare
npm run pages:build

# Deploy to production
npm run pages:deploy

# Or deploy to a preview environment
npx wrangler pages deploy .vercel/output/static --project-name=yewtreecleaning --branch=preview
```

You'll need to authenticate first:

```bash
npx wrangler login
```

This opens a browser window to authorise the Wrangler CLI with your Cloudflare account.

## Troubleshooting

### Build fails with "Node.js version" error

Make sure `NODE_VERSION=18` is set in your environment variables. Cloudflare's build environment defaults to an older Node version.

### API routes return 500 errors

Check that the `nodejs_compat` compatibility flag is set. Without it, Node.js APIs used by Next.js won't work in the Workers runtime.

### Static pages work but dynamic routes don't

Ensure the build command is `npx @cloudflare/next-on-pages` and not just `next build`. The adapter is what converts dynamic routes into Workers functions.

### Mock database resets on every request

The in-memory mock database does not persist between requests on Cloudflare Workers (each request may run in a new isolate). For production use, replace the mock database with:

- **Cloudflare D1** — Cloudflare's serverless SQLite database (easiest integration)
- **Supabase** — Managed PostgreSQL with a generous free tier
- **PlanetScale** — Serverless MySQL

### Images or map tiles not loading

Check that your Content Security Policy (if configured) allows:
- `https://*.tile.openstreetmap.org` (map tiles)
- `https://unpkg.com/leaflet@*` (marker icons)

### Custom domain shows "SSL handshake failed"

Wait up to 24 hours for the SSL certificate to provision. If it still fails after that, check that the DNS records are correct and the orange cloud (proxy) is enabled.

## Useful Cloudflare Dashboard Links

Once your project is deployed:

- **Deployments:** Workers & Pages > yewtreecleaning > Deployments
- **Analytics:** Workers & Pages > yewtreecleaning > Analytics
- **Custom domains:** Workers & Pages > yewtreecleaning > Custom domains
- **Environment variables:** Workers & Pages > yewtreecleaning > Settings > Environment variables
- **Build logs:** Click on any deployment to see the full build output
