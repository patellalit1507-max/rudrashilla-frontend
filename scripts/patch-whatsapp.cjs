const fs = require('fs')

// ── 1. Patch EnquiryForm in ProductDetail.tsx ─────────────────────────────
let pd = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8')

// Replace the old async handleSubmit with WhatsApp version
pd = pd.replace(
  `  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await submitEnquiry({ productId, productName, customer: form })
      setSent(true)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }`,
  `  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const lines = [
      '🙏 *Product Enquiry — Rudrashilla*',
      '',
      \`*Product:* \${productName}\`,
      '',
      \`*Name:* \${form.name}\`,
      \`*Phone:* \${form.phone}\`,
      form.message ? \`*Message:* \${form.message}\` : '',
      '',
      'Please share price and availability. Thank you!',
    ].filter(Boolean).join('\\n')
    window.open(\`https://wa.me/919617843787?text=\${encodeURIComponent(lines)}\`, '_blank', 'noopener,noreferrer')
    setSent(true)
    setSubmitting(false)
  }`
)

// Remove unused submitEnquiry import since we no longer call it
pd = pd.replace("import { submitEnquiry } from '@/services/enquiryService'\n", '')

// Remove unused error state (no longer needed)
pd = pd.replace("  const [error, setError] = useState<string | null>(null)\n", '')
pd = pd.replace("      {error && <p className=\"text-xs text-destructive\">{error}</p>}\n", '')

fs.writeFileSync('src/pages/ProductDetail.tsx', pd)
console.log('ProductDetail WhatsApp enquiry patched:', pd.includes('wa.me/919617843787'))

// ── 2. Patch Cart.tsx — WhatsApp order + email via formsubmit.co ──────────
let cart = fs.readFileSync('src/pages/Cart.tsx', 'utf8')

// Add MessageCircle to imports
cart = cart.replace(
  "import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'",
  "import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'"
)

// Replace Link to="/checkout" button with WhatsApp order button
cart = cart.replace(
  `            <Button className="mt-6 w-full" size="lg" asChild>
              <Link to="/checkout">Checkout</Link>
            </Button>`,
  `            <Button
              className="mt-6 w-full"
              size="lg"
              onClick={() => {
                const lines = [
                  '🛒 *New Order — Rudrashilla*',
                  '',
                  ...items.map(({ product, quantity, selectedSize }) =>
                    \`• \${product.name}\${selectedSize ? \` (\${selectedSize})\` : ''} × \${quantity} — ₹\${(product.price * quantity).toLocaleString('en-IN')}\`
                  ),
                  '',
                  \`*Total: ₹\${totalPrice.toLocaleString('en-IN')}\`,
                  '',
                  'Please confirm my order. Thank you!',
                ].join('\\n')
                window.open(\`https://wa.me/919617843787?text=\${encodeURIComponent(lines)}\`, '_blank', 'noopener,noreferrer')
              }}
            >
              <MessageCircle className="size-4" />
              Order via WhatsApp
            </Button>`
)

fs.writeFileSync('src/pages/Cart.tsx', cart)
console.log('Cart WhatsApp order patched:', cart.includes('Order via WhatsApp'))
