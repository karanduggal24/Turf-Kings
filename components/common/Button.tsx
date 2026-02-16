import { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-black',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-white/5 text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={(e) => onClick?.(e)}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {loading ? (
        <>
          <span className="animate-spin">⚡</span>
          Processing...
        </>
      ) : (
        <>
          {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
