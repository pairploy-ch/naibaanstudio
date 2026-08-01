'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Edit3, Plus, Trash2, Search, AlertCircle, Loader2, Upload, X } from 'lucide-react';
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
interface Blog {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface BlogFormState {
  title: string;
  excerpt: string;
  content: string;
  isActive: boolean;
  file: File | null;
  previewUrl: string;
}

const emptyFormState: BlogFormState = {
  title: '',
  excerpt: '',
  content: '',
  isActive: true,
  file: null,
  previewUrl: '',
};

const ITEMS_PER_PAGE = 10;

// ============================================================================
// SUPABASE SERVICE
// ============================================================================
const blogService = {
  async getBlogs(): Promise<Blog[]> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Failed to fetch blogs');
    return data || [];
  },

  async uploadCover(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('blogs').upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message || 'Failed to upload cover image');

    const { data } = supabase.storage.from('blogs').getPublicUrl(filePath);
    return data.publicUrl;
  },

  async addBlog(payload: Omit<Blog, 'id' | 'created_at' | 'updated_at'>): Promise<Blog> {
    const { data, error } = await supabase
      .from('blogs')
      .insert([payload])
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to add blog post');
    return data;
  },

  async updateBlog(id: string, updates: Partial<Blog>): Promise<Blog> {
    const { data, error } = await supabase
      .from('blogs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to update blog post');
    return data;
  },

  async deleteBlog(id: string): Promise<void> {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw new Error(error.message || 'Failed to delete blog post');
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ManageBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<BlogFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const loadBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      const data = await blogService.getBlogs();
      setBlogs(data);
      setIsLoaded(true);
    } catch (err: any) {
      const message = err?.message || 'Failed to load blog posts.';
      if (message.includes('relation') || message.includes('does not exist')) {
        setError('Table "blogs" does not exist. Please run supabase/blogs.sql first.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // ============================================================================
  // FILTERING & PAGINATION
  // ============================================================================
  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return blogs;
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        (b.excerpt ?? '').toLowerCase().includes(query),
    );
  }, [blogs, search]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE));
  const paginatedBlogs = filteredBlogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem = filteredBlogs.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, filteredBlogs.length);

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

  const openEditForm = (blog: Blog) => {
    setEditingId(blog.id);
    setFormState({
      title: blog.title,
      excerpt: blog.excerpt ?? '',
      content: blog.content,
      isActive: blog.is_active ?? true,
      file: null,
      previewUrl: blog.cover_image ?? '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    if (formState.file && formState.previewUrl) URL.revokeObjectURL(formState.previewUrl);
    setShowForm(false);
    setFormState(emptyFormState);
    setEditingId(null);
    setFormError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('File size must be less than 5MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormState((prev) => ({ ...prev, file, previewUrl }));
  };

  const handleSave = async () => {
    const title = formState.title.trim();
    const content = formState.content.trim();

    if (!title) {
      setFormError('Title is required.');
      return;
    }
    if (!content) {
      setFormError('Content is required.');
      return;
    }

    try {
      setIsLoading(true);
      setFormError(null);

      let coverImage = editingId
        ? blogs.find((b) => b.id === editingId)?.cover_image ?? null
        : null;
      if (formState.file) {
        coverImage = await blogService.uploadCover(formState.file);
      }

      const payload = {
        title,
        excerpt: formState.excerpt.trim() || null,
        content,
        cover_image: coverImage,
        is_active: formState.isActive,
      };

      if (editingId) {
        const updated = await blogService.updateBlog(editingId, payload);
        setBlogs((prev) => prev.map((b) => (b.id === editingId ? updated : b)));
      } else {
        const created = await blogService.addBlog(payload);
        setBlogs((prev) => [created, ...prev]);
      }

      closeForm();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save blog post.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsLoading(true);
      await blogService.deleteBlog(deleteConfirm.id);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete blog post.');
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
              Manage blog posts
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
              Add post
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
                placeholder="Search by title or excerpt..."
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
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Cover</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Title</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Excerpt</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Status</th>
                      <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBlogs.map((blog) => (
                      <tr key={blog.id} className="border-t hover:bg-[#fffbf7] transition-colors" style={{ borderColor: '#f1e6db' }}>
                        <td className="px-4 py-3 align-middle">
                          <div
                            className="w-16 h-12 bg-[#f1e6db] border overflow-hidden flex items-center justify-center"
                            style={{ borderColor: '#e5dcd4' }}
                          >
                            {blog.cover_image ? (
                              <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px]" style={{ color: '#b29373' }}>No image</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle font-medium" style={{ color: '#3d2817' }}>
                          {blog.title}
                        </td>
                        <td className="px-4 py-3 align-middle max-w-sm">
                          <p className="line-clamp-2" style={{ color: '#7a5f3d' }}>{blog.excerpt}</p>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span
                            className="inline-block px-2 py-1 text-xs rounded"
                            style={
                              blog.is_active
                                ? { backgroundColor: '#e3f0e0', color: '#3f7a39' }
                                : { backgroundColor: '#f0e0e0', color: '#a84a3a' }
                            }
                          >
                            {blog.is_active ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right align-middle">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditForm(blog)}
                              disabled={isLoading}
                              className="p-2 border hover:bg-[#f5f1ed] disabled:opacity-50"
                              style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ id: blog.id, name: blog.title })}
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
                    {filteredBlogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                          No blog posts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs mt-4 px-4" style={{ color: '#8b6f47' }}>
                <span>
                  {filteredBlogs.length > 0
                    ? `Showing ${startItem}-${endItem} of ${filteredBlogs.length}`
                    : 'No matching posts'}
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
              <p className="text-sm" style={{ color: '#8b6f47' }}>Loading blog posts...</p>
            </div>
          )}
        </section>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#fffaf4' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                {editingId ? 'Edit post' : 'New blog post'}
              </h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Cover image */}
              <div>
                <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: '#8b6f47' }}>
                  Cover image
                </label>
                <div className="border-2 border-dashed p-6 text-center" style={{ borderColor: '#e5dcd4' }}>
                  {formState.previewUrl ? (
                    <div className="space-y-3">
                      <img src={formState.previewUrl} alt="Preview" className="max-h-48 mx-auto object-cover" />
                      <button
                        onClick={() => {
                          if (formState.file) URL.revokeObjectURL(formState.previewUrl);
                          setFormState((prev) => ({ ...prev, file: null, previewUrl: '' }));
                        }}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload size={32} className="mx-auto mb-2" style={{ color: '#b29373' }} />
                      <p className="text-sm mb-1" style={{ color: '#3d2817' }}>
                        Click to upload a cover image
                      </p>
                      <p className="text-xs" style={{ color: '#8b6f47' }}>
                        PNG, JPG, GIF up to 5MB
                      </p>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="5 tips for your first Thai cooking class"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Excerpt
                </label>
                <textarea
                  value={formState.excerpt}
                  onChange={(e) => setFormState((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full border px-4 py-2 text-sm"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="A short summary shown on the blog list (optional)"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Content *
                </label>
                <textarea
                  value={formState.content}
                  onChange={(e) => setFormState((prev) => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full border px-4 py-2 text-sm"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="Write the full post here..."
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
                  Published (visible to visitors)
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={closeForm}
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
                {editingId ? 'Save changes' : 'Add post'}
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
