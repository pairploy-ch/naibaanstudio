import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
  

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Where authentic Thai flavors and family stories come alive.
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              We're a small, home-style cooking studio built on passion, stories, and flavors passed down through generations.
            </p>
          </div>
          {/* Right: Image */}
          <div>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-HdIMz61XYIDeu9b0DR5P2w2k7cgnP4.jpeg"
              alt="Family cooking together in Thai kitchen"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </div>
      </section>

      {/* Middle Section - Alternating Layout */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left: Image */}
          <div>
            <img
              src="/close-up-cooking-wok-with-ingredients.jpg"
              alt="Cooking in wok with fresh ingredients"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
          {/* Right: Text Content */}
          <div>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed space-y-4">
              <span className="block">Our journey began with the simple belief that food becomes truly meaningful when it carries history—recipes whispered from one generation to the next, techniques perfected at family kitchens, and the warmth that comes from sharing a meal with people you care about.</span>
              
              <span className="block">At our studio, we preserve these timeless Thai recipes and the little secrets that make them special—from the perfect balance of flavors to the traditional methods rarely found in modern kitchens. We don't just teach cooking; we share the heart behind each dish, the stories that shaped it, and the joy of creating something delicious with your own hands.</span>
              
              <span className="block">More than a cooking class, we hope this space becomes a community. A place where travelers and locals can cook together, exchange stories, laugh, experiment, make mistakes, learn again, and feel right at home. A place that's warm, friendly, and full of the comforting chaos of a real Thai kitchen.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="font-serif text-2xl md:text-3xl text-gray-900 leading-relaxed">
            Whether you're here to master classic dishes, explore new tastes, or simply enjoy a heartfelt cooking experience—our doors, our woks, and our stories are open to you.
          </p>
        </div>
      </section>

      {/* Bottom Image Section */}
      <section className="px-6 md:px-12 pb-12 md:pb-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <img
            src="/rustic-thai-studio-interior-wooden-details-dining.jpg"
            alt="Thai cooking studio interior"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>Copyright 2025 thaibahn</p>
        </div>
      </footer>
    </main>
  )
}
