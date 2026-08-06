'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type Blog = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  created_at?: string
}

const FALLBACK_IMAGE = '/placeholder.jpg'

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('blogs')
      .select('id, slug, title, excerpt, cover_image, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (error) console.error('Failed to load blogs:', error)
        if (data) setBlogs(data as Blog[])
        setLoading(false)
      })
  }, [])

  if (!loading && blogs.length === 0) return null

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6 max-w-[90%]">
        <h2 className="text-5xl font-bold text-black mb-4 text-center">
          From Our Blog
        </h2>
        <p className="text-center text-black mb-12 text-lg">
          Recipes, tips, and stories from the kitchen
        </p>

        {loading ? (
          <p className="text-center text-black">Loading...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="bg-white border-2 border-black flex flex-col hover:-translate-y-1 transition-transform"
                >
                  <div className="aspect-video overflow-hidden border-b-2 border-black">
                    <img
                      src={blog.cover_image || FALLBACK_IMAGE}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-black text-lg mb-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-black leading-relaxed line-clamp-3 flex-grow">
                        {blog.excerpt}
                      </p>
                    )}
                    <span className="mt-4 font-bold text-black underline underline-offset-4">
                      Read more
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/blogs"
                className="inline-block px-8 py-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold"
              >
                View all posts
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
