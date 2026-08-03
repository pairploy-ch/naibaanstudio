"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Blog = {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at?: string;
};

const FALLBACK_IMAGE = "/placeholder.jpg";

export default function BlogsClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blogs")
      .select("id, title, excerpt, cover_image, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Failed to load blogs:", error);
        if (data) setBlogs(data as Blog[]);
        setLoading(false);
      });
  }, []);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#F6EFE7] py-16">
      <div className="container mx-auto px-6 max-w-[90%]">
        <h1 className="text-5xl font-bold text-black mb-4 text-center">
          Our Blog
        </h1>
        <p className="text-center text-black mb-12 text-lg">
          Recipes, tips, and stories from the kitchen
        </p>

        {loading ? (
          <p className="text-center text-black">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-black">No posts yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="bg-white border-2 border-black flex flex-col hover:-translate-y-1 transition-transform"
              >
                <div className="relative aspect-video overflow-hidden border-b-2 border-black">
                  <Image
                    src={blog.cover_image || FALLBACK_IMAGE}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(blog.created_at)}
                  </p>
                  <h2 className="font-bold text-black text-lg mb-2">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="text-black leading-relaxed line-clamp-3 flex-grow">
                      {blog.excerpt}
                    </p>
                  )}
                  <span className="mt-4 font-bold text-black underline underline-offset-4">
                    Read more
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
