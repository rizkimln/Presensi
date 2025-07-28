'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AttendanceTable from '@/components/AttendanceTable';

// Mock attendee data
const mockAttendees = [
  {
    id: 1,
    name: 'Ahmad Rizki Pratama',
    nip: 'EMP001',
    email: 'ahmad.rizki@company.com',
    timestamp: '2024-02-15T08:45:00',
  },
  {
    id: 2,
    name: 'Sari Dewi Lestari',
    nip: 'EMP002',
    email: 'sari.dewi@company.com',
    timestamp: '2024-02-15T08:52:00',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    nip: 'EMP003',
    email: 'budi.santoso@company.com',
    timestamp: '2024-02-15T09:01:00',
  },
  {
    id: 4,
    name: 'Maya Indira Sari',
    nip: 'EMP004',
    email: 'maya.indira@company.com',
    timestamp: '2024-02-15T09:05:00',
  },
  {
    id: 5,
    name: 'Rendra Wijaya',
    nip: 'EMP005',
    email: 'rendra.wijaya@company.com',
    timestamp: '2024-02-15T09:12:00',
  },
];

export default function AttendeesList() {
  const params = useParams();
  const eventId = params.id;

  const [searchTerm, setSearchTerm] = useState('');
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/attendance/${eventId}`);
        const data = await res.json();
        if (data.attendances) {
          setAttendees(
            data.attendances.map((a: any, idx: number) => ({
              id: a.id || idx,
              name: a.employee_name,
              nip: a.form_responses?.nip || '-',
              email: a.employee_email,
              timestamp: a.scan_time || a.created_at || '',
            }))
          );
        } else {
          setAttendees([]);
        }
      } catch {
        setAttendees([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();
        if (data.event) setEvent(data.event);
        else setEvent(null);
      } catch {
        setEvent(null);
      }
    };
    fetchAttendances();
    fetchEvent();
  }, [eventId]);

  // Mock event data
  // const event = {
  //   id: eventId,
  //   name: 'Workshop Digital Marketing 2024',
  //   date: '2024-02-15',
  //   time: '09:00',
  //   location: 'Ruang Seminar A, Lantai 3',
  // };

  const filteredAttendees = attendees.filter(
    (attendee) => attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) || attendee.nip.toLowerCase().includes(searchTerm.toLowerCase()) || attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExportCSV = () => {
    const csvContent = [['Nama', 'NIP', 'Email', 'Waktu Presensi'], ...filteredAttendees.map((attendee) => [attendee.name, attendee.nip, attendee.email, formatTimestamp(attendee.timestamp)])].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kehadiran-${event ? event.name.replace(/\s+/g, '-').toLowerCase() : 'event'}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Data Kehadiran</h1>
          <p className="text-sm sm:text-base text-slate-600">Daftar peserta yang telah melakukan presensi</p>
        </div>

        {/* Event Info */}
        <div className="mb-6 sm:mb-8">
          <Card className="bg-white shadow-md border-0 rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{event ? event.name : '-'}</h2>
                  <div className="space-y-1">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-xs sm:text-sm">{event ? formatDateTime(event.date, event.start_time) : '-'}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-xs sm:text-sm">{event ? event.location : '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="lg:mt-0">
                  <Badge variant="secondary" className="flex items-center w-fit">
                    <Users className="w-4 h-4 mr-1" />
                    {attendees.length} peserta hadir
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table Component */}
        {loading ? <div className="text-center py-12 text-slate-500">Memuat data kehadiran...</div> : <AttendanceTable attendees={filteredAttendees} eventName={event ? event.name : ''} />}
      </div>
    </div>
  );
}
