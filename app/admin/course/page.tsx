"use client";
import type React from "react";
import { useMemo, useState } from "react";
import { Clock, Plus, X, Upload, Trash2 } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";

// --- Type Definitions ---
type DayToken = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

interface MenuItem {
  id: string;
  nameEn: string;
  nameTh: string;
  description: string;
  price: number;
  tag: string;
}

interface MenuAssignment {
  id: string;
  menuId: string;
  isMainCourse: boolean;
  isDessert: boolean;
  timeSlot: "morning" | "afternoon" | "custom";
  customStart?: string;
  customEnd?: string;
}

// --- CHANGED ---
interface DaySchedule {
  day: DayToken;
  menus: MenuAssignment[];
  capacity: number;
  price: number;
  courseTitle?: string;
  courseImage?: string;
  courseDescription?: string;
}

interface GeneratedCourse {
  id: string;
  class_date: string;
  session: string;
  start_time: string;
  end_time: string;
  capacity: number;
  price: number;
  detail: string;
  tag?: string;
  courseTitle?: string;
  courseDescription?: string;
  courseImage?: string;
  learningPoints?: string[];
  experienceDescription?: string;
}

type MenuMap = Map<string, MenuItem>;

// --- Constants ---
const DAY_NAMES: Record<DayToken, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const DAY_OFFSETS: Record<DayToken, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

const createId = () => Math.random().toString(36).slice(2, 10);

const createInitialSchedule = (): DaySchedule[] => [
  {
    day: "Mon",
    menus: [
      // Morning
      {
        id: createId(),
        menuId: "Pad Thai",
        isMainCourse: true,
        isDessert: false,
        timeSlot: "morning",
      },
      {
        id: createId(),
        menuId: "TomYum",
        isMainCourse: false,
        isDessert: false,
        timeSlot: "morning",
      },
      {
        id: createId(),
        menuId: "BananaInCoconutMilk",
        isMainCourse: false,
        isDessert: true,
        timeSlot: "morning",
      },
      {
        id: createId(),
        menuId: "RedCurry",
        isMainCourse: false,
        isDessert: false,
        timeSlot: "morning",
      },
      // Afternoon
      {
        id: createId(),
        menuId: "MangoStickyRice",
        isMainCourse: false,
        isDessert: true,
        timeSlot: "afternoon",
      },
      {
        id: createId(),
        menuId: "SoySauceNoodles",
        isMainCourse: true,
        isDessert: false,
        timeSlot: "afternoon",
      },
            {
        id: createId(),
        menuId: "TomKhaGai",
        isMainCourse: false,
        isDessert: false,
        timeSlot: "afternoon",
      },
                  {
        id: createId(),
        menuId: "LarbGai",
        isMainCourse: false,
        isDessert: false,
        timeSlot: "afternoon",
      },
    ],
    capacity: 12,
    price: 1800,
    // --- CHANGED ---
    courseTitle: "Pad Thai, Tom Yum Soup, Red Curry & Banana in coconut milk",
    courseDescription: `Discover the aromatic world of Thai herbs and spices in this immersive cooking class. Learn how to identify, prepare, and use essential Thai ingredients like lemongrass, galangal, kaffir lime leaves, and Thai basil to create authentic flavors.

In this class, you will learn:

• Identification of essential Thai herbs and spices
• Proper preparation and storage techniques
• How to make traditional curry pastes from scratch
• Balancing aromatic flavors in Thai cuisine
• Creating herb-forward dishes like Tom Yum

What you'll experience:

Experience the vibrant aromatics of Thai cooking as you work with fresh herbs and spices. Our instructor will guide you through traditional techniques passed down through generations.`,
    courseImage: "https://www.allthaievent.com/images/event/25453.jpg",
  },
  {
    day: "Tue",
    menus: [],
    capacity: 12,
    price: 1800,
  },
  {
    day: "Wed",
    menus: [],
    capacity: 10,
    price: 1900,
  },
  {
    day: "Thu",
    menus: [],
    capacity: 12,
    price: 1800,
  },
  {
    day: "Fri",
    menus: [],
    capacity: 14,
    price: 1850,
  },
  {
    day: "Sat",
    menus: [],
    capacity: 10,
    price: 2200,
  },
  {
    day: "Sun",
    menus: [],
    capacity: 10,
    price: 1750,
  },
];

const getUpcomingWeeks = (numWeeks = 8) => {
  const weeks: Date[] = [];
  const today = new Date();
  const day = today.getDay();
  const diff = (day + 6) % 7;
  today.setHours(0, 0, 0, 0);
  today.setDate(today.getDate() - diff);

  for (let i = 0; i < numWeeks; i++) {
    const monday = new Date(today);
    monday.setDate(today.getDate() + i * 7);
    weeks.push(monday);
  }
  return weeks;
};

const getDateForDay = (monday: Date, day: DayToken) => {
  const offset = DAY_OFFSETS[day] ?? 0;
  const target = new Date(monday);
  target.setDate(monday.getDate() + offset);
  return target.toISOString().split("T")[0];
};

