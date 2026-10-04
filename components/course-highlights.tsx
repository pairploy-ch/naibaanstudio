'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type DayEntry = {
  day: string
  weeklyTemplateId: number
}

const DAYS: DayEntry[] = [
  { day: 'Monday', weeklyTemplateId: 3 },
  { day: 'Tuesday', weeklyTemplateId: 7 },
  { day: 'Thursday', weeklyTemplateId: 5 },
  { day: 'Friday', weeklyTemplateId: 6 },
  { day: 'Saturday', weeklyTemplateId: 1 },
  { day: 'Sunday', weeklyTemplateId: 2 },
]

export function CourseHighlights() {
  const [covers, setCovers] = useState<Record<number, string>>({})
  const [classTypes, setClassTypes] = useState<Record<number, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('weekly_template')
        .select('id, cover, type_of_course(name)')
        .in('id', DAYS.map((d) => d.weeklyTemplateId))

      if (error) {
        console.error(error)
        return
      }

      const coverMap: Record<number, string> = {}
      const typeMap: Record<number, string> = {}
      for (const row of (data ?? []) as any[]) {
        if (row.cover) coverMap[row.id] = row.cover
        if (row.type_of_course?.name) typeMap[row.id] = row.type_of_course.name.toLowerCase()
      }
      setCovers(coverMap)
      setClassTypes(typeMap)
    }

    fetchData()
  }, [])

  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="flex items-start justify-between mb-12">
          <h2 className="text-5xl font-bold text-black">
            All Courses
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map(({ day, weeklyTemplateId }) => (
            <div
              key={day}
              className="border border-black/10 bg-white text-center overflow-hidden"
            >
              {covers[weeklyTemplateId] && (
                <div className="relative w-full aspect-square">
                  <img
                    src={covers[weeklyTemplateId]}
                    alt={day}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="font-bold text-lg mb-1 text-black">{day}</h3>
                <p className="text-black text-sm mb-4 opacity-80">{classTypes[weeklyTemplateId]}</p>

                <Link
                  href={`/courses/${weeklyTemplateId}`}
                  className="text-[#919077] text-sm font-medium underline hover:opacity-70 transition-opacity inline-block"
                >
                  Book a Class
                </Link>
              </div>
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
