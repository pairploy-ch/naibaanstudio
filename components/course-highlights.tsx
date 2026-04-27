'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// 👉 กำหนด type ของ table
type Course = {
  id: number
  name: string
  description: string
  cover: string
  type: string
}

export function CourseHighlights() {

  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {

    const fetchCourses = async () => {

      const { data, error } = await supabase
        .from('type_of_course')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error(error)
        return
      }

      if (data) {
        setCourses(data as Course[])
      }
    }

    fetchCourses()

  }, [])

  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="flex items-start justify-between mb-12">
          <h2 className="text-5xl font-bold text-black">
            All Courses
          </h2>
        </div>

        {/* ✅ ปรับเป็น 5 columns + ลด gap */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {courses.map((course) => (
            <div key={course.id}>

              <div className="relative">
                {/* ✅ ปรับ aspect ratio ให้ไม่สูงเกิน */}
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <img
                    src={course.cover || "/placeholder.svg"}
                    alt={course.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* ✅ ลด padding + font size */}
              <div className="p-1 text-center pt-3">

                <h3 className="font-bold text-lg mb-1 text-black">
                  {course.name}
                </h3>

                {/* ✅ จำกัดความสูง + ใช้ line clamp */}
                <p className="text-black text-xs mb-2 opacity-80">
                  {course.description}
                </p>

                <Link
                  href={`/courses?category=${course.type}`}
                  className="text-[#919077] text-sm font-medium underline hover:opacity-70 transition-opacity inline-block"
                >
                  Book a Class
                </Link>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
