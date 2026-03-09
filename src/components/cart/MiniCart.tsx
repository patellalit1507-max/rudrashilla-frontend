import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet'

export function MiniCart() {
  const { state, dispatch, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()

  const close = () => dispatch({ type: 'CLOSE_CART' })

  function handleCheckout() {
    close()
    navigate('/checkout')
  }

  return (
    <Sheet
      open={state.isOpen}
      onOpenChange={(open) => dispatch({ type: open ? 'OPEN_CART' : 'CLOSE_CART' })}
    >
      <SheetContent side="right">
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            Cart
            {totalItems > 0 && (
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">Your shopping cart</SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingBag className="size-12 text-muted-foreground" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs text-muted-foreground">Add some items to get started</p>
              <Button size="sm" onClick={close} asChild>
                <Link to="/">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {state.items.map(({ product, quantity, selectedSize, selectedColor }) => (
                <li
                  key={`${product.id}-${selectedSize}-${selectedColor}`}
                  className="flex gap-3"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${product.id}`}
                    onClick={close}
                    className="shrink-0"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-16 rounded-md bg-muted object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={close}
                      className="truncate text-sm font-medium hover:underline"
                    >
                      {product.name}
                    </Link>

                    {(selectedSize || selectedColor) && (
                      <p className="text-xs text-muted-foreground">
                        {[selectedSize, selectedColor].filter(Boolean).join(' · ')}
                      </p>
                    )}

                    <p className="text-sm font-semibold">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </p>

                    {/* Qty controls */}
                    <div className="mt-auto flex items-center gap-2">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { id: product.id, quantity: quantity - 1 },
                            })
                          }
                          className="flex size-6 items-center justify-center rounded-l-md hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">{quantity}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { id: product.id, quantity: quantity + 1 },
                            })
                          }
                          className="flex size-6 items-center justify-center rounded-r-md hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-2.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: product.id })}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <SheetFooter>
            <Separator className="mb-3" />
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-base mt-1">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button className="mt-2 w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={close}
              asChild
            >
              <Link to="/cart">View Full Cart</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={close}
            >
              Continue Shopping
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
