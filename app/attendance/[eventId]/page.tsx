'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AttendanceForm() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;
  const [form, setForm] = useState({
    name: '',
    nip: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkDuplicate = async () => {
    setChecking(true);
    try {
      const res = await fetch(`/api/attendance/${eventId}`);
      const data = await res.json();
      if (data.attendances) {
        return data.attendances.some((a: any) => a.employee_email === form.email || a.employee_phone === form.phone || (a.form_responses && a.form_responses.nip === form.nip));
      }
      return false;
    } catch {
      return false;
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    // Cek duplikat
    const isDuplicate = await checkDuplicate();
    if (isDuplicate) {
      setError('Data dengan email, NIP, atau no HP ini sudah pernah presensi untuk acara ini. Silakan gunakan data lain.');
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch('/api/attendance/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          employee_name: form.name,
          employee_email: form.email,
          employee_phone: form.phone,
          form_responses: { nip: form.nip },
        }),
      });
      if (res.ok) {
        setSuccess('Presensi berhasil! Terima kasih sudah mengisi kehadiran.');
        setForm({ name: '', nip: '', email: '', phone: '' });
      } else {
        setError('Gagal mengirim presensi. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-white shadow-xl border-0 rounded-2xl">
          <CardHeader className="text-center pb-6 px-6 pt-8">
            <CardTitle className="text-2xl font-bold text-slate-800 mb-2">Form Presensi</CardTitle>
            <p className="text-slate-600 text-sm">Silakan isi data kehadiran Anda</p>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            {success && (
              <Alert className="border-green-200 bg-green-50 mb-4">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="border-red-200 bg-red-50 mb-4">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" name="nip" value={form.nip} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">No. HP</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3 h-11 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Presensi'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
