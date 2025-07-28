'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Calendar, MapPin, FileText, Clock, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CustomField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export default function AddEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
    description: '',
  });
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: '1', label: 'Nama Lengkap', type: 'text', required: true },
    { id: '2', label: 'NIP', type: 'text', required: true },
    { id: '3', label: 'Email', type: 'email', required: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          date: formData.date,
          start_time: formData.time,
          end_time: formData.time, // Atur sesuai kebutuhan, bisa tambahkan field end_time di form jika perlu
          location: formData.location,
          form_fields: customFields,
          created_by: localStorage.getItem('adminId') || null,
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        alert('Gagal menambah acara');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false,
    };
    setCustomFields([...customFields, newField]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map((field) => (field.id === id ? { ...field, ...updates } : field)));
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Tambah Acara Baru</h1>
          <p className="text-sm sm:text-base text-slate-600">Buat acara baru dan generate QR code untuk presensi</p>
        </div>

        {/* Form Container */}
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details Card */}
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800">Detail Acara</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Event Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                      Nama Acara
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama acara"
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-11 sm:h-12"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-slate-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-500" />
                      Lokasi
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Masukkan lokasi acara"
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-11 sm:h-12"
                      required
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium text-slate-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        Tanggal
                      </Label>
                      <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-11 sm:h-12" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-medium text-slate-700 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        Waktu
                      </Label>
                      <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-11 sm:h-12" required />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                      Deskripsi Acara
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Masukkan deskripsi acara (opsional)"
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg min-h-[80px] sm:min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Form Fields Card */}
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800">Form Presensi Kustom</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">Kustomisasi field yang akan diisi oleh peserta saat melakukan presensi</p>
                  </div>
                  <Button type="button" onClick={addCustomField} variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-6">
                <div className="space-y-4">
                  {customFields.map((field, index) => (
                    <div key={field.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-slate-700">Field {index + 1}</h4>
                        {customFields.length > 1 && (
                          <Button type="button" onClick={() => removeCustomField(field.id)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Field Label */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Label Field</Label>
                          <Input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                            placeholder="Contoh: Nama Lengkap, NIP, Email"
                            className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-10 sm:h-11"
                            required
                          />
                        </div>

                        {/* Field Type */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Tipe Input</Label>
                          <Select value={field.type} onValueChange={(value) => updateCustomField(field.id, { type: value })}>
                            <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg h-10 sm:h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Required Toggle */}
                      <div className="flex items-center space-x-2">
                        <Switch id={`required-${field.id}`} checked={field.required} onCheckedChange={(checked) => updateCustomField(field.id, { required: checked })} />
                        <Label htmlFor={`required-${field.id}`} className="text-sm text-slate-700">
                          Field wajib diisi
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-navy-600 hover:bg-navy-700 text-white py-3 h-11 sm:h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
                {isSubmitting ? 'Membuat Acara...' : 'Buat Acara'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
