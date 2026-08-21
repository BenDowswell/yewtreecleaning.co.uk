# Yew Tree Cleaning

Website for Yew Tree Cleaning — a domestic cleaning service based in Madeley, CW3 9DT, covering approximately 10 miles of the surrounding area.

A single-scroll marketing page built from the approved Claude Design file. There is no application behind it: no forms, no accounts, no database. Customers get in touch by phone, email or WhatsApp.

## Tech stack

- **Framework:** [Astro 7](https://astro.build) — fully static output, no adapter
- **Styling:** Plain CSS using design tokens copied from the Claude Design system
- **JavaScript:** None. The page ships zero bytes of JS; the FAQ uses native `<details>`
- **Hosting:** Cloudflare Workers static assets

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open <http://localhost:4321>.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Type-check `.astro` and `.ts` files |
| `npm run deploy` | Build, then deploy to Cloudflare |

## Project structure

```
src/
  data/site.ts          All copy: business details, services, FAQ, areas
  styles/tokens/*.css   Design tokens, copied verbatim from Claude Design
  styles/global.css     Token imports, reset, focus and skip-link styles
  layouts/BaseLayout    <head>, fonts, SEO meta, LocalBusiness JSON-LD
  components/*.astro    One component per page section
  pages/index.astro     Composes the sections
  pages/404.astro
public/                 favicon.svg, robots.txt
```

### Editing content

Almost every text change is a one-line edit in `src/data/site.ts` — prices, phone
number, email, the service list, and the FAQ all live there. Section headings and
body copy live in the matching component in `src/components/`.

### Design tokens

`src/styles/tokens/` is a verbatim copy of the token files from the Claude Design
system, so they can be diffed against the source if the design changes. Component
styles reference them as CSS custom properties (`var(--brand-green-400)`) rather
than hardcoding values.

## Deployment

See [docs/Cloudflare.md](docs/Cloudflare.md).

## Notes

- The site deliberately ships no JavaScript. If you add an interactive component,
  check `dist/` afterwards to confirm you meant to start shipping a bundle.
- There is no analytics, no cookie banner, and no third-party script. The only
  external request is the Inter webfont from Google Fonts.
