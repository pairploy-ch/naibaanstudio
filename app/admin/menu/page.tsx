'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Trash2, Search } from 'lucide-react';
import { useMenuManager } from '@/hooks/use-menu-manager';
import { MenuItem } from '@/types/menu';

interface MenuFormState {
  nameTh: string;
  nameEn: string;
  imageUrl: string;
  description: string;
}

const emptyFormState: MenuFormState = {
  nameTh: '',
  nameEn: '',
  imageUrl: '',
  description: ''
};

const FALLBACK_IMAGE = '/placeholder.jpg';
const ITEMS_PER_PAGE = 10;

const getImageSrc = (src?: string) => (src && src.trim().length ? src.trim() : FALLBACK_IMAGE);

export default function ManageMenuPage() {
  const { menus, addMenu, updateMenu, deleteMenu, resetMenus, isLoaded } = useMenuManager();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<MenuFormState>(emptyFormState);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const filteredMenus = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = menus.filter((menu) => {
      const haystack = [menu.nameTh, menu.nameEn ?? '', menu.description ?? ''].join(' ').toLowerCase();
      return haystack.includes(query);
    });
    return result;
  }, [menus, search]);

  const sortedMenus = useMemo(
    () => [...filteredMenus].sort((a, b) => (a.nameEn || a.nameTh).localeCompare(b.nameEn || b.nameTh, 'th')),
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

  const openAddForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    setShowForm(true);
  };

  const openEditForm = (menu: MenuItem) => {
    setEditingId(menu.id);
    setFormState({
      nameTh: menu.nameTh,
      nameEn: menu.nameEn ?? '',
      imageUrl: menu.imageUrl ?? '',
      description: menu.description ?? ''
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formState.nameTh.trim()) return;
    const payload = {
      nameTh: formState.nameTh.trim(),
      nameEn: formState.nameEn.trim() || undefined,
      imageUrl: formState.imageUrl.trim() || undefined,
      description: formState.description.trim() || undefined
    };

    if (editingId) {
      updateMenu(editingId, payload);
    } else {
      addMenu(payload);
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
      deleteMenu(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#f5f1ed' }}>
      <div className="max-w-[90%] mx-auto space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-light" style={{ color: '#3d2817' }}>
              Manage menu
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white border"
              style={{ backgroundColor: '#3d2817', borderColor: '#3d2817' }}
            >
              <Plus size={16} /> Add menu
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
                placeholder="Search menu by name or keyword..."
                className="w-full border pl-9 pr-4 py-2 text-sm"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa' }}
              />
            </div>
          </div>

          {isLoaded ? (
            <div className=" pb-4">
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
                      <tr key={menu.id} className="border-t" style={{ borderColor: '#f1e6db' }}>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 overflow-hidden border" style={{ borderColor: '#f1e6db', backgroundColor: '#f9f5f1' }}>
                              <img
                                src={getImageSrc(menu.imageUrl)}
                                alt={menu.nameEn || menu.nameTh}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: '#3d2817' }}>
                                {menu.nameEn || menu.nameTh}
                              </p>
                              <p className="text-xs" style={{ color: '#8b6f47' }}>
                                {menu.nameTh}
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
                              className="p-2 border hover:bg-[#f5f1ed]"
                              style={{ color: '#3d2817', borderColor: '#f1e6db' }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(menu.id, menu.nameTh)}
                              className="p-2 border hover:bg-[#fde8e4]"
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
                        <td colSpan={4} className="px-4 py-10 text-center text-sm" style={{ color: '#8b6f47' }}>
                          No menus match the current search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
          ) : (
            <div className="px-6 py-12 text-center text-sm" style={{ color: '#8b6f47' }}>
              Loading menu data...
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-lg w-full p-6 space-y-5" style={{ backgroundColor: '#fffaf4' }}>
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormState((prev) => ({ ...prev, imageUrl: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full border px-4 py-2"
                  style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                />
                <p className="text-xs mt-1" style={{ color: '#b29373' }}>
                  Upload an image file (JPG, PNG, etc.)
                </p>
                {formState.imageUrl && (
                  <div className="mt-2 border p-2" style={{ borderColor: '#e5dcd4' }}>
                    <img 
                      src={formState.imageUrl} 
                      alt="Preview" 
                      className="w-full h-32 object-cover"
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
                disabled={!formState.nameTh.trim()}
              >
                {editingId ? 'Save changes' : 'Add menu'}
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