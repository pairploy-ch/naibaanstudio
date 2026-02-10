"use client"
import { useState, use } from "react"
import Link from "next/link"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

// --- Data Section ---
// ฟังก์ชันสร้างข้อมูล availability สำหรับวันจันทร์ล่วงหน้า 3 เดือน
const generateMondayAvailability = () => {
  const availability: Record<string, Record<string, { available: number; total: number }>> = {}
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // คำนวณ 3 เดือนข้างหน้า
  const endDate = new Date(today)
  endDate.setMonth(endDate.getMonth() + 3)
  
  // หาวันจันทร์ถัดไป
  let currentDate = new Date(today)
  currentDate.setDate(currentDate.getDate() + 2) // เริ่มจากล่วงหน้า 2 วัน
  
  // ถ้าไม่ใช่วันจันทร์ ให้หาวันจันทร์ถัดไป
  while (currentDate.getDay() !== 1) {
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // วนลูปสร้างข้อมูลทุกวันจันทร์
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0]
    
    // สุ่มจำนวนที่นั่งว่าง (0-10)
    const morningAvailable = Math.floor(Math.random() * 11)
    const afternoonAvailable = Math.floor(Math.random() * 11)
    
    availability[dateStr] = {
      morning: { available: morningAvailable, total: 10 },
      afternoon: { available: afternoonAvailable, total: 10 },
    }
    
    // ไปวันจันทร์ถัดไป (+7 วัน)
    currentDate.setDate(currentDate.getDate() + 7)
  }
  
  return availability
}

const courseAvailability: Record<string, Record<string, Record<string, { available: number; total: number }>>> = {
  "1": generateMondayAvailability(),
  "2": generateMondayAvailability(),
  "3": generateMondayAvailability(),
}

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "09:00 - 12:30" },
  { id: "afternoon", label: "Afternoon", time: "14:00 - 17:30" },
]

