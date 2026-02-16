interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    default: 'bg-primary/10 text-primary border-primary/20',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-1',
    md: 'text-xs px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded font-bold uppercase tracking-wider border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
