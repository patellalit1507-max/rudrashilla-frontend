import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Star,
  ShoppingCart,
  MessageCircle,
  ChevronRight,
  Minus,
  Plus,
  CheckCircle,
  BadgeCheck,
} from 'lucide-react'
import type { Review } from '@/data/reviews'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { fetchProduct } from '@/services/productService'
 import { sendEnquiryEmail } from '@/services/notificationService'
import { fetchReviews } from '@/services/reviewService'
import type { Product } from '@/types'
import { CATEGORIES } from '@/data/products'

// Allowed category slugs — validated against local whitelist, not blindly from API
const VALID_CATEGORIES = new Set(CATEGORIES.filter((c) => c !== 'All').map((c) => c.toLowerCase()))

// ─── Star helpers ─────────────────────────────────────────────────────────────
function StarRow({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'size-5' : size === 'sm' ? 'size-3' : 'size-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            sz,
            i <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted-foreground',
          )}
        />
      ))}
    </div>
  )
}

// ─── Rating breakdown bar ─────────────────────────────────────────────────────
function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100)
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right text-muted-foreground">{star}</span>
      <Star className="size-3 fill-amber-400 text-amber-400" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-xs text-muted-foreground">{count}</span>
    </div>
  )
}

// ─── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {review.initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              {review.author}
              {review.verified && (
                <BadgeCheck className="size-4 text-emerald-500" aria-label="Verified purchase" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <StarRow rating={review.rating} size="sm" />
      </div>

      <div>
        <p className="text-sm font-semibold">{review.title}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{review.body}</p>
      </div>

      {review.verified && (
        <p className="text-xs text-emerald-600 flex items-center gap-1">
          <CheckCircle className="size-3" /> Verified Purchase
        </p>
      )}
    </article>
  )
}

