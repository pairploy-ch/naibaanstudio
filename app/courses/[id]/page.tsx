"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "@/lib/supabaseClient";

// --- Types ---
type Menu = {
  id: number;
  name: string;
  cover: string;
  description: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  cover: string;
  date: string;
  price: number;
  learning: string;
  experience: string;
  type_of_course_id: number;
  type_of_course?: {
    type: string;
    price: number; // เพิ่ม
  };
  menu?: Menu[];
};

// --- Data Section ---
// const generateMondayAvailability = () => {
//   const availability: Record<
//     string,
//     Record<string, { available: number; total: number }>
//   > = {};
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const endDate = new Date(today);
//   endDate.setMonth(endDate.getMonth() + 3);

//   let currentDate = new Date(today);
//   currentDate.setDate(currentDate.getDate() + 2);

//   while (currentDate.getDay() !== 1) {
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   while (currentDate <= endDate) {
//     const dateStr = currentDate.toISOString().split("T")[0];
//     const morningAvailable = Math.floor(Math.random() * 11);
//     const afternoonAvailable = Math.floor(Math.random() * 11);

//     availability[dateStr] = {
//       morning: { available: morningAvailable, total: 10 },
//       afternoon: { available: afternoonAvailable, total: 10 },
//     };

//     currentDate.setDate(currentDate.getDate() + 7);
//   }

//   return availability;
// };

// const TIME_SLOTS = [
//   { id: "morning", label: "Morning", time: "09:00 - 12:30" },
//   { id: "afternoon", label: "Afternoon", time: "14:00 - 17:30" },
// ];

export default function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<
    Record<
      string,
      {
        slot_id: number;
        slot_name: string;
        available: number;
        total: number;
        start_time: string;  // เพิ่ม
      end_time: string;    // เพิ่ม
      }[]
    >
  >({});

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // useEffect(() => {
  //   if (!course?.menu || course.menu.length <= 1) return;
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prev) =>
  //       prev === course.menu!.length - 1 ? 0 : prev + 1,
  //     );
  //   }, 3000);
  //   return () => clearInterval(timer);
  // }, [course]);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("weekly_template")
        .select(
          `
    *,
    type_of_course (type, price),
    menu (id, name, cover, description),
    courses (
      id,
      date,
      capacity,
      status,
 time_slot:course_time_slot (
  id,
  slot_name,
  start_time,
  end_time

)

    )
  `,
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching course:", error);
      } else {
        setCourse(data);

        // 🔥 convert courses -> calendar availability
        const availability: Record<
          string,
          {
            slot_id: number;
            slot_name: string;
            available: number;
            total: number;
                start_time: string;  // เพิ่ม
    end_time: string; 
          }[]
        > = {};

        data?.courses?.forEach((c: any) => {
          const dateStr = c.date;

          if (!availability[dateStr]) {
            availability[dateStr] = [];
          }

       availability[dateStr].push({
  slot_id: c.time_slot?.id,
  slot_name: c.time_slot?.slot_name,
  start_time: c.time_slot?.start_time,  // เพิ่ม
  end_time: c.time_slot?.end_time,      // เพิ่ม
  available: c.capacity,
  total: c.capacity,
});
        });

        setAvailability(availability);
      }

      setLoading(false);
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateStr = formatDate(date);
      const dayAvailability = availability[dateStr];
      if (dayAvailability) {
        const allFull = Object.values(dayAvailability).every(
          (slot: any) => slot.available === 0,
        );

        return (
          <div
            className={`text-xs py-1 px-1 mt-1 rounded bg-[#919077] text-white`}
          >
            {allFull ? "Full" : "Available"}
          </div>
        );
      }
    }
    return null;
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minBookingDate = new Date(today);
      minBookingDate.setDate(today.getDate() + 2);

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      if (checkDate <= minBookingDate) {
        return true;
      }

      const dateStr = formatDate(date);
      const dayAvailability = availability[dateStr];
      if (dayAvailability) {
        const allFull = Object.values(dayAvailability).every(
          (slot: any) => slot.available === 0,
        );

        return allFull;
      }
      return true;
    }
    return false;
  };

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EC] flex items-center justify-center">
        <p className="text-black text-xl">Loading...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F5F1EC] flex items-center justify-center">
        <p className="text-black text-xl">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      <div className="container mx-auto px-6 py-8 max-w-[90%]">
        <Link
          href="/courses"
          className="inline-flex items-center text-black hover:opacity-70 transition-opacity mb-8"
        >
          <span className="mr-2">←</span>
          <span className="underline">Back</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-[#919077]">
              {course.title}
            </h1>
            <div className="text-black leading-relaxed space-y-4">
              {course.description
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
            {/* แสดง menu ถ้ามี */}
            {course.menu && course.menu.length > 0 && (
              <div>
                <h2 className="font-bold text-2xl mb-4 text-black">Menus:</h2>
                <ul className="space-y-2">
                  {course.menu.map((item: Menu) => (
                    <li key={item.id} className="flex items-start">
                      <span className="mr-3 mt-1">•</span>
                      <span className="text-black">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* แทนที่ส่วน menu list เดิม */}
            {course.learning && (
              <div>
                <h2 className="font-bold text-2xl mb-4 text-black">
                  In this class, you will learn:
                </h2>
                <ul className="space-y-2">
                  {course.learning
                    .split("\n")
                    .filter(Boolean)
                    .map((point: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 mt-1">•</span>
                        <span className="text-black">{point}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {course.experience && (
              <div>
                <h2 className="font-bold text-2xl mb-4 text-black">
                  What you'll experience:
                </h2>
                <p className="text-black leading-relaxed">
                  {course.experience}
                </p>
              </div>
            )}
          </div>
          <div className="relative w-full overflow-hidden">
            {course.menu && course.menu.length > 0 ? (
              course.menu.map((item: Menu, index: number) => (
                <img
                  key={item.id}
                  src={item.cover || "/placeholder.svg"}
                  alt={item.name}
                  className={`w-full h-auto object-cover transition-opacity duration-500 ${
                    index === currentSlide
                      ? "block opacity-100"
                      : "hidden opacity-0"
                  }`}
                />
              ))
            ) : (
              <img
                src={course.cover || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-auto object-cover"
              />
            )}

            {course.menu && course.menu.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      prev === 0 ? course.menu!.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white w-8 h-8 flex items-center justify-center transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      prev === course.menu!.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white w-8 h-8 flex items-center justify-center transition-colors"
                >
                  →
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {course.menu.map((_: Menu, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
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
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const minDate = new Date(today);
                minDate.setDate(today.getDate() + 2);
                return minDate;
              })()}
              className="border-2 border-black"
            />
          </div>
               {selectedDate && availability[formatDate(selectedDate)] && (
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-xl text-black">
                Select Time Slot:
              </h3>

              {availability[formatDate(selectedDate)].map((slot: any) => {
                const isFull = slot.available === 0;
                const isSelected = selectedSlot?.slot_id === slot.slot_id;

                return (
                  <button
                    key={slot.slot_id}
                    disabled={isFull}
                    onClick={() => setSelectedSlot(slot)}
                    className={`
            w-full border p-4 text-left transition
            ${isSelected ? "bg-[#919077] text-white" : "bg-white"}
            ${isFull ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}
          `}
                  >
                    <div className="flex justify-between">
                      <span>
  {slot.slot_name}
  {slot.start_time && slot.end_time && (
    <span className="ml-2 text-sm font-normal opacity-70">
      ({slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)})
    </span>
  )}
</span>

                      <span>
                        {isFull
                          ? "Full"
                          : `0/${slot.total} seats`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        </div>

        <hr className="border-black mb-16" />

        <div className="mb-16">
          <h2 className="font-bold text-3xl mb-8 text-black">Buy Ticket</h2>
          <div className="bg-white border border-gray-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 border-b border-gray-300 gap-4">
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
                      const dateStr = formatDate(selectedDate);
                      const dayAvailability = availability[dateStr];
                      if (dayAvailability) {
                        const totalAvailable = Object.values(
                          dayAvailability,
                        ).reduce(
                          (sum: number, slot: any) => sum + slot.available,
                          0,
                        );

                        setQuantity(Math.min(totalAvailable, quantity + 1));
                      } else {
                        setQuantity(quantity + 1);
                      }
                    } else {
                      setQuantity(quantity + 1);
                    }
                  }}
                  className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  +
                </button>
                <div className="ml-4 font-bold">
                  ฿{" "}
                  {(
                    (course.type_of_course?.price ?? 0) * quantity
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-black">
                <span className="font-semibold">Quantity:</span> {quantity}
              </div>
              <div className="text-black">
                <span className="font-semibold">Total:</span> ฿{" "}
                {(
                  (course.type_of_course?.price ?? 0) * quantity
                ).toLocaleString()}
              </div>
            </div>

            <div className="p-6 pt-0 flex justify-end">
              <Link
               href={
  selectedDate && selectedSlot
    ? `/checkout?course=${encodeURIComponent(course.title)}&date=${selectedDate.toLocaleDateString("en-GB")}&quantity=${quantity}&price=${course.type_of_course?.price}&courseId=${id}&slotId=${selectedSlot.slot_id}&slotName=${encodeURIComponent(selectedSlot.slot_name)}`
    : "#"
}
className={`w-full md:w-auto text-center bg-[#919077] text-white px-12 py-3 font-medium hover:opacity-80 transition-opacity ${
  !selectedDate || !selectedSlot ? "opacity-50 pointer-events-none" : ""
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
  );
}
