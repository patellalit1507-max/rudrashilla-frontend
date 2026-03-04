import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const W = 1200
const H = 630

// Brand colours
const BG   = '#F6F4EF'   // same as trust bar background
const GOLD = '#8A6B3D'   // brand accent
const DARK = '#1A1A1A'

// Load logo and get its metadata to scale it
const logoPath = resolve(root, 'src/assets/logo/logo.png')
const logoMeta = await sharp(logoPath).metadata()

// Scale logo to fit inside 260×260, keep aspect ratio
const maxLogoW = 260
const maxLogoH = 260
const ratio = Math.min(maxLogoW / logoMeta.width, maxLogoH / logoMeta.height)
const logoW = Math.round(logoMeta.width * ratio)
const logoH = Math.round(logoMeta.height * ratio)

const logoResized = await sharp(logoPath)
  .resize(logoW, logoH, { fit: 'inside' })
  .toBuffer()

// Positions — logo centred horizontally, upper portion
const logoX = Math.round((W - logoW) / 2)
const logoY = 90

// SVG overlay: background + text + decorative lines
const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <!-- Top decorative bar -->
  <rect x="0" y="0" width="${W}" height="6" fill="${GOLD}"/>

  <!-- Bottom decorative bar -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="${GOLD}"/>

  <!-- Horizontal rule above text -->
  <line x1="80" y1="${logoY + logoH + 36}" x2="${W - 80}" y2="${logoY + logoH + 36}"
        stroke="${GOLD}" stroke-width="1.5" opacity="0.5"/>

  <!-- Brand name -->
  <text x="${W / 2}" y="${logoY + logoH + 92}"
        font-family="Georgia, serif" font-size="64" font-weight="700"
        fill="${DARK}" text-anchor="middle" letter-spacing="4">
    Rudrashilla
  </text>

  <!-- Tagline -->
  <text x="${W / 2}" y="${logoY + logoH + 148}"
        font-family="Georgia, serif" font-size="26" font-style="italic"
        fill="${GOLD}" text-anchor="middle" letter-spacing="1">
    Authentic Narmadeshwar Shivling &amp; Sacred Puja Items
  </text>

  <!-- Horizontal rule below text -->
  <line x1="80" y1="${logoY + logoH + 172}" x2="${W - 80}" y2="${logoY + logoH + 172}"
        stroke="${GOLD}" stroke-width="1.5" opacity="0.5"/>

  <!-- Website -->
  <text x="${W / 2}" y="${logoY + logoH + 214}"
        font-family="Arial, sans-serif" font-size="20"
        fill="#6B6B6B" text-anchor="middle" letter-spacing="2">
    rudrashilla.com
  </text>
</svg>`

const svgBuf = Buffer.from(svg)

// Compose: SVG base → overlay logo
await sharp(svgBuf)
  .composite([{ input: logoResized, left: logoX, top: logoY }])
  .jpeg({ quality: 92 })
  .toFile(resolve(root, 'public/og-image.jpg'))

console.log('✓ public/og-image.jpg created (1200×630)')
