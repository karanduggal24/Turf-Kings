interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-primary/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary/30 focus:outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      )}
    </div>
  );
}
