'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNum: string;
  country: string;
  address: string;
  created_at?: string;
}

interface CustomerFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNum: string;
  country: string;
  address: string;
}

const emptyFormState: CustomerFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  passportNum: '',
  country: '',
  address: ''
};

const ITEMS_PER_PAGE = 10;

export default function ManageCustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<CustomerFormState>(emptyFormState);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Fetch customers from Supabase
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase data to our Customer interface
      const mappedData: Customer[] = (data || []).map(item => ({
        id: item.id,
        firstName: item.first_name || item.firstName || '',
        lastName: item.last_name || item.lastName || '',
        email: item.email || '',
        phone: item.phone || '',
        passportNum: item.passport_num || item.passportNum || '',
        country: item.country || '',
        address: item.address || '',
        created_at: item.created_at
      }));

      setCustomers(mappedData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const haystack = [
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.phone,
        customer.passportNum,
        customer.country,
        customer.address
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [customers, search]);

  const sortedCustomers = useMemo(
    () => [...filteredCustomers].sort((a, b) => 
      `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, 'th')
    ),
    [filteredCustomers]
  );

  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE));
  const paginatedCustomers = sortedCustomers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem = sortedCustomers.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, sortedCustomers.length);

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

  const openEditForm = (customer: Customer) => {
    setEditingId(customer.id);
    setFormState({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      passportNum: customer.passportNum,
      country: customer.country,
      address: customer.address
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formState.firstName.trim() || !formState.lastName.trim() || !formState.email.trim()) return;
    
    const payload = {
      first_name: formState.firstName.trim(),
      last_name: formState.lastName.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      passport_num: formState.passportNum.trim(),
      country: formState.country.trim(),
      address: formState.address.trim()
    };

    try {
      if (editingId) {
        // Update existing customer
        const { error } = await supabase
          .from('customers')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Insert new customer
        const { error } = await supabase
          .from('customers')
          .insert([payload]);

        if (error) throw error;
      }

      // Refresh the customer list
      await fetchCustomers();
      
      setShowForm(false);
      setFormState(emptyFormState);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        const { error } = await supabase
          .from('customers')
          .delete()
          .eq('id', deleteConfirm.id);

        if (error) throw error;

        // Refresh the customer list
        await fetchCustomers();
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#F6EFE7]">
      <div className="max-w-[90%] mx-auto space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-light" style={{ color: '#3d2817' }}>
              Manage Customer
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white border"
              style={{ backgroundColor: '#3d2817', borderColor: '#3d2817' }}
            >
              <Plus size={16} /> Add Customer
            </button>
          </div>
        </header>

        <section className="bg-white shadow border" style={{ borderColor: '#e5dcd4' }}>
          <div className="px-6 py-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between" style={{ borderColor: '#e5dcd4' }}>
            <div className="relative w-full md:w-200">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer by name, email, phone, passport..."
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
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Customer</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Email</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Phone</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Passport</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Country</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Address</th>
                      <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCustomers.map((customer) => (
                      <tr key={customer.id} className="border-t" style={{ borderColor: '#f1e6db' }}>
                        <td className="px-4 py-3 align-middle">
                          <div>
                            <p className="font-medium" style={{ color: '#3d2817' }}>
                              {customer.firstName} {customer.lastName}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                          <p className="text-sm">{customer.email}</p>
                        </td>
                        <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                          <p className="text-sm">{customer.phone}</p>
                        </td>
                        <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                          <p className="text-sm">{customer.passportNum || '-'}</p>
                        </td>
                        <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                          <p className="text-sm">{customer.country || '-'}</p>
                        </td>
                        <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                          {customer.address ? (
                            <p className="max-w-md leading-relaxed text-sm">{customer.address}</p>
                          ) : (
                            <span className="italic text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right align-middle">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditForm(customer)}
                              className="p-2 border hover:bg-[#f5f1ed]"
                              style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(customer.id, `${customer.firstName} ${customer.lastName}`)}
                              className="p-2 border hover:bg-[#fde8e4]"
                              style={{ color: '#c1513b', borderColor: '#f1e6db' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {sortedCustomers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                          No customers match the current search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex items-center justify-between text-xs mt-4 px-4" style={{ color: '#8b6f47' }}>
              <span>
                <p className="text-xs text-right" style={{ color: '#8b6f47' }}>
                  {sortedCustomers.length > 0
                    ? `Showing ${startItem}-${endItem} of ${sortedCustomers.length}`
                    : 'No matching customers'}
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-lg w-full p-6 space-y-5" style={{ backgroundColor: '#fffaf4' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                  {editingId ? `${formState.firstName} ${formState.lastName}` : 'New Customer'}
                </h3>
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
                  Email *
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="081-234-5678"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Passport Num
                  </label>
                  <input
                    type="text"
                    value={formState.passportNum}
                    onChange={(e) => setFormState((prev) => ({ ...prev, passportNum: e.target.value }))}
                    className="w-full border px-4 py-2"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                    placeholder="A12345678"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={formState.country}
                    onChange={(e) => setFormState((prev) => ({ ...prev, country: e.target.value }))}
                    className="w-full border px-4 py-2"
                    style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                    placeholder="Thailand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Address
                </label>
                <textarea
                  value={formState.address}
                  onChange={(e) => setFormState((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full border px-4 py-2 text-sm"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  rows={3}
                  placeholder="123 Sukhumvit Road, Bangkok"
                />
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
                disabled={!formState.firstName.trim() || !formState.lastName.trim() || !formState.email.trim()}
              >
                {editingId ? 'Save Changes' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-md w-full p-6 space-y-5" style={{ backgroundColor: '#fffaf4' }}>
            <div>
              <h3 className="text-xl font-light mb-2" style={{ color: '#3d2817' }}>
                Confirm Delete
              </h3>
              <p className="text-sm" style={{ color: '#7a5f3d' }}>
                Are you sure you want to delete customer "<span className="font-medium">{deleteConfirm.name}</span>"? 
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