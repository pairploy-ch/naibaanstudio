'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const isActive = (href: string) => pathname === href
  const isAdmin = pathname.startsWith('/admin')

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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 9999,
          background: 'none',
        }}
      >
        <div className="max-w-[90%] mx-auto py-4 flex items-center justify-between">
          <Link href={isAdmin ? '/admin/dashboard' : '/'} className="flex items-center gap-2">
            <img src="/logo-nb-wh.png" className="w-[100px] md:w-[150px]" alt="Logo" />
          </Link>

          {/* Desktop menu */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-md transition-colors font-semibold ${
                    isActive(item.href) ? 'text-white' : 'text-white hover:text-white/70'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Hamburger / Close button — mobile only */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                zIndex: 10000,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(0,0,0,0.93)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: isActive(item.href) ? '#ffffff' : 'rgba(255,255,255,0.65)',
                textDecoration: isActive(item.href) ? 'underline' : 'none',
                textUnderlineOffset: '6px',
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}