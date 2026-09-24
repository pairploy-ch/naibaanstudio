"use client";

import React from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type GalleryImage = { src: string; alt: string };

// Shown until the admin has uploaded photos via /admin/gallery, and kept as a
// fallback if that table is ever empty.
const fallbackGalleryImages: GalleryImage[] = [
  { src: "/album/two-people-cooking-together.jpg", alt: "Two people cooking together at Nai Baan Studio" },
  { src: "/album/group-cooking-class.jpg", alt: "Group Thai cooking class in session" },
  { src: "/album/close-up-cooking-in-wok.jpg", alt: "Close-up of cooking in a wok" },
  { src: "/album/cooking-class-with-instructor.jpg", alt: "Cooking class with instructor" },
  { src: "/album/people-enjoying-meal.jpg", alt: "People enjoying a Thai meal together" },
  { src: "/album/preparing-ingredients.jpg", alt: "Preparing fresh ingredients for Thai cooking" },
  { src: "/album/group-cooking-and-laughing.jpg", alt: "Group cooking and laughing together" },
  { src: "/album/thai-pad-thai-dish.jpg", alt: "Thai pad thai dish" },
  { src: "/album/two-people-at-cooking-class.jpg", alt: "Two people at the cooking class" },
  { src: "/album/large-group-enjoying-food.jpg", alt: "Large group enjoying Thai food" },
  { src: "/album/two-people-at-cooking-class-2.jpg", alt: "Two people at the cooking class" },
  { src: "/album/large-group-enjoying-food-2.jpg", alt: "Large group enjoying Thai food" },
];

export default function GalleryClient() {
  const [allGalleryImages, setAllGalleryImages] = React.useState<GalleryImage[]>(fallbackGalleryImages);
  const [visibleCount, setVisibleCount] = React.useState(12);
  const [loadedImages, setLoadedImages] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("image_url, title")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load gallery images:", error);
        return;
      }

      if (data && data.length > 0) {
        setAllGalleryImages(
          data.map((img) => ({ src: img.image_url, alt: img.title || "Nai Baan Studio gallery photo" })),
        );
      }
    };

    fetchImages();
  }, []);

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
      <section className="max-w-[90%] px-6 py-12 pt-10">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image.src + index}
                className="relative overflow-hidden bg-gray-100 aspect-square"
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
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-500 hover:scale-105 ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority={index < 4}
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
