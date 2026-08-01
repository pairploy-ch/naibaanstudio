"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Blog = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  created_at?: string;
};

const FALLBACK_IMAGE = "/placeholder.jpg";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error("Failed to load blog post:", error);
        if (data) setBlog(data as Blog);
        else setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6EFE7] py-16">
        <p className="text-center text-black">Loading...</p>
      </main>
    );
  }

  if (notFound || !blog) {
    return (
      <main className="min-h-screen bg-[#F6EFE7] py-16">
        <div className="container mx-auto px-6 max-w-[90%] text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Post not found</h1>
          <Link href="/blogs" className="underline font-bold text-black">
            Back to blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6EFE7] py-16">
      <article className="container mx-auto px-6 max-w-3xl">
        <Link href="/blogs" className="text-sm font-bold text-black underline underline-offset-4">
          &larr; Back to blog
        </Link>

        <h1 className="text-4xl font-bold text-black mt-6 mb-2">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{formatDate(blog.created_at)}</p>

        <div className="border-2 border-black mb-8 overflow-hidden">
          <img
            src={blog.cover_image || FALLBACK_IMAGE}
            alt={blog.title}
            className="w-full h-auto object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        </div>

        <div className="text-black leading-relaxed whitespace-pre-wrap text-lg">
          {blog.content}
        </div>
      </article>
    </main>
  );
}
