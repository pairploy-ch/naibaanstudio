import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'

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
  title: 'Nai Baan - Authentic Thai Cooking Classes in Thailand',
  description:
    'Discover authentic Thai cooking in a cozy home-style studio. Learn traditional Thai recipes, cooking techniques, and cultural insights from expert chefs.',
  keywords: [
    'Thai cooking class',
    'Thailand cooking studio',
    'Thai cuisine',
    'cooking class Bangkok',
    'Thai cooking course',
  ],
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
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
        <Header />
        {children}
      </body>
    </html>
  )
}
