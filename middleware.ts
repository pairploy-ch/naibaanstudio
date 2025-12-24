import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // ตรวจสอบ Session จาก Cookie
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // --- LOGIC ป้องกัน Redirect Loop ---

  // 1. ถ้ายังไม่ Login และพยายามเข้าหน้า /admin/...
  if (!session && pathname.startsWith('/admin')) {
    // ตรวจสอบว่าไม่ได้อยู่ที่หน้า login อยู่แล้ว (กันเหนียว)
    if (pathname !== '/admin/login') {
      const redirectUrl = new URL('/admin/login', req.url)
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 2. ถ้า Login แล้ว และพยายามเข้าหน้า /login ให้ส่งไปหน้า /admin/dashboard (หรือหน้าหลัก)
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return res
}

// กำหนดขอบเขตการทำงานของ Middleware
export const config = {
  /*
   * Matcher จะดักจับ:
   * 1. ทุก path ที่ขึ้นต้นด้วย /admin/
   * 2. หน้า /login เอง (เพื่อเช็คว่าถ้า login แล้วไม่ต้องเข้าหน้านี้ซ้ำ)
   */
  matcher: ['/admin/:path*', '/login'],
}