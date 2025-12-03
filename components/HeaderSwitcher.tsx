'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import HeaderHome from '@/components/headerHome'

export default function HeaderSwitcher() {
  const pathname = usePathname()


  if (pathname === '/' || pathname === '/checkout') {
    return <HeaderHome />
  }


  return <Header />
}
