'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Trash2, Search, Calendar, Hash, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// --- Type Definitions ---
interface Booking {
  id: string;
  customerId: string;
  courseId: number;
  timeSlotId: number;
  bookingDate: string;
  bookingStatus: 'pending' | 'success';
  quantity: number;
  totalPrice: number;
  created_at?: string;
}

interface BookingFormState {
  customerId: string;
  courseId: number;
  timeSlotId: number;
  bookingDate: string;
  bookingStatus: 'pending' | 'success';
  quantity: number;
  totalPrice: number;
}

// --- Constants & Config ---
const emptyFormState: BookingFormState = {
  customerId: '',
  courseId: 0,
  timeSlotId: 0,
  bookingDate: '',
  bookingStatus: 'pending',
  quantity: 1,
  totalPrice: 0
};

const ITEMS_PER_PAGE = 10;

const statusColors = {
  pending: { bg: '#fff4e6', text: '#e67700', border: '#ffd699' },
  success: { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' }
};

export default function ManageBookingPage() {
  // --- State Management ---
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<BookingFormState>(emptyFormState);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; label: string } | null>(null);

  // --- Fetch bookings from Supabase ---
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData: Booking[] = (data || []).map(item => ({
        id: item.id,
        customerId: item.customer_id ?? '',
        courseId: item.course_id ?? 0,
        timeSlotId: item.time_slot_id ?? 0,
        bookingDate: item.booking_date ?? '',
        bookingStatus: item.booking_status ?? 'pending',
        quantity: item.quantity ?? 1,
        totalPrice: item.total_price ?? 0,
        created_at: item.created_at
      }));

      setBookings(mappedData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --- Filtering & Sorting Logic ---
  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const haystack = [
        booking.customerId,
        String(booking.courseId),
        String(booking.timeSlotId),
        booking.bookingDate,
        booking.bookingStatus
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

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { setPage((prev) => Math.min(prev, totalPages)); }, [totalPages]);

  const pageNumbers = useMemo(() => {
    const buttons: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i += 1) buttons.push(i);
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
      customerId: booking.customerId,
      courseId: booking.courseId,
      timeSlotId: booking.timeSlotId,
      bookingDate: booking.bookingDate,
      bookingStatus: booking.bookingStatus,
      quantity: booking.quantity,
      totalPrice: booking.totalPrice
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formState.customerId.trim() || !formState.courseId || !formState.bookingDate) return;

    const payload = {
      customer_id: formState.customerId.trim(),
      course_id: formState.courseId,
      time_slot_id: formState.timeSlotId,
      booking_date: formState.bookingDate,
      booking_status: formState.bookingStatus,
      quantity: formState.quantity,
      total_price: formState.totalPrice
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('bookings').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('bookings').insert([payload]);
        if (error) throw error;
      }

      await fetchBookings();
      setShowForm(false);
      setFormState(emptyFormState);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking. Please try again.');
    }
  };

  const handleDelete = (id: string, label: string) => {
    setDeleteConfirm({ id, label });
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', deleteConfirm.id);
        if (error) throw error;
        await fetchBookings();
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(price);
  };

  return (
    <div className="min-h-screen py-10 bg-[#F6EFE7]">
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
                placeholder="Search customer ID, course ID, status..."
                className="w-full border pl-9 pr-4 py-2 text-sm outline-none focus:border-[#8b6f47]"
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
              <div className="overflow-x-auto border-t" style={{ borderColor: '#f1e6db' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: '#f9f5f0', color: '#8b6f47' }}>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] font-semibold">Customer ID</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] font-semibold">Course ID</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] font-semibold">Time Slot ID</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] font-semibold">Booking Date</th>
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
                            <span className="truncate max-w-[120px]" title={booking.customerId}>{booking.customerId}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle font-mono text-xs" style={{ color: '#3d2817' }}>
                          {booking.courseId}
                        </td>
                        <td className="px-4 py-3 align-middle font-mono text-xs" style={{ color: '#3d2817' }}>
                          {booking.timeSlotId}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#3d2817' }}>
                            <Calendar size={14} />
                            <span>{formatDate(booking.bookingDate)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex justify-center">
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
                          <span className="font-medium" style={{ color: '#3d2817' }}>{booking.quantity}</span>
                        </td>
                        <td className="px-4 py-3 text-right align-middle">
                          <p className="font-medium" style={{ color: '#3d2817' }}>{formatPrice(booking.totalPrice)}</p>
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
                              onClick={() => handleDelete(booking.id, `Booking #${booking.courseId}`)}
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
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-xs mt-4 px-4" style={{ color: '#8b6f47' }}>
              <span>
                <p className="text-xs" style={{ color: '#8b6f47' }}>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto rounded-sm" style={{ backgroundColor: '#fffaf4' }}>
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#e5dcd4' }}>
              <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                {editingId ? 'Edit Booking' : 'New Booking'}
              </h3>
            </div>

            <div className="space-y-4">
              {/* Customer ID */}
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Customer ID *
                </label>
                <input
                  type="text"
                  value={formState.customerId}
                  onChange={(e) => setFormState(prev => ({ ...prev, customerId: e.target.value }))}
                  placeholder="e.g. uuid of customer"
                  className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47] font-mono text-sm"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                />
              </div>

              {/* Course ID & Time Slot ID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Course ID *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formState.courseId || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, courseId: parseInt(e.target.value) || 0 }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Time Slot ID
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formState.timeSlotId || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, timeSlotId: parseInt(e.target.value) || 0 }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Booking Date *
                </label>
                <input
                  type="date"
                  value={formState.bookingDate}
                  onChange={(e) => setFormState(prev => ({ ...prev, bookingDate: e.target.value }))}
                  className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                />
              </div>

              {/* Booking Status */}
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Booking Status
                </label>
                <select
                  value={formState.bookingStatus}
                  onChange={(e) => setFormState(prev => ({ ...prev, bookingStatus: e.target.value as 'pending' | 'success' }))}
                  className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                >
                  <option value="pending">Pending</option>
                  <option value="success">Confirmed</option>
                </select>
              </div>

              {/* Quantity & Total Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formState.quantity}
                    onChange={(e) => setFormState(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full border px-4 py-2 outline-none focus:border-[#8b6f47]"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Total Price (THB)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.totalPrice}
                    onChange={(e) => setFormState(prev => ({ ...prev, totalPrice: parseFloat(e.target.value) || 0 }))}
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
                disabled={!formState.customerId.trim() || !formState.courseId || !formState.bookingDate}
              >
                {editingId ? 'Save Changes' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRM MODAL --- */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white shadow-xl max-w-md w-full p-6 space-y-5 rounded-sm" style={{ backgroundColor: '#fffaf4' }}>
            <div>
              <h3 className="text-xl font-light mb-2" style={{ color: '#3d2817' }}>
                Confirm Delete
              </h3>
              <p className="text-sm" style={{ color: '#7a5f3d' }}>
                Are you sure you want to delete <span className="font-medium">{deleteConfirm.label}</span>?
                This action cannot be undone.
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