'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Trash2, Search, Calendar, Clock, Hash } from 'lucide-react';

// --- Type Definitions ---
interface Booking {
  id: string;
  courseId: string; 
  firstName: string;
  lastName: string;
  contact: string; 
  bookingDate: string; // YYYY-MM-DD
  classTime: 'morning' | 'afternoon' | 'fullday';
  // REMOVED: menuItems
  bookingStatus: 'pending' | 'success';
  quantity: number;
  totalPrice: number;
}

interface BookingFormState {
  courseId: string; 
  firstName: string;
  lastName: string;
  contact: string;
  bookingDate: string;
  classTime: 'morning' | 'afternoon' | 'fullday';
  // REMOVED: menuItems
  bookingStatus: 'pending' | 'success';
  quantity: number;
  totalPrice: number;
}

// --- Constants & Config ---
const emptyFormState: BookingFormState = {
  courseId: '', 
  firstName: '',
  lastName: '',
  contact: '',
  bookingDate: '',
  classTime: 'morning',
  // REMOVED: menuItems
  bookingStatus: 'pending',
  quantity: 1,
  totalPrice: 0
};

const ITEMS_PER_PAGE = 10;

const classTimeLabels = {
  morning: 'Morning (09:00 - 12:30)',
  afternoon: 'Afternoon (14:00 - 17:30)',
  fullday: 'Full Day (09:00 - 16:00)'
};

