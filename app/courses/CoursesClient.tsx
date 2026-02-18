"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Menu = {
  id: number;
  name: string;
  cover: string;
  description: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  cover: string;
  date: string;
  type_of_course_id: number;
  type_of_course?: {
    type: string;
  };
  menu?: Menu[];
};

export default function CoursesClient() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ fetch supabase (weekly_template + type_of_course + menu)
  useEffect(() => {

    const fetchCourses = async () => {

      const { data, error } = await supabase
        .from("weekly_template")
        .select(`
          *,
          type_of_course(type),
          menu(id,name,cover,description)
        `);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setCourses(data as Course[]);
      }
    };

    fetchCourses();

  }, []);

  // อ่านค่าจาก URL ตอน mount
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";

    setSearchTerm(search);
    setSelectedCategory(category);
    setIsInitialized(true);
  }, [searchParams]);

  // sync state -> URL
  useEffect(() => {

    if (!isInitialized) return;

    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    const query = params.toString();

    router.push(query ? `?${query}` : "/courses", {
      scroll: false,
    });

  }, [searchTerm, selectedCategory, isInitialized, router]);

  // filter courses
  const filteredCourses = courses.filter((course) => {

    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      course.type_of_course?.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">

        <div className="mb-12">
          <h2 className="text-5xl font-bold text-black mb-8">
            All Courses
          </h2>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">

            <div>
              <label className="block text-black font-semibold mb-2">
                Search
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description"
                className="w-full px-4 py-3 border-2 border-black bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-black font-semibold mb-2">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black"
              >
                <option value="all">All Categories</option>
                <option value="full-course">Full Course</option>
                <option value="vegan">Vegan</option>
                <option value="zero-waste">Zero Waste</option>
                <option value="short-course">Short Course</option>
              </select>
            </div>

          </div>

          {(searchTerm || selectedCategory !== "all") && (

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="underline text-black mb-6"
            >
              Clear all filters
            </button>

          )}
        </div>

        {/* Courses */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {filteredCourses.length === 0 ? (

            <p className="col-span-full text-center text-black">
              No courses found.
            </p>

          ) : (

            filteredCourses.map((course) => (

              <div key={course.id}>

                <img
                  src={course.cover}
                  alt={course.title}
                  className="w-full h-[500px] object-cover"
                />

                <div className="p-2 text-center pt-[20px]">

                  <h3 className="font-bold text-xl text-black mb-4">
                    {course.title}
                  </h3>

               <p className="text-black text-sm opacity-80 mb-4">
  {course.menu?.length
    ? course.menu.map(m => m.name).join(", ")
    : ""}
</p>

                

                  <Link
                    href={`/courses/${course.id}`}
                    className="underline text-[#919077]"
                  >
                    Book a Class
                  </Link>

                </div>

              </div>

            ))

          )}

        </div>
      </div>
    </section>
  );
}
