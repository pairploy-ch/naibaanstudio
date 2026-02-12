import { Button } from "@/components/ui/button";
import Link from "next/link";

export function About() {
  return (
    <section className="grid md:grid-cols-2">
      {/* Image - Left side, full height */}
      <div className="relative aspect-square w-full">
        <img
        style={{objectPosition: 'bottom'}}
          src="/new/about.jpg"
          alt="Traditional Thai cooking utensils"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content - Right side with beige background */}
      <div className="bg-[#E8DCD0] flex items-center justify-center px-8 md:px-16 lg:px-24 py-16 md:py-20">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-foreground text-center text-balance">
            A Cozy Studio Sharing Thai Family Recipes
          </h2>

          <div className="space-y-6 text-foreground text-center leading-relaxed text-base md:text-lg">
            <p className="mb-0">
              We're a small, home-style cooking studio passionate about keeping
            </p>
            <p className="mb-0">traditional Thai recipes alive.</p>
            <p className="mb-0">
              Here, you’ll learn the real way Thai families cook—simple,
            </p>
            <p className="mb-0">flavourful, and full of heart.</p>
            <p className="mb-0">
              Whether you’re a traveler or a food lover, we’re here to make Thai
            </p>
            <p className="mb-0">
              cooking feel warm, welcoming, and wonderfully authentic.
            </p>
          </div>

          <div className="flex justify-center mt-10">
            <Link href="/about">
             <button className="font-semibold inline-flex items-center gap-2 px-8 py-4 text-md text-white bg-[#8C8F72] hover:bg-[#363522] transition-colors duration-300">
              Read More
            </button>
            </Link>
           
          </div>
        </div>
      </div>
    </section>
  );
}
