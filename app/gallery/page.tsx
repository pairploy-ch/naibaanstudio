
 "use client"
import Link from 'next/link'
import React from 'react'

export default function GalleryPage() {
  const [visibleCount, setVisibleCount] = React.useState(12)
  
  const allGalleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
      alt: 'Two people cooking together',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c',
      alt: 'Group cooking class',
      className: 'md:col-span-2 md:row-span-1'
    },
    {
      src: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
      alt: 'Close-up cooking in wok',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803',
      alt: 'Cooking class with instructor',
      className: 'md:col-span-2 md:row-span-2'
    },
    {
      src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      alt: 'People enjoying meal',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
      alt: 'Preparing ingredients',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      alt: 'Group cooking and laughing',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
      alt: 'Thai pad thai dish',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
          src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
      alt: 'Two people at cooking class',
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      src: 'https://images.unsplash.com/photo-1529042410759-befb1204b468',
      alt: 'Large group enjoying food',
      className: 'md:col-span-2 md:row-span-1'
    },
    {
      src: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
      alt: 'Thai curry dish',
      className: 'md:col-span-1 md:row-span-1'
    },
    // {
    //    src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
    //   alt: 'Couple cooking together',
    //   className: 'md:col-span-1 md:row-span-1'
    // },
    // {
    //   src: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    //   alt: 'Thai food preparation',
    //   className: 'md:col-span-1 md:row-span-1'
    // },
    // {
    //   src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2',
    //   alt: 'Fresh ingredients',
    //   className: 'md:col-span-1 md:row-span-1'
    // },
    // {
    //   src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    //   alt: 'Cooking process',
    //   className: 'md:col-span-2 md:row-span-1'
    // },
    // {
    //   src: 'https://images.unsplash.com/photo-1516684732162-798a0062be99',
    //   alt: 'Asian cuisine',
    //   className: 'md:col-span-1 md:row-span-1'
    // },
  ]
  
  const galleryImages = allGalleryImages.slice(0, visibleCount)
  
  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, allGalleryImages.length))
  }

  return (
    <main className="min-h-screen bg-[#F6EFE7]">
      {/* Hero Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-[#F6EFE7]">
        <div className="max-w-[90%] mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Our Story in Pictures
          </h1>
          <p className="text-gray-600 text-lg">
            Where every photo tells a flavor story
          </p>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-12 md:py-12 bg-[#F6EFE7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-max">
            {galleryImages.map((image, index) => (
              <div key={index} className={`overflow-hidden bg-gray-100 ${image.className}`}>
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
      {visibleCount < allGalleryImages.length && (
        <section className="px-6 md:px-12 py-8 md:py-12 bg-[#F6EFE7] flex justify-center">
          <button 
            onClick={handleLoadMore}
            className="px-12 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
          >
            More
          </button>
        </section>
      )}
    </main>
  )
}