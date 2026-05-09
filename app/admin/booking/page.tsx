'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Loader2, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Participant {
  id: number;
  booking_id: string;
  customer_id: string;
  created_at: string;
  // resolved
  customerName: string;
  customerEmail: string;
}

interface Course {
  id: number;
  date: string;
  capacity: number;
  status: string;
  time_slot_id: number;
  weekly_template_id: number;
  created_at: string;
  // resolved
  templateTitle: string;
  slotName: string;
  slotStart: string;
  slotEnd: string;
  participants: Participant[];
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface WeeklyTemplate {
  id: number;
  title: string;
}

interface CourseTimeSlot {
  id: number;
  slot_name: string;
  start_time: string;
  end_time: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  active:    { bg: '#edf7ed', color: '#2e7d32', label: 'Active' },
  cancelled: { bg: '#fde8e4', color: '#c1513b', label: 'Cancelled' },
  completed: { bg: '#f0f4ff', color: '#3a5bc7', label: 'Completed' },
  full:      { bg: '#fff8e1', color: '#b07d00', label: 'Full' },
};

function getStatus(s: string) {
  return statusColors[s?.toLowerCase()] ?? { bg: '#f3f0ec', color: '#8b6f47', label: s ?? '-' };
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatTime(t: string) {
  if (!t) return '-';
  return t.slice(0, 5); // "HH:MM"
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ManageCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);

      // 1. ดึง course_participants ทั้งหมด
      const { data: participants, error: pErr } = await supabase
        .from('course_participants')
        .select('id, course_id, booking_id, customer_id, created_at');
      if (pErr) throw pErr;

      // 2. หา course_id ที่ไม่ซ้ำ (เฉพาะคอร์สที่มีคนจอง)
      const courseIds = [...new Set((participants || []).map((p) => p.course_id))];
      if (courseIds.length === 0) { setCourses([]); return; }

      // 3. ดึงทุก table พร้อมกันด้วย Promise.all
      const [
        { data: courseData,   error: cErr  },
        { data: templateData, error: tErr  },
        { data: slotData,     error: sErr  },
        { data: customerData, error: cuErr },
      ] = await Promise.all([
        supabase.from('courses').select('*').in('id', courseIds).order('date', { ascending: false }),
        supabase.from('weekly_template').select('id, title'),
        supabase.from('course_time_slot').select('id, slot_name, start_time, end_time'),
        supabase.from('customers').select('id, first_name, last_name, email'),
      ]);

      if (cErr)  throw cErr;
      if (tErr)  throw tErr;
      if (sErr)  throw sErr;
      if (cuErr) throw cuErr;

      // 4. สร้าง Lookup Maps
      const templateMap = new Map<number, WeeklyTemplate>(
        (templateData || []).map((t) => [t.id, t])
      );
      const slotMap = new Map<number, CourseTimeSlot>(
        (slotData || []).map((s) => [s.id, s])
      );
      const customerMap = new Map<string, Customer>(
        (customerData || []).map((c) => [c.id, c])
      );

      // 5. Assemble courses พร้อม resolved fields
      const mapped: Course[] = (courseData || []).map((c) => {
        const template = templateMap.get(c.weekly_template_id);
        const slot     = slotMap.get(c.time_slot_id);

        const courseParticipants: Participant[] = (participants || [])
          .filter((p) => p.course_id === c.id)
          .map((p) => {
            const customer = customerMap.get(p.customer_id);
            return {
              id:            p.id,
              booking_id:    p.booking_id,
              customer_id:   p.customer_id,
              created_at:    p.created_at,
              customerName:  customer
                ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
                : `ID: ${p.customer_id.slice(0, 8)}…`,
              customerEmail: customer?.email ?? '-',
            };
          });

        return {
          id:                 c.id,
          date:               c.date,
          capacity:           c.capacity,
          status:             c.status,
          time_slot_id:       c.time_slot_id,
          weekly_template_id: c.weekly_template_id,
          created_at:         c.created_at,
          templateTitle:      template?.title ?? `Template #${c.weekly_template_id}`,
          slotName:           slot?.slot_name ?? `Slot #${c.time_slot_id}`,
          slotStart:          slot?.start_time ?? '',
          slotEnd:            slot?.end_time ?? '',
          participants:       courseParticipants,
        };
      });

      setCourses(mapped);
    } catch (err) {
      console.error('Error fetching courses:', err);
      alert('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ─── Filter & Pagination ────────────────────────────────────────────────

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      [String(c.id), c.date, c.status, c.templateTitle, c.slotName]
        .join(' ').toLowerCase().includes(q)
    );
  }, [courses, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const paginated  = filteredCourses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem  = filteredCourses.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem    = Math.min(page * ITEMS_PER_PAGE, filteredCourses.length);

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { setPage((p) => Math.min(p, totalPages)); }, [totalPages]);

