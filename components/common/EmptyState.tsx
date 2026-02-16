interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`bg-white/5 border border-primary/10 rounded-xl p-12 text-center ${className}`}>
      <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">
        {icon}
      </span>
      <p className="text-gray-400 text-lg font-bold mb-2">{title}</p>
      {description && (
        <p className="text-gray-500 text-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
