// Dynamic sitemap for rudrashilla.com — generated live from the product API so
// it always reflects the current catalogue with zero manual maintenance.
// A more specific route than functions/[[path]].js, so it handles /sitemap.xml.

const BACKEND = 'https://rudrashilla-backend-6znpcp5wma-el.a.run.app/api'
const BASE = 'https://rudrashilla.com'

// Static, non-product routes
const STATIC = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/category/shivling', changefreq: 'daily', priority: '0.9' },
  { loc: '/category/home-shivling', changefreq: 'daily', priority: '0.9' },
  { loc: '/category/temple-shivling', changefreq: 'daily', priority: '0.9' },
  { loc: '/category/new', changefreq: 'daily', priority: '0.8' },
  { loc: '/category/jaladhari', changefreq: 'weekly', priority: '0.8' },
  { loc: '/category/sale', changefreq: 'weekly', priority: '0.7' },
  { loc: '/international-shipping', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
]

// Blog articles are static content in the app; keep this list in sync with
// src/data/blogs.ts when articles are added.
const BLOG_SLUGS = [
  'buy-shivling-online-india',
  'what-is-narmadeshwar-shivling',
  'benefits-of-narmadeshwar-shivling',
  'how-to-identify-original-narmadeshwar-shivling',
  'how-to-do-shivling-abhishek-at-home',
  'why-narmada-river-stones-are-sacred',
  'what-is-jaladhari-for-shivling',
  'nandi-shivling-significance',
]

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function urlBlock({ loc, lastmod, changefreq, priority }) {
  return (
    `  <url>\n` +
    `    <loc>${BASE}${esc(loc)}</loc>\n` +
    (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n` +
    `  </url>`
  )
}

export async function onRequestGet() {
  const today = new Date().toISOString().slice(0, 10)

  let products = []
  try {
    const res = await fetch(`${BACKEND}/products?limit=100&sort=rating`)
    if (res.ok) {
      const json = await res.json()
      products = json?.data?.products ?? []
    }
  } catch {
    // If the API is unavailable, still return a valid sitemap of static pages.
  }

  const blocks = []
  blocks.push(...STATIC.map((s) => urlBlock({ ...s, lastmod: today })))

  for (const p of products) {
    if (!p.slug) continue
    blocks.push(
      urlBlock({
        loc: `/product/${p.slug}`,
        lastmod: (p.updatedAt ? new Date(p.updatedAt) : new Date()).toISOString().slice(0, 10),
        changefreq: 'weekly',
        priority: p.category === 'Shivling' ? '0.8' : '0.7',
      }),
    )
  }

  for (const slug of BLOG_SLUGS) {
    blocks.push(urlBlock({ loc: `/blog/${slug}`, lastmod: today, changefreq: 'monthly', priority: '0.8' }))
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n` +
    blocks.join('\n\n') +
    `\n\n</urlset>\n`

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      // Cache at the edge for 1h so we don't hit the API on every crawl request.
      'cache-control': 'public, max-age=3600',
    },
  })
}
