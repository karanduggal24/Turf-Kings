import { BookingHeaderProps } from './booking-types';

export default function BookingHeader({ turfName }: BookingHeaderProps) {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 text-primary mb-6 shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined text-5xl print-primary">check_circle</span>
      </div>
      <h1 className="text-4xl font-black tracking-tight mb-2 text-white print-text">Game On!</h1>
      <p className="text-gray-400 text-lg print-text-gray">Your booking at {turfName} is confirmed.</p>
    </header>
  );
}
