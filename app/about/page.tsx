import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6EFE7]">
  

      {/* Hero Section */}
      <section className=" py-12 md:py-16 bg-[#F6EFE7]">
        <div className=" mx-auto grid md:grid-cols-2 items-center">
          {/* Left: Text Content */}
          <div className="max-w-2xl mx-auto">
            <h1 className=" text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Where authentic Thai flavors and family stories come alive.
            </h1>
            <p className="text-gray-700 text-base md:text-xl leading-relaxed mt-[50px]">
              We're a small, home-style cooking studio built on passion, stories, and flavors passed down through generations.
            </p>
          </div>
          {/* Right: Image */}
          <div>
       <img
  src="/new/about-1.jpg"
  alt="Family cooking together in Thai kitchen"
  className="w-full aspect-square object-cover"
/>

          </div>
        </div>
      </section>

      {/* Middle Section - Alternating Layout */}
      <section className=" py-12 md:py-16">
        <div className="mx-auto grid md:grid-cols-2 items-center">
          {/* Left: Image */}
          <div style={{width: '90%'}}>
            <img
              src="/new/about-2.jpg"
              alt="Cooking in wok with fresh ingredients"
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Right: Text Content */}
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 text-base md:text-xl leading-relaxed space-y-4">
              <span className="block">Naibaan Studio is a home of simple, yet tasteful Thai home cook recipe - this little secret is now passing
down to the 3rd generation of the family. Now it's time to undisclosed our FAMILY RECIPE to the world -
to those who are passionate in Thai foods, to those who want to learn Thai culture and way of cooking.</span>
              
              <span className="block mt-10">At Naibaan Studio, we aim to be more than just a cooking school but be a gathering spot of ones who
are passionate in Thai foods. No worries if you don't have any experiences in cooking, only bring your
passion along. We always be very happy to invite you to come to our HOME at Naibaan Studio - a place
where we share our MOMENT together.</span>
              
      
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className=" py-12 md:py-16  text-center">
        <div className="max-w-3xl mx-auto">
          <p className=" text-2xl md:text-3xl text-gray-900 leading-relaxed">
            Whether you're here to master classic dishes, explore new tastes, or simply enjoy a heartfelt cooking experience—our doors, our woks, and our stories are open to you.
          </p>
        </div>
      </section>

      {/* Bottom Image Section */}
      <section className="pb-12 md:pb-16">
        <div className="max-w-[90%] mx-auto">
          <img
            src="/new/about-3.jpg"
            alt="Thai cooking studio interior"
            className="w-full object-cover"
            style={{height: '800px'}}
          />
        </div>
      </section>

   
    </main>
  )
}
