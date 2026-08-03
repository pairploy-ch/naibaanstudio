import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import HeaderSwitcher from "@/components/HeaderSwitcher";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";

/* --- Font Setup --- */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/* --- Metadata --- */
const siteUrl = "https://naibaanstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nai Baan Studio | Thai Cooking Class in Bangkok",
    template: "%s | Nai Baan Studio",
  },
  description:
    "Discover authentic Thai cooking in a serene, home-style studio located in a 100-year-old wooden house in Bangkok. Learn traditional recipes, local ingredients, and Thai cooking techniques from a passionate culinary host — no experience required.",
  keywords: [
    "Thai cooking class",
    "Thailand cooking studio",
    "Thai cuisine",
    "cooking class Bangkok",
    "Thai cooking course",
    "things to do in Thailand",
    "authentic Thai experience",
  ],
  generator: "v0.app",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Nai Baan Studio",
    title: "Nai Baan Studio | Thai Cooking Class in Bangkok",
    description:
      "Discover authentic Thai cooking in a serene, home-style studio located in a 100-year-old wooden house in Bangkok. No cooking experience required.",
    images: [
      {
        url: "/new/thai-cooking-studio-hero-background.jpg",
        width: 1200,
        height: 630,
        alt: "Nai Baan Studio Thai cooking class",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nai Baan Studio | Thai Cooking Class in Bangkok",
    description:
      "Discover authentic Thai cooking in a serene, home-style studio in Bangkok. No cooking experience required.",
    images: ["/new/thai-cooking-studio-hero-background.jpg"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Nai Baan Studio",
  description:
    "Home-style Thai cooking studio in Bangkok offering hands-on Thai cooking classes. No cooking experience required, MSG-free recipes, vegetarian and allergy-friendly options available.",
  url: siteUrl,
  image: `${siteUrl}/new/thai-cooking-studio-hero-background.jpg`,
  telephone: "+66926100542",
  email: "naibaanstudio@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd floor 230, Nares Road, Si Phraya",
    addressLocality: "Bang Rak, Bangkok",
    postalCode: "10500",
    addressCountry: "TH",
  },
  openingHours: "Mo,Tu,Th,Fr,Sa,Su 09:00-18:00",
  priceRange: "$$",
};

/* --- Layout --- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />

        {/* Header แสดงทุกหน้า */}
        <Script
          src="https://cdn.omise.co/omise.js"
          strategy="afterInteractive"
        />

        <HeaderSwitcher />

        {/* Wrapper ซ่อน footer ถ้าเป็น admin */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
