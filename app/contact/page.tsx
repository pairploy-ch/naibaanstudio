import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F6EFE7]">
 

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-12 md:py-20 bg-[#F6EFE7]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Left: Text Content */}
          <div>
            <h1 className=" text-4xl md:text-5xl font-bold text-[#919077] mb-6 leading-tight">
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
                0926100542, 0941656352
              </a>
            </div>

            {/* Email */}
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">email</p>
              <a href="mailto:info@naibaanstudio.com" className="text-gray-900 font-semibold hover:text-gray-600 transition-colors underline">
                info@naibaanstudio.com
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
      <section className="px-6 md:px-12 py-12 md:py-16 bg-[#F6EFE7]">
        <div className="max-w-7xl mx-auto">
          <img
            src="/new/about-3.jpg"
            alt="Thai cooking studio interior with warm ambiance"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </section>

 
    </main>
  )
}
