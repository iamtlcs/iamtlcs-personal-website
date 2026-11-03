This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and self-host Inter.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Rendering and Vercel operations

The homepage is prerendered with English content and build metadata. Theme is
applied by a small head script before paint; saved language is restored after
hydration. Providers do not hide the page while preferences load.

Skills (including Three.js), Projects, and Contact are split into conditional
imports. The command palette loads on click or Cmd/Ctrl+K. Font Awesome is loaded
only when Skills opens. The hidden rear portrait loads after the first flip.
Decorative particles stop for reduced motion and hidden tabs. The 3D canvas also
stops offscreen or behind its details dialog and uses cheaper mobile settings.

The footer receives public Vercel Git metadata at build time, so page loads do
not invoke a metadata function. It does not fabricate latency, uptime, deployment
timestamps, or monitoring results. Redeploy to refresh displayed Git metadata.

- `/api/deployment-info` is public metadata, cached at the CDN for 300 seconds
  with a 600-second stale-while-revalidate window.
- `/api/status` is a public liveness response, cached for 60 seconds with a
  300-second stale-while-revalidate window. It is not a real-time dependency check.
- Both functions use `hkg1` (Hong Kong), configured in `vercel.json`. Their responses report the actual
  `VERCEL_REGION`, or `null` locally, rather than inventing a region.
- BotID is intentionally absent from these public, cacheable responses. Protect
  future private or sensitive endpoints separately and do not publicly cache them.
- Security headers are static Next.js configuration. The root-only Next.js 16
  proxy preserves the curl JSON resume; its response is private/no-store so it
  cannot pollute the normal HTML cache. Assets do not pass through the proxy.
- Next.js/Vercel manage static-file and optimized-image caching. Mutable public
  image URLs do not receive an incorrect immutable browser-cache policy.

### Dashboard configuration after deployment

These account settings cannot be activated by the repository:

1. Enable [Web Analytics](https://vercel.com/docs/analytics/quickstart) and
   [Speed Insights](https://vercel.com/docs/speed-insights/quickstart) for the
   project. Both SDK components are installed in the root layout. Verify events
   and inspect mobile LCP, INP, and CLS after deployment.
2. Configure a [WAF rate limit](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
   for `/api/status` and `/api/deployment-info`: start with 100 requests per
   60 seconds per IP, returning 429. Review traffic and applicable plan usage
   before enabling. Do not challenge static assets, robots.txt, or sitemap.xml.
   The old per-instance in-memory Map was removed; it was not a shared rate limit.
3. Confirm the function region and compare it with your visitors. The global CDN
   serves static content independently of function placement.
4. On a preview deployment, verify browser HTML returns 200, both API routes
   return JSON, security headers are present, optimized images load, and repeat
   requests show the expected `x-vercel-cache` behavior. WAF challenges can mask
   origin responses during automated checks.

### Local production verification

Use Node.js 26.13.0 (`nvm use` reads `.nvmrc`), then `npm ci`, `npm run build`, and `npm start`.
A production runtime smoke check is required in addition to the build: verify
HTML with a browser user agent and the JSON resume with curl. With JavaScript
disabled, the homepage heading, biography, certifications, and footer should
remain visible. In browser Network tools, confirm Three.js and the icon-font
stylesheet are absent until Skills opens, and the console bundle is absent until
it opens. Test saved theme/language, mobile navigation, and keyboard shortcuts.

With the production server running, `npm run check:production` verifies runtime
responses, server HTML, cache policy, and that the initial scripts exclude the 3D
renderer. To check another URL, pass it explicitly, for example
`npm run check:production -- http://127.0.0.1:3001`.


## Dependency security and Node.js

The project targets Node.js 26.x on Vercel and pins 26.13.0 locally and in CI
using `.nvmrc` and `.node-version`. Install dependencies with `npm ci`; commit
`package-lock.json` alongside dependency changes. The production CI job installs
Node from `.nvmrc`, audits production dependencies, builds, and runs the HTTP
smoke checks. GitHub Actions' own Node runtime is separate from the application
runtime selected by setup-node.

The November 2026 Trivy remediation upgrades Next.js/eslint-config-next to
16.4.4 and refreshes Sharp, PostCSS, nanoid, fflate, source-map-js, and
baseline-browser-mapping. PostCSS has an explicit patched minimum. Modern
minimatch consumers use 11.0.4 or newer through a scoped override.

Run `npm audit --omit=dev` and the Trivy workflow to check production packages.
The full development audit still reports GHSA-g3hv-75wg-m249 through ESLint's
legacy minimatch 3.1.5 dependency. That version has neither `optimizationLevel`
nor `firstPhasePreProcess`, the code identified by the advisory. It cannot be
replaced with minimatch 11 without breaking legacy consumers' callable CommonJS
API. No advisory has been suppressed; keep this visible until upstream packages
migrate or the affected-version range is corrected. See the
[upstream advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249).

Scan reports supplied for investigation remain local and are excluded from Git.
The Trivy workflow scans the lockfile and skips generated build/dependency
folders and the local report directory.
