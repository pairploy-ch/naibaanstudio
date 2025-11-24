'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const courseAvailability: Record<string, Record<string, { available: number; total: number }>> = {
  '1': {
    '2025-12-10': { available: 3, total: 10 },
    '2025-12-11': { available: 0, total: 10 },
    '2025-12-17': { available: 5, total: 10 },
    '2025-12-18': { available: 2, total: 10 },
    '2025-12-24': { available: 8, total: 10 },
  },
  '2': {
    '2025-12-16': { available: 2, total: 10 },
    '2025-12-17': { available: 4, total: 10 },
    '2025-12-24': { available: 0, total: 10 },
    '2025-12-25': { available: 6, total: 10 },
  },
  '3': {
    '2025-12-14': { available: 5, total: 10 },
    '2025-12-15': { available: 0, total: 10 },
    '2025-12-21': { available: 3, total: 10 },
    '2025-12-22': { available: 7, total: 10 },
  },
}

const courseData: Record<string, any> = {
  '2': {
    title: 'Mastering Pad Thai',
    image: '/authentic-pad-thai-noodles-on-traditional-thai-cer.jpg',
    description: `Pad Thai is more than just a delicious stir-fried noodle dish—it's a symbol of Thailand's culinary creativity and cultural heritage. Created nearly a century ago during a time of national transformation, Pad Thai was introduced as a unifying dish that celebrated local ingredients, balanced flavors, and the spirit of Thai cooking. Today, it remains one of the most beloved dishes in the world, known for its harmony of sweet, sour, salty, and savory notes.

In this hands-on cooking session, you will learn the authentic method of preparing Pad Thai from scratch. We will guide you through the essential ingredients—from tamarind and palm sugar to dried shrimp, tofu, and fresh prawns—and show you how to balance flavors the Thai way. You'll also get to practice wok skills, sauce preparation, and plating techniques to recreate this classic dish confidently at home.`,
    learningPoints: [
      'The origins and cultural significance of Pad Thai',
      'How to prepare traditional Pad Thai sauce using authentic Thai ingredients',
      'Techniques for stir-frying rice noodles to the perfect texture',
      'How to balance flavors using the Thai "4-flavor principle"',
      'Tips for cooking with a wok like a local',
      'Variations of Pad Thai including vegetarian and prawn versions',
    ],
    experience: `You'll cook in a cozy and friendly studio environment, guided by our local instructor. Whether you're a beginner or a passionate home cook, this class will help you understand what makes Pad Thai truly Thai. By the end, you'll enjoy your own freshly prepared dish—topped with lime, crushed peanuts, and that irresistible aroma only a sizzling wok can create.`,
    price: 3000,
  },
  '1': {
    title: 'Thai Herbs & Spices Cooking Class',
    image: '/sizzling-thai-stir-fry-in-wok-with-vegetables-and-.jpg',
    description: `Discover the aromatic world of Thai herbs and spices in this immersive cooking class. Learn how to identify, prepare, and use essential Thai ingredients like lemongrass, galangal, kaffir lime leaves, and Thai basil to create authentic flavors.`,
    learningPoints: [
      'Identification of essential Thai herbs and spices',
      'Proper preparation and storage techniques',
      'How to make traditional curry pastes from scratch',
      'Balancing aromatic flavors in Thai cuisine',
      'Creating herb-forward dishes like Tom Yum',
    ],
    experience: `Experience the vibrant aromatics of Thai cooking as you work with fresh herbs and spices. Our instructor will guide you through traditional techniques passed down through generations.`,
    price: 2800,
  },
  '3': {
    title: 'Coconut & Curry Cooking Experience',
    image: '/thai-green-curry-in-coconut-bowl.jpg',
    description: `Explore the rich and creamy world of Thai curries featuring coconut milk. Master the art of making green, red, and yellow curries from scratch, learning how to extract coconut cream and balance spice levels.`,
    learningPoints: [
      'Traditional curry paste preparation',
      'Working with fresh and dried coconut',
      'Understanding curry color classifications',
      'Balancing heat and creaminess',
      'Selecting proteins and vegetables for curries',
    ],
    experience: `Cook authentic Thai curries in our traditional kitchen setting. You'll learn the secrets to achieving the perfect consistency and flavor balance that makes Thai curries world-famous.`,
    price: 3200,
  },
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = courseData[params.id] || courseData['2']
  const availability = courseAvailability[params.id] || courseAvailability['2']
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [quantity, setQuantity] = useState(1)

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = formatDate(date)
      const dayAvailability = availability[dateStr]

      if (dayAvailability) {
        const isFull = dayAvailability.available === 0

        return (
          <div
            className={`text-xs py-1 px-1 mt-1 rounded ${
              isFull
                ? 'bg-[#D84040] text-white'
                : 'bg-[#8B7355] text-white'
            }`}
          >
            {isFull ? 'Full' : `${dayAvailability.available} seats`}
          </div>
        )
      }
    }
    return null
  }

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = formatDate(date)
      const dayAvailability = availability[dateStr]
      return dayAvailability ? dayAvailability.available === 0 : true
    }
    return false
  }

  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-black hover:opacity-70 transition-opacity mb-8"
        >
          <span className="mr-2">←</span>
          <span className="underline">Back</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h1 className="font-serif text-5xl font-bold text-black">
              {course.title}
            </h1>

            <div className="text-black leading-relaxed space-y-4">
              {course.description.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div>
              <h2 className="font-bold text-2xl mb-4 text-black">
                In this class, you will learn:
              </h2>
              <ul className="space-y-2">
                {course.learningPoints.map((point: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 mt-1">•</span>
                    <span className="text-black">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-2xl mb-4 text-black">
                What you'll experience:
              </h2>
              <p className="text-black leading-relaxed">{course.experience}</p>
            </div>
          </div>

          <div>
            <img
              src={course.image || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <hr className="border-black mb-16" />

        <div className="mb-16">
          <h2 className="font-bold text-3xl mb-8 text-black">Book a Class:</h2>
          
          <div className="calendar-wrapper">
            <Calendar
              value={selectedDate}
              onChange={(value) => setSelectedDate(value as Date)}
              tileContent={tileContent}
              tileDisabled={tileDisabled}
              minDate={new Date()}
              className="border-2 border-black w-full"
            />
          </div>

          {selectedDate && (
            <div className="mt-6 p-4 bg-white border border-black">
              <p className="font-semibold text-black">
                Selected Date: {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {availability[formatDate(selectedDate)] && (
                <p className="text-black mt-2">
                  Available seats: {availability[formatDate(selectedDate)].available} / {availability[formatDate(selectedDate)].total}
                </p>
              )}
            </div>
          )}
        </div>

        <hr className="border-black mb-16" />

        <div className="mb-16">
          <h2 className="font-bold text-3xl mb-8 text-black">Buy Ticket</h2>

          <div className="bg-white border border-gray-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <div className="font-medium text-black">{course.title} Class</div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="font-bold">{quantity}</span>
                <button 
                  onClick={() => {
                    if (selectedDate) {
                      const maxSeats = availability[formatDate(selectedDate)]?.available || 1
                      setQuantity(Math.min(maxSeats, quantity + 1))
                    } else {
                      setQuantity(quantity + 1)
                    }
                  }}
                  className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  +
                </button>
                <div className="ml-4 font-bold">฿ {(course.price * quantity).toLocaleString()}</div>
              </div>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="text-black">
                <span className="font-semibold">Quantity:</span> {quantity}
              </div>
              <div className="text-black">
                <span className="font-semibold">Total:</span> ฿ {(course.price * quantity).toLocaleString()}
              </div>
            </div>

            <div className="p-6 pt-0 flex justify-end">
              <Link
                href={
                  selectedDate
                    ? `/checkout?course=${encodeURIComponent(course.title)}&date=${selectedDate.toLocaleDateString('en-GB')}&quantity=${quantity}&price=${course.price}&courseId=${params.id}`
                    : '#'
                }
                className={`bg-black text-white px-12 py-3 font-medium hover:opacity-80 transition-opacity ${
                  !selectedDate ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                Checkout Now
              </Link>
            </div>
          </div>
        </div>

        <hr className="border-black mb-16" />
      </div>

      <Footer />
    </div>
  )
}
