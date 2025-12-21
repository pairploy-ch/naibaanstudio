'use client';

export interface MenuItem {
  id: string;
  name_th: string;
  name_en?: string;
  image_url?: string;
  description?: string;
  price?: number;
  tag?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// For backward compatibility with existing code
export interface MenuItemLegacy {
  id: string;
  nameTh: string;
  nameEn?: string;
  imageUrl?: string;
  description?: string;
}

// Converter functions
export const toMenuItemLegacy = (item: MenuItem): MenuItemLegacy => ({
  id: item.id,
  nameTh: item.name_th,
  nameEn: item.name_en,
  imageUrl: item.image_url,
  description: item.description,
});

export const toMenuItem = (item: MenuItemLegacy): Partial<MenuItem> => ({
  name_th: item.nameTh,
  name_en: item.nameEn,
  image_url: item.imageUrl,
  description: item.description,
});