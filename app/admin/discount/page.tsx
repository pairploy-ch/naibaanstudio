'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Edit3, Plus, Trash2, Search, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE SETUP
// ============================================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// TYPES
// ============================================================================
interface DiscountCode {
  id: string;
  code: string;
  percent: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface DiscountFormState {
  code: string;
  percent: string;
  isActive: boolean;
}

// ============================================================================
// SUPABASE SERVICE
// ============================================================================
const discountService = {
  async getCodes(): Promise<DiscountCode[]> {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Failed to fetch discount codes');
    return data || [];
  },

  async addCode(payload: Omit<DiscountCode, 'id' | 'created_at' | 'updated_at'>): Promise<DiscountCode> {
    const { data, error } = await supabase
      .from('discount_codes')
      .insert([payload])
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to add discount code');
    return data;
  },

  async updateCode(id: string, updates: Partial<DiscountCode>): Promise<DiscountCode> {
    const { data, error } = await supabase
      .from('discount_codes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to update discount code');
    return data;
  },

  async deleteCode(id: string): Promise<void> {
    const { error } = await supabase.from('discount_codes').delete().eq('id', id);
    if (error) throw new Error(error.message || 'Failed to delete discount code');
  },
};

// ============================================================================
// CONSTANTS
// ============================================================================
const emptyFormState: DiscountFormState = {
  code: '',
  percent: '',
  isActive: true,
};

const ITEMS_PER_PAGE = 10;

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ManageDiscountPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<DiscountFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const loadCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      const data = await discountService.getCodes();
      setCodes(data);
      setIsLoaded(true);
    } catch (err: any) {
      const message = err?.message || 'Failed to load discount codes.';
      if (message.includes('relation') || message.includes('does not exist')) {
        setError('Table "discount_codes" does not exist. Please run supabase/discount_codes.sql first.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  // ============================================================================
  // FILTERING & PAGINATION
  // ============================================================================
  const filteredCodes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return codes.filter((c) => c.code.toLowerCase().includes(query));
  }, [codes, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCodes.length / ITEMS_PER_PAGE));
  const paginatedCodes = filteredCodes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem = filteredCodes.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, filteredCodes.length);

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
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i += 1) buttons.push(i);
    return buttons;
  }, [page, totalPages]);

  const handlePageChange = (next: number) => {
    setPage(Math.max(1, Math.min(totalPages, next)));
  };

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  const openAddForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (code: DiscountCode) => {
    setEditingId(code.id);
    setFormState({
      code: code.code,
      percent: String(code.percent ?? ''),
      isActive: code.is_active ?? true,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    const code = formState.code.trim().toUpperCase();
    const percent = parseFloat(formState.percent);

    if (!code) {
      setFormError('Code is required.');
      return;
    }
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      setFormError('Percent must be a number between 1 and 100.');
      return;
    }
    const duplicate = codes.find(
      (c) => c.code.toUpperCase() === code && c.id !== editingId,
    );
    if (duplicate) {
      setFormError(`Code "${code}" already exists.`);
      return;
    }

    try {
      setIsLoading(true);
      setFormError(null);
      const payload = { code, percent, is_active: formState.isActive };

      if (editingId) {
        const updated = await discountService.updateCode(editingId, payload);
        setCodes((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        const created = await discountService.addCode(payload);
        setCodes((prev) => [created, ...prev]);
      }

      setShowForm(false);
      setFormState(emptyFormState);
      setEditingId(null);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save discount code.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsLoading(true);
      await discountService.deleteCode(deleteConfirm.id);
      setCodes((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete discount code.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen py-10 bg-[#F6EFE7]">
      <div className="max-w-[90%] mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-light" style={{ color: '#3d2817' }}>
              Manage discount codes
            </h1>
            {error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openAddForm}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white border disabled:opacity-50"
              style={{ backgroundColor: '#3d2817', borderColor: '#3d2817' }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Add code
            </button>
          </div>
        </header>

        {/* Main Content */}
        <section className="bg-white shadow border" style={{ borderColor: '#e5dcd4' }}>
          {/* Search Bar */}
          <div className="px-6 py-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between" style={{ borderColor: '#e5dcd4' }}>
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by code..."
                className="w-full border pl-9 pr-4 py-2 text-sm"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa' }}
              />
            </div>
          </div>

          {/* Table */}
          {isLoaded ? (
            <div className="pb-4">
              <div className="overflow-x-auto border" style={{ borderColor: '#f1e6db' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: '#f9f5f0', color: '#8b6f47' }}>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Code</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Discount</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Status</th>
                      <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCodes.map((code) => (
                      <tr key={code.id} className="border-t hover:bg-[#fffbf7] transition-colors" style={{ borderColor: '#f1e6db' }}>
                        <td className="px-4 py-3 align-middle font-mono font-medium" style={{ color: '#3d2817' }}>
                          {code.code}
                        </td>
                        <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                          {code.percent}%
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span
                            className="inline-block px-2 py-1 text-xs rounded"
                            style={
                              code.is_active ?? true
                                ? { backgroundColor: '#e3f0e0', color: '#3f7a39' }
                                : { backgroundColor: '#f0e0e0', color: '#a84a3a' }
                            }
                          >
                            {code.is_active ?? true ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right align-middle">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditForm(code)}
                              disabled={isLoading}
                              className="p-2 border hover:bg-[#f5f1ed] disabled:opacity-50"
                              style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ id: code.id, name: code.code })}
                              disabled={isLoading}
                              className="p-2 border hover:bg-[#fde8e4] disabled:opacity-50"
                              style={{ color: '#c1513b', borderColor: '#f1e6db' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCodes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                          No discount codes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs mt-4 px-4" style={{ color: '#8b6f47' }}>
                <span>
                  <p className="text-xs text-right" style={{ color: '#8b6f47' }}>
                    {filteredCodes.length > 0
                      ? `Showing ${startItem}-${endItem} of ${filteredCodes.length}`
                      : 'No matching codes'}
                  </p>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 border text-xs disabled:opacity-50"
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
                        color: num === page ? '#fff' : '#3d2817',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1 border text-xs disabled:opacity-50"
                    style={{ borderColor: '#f1e6db', color: page === totalPages ? '#d3c5b6' : '#b6a188' }}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: '#8b6f47' }} />
              <p className="text-sm" style={{ color: '#8b6f47' }}>Loading discount codes...</p>
            </div>
          )}
        </section>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#fffaf4' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                {editingId ? 'Edit code' : 'New discount code'}
              </h3>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Code *
                </label>
                <input
                  type="text"
                  value={formState.code}
                  onChange={(e) => setFormState((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full border px-4 py-2 font-mono uppercase"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="WELCOME10"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Discount percent (%) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formState.percent}
                  onChange={(e) => setFormState((prev) => ({ ...prev, percent: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="10"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(e) => setFormState((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm" style={{ color: '#3d2817' }}>
                  Active (available at checkout)
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormState(emptyFormState);
                  setEditingId(null);
                  setFormError(null);
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm border disabled:opacity-50"
                style={{ backgroundColor: '#e5dcd4', color: '#3d2817' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm text-white disabled:opacity-50 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: '#3d2817' }}
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {editingId ? 'Save changes' : 'Add code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-md w-full p-6 space-y-5" style={{ backgroundColor: '#fffaf4' }}>
            <div>
              <h3 className="text-xl font-light mb-2" style={{ color: '#3d2817' }}>
                Confirm delete
              </h3>
              <p className="text-sm" style={{ color: '#7a5f3d' }}>
                Are you sure you want to delete code "<span className="font-medium">{deleteConfirm.name}</span>"?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm border disabled:opacity-50"
                style={{ backgroundColor: '#e5dcd4', color: '#3d2817', borderColor: '#e5dcd4' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm text-white disabled:opacity-50 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: '#c1513b' }}
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
