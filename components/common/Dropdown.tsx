'use client';

import { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function Dropdown({ 
  options, 
  value, 
  onChange, 
  label,
  className = '' 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-400 shrink-0">{label}</span>}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-surface-dark border border-surface-highlight rounded-lg text-sm font-medium py-2 pl-3 pr-8 hover:border-primary/50 transition-colors min-w-[180px]"
        >
          {selectedOption.icon && (
            <span className="material-symbols-outlined text-lg text-primary">{selectedOption.icon}</span>
          )}
          <span className="flex-1 text-left">{selectedOption.label}</span>
          <span className={`material-symbols-outlined text-lg text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-full min-w-[220px] bg-surface-dark border border-surface-highlight rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  value === option.value
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-300 hover:bg-surface-highlight'
                }`}
              >
                {option.icon && (
                  <span className="material-symbols-outlined text-lg">{option.icon}</span>
                )}
                <span className="flex-1 text-left">{option.label}</span>
                {value === option.value && (
                  <span className="material-symbols-outlined text-lg text-primary">check</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
