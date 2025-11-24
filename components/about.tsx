import { Button } from '@/components/ui/button'

export function About() {
  return (
    <section className="grid md:grid-cols-2">
      {/* Image - Left side, full height */}
      <div className="relative h-[500px] md:h-[700px]">
        <img
          src="/artisan-wooden-cooking-utensils-bowls-on-rustic-wo.jpg"
          alt="Traditional Thai cooking utensils"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content - Right side with beige background */}
      <div className="bg-secondary flex items-center justify-center px-8 md:px-16 lg:px-24 py-16 md:py-20">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-foreground text-center text-balance">
            A Cozy Studio Sharing Thailand's Original Recipes
          </h2>
          
          <div className="space-y-6 text-foreground text-center leading-relaxed text-base md:text-lg">
            <p>
              We're a small, home-style cooking studio passionate about keeping traditional Thai recipes alive.
            </p>
            <p>
              Here, you'll learn the real way Thai families cook—simple, flavorful, and full of heart.
            </p>
            <p>
              Whether you're a traveler or a food lover, we're here to make Thai cooking feel warm, welcoming, and wonderfully authentic.
            </p>
          </div>
          
          <div className="flex justify-center mt-10">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 px-12 py-6 text-base font-medium"
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
