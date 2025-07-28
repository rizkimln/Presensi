'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, LogIn, UserPlus, User, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminToken')) {
      router.replace('/');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', 'true');
        localStorage.setItem('adminId', data.adminId);
        router.replace('/');
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy-100 rounded-full opacity-20"></div>
      </div>
      <div className="relative w-full max-w-md mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Login Admin</h1>
          <p className="text-sm sm:text-base text-slate-600">Masuk ke sistem presensi karyawan</p>
        </div>
        <Card className="bg-white shadow-xl border-0 rounded-2xl backdrop-blur-sm mx-4 sm:mx-0">
          <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 text-center">Selamat Datang</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username admin"
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-11 sm:h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-green-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password"
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-11 sm:h-12 pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3 h-11 sm:h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
