import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Pad Thai, Tom Yum Soup, Red Curry & Banana in coconut milk',
    date: 'DEC 8 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM ',
    dateBadge: { day: '8', month: 'DEC' },
    image: '/mock-about.jpg',
  },

]

export function CourseHighlights() {
  return (
    <section className="py-18 bg-[#F6EFE7]">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="flex items-start justify-between mb-12">
          <h2 className=" text-5xl font-bold text-black">
            All Courses
          </h2>
          {/* <Link 
            href="#courses"
            className="text-black font-medium underline hover:opacity-70 transition-opacity"
          >
            View All Course
          </Link> */}
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
                  className="w-full h-[500px] object-cover"
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
