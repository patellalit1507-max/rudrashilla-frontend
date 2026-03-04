import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BLOG_POSTS } from '@/data/blogs'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) return <Navigate to="/blog" replace />

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDesc,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Rudrashilla' },
    publisher: {
      '@type': 'Organization',
      name: 'Rudrashilla',
      url: 'https://rudrashilla.com',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://rudrashilla.com/blog/${post.slug}` },
  }

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-8 md:px-6 md:py-12">
      <Helmet>
        <title>{post.seoTitle}</title>
        <meta name="description" content={post.seoDesc} />
        <link rel="canonical" href={`https://rudrashilla.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.seoTitle} />
        <meta property="og:description" content={post.seoDesc} />
        <meta property="og:url" content={`https://rudrashilla.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <ChevronRight className="size-3.5" />
        <span className="line-clamp-1 font-medium text-foreground">{post.title}</span>
      </nav>

      {/* Article header */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {post.readTime}
          </span>
          <span>·</span>
          <span>Rudrashilla</span>
        </div>
      </header>

      {/* Article body */}
      <article className="prose prose-zinc max-w-none">
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="mt-8 mb-3 text-xl font-semibold">{section.heading}</h2>
            )}
            <div className="space-y-3">
              {section.body.split('\n\n').map((para, j) => (
                <p key={j} className="leading-relaxed text-foreground/85">
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* CTA */}
      <div className="mt-12 rounded-xl border border-border bg-muted/40 p-6 text-center">
        <p className="mb-4 text-base font-medium">
          Ready to bring home an authentic Narmadeshwar Shivling?
        </p>
        <Button asChild size="lg">
          <Link to={post.cta.to}>{post.cta.label}</Link>
        </Button>
      </div>

      {/* Back to blog */}
      <div className="mt-8 text-center">
        <Link to="/blog" className="text-sm text-muted-foreground underline hover:text-foreground">
          ← Back to all articles
        </Link>
      </div>
    </div>
  )
}
