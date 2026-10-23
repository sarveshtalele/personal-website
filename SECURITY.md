# Security Policy

This repository builds a static website (Astro → GitHub Pages). There is no server, database, login, or form that
stores personal data.

## Reporting a vulnerability

Please **do not open a public issue**. Use GitHub's private reporting instead:
[Report a vulnerability](https://github.com/sarveshtalele/personal-website/security/advisories/new), and include steps to
reproduce. You will get an acknowledgement within 72 hours.

## What is in place

| Control | Where |
| --- | --- |
| Strict Content-Security-Policy (hashed inline scripts, `object-src 'none'`, `base-uri 'self'`) | `scripts/csp.mjs` (post-build) |
| Referrer policy `strict-origin-when-cross-origin` | `src/components/BaseHead.astro` |
| External links open with `rel="noopener noreferrer"` | components |
| Only `https://`, `mailto:` or site-relative links accepted from content | `src/content.config.ts` (`link` schema) |
| Question-bank doc links must be `https://`; all rendered text is HTML-escaped | `scripts/build-claude-data.mjs`, quiz/review pages |
| No client-side API calls or third-party scripts (GitHub data is fetched at build time) | `scripts/fetch-github.mjs` |
| CodeQL, Dependabot, `pnpm audit` in CI | `.github/` |
| Least-privilege workflow permissions | `.github/workflows/*.yml` |

GitHub Pages cannot send custom HTTP headers, so `frame-ancestors`, HSTS preload, and `X-Content-Type-Options` depend on
GitHub's defaults. If the site moves behind a CDN (e.g. Cloudflare), add those headers there.
