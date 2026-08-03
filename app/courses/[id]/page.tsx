import type { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import CourseClient from "./CourseClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: course } = await supabase
    .from("weekly_template")
    .select("title, description, cover")
    .eq("id", id)
    .maybeSingle();

  if (!course) {
    return { title: "Course not found" };
  }

  const description = course.description
    ? course.description.slice(0, 160)
    : `Book the ${course.title} Thai cooking class at Nai Baan Studio in Bangkok.`;

  return {
    title: course.title,
    description,
    alternates: { canonical: `/courses/${id}` },
    openGraph: {
      title: `${course.title} | Nai Baan Studio`,
      description,
      type: "website",
      images: course.cover ? [{ url: course.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | Nai Baan Studio`,
      description,
      images: course.cover ? [course.cover] : undefined,
    },
  };
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;
  const { data: course } = await supabase
    .from("weekly_template")
    .select("title, description, cover")
    .eq("id", id)
    .maybeSingle();

  const courseJsonLd = course
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.description,
        provider: {
          "@type": "Organization",
          name: "Nai Baan Studio",
          sameAs: "https://naibaanstudio.com",
        },
        image: course.cover || undefined,
      }
    : null;

  return (
    <>
      {courseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
      )}
      <CourseClient params={params} />
    </>
  );
}
