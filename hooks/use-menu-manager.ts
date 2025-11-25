'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultMenus } from '@/data/default-menus';
import { MenuItem } from '@/types/menu';

const STORAGE_KEY = 'thai-cooking-admin-menus';

const persistMenus = (menus: MenuItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
};

const safeParse = (value: string | null): MenuItem[] | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as MenuItem[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.warn('Failed to parse menu storage', error);
    return null;
  }
};

export function useMenuManager() {
  const [menus, setMenus] = useState<MenuItem[]>(defaultMenus);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = safeParse(window.localStorage.getItem(STORAGE_KEY));
    if (stored && stored.length) {
      setMenus(stored);
    } else {
      persistMenus(defaultMenus);
    }
    setIsLoaded(true);
  }, []);

  const updateMenus = useCallback((updater: (current: MenuItem[]) => MenuItem[]) => {
    setMenus((current) => {
      const next = updater(current);
      persistMenus(next);
      return next;
    });
  }, []);

  const addMenu = useCallback((menu: Omit<MenuItem, 'id'>) => {
    updateMenus((current) => [
      ...current,
      {
        ...menu,
        id: crypto.randomUUID()
      }
    ]);
  }, [updateMenus]);

  const updateMenu = useCallback((id: string, menu: Partial<MenuItem>) => {
    updateMenus((current) =>
      current.map((item) => (item.id === id ? { ...item, ...menu } : item))
    );
  }, [updateMenus]);

  const deleteMenu = useCallback((id: string) => {
    updateMenus((current) => current.filter((item) => item.id !== id));
  }, [updateMenus]);

  const resetMenus = useCallback(() => {
    setMenus(defaultMenus);
    persistMenus(defaultMenus);
  }, []);

  const menuMap = useMemo(() => {
    const map = new Map<string, MenuItem>();
    menus.forEach((menu) => map.set(menu.id, menu));
    return map;
  }, [menus]);

  return {
    menus,
    menuMap,
    isLoaded,
    addMenu,
    updateMenu,
    deleteMenu,
    resetMenus
  };
}


