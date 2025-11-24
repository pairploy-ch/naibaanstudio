'use client'

import { useState } from 'react'
import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Thai Herbs & Spices Cooking Class',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/sizzling-thai-stir-fry-in-wok-with-vegetables-and-.jpg',
  },
  {
    id: 2,
    title: 'Mastering Pad Thai',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/authentic-pad-thai-noodles-on-traditional-thai-cer.jpg',
  },
  {
    id: 3,
    title: 'Coconut & Curry Cooking Experience',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/thai-green-curry-in-coconut-bowl.jpg',
  },
  {
    id: 4,
    title: 'Thai Curry Masterclass',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/thai-red-curry-with-vegetables-in-traditional-bowl.jpg',
  },
  {
    id: 5,
    title: 'Thai Street Food Favorites',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/thai-street-food-stir-fry-in-blue-patterned-plate.jpg',
  },
  {
    id: 6,
    title: 'Sweet Thai Classics Workshop',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/colorful-thai-desserts-mango-sticky-rice-coconut.jpg',
  },
  {
    id: 7,
    title: 'Thai Curry Masterclass',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/thai-red-curry-with-vegetables-in-traditional-bowl.jpg',
  },
  {
    id: 8,
    title: 'Thai Street Food Favorites',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/thai-street-food-stir-fry-in-blue-patterned-plate.jpg',
  },
  {
    id: 9,
    title: 'Sweet Thai Classics Workshop',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/colorful-thai-desserts-mango-sticky-rice-coconut.jpg',
  },
]

const ITEMS_PER_PAGE = 9

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCourses = courses.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <main className="min-h-screen bg-[#F5F1EC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F5F1EC] border-b border-black/10 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-serif text-xl font-bold">TF</span>
          </div>
          <span className="text-primary font-serif text-xl font-semibold">Thai Flavors</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
            Home
          </Link>
          <Link href="/about" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
            About
          </Link>
          <Link href="/gallery" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
            Photo Gallery
          </Link>
          <Link href="/courses" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
            Courses
          </Link>
          <Link href="/contact" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
            Contact
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 max-w-7xl py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-black mb-3">
            All Course
          </h1>
          <p className="text-lg text-foreground/80">
            Explore all our cooking experiences
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedCourses.map((course) => (
            <div key={course.id} className="bg-white">
              <div className="relative">
                <div className="absolute top-4 right-4 bg-white px-3 py-2 text-center leading-tight z-10">
                  <div className="text-2xl font-bold text-black">{course.dateBadge.day}</div>
                  <div className="text-xs font-semibold text-black">{course.dateBadge.month}</div>
                </div>
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-72 object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl mb-3 text-black">
                  {course.title}
                </h3>
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
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-black disabled:opacity-50 hover:bg-black/10 transition-colors"
            >
              ←
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-black disabled:opacity-50 hover:bg-black/10 transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
