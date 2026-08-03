import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Recipes, tips, and stories from the kitchen at Nai Baan Studio — a home-style Thai cooking studio in Bangkok.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  return <BlogsClient />;
}
