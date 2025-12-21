import { Button } from '@/components/ui/button'
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/mock-cta.jpg"
          alt="Thai cooking pots"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 text-balance">
          Have questions or thinking about joining a class? <br /> Just let us know
        </h2>
      <Link href="/contact">
         <button className="mt-4 font-semibold inline-flex items-center gap-2 px-8 py-4 text-md text-white border border-white bg-none hover:bg-white hover:text-black transition-colors duration-300">
          Contact
        </button>
      </Link>
       
      </div>
    </section>
  )
}