const courseData: Record<string, any> = {
  "1": {
    title: "Pad Thai, Tom Yum Soup, Red Curry & Banana in coconut milk",
    image: "https://www.allthaievent.com/images/event/25453.jpg",
    description: `Experience the essence of Thai cuisine through four iconic dishes that represent the perfect balance of flavors Thailand is famous for. This comprehensive cooking class takes you on a culinary journey from the beloved street food classic Pad Thai, through the aromatic and spicy Tom Yum soup, to the rich and creamy Red Curry, and concludes with a traditional Thai dessert - sweet bananas in warm coconut milk.

Each dish tells a story of Thai culture and showcases different cooking techniques that are fundamental to Thai cuisine. You'll master the art of balancing sweet, sour, salty, and spicy flavors while working with authentic Thai ingredients including tamarind, lemongrass, galangal, kaffir lime leaves, and Thai basil. This hands-on experience will equip you with the skills and confidence to recreate these restaurant-quality dishes in your own kitchen.`,
    learningPoints: [
      "Master the art of stir-frying Pad Thai noodles with traditional sauce and toppings",
      "Create the perfect Tom Yum broth using fresh Thai herbs and aromatic spices",
      "Prepare authentic Red Curry paste and achieve the ideal balance of heat and creaminess",
      "Cook traditional Thai dessert - Bananas in coconut milk with palm sugar",
      "Learn the Thai principle of balancing four essential flavors in every dish",
      "Understand proper preparation and usage of key Thai ingredients like galangal, lemongrass, and kaffir lime leaves",
    ],
    experience: `Join us in our welcoming kitchen studio where you'll cook all four dishes from start to finish under the guidance of our experienced Thai chef. You'll work with fresh ingredients, traditional tools, and authentic techniques. At the end of the class, sit down to enjoy your homemade four-course Thai feast. Whether you're new to Thai cooking or looking to refine your skills, this class offers an immersive and delicious learning experience that celebrates the heart of Thai culinary tradition.`,
    price: 2800,
  },
  "2": {
    title: "Mastering Pad Thai",
    image: "/authentic-pad-thai-noodles-on-traditional-thai-cer.jpg",
    description: `Pad Thai is more than just a delicious stir-fried noodle dish—it's a symbol of Thailand's culinary creativity and cultural heritage. Created nearly a century ago during a time of national transformation, Pad Thai was introduced as a unifying dish that celebrated local ingredients, balanced flavors, and the spirit of Thai cooking. Today, it remains one of the most beloved dishes in the world, known for its harmony of sweet, sour, salty, and savory notes.

In this hands-on cooking session, you will learn the authentic method of preparing Pad Thai from scratch. We will guide you through the essential ingredients—from tamarind and palm sugar to dried shrimp, tofu, and fresh prawns—and show you how to balance flavors the Thai way. You'll also get to practice wok skills, sauce preparation, and plating techniques to recreate this classic dish confidently at home.`,
    learningPoints: [
      "The origins and cultural significance of Pad Thai",
      "How to prepare traditional Pad Thai sauce using authentic Thai ingredients",
      "Techniques for stir-frying rice noodles to the perfect texture",
      'How to balance flavors using the Thai "4-flavor principle"',
      "Tips for cooking with a wok like a local",
      "Variations of Pad Thai including vegetarian and prawn versions",
    ],
    experience: `You'll cook in a cozy and friendly studio environment, guided by our local instructor. Whether you're a beginner or a passionate home cook, this class will help you understand what makes Pad Thai truly Thai. By the end, you'll enjoy your own freshly prepared dish—topped with lime, crushed peanuts, and that irresistible aroma only a sizzling wok can create.`,
    price: 3000,
  },
  "3": {
    title: "Coconut & Curry Cooking Experience",
    image: "/thai-green-curry-in-coconut-bowl.jpg",
    description: `Explore the rich and creamy world of Thai curries featuring coconut milk. Master the art of making green, red, and yellow curries from scratch, learning how to extract coconut cream and balance spice levels.`,
    learningPoints: [
      "Traditional curry paste preparation",
      "Working with fresh and dried coconut",
      "Understanding curry color classifications",
      "Balancing heat and creaminess",
      "Selecting proteins and vegetables for curries",
    ],
    experience: `Cook authentic Thai curries in our traditional kitchen setting. You'll learn the secrets to achieving the perfect consistency and flavor balance that makes Thai curries world-famous.`,
    price: 3200,
  },
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const course = courseData[id] || courseData["2"]
  const availability = courseAvailability[id] || courseAvailability["2"]

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [quantity, setQuantity] = useState(1)

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateStr = formatDate(date)
      const dayAvailability = availability[dateStr]
      if (dayAvailability) {
        const morningFull = dayAvailability.morning?.available === 0
        const afternoonFull = dayAvailability.afternoon?.available === 0
        const bothFull = morningFull && afternoonFull

        return (
          <div
            className={`text-xs py-1 px-1 mt-1 rounded ${
              bothFull ? "bg-[#919077] text-white" : "bg-[#919077] text-white"
            }`}
          >
            {bothFull ? "Full" : "Available"}
          </div>
        )
      }
    }
    return null
  }

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      // คำนวณวันที่ล่วงหน้าอย่างน้อย 2 วัน
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const minBookingDate = new Date(today)
      minBookingDate.setDate(today.getDate() + 2)
      
      // สร้าง date object สำหรับเปรียบเทียบ
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)
      
      // ถ้าวันที่น้อยกว่าหรือเท่ากับวันที่ล่วงหน้า 2 วัน ให้ปิดการจอง
      if (checkDate <= minBookingDate) {
        return true
      }
      
      const dateStr = formatDate(date)
      const dayAvailability = availability[dateStr]
      if (dayAvailability) {
        const morningFull = dayAvailability.morning?.available === 0
        const afternoonFull = dayAvailability.afternoon?.available === 0
        return morningFull && afternoonFull
      }
      return true
    }
    return false
  }

  const handleDateChange = (value: Date) => {
    setSelectedDate(value)
  }

  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      <div className="container mx-auto px-6 py-8 max-w-[90%]">
        <Link href="/" className="inline-flex items-center text-black hover:opacity-70 transition-opacity mb-8">
          <span className="mr-2">←</span>
          <span className="underline">Back</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-[#919077]">{course.title}</h1>
            <div className="text-black leading-relaxed space-y-4">
              {course.description.split("\n\n").map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div>
              <h2 className="font-bold text-2xl mb-4 text-black">In this class, you will learn:</h2>
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
              <h2 className="font-bold text-2xl mb-4 text-black">What you'll experience:</h2>
              <p className="text-black leading-relaxed">{course.experience}</p>
            </div>
          </div>
          <div>
            <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-auto object-cover" />
          </div>
        </div>

        <hr className="border-black mb-16" />

        <div className="mb-16">
          <h2 className="font-bold text-3xl mb-8 text-black">Book a Class:</h2>

          <div className="calendar-wrapper w-full">
            <Calendar
              value={selectedDate}
              onChange={(value) => handleDateChange(value as Date)}
              tileContent={tileContent}
              tileDisabled={tileDisabled}
              minDate={(() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const minDate = new Date(today)
                minDate.setDate(today.getDate() + 2)
                return minDate
              })()}
              className="border-2 border-black"
            />
          </div>


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
                      const dateStr = formatDate(selectedDate)
                      const dayAvailability = availability[dateStr]
                      if (dayAvailability) {
                        const totalAvailable = (dayAvailability.morning?.available || 0) + (dayAvailability.afternoon?.available || 0)
                        setQuantity(Math.min(totalAvailable, quantity + 1))
                      } else {
                        setQuantity(quantity + 1)
                      }
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
                    ? `/checkout?course=${encodeURIComponent(course.title)}&date=${selectedDate.toLocaleDateString("en-GB")}&quantity=${quantity}&price=${course.price}&courseId=${id}`
                    : "#"
                }
                className={`bg-[#919077] text-white px-12 py-3 font-medium hover:opacity-80 transition-opacity ${
                  !selectedDate ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                Checkout Now
              </Link>
            </div>
          </div>
        </div>

        <hr className="border-black mb-16" />
      </div>

      <style jsx global>{`
        .react-calendar {
          width: 100% !important;
          max-width: 100%;
          background: white;
          border: none !important;
          font-family: inherit;
          line-height: 1.125em;
        }

        .react-calendar__tile {
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 10px 6px;
        }

        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 16px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  )
}