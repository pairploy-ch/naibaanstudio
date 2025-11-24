'use client';

import React, { useState } from 'react';
import { Menu, X, LogOut, BarChart3, Users, BookOpen, Settings } from 'lucide-react';

interface MenuItem {
  label: string;
  value: 'courses' | 'courselist' | 'students' | 'settings';
  icon: React.ReactNode;
}

export default function SidebarOnly() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<'courses' | 'courselist' | 'students' | 'settings'>('courses');

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', value: 'courses', icon: <BarChart3 size={20} /> },
    { label: 'Courses', value: 'courselist', icon: <BookOpen size={20} /> },
    { label: 'Students', value: 'students', icon: <Users size={20} /> },
    { label: 'Settings', value: 'settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col shadow-lg h-screen flex-shrink-0`} style={{ backgroundColor: '#3d2817' }}>
      <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: '#5c3d2e' }}>
        {sidebarOpen && <h1 className="text-2xl font-light" style={{ color: '#d4a574' }}>Nal Baan</h1>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:opacity-80">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setCurrentPage(item.value)}
            className={`w-full text-left p-4 rounded-lg transition-all ${
              currentPage === item.value
                ? 'text-white'
                : 'text-amber-100 hover:text-white'
            }`}
            style={{
              backgroundColor: currentPage === item.value ? '#5c3d2e' : 'transparent'
            }}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          </button>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="p-4" style={{ borderTop: '1px solid #5c3d2e' }}>
          <button className="w-full flex items-center gap-2 text-amber-100 hover:text-white text-sm transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}