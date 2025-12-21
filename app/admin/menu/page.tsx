'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Edit3, Plus, Trash2, Search, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE SETUP
// ============================================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// TYPES
// ============================================================================
interface MenuItem {
  id: string;
  name_th: string;
  name_en?: string;
  image_url?: string;
  imageUrl?: string; // Support camelCase
  description?: string;
  price?: number;
  tag?: string;
  is_active?: boolean;
  isActive?: boolean; // Support camelCase
  created_at?: string;
  updated_at?: string;
}

interface MenuFormState {
  nameTh: string;
  nameEn: string;
  imageUrl: string;
  description: string;
}

// ============================================================================
// SUPABASE SERVICE
// ============================================================================
const menuService = {
  async getMenus(): Promise<MenuItem[]> {
    try {
      console.log('Fetching menus from Supabase...');
      
      // Try with is_active first, fallback to without if column doesn't exist
      let query = supabase.from('menus').select('*');
      
      // Try to check if is_active column exists
      const { data: testData, error: testError } = await supabase
        .from('menus')
        .select('is_active')
        .limit(1);
      
      // If is_active exists, filter by it
      if (!testError) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query.order('name_en', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to fetch menus');
      }

      console.log('Fetched menus:', data);
      return data || [];
    } catch (err) {
      console.error('Service error:', err);
      throw err;
    }
  },

  async addMenu(menu: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    try {
      console.log('Adding menu:', menu);
      
      const { data, error } = await supabase
        .from('menus')
        .insert([menu])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to add menu');
      }

      console.log('Added menu:', data);
      return data;
    } catch (err) {
      console.error('Service error:', err);
      throw err;
    }
  },

  async updateMenu(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    try {
      console.log('Updating menu:', id, updates);
      
      const { data, error } = await supabase
        .from('menus')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to update menu');
      }

      console.log('Updated menu:', data);
      return data;
    } catch (err) {
      console.error('Service error:', err);
      throw err;
    }
  },

  async deleteMenu(id: string): Promise<void> {
    try {
      console.log('Deleting menu:', id);
      
      // Try soft delete first
      const { error: softError } = await supabase
        .from('menus')
        .update({ is_active: false })
        .eq('id', id);

      // If is_active column doesn't exist, do hard delete
      if (softError && softError.message.includes('is_active')) {
        console.log('is_active column not found, performing hard delete');
        const { error: hardError } = await supabase
          .from('menus')
          .delete()
          .eq('id', id);
          
        if (hardError) {
          console.error('Supabase error:', hardError);
          throw new Error(hardError.message || 'Failed to delete menu');
        }
      } else if (softError) {
        console.error('Supabase error:', softError);
        throw new Error(softError.message || 'Failed to delete menu');
      }

      console.log('Deleted menu:', id);
    } catch (err) {
      console.error('Service error:', err);
      throw err;
    }
  },

  async uploadImage(file: File): Promise<string> {
    try {
      console.log('Uploading image:', file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `menu-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menus')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload image');
      }

      const { data } = supabase.storage
        .from('menus')
        .getPublicUrl(filePath);

      console.log('Image uploaded:', data.publicUrl);
      return data.publicUrl;
    } catch (err) {
      console.error('Service error:', err);
      throw err;
    }
  }
};

// ============================================================================
// CONSTANTS
// ============================================================================
const emptyFormState: MenuFormState = {
  nameTh: '',
  nameEn: '',
  imageUrl: '',
  description: ''
};

const FALLBACK_IMAGE = '/placeholder.jpg';
const ITEMS_PER_PAGE = 10;

const getImageSrc = (src?: string) => (src && src.trim().length ? src.trim() : FALLBACK_IMAGE);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ManageMenuPage() {
  // State Management
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<MenuFormState>(emptyFormState);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const loadMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting to load menus...');
      
      // Check if Supabase is configured
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      
      const data = await menuService.getMenus();
      console.log('Successfully loaded menus:', data.length, 'items');
      
      setMenus(data);
      setIsLoaded(true);
    } catch (err: any) {
      console.error('Failed to load menus:', err);
      const errorMessage = err?.message || 'Failed to load menus. Please try again.';
      setError(errorMessage);
      
      // Show more helpful error messages
      if (errorMessage.includes('JWT')) {
        setError('Authentication error. Please check your Supabase configuration.');
      } else if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
        setError('Table "menus" does not exist. Please create it in Supabase.');
      } else if (errorMessage.includes('environment')) {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  // ============================================================================
  // FILTERING & PAGINATION
  // ============================================================================
  const filteredMenus = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menus.filter((menu) => {
      const haystack = [
        menu.name_th, 
        menu.name_en ?? '', 
        menu.description ?? ''
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [menus, search]);

  const sortedMenus = useMemo(
    () => [...filteredMenus].sort((a, b) => 
      (a.name_en || a.name_th).localeCompare(b.name_en || b.name_th, 'th')
    ),
    [filteredMenus]
  );

  const totalPages = Math.max(1, Math.ceil(sortedMenus.length / ITEMS_PER_PAGE));
  const paginatedMenus = sortedMenus.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem = sortedMenus.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, sortedMenus.length);

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

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  const openAddForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    setImageFile(null);
    setShowForm(true);
  };

  const openEditForm = (menu: MenuItem) => {
    setEditingId(menu.id);
    setFormState({
      nameTh: menu.name_th,
      nameEn: menu.name_en ?? '',
      imageUrl: menu.image_url ?? '',
      description: menu.description ?? ''
    });
    setImageFile(null);
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
    if (!formState.nameTh.trim()) return;
    
    try {
      setIsLoading(true);
      let finalImageUrl = formState.imageUrl;

      // Upload image if new file is selected
      if (imageFile) {
        setUploadingImage(true);
        finalImageUrl = await menuService.uploadImage(imageFile);
      }

      const payload: Partial<MenuItem> = {
        name_th: formState.nameTh.trim(),
        name_en: formState.nameEn.trim() || undefined,
        image_url: finalImageUrl || undefined,
        description: formState.description.trim() || undefined
      };

      if (editingId) {
        const updated = await menuService.updateMenu(editingId, payload);
        setMenus((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
      } else {
        const newMenu = await menuService.addMenu(payload as Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>);
        setMenus((prev) => [...prev, newMenu]);
      }
      
      setShowForm(false);
      setFormState(emptyFormState);
      setEditingId(null);
      setImageFile(null);
    } catch (err) {
      console.error('Error saving menu:', err);
      setError('Failed to save menu. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      setIsLoading(true);
      await menuService.deleteMenu(deleteConfirm.id);
      setMenus((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting menu:', err);
      setError('Failed to delete menu. Please try again.');
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
              Manage menu
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
              Add menu
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
                placeholder="Search menu by name or keyword..."
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
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Menu</th>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em]">Description</th>
                      <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMenus.map((menu) => (
                      <tr key={menu.id} className="border-t hover:bg-[#fffbf7] transition-colors" style={{ borderColor: '#f1e6db' }}>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 overflow-hidden border" style={{ borderColor: '#f1e6db', backgroundColor: '#f9f5f1' }}>
                              <img
                                src={getImageSrc(menu.image_url)}
                                alt={menu.name_en || menu.name_th}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: '#3d2817' }}>
                                {menu.name_en || menu.name_th}
                              </p>
                              <p className="text-xs" style={{ color: '#8b6f47' }}>
                                {menu.name_th}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle" style={{ color: '#7a5f3d' }}>
                          {menu.description ? (
                            <p className="max-w-sm leading-relaxed">{menu.description}</p>
                          ) : (
                            <span className="italic text-gray-400">No description</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right align-middle">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditForm(menu)}
                              disabled={isLoading}
                              className="p-2 border hover:bg-[#f5f1ed] disabled:opacity-50"
                              style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(menu.id, menu.name_th)}
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
                    {sortedMenus.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                          No menus match the current search.
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
                    {sortedMenus.length > 0
                      ? `Showing ${startItem}-${endItem} of ${sortedMenus.length}`
                      : 'No matching menus'}
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
                        color: num === page ? '#fff' : '#3d2817'
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
              <p className="text-sm" style={{ color: '#8b6f47' }}>Loading menu data...</p>
            </div>
          )}
        </section>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#fffaf4' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                  {editingId ? formState.nameTh || 'Menu' : 'New menu'}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Menu name (Thai) *
                </label>
                <input
                  type="text"
                  value={formState.nameTh}
                  onChange={(e) => setFormState((prev) => ({ ...prev, nameTh: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="ผัดไทย"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Menu name (English)
                </label>
                <input
                  type="text"
                  value={formState.nameEn}
                  onChange={(e) => setFormState((prev) => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  placeholder="Pad Thai"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                />
                <p className="text-xs mt-1" style={{ color: '#b29373' }}>
                  Upload an image file (JPG, PNG, etc.) - Will be uploaded to Supabase Storage
                </p>
                {formState.imageUrl && (
                  <div className="mt-2 border p-2" style={{ borderColor: '#e5dcd4' }}>
                    <img 
                      src={formState.imageUrl} 
                      alt="Preview" 
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                  Description
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border px-4 py-2 text-sm"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                  rows={3}
                  placeholder="Short highlight or story"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormState(emptyFormState);
                  setEditingId(null);
                  setImageFile(null);
                }}
                disabled={isLoading || uploadingImage}
                className="flex-1 px-4 py-2 text-sm border disabled:opacity-50"
                style={{ backgroundColor: '#e5dcd4', color: '#3d2817' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formState.nameTh.trim() || isLoading || uploadingImage}
                className="flex-1 px-4 py-2 text-sm text-white disabled:opacity-50 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: '#3d2817' }}
              >
                {(isLoading || uploadingImage) && <Loader2 size={16} className="animate-spin" />}
                {uploadingImage ? 'Uploading...' : editingId ? 'Save changes' : 'Add menu'}
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
                Are you sure you want to delete menu "<span className="font-medium">{deleteConfirm.name}</span>"? 
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