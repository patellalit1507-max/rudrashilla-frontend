export interface Review {
  id: string
  productId: string
  author: string
  initials: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
}

export const REVIEWS: Review[] = [
  // Product 1
  {
    id: 'r1',
    productId: '1',
    author: 'Amit Sharma',
    initials: 'AS',
    rating: 5,
    date: '2026-01-15',
    title: 'Absolutely divine — exactly as described',
    body: 'Received the Narmadeshwar Shivling in perfect condition, wrapped very carefully. The stone is smooth, naturally formed, and carries a very positive energy. Installed it in our home temple and it looks beautiful. Highly recommend.',
    verified: true,
  },
  {
    id: 'r2',
    productId: '1',
    author: 'Priya Verma',
    initials: 'PV',
    rating: 4,
    date: '2026-01-08',
    title: 'Great quality, fast delivery',
    body: 'The Shivling arrived within 4 days, well packed. The size is exactly as mentioned. Overall very satisfied with the purchase.',
    verified: true,
  },
  {
    id: 'r3',
    productId: '1',
    author: 'Rajesh Nair',
    initials: 'RN',
    rating: 5,
    date: '2025-12-22',
    title: 'Genuine Narmada stone, very happy',
    body: 'I have bought several Shivlings over the years and this one is clearly genuine. The texture and weight are authentic. The team was also very helpful in answering my queries before I placed the order.',
    verified: false,
  },

  // Product 2
  {
    id: 'r4',
    productId: '2',
    author: 'Sunita Patel',
    initials: 'SP',
    rating: 5,
    date: '2026-02-01',
    title: 'Beautiful piece for our puja room',
    body: 'We bought this as a gift and the recipient loved it. The craftsmanship is excellent and the stone has a very sacred feel to it.',
    verified: true,
  },
  {
    id: 'r5',
    productId: '2',
    author: 'Deepak Joshi',
    initials: 'DJ',
    rating: 4,
    date: '2026-01-20',
    title: 'Good product, responsive support',
    body: 'I had a few questions before ordering and the team responded quickly on WhatsApp. The product itself is very good quality.',
    verified: true,
  },

  // Product 3
  {
    id: 'r6',
    productId: '3',
    author: 'Meera Krishnan',
    initials: 'MK',
    rating: 5,
    date: '2026-02-10',
    title: 'Excellent Jaladhari — superb finish',
    body: 'The Jaladhari is beautifully finished with smooth edges. Paired perfectly with our existing Shivling. Very happy with this purchase.',
    verified: true,
  },
  {
    id: 'r7',
    productId: '3',
    author: 'Vikram Singh',
    initials: 'VS',
    rating: 4,
    date: '2026-01-05',
    title: 'Good quality but shipping took time',
    body: 'The product quality is great, no complaints there. Shipping took about a week which could be faster, but worth the wait.',
    verified: false,
  },

  // Product 4
  {
    id: 'r8',
    productId: '4',
    author: 'Ananya Reddy',
    initials: 'AR',
    rating: 5,
    date: '2026-02-14',
    title: 'Perfect addition to our altar',
    body: 'The Somasutra set is elegant and well crafted. Fits beautifully around our Shivling. The quality is top notch.',
    verified: true,
  },

  // Product 5
  {
    id: 'r9',
    productId: '5',
    author: 'Kavita Mehta',
    initials: 'KM',
    rating: 5,
    date: '2026-02-03',
    title: 'Rare find — very authentic',
    body: 'This is a rare find online. Most places sell replicas but this is clearly an authentic Narmadeshwar stone. The seller\'s attention to detail and care in packaging speaks volumes.',
    verified: true,
  },
  {
    id: 'r10',
    productId: '5',
    author: 'Rahul Gupta',
    initials: 'RG',
    rating: 5,
    date: '2026-01-28',
    title: 'Gifted to parents — they loved it',
    body: 'Gifted this to my parents for their anniversary and they were very moved. The stone is beautiful and feels very sacred. 5 stars without hesitation.',
    verified: true,
  },

  // Product 6
  {
    id: 'r11',
    productId: '6',
    author: 'Suresh Iyer',
    initials: 'SI',
    rating: 4,
    date: '2026-01-18',
    title: 'Well crafted Somasutra',
    body: 'Solid build, nice finishing. Looks great in our puja setup. Would definitely buy again.',
    verified: true,
  },

  // Product 7
  {
    id: 'r12',
    productId: '7',
    author: 'Divya Nambiar',
    initials: 'DN',
    rating: 4,
    date: '2026-02-08',
    title: 'Good quality, as expected',
    body: 'The item is exactly as described. Delivery was prompt and packaging was secure. Happy with the purchase.',
    verified: false,
  },

  // Product 8
  {
    id: 'r13',
    productId: '8',
    author: 'Manoj Tiwari',
    initials: 'MT',
    rating: 5,
    date: '2026-01-30',
    title: 'Outstanding — will buy again',
    body: 'Truly a beautiful piece. It has a very positive energy and the quality exceeded my expectations. Rudrashila is my go-to for all sacred items now.',
    verified: true,
  },
  {
    id: 'r14',
    productId: '8',
    author: 'Pooja Chauhan',
    initials: 'PC',
    rating: 4,
    date: '2026-01-12',
    title: 'Happy with the purchase',
    body: 'Great product overall. Packaging could be slightly more premium but the product itself is excellent.',
    verified: true,
  },
]
