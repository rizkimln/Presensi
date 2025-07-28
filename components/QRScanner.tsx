"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Copy, Check } from "lucide-react"
import { useState } from "react"

interface QRScannerProps {
  eventId: string | string[]
  eventName: string
  attendanceUrl: string
}

export default function QRScanner({ eventId, eventName, attendanceUrl }: QRScannerProps) {
  const [copied, setCopied] = useState(false)

  const handleDownloadQR = () => {
    // In a real app, this would generate and download the actual QR code
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 300
    canvas.height = 300

    if (ctx) {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 300, 300)
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("QR Code", 150, 150)
    }

    const link = document.createElement("a")
    link.download = `qr-code-event-${eventId}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(attendanceUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-lg border-0 rounded-xl">
        <CardHeader className="text-center pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800">
            Scan kode QR ini untuk melakukan presensi kehadiran
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 px-4 sm:px-6 pb-6">
          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center shadow-inner">
              <div className="text-center">
                <QrCode className="w-32 h-32 sm:w-40 sm:h-40 mx-auto text-slate-400 mb-4" />
                <div className="text-sm text-slate-500 font-mono break-all px-4">QR Code untuk Event #{eventId}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button
              onClick={handleDownloadQR}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-11 sm:h-12 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent h-11 sm:h-12 text-sm sm:text-base"
            >
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

          {/* URL Display */}
          <div className="bg-slate-50 p-4 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-slate-600 mb-2">Link presensi:</p>
            <code className="text-xs sm:text-sm text-slate-800 bg-white px-3 py-2 rounded border break-all block">
              {attendanceUrl}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
