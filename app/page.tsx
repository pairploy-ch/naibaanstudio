import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { CourseHighlights } from "@/components/course-highlights";
import { CTA } from "@/components/cta";
import  Review  from "@/components/review";
import Faq from "@/components/faq";
import BlogSection from "@/components/blog-section";

export const metadata: Metadata = {
  description:
    "Book an authentic Thai cooking class in Bangkok. Suitable for everyone — no cooking experience required, MSG-free recipes, vegetarian and allergy-friendly options available.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      <About />
      <CourseHighlights />
      <Review />
      <Faq />
      <BlogSection />
      <CTA />

    </main>
  );
}
