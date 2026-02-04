'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DateSelectorProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select Date",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (isOpen && dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input Field */}
      <div 
        className={`flex items-center h-12 md:h-14 px-4 cursor-pointer transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-highlight'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="material-symbols-outlined text-primary mr-3">calendar_today</span>
        <span className={`flex-1 text-sm md:text-base ${
          selectedDate ? 'text-white' : 'text-gray-400'
        }`}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}>
          expand_more
        </span>
      </div>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-surface-dark border border-surface-highlight rounded-xl shadow-2xl z-[99999] overflow-hidden neon-glow no-zoom"
          style={{ touchAction: 'none' }}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-highlight">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-surface-highlight rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-primary">chevron_left</span>
            </button>
            
            <h3 className="text-white font-semibold text-lg">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-surface-highlight rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-primary">chevron_right</span>
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 p-2 border-b border-surface-highlight">
            {weekDays.map(day => (
              <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {days.map((date, index) => (
              <div key={index} className="aspect-square">
                {date && (
                  <button
                    onClick={() => handleDateSelect(date)}
                    disabled={isPastDate(date)}
                    className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${
                      isPastDate(date)
                        ? 'text-gray-600 cursor-not-allowed'
                        : isSelected(date)
                        ? 'bg-primary text-black font-bold shadow-lg'
                        : isToday(date)
                        ? 'bg-primary/20 text-primary border border-primary'
                        : 'text-white hover:bg-surface-highlight hover:text-primary'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-surface-highlight">
            <button
              onClick={() => {
                const today = new Date();
                handleDateSelect(today);
              }}
              className="w-full py-2 px-4 text-sm text-primary hover:bg-surface-highlight rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;