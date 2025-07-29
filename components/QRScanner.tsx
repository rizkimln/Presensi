'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

interface QRScannerProps {
  eventId: string | string[];
  eventName: string;
  attendanceUrl: string;
}

export default function QRScanner({ eventId, eventName, attendanceUrl }: QRScannerProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadQR = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current);
      const link = document.createElement('a');
      link.download = `qr-code-event-${eventId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(attendanceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-lg border-0 rounded-xl">
        <CardHeader className="text-center pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800">Scan kode QR ini untuk melakukan presensi kehadiran</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 px-4 sm:px-6 pb-6">
          <div className="flex justify-center">
            <div ref={qrRef} className="w-fit p-4 bg-white border-2 border-slate-200 rounded-xl shadow-inner">
              <QRCodeCanvas value={attendanceUrl} size={256} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button onClick={handleDownloadQR} className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-11 sm:h-12 text-sm sm:text-base">
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
            <Button onClick={handleCopyUrl} variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent h-11 sm:h-12 text-sm sm:text-base">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-slate-600 mb-2">Link presensi:</p>
            <code className="text-xs sm:text-sm text-slate-800 bg-white px-3 py-2 rounded border break-all block">{attendanceUrl}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
