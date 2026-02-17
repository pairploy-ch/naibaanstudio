import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Short but long lasting',
    description: 'happiness, fun & yummy moments in just 2 hours. Learn to cook 1 famous savory dish and 1 delicious dessert!',
    // date: 'DEC 8 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM',
    // dateBadge: { day: '8', month: 'DEC' },
    image: 'https://images.squarespace-cdn.com/content/v1/6871a043c41d0a698827bbcc/387e965e-14b1-49a9-b774-7a07eb09db9d/thai-food-banner.jpeg',
    link: '/courses?category=short-course'
  },
  {
    id: 2,
    title: 'Let’s meet during NO-MEAT time ',
    description: 'create 3 tasty veggie dishes and 1 sweet dessert in our veggie class.',
    // date: 'DEC 15 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM',
    // dateBadge: { day: '15', month: 'DEC' },
    image: 'https://www.asiabooks.com/media/catalog/product/cache/a5ac216be58c0cbce1cb04612ece96dc/9/7/9781624149009.jpg',
      link: '/courses?category=vegan'
  },
  {
    id: 3,
    title: 'Love food, love our Planet Earth',
    description: 'enjoy 3 zero-waste savory dishes and 1 delicious dessert in this mindful class.',
    // date: 'DEC 22 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM',
    // dateBadge: { day: '22', month: 'DEC' },
    image: 'https://cdn.prod.website-files.com/6034974e48b4d1a5beb91111/644720d0c411c85a70de515f_zero%20waste.jpg',
       link: '/courses?category=zero-waste'
  },
  {
    id: 4,
    title: 'Full course happiness',
    description: 'From savory to sweet — full-course happiness with 3 iconic savory dishes and 1 delightful dessert.',
    // date: 'DEC 29 2025, 9.00 AM - 12.30 PM / 2:00 PM - 5:30 PM',
    // dateBadge: { day: '29', month: 'DEC' },
    image: 'https://thipsamai.com/wp-content/uploads/2022/05/Padthai_Shrimp_Oil_Prawns_wrapped_in_egg.jpg',
     link: '/courses?category=full-course'
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
              <div className="p-2 text-center" style={{paddingTop: '20px'}}>
                <h3 className="font-bold text-xl mb-2 text-black" style={{lineHeight: '1.2', height: '50px'}}>
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
                  className="text-[#919077] font-medium underline hover:opacity-70 transition-opacity inline-block"
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