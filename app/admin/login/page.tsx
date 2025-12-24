'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
// --- 1. เพิ่ม Import จาก Supabase และ Next.js ---
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // --- 2. ประกาศใช้งาน Hooks ---
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      // --- 3. เรียกใช้งาน Supabase Auth ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // ถ้า Login ไม่ผ่าน (เช่น รหัสผิด หรือไม่มี User นี้)
        alert(error.message);
      } else {
        // --- 4. ถ้าผ่าน ให้พาไปหน้า Admin ---
        // ใช้ router.push และ refresh เพื่อให้ Middleware อัปเดตสถานะการเข้าถึง
        router.push('/admin/dashboard'); 
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F6EFE7' }}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <img src={'/logo-nb.png'} style={{ width: '200px' }} alt="Logo" />
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-lg p-8" style={{ backgroundColor: '#fffaf4', borderTop: '3px solid #3d2817' }}>
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wide mb-2" style={{ color: '#8b6f47' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full border pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: '#e5dcd4', 
                    backgroundColor: '#fff',
                    color: '#3d2817'
                  }}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wide mb-2" style={{ color: '#8b6f47' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#b29373' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full border pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: '#e5dcd4', 
                    backgroundColor: '#fff',
                    color: '#3d2817'
                  }}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#b29373' }}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border mr-2 cursor-pointer"
                  style={{ borderColor: '#e5dcd4', accentColor: '#3d2817' }}
                  disabled={loading}
                />
                <span style={{ color: '#7a5f3d' }}>Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-3 text-white font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#3d2817' }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}