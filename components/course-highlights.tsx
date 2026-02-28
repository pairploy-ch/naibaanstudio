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

  // ✅ ใส่ type ให้ useState (แก้ error never[])
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
        setCourses(data as Course[]) // ✅ กัน TS error
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id}>

              <div className="relative">
            <div className="relative w-full aspect-[3/4] overflow-hidden ">
  <img
    src={course.cover || "/placeholder.svg"}
    alt={course.name}
    className="w-full h-full object-cover object-center"
  />
</div>
              </div>

              <div className="p-2 text-center pt-[20px]">

                <h3 className="font-bold text-xl mb-2 text-black">
                  {course.name}
                </h3>

                <p className="text-black text-sm mb-3 opacity-80 h-[100px]">
                  {course.description}
                </p>

                <Link
                  href={`/courses?category=${course.type}`}
                  className="text-[#919077] font-medium underline hover:opacity-70 transition-opacity inline-block"
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
