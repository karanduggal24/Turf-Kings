'use client';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
      });
    }
    return days;
  };

  const days = getNextDays();

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
        Select Date
      </h4>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <button
            key={day.fullDate}
            onClick={() => onDateChange(day.fullDate)}
            className={`p-3 rounded-lg border text-center transition-all ${
              selectedDate === day.fullDate
                ? 'bg-primary border-primary text-black'
                : 'bg-surface-dark border-surface-highlight text-gray-300 hover:border-primary'
            }`}
          >
            <div className="text-xs font-medium mb-1">{day.day}</div>
            <div className="text-lg font-bold">{day.date}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
