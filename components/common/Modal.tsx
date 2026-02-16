import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`bg-gray-900 border border-primary/20 rounded-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="sticky top-0 bg-gray-900 border-b border-primary/10 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 bg-gray-900 border-t border-primary/10 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
