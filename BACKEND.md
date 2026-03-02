# Rudrashila — Backend API Design
> Node.js + Express + MongoDB · Last updated: March 2026

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js 20 LTS | Stable, LTS support |
| Framework | Express 5 | Lightweight, battle-tested |
| Database | MongoDB + Mongoose | Flexible schema for products/orders |
| Auth | JWT (access + refresh) | Stateless, secure |
| Validation | Zod | Runtime type-safe schema validation |
| Password hashing | bcrypt | Industry standard |
| Security headers | Helmet.js | Prevents common HTTP attacks |
| Rate limiting | express-rate-limit | Brute-force / DDoS protection |
| CORS | cors package | Whitelist only your frontend domain |
| Env secrets | dotenv | Never hardcode secrets |

---

## Project Structure

```
rudrashila-backend/
├── src/
│   ├── config/
│   │   └── db.ts                  # Mongoose connection
│   ├── middleware/
│   │   ├── auth.ts                # verifyToken middleware
│   │   ├── adminOnly.ts           # checks role === 'admin'
│   │   ├── rateLimiter.ts         # per-route rate limits
│   │   └── validate.ts            # Zod schema validator
│   ├── models/
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Enquiry.ts
│   │   ├── Review.ts
│   │   └── Admin.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── order.routes.ts
│   │   ├── enquiry.routes.ts
│   │   └── review.routes.ts
│   ├── controllers/               # Business logic per route
│   ├── schemas/                   # Zod validation schemas
│   └── app.ts                     # Express app setup
├── .env                           # Never commit this
├── .env.example                   # Commit this (no real secrets)
└── package.json
```

---

## Environment Variables (`.env`)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/rudrashila

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=<64-byte-random-hex>
JWT_REFRESH_SECRET=<64-byte-random-hex>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS — only your frontend domain, no trailing slash
ALLOWED_ORIGIN=https://rudrashila.com

# Admin bootstrap (set once, then manage via DB)
ADMIN_BOOTSTRAP_KEY=<a-very-long-secret-used-only-for-first-admin-creation>
```

---

## Security Layers

### 1. Helmet.js — HTTP Headers
```ts
app.use(helmet())
// Sets: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options,
//        Strict-Transport-Security, Referrer-Policy, etc.
```

### 2. CORS — Whitelist Only
```ts
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,   // only your frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
```
> Any request from a different origin is rejected by the browser before it even reaches your handlers.

### 3. Rate Limiting
```ts
// Global: 100 requests per 15 min per IP
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(globalLimiter)

// Strict: auth routes — 10 attempts per 15 min per IP
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 })
app.use('/api/auth', authLimiter)
```

### 4. JWT Auth Flow

```
[Admin Login]
  POST /api/auth/login
        │
        ▼
  Verify password with bcrypt
        │
        ▼
  Issue: accessToken (15m) + refreshToken (7d, httpOnly cookie)
        │
        ▼
[Admin makes protected request]
  Authorization: Bearer <accessToken>
        │
        ▼
  verifyToken middleware validates JWT signature + expiry
        │
        ▼
  adminOnly middleware checks req.user.role === 'admin'
        │
        ▼
  Handler executes
