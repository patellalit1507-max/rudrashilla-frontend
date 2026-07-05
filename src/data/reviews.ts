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
    title: 'Bilkul divine — exactly jaisa describe kiya tha',
    body: 'Narmadeshwar Shivling perfect condition mein mila, bahut carefully wrap kiya hua tha. Stone ekdum smooth hai, naturally formed, aur bahut positive energy feel hoti hai. Ghar ke mandir mein install kiya hai aur bahut sundar lag raha hai. Highly recommend karunga.',
    verified: true,
  },
  {
    id: 'r2',
    productId: '1',
    author: 'Priya Verma',
    initials: 'PV',
    rating: 4,
    date: '2026-01-08',
    title: 'Quality mast, delivery bhi fast',
    body: 'Shivling sirf 4 din mein hi aa gaya, well packed tha. Size bilkul waisa hi hai jaisa mention kiya tha. Overall purchase se bahut satisfied hoon.',
    verified: true,
  },
  {
    id: 'r3',
    productId: '1',
    author: 'Rajesh Nair',
    initials: 'RN',
    rating: 5,
    date: '2025-12-22',
    title: 'Genuine Narmada stone, bahut khush hoon',
    body: 'Maine years mein kai Shivling liye hain aur ye clearly genuine hai. Texture aur weight ekdum authentic hai. Team ne bhi order se pehle meri saari queries ka bahut acche se jawab diya.',
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
    title: 'Puja room ke liye bahut sundar piece',
    body: 'Humne ye gift ke liye liya tha aur jise diya use bahut pasand aaya. Craftsmanship excellent hai aur stone mein ek sacred feel aati hai.',
    verified: true,
  },
  {
    id: 'r5',
    productId: '2',
    author: 'Deepak Joshi',
    initials: 'DJ',
    rating: 4,
    date: '2026-01-20',
    title: 'Achha product, support bhi responsive',
    body: 'Order karne se pehle mere kuch questions the aur team ne WhatsApp par turant reply kiya. Product bhi bahut achhi quality ka hai.',
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
    body: 'Jaladhari bahut acche se finish kiya hua hai, edges ekdum smooth hain. Humare existing Shivling ke saath perfectly match ho gaya. Purchase se bahut khush hoon.',
    verified: true,
  },
  {
    id: 'r7',
    productId: '3',
    author: 'Vikram Singh',
    initials: 'VS',
    rating: 4,
    date: '2026-01-05',
    title: 'Quality achhi, bas shipping thodi slow',
    body: 'Product ki quality ekdum badhiya hai, koi complaint nahi. Shipping mein around ek week laga jo thoda fast ho sakta tha, par wait bilkul worth it tha.',
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
    title: 'Humare altar ke liye perfect',
    body: 'Somasutra set elegant aur well crafted hai. Shivling ke around bahut sundar fit hota hai. Quality ekdum top notch hai.',
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
    title: 'Rare find — ekdum authentic',
    body: 'Online ye ek rare find hai. Zyada tar jagah replica bechte hain par ye clearly ek authentic Narmadeshwar stone hai. Seller ka detail par attention aur packaging ki care bahut kuch keh deti hai.',
    verified: true,
  },
  {
    id: 'r10',
    productId: '5',
    author: 'Rahul Gupta',
    initials: 'RG',
    rating: 5,
    date: '2026-01-28',
    title: 'Parents ko gift kiya — unhe bahut pasand aaya',
    body: 'Maine ye apne parents ko unki anniversary par gift kiya aur wo bahut emotional ho gaye. Stone bahut sundar hai aur bahut sacred feel hota hai. 5 stars bina soche.',
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
    body: 'Solid build, finishing bhi bahut achhi. Humare puja setup mein ekdum achha lagta hai. Dobara zaroor buy karunga.',
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
    title: 'Achhi quality, expected jaisa hi',
    body: 'Item bilkul waisa hi hai jaisa describe kiya tha. Delivery prompt thi aur packaging secure thi. Purchase se khush hoon.',
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
    title: 'Outstanding — dobara zaroor lunga',
    body: 'Sach mein ek bahut sundar piece hai. Isme bahut positive energy hai aur quality ne meri expectations se bhi zyada diya. Ab saare sacred items ke liye Rudrashila hi meri pehli choice hai.',
    verified: true,
  },
  {
    id: 'r14',
    productId: '8',
    author: 'Pooja Chauhan',
    initials: 'PC',
    rating: 4,
    date: '2026-01-12',
    title: 'Purchase se khush hoon',
    body: 'Overall bahut achha product. Packaging thodi aur premium ho sakti thi par product khud excellent hai.',
    verified: true,
  },
]
