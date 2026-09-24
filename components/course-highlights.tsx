'use client'

import Link from 'next/link'

type DayEntry = {
  day: string
  classType: string
  weeklyTemplateId: number
}

const DAYS: DayEntry[] = [
  { day: 'Monday', classType: 'short but long lasting', weeklyTemplateId: 3 },
  { day: 'Tuesday', classType: 'short but long lasting', weeklyTemplateId: 7 },
  { day: 'Thursday', classType: 'full course happiness', weeklyTemplateId: 5 },
  { day: 'Friday', classType: 'short but long lasting', weeklyTemplateId: 6 },
  { day: 'Saturday', classType: 'happiness on street', weeklyTemplateId: 1 },
  { day: 'Sunday', classType: 'sweet your day', weeklyTemplateId: 2 },
]

export function CourseHighlights() {
  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="flex items-start justify-between mb-12">
          <h2 className="text-5xl font-bold text-black">
            All Courses
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map(({ day, classType, weeklyTemplateId }) => (
            <div
              key={day}
              className="border border-black/10 bg-white p-6 text-center"
            >
              <h3 className="font-bold text-lg mb-1 text-black">{day}</h3>
              <p className="text-black text-sm mb-4 opacity-80">{classType}</p>

              <Link
                href={`/courses/${weeklyTemplateId}`}
                className="text-[#919077] text-sm font-medium underline hover:opacity-70 transition-opacity inline-block"
              >
                Book a Class
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-7 text-center" style={{ fontWeight: 600 }}>
          <i>For special event, please contact us directly.</i>
        </div>
      </div>
    </section>
  )
}