```

### 5. Input Validation with Zod
Every POST/PUT/PATCH body goes through a Zod schema. Invalid data → `400 Bad Request` before touching the database.

### 6. NoSQL Injection Prevention
- Use Mongoose (never raw query strings)
- Strip `$` and `.` from all string inputs via a sanitize middleware
- Never pass `req.body` directly into `Model.find()`

### 7. Admin Account
- Only **one** admin account (you)
- Password hashed with `bcrypt` (cost factor 12)
- Refresh tokens stored in **httpOnly, Secure, SameSite=Strict** cookie (not localStorage — protects against XSS)
- Access token in memory on the client only (never stored)

---

## Mongoose Models

### Product
```ts
{
  name:          String  (required, trim)
  price:         Number  (required, min: 0)
  originalPrice: Number  (optional)
  image:         String  (required, url)
  images:        [String]
  category:      String  (enum: ['Shivling', 'Jaladhari', 'Somasutra'])
  badge:         String  (enum: ['sale', 'new', 'hot', null])
  rating:        Number  (default: 0, min: 0, max: 5)
  reviewCount:   Number  (default: 0)
  description:   String  (required)
  sizes:         [String]
  colors:        [String]
  inStock:       Boolean (default: true)
  createdAt:     Date    (auto)
  updatedAt:     Date    (auto)
}
```

### Order
```ts
{
  customer: {
    name:         String (required)
    email:        String (required, lowercase)
    phone:        String (required)
  }
  address: {
    line1:        String (required)
    line2:        String
    city:         String (required)
    state:        String (required)
    pincode:      String (required)
  }
  items: [{
    productId:    ObjectId (ref: Product)
    name:         String   (snapshot at order time)
    price:        Number   (snapshot at order time)
    quantity:     Number
    selectedSize: String
    selectedColor:String
  }]
  totalAmount:    Number
  status:         String (enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending')
  createdAt:      Date (auto)
}
```

### Enquiry (Shivling query form)
```ts
{
  productId:    ObjectId (ref: Product)
  productName:  String
  customer: {
    name:        String (required)
    phone:       String (required)
    message:     String
  }
  status:       String (enum: ['new', 'responded', 'closed'], default: 'new')
  createdAt:    Date (auto)
}
```

### Review
```ts
{
  productId:  ObjectId (ref: Product, required)
  author:     String (required)
  rating:     Number (required, min:1, max:5)
  title:      String (required)
  body:       String (required)
  verified:   Boolean (default: false)
  createdAt:  Date (auto)
}
```

### Admin
```ts
{
  email:        String (required, unique, lowercase)
  passwordHash: String (required)     // bcrypt hash only — never store plain text
  role:         String (default: 'admin')
  createdAt:    Date (auto)
}
```

---

## API Contracts

### Base URL
```
Development:  http://localhost:5000/api
Production:   https://api.rudrashila.com/api
```

### Response envelope (all responses)
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message"
}
```
Error responses:
```json
{
  "success": false,
  "error": "Short error code",
  "message": "Human-readable description"
}
```

---

### Auth Routes

#### `POST /api/auth/login`
Admin login. Rate-limited to 10 attempts / 15 min.

**Request body**
```json
{
  "email": "you@rudrashila.com",
  "password": "your-strong-password"
}
```
**Response `200`**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci..."
  }
}
```
> Refresh token is set as `httpOnly; Secure; SameSite=Strict` cookie automatically.

**Errors**
| Status | message |
|---|---|
| 400 | Validation failed |
| 401 | Invalid credentials |
| 429 | Too many attempts, try again later |

---

#### `POST /api/auth/refresh`
Get a new access token using the refresh token cookie.

**Request** — No body. Refresh token read from cookie automatically.

**Response `200`**
```json
{
  "success": true,
  "data": { "accessToken": "eyJhbGci..." }
}
```

**Errors**
| Status | message |
|---|---|
| 401 | Refresh token missing or expired |

---

#### `POST /api/auth/logout`
Clears the refresh token cookie.

**Response `200`**
```json
{ "success": true, "message": "Logged out" }
```

---

### Product Routes

#### `GET /api/products`
Public. Fetch all products with optional filters.

**Query params**
| Param | Type | Example |
|---|---|---|
| `category` | string | `Shivling` |
| `badge` | string | `sale` |
| `inStock` | boolean | `true` |
| `sort` | string | `price_asc`, `price_desc`, `newest` |
| `page` | number | `1` |
| `limit` | number | `12` |

**Response `200`**
```json
{
  "success": true,
  "data": {
    "products": [ { ...product } ],
    "total": 42,
    "page": 1,
    "pages": 4
  }
}
```

---

#### `GET /api/products/:id`
Public. Fetch single product.

**Response `200`**
```json
{
  "success": true,
  "data": { ...product }
}
```

**Errors**
| Status | message |
|---|---|
| 404 | Product not found |

---

#### `POST /api/products` 🔒 Admin only
Create a new product.

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request body**
```json
{
  "name":          "Narmadeshwar Shivling — Medium",
  "price":         0,
  "originalPrice": null,
  "image":         "https://...",
  "images":        ["https://...", "https://..."],
  "category":      "Shivling",
  "badge":         "new",
  "description":   "Authentic Narmadeshwar Shivling...",
  "sizes":         [],
  "colors":        ["Natural Stone", "Dark Stone"],
  "inStock":       true
}
```

**Response `201`**
```json
{
  "success": true,
  "data": { ...createdProduct },
  "message": "Product created"
}
```

**Errors**
| Status | message |
|---|---|
| 400 | Validation failed (Zod errors) |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — not an admin |

---

#### `PUT /api/products/:id` 🔒 Admin only
Replace a product completely.

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request body** — Same shape as `POST /api/products`

**Response `200`**
```json
{
  "success": true,
  "data": { ...updatedProduct },
  "message": "Product updated"
}
```

---

#### `PATCH /api/products/:id` 🔒 Admin only
Partial update (e.g. toggle inStock, change badge).

**Headers**
```
Authorization: Bearer <accessToken>
```

**Request body** — Any subset of product fields
```json
{
  "inStock": false,
  "badge": "sale"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": { ...updatedProduct }
}
```

---

#### `DELETE /api/products/:id` 🔒 Admin only
Permanently delete a product.

**Headers**
```
Authorization: Bearer <accessToken>
```

**Response `200`**
```json
{
  "success": true,
  "message": "Product deleted"
}
```

**Errors**
| Status | message |
|---|---|
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Product not found |

---

### Order Routes

#### `POST /api/orders`
Public. Place an order from the checkout form.

**Request body**
```json
{
  "customer": {
    "name":  "Amit Sharma",
    "email": "amit@example.com",
    "phone": "+91 98765 43210"
  },
  "address": {
    "line1":   "12 MG Road",
    "line2":   "Near Shiv Temple",
    "city":    "Indore",
    "state":   "Madhya Pradesh",
    "pincode": "452001"
  },
  "items": [
    {
      "productId":     "664abc...",
      "quantity":      2,
      "selectedSize":  null,
      "selectedColor": "Natural Stone"
    }
  ]
}
```
> The backend re-fetches prices from the database to prevent price tampering from the client.

**Response `201`**
```json
{
  "success": true,
  "data": {
    "orderId":     "ORD-2026-00042",
    "totalAmount": 1599.00,
    "status":      "pending"
  },
  "message": "Order placed. We will contact you within 24 hours."
}
```

**Errors**
| Status | message |
|---|---|
| 400 | Validation failed |
| 404 | One or more products not found |

---

#### `GET /api/orders` 🔒 Admin only
List all orders with pagination.

**Query params**: `status`, `page`, `limit`, `sort` (`newest` / `oldest`)

**Response `200`**
```json
{
  "success": true,
  "data": {
    "orders": [ { ...order } ],
    "total": 100,
    "page": 1
  }
}
```

---

#### `GET /api/orders/:id` 🔒 Admin only
Get a single order.

---

#### `PATCH /api/orders/:id/status` 🔒 Admin only
Update order status.

**Request body**
```json
{ "status": "shipped" }
```
Valid values: `pending` → `confirmed` → `shipped` → `delivered` | `cancelled`

---

### Enquiry Routes (Shivling Queries)

#### `POST /api/enquiries`
Public. Raised from the product detail enquiry form.

**Request body**
```json
{
  "productId":   "664abc...",
  "productName": "Narmadeshwar Shivling — Large",
  "customer": {
    "name":    "Priya Patel",
    "phone":   "+91 99999 00000",
    "message": "I need a medium-sized Shivling for home temple, approx 5 inches."
  }
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Query received. We will contact you within 24 hours."
}
```

---

#### `GET /api/enquiries` 🔒 Admin only
List all enquiries. Query params: `status`, `page`, `limit`.

---

#### `PATCH /api/enquiries/:id/status` 🔒 Admin only
Mark an enquiry as responded or closed.

**Request body**
```json
{ "status": "responded" }
```

---

### Review Routes

#### `GET /api/reviews/:productId`
Public. Get all reviews for a product.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "reviews": [ { ...review } ],
    "averageRating": 4.6,
    "total": 14
  }
}
```

