import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white font-serif text-sm font-bold">TF</span>
            </div>
            <span className="font-serif text-sm font-semibold text-gray-900">Thai Bahn</span>
          </Link>
          <div className="hidden md:flex items-center gap-12">
            <Link href="/" className="text-gray-900 hover:text-gray-600 transition-colors text-sm">
              Home
            </Link>
            <Link href="/about" className="text-gray-900 hover:text-gray-600 transition-colors text-sm">
              About
            </Link>
            <Link href="#gallery" className="text-gray-900 hover:text-gray-600 transition-colors text-sm">
              Photo Gallery
            </Link>
            <Link href="#courses" className="text-gray-900 hover:text-gray-600 transition-colors text-sm">
              Courses
            </Link>
            <Link href="/contact" className="text-gray-900 font-semibold transition-colors text-sm">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Left: Text Content */}
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Contact us
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Let's connect—<br />ask us anything!
            </p>
          </div>

          {/* Right: Contact Information */}
          <div className="grid grid-cols-2 gap-8">
            {/* Tel */}
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">tel</p>
              <a href="tel:+66" className="text-gray-900 font-semibold hover:text-gray-600 transition-colors">
                +66 xxx xxxx
              </a>
            </div>

            {/* Email */}
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">email</p>
              <a href="mailto:doubleh.feb@gmail.com" className="text-gray-900 font-semibold hover:text-gray-600 transition-colors underline">
                doubleh.feb@gmail.com
              </a>
            </div>

            {/* Location */}
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">location</p>
              <p className="text-gray-900 text-base leading-relaxed">
                230, Nares Road, Si Phraya,<br />
                BangRak, Bangkok 10500, Thailand
              </p>
            </div>

            {/* Hours */}
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">hours</p>
              <p className="text-gray-900 text-base leading-relaxed">
                Monday - Sunday<br />
                5:00 pm - 10:00 pm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Image Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <img
            src="/rustic-thai-studio-interior-wooden-details-dining.jpg"
            alt="Thai cooking studio interior with warm ambiance"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8449999999996!2d100.51851!3d13.638889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29948b8b8b8b8!2s230%20Nares%20Rd%2C%20Si%20Phraya%2C%20Bang%20Rak%2C%20Bangkok%2010500!5e0!3m2!1sen!2sth!4v1234567890"
            width="100%"
            height="500"
            style={{ border: 0 }}
            
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-md"
          ></iframe>
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
