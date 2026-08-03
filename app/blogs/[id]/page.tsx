import type { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import BlogPostClient from "./BlogPostClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, excerpt, cover_image")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (!blog) {
    return { title: "Post not found" };
  }

  const description = blog.excerpt || "Read this post on the Nai Baan Studio blog.";

  return {
    title: blog.title,
    description,
    alternates: { canonical: `/blogs/${id}` },
    openGraph: {
      title: blog.title,
      description,
      type: "article",
      images: blog.cover_image ? [{ url: blog.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: blog.cover_image ? [blog.cover_image] : undefined,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostClient params={params} />;
}
