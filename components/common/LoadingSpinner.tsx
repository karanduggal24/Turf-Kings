interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <span className={`animate-spin ${sizeClasses[size]}`}>⚡</span>
      {text && <p className="text-gray-400">{text}</p>}
    </div>
  );
}
