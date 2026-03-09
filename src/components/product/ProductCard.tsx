import { ShoppingCart, Star, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

const BADGE_STYLES: Record<NonNullable<Product['badge']>, string> = {
  sale: 'bg-red-500 text-white',
  new:  'bg-emerald-500 text-white',
  hot:  'bg-orange-500 text-white',
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-[3/4] overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={cn(
              'absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold uppercase',
              BADGE_STYLES[product.badge],
            )}
          >
            {product.badge === 'sale' && discount
              ? `-${discount}%`
              : product.badge}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:underline">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {product.category === 'Shivling' ? (
            <span className="text-sm font-semibold text-muted-foreground italic">
              Price on request
            </span>
          ) : (
            <>
              <span className="text-sm font-semibold">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.originalPrice!.toLocaleString("en-IN")}
                </span>
              )}
            </>
          )}
        </div>

        {product.category === 'Shivling' ? (
          <Button
            size="sm"
            variant="outline"
            className="mt-auto w-full"
            asChild
          >
            <Link to={`/product/${product.id}`} aria-label={`Raise a query for ${product.name}`}>
              <MessageCircle />
              Raise a Query
            </Link>
          </Button>
        ) : (
          <Button
            size="sm"
            className="mt-auto w-full"
            onClick={() =>
              addToCart(product, 1, product.sizes?.[0], product.colors?.[0])
            }
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart />
            Add to Cart
          </Button>
        )}
      </div>
    </article>
  )
}
