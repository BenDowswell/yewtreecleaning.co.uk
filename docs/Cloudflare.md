# Deploying Yew Tree Cleaning to Cloudflare Pages

Cloudflare Pages connects directly to your GitHub repository. Every push to `main` automatically builds and deploys your site. No CLI tools, adapters, or manual builds needed.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is fine)
- Your domain `yewtreecleaning.co.uk` added to Cloudflare (for custom domain — optional for initial setup)
- Code pushed to GitHub at `BenDowswell/yewtreecleaning.co.uk`

## Step 1: Connect GitHub to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Click **Workers & Pages** in the left sidebar.
3. Click **Create** > **Pages** tab > **Connect to Git**.
4. Authorise Cloudflare to access your GitHub account if prompted.
5. Select the repository **BenDowswell/yewtreecleaning.co.uk**.
6. Click **Begin setup**.

## Step 2: Configure Build Settings

On the setup screen, enter:

| Setting | Value |
|---|---|
| **Project name** | `yewtreecleaning` |
| **Production branch** | `main` |
| **Framework preset** | Next.js |
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output directory** | `.vercel/output/static` |

> Cloudflare installs `@cloudflare/next-on-pages` automatically during the build — you don't need to install it locally or add it to your package.json.

## Step 3: Set Environment Variables

Still on the setup screen, expand **Environment variables** and add:

| Variable | Value |
|---|---|
| `NODE_VERSION` | `18` |
| `NEXT_PUBLIC_SITE_URL` | `https://yewtreecleaning.co.uk` |

`NODE_VERSION` is important — without it the build will fail because Cloudflare defaults to an older Node version.

## Step 4: Deploy

Click **Save and Deploy**. That's it.

Cloudflare will clone your repo, install dependencies, build the site, and deploy it. The first build takes 2–5 minutes. When it finishes you'll get a live URL:

```
https://yewtreecleaning.pages.dev
```

Visit it to check everything works.

## Step 5: Set Compatibility Flags

After the first deployment, you need to enable one flag for the API routes to work:

1. Go to your Pages project in the dashboard.
2. Click **Settings** > **Functions** > **Compatibility flags**.
3. Add `nodejs_compat` for both **Production** and **Preview**.
4. Click **Save**.

Then trigger a redeploy: go to **Deployments**, click the three dots on the latest deployment, and select **Retry deployment**.

## Step 6: Connect Your Custom Domain

1. In your Pages project, go to **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `yewtreecleaning.co.uk` and click **Continue**.
4. If your domain is already on Cloudflare, the DNS record is added automatically. If not, add this record in your DNS settings:

| Type | Name | Target |
|---|---|---|
| CNAME | `@` | `yewtreecleaning.pages.dev` |

5. Repeat for `www`:

| Type | Name | Target |
|---|---|---|
| CNAME | `www` | `yewtreecleaning.pages.dev` |

Cloudflare provisions a free SSL certificate automatically. It usually activates within minutes.

### Redirect www to the main domain

1. Go to **Rules** > **Redirect Rules**.
2. Create a rule:
   - **When:** Hostname equals `www.yewtreecleaning.co.uk`
   - **Then:** Redirect to `https://yewtreecleaning.co.uk` (dynamic, preserving the path)
   - **Status code:** 301

## How Automatic Deployments Work

Once connected, every push to GitHub triggers a deployment:

| Action | Result |
|---|---|
| Push to `main` | Production deployment at `yewtreecleaning.co.uk` |
| Push to any other branch | Preview deployment at `<branch>.yewtreecleaning.pages.dev` |
| Open a pull request | Preview URL posted as a comment on the PR |

No CI/CD pipelines to configure. Cloudflare handles it all.

## Optional: Performance Settings

These are already good by default but worth checking:

**Speed** > **Optimization:**
- Auto Minify: JavaScript, CSS, HTML — enable all
- Brotli compression — enable (usually on by default)
- Early Hints — enable

**Security** > **Settings:**
- Bot Fight Mode — enable
- Browser Integrity Check — enable

## Important Note: Mock Database

The current site uses an in-memory mock database for bookings, users, and messages. On Cloudflare Workers, this resets between requests since each request may run in a fresh isolate.

**This is fine for now** — it lets you demo all the functionality. When you're ready to go live with real data, the mock database can be swapped for:

- **Cloudflare D1** — Cloudflare's own serverless SQLite (simplest option, stays within Cloudflare)
- **Supabase** — Managed PostgreSQL with a generous free tier
- **Turso** — Edge-hosted SQLite, works well with Cloudflare Workers

The API routes are already structured to make this swap straightforward — only `src/lib/mock-db.ts` needs replacing.

## Troubleshooting

**Build fails:** Check that `NODE_VERSION=18` is set in environment variables.

**API routes return errors:** Make sure the `nodejs_compat` compatibility flag is set (Step 5 above).

**Map tiles not loading:** If you've added a Content Security Policy, allow `https://*.tile.openstreetmap.org` and `https://unpkg.com`.

**SSL not working on custom domain:** Allow up to 24 hours for the certificate to provision. Check that DNS records are correct and the proxy (orange cloud) is enabled.
