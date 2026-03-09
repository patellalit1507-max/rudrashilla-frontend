import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'

export function Cart() {
  const { state: { items }, dispatch, removeFromCart, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-screen-md px-4 py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 size-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">
          Add some items to get started.
        </p>
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/" aria-label="Back to shop">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Cart ({items.length})</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity, selectedSize, selectedColor }) => (
            <div
              key={`${product.id}-${selectedSize}-${selectedColor}`}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <Link to={`/product/${product.id}`} className="shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-24 rounded-md bg-muted object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <Link
                  to={`/product/${product.id}`}
                  className="truncate font-medium hover:underline"
                >
                  {product.name}
                </Link>
                {(selectedSize || selectedColor) && (
                  <p className="text-xs text-muted-foreground">
                    {[selectedSize, selectedColor].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className="mt-auto text-sm font-semibold">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(product.id)}
                  aria-label={`Remove ${product.name}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
                <div className="flex items-center rounded-md border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() =>
                      dispatch({
                        type: 'UPDATE_QUANTITY',
                        payload: { id: product.id, quantity: quantity - 1 },
                      })
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-7 text-center text-sm">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() =>
                      dispatch({
                        type: 'UPDATE_QUANTITY',
                        payload: { id: product.id, quantity: quantity + 1 },
                      })
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Button
              className="mt-6 w-full"
              size="lg"
              onClick={() => {
                const lines = [
                  '🛒 *New Order — Rudrashilla*',
                  '',
                  ...items.map(({ product, quantity, selectedSize }) =>
                    `• ${product.name}${selectedSize ? ` (${selectedSize})` : ''} × ${quantity} — ₹${(product.price * quantity).toLocaleString('en-IN')}`
                  ),
                  '',
                  `*Total: ₹${totalPrice.toLocaleString('en-IN')}`,
                  '',
                  'Please confirm my order. Thank you!',
                ].join('\n')
                window.open(`https://wa.me/919617843787?text=${encodeURIComponent(lines)}`, '_blank', 'noopener,noreferrer')
              }}
            >
              <MessageCircle className="size-4" />
              Order via WhatsApp
            </Button>
            <Button
              variant="outline"
              className="mt-2 w-full"
              size="sm"
              asChild
            >
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
