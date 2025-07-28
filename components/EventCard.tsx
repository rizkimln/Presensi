'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, QrCode, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus acara ini?')) return;
    const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Gagal menghapus acara.');
    }
  };

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-xl">
      <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-800 leading-tight line-clamp-2">{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-3">
          <div className="flex items-start text-slate-600">
            <CalendarDays className="w-4 h-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm leading-relaxed">{formatDate(event.date, event.time)}</span>
          </div>
          <div className="flex items-start text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm leading-relaxed">{event.location}</span>
          </div>
          {/* <div className="flex items-center text-slate-600">
            <Users className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
            <Badge variant="secondary" className="text-xs">
              {event.attendeeCount} peserta
            </Badge>
          </div> */}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link href={`/event/${event.id}/qr`}>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent h-9 sm:h-10">
              <QrCode className="w-4 h-4 mr-2" />
              <span className="text-xs sm:text-sm">Lihat QR Code</span>
            </Button>
          </Link>
          <Link href={`/event/${event.id}/attendees`}>
            <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-colors bg-transparent h-9 sm:h-10">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-xs sm:text-sm">Lihat Kehadiran</span>
            </Button>
          </Link>
          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors bg-transparent h-9 sm:h-10" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            <span className="text-xs sm:text-sm">Hapus Acara</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
