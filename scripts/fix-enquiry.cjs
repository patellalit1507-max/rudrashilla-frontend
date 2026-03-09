const fs = require('fs')
let c = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8')

// Find and replace the broken handleSubmit block
const broken = /function handleSubmit\(e: React\.FormEvent\) \{[\s\S]*?\n  \}/

const fixed = `function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const msg = encodeURIComponent([
      '\u{1F64F} *Product Enquiry \u2014 Rudrashilla*',
      '',
      '*Product:* ' + productName,
      '',
      '*Name:* ' + form.name,
      '*Phone:* ' + form.phone,
      form.message ? '*Message:* ' + form.message : '',
      '',
      'Please share price and availability. Thank you!',
    ].filter(Boolean).join('\\n'))
    window.open('https://wa.me/919617843787?text=' + msg, '_blank', 'noopener,noreferrer')
    setSent(true)
    setSubmitting(false)
  }`

c = c.replace(broken, fixed)
fs.writeFileSync('src/pages/ProductDetail.tsx', c)
console.log('Fixed:', c.includes('wa.me/919617843787'))