// ─── Enquiry form (Shivling products) ────────────────────────────────────────
function EnquiryForm({ productName }: { productName: string }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const msg = encodeURIComponent([
      '🙏 *Product Enquiry — Rudrashilla*',
      '',
      '*Product:* ' + productName,
      '',
      '*Name:* ' + form.name,
      '*Phone:* ' + form.phone,
      form.message ? '*Message:* ' + form.message : '',
      '',
      'Please share price and availability. Thank you!',
    ].filter(Boolean).join('\n'))
    window.open('https://wa.me/919617843787?text=' + msg, '_blank', 'noopener,noreferrer')
    sendEnquiryEmail({ productName, customerName: form.name, customerPhone: form.phone, message: form.message })
    setSent(true)
    setSubmitting(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle className="size-8 text-emerald-500" />
        <p className="font-semibold text-emerald-700">Query received!</p>
        <p className="text-sm text-emerald-600">
          We'll get back to you within 24 hours with the price and details for <strong>{productName}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4"
    >
      <p className="text-sm font-semibold">Raise a Query for this product</p>
      <p className="text-xs text-muted-foreground">
        Price for Narmadeshwar Shivlings varies by size and quality. Fill in your details and
        we'll send you a personalised quote.
      </p>

      <input
        required
        type="text"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        required
        type="tel"
        placeholder="Phone / WhatsApp number"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <textarea
        rows={3}
        placeholder="Any specific requirements? (size, weight, occasion…)"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        className="resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <Button type="submit" className="w-full" disabled={submitting}>
        <MessageCircle />
        {submitting ? 'Submitting…' : 'Submit Query'}
      </Button>
    </form>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
type Tab = 'description' | 'reviews'

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const id = slug  // backend supports both slug and ObjectId lookup
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingPage, setLoadingPage] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [selectedSize, setSelectedSize] = useState<string | undefined>()
  const [selectedColor, setSelectedColor] = useState<string | undefined>()
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<Tab>('description')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoadingPage(true)
    Promise.all([fetchProduct(id), fetchReviews(id)])
      .then(([prod, reviewData]) => {
        setProduct(prod)
        setReviews(reviewData.reviews)
        setSelectedSize(prod.sizes?.[0])
        setSelectedColor(prod.colors?.[0])
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingPage(false))
  }, [id])

  if (loadingPage) {
    return (
      <div className="container mx-auto max-w-screen-xl px-4 py-20 text-center text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (notFound || !product) return <Navigate to="/" replace />

  const isShivling = product.category === 'Shivling'
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  // Rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  function handleAddToCart() {
    addToCart(product!, quantity, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const seoTitle = `${product.name} | Authentic Narmadeshwar Shivling – Rudrashilla`
  const seoDesc = isShivling
    ? `${product.name} — authentic Narmadeshwar Shivling naturally formed in the sacred Narmada River. Ideal for home temple, puja and abhishek. ${product.description}`
    : `${product.name} — ${product.description} Shop authentic puja items at Rudrashilla. Pan-India shipping.`
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Rudrashilla' },
    offers: isShivling
      ? {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'INR',
          seller: { '@type': 'Organization', name: 'Rudrashilla' },
        }
      : {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'INR',
          availability: product.inStock === false
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'Rudrashilla' },
        },
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-6 md:px-6 md:py-10">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc.slice(0, 160)} />
        <link rel="canonical" href={`https://rudrashilla.com/product/${product.slug ?? product.id}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc.slice(0, 160)} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://rudrashilla.com/product/${product.slug ?? product.id}`} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link
          to={VALID_CATEGORIES.has(product.category.toLowerCase())
            ? `/category/${product.category.toLowerCase()}`
            : '/'}
          className="hover:text-foreground transition-colors capitalize"
        >
          {product.category}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      {/* ── Product section ── */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">

        {/* Image */}
        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={product.image}
            alt={`${product.name} — authentic Narmadeshwar Shivling from Narmada River`}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ maxHeight: '560px' }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {/* Category + badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">{product.category}</Badge>
            {product.badge && (
              <Badge
                className={cn({
                  'bg-red-500 text-white border-transparent': product.badge === 'sale',
                  'bg-emerald-500 text-white border-transparent': product.badge === 'new',
                  'bg-orange-500 text-white border-transparent': product.badge === 'hot',
                })}
              >
                {product.badge === 'sale' && discount ? `-${discount}%` : product.badge}
              </Badge>
            )}
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRow rating={product.rating} size="md" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <Separator />

          {/* Price */}
          {isShivling ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-semibold text-muted-foreground italic">
                Price on request
              </span>
              <p className="text-xs text-muted-foreground">
                Price varies by size & natural weight. Raise a query below for a personalised quote.
              </p>
            </div>
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <span className="text-base text-muted-foreground line-through">
                  ₹{product.originalPrice!.toLocaleString("en-IN")}
                </span>
              )}
              {discount && (
                <span className="text-sm font-semibold text-red-500">{discount}% off</span>
              )}
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">
                Size: <span className="font-normal text-muted-foreground">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      'min-w-[2.5rem] rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                      selectedSize === s
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">
                Variant: <span className="font-normal text-muted-foreground">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                      selectedColor === c
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + CTA */}
          {!isShivling && (
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center rounded-md border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex size-9 items-center justify-center rounded-l-md hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex size-9 items-center justify-center rounded-r-md hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <Button
                className="flex-1"
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                {added ? (
                  <>
                    <CheckCircle className="size-4" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Enquiry form for Shivling */}
          {isShivling && <EnquiryForm productName={product.name} />}
        </div>
      </div>

      {/* ── Tabs: Description | Reviews ── */}
      <div className="mt-12">
        {/* Tab bar */}
        <div className="flex border-b border-border">
          {(['description', 'reviews'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px',
                tab === t
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t === 'reviews' ? `Reviews (${reviews.length})` : 'Description'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="py-6">
          {tab === 'description' && (
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
              <p className="text-base">{product.description}</p>
              {isShivling && (
                <>
                  <Separator className="my-4" />
                  <ul className="mt-4 space-y-2 text-sm">
                    <li>✦ Sourced directly from the sacred banks of Maa Narmada River</li>
                    <li>✦ Each Shivling is naturally formed — no two pieces are identical</li>
                    <li>✦ Authenticated and energised before dispatch</li>
                    <li>✦ Ideal for home temple, puja room, meditation, and Vastu</li>
                    <li>✦ Price varies by natural size, weight, and quality — raise a query for a personalised quote</li>
                  </ul>
                </>
              )}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="flex flex-col gap-8">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No reviews yet. Be the first to share your experience.
                </p>
              ) : (
                <>
                  {/* Summary */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
                    {/* Average */}
                    <div className="flex flex-col items-center gap-1 sm:items-start">
                      <span className="text-5xl font-bold">{product.rating.toFixed(1)}</span>
                      <StarRow rating={product.rating} size="lg" />
                      <span className="text-sm text-muted-foreground">
                        {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>

                    {/* Breakdown bars */}
                    <div className="flex flex-1 flex-col gap-1.5">
                      {ratingCounts.map(({ star, count }) => (
                        <RatingBar key={star} star={star} count={count} total={reviews.length} />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Review cards */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
