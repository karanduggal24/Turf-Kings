'use client';

interface DateOption {
  day: string;
  date: number;
  fullDate: string;
}

interface DatePickerProps {
  dates: DateOption[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DatePicker({ dates, selectedDate, onDateChange }: DatePickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
          Select Date
        </h4>
        <span className="text-xs font-bold text-primary">
          {new Date(selectedDate || dates[0]?.fullDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {dates.map((d) => (
          <button
            key={d.fullDate}
            onClick={() => onDateChange(d.fullDate)}
            className={`shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 transition-all ${
              selectedDate === d.fullDate
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-white/10 hover:border-primary/50 text-gray-400'
            }`}
          >
            <span className="text-xs font-bold uppercase">{d.day}</span>
            <span className="text-2xl font-black">{d.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
