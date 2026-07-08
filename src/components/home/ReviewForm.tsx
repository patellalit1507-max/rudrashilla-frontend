import { useState, useRef } from 'react'
import { Star, CheckCircle2, ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitSiteReview, uploadReviewImage } from '@/services/reviewService'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB, matches the backend limit

/**
 * Simple "share your experience" form for customers who bought a Shivling.
 * Collects name, a star rating, a testimonial and an optional photo —
 * submitted as a general site review (no product) that goes live
 * immediately, no approval step.
 */
export function ReviewForm() {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [body, setBody] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canSubmit = name.trim() && rating > 0 && body.trim() && status !== 'submitting'

  function handlePickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError(null)
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError('Image must be 5MB or smaller.')
      return
    }

    setImageFile(file)
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    setImageError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    try {
      const image = imageFile ? await uploadReviewImage(imageFile) : undefined
      await submitSiteReview({ author: name.trim(), rating, body: body.trim(), image })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="container mx-auto max-w-screen-2xl px-4 md:px-6">
      <div className="mt-8 border-t pt-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold md:text-2xl">Share Your Experience</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bought a Shivling from us? We&rsquo;d love to hear from you.
            </p>
          </div>

          {status === 'done' ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-emerald-50 px-6 py-10 text-center">
              <CheckCircle2 className="size-10 text-emerald-500" />
              <p className="font-medium text-emerald-800">Thank you for your review! 🙏</p>
              <p className="text-sm text-emerald-700">
                Your review is now live on our site.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-sm">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="review-name" className="text-sm font-medium">
                  Your Name
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amit Sharma"
                  maxLength={60}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Your Rating</span>
                <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          'size-7 transition-colors',
                          (hover || rating) >= n
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30',
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Testimony */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="review-body" className="text-sm font-medium">
                  Your Review
                </label>
                <textarea
                  id="review-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Tell us about your Shivling and your experience with Rudrashilla…"
                  rows={4}
                  maxLength={1000}
                  className="resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Photo (optional) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Add a Photo (optional)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePickImage}
                  className="hidden"
                  id="review-image"
                />

                {imagePreview ? (
                  <div className="relative w-fit">
                    <img
                      src={imagePreview}
                      alt="Your upload preview"
                      className="h-28 w-28 rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      aria-label="Remove photo"
                      className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-foreground text-background shadow"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="review-image"
                    className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <ImagePlus className="size-4" />
                    Choose a photo
                  </label>
                )}
                {imageError && <p className="text-sm text-destructive">{imageError}</p>}
              </div>

              {status === 'error' && (
                <p className="text-sm text-destructive">
                  Something went wrong. Please try again in a moment.
                </p>
              )}

              <Button type="submit" size="lg" disabled={!canSubmit} className="self-start px-8">
                {status === 'submitting' ? 'Submitting…' : 'Submit Review'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
