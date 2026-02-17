import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import HeaderSwitcher from '@/components/HeaderSwitcher'
import LayoutWrapper from '@/components/LayoutWrapper'

/* --- Font Setup --- */
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

/* --- Metadata --- */
export const metadata: Metadata = {
  title: 'Nai Baan Studio',
  description:
    'Discover authentic Thai cooking in a serene, home-style studio located in the ancient wooden house. Learn traditional recipes, local ingredients, and Thai cooking techniques from a passionate culinary host.',
  keywords: [
    'Thai cooking class',
    'Thailand cooking studio',
    'Thai cuisine',
    'cooking class Bangkok',
    'Thai cooking course',
  ],
  generator: 'v0.app',
  icons: {
    icon: '/logo-nb.png',  // ✅ เปลี่ยนตรงนี้
    apple: '/logo-nb.png',
  },
}

/* --- Layout --- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {/* Header แสดงทุกหน้า */}
        <HeaderSwitcher />

        {/* Wrapper ซ่อน footer ถ้าเป็น admin */}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