const buildDetailHTML = (assignments: MenuAssignment[], menuMap: MenuMap) => {
  const mainCourses: string[] = [];
  const desserts: string[] = [];
  const regular: string[] = [];

  assignments.forEach((assignment) => {
    const menu = menuMap.get(assignment.menuId);
    const name = menu?.nameEn || menu?.nameTh || assignment.menuId;
    if (assignment.isMainCourse) mainCourses.push(name);
    if (assignment.isDessert) desserts.push(name);
    if (!assignment.isMainCourse && !assignment.isDessert) regular.push(name);
  });

  const blocks: string[] = [];
  if (mainCourses.length) {
    blocks.push(
      `<strong>Main course</strong><ul>${mainCourses
        .map((n) => `<li>${n}</li>`)
        .join("")}</ul>`
    );
  }
  if (desserts.length) {
    blocks.push(
      `<strong>Dessert</strong><ul>${desserts
        .map((n) => `<li>${n}</li>`)
        .join("")}</ul>`
    );
  }
  if (regular.length) {
    blocks.push(
      `<strong>Other dishes</strong><ul>${regular
        .map((n) => `<li>${n}</li>`)
        .join("")}</ul>`
    );
  }
  return blocks.join("");
};

const formatCourseDate = (dateStr: string) => {
  if (!dateStr) return "Date TBD";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export default function ManageCourses() {
  // --- LOCAL MOCK DATA & HOOK SIMULATION ---
  const requiredMockMenus: MenuItem[] = [
    {
      id: "Massaman",
      nameEn: "Massaman Curry",
      nameTh: "แกงมัสมั่น",
      description: "Rich coconut curry",
      price: 0,
      tag: "",
    },
    {
      id: "Spring Rolls",
      nameEn: "Spring Rolls",
      nameTh: "ปอเปี๊ยะทอด",
      description: "Crispy rolls",
      price: 0,
      tag: "",
    },
    {
      id: "Pad Thai",
      nameEn: "Pad Thai",
      nameTh: "ผัดไทย",
      description: "Stir-fried noodles",
      price: 0,
      tag: "",
    },
    {
      id: "TomYum",
      nameEn: "Tom Yum Soup",
      nameTh: "ต้มยำกุ้ง",
      description: "Spicy and sour soup",
      price: 0,
      tag: "",
    },
    {
      id: "GreenCurry",
      nameEn: "Green Curry",
      nameTh: "แกงเขียวหวาน",
      description: "Sweet green curry",
      price: 0,
      tag: "",
    },
    {
      id: "MangoStickyRice",
      nameEn: "Mango Sticky Rice",
      nameTh: "ข้าวเหนียวมะม่วง",
      description: "Classic Thai dessert",
      price: 0,
      tag: "",
    },
    {
      id: "PadKraPao",
      nameEn: "Pad Kra Pao",
      nameTh: "ผัดกะเพรา",
      description: "Basil stir-fry",
      price: 0,
      tag: "",
    },
    {
      id: "BananaInCoconutMilk",
      nameEn: "Banana in coconut milk",
      nameTh: "กล้วยบวชชี",
      description: "Fried bananas",
      price: 0,
      tag: "",
    },
    {
      id: "CustomNoodle",
      nameEn: "Custom Noodle Dish",
      nameTh: "เมนูเส้นพิเศษ",
      description: "Chef's special noodle",
      price: 0,
      tag: "",
    },
    {
      id: "RedCurry",
      nameEn: "Red Curry",
      nameTh: "พะแนง",
      description: "Spicy red curry",
      price: 0,
      tag: "",
    },
    {
      id: "SoySauceNoodles",
      nameEn: "Stir-fried soy sauce noodles",
      nameTh: "ผัดซีอิ๊ว",
      description: "Spicy red curry",
      price: 0,
      tag: "",
    },
        {
      id: "TomKhaGai",
      nameEn: "Tom Kha Gai",
      nameTh: "ต้มข่าไก่",
      description: "Spicy red curry",
      price: 0,
      tag: "",
    },
            {
      id: "LarbGai",
      nameEn: "Larb Gai",
      nameTh: "ลาบไก่",
      description: "Spicy red curry",
      price: 0,
      tag: "",
    },

    
  ];

  const menus: MenuItem[] = requiredMockMenus;
  const menuMap: MenuMap = useMemo(() => {
    return new Map<string, MenuItem>(menus.map((m) => [m.id, m]));
  }, [menus]);

  const [schedule, setSchedule] = useState<DaySchedule[]>(
    createInitialSchedule
  );
  const [selectedDay, setSelectedDay] = useState<DayToken | null>(null);
  const [numWeeksToShow] = useState(8);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [modalCourses, setModalCourses] = useState<GeneratedCourse[]>([]);

  // --- CHANGED ---
  // Form state for adding menu
  const [newMenuId, setNewMenuId] = useState<string>("");
  const [newIsMainCourse, setNewIsMainCourse] = useState(false);
  const [newIsDessert, setNewIsDessert] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<
    "morning" | "afternoon" | "custom"
  >("morning");
  const [newCustomStart, setNewCustomStart] = useState("09:00");
  const [newCustomEnd, setNewCustomEnd] = useState("12:30");

  const upcomingWeeks = useMemo(
    () => getUpcomingWeeks(numWeeksToShow),
    [numWeeksToShow]
  );

  const generatedCourses = useMemo(() => {
    const courses: GeneratedCourse[] = [];
    upcomingWeeks.forEach((monday) => {
      schedule.forEach((daySchedule) => {
        const classDate = getDateForDay(monday, daySchedule.day);

        // Skip if no course detail title is set
        if (!daySchedule.courseTitle) return; // --- CHANGED ---

        const morningMenus = daySchedule.menus.filter(
          (m) => m.timeSlot === "morning"
        );
        const afternoonMenus = daySchedule.menus.filter(
          (m) => m.timeSlot === "afternoon"
        );
        const customMenus = daySchedule.menus.filter(
          (m) => m.timeSlot === "custom"
        );

        if (morningMenus.length > 0) {
          courses.push({
            id: `${classDate}-morning`,
            class_date: classDate,
            session: `${DAY_NAMES[daySchedule.day]} Morning Class`,
            start_time: "09:00",
            end_time: "12:30",
            capacity: daySchedule.capacity,
            price: daySchedule.price,
            detail: buildDetailHTML(morningMenus, menuMap),
            courseTitle: daySchedule.courseTitle, // --- CHANGED ---
            courseDescription: daySchedule.courseDescription, // --- CHANGED ---
            courseImage: daySchedule.courseImage, // --- CHANGED ---
            // learningPoints and experienceDescription are no longer in DaySchedule
            learningPoints: [], // Default to empty or undefined
            experienceDescription: "", // Default to empty or undefined
          });
        }

        if (afternoonMenus.length > 0) {
          courses.push({
            id: `${classDate}-afternoon`,
            class_date: classDate,
            session: `${DAY_NAMES[daySchedule.day]} Afternoon Class`,
            start_time: "14:00",
            end_time: "17:30",
            capacity: daySchedule.capacity,
            price: daySchedule.price,
            detail: buildDetailHTML(afternoonMenus, menuMap),
            courseTitle: daySchedule.courseTitle, // --- CHANGED ---
            courseDescription: daySchedule.courseDescription, // --- CHANGED ---
            courseImage: daySchedule.courseImage, // --- CHANGED ---
            learningPoints: [],
            experienceDescription: "",
          });
        }

        customMenus.forEach((menu) => {
          const singleMenu = daySchedule.menus.find((m) => m.id === menu.id);
          if (singleMenu) {
            courses.push({
              id: `${classDate}-${menu.id}`,
              class_date: classDate,
              session: `${DAY_NAMES[daySchedule.day]} Custom Time`,
              start_time: menu.customStart || "09:00",
              end_time: menu.customEnd || "12:00",
              capacity: daySchedule.capacity,
              price: daySchedule.price,
              detail: buildDetailHTML([singleMenu], menuMap),
              tag: "Custom",
              courseTitle: daySchedule.courseTitle, // --- CHANGED ---
              courseDescription: daySchedule.courseDescription, // --- CHANGED ---
              courseImage: daySchedule.courseImage, // --- CHANGED ---
              learningPoints: [],
              experienceDescription: "",
            });
          }
        });
      });
    });
    return courses;
  }, [schedule, upcomingWeeks, menuMap]);

  const calendarEvents = useMemo(() => {
    return generatedCourses.map((course) => ({
      id: course.id,
      title: `${course.session} (${course.capacity} ppl, ฿${course.price})`,
      start: `${course.class_date}T${course.start_time}:00`,
      end: `${course.class_date}T${course.end_time}:00`,
      backgroundColor: course.tag === "Custom" ? "#c1513b" : "#8b6f47",
      borderColor: course.tag === "Custom" ? "#c1513b" : "#8b6f47",
      extendedProps: {
        detail: course.detail,
        capacity: course.capacity,
        price: course.price,
        tag: course.tag,
        courseTitle: course.courseTitle,
        courseDescription: course.courseDescription,
        courseImage: course.courseImage,
        learningPoints: course.learningPoints,
        experienceDescription: course.experienceDescription,
      },
    }));
  }, [generatedCourses]);

  const selectedDaySchedule = selectedDay
    ? schedule.find((s) => s.day === selectedDay)
    : null;

  const handleUpdateDaySettings = (
    day: DayToken,
    updates: Partial<DaySchedule>
  ) => {
    setSchedule((prev) =>
      prev.map((s) => (s.day === day ? { ...s, ...updates } : s))
    );
  };

  // --- CHANGED ---
  // Removed handleUpdateCourseDetail as course details are now part of DaySchedule

  const handleAddLearningPoint = () => {
    // This function is no longer needed as learningPoints and experienceDescription are removed from DaySchedule
    // They are now part of the GeneratedCourse which is derived from schedule.
    // If you need to edit them, you'd need to edit the generatedCourses directly or restructure this.
    // For now, it's removed to reflect the schema change.
    console.warn("handleAddLearningPoint is deprecated due to schema change.");
  };

  const handleRemoveLearningPoint = (day: DayToken, index: number) => {
    // This function is no longer needed as learningPoints and experienceDescription are removed from DaySchedule
    console.warn(
      "handleRemoveLearningPoint is deprecated due to schema change."
    );
  };

  // --- CHANGED ---
  const handleImageUpload = (
    day: DayToken,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchedule((prev) =>
          prev.map((s) =>
            s.day === day ? { ...s, courseImage: reader.result as string } : s
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenu = () => {
    if (!selectedDay || !newMenuId) return;
    const newAssignment: MenuAssignment = {
      id: createId(),
      menuId: newMenuId,
      isMainCourse: newIsMainCourse,
      isDessert: newIsDessert,
      timeSlot: newTimeSlot,
      customStart: newTimeSlot === "custom" ? newCustomStart : undefined,
      customEnd: newTimeSlot === "custom" ? newCustomEnd : undefined,
    };
    setSchedule((prev) =>
      prev.map((s) =>
        s.day === selectedDay ? { ...s, menus: [...s.menus, newAssignment] } : s
      )
    );
    // Reset form
    setNewMenuId("");
    setNewIsMainCourse(false);
    setNewIsDessert(false);
    setNewTimeSlot("morning");
  };

  const handleRemoveMenu = (day: DayToken, menuId: string) => {
    setSchedule((prev) =>
      prev.map((s) =>
        s.day === day
          ? { ...s, menus: s.menus.filter((m) => m.id !== menuId) }
          : s
      )
    );
  };

  const sortedMenus = useMemo(() => {
    return [...menus].sort((a, b) =>
      (a.nameEn || a.nameTh).localeCompare(b.nameEn || b.nameTh, "en")
    );
  }, [menus]);

  return (
    <div className=" py-10 bg-[#F6EFE7]">
      <div className="max-w-[90%] mx-auto space-y-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-light" style={{ color: "#3d2817" }}>
              Weekly course template
            </h1>
          </div>
        </header>

        {/* Weekly Overview */}
        <section
          className="bg-white  shadow border"
          style={{ borderColor: "#e5dcd4" }}
        >
          <div
            className="px-6 py-5 border-b"
            style={{ borderColor: "#e5dcd4" }}
          >
            <h2 className="text-2xl font-light" style={{ color: "#3d2817" }}>
              Template Weekly (Mon–Sun)
            </h2>
            <p className="text-sm mt-1" style={{ color: "#7a5f3d" }}>
              This schedule repeats every week · Click on a day to manage the
              course details
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6">
            {schedule.map((daySchedule) => (
              <button
                key={daySchedule.day}
                onClick={() => setSelectedDay(daySchedule.day)}
                className={`p-4  border-2 transition text-left ${
                  selectedDay === daySchedule.day
                    ? "border-[#8b6f47] bg-[#fff7ef]"
                    : "border-[#e5dcd4] hover:border-[#d4c5b5]"
                }`}
              >
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ color: "#8b6f47" }}
                >
                  {daySchedule.day}
                </p>
                <p
                  className="text-lg font-light mt-1"
                  style={{ color: "#3d2817" }}
                >
                  {DAY_NAMES[daySchedule.day]}
                </p>
                <p className="text-xs mt-2" style={{ color: "#b29373" }}>
                  {daySchedule.courseTitle ? "✓ Configured" : "Not set"}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Day Editor */}
        {selectedDay && selectedDaySchedule && (
          <section
            className="bg-white  shadow border"
            style={{ borderColor: "#e5dcd4" }}
          >
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "#e5dcd4" }}
            >
              <div>
                <p
                  className="text-xs uppercase tracking-[0.3em]"
                  style={{ color: "#b29373" }}
                >
                  Manage Menu
                </p>
                <h3
                  className="text-2xl font-light"
                  style={{ color: "#3d2817" }}
                >
                  {DAY_NAMES[selectedDay]}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2  hover:bg-[#f5f1ed]"
              >
                <X size={20} style={{ color: "#8b6f47" }} />
              </button>
            </div>

            {/* Day Settings */}
            <div
              className="px-6 py-4 bg-[#fffdf8] border-b"
              style={{ borderColor: "#e5dcd4" }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    className="text-xs uppercase tracking-wide block mb-1"
                    style={{ color: "#8b6f47" }}
                  >
                    Capacity (people)
                  </label>
                  <input
                    type="number"
                    value={selectedDaySchedule.capacity}
                    onChange={(e) =>
                      handleUpdateDaySettings(selectedDay, {
                        capacity: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full border  px-3 py-2"
                    style={{ borderColor: "#e5dcd4" }}
                    min={0}
                  />
                </div>
                <div>
                  <label
                    className="text-xs uppercase tracking-wide block mb-1"
                    style={{ color: "#8b6f47" }}
                  >
                    Price (฿)
                  </label>
                  <input
                    type="number"
                    value={selectedDaySchedule.price}
                    onChange={(e) =>
                      handleUpdateDaySettings(selectedDay, {
                        price: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full border  px-3 py-2"
                    style={{ borderColor: "#e5dcd4" }}
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* --- CHANGED --- */}
            <div
              className="px-6 py-5 bg-[#fffdf8] border-b"
              style={{ borderColor: "#e5dcd4" }}
            >
              <h4
                className="text-lg font-light mb-4"
                style={{ color: "#3d2817" }}
              >
                Course Detailsกก
              </h4>

              <div className="space-y-4">
                {/* Course Title */}
                <div>
                  <label
                    className="text-xs uppercase tracking-wide block mb-2"
                    style={{ color: "#8b6f47" }}
                  >
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={selectedDaySchedule.courseTitle || ""}
                    onChange={(e) =>
                      handleUpdateDaySettings(selectedDay, {
                        courseTitle: e.target.value,
                      })
                    }
                    placeholder="e.g. Pad Thai, Tom Yum Soup, Red Curry & Banana in coconut milk"
                    className="w-full border  px-4 py-2 text-sm"
                    style={{
                      borderColor: "#e5dcd4",
                      backgroundColor: "#fffdfa",
                    }}
                  />
                </div>

                {/* Course Image */}
                <div>
                  <label
                    className="text-xs uppercase tracking-wide block mb-2"
                    style={{ color: "#8b6f47" }}
                  >
                    Course Image
                  </label>
                  <div className="flex gap-4 items-start">
                    {selectedDaySchedule.courseImage && (
                      <div
                        className="relative w-48 h-32 border  overflow-hidden"
                        style={{ borderColor: "#e5dcd4" }}
                      >
                        <img
                          src={
                            selectedDaySchedule.courseImage ||
                            "/placeholder.svg"
                          }
                          alt="Course preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(selectedDay, e)}
                        className="hidden"
                        id={`image-upload-${selectedDay}`}
                      />
                      <label
                        htmlFor={`image-upload-${selectedDay}`}
                        className="inline-flex items-center gap-2 px-4 py-2  border cursor-pointer hover:bg-[#f5f1ed]"
                        style={{ borderColor: "#e5dcd4" }}
                      >
                        <Upload size={16} style={{ color: "#8b6f47" }} />
                        <span className="text-sm" style={{ color: "#3d2817" }}>
                          Upload Image
                        </span>
                      </label>
                      <p className="text-xs mt-2" style={{ color: "#b29373" }}>
                        Recommended: 1200x800px, JPG or PNG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <div>
                  <label
                    className="text-xs uppercase tracking-wide block mb-2"
                    style={{ color: "#8b6f47" }}
                  >
                    Course Description
                  </label>
                  <textarea
                    value={selectedDaySchedule.courseDescription || ""}
                    onChange={(e) =>
                      handleUpdateDaySettings(selectedDay, {
                        courseDescription: e.target.value,
                      })
                    }
                    placeholder="Describe what students will learn and experience in this cooking class..."
                    rows={6}
                    className="w-full border  px-4 py-3 text-sm resize-none"
                    style={{
                      borderColor: "#e5dcd4",
                      backgroundColor: "#fffdfa",
                    }}
                  />
                </div>

                {selectedDaySchedule.menus.length > 0 && (
                  <div>
                    <label
                      className="text-xs uppercase tracking-wide block mb-2"
                      style={{ color: "#8b6f47" }}
                    >
                      Selected Menu Items
                    </label>
                    <div
                      className="border  p-4 space-y-3"
                      style={{
                        borderColor: "#e5dcd4",
                        backgroundColor: "#fffdfa",
                      }}
                    >
                      {/* Morning Menus */}
                      {selectedDaySchedule.menus.filter(
                        (m) => m.timeSlot === "morning"
                      ).length > 0 && (
                        <div>
                          <h5
                            className="text-sm font-semibold mb-2"
                            style={{ color: "#8b6f47" }}
                          >
                            Morning Session (09:00-12:30)
                          </h5>
                          <ul className="space-y-1 pl-4">
                            {selectedDaySchedule.menus
                              .filter((m) => m.timeSlot === "morning")
                              .map((assignment) => {
                                const menu = menuMap.get(assignment.menuId);
                                const menuName =
                                  menu?.nameEn ||
                                  menu?.nameTh ||
                                  assignment.menuId;
                                return (
                                  <li
                                    key={assignment.id}
                                    className="text-sm flex items-center gap-2"
                                    style={{ color: "#3d2817" }}
                                  >
                                    <span>•</span>
                                    <span>{menuName}</span>
                                    {assignment.isMainCourse && (
                                      <span
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: "#e8f5e9",
                                          color: "#2e7d32",
                                        }}
                                      >
                                        Main
                                      </span>
                                    )}
                                    {assignment.isDessert && (
                                      <span
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: "#fff3e0",
                                          color: "#e65100",
                                        }}
                                      >
                                        Dessert
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      )}

                      {/* Afternoon Menus */}
                      {selectedDaySchedule.menus.filter(
                        (m) => m.timeSlot === "afternoon"
                      ).length > 0 && (
                        <div>
                          <h5
                            className="text-sm font-semibold mb-2"
                            style={{ color: "#8b6f47" }}
                          >
                            Afternoon Session (14:00-17:30)
                          </h5>
                          <ul className="space-y-1 pl-4">
                            {selectedDaySchedule.menus
                              .filter((m) => m.timeSlot === "afternoon")
                              .map((assignment) => {
                                const menu = menuMap.get(assignment.menuId);
                                const menuName =
                                  menu?.nameEn ||
                                  menu?.nameTh ||
                                  assignment.menuId;
                                return (
                                  <li
                                    key={assignment.id}
                                    className="text-sm flex items-center gap-2"
                                    style={{ color: "#3d2817" }}
                                  >
                                    <span>•</span>
                                    <span>{menuName}</span>
                                    {assignment.isMainCourse && (
                                      <span
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: "#e8f5e9",
                                          color: "#2e7d32",
                                        }}
                                      >
                                        Main
                                      </span>
                                    )}
                                    {assignment.isDessert && (
                                      <span
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: "#fff3e0",
                                          color: "#e65100",
                                        }}
                                      >
                                        Dessert
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      )}

                      {/* Custom Time Menus */}
                      {selectedDaySchedule.menus.filter(
                        (m) => m.timeSlot === "custom"
                      ).length > 0 && (
                        <div>
                          <h5
                            className="text-sm font-semibold mb-2"
                            style={{ color: "#8b6f47" }}
                          >
                            Custom Time Slots
                          </h5>
                          <ul className="space-y-1 pl-4">
                            {selectedDaySchedule.menus
                              .filter((m) => m.timeSlot === "custom")
                              .map((assignment) => {
                                const menu = menuMap.get(assignment.menuId);
                                const menuName =
                                  menu?.nameEn ||
                                  menu?.nameTh ||
                                  assignment.menuId;
                                return (
                                  <li
                                    key={assignment.id}
                                    className="text-sm flex items-center gap-2"
                                    style={{ color: "#3d2817" }}
                                  >
                                    <span>•</span>
                                    <span>{menuName}</span>
                                    <span
                                      className="text-xs"
                                      style={{ color: "#8b6f47" }}
                                    >
                                      ({assignment.customStart}-
                                      {assignment.customEnd})
                                    </span>
                                    {assignment.isMainCourse && (
                                      <span
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: "#e8f5e9",
                                          color: "#2e7d32",
                                        }}
                                      >
                                        Main
                                      </span>
                                    )}
                                    {assignment.isDessert && (
                                      <span
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: "#fff3e0",
                                          color: "#e65100",
                                        }}
                                      >
                                        Dessert
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      )}
                    </div>
                    <p className="text-xs mt-2" style={{ color: "#b29373" }}>
                      Use "Add New Menu" below to add more dishes to this course
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Menu Form */}
            <div className="px-6 py-5 space-y-4">
              <h4 className="text-lg font-light" style={{ color: "#3d2817" }}>
                Add New Menu
              </h4>
              <div>
                <label
                  className="text-xs uppercase tracking-wide block mb-2"
                  style={{ color: "#8b6f47" }}
                >
                  Select Menu
                </label>
                <select
                  value={newMenuId}
                  onChange={(e) => setNewMenuId(e.target.value)}
                  className="w-full border  px-4 py-2 text-sm"
                  style={{ borderColor: "#e5dcd4", backgroundColor: "#fffdfa" }}
                >
                  <option value="">Select menu...</option>
                  {sortedMenus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.nameEn || menu.nameTh}
                    </option>
                  ))}
                </select>
                <p className="text-xs mt-2" style={{ color: "#7a5f3d" }}>
                  Need to add a new menu?{" "}
                  <Link
                    href="/admin/menu"
                    className="underline"
                    style={{ color: "#8b6f47" }}
                  >
                    Open Menu Manager
                  </Link>
                </p>
              </div>
              <div>
                <label
                  className="text-xs uppercase tracking-wide block mb-2"
                  style={{ color: "#8b6f47" }}
                >
                  Menu Type
                </label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsMainCourse}
                      onChange={(e) => setNewIsMainCourse(e.target.checked)}
                      className="w-4 h-4 "
                    />
                    <span className="text-sm" style={{ color: "#3d2817" }}>
                      Main Course
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsDessert}
                      onChange={(e) => setNewIsDessert(e.target.checked)}
                      className="w-4 h-4 "
                    />
                    <span className="text-sm" style={{ color: "#3d2817" }}>
                      Dessert
                    </span>
                  </label>
                </div>
                <p className="text-xs mt-2" style={{ color: "#b29373" }}>
                  Standard dish if unchecked
                </p>
              </div>
              <div>
                <label
                  className="text-xs uppercase tracking-wide block mb-2"
                  style={{ color: "#8b6f47" }}
                >
                  Time Slot
                </label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timeSlot"
                      value="morning"
                      checked={newTimeSlot === "morning"}
                      onChange={(e) => setNewTimeSlot(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: "#3d2817" }}>
                      Morning (09:00-12:30)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timeSlot"
                      value="afternoon"
                      checked={newTimeSlot === "afternoon"}
                      onChange={(e) => setNewTimeSlot(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: "#3d2817" }}>
                      Afternoon (14:00-17:30)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="timeSlot"
                      value="custom"
                      checked={newTimeSlot === "custom"}
                      onChange={(e) => setNewTimeSlot(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: "#3d2817" }}>
                      Custom
                    </span>
                  </label>
                </div>
              </div>
              {newTimeSlot === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs uppercase tracking-wide block mb-1"
                      style={{ color: "#8b6f47" }}
                    >
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newCustomStart}
                      onChange={(e) => setNewCustomStart(e.target.value)}
                      className="w-full border  px-3 py-2"
                      style={{ borderColor: "#e5dcd4" }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs uppercase tracking-wide block mb-1"
                      style={{ color: "#8b6f47" }}
                    >
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newCustomEnd}
                      onChange={(e) => setNewCustomEnd(e.target.value)}
                      className="w-full border  px-3 py-2"
                      style={{ borderColor: "#e5dcd4" }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={handleAddMenu}
                disabled={!newMenuId}
                className="inline-flex items-center gap-2 px-5 py-2  text-sm text-white disabled:opacity-50"
                style={{ backgroundColor: "#3d2817" }}
              >
                <Plus size={16} />
                Add Menu
              </button>
            </div>

            {/* Menu List */}
            <div
              className="px-6 py-5 border-t"
              style={{ borderColor: "#e5dcd4" }}
            >
              <h4
                className="text-lg font-light mb-4"
                style={{ color: "#3d2817" }}
              >
                Selected Menus ({selectedDaySchedule.menus.length})
              </h4>
              {selectedDaySchedule.menus.length === 0 ? (
                <p
                  className="text-sm italic text-center py-8"
                  style={{ color: "#b29373" }}
                >
                  No menus selected for this day yet
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDaySchedule.menus.map((assignment) => {
                    const menu = menuMap.get(assignment.menuId);
                    const menuName =
                      menu?.nameEn || menu?.nameTh || assignment.menuId;
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-start justify-between gap-4 p-4  border"
                        style={{
                          borderColor: "#f1e6db",
                          backgroundColor: "#fffdf8",
                        }}
                      >
                        <div className="flex-1">
                          <p
                            className="font-medium"
                            style={{ color: "#3d2817" }}
                          >
                            {menuName}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {assignment.isMainCourse && (
                              <span
                                className="text-xs px-2 py-0.5 "
                                style={{
                                  backgroundColor: "#e8f5e9",
                                  color: "#2e7d32",
                                }}
                              >
                                Main Course
                              </span>
                            )}
                            {assignment.isDessert && (
                              <span
                                className="text-xs px-2 py-0.5 "
                                style={{
                                  backgroundColor: "#fff3e0",
                                  color: "#e65100",
                                }}
                              >
                                Dessert
                              </span>
                            )}
                            {!assignment.isMainCourse &&
                              !assignment.isDessert && (
                                <span
                                  className="text-xs px-2 py-0.5 "
                                  style={{
                                    backgroundColor: "#f5f1ed",
                                    color: "#8b6f47",
                                  }}
                                >
                                  Regular
                                </span>
                              )}
                            <span
                              className="text-xs flex items-center gap-1"
                              style={{ color: "#8b6f47" }}
                            >
                              <Clock size={12} />
                              {assignment.timeSlot === "morning" &&
                                "09:00-12:30"}
                              {assignment.timeSlot === "afternoon" &&
                                "14:00-17:30"}
                              {assignment.timeSlot === "custom" &&
                                `${assignment.customStart}-${assignment.customEnd}`}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveMenu(selectedDay, assignment.id)
                          }
                          className="p-2  hover:bg-[#f3dfd7] transition"
                          style={{ color: "#c1513b" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* FullCalendar View */}
        <section
          className="bg-white  shadow border p-6"
          style={{ borderColor: "#e5dcd4" }}
        >
          <div className="mb-5">
            <h3 className="text-2xl font-light" style={{ color: "#3d2817" }}>
              Upcoming Course Calendar
            </h3>
          </div>
          <div className="fullcalendar-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
              }}
              events={calendarEvents}
              eventClick={(info) => {
                const clickedDate = info.event.startStr.split("T")[0];
                const coursesOnDate = generatedCourses.filter(
                  (c) => c.class_date === clickedDate
                );
                setModalDate(clickedDate);
                setModalCourses(coursesOnDate);
              }}
              height="auto"
              locale="en"
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
              }}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
            />
          </div>
        </section>

        {/* Modal for Course Details */}
        {modalDate && modalCourses.length > 0 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setModalDate(null)}
          >
            <div
              className="bg-white  shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{ borderColor: "#e5dcd4" }}
            >
              <div
                className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between "
                style={{ borderColor: "#e5dcd4" }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: "#b29373" }}
                  >
                    Course details
                  </p>
                  <h3
                    className="text-2xl font-light"
                    style={{ color: "#3d2817" }}
                  >
                    {formatCourseDate(modalDate)}
                  </h3>
                </div>
                <button
                  onClick={() => setModalDate(null)}
                  className="p-2  hover:bg-[#f5f1ed] transition"
                >
                  <X size={24} style={{ color: "#8b6f47" }} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {modalCourses.map((course) => {
                  const daySchedule = schedule.find((s) => {
                    const dayDate = getDateForDay(
                      upcomingWeeks.find((w) => {
                        const checkDate = getDateForDay(w, s.day);
                        return checkDate === course.class_date;
                      }) || upcomingWeeks[0],
                      s.day
                    );
                    return dayDate === course.class_date;
                  });

                  let sessionMenus: MenuAssignment[] = [];
                  let sessionLabel = "";

                  if (daySchedule) {
                    if (course.session.includes("Morning")) {
                      sessionMenus = daySchedule.menus.filter(
                        (m) => m.timeSlot === "morning"
                      );
                      sessionLabel = "Morning Session";
                    } else if (course.session.includes("Afternoon")) {
                      sessionMenus = daySchedule.menus.filter(
                        (m) => m.timeSlot === "afternoon"
                      );
                      sessionLabel = "Afternoon Session";
                    } else if (course.session.includes("Custom")) {
                      sessionMenus = daySchedule.menus.filter(
                        (m) =>
                          m.timeSlot === "custom" && course.id.includes(m.id)
                      );
                      sessionLabel = `Custom Time (${course.start_time} - ${course.end_time})`;
                    }
                  }

                  return (
                    <div
                      key={course.id}
                      className="border  p-6 space-y-6"
                      style={{
                        borderColor: "#f1e6db",
                        backgroundColor: "#fffdf8",
                      }}
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column - Course Info */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4
                              className="text-2xl font-semibold"
                              style={{ color: "#3d2817" }}
                            >
                              {course.courseTitle || course.session}
                            </h4>
                            {course.tag && (
                              <span
                                className="text-xs uppercase tracking-wide px-2 py-1 "
                                style={{
                                  backgroundColor: "#f5d5d5",
                                  color: "#c1513b",
                                }}
                              >
                                {course.tag}
                              </span>
                            )}
                          </div>
                          <div
                            className="flex items-center gap-2 text-sm mb-4"
                            style={{ color: "#8b6f47" }}
                          >
                            <Clock size={16} />
                            <span>
                              {course.start_time} – {course.end_time}
                            </span>
                          </div>

                          {course.courseDescription && (
                            <p
                              className="text-sm mb-4 leading-relaxed whitespace-pre-line"
                              style={{ color: "#7a5f3d" }}
                            >
                              {course.courseDescription}
                            </p>
                          )}

                          <div
                            className="flex gap-6 text-sm pt-4 border-t"
                            style={{ borderColor: "#f1e6db", color: "#7a5f3d" }}
                          >
                            <div>
                              <span
                                className="text-xs uppercase tracking-wide block mb-1"
                                style={{ color: "#b29373" }}
                              >
                                Capacity
                              </span>
                              <span className="font-medium">
                                {course.capacity} people
                              </span>
                            </div>
                            <div>
                              <span
                                className="text-xs uppercase tracking-wide block mb-1"
                                style={{ color: "#b29373" }}
                              >
                                Price
                              </span>
                              <span className="font-medium">
                                ฿{course.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Image */}
                        {course.courseImage && (
                          <div
                            className="border  overflow-hidden h-64 md:h-auto"
                            style={{ borderColor: "#e5dcd4" }}
                          >
                            <img
                              src={course.courseImage || "/placeholder.svg"}
                              alt={course.courseTitle || "Course image"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {sessionMenus.length > 0 && (
                        <div
                          className="pt-4 border-t"
                          style={{ borderColor: "#f1e6db" }}
                        >
                          <h5
                            className="font-semibold mb-3 flex items-center gap-2"
                            style={{ color: "#3d2817" }}
                          >
                            <Clock size={16} style={{ color: "#8b6f47" }} />
                            {sessionLabel}
                          </h5>
                          <div className="space-y-2">
                            {sessionMenus.map((assignment) => {
                              const menu = menuMap.get(assignment.menuId);
                              const menuName =
                                menu?.nameEn ||
                                menu?.nameTh ||
                                assignment.menuId;
                              return (
                                <div
                                  key={assignment.id}
                                  className="flex items-center justify-between gap-3 p-3 border "
                                  style={{
                                    borderColor: "#e5dcd4",
                                    backgroundColor: "#ffffff",
                                  }}
                                >
                                  <div className="flex-1">
                                    <p
                                      className="text-sm font-medium"
                                      style={{ color: "#3d2817" }}
                                    >
                                      {menuName}
                                    </p>
                                    {menu?.description && (
                                      <p
                                        className="text-xs mt-1"
                                        style={{ color: "#b29373" }}
                                      >
                                        {menu.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    {assignment.isMainCourse && (
                                      <span
                                        className="text-xs px-2 py-1 "
                                        style={{
                                          backgroundColor: "#e8f5e9",
                                          color: "#2e7d32",
                                        }}
                                      >
                                        Main Course
                                      </span>
                                    )}
                                    {assignment.isDessert && (
                                      <span
                                        className="text-xs px-2 py-1 "
                                        style={{
                                          backgroundColor: "#fff3e0",
                                          color: "#e65100",
                                        }}
                                      >
                                        Dessert
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div
                className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end "
                style={{ borderColor: "#e5dcd4" }}
              >
                <button
                  onClick={() => setModalDate(null)}
                  className="px-6 py-2  text-sm font-medium text-white"
                  style={{ backgroundColor: "#3d2817" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .fullcalendar-wrapper {
          font-family: inherit;
        }
        .fc {
          --fc-border-color: #e5dcd4;
          --fc-button-bg-color: #3d2817;
          --fc-button-border-color: #3d2817;
          --fc-button-hover-bg-color: #5a4029;
          --fc-button-hover-border-color: #5a4029;
          --fc-button-active-bg-color: #2a1c0f;
          --fc-button-active-border-color: #2a1c0f;
          --fc-today-bg-color: #fff7ef;
        }
        .fc .fc-button {
          text-transform: none;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
        }
        .fc .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 300;
          color: #3d2817;
        }
        .fc .fc-col-header-cell {
          background-color: #fffdf8;
          font-weight: 500;
          color: #8b6f47;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        .fc .fc-daygrid-day-number {
          color: #3d2817;
          padding: 0.5rem;
        }
        .fc .fc-event {
          border-radius: 6px;
          padding: 2px 4px;
          font-size: 0.75rem;
          cursor: pointer;
        }
        .fc .fc-event:hover {
          opacity: 0.85;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
        }
        .prose li {
          margin-top: 0.25rem;
        }
        .prose strong {
          color: #3d2817;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
