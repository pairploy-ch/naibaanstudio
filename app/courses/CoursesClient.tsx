'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Monday Morning Course',
    description: 'Pad Thai, Tom Yum Soup, Banana in coconut milk, Red Curry',
    date: '9.00 AM - 12.30 PM',
    category: 'half-day',
    image:
      'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
  },
  // {
  //   id: 2,
  //   title: 'Vegan Thai Delights',
  //   description:
  //     'Green Curry with Tofu, Vegetable Spring Rolls, Mango Sticky Rice',
  //   date: '2.00 PM - 5.30 PM',
  //   category: 'vegan',
  //   image:
  //     'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
  // },
  // {
  //   id: 3,
  //   title: 'Zero Waste Cooking',
  //   description: 'Sustainable Thai cuisine using every part of ingredients',
  //   date: '9.00 AM - 12.30 PM',
  //   category: 'zero-waste',
  //   image:
  //     'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
  // },
  // {
  //   id: 4,
  //   title: 'Master Pad Thai',
  //   description: 'Perfect your Pad Thai technique in this focused class',
  //   date: '2.00 PM - 5.30 PM',
  //   category: 'single-dish',
  //   image:
  //     'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
  // },
]

export default function CoursesClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isInitialized, setIsInitialized] = useState(false)

  // อ่านค่าจาก URL ตอน mount
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'

    setSearchTerm(search)
    setSelectedCategory(category)
    setIsInitialized(true)
  }, [searchParams])

  // sync state -> URL
  useEffect(() => {
    if (!isInitialized) return

    const params = new URLSearchParams()

    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory !== 'all')
      params.set('category', selectedCategory)

    const query = params.toString()
    router.push(query ? `?${query}` : '/courses', {
      scroll: false,
    })
  }, [searchTerm, selectedCategory, isInitialized, router])

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-black mb-8">
            All Courses
          </h2>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-black font-semibold mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or description"
                className="w-full px-4 py-3 border-2 border-black bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black"
              >
                <option value="all">All Categories</option>
                <option value="half-day">Half Day</option>
                <option value="vegan">Vegan</option>
                <option value="zero-waste">Zero Waste</option>
                <option value="single-dish">Single Dish</option>
              </select>
            </div>
          </div>

          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="underline text-black mb-6"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Courses */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.length === 0 ? (
            <p className="col-span-full text-center text-black">
              No courses found.
            </p>
          ) : (
            filteredCourses.map(course => (
              <div key={course.id}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[500px] object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl text-black">
                    {course.title}
                  </h3>
                  <p className="text-black text-sm opacity-80">
                    {course.description}
                  </p>
                  <p className="text-black text-sm mb-4">
                    {course.date}
                  </p>
                  <Link
                    href={`/courses/${course.id}`}
                    className="underline text-black"
                  >
                    Book a Class
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
