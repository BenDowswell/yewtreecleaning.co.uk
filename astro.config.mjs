// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Fully static: the site has no forms and no server endpoints, so it needs no
// adapter. The build output in dist/ is served directly by Cloudflare Workers
// static assets (see wrangler.jsonc).
export default defineConfig({
  site: 'https://yewtreecleaning.co.uk',
  integrations: [sitemap()],
});
