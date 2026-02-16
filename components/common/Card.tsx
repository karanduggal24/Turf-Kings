import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClass = hover ? 'hover:border-primary/30 cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white/5 border border-primary/10 rounded-xl ${paddingClasses[padding]} ${hoverClass} ${clickableClass} transition-all ${className}`}
    >
      {children}
    </div>
  );
}