---

#### `POST /api/reviews`
Public (no auth required — add captcha or honeypot in production to prevent spam).

**Request body**
```json
{
  "productId": "664abc...",
  "author":    "Vikram Singh",
  "rating":    5,
  "title":     "Excellent quality",
  "body":      "Genuine Narmada stone, very happy with the purchase."
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Review submitted. It will appear after verification."
}
```
> Set `verified: false` by default. Admin approves reviews before they appear publicly.

---

## Middleware Reference

```
verifyToken (auth.ts)
  └── Reads Authorization header
  └── Verifies JWT signature with JWT_ACCESS_SECRET
  └── Attaches req.user = { id, email, role }
  └── Returns 401 if missing / expired / invalid

adminOnly (adminOnly.ts)
  └── Checks req.user.role === 'admin'
  └── Returns 403 Forbidden if not admin

validate(schema) (validate.ts)
  └── Runs Zod schema.parse(req.body)
  └── Returns 400 with field-level errors if invalid
```

---

## Route Protection Summary

| Route | Method | Auth | Admin |
|---|---|---|---|
| `/api/products` | GET | ✗ | ✗ |
| `/api/products/:id` | GET | ✗ | ✗ |
| `/api/products` | POST | ✅ | ✅ |
| `/api/products/:id` | PUT | ✅ | ✅ |
| `/api/products/:id` | PATCH | ✅ | ✅ |
| `/api/products/:id` | DELETE | ✅ | ✅ |
| `/api/orders` | POST | ✗ | ✗ |
| `/api/orders` | GET | ✅ | ✅ |
| `/api/orders/:id` | GET | ✅ | ✅ |
| `/api/orders/:id/status` | PATCH | ✅ | ✅ |
| `/api/enquiries` | POST | ✗ | ✗ |
| `/api/enquiries` | GET | ✅ | ✅ |
| `/api/enquiries/:id/status` | PATCH | ✅ | ✅ |
| `/api/reviews/:productId` | GET | ✗ | ✗ |
| `/api/reviews` | POST | ✗ | ✗ |
| `/api/auth/login` | POST | ✗ | ✗ |
| `/api/auth/refresh` | POST | ✗ | ✗ |
| `/api/auth/logout` | POST | ✗ | ✗ |

---

## Security Checklist Before Going Live

- [ ] `.env` is in `.gitignore` — never pushed to GitHub
- [ ] `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are 64+ random bytes
- [ ] `ALLOWED_ORIGIN` is your exact production domain (no wildcard `*`)
- [ ] Helmet is enabled
- [ ] Rate limiting is enabled on all routes, strict on `/api/auth`
- [ ] Admin password is 16+ characters, stored as bcrypt hash (cost 12)
- [ ] Refresh token cookie flags: `httpOnly: true`, `secure: true`, `sameSite: 'strict'`
- [ ] MongoDB connection uses TLS and a dedicated DB user with least-privilege
- [ ] All routes behind `adminOnly` tested to return `403` without a valid admin token
- [ ] Review `verified` flag defaults to `false` — no public reviews until approved
- [ ] Server runs behind HTTPS (use Nginx reverse proxy or Railway/Render HTTPS)
- [ ] No stack traces or internal errors exposed in production responses
