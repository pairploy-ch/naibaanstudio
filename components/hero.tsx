import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative h-[50vh] md:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/new/thai-cooking-studio-hero-background.jpg"
          alt="Thai cooking studio interior"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "bottom" }}
        />

        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto mt-10 md:mt-0">
        <h1 className="text-white text-2xl md:text-8xl font-semibold mb-6 text-balance">
          Experience Thailand Through Its Flavors
        </h1>
        <p className="text-white/90 text-sm md:text-xl mb-8 max-w-6xl mx-auto text-balance leading-[1.2] md:leading-relaxed">
          Discover authentic Thai cooking class nested in a 100-years-old charming wooden house – located right in the middle of Bangkok – just one block away from Silom. Learn traditional family recipes, local ingredients, and Thai cooking techniques from a passionate culinary host.
          <br></br>
          Our classes are suitable for everyone – no cooking experience required.
          All of our recipes are MSG-free. Vegetarian, allergy-friendly options are available upon request.

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
