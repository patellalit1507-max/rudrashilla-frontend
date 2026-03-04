import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, Clock } from 'lucide-react'
import { BLOG_POSTS } from '@/data/blogs'

export function Blog() {
  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8 md:px-6 md:py-12">
      <Helmet>
        <title>Blog — Narmadeshwar Shivling Guides & Spiritual Articles | Rudrashilla</title>
        <meta name="description" content="Read expert guides on Narmadeshwar Shivling — what it is, how to identify an original, spiritual benefits, how to perform abhishek at home, and why Narmada River stones are sacred." />
        <link rel="canonical" href="https://rudrashilla.com/blog" />
        <meta property="og:title" content="Rudrashilla Blog — Narmadeshwar Shivling Guides" />
        <meta property="og:description" content="Expert guides on Narmadeshwar Shivling, puja rituals, and the sacred Narmada River." />
        <meta property="og:url" content="https://rudrashilla.com/blog" />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">Blog</span>
      </nav>

      <h1 className="mb-2 text-3xl font-bold md:text-4xl">Rudrashilla Blog</h1>
      <p className="mb-10 text-muted-foreground md:text-lg">
        Guides on Narmadeshwar Shivling, puja rituals, and the sacred Narmada River.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.seoDesc}</p>
            <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
              <span>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {post.readTime}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
