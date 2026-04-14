'use client';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0],
    };
  });

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
        Select Date
      </h4>
      {/* Scrollable on mobile, grid on desktop */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-7">
        {days.map(day => (
          <button
            key={day.fullDate}
            onClick={() => onDateChange(day.fullDate)}
            className={`shrink-0 w-14 sm:w-auto p-2.5 rounded-xl border text-center transition-all active:scale-95 ${
              selectedDate === day.fullDate
                ? 'bg-primary border-primary text-black'
                : 'bg-surface-dark border-surface-highlight text-gray-300 hover:border-primary'
            }`}
          >
            <div className="text-xs font-medium mb-1">{day.day}</div>
            <div className="text-base font-bold">{day.date}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
