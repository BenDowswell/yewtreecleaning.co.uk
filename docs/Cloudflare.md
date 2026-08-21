# Deploying Yew Tree Cleaning to Cloudflare

The site is fully static — Astro prerenders every page into `dist/`, and Cloudflare
serves those files directly. There is **no Worker script**, no server-side rendering,
no environment variables and no secrets.

## One-time setup

You need the Cloudflare account that owns the `yewtreecleaning` Worker, and Node 20+.

```bash
npm install
npx wrangler login
```

`wrangler login` opens a browser to authorise the CLI. It only needs doing once
per machine.

## Deploying

```bash
npm run deploy
```

That runs `astro build` and then `wrangler deploy`. The whole thing takes a few
seconds — there is nothing to compile server-side.

To check what you're about to ship without deploying:

```bash
npm run build
npx wrangler dev
```

`wrangler dev` serves `dist/` through the same assets runtime Cloudflare uses in
production, including the 404 behaviour, on <http://localhost:8787>.

## Configuration

Everything lives in `wrangler.jsonc`:

```jsonc
{
  "name": "yewtreecleaning",
  "compatibility_date": "2026-08-21",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "observability": { "enabled": true }
}
```

- **No `main`** — there is no Worker script, so Cloudflare serves assets only.
- **`not_found_handling: "404-page"`** — unknown paths return `dist/404.html`
  with a real 404 status, rather than redirecting to the homepage.
- **No `compatibility_flags`** — `nodejs_compat` was needed by the old Next.js
  Worker and is not needed now.

## Custom domain

Point `yewtreecleaning.co.uk` at the Worker under **Workers & Pages →
yewtreecleaning → Settings → Domains & Routes**. Because the domain is already on
Cloudflare, adding a custom domain there creates the DNS record for you.

The site URL is also hardcoded in two places, both of which need updating if the
domain ever changes:

- `astro.config.mjs` — `site:`, used for canonical URLs and the sitemap
- `public/robots.txt` — the `Sitemap:` line

## Deploying from GitHub instead

If you would rather push to `main` and have Cloudflare build it, connect the repo
under **Workers & Pages → Create → Connect to Git** and use:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |

No environment variables are required. Note that this and `npm run deploy` are two
routes to the same Worker — pick one and stick with it, or a manual deploy will be
overwritten by the next push.

## What is not here

Earlier versions of this site ran on Next.js with API routes, a booking wizard and
an admin area backed by an in-memory database. All of that has been removed. If
online booking is ever wanted again it needs a real database — the previous
implementation lost its data on every cold start.
