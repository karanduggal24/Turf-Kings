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
  placeholder?: string;
  className?: string;
  /** "menu" = floating panel (sort controls). "select" = full-width form field. Default: "menu" */
  variant?: 'menu' | 'select';
  error?: string;
  /** Override the z-index of the dropdown panel. Default: 50 */
  zIndex?: number;
}

export default function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder,
  className = '',
  variant = 'menu',
  error,
  zIndex = 50,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // ─── Select variant (form field style) ───────────────────────────────────────
  if (variant === 'select') {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-sm font-bold text-gray-200">
            {label}
          </label>
        )}
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-black/40 border text-left transition-all outline-none ${
              error
                ? 'border-red-500 ring-1 ring-red-500/30'
                : isOpen
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-primary/20 hover:border-primary/40'
            }`}
          >
            {selectedOption?.icon && (
              <span className="material-symbols-outlined text-lg text-primary shrink-0">
                {selectedOption.icon}
              </span>
            )}
            <span className={`flex-1 text-sm ${selectedOption ? 'text-white' : 'text-gray-500'}`}>
              {selectedOption?.label ?? placeholder ?? 'Select...'}
            </span>
            <span className={`material-symbols-outlined text-lg text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {isOpen && (
            <div
              className="absolute left-0 right-0 mt-1 bg-surface-dark border border-primary/20 rounded-lg shadow-xl overflow-hidden"
              style={{ zIndex }}
            >
              {options.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    value === option.value
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-300 hover:bg-surface-highlight'
                  }`}
                >
                  {option.icon && (
                    <span className="material-symbols-outlined text-lg shrink-0">{option.icon}</span>
                  )}
                  <span className="flex-1 text-left">{option.label}</span>
                  {value === option.value && (
                    <span className="material-symbols-outlined text-base text-primary shrink-0">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1 text-red-400 text-xs">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}
      </div>
    );
  }

  // ─── Menu variant (sort / filter controls) ────────────────────────────────────
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-400 shrink-0">{label}</span>}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-surface-dark border border-surface-highlight rounded-lg text-sm font-medium py-2 pl-3 pr-8 hover:border-primary/50 transition-colors min-w-[180px]"
        >
          {selectedOption?.icon && (
            <span className="material-symbols-outlined text-lg text-primary">{selectedOption.icon}</span>
          )}
          <span className="flex-1 text-left">{selectedOption?.label ?? placeholder ?? 'Select...'}</span>
          <span className={`material-symbols-outlined text-lg text-gray-400 transition-transform absolute right-2 ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-full min-w-[220px] bg-surface-dark border border-surface-highlight rounded-lg shadow-xl overflow-hidden"
            style={{ zIndex }}
          >
            {options.map(option => (
              <button
                key={option.value}
                type="button"
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
