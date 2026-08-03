import { Suspense } from 'react'
import type { Metadata } from 'next'
import CoursesClient from './CoursesClient'

export const metadata: Metadata = {
  title: "Thai Cooking Classes",
  description:
    "Browse all Thai cooking classes at Nai Baan Studio in Bangkok. Choose a course, pick a date, and book your seat online.",
  alternates: { canonical: "/courses" },
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-black">Loading courses...</div>}>
      <CoursesClient />
    </Suspense>
  )
}
