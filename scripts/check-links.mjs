#!/usr/bin/env node
// Checks every link and in-page anchor of a running site.
//
//   node scripts/check-links.mjs <base url> [--map <public origin>=<local origin>]...
//
// The pages come from <base url>/sitemap.xml. Links to this site, to a mapped origin (such as the sibling site
// running locally) and their #anchors must resolve with status 200; external links must answer with a 2xx or 3xx
// status. Release links that are not set render no link at all (components/release-link.tsx), so they are never
// checked. Exits with status 1 when a link is broken.

const args = process.argv.slice(2);
const base = new URL(args.shift() ?? 'http://localhost:3000');
const maps = new Map();
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--map') {
    const [from, to] = args[++i].split('=');
    maps.set(new URL(from).origin, new URL(to).origin);
  }
}

const pages = new Map();
async function load(url) {
  if (!pages.has(url)) {
    pages.set(
      url,
      fetch(url, { redirect: 'manual' }).then(async (res) => ({
        status: res.status,
        html: res.headers.get('content-type')?.includes('text/html') ? await res.text() : '',
      })),
    );
  }
  return pages.get(url);
}

const external = new Map();
function checkExternal(url) {
  if (!external.has(url)) {
    external.set(
      url,
      fetch(url, { method: 'GET', redirect: 'manual', headers: { 'user-agent': 'comficonf-link-check' } })
        .then((res) => res.status)
        .catch((error) => `error: ${error.cause?.code ?? error.message}`),
    );
  }
  return external.get(url);
}

function attributes(html, tag, attribute) {
  const pattern = new RegExp(`<${tag}\\b[^>]*?\\s${attribute}="([^"]*)"`, 'gi');
  return [...html.matchAll(pattern)].map((match) => match[1].replaceAll('&amp;', '&'));
}

function ids(html) {
  return new Set(attributes(html, '[a-z0-9]+', 'id').map(decodeURIComponent));
}

const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]));
const publicOrigin = sitemapUrls[0]?.origin;
if (publicOrigin) maps.set(publicOrigin, base.origin);

const toLocal = (url) => {
  const mapped = maps.get(url.origin);
  return mapped ? new URL(url.pathname + url.search + url.hash, mapped) : null;
};

const problems = [];
let checked = 0;
for (const pageUrl of sitemapUrls.map((url) => toLocal(url))) {
  const page = await load(pageUrl.href);
  if (page.status !== 200) {
    problems.push(`${pageUrl.pathname}: page answered ${page.status}`);
    continue;
  }
  const hrefs = attributes(page.html, 'a', 'href');
  for (const href of new Set(hrefs)) {
    if (href.startsWith('mailto:')) continue;
    const target = new URL(href, pageUrl);
    checked++;
    const local = target.origin === base.origin ? target : toLocal(target);
    if (local) {
      const linked = await load(new URL(local.pathname + local.search, local.origin).href);
      if (linked.status !== 200) {
        problems.push(`${pageUrl.pathname}: ${href} answered ${linked.status}`);
      } else if (local.hash && local.hash !== '#') {
        const id = decodeURIComponent(local.hash.slice(1));
        if (!ids(linked.html).has(id)) problems.push(`${pageUrl.pathname}: ${href} has no anchor #${id}`);
      }
    } else if (target.protocol === 'http:' || target.protocol === 'https:') {
      const status = await checkExternal(target.href);
      if (typeof status !== 'number' || status >= 400) {
        problems.push(`${pageUrl.pathname}: ${href} answered ${status}`);
      }
    }
  }
}

console.log(`${sitemapUrls.length} pages, ${checked} links checked, ${external.size} external URLs.`);
for (const url of external.keys()) console.log(`  external: ${url} -> ${await external.get(url)}`);
if (problems.length > 0) {
  console.error(`\n${problems.length} broken:`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log('No broken links.');
