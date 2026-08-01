'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Edit3, Plus, Trash2, Search, AlertCircle, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
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
interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface FaqFormState {
  question: string;
  answer: string;
  isActive: boolean;
}

// ============================================================================
// SUPABASE SERVICE
// ============================================================================
const faqService = {
  async getFaqs(): Promise<Faq[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message || 'Failed to fetch FAQs');
    return data || [];
  },

  async addFaq(payload: Omit<Faq, 'id' | 'created_at' | 'updated_at'>): Promise<Faq> {
    const { data, error } = await supabase
      .from('faqs')
      .insert([payload])
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to add FAQ');
    return data;
  },

  async updateFaq(id: string, updates: Partial<Faq>): Promise<Faq> {
    const { data, error } = await supabase
      .from('faqs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to update FAQ');
    return data;
  },

  async deleteFaq(id: string): Promise<void> {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw new Error(error.message || 'Failed to delete FAQ');
  },
};

// ============================================================================
// CONSTANTS
// ============================================================================
const emptyFormState: FaqFormState = {
  question: '',
  answer: '',
  isActive: true,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ManageFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FaqFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const loadFaqs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      const data = await faqService.getFaqs();
      setFaqs(data);
      setIsLoaded(true);
    } catch (err: any) {
      const message = err?.message || 'Failed to load FAQs.';
      if (message.includes('relation') || message.includes('does not exist')) {
        setError('Table "faqs" does not exist. Please run supabase/faqs.sql first.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  // ============================================================================
  // FILTERING
  // ============================================================================
  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(query) ||
        f.answer.toLowerCase().includes(query),
    );
  }, [faqs, search]);

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  const openAddForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (faq: Faq) => {
    setEditingId(faq.id);
    setFormState({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.is_active ?? true,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    const question = formState.question.trim();
    const answer = formState.answer.trim();

    if (!question) {
      setFormError('Question is required.');
      return;
    }
    if (!answer) {
      setFormError('Answer is required.');
      return;
    }

    try {
      setIsLoading(true);
      setFormError(null);

      if (editingId) {
        const updated = await faqService.updateFaq(editingId, { question, answer, is_active: formState.isActive });
        setFaqs((prev) => prev.map((f) => (f.id === editingId ? updated : f)));
      } else {
        const nextOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) + 1 : 0;
        const created = await faqService.addFaq({
          question,
          answer,
          is_active: formState.isActive,
          sort_order: nextOrder,
        });
        setFaqs((prev) => [...prev, created]);
      }

      setShowForm(false);
      setFormState(emptyFormState);
      setEditingId(null);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save FAQ.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsLoading(true);
      await faqService.deleteFaq(deleteConfirm.id);
      setFaqs((prev) => prev.filter((f) => f.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete FAQ.');
    } finally {
      setIsLoading(false);
    }
  };

  const moveFaq = async (faq: Faq, direction: 'up' | 'down') => {
    const index = faqs.findIndex((f) => f.id === faq.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (index === -1 || swapIndex < 0 || swapIndex >= faqs.length) return;

    const other = faqs[swapIndex];
    try {
      setReorderingId(faq.id);
      const [updatedFaq, updatedOther] = await Promise.all([
        faqService.updateFaq(faq.id, { sort_order: other.sort_order }),
        faqService.updateFaq(other.id, { sort_order: faq.sort_order }),
      ]);
      setFaqs((prev) => {
        const next = prev.map((f) => {
          if (f.id === updatedFaq.id) return updatedFaq;
          if (f.id === updatedOther.id) return updatedOther;
          return f;
        });
        return [...next].sort((a, b) => a.sort_order - b.sort_order);
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to reorder FAQs.');
    } finally {
      setReorderingId(null);
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
              Manage FAQ
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
              Add question
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
                placeholder="Search question or answer..."
                className="w-full border pl-9 pr-4 py-2 text-sm"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa' }}
              />
            </div>
          </div>

          {/* List */}
          {isLoaded ? (
            <div className="pb-4">
              <div className="space-y-3 px-4">
                {filteredFaqs.map((faq, i) => (
                  <div
                    key={faq.id}
                    className="flex items-start gap-3 border p-4"
                    style={{ borderColor: '#f1e6db', backgroundColor: '#fffdfa' }}
                  >
                    <div className="flex flex-col gap-1 pt-1">
                      <button
                        onClick={() => moveFaq(faq, 'up')}
                        disabled={reorderingId !== null || i === 0}
                        className="p-1 border hover:bg-[#f5f1ed] disabled:opacity-30"
                        style={{ borderColor: '#f1e6db', color: '#3d2817' }}
                        aria-label="Move up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveFaq(faq, 'down')}
                        disabled={reorderingId !== null || i === filteredFaqs.length - 1}
                        className="p-1 border hover:bg-[#f5f1ed] disabled:opacity-30"
                        style={{ borderColor: '#f1e6db', color: '#3d2817' }}
                        aria-label="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium" style={{ color: '#3d2817' }}>
                          {faq.question}
                        </h3>
                        <span
                          className="inline-block px-2 py-0.5 text-xs rounded"
                          style={
                            faq.is_active
                              ? { backgroundColor: '#e3f0e0', color: '#3f7a39' }
                              : { backgroundColor: '#f0e0e0', color: '#a84a3a' }
                          }
                        >
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap" style={{ color: '#7a5f3d' }}>
                        {faq.answer}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditForm(faq)}
                        disabled={isLoading}
                        className="p-2 border hover:bg-[#f5f1ed] disabled:opacity-50"
                        style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: faq.id, name: faq.question })}
                        disabled={isLoading}
                        className="p-2 border hover:bg-[#fde8e4] disabled:opacity-50"
                        style={{ color: '#c1513b', borderColor: '#f1e6db' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                    No FAQs found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: '#8b6f47' }} />
              <p className="text-sm" style={{ color: '#8b6f47' }}>Loading FAQs...</p>
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
                {editingId ? 'Edit question' : 'New question'}
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
                  Question *
                </label>
                <input
                  type="text"
                  value={formState.question}
                  onChange={(e) => setFormState((prev) => ({ ...prev, question: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="What time should I arrive?"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Answer *
                </label>
                <textarea
                  value={formState.answer}
                  onChange={(e) => setFormState((prev) => ({ ...prev, answer: e.target.value }))}
                  rows={5}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="Please arrive 15 minutes before your class starts..."
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
                  Active (shown on the home page)
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
                {editingId ? 'Save changes' : 'Add question'}
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
                Are you sure you want to delete "<span className="font-medium">{deleteConfirm.name}</span>"?
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
