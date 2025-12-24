'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation' // เพิ่ม useRouter
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs' // เพิ่ม Supabase

export default function Header() {
  const pathname = usePathname()
  const router = useRouter() // เรียกใช้งาน router
  const supabase = createClientComponentClient() // เรียกใช้งาน supabase client

  const isActive = (href: string) => pathname === href
  const isAdmin = pathname.startsWith('/admin')

  // --- ฟังก์ชันสำหรับ Logout ---
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error logging out:', error.message)
    } else {
      // เมื่อ Logout สำเร็จ ให้ไปหน้า Login และ refresh เพื่อให้ middleware ทำงาน
      router.push('/admin/login')
      router.refresh()
    }
  }

  const menuItems = isAdmin
    ? [
        { name: 'Course', href: '/admin/course' },
        { name: 'Customer', href: '/admin/customer' },
        { name: 'Menu', href: '/admin/menu' },
        { name: 'Booking', href: '/admin/booking' },
        { name: 'Dashboard', href: '/admin/dashboard' },
      ]
    : [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Photo Gallery', href: '/gallery' },
        { name: 'Courses', href: '/courses' },
        { name: 'Contact', href: '/contact' },
      ]

  return (
    <main>
      <nav className="sticky top-0 z-50 bg-[#F6EFE7]">
        <div className="max-w-[90%] mx-auto py-4 flex items-center justify-between">
          <Link href={isAdmin ? '/admin/dashboard' : '/'} className="flex items-center gap-2">
            <img src={'/logo-nb.png'} style={{ width: '150px' }} alt="Logo" />
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-md transition-colors font-semibold ${
                  isActive(item.href) ? 'text-[#919077]' : 'text-gray-900 hover:text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* --- แสดงปุ่ม Logout เฉพาะตอนอยู่ในหน้า Admin เท่านั้น --- */}
            {isAdmin && (
              <button 
                onClick={handleLogout}
                className="font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </main>
  )
}