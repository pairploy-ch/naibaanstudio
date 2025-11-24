import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Thai Herbs & Spices Cooking Class',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/mock-about.jpg',
  },
  {
    id: 2,
    title: 'Mastering Pad Thai',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/mock-about.jpg',
  },
  {
    id: 3,
    title: 'Coconut & Curry Cooking Experience',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/mock-about.jpg',
  },
  {
    id: 4,
    title: 'Thai Curry Masterclass',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/mock-about.jpg',
  },
  {
    id: 5,
    title: 'Thai Street Food Favorites',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
    image: '/mock-about.jpg',
  },
  {
    id: 6,
    title: 'Sweet Thai Classics Workshop',
    date: 'NOV 12, 2025 4.00PM - 5.00 PM',
    dateBadge: { day: '11', month: 'NOV' },
   image: '/mock-about.jpg',
  },
]

export function CourseHighlights() {
  return (
    <section className="py-18 bg-[#F5F1EC]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-start justify-between mb-12">
          <h2 className=" text-5xl font-bold text-black">
            Course Highlights
          </h2>
          <Link 
            href="#courses"
            className="text-black font-medium underline hover:opacity-70 transition-opacity"
          >
            View All Course
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} >
              <div className="relative">
                <div className="absolute top-4 right-4 bg-white px-3 py-2 text-center leading-tight z-10">
                  <div className="text-2xl font-bold text-black">{course.dateBadge.day}</div>
                  <div className="text-xs font-semibold text-black">{course.dateBadge.month}</div>
                </div>
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-[400px] object-cover"
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
      </div>
    </section>
  )
}
