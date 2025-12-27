import { Suspense } from 'react'
import CoursesClient from './CoursesClient'

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-black">Loading courses...</div>}>
      <CoursesClient />
    </Suspense>
  )
}
