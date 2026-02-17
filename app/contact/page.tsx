import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F6EFE7]">

      {/* Hero Section */}
      <section className="bg-[#F6EFE7]">
        <div className="container max-w-[90%] mx-auto px-6 py-12 flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#919077] mb-6 leading-tight">
              Contact us
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Let's connect—<br />ask us anything!
            </p>
          </div>

          {/* Right: Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">tel</p>
              <a href="tel:+66" className="text-gray-900 font-semibold hover:text-gray-600 transition-colors">
                0926100542, 0941656352
              </a>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">email</p>
              <a href="mailto:info@naibaanstudio.com" className="text-gray-900 font-semibold hover:text-gray-600 transition-colors underline">
                info@naibaanstudio.com
              </a>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">location</p>
              <p className="text-gray-900 text-base leading-relaxed">
                2nd floor 230, Nares Road, Si Phraya,<br />
                BangRak, Bangkok 10500, Thailand
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">hours</p>
              <p className="text-gray-900 text-base leading-relaxed">
                Monday – Sunday (close on Wednesday)<br />
                9.00 a.m. - 5.30 p.m.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Image Section */}
      <section className="bg-[#F6EFE7]">
        <div className="container max-w-[90%] mx-auto px-6 py-12">
          <img
            src="/new/bg-contact.jpg"
            alt="Thai cooking studio interior with warm ambiance"
            className="w-full h-auto object-cover "
          />
        </div>
      </section>

    </main>
  )
}