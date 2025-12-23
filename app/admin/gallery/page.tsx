'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Trash2, Search, Loader2, X, ImageIcon, ZoomIn } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  file_name: string;
  file_size: number;
  created_at?: string;
}

interface ImageFormState {
  title: string;
  description: string;
  file: File | null;
  previewUrl: string;
}

const emptyFormState: ImageFormState = {
  title: '',
  description: '',
  file: null,
  previewUrl: ''
};

const ITEMS_PER_PAGE = 12;

export default function ImageGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState<ImageFormState>(emptyFormState);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string; imageUrl: string } | null>(null);
  const [viewImage, setViewImage] = useState<GalleryImage | null>(null);

  // Fetch images from Supabase
  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return images.filter((image) => {
      const haystack = [
        image.title,
        image.description,
        image.file_name
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [images, search]);

  const totalPages = Math.max(1, Math.ceil(filteredImages.length / ITEMS_PER_PAGE));
  const paginatedImages = filteredImages.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem = filteredImages.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, filteredImages.length);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setFormState((prev) => ({ ...prev, file, previewUrl }));
    }
  };

  const handleUpload = async () => {
    console.log('Upload started');
    console.log('Form state:', formState);
    
    if (!formState.file || !formState.title.trim()) {
      console.log('Validation failed:', { 
        hasFile: !!formState.file, 
        hasTitle: !!formState.title.trim() 
      });
      alert('Please select an image and enter a title');
      return;
    }
    
    try {
      setUploading(true);
      console.log('Uploading to Supabase...');

      // Upload file to Supabase Storage
      const fileExt = formState.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      console.log('Uploading file to path:', filePath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, formState.file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Save image metadata to database
      const payload = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        image_url: publicUrl,
        file_name: formState.file.name,
        file_size: formState.file.size
      };

      console.log('Inserting to database:', payload);
      const { data: insertData, error: insertError } = await supabase
        .from('gallery_images')
        .insert([payload])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }
      
      console.log('Insert successful:', insertData);

      // Refresh the image list
      await fetchImages();
      
      // Clean up
      URL.revokeObjectURL(formState.previewUrl);
      setShowForm(false);
      setFormState(emptyFormState);
      
      // alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      // alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string, title: string, imageUrl: string) => {
    setDeleteConfirm({ id, title, imageUrl });
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        // Extract file path from URL
        const url = new URL(deleteConfirm.imageUrl);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);
        
        if (pathMatch) {
          const filePath = pathMatch[1];
          
          // Delete from storage
          const { error: storageError } = await supabase.storage
            .from('images')
            .remove([filePath]);

          if (storageError) console.error('Storage delete error:', storageError);
        }

        // Delete from database
        const { error } = await supabase
          .from('gallery_images')
          .delete()
          .eq('id', deleteConfirm.id);

        if (error) throw error;

        // Refresh the image list
        await fetchImages();
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen py-10 bg-[#F6EFE7]">
      <div className="max-w-[90%] mx-auto space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-light" style={{ color: '#3d2817' }}>
              Image Gallery
            </h1>
            <p className="text-sm mt-2" style={{ color: '#8b6f47' }}>
              Upload and manage your image collection
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white border"
              style={{ backgroundColor: '#3d2817', borderColor: '#3d2817' }}
            >
              <Upload size={16} /> Upload Image
            </button>
          </div>
        </header>

        <section className="bg-white shadow border" style={{ borderColor: '#e5dcd4' }}>
          <div className="px-6 py-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between" style={{ borderColor: '#e5dcd4' }}>
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search images by title or description..."
                className="w-full border pl-9 pr-4 py-2 text-sm"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fffdfa' }}
              />
            </div>
            <div className="text-sm" style={{ color: '#8b6f47' }}>
              {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </div>
          </div>

          <div className="pb-4 px-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin" style={{ color: '#3d2817' }} />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <ImageIcon size={48} style={{ color: '#d3c5b6' }} />
                <p className="text-sm mt-4" style={{ color: '#8b6f47' }}>
                  {search ? 'No images match your search' : 'No images yet. Upload your first image!'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {paginatedImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative bg-white border overflow-hidden"
                      style={{ borderColor: '#e5dcd4', aspectRatio: '1/1' }}
                    >
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setViewImage(image)}
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                        <div>
                          <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                            {image.title}
                          </h3>
                          {image.description && (
                            <p className="text-white/80 text-xs line-clamp-2">
                              {image.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setViewImage(image)}
                            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded"
                          >
                            <ZoomIn size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(image.id, image.title, image.image_url)}
                            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs mt-6">
                  <span style={{ color: '#8b6f47' }}>
                    Showing {startItem}-{endItem} of {filteredImages.length}
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
              </>
            )}
          </div>
        </section>
      </div>

      {/* Upload Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white shadow-xl max-w-lg w-full p-6 space-y-5" style={{ backgroundColor: '#fffaf4' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-light" style={{ color: '#3d2817' }}>
                Upload Image
              </h3>
              <button
                onClick={() => {
                  if (formState.previewUrl) URL.revokeObjectURL(formState.previewUrl);
                  setShowForm(false);
                  setFormState(emptyFormState);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: '#8b6f47' }}>
                  Select Image *
                </label>
                <div className="border-2 border-dashed p-6 text-center" style={{ borderColor: '#e5dcd4' }}>
                  {formState.previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={formState.previewUrl}
                        alt="Preview"
                        className="max-h-48 mx-auto"
                      />
                      <p className="text-xs" style={{ color: '#8b6f47' }}>
                        {formState.file?.name} ({formatFileSize(formState.file?.size || 0)})
                      </p>
                      <button
                        onClick={() => {
                          URL.revokeObjectURL(formState.previewUrl);
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
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs" style={{ color: '#8b6f47' }}>
                        PNG, JPG, GIF up to 5MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
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
                  placeholder="Enter image title"
                />
              </div>

              {/* Description */}
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
                  placeholder="Add a description (optional)"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  if (formState.previewUrl) URL.revokeObjectURL(formState.previewUrl);
                  setShowForm(false);
                  setFormState(emptyFormState);
                }}
                className="flex-1 px-4 py-2 text-sm border"
                style={{ backgroundColor: '#e5dcd4', color: '#3d2817' }}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2 text-sm text-white inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: '#3d2817' }}
                disabled={!formState.file || !formState.title.trim() || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Image'
                )}
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
                Confirm Delete
              </h3>
              <img
                src={deleteConfirm.imageUrl}
                alt={deleteConfirm.title}
                className="w-full h-48 object-cover mb-3 border"
                style={{ borderColor: '#e5dcd4' }}
              />
              <p className="text-sm" style={{ color: '#7a5f3d' }}>
                Are you sure you want to delete "<span className="font-medium">{deleteConfirm.title}</span>"? 
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

      {/* Image View Modal */}
      {viewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4"
          onClick={() => setViewImage(null)}
        >
          <button
            onClick={() => setViewImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>
          
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={viewImage.image_url}
              alt={viewImage.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-white">
              <h3 className="text-xl font-medium mb-2">{viewImage.title}</h3>
              {viewImage.description && (
                <p className="text-sm text-white/80">{viewImage.description}</p>
              )}
              <p className="text-xs text-white/60 mt-2">
                {viewImage.file_name} • {formatFileSize(viewImage.file_size)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}