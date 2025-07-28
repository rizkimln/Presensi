'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, LogOut, Search } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.replace('/login');
      } else {
        setIsLoggedIn(true);
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events/list');
      const data = await res.json();
      if (data.events) {
        setEvents(
          data.events.map((e: any) => ({
            id: e.id,
            name: e.name,
            date: e.date,
            time: e.start_time,
            location: e.location,
            attendeeCount: e.attendances_count || e.attendeeCount || 0,
          }))
        );
      }
    };
    if (isLoggedIn) fetchEvents();
  }, [isLoggedIn]);

  const filteredEvents = events.filter((event) => event.name.toLowerCase().includes(search.toLowerCase()));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminId');
    router.replace('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#f7fafd] px-4 sm:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Dashboard Presensi</h1>
            <p className="text-slate-600 text-base">Kelola acara dan pantau kehadiran karyawan</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button className="bg-[#4f46e5] hover:bg-[#3730a3] text-white font-semibold shadow-md" onClick={() => router.push('/add-event')}>
              {' '}
              <Plus className="w-4 h-4 mr-2" />
              Tambah Acara Baru
            </Button>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 ml-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
        <div className="mb-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input type="text" placeholder="Cari acara berdasarkan nama..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-12 h-12 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-blue-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Daftar Acara</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? <div className="col-span-full text-center text-slate-500 py-12">Tidak ada acara ditemukan.</div> : filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      </div>
    </div>
  );
}
