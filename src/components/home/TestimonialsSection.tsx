import { useState, useEffect } from 'react'
import { Star, Quote, BadgeCheck } from 'lucide-react'
import { REVIEWS, type Review } from '@/data/reviews'
import { fetchSiteReviews } from '@/services/reviewService'
import { cn } from '@/lib/utils'

// Static fallback set — favour verified, higher-rated reviews.
const CURATED = [...REVIEWS].sort(
  (a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating,
)

const AVATAR_COLORS = [
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'size-4',
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30',
          )}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const [liveReviews, setLiveReviews] = useState<Review[]>([])

  useEffect(() => {
    fetchSiteReviews()
      .then(setLiveReviews)
      .catch(() => setLiveReviews([]))
  }, [])

  // Real customer-submitted reviews lead, curated ones fill the rest.
  const combined = [...liveReviews, ...CURATED]
  const shown = combined.slice(0, 6)
  const total = combined.length
  const avg = total > 0 ? combined.reduce((s, r) => s + r.rating, 0) / total : 0

  return (
    <section className="container mx-auto max-w-screen-2xl px-4 md:px-6">
      <div className="mt-8 border-t pt-10">
        {/* Heading + aggregate rating */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-semibold md:text-2xl">What Our Customers Say</h2>
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(avg)} />
            <span className="text-sm font-medium">{avg.toFixed(1)} out of 5</span>
            <span className="text-sm text-muted-foreground">
              · based on {total}+ reviews
            </span>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((r, i) => (
            <figure
              key={r.id}
              className="relative flex flex-col rounded-xl border bg-card p-5 shadow-sm"
            >
              <Quote className="absolute right-4 top-4 size-7 text-muted-foreground/15" />

              <Stars rating={r.rating} />

              <blockquote className="mt-3 flex-1">
                {r.title && (
                  <p className="text-sm font-medium leading-snug">{r.title}</p>
                )}
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  “{r.body}”
                </p>
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-3 border-t pt-4">
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    AVATAR_COLORS[i % AVATAR_COLORS.length],
                  )}
                >
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-sm font-medium">
                    {r.author}
                    {r.verified && (
                      <BadgeCheck className="size-4 shrink-0 text-emerald-500" aria-label="Verified buyer" />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.verified ? 'Verified Buyer' : 'Customer'}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
