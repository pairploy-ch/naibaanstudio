"use client";

import React from "react";
import Image from "next/image";

export default function GalleryPage() {
  const [visibleCount, setVisibleCount] = React.useState(12);
  const [loadedImages, setLoadedImages] = React.useState<Set<number>>(new Set());

  const allGalleryImages = [
    { src: "/album/1.jpeg", alt: "Two people cooking together", className: "md:col-span-1 md:row-span-1" },
    { src: "/album/2.jpeg", alt: "Group cooking class", className: "md:col-span-2 md:row-span-1" },
    { src: "/album/3.jpeg", alt: "Close-up cooking in wok", className: "md:col-span-1 md:row-span-1" },
    { src: "/album/4.jpeg", alt: "Cooking class with instructor", className: "md:col-span-2 md:row-span-2" },
    { src: "/album/5.jpeg", alt: "People enjoying meal", className: "md:col-span-1 md:row-span-1" },
    { src: "/album/6.jpeg", alt: "Preparing ingredients", className: "md:col-span-1 md:row-span-1" },
    { src: "/album/7.jpeg", alt: "Group cooking and laughing", className: "md:col-span-1 md:row-span-1" },
    { src: "/album/8.jpeg", alt: "Thai pad thai dish", className: "md:col-span-1 md:row-span-1" },
    { src: "/album/9.jpeg", alt: "Two people at cooking class", className: "md:col-span-1 md:row-span-1" },
    { src: "/album/10.jpeg", alt: "Large group enjoying food", className: "md:col-span-2 md:row-span-1" },
    { src: "/album/11.jpeg", alt: "Thai curry dish", className: "md:col-span-1 md:row-span-1" },
  ];

  const galleryImages = allGalleryImages.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 6, allGalleryImages.length)
    );
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  return (
    <main className="min-h-screen bg-[#F6EFE7]">
      {/* Hero Section */}
      <section className="max-w-[90%] py-6 pt-10">
        <div className="max-w-[90%] mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Our Story in Pictures
          </h1>
          <p className="text-gray-600 text-lg">
            Where every photo tells a flavor story
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-[90%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden bg-gray-100 ${image.className}`}
              >
                {/* Loading Skeleton */}
                {!loadedImages.has(index) && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
                
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className={`object-cover transition-all duration-500 hover:scale-105 ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority={index < 4} // โหลด 4 รูปแรกก่อน
                  quality={85}
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Load More */}
      {visibleCount < allGalleryImages.length && (
        <section className="flex justify-center py-10">
          <button
            onClick={handleLoadMore}
            className="px-12 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
          >
            More
          </button>
        </section>
      )}
    </main>
  );
}