const statusColors = {
  pending: { bg: '#fff4e6', text: '#e67700', border: '#ffd699' },
  success: { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' }
};

export default function ManageBookingPage() {
  // --- State Management ---
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'img-1',
      courseId: '2025-12-03-morning',
      firstName: 'Alice',
      lastName: 'W.',
      contact: 'alice@example.com',
      bookingDate: '2025-12-03',
      classTime: 'morning',
      // REMOVED: menuItems: ['Massaman Curry'],
      bookingStatus: 'success',
      quantity: 2,
      totalPrice: 5000
    },
    {
      id: 'img-2',
      courseId: '2025-12-04-morning',
      firstName: 'Bob',
      lastName: 'T.',
      contact: '089-999-8888',
      bookingDate: '2025-12-04',
      classTime: 'morning',
      // REMOVED: menuItems: ['Spring Rolls'],
      bookingStatus: 'pending',
      quantity: 4,
      totalPrice: 4800
    },
    {
      id: 'img-3',
      courseId: '2025-12-04-afternoon',
      firstName: 'Charlie',
      lastName: 'Brown',
      contact: 'charlie@test.com',
      bookingDate: '2025-12-04',
      classTime: 'afternoon',
      // REMOVED: menuItems: ['Pad Thai'],
      bookingStatus: 'success',
      quantity: 1,
      totalPrice: 2500
    },
    {
      id: '1',
      courseId: '2024-12-15-morning',
      firstName: 'John',
      lastName: 'Doe',
      contact: '081-234-5678',
      bookingDate: '2024-12-15',
      classTime: 'morning',
      // REMOVED: menuItems: ['Pad Thai', 'Tom Yum Soup', 'Green Curry'],
      bookingStatus: 'success',
      quantity: 2,
      totalPrice: 3500
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<BookingFormState>(emptyFormState);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // --- Filtering & Sorting Logic ---
  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const haystack = [
        booking.courseId,
        booking.firstName,
        booking.lastName,
        booking.contact,
        booking.bookingDate,
        // REMOVED: ...booking.menuItems
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [bookings, search]);

  const sortedBookings = useMemo(
    () => [...filteredBookings].sort((a, b) => 
      new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    ),
    [filteredBookings]
  );

  // --- Pagination Logic ---
  const totalPages = Math.max(1, Math.ceil(sortedBookings.length / ITEMS_PER_PAGE));
  const paginatedBookings = sortedBookings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem = sortedBookings.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, sortedBookings.length);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const pageNumbers = useMemo(() => {
    const buttons: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i += 1) {
      buttons.push(i);
    }
    return buttons;
  }, [page, totalPages]);

  const handlePageChange = (next: number) => {
    setPage(Math.max(1, Math.min(totalPages, next)));
  };

  // --- Form Handlers ---
  const openAddForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    setShowForm(true);
  };

  const openEditForm = (booking: Booking) => {
    setEditingId(booking.id);
    setFormState({
      courseId: booking.courseId, 
      firstName: booking.firstName,
      lastName: booking.lastName,
      contact: booking.contact,
      bookingDate: booking.bookingDate,
      classTime: booking.classTime,
      // REMOVED: menuItems: booking.menuItems.join(', '),
      bookingStatus: booking.bookingStatus,
      quantity: booking.quantity,
      totalPrice: booking.totalPrice
    });
    setShowForm(true);
  };

  const handleSave = () => {
    // เพิ่มการตรวจสอบ Course ID
    if (!formState.courseId.trim() || !formState.firstName.trim() || !formState.lastName.trim() || !formState.contact.trim() || !formState.bookingDate) return;
    
    // REMOVED: MenuItems logic
    
    const payload = {
      courseId: formState.courseId.trim(), 
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      contact: formState.contact.trim(),
      bookingDate: formState.bookingDate,
      classTime: formState.classTime,
      // REMOVED: menuItems: menuArray,
      bookingStatus: formState.bookingStatus,
      quantity: formState.quantity,
      totalPrice: formState.totalPrice
    };

    if (editingId) {
      setBookings(prev => prev.map(b => b.id === editingId ? { ...b, ...payload } : b));
    } else {
      const newBooking: Booking = {
        id: Date.now().toString(),
        ...payload
      };
      setBookings(prev => [...prev, newBooking]);
    }
    setShowForm(false);
    setFormState(emptyFormState);
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setBookings(prev => prev.filter(b => b.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  return (
    <div className="min-h-screen py-10 bg-[#F6EFE7]" >
      <div className="max-w-[90%] mx-auto space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-light" style={{ color: '#3d2817' }}>
              Manage Booking
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white border hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#3d2817', borderColor: '#3d2817' }}
            >
              <Plus size={16} /> Add Booking
            </button>
          </div>
        </header>

        <section className="bg-white shadow border rounded-sm" style={{ borderColor: '#e5dcd4' }}>
          <div className="px-6 py-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between" style={{ borderColor: '#e5dcd4' }}>
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, name, contact..."
                className="w-full border pl-9 pr-4 py-2 text-sm outline-none focus:border-[#8b6f47]"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa' }}
              />
            </div>
          </div>

          <div className="pb-4">
            <div className="overflow-x-auto border-t" style={{ borderColor: '#f1e6db' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#f9f5f0', color: '#8b6f47' }}>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] font-semibold">Course ID</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] font-semibold">Customer</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] font-semibold">Contact</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] font-semibold">Date & Time</th>
                    {/* REMOVED: Menu Items Header */}
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.2em] font-semibold">Status</th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.2em] font-semibold">Qty</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em] font-semibold">Price</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking) => (
                    <tr key={booking.id} className="border-t hover:bg-[#fffbf7] transition-colors" style={{ borderColor: '#f1e6db' }}>
                      <td className="px-4 py-3 align-middle font-mono text-xs" style={{ color: '#3d2817' }}>
                        <div className="flex items-center gap-1.5">
                           <Hash size={12} className="text-[#b29373]" />
                           {booking.courseId}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div>
                          <p className="font-medium" style={{ color: '#3d2817' }}>
                            {booking.firstName} {booking.lastName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                        <p className="text-sm">{booking.contact}</p>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#3d2817' }}>
                            <Calendar size={14} />
                            <span>{formatDate(booking.bookingDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8b6f47' }}>
                            <Clock size={12} />
                            <span>{classTimeLabels[booking.classTime]}</span>
                          </div>
                        </div>
                      </td>
                      {/* REMOVED: Menu Items Column */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col gap-1.5 items-center">
                          <span
                            className="inline-block px-2 py-0.5 text-xs border rounded w-full text-center max-w-[80px]"
                            style={{
                              backgroundColor: statusColors[booking.bookingStatus].bg,
                              color: statusColors[booking.bookingStatus].text,
                              borderColor: statusColors[booking.bookingStatus].border
                            }}
                          >
                            {booking.bookingStatus === 'pending' ? 'Pending' : 'Confirmed'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center align-middle">
                        <span className="font-medium" style={{ color: '#3d2817' }}>
                          {booking.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <p className="font-medium" style={{ color: '#3d2817' }}>
                          {formatPrice(booking.totalPrice)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEditForm(booking)}
                            className="p-2 border hover:bg-[#f5f1ed] rounded-sm transition-colors"
                            style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id, `${booking.firstName} ${booking.lastName}`)}
                            className="p-2 border hover:bg-[#fde8e4] rounded-sm transition-colors"
                            style={{ color: '#c1513b', borderColor: '#f1e6db' }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sortedBookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                        No bookings match the current search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-xs mt-4 px-4" style={{ color: '#8b6f47' }}>
              <span>
                <p className="text-xs text-right" style={{ color: '#8b6f47' }}>
                  {sortedBookings.length > 0
                    ? `Showing ${startItem}-${endItem} of ${sortedBookings.length}`
                    : 'No matching bookings'}
                </p>
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border text-xs"
                  style={{ borderColor: '#f1e6db', color: page === 1 ? '#d3c5b6' : '#b6a188' }}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  ‹
                </button>
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className="px-3 py-1 border text-xs transition-colors"
                    style={{
                      borderColor: num === page ? '#3d2817' : '#f1e6db',
                      backgroundColor: num === page ? '#3d2817' : '#fff',
                      color: num === page ? '#fff' : '#3d2817'
                    }}
                  >
                    {num}
                  </button>
                ))}
                <button
                  className="px-3 py-1 border text-xs"
                  style={{ borderColor: '#f1e6db', color: page === totalPages ? '#d3c5b6' : '#b6a188' }}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* --- MODAL FORM --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto rounded-sm" style={{ backgroundColor: '#fffaf4' }}>
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#e5dcd4' }}>
              <div>
                <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                  {editingId ? `${formState.firstName} ${formState.lastName}` : 'New Booking'}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Course ID *
                  </label>
                  <input
                    type="text"
                    value={formState.courseId}
                    onChange={(e) => setFormState((prev) => ({ ...prev, courseId: e.target.value }))}
                    placeholder="e.g., 2025-12-03-morning"
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>

               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formState.firstName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formState.lastName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Contact *
                </label>
                <input
                  type="text"
                  value={formState.contact}
                  onChange={(e) => setFormState((prev) => ({ ...prev, contact: e.target.value }))}
                  className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Class Date *
                  </label>
                  <input
                    type="date"
                    value={formState.bookingDate}
                    onChange={(e) => setFormState((prev) => ({ ...prev, bookingDate: e.target.value }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Class Time *
                  </label>
                  <select
                    value={formState.classTime}
                    onChange={(e) => setFormState((prev) => ({ ...prev, classTime: e.target.value as 'morning' | 'afternoon' | 'fullday' }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  >
                    <option value="morning">Morning (09:00 - 12:30)</option>
                    <option value="afternoon">Afternoon (14:00 - 17:30)</option>
                    <option value="fullday">Full Day (09:00 - 16:00)</option>
                  </select>
                </div>
              </div>

              {/* REMOVED: Menu Items Textarea */}

              {/* Booking Status */}
              <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Booking Status
                  </label>
                  <select
                    value={formState.bookingStatus}
                    onChange={(e) => setFormState((prev) => ({ ...prev, bookingStatus: e.target.value as 'pending' | 'success' }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="success">Confirmed</option>
                  </select>
              </div>
               
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formState.quantity}
                    onChange={(e) => setFormState((prev) => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Total Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.totalPrice}
                    onChange={(e) => setFormState((prev) => ({ ...prev, totalPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#e5dcd4' }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormState(emptyFormState);
                  setEditingId(null);
                }}
                className="flex-1 px-4 py-2.5 text-sm border hover:bg-[#ebe2d8] transition-colors"
                style={{ backgroundColor: '#fff', color: '#3d2817', borderColor: '#e5dcd4' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 text-sm text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#3d2817' }}
                // เพิ่มการตรวจสอบว่าต้องกรอก Course ID ด้วย
                disabled={!formState.courseId.trim() || !formState.firstName.trim() || !formState.lastName.trim() || !formState.contact.trim() || !formState.bookingDate}
              >
                {editingId ? 'Save Changes' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white shadow-xl max-w-md w-full p-6 space-y-5 rounded-sm" style={{ backgroundColor: '#fffaf4' }}>
            <div>
              <h3 className="text-xl font-light mb-2" style={{ color: '#3d2817' }}>
                Confirm Delete
              </h3>
              <p className="text-sm" style={{ color: '#7a5f3d' }}>
                Are you sure? <br/>
                <span className="font-medium">{deleteConfirm.name}</span>
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm border hover:bg-[#ebe2d8]"
                style={{ backgroundColor: '#fff', color: '#3d2817', borderColor: '#e5dcd4' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-sm text-white hover:bg-[#a93e2a]"
                style={{ backgroundColor: '#c1513b' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}