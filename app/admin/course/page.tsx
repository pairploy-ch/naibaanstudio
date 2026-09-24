'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle, Loader2, ArrowUp, ArrowDown, Trash2, Plus, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FALLBACK_IMAGE = '/placeholder.jpg';

// ============================================================================
// TYPES
// ============================================================================
interface TimeSlot {
  id: number;
  slot_name: string;
  start_time: string;
  end_time: string;
}

interface MenuItem {
  id: number;
  name: string;
  cover: string | null;
}

interface Day {
  id: number; // weekly_template id
  date: string;
  title: string;
  description: string;
  learning: string;
  experience: string;
  cover: string;
  max_capacity: number;
  type_of_course_id: number;
  type_name: string;
  price: number;
  vat: number;
  hours: number;
  slots: TimeSlot[];
  menu: MenuItem[];
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ManageCoursePage() {
  const [days, setDays] = useState<Day[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const { data: templates, error: tErr } = await supabase
        .from('weekly_template')
        .select('*, type_of_course(id,name,price,vat,hours), menu(id,name,cover,sort_order)')
        .order('sort', { ascending: true });
      if (tErr) throw new Error(tErr.message);

      const typeIds = Array.from(new Set((templates ?? []).map((t: any) => t.type_of_course_id)));
      const { data: slots, error: sErr } = await supabase
        .from('course_time_slot')
        .select('*')
        .in('type_of_course_id', typeIds)
        .order('start_time', { ascending: true });
      if (sErr) throw new Error(sErr.message);

      const merged: Day[] = (templates ?? []).map((t: any) => ({
        id: t.id,
        date: t.date,
        title: t.title,
        description: t.description ?? '',
        learning: t.learning ?? '',
        experience: t.experience ?? '',
        cover: t.cover ?? '',
        max_capacity: t.max_capacity,
        type_of_course_id: t.type_of_course_id,
        type_name: t.type_of_course?.name ?? '',
        price: t.type_of_course?.price ?? 0,
        vat: t.type_of_course?.vat ?? 0,
        hours: t.type_of_course?.hours ?? 0,
        slots: (slots ?? [])
          .filter((s: any) => s.type_of_course_id === t.type_of_course_id)
          .map((s: any) => ({ id: s.id, slot_name: s.slot_name, start_time: s.start_time, end_time: s.end_time })),
        menu: (t.menu ?? [])
          .slice()
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((m: any) => ({ id: m.id, name: m.name, cover: m.cover })),
      }));

      setDays(merged);
      setIsLoaded(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to load courses.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const editingDay = days.find((d) => d.id === editingId) ?? null;

  return (
    <div className="min-h-screen py-10 bg-[#F6EFE7]">
      <div className="max-w-[90%] mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-light" style={{ color: '#3d2817' }}>
            Manage Courses
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#8b6f47' }}>
            Edit each day's title, description, cover photo, price, time slots, and dish photos.
          </p>
          {error && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </header>

        {!isLoaded ? (
          <div className="px-6 py-12 text-center">
            <Loader2 size={32} className="animate-spin mx-auto" style={{ color: '#8b6f47' }} />
          </div>
        ) : editingDay ? (
          <DayEditor
            day={editingDay}
            onClose={() => setEditingId(null)}
            onSaved={async () => {
              await load();
              setEditingId(null);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day) => (
              <div key={day.id} className="bg-white border" style={{ borderColor: '#e5dcd4' }}>
                <img
                  src={day.cover || FALLBACK_IMAGE}
                  alt={day.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                <div className="p-4">
                  <h3 className="font-bold" style={{ color: '#3d2817' }}>
                    {day.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: '#8b6f47' }}>
                    {day.type_name} · ฿{day.price.toLocaleString()} · {day.hours}h
                  </p>
                  <button
                    onClick={() => setEditingId(day.id)}
                    className="mt-3 px-4 py-2 text-sm text-white"
                    style={{ backgroundColor: '#3d2817' }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// DAY EDITOR
// ============================================================================
function DayEditor({ day, onClose, onSaved }: { day: Day; onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState<Day>(day);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(day.cover);
  const [menuFiles, setMenuFiles] = useState<Record<number, File | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(day);
    setCoverPreview(day.cover);
    setCoverFile(null);
    setMenuFiles({});
  }, [day]);

  const uploadFile = async (file: File, prefix: string): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${prefix}/${Math.random().toString(36).slice(2)}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('courses').upload(fileName, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from('courses').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const updateSlot = (id: number, field: keyof TimeSlot, value: string) => {
    setForm((prev) => ({
      ...prev,
      slots: prev.slots.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const updateMenuName = (id: number, name: string) => {
    setForm((prev) => ({ ...prev, menu: prev.menu.map((m) => (m.id === id ? { ...m, name } : m)) }));
  };

  const handleMenuImageChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMenuFiles((prev) => ({ ...prev, [id]: file }));
    setForm((prev) => ({
      ...prev,
      menu: prev.menu.map((m) => (m.id === id ? { ...m, cover: URL.createObjectURL(file) } : m)),
    }));
  };

  const addMenuItem = () => {
    const tempId = -Date.now(); // negative = not yet saved
    setForm((prev) => ({ ...prev, menu: [...prev.menu, { id: tempId, name: '', cover: null }] }));
  };

  const removeMenuItem = (id: number) => {
    setForm((prev) => ({ ...prev, menu: prev.menu.filter((m) => m.id !== id) }));
    setMenuFiles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    setForm((prev) => {
      const next = [...prev.menu];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return prev;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return { ...prev, menu: next };
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      let finalCover = form.cover;
      if (coverFile) finalCover = await uploadFile(coverFile, 'covers');

      const { error: wtErr } = await supabase
        .from('weekly_template')
        .update({
          title: form.title,
          description: form.description,
          learning: form.learning,
          experience: form.experience,
          cover: finalCover,
          max_capacity: form.max_capacity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', form.id);
      if (wtErr) throw new Error(wtErr.message);

      const { error: tocErr } = await supabase
        .from('type_of_course')
        .update({ price: form.price, vat: form.vat, hours: form.hours, updated_at: new Date().toISOString() })
        .eq('id', form.type_of_course_id);
      if (tocErr) throw new Error(tocErr.message);

      for (const slot of form.slots) {
        const { error: slotErr } = await supabase
          .from('course_time_slot')
          .update({ slot_name: slot.slot_name, start_time: slot.start_time, end_time: slot.end_time })
          .eq('id', slot.id);
        if (slotErr) throw new Error(slotErr.message);
      }

      // Menu: delete removed, update/insert kept ones with fresh sort order
      const keptIds = form.menu.filter((m) => m.id > 0).map((m) => m.id);
      const removedIds = day.menu.map((m) => m.id).filter((id) => !keptIds.includes(id));
      for (const id of removedIds) {
        const { error: delErr } = await supabase.from('menu').delete().eq('id', id);
        if (delErr) throw new Error(delErr.message);
      }

      for (let i = 0; i < form.menu.length; i++) {
        const item = form.menu[i];
        let finalMenuCover = item.cover;
        const file = menuFiles[item.id];
        if (file) finalMenuCover = await uploadFile(file, 'menu');

        if (item.id > 0) {
          const { error: updErr } = await supabase
            .from('menu')
            .update({ name: item.name, cover: finalMenuCover, sort_order: i + 1, updated_at: new Date().toISOString() })
            .eq('id', item.id);
          if (updErr) throw new Error(updErr.message);
        } else {
          const { error: insErr } = await supabase
            .from('menu')
            .insert([{ weekly_template_id: form.id, name: item.name, cover: finalMenuCover, sort_order: i + 1 }]);
          if (insErr) throw new Error(insErr.message);
        }
      }

      await onSaved();
    } catch (err: any) {
      setError(err?.message || 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border p-6 space-y-6 max-w-3xl" style={{ borderColor: '#e5dcd4' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light" style={{ color: '#3d2817' }}>
          Editing: {form.date}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Cover */}
      <div>
        <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
          Cover photo
        </label>
        <div className="flex items-center gap-4">
          <img src={coverPreview || FALLBACK_IMAGE} alt="Cover" className="w-32 h-24 object-cover border" style={{ borderColor: '#e5dcd4' }} />
          <input type="file" accept="image/*" onChange={handleCoverChange} />
        </div>
      </div>

      {/* Title / Description */}
      <div>
        <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
          Title
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full border px-4 py-2"
          style={{ borderColor: '#e5dcd4' }}
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full border px-4 py-2 text-sm"
          style={{ borderColor: '#e5dcd4' }}
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
          "In this class, you will learn" (one bullet per line)
        </label>
        <textarea
          value={form.learning}
          onChange={(e) => setForm((prev) => ({ ...prev, learning: e.target.value }))}
          rows={4}
          className="w-full border px-4 py-2 text-sm"
          style={{ borderColor: '#e5dcd4' }}
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
          "What you'll experience"
        </label>
        <textarea
          value={form.experience}
          onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
          rows={3}
          className="w-full border px-4 py-2 text-sm"
          style={{ borderColor: '#e5dcd4' }}
        />
      </div>

      {/* Price / VAT / Hours / Capacity */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
            Price (excl. VAT)
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
            className="w-full border px-3 py-2"
            style={{ borderColor: '#e5dcd4' }}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
            VAT
          </label>
          <input
            type="number"
            value={form.vat}
            onChange={(e) => setForm((prev) => ({ ...prev, vat: Number(e.target.value) }))}
            className="w-full border px-3 py-2"
            style={{ borderColor: '#e5dcd4' }}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
            Hours
          </label>
          <input
            type="number"
            step="0.5"
            value={form.hours}
            onChange={(e) => setForm((prev) => ({ ...prev, hours: Number(e.target.value) }))}
            className="w-full border px-3 py-2"
            style={{ borderColor: '#e5dcd4' }}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#8b6f47' }}>
            Capacity
          </label>
          <input
            type="number"
            value={form.max_capacity}
            onChange={(e) => setForm((prev) => ({ ...prev, max_capacity: Number(e.target.value) }))}
            className="w-full border px-3 py-2"
            style={{ borderColor: '#e5dcd4' }}
          />
        </div>
      </div>
      <p className="text-xs -mt-3" style={{ color: '#b6a188' }}>
        Price/VAT/Hours apply to every day sharing this course type ({form.type_name}).
      </p>

      {/* Time slots */}
      <div>
        <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: '#8b6f47' }}>
          Time slots
        </label>
        <div className="space-y-2">
          {form.slots.map((slot) => (
            <div key={slot.id} className="flex flex-col md:flex-row gap-2 border p-3" style={{ borderColor: '#f1e6db' }}>
              <input
                type="text"
                value={slot.slot_name}
                onChange={(e) => updateSlot(slot.id, 'slot_name', e.target.value)}
                className="flex-1 border px-3 py-2 text-sm"
                style={{ borderColor: '#e5dcd4' }}
                placeholder="Section name / dish"
              />
              <input
                type="time"
                value={slot.start_time.slice(0, 5)}
                onChange={(e) => updateSlot(slot.id, 'start_time', `${e.target.value}:00`)}
                className="border px-3 py-2 text-sm"
                style={{ borderColor: '#e5dcd4' }}
              />
              <input
                type="time"
                value={slot.end_time.slice(0, 5)}
                onChange={(e) => updateSlot(slot.id, 'end_time', `${e.target.value}:00`)}
                className="border px-3 py-2 text-sm"
                style={{ borderColor: '#e5dcd4' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Menu / dish photos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs uppercase tracking-wide" style={{ color: '#8b6f47' }}>
            Menu / dish photos
          </label>
          <button
            type="button"
            onClick={addMenuItem}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 border"
            style={{ borderColor: '#e5dcd4', color: '#3d2817' }}
          >
            <Plus size={14} /> Add dish
          </button>
        </div>
        <div className="space-y-2">
          {form.menu.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 border p-3" style={{ borderColor: '#f1e6db' }}>
              <img
                src={item.cover || FALLBACK_IMAGE}
                alt={item.name}
                className="w-14 h-14 object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateMenuName(item.id, e.target.value)}
                placeholder="Dish name"
                className="flex-1 border px-3 py-2 text-sm"
                style={{ borderColor: '#e5dcd4' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMenuImageChange(item.id, e)}
                className="text-xs w-40"
              />
              <button
                onClick={() => moveMenuItem(index, 'up')}
                disabled={index === 0}
                className="p-1.5 border disabled:opacity-30"
                style={{ borderColor: '#f1e6db' }}
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => moveMenuItem(index, 'down')}
                disabled={index === form.menu.length - 1}
                className="p-1.5 border disabled:opacity-30"
                style={{ borderColor: '#f1e6db' }}
              >
                <ArrowDown size={14} />
              </button>
              <button
                onClick={() => removeMenuItem(item.id)}
                className="p-1.5 border text-red-600"
                style={{ borderColor: '#f1e6db' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border" style={{ backgroundColor: '#e5dcd4', color: '#3d2817' }}>
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 px-4 py-2 text-sm text-white inline-flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: '#3d2817' }}
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          Save
        </button>
      </div>
    </div>
  );
}
