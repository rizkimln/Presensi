'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import QRScanner from '@/components/QRScanner';

export default function EventQRCode() {
  const params = useParams();
  const eventId = String(params.id);
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();
        if (data.event) {
          setEvent(data.event);
        } else {
          setEvent(null);
        }
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const attendanceUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/attendance/${eventId}`;

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">QR Code Presensi</h1>
          <p className="text-sm sm:text-base text-slate-600">QR Code untuk acara presensi karyawan</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-md border-0 rounded-xl mb-8">
            <CardContent className="p-4 sm:p-6">
              {loading ? (
                <div className="text-slate-500">Memuat data event...</div>
              ) : event ? (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">{event.name}</h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm sm:text-base">{formatDateTime(event.date, event.start_time)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm sm:text-base">{event.location}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-red-500">Event tidak ditemukan.</div>
              )}
            </CardContent>
          </Card>
          {/* QR Code Scanner Component */}
          {event && <QRScanner eventId={eventId} eventName={event.name} attendanceUrl={attendanceUrl} />}
        </div>
      </div>
    </div>
  );
}
