"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Thursday Full Course Happiness",
    description:
      "Green curry with Chicken, Fried rice with pork/chicken, Papaya salad (Som Tam) and Water Chestnuts in Coconut Milk  (Tub Tim Krob)",
    // date: '9.00 AM - 12.30 PM',
    category: "full-course",
    image: "/album/14.jpg",
  },
  {
    id: 2,
    title: "Friday Full Course Happiness",
    description:
      "Grilled Chicken with Sticky rice, Papaya salad (Som Tam), Larb Gai and Rice ball with taro in coconut milk (Bua Loy))",
    // date: '9.00 AM - 12.30 PM',
    category: "full-course",
    image: "/album/10.jpg",
  },
  {
    id: 3,
    title: "Saturday Short but Long-Lasting",
    description: "Pad Thai and Mango Sticky rice",

    category: "short-course",
    image: "/album/5.jpg",
  },
  {
    id: 4,
    title: "Sunday Short but Long-Lasting",
    description: "Tom Yum and Rice ball with taro in coconut milk (Bua Loy)",

    category: "short-course",
    image: "/album/13.jpg",
  },
  {
    id: 5,
    title: "Monday Veggie Time",
    description:
      "Tom Kha Vegetables, Pad Thai, Fried tofu with tamarind sauce and Water Chestnuts in Coconut Milk  (Tub Tim Krob)",

    category: "vegan",
    image: "/album/15.jpg",
  },
    {
    id: 6,
    title: "Tuesday Zero-Waste Kitchen",
    description:
      "Pad Thai, Tom Yum, Deep fried shrimp with tamarind sauce and Banana in Coconut Milk",
    category: "zero-watse",
    image: "/album/5.jpg",
  },
];

export default function CoursesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isInitialized, setIsInitialized] = useState(false);

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
    if (selectedCategory !== "all") params.set("category", selectedCategory);

    const query = params.toString();
    router.push(query ? `?${query}` : "/courses", {
      scroll: false,
    });
  }, [searchTerm, selectedCategory, isInitialized, router]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-18 bg-[#F6EFE7]" id="courses">
      <div className="container mx-auto px-6 max-w-[90%]">
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-black mb-8">All Courses</h2>

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
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[500px] object-cover"
                />
                <div className="p-2 text-center" style={{ paddingTop: "20px" }}>
                <h3
  className="font-bold text-xl text-black mb-4 leading-none md:leading-normal"
  style={{ height: "30px" }}
>
  {course.title}
</h3>
                  <p className="text-black text-sm opacity-80 mb-4">
                    {course.description}
                  </p>
                  {/* <p className="text-black text-sm mb-4">
                    {course.date}
                  </p> */}
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
