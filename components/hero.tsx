import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/elegant-thai-restaurant-interior-with-warm-pendant.jpg"
          alt="Thai cooking studio interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

   

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-white font-serif text-5xl md:text-7xl font-bold mb-6 text-balance">
          Experience Thailand Through Its Flavors
        </h1>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
          Discover authentic Thai cooking in a serene, home-style studio. Learn traditional recipes, local ingredients, and regional culinary techniques from expert Thai chefs.
        </p>
        <Button 
          size="lg" 
          variant="outline" 
          className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-primary text-lg px-8"
        >
          Learn More
        </Button>
      </div>
    </section>
  )
}
