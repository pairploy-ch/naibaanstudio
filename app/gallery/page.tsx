import Link from 'next/link'

export default function GalleryPage() {
  const galleryImages = [
    {
      src: '/man-and-woman-cooking-together-in-thai-kitchen.jpg',
      alt: 'Two people cooking together',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: '/group-cooking-class-people-enjoying-thai-food-toge.jpg',
      alt: 'Group cooking class',
      className: 'md:col-span-2 md:row-span-1'
    },
    {
      src: '/close-up-cooking-in-wok-hands-stirring-ingredients.jpg',
      alt: 'Close-up cooking in wok',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: '/thai-cooking-class-students-learning-with-instruct.jpg',
      alt: 'Cooking class with instructor',
      className: 'md:col-span-2 md:row-span-2'
    },
    {
      src: '/people-enjoying-meal-together-at-dining-table.jpg',
      alt: 'People enjoying meal',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: '/students-preparing-ingredients-in-thai-kitchen.jpg',
      alt: 'Preparing ingredients',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: '/group-of-people-cooking-and-laughing-together.jpg',
      alt: 'Group cooking and laughing',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: '/thai-dish-pad-thai-noodles-served-on-plate.jpg',
      alt: 'Thai pad thai dish',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: '/two-people-smiling-at-thai-cooking-class.jpg',
      alt: 'Two people at cooking class',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: '/large-group-enjoying-thai-food-and-drinks-together.jpg',
      alt: 'Large group enjoying food',
      className: 'md:col-span-2 md:row-span-1'
    },
    {
      src: '/close-up-thai-curry-dish-with-fresh-herbs.jpg',
      alt: 'Thai curry dish',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: '/couple-cooking-together-at-thai-cooking-studio.jpg',
      alt: 'Couple cooking together',
      className: 'md:col-span-1 md:row-span-1'
    },
  ]

  return (
    <main className="min-h-screen bg-[#F6EFE7]">
  

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-[#F6EFE7]">
        <div className="max-w-7xl mx-auto">
          <h1 className=" text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Our Story in Pictures
          </h1>
          <p className="text-gray-600 text-lg">
            Where every photo tells a flavor story
          </p>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="px-6 md:px-12 py-12 md:py-20 bg-[#F6EFE7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-max">
            {galleryImages.map((image, index) => (
              <div key={index} className={`overflow-hidden rounded-md bg-gray-100 ${image.className}`}>
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Button */}
      <section className="px-6 md:px-12 py-8 md:py-12 bg-[#F6EFE7] flex justify-center">
        <button className="px-12 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors">
          More
        </button>
      </section>

 
    </main>
  )
}
