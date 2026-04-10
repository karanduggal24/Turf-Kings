'use client';

import { QRCodeSVG } from 'qrcode.react';
import { QRCodeSectionProps } from './booking-types';

export default function QRCodeSection({ bookingId }: QRCodeSectionProps) {
  return (
    <section className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center print-section print-break-avoid">
      <p className="text-sm font-bold text-white mb-4 print-text">YOUR ENTRY PASS</p>
      <div className="bg-white p-4 rounded-lg inline-block mb-4">
        <QRCodeSVG
          value={bookingId}
          size={160}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
        />
      </div>
      <p className="text-xs text-gray-400 px-4 print-text-gray">
        Scan this QR code at the entrance for hassle-free check-in.
      </p>
    </section>
  );
}
