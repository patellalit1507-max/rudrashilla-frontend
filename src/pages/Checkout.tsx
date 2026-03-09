import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { placeOrder } from '@/services/orderService'

interface CheckoutForm {
  name: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
}

const EMPTY_FORM: CheckoutForm = {
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  )
}

const INPUT_CLS =
  'rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-shadow'

export function Checkout() {
  const { state, totalPrice, dispatch } = useCart()
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM)
  const [placed, setPlaced] = useState(false)
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const items = state.items

  // ── If cart is empty redirect hint ────────────────────────────────────────
  if (items.length === 0 && !placed) {
    return (
      <div className="container mx-auto max-w-screen-md px-4 py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 size-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Add items before checking out.</p>
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  // ── Order placed success ───────────────────────────────────────────────────
  if (placed) {
    return (
      <div className="container mx-auto max-w-screen-sm px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="size-16 text-emerald-500" />
          <h1 className="text-2xl font-bold">Order Placed!</h1>
          <p className="text-muted-foreground">
            Thank you, <strong>{form.name}</strong>. We've received your order and will contact you
            at <strong>+91 {form.phone}</strong> to confirm.
          </p>
          <p className="text-sm text-muted-foreground">
            Delivery to: {form.addressLine1}
            {form.addressLine2 ? `, ${form.addressLine2}` : ''}, {form.city}, {form.state} —{' '}
            {form.pincode}
          </p>
          <Button className="mt-4" asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: Partial<CheckoutForm> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s\-()]/g, '')))
      e.phone = 'Enter a valid 10-digit mobile number'
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required'
    if (!form.city.trim())         e.city = 'City is required'
    if (!form.state.trim())        e.state = 'State is required'
    if (!form.pincode.trim())      e.pincode = 'Pincode is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setApiError(null)
    try {
      await placeOrder(form, items)
      dispatch({ type: 'CLEAR_CART' })
      setPlaced(true)
    } catch {
      setApiError('Could not place your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function set(field: keyof CheckoutForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }))
    }
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8 md:px-6 md:py-12">

      {/* Back */}
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/cart" aria-label="Back to cart">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">

          {/* ── Left: Form ── */}
          <div className="flex flex-col gap-8 lg:col-span-2">

            {/* Contact */}
            <section className="flex flex-col gap-4">
              <h2 className="font-semibold text-base">Contact Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    placeholder="Amit Sharma"
                    value={form.name}
                    onChange={set('name')}
                    className={INPUT_CLS}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </Field>

                <Field label="Phone / WhatsApp" required>
                  <div className="flex">
                    <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={10}
                      value={form.phone}
                      onChange={set('phone')}
                      className={`${INPUT_CLS} flex-1 rounded-l-none`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </Field>
              </div>
            </section>

            <Separator />

            {/* Delivery address */}
            <section className="flex flex-col gap-4">
              <h2 className="font-semibold text-base">Delivery Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Address Line 1" required>
                  <input
                    type="text"
                    placeholder="House / Flat no., Street"
                    value={form.addressLine1}
                    onChange={set('addressLine1')}
                    className={INPUT_CLS}
                  />
                  {errors.addressLine1 && (
                    <p className="text-xs text-destructive">{errors.addressLine1}</p>
                  )}
                </Field>

                <Field label="Address Line 2">
                  <input
                    type="text"
                    placeholder="Area, Landmark (optional)"
                    value={form.addressLine2}
                    onChange={set('addressLine2')}
                    className={INPUT_CLS}
                  />
                </Field>

                <Field label="City" required>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={set('city')}
                    className={INPUT_CLS}
                  />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </Field>

                <Field label="State" required>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={set('state')}
                    className={INPUT_CLS}
                  />
                  {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                </Field>

                <Field label="Pincode" required>
                  <input
                    type="text"
                    placeholder="400001"
                    value={form.pincode}
                    onChange={set('pincode')}
                    className={INPUT_CLS}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-destructive">{errors.pincode}</p>
                  )}
                </Field>
              </div>
            </section>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
              <h2 className="font-semibold">Order Summary</h2>

              {/* Items */}
              <ul className="flex flex-col gap-3">
                {items.map(({ product, quantity, selectedSize, selectedColor }) => (
                  <li
                    key={`${product.id}-${selectedSize}-${selectedColor}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-12 shrink-0 rounded-md bg-muted object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{product.name}</p>
                      {(selectedSize || selectedColor) && (
                        <p className="text-xs text-muted-foreground">
                          {[selectedSize, selectedColor].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
              </ul>

              <Separator />

              {/* Totals */}
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

              {apiError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {apiError}
                </p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Placing Order…' : 'Place Order'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                We'll confirm your order via WhatsApp/call within 24 hours.
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
