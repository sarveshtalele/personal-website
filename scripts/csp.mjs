#!/usr/bin/env node
/**
 * Post-build: inject a strict Content-Security-Policy <meta> into every HTML
 * page in dist/. Every inline <script> on the page is SHA-256 hashed, so only
 * scripts we shipped can run (no 'unsafe-inline' for scripts).
 *
 * GitHub Pages cannot set HTTP headers, so the policy is delivered by meta tag.
 * (frame-ancestors / report-uri are header-only and therefore omitted.)
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith('.html')) yield p;
  }
}

const SCRIPT_RE = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")([^>]*)>([\s\S]*?)<\/script>/g;

let pages = 0;
for (const file of htmlFiles(DIST)) {
  let html = readFileSync(file, 'utf8');
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;
  const hashes = new Set();
  for (const m of html.matchAll(SCRIPT_RE)) {
    if (!m[2].trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`);
  }
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'wasm-unsafe-eval' ${[...hashes].join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    'frame-src https://giscus.app',
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
  html = html.replace(/<head>/, `<head><meta http-equiv="Content-Security-Policy" content="${csp}">`);
  writeFileSync(file, html);
  pages++;
}
console.log(`✔ CSP injected into ${pages} pages`);
