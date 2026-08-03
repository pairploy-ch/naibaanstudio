import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabaseClient";

const siteUrl = "https://naibaanstudio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/courses",
    "/gallery",
    "/blogs",
    "/contact",
    "/policy",
    "/terms",
    "/refund",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [{ data: courses }, { data: blogs }] = await Promise.all([
    supabase.from("weekly_template").select("id"),
    supabase.from("blogs").select("id, updated_at").eq("is_active", true),
  ]);

  const courseRoutes: MetadataRoute.Sitemap = (courses ?? []).map((c) => ({
    url: `${siteUrl}/courses/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (blogs ?? []).map((b) => ({
    url: `${siteUrl}/blogs/${b.id}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
