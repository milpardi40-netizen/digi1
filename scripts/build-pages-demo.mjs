// Produce a read-only snapshot of the real site for GitHub Pages. The database
// used here must be disposable: src/db/setup.ts populates it with sample data.
import { load } from 'cheerio';
import { Pool } from 'pg';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const origin = process.env.DEMO_ORIGIN || 'http://127.0.0.1:3000';
const base = (process.env.PAGES_BASE_PATH ?? '/digi1').replace(/\/$/, '');
if (base && !/^\/[a-zA-Z0-9._~-]+$/.test(base)) throw new Error('Invalid PAGES_BASE_PATH');
const output = path.resolve('out');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let routes;
try {
  const [products, shops, categories] = await Promise.all([
    pool.query('SELECT slug FROM products WHERE slug IS NOT NULL'),
    pool.query('SELECT slug FROM shops WHERE slug IS NOT NULL'),
    pool.query('SELECT slug FROM categories WHERE slug IS NOT NULL'),
  ]);
  routes = ['/', '/about', '/help', '/sell', '/featured', '/shops', '/search',
    ...products.rows.map(({ slug }) => `/product/${encodeURIComponent(slug)}`),
    ...shops.rows.map(({ slug }) => `/shop/${encodeURIComponent(slug)}`),
    ...categories.rows.map(({ slug }) => `/category/${encodeURIComponent(slug)}`)];
} finally { await pool.end(); }
const allowed = new Set(routes);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp('.next/static', path.join(output, '_next/static'), { recursive: true });
await cp('public', output, { recursive: true });
await writeFile(path.join(output, '.nojekyll'), '');

for (const route of routes) {
  const response = await fetch(`${origin}${route}`, { redirect: 'manual' });
  if (!response.ok) throw new Error(`Cannot render ${route}: HTTP ${response.status}`);
  const $ = load(await response.text(), { decodeEntities: false });
  // Server actions, React hydration and API-backed controls cannot run on Pages.
  $('script, link[rel="preload"][as="script"], link[rel="modulepreload"]').remove();
  $('body').prepend(`<aside id="demo-notice" dir="rtl" style="background:#742f18;color:#fff;padding:12px 16px;text-align:center;font:600 14px/1.8 Tahoma,sans-serif;position:relative;z-index:100">نسخه نمایشی هنربازار — اطلاعات نمونه هستند. ورود، جستجو، سبد خرید و ثبت سفارش در این نسخه فعال نیستند.</aside>`);
  $('button, input, select, textarea').attr('disabled', 'disabled').attr('title', 'این قابلیت در نسخه نمایشی فعال نیست');
  $('form').removeAttr('action').attr('onsubmit', 'return false');
  $('a[href]').each((_, el) => {
    const a = $(el);
    const href = a.attr('href');
    if (!href?.startsWith('/') || href.startsWith('//')) return;
    const url = new URL(href, origin);
    const target = url.pathname.replace(/\/$/, '') || '/';
    if (allowed.has(target) && !url.search) {
      a.attr('href', `${base}${target === '/' ? '/' : `${target}/`}${url.hash}`);
    } else {
      a.attr('href', '#demo-notice').attr('title', 'این قابلیت در نسخه نمایشی فعال نیست');
    }
  });
  // Stylesheets, icons, and other local assets must include the repository prefix.
  $('link[href^="/"], img[src^="/"]').each((_, el) => {
    const node = $(el); const attr = el.name === 'img' ? 'src' : 'href';
    const value = node.attr(attr);
    if (value && !value.startsWith('//')) node.attr(attr, `${base}${value}`);
  });
  const dir = path.join(output, route === '/' ? '' : route.slice(1));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), '<!DOCTYPE html>\n' + $.html().replace(/^<!DOCTYPE html>/i, ''));
  console.log(`Rendered ${route}`);
}
console.log(`Built ${routes.length} demo pages in ${output}`);
