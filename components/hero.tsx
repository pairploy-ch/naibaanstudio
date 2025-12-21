import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/test-bg.jpg"
          alt="Thai cooking studio interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        <h1 className="text-white text-5xl md:text-8xl font-semibold mb-6 text-balance">
          Experience Thailand Through Its Flavors
        </h1>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-6xl mx-auto text-balance leading-relaxed">
          Discover authentic Thai cooking in a serene, home-style studio. Learn
          traditional recipes, local ingredients, and regional culinary
          techniques from expert Thai chefs.
        </p>
      <a
  href="#courses"
  className="font-semibold inline-flex items-center gap-2 px-8 py-4 text-md text-white border border-white bg-none hover:bg-white hover:text-black transition-colors duration-300"
>
  Book A Class
</a>

      </div>
    </section>
  );
}
