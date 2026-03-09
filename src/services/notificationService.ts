// Sends email via formsubmit.co (no backend/account needed)
// First submission triggers a one-time verification email to the address below.
// After verifying, all future emails arrive automatically.

const EMAIL = 'lalit1507patel@gmail.com'
const URL   = `https://formsubmit.co/ajax/${EMAIL}`

async function post(payload: Record<string, string>) {
  try {
    await fetch(URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify({ _template: 'table', ...payload }),
    })
  } catch {
    // Silently ignore — WhatsApp notification already sent, email is best-effort
  }
}

export async function sendEnquiryEmail(data: {
  productName: string
  customerName: string
  customerPhone: string
  message?: string
}) {
  await post({
    _subject:       `🙏 New Query: ${data.productName} — Rudrashilla`,
    Product:        data.productName,
    'Customer Name':  data.customerName,
    'Customer Phone': data.customerPhone,
    Message:        data.message || '—',
    Source:         'Product Enquiry Form',
  })
}

export async function sendOrderEmail(data: {
  items: { name: string; quantity: number; price: number; selectedSize?: string }[]
  total: number
}) {
  const lines = data.items.map((i) =>
    `${i.name}${i.selectedSize ? ` (${i.selectedSize})` : ''} × ${i.quantity} = ₹${(i.price * i.quantity).toLocaleString('en-IN')}`
  )
  await post({
    _subject:     `🛒 New Order — ₹${data.total.toLocaleString('en-IN')} — Rudrashilla`,
    'Order Items': lines.join('\n'),
    'Order Total': `₹${data.total.toLocaleString('en-IN')}`,
    Source:        'Cart — Order via WhatsApp',
  })
}
