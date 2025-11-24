'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  // Utility to check whether the current link is active
  const isActive = (href: string) => pathname === href

  // Determine whether we are inside the admin area
  const isAdmin = pathname.startsWith('/admin')

  // Menu entries based on the current area
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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <div className="max-w-[90%] mx-auto py-4 flex items-center justify-between">
          <Link href={isAdmin ? '/admin/dashboard' : '/'} className="flex items-center gap-2">
            <img src={'/logo-nb.png'} style={{ width: '150px' }} />
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
          </div>
        </div>
      </nav>
    </main>
  )
}
