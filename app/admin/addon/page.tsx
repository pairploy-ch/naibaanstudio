'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
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
interface Addon {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_urls: string[];
  available_days: string[];
  is_active: boolean;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const FALLBACK_IMAGE = '/placeholder.jpg';

const emptyAddon: Omit<Addon, 'id'> = {
  name: 'NaiBaan Sweets & Tea',
  price: 290,
  description: '',
  image_urls: [],
  available_days: ['Saturday', 'Sunday'],
  is_active: true,
};

export default function ManageAddonPage() {
  const [addon, setAddon] = useState<Addon | null>(null);
  const [form, setForm] = useState<Omit<Addon, 'id'>>(emptyAddon);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<(File | null)[]>([]);

  const load = useCallback(async () => {
    try {
      setError(null);
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }
      const { data, error } = await supabase
        .from('addons')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message || 'Failed to load add-on.');

      if (data) {
        setAddon(data);
        setForm({
          name: data.name,
          price: data.price,
          description: data.description ?? '',
          image_urls: data.image_urls ?? [],
          available_days: data.available_days ?? [],
          is_active: data.is_active,
        });
        setPendingFiles((data.image_urls ?? []).map(() => null));
      } else {
        setAddon(null);
        setForm(emptyAddon);
        setPendingFiles([]);
      }
      setIsLoaded(true);
    } catch (err: any) {
      const message = err?.message || 'Failed to load add-on.';
      if (message.includes('relation') || message.includes('does not exist')) {
        setError('Table "addons" does not exist. Please run supabase/addons.sql first.');
      } else {
        setError(message);
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day],
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `addon-images/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('addons').upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message || 'Failed to upload image');

    const { data } = supabase.storage.from('addons').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image_urls: [...prev.image_urls, reader.result as string] }));
        setPendingFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== index) }));
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMsg(null);
      setUploadingImage(true);

      const finalImageUrls = await Promise.all(
        form.image_urls.map((url, i) => {
          const file = pendingFiles[i];
          return file ? uploadImage(file) : Promise.resolve(url);
        }),
      );
      setUploadingImage(false);

      const payload = {
        name: form.name.trim(),
        price: form.price,
        description: form.description?.trim() || null,
        image_urls: finalImageUrls,
        available_days: form.available_days,
        is_active: form.is_active,
      };

      if (addon) {
        const { data, error } = await supabase
          .from('addons')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', addon.id)
          .select()
          .single();
        if (error) throw new Error(error.message || 'Failed to save add-on.');
        setAddon(data);
      } else {
        const { data, error } = await supabase.from('addons').insert([payload]).select().single();
        if (error) throw new Error(error.message || 'Failed to create add-on.');
        setAddon(data);
      }

      setForm((prev) => ({ ...prev, image_urls: finalImageUrls }));
      setPendingFiles(finalImageUrls.map(() => null));
      setSuccessMsg('Saved.');
    } catch (err: any) {
      setError(err?.message || 'Failed to save add-on.');
    } finally {
      setIsSaving(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#F6EFE7]">
      <div className="max-w-[90%] mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-light" style={{ color: '#3d2817' }}>
            Manage Add-on
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#8b6f47' }}>
            The checkout add-on customers can buy alongside a class (e.g. NaiBaan Sweets & Tea).
          </p>
          {error && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {successMsg && <div className="mt-2 text-sm text-green-700">{successMsg}</div>}
        </header>

        {!isLoaded ? (
          <div className="px-6 py-12 text-center">
            <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: '#8b6f47' }} />
          </div>
        ) : (
          <section className="bg-white shadow border max-w-2xl p-6 space-y-5" style={{ borderColor: '#e5dcd4' }}>
            <div>
              <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border px-4 py-2"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                Price (THB, VAT-inclusive, per person) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full border px-4 py-2"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                Description
              </label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border px-4 py-2 text-sm"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
                placeholder="A shown-to-customer description of the add-on"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: '#8b6f47' }}>
                Available on
              </label>
              <div className="flex flex-wrap gap-3">
                {ALL_DAYS.map((day) => (
                  <label key={day} className="flex items-center gap-1.5 text-sm" style={{ color: '#3d2817' }}>
                    <input
                      type="checkbox"
                      checked={form.available_days.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="w-4 h-4"
                    />
                    {day}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs" style={{ color: '#b6a188' }}>
                Only shown at checkout for classes on the selected days. Leave all unchecked to offer it every day.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
                Sample photos (shown to customers before they pay)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="w-full border px-4 py-2"
                style={{ borderColor: '#e5dcd4', backgroundColor: '#fff' }}
              />
              {form.image_urls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.image_urls.map((url, index) => (
                    <div key={index} className="relative border p-1" style={{ borderColor: '#e5dcd4' }}>
                      <img
                        src={url}
                        alt={`Sample ${index + 1}`}
                        className="w-24 h-24 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border text-xs flex items-center justify-center"
                        style={{ borderColor: '#e5dcd4', color: '#c1513b' }}
                        aria-label={`Remove sample photo ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm" style={{ color: '#3d2817' }}>
                Active (offer this add-on at checkout)
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-sm text-white disabled:opacity-50 inline-flex items-center gap-2"
              style={{ backgroundColor: '#3d2817' }}
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {uploadingImage ? 'Uploading photos...' : 'Save'}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
