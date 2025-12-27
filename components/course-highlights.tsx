import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Half-Day Cooking Course',
    description: '4–5 classic Thai dishes, including popular everyday meals, main courses, traditional Thai dishes, and a Thai dessert',
    // date: 'DEC 8 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM',
    // dateBadge: { day: '8', month: 'DEC' },
    image: 'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
    link: '/courses?category=half-day'
  },
  {
    id: 2,
    title: 'Vegan Thai Cooking Course',
    description: 'Focuses entirely on vegetarian and vegan Thai cuisine. Learn how to create flavorful Thai dishes using fresh vegetables, herbs, and plant-based ingredients—without any meat or animal products',
    // date: 'DEC 15 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM',
    // dateBadge: { day: '15', month: 'DEC' },
    image: 'https://www.asiabooks.com/media/catalog/product/cache/a5ac216be58c0cbce1cb04612ece96dc/9/7/9781624149009.jpg',
      link: '/courses?category=vegan'
  },
  {
    id: 3,
    title: 'Zero Waste Cooking Course',
    description: 'Focuses on Zero Waste Thai cooking. Participants will learn how to prepare delicious Thai dishes',
    // date: 'DEC 22 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM',
    // dateBadge: { day: '22', month: 'DEC' },
    image: 'https://cdn.prod.website-files.com/6034974e48b4d1a5beb91111/644720d0c411c85a70de515f_zero%20waste.jpg',
       link: '/courses?category=zero-waste'
  },
  {
    id: 4,
    title: 'Single Dish Cooking Course',
    description: 'This short cooking class lasts 2–3 hours and is perfect for travelers with limited time. Participants will learn how to cook two iconic Thai dishes',
    // date: 'DEC 29 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM',
    // dateBadge: { day: '29', month: 'DEC' },
    image: 'https://thipsamai.com/wp-content/uploads/2022/05/Padthai_Shrimp_Oil_Prawns_wrapped_in_egg.jpg',
     link: '/courses?category=single-dish'
  },
]

export function CourseHighlights() {
  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="flex items-start justify-between mb-12">
          <h2 className="text-5xl font-bold text-black">
            All Courses
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id}>
              <div className="relative">
                {/* <div className="absolute top-4 right-4 bg-white px-3 py-2 text-center leading-tight z-10">
                  <div className="text-2xl font-bold text-black">{course.dateBadge.day}</div>
                  <div className="text-xs font-semibold text-black">{course.dateBadge.month}</div>
                </div> */}
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
                <p className="text-black text-sm mb-3 opacity-80 h-[100px]">
                  {course.description}
                </p>
                {/* <p className="text-black text-sm mb-4">
                  {course.date}
                </p> */}
                <Link 
                  href={`${course.link}`}
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