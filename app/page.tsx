"use client";
import { supabase } from "@/lib/supabaseClient";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { CourseHighlights } from "@/components/course-highlights";
import { CTA } from "@/components/cta";
import  Review  from "@/components/review";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      <About />
      <CourseHighlights />
       <Review />
      <CTA />
     
    </main>
  );
}
