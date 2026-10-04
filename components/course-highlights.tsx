'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type CategoryCard = {
  slug: string
  label: string
  cover: string | null
}

export function CourseHighlights() {
  const [categories, setCategories] = useState<CategoryCard[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('course_categories')
        .select('slug, label, cover')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error(error)
        return
      }

      setCategories(data ?? [])
    }

    fetchCategories()
  }, [])

  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="flex items-start justify-between mb-12">
          <h2 className="text-5xl font-bold text-black">
            All Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(({ slug, label, cover }) => (
            <div
              key={slug}
              className="border border-black/10 bg-white text-center overflow-hidden"
            >
              {cover && (
                <div className="relative w-full aspect-square">
                  <img
                    src={cover}
                    alt={label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-black">{label}</h3>

                <Link
                  href={`/courses?category=${slug}`}
                  className="text-[#919077] text-sm font-medium underline hover:opacity-70 transition-opacity inline-block"
                >
                  Book a Class
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 text-center" style={{ fontWeight: 600 }}>
          <i>For special event, please contact us directly.</i>
        </div>
      </div>
    </section>
  )
}
