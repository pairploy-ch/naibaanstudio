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
interface Review {
  id: string;
  name: string;
  country?: string | null;
  rating: number;
  comment: string;
  image_url?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ReviewFormState {
  name: string;
  country: string;
  rating: number;
  comment: string;
  imageUrl: string;
  isActive: boolean;
}

// ============================================================================
// SUPABASE SERVICE
// ============================================================================
const reviewService = {
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Failed to fetch reviews');
    return data || [];
  },

  async addReview(payload: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([payload])
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to add review');
    return data;
  },

  async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to update review');
    return data;
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw new Error(error.message || 'Failed to delete review');
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `review-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('reviews')
      .upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message || 'Failed to upload image');

    const { data } = supabase.storage.from('reviews').getPublicUrl(filePath);
    return data.publicUrl;
  },
};

// ============================================================================
// CONSTANTS
// ============================================================================
const emptyFormState: ReviewFormState = {
  name: '',
  country: '',
  rating: 5,
  comment: '',
  imageUrl: '',
  isActive: true,
};

const FALLBACK_IMAGE = '/placeholder.jpg';
const ITEMS_PER_PAGE = 10;

const getImageSrc = (src?: string | null) =>
  src && src.trim().length ? src.trim() : FALLBACK_IMAGE;

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ManageReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ReviewFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const loadReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      const data = await reviewService.getReviews();
      setReviews(data);
      setIsLoaded(true);
    } catch (err: any) {
      const message = err?.message || 'Failed to load reviews.';
      if (message.includes('relation') || message.includes('does not exist')) {
        setError('Table "reviews" does not exist. Please run supabase/reviews.sql first.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // ============================================================================
  // FILTERING & PAGINATION
  // ============================================================================
  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reviews.filter((r) =>
      [r.name, r.country ?? '', r.comment].join(' ').toLowerCase().includes(query),
    );
  }, [reviews, search]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / ITEMS_PER_PAGE));
  const paginatedReviews = filteredReviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem = filteredReviews.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, filteredReviews.length);

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
    setImageFile(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (review: Review) => {
    setEditingId(review.id);
    setFormState({
      name: review.name,
      country: review.country ?? '',
      rating: review.rating,
      comment: review.comment,
      imageUrl: review.image_url ?? '',
      isActive: review.is_active ?? true,
    });
    setImageFile(null);
    setFormError(null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formState.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    if (!formState.comment.trim()) {
      setFormError('Comment is required.');
      return;
    }

    try {
      setIsLoading(true);
      setFormError(null);
      let finalImageUrl = formState.imageUrl;

      // Upload new image file if selected (skip data: preview strings)
      if (imageFile) {
        setUploadingImage(true);
        finalImageUrl = await reviewService.uploadImage(imageFile);
      }

      const payload = {
        name: formState.name.trim(),
        country: formState.country.trim() || null,
        rating: formState.rating,
        comment: formState.comment.trim(),
        image_url: finalImageUrl || null,
        is_active: formState.isActive,
      };

      if (editingId) {
        const updated = await reviewService.updateReview(editingId, payload);
        setReviews((prev) => prev.map((r) => (r.id === editingId ? updated : r)));
      } else {
        const created = await reviewService.addReview(payload);
        setReviews((prev) => [created, ...prev]);
      }

      setShowForm(false);
      setFormState(emptyFormState);
      setEditingId(null);
      setImageFile(null);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save review.');
    } finally {
      setIsLoading(false);
      setUploadingImage(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsLoading(true);
      await reviewService.deleteReview(deleteConfirm.id);
      setReviews((prev) => prev.filter((r) => r.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete review.');
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
              Manage reviews
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
              Add review
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
                placeholder="Search by name or comment..."
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
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Reviewer</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Rating</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Comment</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Status</th>
                      <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReviews.map((review) => (
                      <tr key={review.id} className="border-t hover:bg-[#fffbf7] transition-colors" style={{ borderColor: '#f1e6db' }}>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 overflow-hidden rounded-full border" style={{ borderColor: '#f1e6db', backgroundColor: '#f9f5f1' }}>
                              <img
                                src={getImageSrc(review.image_url)}
                                alt={review.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: '#3d2817' }}>
                                {review.name}
                              </p>
                              {review.country && (
                                <p className="text-xs" style={{ color: '#8b6f47' }}>
                                  {review.country}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle text-yellow-500 whitespace-nowrap">
                          {'★'.repeat(review.rating)}
                          <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                        </td>
                        <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                          <p className="max-w-sm leading-relaxed line-clamp-2">{review.comment}</p>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span
                            className="inline-block px-2 py-1 text-xs rounded"
                            style={
                              review.is_active ?? true
                                ? { backgroundColor: '#e3f0e0', color: '#3f7a39' }
                                : { backgroundColor: '#f0e0e0', color: '#a84a3a' }
                            }
                          >
                            {review.is_active ?? true ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right align-middle">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditForm(review)}
                              disabled={isLoading}
                              className="p-2 border hover:bg-[#f5f1ed] disabled:opacity-50"
                              style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ id: review.id, name: review.name })}
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
                    {filteredReviews.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                          No reviews found.
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
                    {filteredReviews.length > 0
                      ? `Showing ${startItem}-${endItem} of ${filteredReviews.length}`
                      : 'No matching reviews'}
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
              <p className="text-sm" style={{ color: '#8b6f47' }}>Loading reviews...</p>
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
                {editingId ? 'Edit review' : 'New review'}
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
                  Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="Sarah Johnson"
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
                  placeholder="United States"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormState((prev) => ({ ...prev, rating: star }))}
                      className="text-3xl leading-none"
                      style={{ color: star <= formState.rating ? '#eab308' : '#d3c5b6' }}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm" style={{ color: '#8b6f47' }}>
                    {formState.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Comment *
                </label>
                <textarea
                  value={formState.comment}
                  onChange={(e) => setFormState((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full border px-4 py-2 text-sm"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  rows={4}
                  placeholder="What did the customer say about the class?"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                />
                {formState.imageUrl && (
                  <div className="mt-2 border p-2 inline-block" style={{ borderColor: '#e5dcd4' }}>
                    <img
                      src={formState.imageUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                )}
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
                  Active (show on home page)
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormState(emptyFormState);
                  setEditingId(null);
                  setImageFile(null);
                  setFormError(null);
                }}
                disabled={isLoading || uploadingImage}
                className="flex-1 px-4 py-2 text-sm border disabled:opacity-50"
                style={{ backgroundColor: '#e5dcd4', color: '#3d2817' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || uploadingImage}
                className="flex-1 px-4 py-2 text-sm text-white disabled:opacity-50 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: '#3d2817' }}
              >
                {(isLoading || uploadingImage) && <Loader2 size={16} className="animate-spin" />}
                {uploadingImage ? 'Uploading...' : editingId ? 'Save changes' : 'Add review'}
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
                Are you sure you want to delete the review by "<span className="font-medium">{deleteConfirm.name}</span>"?
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
