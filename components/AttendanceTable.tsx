'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Users } from 'lucide-react';

interface Attendee {
  id: number;
  name: string;
  nip: string;
  email: string;
  timestamp: string;
}

interface AttendanceTableProps {
  attendees: Attendee[];
  eventName: string;
}

export default function AttendanceTable({ attendees, eventName }: AttendanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);

  // Add useEffect to detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const filteredAttendees = attendees.filter(
    (attendee) => attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) || attendee.nip.toLowerCase().includes(searchTerm.toLowerCase()) || attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    link.download = `kehadiran-${eventName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Cari nama, NIP, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-10 sm:h-11"
          />
        </div>
        <Button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto h-10 sm:h-11">
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Export Data (CSV)</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Table/Cards */}
      <div className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">
            Daftar Kehadiran ({filteredAttendees.length} dari {attendees.length} peserta)
          </h3>
        </div>

        {/* Mobile Card Layout */}
        <div className="block sm:hidden">
          <div className="divide-y divide-slate-100">
            {filteredAttendees.map((attendee, index) => (
              <div key={attendee.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Nama</div>
                    <h4 className="font-medium text-slate-800 text-sm mb-1">{attendee.name}</h4>
                    <div className="text-xs text-slate-500 font-semibold mb-1">NIP</div>
                    <p className="text-xs text-slate-600 mb-1">{attendee.nip}</p>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Email</div>
                    <p className="text-xs text-slate-600">{attendee.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{formatTimestamp(attendee.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-700 text-sm">Nama</TableHead>
                <TableHead className="font-semibold text-slate-700 text-sm">NIP</TableHead>
                <TableHead className="font-semibold text-slate-700 text-sm">Email</TableHead>
                <TableHead className="font-semibold text-slate-700 text-sm">Waktu Presensi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee, index) => (
                <TableRow key={attendee.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <TableCell className="font-medium text-slate-800 py-3 text-sm">{attendee.name}</TableCell>
                  <TableCell className="text-slate-600 text-sm py-3">{attendee.nip}</TableCell>
                  <TableCell className="text-slate-600 text-sm py-3">{attendee.email}</TableCell>
                  <TableCell className="text-slate-600 text-sm py-3">{formatTimestamp(attendee.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAttendees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">{searchTerm ? 'Tidak ada hasil' : 'Belum ada peserta'}</h3>
            <p className="text-slate-500">{searchTerm ? 'Coba ubah kata kunci pencarian Anda' : 'Peserta akan muncul di sini setelah melakukan presensi'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
