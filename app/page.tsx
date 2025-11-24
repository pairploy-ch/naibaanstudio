"use client";
import { supabase } from "@/lib/supabaseClient";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { CourseHighlights } from "@/components/course-highlights";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      <About />
      <CourseHighlights />
      <CTA />
      <Footer />
    </main>
  );
}
