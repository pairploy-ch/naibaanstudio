"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useLayoutEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // default true เพื่อให้ button แสดงก่อน

  const isActive = (href: string) => pathname === href;
  const isAdmin = pathname.startsWith("/admin");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      router.push("/admin/login");
      router.refresh();
    }
  };

  const menuItems = isAdmin
    ? [
        { name: "Course", href: "/admin/course" },
        { name: "Customer", href: "/admin/customer" },
        { name: "Menu", href: "/admin/menu" },
        { name: "Booking", href: "/admin/booking" },
        { name: "Dashboard", href: "/admin/dashboard" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Photo Gallery", href: "/gallery" },
        { name: "Courses", href: "/courses" },
        { name: "Contact", href: "/contact" },
      ];

  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 99999, // ✅ เปลี่ยนจาก 50 → สูงกว่า overlay (9998)
          background: "#F6EFE7",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "90%",
            margin: "0 auto",
            padding: "1rem 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href={isAdmin ? "/admin/dashboard" : "/"}
            style={{ display: "flex", alignItems: "center" }}
          >
           <img src="/logo-nb.png" className="w-[100px] md:w-[150px]" alt="Logo" />
          </Link>

          {/* Desktop menu */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: isActive(item.href) ? "#919077" : "#111827",
                    textDecoration: "none",
                  }}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <button
                  onClick={handleLogout}
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#111827",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          )}

          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative", // เพิ่ม
                zIndex: 99999, // ต้องสูงกว่า overlay ที่เป็น 9998
              }}
            >
              {menuOpen ? (
                <X size={28} color="#919077" strokeWidth={2} /> // ✅ เปลี่ยนสีให้ contrast กับพื้นหลัง
              ) : (
                <Menu size={28} color="#111827" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            background: "rgba(246, 239, 231, 0.97)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: isActive(item.href) ? "#919077" : "#1a1a1a",
                textDecoration: isActive(item.href) ? "underline" : "none",
                textUnderlineOffset: "6px",
              }}
            >
              {item.name}
            </Link>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1a1a1a",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </>
  );
}
