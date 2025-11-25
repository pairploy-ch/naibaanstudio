'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Trash2, Search, Calendar, Clock, UtensilsCrossed } from 'lucide-react';

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  contact: string; // phone or email
  bookingDate: string; // YYYY-MM-DD
  classTime: 'morning' | 'afternoon' | 'fullday';
  menuItems: string[];
  bookingStatus: 'pending' | 'success';
  paymentStatus: 'pending' | 'success';
  quantity: number;
  totalPrice: number;
}

interface BookingFormState {
  firstName: string;
  lastName: string;
  contact: string;
  bookingDate: string;
  classTime: 'morning' | 'afternoon' | 'fullday';
  menuItems: string;
  bookingStatus: 'pending' | 'success';
  paymentStatus: 'pending' | 'success';
  quantity: number;
  totalPrice: number;
}

const emptyFormState: BookingFormState = {
  firstName: '',
  lastName: '',
  contact: '',
  bookingDate: '',
  classTime: 'morning',
  menuItems: '',
  bookingStatus: 'pending',
  paymentStatus: 'pending',
  quantity: 1,
  totalPrice: 0
};

const ITEMS_PER_PAGE = 10;

const classTimeLabels = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  fullday: 'Full Day'
};

const statusColors = {
  pending: { bg: '#fff4e6', text: '#e67700', border: '#ffd699' },
  success: { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' }
};

export default function ManageBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      contact: '081-234-5678',
      bookingDate: '2024-12-15',
      classTime: 'morning',
      menuItems: ['Pad Thai', 'Tom Yum Soup', 'Green Curry'],
      bookingStatus: 'success',
      paymentStatus: 'success',
      quantity: 2,
      totalPrice: 3500
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      contact: 'jane.smith@example.com',
      bookingDate: '2024-12-18',
      classTime: 'fullday',
      menuItems: ['Mango Sticky Rice', 'Spring Rolls', 'Papaya Salad', 'Massaman Curry'],
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      quantity: 1,
      totalPrice: 4500
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<BookingFormState>(emptyFormState);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const haystack = [
        booking.firstName,
        booking.lastName,
        booking.contact,
        booking.bookingDate,
        ...booking.menuItems
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

  const openAddForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    setShowForm(true);
  };

  const openEditForm = (booking: Booking) => {
    setEditingId(booking.id);
    setFormState({
      firstName: booking.firstName,
      lastName: booking.lastName,
      contact: booking.contact,
      bookingDate: booking.bookingDate,
      classTime: booking.classTime,
      menuItems: booking.menuItems.join(', '),
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      quantity: booking.quantity,
      totalPrice: booking.totalPrice
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formState.firstName.trim() || !formState.lastName.trim() || !formState.contact.trim() || !formState.bookingDate) return;
    
    const menuArray = formState.menuItems
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const payload = {
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      contact: formState.contact.trim(),
      bookingDate: formState.bookingDate,
      classTime: formState.classTime,
      menuItems: menuArray,
      bookingStatus: formState.bookingStatus,
      paymentStatus: formState.paymentStatus,
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
    <div className="min-h-screen py-10" style={{ backgroundColor: '#f5f1ed' }}>
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white border"
              style={{ backgroundColor: '#3d2817', borderColor: '#3d2817' }}
            >
              <Plus size={16} /> Add Booking
            </button>
          </div>
        </header>

        <section className="bg-white shadow border" style={{ borderColor: '#e5dcd4' }}>
          <div className="px-6 py-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between" style={{ borderColor: '#e5dcd4' }}>
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, contact, date, menu..."
                className="w-full border pl-9 pr-4 py-2 text-sm"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa' }}
              />
            </div>
          </div>

          <div className="pb-4">
            <div className="overflow-x-auto border" style={{ borderColor: '#f1e6db' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#f9f5f0', color: '#8b6f47' }}>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Customer</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Contact</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Menu Items</th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.2em]">Status</th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.2em]">Qty</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Price</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking) => (
                    <tr key={booking.id} className="border-t" style={{ borderColor: '#f1e6db' }}>
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
                          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#3d2817' }}>
                            <Calendar size={14} />
                            <span>{formatDate(booking.bookingDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8b6f47' }}>
                            <Clock size={12} />
                            <span>{classTimeLabels[booking.classTime]}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-start gap-1.5">
                          <UtensilsCrossed size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#b29373' }} />
                          <div className="text-xs leading-relaxed" style={{ color: '#7a5f3d' }}>
                            {booking.menuItems.join(', ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="space-y-1.5">
                          <div
                            className="inline-block px-2 py-0.5 text-xs border rounded mr-3"
                            style={{
                              backgroundColor: statusColors[booking.bookingStatus].bg,
                              color: statusColors[booking.bookingStatus].text,
                              borderColor: statusColors[booking.bookingStatus].border
                            }}
                          >
                            {booking.bookingStatus === 'pending' ? 'Pending' : 'Confirmed'}
                          </div>
                          <div
                            className="inline-block px-2 py-0.5 text-xs border rounded"
                            style={{
                              backgroundColor: statusColors[booking.paymentStatus].bg,
                              color: statusColors[booking.paymentStatus].text,
                              borderColor: statusColors[booking.paymentStatus].border
                            }}
                          >
                            {booking.paymentStatus === 'pending' ? 'Unpaid' : 'Paid'}
                          </div>
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
                            className="p-2 border hover:bg-[#f5f1ed]"
                            style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id, `${booking.firstName} ${booking.lastName}`)}
                            className="p-2 border hover:bg-[#fde8e4]"
                            style={{ color: '#c1513b', borderColor: '#f1e6db' }}
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
                    className="px-3 py-1 border text-xs"
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#fffaf4' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                  {editingId ? `${formState.firstName} ${formState.lastName}` : 'New Booking'}
                </h3>
                <p className="text-xs mt-1" style={{ color: '#8b6f47' }}>
                  {editingId ? 'Edit booking information' : 'Add new booking'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formState.firstName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full border px-4 py-2"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                    placeholder="Somchai"
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
                    className="w-full border px-4 py-2"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                    placeholder="Jaidee"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Contact (Phone/Email) *
                </label>
                <input
                  type="text"
                  value={formState.contact}
                  onChange={(e) => setFormState((prev) => ({ ...prev, contact: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="081-234-5678 or email@example.com"
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
                    className="w-full border px-4 py-2"
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
                    className="w-full border px-4 py-2"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="fullday">Full Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Menu Items
                </label>
                <textarea
                  value={formState.menuItems}
                  onChange={(e) => setFormState((prev) => ({ ...prev, menuItems: e.target.value }))}
                  className="w-full border px-4 py-2 text-sm"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  rows={3}
                  placeholder="Pad Thai, Tom Yum Soup, Green Curry (comma separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Booking Status
                  </label>
                  <select
                    value={formState.bookingStatus}
                    onChange={(e) => setFormState((prev) => ({ ...prev, bookingStatus: e.target.value as 'pending' | 'success' }))}
                    className="w-full border px-4 py-2"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="success">Confirmed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Payment Status
                  </label>
                  <select
                    value={formState.paymentStatus}
                    onChange={(e) => setFormState((prev) => ({ ...prev, paymentStatus: e.target.value as 'pending' | 'success' }))}
                    className="w-full border px-4 py-2"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  >
                    <option value="pending">Unpaid</option>
                    <option value="success">Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Quantity (Seats)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formState.quantity}
                    onChange={(e) => setFormState((prev) => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full border px-4 py-2"
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
                    onChange={(e) => setFormState((prev) => ({ ...prev, totalPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full border px-4 py-2"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                    placeholder="3500.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormState(emptyFormState);
                  setEditingId(null);
                }}
                className="flex-1 px-4 py-2 text-sm border"
                style={{ backgroundColor: '#e5dcd4', color: '#3d2817' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 text-sm text-white"
                style={{ backgroundColor: '#3d2817' }}
                disabled={!formState.firstName.trim() || !formState.lastName.trim() || !formState.contact.trim() || !formState.bookingDate}
              >
                {editingId ? 'Save Changes' : 'Add Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-md w-full p-6 space-y-5" style={{ backgroundColor: '#fffaf4' }}>
            <div>
              <h3 className="text-xl font-light mb-2" style={{ color: '#3d2817' }}>
                Confirm Delete
              </h3>
              <p className="text-sm" style={{ color: '#7a5f3d' }}>
                Are you sure you want to delete booking for "<span className="font-medium">{deleteConfirm.name}</span>"? 
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm border"
                style={{ backgroundColor: '#e5dcd4', color: '#3d2817', borderColor: '#e5dcd4' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-sm text-white"
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