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
    image: 'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
  },
  {
    id: 2,
    title: 'Vegan Thai Delights',
    description: 'Green Curry with Tofu, Vegetable Spring Rolls, Mango Sticky Rice',
    date: '2.00 PM - 5.30 PM',
    category: 'vegan',
    image: 'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
  },
  {
    id: 3,
    title: 'Zero Waste Cooking',
    description: 'Sustainable Thai cuisine using every part of ingredients',
    date: '9.00 AM - 12.30 PM',
    category: 'zero-waste',
    image: 'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
  },
  {
    id: 4,
    title: 'Master Pad Thai',
    description: 'Perfect your Pad Thai technique in this focused class',
    date: '2.00 PM - 5.30 PM',
    category: 'single-dish',
    image: 'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
  },
]

export default function CoursesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from URL on mount
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
    setSearchTerm(search)
    setSelectedCategory(category)
    setIsInitialized(true)
  }, [])

  // Update URL when filters change
  useEffect(() => {
    if (!isInitialized) return

    const params = new URLSearchParams()
    
    if (searchTerm) {
      params.set('search', searchTerm)
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    
    router.push(newUrl, { scroll: false })
  }, [searchTerm, selectedCategory, isInitialized, router])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
  }

  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-black mb-8">
            All Courses
          </h2>
          
          {/* Filter Section */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-black font-semibold mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or description"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black"
              />
            </div>
            
            <div>
              <label className="block text-black font-semibold mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:border-black appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                }}
              >
                <option value="all">All Categories</option>
                <option value="half-day">Half Day</option>
                <option value="vegan">Vegan</option>
                <option value="zero-waste">Zero Waste</option>
                <option value="single-dish">Single Dish</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mb-6">
              <button
                onClick={clearFilters}
                className="text-black underline hover:opacity-70 transition-opacity"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-black text-lg">No courses found matching your criteria.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id}>
                <div className="relative">
                  <div className="absolute top-4 right-4 bg-white px-3 py-2 text-center leading-tight z-10">
                    <div className="text-xl font-bold text-black">{course.category}</div>
                  </div>
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl mb-2 text-black">
                    {course.title}
                  </h3>
                  <p className="text-black text-sm mb-3 opacity-80">
                    {course.description}
                  </p>
                  <p className="text-black text-sm mb-4">
                    {course.date}
                  </p>
                  <Link 
                    href={`/courses/${course.id}`}
                    className="text-black font-medium underline hover:opacity-70 transition-opacity inline-block"
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