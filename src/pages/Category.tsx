import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types'

// Map URL slug → display name, API category, SEO title & description
const SLUG_MAP: Record<string, { label: string; category?: string; sort?: string; seoTitle: string; seoDesc: string; intro?: string }> = {
  'new': {
    label: 'New Arrivals', sort: 'newest',
    seoTitle: 'New Arrivals – Latest Narmadeshwar Shivling & Puja Items | Rudrashilla',
    seoDesc: 'Explore the latest Narmadeshwar Shivling, Jaladhari, Abhishek Patra and Trishul arrivals at Rudrashilla. Freshly sourced from Maa Narmada River.',
  },
  'shivling': {
    label: 'Narmadeshwar Shivling', category: 'Shivling',
    seoTitle: 'Narmadeshwar Shivling – Buy Original Narmadeshwar Shivling Online at Best Price | Rudrashilla',
    seoDesc: 'Buy 100% original Narmadeshwar Shivling at best price (₹200–₹8,000+). Black & natural Narmada Shivling for home temple, puja and Vastu. Certified authentic, Pan-India shipping.',
    intro: 'Original Narmadeshwar Shivling sourced directly from Maa Narmada River — naturally formed, self-consecrated (swayambhu) and perfect for home temple. Choose from classic brown-banded Banalinga and rare black Narmadeshwar Shivling in sizes from 2 to 9+ inches, with prices starting at ₹200.',
  },
  'jaladhari': {
    label: 'Jaladhari', category: 'Jaladhari',
    seoTitle: 'Jaladhari for Shivling – Buy Original Shivling Jaladhari Online | Rudrashilla',
    seoDesc: 'Buy original Jaladhari for Shivling puja online. Narmada stone, brass and copper Jaladhari, pre-matched to your Shivling size. Pan-India shipping from Rudrashilla.',
    intro: 'A Jaladhari is the sacred base vessel that holds the Shivling and channels the abhishek fluid through its north-facing spout. No Shivling puja is complete without one. Our Jaladhari are pre-matched in size to our Narmadeshwar Shivlings.',
  },
  'trishul': {
    label: 'Trishul', category: 'Trishul',
    seoTitle: 'Buy Sacred Trishul Online | Original Trishul for Home Temple – Rudrashilla',
    seoDesc: 'Shop original Trishul for home temple and worship. Authentic brass and panchadhatu Trishul. Buy Trishul online with Pan-India delivery from Rudrashilla.',
    intro: 'The Trishul — Lord Shiva’s trident — symbolises protection and the destruction of negativity. Place an authentic brass or panchadhatu Trishul beside your Shivling to complete your home temple.',
  },
  'abhishek-patra': {
    label: 'Abhishek Patra', category: 'Abhishek Patra',
    seoTitle: 'Buy Abhishek Patra Online | Original Puja Abhishek Patra – Rudrashilla',
    seoDesc: 'Shop authentic Abhishek Patra for daily Shivling puja and rituals. Copper and brass Abhishek Patra available. Buy online with Pan-India shipping.',
    intro: 'An Abhishek Patra lets you pour water, milk or panchamrit in a slow, steady stream over the Shivling — the traditional way to perform daily abhishek at home.',
  },
  'sale': {
    label: 'Sale', sort: 'sale',
    seoTitle: 'Sale – Discounted Narmadeshwar Shivling & Puja Items | Rudrashilla',
    seoDesc: 'Special offers on Narmadeshwar Shivling, Jaladhari, Abhishek Patra and Trishul. Shop authentic puja items at discounted prices. Limited time offers.',
  },
}

// Internal links to supporting guides, shown below the product grid per category
const CATEGORY_GUIDES: Record<string, { label: string; to: string }[]> = {
  'shivling': [
    { label: 'How to Identify an Original Narmadeshwar Shivling — 7 Tests', to: '/blog/how-to-identify-original-narmadeshwar-shivling' },
    { label: 'Narmadeshwar Shivling Price & Buying Guide', to: '/blog/buy-shivling-online-india' },
    { label: 'What is Narmadeshwar Shivling? Origin & Significance', to: '/blog/what-is-narmadeshwar-shivling' },
    { label: '9 Benefits of Keeping Narmadeshwar Shivling at Home', to: '/blog/benefits-of-narmadeshwar-shivling' },
  ],
  'jaladhari': [
    { label: 'What is Jaladhari? Complete Guide for Shivling Puja', to: '/blog/what-is-jaladhari-for-shivling' },
    { label: 'How to Do Shivling Abhishek at Home — Step by Step', to: '/blog/how-to-do-shivling-abhishek-at-home' },
  ],
  'abhishek-patra': [
    { label: 'How to Do Shivling Abhishek at Home — Step by Step', to: '/blog/how-to-do-shivling-abhishek-at-home' },
    { label: 'What is Jaladhari? Complete Guide for Shivling Puja', to: '/blog/what-is-jaladhari-for-shivling' },
  ],
  'trishul': [
    { label: 'Nandi and Shivling — Sacred Markings on Narmadeshwar Shivling', to: '/blog/nandi-shivling-significance' },
    { label: 'Why Narmada River Stones Are Sacred', to: '/blog/why-narmada-river-stones-are-sacred' },
  ],
}

export function Category() {
  const { slug = '' } = useParams<{ slug: string }>()
  const meta = SLUG_MAP[slug] ?? {
    label: slug.replace(/-/g, ' '),
    seoTitle: `${slug.replace(/-/g, ' ')} | Rudrashilla`,
    seoDesc: `Shop authentic ${slug.replace(/-/g, ' ')} from Rudrashilla. Original puja items sourced from Maa Narmada River.`,
  }

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchProducts({ category: meta.category, sort: meta.sort, limit: 50 })
      .then((res) => setProducts(res.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [slug])

  const canonicalSlug = slug === 'abhishek-patra' ? 'abhishek-patra' : slug

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8 md:px-6">
      <Helmet>
        <title>{meta.seoTitle}</title>
        <meta name="description" content={meta.seoDesc} />
        <link rel="canonical" href={`https://rudrashilla.com/category/${canonicalSlug}`} />
        <meta property="og:title" content={meta.seoTitle} />
        <meta property="og:description" content={meta.seoDesc} />
        <meta property="og:url" content={`https://rudrashilla.com/category/${canonicalSlug}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rudrashilla.com/' },
            { '@type': 'ListItem', position: 2, name: meta.label, item: `https://rudrashilla.com/category/${canonicalSlug}` },
          ],
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium capitalize text-foreground">{meta.label}</span>
      </nav>

      {/* Heading */}
      <h1 className="mb-3 text-2xl font-bold capitalize md:text-3xl">{meta.label}</h1>

      {/* SEO intro */}
      {meta.intro && (
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {meta.intro}
        </p>
      )}
      {!meta.intro && <div className="mb-5" />}

      {/* Products */}
      <ProductGrid products={products} loading={loading} />

      {/* Buying guides — internal links for SEO */}
      {CATEGORY_GUIDES[slug] && (
        <div className="mt-12 border-t pt-8">
          <h2 className="mb-4 text-lg font-semibold">Helpful Guides</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {CATEGORY_GUIDES[slug].map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-primary underline underline-offset-2 hover:text-primary/80 md:text-base"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">No products found in this category yet.</p>
          <Link to="/" className="mt-4 inline-block text-sm underline hover:text-foreground">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  )
}
