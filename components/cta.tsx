import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="relative h-96 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/traditional-copper-thai-cooking-pots-and-pans-on-w.jpg"
          alt="Thai cooking pots"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <h2 className="text-white font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">
          Have questions or thinking about joining a class?
        </h2>
        <p className="text-white/90 text-xl mb-6">Just let us know.</p>
        <Button 
          size="lg" 
          variant="outline" 
          className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-primary"
        >
          Contact Us
        </Button>
      </div>
    </section>
  )
}
