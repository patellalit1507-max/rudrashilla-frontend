const fs = require('fs')
let c = fs.readFileSync('src/pages/Cart.tsx', 'utf8')

const oldLine = `window.open(\`https://wa.me/919617843787?text=\${encodeURIComponent(lines)}\`, '_blank', 'noopener,noreferrer')`
const newLine = `window.open(\`https://wa.me/919617843787?text=\${encodeURIComponent(lines)}\`, '_blank', 'noopener,noreferrer')
                sendOrderEmail({
                  items: items.map((i) => ({
                    name: i.product.name,
                    quantity: i.quantity,
                    price: i.product.price,
                    selectedSize: i.selectedSize,
                  })),
                  total: totalPrice,
                })`

if (c.includes(oldLine)) {
  c = c.replace(oldLine, newLine)
  fs.writeFileSync('src/pages/Cart.tsx', c)
  console.log('sendOrderEmail wired to Cart ✓')
} else {
  console.log('String not found — checking what is there:')
  const idx = c.indexOf('wa.me/919617843787')
  console.log(JSON.stringify(c.slice(idx - 10, idx + 100)))
}