  const pageNumbers = useMemo(() => {
    const buttons: number[] = [];
    const max = 5;
    let start = Math.max(1, page - 2);
    let end   = Math.min(totalPages, start + max - 1);
    start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) buttons.push(i);
    return buttons;
  }, [page, totalPages]);

  const toggleExpand = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen py-10 bg-[#F6EFE7]">
      <div className="max-w-[90%] mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-light" style={{ color: '#3d2817' }}>
              Bookings
            </h1>
            {/* <p className="text-sm mt-1" style={{ color: '#8b6f47' }}>
              Showing only courses that have at least one participant
            </p> */}
          </div>
        </header>

        {/* Table Card */}
        <section className="bg-white shadow border" style={{ borderColor: '#e5dcd4' }}>

          {/* Search */}
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #f1e6db' }}>
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by date, course title, slot..."
                className="w-full border pl-9 pr-4 py-2 text-sm"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa' }}
              />
            </div>
          </div>

          <div className="pb-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin" style={{ color: '#3d2817' }} />
              </div>
            ) : (
              <div className="overflow-x-auto border" style={{ borderColor: '#f1e6db' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: '#f9f5f0', color: '#8b6f47' }}>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">ID</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Date</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Course</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Time Slot</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Capacity</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Participants</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Status</th>
                      <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Details</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginated.map((course) => {
                      const st         = getStatus(course.status);
                      const isExpanded = expandedId === course.id;
                      const filled     = course.participants.length;
                      const pct        = course.capacity > 0
                        ? Math.round((filled / course.capacity) * 100)
                        : 0;

                      return (
                        <React.Fragment key={course.id}>

                          {/* ── Course Row ── */}
                          <tr className="border-t" style={{ borderColor: '#f1e6db' }}>

                            {/* ID */}
                            <td className="px-4 py-3 align-middle">
                              <span className="font-mono text-xs px-2 py-1"
                                style={{ backgroundColor: '#f3ede6', color: '#3d2817' }}>
                                #{course.id}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-3 align-middle font-medium whitespace-nowrap"
                              style={{ color: '#3d2817' }}>
                              {formatDate(course.date)}
                            </td>

                            {/* Course Title from weekly_template */}
                            <td className="px-4 py-3 align-middle">
                              <p className="font-medium" style={{ color: '#3d2817' }}>
                                {course.templateTitle}
                              </p>
                            </td>

                            {/* Time Slot from course_time_slot */}
                            <td className="px-4 py-3 align-middle">
                              <p className="font-medium text-xs" style={{ color: '#3d2817' }}>
                                {course.slotName}
                              </p>
                              {course.slotStart && (
                                <p className="text-xs mt-0.5" style={{ color: '#b29373' }}>
                                  {formatTime(course.slotStart)} – {formatTime(course.slotEnd)}
                                </p>
                              )}
                            </td>

                            {/* Capacity + Progress Bar */}
                            <td className="px-4 py-3 align-middle">
                              <div className="flex flex-col gap-1 min-w-[80px]">
                                <span className="text-xs" style={{ color: '#7a5f3d' }}>
                                  {filled} / {course.capacity}
                                </span>
                                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#f1e6db' }}>
                                  <div
                                    className="h-1.5 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(pct, 100)}%`,
                                      backgroundColor: pct >= 100 ? '#c1513b' : pct >= 70 ? '#b07d00' : '#3d2817',
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Participants Count */}
                            <td className="px-4 py-3 align-middle">
                              <div className="inline-flex items-center gap-1.5 px-2 py-1"
                                style={{ backgroundColor: '#f3ede6' }}>
                                <Users size={13} style={{ color: '#8b6f47' }} />
                                <span className="text-xs font-medium" style={{ color: '#3d2817' }}>
                                  {filled}
                                </span>
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="px-4 py-3 align-middle">
                              <span className="text-xs px-2 py-1 font-medium"
                                style={{ backgroundColor: st.bg, color: st.color }}>
                                {st.label}
                              </span>
                            </td>

                            {/* Expand Button */}
                            <td className="px-4 py-3 text-right align-middle">
                              <button
                                onClick={() => toggleExpand(course.id)}
                                className="p-2 border hover:bg-[#f5f1ed] inline-flex items-center gap-1 text-xs"
                                style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                              >
                                {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                {isExpanded ? 'Hide' : 'View'}
                              </button>
                            </td>
                          </tr>

                          {/* ── Expanded: Participant List ── */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={8} className="px-6 py-4"
                                style={{ backgroundColor: '#faf6f2' }}>
                                <p className="text-xs uppercase tracking-widest mb-3"
                                  style={{ color: '#8b6f47' }}>
                                  Participants ({course.participants.length})
                                </p>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr style={{ color: '#b29373' }}>
                                        <th className="text-left pb-2 pr-6 font-medium uppercase tracking-wide">#</th>
                                        <th className="text-left pb-2 pr-6 font-medium uppercase tracking-wide">Name</th>
                                        <th className="text-left pb-2 pr-6 font-medium uppercase tracking-wide">Email</th>
                                        <th className="text-left pb-2 pr-6 font-medium uppercase tracking-wide">Booking ID</th>
                                        <th className="text-left pb-2 font-medium uppercase tracking-wide">Registered At</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {course.participants.map((p, idx) => (
                                        <tr key={p.id} className="border-t" style={{ borderColor: '#f1e6db' }}>
                                          <td className="py-2 pr-6" style={{ color: '#8b6f47' }}>
                                            {idx + 1}
                                          </td>
                                          <td className="py-2 pr-6 font-medium" style={{ color: '#3d2817' }}>
                                            {p.customerName}
                                          </td>
                                          <td className="py-2 pr-6" style={{ color: '#7a5f3d' }}>
                                            {p.customerEmail}
                                          </td>
                                          <td className="py-2 pr-6 font-mono" style={{ color: '#7a5f3d' }}>
                                            {p.booking_id}
                                          </td>
                                          <td className="py-2" style={{ color: '#7a5f3d' }}>
                                            {p.created_at
                                              ? new Date(p.created_at).toLocaleString('en-GB', {
                                                  day: '2-digit', month: 'short', year: 'numeric',
                                                  hour: '2-digit', minute: '2-digit',
                                                })
                                              : '-'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}

                    {filteredCourses.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-sm"
                          style={{ color: '#8b6f47' }}>
                          No courses with bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs mt-4 px-4"
              style={{ color: '#8b6f47' }}>
              <p>
                {filteredCourses.length > 0
                  ? `Showing ${startItem}–${endItem} of ${filteredCourses.length}`
                  : 'No matching courses'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border text-xs"
                  style={{ borderColor: '#f1e6db', color: page === 1 ? '#d3c5b6' : '#b6a188' }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >‹</button>
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className="px-3 py-1 border text-xs"
                    style={{
                      borderColor:     num === page ? '#3d2817' : '#f1e6db',
                      backgroundColor: num === page ? '#3d2817' : '#fff',
                      color:           num === page ? '#fff'    : '#3d2817',
                    }}
                  >{num}</button>
                ))}
                <button
                  className="px-3 py-1 border text-xs"
                  style={{ borderColor: '#f1e6db', color: page === totalPages ? '#d3c5b6' : '#b6a188' }}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >›</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}