interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  icon?: string;
  className?: string;
}

export default function Checkbox({ 
  checked, 
  onChange, 
  label, 
  icon,
  className = '' 
}: CheckboxProps) {
  return (
    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
      checked
        ? 'bg-primary/10 border-primary'
        : 'bg-surface-dark border-surface-highlight hover:border-primary/50'
    } ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          checked
            ? 'bg-primary border-primary'
            : 'border-surface-highlight bg-transparent'
        }`}>
          {checked && (
            <span className="material-symbols-outlined text-sm text-background">check</span>
          )}
        </div>
      </div>
      {icon && <span className="material-symbols-outlined text-xl">{icon}</span>}
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
