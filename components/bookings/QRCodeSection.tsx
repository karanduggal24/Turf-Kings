import { QRCodeSectionProps, generateQRCode } from './booking-types';

export default function QRCodeSection({ bookingId }: QRCodeSectionProps) {
  return (
    <section className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center print-section print-break-avoid">
      <p className="text-sm font-bold text-white mb-4 print-text">YOUR ENTRY PASS</p>
      <div className="bg-white p-4 rounded-lg inline-block mb-4">
        <img
          src={generateQRCode(bookingId)}
          alt="QR Code"
          className="w-40 h-40"
        />
      </div>
      <p className="text-xs text-gray-400 px-4 print-text-gray">
        Scan this QR code at the entrance for hassle-free check-in.
      </p>
    </section>
  );
}
