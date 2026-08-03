import type { MetadataRoute } from "next";

const siteUrl = "https://naibaanstudio.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/checkout", "/checkout/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
